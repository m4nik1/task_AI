import * as React from "react"
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { TaskDB } from "../../types";
import TaskItem from "./TaskItem";
import CreateTaskButton from "./createTaskButton";
import {
  arrayMove,
  SortableContext,
} from "@dnd-kit/sortable";

interface TaskListProps {
  tasks: TaskDB[];
  setTasks: React.Dispatch<React.SetStateAction<TaskDB[]>>;
  currentDate: Date;
}

export default function TaskList({
  tasks,
  setTasks,
  currentDate,
}: TaskListProps) {

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (String(active.id) !== String(over?.id)) {
      setTasks((prevTasks) => {
        const oldIndex = prevTasks.findIndex((t) => String(t.id) == String(active.id));
        const newIndex = prevTasks.findIndex((t) => String(t.id) == String(over?.id));
        const move = arrayMove(prevTasks, oldIndex, newIndex);

        return move;
      });
    }
  }

  return (
    <div className="w-80 flex-shrink-0 pt-[65px] bg-background border-r border-border flex flex-col">
      <div className="flex items-center px-4 h-[32.8px] border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          Tasks
        </h2>
      </div>

      <div className="flex-1 relative">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks.map(t => String(t.id))}
          >
            {tasks.map((t, index) => (
              <TaskItem
                id={t.id}
                key={t.id}
                task={t}
                tasks={tasks}
                index={index}
                setTasks={setTasks}
              />
            ))}
          </SortableContext>
        </DndContext>
        <CreateTaskButton
          currentDate={currentDate}
        />
      </div>
    </div>
  );
}
