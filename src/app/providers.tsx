import { type ReactNode, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 앱 전역 Provider 를 한곳에 모은다. (지금은 TanStack Query 만)
// useState 로 QueryClient 를 1회 생성해서 리렌더 시 새로 만들지 않도록 한다.
export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false, // mock 환경에서는 재시도 노이즈를 끈다.
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
