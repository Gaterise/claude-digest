import { getMessaging, getToken, isSupported, onMessage } from "firebase/messaging";
import { app } from "./firebase";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:5001/claude-digest/asia-northeast1/api/v1";

/** 通知設定が完了済みであることを示す localStorage キー */
const PUSH_ENABLED_KEY = "claude-digest:push-enabled";
/** 案内バナーを「あとで」で閉じた日時を記録する localStorage キー */
const PROMPT_DISMISSED_AT_KEY = "claude-digest:push-prompt-dismissed-at";
/** 「あとで」を選んだユーザーに再度案内するまでの期間 */
const PROMPT_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export type EnablePushResult = "enabled" | "permission-denied" | "error";

/** このブラウザで Web Push（FCM）が利用できるか */
export async function isPushSupported(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    return false;
  }
  try {
    return await isSupported();
  } catch {
    return false;
  }
}

/**
 * 通知設定の案内バナーを表示すべきか判定する。
 * 「未設定」（設定完了フラグなし・通知ブロックなし）かつ
 * 直近に「あとで」を選んでいないユーザーにのみ表示する。
 */
export async function shouldShowNotificationPrompt(): Promise<boolean> {
  if (!(await isPushSupported())) return false;
  if (Notification.permission === "denied") return false;
  if (localStorage.getItem(PUSH_ENABLED_KEY) === "1") return false;

  const dismissedAt = Number(localStorage.getItem(PROMPT_DISMISSED_AT_KEY));
  if (dismissedAt && Date.now() - dismissedAt < PROMPT_COOLDOWN_MS) {
    return false;
  }
  return true;
}

/** 案内バナーを「あとで」で閉じたことを記録する（一定期間は再表示しない） */
export function dismissNotificationPrompt(): void {
  localStorage.setItem(PROMPT_DISMISSED_AT_KEY, String(Date.now()));
}

/** FCM 用 Service Worker を Firebase 設定値付きの URL で登録する */
async function registerMessagingServiceWorker(): Promise<ServiceWorkerRegistration> {
  const params = new URLSearchParams({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? "",
  });
  const registration = await navigator.serviceWorker.register(
    `/firebase-messaging-sw.js?${params.toString()}`
  );
  return waitForActivation(registration);
}

/**
 * Service Worker が有効化されるまで待つ。
 * register() は有効化前に解決するため、そのまま getToken() を呼ぶと
 * PushManager.subscribe が「no active Service Worker」で失敗する。
 */
function waitForActivation(
  registration: ServiceWorkerRegistration
): Promise<ServiceWorkerRegistration> {
  if (registration.active) return Promise.resolve(registration);

  const worker = registration.installing ?? registration.waiting;
  if (!worker) {
    return Promise.reject(new Error("Service Worker の登録状態が不正です"));
  }

  return new Promise((resolve, reject) => {
    const check = () => {
      if (worker.state === "activated") {
        worker.removeEventListener("statechange", check);
        resolve(registration);
      } else if (worker.state === "redundant") {
        worker.removeEventListener("statechange", check);
        reject(new Error("Service Worker の有効化に失敗しました"));
      }
    };
    worker.addEventListener("statechange", check);
    check();
  });
}

/**
 * サイト表示中（フォアグラウンド）に届いたプッシュ通知を表示する。
 * FCM はページがアクティブな間は通知を自動表示せず onMessage に渡すため。
 * 通知設定済みでない場合は何もしない。戻り値は購読解除関数。
 */
export async function listenForegroundMessages(): Promise<() => void> {
  const noop = () => {};
  if (!(await isPushSupported())) return noop;
  if (Notification.permission !== "granted") return noop;
  if (localStorage.getItem(PUSH_ENABLED_KEY) !== "1") return noop;

  const registration = await registerMessagingServiceWorker();
  return onMessage(getMessaging(app), (payload) => {
    const { title, body, icon } = payload.notification ?? {};
    // クリック時の遷移は Service Worker の notificationclick で data.link を開く
    void registration.showNotification(title ?? "Claude Digest", {
      body,
      icon: icon ?? "/icon-192x192.png",
      data: { link: payload.fcmOptions?.link ?? "/" },
    });
  });
}

/**
 * プッシュ通知を有効化する。
 * 通知許可の取得 → FCM トークン発行 → サーバーへ購読登録、まで行う。
 */
export async function enablePushNotifications(): Promise<EnablePushResult> {
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey) {
    console.error("NEXT_PUBLIC_FIREBASE_VAPID_KEY が設定されていません");
    return "error";
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return "permission-denied";

    const registration = await registerMessagingServiceWorker();
    const token = await getToken(getMessaging(app), {
      vapidKey,
      serviceWorkerRegistration: registration,
    });

    const res = await fetch(`${API_BASE_URL}/notifications/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
      console.error(`購読登録エラー: HTTP ${res.status}`);
      return "error";
    }

    localStorage.setItem(PUSH_ENABLED_KEY, "1");
    return "enabled";
  } catch (err) {
    console.error("プッシュ通知の有効化エラー:", err);
    return "error";
  }
}