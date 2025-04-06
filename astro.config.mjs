// @ts-check
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import sanity from "@sanity/astro";

import react from "@astrojs/react";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";
import prefetch from "@astrojs/prefetch";

const isProduction = process.env.NODE_ENV === "production";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    sitemap(),
    prefetch(),
    sanity({
      projectId: "3935zoc2",
      dataset: "production",
      useCdn: false, // for static builds
      stega: {
        enabled: true,
        studioUrl: "https://mosaicemarketing.sanity.studio/",
      },
    }),
    react(),
  ],
  output: isProduction ? "static" : "server",
  adapter: netlify(),
  site: isProduction
    ? "https://mosaicemarketing.com"
    : "https://mosaic-emarketing.netlify.app",
});
