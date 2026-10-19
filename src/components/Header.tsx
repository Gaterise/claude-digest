"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  {
    label: "公式リリース",
    href: "https://github.com/anthropics/claude-code/releases",
    external: true,
  },
  { label: "Claude モデル比較", href: "/models", external: false },
  { label: "話題の AI 比較", href: "/ai-models", external: false },
  { label: "このサイトについて", href: "/about", external: false },
];

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: "easeOut" as const,
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
  exit: { opacity: 0, scale: 0.95, y: -8, transition: { duration: 0.1, ease: "easeIn" as const } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -6 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.15, ease: "easeOut" as const } },
};

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-double border-ink bg-paper/90 backdrop-blur-sm supports-[backdrop-filter]:bg-paper/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-12 items-center justify-between sm:h-14">
          <Link href="/" className="group flex items-center gap-2.5" onClick={() => setIsOpen(false)}>
            <Image
              src="/icon-192x192.png"
              alt="Claude Digest"
              width={24}
              height={24}
              className="rounded-[3px] ring-1 ring-ink/15 sm:h-7 sm:w-7"
            />
            <span className="flex items-baseline gap-3">
              <span className="font-mincho text-[15px] font-extrabold tracking-[0.06em] text-ink sm:text-[17px]">
                Claude <span className="text-shu">Digest</span>
              </span>
              <span className="hidden border-l border-rule pl-3 font-mincho text-[11px] tracking-[0.12em] text-ink-soft sm:block">
                Claude Code 変更ログの日本語版
              </span>
            </span>
          </Link>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label="メニューを開く"
              aria-expanded={isOpen}
              className="flex h-9 items-center gap-2 px-2 text-ink-soft transition-colors hover:text-shu focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-shu"
            >
              <span aria-hidden="true" className="hidden font-mincho text-xs tracking-[0.3em] sm:inline">
                目次
              </span>
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <AnimatePresence initial={false} mode="wait">
                  {isOpen ? (
                    <motion.path
                      key="close"
                      strokeLinecap="square"
                      d="M6 18 18 6M6 6l12 12"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ pathLength: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  ) : (
                    <motion.path
                      key="open"
                      strokeLinecap="square"
                      d="M3.75 7h16.5M3.75 12h16.5M3.75 17h10.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ pathLength: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </AnimatePresence>
              </svg>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute right-0 mt-2 w-60 origin-top-right border border-ink bg-paper py-2 shadow-[4px_4px_0_0_var(--color-ink)]"
                >
                  <p className="border-b border-rule px-4 pb-2 font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
                    Contents
                  </p>
                  {NAV_ITEMS.map((item, i) => {
                    const index = (
                      <span aria-hidden="true" className="w-5 font-numeral text-sm italic text-shu">
                        {i + 1}
                      </span>
                    );
                    const itemClass =
                      "group flex items-center gap-3 px-4 py-2.5 font-mincho text-sm text-ink transition-colors hover:bg-paper-deep/70";
                    return (
                      <motion.div key={item.href} variants={itemVariants}>
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setIsOpen(false)}
                            className={itemClass}
                          >
                            {index}
                            <span className="ledger-underline flex-1">{item.label}</span>
                            <span aria-hidden="true" className="text-xs text-ink-faint">↗</span>
                          </a>
                        ) : (
                          <Link href={item.href} onClick={() => setIsOpen(false)} className={itemClass}>
                            {index}
                            <span className="ledger-underline">{item.label}</span>
                          </Link>
                        )}
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
