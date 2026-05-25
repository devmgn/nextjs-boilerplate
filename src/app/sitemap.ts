import type { MetadataRoute } from "next";
import { ENV } from "../env";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: ENV.SITE_URL,
      lastModified: new Date(),
    },
  ];
}
