import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const listTasks = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("tasks").order("asc").collect();
  },
});

export const createTask = mutation({
  args: { name: v.string(), status: v.string(), startTime: v.string(), duration: v.number(), endTime: v.string() },
  handler: async (ctx, args) => {
    const taskID = await ctx.db.insert("tasks", {
      name: args.name,
      status: args.status,
      startTime: args.startTime,
      duration: args.duration,
      endTime: args.endTime
    });

    return taskID
  },
})
