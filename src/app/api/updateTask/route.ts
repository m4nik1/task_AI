import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function  POST(req : NextRequest) {
    const reqData = await req.json()

    console.log("Data: ", reqData);

    // const result = await prisma.userTasks.update({
        // where: { id: reqData.id, },
        // data: {
            // startTime: reqData.startTime,
            // EndTime: reqData.EndTime,
            // Duration: reqData.Duration,
            // status: reqData.status
        // }
    // })

    // console.log("Result: ", result)

    return NextResponse.json({ message: "Task has been updated!" }, { status: 201 })
}