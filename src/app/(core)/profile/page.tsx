import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import { useUser, UserProfile } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ArtCard } from "@/components/art-card";

const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const artworks = useQuery(api.artworks.getArtworks, userId ? { artistId: userId } : "skip") || [];

  return (
    <Tabs defaultValue="artworks" className="w-full max-w-3xl mx-auto mt-8">
      <TabsList>
        <TabsTrigger value="artworks">Artworks</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>
      <TabsContent value="artworks">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {artworks.length === 0 && <div>No artworks found.</div>}
          {artworks.map((artwork: any) => (
            <ArtCard key={artwork._id} artwork={artwork} />
          ))}
        </div>
      </TabsContent>
      <TabsContent value="account">
        <div className="mt-4">
          <UserProfile />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProfilePage;