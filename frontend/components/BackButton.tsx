


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const pathname = usePathname();

  // Show "Back to Dashboard" on dashboard subpages
  const showDashboardBack =
    pathname === "/dashboard/recommend" ||
    pathname === "/dashboard/history" ||
    pathname === "/dashboard/top-workouts";

  // Show "Back to Home" only on dashboard root
  const showHomeBack = pathname === "/dashboard";

  if (!showDashboardBack && !showHomeBack) return null;

  return (
    <div className="w-full border-b border-border bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3">
      {showDashboardBack ? (
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      ) : (
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      )}
    </div>
  );
}
