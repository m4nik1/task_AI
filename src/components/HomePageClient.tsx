"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import TaskList from "./TaskList";
import GantGrid from "./gantt-grid";
import ChatPanel from "./ChatPanel";
import { TaskDB } from "../../types";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function HomePageClient() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isChatHidden, setIsChatHidden] = useState(false);

  const [tasks, setTasks] = useState<TaskDB[]>([]);
  const convexTasks = useQuery(api.tasks.listTasks);
  const [currentTasks, setCurrentTasks] = useState<TaskDB[]>([]);

  useEffect(() => {
    setCurrentDate(new Date());
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (convexTasks) {
      const normalizedTasks = convexTasks.map((task) => ({
        ...task,
        id: task._id,
        startTime: new Date(task.startTime),
        EndTime: new Date(task.endTime),
        Duration: task.duration,
      }));
      setTasks(normalizedTasks);
    }
  }, [convexTasks]);

  function checkingDates(date1: Date, date2: Date) {
    return (
      date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth()
    );
  }

  const tasksForDate = useMemo(() => {
    if (!currentDate) return [];
    return tasks.filter((t) =>
      checkingDates(new Date(t.startTime), currentDate),
    );
  }, [currentDate, tasks]);

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
  }, [currentDate, tasksForDate]);

  if (!isClient || !currentDate) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 bg-background text-foreground w-full m-0 p-0">
      <div className="flex bg-background w-full h-full min-h-0">
        <TaskList tasks={tasks} setTasks={setTasks} currentDate={currentDate} />
        <div className="flex-1 flex flex-col min-w-0 border-r border-border h-full">
          <GantGrid
            setTasks={setTasks}
            tasks={tasks}
            navigateDate={navigateDate}
            currentDate={currentDate}
          />
        </div>
        <div className="flex-shrink-0 h-full min-h-0">
          {isChatHidden ? (
            <div className="h-full min-h-0 w-10 border-l border-white/10 bg-background/30 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center">
              <button
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/10 flex items-center justify-center"
                onClick={() => setIsChatHidden(false)}
                aria-label="Show chat panel"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <ChatPanel onHide={() => setIsChatHidden(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
