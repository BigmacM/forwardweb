# ForwardWeb

Marketing & lead-generation website for **ForwardWeb** — web design, development & local SEO for small businesses in **Vaughan & the Greater Toronto Area**.

🌐 Production domain: **https://forwardweb.ca** (deployed via Hostinger)

## Stack
- **Static HTML/CSS/JS** — no build step, no framework. Deploys instantly to any static host.
- Framework-free CSS in `assets/css/style.css` (tuned for Core Web Vitals).
- `Inter` via Google Fonts (`display=swap`), minimal vanilla JS in `assets/js/main.js`.

## SEO
- Unique `<title>`, meta description, and canonical on every page.
- Open Graph + Twitter cards.
- JSON-LD: `ProfessionalService`, `WebSite`, `Service`, `BreadcrumbList`, `FAQPage`.
- `sitemap.xml`, `robots.txt`, `site.webmanifest`.
- Local landing pages targeting each service area (clean URLs).

## Structure
```
/                         Home
/services/                All services
/portfolio/               Work
/about/                   About
/contact/                 Contact (Formspree form)
/web-design-vaughan/      Local SEO landing (primary)
/web-design-woodbridge/
/web-design-maple/
/web-design-thornhill/
/web-design-richmond-hill/
/web-design-markham/
/assets/                  css, js, img
.htaccess                 HTTPS + caching + compression (Hostinger/LiteSpeed)
```

## Deploy (Hostinger)
1. Connect this GitHub repo in **hPanel → Git** (or pull into `public_html`).
2. Point the deploy path to the repo root — `index.html` serves at the domain root; directory `index.html` files give clean URLs automatically.
3. Set the domain to `forwardweb.ca` and enable SSL.

## TODO before launch
- [x] Real phone `(647) 909-4565` and email `info@forwardweb.ca` wired in.
- [ ] Contact form intentionally deferred — page uses direct email/call CTAs for now. Drop in a free form backend (Formspree / Web3Forms) later; replace the direct-contact card in `contact/index.html` with a `<form>`.
- [ ] Add real OG share image at `/assets/img/og.jpg` (1200×630).
- [ ] Create & verify the Google Business Profile for local ranking.
- [ ] Swap representative portfolio cards for real projects as they ship.
