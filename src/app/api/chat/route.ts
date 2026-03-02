import { streamText, UIMessage, convertToModelMessages, tool, stepCountIs } from "ai";
import { groq } from "@ai-sdk/groq";
import z from "zod";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

  const result = streamText({
    model: groq("moonshotai/kimi-k2-instruct-0905"),
    messages: await convertToModelMessages(messages),
    tools: {
      getTasks: tool({
        description: 'list tasks for user',
        inputSchema: z.object({}),
        execute: async () => {
          return await convex.query(api.tasks.listTasks)
        }
      }),
      addTask: tool({
        description:'schedule tasks for user',
        inputSchema: z.object({
          name: z.string().describe('Name of the task'),
          startTime: z.string().describe('Start time of task in ISO timestamp'),
          endTime: z.string().describe("End time of task with ISO time stamp"),
          duration: z.number().describe('duration of task in minutes')

        }),
        execute: async ({ name, startTime, endTime, duration }) => {
          return await convex.mutation(api.tasks.createTask, { name: name, status: 'scheduled', startTime: startTime, endTime, duration: duration })
        }
      })
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
