import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const applicationTables = {
  // Artworks
  artworks: defineTable({
    title: v.string(),
    description: v.string(),
    artistId: v.string(),
    artistName: v.string(),
    artistsAvatar: v.optional(v.string()),
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
    images: v.array(v.id("_storage")),
    status: v.union(
      v.literal("available"),
      v.literal("sold"),
      v.literal("auction"),
      v.literal("reserved")
    ),
    isAuction: v.boolean(),
    auctionEndTime: v.optional(v.number()),
    reservePrice: v.optional(v.number()),
    currentBid: v.optional(v.number()),
    bidCount: v.number(),
    views: v.number(),
    featured: v.boolean(),
  })
    .index("by_artist", ["artistId"])
    .index("by_category", ["category"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured"])
    .searchIndex("search_artworks", {
      searchField: "title",
      filterFields: ["category", "artistId", "status"],
    }),

  // Bids
  bids: defineTable({
    artworkId: v.id("artworks"),
    bidderId: v.string(),
    amount: v.number(),
    isWinning: v.boolean(),
  })
    .index("by_artwork", ["artworkId"])
    .index("by_bidder", ["bidderId"])
    .index("by_artwork_amount", ["artworkId", "amount"]),

  // Exhibitions
  exhibitions: defineTable({
    title: v.string(),
    description: v.string(),
    curatorId: v.string(),
    startDate: v.number(),
    endDate: v.number(),
    location: v.optional(v.object({
      name: v.string(),
      address: v.string(),
      city: v.string(),
      country: v.string(),
    })),
    isVirtual: v.boolean(),
    artworkIds: v.array(v.id("artworks")),
    coverImage: v.optional(v.id("_storage")),
    status: v.union(
      v.literal("upcoming"),
      v.literal("active"),
      v.literal("ended")
    ),
    featured: v.boolean(),
    views: v.number(),
  })
    .index("by_curator", ["curatorId"])
    .index("by_status", ["status"])
    .index("by_featured", ["featured"])
    .searchIndex("search_exhibitions", {
      searchField: "title",
      filterFields: ["curatorId", "status"],
    }),

  // Collections (user favorites/wishlists)
  collections: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    artworkIds: v.array(v.id("artworks")),
    isPublic: v.boolean(),
    coverImage: v.optional(v.id("_storage")),
  }).index("by_user", ["userId"]),

  // Shopping cart
  cartItems: defineTable({
    userId: v.string(),
    artworkId: v.id("artworks"),
    quantity: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_artwork", ["artworkId"]),

  // Orders
  orders: defineTable({
    userId: v.string(),
    artworkIds: v.array(v.id("artworks")),
    totalAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    shippingAddress: v.object({
      name: v.string(),
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
      country: v.string(),
    }),
    paymentMethod: v.string(),
    trackingNumber: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // Reviews
  reviews: defineTable({
    artworkId: v.id("artworks"),
    reviewerId: v.string(),
    rating: v.number(),
    comment: v.optional(v.string()),
  })
    .index("by_artwork", ["artworkId"])
    .index("by_reviewer", ["reviewerId"]),

  // Analytics
  analytics: defineTable({
    type: v.union(
      v.literal("artwork_view"),
      v.literal("exhibition_view"),
      v.literal("artist_profile_view")
    ),
    entityId: v.string(),
    userId: v.optional(v.string()),
    metadata: v.optional(v.object({
      source: v.optional(v.string()),
      duration: v.optional(v.number()),
    })),
  })
    .index("by_type", ["type"])
    .index("by_entity", ["entityId"]),
};

export default defineSchema({
  ...applicationTables,
});
