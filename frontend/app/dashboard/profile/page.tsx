"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { User, Mail, Calendar, Activity } from "lucide-react";
import api from "@/lib/api";

interface UserProfile {
  id: string;
  email: string;
  created_at: string;
  last_login?: string;
  goal?: string;
  fitness_level?: string;
}

export default function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      try {
        const res = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
      } catch {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-10">
      {/* Header */}
      <header className="flex items-center gap-3">
        <div className="rounded-md bg-slate-100 dark:bg-slate-800 p-2">
          <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Profile
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage your account details.
          </p>
        </div>
      </header>

      {/* Loading */}
      {loading && (
        <div className="rounded-lg border border-border bg-card p-6 animate-pulse">
          <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
          <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Profile Info */}
      {!loading && profile && (
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-base font-medium text-foreground">
                  {profile.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="text-base font-medium text-foreground">
                  {new Date(profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {profile.goal && (
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Goal</p>
                  <p className="text-base font-medium text-foreground">
                    {profile.goal}
                  </p>
                </div>
              </div>
            )}

            {profile.fitness_level && (
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Fitness Level</p>
                  <p className="text-base font-medium text-foreground capitalize">
                    {profile.fitness_level}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !profile && (
        <div className="border border-border bg-card p-10 text-center rounded-lg">
          <p className="text-muted-foreground">
            No profile data available.
          </p>
        </div>
      )}
    </div>
  );
}
