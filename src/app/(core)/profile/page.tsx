"use client"

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useUser, UserProfile } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ArtCard } from "@/components/art-card";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const artworks = useQuery(api.artworks.getArtworks, userId ? { artistId: userId } : "skip") || [];
  const { resolvedTheme } = useTheme();

  // Only set baseTheme to dark for dark mode, otherwise use Clerk's default (light)
  const appearance = resolvedTheme === "dark" ? { baseTheme: dark } : {};

  return (
    <Tabs defaultValue="artworks" className="w-full max-w-6xl mx-auto mt-8">
      <TabsList>
        <TabsTrigger value="artworks">Artworks</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="artworks">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.length === 0 && <div>No artworks found.</div>}
          {artworks.map((artwork: any) => (
            <ArtCard key={artwork._id} artwork={artwork} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="account">
        <div className="mt-4">
          <UserProfile appearance={appearance} />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfilePage;