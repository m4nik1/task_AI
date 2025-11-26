import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req : NextRequest) {
    const reqData = await req.json()

    await prisma.usertasks.update({
        where: { id: reqData.id },
        data: {
            startTime: reqData.startTime,
            EndTime: reqData.EndTime,
        }
    })

    return NextResponse.json({ message: "Task has been updated!" }, { status: 201 })
}