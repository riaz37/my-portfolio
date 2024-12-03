import { UserSettings } from "@/components/features/settings/user-settings";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Settings | Portfolio",
  description: "Manage your account settings and preferences.",
};

export default function SettingsPage() {
  return (
    <div className="container relative min-h-screen py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <UserSettings />
      </div>
    </div>
  );
}
