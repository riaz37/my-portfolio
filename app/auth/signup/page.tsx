"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shared/ui/core/button";
import { Input } from "@/components/shared/ui/core/input";
import { Label } from "@/components/shared/ui/core/label";
import { useCustomToast } from "@/components/shared/ui/toast/toast-wrapper";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shared/ui/navigation/tabs";
import { AuthContainer } from "@/components/features/auth/AuthContainer";
import { GoogleButton } from "@/components/features/auth/GoogleButton";
import { OrDivider } from "@/components/features/auth/OrDivider";
import { PasswordInput } from "@/components/features/auth/PasswordInput";
import { getAbsoluteUrl } from "@/utils/url";

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useCustomToast();

  const handleCredentialsSignUp = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (!name || !email || !password || !confirmPassword) {
        throw new Error("Please fill in all fields");
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await fetch(getAbsoluteUrl("/api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Registration failed");
      }

      toast({
        variant: "success",
        title: "Account created",
        description: "Please verify your email to continue.",
      });

      // Redirect to verification page
      router.push("/auth/verify-status");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer
      title="Create a Coding Playground Account"
      subtitle="Start your coding journey today"
    >
      <div className="flex flex-col gap-4">
        <GoogleButton isLoading={isLoading} callbackUrl="/playground" />
        <OrDivider />
      </div>

      <Tabs defaultValue="credentials" className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="credentials" className="w-full"></TabsTrigger>
        </TabsList>

        <TabsContent value="credentials">
          <form onSubmit={handleCredentialsSignUp} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="mt-1"
                placeholder="Enter your name"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                required
                className="mt-1"
                placeholder="Create a password"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                required
                className="mt-1"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <span
          onClick={() => router.push("/auth/signin")}
          className="font-medium text-primary hover:underline cursor-pointer"
        >
          Sign in
        </span>
      </p>
    </AuthContainer>
  );
}
