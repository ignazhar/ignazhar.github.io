// Makes images "just work" in every Markdown page and post:
//  • ![](images/Pasted%20image%2020261118.png)  → decodes %20 so Astro finds the file
//  • ![[teamphoto.jpg]]                         → Obsidian wikilink → normal image
//  • If the image isn't next to the file, it's looked up in the shared image
//    folders below — so one photo folder serves the blog, the home page and
//    pages like src/pages/volleyball.md.
import fs from 'node:fs';
import path from 'node:path';

const SHARED_IMAGE_DIRS = ['src/content/blog/images', 'src/content/images'].map((d) =>
  path.resolve(d),
);

const WIKI_IMAGE = /!\[\[([^\]|]+?\.(?:png|jpe?g|gif|webp|avif|svg))(?:\|([^\]]*))?\]\]/gi;

function isRemote(url) {
  return /^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith('data:') || url.startsWith('/');
}

function decode(url) {
  try {
    return decodeURI(url);
  } catch {
    return url;
  }
}

function asRelative(p) {
  const posix = p.split(path.sep).join('/');
  return posix.startsWith('.') ? posix : './' + posix;
}

/** Turn whatever the author wrote into a path Astro can import from `fileDir`. */
function resolveImage(url, fileDir) {
  const wanted = decode(url);
  if (!fileDir) return asRelative(wanted);

  const candidates = [
    path.resolve(fileDir, wanted), // exactly as written, e.g. images/photo.jpg
    path.resolve(fileDir, 'images', path.basename(wanted)), // ./images/ next to the file
    ...SHARED_IMAGE_DIRS.map((d) => path.join(d, path.basename(wanted))), // shared folders
  ];
  const found = candidates.find((c) => fs.existsSync(c));
  // Not found anywhere: leave it as written so Astro's error names the file.
  return asRelative(found ? path.relative(fileDir, found) : wanted);
}

function splitWikiImages(node, fileDir) {
  const out = [];
  let last = 0;
  for (const m of node.value.matchAll(WIKI_IMAGE)) {
    if (m.index > last) out.push({ type: 'text', value: node.value.slice(last, m.index) });
    const alt = m[2] && !/^\d+(x\d+)?$/.test(m[2]) ? m[2] : '';
    out.push({ type: 'image', url: resolveImage(m[1].trim(), fileDir), alt, title: null });
    last = m.index + m[0].length;
  }
  if (last === 0) return null;
  if (last < node.value.length) out.push({ type: 'text', value: node.value.slice(last) });
  return out;
}

function walk(node, fileDir) {
  if (!node.children) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === 'image' && child.url && !isRemote(child.url)) {
      child.url = resolveImage(child.url, fileDir);
    }
    if (child.type === 'text' && child.value.includes('![[')) {
      const replaced = splitWikiImages(child, fileDir);
      if (replaced) {
        next.push(...replaced);
        continue;
      }
    }
    walk(child, fileDir);
    next.push(child);
  }
  node.children = next;
}

export function remarkDecodeImagePaths() {
  return (tree, file) => {
    const filePath = file?.path ?? file?.history?.[0];
    walk(tree, filePath ? path.dirname(filePath) : undefined);
  };
}
