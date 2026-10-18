import type { MetadataRoute } from "next";
import { ENV } from "../env";

/**
 * サイトマップ（`/sitemap.xml`）を生成する。
 *
 * @returns サイトのトップ URL を含むサイトマップのエントリー
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: ENV.SITE_URL,
      lastModified: new Date(),
    },
  ];
}
