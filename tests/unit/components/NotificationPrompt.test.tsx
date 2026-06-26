import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NotificationPrompt } from "@/components/NotificationPrompt";
import * as messaging from "@/lib/messaging";

vi.mock("@/lib/messaging", () => ({
  shouldShowNotificationPrompt: vi.fn(),
  enablePushNotifications: vi.fn(),
  dismissNotificationPrompt: vi.fn(),
}));

const shouldShow = vi.mocked(messaging.shouldShowNotificationPrompt);
const enablePush = vi.mocked(messaging.enablePushNotifications);
const dismissPrompt = vi.mocked(messaging.dismissNotificationPrompt);

describe("NotificationPrompt コンポーネント", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("通知が未設定の場合に案内バナーを表示する", async () => {
    shouldShow.mockResolvedValue(true);
    render(<NotificationPrompt />);
    expect(
      await screen.findByText("更新があったら通知を受け取りませんか？")
    ).toBeInTheDocument();
    expect(screen.getByText("通知を受け取る")).toBeInTheDocument();
    expect(screen.getByText("あとで")).toBeInTheDocument();
  });

  it("表示条件を満たさない場合は何も表示しない", async () => {
    shouldShow.mockResolvedValue(false);
    const { container } = render(<NotificationPrompt />);
    await waitFor(() => {
      expect(shouldShow).toHaveBeenCalled();
    });
    expect(container).toBeEmptyDOMElement();
  });

  it("「通知を受け取る」クリックで有効化処理を呼び、成功メッセージを表示する", async () => {
    shouldShow.mockResolvedValue(true);
    enablePush.mockResolvedValue("enabled");
    render(<NotificationPrompt />);

    fireEvent.click(await screen.findByText("通知を受け取る"));

    expect(
      await screen.findByText(
        "プッシュ通知を有効にしました。変更ログが更新されたらお知らせします。"
      )
    ).toBeInTheDocument();
    expect(enablePush).toHaveBeenCalledOnce();
  });

  it("ブラウザで通知が拒否された場合はバナーを閉じる", async () => {
    shouldShow.mockResolvedValue(true);
    enablePush.mockResolvedValue("permission-denied");
    const { container } = render(<NotificationPrompt />);

    fireEvent.click(await screen.findByText("通知を受け取る"));

    await waitFor(() => {
      expect(container).toBeEmptyDOMElement();
    });
  });

  it("有効化に失敗した場合はエラーメッセージを表示する", async () => {
    shouldShow.mockResolvedValue(true);
    enablePush.mockResolvedValue("error");
    render(<NotificationPrompt />);

    fireEvent.click(await screen.findByText("通知を受け取る"));

    expect(
      await screen.findByText(
        "通知の設定に失敗しました。時間をおいて再度お試しください。"
      )
    ).toBeInTheDocument();
    // バナー自体は残り、再試行できる
    expect(screen.getByText("通知を受け取る")).toBeInTheDocument();
  });

  it("「あとで」クリックで非表示記録を保存してバナーを閉じる", async () => {
    shouldShow.mockResolvedValue(true);
    const { container } = render(<NotificationPrompt />);

    fireEvent.click(await screen.findByText("あとで"));

    expect(dismissPrompt).toHaveBeenCalledOnce();
    expect(container).toBeEmptyDOMElement();
  });
});