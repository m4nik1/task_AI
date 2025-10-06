import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const reqData = await req.json()

    const result = await prisma.usertasks.delete({
        where: {
            id: reqData.id,
        },
    })

    console.log("result: ", result)

    return NextResponse.json({ message: "Task has been Deleted!" }, { status: 201 })
}