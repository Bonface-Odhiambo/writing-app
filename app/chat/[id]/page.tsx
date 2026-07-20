"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import DashboardNav from "@/components/dashboard-nav";
import { Button } from "@/components/button";

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  messageType: string;
  timestamp: string;
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchMessages();
    }
  }, [status, params.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/chats/${params.id}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || sending) return;

    setSending(true);
    try {
      const response = await fetch(`/api/chats/${params.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageInput }),
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages([...messages, newMessage]);
        setMessageInput("");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSending(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  const isOwnMessage = (message: Message) => message.senderId === session?.user?.id;

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardNav role={(session?.user?.role as "writer" | "employer" | "editor" | "admin") || "writer"} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow h-[calc(100vh-200px)] flex flex-col">
          <div className="border-b border-slate-200 p-4">
            <h1 className="text-xl font-semibold text-slate-900">Chat</h1>
            <p className="text-sm text-slate-600">Order: Essay on Climate Change</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-slate-600">Loading messages...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-slate-600">No messages yet. Start the conversation!</div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage(message) ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                      isOwnMessage(message)
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 text-slate-900"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1 opacity-75">
                      {message.senderName}
                    </div>
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs mt-1 opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200 p-4">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                disabled={sending}
              />
              <Button
                type="submit"
                disabled={sending || !messageInput.trim()}
                color="blue"
              >
                {sending ? "Sending..." : "Send"}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
