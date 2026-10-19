import Link from "next/link";

const SITE_FACTS: { term: string; detail: string }[] = [
  { term: "情報元", detail: "Claude Code 公式リリース（GitHub）" },
  { term: "更新", detail: "1時間ごとに自動チェック" },
  { term: "注意", detail: "Anthropic の非公式サイトです" },
];

const GUIDE_LINKS = [
  { label: "このサイトについて", href: "/about" },
  { label: "Claude モデル比較", href: "/models" },
  { label: "話題の AI 比較", href: "/ai-models" },
];

const EXTERNAL_LINKS = [
  { label: "公式リリースノート", href: "https://github.com/anthropics/claude-code/releases" },
  { label: "Anthropic 公式サイト", href: "https://www.anthropic.com" },
];

const LEGAL_LINKS = [
  { label: "プライバシーポリシー", href: "/privacy" },
  { label: "利用規約", href: "/terms" },
  { label: "お問い合わせ", href: "/contact" },
];

const linkClass = "group inline-flex items-baseline gap-1 font-mincho text-[13px] text-ink-soft transition-colors hover:text-ink";

function LinkGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="border-b border-ink pb-1.5 font-mincho text-xs font-bold tracking-[0.3em] text-ink">{title}</h3>
      <ul className="mt-3 space-y-2">{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-8 border-t-[3px] border-double border-ink bg-paper-deep/60 text-ink sm:mt-16">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-10 sm:px-6 sm:pt-12">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-16">
          {/* サイト概要 */}
          <section aria-labelledby="footer-about">
            <p className="font-mincho text-2xl font-extrabold tracking-[0.06em] sm:text-[1.7rem]">
              Claude <span className="text-shu">Digest</span>
            </p>
            <h2
              id="footer-about"
              className="mt-4 border-b-2 border-ink pb-1.5 font-mincho text-[13px] font-bold tracking-[0.08em] text-ink"
            >
              このサイトについて
            </h2>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-soft">
              Claude Code の公式リリース内容を、AI が日本語で要約してお届けするサイトです。
            </p>
            <dl className="mt-3 divide-y divide-rule/80 border-t border-rule/80">
              {SITE_FACTS.map(({ term, detail }) => (
                <div key={term} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-3 py-2 text-[13px]">
                  <dt className="font-mincho font-bold text-ink">{term}</dt>
                  <dd className="text-ink-soft">{detail}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 案内 */}
          <nav aria-label="フッター" className="grid grid-cols-2 gap-8">
            <LinkGroup title="案内">
              {GUIDE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    <span className="ledger-underline">{item.label}</span>
                  </Link>
                </li>
              ))}
              {EXTERNAL_LINKS.map((item) => (
                <li key={item.href}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <span className="ledger-underline">{item.label}</span>
                    <span aria-hidden="true" className="text-[10px] text-ink-faint">↗</span>
                  </a>
                </li>
              ))}
            </LinkGroup>
            <LinkGroup title="規約">
              {LEGAL_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    <span className="ledger-underline">{item.label}</span>
                  </Link>
                </li>
              ))}
            </LinkGroup>
          </nav>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-ink pt-4 sm:flex-row">
          <p className="font-mono text-[11px] tracking-wider text-ink-faint">
            © {new Date().getFullYear()} Claude Digest. All rights reserved.
          </p>
          <p aria-hidden="true" className="font-mincho text-xs tracking-[0.5em] text-ink-faint">
            ― 了 ―
          </p>
        </div>
      </div>
    </footer>
  );
}
