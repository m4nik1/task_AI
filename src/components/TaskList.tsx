import { TaskDB } from "../../types";
import TaskItem from "./TaskItem";
import CreateTaskButton from "./createTaskButton";

interface TaskListProps {
  tasks: TaskDB[];
  setTasks: React.Dispatch<React.SetStateAction<TaskDB[]>>;
  setDraggedTask: (id: string | null) => void;
  setDraggedTaskIndex: (index: number | null) => void;
  dragStartInfo: { taskId: string | null } | null;
  currentDate: Date;
}

export default function TaskList({
  tasks,
  setTasks,
  setDraggedTask,
  setDraggedTaskIndex,
  currentDate,
}: TaskListProps) {
  return (
    <div className="w-80 flex-shrink-0 pt-15 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
      </div>

      <div className="flex-1 relative bg-white">
        {tasks.map((task, index) => (
          <TaskItem
            key={index}
            task={task}
            tasks={tasks}
            index={index}
            setTasks={setTasks}
            setDraggedTask={setDraggedTask}
            setDraggedTaskIndex={setDraggedTaskIndex}
          />
        ))}
        <CreateTaskButton
          setTasks={setTasks}
          tasks={tasks}
          currentDate={currentDate}
        />
      </div>
    </div>
  );
}
