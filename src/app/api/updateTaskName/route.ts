import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req : NextRequest) {
    const reqData = await req.json()

    console.log("Date Recieved")

    const result = await prisma.usertasks.update({
        where: { id: reqData.id },
        data: {
            name: reqData.name
        }
    })

    console.log("Name is updated: ", result)

    return NextResponse.json({ message: "Task Name has been updated!" }, { status: 201 });
}