"use client"

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { notFound } from 'next/navigation';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { useParams } from 'next/navigation';
import { Id } from '@/convex/_generated/dataModel';

export default function ArtworkDetailPage() {
  const { artworkId } = useParams<{ artworkId: string }>();
  const artwork = useQuery(api.artworks.getArtwork, { id: artworkId as Id<'artworks'> });

  if (!artwork) return <div className="py-12 text-center text-zinc-400">Loading...</div>;
  if (artwork === null) return notFound();

  const {
    title,
    price,
    artistId,
    artistName,
    artistsAvatar,
    dimensions,
    medium,
    year,
    category,
    tags,
    imageUrls,
    status,
    isAuction,
    auctionEndTime,
    reservePrice,
    currentBid,
    bidCount,
    views,
    featured,
    description,
    bids,
  } = artwork;

  return (
    <article className="max-w-3xl mx-auto px-2 lg:px-0 py-8">
      {/* Carousel */}
      <Carousel className="mb-6 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <CarouselContent>
          {imageUrls && imageUrls.length > 0 ? (
            imageUrls.map((url: string|null, i: number) => (
              <CarouselItem key={i}>
                <img src={url!} alt={title} className="w-full h-96 object-cover" />
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>
              <div className="w-full h-96 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400">No image</div>
            </CarouselItem>
          )}
        </CarouselContent>
      </Carousel>
      {/* Title and Artist */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="mb-4"
      >
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">{title}</h1>
        <div className="flex items-center gap-2 mb-2">
          {featured && <Badge className="bg-yellow-400/80 text-yellow-900">Featured</Badge>}
          <Badge variant="outline" className="capitalize">{status}</Badge>
          <span className="text-zinc-500 text-sm">{year} • {medium}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-medium text-zinc-700 dark:text-zinc-200">{artistName}</span>
        </div>
      </motion.header>
      {/* Metadata */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
        className="mb-6 flex flex-wrap gap-4 text-zinc-700 dark:text-zinc-300"
      >
        <span className="font-semibold text-lg">${price.toLocaleString()}</span>
        <span className="text-xs">{dimensions.width}×{dimensions.height}{dimensions.depth ? `×${dimensions.depth}` : ''} {dimensions.unit}</span>
        <span className="text-xs">{category}</span>
        <div className="flex flex-wrap gap-1">
          {tags.map((tag: string) => (
            <span key={tag} className="text-xs text-blue-500 dark:text-blue-400">#{tag}</span>
          ))}
        </div>
        <span className="text-xs text-zinc-400">{views} views</span>
      </motion.section>
      {/* Auction Info */}
      {isAuction && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
          className="mb-6 bg-zinc-50 dark:bg-zinc-800 rounded-lg p-4"
        >
          <div className="flex flex-wrap gap-4 items-center">
            <span className="font-semibold">Current Bid: ${currentBid?.toLocaleString()}</span>
            <span className="text-xs">Reserve: ${reservePrice?.toLocaleString()}</span>
            <span className="text-xs">Bids: {bidCount}</span>
            {auctionEndTime && <span className="text-xs text-zinc-400">Ends: {new Date(auctionEndTime).toLocaleString()}</span>}
          </div>
          {bids && bids.length > 0 && (
            <div className="mt-2">
              <div className="font-medium text-sm mb-1">Recent Bids</div>
              <ul className="space-y-1">
                {bids.map((bid: any, i: number) => (
                  <li key={i} className="flex gap-2 text-xs text-zinc-600 dark:text-zinc-300">
                    <span>${bid.amount.toLocaleString()}</span>
                    <span>by {bid.bidderName || 'Anonymous'}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.section>
      )}
      {/* Description */}
      {description && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
          className="prose dark:prose-invert max-w-none"
        >
          <p>{description}</p>
        </motion.section>
      )}
    </article>
  );
}