"use client";

import { formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DateNavigationProps {
  currentDate: Date;
  navigateDate: (direction: number) => void;
}

export default function DateNavigation({
  currentDate,
  navigateDate,
}: DateNavigationProps) {
  const [nextDayDate, setNextDayDate] = useState<string>("");

  useEffect(() => {
    const nextDay = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    setNextDayDate(formatDate(nextDay));
  }, [currentDate]);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          {formatDate(currentDate)}
        </h2>
        <div className="flex items-center gap-1 pl-2 border-l border-border/50">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted cursor-pointer"
            onClick={() => navigateDate(-1)}
            aria-label="Previous day"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-muted cursor-pointer"
            onClick={() => navigateDate(1)}
            aria-label="Next day"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="hidden sm:flex items-center text-sm text-muted-foreground">
        <span className="opacity-60 mr-2 font-medium">Next:</span>
        <span className="font-medium">{nextDayDate}</span>
      </div>
    </div>
  );
}
