import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get user's cart
export const getCart = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const userId = args.userId;
    if (!userId) return [];

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const cartWithDetails = [];
    
    for (const item of cartItems) {
      const artwork = await ctx.db.get(item.artworkId);
      if (!artwork) continue;

      cartWithDetails.push({
        ...item,
        artwork
      });
    }

    return cartWithDetails;
  },
});

// Add item to cart
export const addToCart = mutation({
  args: {
    userId: v.string(),
    artworkId: v.id("artworks"),
    quantity: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) throw new Error("Not authenticated");

    const artwork = await ctx.db.get(args.artworkId);
    if (!artwork) throw new Error("Artwork not found");

    // Check if artwork is available
    if (artwork.status !== "available") {
      throw new Error("Artwork is not available for purchase");
    }

    // Check if user is not the artist
    if (artwork.artistId === userId) {
      throw new Error("You cannot purchase your own artwork");
    }

    // Check if item already in cart
    const existingItem = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("artworkId"), args.artworkId))
      .first();

    if (existingItem) {
      // Update quantity
      await ctx.db.patch(existingItem._id, {
        quantity: existingItem.quantity + (args.quantity || 1),
      });
      return existingItem._id;
    } else {
      // Add new item
      return await ctx.db.insert("cartItems", {
        userId,
        artworkId: args.artworkId,
        quantity: args.quantity || 1,
      });
    }
  },
});

// Remove item from cart
export const removeFromCart = mutation({
  args: { userId: v.string(), itemId: v.id("cartItems") },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== userId) {
      throw new Error("Cart item not found");
    }

    await ctx.db.delete(args.itemId);
    return args.itemId;
  },
});

// Update cart item quantity
export const updateCartQuantity = mutation({
  args: {
    userId: v.string(),
    itemId: v.id("cartItems"),
    quantity: v.number(),
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) throw new Error("Not authenticated");

    const item = await ctx.db.get(args.itemId);
    if (!item || item.userId !== userId) {
      throw new Error("Cart item not found");
    }

    if (args.quantity <= 0) {
      await ctx.db.delete(args.itemId);
      return args.itemId;
    }

    await ctx.db.patch(args.itemId, { quantity: args.quantity });
    return args.itemId;
  },
});

// Clear cart
export const clearCart = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) throw new Error("Not authenticated");

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const item of cartItems) {
      await ctx.db.delete(item._id);
    }

    return cartItems.length;
  },
});

// Get cart total
export const getCartTotal = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) return { total: 0, itemCount: 0 };

    const cartItems = await ctx.db
      .query("cartItems")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    let total = 0;
    let itemCount = 0;

    for (const item of cartItems) {
      const artwork = await ctx.db.get(item.artworkId);
      if (artwork && artwork.status === "available") {
        total += artwork.price * item.quantity;
        itemCount += item.quantity;
      }
    }

    return { total, itemCount };
  },
});
