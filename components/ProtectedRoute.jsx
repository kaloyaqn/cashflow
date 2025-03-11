// components/ProtectedRoute.jsx
'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/AuthProvider';

export default function ProtectedRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuthContext();
  const router = useRouter();
  const redirectAttempted = useRef(false);

  useEffect(() => {
    // Only attempt to redirect once per component mount
    if (!loading && !isAuthenticated && !redirectAttempted.current) {
      console.log("No authenticated user, redirecting to login");
      redirectAttempted.current = true;
      router.replace('/login');
    }
  }, [isAuthenticated, loading, router]);

  // Show nothing during loading or if not authenticated
  if (loading || !isAuthenticated) {
    return null;
  }

  // Only render children if user is authenticated
  return children;
}
