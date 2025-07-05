"use client"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

export function ArtworkAuctionStep({ form }: { form: any }) {
  return (
    <div className="flex flex-col gap-4">
      <FormField
        control={form.control}
        name="isAuction"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Auction</FormLabel>
            <FormControl>
              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="auctionEndTime"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Auction End Time (timestamp)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Auction End Time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="reservePrice"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Reserve Price</FormLabel>
            <FormControl>
              <Input type="number" placeholder="Reserve Price" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
} 