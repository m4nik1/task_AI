import { clsx, type ClassValue } from "clsx"
import { RefObject } from "react";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getHourFromX(
  clientX: number,
  gridRef: RefObject<HTMLDivElement>,
  HOUR_WIDTH_PX: number,
  START_HOUR_DISPLAY: number,
) {
  if (!gridRef.current) return 0;
  const gridRect = gridRef.current.getBoundingClientRect();
  const xInGrid = clientX - gridRect.left;
  return START_HOUR_DISPLAY + xInGrid / HOUR_WIDTH_PX;
}

export function formatTime(hour: number) {
  const displayHour =
    Math.floor(hour) % 12 === 0 ? 12 : Math.floor(hour) % 12;

  const period = hour < 12 || hour >= 24 ? "AM" : "PM";

  const minutes =
    hour % 1 > 0
      ? `${Math.round((hour % 1) * 60)
        .toString()
        .padStart(2, "0")}`
      : "00";
  const time = `${displayHour}:${minutes}${period}`;
  
  return time;
}

export function getXFromHour(
  hour: number,
  HOUR_WIDTH_PX: number,
  START_HOUR_DISPLAY: number
) {
  return (hour - START_HOUR_DISPLAY) * HOUR_WIDTH_PX;
}

export function formatDate(date: Date) {
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${days[date.getDay()]}, ${months[date.getMonth()]
    } ${date.getDate()}`;
}
