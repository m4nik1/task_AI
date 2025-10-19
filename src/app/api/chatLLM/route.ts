import { NextRequest, NextResponse } from "next/server";


export async function POST(req : NextRequest) {
    const reqJSON = await req.json()
    
    console.log("user message: ", JSON.stringify(reqJSON));

    // make the request to the server
    const response = await fetch("http://localhost:8000/chat_llm", {
        headers: {'Content-type':'application/json'},
        method: "POST",
        body: JSON.stringify(reqJSON)
    });
    
    const resJson = await response.json();
    
    return NextResponse.json(resJson, { status: 201 })
};