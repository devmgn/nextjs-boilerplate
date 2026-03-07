import type { MetadataRoute } from "next";
import { ENV } from "../config/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: ENV.SITE_URL,
      lastModified: new Date(),
    },
  ];
}
