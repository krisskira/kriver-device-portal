<a href="https://krisskira.github.io/personal-landing-page/">
  <img src="public/brand/og-cover.png" alt="Kriver Devices, technology solutions" width="100%" />
</a>

# Kriver Devices

A studio for mobile apps, websites and connected-home systems, from the idea through production. Based in Colombia, working remotely.

[Site](https://krisskira.github.io/personal-landing-page/) · [LinkedIn](https://www.linkedin.com/in/cristian-david-vergara-gomez/) · [Email](mailto:krisskira@gmail.com) · [Leer en español](README.es.md)

## What I build

- **Mobile apps** for iOS, Android and cross-platform, so the product can reach people without a platform wall.
- **Websites and web applications**, full stack, from the interface to the data.
- **Hardware and IoT** with ESP32, STM32 and embedded Linux, when the problem starts at the device.

The site also holds tutorials, project write-ups and a short page about how I got here.

## On the site

- **Home** — services, a sample of tutorials and a contact form.
- **Tutorials** — videos and posts, filterable by type.
- **Projects** — selected work, each with its own page.
- **About** — the path from firmware to the products I work on now.
- **Payments** — a private page, left out of the search index.

## Run it

React, TypeScript and Vite.

```bash
npm install
npm run dev
npm run build
```

Copy `.env` and set `VITE_SITE_URL` to the public URL. Content lives in `src/content/`. English strings are in `src/i18n/en.json`: the key is the Spanish text, exact.

The site publishes from `.github/workflows/pages.yml` on every push to `main` that touches the app. In the repository: **Settings → Pages → Source: GitHub Actions**. The current URL is <https://krisskira.github.io/personal-landing-page/>.

Author: **Crhistian David Vergara Gómez** · **krisskira@gmail.com**
