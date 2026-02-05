"use client";

import * as React from "react";
import { TaskDB } from "../../types";
import { formatTime } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
interface TaskItemProps {
  setTasks: React.Dispatch<React.SetStateAction<TaskDB[]>>;
  task: TaskDB;
  tasks: TaskDB[];
  index: number;
  id: TaskDB["id"];
}

export default function TaskItem({
  task,
  tasks,
  index,
  setTasks,
}: TaskItemProps) {
  const [completeCheck, setCheck] = React.useState(false);

  const taskName = React.useRef<HTMLInputElement>(null);
  const updateTaskName = useMutation(api.tasks.renameTask);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  function taskComplete(complete: boolean) {
    const newTasks = [...tasks];
    newTasks.splice(index, 1, task);
    setTasks(newTasks);
    setCheck(complete);
  }

  // Add update change to DB to fix the name of the task
  async function confirmTask(
    e: React.KeyboardEvent<HTMLInputElement> | undefined,
  ) {
    if (e?.code == "Enter") {
      try {
        const newTasks = [...tasks];
        task.name = taskName.current?.value || "";

        if (task) {
          updateTaskName({ id: task.id, newName: task.name });
        }

        newTasks.splice(index, 1, task);
        setTasks(newTasks);
      } catch (err) {
        console.log("We have an error");
        console.error(err);
      }
    } else if (e?.code == "Backspace" && taskName.current?.value == "") {
      console.log("Deleting task");
      const newTasks = [...tasks];
      // setTasks(newTasks.splice(index, 1, task))
      newTasks.splice(index, 1);

      // const response = await fetch("/api/deleteTask", {
      //   method: "POST",
      //   body: JSON.stringify(task),
      // });

      console.log("Deleting task...");

      setTasks(newTasks);
    }
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="flex items-center gap-3 px-4 cursor-move
            border-b border-border hover:bg-accent/50"
      style={{ ...style, height: "48px" }}
    >
      <input
        type="checkbox"
        onChange={(e) => taskComplete(e.target.checked)}
        className="w-3 h-3 border border-dashed border-border rounded-full flex-shrink-0"
        placeholder="New Task"
      />
      <div className="flex-grow min-w-0">
        <input
          className={`text-sm font-medium bg-transparent text-foreground truncate ${
            completeCheck ? "line-through" : ""
          }`}
          onKeyDown={confirmTask}
          placeholder="New Task"
          ref={taskName}
          defaultValue={task.name}
          onPointerDownCapture={(e) => e.stopPropagation()}
          onMouseDownCapture={(e) => e.stopPropagation()}
          onTouchStartCapture={(e) => e.stopPropagation()}
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
