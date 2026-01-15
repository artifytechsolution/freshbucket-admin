"use client";

import ReduxProvider from "@/redux/reduxProvicer";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

import AuthLayout from "@/app/(full-width-pages)/(auth)/layout";
import { ThemeProvider } from "@/context/ThemeContext";
import { SidebarProvider } from "@/context/SidebarContext";
import AuthLayoutMain from "./Authlayout";


const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: false,
      },
    },
  });
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(false);
  }, [router]);



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ReduxProvider>
        <ThemeProvider>
                <SidebarProvider>
      <QueryClientProvider client={queryClient}>
        <AuthLayoutMain>{children}</AuthLayoutMain>
      </QueryClientProvider>
       </SidebarProvider>
      </ThemeProvider>
     
    </ReduxProvider>
  );
};

export default MainLayout;
