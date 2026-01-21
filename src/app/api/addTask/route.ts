import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@convex/_generated/api";

export async function POST(req: NextRequest) {
  console.log("Trying the post request")
  // try {
  //    console.log("Request has been received!")
  //    const reqData = await req.json();
  //    const user = await fetchAuthQuery(api.auth.getCurrentUser, {})
  //    if(!user?._id) {
  //      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  //    }
  //
  //    console.log("Session received: ", user?._id);
  //     delete reqData.id;
  //     console.log("Req data has been recieved: ", reqData);
  //
  //     const taskID = await prisma.usertasks.create({ 
  //         data: {...reqData, user_id: user?._id },
  //         select: {
  //             id: true,
  //         }, 
  //     });
  //
  //     return NextResponse.json({ data: taskID.id }, { status: 201 });
  // } catch(err) {
  //     console.error(err)
  //     if(err instanceof Error && err.message.includes("Unauthenticated")) {
  //       return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  //     }
  //
  //     return NextResponse.json({error: "There was error adding task to the database. Please try again"},  { status: 500 })
  // }
}
