"use client";

import { FaceIcon } from "@radix-ui/react-icons";
import { Card } from "../../../components/card";
import {
  LoadingOverlay,
  LoadingScreen,
  loading,
} from "../../../components/loading-overlay";
import { Spinner } from "../../../components/spinner";
import { SvgIcon } from "../../../components/svg-icon";
import { useLocalStorage } from "../../../hooks/storage/use-local-storage";
import { useSessionStorage } from "../../../hooks/storage/use-session-storage";
import { useDebouncedCallback } from "../../../hooks/use-debounced-callback";
import { useDebouncedInput } from "../../../hooks/use-debounced-input";
import { useDisclosure } from "../../../hooks/use-disclosure";
import { useIsComposing } from "../../../hooks/use-is-composing";
import { useMediaQuery } from "../../../hooks/use-media-query";
import { useToggle } from "../../../hooks/use-toggle";
import { isKeyOf } from "../../../utils/is/is-key-of";
import { isValueOf } from "../../../utils/is/is-value-of";
import { isDevelopment, isServer } from "../../../utils/runtime";

export default function Page() {
  useDisclosure();
  useDebouncedCallback(() => {
    // noop
  }, 1000);
  useDebouncedInput(() => {
    // noop
  }, 1000);
  useIsComposing();
  useLocalStorage("dummy");
  useSessionStorage("dummy");
  useMediaQuery("(min-width: 768px)");
  useToggle();
  const _isServer = isServer;
  const _isDevelopment = isDevelopment;
  const _isKeyOf = isKeyOf({}, "");
  const _isValueOf = isValueOf({}, "");
  const _isArray = Array.isArray([]);
  const _loading = loading;

  return (
    <>
      <SvgIcon icon={FaceIcon} label="" />
      <Card />
      <Spinner />
      <LoadingOverlay />
      <LoadingScreen />
    </>
  );
}
