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
  writerId: string | null;
  createdAt: string;
}

export default function EmployerOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "in_progress" | "completed">("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (session?.user?.role !== "employer") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  const fetchOrders = async () => {
    try {
      const statusFilter = filter === "all" ? "" : filter;
      const response = await fetch(`/api/orders?status=${statusFilter}`);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
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
      <DashboardNav role="employer" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              My Orders
            </h1>
            <p className="text-slate-600">Manage your posted orders</p>
          </div>
          <Button
            onClick={() => router.push("/employer/orders/new")}
            color="blue"
          >
            Post New Order
          </Button>
        </div>

        <div className="mb-6 flex gap-4">
          <Button
            onClick={() => setFilter("all")}
            color={filter === "all" ? "blue" : "white"}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter("pending")}
            color={filter === "pending" ? "blue" : "white"}
          >
            Pending
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
            <p className="text-slate-600 mb-4">No orders found.</p>
            <Button
              onClick={() => router.push("/employer/orders/new")}
              color="blue"
            >
              Post Your First Order
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Deadline
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {order.title}
                      </div>
                      <div className="text-sm text-slate-500 truncate max-w-xs">
                        {order.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      Ksh {order.budget}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(order.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
