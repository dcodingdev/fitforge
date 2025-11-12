

"use client";

import Link from "next/link";
import { Dumbbell, Sparkles, Brain, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-sky-600" />
            <span className="font-semibold text-lg text-slate-900 dark:text-slate-100">
              FitForge
            </span>
          </div>
          <div className="flex gap-4 text-sm font-medium">
            <Link
              href="/login"
              className="text-slate-700 dark:text-slate-300 hover:text-sky-600 transition"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="text-white bg-sky-600 hover:bg-sky-700 px-3 py-2 rounded-md transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 bg-linear-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-3xl space-y-6">
          <div className="flex justify-center">
            <Sparkles className="h-10 w-10 text-amber-400" />
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white">
            AI-Powered Workouts. <br />
            Built for <span className="text-sky-600">You.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
            FitForge creates customized fitness plans using AI to match your goals,
            equipment, and experience level.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-sky-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-sky-700 transition"
            >
              <Brain className="h-5 w-5" /> Launch AI Coach
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold px-6 py-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Learn More <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Why Choose FitForge?
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Brain className="h-6 w-6 text-sky-600" />}
              title="Smart Recommendations"
              description="AI adapts to your preferences, progress, and feedback to refine every workout."
            />
            <FeatureCard
              icon={<Dumbbell className="h-6 w-6 text-slate-700 dark:text-slate-200" />}
              title="All Fitness Levels"
              description="Whether you're a beginner or advanced, FitForge builds plans that scale with you."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6 text-amber-500" />}
              title="Simple and Beautiful"
              description="A clean interface that keeps you focused on training, not settings."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-600 dark:text-slate-400">
          © {new Date().getFullYear()} FitForge. All rights reserved.
        </div>
      </footer>
    </main>
  );
}

/* ---------- Feature Card ---------- */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition text-left sm:text-center flex flex-col items-center">
      <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        {title}
      </h3>
      <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
