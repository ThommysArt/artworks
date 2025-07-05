"use client"

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArtCard } from '@/components/art-card';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'motion/react';

export default function ArtworksFeedPage() {
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch recent artworks (paginated)
  const artworks = useQuery(api.artworks.getArtworks, { limit: 20 });
  // Fetch search results
  const searchResults = useQuery(
    api.artworks.searchArtworks,
    searchTerm ? { searchTerm } : "skip"
  );

  const isLoading = (!artworks && !searchTerm) || (searchTerm && !searchResults);
  const feed = searchTerm ? searchResults : artworks;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(search);
    setSearching(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-2 lg:px-0 flex flex-col gap-6 py-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <Input
          placeholder="Search artworks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !search.trim()}>
          Search
        </Button>
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setSearch('');
              setSearchTerm('');
              setSearching(false);
            }}
          >
            Clear
          </Button>
        )}
      </form>
      {/* Feed */}
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-zinc-400"
          >
            Loading artworks...
          </motion.div>
        ) : feed && feed.length > 0 ? (
          <motion.div
            key="feed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col gap-6"
          >
            {feed.map((artwork: any) => (
              <ArtCard key={artwork._id} artwork={artwork} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 text-zinc-400"
          >
            No artworks found.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}