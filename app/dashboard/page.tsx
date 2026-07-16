"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    } else if (status === "authenticated" && session?.user?.role) {
      const role = session.user.role;
      switch (role) {
        case "writer":
          router.push("/writer/dashboard");
          break;
        case "employer":
          router.push("/employer/dashboard");
          break;
        case "editor":
          router.push("/editor/dashboard");
          break;
        case "admin":
          router.push("/admin/dashboard");
          break;
        default:
          router.push("/sign-in");
      }
    }
  }, [status, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-slate-600">Redirecting to your dashboard...</div>
    </div>
  );
}
