# studio gross klein — Website

Static website for [studio gross klein](https://studiogrossklein.de), a product- and industrial-design studio based in Heuchelheim bei Gießen.

## Structure

```
├── index.html          # root redirect → /de/
├── de/                 # German pages
├── en/                 # English pages
├── css/style.css       # single stylesheet (Patron font variant)
├── js/                 # vanilla JS (hero split, project grid)
├── fonts/              # Patron webfont
└── media/              # project images & content JSON
```

## Serve locally

Any static server works, e.g.:

```bash
npx serve . -l 9002
```

## Locales

- **German** `/de/…` — primary (projekte, leistungen, maxime, …)
- **English** `/en/…` — (projects, services, principles, …)

Each page emits `<link rel="alternate" hreflang="…">` and JSON-LD `ProfessionalService` structured data.
