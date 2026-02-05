import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listTasks = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("tasks").order("asc").collect();
  },
});

export const createTask = mutation({
  args: {
    name: v.string(),
    status: v.string(),
    startTime: v.string(),
    duration: v.number(),
    endTime: v.string(),
  },
  handler: async (ctx, args) => {
    const taskID = await ctx.db.insert("tasks", {
      name: args.name,
      status: args.status,
      startTime: args.startTime,
      duration: args.duration,
      endTime: args.endTime,
    });

    return taskID;
  },
});

export const updateTaskTimes = mutation({
  args: {
    id: v.id("tasks"),
    startTime: v.string(),
    Duration: v.number(),
    endTime: v.string(),
  },
  handler: async (ctx, args) => {
    console.log(await ctx.db.get("tasks", args.id));
    await ctx.db.patch("tasks", args.id, {
      startTime: args.startTime,
      duration: args.Duration,
      endTime: args.endTime,
    });
  },
});

export const rescheduleTask = mutation({
  args: { id: v.id("tasks"), startTime: v.string(), endTime: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch("tasks", args.id, {
      startTime: args.startTime,
      endTime: args.endTime,
    });
  },
});

export const renameTask = mutation({
  args: { id: v.id("tasks"), newName: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch("tasks", args.id, {
      name: args.newName,
    });
  },
});
