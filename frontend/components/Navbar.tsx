

"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, Dumbbell, User } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-border bg-white dark:bg-gray-900/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            FitForge
          </span>
        </Link>

        {/* User Info + Profile + Logout */}
        {user && (
          <div className="flex items-center gap-5">
            <span className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
              {user.email}
            </span>

            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">Profile</span>
            </Link>

            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
