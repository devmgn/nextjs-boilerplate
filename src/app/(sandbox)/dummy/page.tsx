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
  // 値系は捨て変数に入れるのではなく描画して参照する。
  // このページは共有モジュールが生きていることを確かめる置き場なので、
  // 目視でも確認できる方が役に立つ。
  return (
    <>
      <SvgIcon icon={FaceIcon} label="" />
      <Card />
      <Spinner />
      <LoadingOverlay />
      <LoadingScreen />
      <dl>
        <dt>isServer</dt>
        <dd>{String(isServer)}</dd>
        <dt>isDevelopment</dt>
        <dd>{String(isDevelopment)}</dd>
        <dt>isKeyOf</dt>
        <dd>{String(isKeyOf({}, ""))}</dd>
        <dt>isValueOf</dt>
        <dd>{String(isValueOf({}, ""))}</dd>
        <dt>loading</dt>
        <dd>{String(loading.getSnapshot())}</dd>
      </dl>
    </>
  );
}
