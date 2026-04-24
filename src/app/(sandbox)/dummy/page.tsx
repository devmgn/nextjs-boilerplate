"use client";

import { FaceIcon } from "@radix-ui/react-icons";
import { Backdrop } from "../../../components/Backdrop";
import { Card } from "../../../components/Card";
import {
  LoadingOverlay,
  LoadingScreen,
  loading,
} from "../../../components/LoadingOverlay";
import { Spinner } from "../../../components/Spinner";
import { SvgIcon } from "../../../components/SvgIcon";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useIsComposing } from "../../../hooks/useIsComposing";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useSessionStorage } from "../../../hooks/useSessionStorage";
import { createCustomEvent } from "../../../utils/createCustomEvent";
import { isKeyOf } from "../../../utils/isKeyOf";
import { isValueOf } from "../../../utils/isValueOf";
import { isDevelopment, isServer } from "../../../utils/runtime";

export default function Page() {
  useDisclosure();
  useDebouncedCallback(() => {
    // noop
  }, 1000);
  useIsComposing();
  useLocalStorage("dummy");
  useSessionStorage("dummy");
  useMediaQuery("(min-width: 768px)");
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion
  createCustomEvent("" as keyof GlobalEventHandlersEventMap);
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
      <Backdrop open />
      <LoadingOverlay />
      <LoadingScreen />
    </>
  );
}
