"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useUser } from "@clerk/nextjs"
import { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { useState } from "react"
import { Spinner } from '@/components/icons/spinner'
import { TagSelector } from '@/components/ui/tag-selector'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { useRouter } from "next/navigation"

const artworkSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  width: z.coerce.number().min(0, "Width must be at least 0"),
  height: z.coerce.number().min(0, "Height must be at least 0"),
  depth: z.coerce.number().optional(),
  unit: z.string().min(1, "Unit is required"),
  medium: z.string().min(1, "Medium is required"),
  year: z.coerce.number().min(1900, "Year must be at least 1900"),
  category: z.string().min(1, "Category is required"),
  tags: z.array(z.string()),
  images: z.array(z.string()).min(1, "At least one image is required"),
})

type ArtworkForm = z.infer<typeof artworkSchema>

export default function NewArtworkPage() {
  const router = useRouter();
  const { user } = useUser();
  const createArtwork = useMutation(api.artworks.createArtwork);
  const form = useForm<ArtworkForm>({
    resolver: zodResolver(artworkSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      width: 0,
      height: 0,
      depth: 0,
      unit: 'cm',
      medium: '',
      year: new Date().getFullYear(),
      category: '',
      tags: [],
      images: [],
    },
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const generateUploadUrl = useMutation(api.media.generateUploadUrl);
  const getMediaUrl = useMutation(api.media.getMediaUrl);

  async function onSubmit(data: ArtworkForm) {
    if (!user) {
      toast.error("Please sign in to create artwork");
      return;
    }

    setLoading(true);
    try {
      await createArtwork({
        userId: user.id,
        username: user.fullName || user.emailAddresses[0].emailAddress || "Unknown",
        userAvatar: user.imageUrl,
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
        isAuction: false,
        auctionDuration: undefined,
        reservePrice: undefined,
      });
      toast.success('Artwork created successfully!');
      router.push('/artworks');
      form.reset();
    } catch (e) {
      toast.error('Failed to create artwork.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Artwork</h1>
        <p className="text-zinc-600">Share your artwork with the world</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter artwork title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your artwork..." 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (FCFA) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2024" 
                        min="1900"
                        max={new Date().getFullYear()}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Dimensions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="width"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Width *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Height *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="depth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Depth</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        min="0"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cm">cm</SelectItem>
                        <SelectItem value="m">m</SelectItem>
                        <SelectItem value="in">inches</SelectItem>
                        <SelectItem value="ft">feet</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Artwork Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Artwork Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="medium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medium *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Oil on canvas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="painting">Painting</SelectItem>
                        <SelectItem value="sculpture">Sculpture</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="digital">Digital Art</SelectItem>
                        <SelectItem value="print">Print</SelectItem>
                        <SelectItem value="drawing">Drawing</SelectItem>
                        <SelectItem value="mixed-media">Mixed Media</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagSelector<string>
                      availableTags={["painting", "sculpture", "photography", "architecture", "design", "illustration"]}
                      selectedTags={field.value || []}
                      onChange={field.onChange}
                      getValue={t => t}
                      getLabel={t => t}
                      createTag={t => t}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Images</h2>
            
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => {
                const { getRootProps, getInputProps, isDragActive } = useDropzone({
                  accept: {
                    'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
                  },
                  onDrop: async (acceptedFiles) => {
                    setUploading(true);
                    setUploadError(null);
                    
                    try {
                      for (const file of acceptedFiles) {
                        // 1. Get upload URL from Convex
                        const url = await generateUploadUrl();
                        
                        // 2. Upload file to Convex storage
                        const uploadRes = await fetch(url, { 
                          method: 'POST', 
                          headers: { 'Content-Type': file.type }, 
                          body: file 
                        });
                        
                        if (!uploadRes.ok) throw new Error('Upload failed');
                        
                        // 3. Parse storageId from response
                        const { storageId } = await uploadRes.json();
                        const imageUrl = await getMediaUrl({ id: storageId });
                        
                        // 4. Add storageId to form images
                        field.onChange([...field.value, imageUrl as string]);
                      }
                    } catch (err) {
                      setUploadError('Failed to upload image(s).');
                    } finally {
                      setUploading(false);
                    }
                  }
                });

                const removeImage = (index: number) => {
                  const newImages = field.value.filter((_, i) => i !== index);
                  field.onChange(newImages);
                };

                return (
                  <FormItem>
                    <FormLabel>Artwork Images *</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* Dropzone */}
                        <div
                          {...getRootProps()}
                          className={`
                            border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 cursor-pointer
                            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                            ${isDragActive 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                              : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500'
                            }
                          `}
                        >
                          <input {...getInputProps()} />
                          <div className="flex flex-col items-center gap-3">
                            <div className={`
                              p-3 rounded-full transition-colors
                              ${isDragActive 
                                ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' 
                                : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800'
                              }
                            `}>
                              {isDragActive ? <Upload className="h-6 w-6" /> : <ImageIcon className="h-6 w-6" />}
                            </div>
                            <div>
                              <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                {uploading ? 'Uploading...' : isDragActive ? 'Drop images here' : 'Upload your artwork images'}
                              </p>
                              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                                {uploading ? 'Please wait while we upload your images' : 'Drag and drop images here, or click to browse'}
                              </p>
                              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                                Supports: JPEG, PNG, GIF, WebP (max 10MB each)
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Image Preview */}
                        {field.value.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Selected Images ({field.value.length})
                              </h3>
                              <button
                                type="button"
                                onClick={() => field.onChange([])}
                                className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Clear all
                              </button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {field.value.map((imageUrl, index) => (
                                <div
                                  key={index}
                                  className="relative group aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700"
                                >
                                  <img
                                    src={imageUrl}
                                    alt={`Artwork preview ${index + 1}`}
                                    className="object-cover w-full h-full"
                                    onError={(e) => {
                                      // Fallback to icon if image fails to load
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.classList.remove('hidden');
                                    }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center hidden">
                                    <ImageIcon className="h-8 w-8 text-zinc-400" />
                                  </div>
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                  <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {uploadError && (
                          <div className="text-sm text-red-600 dark:text-red-400 mt-2">
                            {uploadError}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button type="submit" disabled={loading} className="min-w-[150px]">
              {loading ? (
                <>
                  <Spinner size={20} className="mr-2" />
                  Creating...
                </>
              ) : (
                'Create Artwork'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}