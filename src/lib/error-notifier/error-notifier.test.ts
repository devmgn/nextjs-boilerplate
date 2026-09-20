import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";
import { errorNotifier } from "./error-notifier";

describe("errorNotifier.notify", () => {
  it("メッセージを toast.error へ渡すこと", () => {
    const toastSpy = vi.spyOn(toast, "error").mockReturnValue("");

    errorNotifier.notify("boom");

    expect(toastSpy).toHaveBeenCalledWith("boom");

    toastSpy.mockRestore();
  });
});
