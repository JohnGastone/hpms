"use client";

// Flutter parallel:
// QueryClientProvider wraps your app the same way you'd wrap
// MaterialApp with ProviderScope (Riverpod) or MultiProvider.
// It sets up the global cache that react-query uses to store
// fetched data — so any component can share the same cached result.

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  // useState ensures each browser session gets its own QueryClient
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Keep data fresh for 60 seconds before refetching
            // Flutter: equivalent to a cache TTL in your repository
            staleTime: 60_000,
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}