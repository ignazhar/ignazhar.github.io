// Makes images pasted in Obsidian "just work":
//  • ![](images/Pasted%20image%2020261118.png)  → decodes %20 so Astro finds the file
//  • ![[Pasted image 20261118.png]]             → Obsidian wikilink → normal image
//    (assumed to live in ./images/ next to the post)

const WIKI_IMAGE = /!\[\[([^\]|]+?\.(?:png|jpe?g|gif|webp|avif|svg))(?:\|([^\]]*))?\]\]/gi;

function isRemote(url) {
  return /^(?:[a-z]+:)?\/\//i.test(url) || url.startsWith('data:');
}

function toLocal(url) {
  let path = url;
  try {
    path = decodeURI(url);
  } catch {}
  if (!path.startsWith('.') && !path.startsWith('/')) path = './' + path;
  return path;
}

function splitWikiImages(node) {
  const out = [];
  let last = 0;
  for (const m of node.value.matchAll(WIKI_IMAGE)) {
    if (m.index > last) out.push({ type: 'text', value: node.value.slice(last, m.index) });
    const name = m[1].trim();
    const alt = m[2] && !/^\d+(x\d+)?$/.test(m[2]) ? m[2] : '';
    const url = name.includes('/') ? toLocal(name) : './images/' + name;
    out.push({ type: 'image', url, alt, title: null });
    last = m.index + m[0].length;
  }
  if (last === 0) return null;
  if (last < node.value.length) out.push({ type: 'text', value: node.value.slice(last) });
  return out;
}

function walk(node) {
  if (!node.children) return;
  const next = [];
  for (const child of node.children) {
    if (child.type === 'image' && child.url && !isRemote(child.url)) {
      child.url = toLocal(child.url);
    }
    if (child.type === 'text' && child.value.includes('![[')) {
      const replaced = splitWikiImages(child);
      if (replaced) {
        next.push(...replaced);
        continue;
      }
    }
    walk(child);
    next.push(child);
  }
  node.children = next;
}

export function remarkDecodeImagePaths() {
  return (tree) => walk(tree);
}
