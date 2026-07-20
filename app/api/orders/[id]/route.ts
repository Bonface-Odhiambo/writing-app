import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Order {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: string;
  employerId?: string;
  employerName?: string;
  writerId?: string | null;
  createdAt?: string;
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

    // Mock order data - replace with actual database query
    const order: Order = {
      id: params.id,
      title: "Essay on Climate Change",
      description: "Write a 1500-word essay on climate change effects",
      budget: 1500,
      deadline: "2026-07-20",
      status: "available",
      employerId: "emp1",
      employerName: "John Doe",
      writerId: null,
    };

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { status, writerId } = body;

    // Mock order update - replace with actual database update
    const updatedOrder = {
      id: params.id,
      status: status || "pending",
      writerId: writerId || null,
    };

    return NextResponse.json(updatedOrder);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
