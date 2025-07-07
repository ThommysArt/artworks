import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { Input } from "./ui/input";

interface NewAuctionDialogProps {
  artworkId: Id<"artworks">;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NewAuctionDialog({ artworkId, trigger, onSuccess, open, onOpenChange }: NewAuctionDialogProps) {
  const { user } = useUser();
  const userId = user?.id;
  const form = useForm({
    defaultValues: {
      auctionEndTime: undefined,
      reservePrice: '',
    },
  });
  const updateArtwork = useMutation(api.artworks.updateArtwork);
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen;

  const onSubmit = async (values: any) => {
    if (!userId) return;
    await updateArtwork({
      id: artworkId,
      userId,
      status: 'auction',
      auctionEndTime: values.auctionEndTime ? values.auctionEndTime.getTime() : undefined,
      reservePrice: values.reservePrice ? Number(values.reservePrice) : undefined,
    });
    setDialogOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Auction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="auctionEndTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auction End Date/Time</FormLabel>
                  <FormControl>
                    <DateTimePicker value={field.value} onChange={field.onChange} />
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
                    <Input type="number" min="0" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Start Auction</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 