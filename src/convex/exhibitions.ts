import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Get exhibitions with filters
export const getExhibitions = query({
  args: {
    status: v.optional(v.union(
      v.literal("upcoming"),
      v.literal("active"),
      v.literal("ended")
    )),
    featured: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let exhibitions;

    if (args.status) {
      exhibitions = await ctx.db
        .query("exhibitions")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(args.limit || 20);
    } else if (args.featured !== undefined) {
      exhibitions = await ctx.db
        .query("exhibitions")
        .withIndex("by_featured", (q) => q.eq("featured", args.featured!))
        .order("desc")
        .take(args.limit || 20);
    } else {
      exhibitions = await ctx.db
        .query("exhibitions")
        .order("desc")
        .take(args.limit || 20);
    }

    // Get curator info and cover image URLs
    const exhibitionsWithDetails = await Promise.all(
      exhibitions.map(async (exhibition) => {
        // Get artwork count
        const artworkCount = exhibition.artworkIds.length;

        return {
          ...exhibition,
          artworkCount,
        };
      })
    );

    return exhibitionsWithDetails;
  },
});

// Get single exhibition with full details
export const getExhibition = query({
  args: { id: v.id("exhibitions") },
  handler: async (ctx, args) => {
    const exhibition = await ctx.db.get(args.id);
    if (!exhibition) return null;

    let coverImageUrl = null;
    if (exhibition.coverImage) {
      coverImageUrl = await ctx.storage.getUrl(exhibition.coverImage);
    }

    // Get artworks in exhibition
    const artworks = await Promise.all(
      exhibition.artworkIds.map(async (artworkId) => {
        return await ctx.db.get(artworkId);
      })
    );

    return {
      ...exhibition,
      coverImageUrl,
      artworks: artworks.filter(Boolean),
    };
  },
});

// Create exhibition (curator only)
export const createExhibition = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.string(),
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
  },
  handler: async (ctx, args) => {
    const { userId } = args;
    if (!userId) throw new Error("Not authenticated");

    // For now, any authenticated user can create exhibitions
    // In a real app, you might want to restrict this to curators

    const now = Date.now();
    let status: "upcoming" | "active" | "ended" = "upcoming";
    
    if (args.startDate <= now && args.endDate > now) {
      status = "active";
    } else if (args.endDate <= now) {
      status = "ended";
    }

    const exhibitionId = await ctx.db.insert("exhibitions", {
      title: args.title,
      description: args.description,
      curatorId: userId,
      startDate: args.startDate,
      endDate: args.endDate,
      location: args.location,
      isVirtual: args.isVirtual,
      artworkIds: args.artworkIds,
      coverImage: args.coverImage,
      status,
      featured: false,
      views: 0,
    });

    return exhibitionId;
  },
});
