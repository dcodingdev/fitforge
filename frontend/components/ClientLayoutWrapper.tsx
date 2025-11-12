"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();

  const isDashboard = pathname.startsWith("/dashboard");

  return (
    <>
      {user && isDashboard && <Navbar />}
      {isDashboard && <BackButton />}
      <main className="min-h-screen">{children}</main>
    </>
  );
}
