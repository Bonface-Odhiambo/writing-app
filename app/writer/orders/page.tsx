"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardNav from "@/components/dashboard-nav";
import { Button } from "@/components/button";

interface Order {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: string;
  employerId: string;
  employerName: string;
}

export default function WriterOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"available" | "in_progress" | "completed">("available");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (session?.user?.role !== "writer") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?status=${filter}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, filter]);

  const handleAcceptOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "in_progress", writerId: session?.user?.id }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to accept order:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav role="writer" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Available Orders
          </h1>
          <p className="text-slate-600">Browse and accept writing orders</p>
        </div>

        <div className="mb-6 flex gap-4">
          <Button
            onClick={() => setFilter("available")}
            color={filter === "available" ? "blue" : "white"}
          >
            Available
          </Button>
          <Button
            onClick={() => setFilter("in_progress")}
            color={filter === "in_progress" ? "blue" : "white"}
          >
            In Progress
          </Button>
          <Button
            onClick={() => setFilter("completed")}
            color={filter === "completed" ? "blue" : "white"}
          >
            Completed
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-slate-600">Loading orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-slate-600">No orders found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {order.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {order.description}
                </p>
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div className="flex justify-between">
                    <span>Budget:</span>
                    <span className="font-semibold">Ksh {order.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deadline:</span>
                    <span className="font-semibold">{new Date(order.deadline).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Employer:</span>
                    <span className="font-semibold">{order.employerName}</span>
                  </div>
                </div>
                {filter === "available" && (
                  <Button
                    onClick={() => handleAcceptOrder(order.id)}
                    className="w-full"
                    color="blue"
                  >
                    Accept Order
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
