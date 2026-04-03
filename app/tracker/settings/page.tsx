"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/tracker/auth-context";
import { TrackerShell } from "@/components/tracker/tracker-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getProfile, upsertProfile, signOut } from "@/lib/tracker/store";
import { DEFAULT_TARGETS } from "@/lib/tracker/types";
import type { UserProfile } from "@/lib/tracker/types";
import { LogOut, Save, Link2 } from "lucide-react";

export default function SettingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [calorieTarget, setCalorieTarget] = useState(
    String(DEFAULT_TARGETS.calorie_target)
  );
  const [proteinTarget, setProteinTarget] = useState(
    String(DEFAULT_TARGETS.protein_target)
  );
  const [carbsTarget, setCarbsTarget] = useState(
    String(DEFAULT_TARGETS.carbs_target)
  );
  const [fatTarget, setFatTarget] = useState(String(DEFAULT_TARGETS.fat_target));

  const loadProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const profile = await getProfile(user.id);
      if (profile) {
        setDisplayName(profile.display_name || "");
        setCalorieTarget(String(profile.calorie_target));
        setProteinTarget(String(profile.protein_target));
        setCarbsTarget(String(profile.carbs_target));
        setFatTarget(String(profile.fat_target));
      } else {
        setDisplayName(
          user.user_metadata?.display_name || user.email?.split("@")[0] || ""
        );
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaved(false);
    try {
      await upsertProfile({
        id: user.id,
        email: user.email || "",
        display_name: displayName,
        calorie_target: parseInt(calorieTarget) || DEFAULT_TARGETS.calorie_target,
        protein_target: parseInt(proteinTarget) || DEFAULT_TARGETS.protein_target,
        carbs_target: parseInt(carbsTarget) || DEFAULT_TARGETS.carbs_target,
        fat_target: parseInt(fatTarget) || DEFAULT_TARGETS.fat_target,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.push("/tracker/login");
  }

  return (
    <TrackerShell>
      <header className="px-4 pt-4">
        <h1 className="text-lg font-bold">Settings</h1>
      </header>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-4 px-4 py-4">
          {/* Profile */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user?.email || ""} disabled />
              </div>
            </CardContent>
          </Card>

          {/* Daily Targets */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Daily Targets</CardTitle>
              <CardDescription>
                Set your daily calorie and macro goals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label>Calorie Target</Label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={calorieTarget}
                  onChange={(e) => setCalorieTarget(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Protein (g)</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={proteinTarget}
                    onChange={(e) => setProteinTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Carbs (g)</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={carbsTarget}
                    onChange={(e) => setCarbsTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Fat (g)</Label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={fatTarget}
                    onChange={(e) => setFatTarget(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Fit */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Google Fit</CardTitle>
              <CardDescription>
                Connect Google Fit to sync your exercise data automatically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button type="button" variant="outline" className="w-full" disabled>
                <Link2 className="h-4 w-4 mr-2" />
                Connect Google Fit (Coming Soon)
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Google Fit integration will allow automatic import of workouts,
                steps, and calories burned.
              </p>
            </CardContent>
          </Card>

          {/* Save */}
          <Button type="submit" className="w-full" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
          </Button>

          {/* Sign Out */}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </form>
      )}
    </TrackerShell>
  );
}
