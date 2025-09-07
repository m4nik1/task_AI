import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const getSession = await auth.api.getSession({
      headers: await headers()
    })

    if(!getSession) {
      return NextResponse.json({
        data: null,
        status: 201
     })
    }
    else {
      return NextResponse.json({
          data: JSON.stringify(getSession),
          status: 201
      })
    }

}