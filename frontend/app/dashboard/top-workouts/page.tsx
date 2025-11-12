

"use client";

import { useEffect, useState } from "react";
import { Flame, AlertCircle } from "lucide-react";
import WorkoutCard from "@/components/WorkoutCard";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface TopWorkout {
  workout_id: number;
  title: string;
  avg_rating: number;
  total_ratings: number;
}

export default function TopWorkoutsPage() {
  const [workouts, setWorkouts] = useState<TopWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTopWorkouts = async () => {
      if (!token) {
        setError("Please log in.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/top_workouts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!Array.isArray(res.data)) throw new Error("Invalid data");
        setWorkouts(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load top workouts");
      } finally {
        setLoading(false);
      }
    };

    fetchTopWorkouts();
  }, [token]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="rounded-md bg-slate-100 dark:bg-slate-800 p-2">
          <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Top Rated Workouts
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            The most loved workouts from all users.
          </p>
        </div>
      </header>

      {/* Loading Skeleton */}
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

      {/* Error Message */}
      {error && !loading && (
        <div className="flex items-center gap-3 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-5 text-red-600 dark:text-red-400">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && workouts.length === 0 && (
        <div className="rounded-lg border border-border bg-card text-center py-20 px-6 space-y-6">
          <div className="w-16 h-16 rounded-full mx-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <Flame className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-lg text-muted-foreground">
            No top workouts found yet.
          </p>
        </div>
      )}

      {/* Top Workouts Grid */}
      {!loading && !error && workouts.length > 0 && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            {workouts.length} top-rated workout
            {workouts.length > 1 ? "s" : ""}
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workouts.map((w, i) => (
              <div
                key={w.workout_id}
                className="rounded-lg border border-border bg-card p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">
                    #{i + 1}
                  </span>
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                    ⭐ {w.avg_rating.toFixed(1)} avg
                  </span>
                </div>
                <WorkoutCard
                  workout={{
                    workout_id: w.workout_id,
                    title: w.title,
                    type: "Top Rated",
                    bodypart: "",
                    equipment: "",
                    level: "",
                    rating: w.avg_rating,
                  }}
                  onRate={() => {}}
                />
                <div className="mt-3 pt-2 border-t border-border text-center">
                  <p className="text-xs text-muted-foreground">
                    {w.total_ratings} total ratings
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
