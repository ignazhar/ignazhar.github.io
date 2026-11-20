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
    // remark lets us fix up image links (Obsidian pastes, ![[photo.jpg]]) and find
    // photos in the shared folder src/content/blog/images from any page or post
    processor: unified({ remarkPlugins: [remarkDecodeImagePaths] }),
  },
});
