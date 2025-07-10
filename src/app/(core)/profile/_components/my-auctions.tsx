"use client"

import React from "react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import AuctionCard from "@/components/auction-card";

const MyAuctions = () => {
  const { user } = useUser();
  const userId = user?.id;
  
  // Get auctions created by the current user
  const auctions = useQuery(api.bidding.getActiveAuctions, {}) || [];
  const myAuctions = auctions.filter((auction: any) => auction.artistId === userId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Auctions</h2>
        <div className="text-sm text-zinc-500">
          {myAuctions.length} active auction{myAuctions.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {myAuctions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-zinc-500 mb-4">No auctions found</div>
          <p className="text-sm text-zinc-400">
            You haven't created any auctions yet. Create an auction from your artworks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myAuctions.map((auction: any) => (
            <AuctionCard key={auction._id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAuctions; 