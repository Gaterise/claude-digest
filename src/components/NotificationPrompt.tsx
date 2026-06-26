"use client";

import { useEffect, useState } from "react";
import {
  dismissNotificationPrompt,
  enablePushNotifications,
  shouldShowNotificationPrompt,
} from "@/lib/messaging";

type PromptState = "hidden" | "visible" | "enabling" | "enabled" | "error";

/**
 * プッシュ通知が未設定のユーザーに、変更ログ更新通知の受け取りを促すバナー。
 * 通知をブロック済み・設定済み・直近で「あとで」を選んだユーザーには表示しない。
 */
export function NotificationPrompt() {
  const [state, setState] = useState<PromptState>("hidden");

  useEffect(() => {
    let cancelled = false;
    shouldShowNotificationPrompt().then((show) => {
      if (!cancelled && show) setState("visible");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // 有効化完了メッセージは数秒表示して自動で閉じる
  useEffect(() => {
    if (state !== "enabled") return;
    const timer = setTimeout(() => setState("hidden"), 5000);
    return () => clearTimeout(timer);
  }, [state]);

  if (state === "hidden") return null;

  const handleEnable = async () => {
    setState("enabling");
    const result = await enablePushNotifications();
    if (result === "enabled") {
      setState("enabled");
    } else if (result === "permission-denied") {
      // ブラウザ側で拒否された場合は再案内しても無意味なので閉じる
      setState("hidden");
    } else {
      setState("error");
    }
  };

  const handleDismiss = () => {
    dismissNotificationPrompt();
    setState("hidden");
  };

  if (state === "enabled") {
    return (
      <div
        role="status"
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-xl border border-green-200 bg-white px-4 py-3 text-sm text-green-800 shadow-lg"
      >
        <svg
          className="h-5 w-5 shrink-0 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        通知を有効にしました
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-lg sm:w-80">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <svg
            className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-900">
              更新通知を受け取りませんか？
            </p>
            <p className="mt-0.5 text-xs text-gray-500">
              新しい変更ログが公開されたらお知らせします。
            </p>
            {state === "error" && (
              <p className="mt-1 text-xs font-medium text-red-600">
                設定に失敗しました。再度お試しください。
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          disabled={state === "enabling"}
          className="shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-40"
          aria-label="閉じる"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleEnable}
          disabled={state === "enabling"}
          className="flex-1 rounded-lg bg-blue-600 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "enabling" ? "設定中..." : "通知を受け取る"}
        </button>
      </div>
    </div>
  );
}