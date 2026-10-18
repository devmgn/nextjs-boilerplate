import { toast } from "sonner";
import { describe, expect, it, vi } from "vitest";
import { errorNotifier } from "./error-notifier";

describe("errorNotifier.notify", () => {
  it("passes the message to toast.error", () => {
    const toastSpy = vi.spyOn(toast, "error").mockReturnValue("");

    errorNotifier.notify("boom");

    expect(toastSpy).toHaveBeenCalledWith("boom");
  });
});
