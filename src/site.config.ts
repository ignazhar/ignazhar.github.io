// ─────────────────────────────────────────────────────────────
//  Everything you'd want to change about the site lives here.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'Your Name',
  tagline: 'Notes, photos and things I’m working on.',
  // Your final URL (used for RSS + sitemap). Update once you have a domain.
  url: 'https://example.com',
  links: [
    { label: 'GitHub', href: 'https://github.com/your-username' },
    { label: 'Email', href: 'mailto:you@example.com' },
  ],
};

// View counts — https://www.goatcounter.com (free).
// 1. Sign up, pick a code (e.g. "yourname" → yourname.goatcounter.com)
// 2. Put the code below.
// 3. In GoatCounter → Settings, tick "Allow adding visitor counts on your website"
//    so the public view counters on posts work.
// Leave empty to disable.
export const GOATCOUNTER = {
  code: '',
  showPublicCounts: true, // show "123 views" on posts + total on the home page
};

// Comments — https://giscus.app (free, stored in GitHub Discussions).
// 1. Make your site repo public and enable Discussions on it.
// 2. Install the giscus app: https://github.com/apps/giscus
// 3. Fill the form on giscus.app and copy the four values below.
// Leave repo empty to disable.
export const GISCUS = {
  repo: '', // "username/repo"
  repoId: '',
  category: 'Comments',
  categoryId: '',
};
