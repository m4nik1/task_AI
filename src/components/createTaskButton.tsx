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
    const date = new Date().toISOString()

    const newTask: TaskDB = {
      id: -1,
      name: "New Task",
      dateCreated: new Date(date),
      startTime: currentDate,
      status: "Scheduled",
      Duration: 60, // Default duration
      EndTime: currentDate,
    };
    try {
      const res = await fetch("/api/addTask", {
        method: "POST",
        body: JSON.stringify(newTask),
      });

      const taskID = await res.json();
      console.log("task id from add task api: ", taskID);
      newTask.id = taskID.data;
      setTasks((prevTasks) => [...prevTasks, newTask]);
    } catch(e) {
      console.log(e)
    }
  }

  return (
    <button
      onClick={createNewTask}
      className="w-full cursor-pointer flex items-center gap-3 px-4 text-muted-foreground
                hover:bg-accent hover:text-accent-foreground transition-colors border-b border-border"
      style={{ height: "40px" }}
    >
      <div className="w-3 h-3 border border-dashed border-border rounded-full flex-shrink-0">
      </div>
      <p className="text-sm">Create Task</p>
    </button>
  );
}
