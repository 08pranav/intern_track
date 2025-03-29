import { NextResponse } from "next/server";
import { auth } from "@/lib/firebase";

interface ChatRequest {
  message: string;
  userId: string;
}

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json() as ChatRequest;

    if (!message || !userId) {
      return NextResponse.json({ error: "Message and userId are required" }, { status: 400 });
    }

    if (!auth) {
      return NextResponse.json({ error: "Firebase auth not initialized" }, { status: 500 });
    }

    const user = auth.currentUser;
    if (!user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    if (user.uid !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // ... existing code ...
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
} 