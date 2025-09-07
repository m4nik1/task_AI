import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
    try {
       console.log("Request has been received!")
       const reqData = await req.json();

       delete reqData.id;
       console.log("Req data has been recieved: ", reqData);

        const taskID = await prisma.userTasks.create({ 
            data: reqData,
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