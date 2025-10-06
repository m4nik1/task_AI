"use client";

import { useState, useEffect } from "react";
import TaskList from "./TaskList";
import GantGrid from "./gantt-grid";
import ChatPanel from "./ChatPanel";
import { TaskDB } from "../../types";
import { MessageCircle } from "lucide-react";

interface HomeProps {
  taskDB: TaskDB[];
}

export default function HomePageClient({ taskDB }: HomeProps) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);

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
      <div className="flex bg-gray-50 dark:bg-[#1f1f1f]">
        {isChatOpen && <ChatPanel onClose={() => setIsChatOpen(false)} />}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="fixed right-4 top-1/2 transform -translate-y-1/2 z-10 bg-blue-500 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-600 transition-colors"
            aria-label="Open chat"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
        )}
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