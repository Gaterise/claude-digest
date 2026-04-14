import { QueryClient, isServer } from "@tanstack/react-query";

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // SSR では即座に stale にしない
        staleTime: 60 * 1000,
        // リトライは 1 回のみ
        retry: 1,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (isServer) {
    // サーバーでは毎回新しいクライアントを作成
    return makeQueryClient();
  }
  // ブラウザではシングルトン
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
