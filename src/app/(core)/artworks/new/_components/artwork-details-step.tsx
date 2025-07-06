"use client"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { TagSelector } from '@/components/ui/tag-selector';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export function ArtworkDetailsStep({ form }: { form: any }) {
  return (
    <div className="flex flex-col gap-4">
      {/* Title + Price */}
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Title</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="w-40">
              <FormLabel>Price</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Year + Medium */}
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem className="w-40">
              <FormLabel>Year</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="medium"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Medium</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Unit + Width + Height + Depth */}
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem className="w-24">
              <FormLabel>Unit</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="width"
          render={({ field }) => (
            <FormItem className="w-24">
              <FormLabel>Width</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem className="w-24">
              <FormLabel>Height</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="depth"
          render={({ field }) => (
            <FormItem className="w-24">
              <FormLabel>Depth</FormLabel>
              <FormControl><Input type="number" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Category + Status */}
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Category</FormLabel>
              <FormControl><Input {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-40">
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="auction">Auction</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Featured + Tags */}
      <div className="flex gap-4 items-end">
        <FormField
          control={form.control}
          name="featured"
          render={({ field }) => (
            <FormItem className="w-32 flex flex-col justify-end">
              <FormLabel>Featured</FormLabel>
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex-1">
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
      {/* Description (full width) */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
} 