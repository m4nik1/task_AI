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
      })
    },
    stopWhen: stepCountIs(5),
  });

  return result.toUIMessageStreamResponse();
}
