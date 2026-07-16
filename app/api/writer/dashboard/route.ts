import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "writer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Mock data - replace with actual database queries
    const data = {
      activeOrders: 0,
      completedOrders: 0,
      totalEarnings: 0,
      availableOrders: [],
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
