"use client"

import React from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import AuctionCard from "@/components/auction-card";

const AuctionsPage = () => {
  const auctions = useQuery(api.bidding.getActiveAuctions, {}) || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {auctions.length === 0 && <div>No auctions found.</div>}
      {auctions.map((auction) => (
        <AuctionCard key={auction._id} auction={auction} />
      ))}
    </div>
  );
};

export default AuctionsPage;