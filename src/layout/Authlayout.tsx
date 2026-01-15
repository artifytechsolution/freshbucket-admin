"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";

type ChildrenProps = {
  children: React.ReactNode;
};

const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/search",
  "/experiences",
];

const AUTH_ROUTES = ["/login", "/register"];

const PROTECTED_ROUTE_PREFIXES = [
  "/user",
  "/products",
  "/orders",
  "/cupons",
];

const AuthLayout: React.FC<ChildrenProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  console.log("is login is herere-------")
  console.log(isLoggedIn)
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  const isProtectedRoute = PROTECTED_ROUTE_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  useEffect(() => {
    // Prevent redirects until auth state is resolved
    // if (isLoading) return;

    // 🚫 Not logged in → protected route
    if (!isLoggedIn && isProtectedRoute) {
      router.replace("/signin");
      return;
    }

    // ✅ Logged in → auth pages
    if (isLoggedIn && isAuthRoute) {
      router.replace("/");
      return;
    }
  }, [isLoggedIn, pathname, isProtectedRoute, isAuthRoute, router]);


  return <>{children}</>;
};

export default AuthLayout;
