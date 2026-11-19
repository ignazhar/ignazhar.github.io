import { getCollection } from 'astro:content';

/** All published posts, newest first. Drafts show up only in `npm run dev`. */
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Dates are shown as 2026-11-18 (ISO), which suits the monospace look. */
export function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function readingTime(markdown: string | undefined) {
  const words = (markdown ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
