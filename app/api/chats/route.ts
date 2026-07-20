import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Chat {
  id: string;
  orderId: string;
  orderTitle: string;
  otherUserId: string;
  otherUserName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user?.role;

    // Mock data - replace with actual database queries
    let chats: Chat[] = [];

    if (role === "writer" || role === "employer") {
      chats = [
        {
          id: "chat1",
          orderId: "order1",
          orderTitle: "Essay on Climate Change",
          otherUserId: role === "writer" ? "emp1" : "writer1",
          otherUserName: role === "writer" ? "John Doe" : "Jane Smith",
          lastMessage: "I'll start working on this order",
          lastMessageTime: new Date().toISOString(),
          unreadCount: 1,
        },
      ];
    }

    return NextResponse.json(chats);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { orderId, recipientId } = body;

    if (!orderId || !recipientId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock chat creation - replace with actual database insertion
    const newChat = {
      id: `chat${Date.now()}`,
      orderId,
      recipientId,
      senderId: session.user?.id,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newChat, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
