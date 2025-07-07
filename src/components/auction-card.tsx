import React from "react";
import { Button } from "@/components/ui/button";

function formatTime(ms: number) {
  if (ms < 0) ms = 0;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m`;
}

const AuctionCard = ({ auction }: { auction: any }) => {
  const { title, imageUrls, currentBid, timeRemaining, artistName } = auction;
  const imageUrl = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null;

  const handlePlaceBid = () => {
    // Placeholder for bid logic
    alert(`Place a bid on ${title}`);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 flex flex-col gap-3 border border-zinc-200 dark:border-zinc-800">
      {imageUrl && (
        <img src={imageUrl} alt={title} className="rounded-md w-full h-40 object-cover mb-2" />
      )}
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="text-sm text-zinc-500 dark:text-zinc-400">by {artistName}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
            Current Bid: ${currentBid ?? 0}
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            Ends in {formatTime(timeRemaining)}
          </span>
        </div>
        <Button className="mt-3 w-full" onClick={handlePlaceBid}>
          Place Bid
        </Button>
      </div>
    </div>
  );
};

export default AuctionCard; 