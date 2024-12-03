"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/shared/ui/core/button";
import { useCustomToast } from "@/components/shared/ui/toast/toast-wrapper";
import { Loading } from "@/components/shared/loading";
import { Mail, RefreshCcw } from "lucide-react";

export default function VerifyEmailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useCustomToast();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || session?.user?.email;

  // Redirect if already verified
  useEffect(() => {
    if (session?.user?.emailVerified) {
      toast({
        variant: "info",
        title: "Already Verified",
        description: "Your email is already verified. Redirecting to playground...",
      });
      router.replace("/playground");
    }
  }, [session, router, toast]);

  const handleResendVerification = async () => {
    if (countdown > 0 || !email) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to resend verification email");
      }

      toast({
        variant: "success",
        title: "Email Sent",
        description: "Please check your inbox for the verification link.",
      });

      // Start countdown for 60 seconds
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast({
        variant: "error",
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to resend verification email",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    router.replace("/auth/signin");
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-background/80">
      <div className="mx-auto max-w-md space-y-8 p-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Verify Your Email</h1>
          <p className="mt-2 text-muted-foreground">
            Please check your email for a verification link. If you haven't received
            it, you can request a new one below.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Verification email sent to:
              <br />
              <span className="mt-1 block font-medium text-foreground">
                {email}
              </span>
            </p>
          </div>

          <Button
            className="w-full"
            onClick={handleResendVerification}
            disabled={isLoading || countdown > 0}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            {countdown > 0
              ? `Resend in ${countdown}s`
              : isLoading
              ? "Sending..."
              : "Resend Verification Email"}
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/auth/signin")}
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}
