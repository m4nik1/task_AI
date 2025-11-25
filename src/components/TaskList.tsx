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
  verticalListSortingStrategy,
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

    if (active.id !== over?.id) {
      setTasks((prevTasks) => {
        const oldIndex = prevTasks.findIndex((t) => t.id == active.id);
        const newIndex = prevTasks.findIndex((t) => t.id == over?.id);
        const move = arrayMove(prevTasks, oldIndex, newIndex);

        return move;
      });
    }
  }

  return (
    <div className="w-80 flex-shrink-0 pt-15 dark:bg-[#1f1f1f] border-r border-gray-200 flex flex-col">
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-white dark:text-white">
          Tasks
        </h2>
      </div>

      <div className="flex-1 relative">
        <DndContext
          sensors={sensors}
          // collisionDetection={} It should be rectBoundry
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          {/* @ts-expect-error To ignore a stupid ts error */}
          <SortableContext
            items={tasks.map(t => t.id)}
            strategy={verticalListSortingStrategy}
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
          setTasks={setTasks}
          currentDate={currentDate}
        />
      </div>
    </div>
  );
}
