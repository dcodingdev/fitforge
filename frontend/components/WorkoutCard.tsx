


import { useState } from "react";
import { Star, Dumbbell, Settings, Activity } from "lucide-react";

interface Workout {
  workout_id: number;
  title: string;
  type: string;
  bodypart: string;
  equipment: string;
  level: string;
  rating?: number;
}

interface Props {
  workout: Workout;
  onRate: (id: number, rating: number) => void;
}

export default function WorkoutCard({ workout, onRate }: Props) {
  const [localRating, setLocalRating] = useState(workout.rating || 0);

  const handleRate = (value: number) => {
    setLocalRating(value);
    onRate(workout.workout_id, value);
  };

  return (
    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      {/* Title */}
      <div className="p-5 border-b border-border">
        <h3 className="text-lg font-semibold leading-tight tracking-tight text-foreground">
          {workout.title}
        </h3>
      </div>

      {/* Tags */}
      <div className="p-5 space-y-5">
        <div className="flex flex-wrap gap-2 text-xs font-medium">
          {workout.type && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">
              <Activity className="h-3.5 w-3.5" /> {workout.type}
            </span>
          )}
          {workout.bodypart && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">
              <Dumbbell className="h-3.5 w-3.5" /> {workout.bodypart}
            </span>
          )}
          {workout.equipment && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100">
              <Settings className="h-3.5 w-3.5" /> {workout.equipment}
            </span>
          )}
          {workout.level && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 capitalize">
              {workout.level}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center sm:justify-start gap-1">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
            <button
              key={star}
              onClick={() => handleRate(star)}
              className="transition-transform hover:scale-110 focus:scale-110 outline-none"
              aria-label={`Rate ${star} stars`}
            >
              <Star
                className={`h-5 w-5 ${
                  star <= localRating
                    ? "fill-yellow-500 text-yellow-500"
                    : "text-gray-400 dark:text-gray-600"
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            {localRating > 0 ? localRating.toFixed(1) : "Rate"}
          </span>
        </div>
      </div>
    </div>
  );
}
