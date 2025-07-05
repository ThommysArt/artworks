import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

// Place a bid on an artwork
export const placeBid = mutation({
  args: {
    userId: v.string(),
    artworkId: v.id("artworks"),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) throw new Error("Not authenticated");

    const artwork = await ctx.db.get(args.artworkId);
    if (!artwork) throw new Error("Artwork not found");

    // Check if artwork is available for auction
    if (!artwork.isAuction || artwork.status !== "auction") {
      throw new Error("This artwork is not available for auction");
    }

    // Check if auction has ended
    if (artwork.auctionEndTime && Date.now() > artwork.auctionEndTime) {
      throw new Error("Auction has ended");
    }

    // Check if bid is higher than current bid
    const currentHighestBid = artwork.currentBid || artwork.reservePrice || 0;
    if (args.amount <= currentHighestBid) {
      throw new Error(`Bid must be higher than current bid of $${currentHighestBid}`);
    }

    // Check if user is not the artist
    if (artwork.artistId === userId) {
      throw new Error("Artists cannot bid on their own artworks");
    }

    // Mark previous winning bids as not winning
    const previousBids = await ctx.db
      .query("bids")
      .withIndex("by_artwork", (q) => q.eq("artworkId", args.artworkId))
      .filter((q) => q.eq(q.field("isWinning"), true))
      .collect();

    for (const bid of previousBids) {
      await ctx.db.patch(bid._id, { isWinning: false });
    }

    // Create new bid
    const bidId = await ctx.db.insert("bids", {
      artworkId: args.artworkId,
      bidderId: userId,
      amount: args.amount,
      isWinning: true,
    });

    // Update artwork with new current bid
    await ctx.db.patch(args.artworkId, {
      currentBid: args.amount,
      bidCount: artwork.bidCount + 1,
    });

    // Schedule auction end check if this is close to end time
    if (artwork.auctionEndTime) {
      const timeUntilEnd = artwork.auctionEndTime - Date.now();
      if (timeUntilEnd > 0 && timeUntilEnd < 24 * 60 * 60 * 1000) { // Less than 24 hours
        await ctx.scheduler.runAt(artwork.auctionEndTime, internal.bidding.endAuction, {
          artworkId: args.artworkId,
        });
      }
    }

    return bidId;
  },
});

// Get bids for an artwork
export const getArtworkBids = query({
  args: { artworkId: v.id("artworks") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bids")
      .withIndex("by_artwork", (q) => q.eq("artworkId", args.artworkId))
      .order("desc")
      .collect();
  },
});

// Get user's bids
export const getUserBids = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) return [];

    const bids = await ctx.db
      .query("bids")
      .withIndex("by_bidder", (q) => q.eq("bidderId", userId))
      .order("desc")
      .collect();

    const bidsWithArtworks = await Promise.all(
      bids.map(async (bid) => {
        const artwork = bid.artworkId ? await ctx.db.get(bid.artworkId) : null;
        let imageUrl = null;
        if (artwork && artwork.images.length > 0) {
          imageUrl = await ctx.storage.getUrl(artwork.images[0]);
        }

        return {
          ...bid,
          artwork: artwork ? {
            ...artwork,
            imageUrl,
          } : null,
        };
      })
    );

    return bidsWithArtworks;
  },
});

// Internal function to end auction
export const endAuction = internalMutation({
  args: { artworkId: v.id("artworks") },
  handler: async (ctx, args) => {
    const artwork = await ctx.db.get(args.artworkId);
    if (!artwork || !artwork.isAuction) return;

    // Get winning bid
    const winningBid = await ctx.db
      .query("bids")
      .withIndex("by_artwork", (q) => q.eq("artworkId", args.artworkId))
      .filter((q) => q.eq(q.field("isWinning"), true))
      .first();

    if (winningBid && artwork.currentBid && artwork.currentBid >= (artwork.reservePrice || 0)) {
      // Auction successful - mark as sold
      await ctx.db.patch(args.artworkId, {
        status: "sold",
      });

      // Create order for winning bidder
      await ctx.db.insert("orders", {
        userId: winningBid.bidderId,
        artworkIds: [args.artworkId],
        totalAmount: winningBid.amount,
        status: "pending",
        shippingAddress: {
          name: "",
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        paymentMethod: "pending",
      });
    } else {
      // Reserve not met - mark as available
      await ctx.db.patch(args.artworkId, {
        status: "available",
        isAuction: false,
        auctionEndTime: undefined,
        currentBid: undefined,
      });

      // Mark all bids as not winning
      const allBids = await ctx.db
        .query("bids")
        .withIndex("by_artwork", (q) => q.eq("artworkId", args.artworkId))
        .collect();

      for (const bid of allBids) {
        await ctx.db.patch(bid._id, { isWinning: false });
      }
    }
  },
});

// Get active auctions
export const getActiveAuctions = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const auctions = await ctx.db
      .query("artworks")
      .withIndex("by_status", (q) => q.eq("status", "auction"))
      .filter((q) => q.gt(q.field("auctionEndTime"), now))
      .order("asc")
      .take(args.limit || 20);

    const auctionsWithDetails = await Promise.all(
      auctions.map(async (artwork) => {
        const imageUrls = await Promise.all(
          artwork.images.slice(0, 1).map(async (imageId) => {
            const url = await ctx.storage.getUrl(imageId);
            return url;
          })
        );

        const timeRemaining = artwork.auctionEndTime ? artwork.auctionEndTime - now : 0;

        return {
          ...artwork,
          imageUrls: imageUrls.filter(Boolean),
          timeRemaining,
        };
      })
    );

    return auctionsWithDetails;
  },
});
