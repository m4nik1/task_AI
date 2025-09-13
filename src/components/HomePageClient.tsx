"use client";

import { useState, useRef, useEffect } from "react";
import { useGanttDrag } from "../../hooks/use-gantt-drag";
import { TaskDB } from "../../types";
import TaskList from "./TaskList";
import GantGrid from "./gantt-grid";
import { DndContext } from "@dnd-kit/core";

interface HomeProps {
  taskDB: TaskDB[];
}

export default function HomePageClient({ taskDB }: HomeProps) {
  // Constants for Gantt chart scaling
  const HOUR_WIDTH_PX = 70; // Increased width to accommodate time labels better
  const START_HOUR_DISPLAY = 7; // Start time for the visible grid (7 AM)
  const END_HOUR_DISPLAY = 25; // End time for the visible grid (1 AM next day, 24 + 1 = 25)

  const gridRef = useRef<HTMLDivElement>(null!);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [tasks, setTasks] = useState<TaskDB[]>(taskDB);
  const [currentTasks, setCurrentTasks] = useState<TaskDB[]>([]);

  // const {
  //   isDragging,
  //   dragStartInfo,
  //   tempTask,
  //   handleMouseUp,
  //   handleMouseDown,
  // } = useGanttDrag({
  //   currentTasks,
  //   setCurrentTasks,
  //   gridRef,
  //   HOUR_WIDTH_PX,
  //   START_HOUR_DISPLAY,
  //   END_HOUR_DISPLAY,
  // });

  function checkingDates(date1: Date, date2: Date) {
    return (
      date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth()
    );
  }

  const tasksForDate = tasks.filter((t) =>
    checkingDates(new Date(t.startTime), currentDate),
  );

  const navigateDate = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    console.log("Tasks are filtered by date: ", currentTasks);
    setCurrentDate(newDate);
  };

  useEffect(() => {
    setCurrentTasks(tasksForDate);
  }, [currentDate]);

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex bg-gray-50">
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            currentDate={currentDate}
          />

          <GantGrid
            setTasks={setTasks}
            tasks={tasks}
            gridRef={gridRef}
            navigateDate={navigateDate}
            currentDate={currentDate}
          />
      </div>
    </div>
  );
}
