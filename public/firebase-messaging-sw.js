/**
 * FCM バックグラウンド通知用 Service Worker。
 * Firebase 設定値（公開可能な値のみ）は登録時のクエリパラメータで受け取る
 * （Service Worker からは Next.js の環境変数を参照できないため）。
 */
importScripts(
  "https://www.gstatic.com/firebasejs/12.12.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.12.0/firebase-messaging-compat.js"
);

firebase.initializeApp(
  Object.fromEntries(new URL(self.location).searchParams.entries())
);

// notification ペイロード付きメッセージは SDK が自動で通知を表示し、
// クリック時は webpush.fcmOptions.link の URL を開く
firebase.messaging();

// サイト表示中にページ側（listenForegroundMessages）で表示した通知のクリック処理。
// SDK 表示分は data に FCM_MSG を持ち link を持たないため、ここでは無視される
self.addEventListener("notificationclick", (event) => {
  const link = event.notification.data && event.notification.data.link;
  if (!link) return;
  event.notification.close();
  event.waitUntil(self.clients.openWindow(link));
});