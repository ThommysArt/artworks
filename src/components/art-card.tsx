import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { HeartIcon, EyeIcon, StarIcon, HammerIcon } from 'lucide-react';

interface ArtCardProps {
    artwork: {
        title: string;
        artistId: string;
        artistName: string;
        artistsAvatar: string;
        price: number;
        dimensions: {
            width: number;
            height: number;
            depth: number;
            unit: string;
        };
        medium: string;
        year: number;
        category: string;
        tags: string[];
        images: string[];
        status: string;
        isAuction: boolean;
        auctionEndTime: number;
        reservePrice: number;
        currentBid: number;
        bidCount: number;
        views: number;
        featured: boolean;
    }
}

export const ArtCard = ({ artwork }: ArtCardProps) => {
  const {
    title,
    artistName,
    artistsAvatar,
    price,
    dimensions,
    medium,
    year,
    category,
    tags,
    images,
    status,
    isAuction,
    auctionEndTime,
    reservePrice,
    currentBid,
    bidCount,
    views,
    featured,
  } = artwork;

  const mainImage = images && images.length > 0 ? images[0] : '/placeholder-artwork.jpg';
  const formattedPrice = `$${price.toLocaleString()}`;
  const formattedDimensions = `${dimensions.width}×${dimensions.height}${dimensions.depth ? `×${dimensions.depth}` : ''} ${dimensions.unit}`;
  const auctionEnds = isAuction && auctionEndTime ? new Date(auctionEndTime).toLocaleString() : null;

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm max-w-xl w-full p-4 flex flex-col gap-3">
      {/* Header: Avatar, Name, Featured Badge */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={artistsAvatar} alt={artistName} />
          <AvatarFallback>{artistName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">{artistName}</span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">{year} • {medium}</span>
        </div>
        <div className="flex-1" />
        {featured && <Badge className="flex items-center gap-1 bg-yellow-400/80 text-yellow-900"><StarIcon size={14} /> Featured</Badge>}
        <Badge 
          variant={status === 'available' ? 'success' : status==='sold' ? 'secondary' : 'outline'}
          className="ml-2 text-xs capitalize"
          >
            {status}
        </Badge>
      </div>

      {/* Main Image */}
      <div className="rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-800 aspect-[4/3] flex items-center justify-center">
        <img src={mainImage} alt={title} className="object-cover w-full h-full" />
      </div>

      {/* Content: Title, Category, Tags */}
      <div className="flex flex-col gap-1">
        <span className="text-lg font-medium text-zinc-900 dark:text-zinc-50">{title}</span>
        <div className="flex flex-wrap gap-1 mt-1">
          {tags.map((tag) => (
            <span key={tag} className="text-xs text-blue-500 dark:text-blue-400">#{tag}</span>
          ))}
        </div>
      </div>

      {/* Metadata: Price, Dimensions */}
      <div className="flex items-center gap-4 text-sm text-zinc-700 dark:text-zinc-300">
        <span className="font-semibold text-xl font-spacemono">{formattedPrice}</span>
      </div>

      {/* Footer: Views, Like Button */}
      <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500 dark:text-zinc-400">
        <EyeIcon size={14} className="mr-1" /> {views} views
        <button
          type="button"
          className="ml-auto flex items-center gap-1 text-zinc-500 hover:text-pink-500 transition-colors"
          aria-label="Like"
        >
          <HeartIcon size={16} />
        </button>
      </div>
    </div>
  )
}
