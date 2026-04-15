import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-3 sm:px-4">
        <div className="flex h-12 sm:h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/icon-192x192.png"
              alt="Claude Digest"
              width={24}
              height={24}
              className="rounded-md sm:w-7 sm:h-7"
            />
            <span className="text-sm sm:text-base font-bold text-gray-900">
              Claude Digest
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <a
              href="https://github.com/anthropics/claude-code/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap"
            >
              <span className="hidden sm:inline">公式リリース</span>
              <span className="sm:hidden">公式</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
