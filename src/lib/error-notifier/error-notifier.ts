import { toast } from "sonner";

/**
 * アプリ内のエラーをユーザーへ通知する出口。sonner への依存をここだけに閉じ込める。
 * 通知手段を差し替えるときも、呼び出し側は変更しなくてよい。
 */
export const errorNotifier = {
  notify(message: string): void {
    toast.error(message);
  },
};
