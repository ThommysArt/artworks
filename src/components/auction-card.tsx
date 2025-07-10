import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

function formatTime(ms: number) {
  if (ms < 0) ms = 0;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  return `${days}d ${hours}h ${minutes}m`;
}

const AuctionCard = ({ auction }: { auction: any }) => {
  const { title, images: imageUrls, currentBid, timeRemaining, artistName, _id, artistId, reservePrice } = auction;
  const imageUrl = imageUrls && imageUrls.length > 0 ? imageUrls[0] : null;
  const { user } = useUser();
  const placeBid = useMutation(api.bidding.placeBid);
  
  const [bidAmount, setBidAmount] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const handlePlaceBid = async () => {
    if (!user) {
      toast.error("Please sign in to place a bid");
      return;
    }

    if (!_id) {
      toast.error("Invalid auction");
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    const minimumBid = Math.max(currentBid || 0, reservePrice || 0) + 1;
    if (amount < minimumBid) {
      toast.error(`Bid must be at least $${minimumBid}`);
      return;
    }

    setIsPlacingBid(true);
    try {
      await placeBid({
        userId: user.id,
        artworkId: _id as Id<"artworks">,
        amount: amount,
      });
      
      toast.success(`Bid placed successfully! Your bid: $${amount.toLocaleString()}`);
      setIsDialogOpen(false);
      setBidAmount("");
    } catch (error: any) {
      toast.error(error.message || "Failed to place bid");
    } finally {
      setIsPlacingBid(false);
    }
  };

  const handleBidClick = () => {
    if (!user) {
      toast.error("Please sign in to place a bid");
      return;
    }

    // if (user.id === artistId) {
    //   toast.error("You cannot bid on your own artwork");
    //   return;
    // }

    setIsDialogOpen(true);
  };

  const minimumBid = Math.max(currentBid || 0, reservePrice || 0) + 1;

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
            Current Bid: ${currentBid?.toLocaleString() ?? 0}
          </span>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
            Ends in {formatTime(timeRemaining)}
          </span>
        </div>
        {reservePrice && (
          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
            Reserve: ${reservePrice.toLocaleString()}
          </span>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-3 w-full" onClick={handleBidClick}>
              Place Bid
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Place a Bid on "{title}"</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Bid Amount ($)</label>
                <Input
                  type="number"
                  placeholder={`Minimum: $${minimumBid.toLocaleString()}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min={minimumBid}
                  step="0.01"
                />
                <p className="text-xs text-zinc-500">
                  Current bid: ${currentBid?.toLocaleString() ?? 0}
                  {reservePrice && ` | Reserve: $${reservePrice.toLocaleString()}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handlePlaceBid} 
                  disabled={isPlacingBid || !bidAmount || parseFloat(bidAmount) < minimumBid}
                  className="flex-1"
                >
                  {isPlacingBid ? "Placing Bid..." : "Place Bid"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isPlacingBid}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AuctionCard; 