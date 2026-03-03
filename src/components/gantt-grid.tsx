"use client";
import { TaskDB } from "../../types";
import { getXFromHour } from "@/lib/utils";
import GantTask from "./gantTask";
import DateNavigation from "./DateNavigation";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  restrictToHorizontalAxis,
  createSnapModifier,
} from "@dnd-kit/modifiers";
import { api } from "../../convex/_generated/api";
import { useMutation } from "convex/react";

interface gantGridProps {
  tasks: TaskDB[];
  navigateDate: (direction: number) => void;
  currentDate: Date;
}

export default function GantGrid({
  tasks,
  navigateDate,
  currentDate,
}: gantGridProps) {
  const HOUR_WIDTH_PX = 70; // Pixels per hour
  const MOVE_SNAP_MINUTES = 15;
  const RESIZE_SNAP_MINUTES = 30;
  const MIN_TASK_DURATION_MINUTES = 30;
  const START_HOUR_DISPLAY = 7; // Start time for the visible grid (7 AM)
  const END_HOUR_DISPLAY = 24; // End time for the visible grid (2 AM next day, 24 + 2 = 26)
  const TOTAL_DISPLAY_HOURS = END_HOUR_DISPLAY - START_HOUR_DISPLAY;
  const TOTAL_DISPLAY_COLUMNS = TOTAL_DISPLAY_HOURS + 1;

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

  const updateTaskTimes = useMutation(api.tasks.updateTaskTimes);
  const rescheduleTask = useMutation(api.tasks.rescheduleTask);

  const snapToGrid = createSnapModifier(
    (HOUR_WIDTH_PX * MOVE_SNAP_MINUTES) / 60,
  );

  function snapDeltaMinutes(deltaX: number, snapMinutes: number) {
    const deltaMinutes = deltaX * (60 / HOUR_WIDTH_PX);
    return Math.round(deltaMinutes / snapMinutes) * snapMinutes;
  }

  async function handleDragEnd({ active, delta }: DragEndEvent) {
    const taskId = String(active.id);
    let taskData;

    if (taskId.startsWith("resize-")) {
      const actualId = taskId.replace("resize-", "");
      const task = tasks.find((t) => String(t.id) === actualId);

      if (!task) return;

      const snappedMinutes = snapDeltaMinutes(delta.x, RESIZE_SNAP_MINUTES);
      const newDuration = Math.max(
        MIN_TASK_DURATION_MINUTES,
        task.Duration + snappedMinutes,
      );
      const newEndTime = new Date(task.startTime.getTime());
      newEndTime.setMinutes(newEndTime.getMinutes() + newDuration);

      taskData = {
        id: task.id,
        startTime: task.startTime.toISOString(),
        Duration: newDuration,
        endTime: newEndTime.toISOString(),
      };

      if (taskData) {
        await updateTaskTimes(taskData);
      }
    }
    // If we are not resizing then we are moving the task
    else {
      const task = tasks.find((t) => String(t.id) === taskId);

      if (!task) return;

      const snappedMinutes = snapDeltaMinutes(delta.x, MOVE_SNAP_MINUTES);
      const newStart = new Date(task.startTime.getTime());
      newStart.setMinutes(newStart.getMinutes() + snappedMinutes);

      const newEndTime = new Date(newStart.getTime());
      newEndTime.setMinutes(newEndTime.getMinutes() + task.Duration);

      taskData = {
        id: task.id,
        startTime: newStart.toISOString(),
        endTime: newEndTime.toISOString(),
      };

      if (taskData) {
        await rescheduleTask(taskData);
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background m-0 p-0 min-h-0">
      {/* Date Navi */}
      <DateNavigation currentDate={currentDate} navigateDate={navigateDate} />

      <div className="flex-1 flex flex-col overflow-x-auto min-h-0">
        <div className="min-w-max flex flex-col min-h-0 h-full">
          {/* Time Labels */}
          <div className="flex border-b border-border/50 bg-muted/30">
            <div
              className="grid"
              style={{
                gridTemplateColumns: `repeat(${TOTAL_DISPLAY_COLUMNS}, ${HOUR_WIDTH_PX}px)`,
                minWidth: `${TOTAL_DISPLAY_COLUMNS * HOUR_WIDTH_PX}px`,
              }}
            >
              {timeLabels.map((label, index) => (
                <div
                  key={index}
                  className="text-xs text-center text-muted-foreground font-semibold py-3 border-r border-border/30 last:border-r-0"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Main Grid With tasks */}

          <div
            className="flex-1 relative overflow-y-auto bg-muted/20 min-h-0 h-full"
            style={{
              minWidth: `${TOTAL_DISPLAY_COLUMNS * HOUR_WIDTH_PX}px`,
              backgroundSize: `${HOUR_WIDTH_PX}px 48px`,
              backgroundImage: `
            repeating-linear-gradient(
              to right,
              var(--border),
              var(--border) 1px,
              transparent 1px,
              transparent ${HOUR_WIDTH_PX}px
            ),
            repeating-linear-gradient(
              to bottom,
              var(--border),
              var(--border) 1px,
              transparent 1px,
              transparent 48px
            )
          `,
            }}
          >
            <DndContext
              sensors={sensors}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToHorizontalAxis, snapToGrid]}
            >
              {tasks.map((task, index) => (
                <GantTask key={task.id} task={task} index={index} />
              ))}
            </DndContext>
            {/* Current time indicator */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10 shadow-sm"
              style={{ left: currentTimeLinePos }}
            >
              <div className="absolute -top-0.5 -left-1 w-2.5 h-2.5 bg-red-500 rounded-full shadow-md" />
              <div className="absolute -top-0.5 -left-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping opacity-75" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
