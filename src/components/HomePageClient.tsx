"use client";

import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import GantGrid from "./gantt-grid";
import ChatPanel from "./ChatPanel";
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
      setCurrentTasks(tasks);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentDate]);

  if (!isClient || !currentDate) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 dark:bg-[#1f1f1f] dark:text-gray-100 w-full m-0 p-0">
      <div className="flex bg-gray-50 dark:bg-[#1f1f1f] w-full h-full min-h-0">
        <TaskList tasks={tasks} setTasks={setTasks} currentDate={currentDate} />
        <div className="flex-1 flex flex-col min-w-0 border-r border-gray-200 dark:border-gray-700 h-full">
          <GantGrid
            setTasks={setTasks}
            tasks={tasks}
            navigateDate={navigateDate}
            currentDate={currentDate}
          />
        </div>
        <div className="flex-shrink-0 h-full min-h-0">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
}
