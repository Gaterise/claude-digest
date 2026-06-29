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
  { label: "claudeモデル比較", href: "/models", external: false },
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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto px-3 sm:px-4">
        <div className="flex h-12 sm:h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
            <Image
              src="/icon-192x192.png"
              alt="Claude Digest"
              width={24}
              height={24}
              className="rounded-md sm:w-7 sm:h-7"
            />
            <div>
              <span className="font-bold tracking-tight">
                <span className="bg-gradient-to-r from-rose-700 to-orange-600 bg-clip-text text-transparent text-sm sm:text-base">
                  Claude Digest
                </span>
              </span>
              <p className="hidden sm:block text-xs text-gray-400 leading-tight">
                Claude最新リリース情報の要点をまとめてお届けします
              </p>
            </div>
          </Link>

          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsOpen((v) => !v)}
              aria-label="メニューを開く"
              aria-expanded={isOpen}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
              >
                <AnimatePresence initial={false} mode="wait">
                  {isOpen ? (
                    <motion.path
                      key="close"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      exit={{ pathLength: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    />
                  ) : (
                    <motion.path
                      key="open"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
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
                  className="absolute right-0 mt-2 w-52 origin-top-right rounded-xl border border-gray-100 bg-white py-1.5 shadow-xl shadow-gray-200/60"
                >
                  {NAV_ITEMS.map((item) => (
                    <motion.div key={item.href} variants={itemVariants}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          <span>{item.label}</span>
                          <svg
                            className="h-3.5 w-3.5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                            />
                          </svg>
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                          {item.label}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}