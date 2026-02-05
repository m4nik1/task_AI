import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api"

interface CreateTaskProps {
  currentDate: Date;
}

export default function CreateTaskButton({
  currentDate,
}: CreateTaskProps) {
  const createTask = useMutation(api.tasks.createTask)

  async function createNewTask() {
    const newTask = {
      name: "New Task",
      startTime: currentDate.toISOString(),
      status: "Scheduled",
      duration: 60,
      endTime: currentDate.toISOString(),
    };

    try {
      const taskID = await createTask(newTask)
      console.log("task id from add task api: ", taskID);
    } catch (e) {
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
