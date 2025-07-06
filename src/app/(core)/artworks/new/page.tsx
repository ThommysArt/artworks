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
import { Progress } from '@/components/ui/progress'

const artworkSchema = z.object({
  title: z.string().min(2),
  price: z.coerce.number().min(0),
  width: z.coerce.number().min(0),
  height: z.coerce.number().min(0),
  depth: z.coerce.number().optional(),
  unit: z.string().min(1),
  medium: z.string().min(1),
  year: z.coerce.number().min(1900),
  category: z.string().min(1),
  tags: z.array(z.string()),
  images: z.array(z.string()),
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

  const steps = [
    { label: 'Details', icon: null },
    { label: 'Images', icon: null },
    { label: 'Auction', icon: null },
  ];

  async function onSubmit(data: ArtworkForm) {
    console.log('Submitting', data);
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

  // Debug: log form errors
  console.log('Form errors:', form.formState.errors);

  return (
    <div className="max-w-xl mx-auto px-2 lg:px-0 py-8 flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Steps Indicator + Progress Bar (merged) */}
          <div className="mb-6">
            <div className="relative flex items-center justify-between gap-2">
              {/* Progress Bar as connecting line */}
              <motion.div
                className="absolute top-4 left-0 right-0 h-1 rounded-full z-0"
                style={{ backgroundColor: 'var(--color-secondary, #e0e7ff)' }}
              />
              <motion.div
                className="absolute top-4 left-0 h-1 rounded-full z-0"
                style={{
                  width: `${(step / (steps.length - 1)) * 100}%`,
                  backgroundColor: 'var(--color-primary, #7c3aed)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
              {steps.map((s, i) => {
                const isActive = i === step;
                const isCompleted = i < step;
                const isNext = i > step;
                const colorClass = isActive || isCompleted
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-secondary text-secondary-foreground border-secondary';
                return (
                  <div key={s.label} className="flex-1 flex flex-col items-center z-10">
                    <motion.div
                      animate={isActive ? { scale: 1.15, boxShadow: '0 2px 12px 0 rgba(80,0,120,0.10)' } : { scale: 1, boxShadow: 'none' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${colorClass}`}
                    >
                      <span className="font-bold text-base">{i + 1}</span>
                    </motion.div>
                    <span className={`mt-2 text-xs font-medium tracking-wide ${isActive ? 'text-primary' : isCompleted ? 'text-primary/80' : 'text-secondary'}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
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