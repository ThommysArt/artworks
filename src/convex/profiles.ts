import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get user profile
export const getProfile = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    const targetUserId = args.userId || currentUserId;
    
    if (!targetUserId) return null;

    const user = await ctx.db.get(targetUserId);
    if (!user) return null;

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", targetUserId))
      .first();

    let avatarUrl = null;
    if (profile?.avatar) {
      avatarUrl = await ctx.storage.getUrl(profile.avatar);
    }

    return {
      ...user,
      ...profile,
      avatarUrl,
    };
  },
});

// Create or update profile
export const updateProfile = mutation({
  args: {
    role: v.optional(v.union(v.literal("artist"), v.literal("user"))),
    bio: v.optional(v.string()),
    website: v.optional(v.string()),
    location: v.optional(v.string()),
    avatar: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const profileData = {
      userId,
      role: args.role || "user",
      bio: args.bio,
      website: args.website,
      location: args.location,
      avatar: args.avatar,
      isVerified: existingProfile?.isVerified || false,
      shippingAddresses: existingProfile?.shippingAddresses || [],
    };

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        ...profileData,
        role: args.role || existingProfile.role,
      });
      return existingProfile._id;
    } else {
      return await ctx.db.insert("profiles", profileData);
    }
  },
});

// Add shipping address
export const addShippingAddress = mutation({
  args: {
    name: v.string(),
    street: v.string(),
    city: v.string(),
    state: v.string(),
    zipCode: v.string(),
    country: v.string(),
    isDefault: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Profile not found");

    const addresses = profile.shippingAddresses || [];
    
    // If this is set as default, unset others
    if (args.isDefault) {
      addresses.forEach(addr => addr.isDefault = false);
    }

    addresses.push({
      name: args.name,
      street: args.street,
      city: args.city,
      state: args.state,
      zipCode: args.zipCode,
      country: args.country,
      isDefault: args.isDefault,
    });

    await ctx.db.patch(profile._id, { shippingAddresses: addresses });
    return profile._id;
  },
});

// Get artist profiles
export const getArtists = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const artistProfiles = await ctx.db
      .query("profiles")
      .filter((q) => q.eq(q.field("role"), "artist"))
      .take(args.limit || 20);

    const artistsWithDetails = await Promise.all(
      artistProfiles.map(async (profile) => {
        const user = await ctx.db.get(profile.userId);
        let avatarUrl = null;
        if (profile.avatar) {
          avatarUrl = await ctx.storage.getUrl(profile.avatar);
        }

        // Get artwork count
        const artworkCount = await ctx.db
          .query("artworks")
          .withIndex("by_artist", (q) => q.eq("artistId", profile.userId))
          .collect()
          .then(artworks => artworks.length);

        return {
          ...profile,
          name: user?.name,
          email: user?.email,
          avatarUrl,
          artworkCount,
        };
      })
    );

    return artistsWithDetails;
  },
});

// Generate upload URL for avatar
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
