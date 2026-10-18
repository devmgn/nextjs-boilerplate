import { toast } from "sonner";

/**
 * The single exit point for notifying users of app errors. Confines the sonner
 * dependency to this file. Swapping the notification mechanism requires no
 * changes to callers.
 */
export const errorNotifier = {
  notify(message: string): void {
    toast.error(message);
  },
};
