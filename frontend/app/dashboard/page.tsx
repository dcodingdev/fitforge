

"use client";

import Link from "next/link";
import { Brain, History, Trophy } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const displayName = user?.email ? user.email.split("@")[0] : "User";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 dark:text-slate-100">
          Welcome back, {displayName}.
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          Your AI-powered fitness journey continues.
        </p>
      </header>

      {/* Feature Cards */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <CardCompact
          icon={<Brain className="h-5 w-5 text-sky-600" />}
          title="Get AI Workout"
          description="Personalized training plans tailored to your goals and fitness level."
          cta={{ href: "/dashboard/recommend", label: "Recommend now", variant: "solid" }}
        />

        <CardCompact
          icon={<History className="h-5 w-5 text-slate-700 dark:text-slate-300" />}
          title="Workout History"
          description="View your past workouts and ratings to track progress."
          cta={{ href: "/dashboard/history", label: "View ratings", variant: "outline" }}
        />

        <CardCompact
          icon={<Trophy className="h-5 w-5 text-amber-500" />}
          title="Top Workouts"
          description="Explore community favorites and top-rated training sessions."
          cta={{ href: "/dashboard/top-workouts", label: "View rankings", variant: "accent" }}
        />
      </section>

      {/* Quick Tip */}
      <aside className="rounded-xl border border-slate-200 dark:border-slate-800 bg-linear-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Quick Tip
        </h4>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Rate each workout you complete to help the AI refine future recommendations.
        </p>
      </aside>
    </div>
  );
}

/* ---------- CardCompact ---------- */
function CardCompact({
  icon,
  title,
  description,
  cta,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: { href: string; label: string; variant?: "solid" | "outline" | "accent" };
}) {
  const base =
    "rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between shadow-sm transition hover:shadow-md";
  const buttonClass =
    cta.variant === "outline"
      ? "inline-flex items-center justify-center w-full text-sm font-medium px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      : cta.variant === "accent"
      ? "inline-flex items-center justify-center w-full text-sm font-medium px-3 py-2 rounded-md bg-amber-500 text-white hover:bg-amber-600 transition"
      : "inline-flex items-center justify-center w-full text-sm font-medium px-3 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition";

  return (
    <div className={base}>
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-slate-50 dark:bg-slate-800 p-2">{icon}</div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
      </div>

      <div className="mt-5">
        <Link href={cta.href} className={buttonClass}>
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
