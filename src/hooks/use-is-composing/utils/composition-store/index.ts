import { createCompositionStore } from "./composition-store";

export const captureCompositionStore = createCompositionStore(true);
export const bubbleCompositionStore = createCompositionStore(false);
