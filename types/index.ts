import type { Id } from "../convex/_generated/dataModel";

export interface Task {
  id: string
  name: string
  startHour: number // e.g., 9.5 for 9:30 AM
  durationHours: number // e.g., 1.0 for 1 hour
  color: string
}

export interface TaskDB {
  id: Id<"tasks">
  name: string
  status: string
  startTime: Date
  Duration: number
  EndTime: Date
}
