import { TaskDB } from "../../types";

interface CreateTaskProps {
  setTasks: React.Dispatch<React.SetStateAction<TaskDB[]>>;
  currentDate: Date;
}

export default function CreateTaskButton({
  setTasks,
  currentDate,
}: CreateTaskProps) {
  async function createNewTask() {
    const newTask: TaskDB = {
      id: -1,
      name: "New Task",
      startTime: currentDate,
      status: "Scheduled",
      Duration: 60, // Default duration
      EndTime: currentDate,
    };

    const res = await fetch("/api/addTask", {
      method: "POST",
      body: JSON.stringify(newTask)
    })

    const taskID = await res.json()

    newTask.id = taskID.data
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }

  return (
    <button
      onClick={createNewTask}
      className="w-full cursor-pointer flex items-center gap-3 px-4 text-gray-400
                hover-bg-gray-50 transition-colors border-b border-gray-100"
      style={{ height: "40px" }}
    >
      <div className="w-3 h-3 border border-dashed border-gray-300 rounded-full flex-shrink-0"></div>
      <p className="text-sm">Create Task</p>
    </button>
  );
}
