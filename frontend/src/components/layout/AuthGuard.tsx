"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const PUBLIC_ROUTES = ["/", "/auth"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isInitialized) {
      if (!user && !PUBLIC_ROUTES.includes(pathname)) {
        router.push("/auth");
      }
    }
  }, [isInitialized, user, pathname, router]);

  // If not initialized, or if they are unauthenticated but trying to access a protected route,
  // we show a blank screen or a loading state briefly until redirect happens.
  if (!isInitialized || (!user && !PUBLIC_ROUTES.includes(pathname))) {
    return <div className="min-h-screen bg-void flex items-center justify-center"></div>;
  }

  return <>{children}</>;
}
