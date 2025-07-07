"use client"

import React from "react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import AuctionCard from "@/components/auction-card";

const MyBidsPage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const bids = useQuery(api.bidding.getUserBids, userId ? { userId } : "skip") || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bids.length === 0 && <div>No current bids.</div>}
      {bids.map((bid: any) => (
        bid.artwork && <AuctionCard key={bid._id} auction={bid.artwork} />
      ))}
    </div>
  );
};

export default MyBidsPage; 