'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

interface FeatureGateProps {
  children: ReactNode;
  fallback?: ReactNode;
  requireAuth?: boolean;
  requireVerification?: boolean;
}

export function FeatureGate({ 
  children, 
  fallback,
  requireAuth = false,
  requireVerification = false
}: FeatureGateProps) {
  const { data: session } = useSession();

  // If authentication is not required, show the content
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If authentication is required but user is not logged in
  if (!session) {
    return fallback ? <>{fallback}</> : null;
  }

  // If verification is required but user is not verified
  if (requireVerification && !session.user?.emailVerified) {
    return fallback ? <>{fallback}</> : null;
  }

  // All conditions met, show the content
  return <>{children}</>;
}
