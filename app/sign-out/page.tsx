"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    const handleSignOut = async () => {
      await signOut({ redirect: false });
      router.push("/");
    };

    handleSignOut();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-slate-600">Signing out...</div>
    </div>
  );
}
