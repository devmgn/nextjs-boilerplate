"use client";

import { FaceIcon } from "@radix-ui/react-icons";
import { isArray } from "es-toolkit/compat";
import { Backdrop } from "../../../components/Backdrop";
import { Card } from "../../../components/Card";
import { Spinner } from "../../../components/Spinner";
import { SvgIcon } from "../../../components/SvgIcon";
import { useDebouncedCallback } from "../../../hooks/useDebouncedCallback";
import { useDisclosure } from "../../../hooks/useDisclosure";
import { useIsComposing } from "../../../hooks/useIsComposing";
import { asyncDebounce } from "../../../utils/asyncDebounce";
import { createCustomEvent } from "../../../utils/createCustomEvent";
import { isKeyOf } from "../../../utils/isKeyOf";
import { isServer } from "../../../utils/isServer";
import { isValueOf } from "../../../utils/isValueOf";
import { isDevelopment } from "../../../utils/nodeEnv";

export default function Page() {
  useDisclosure();
  useDebouncedCallback(() => {
    // noop
  }, 1000);
  useIsComposing();
  asyncDebounce(() => {
    // noop
  }, 1000);
  createCustomEvent("" as keyof GlobalEventHandlersEventMap);
  const _isServer = isServer;
  const _isDevelopment = isDevelopment;
  const _isKeyOf = isKeyOf({}, "");
  const _isValueOf = isValueOf({}, "");
  const _isArray = isArray([]);

  return (
    <>
      <SvgIcon icon={FaceIcon} label="" />
      <Card />
      <Spinner />
      <Backdrop open />
    </>
  );
}
