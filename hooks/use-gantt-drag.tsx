"use client";

import {
  useState,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { TaskDB } from "../types";
import { getHourFromX } from "@/lib/utils";

interface DragStartInfo {
  startX: number;
  startHour: number;
  taskId: string | null;
  isResizing: boolean;
  initialDuration?: number;
  initialStartHour?: number;
}

interface DragEndInfo {
  task: TaskDB;
}

interface UseGanttDragProps {
  currentTasks: TaskDB[];
  setCurrentTasks: React.Dispatch<React.SetStateAction<TaskDB[]>>;
  gridRef: RefObject<HTMLDivElement>;
  HOUR_WIDTH_PX: number;
  START_HOUR_DISPLAY: number;
  END_HOUR_DISPLAY: number;
}

export function useGanttDrag({
  currentTasks,
  setCurrentTasks,
  gridRef,
  HOUR_WIDTH_PX,
  START_HOUR_DISPLAY,
  END_HOUR_DISPLAY,
}: UseGanttDragProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartInfo, setDragStartInfo] = useState<DragStartInfo | null>(
    null,
  );
  const updatedTask = useRef<TaskDB | null>(null);
  const [tempTask, setTempTask] = useState<Omit<TaskDB, "id"> | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) {
        return;
      }
      const target = e.target as HTMLElement;
      const taskId = target.dataset.taskId;
      const isResizer = target.classList.contains("task-resizer");

      if (taskId && gridRef.current) {
        const task = currentTasks.find((t) => t.id?.toString() == taskId);

        if (task) {
          setIsDragging(true);
          setDragStartInfo({
            startX: e.clientX,
            startHour: task.startTime.getHours(), // Initial start hour of the task
            taskId: taskId.toString(),
            isResizing: isResizer,
            initialDuration: task.Duration / 60,
            initialStartHour:
              task.startTime.getHours() + task.startTime.getMinutes() / 60,
          });
          setDragOffset(0);
        }
      }
    },
    [currentTasks, gridRef],
  );

  // When the mouse is moving just get the event's x and drag start x
  // This only happens if mouse is clicked over a task and moving
  // Then calculate the offset of hours of that task
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !dragStartInfo || !gridRef.current) return;

      const deltaX = e.clientX - dragStartInfo.startX;
      const deltaHours = deltaX / HOUR_WIDTH_PX;

      setDragOffset(deltaHours);

      setCurrentTasks((prev) =>
        prev.map((task) => {
          if (task.id?.toString() == dragStartInfo.taskId) {
            if (dragStartInfo.isResizing) {
              // -- Resizing --
              const newDuration = Math.max(
                0.5,
                dragStartInfo.initialDuration! + dragOffset,
              );

              const newDurationMinutes = newDuration * 60;
              const newEndTime = new Date(
                task.startTime.getTime() + newDurationMinutes * 60 * 1000,
              );
              updatedTask.current = {
                ...task,
                Duration: newDurationMinutes,
                EndTime: newEndTime,
              };
              return updatedTask.current;
            } else {
              // --- Dragging ---
              let newStartHour = dragStartInfo.initialStartHour! + dragOffset;

              newStartHour = Math.round(newStartHour * 4) / 4;

              // Constrain
              newStartHour = Math.max(START_HOUR_DISPLAY, newStartHour);
              const taskDurationHours = task.Duration / 60;
              if (newStartHour + taskDurationHours > END_HOUR_DISPLAY) {
                newStartHour = END_HOUR_DISPLAY - taskDurationHours;
              }

              const newStartTime = new Date(task.startTime);
              newStartTime.setHours(Math.floor(newStartHour));
              newStartTime.setMinutes((newStartHour % 1) * 60);

              const newEndTime = new Date(
                newStartTime.getTime() + task.Duration * 60 * 1000,
              );

              updatedTask.current = {
                ...task,
                startTime: newStartTime,
                EndTime: newEndTime,
              };
              return updatedTask.current;
            }
          }
          return task;
        }),
      );
    },
    [
      isDragging,
      dragStartInfo,
      HOUR_WIDTH_PX,
      gridRef,
      START_HOUR_DISPLAY,
      dragOffset,
      setCurrentTasks,
      END_HOUR_DISPLAY,
    ],
  );

  // When the mouse is up we will stop the dragging and set the task stuff
  const handleMouseUp = useCallback(async () => {
    // if (isDragging && dragStartInfo) {

    // }
    if (updatedTask.current) {
      console.log("Final updated task: ", updatedTask.current);
      //   const response = await fetch("/api/updateTask", {
      //     method: "POST",
      //     body: JSON.stringify(updatedTask.current),
      //   });
    }
    setIsDragging(false);
    setDragStartInfo(null);
    setDragOffset(0);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    dragStartInfo,
    tempTask,
    handleMouseDown,
    handleMouseUp,
  };
}
