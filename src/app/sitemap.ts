import type { MetadataRoute } from "next";
import { ENV } from "../env";

/**
 * Generates the sitemap (`/sitemap.xml`).
 *
 * @returns Sitemap entries including the site's top URL
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: ENV.SITE_URL,
      lastModified: new Date(),
    },
  ];
}
