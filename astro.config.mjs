// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';
import { SITE } from './src/site.config.ts';
import { remarkDecodeImagePaths } from './src/lib/remark-decode-image-paths.mjs';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  integrations: [sitemap()],
  markdown: {
    // remark lets us fix up image links that Obsidian writes when you paste a photo
    processor: unified({ remarkPlugins: [remarkDecodeImagePaths] }),
  },
});
