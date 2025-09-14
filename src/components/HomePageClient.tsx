"use client";

import { useState, useEffect } from "react";
import TaskList from "./TaskList";
import GantGrid from "./gantt-grid";
import { TaskDB } from "../../types";

interface HomeProps {
  taskDB: TaskDB[];
}

export default function HomePageClient({ taskDB }: HomeProps) {
  // Constants for Gantt chart scaling
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
    checkingDates(new Date(t.startTime), currentDate)
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
        <TaskList tasks={tasks} setTasks={setTasks} currentDate={currentDate} />

        <GantGrid
          setTasks={setTasks}
          tasks={tasks}
          navigateDate={navigateDate}
          currentDate={currentDate}
        />
      </div>
    </div>
  );
}
