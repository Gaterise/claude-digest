import { Bodoni_Moda, JetBrains_Mono, Shippori_Mincho_B1 } from "next/font/google";

// 数値・モデルID用の等幅フォント。Tailwind の font-mono（var(--font-mono)）をページ内で差し替える
export const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

// トップ一覧（変更ログ台帳）の見出し用の明朝体。和文グリフは unicode-range で必要な分だけ読み込まれる
export const mincho = Shippori_Mincho_B1({
  weight: ["500", "700", "800"],
  subsets: ["latin"],
  variable: "--font-shippori",
  display: "swap",
  preload: false,
});

// 日付・バージョン番号用のディスプレイ書体
export const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
  style: ["normal", "italic"],
});
