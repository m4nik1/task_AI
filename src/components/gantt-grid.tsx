"use client";

import { SetStateAction } from "react";
import { TaskDB } from "../../types";
import { getXFromHour } from "@/lib/utils";
import GantTask from "./gantTask";
import DateNavigation from "./DateNavigation";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

interface gantGridProps {
  setTasks: React.Dispatch<SetStateAction<TaskDB[]>>;
  tasks: TaskDB[];
  navigateDate: (direction: number) => void;
  currentDate: Date;
}

export default function GantGrid({
  setTasks,
  tasks,
  navigateDate,
  currentDate,
}: gantGridProps) {
  const HOUR_WIDTH_PX = 70; // Pixels per hour
  const START_HOUR_DISPLAY = 7; // Start time for the visible grid (7 AM)
  const END_HOUR_DISPLAY = 24; // End time for the visible grid (2 AM next day, 24 + 2 = 26)
  const TOTAL_DISPLAY_HOURS = END_HOUR_DISPLAY - START_HOUR_DISPLAY;
  const TOTAL_DISPLAY_TIME = 20;

  const timeLabels = Array.from({ length: TOTAL_DISPLAY_HOURS + 1 }, (_, i) => {
    const hour = START_HOUR_DISPLAY + i;
    if (hour === 24) return "12AM";
    if (hour === 25) return "1AM";
    if (hour === 26) return "2AM";
    return `${hour % 12 === 0 ? 12 : hour % 12}${
      hour < 12 || hour >= 24 ? "AM" : "PM"
    }`;
  });

  const currentTime = new Date();

  const currentHourInDay =
    currentTime.getHours() + currentTime.getMinutes() / 60;

  const currentTimeLinePos = getXFromHour(
    currentHourInDay,
    HOUR_WIDTH_PX,
    START_HOUR_DISPLAY
  );

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd({ active, delta }: any) {
    const taskId = active.id;
    console.log("Dropped: ", active.id, delta);

    const minutesPerPx = 60 / HOUR_WIDTH_PX;

    const deltaMinutes = delta.x * minutesPerPx;

    const snappedMinutes = Math.round(deltaMinutes / 15) * 15;

    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id.toString() !== taskId) return t;

        const newStart = new Date(t.startTime.getTime());

        newStart.setMinutes(newStart.getMinutes() + snappedMinutes);

        console.log("New start: ", newStart);

        return { ...t, startTime: newStart };
      })
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Date Navi */}
      <DateNavigation currentDate={currentDate} navigateDate={navigateDate} />

      {/* Time Labels */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
        <div
          className="flex-1 grid"
          style={{
            gridTemplateColumns: `repeat(${TOTAL_DISPLAY_TIME}, ${HOUR_WIDTH_PX}px)`,
            minWidth: `${TOTAL_DISPLAY_HOURS * HOUR_WIDTH_PX}px`, // Ensure minimum width
          }}
        >
          {timeLabels.map((label, index) => (
            <div
              key={index}
              className="text-xs text-center text-gray-600 font-medium py-2 border-b"
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid With tasks */}

      <div
        className="flex-1 relative overflow-auto bg-white"
        style={{
          minWidth: `${TOTAL_DISPLAY_HOURS * HOUR_WIDTH_PX}px`,
          backgroundSize: `${HOUR_WIDTH_PX}px 100%`,
          backgroundImage: `linear-gradient(to right, #f3f4f6 1px, transparent 1px)`,
        }}
      >
        <style jsx>{`
          .dark .flex-1.relative {
            background-image: linear-gradient(
              to rigt,
              #374151 1px,
              transparent 1px
            );
          }
        `}</style>
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToHorizontalAxis]}
        >
          {tasks
            // .filter((t) => t.id)
            .map((task, index) => (
              <GantTask key={task.id} task={task} index={index} />
            ))}
        </DndContext>

        {Array.from({ length: tasks.length + 10 }, (_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-b border-gray-100"
            style={{ top: `${i * 40 + 40}px` }}
          ></div>
        ))}

        {/* Horizontal red line to show current time */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
          style={{ left: currentTimeLinePos }}
        >
          <div className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
