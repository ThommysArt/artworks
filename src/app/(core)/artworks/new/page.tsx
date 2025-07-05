"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { Spinner } from '@/components/icons/spinner'
import { TagSelector } from '@/components/ui/tag-selector'
import { ArtworkDetailsStep } from './_components/artwork-details-step'
import { ArtworkImagesStep } from './_components/artwork-images-step'
import { ArtworkAuctionStep } from './_components/artwork-auction-step'

const artworkSchema = z.object({
  title: z.string().min(2),
  artistName: z.string().min(2),
  price: z.coerce.number().min(0),
  width: z.coerce.number().min(0),
  height: z.coerce.number().min(0),
  depth: z.coerce.number().optional(),
  unit: z.string().min(1),
  medium: z.string().min(1),
  year: z.coerce.number().min(1900),
  category: z.string().min(1),
  tags: z.array(z.string()),
  images: z.array(z.custom<Id<'_storage'>>()),
  status: z.string().min(1),
  isAuction: z.boolean(),
  auctionEndTime: z.coerce.number().optional(),
  reservePrice: z.coerce.number().optional(),
  featured: z.boolean().optional(),
  description: z.string().optional(),
})

type ArtworkForm = z.infer<typeof artworkSchema>


export default function NewArtworkPage() {
  const { user } = useUser();
  const createArtwork = useMutation(api.artworks.createArtwork);
  const form = useForm<ArtworkForm>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      status: 'available',
      year: new Date().getFullYear(),
      tags: [],
      images: [],
      title: '',
      artistName: '',
      price: 0,
      width: 0,
      height: 0,
      unit: '',
      medium: '',
      category: '',
      description: '',
      featured: false,
      isAuction: false,
    },
  });
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: ArtworkForm) {
    setLoading(true);
    try {
      await createArtwork({
        userId: user?.id!,
        username: user?.fullName || user?.emailAddresses[0].emailAddress || "Unknown",
        userAvatar: user?.imageUrl,
        title: data.title,
        description: data.description ?? "",
        price: data.price,
        dimensions: {
          width: data.width,
          height: data.height,
          depth: data.depth,
          unit: data.unit,
        },
        medium: data.medium,
        year: data.year,
        category: data.category,
        tags: data.tags,
        images: data.images,
        isAuction: !!data.isAuction,
        auctionDuration: data.isAuction ? ((data.auctionEndTime && data.auctionEndTime > Date.now()) ? Math.round((data.auctionEndTime - Date.now()) / (1000 * 60 * 60)) : undefined) : undefined,
        reservePrice: data.reservePrice,
      });
      toast.success('Artwork created!');
      form.reset();
      setStep(0);
    } catch (e) {
      toast.error('Failed to create artwork.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-2 lg:px-0 py-8 flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              {step === 0 && <ArtworkDetailsStep form={form} />}
              {step === 1 && <ArtworkImagesStep form={form} />}
              {step === 2 && <ArtworkAuctionStep form={form} />}
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-2 mt-6">
            {step > 0 && (
              <Button type="button" variant="outline" onClick={() => setStep(s => s - 1)}>
                Back
              </Button>
            )}
            {step < 2 ? (
              <Button type="button" onClick={() => setStep(s => s + 1)}>
                Next
              </Button>
            ) : (
              <Button type="submit" disabled={loading}>
                {loading ? <Spinner size={20} /> : 'Create Artwork'}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}