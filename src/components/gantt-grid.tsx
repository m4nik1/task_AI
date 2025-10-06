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
import {
  restrictToHorizontalAxis,
  createSnapModifier,
} from "@dnd-kit/modifiers";

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
    START_HOUR_DISPLAY,
  );

  const sensors = useSensors(useSensor(PointerSensor));

  const snapToGrid = createSnapModifier(HOUR_WIDTH_PX);

  async function handleDragEnd({ active, delta }: any) {

    const taskId = active.id;

    const minutesPerPx = 60 / HOUR_WIDTH_PX;

    const deltaMinutes = delta.x * minutesPerPx;

    const snappedMinutes = Math.round(deltaMinutes / 30) * 30;
    let taskData;

    if(taskId.startsWith('resize-')) {
      const actualId = taskId.replace('resize-', '');

      setTasks((prev) => 
        prev.map((t) => {
          if(t.id != actualId) return t;

          console.log("Does this work?")

          console.log("Resizing in handleDragEnd")

          const newDuration = Math.max(30, t.Duration + snappedMinutes);
          const newEndTime = new Date(t.startTime.getTime());

          newEndTime.setMinutes(newEndTime.getMinutes() + newDuration);

          taskData = { id: t.id, startTime: t.startTime, Duration: newDuration, EndTime: newEndTime }

          return { ...t, Duration: newDuration, EndTime: newEndTime }
        })
      )

      await fetch('/api/updateTask/', {
        method: 'POST',
        body: JSON.stringify(taskData)
      })
    }

    else {
      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          if (t.id.toString() !== taskId) return t;

          const newStart = new Date(t.startTime.getTime());
          newStart.setMinutes(newStart.getMinutes() + snappedMinutes);

          const newEndTime = new Date(t.EndTime.getTime())
          newEndTime.setMinutes(newEndTime.getMinutes() + t.Duration)

          console.log("New start: ", newStart);

          taskData = { id: t.id, startTime: newStart, EndTime: newEndTime }

          return { ...t, startTime: newStart, EndTime: newEndTime, Duration: t.Duration };
        }),
      );
      await fetch('/api/updateTask/', {
        method: 'POST',
        body: JSON.stringify(taskData)
      })
    }
  }

  function handleDragMove({ active, delta } : any) {
    const taskId = active.id
    console.log("tasks: ", tasks);

    // This is for resizing
    if(taskId.startsWith('resize-')) {
      const actualId = parseInt(taskId.replace('resize-', ''));
      const deltaMi = delta.x / HOUR_WIDTH_PX;
      const snappedMinutes = Math.round(deltaMi / 30) * 30;

      console.log("Resizing...")
      setTasks((prevTasks) =>
        prevTasks.map((t) => { 
          if(t.id !== actualId) return t;

          const newDuration = t.Duration + snappedMinutes;
          const newEndTime = new Date(t.EndTime.getTime() + newDuration * 60 * 1000);


          return { ...t, Duration: newDuration, EndTime: newEndTime }
        })
      )
    }
    else {
      // Handle regular task dragging (not resize)
      const deltaMinutes = delta.x / HOUR_WIDTH_PX;
      const snappedMinutes = Math.round(deltaMinutes / 15) * 15;

      setTasks((prevTasks) =>
        prevTasks.map((t) => {
          if (t.id.toString() !== taskId) return t;

          const newStart = new Date(t.startTime.getTime());
          newStart.setMinutes(newStart.getMinutes() + snappedMinutes);

          return { ...t, startTime: newStart };
        })
      );
    }
  }

  return (
    <div className="flex-1 flex flex-col dark:bg-[#1f1f1f] overflow-hidden m-0 p-0">
      {/* Date Navi */}
      <DateNavigation currentDate={currentDate} navigateDate={navigateDate} />

      {/* Time Labels */}
      <div className="flex border-b border-gray-200 dark:bg-[#1f1f1f]">
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
              className="text-xs text-center text-white-600 font-medium py-2 border-b"
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid With tasks */}

      <div
        className="flex-1 relative overflow-auto dark:bg-[#1f1f1f]"
        style={{
          minWidth: `${TOTAL_DISPLAY_HOURS * HOUR_WIDTH_PX}px`,
          backgroundSize: `${HOUR_WIDTH_PX}px 100%`,
          backgroundImage: `
            /* vertical hour lines */
            repeating-linear-gradient(
              to right,
              #3a3a3a,
              #3a3a3a 1px,
              transparent 1px,
              transparent ${HOUR_WIDTH_PX}px
            ),
            /* horizontal row lines every 40px to match task rows */
            repeating-linear-gradient(
              to bottom,
              #424242,
              #424242 1px,
              transparent 1px,
              transparent 40px
            )
          `,
        }}
      >
        <style jsx>{`
          /* Making sure the dark override applies */
          .dark .flex-1.relative {
            background-image: repeating-linear-gradient(
              to right,
              #3a3a3a
              #3a3a3a 1px,
              transparent 1px
              transparent ${HOUR_WIDTH_PX}px
            ),
            repeating-linear-gradient (
              to bottom,
              #424242
              #424242 1px,
              transparent 1px,
              transparent 40px
            );
          }
        `}</style>
        <DndContext
          sensors={sensors}
          onDragMove={handleDragMove}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToHorizontalAxis, snapToGrid]}
        >
          {tasks
            .map((task, index) => (
              <GantTask key={task.id} task={task} index={index} />
            ))}
        </DndContext>
        {/* Horizontal red line to show current time */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
          style={{ left: currentTimeLinePos }}
        >
          <div
            className="absolute -top-1 -left-1.5 w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
