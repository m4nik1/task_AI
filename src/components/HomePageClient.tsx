"use client";

import { useState, useEffect } from "react";
import TaskList from "./TaskList";
import GantGrid from "./gantt-grid";
import { TaskDB } from "../../types";

interface HomeProps {
  taskDB: TaskDB[];
}

export default function HomePageClient({ taskDB }: HomeProps) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [tasks, setTasks] = useState<TaskDB[]>(taskDB);
  const [currentTasks, setCurrentTasks] = useState<TaskDB[]>([]);

  useEffect(() => {
    setCurrentDate(new Date());
    setIsClient(true);
  }, []);

  function checkingDates(date1: Date, date2: Date) {
    return (
      date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth()
    );
  }

  const tasksForDate = currentDate
    ? tasks.filter((t) => checkingDates(new Date(t.startTime), currentDate))
    : [];

  const navigateDate = (direction: number) => {
    if (!currentDate) return;
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + direction);
    console.log("Tasks are filtered by date: ", currentTasks);
    setCurrentDate(newDate);
  };

  useEffect(() => {
    if (currentDate) {
      setCurrentTasks(tasksForDate);
    }
  }, [currentDate]);

  if (!isClient || !currentDate) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen dark:bg-[#1f1f1f] dark:text-gray-100">
      <div className="flex-1 flex bg-gray-50 dark:bg-[#1f1f1f]">
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
