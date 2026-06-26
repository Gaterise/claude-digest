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