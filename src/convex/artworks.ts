import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { query, mutation, internalMutation } from "./_generated/server";

// Get all artworks with pagination and filters
export const getArtworks = query({
  args: {
    category: v.optional(v.string()),
    status: v.optional(v.string()),
    artistId: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let artworks;

    if (args.category) {
      artworks = await ctx.db
        .query("artworks")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .take(args.limit || 20);
    } else if (args.status) {
      artworks = await ctx.db
        .query("artworks")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .order("desc")
        .take(args.limit || 20);
    } else if (args.artistId) {
      artworks = await ctx.db
        .query("artworks")
        .withIndex("by_artist", (q) => q.eq("artistId", args.artistId!))
        .order("desc")
        .take(args.limit || 20);
    } else if (args.featured !== undefined) {
      artworks = await ctx.db
        .query("artworks")
        .withIndex("by_featured", (q) => q.eq("featured", args.featured!))
        .order("desc")
        .take(args.limit || 20);
    } else {
      artworks = await ctx.db.query("artworks").order("desc").take(args.limit || 20);
    }

    return artworks
  },
});

// Search artworks
export const searchArtworks = query({
  args: {
    searchTerm: v.string(),
    category: v.optional(v.string()),
    artistId: v.optional(v.id("users")),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    let searchQuery = ctx.db
      .query("artworks")
      .withSearchIndex("search_artworks", (q) => q.search("title", args.searchTerm));

    if (args.category) {
      searchQuery = searchQuery.filter((q) => q.eq(q.field("category"), args.category));
    }
    if (args.artistId) {
      searchQuery = searchQuery.filter((q) => q.eq(q.field("artistId"), args.artistId));
    }
    if (args.status) {
      searchQuery = searchQuery.filter((q) => q.eq(q.field("status"), args.status));
    }

    return await searchQuery.take(50);
  },
});

// Get single artwork with full details
export const getArtwork = query({
  args: { id: v.id("artworks") },
  handler: async (ctx, args) => {
    const artworkId = args.id as Id<"artworks">;
    const artwork = artworkId ? await ctx.db.get(artworkId) : null;
    if (!artwork) return null;

    const imageUrls = await Promise.all(
      artwork.images.map(async (imageId) => {
        const url = await ctx.storage.getUrl(imageId as Id<"_storage">);
        return url;
      })
    );

    // Get current bids if it's an auction
    const bids: any[] = [];
    if (artwork.isAuction) {
      const artworkBids = await ctx.db
        .query("bids")
        .withIndex("by_artwork", (q) => q.eq("artworkId", args.id))
        .order("desc")
        .take(10);
      bids.push(...artworkBids);
    }

    return {
      ...artwork,
      imageUrls: imageUrls.filter(Boolean),
      bids,
    };
  },
});

// Create artwork (artist only)
export const createArtwork = mutation({
  args: {
    userId: v.string(),
    username: v.string(),
    userAvatar: v.optional(v.string()),
    title: v.string(),
    description: v.string(),
    price: v.number(),
    dimensions: v.object({
      width: v.number(),
      height: v.number(),
      depth: v.optional(v.number()),
      unit: v.string(),
    }),
    medium: v.string(),
    year: v.number(),
    category: v.string(),
    tags: v.array(v.string()),
    images: v.array(v.string()),
    isAuction: v.boolean(),
    auctionDuration: v.optional(v.number()), // hours
    reservePrice: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) throw new Error("Not authenticated");

    const auctionEndTime = args.isAuction && args.auctionDuration
      ? Date.now() + (args.auctionDuration * 60 * 60 * 1000)
      : undefined;

    const artworkId = await ctx.db.insert("artworks", {
      title: args.title,
      description: args.description,
      artistId: userId,
      artistName: args.username,
      artistsAvatar: args.userAvatar,
      price: args.price,
      dimensions: args.dimensions,
      medium: args.medium,
      year: args.year,
      category: args.category,
      tags: args.tags,
      images: args.images,
      status: args.isAuction ? "auction" : "available",
      isAuction: args.isAuction,
      auctionEndTime,
      reservePrice: args.reservePrice,
      currentBid: args.isAuction ? args.reservePrice : undefined,
      bidCount: 0,
      views: 0,
      featured: false,
    });

    return artworkId;
  },
});

// Update artwork
export const updateArtwork = mutation({
  args: {
    id: v.id("artworks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    status: v.optional(v.union(
      v.literal("available"),
      v.literal("sold"),
      v.literal("auction"),
      v.literal("reserved")
    )),
    featured: v.optional(v.boolean()),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) throw new Error("Not authenticated");

    const artworkId = args.id as Id<"artworks">;
    const artwork = artworkId ? await ctx.db.get(artworkId) : null;
    if (!artwork) throw new Error("Artwork not found");

    // Check ownership
    if (artwork.artistId !== userId) {
      throw new Error("You can only update your own artworks");
    }

    const updates: any = {};
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.price !== undefined) updates.price = args.price;
    if (args.status !== undefined) updates.status = args.status;
    if (args.featured !== undefined) updates.featured = args.featured;

    await ctx.db.patch(args.id, updates);
    return args.id;
  },
});

// Delete artwork
export const deleteArtwork = mutation({
  args: { id: v.id("artworks"), userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) throw new Error("Not authenticated");

    const artworkId = args.id as Id<"artworks">;
    const artwork = artworkId ? await ctx.db.get(artworkId) : null;
    if (!artwork) throw new Error("Artwork not found");

    // Check ownership
    if (artwork.artistId !== userId) {
      throw new Error("You can only delete your own artworks");
    }

    // Delete related bids
    const bids = await ctx.db
      .query("bids")
      .withIndex("by_artwork", (q) => q.eq("artworkId", args.id))
      .collect();

    for (const bid of bids) {
      await ctx.db.delete(bid._id);
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Internal function to increment views
export const incrementViews = internalMutation({
  args: { id: v.id("artworks") },
  handler: async (ctx, args) => {
    const artworkId = args.id as Id<"artworks">;
    const artwork = artworkId ? await ctx.db.get(artworkId) : null;
    if (artwork) {
      await ctx.db.patch(args.id, { views: artwork.views + 1 });
    }
  },
});

// Get artist's artworks
export const getArtistArtworks = query({
  args: { artistId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("artworks")
      .withIndex("by_artist", (q) => q.eq("artistId", args.artistId))
      .order("desc")
      .collect();
  },
});

// Get featured artworks
export const getFeaturedArtworks = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("artworks")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .order("desc")
      .take(args.limit || 10);
  },
});

