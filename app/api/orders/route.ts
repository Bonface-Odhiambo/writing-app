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

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const role = session.user?.role;

    // Mock data - replace with actual database queries
    let orders: Order[] = [];

    if (role === "writer") {
      orders = [
        {
          id: "1",
          title: "Essay on Climate Change",
          description: "Write a 1500-word essay on climate change effects",
          budget: 1500,
          deadline: "2026-07-20",
          status: "available",
          employerId: "emp1",
          employerName: "John Doe",
        },
      ];
    } else if (role === "employer") {
      orders = [
        {
          id: "1",
          title: "Essay on Climate Change",
          description: "Write a 1500-word essay on climate change effects",
          budget: 1500,
          deadline: "2026-07-20",
          status: "pending",
          writerId: null,
        },
      ];
    } else if (role === "admin") {
      orders = [
        {
          id: "1",
          title: "Essay on Climate Change",
          description: "Write a 1500-word essay on climate change effects",
          budget: 1500,
          deadline: "2026-07-20",
          status: "pending",
          employerId: "emp1",
          writerId: null,
        },
      ];
    }

    if (status) {
      orders = orders.filter((order) => order.status === status);
    }

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "employer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, deadline, budget } = body;

    if (!title || !description || !deadline || !budget) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Mock order creation - replace with actual database insertion
    const newOrder = {
      id: Date.now().toString(),
      title,
      description,
      deadline,
      budget,
      status: "available",
      employerId: session.user.id,
      employerName: session.user.name,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
