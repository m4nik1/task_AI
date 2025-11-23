import { NextRequest, NextResponse } from "next/server";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  const reqJSON = await req.json();
  console.log('user message: ', reqJSON)

  // Make the request to the server
  const response = await fetch("http://localhost:8000/llm_context", {
    headers: {
      "Content-type": "application/json"
    },
    method: "POST",
    body: JSON.stringify(reqJSON),
  });

  console.log("response: ", response)

  if (!response.body) {
    return NextResponse.json("There was no server body", { status: 500 });
  }

  const readerStream = response.body.getReader();
  console.log("Stream: ", readerStream);

  const readableStream = new ReadableStream({
    start(controller) {
      function pump() {
        readerStream.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          // console.log("Value from LLM: ", value);
          controller.enqueue(value);
          pump();
        });
      }
      pump();
    },
  });

  return new Response(readableStream, {
    status: 201,
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
