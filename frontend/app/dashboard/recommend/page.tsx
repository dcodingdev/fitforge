// app/dashboard/recommend/page.tsx
"use client";

import { useState } from "react";
import RecommendationForm from "@/components/RecommendationForm";
import WorkoutCard from "@/components/WorkoutCard";
import { Brain } from "lucide-react";

export default function RecommendPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <header className="space-y-2">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Brain className="h-10 w-10 text-primary" />
          AI Workout Recommendations
        </h1>
        <p className="text-lg text-muted-foreground">
          Personalized workouts based on your goals and equipment.
        </p>
      </header>

      {/* Preferences Section */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Your Preferences</h2>
        <RecommendationForm onSuccess={setRecommendations} />
      </div>

      {/* Recommendations */}
      {recommendations?.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">Recommended workouts for you !</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((rec) => (
              <WorkoutCard
                key={rec.workout_id}
                workout={rec}
                onRate={async (id: any, rating: any) => {
                  try {
                    await fetch("http://127.0.0.1:8000/rate", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
                      },
                      body: JSON.stringify({ workout_id: id, rating }),
                    });
                  } catch (err) {
                    console.error("Rate failed");
                  }
                }}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
