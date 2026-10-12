"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/button";
import DashboardNav from "@/components/dashboard-nav";

export default function EmployerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (session?.user?.role !== "employer") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome, {session?.user?.name}
          </h2>
          <p className="text-slate-600">Post orders and manage your writing projects</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Active Orders</h3>
            <p className="text-4xl font-bold text-blue-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Completed Orders</h3>
            <p className="text-4xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Total Spent</h3>
            <p className="text-4xl font-bold text-slate-900">Ksh 0</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">Post New Order</h3>
          </div>
          <div className="p-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Order Title
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Enter order title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  rows={4}
                  placeholder="Describe your order requirements"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Deadline
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Budget (Ksh)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="500"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" color="blue">
                Post Order
              </Button>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900">My Orders</h3>
          </div>
          <div className="p-6">
            <p className="text-slate-600">No orders posted yet. Create your first order above!</p>
          </div>
        </div>
      </main>
    </div>
  );
}
