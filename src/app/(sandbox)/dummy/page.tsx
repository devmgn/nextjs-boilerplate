"use client";

import { FaceIcon } from "@radix-ui/react-icons";
import { Card } from "../../../components/Card";
import {
  LoadingOverlay,
  LoadingScreen,
  loading,
} from "../../../components/LoadingOverlay";
import { Spinner } from "../../../components/Spinner";
import { SvgIcon } from "../../../components/SvgIcon";
import { useLocalStorage } from "../../../hooks/storage/useLocalStorage";
import { useSessionStorage } from "../../../hooks/storage/useSessionStorage";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import { useDebouncedInput } from "../../../hooks/useDebouncedInput";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useIsComposing } from "../../../hooks/useIsComposing";
import { useMediaQuery } from "../../../hooks/useMediaQuery";
import { useToggle } from "../../../hooks/useToggle";
import { isKeyOf } from "../../../utils/is/isKeyOf";
import { isValueOf } from "../../../utils/is/isValueOf";
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
