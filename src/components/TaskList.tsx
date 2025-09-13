import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { TaskDB } from "../../types";
import TaskItem from "./TaskItem";
import CreateTaskButton from "./createTaskButton";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

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

  const sensors = useSensors(
    useSensor(PointerSensor)
  )

  function handleDragEnd(event) {
    const {active, over} = event

    if(active.id !== over.id) {
      setTasks((prevTasks) => {
        const oldIndex = prevTasks.indexOf(active.id)
        const newIndex = prevTasks.indexOf(over.id)

        return arrayMove(tasks, oldIndex, newIndex);
      })
    }
  }

  return (
    <div className="w-80 flex-shrink-0 pt-15 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
      </div>

      <div className="flex-1 relative bg-white">
        <DndContext
          sensors={sensors}
          // collisionDetection={} It should be rectBoundry
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={tasks}
            strategy={verticalListSortingStrategy}
          >
            {tasks.map((task, index) => (
              <TaskItem
                key={index}
                task={task}
                tasks={tasks}
                index={index}
                setTasks={setTasks}
              />
            ))}
          </SortableContext>
        </DndContext>
        <CreateTaskButton
          setTasks={setTasks}
          tasks={tasks}
          currentDate={currentDate}
        />
      </div>
    </div>
  );
}
