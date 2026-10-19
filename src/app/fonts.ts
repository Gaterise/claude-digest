import { JetBrains_Mono } from "next/font/google";

// 数値・モデルID用の等幅フォント。Tailwind の font-mono（var(--font-mono)）をページ内で差し替える
export const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
