"use client";

import * as React from "react";
import { TaskConvex, TaskDB } from "../../types";
import { formatTime } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import moment from "moment";

interface TaskItemProps {
  task: TaskConvex;
  tasks: TaskConvex[];
  index: number;
  id: TaskDB["id"];
}

export default function TaskItem({ task, tasks, index }: TaskItemProps) {
  const [completeCheck, setCheck] = React.useState(false);

  const taskName = React.useRef<HTMLInputElement>(null);
  const updateTaskName = useMutation(api.tasks.renameTask);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // TODO: Update convex db with check mark
  function taskComplete(complete: boolean) {
    const newTasks = [...tasks];
    newTasks.splice(index, 1, task);
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
          updateTaskName({ id: task._id, newName: task.name });
        }

        newTasks.splice(index, 1, task);
      } catch (err) {
        console.log("We have an error");
        console.error(err);
      }
    } else if (e?.code == "Backspace" && taskName.current?.value == "") {
      const newTasks = [...tasks];
      newTasks.splice(index, 1);

      console.log("Deleting task...");

      // TODO: Add delete task
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
          <span>{formatTime(moment.utc(task.startTime).hour())}</span>
          <span className="mx-1">-</span>
          <span>
            {formatTime(moment.utc(task.startTime).hour() + task.duration / 60)}
          </span>
        </div>
      </div>
      <hr className="my-12 h-0.5 border-t-0 bg-amber-400" />
    </div>
  );
}
