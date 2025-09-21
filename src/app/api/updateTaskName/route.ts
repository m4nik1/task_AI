import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
    const reqData = await req.json()

    console.log("Date Recieved")

    const result = await prisma.userTasks.update({
        where: { id: reqData.id },
        data: {
            name: reqData.name
        }
    })

    console.log("Name is updated: ", reqData)

    return NextResponse.json({ message: "Task has been updated!" }, { status: 201 });
}