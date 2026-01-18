import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Define your application schema here
// The better-auth component manages its own tables separately
export default defineSchema({
  // Add your application tables here as needed
  // Example:
  // users: defineTable({
  //   name: v.string(),
  //   email: v.string(),
  // }),
});
