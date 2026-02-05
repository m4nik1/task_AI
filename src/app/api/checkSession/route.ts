import { fetchAuthQuery } from "@/lib/auth-server";
import { api } from "@convex/_generated/api";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const user = await fetchAuthQuery(api.auth.getCurrentUser, {})
      return NextResponse.json({
          data: JSON.stringify(user),
          status: 201
      })
    } catch {
      return NextResponse.json({
        data: null,
        status: 201
     })
    }

}