import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-8 sm:mt-16 border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-4xl px-3 sm:px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3">
          {/* サイト概要 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Claude Digest</h3>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              Anthropic の Claude 変更ログを日本語に要約し、
              わかりやすくお届けする非公式サービスです。
            </p>
          </div>

          {/* リンク */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">リンク</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/about" className="text-xs text-gray-500 hover:text-gray-700">
                  このサイトについて
                </Link>
              </li>
              <li>
                <Link href="/models" className="text-xs text-gray-500 hover:text-gray-700">
                  Claude モデル比較
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/anthropics/claude-code/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  公式リリースノート
                </a>
              </li>
              <li>
                <a
                  href="https://www.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Anthropic 公式サイト
                </a>
              </li>
            </ul>
          </div>

          {/* 法的情報 */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">法的情報</h3>
            <ul className="mt-2 space-y-1">
              <li>
                <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-700">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-700">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs text-gray-500 hover:text-gray-700">
                  お問い合わせ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Claude Digest. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            このサービスは Anthropic の非公式サービスです。
          </p>
        </div>
      </div>
    </footer>
  );
}
