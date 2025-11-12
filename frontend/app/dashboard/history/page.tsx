
"use client";

import { useEffect, useState } from "react";
import WorkoutCard from "@/components/WorkoutCard";
import { AlertCircle, History } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface HistoryItem {
  workout_id: number;
  title: string;
  rating: number;
  rated_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!token) {
        setError("Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!Array.isArray(res.data)) throw new Error("Invalid data");
        setHistory(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return (
      date.toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " • " +
      date.toLocaleTimeString("en-IN", {
        hour: "numeric",
        minute: "2-digit",
      })
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="rounded-md bg-slate-100 dark:bg-slate-800 p-2">
          <History className="h-6 w-6 text-sky-600 dark:text-sky-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Your Workout History
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Every rating refines your AI recommendations.
          </p>
        </div>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg border border-border bg-card p-5 space-y-3 animate-pulse"
            >
              <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-5 text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && history.length === 0 && (
        <div className="rounded-lg border border-border bg-card text-center py-20 px-6 space-y-6">
          <div className="w-16 h-16 rounded-full mx-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <History className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg text-muted-foreground">
            You haven’t rated any workouts yet.
          </p>
          <a
            href="/dashboard/recommend"
            className="inline-block mt-4 px-6 py-2 text-white font-medium bg-linear-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 rounded-md transition"
          >
            Get Recommendations
          </a>
        </div>
      )}

      {/* History Grid */}
      {!loading && !error && history.length > 0 && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {history.length} workout{history.length > 1 ? "s" : ""} rated
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {history.map((item) => (
              <div
                key={item.workout_id}
                className="rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <WorkoutCard
                  workout={{
                    workout_id: item.workout_id,
                    title: item.title,
                    type: "Rated",
                    bodypart: "",
                    equipment: "",
                    level: "",
                    rating: item.rating,
                  }}
                  onRate={() => {}}
                />
                <div className="mt-3 pt-2 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground">
                    Rated on {formatDate(item.rated_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
