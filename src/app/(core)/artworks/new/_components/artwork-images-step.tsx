"use client"
import { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';

export function ArtworkImagesStep({ form }: { form: any }) {
  const [uploading, setUploading] = useState(false);
  const generateUploadUrl = useMutation(api.artworks.generateUploadUrl); // You must implement this mutation in Convex
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      // 1. Get upload URL from Convex
      const url = await generateUploadUrl();
      // 2. Upload file to Convex storage
      const uploadRes = await fetch(url, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
      if (!uploadRes.ok) throw new Error('Upload failed');
      // 3. Parse storageId from response
      const { storageId } = await uploadRes.json();
      // 4. Add storageId to form images
      form.setValue('images', [...(form.getValues('images') || []), storageId as Id<'_storage'>]);
    } catch (err) {
      setError('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  }

  const images: Id<'_storage'>[] = form.watch('images') || [];

  return (
    <div className="flex flex-col gap-4">
      <FormLabel>Artwork Images</FormLabel>
      <FormControl>
        <Input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
      </FormControl>
      {error && <FormMessage>{error}</FormMessage>}
      <div className="flex flex-wrap gap-2 mt-2">
        <AnimatePresence>
          {images.map((id, idx) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative w-24 h-24 rounded overflow-hidden border"
            >
              {/* You may want to use your own image CDN or loader here */}
              <img
                src={`/api/storage/${id}`}
                alt="Artwork preview"
                className="object-cover w-full h-full"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 z-10"
                onClick={() => form.setValue('images', images.filter((img: Id<'_storage'>) => img !== id))}
              >
                ×
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <FormMessage />
    </div>
  );
} 