"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardNav from "@/components/dashboard-nav";

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

export default function ChatListPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchChats();
    }
  }, [status]);

  const fetchChats = async () => {
    try {
      const response = await fetch("/api/chats");
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
    } finally {
      setLoading(false);
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
      <DashboardNav role={(session?.user?.role as "writer" | "employer" | "editor" | "admin") || "writer"} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Messages
          </h1>
          <p className="text-slate-600">View and manage your conversations</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-slate-600">Loading chats...</div>
          </div>
        ) : chats.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-slate-600">No conversations yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow divide-y divide-slate-200">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className="p-6 hover:bg-slate-50 cursor-pointer transition"
                onClick={() => router.push(`/chat/${chat.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        {chat.otherUserName}
                      </h3>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mb-1">
                      Order: {chat.orderTitle}
                    </p>
                    <p className="text-sm text-slate-500 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                  <div className="text-sm text-slate-500 ml-4">
                    {new Date(chat.lastMessageTime).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
