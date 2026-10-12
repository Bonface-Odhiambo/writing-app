import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: string;
  timestamp: string;
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chatId = params.id;

    // Mock data - replace with actual database query
    const messages: Message[] = [
      {
        id: "msg1",
        chatId,
        senderId: "writer1",
        senderName: "Jane Smith",
        content: "I'll start working on this order",
        messageType: "text",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: "msg2",
        chatId,
        senderId: "emp1",
        senderName: "John Doe",
        content: "Great, let me know if you need any clarification",
        messageType: "text",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
      },
    ];

    return NextResponse.json(messages);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, messageType = "text" } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    const chatId = params.id;

    // Mock message creation - replace with actual database insertion
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      chatId,
      senderId: session.user?.id || "",
      senderName: session.user?.name || "User",
      content,
      messageType,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(newMessage, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
