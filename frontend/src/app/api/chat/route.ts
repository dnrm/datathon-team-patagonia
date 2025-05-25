import { OpenAI } from "openai";
import { NextResponse } from "next/server";

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Messages are required and must be an array" },
        { status: 400 }
      );
    }

    // Validate that the OPENAI_API_KEY is set
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    // Call the OpenAI API with the o4-mini model
    const response = await openai.chat.completions.create({
      model: "o4-mini",
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    // Return the response from OpenAI
    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      {
        error:
          error.message || "An error occurred while processing your request",
      },
      { status: 500 }
    );
  }
}
