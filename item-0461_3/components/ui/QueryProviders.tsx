"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/client/react-query"; // Adjust path

export function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
