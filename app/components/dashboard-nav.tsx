"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./button";

interface DashboardNavProps {
  role: "writer" | "employer" | "editor" | "admin";
}

export default function DashboardNav({ role }: DashboardNavProps) {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  const getNavLinks = () => {
    switch (role) {
      case "writer":
        return [
          { label: "Dashboard", href: "/writer/dashboard" },
          { label: "Available Orders", href: "/writer/orders" },
          { label: "My Orders", href: "/writer/my-orders" },
          { label: "Profile", href: "/writer/profile" },
        ];
      case "employer":
        return [
          { label: "Dashboard", href: "/employer/dashboard" },
          { label: "Post Order", href: "/employer/orders/new" },
          { label: "My Orders", href: "/employer/orders" },
          { label: "Profile", href: "/employer/profile" },
        ];
      case "editor":
        return [
          { label: "Dashboard", href: "/editor/dashboard" },
          { label: "Pending Reviews", href: "/editor/reviews" },
          { label: "Completed", href: "/editor/completed" },
          { label: "Profile", href: "/editor/profile" },
        ];
      case "admin":
        return [
          { label: "Dashboard", href: "/admin/dashboard" },
          { label: "Users", href: "/admin/users" },
          { label: "Orders", href: "/admin/orders" },
          { label: "Settings", href: "/admin/settings" },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <span className="text-xl font-bold text-slate-900">
              Eclipse Writers
            </span>
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => router.push(link.href)}
                  className="text-slate-600 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">
              {session?.user?.name}
            </span>
            <Button onClick={handleSignOut} color="blue">
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
