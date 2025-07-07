import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  className?: string;
}

export function DateTimePicker({ value, onChange, className }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(value);
  const [time, setTime] = React.useState<string>(value ? format(value, "HH:mm") : "12:00");

  React.useEffect(() => {
    if (date && time) {
      const [hours, minutes] = time.split(":").map(Number);
      const newDate = new Date(date);
      newDate.setHours(hours);
      newDate.setMinutes(minutes);
      onChange(newDate);
    } else {
      onChange(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, time]);

  return (
    <div className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left">
            {date ? (
              <>
                {format(date, "PPP")} {time}
              </>
            ) : (
              <span>Pick a date and time</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="flex flex-col gap-2 p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
            <Input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="mt-2"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
} 