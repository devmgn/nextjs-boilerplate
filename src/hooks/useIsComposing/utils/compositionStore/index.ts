import { createCompositionStore } from "./compositionStore";

export const captureCompositionStore = createCompositionStore(true);
export const bubbleCompositionStore = createCompositionStore(false);
