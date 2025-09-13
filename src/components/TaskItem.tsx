"use client"

import { useRef, useState } from "react";
import { TaskDB } from "../../types";
import { formatTime } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskItemProps {
  setTasks: React.Dispatch<React.SetStateAction<TaskDB[]>>;
  task: TaskDB;
  tasks: TaskDB[];
  index: number;
  id: number;
}

export default function TaskItem({
  task,
  tasks,
  index,
  setTasks,
  id
}: TaskItemProps) {
  const [completeCheck, setCheck] = useState(false);
  const taskName = useRef<HTMLInputElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  function taskComplete(complete: boolean) {
    const newTasks = [...tasks];
    newTasks.splice(index, 1, task);
    setTasks(newTasks);
    setCheck(complete);
  }

  // Add update change to DB to fix the name of the task
  async function confirmTask(
    e: React.KeyboardEvent<HTMLInputElement> | undefined
  ) {
    if (e?.code == "Enter") {
      try {
        const newTasks = [...tasks];
        console.log(newTasks);
        task.name = taskName.current?.value || "";

        // This fixes the default value being set for the task ID
        const confirmedTask = await fetch("/api/addTask", {
          method: "POST",
          body: JSON.stringify(task),
        });

        const taskID = await confirmedTask.json();

        console.log("Confirmed: ", taskID.data);
        task.id = taskID.data;
        newTasks.splice(index, 1, task);
        setTasks(newTasks);
        console.log("tasks: ", tasks);
      } catch (err) {
        console.log("We have an error");
        console.error(err);
      }
    } else if (
      e?.code == "Backspace" &&
      (taskName.current?.valueOf.toString() || "") === ""
    ) {
      console.log("Deleting task");
      const newTasks = [...tasks];
      // setTasks(newTasks.splice(index, 1, task))
      newTasks.splice(index, 1);

      fetch("/api/deleteTask", {
        method: "POST",
        body: JSON.stringify(task),
      });

      setTasks(newTasks);
    }
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="flex items-center gap-3 px-4 cursor-move
            border-b border-gray-250 hover:bg-gray-50"
      style={{...style, height: "40px" }}
    >
      <input
        type="checkbox"
        onChange={(e) => taskComplete(e.target.checked)}
        className="w-3 h-3 border border-dashed border-gray-300 rounded-full flex-shrink-0"
        placeholder="New Task"
      />
      <div className="flex-grow min-w-0">
        <input
          className={`text-sm font-medium text-gray-900 truncate ${
            completeCheck ? "line-through" : ""
          }`}
          onKeyDown={confirmTask}
          placeholder="New Task"
          defaultValue={task.name}
          ref={taskName}
        />
        <div className="flex items-center text-xs background-gray mt-0.5">
          <span>{formatTime(task.startTime.getHours())}</span>
          <span className="mx-1">-</span>
          <span>
            {formatTime(task.startTime.getHours() + task.Duration / 60)}
          </span>
        </div>
      </div>
      <hr className="my-12 h-0.5 border-t-0 bg-amber-400" />
    </div>
  );
}
