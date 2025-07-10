import React from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { toast } from "sonner";

interface NewExhibitionDialogProps {
  artworkId: Id<"artworks">;
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type ExhibitionFormValues = {
  title: string;
  description: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  isVirtual: boolean;
  locationName: string;
  locationAddress: string;
  locationCity: string;
  locationCountry: string;
};

export function NewExhibitionDialog({ artworkId, trigger, onSuccess, open, onOpenChange }: NewExhibitionDialogProps) {
  const { user } = useUser();
  const userId = user?.id;
  const form = useForm<ExhibitionFormValues>({
    defaultValues: {
      title: "",
      description: "",
      startDate: undefined,
      endDate: undefined,
      isVirtual: false,
      locationName: "",
      locationAddress: "",
      locationCity: "",
      locationCountry: "",
    },
  });
  const createExhibition = useMutation(api.exhibitions.createExhibition);
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? onOpenChange! : setInternalOpen;

  const onSubmit = async (values: ExhibitionFormValues) => {
    if (!userId) return;
    if (!values.startDate || !values.endDate) {
      form.setError("startDate", { type: "manual", message: "Start date is required" });
      form.setError("endDate", { type: "manual", message: "End date is required" });
      return;
    }
    await createExhibition({
      userId,
      title: values.title,
      description: values.description,
      startDate: values.startDate.getTime(),
      endDate: values.endDate.getTime(),
      isVirtual: values.isVirtual,
      location: values.isVirtual ? undefined : {
        name: values.locationName,
        address: values.locationAddress,
        city: values.locationCity,
        country: values.locationCountry,
      },
      artworkIds: [artworkId],
    });
    toast.success('Exhibition created successfully');
    setDialogOpen(false);
    form.reset();
    onSuccess?.();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Schedule Exhibition</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Start Date & Time</FormLabel>
                    <FormControl>
                      <DateTimePicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>End Date & Time</FormLabel>
                    <FormControl>
                      <DateTimePicker value={field.value} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="isVirtual"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Virtual Exhibition</FormLabel>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Location fields, only if not virtual */}
            {!form.watch("isVirtual") && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="locationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locationCountry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            <DialogFooter>
              <Button type="submit">Schedule</Button>
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