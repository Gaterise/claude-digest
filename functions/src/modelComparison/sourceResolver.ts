const GROUNDING_REDIRECT_PATTERN =
  /https:\/\/vertexaisearch\.cloud\.google\.com\/grounding-api-redirect\/[A-Za-z0-9_\-=%]+/g;

const REQUEST_TIMEOUT_MS = 10_000;

export type RedirectResolver = (url: string) => Promise<string | null>;

export interface ResolveResult {
  text: string;
  resolved: number;
  failed: number;
}

/**
 * Gemini の検索グラウンディングが出力する中継 URL（期限付き）を実際の出典 URL に置き換える。
 * 解決できなかった URL はそのまま残す（パーサー側で出典なしとして破棄される）。
 */
export async function resolveGroundingRedirects(
  text: string,
  resolve: RedirectResolver
): Promise<ResolveResult> {
  const urls = [...new Set(text.match(GROUNDING_REDIRECT_PATTERN) ?? [])];
  if (urls.length === 0) return { text, resolved: 0, failed: 0 };

  const entries = await Promise.all(
    urls.map(async (url) => {
      try {
        return [url, await resolve(url)] as const;
      } catch {
        return [url, null] as const;
      }
    })
  );
  const map = new Map(entries.filter((e): e is readonly [string, string] => e[1] !== null));

  // JSON 文字列内に埋め込むため、置換後の URL はエスケープする
  const replaced = text.replace(GROUNDING_REDIRECT_PATTERN, (url) => {
    const target = map.get(url);
    return target ? JSON.stringify(target).slice(1, -1) : url;
  });

  return { text: replaced, resolved: map.size, failed: urls.length - map.size };
}

/** リダイレクトを追わずに HEAD リクエストし、3xx の Location（絶対 URL）を返す */
export async function fetchRedirectLocation(
  url: string,
  fetchImpl: typeof fetch = fetch
): Promise<string | null> {
  try {
    const res = await fetchImpl(url, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (res.status < 300 || res.status >= 400) return null;
    const location = res.headers.get("location");
    return location ? new URL(location, url).toString() : null;
  } catch {
    return null;
  }
}
