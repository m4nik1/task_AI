import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req : NextRequest) {
    try {
       console.log("Request has been received!")
       const reqData = await req.json();
       const session = await auth.api.getSession({
        headers: await headers()
      })

       console.log("Session received: ", session?.user.id);
        delete reqData.id;
        console.log("Req data has been recieved: ", reqData);

        const taskID = await prisma.usertasks.create({ 
            data: {...reqData, user_id: session?.user.id },
            select: {
                id: true,
            }, 
        });

        return NextResponse.json({ data: taskID.id }, { status: 201 });
    } catch(err) {
        console.error(err)
        
        return NextResponse.json({error: "There was error adding task to the database. Please try again"},  { status: 500 })
    }
}