
// "use client";

// import { useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import Select from "react-select";
// import { RefreshCw, Brain } from "lucide-react";
// import { toast } from "react-hot-toast";
// import { useAuth } from "@/context/AuthContext";


// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";



// // ---------- Options ----------
// const fitnessLevels = ["Beginner", "Intermediate", "Expert"];
// const goals = [
//   "Lose fat", "Weight loss", "Build muscle", "Gain mass", "Improve strength",
//   "Increase endurance", "Improve cardio", "Improve flexibility", "Improve mobility",
//   "Tone body", "Body recomposition", "General health", "Wellness",
//   "Sports performance", "Rehabilitation", "Injury recovery", "Prepare for event"
// ];
// const preferredTypes = [
//   "Strength training", "Bodyweight training", "Calisthenics", "Cardio running",
//   "Cardio cycling", "Cardio rowing", "HIIT High Intensity Interval Training",
//   "Yoga", "Pilates", "CrossFit", "Powerlifting", "Olympic weightlifting",
//   "Circuit training", "Swimming", "Dance", "Zumba", "Martial arts",
//   "Functional training", "No preference"
// ];
// const equipmentAccess = [
//   "Full gym", "Home gym", "Minimal equipment", "Bodyweight", "Outdoor park",
//   "None", "Bands", "Barbell", "Kettlebells", "Dumbbell", "Cable", "Machine", "Body Only"
// ];
// const bodyParts = [
//   "Full body", "Upper body", "Lower body", "Core", "Abs", "Arms", "Biceps",
//   "Triceps", "Forearms", "Back", "Chest", "Shoulders", "Legs", "Quads",
//   "Hamstrings", "Calves", "Glutes", "No specific focus"
// ];

// // ---------- Validation ----------
// const schema = z.object({
//   goal: z.string(),
//   preferred_type: z.string(),
//   equipment_access: z.string(),
//   preferred_bodypart: z.string(),
//   fitness_level: z.string(),
// });

// type FormData = z.infer<typeof schema>;

// interface Props {
//   onSuccess: (recommendations: any[]) => void;
// }

// export default function RecommendationForm({ onSuccess }: Props) {
//   const [loading, setLoading] = useState(false);
//   const { token } = useAuth();

//   const { control, handleSubmit, reset } = useForm<FormData>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       goal: "",
//       preferred_type: "",
//       equipment_access: "",
//       preferred_bodypart: "",
//       fitness_level: "",
//     },
//   });

//   // ---------- Submit ----------
//   const onSubmit = async (data: FormData) => {
//     setLoading(true);
//     try {
//       // Normalize casing to match backend schema
//       const normalized = {
//         goal: data.goal.toLowerCase(),
//         preferred_type: data.preferred_type.toLowerCase(),
//         equipment_access: data.equipment_access.toLowerCase(),
//         preferred_bodypart: data.preferred_bodypart.toLowerCase(),
//         fitness_level: data.fitness_level.toLowerCase(),
//       };



//       const res = await fetch(`${API_URL}/recommend`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(normalized),
//       });

//       if (!res.ok) throw new Error("Failed to get recommendations");

//       const result = await res.json();
//       onSuccess(result.recommendations);
//       toast.success(`${result.mode.toUpperCase()} recommendations ready!`);
//       reset();
//     } catch (err: any) {
//       toast.error(err.message || "Request failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- Styles ----------
//   const selectStyle = {
//     control: (base: any, state: any) => ({
//       ...base,
//       backgroundColor: "#fff",
//       borderColor: state.isFocused ? "hsl(var(--primary))" : "#ccc",
//       color: "#000",
//       borderRadius: "0.5rem",
//       minHeight: "42px",
//       boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--primary))" : "none",
//       "&:hover": { borderColor: "hsl(var(--primary))" },
//       zIndex: 1,
//     }),
//     menu: (base: any) => ({
//       ...base,
//       backgroundColor: "#fff",
//       border: "1px solid #ccc",
//       borderRadius: "0.5rem",
//       boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
//       maxHeight: "160px",
//       overflowY: "auto",
//       zIndex: 100,
//       position: "absolute",
//     }),
//     option: (base: any, state: any) => ({
//       ...base,
//       backgroundColor: state.isFocused ? "#f3f4f6" : "#fff",
//       color: "#000",
//     }),
//     singleValue: (base: any) => ({ ...base, color: "#000" }),
//     input: (base: any) => ({ ...base, color: "#000" }),
//     placeholder: (base: any) => ({ ...base, color: "#666" }),
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2">
//       {/* Horizontal for desktop, vertical for mobile */}
//       <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-between">
//         {[
//           { name: "goal", label: "Goal", options: goals },
//           { name: "preferred_type", label: "Preferred Type", options: preferredTypes },
//           { name: "equipment_access", label: "Equipment Access", options: equipmentAccess },
//           { name: "preferred_bodypart", label: "Target Body Part", options: bodyParts },
//           { name: "fitness_level", label: "Fitness Level", options: fitnessLevels },
//         ].map((f) => (
//           <div key={f.name} className="flex-1 min-w-[220px]">
//             <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
//             <Controller
//               name={f.name as keyof FormData}
//               control={control}
//               render={({ field }) => (
//                 <Select
//                   {...field}
//                   options={f.options.map((o) => ({ label: o, value: o }))}
//                   value={
//                     f.options.includes(field.value)
//                       ? { label: field.value, value: field.value }
//                       : null
//                   }
//                   onChange={(val) => field.onChange(val?.value)}
//                   styles={selectStyle}
//                   menuPortalTarget={document.body}
//                   menuPlacement="auto"
//                   placeholder={`Select ${f.label.toLowerCase()}`}
//                 />
//               )}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-3 pt-4">
//         <button
//           type="submit"
//           disabled={loading}
//           className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-md disabled:opacity-70"
//         >
//           {loading ? (
//             <>
//               <RefreshCw className="h-5 w-5 animate-spin" /> Generating...
//             </>
//           ) : (
//             <>
//               <Brain className="h-5 w-5" /> Get AI Workout
//             </>
//           )}
//         </button>

//         <button
//           type="button"
//           onClick={() => reset()}
//           disabled={loading}
//           className="flex items-center justify-center gap-2 border-2 border-foreground rounded-md px-4 py-3 text-foreground hover:bg-foreground/10"
//         >
//           <RefreshCw className="h-5 w-5" /> Reset
//         </button>
//       </div>
//     </form>
//   );
// }


"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Select from "react-select";
import { RefreshCw, Brain } from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// ---------- Options ----------
const fitnessLevels = ["Beginner", "Intermediate", "Expert"];
const goals = [
  "Lose fat", "Weight loss", "Build muscle", "Gain mass", "Improve strength",
  "Increase endurance", "Improve cardio", "Improve flexibility", "Improve mobility",
  "Tone body", "Body recomposition", "General health", "Wellness",
  "Sports performance", "Rehabilitation", "Injury recovery", "Prepare for event"
];
const preferredTypes = [
  "Strength training", "Bodyweight training", "Calisthenics", "Cardio running",
  "Cardio cycling", "Cardio rowing", "HIIT High Intensity Interval Training",
  "Yoga", "Pilates", "CrossFit", "Powerlifting", "Olympic weightlifting",
  "Circuit training", "Swimming", "Dance", "Zumba", "Martial arts",
  "Functional training", "No preference"
];
const equipmentAccess = [
  "Full gym", "Home gym", "Minimal equipment", "Bodyweight", "Outdoor park",
  "None", "Bands", "Barbell", "Kettlebells", "Dumbbell", "Cable", "Machine", "Body Only"
];
const bodyParts = [
  "Full body", "Upper body", "Lower body", "Core", "Abs", "Arms", "Biceps",
  "Triceps", "Forearms", "Back", "Chest", "Shoulders", "Legs", "Quads",
  "Hamstrings", "Calves", "Glutes", "No specific focus"
];

// ---------- Validation ----------
const schema = z.object({
  goal: z.string(),
  preferred_type: z.string(),
  equipment_access: z.string(),
  preferred_bodypart: z.string(),
  fitness_level: z.string(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess: (recommendations: any[]) => void;
}

export default function RecommendationForm({ onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const { control, handleSubmit, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      goal: "",
      preferred_type: "",
      equipment_access: "",
      preferred_bodypart: "",
      fitness_level: "",
    },
  });

  // ---------- Submit ----------
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const normalized = {
        goal: data.goal.toLowerCase(),
        preferred_type: data.preferred_type.toLowerCase(),
        equipment_access: data.equipment_access.toLowerCase(),
        preferred_bodypart: data.preferred_bodypart.toLowerCase(),
        fitness_level: data.fitness_level.toLowerCase(),
      };

      const res = await fetch(`${API_URL}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(normalized),
      });

      if (!res.ok) throw new Error("Failed to get recommendations");

      const result = await res.json();
      onSuccess(result.recommendations);
      toast.success(`${result.mode.toUpperCase()} recommendations ready!`);
      reset();
    } catch (err: any) {
      toast.error(err.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Styles ----------
  const selectStyle = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: "#fff",
      borderColor: state.isFocused ? "hsl(var(--primary))" : "#ccc",
      color: "#000",
      borderRadius: "0.5rem",
      minHeight: "42px",
      boxShadow: state.isFocused ? "0 0 0 1px hsl(var(--primary))" : "none",
      "&:hover": { borderColor: "hsl(var(--primary))" },
      zIndex: 1,
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: "#fff",
      border: "1px solid #ccc",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      maxHeight: "160px",
      overflowY: "auto",
      zIndex: 100,
      position: "absolute",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? "#f3f4f6" : "#fff",
      color: "#000",
    }),
    singleValue: (base: any) => ({ ...base, color: "#000" }),
    input: (base: any) => ({ ...base, color: "#000" }),
    placeholder: (base: any) => ({ ...base, color: "#666" }),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2">
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-between">
        {[
          { name: "goal", label: "Goal", options: goals },
          { name: "preferred_type", label: "Preferred Type", options: preferredTypes },
          { name: "equipment_access", label: "Equipment Access", options: equipmentAccess },
          { name: "preferred_bodypart", label: "Target Body Part", options: bodyParts },
          { name: "fitness_level", label: "Fitness Level", options: fitnessLevels },
        ].map((f) => (
          <div key={f.name} className="flex-1 min-w-[220px]">
            <label className="block text-sm font-medium text-foreground mb-1">{f.label}</label>
            <Controller
              name={f.name as keyof FormData}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={f.options.map((o) => ({ label: o, value: o }))}
                  value={
                    f.options.includes(field.value)
                      ? { label: field.value, value: field.value }
                      : null
                  }
                  onChange={(val) => field.onChange(val?.value)}
                  styles={selectStyle}
                  menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                  menuPlacement="auto"
                  placeholder={`Select ${f.label.toLowerCase()}`}
                />
              )}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-md disabled:opacity-70"
        >
          {loading ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Brain className="h-5 w-5" /> Get AI Workout
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => reset()}
          disabled={loading}
          className="flex items-center justify-center gap-2 border-2 border-foreground rounded-md px-4 py-3 text-foreground hover:bg-foreground/10"
        >
          <RefreshCw className="h-5 w-5" /> Reset
        </button>
      </div>
    </form>
  );
}
