# Capítulo 9: Patrones Avanzados, Agentes de IA y Arquitectura BFF

> 📌 **Capítulo 09** | Libro Guía Next.js v16.3.7  
> 📝 **Resumen:** *Desarrollo de Agentes de IA en Next.js, Backend-for-Frontend (BFF), internacionalización, testing y observabilidad.*  
> 📄 **Temas incluidos:** 20 secciones  

[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)

---

## Contenido del Capítulo

- [How to set up your Next.js project for AI coding agents](#how-to-set-up-your-nextjs-project-for-ai-coding-agents)
- [How to add analytics to your Next.js application](#how-to-add-analytics-to-your-nextjs-application)
- [How to use Next.js as a backend for your frontend](#how-to-use-nextjs-as-a-backend-for-your-frontend)
- [How to use debugging tools with Next.js](#how-to-use-debugging-tools-with-nextjs)
- [Internationalization](#internationalization)
- [How to set up Cypress with Next.js](#how-to-set-up-cypress-with-nextjs)
- [Testing](#testing)
- [How to set up Jest with Next.js](#how-to-set-up-jest-with-nextjs)
- [How to set up Playwright with Next.js](#how-to-set-up-playwright-with-nextjs)
- [How to set up Vitest with Next.js](#how-to-set-up-vitest-with-nextjs)
- [Testing Adapters](#testing-adapters)
- [How to set up analytics](#how-to-set-up-analytics)
- [How to use debugging tools with Next.js](#how-to-use-debugging-tools-with-nextjs)
- [How to implement internationalization in Next.js](#how-to-implement-internationalization-in-nextjs)
- [How to set up Cypress with Next.js](#how-to-set-up-cypress-with-nextjs)
- [Testing](#testing)
- [How to set up Jest with Next.js](#how-to-set-up-jest-with-nextjs)
- [How to set up Playwright with Next.js](#how-to-set-up-playwright-with-nextjs)
- [How to set up Vitest with Next.js](#how-to-set-up-vitest-with-nextjs)
- [Testing Adapters](#testing-adapters)

---

<a id="how-to-set-up-your-nextjs-project-for-ai-coding-agents"></a>

## How to set up your Next.js project for AI coding agents

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/ai-agents](https://nextjs.org/docs/app/guides/ai-agents)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to configure your Next.js project so AI coding agents use up-to-date documentation instead of outdated training data.*  

---

Next.js ships version-matched documentation inside the `next` package, allowing AI coding agents to reference accurate, up-to-date APIs and patterns. An `AGENTS.md` file at the root of your project directs agents to these bundled docs instead of their training data.

Point agents at the bundled docs, give them [runtime visibility](#step-2-give-agents-runtime-visibility) into the dev server, let [errors drive the fixes](#step-3-let-errors-drive-the-fixes), and hand multi-step workflows to [skills](#step-4-hand-multi-step-workflows-to-skills).

## Step 1: Point agents at the bundled docs

Make sure `AGENTS.md` exists at your project root and directs agents to the bundled docs. When you install `next`, the Next.js documentation is bundled at `node_modules/next/dist/docs/`, mirroring the structure of the [Next.js documentation site](https://nextjs.org/docs):

```txt
node_modules/next/dist/docs/
├── 01-app/
│   ├── 01-getting-started/
│   ├── 02-guides/
│   └── 03-api-reference/
├── 02-pages/
├── 03-architecture/
└── index.mdx
```

Agents always have access to docs that match your installed version, with no network request or external lookup required. [Upgrading Next.js](/docs/app/getting-started/upgrading) also upgrades the bundled docs, including new guidance for existing features. Most AI coding agents, including Claude Code, Codex, Cursor, and GitHub Copilot, automatically read `AGENTS.md` when they start a session.

### New projects

[`create-next-app`](/docs/app/api-reference/cli/create-next-app) generates `AGENTS.md` and `CLAUDE.md` automatically. No additional setup is needed:

```bash
# Manejador de paquetes: pnpm
pnpm create next-app@canary
```

```bash
# Manejador de paquetes: npm
npx create-next-app@canary
```

```bash
# Manejador de paquetes: yarn
yarn create next-app@canary
```

```bash
# Manejador de paquetes: bun
bun create next-app@canary
```

If you don't want the agent files, pass `--no-agents-md`:

```bash
npx create-next-app@canary --no-agents-md
```

### Existing projects

On Next.js 16.3 or later, run `next dev`. When an AI coding agent is detected in the environment and no managed block is present, Next.js auto-generates `AGENTS.md` and `CLAUDE.md` at the project root. Existing `AGENTS.md` or `CLAUDE.md` files are upserted, so content outside the managed block is preserved:

```md
// Archivo: AGENTS.md
<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
```

```md
// Archivo: CLAUDE.md
@AGENTS.md
```

Add your own project-specific instructions outside the `<!-- BEGIN:nextjs-agent-rules -->` and `<!-- END:nextjs-agent-rules -->` markers, and they're preserved when Next.js updates the managed block.

### Opting out

We believe leaving auto-generation on is a good default. [Benchmark results on nextjs.org/evals](https://nextjs.org/evals) show agents do better when they read the bundled docs. If you really want to opt out, set `agentRules` to `false` in your config:

```ts
// Archivo: next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
}

export default nextConfig
```

### For earlier versions

On version 16.2, the docs are bundled but `AGENTS.md` is not auto-generated. Add the file yourself with an instruction to read the bundled docs at `node_modules/next/dist/docs/` before writing code.

On version 16.1 and earlier, the docs are not bundled either. Use the legacy `agents-md` command, which downloads a version-matched copy to `.next-docs/` in the project root and indexes it in `AGENTS.md`:

```bash
npx @next/codemod@canary agents-md
```

### Docs over the network

The Next.js docs are also available as Markdown over the network, for agents that fetch pages instead of reading `node_modules`. Append `.md` to any page URL on [nextjs.org/docs](https://nextjs.org/docs) for a plain Markdown version, and clients that send an `Accept: text/markdown` header get Markdown too. This includes the per-error pages under `/docs/messages`, which are not bundled.

The index at [`/docs/llms.txt`](https://nextjs.org/docs/llms.txt) and the single-file [`/docs/llms-full.txt`](https://nextjs.org/docs/llms-full.txt) follow the [`llms.txt` convention](https://llmstxt.org/), so agents that already read `llms.txt` for other tools can discover the Next.js docs the same way.

## Step 2: Give agents runtime visibility

Run `next dev` and let the agent work against the running server. Runtime errors, client-side warnings, and rendered output live in the browser, where agents can't look. Next.js surfaces two complementary views that an agent can read from the terminal.

First, `next dev` forwards browser console errors and warnings to the terminal (the [`logging.browserToTerminal`](/docs/app/api-reference/config/next-config-js/logging) config), so the output agents already read carries the client-side failures they're asked to fix.

`next dev` also writes its PID, port, and URL to `.next/dev/lock`. A second `next dev` in the same project prints the running server's URL and the PID to kill, so an agent connects to the existing server instead of starting a duplicate.

The **framework's view** comes from the [Next.js MCP server](/docs/app/guides/mcp) at `/_next/mcp`, which exposes the running dev server's routes, server logs, and compilation issues. Its `get_compilation_issues` and `compile_route` tools report whether the code compiles straight from the dev server, so an agent doesn't have to run a full `next build` to find out.

The **browser's view** comes from [`agent-browser`](https://github.com/vercel-labs/agent-browser), a CLI that exposes the DOM, console, network, and Web Vitals as structured text. With React DevTools enabled (pass `--enable react-devtools` to `agent-browser open`, which the `next-dev-loop` skill does for you), it also reports the component tree and which Suspense boundaries are still pending. An agent runs a command like `react tree`, reads the output, and decides what to inspect next, instead of looking at a DevTools panel it can't see.

The [`next-dev-loop` skill](#next-dev-loop) builds on both views, combining the framework's and the browser's perspective into a single edit-and-verify loop.

> **Good to know:** For the story behind this tooling, see the [Next.js 16.2](https://nextjs.org/blog/next-16-2-ai) and [Next.js 16.3](https://nextjs.org/blog/next-16-3-ai-improvements) AI blog posts.

## Step 3: Let errors drive the fixes

With [Cache Components](/docs/app/api-reference/config/next-config-js/cacheComponents) enabled, a blocking error presents labeled fixes, each making a different trade-off. The dev overlay adds a **Copy prompt** button that packages the chosen fix into a paste-ready prompt. The prompt walks the agent through reading the matching error page, applying the canonical pattern, and verifying the result at runtime.

The same menu prints in the `next dev` terminal and in `next build` output, so an agent reading CI logs sees it too:

```txt
// Archivo: Terminal
Route "/products/[slug]": Next.js encountered uncached data during prerendering.

`fetch(...)` or `connection()` accessed outside of `<Suspense>` prevents the route
from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] Cache the data access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
    at ProductPage (app/products/[slug]/page.tsx:52:32)
    ...
```

In `next dev` the stack frame resolves to your source, in both the dev overlay and the terminal. A production build minifies server code, so when the build error alone isn't enough, [`next build --debug-prerender`](/docs/app/guides/building#debugging-build-errors) turns on server source maps and continues past the first failure.

The `Learn more` link resolves to a per-error page under [`/docs/messages`](https://nextjs.org/docs/messages/blocking-prerender-dynamic) written for agents to read. Each page follows the same shape, with the canonical patterns for every fix, the trade-offs against the other fixes, and the gotchas an agent is likely to miss on a first attempt. The [Instant navigation guide](/docs/app/guides/instant-navigation#ai-workflow) walks through the full loop an agent runs on these errors, from reading the insight to writing an `instant()` test that fails before the fix and passes once it's in place.

## Step 4: Hand multi-step workflows to Skills

Framework knowledge comes from the bundled docs, not from Skills. [Benchmark results](https://nextjs.org/evals) show that always-available context outperforms on-demand retrieval. Skills cover the tasks that are workflows rather than lookups, such as adopting Cache Components or Partial Prefetching across an app. Next.js Skills package these as structured instructions an agent installs and follows, sequencing the work and pointing at the relevant docs and [runtime tooling](#step-2-give-agents-runtime-visibility) along the way.

You can [browse the source for these Skills](https://github.com/vercel/next.js/tree/canary/skills) in the Next.js repository and [find them on skills.sh](https://www.skills.sh/vercel/next.js).

The Skills serve three different workflow types:

- **Runtime foundations** such as `next-dev-loop` give any coding task a repeatable inspect, edit, and verify cycle.
- **Interactive workflows** make broader changes with user checkpoints, such as adopting Cache Components or Partial Prefetching across an app.
- **Unattended loops** work toward a verifiable goal and stop only for genuine decisions.

### `next-dev-loop`

The [`next-dev-loop`](https://www.skills.sh/vercel/next.js/next-dev-loop) runtime foundation verifies changes against a running dev server using the [MCP server](/docs/app/guides/mcp) and browser.

```bash
// Archivo: Terminal
npx skills add vercel/next.js --skill next-dev-loop
```

Then give the agent this prompt:

```prompt
After every edit, verify the page still works at runtime using the next-dev-loop Skill.
```

### `next-cache-components-adoption`

The [`next-cache-components-adoption`](https://www.skills.sh/vercel/next.js/next-cache-components-adoption) Skill migrates an app to [Cache Components](/docs/app/getting-started/caching):

1. Turns the flag on and finds the routes that can't prerender.
2. Fixes them one feature at a time, checking in with you before moving on.
3. Confirms a feature against `next dev` and `next build` before leaving it.

You choose whether the work lands as a series of PRs or stays on one branch.

```bash
// Archivo: Terminal
npx skills add vercel/next.js --skill next-cache-components-adoption
```

Then give the agent this prompt:

```prompt
Adopt Cache Components in this project using the next-cache-components-adoption Skill.
```

### `next-cache-components-optimizer`

The [`next-cache-components-optimizer`](https://www.skills.sh/vercel/next.js/next-cache-components-optimizer) Skill takes a target route or set of routes and works toward the UI you want on screen at click time:

1. Writes a failing [`instant()`](/docs/app/guides/instant-navigation#prevent-regressions-with-e2e-tests) test for the UI you named.
2. Refactors the route until it passes, often by moving a data read below a `<Suspense>` boundary.
3. Commits the passing test with the refactoring, so it catches future regressions.

It needs a route that already builds with [Cache Components](/docs/app/getting-started/caching).

```bash
// Archivo: Terminal
npx skills add vercel/next.js --skill next-cache-components-optimizer
```

Then give the agent a prompt like:

```prompt
Make the navigation from /settings to /dashboard instant using the next-cache-components-optimizer Skill. The header and the project list should be part of the instant UI.
```

### `next-partial-prefetching-adoption`

The [`next-partial-prefetching-adoption`](https://www.skills.sh/vercel/next.js/next-partial-prefetching-adoption) Skill moves an app onto [Partial Prefetching](/docs/app/guides/adopting-partial-prefetching), where links share one App Shell:

1. Audits existing `<Link prefetch={true}>` navigations and identifies the prefetched UI to preserve.
2. Captures that UI in passing [`instant()`](/docs/app/guides/instant-navigation#prevent-regressions-with-e2e-tests) tests before enabling Partial Prefetching, then migrates each destination until the same tests pass unchanged.
3. Enables the flag, resolves the URL-data insights it surfaces, and marks optional per-link prefetching candidates for later.

It needs [Cache Components](/docs/app/getting-started/caching) already adopted and a production-like build it can run for prefetch verification.

```bash
// Archivo: Terminal
npx skills add vercel/next.js --skill next-partial-prefetching-adoption
```

Then give the agent this prompt:

```prompt
Adopt Partial Prefetching in this project using the next-partial-prefetching-adoption Skill.
```


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-add-analytics-to-your-nextjs-application"></a>

## How to add analytics to your Next.js application

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/analytics](https://nextjs.org/docs/app/guides/analytics)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Measure and track page performance using Next.js Speed Insights*  

---

Next.js has built-in support for measuring and reporting performance metrics. You can either use the [`useReportWebVitals`](/docs/app/api-reference/functions/use-report-web-vitals) hook to manage reporting yourself, or alternatively, Vercel provides a [managed service](https://vercel.com/analytics?utm_source=next-site&utm_medium=docs&utm_campaign=next-website) to automatically collect and visualize metrics for you.

## Client Instrumentation

For more advanced analytics and monitoring needs, Next.js provides a `instrumentation-client.js|ts` file that runs before your application's frontend code starts executing. This is ideal for setting up global analytics, error tracking, or performance monitoring tools.

To use it, create an `instrumentation-client.js` or `instrumentation-client.ts` file in your application's root directory:

```js
// Archivo: instrumentation-client.js
// Initialize analytics before the app starts
console.log('Analytics initialized')

// Set up global error tracking
window.addEventListener('error', (event) => {
  // Send to your error tracking service
  reportError(event.error)
})
```

## Build Your Own

> 📘 **Nota para Pages Router:**
> ```jsx filename="pages/_app.js"
> import { useReportWebVitals } from 'next/web-vitals'
> 
> function MyApp({ Component, pageProps }) {
>   useReportWebVitals((metric) => {
>     console.log(metric)
>   })
> 
>   return <Component {...pageProps} />
> }
> ```
> 
> View the [API Reference](/docs/pages/api-reference/functions/use-report-web-vitals) for more information.

```jsx
// Archivo: app/_components/web-vitals.js
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    console.log(metric)
  })
}
```

```jsx
// Archivo: app/layout.js
import { WebVitals } from './_components/web-vitals'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <WebVitals />
        {children}
      </body>
    </html>
  )
}
```

> Since the `useReportWebVitals` hook requires the `'use client'` directive, the most performant approach is to create a separate component that the root layout imports. This confines the client boundary exclusively to the `WebVitals` component.

View the [API Reference](/docs/app/api-reference/functions/use-report-web-vitals) for more information.

## Web Vitals

[Web Vitals](https://web.dev/vitals/) are a set of useful metrics that aim to capture the user
experience of a web page. The following web vitals are all included:

- [Time to First Byte](https://developer.mozilla.org/docs/Glossary/Time_to_first_byte) (TTFB)
- [First Contentful Paint](https://developer.mozilla.org/docs/Glossary/First_contentful_paint) (FCP)
- [Largest Contentful Paint](https://web.dev/lcp/) (LCP)
- [First Input Delay](https://web.dev/fid/) (FID)
- [Cumulative Layout Shift](https://web.dev/cls/) (CLS)
- [Interaction to Next Paint](https://web.dev/inp/) (INP)

You can handle all the results of these metrics using the `name` property.

> 📘 **Nota para Pages Router:**
> ```jsx filename="pages/_app.js"
> import { useReportWebVitals } from 'next/web-vitals'
> 
> function MyApp({ Component, pageProps }) {
>   useReportWebVitals((metric) => {
>     switch (metric.name) {
>       case 'FCP': {
>         // handle FCP results
>       }
>       case 'LCP': {
>         // handle LCP results
>       }
>       // ...
>     }
>   })
> 
>   return <Component {...pageProps} />
> }
> ```

```tsx
// Archivo: app/_components/web-vitals.tsx switcher
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'FCP': {
        // handle FCP results
      }
      case 'LCP': {
        // handle LCP results
      }
      // ...
    }
  })
}
```

```jsx
// Archivo: app/_components/web-vitals.js switcher
'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'FCP': {
        // handle FCP results
      }
      case 'LCP': {
        // handle LCP results
      }
      // ...
    }
  })
}
```

> 📘 **Nota para Pages Router:**
> ## Custom Metrics
> 
> In addition to the core metrics listed above, there are some additional custom metrics that
> measure the time it takes for the page to hydrate and render:
> 
> - `Next.js-hydration`: Length of time it takes for the page to start and finish hydrating (in ms)
> - `Next.js-route-change-to-render`: Length of time it takes for a page to start rendering after a
>   route change (in ms)
> - `Next.js-render`: Length of time it takes for a page to finish render after a route change (in ms)
> 
> You can handle all the results of these metrics separately:
> 
> ```js
> export function reportWebVitals(metric) {
>   switch (metric.name) {
>     case 'Next.js-hydration':
>       // handle hydration results
>       break
>     case 'Next.js-route-change-to-render':
>       // handle route-change to render results
>       break
>     case 'Next.js-render':
>       // handle render results
>       break
>     default:
>       break
>   }
> }
> ```
> 
> These metrics work in all browsers that support the [User Timing API](https://caniuse.com/#feat=user-timing).

## Sending results to external systems

You can send results to any endpoint to measure and track
real user performance on your site. For example:

```js
useReportWebVitals((metric) => {
  const body = JSON.stringify(metric)
  const url = 'https://example.com/analytics'

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body)
  } else {
    fetch(url, { body, method: 'POST', keepalive: true })
  }
})
```

> **Good to know**: If you use [Google Analytics](https://analytics.google.com/analytics/web/), using the
> `id` value can allow you to construct metric distributions manually (to calculate percentiles,
> etc.)

> ```js
> useReportWebVitals((metric) => {
>   // Use `window.gtag` if you initialized Google Analytics as this example:
>   // https://github.com/vercel/next.js/blob/canary/examples/with-google-analytics
>   window.gtag('event', metric.name, {
>     value: Math.round(
>       metric.name === 'CLS' ? metric.value * 1000 : metric.value
>     ), // values must be integers
>     event_label: metric.id, // id unique to current page load
>     non_interaction: true, // avoids affecting bounce rate.
>   })
> })
> ```
>
> Read more about [sending results to Google Analytics](https://github.com/GoogleChrome/web-vitals#send-the-results-to-google-analytics).


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-use-nextjs-as-a-backend-for-your-frontend"></a>

## How to use Next.js as a backend for your frontend

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/backend-for-frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to use Next.js as a backend framework*  

---

Next.js supports the "Backend for Frontend" pattern. This lets you create public endpoints to handle HTTP requests and return any content type—not just HTML. You can also access data sources and perform side effects like updating remote data.

If you are starting a new project, using `create-next-app` with the `--api` flag automatically includes an example `route.ts` in your new project's `app/` folder, demonstrating how to create an API endpoint.

```bash
# Manejador de paquetes: pnpm
pnpm create next-app --api
```

```bash
# Manejador de paquetes: npm
npx create-next-app@latest --api
```

```bash
# Manejador de paquetes: yarn
yarn create next-app --api
```

```bash
# Manejador de paquetes: bun
bun create next-app --api
```

> **Good to know**: Next.js backend capabilities are not a full backend replacement. They serve as an API layer that:
>
> - is publicly reachable
> - handles any HTTP request
> - can return any content type

To implement this pattern, use:

- [Route Handlers](/docs/app/api-reference/file-conventions/route)
- [`proxy`](/docs/app/api-reference/file-conventions/proxy)
- In Pages Router, [API Routes](/docs/pages/building-your-application/routing/api-routes)

## Public Endpoints

Route Handlers are public HTTP endpoints. Any client can access them.

Create a Route Handler using the `route.ts` or `route.js` file convention:

```ts
// Archivo: /app/api/route.ts switcher
export function GET(request: Request) {}
```

```js
// Archivo: /app/api/route.js switcher
export function GET(request) {}
```

This handles `GET` requests sent to `/api`.

Use `try/catch` blocks for operations that may throw an exception:

```ts
// Archivo: /app/api/route.ts switcher
import { submit } from '@/lib/submit'

export async function POST(request: Request) {
  try {
    await submit(request)
    return new Response(null, { status: 204 })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error'

    return new Response(message, { status: 500 })
  }
}
```

```js
// Archivo: /app/api/route.js switcher
import { submit } from '@/lib/submit'

export async function POST(request) {
  try {
    await submit(request)
    return new Response(null, { status: 204 })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error'

    return new Response(message, { status: 500 })
  }
}
```

Avoid exposing sensitive information in error messages sent to the client.

To restrict access, implement authentication and authorization. See [Authentication](/docs/app/guides/authentication).

## Content types

Route Handlers let you serve non-UI responses, including JSON, XML, images, files, and plain text.

Next.js uses file conventions for common endpoints:

- [`sitemap.xml`](/docs/app/api-reference/file-conventions/metadata/sitemap)
- [`opengraph-image.jpg`, `twitter-image`](/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [favicon, app icon, and apple-icon](/docs/app/api-reference/file-conventions/metadata/app-icons)
- [`manifest.json`](/docs/app/api-reference/file-conventions/metadata/manifest)
- [`robots.txt`](/docs/app/api-reference/file-conventions/metadata/robots)

You can also define custom ones, such as:

- `llms.txt`
- `rss.xml`
- `.well-known`

For example, `app/rss.xml/route.ts` creates a Route Handler for `rss.xml`.

```ts
// Archivo: /app/rss.xml/route.ts switcher
export async function GET(request: Request) {
  const rssResponse = await fetch(/* rss endpoint */)
  const rssData = await rssResponse.json()

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
 <title>${rssData.title}</title>
 <description>${rssData.description}</description>
 <link>${rssData.link}</link>
 <copyright>${rssData.copyright}</copyright>
 ${rssData.items.map((item) => {
   return `<item>
    <title>${item.title}</title>
    <description>${item.description}</description>
    <link>${item.link}</link>
    <pubDate>${item.publishDate}</pubDate>
    <guid isPermaLink="false">${item.guid}</guid>
 </item>`
 })}
</channel>
</rss>`

  const headers = new Headers({ 'content-type': 'application/xml' })

  return new Response(rssFeed, { headers })
}
```

```js
// Archivo: /app/rss.xml/route.js switcher
export async function GET(request) {
  const rssResponse = await fetch(/* rss endpoint */)
  const rssData = await rssResponse.json()

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
 <title>${rssData.title}</title>
 <description>${rssData.description}</description>
 <link>${rssData.link}</link>
 <copyright>${rssData.copyright}</copyright>
 ${rssData.items.map((item) => {
   return `<item>
    <title>${item.title}</title>
    <description>${item.description}</description>
    <link>${item.link}</link>
    <pubDate>${item.publishDate}</pubDate>
    <guid isPermaLink="false">${item.guid}</guid>
 </item>`
 })}
</channel>
</rss>`

  const headers = new Headers({ 'content-type': 'application/xml' })

  return new Response(rssFeed, { headers })
}
```

Sanitize any input used to generate markup.

### Content negotiation

You can use [rewrites](/docs/app/api-reference/config/next-config-js/rewrites) with header matching to serve different content types from the same URL based on the request's `Accept` header. This is known as [content negotiation](https://developer.mozilla.org/en-US/docs/Web/HTTP/Content_negotiation).

For example, a documentation site might serve HTML pages to browsers and raw Markdown to AI agents from the same `/docs/…` URLs.

**1. Configure a rewrite that matches the `Accept` header:**

```js
// Archivo: next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/docs/:slug*',
        destination: '/docs/md/:slug*',
        has: [
          {
            type: 'header',
            key: 'accept',
            value: '(.*)text/markdown(.*)',
          },
        ],
      },
    ]
  },
}
```

When a request to `/docs/getting-started` includes `Accept: text/markdown`, the rewrite routes it to `/docs/md/getting-started`. A Route Handler at that path returns the Markdown response. Clients that do not send `text/markdown` in their `Accept` header continue to receive the normal HTML page.

**2. Create a Route Handler for the Markdown response:**

```ts
// Archivo: app/docs/md/[...slug]/route.ts switcher
import { getDocsMd, generateDocsStaticParams } from '@/lib/docs'

export async function generateStaticParams() {
  return generateDocsStaticParams()
}

export async function GET(_: Request, ctx: RouteContext<'/docs/md/[...slug]'>) {
  const { slug } = await ctx.params
  const mdDoc = await getDocsMd({ slug })

  if (mdDoc == null) {
    return new Response(null, { status: 404 })
  }

  return new Response(mdDoc, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
    },
  })
}
```

```js
// Archivo: app/docs/md/[...slug]/route.js switcher
import { getDocsMd, generateDocsStaticParams } from '@/lib/docs'

export async function generateStaticParams() {
  return generateDocsStaticParams()
}

export async function GET(_, { params }) {
  const { slug } = await params
  const mdDoc = await getDocsMd({ slug })

  if (mdDoc == null) {
    return new Response(null, { status: 404 })
  }

  return new Response(mdDoc, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept',
    },
  })
}
```

The [`Vary: Accept`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) response header tells caches that the response body depends on the `Accept` request header. Without it, a shared cache could serve a cached Markdown response to a browser (or vice versa). Most hosting providers already include the `Accept` header in their cache key, but setting `Vary` explicitly ensures correct behavior across all CDNs and proxy caches.

`generateStaticParams` lets you pre-render the Markdown variants at build time so they can be served from the edge without hitting the origin server on every request.

**3. Test it with `curl`:**

```bash
# Returns Markdown
curl -H "Accept: text/markdown" https://example.com/docs/getting-started

# Returns the normal HTML page
curl https://example.com/docs/getting-started
```

> **Good to know:**
>
> - The `/docs/md/...` route is still directly accessible without the rewrite. If you want to restrict it to only serve via the rewrite, use [`proxy`](/docs/app/api-reference/file-conventions/proxy) to block direct requests that don't include the expected `Accept` header.
> - For more advanced negotiation logic, you can use [`proxy`](/docs/app/api-reference/file-conventions/proxy) instead of rewrites for more flexibility.

### Consuming request payloads

Use Request [instance methods](https://developer.mozilla.org/en-US/docs/Web/API/Request#instance_methods) like `.json()`, `.formData()`, or `.text()` to access the request body.

`GET` and `HEAD` requests don’t carry a body.

```ts
// Archivo: /app/api/echo-body/route.ts switcher
export async function POST(request: Request) {
  const res = await request.json()
  return Response.json({ res })
}
```

```js
// Archivo: /app/api/echo-body/route.js switcher
export async function POST(request) {
  const res = await request.json()
  return Response.json({ res })
}
```

> **Good to know**: Validate data before passing it to other systems

```ts
// Archivo: /app/api/send-email/route.ts switcher
import { sendMail, validateInputs } from '@/lib/email-transporter'

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = formData.get('email')
  const contents = formData.get('contents')

  try {
    await validateInputs({ email, contents })
    const info = await sendMail({ email, contents })

    return Response.json({ messageId: info.messageId })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
```

```js
// Archivo: /app/api/send-email/route.js switcher
import { sendMail, validateInputs } from '@/lib/email-transporter'

export async function POST(request) {
  const formData = await request.formData()
  const email = formData.get('email')
  const contents = formData.get('contents')

  try {
    await validateInputs({ email, contents })
    const info = await sendMail({ email, contents })

    return Response.json({ messageId: info.messageId })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
```

You can only read the request body once. Clone the request if you need to read it again:

```ts
// Archivo: /app/api/clone/route.ts switcher
export async function POST(request: Request) {
  try {
    const clonedRequest = request.clone()

    await request.text()
    await clonedRequest.text()
    await request.text() // Throws error

    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 500 })
  }
}
```

```js
// Archivo: /app/api/clone/route.js switcher
export async function POST(request) {
  try {
    const clonedRequest = request.clone()

    await request.text()
    await clonedRequest.text()
    await request.text() // Throws error

    return new Response(null, { status: 204 })
  } catch {
    return new Response(null, { status: 500 })
  }
}
```

## Manipulating data

Route Handlers can transform, filter, and aggregate data from one or more sources. This keeps logic out of the frontend and avoids exposing internal systems.

You can also offload heavy computations to the server and reduce client battery and data usage.

```ts file="/app/api/weather/route.ts" switcher
import { parseWeatherData } from '@/lib/weather'

export async function POST(request: Request) {
  const body = await request.json()
  const searchParams = new URLSearchParams({ lat: body.lat, lng: body.lng })

  try {
    const weatherResponse = await fetch(`${weatherEndpoint}?${searchParams}`)

    if (!weatherResponse.ok) 

    const weatherData = await weatherResponse.text()
    const payload = parseWeatherData.asJSON(weatherData)

    return new Response(payload, { status: 200 })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
```

```js file="/app/api/weather/route.js" switcher
import { parseWeatherData } from '@/lib/weather'

export async function POST(request) {
  const body = await request.json()
  const searchParams = new URLSearchParams({ lat: body.lat, lng: body.lng })

  try {
    const weatherResponse = await fetch(`${weatherEndpoint}?${searchParams}`)

    if (!weatherResponse.ok) 

    const weatherData = await weatherResponse.text()
    const payload = parseWeatherData.asJSON(weatherData)

    return new Response(payload, { status: 200 })
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
```

> **Good to know**: This example uses `POST` to avoid putting geo-location data in the URL. `GET` requests may be cached or logged, which could expose sensitive info.

## Proxying to a backend

You can use a Route Handler as a `proxy` to another backend. Add validation logic before forwarding the request.

```ts
// Archivo: /app/api/[...slug]/route.ts switcher
import { isValidRequest } from '@/lib/utils'

export async function POST(request: Request, { params }) {
  const clonedRequest = request.clone()
  const isValid = await isValidRequest(clonedRequest)

  if (!isValid) {
    return new Response(null, { status: 400, statusText: 'Bad Request' })
  }

  const { slug } = await params
  const pathname = slug.join('/')
  const proxyURL = new URL(pathname, 'https://nextjs.org')
  const proxyRequest = new Request(proxyURL, request)

  try {
    return fetch(proxyRequest)
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
```

```js
// Archivo: /app/api/[...slug]/route.js switcher
import { isValidRequest } from '@/lib/utils'

export async function POST(request, { params }) {
  const clonedRequest = request.clone()
  const isValid = await isValidRequest(clonedRequest)

  if (!isValid) {
    return new Response(null, { status: 400, statusText: 'Bad Request' })
  }

  const { slug } = await params
  const pathname = slug.join('/')
  const proxyURL = new URL(pathname, 'https://nextjs.org')
  const proxyRequest = new Request(proxyURL, request)

  try {
    return fetch(proxyRequest)
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected exception'

    return new Response(message, { status: 500 })
  }
}
```

Or use:

- `proxy` [rewrites](#proxy)
- [`rewrites`](/docs/app/api-reference/config/next-config-js/rewrites) in `next.config.js`.

## NextRequest and NextResponse

Next.js extends the [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) Web APIs with methods that simplify common operations. These extensions are available in both Route Handlers and Proxy.

Both provide methods for reading and manipulating cookies.

`NextRequest` includes the [`nextUrl`](/docs/app/api-reference/functions/next-request#nexturl) property, which exposes parsed values from the incoming request, for example, it makes it easier to access request pathname and search params.

`NextResponse` provides helpers like `next()`, `json()`, `redirect()`, and `rewrite()`.

You can pass `NextRequest` to any function expecting `Request`. Likewise, you can return `NextResponse` where a `Response` is expected.

```ts
// Archivo: /app/echo-pathname/route.ts switcher
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const nextUrl = request.nextUrl

  if (nextUrl.searchParams.get('redirect')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (nextUrl.searchParams.get('rewrite')) {
    return NextResponse.rewrite(new URL('/', request.url))
  }

  return NextResponse.json({ pathname: nextUrl.pathname })
}
```

```js
// Archivo: /app/echo-pathname/route.js switcher
import { NextResponse } from 'next/server'

export async function GET(request) {
  const nextUrl = request.nextUrl

  if (nextUrl.searchParams.get('redirect')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (nextUrl.searchParams.get('rewrite')) {
    return NextResponse.rewrite(new URL('/', request.url))
  }

  return NextResponse.json({ pathname: nextUrl.pathname })
}
```

Learn more about [`NextRequest`](/docs/app/api-reference/functions/next-request) and [`NextResponse`](/docs/app/api-reference/functions/next-response).

## Webhooks and callback URLs

Use Route Handlers to receive event notifications from third-party applications.

For example, revalidate a route when content changes in a CMS. Configure the CMS to call a specific endpoint on changes.

```ts
// Archivo: /app/webhook/route.ts switcher
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token')

  if (token !== process.env.REVALIDATE_SECRET_TOKEN) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get('tag')

  if (!tag) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  revalidateTag(tag, 'max')

  return NextResponse.json({ success: true })
}
```

```js
// Archivo: /app/webhook/route.js switcher
import { NextResponse } from 'next/server'

export async function GET(request) {
  const token = request.nextUrl.searchParams.get('token')

  if (token !== process.env.REVALIDATE_SECRET_TOKEN) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get('tag')

  if (!tag) {
    return NextResponse.json({ success: false }, { status: 400 })
  }

  revalidateTag(tag, 'max')

  return NextResponse.json({ success: true })
}
```

Callback URLs are another use case. When a user completes a third-party flow, the third party sends them to a callback URL. Use a Route Handler to verify the response and decide where to redirect the user.

```ts
// Archivo: /app/auth/callback/route.ts switcher
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('session_token')
  const redirectUrl = request.nextUrl.searchParams.get('redirect_url')

  const destination = new URL(redirectUrl ?? '/', request.url)
  // Prevent open redirects: only allow same-origin destinations
  if (destination.origin !== request.nextUrl.origin) {
    return new Response('Invalid redirect', { status: 400 })
  }

  const response = NextResponse.redirect(destination)

  response.cookies.set({
    value: token,
    name: '_token',
    path: '/',
    secure: true,
    httpOnly: true,
    expires: undefined, // session cookie
  })

  return response
}
```

```js
// Archivo: /app/auth/callback/route.js switcher
import { NextResponse } from 'next/server'

export async function GET(request) {
  const token = request.nextUrl.searchParams.get('session_token')
  const redirectUrl = request.nextUrl.searchParams.get('redirect_url')

  const destination = new URL(redirectUrl ?? '/', request.url)
  // Prevent open redirects: only allow same-origin destinations
  if (destination.origin !== request.nextUrl.origin) {
    return new Response('Invalid redirect', { status: 400 })
  }

  const response = NextResponse.redirect(destination)

  response.cookies.set({
    value: token,
    name: '_token',
    path: '/',
    secure: true,
    httpOnly: true,
    expires: undefined, // session cookie
  })

  return response
}
```

## Redirects

```ts
// Archivo: app/api/route.ts switcher
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  redirect('https://nextjs.org/')
}
```

```js
// Archivo: app/api/route.js switcher
import { redirect } from 'next/navigation'

export async function GET(request) {
  redirect('https://nextjs.org/')
}
```

Learn more about redirects in [`redirect`](/docs/app/api-reference/functions/redirect) and [`permanentRedirect`](/docs/app/api-reference/functions/permanentRedirect)

## Proxy

Only one `proxy` file is allowed per project. Use `config.matcher` to target specific paths. Learn more about [`proxy`](/docs/app/api-reference/file-conventions/proxy).

Use `proxy` to generate a response before the request reaches a route path.

```ts
// Archivo: proxy.ts switcher
import { isAuthenticated } from '@lib/auth'

export const config = {
  matcher: '/api/:function*',
}

export function proxy(request: Request) {
  if (!isAuthenticated(request)) {
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

```js
// Archivo: proxy.js switcher
import { isAuthenticated } from '@lib/auth'

export const config = {
  matcher: '/api/:function*',
}

export function proxy(request) {
  if (!isAuthenticated(request)) {
    return Response.json(
      { success: false, message: 'authentication failed' },
      { status: 401 }
    )
  }
}
```

You can also proxy requests using `proxy`:

```ts
// Archivo: proxy.ts switcher
import { NextResponse } from 'next/server'

export function proxy(request: Request) {
  if (request.nextUrl.pathname === '/proxy-this-path') {
    const rewriteUrl = new URL('https://nextjs.org')
    return NextResponse.rewrite(rewriteUrl)
  }
}
```

```js
// Archivo: proxy.js switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  if (request.nextUrl.pathname === '/proxy-this-path') {
    const rewriteUrl = new URL('https://nextjs.org')
    return NextResponse.rewrite(rewriteUrl)
  }
}
```

Another type of response `proxy` can produce are redirects:

```ts
// Archivo: proxy.ts switcher
import { NextResponse } from 'next/server'

export function proxy(request: Request) {
  if (request.nextUrl.pathname === '/v1/docs') {
    request.nextUrl.pathname = '/v2/docs'
    return NextResponse.redirect(request.nextUrl)
  }
}
```

```js
// Archivo: proxy.js switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  if (request.nextUrl.pathname === '/v1/docs') {
    request.nextUrl.pathname = '/v2/docs'
    return NextResponse.redirect(request.nextUrl)
  }
}
```

## Security

### Working with headers

Be deliberate about where headers go, and avoid directly passing incoming request headers to the outgoing response.

- **Upstream request headers**: In Proxy, `NextResponse.next({ request: { headers } })` modifies the headers your server receives and does not expose them to the client.
- **Response headers**: `new Response(..., { headers })`, `NextResponse.json(..., { headers })`, `NextResponse.next({ headers })`, or `response.headers.set(...)` send headers back to the client. If sensitive values were appended to these headers, they will be visible to clients.

Learn more in [NextResponse headers in Proxy](/docs/app/api-reference/functions/next-response#next).

### Rate limiting

You can implement rate limiting in your Next.js backend. In addition to code-based checks, enable any rate limiting features provided by your host.

```ts
// Archivo: /app/resource/route.ts switcher
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: Request) {
  const { rateLimited } = await checkRateLimit(request)

  if (rateLimited) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  return new Response(null, { status: 204 })
}
```

```js
// Archivo: /app/resource/route.js switcher
import { NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request) {
  const { rateLimited } = await checkRateLimit(request)

  if (rateLimited) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
  }

  return new Response(null, { status: 204 })
}
```

### Verify payloads

Never trust incoming request data. Validate content type and size, and sanitize against XSS before use.

Use timeouts to prevent abuse and protect server resources.

Store user-generated static assets in dedicated services. When possible, upload them from the browser and store the returned URI in your database to reduce request size.

### Access to protected resources

Always verify credentials before granting access. Do not rely on proxy alone for authentication and authorization.

Remove sensitive or unnecessary data from responses and backend logs.

Rotate credentials and API keys regularly.

## Preflight Requests

Preflight requests use the `OPTIONS` method to ask the server if a request is allowed based on origin, method, and headers.

If `OPTIONS` is not defined, Next.js adds it automatically and sets the `Allow` header based on the other defined methods.

- [CORS](/docs/app/api-reference/file-conventions/route#cors)

## Library patterns

Community libraries often use the factory pattern for Route Handlers.

```ts
// Archivo: /app/api/[...path]/route.ts
import { createHandler } from 'third-party-library'

const handler = createHandler()

export const GET = handler
// or
export { handler as POST }
```

This creates a shared handler for `GET` and `POST` requests. The library customizes behavior based on the `method` and `pathname` in the request.

Libraries can also provide a `proxy` factory.

```ts
// Archivo: proxy.ts
import { createMiddleware } from 'third-party-library'

export default createMiddleware()
```

> **Good to know**: Third-party libraries may still refer to `proxy` as `middleware`.

## More examples

See more examples on using [Router Handlers](/docs/app/api-reference/file-conventions/route#examples) and the [`proxy`](/docs/app/api-reference/file-conventions/proxy#examples) API references.

These examples include, working with [Cookies](/docs/app/api-reference/file-conventions/route#cookies), [Headers](/docs/app/api-reference/file-conventions/route#headers), [Streaming](/docs/app/api-reference/file-conventions/route#streaming), Proxy [negative matching](/docs/app/api-reference/file-conventions/proxy#negative-matching), and other useful code snippets.

## Caveats

### Server Components

Fetch data in Server Components directly from its source, not via Route Handlers.

For Server Components prerendered at build time, using Route Handlers will fail the build step. This is because, while building there is no server listening for these requests.

For Server Components rendered on demand, fetching from Route Handlers is slower due to the extra HTTP round trip between the handler and the render process.

> A server side `fetch` request uses absolute URLs. This implies an HTTP round trip, to an external server. During development, your own development server acts as the external server. At build time there is no server, and at runtime, the server is available through your public facing domain.

Server Components cover most data-fetching needs. However, fetching data client side might be necessary for:

- Data that depends on client-only Web APIs:
  - Geo-location API
  - Storage API
  - Audio API
  - File API
- Frequently polled data

For these, use community libraries like [`swr`](https://swr.vercel.app/) or [`react-query`](https://tanstack.com/query/latest/docs/framework/react/overview).

### Server Actions

[Server Actions](/docs/app/guides/server-actions) let you run server-side code from the client. Their primary purpose is to mutate data from your frontend client.

Server Actions are queued. Using them for data fetching introduces sequential execution.

### `export` mode

`export` mode outputs a static site without a runtime server. Features that require the Next.js runtime are [not supported](/docs/app/guides/static-exports#unsupported-features), because this mode produces a static site, and no runtime server.

In `export mode`, only `GET` Route Handlers are supported, in combination with the [`dynamic`](/docs/app/guides/caching-without-cache-components#dynamic) route segment config, set to `'force-static'`.

This can be used to generate static HTML, JSON, TXT, or other files.

```js
// Archivo: app/hello-world/route.ts
export const dynamic = 'force-static'

export function GET() {
  return new Response('Hello World', { status: 200 })
}
```

### Deployment environment

Some hosts deploy Route Handlers as lambda functions. This means:

- Route Handlers cannot share data between requests.
- The environment may not support writing to File System.
- Long-running handlers may be terminated due to timeouts.
- WebSockets won’t work because the connection closes on timeout, or after the response is generated.


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-use-debugging-tools-with-nextjs"></a>

## How to use debugging tools with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/debugging](https://nextjs.org/docs/app/guides/debugging)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to debug your Next.js application with VS Code, Chrome DevTools, or Firefox DevTools.*  

---

This documentation explains how you can debug your Next.js frontend and backend code with full source maps support using the [VS Code debugger](https://code.visualstudio.com/docs/editor/debugging), [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools), or [Firefox DevTools](https://firefox-source-docs.mozilla.org/devtools-user/).

Any debugger that can attach to Node.js can also be used to debug a Next.js application. You can find more details in the Node.js [Debugging Guide](https://nodejs.org/learn/getting-started/debugging/).

## Debugging with VS Code

Create a file named `.vscode/launch.json` at the root of your project with the following content:

```json
// Archivo: launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev -- --inspect"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    },
    {
      "name": "Next.js: debug client-side (Firefox)",
      "type": "firefox",
      "request": "launch",
      "url": "http://localhost:3000",
      "reAttach": true,
      "pathMappings": [
        {
          "url": "webpack://_N_E",
          "path": "${workspaceFolder}"
        }
      ]
    },
    {
      "name": "Next.js: debug full stack",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/next/dist/bin/next",
      "runtimeArgs": ["--inspect"],
      "skipFiles": ["<node_internals>/**"],
      "serverReadyAction": {
        "action": "debugWithEdge",
        "killOnServerStop": true,
        "pattern": "- Local:.+(https?://.+)",
        "uriFormat": "%s",
        "webRoot": "${workspaceFolder}"
      }
    }
  ]
}
```

> **Note**: To use Firefox debugging in VS Code, you'll need to install the [Firefox Debugger extension](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug).

`npm run dev` can be replaced with `yarn dev` if you're using Yarn or `pnpm dev` if you're using pnpm.

In the "Next.js: debug full stack" configuration, `serverReadyAction.action` specifies which browser to open when the server is ready. `debugWithEdge` means to launch the Edge browser. If you are using Chrome, change this value to `debugWithChrome`.

If you're [changing the port number](/docs/pages/api-reference/cli/next#next-dev-options) your application starts on, replace the `3000` in `http://localhost:3000` with the port you're using instead.

If you're running Next.js from a directory other than root (for example, if you're using Turborepo) then you need to add `cwd` to the server-side and full stack debugging tasks. For example, `"cwd": "${workspaceFolder}/apps/web"`.

Now go to the Debug panel (`Ctrl+Shift+D` on Windows/Linux, `⇧+⌘+D` on macOS), select a launch configuration, then press `F5` or select **Debug: Start Debugging** from the Command Palette to start your debugging session.

## Using the Debugger in Jetbrains WebStorm

Click the drop down menu listing the runtime configuration, and click `Edit Configurations...`. Create a `JavaScript Debug` debug configuration with `http://localhost:3000` as the URL. Customize to your liking (e.g. Browser for debugging, store as project file), and click `OK`. Run this debug configuration, and the selected browser should automatically open. At this point, you should have 2 applications in debug mode: the Next.js node application, and the client/browser application.

## Debugging with Browser DevTools

### Client-side code

Start your development server as usual by running `next dev`, `npm run dev`, or `yarn dev`. Once the server starts, open `http://localhost:3000` (or your alternate URL) in your preferred browser.

For Chrome:

- Open Chrome's Developer Tools (`Ctrl+Shift+J` on Windows/Linux, `⌥+⌘+I` on macOS)
- Go to the **Sources** tab

For Firefox:

- Open Firefox's Developer Tools (`Ctrl+Shift+I` on Windows/Linux, `⌥+⌘+I` on macOS)
- Go to the **Debugger** tab

In either browser, any time your client-side code reaches a [`debugger`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/debugger) statement, code execution will pause and that file will appear in the debug area. You can also search for files to set breakpoints manually:

- In Chrome: Press `Ctrl+P` on Windows/Linux or `⌘+P` on macOS
- In Firefox: Press `Ctrl+P` on Windows/Linux or `⌘+P` on macOS, or use the file tree in the left panel

Note that when searching, your source files will have paths starting with `webpack://_N_E/./`.

### React Developer Tools

For React-specific debugging, install the [React Developer Tools](https://react.dev/learn/react-developer-tools) browser extension. This essential tool helps you:

- Inspect React components
- Edit props and state
- Identify performance problems

### Server-side code

To debug server-side Next.js code with browser DevTools, you need to pass the `--inspect` flag:

```bash
# Manejador de paquetes: pnpm
pnpm dev --inspect
```

```bash
# Manejador de paquetes: npm
npm run dev -- --inspect
```

```bash
# Manejador de paquetes: yarn
yarn dev --inspect
```

```bash
# Manejador de paquetes: bun
bun run dev --inspect
```

The value of `--inspect` is passed to the underlying Node.js process. Check out the [`--inspect` docs for advanced use cases](https://nodejs.org/api/cli.html#--inspecthostport).

> **Good to know**: Use `--inspect=0.0.0.0` to allow remote debugging access outside localhost, such as when running the app in a Docker container.

Launching the Next.js server with the `--inspect` flag will look something like this:

```bash
// Archivo: Terminal
Debugger listening on ws://127.0.0.1:9229/0cf90313-350d-4466-a748-cd60f4e47c95
For help, see: https://nodejs.org/learn/getting-started/debugging
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

For Chrome:

1. Open a new tab and visit `chrome://inspect`
1. Look for your Next.js application in the **Remote Target** section
1. Click **inspect** to open a separate DevTools window
1. Go to the **Sources** tab

For Firefox:

1. Open a new tab and visit `about:debugging`
1. Click **This Firefox** in the left sidebar
1. Under **Remote Targets**, find your Next.js application
1. Click **Inspect** to open the debugger
1. Go to the **Debugger** tab

Debugging server-side code works similarly to client-side debugging. When searching for files (`Ctrl+P`/`⌘+P`), your source files will have paths starting with `webpack://{application-name}/./` (where `{application-name}` will be replaced with the name of your application according to your `package.json` file).

To use `--inspect-brk` or `--inspect-wait`, you have to specify `NODE_OPTIONS` instead. e.g. `NODE_OPTIONS=--inspect-brk next dev`.

### Inspect Server Errors with Browser DevTools

When you encounter an error, inspecting the source code can help trace the root cause of errors.

Next.js will display a Node.js icon underneath the Next.js version indicator on the error overlay. By clicking that icon, the DevTools URL is copied to your clipboard. You can open a new browser tab with that URL to inspect the Next.js server process.

### Debugging on Windows

Ensure Windows Defender is disabled on your machine. This external service will check _every file read_, which has been reported to greatly increase Fast Refresh time with `next dev`. This is a known issue, not related to Next.js, but it does affect Next.js development.

## More information

To learn more about how to use a JavaScript debugger, take a look at the following documentation:

- [Node.js debugging in VS Code: Breakpoints](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_breakpoints)
- [Chrome DevTools: Debug JavaScript](https://developers.google.com/web/tools/chrome-devtools/javascript)
- [Firefox DevTools: Debugger](https://firefox-source-docs.mozilla.org/devtools-user/debugger/)


[⬆ Subir al inicio del capítulo](#)

---

<a id="internationalization"></a>

## Internationalization

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/internationalization](https://nextjs.org/docs/app/guides/internationalization)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Add support for multiple languages with internationalized routing and localized content.*  

---

Next.js enables you to configure the routing and rendering of content to support multiple languages. Making your site adaptive to different locales includes translated content (localization) and internationalized routes.

## Terminology

- **Locale:** An identifier for a set of language and formatting preferences. This usually includes the preferred language of the user and possibly their geographic region.
  - `en-US`: English as spoken in the United States
  - `nl-NL`: Dutch as spoken in the Netherlands
  - `nl`: Dutch, no specific region

## Routing Overview

It’s recommended to use the user’s language preferences in the browser to select which locale to use. Changing your preferred language will modify the incoming `Accept-Language` header to your application.

For example, using the following libraries, you can look at an incoming `Request` to determine which locale to select, based on the `Headers`, locales you plan to support, and the default locale.

```js
// Archivo: proxy.js
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

let headers = { 'accept-language': 'en-US,en;q=0.5' }
let languages = new Negotiator({ headers }).languages()
let locales = ['en-US', 'nl-NL', 'nl']
let defaultLocale = 'en-US'

match(languages, locales, defaultLocale) // -> 'en-US'
```

Routing can be internationalized by either the sub-path (`/fr/products`) or domain (`my-site.fr/products`). With this information, you can now redirect the user based on the locale inside [Proxy](/docs/app/api-reference/file-conventions/proxy).

```js
// Archivo: proxy.js
import { NextResponse } from "next/server";

let locales = ['en-US', 'nl-NL', 'nl']

// Get the preferred locale, similar to the above or using a library
function getLocale(request) { ... }

export function proxy(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}
```

Finally, ensure all special files inside `app/` are nested under `app/[lang]`. This enables the Next.js router to dynamically handle different locales in the route, and forward the `lang` parameter to every layout and page. For example:

```tsx
// Archivo: app/[lang]/page.tsx switcher
// You now have access to the current locale
// e.g. /en-US/products -> `lang` is "en-US"
export default async function Page({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params
  return ...
}
```

```jsx
// Archivo: app/[lang]/page.js switcher
// You now have access to the current locale
// e.g. /en-US/products -> `lang` is "en-US"
export default async function Page({ params }) {
  const { lang } = await params
  return ...
}
```

> **Good to know:** `PageProps` and `LayoutProps` are globally available TypeScript helpers that provide strong typing for route parameters. See [PageProps](/docs/app/api-reference/file-conventions/page#page-props-helper) and [LayoutProps](/docs/app/api-reference/file-conventions/layout#layout-props-helper) for more details.

The root layout can also be nested in the new folder (e.g. `app/[lang]/layout.js`).

## Localization

Changing displayed content based on the user’s preferred locale, or localization, is not something specific to Next.js. The patterns described below would work the same with any web application.

Let’s assume we want to support both English and Dutch content inside our application. We might maintain two different “dictionaries”, which are objects that give us a mapping from some key to a localized string. For example:

```json
// Archivo: dictionaries/en.json
{
  "products": {
    "cart": "Add to Cart"
  }
}
```

```json
// Archivo: dictionaries/nl.json
{
  "products": {
    "cart": "Toevoegen aan Winkelwagen"
  }
}
```

We can then create a `getDictionary` function to load the translations for the requested locale:

```ts
// Archivo: app/[lang]/dictionaries.ts switcher
import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async (locale: Locale) => dictionaries[locale]()
```

```js
// Archivo: app/[lang]/dictionaries.js switcher
import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
}

export const hasLocale = (locale) => locale in dictionaries

export const getDictionary = async (locale) => dictionaries[locale]()
```

Given the currently selected language, we can fetch the dictionary inside of a layout or page.

Since `lang` is typed as `string`, using `hasLocale` narrows the type to your supported locales. It also ensures a 404 is returned if a translation is missing, rather than a runtime error.

```tsx
// Archivo: app/[lang]/page.tsx switcher
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from './dictionaries'

export default async function Page({ params }: PageProps<'/[lang]'>) {
  const { lang } = await params

  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  return <button>{dict.products.cart}</button> // Add to Cart
}
```

```jsx
// Archivo: app/[lang]/page.js switcher
import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from './dictionaries'

export default async function Page({ params }) {
  const { lang } = await params

  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)
  return <button>{dict.products.cart}</button> // Add to Cart
}
```

Because all layouts and pages in the `app/` directory default to [Server Components](/docs/app/getting-started/server-and-client-components), we do not need to worry about the size of the translation files affecting our client-side JavaScript bundle size. This code will **only run on the server**, and only the resulting HTML will be sent to the browser.

## Sharing the locale across your app

The locale is often needed beyond the page that receives it, such as in shared data-fetching utilities or deeply nested components. Instead of prop drilling `lang` through each layer, we can read it directly with [`next/root-params`](/docs/app/api-reference/functions/next-root-params).

`next/root-params` exports a getter for each dynamic segment above the root layout. Since every route is nested under `app/[lang]`, `lang` is a root parameter, and any Server Component or server-side utility can call its getter. We can move the locale lookup into `getDictionary`, so callers no longer pass `lang`:

```ts
// Archivo: app/[lang]/dictionaries.ts highlight={1,2,15,16,17} switcher
import { lang } from 'next/root-params'
import { notFound } from 'next/navigation'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
}

export type Locale = keyof typeof dictionaries

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries

export const getDictionary = async () => {
  const locale = await lang()
  if (!hasLocale(locale)) notFound()
  return dictionaries[locale]()
}
```

```js
// Archivo: app/[lang]/dictionaries.js highlight={1,2,12,13,14} switcher
import { lang } from 'next/root-params'
import { notFound } from 'next/navigation'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
}

export const hasLocale = (locale) => locale in dictionaries

export const getDictionary = async () => {
  const locale = await lang()
  if (!hasLocale(locale)) notFound()
  return dictionaries[locale]()
}
```

> **Good to know:** Files that import from `next/root-params` do not need `import 'server-only'`. The import already fails at build time if used in a Client Component.

Pages and components then call `getDictionary()` with no arguments, since the locale is resolved internally:

```tsx
// Archivo: app/[lang]/page.tsx highlight={4} switcher
import { getDictionary } from './dictionaries'

export default async function Page() {
  const dict = await getDictionary()
  return <button>{dict.products.cart}</button> // Add to Cart
}
```

```jsx
// Archivo: app/[lang]/page.js highlight={4} switcher
import { getDictionary } from './dictionaries'

export default async function Page() {
  const dict = await getDictionary()
  return <button>{dict.products.cart}</button> // Add to Cart
}
```

> **Good to know:** Root parameter getters run in Server Components and server-side utilities, but not in Client Components, Server Actions, or Route Handlers. See [`next/root-params`](/docs/app/api-reference/functions/next-root-params) for the full API and its behavior with caching.

## Static Rendering

To generate static routes for a given set of locales, we can use `generateStaticParams` with any page or layout. This can be global, for example, in the root layout:

```tsx
// Archivo: app/[lang]/layout.tsx switcher
export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'de' }]
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<'/[lang]'>) {
  return (
    <html lang={(await params).lang}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx
// Archivo: app/[lang]/layout.js switcher
export async function generateStaticParams() {
  return [{ lang: 'en-US' }, { lang: 'de' }]
}

export default async function RootLayout({ children, params }) {
  return (
    <html lang={(await params).lang}>
      <body>{children}</body>
    </html>
  )
}
```

## Resources

- [Minimal i18n routing and translations](https://github.com/vercel/next.js/tree/canary/examples/i18n-routing)
- [`next-intl`](https://next-intl.dev)
- [`next-international`](https://github.com/QuiiBz/next-international)
- [`next-i18n-router`](https://github.com/i18nexus/next-i18n-router)
- [`paraglide-next`](https://inlang.com/m/osslbuzt/paraglide-next-i18n)
- [`lingui`](https://lingui.dev)
- [`tolgee`](https://tolgee.io/apps-integrations/next)
- [`next-intlayer`](https://intlayer.org/doc/environment/nextjs)
- [`gt-next`](https://generaltranslation.com/en/docs/next)


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-cypress-with-nextjs"></a>

## How to set up Cypress with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/testing/cypress](https://nextjs.org/docs/app/guides/testing/cypress)  
> 📂 **Sección:** App > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Cypress with Next.js for End-to-End (E2E) and Component Testing.*  

---

[Cypress](https://www.cypress.io/) is a test runner used for **End-to-End (E2E)** and **Component Testing**. This page will show you how to set up Cypress with Next.js and write your first tests.

> **Warning:**
>
> - Cypress versions below 13.6.3 do not support [TypeScript version 5](https://github.com/cypress-io/cypress/issues/27731) with `moduleResolution:"bundler"`. However, this issue has been resolved in Cypress version 13.6.3 and later. [cypress v13.6.3](https://docs.cypress.io/guides/references/changelog#13-6-3)

## Quickstart

You can use `create-next-app` with the [with-cypress example](https://github.com/vercel/next.js/tree/canary/examples/with-cypress) to quickly get started.

```bash
# Manejador de paquetes: pnpm
pnpm create next-app --example with-cypress with-cypress-app
```

```bash
# Manejador de paquetes: npm
npx create-next-app@latest --example with-cypress with-cypress-app
```

```bash
# Manejador de paquetes: yarn
yarn create next-app --example with-cypress with-cypress-app
```

```bash
# Manejador de paquetes: bun
bun create next-app --example with-cypress with-cypress-app
```

## Manual setup

To manually set up Cypress, install `cypress` as a dev dependency:

```bash
# Manejador de paquetes: pnpm
pnpm add -D cypress
```

```bash
# Manejador de paquetes: npm
npm install -D cypress
```

```bash
# Manejador de paquetes: yarn
yarn add -D cypress
```

```bash
# Manejador de paquetes: bun
bun add -D cypress
```

Add the Cypress `open` command to the `package.json` scripts field:

```json
// Archivo: package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "cypress:open": "cypress open"
  }
}
```

Run Cypress for the first time to open the Cypress testing suite:

```bash
# Manejador de paquetes: pnpm
pnpm cypress:open
```

```bash
# Manejador de paquetes: npm
npm run cypress:open
```

```bash
# Manejador de paquetes: yarn
yarn cypress:open
```

```bash
# Manejador de paquetes: bun
bun run cypress:open
```

You can choose to configure **E2E Testing** and/or **Component Testing**. Selecting any of these options will automatically create a `cypress.config.js` file and a `cypress` folder in your project.

## Creating your first Cypress E2E test

Ensure your `cypress.config` file has the following configuration:

```ts
// Archivo: cypress.config.ts switcher
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
})
```

```js
// Archivo: cypress.config.js switcher
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
  },
})
```

Then, create two new Next.js files:

```jsx
// Archivo: app/page.js
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      [About](/about)
    </div>
  )
}
```

```jsx
// Archivo: app/about/page.js
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>About</h1>
      [Home](/)
    </div>
  )
}
```

> 📘 **Nota para Pages Router:**
> ```jsx filename="pages/index.js"
> import Link from 'next/link'
> 
> export default function Home() {
>   return (
>     <div>
>       <h1>Home</h1>
>       [About](/about)
>     </div>
>   )
> }
> ```
> 
> ```jsx filename="pages/about.js"
> import Link from 'next/link'
> 
> export default function About() {
>   return (
>     <div>
>       <h1>About</h1>
>       [Home](/)
>     </div>
>   )
> }
> ```

Add a test to check your navigation is working correctly:

```js
// Archivo: cypress/e2e/app.cy.js
describe('Navigation', () => {
  it('should navigate to the about page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')

    // Find a link with an href attribute containing "about" and click it
    cy.get('a[href*="about"]').click()

    // The new url should include "/about"
    cy.url().should('include', '/about')

    // The new page should contain an h1 with "About"
    cy.get('h1').contains('About')
  })
})
```

### Running E2E Tests

Cypress will simulate a user navigating your application, this requires your Next.js server to be running. We recommend running your tests against your production code to more closely resemble how your application will behave.

Run `npm run build && npm run start` to build your Next.js application, then run `npm run cypress:open` in another terminal window to start Cypress and run your E2E Testing suite.

> **Good to know:**
>
> - You can use `cy.visit("/")` instead of `cy.visit("http://localhost:3000/")` by adding `baseUrl: 'http://localhost:3000'` to the `cypress.config.js` configuration file.
> - Alternatively, you can install the [`start-server-and-test`](https://www.npmjs.com/package/start-server-and-test) package to run the Next.js production server in conjunction with Cypress. After installation, add `"test": "start-server-and-test start http://localhost:3000 cypress"` to your `package.json` scripts field. Remember to rebuild your application after new changes.

## Creating your first Cypress component test

Component tests build and mount a specific component without having to bundle your whole application or start a server.

Select **Component Testing** in the Cypress app, then select **Next.js** as your front-end framework. A `cypress/component` folder will be created in your project, and a `cypress.config.js` file will be updated to enable Component Testing.

Ensure your `cypress.config` file has the following configuration:

```ts
// Archivo: cypress.config.ts switcher
import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

```js
// Archivo: cypress.config.js switcher
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
})
```

Assuming the same components from the previous section, add a test to validate a component is rendering the expected output:

```tsx
// Archivo: cypress/component/about.cy.tsx
import Page from '../../app/page'

describe('<Page />', () => {
  it('should render and display expected content', () => {
    // Mount the React component for the Home page
    cy.mount(<Page />)

    // The new page should contain an h1 with "Home"
    cy.get('h1').contains('Home')

    // Validate that a link with the expected URL is present
    // Following the link is better suited to an E2E test
    cy.get('a[href="/about"]').should('be.visible')
  })
})
```

> 📘 **Nota para Pages Router:**
> ```jsx filename="cypress/component/about.cy.js"
> import AboutPage from '../../pages/about'
> 
> describe('<AboutPage />', () => {
>   it('should render and display expected content', () => {
>     // Mount the React component for the About page
>     cy.mount(<AboutPage />)
> 
>     // The new page should contain an h1 with "About page"
>     cy.get('h1').contains('About')
> 
>     // Validate that a link with the expected URL is present
>     // *Following* the link is better suited to an E2E test
>     cy.get('a[href="/"]').should('be.visible')
>   })
> })
> ```

> **Good to know**:
>
> - Cypress currently doesn't support Component Testing for `async` Server Components. We recommend using E2E testing.
> - Since component tests do not require a Next.js server, features like `

![Illustration]()

` that rely on a server being available may not function out-of-the-box.

### Running Component Tests

Run `npm run cypress:open` in your terminal to start Cypress and run your Component Testing suite.

## Continuous Integration (CI)

In addition to interactive testing, you can also run Cypress headlessly using the `cypress run` command, which is better suited for CI environments:

```json
// Archivo: package.json
{
  "scripts": {
    //...
    "e2e": "start-server-and-test dev http://localhost:3000 \"cypress open --e2e\"",
    "e2e:headless": "start-server-and-test dev http://localhost:3000 \"cypress run --e2e\"",
    "component": "cypress open --component",
    "component:headless": "cypress run --component"
  }
}
```

You can learn more about Cypress and Continuous Integration from these resources:

- [Next.js with Cypress example](https://github.com/vercel/next.js/tree/canary/examples/with-cypress)
- [Cypress Continuous Integration Docs](https://docs.cypress.io/guides/continuous-integration/introduction)
- [Cypress GitHub Actions Guide](https://on.cypress.io/github-actions)
- [Official Cypress GitHub Action](https://github.com/cypress-io/github-action)
- [Cypress Discord](https://discord.com/invite/cypress)


[⬆ Subir al inicio del capítulo](#)

---

<a id="testing"></a>

## Testing

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/testing](https://nextjs.org/docs/app/guides/testing)  
> 📂 **Sección:** App > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Next.js with four commonly used testing tools — Cypress, Playwright, Vitest, and Jest.*  

---

In React and Next.js, there are a few different types of tests you can write, each with its own purpose and use cases. This page provides an overview of types and commonly used tools you can use to test your application.

## Types of tests

- **Unit Testing** involves testing individual units (or blocks of code) in isolation. In React, a unit can be a single function, hook, or component.
- **Component Testing** is a more focused version of unit testing where the primary subject of the tests is React components. This may involve testing how components are rendered, their interaction with props, and their behavior in response to user events.
- **Integration Testing** involves testing how multiple units work together. This can be a combination of components, hooks, and functions.
- **End-to-End (E2E) Testing** involves testing user flows in an environment that simulates real user scenarios, like the browser. This means testing specific tasks (e.g. signup flow) in a production-like environment.
- **Snapshot Testing** involves capturing the rendered output of a component and saving it to a snapshot file. When tests run, the current rendered output of the component is compared against the saved snapshot. Changes in the snapshot are used to indicate unexpected changes in behavior.

## Async Server Components

Since `async` Server Components are new to the React ecosystem, some tools do not fully support them. In the meantime, we recommend using **End-to-End Testing** over **Unit Testing** for `async` components.

## Guides

See the guides below to learn how to set up Next.js with these commonly used testing tools:


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-jest-with-nextjs"></a>

## How to set up Jest with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/testing/jest](https://nextjs.org/docs/app/guides/testing/jest)  
> 📂 **Sección:** App > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Jest with Next.js for Unit Testing and Snapshot Testing.*  

---

Jest and React Testing Library are frequently used together for **Unit Testing** and **Snapshot Testing**. This guide will show you how to set up Jest with Next.js and write your first tests.

> **Good to know:** Since `async` Server Components are new to the React ecosystem, Jest currently does not support them. While you can still run **unit tests** for synchronous Server and Client Components, we recommend using an **E2E tests** for `async` components.

## Quickstart

You can use `create-next-app` with the Next.js [with-jest](https://github.com/vercel/next.js/tree/canary/examples/with-jest) example to quickly get started:

```bash
# Manejador de paquetes: pnpm
pnpm create next-app --example with-jest with-jest-app
```

```bash
# Manejador de paquetes: npm
npx create-next-app@latest --example with-jest with-jest-app
```

```bash
# Manejador de paquetes: yarn
yarn create next-app --example with-jest with-jest-app
```

```bash
# Manejador de paquetes: bun
bun create next-app --example with-jest with-jest-app
```

## Manual setup

Since the release of [Next.js 12](https://nextjs.org/blog/next-12), Next.js now has built-in configuration for Jest.

To set up Jest, install `jest` and the following packages as dev dependencies:

```bash
# Manejador de paquetes: pnpm
pnpm add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

```bash
# Manejador de paquetes: npm
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

```bash
# Manejador de paquetes: yarn
yarn add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

```bash
# Manejador de paquetes: bun
bun add -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

Generate a basic Jest configuration file by running the following command:

```bash
# Manejador de paquetes: pnpm
pnpm create jest@latest
```

```bash
# Manejador de paquetes: npm
npm init jest@latest
```

```bash
# Manejador de paquetes: yarn
yarn create jest@latest
```

```bash
# Manejador de paquetes: bun
bun create jest@latest
```

This will take you through a series of prompts to set up Jest for your project, including automatically creating a `jest.config.ts|js` file.

Update your config file to use `next/jest`. This transformer has all the necessary configuration options for Jest to work with Next.js:

```ts
// Archivo: jest.config.ts switcher
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)
```

```js
// Archivo: jest.config.js switcher
const nextJest = require('next/jest')

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

// Add any custom config to be passed to Jest
const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config)
```

Under the hood, `next/jest` is automatically configuring Jest for you, including:

- Setting up `transform` using the [Next.js Compiler](/docs/architecture/nextjs-compiler).
- Auto mocking stylesheets (`.css`, `.module.css`, and their scss variants), image imports and [`next/font`](/docs/app/api-reference/components/font).
- Loading `.env` (and all variants) into `process.env`.
- Ignoring `node_modules` from test resolving and transforms.
- Ignoring `.next` from test resolving.
- Loading `next.config.js` for flags that enable SWC transforms.

> **Good to know**: To test environment variables directly, load them manually in a separate setup script or in your `jest.config.ts` file. For more information, please see [Test Environment Variables](/docs/app/guides/environment-variables#test-environment-variables).

> 📘 **Nota para Pages Router:**
> ## Setting up Jest (with Babel)
> 
> If you opt out of the [Next.js Compiler](/docs/architecture/nextjs-compiler) and use Babel instead, you will need to manually configure Jest and install `babel-jest` and `identity-obj-proxy` in addition to the packages above.
> 
> Here are the recommended options to configure Jest for Next.js:
> 
> ```js filename="jest.config.js"
> module.exports = {
>   collectCoverage: true,
>   // on node 14.x coverage provider v8 offers good speed and more or less good report
>   coverageProvider: 'v8',
>   collectCoverageFrom: [
>     '**/*.{js,jsx,ts,tsx}',
>     '!**/*.d.ts',
>     '!**/node_modules/**',
>     '!<rootDir>/out/**',
>     '!<rootDir>/.next/**',
>     '!<rootDir>/*.config.js',
>     '!<rootDir>/coverage/**',
>   ],
>   moduleNameMapper: {
>     // Handle CSS imports (with CSS modules)
>     // https://jestjs.io/docs/webpack#mocking-css-modules
>     '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
> 
>     // Handle CSS imports (without CSS modules)
>     '^.+\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
> 
>     // Handle image imports
>     // https://jestjs.io/docs/webpack#handling-static-assets
>     '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$': `<rootDir>/__mocks__/fileMock.js`,
> 
>     // Handle module aliases
>     '^@/components/(.*)$': '<rootDir>/components/$1',
> 
>     // Handle @next/font
>     '@next/font/(.*)': `<rootDir>/__mocks__/nextFontMock.js`,
>     // Handle next/font
>     'next/font/(.*)': `<rootDir>/__mocks__/nextFontMock.js`,
>     // Disable server-only
>     'server-only': `<rootDir>/__mocks__/empty.js`,
>   },
>   // Add more setup options before each test is run
>   // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
>   testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
>   testEnvironment: 'jsdom',
>   transform: {
>     // Use babel-jest to transpile tests with the next/babel preset
>     // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
>     '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
>   },
>   transformIgnorePatterns: [
>     '/node_modules/',
>     '^.+\\.module\\.(css|sass|scss)$',
>   ],
> }
> ```
> 
> You can learn more about each configuration option in the [Jest docs](https://jestjs.io/docs/configuration). We also recommend reviewing [`next/jest` configuration](https://github.com/vercel/next.js/blob/e02fe314dcd0ae614c65b505c6daafbdeebb920e/packages/next/src/build/jest/jest.ts) to see how Next.js configures Jest.
> 
> ### Handling stylesheets and image imports
> 
> Stylesheets and images aren't used in the tests but importing them may cause errors, so they will need to be mocked.
> 
> Create the mock files referenced in the configuration above - `fileMock.js` and `styleMock.js` - inside a `__mocks__` directory:
> 
> ```js filename="__mocks__/fileMock.js"
> module.exports = 'test-file-stub'
> ```
> 
> ```js filename="__mocks__/styleMock.js"
> module.exports = {}
> ```
> 
> For more information on handling static assets, please refer to the [Jest Docs](https://jestjs.io/docs/webpack#handling-static-assets).
> 
> ## Handling Fonts
> 
> To handle fonts, create the `nextFontMock.js` file inside the `__mocks__` directory, and add the following configuration:
> 
> ```js filename="__mocks__/nextFontMock.js"
> module.exports = new Proxy(
>   {},
>   {
>     get: function getter() {
>       return () => ({
>         className: 'className',
>         variable: 'variable',
>         style: { fontFamily: 'fontFamily' },
>       })
>     },
>   }
> )
> ```

## Optional: Handling Absolute Imports and Module Path Aliases

If your project is using [Module Path Aliases](/docs/app/getting-started/installation#set-up-absolute-imports-and-module-path-aliases), you will need to configure Jest to resolve the imports by matching the paths option in the `jsconfig.json` file with the `moduleNameMapper` option in the `jest.config.js` file. For example:

```json
// Archivo: tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "bundler",
    "baseUrl": "./",
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}
```

```js
// Archivo: jest.config.js
moduleNameMapper: {
  // ...
  '^@/components/(.*)$': '<rootDir>/components/$1',
}
```

## Optional: Extend Jest with custom matchers

`@testing-library/jest-dom` includes a set of convenient [custom matchers](https://github.com/testing-library/jest-dom#custom-matchers) such as `.toBeInTheDocument()` making it easier to write tests. You can import the custom matchers for every test by adding the following option to the Jest configuration file:

```ts
// Archivo: jest.config.ts switcher
setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
```

```js
// Archivo: jest.config.js switcher
setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
```

Then, inside `jest.setup`, add the following import:

```ts
// Archivo: jest.setup.ts switcher
import '@testing-library/jest-dom'
```

```js
// Archivo: jest.setup.js switcher
import '@testing-library/jest-dom'
```

> **Good to know:** [`extend-expect` was removed in `v6.0`](https://github.com/testing-library/jest-dom/releases/tag/v6.0.0), so if you are using `@testing-library/jest-dom` before version 6, you will need to import `@testing-library/jest-dom/extend-expect` instead.

If you need to add more setup options before each test, you can add them to the `jest.setup` file above.

## Add a test script to `package.json`

Finally, add a Jest `test` script to your `package.json` file:

```json
// Archivo: package.json highlight={6-7}
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "jest",
    "test:watch": "jest --watch"
  }
}
```

`jest --watch` will re-run tests when a file is changed. For more Jest CLI options, please refer to the [Jest Docs](https://jestjs.io/docs/cli#reference).

### Creating your first test

Your project is now ready to run tests. Create a folder called `__tests__` in your project's root directory.

> 📘 **Nota para Pages Router:**
> For example, we can add a test to check if the `<Home />` component successfully renders a heading:
> 
> ```jsx filename="pages/index.js
> export default function Home() {
>   return <h1>Home</h1>
> }
> ```
> 
> ```jsx filename="__tests__/index.test.js"
> import '@testing-library/jest-dom'
> import { render, screen } from '@testing-library/react'
> import Home from '../pages/index'
> 
> describe('Home', () => {
>   it('renders a heading', () => {
>     render(<Home />)
> 
>     const heading = screen.getByRole('heading', { level: 1 })
> 
>     expect(heading).toBeInTheDocument()
>   })
> })
> ```

For example, we can add a test to check if the `<Page />` component successfully renders a heading:

```jsx
// Archivo: app/page.js
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      [About](/about)
    </div>
  )
}
```

```jsx
// Archivo: __tests__/page.test.jsx
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Page', () => {
  it('renders a heading', () => {
    render(<Page />)

    const heading = screen.getByRole('heading', { level: 1 })

    expect(heading).toBeInTheDocument()
  })
})
```

Optionally, add a [snapshot test](https://jestjs.io/docs/snapshot-testing) to keep track of any unexpected changes in your component:

> 📘 **Nota para Pages Router:**
> ```jsx filename="__tests__/snapshot.js"
> import { render } from '@testing-library/react'
> import Home from '../pages/index'
> 
> it('renders homepage unchanged', () => {
>   const { container } = render(<Home />)
>   expect(container).toMatchSnapshot()
> })
> ```
> 
> > **Good to know**: Test files should not be included inside the Pages Router because any files inside the Pages Router are considered routes.

```jsx
// Archivo: __tests__/snapshot.js
import { render } from '@testing-library/react'
import Page from '../app/page'

it('renders homepage unchanged', () => {
  const { container } = render(<Page />)
  expect(container).toMatchSnapshot()
})
```

## Running your tests

Then, run the following command to run your tests:

```bash
# Manejador de paquetes: pnpm
pnpm test
```

```bash
# Manejador de paquetes: npm
npm run test
```

```bash
# Manejador de paquetes: yarn
yarn test
```

```bash
# Manejador de paquetes: bun
bun run test
```

## Additional Resources

For further reading, you may find these resources helpful:

- [Next.js with Jest example](https://github.com/vercel/next.js/tree/canary/examples/with-jest)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Playground](https://testing-playground.com/) - use good testing practices to match elements.


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-playwright-with-nextjs"></a>

## How to set up Playwright with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/testing/playwright](https://nextjs.org/docs/app/guides/testing/playwright)  
> 📂 **Sección:** App > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Playwright with Next.js for End-to-End (E2E) Testing.*  

---

Playwright is a testing framework that lets you automate Chromium, Firefox, and WebKit with a single API. You can use it to write **End-to-End (E2E)** testing. This guide will show you how to set up Playwright with Next.js and write your first tests.

## Quickstart

The fastest way to get started is to use `create-next-app` with the [with-playwright example](https://github.com/vercel/next.js/tree/canary/examples/with-playwright). This will create a Next.js project complete with Playwright configured.

```bash
# Manejador de paquetes: pnpm
pnpm create next-app --example with-playwright with-playwright-app
```

```bash
# Manejador de paquetes: npm
npx create-next-app@latest --example with-playwright with-playwright-app
```

```bash
# Manejador de paquetes: yarn
yarn create next-app --example with-playwright with-playwright-app
```

```bash
# Manejador de paquetes: bun
bun create next-app --example with-playwright with-playwright-app
```

## Manual setup

To install Playwright, run the following command:

```bash
# Manejador de paquetes: pnpm
pnpm create playwright
```

```bash
# Manejador de paquetes: npm
npm init playwright
```

```bash
# Manejador de paquetes: yarn
yarn create playwright
```

```bash
# Manejador de paquetes: bun
bun create playwright
```

This will take you through a series of prompts to set up and configure Playwright for your project, including adding a `playwright.config.ts` file. Please refer to the [Playwright installation guide](https://playwright.dev/docs/intro#installation) for the step-by-step guide.

## Creating your first Playwright E2E test

Create two new Next.js pages:

```tsx
// Archivo: app/page.tsx
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      [About](/about)
    </div>
  )
}
```

```tsx
// Archivo: app/about/page.tsx
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>About</h1>
      [Home](/)
    </div>
  )
}
```

> 📘 **Nota para Pages Router:**
> ```tsx filename="pages/index.ts"
> import Link from 'next/link'
> 
> export default function Home() {
>   return (
>     <div>
>       <h1>Home</h1>
>       [About](/about)
>     </div>
>   )
> }
> ```
> 
> ```tsx filename="pages/about.ts"
> import Link from 'next/link'
> 
> export default function About() {
>   return (
>     <div>
>       <h1>About</h1>
>       [Home](/)
>     </div>
>   )
> }
> ```

Then, add a test to verify that your navigation is working correctly:

```ts
// Archivo: tests/example.spec.ts
import { test, expect } from '@playwright/test'

test('should navigate to the about page', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('http://localhost:3000/')
  // Find an element with the text 'About' and click on it
  await page.click('text=About')
  // The new URL should be "/about" (baseURL is used there)
  await expect(page).toHaveURL('http://localhost:3000/about')
  // The new page should contain an h1 with "About"
  await expect(page.locator('h1')).toContainText('About')
})
```

> **Good to know**: You can use `page.goto("/")` instead of `page.goto("http://localhost:3000/")`, if you add [`"baseURL": "http://localhost:3000"`](https://playwright.dev/docs/api/class-testoptions#test-options-base-url) to the `playwright.config.ts` [configuration file](https://playwright.dev/docs/test-configuration).

### Running your Playwright tests

Playwright will simulate a user navigating your application using three browsers: Chromium, Firefox and Webkit, this requires your Next.js server to be running. We recommend running your tests against your production code to more closely resemble how your application will behave.

Run `npm run build` and `npm run start`, then run `npx playwright test` in another terminal window to run the Playwright tests.

> **Good to know**: Alternatively, you can use the [`webServer`](https://playwright.dev/docs/test-webserver/) feature to let Playwright start the development server and wait until it's fully available.

### Running Playwright on Continuous Integration (CI)

Playwright will by default run your tests in the [headless mode](https://playwright.dev/docs/ci#running-headed). To install all the Playwright dependencies, run `npx playwright install-deps`.

You can learn more about Playwright and Continuous Integration from these resources:

- [Next.js with Playwright example](https://github.com/vercel/next.js/tree/canary/examples/with-playwright)
- [Playwright on your CI provider](https://playwright.dev/docs/ci)
- [Playwright Discord](https://discord.com/invite/playwright-807756831384403968)


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-vitest-with-nextjs"></a>

## How to set up Vitest with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/testing/vitest](https://nextjs.org/docs/app/guides/testing/vitest)  
> 📂 **Sección:** App > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Vitest with Next.js for Unit Testing.*  

---

Vitest and React Testing Library are frequently used together for **Unit Testing**. This guide will show you how to set up Vitest with Next.js and write your first tests.

> **Good to know:** Since `async` Server Components are new to the React ecosystem, Vitest currently does not support them. While you can still run **unit tests** for synchronous Server and Client Components, we recommend using **E2E tests** for `async` components.

## Quickstart

You can use `create-next-app` with the Next.js [with-vitest](https://github.com/vercel/next.js/tree/canary/examples/with-vitest) example to quickly get started:

```bash
# Manejador de paquetes: pnpm
pnpm create next-app --example with-vitest with-vitest-app
```

```bash
# Manejador de paquetes: npm
npx create-next-app@latest --example with-vitest with-vitest-app
```

```bash
# Manejador de paquetes: yarn
yarn create next-app --example with-vitest with-vitest-app
```

```bash
# Manejador de paquetes: bun
bun create next-app --example with-vitest with-vitest-app
```

## Manual Setup

To manually set up Vitest, install `vitest` and the following packages as dev dependencies:

```bash
# Manejador de paquetes: pnpm
# Using TypeScript
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# Using JavaScript
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

```bash
# Manejador de paquetes: npm
# Using TypeScript
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# Using JavaScript
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

```bash
# Manejador de paquetes: yarn
# Using TypeScript
yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# Using JavaScript
yarn add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

```bash
# Manejador de paquetes: bun
# Using TypeScript
bun add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths
# Using JavaScript
bun add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom
```

Create a `vitest.config.mts|js` file in the root of your project, and add the following options:

```ts
// Archivo: vitest.config.mts switcher
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
  },
})
```

```js
// Archivo: vitest.config.js switcher
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
```

For more information on configuring Vitest, please refer to the [Vitest Configuration](https://vitest.dev/config/#configuration) docs.

Then, add a `test` script to your `package.json`:

```json
// Archivo: package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest"
  }
}
```

When you run `npm run test`, Vitest will **watch** for changes in your project by default.

## Creating your first Vitest Unit Test

Check that everything is working by creating a test to check if the `<Page />` component successfully renders a heading:

```tsx
// Archivo: app/page.tsx switcher
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      [About](/about)
    </div>
  )
}
```

```jsx
// Archivo: app/page.jsx switcher
import Link from 'next/link'

export default function Page() {
  return (
    <div>
      <h1>Home</h1>
      [About](/about)
    </div>
  )
}
```

```tsx
// Archivo: __tests__/page.test.tsx switcher
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Page', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})
```

```jsx
// Archivo: __tests__/page.test.jsx switcher
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

test('Page', () => {
  render(<Page />)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})
```

> **Good to know**: The example above uses the common `__tests__` convention, but test files can also be colocated inside the `app` router.

> 📘 **Nota para Pages Router:**
> ```tsx filename="pages/index.tsx" switcher
> import Link from 'next/link'
> 
> export default function Page() {
>   return (
>     <div>
>       <h1>Home</h1>
>       [About](/about)
>     </div>
>   )
> }
> ```
> 
> ```jsx filename="pages/index.jsx" switcher
> import Link from 'next/link'
> 
> export default function Page() {
>   return (
>     <div>
>       <h1>Home</h1>
>       [About](/about)
>     </div>
>   )
> }
> ```
> 
> ```tsx filename="__tests__/index.test.tsx" switcher
> import { expect, test } from 'vitest'
> import { render, screen } from '@testing-library/react'
> import Page from '../pages/index'
> 
> test('Page', () => {
>   render(<Page />)
>   expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
> })
> ```
> 
> ```jsx filename="__tests__/index.test.jsx" switcher
> import { expect, test } from 'vitest'
> import { render, screen } from '@testing-library/react'
> import Page from '../pages/index'
> 
> test('Page', () => {
>   render(<Page />)
>   expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
> })
> ```

## Running your tests

Then, run the following command to run your tests:

```bash
# Manejador de paquetes: pnpm
pnpm test
```

```bash
# Manejador de paquetes: npm
npm run test
```

```bash
# Manejador de paquetes: yarn
yarn test
```

```bash
# Manejador de paquetes: bun
bun run test
```

## Additional Resources

You may find these resources helpful:

- [Next.js with Vitest example](https://github.com/vercel/next.js/tree/canary/examples/with-vitest)
- [Vitest Docs](https://vitest.dev/guide/)
- [React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)


[⬆ Subir al inicio del capítulo](#)

---

<a id="testing-adapters"></a>

## Testing Adapters

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/adapters/testing-adapters](https://nextjs.org/docs/app/api-reference/adapters/testing-adapters)  
> 📂 **Sección:** App > Api Reference > Adapters  
> 📝 **Descripción:** *Validate adapters with the Next.js compatibility test harness and custom lifecycle scripts.*  

---

Next.js provides a test harness for validating adapters. Running the end-to-end tests for deployment.

Example GitHub Actions workflow:

```yaml
// Archivo: .github/workflows/test-e2e-deploy.yml
name: test-e2e-deploy

on:
  workflow_dispatch:
    inputs:
      nextjsRef:
        description: 'Next.js repo ref (branch/tag/SHA)'
        default: 'canary'
        type: string
  # schedule:
  #   - cron: '0 2 * * *'

jobs:
  build:
    name: Build Next.js + adapter
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
        with:
          path: adapter

      - uses: actions/checkout@v4
        with:
          repository: vercel/next.js
          ref: ${{ inputs.nextjsRef || 'canary' }}
          path: nextjs
          fetch-depth: 25

      - uses: actions/setup-node@v4
        with: { node-version: '20' }

      - name: Setup pnpm
        run: npm i -g corepack@0.31 && corepack enable

      - name: Install & build Next.js
        working-directory: nextjs
        run: pnpm install && pnpm build && pnpm install

      - name: Install Playwright
        working-directory: nextjs
        run: pnpm playwright install --with-deps chromium

      - name: Build adapter
        working-directory: adapter
        run: pnpm install && pnpm build

      - uses: actions/cache/save@v4
        with:
          path: |
            nextjs
            adapter
            ~/.cache/ms-playwright
          key: build-${{ github.sha }}-${{ github.run_id }}

  test:
    name: Tests (${{ matrix.group }})
    needs: build
    runs-on: ubuntu-latest
    timeout-minutes: 60
    strategy:
      fail-fast: false
      matrix:
        group:
          [
            1/16,
            2/16,
            3/16,
            4/16,
            5/16,
            6/16,
            7/16,
            8/16,
            9/16,
            10/16,
            11/16,
            12/16,
            13/16,
            14/16,
            15/16,
            16/16,
          ]
    steps:
      - uses: actions/cache/restore@v4
        with:
          path: |
            nextjs
            adapter
            ~/.cache/ms-playwright
          key: build-${{ github.sha }}-${{ github.run_id }}

      - uses: actions/setup-node@v4
        with: { node-version: '20' }

      - name: Setup pnpm
        run: npm i -g corepack@0.31 && corepack enable

      - name: Ensure Playwright browser
        working-directory: nextjs
        run: pnpm playwright install chromium

      - name: Make scripts executable
        run: chmod +x adapter/scripts/e2e-deploy.sh
          adapter/scripts/e2e-logs.sh
          adapter/scripts/e2e-cleanup.sh

      - name: Run deploy tests
        working-directory: nextjs
        env:
          NEXT_TEST_MODE: deploy
          NEXT_E2E_TEST_TIMEOUT: 240000
          NEXT_EXTERNAL_TESTS_FILTERS: test/deploy-tests-manifest.json
          ADAPTER_DIR: ${{ github.workspace }}/adapter
          IS_TURBOPACK_TEST: 1
          NEXT_TEST_JOB: 1
          NEXT_TELEMETRY_DISABLED: 1

          # Change these to your adapter's scripts
          # Keep as-is if the scripts are in the adapter repository `scripts` directory
          NEXT_TEST_DEPLOY_SCRIPT_PATH: ${{ github.workspace }}/adapter/scripts/e2e-deploy.sh
          NEXT_TEST_DEPLOY_LOGS_SCRIPT_PATH: ${{ github.workspace }}/adapter/scripts/e2e-logs.sh
          NEXT_TEST_CLEANUP_SCRIPT_PATH: ${{ github.workspace }}/adapter/scripts/e2e-cleanup.sh
        run: node run-tests.js --timings -g ${{ matrix.group }} -c 2 --type e2e
```

The test harness looks for these environment variables:

- `NEXT_TEST_DEPLOY_SCRIPT_PATH`: Path to the executable that builds and deploys the isolated test app
- `NEXT_TEST_DEPLOY_LOGS_SCRIPT_PATH`: Path to the executable that returns build and runtime logs for that deployment
- `NEXT_TEST_CLEANUP_SCRIPT_PATH`: Path to the optional executable that tears the deployment down after the test run

## Custom deploy script contract

The deploy script `NEXT_TEST_DEPLOY_SCRIPT_PATH` is executed with `cwd` set to the isolated temporary app created by the Next.js test harness.

The deploy script must follow this contract:

- Exit with a non-zero code on failure.
- Print the deployment URL to `stdout`. This will be used to verify the deployment. Avoid writing anything else to `stdout`.
- Write diagnostic output to `stderr` or to files inside the working directory.

Because the deploy script and logs script run as separate processes, any data you want to use later, such as build IDs or server logs, should be persisted to files inside the working directory.

Example deploy script:

```bash
// Archivo: scripts/e2e-deploy.sh
#!/usr/bin/env bash
set -euo pipefail

# Install the adapter, build the app, and deploy or start it.
node -e "
const pkg=JSON.parse(require('fs').readFileSync('package.json','utf8'));
pkg.dependencies=pkg.dependencies||{};
pkg.dependencies['adapter']='file:${ADAPTER_DIR}';
require('fs').writeFileSync('package.json',JSON.stringify(pkg,null,2));
" >&2

# Set the adapter path so that the app uses it.
export NEXT_ADAPTER_PATH="${ADAPTER_DIR}/dist/index.js"

# Build the app
pnpm build

# Write any metadata needed later to files in the working directory.
BUILD_ID="$(cat .next/BUILD_ID)"
DEPLOYMENT_ID="my-adapter-local"
# If your adapter enables immutable static assets, set this to "1".
NEXT_SUPPORTS_IMMUTABLE_ASSETS="0"

{
  echo "BUILD_ID: $BUILD_ID"
  echo "DEPLOYMENT_ID: $DEPLOYMENT_ID"
  echo "NEXT_SUPPORTS_IMMUTABLE_ASSETS: $NEXT_SUPPORTS_IMMUTABLE_ASSETS"
} >> .adapter-build.log

# Start or deploy the app. Capture the URL at this point or make the script output the URL to stdout.
provider-cli-to-deploy

# Example URL output:
# echo "http://127.0.0.1:3000"
```

## Custom logs script contract

The logs script `NEXT_TEST_DEPLOY_LOGS_SCRIPT_PATH` is executed with `cwd` set to the isolated temporary app created by the Next.js test harness.

Additionally it receives `NEXT_TEST_DIR` and `NEXT_TEST_DEPLOY_URL` as environment variables.

Its output must include lines starting with:

- `BUILD_ID:`
- `DEPLOYMENT_ID:`
- `NEXT_SUPPORTS_IMMUTABLE_ASSETS:`

After those markers, the logs script can print any additional build or server logs that would help debug failures.

```bash
// Archivo: scripts/e2e-logs.sh
#!/usr/bin/env bash
set -euo pipefail

if [ -f ".adapter-build.log" ]; then
  cat ".adapter-build.log"
fi

if [ -f ".adapter-server.log" ]; then
  echo "=== .adapter-server.log ==="
  cat ".adapter-server.log"
fi
```

One pattern is to have the deploy script write `.adapter-build.log` and `.adapter-server.log`, then have the logs script replay those files so the harness can extract the required markers. This is one option, each platform has different ways to get the logs.

## Custom cleanup script contract

The cleanup script `NEXT_TEST_CLEANUP_SCRIPT_PATH` is executed with `cwd` set to the isolated temporary app created by the Next.js test harness.

Additionally it receives `NEXT_TEST_DIR` and `NEXT_TEST_DEPLOY_URL` as environment variables.

The cleanup script can be used to clean up any resources created by the deploy script. It runs after the tests have completed.


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-analytics"></a>

## How to set up analytics

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/analytics](https://nextjs.org/docs/pages/guides/analytics)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Measure and track page performance using Next.js*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-use-debugging-tools-with-nextjs"></a>

## How to use debugging tools with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/debugging](https://nextjs.org/docs/pages/guides/debugging)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to debug your Next.js application with VS Code or Chrome DevTools.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-implement-internationalization-in-nextjs"></a>

## How to implement internationalization in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/internationalization](https://nextjs.org/docs/pages/guides/internationalization)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Next.js has built-in support for internationalized routing and language detection. Learn more here.*  

---

<details>
  <summary>Examples</summary>

- [i18n routing](https://github.com/vercel/next.js/tree/canary/examples/i18n-routing-pages)

</details>

Next.js has built-in support for internationalized ([i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization#Naming)) routing since `v10.0.0`. You can provide a list of locales, the default locale, and domain-specific locales and Next.js will automatically handle the routing.

The i18n routing support is currently meant to complement existing i18n library solutions like [`react-intl`](https://formatjs.io/docs/getting-started/installation), [`react-i18next`](https://react.i18next.com/), [`lingui`](https://lingui.dev/), [`rosetta`](https://github.com/lukeed/rosetta), [`next-intl`](https://github.com/amannn/next-intl), [`next-translate`](https://github.com/aralroca/next-translate), [`next-multilingual`](https://github.com/Avansai/next-multilingual), [`tolgee`](https://tolgee.io/integrations/next), [`paraglide-next`](https://inlang.com/m/osslbuzt/paraglide-next-i18n), [`next-intlayer`](https://intlayer.org/doc/environment/nextjs/next-with-page-router), [`gt-react`](https://generaltranslation.com/en/docs/react) and others by streamlining the routes and locale parsing.

## Getting started

To get started, add the `i18n` config to your `next.config.js` file.

Locales are [UTS Locale Identifiers](https://www.unicode.org/reports/tr35/tr35-59/tr35.html#Identifiers), a standardized format for defining locales.

Generally a Locale Identifier is made up of a language, region, and script separated by a dash: `language-region-script`. The region and script are optional. An example:

- `en-US` - English as spoken in the United States
- `nl-NL` - Dutch as spoken in the Netherlands
- `nl` - Dutch, no specific region

If user locale is `nl-BE` and it is not listed in your configuration, they will be redirected to `nl` if available, or to the default locale otherwise.
If you don't plan to support all regions of a country, it is therefore a good practice to include country locales that will act as fallbacks.

```js
// Archivo: next.config.js
module.exports = {
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en-US', 'fr', 'nl-NL'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'en-US',
    // This is a list of locale domains and the default locale they
    // should handle (these are only required when setting up domain routing)
    // Note: subdomains must be included in the domain value to be matched e.g. "fr.example.com".
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en-US',
      },
      {
        domain: 'example.nl',
        defaultLocale: 'nl-NL',
      },
      {
        domain: 'example.fr',
        defaultLocale: 'fr',
        // an optional http field can also be used to test
        // locale domains locally with http instead of https
        http: true,
      },
    ],
  },
}
```

## Locale Strategies

There are two locale handling strategies: Sub-path Routing and Domain Routing.

### Sub-path Routing

Sub-path Routing puts the locale in the url path.

```js
// Archivo: next.config.js
module.exports = {
  i18n: {
    locales: ['en-US', 'fr', 'nl-NL'],
    defaultLocale: 'en-US',
  },
}
```

With the above configuration `en-US`, `fr`, and `nl-NL` will be available to be routed to, and `en-US` is the default locale. If you have a `pages/blog.js` the following urls would be available:

- `/blog`
- `/fr/blog`
- `/nl-nl/blog`

The default locale does not have a prefix.

### Domain Routing

By using domain routing you can configure locales to be served from different domains:

```js
// Archivo: next.config.js
module.exports = {
  i18n: {
    locales: ['en-US', 'fr', 'nl-NL', 'nl-BE'],
    defaultLocale: 'en-US',

    domains: [
      {
        // Note: subdomains must be included in the domain value to be matched
        // e.g. www.example.com should be used if that is the expected hostname
        domain: 'example.com',
        defaultLocale: 'en-US',
      },
      {
        domain: 'example.fr',
        defaultLocale: 'fr',
      },
      {
        domain: 'example.nl',
        defaultLocale: 'nl-NL',
        // specify other locales that should be redirected
        // to this domain
        locales: ['nl-BE'],
      },
    ],
  },
}
```

For example if you have `pages/blog.js` the following urls will be available:

- `example.com/blog`
- `www.example.com/blog`
- `example.fr/blog`
- `example.nl/blog`
- `example.nl/nl-BE/blog`

## Automatic Locale Detection

When a user visits the application root (generally `/`), Next.js will try to automatically detect which locale the user prefers based on the [`Accept-Language`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept-Language) header and the current domain.

If a locale other than the default locale is detected, the user will be redirected to either:

- **When using Sub-path Routing:** The locale prefixed path
- **When using Domain Routing:** The domain with that locale specified as the default

When using Domain Routing, if a user with the `Accept-Language` header `fr;q=0.9` visits `example.com`, they will be redirected to `example.fr` since that domain handles the `fr` locale by default.

When using Sub-path Routing, the user would be redirected to `/fr`.

### Prefixing the Default Locale

With Next.js 12 and [Proxy](/docs/pages/api-reference/file-conventions/proxy), we can add a prefix to the default locale with a [workaround](https://github.com/vercel/next.js/discussions/18419).

For example, here's a `next.config.js` file with support for a few languages. Note the `"default"` locale has been added intentionally.

```js
// Archivo: next.config.js
module.exports = {
  i18n: {
    locales: ['default', 'en', 'de', 'fr'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  trailingSlash: true,
}
```

Next, we can use [Proxy](/docs/pages/api-reference/file-conventions/proxy) to add custom routing rules:

```ts
// Archivo: proxy.ts
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export async function proxy(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  if (req.nextUrl.locale === 'default') {
    const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en'

    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    )
  }
}
```

This [Proxy](/docs/pages/api-reference/file-conventions/proxy) skips adding the default prefix to [API Routes](/docs/pages/building-your-application/routing/api-routes) and [public](/docs/pages/api-reference/file-conventions/public-folder) files like fonts or images. If a request is made to the default locale, we redirect to our prefix `/en`.

### Disabling Automatic Locale Detection

The automatic locale detection can be disabled with:

```js
// Archivo: next.config.js
module.exports = {
  i18n: {
    localeDetection: false,
  },
}
```

When `localeDetection` is set to `false` Next.js will no longer automatically redirect based on the user's preferred locale and will only provide locale information detected from either the locale based domain or locale path as described above.

## Accessing the locale information

You can access the locale information via the Next.js router. For example, using the [`useRouter()`](/docs/pages/api-reference/functions/use-router) hook the following properties are available:

- `locale` contains the currently active locale.
- `locales` contains all configured locales.
- `defaultLocale` contains the configured default locale.

When [prerendering](/docs/pages/building-your-application/rendering/static-site-generation) pages with `getStaticProps` or `getServerSideProps`, the locale information is provided in [the context](/docs/pages/building-your-application/data-fetching/get-static-props) provided to the function.

When leveraging `getStaticPaths`, the configured locales are provided in the context parameter of the function under `locales` and the configured defaultLocale under `defaultLocale`.

## Transition between locales

You can use `next/link` or `next/router` to transition between locales.

For `next/link`, a `locale` prop can be provided to transition to a different locale from the currently active one. If no `locale` prop is provided, the currently active `locale` is used during client-transitions. For example:

```jsx
import Link from 'next/link'

export default function IndexPage(props) {
  return (
    <Link href="/another" locale="fr">
      To /fr/another
    </Link>
  )
}
```

When using the `next/router` methods directly, you can specify the `locale` that should be used via the transition options. For example:

```jsx
import { useRouter } from 'next/router'

export default function IndexPage(props) {
  const router = useRouter()

  return (
    <div
      onClick={() => {
        router.push('/another', '/another', { locale: 'fr' })
      }}
    >
      to /fr/another
    </div>
  )
}
```

Note that to handle switching only the `locale` while preserving all routing information such as [dynamic route](/docs/pages/building-your-application/routing/dynamic-routes) query values or hidden href query values, you can provide the `href` parameter as an object:

```jsx
import { useRouter } from 'next/router'
const router = useRouter()
const { pathname, asPath, query } = router
// change just the locale and maintain all other route information including href's query
router.push({ pathname, query }, asPath, { locale: nextLocale })
```

See [here](/docs/pages/api-reference/functions/use-router#with-url-object) for more information on the object structure for `router.push`.

If you have a `href` that already includes the locale you can opt-out of automatically handling the locale prefixing:

```jsx
import Link from 'next/link'

export default function IndexPage(props) {
  return (
    <Link href="/fr/another" locale={false}>
      To /fr/another
    </Link>
  )
}
```

## Leveraging the `NEXT_LOCALE` cookie

Next.js allows setting a `NEXT_LOCALE=the-locale` cookie, which takes priority over the accept-language header. This cookie can be set using a language switcher and then when a user comes back to the site it will leverage the locale specified in the cookie when redirecting from `/` to the correct locale location.

For example, if a user prefers the locale `fr` in their accept-language header but a `NEXT_LOCALE=en` cookie is set the `en` locale when visiting `/` the user will be redirected to the `en` locale location until the cookie is removed or expired.

## Search Engine Optimization

Since Next.js knows what language the user is visiting it will automatically add the `lang` attribute to the `<html>` tag.

Next.js doesn't know about variants of a page so it's up to you to add the `hreflang` meta tags using [`next/head`](/docs/pages/api-reference/components/head). You can learn more about `hreflang` in the [Google Webmasters documentation](https://support.google.com/webmasters/answer/189077).

## How does this work with Static Generation?

> Note that Internationalized Routing does not integrate with [`output: 'export'`](/docs/pages/guides/static-exports) as it does not leverage the Next.js routing layer. Hybrid Next.js applications that do not use `output: 'export'` are fully supported.

### Dynamic Routes and `getStaticProps` Pages

For pages using `getStaticProps` with [Dynamic Routes](/docs/pages/building-your-application/routing/dynamic-routes), all locale variants of the page desired to be prerendered need to be returned from [`getStaticPaths`](/docs/pages/building-your-application/data-fetching/get-static-paths). Along with the `params` object returned for `paths`, you can also return a `locale` field specifying which locale you want to render. For example:

```jsx
// Archivo: pages/blog/[slug].js
export const getStaticPaths = ({ locales }) => {
  return {
    paths: [
      // if no `locale` is provided only the defaultLocale will be generated
      { params: { slug: 'post-1' }, locale: 'en-US' },
      { params: { slug: 'post-1' }, locale: 'fr' },
    ],
    fallback: true,
  }
}
```

For [Automatically Statically Optimized](/docs/pages/building-your-application/rendering/automatic-static-optimization) and non-dynamic `getStaticProps` pages, **a version of the page will be generated for each locale**. This is important to consider because it can increase build times depending on how many locales are configured inside `getStaticProps`.

For example, if you have 50 locales configured with 10 non-dynamic pages using `getStaticProps`, this means `getStaticProps` will be called 500 times. 50 versions of the 10 pages will be generated during each build.

To decrease the build time of dynamic pages with `getStaticProps`, use a [`fallback` mode](/docs/pages/api-reference/functions/get-static-paths#fallback-true). This allows you to return only the most popular paths and locales from `getStaticPaths` for prerendering during the build. Then, Next.js will build the remaining pages at runtime as they are requested.

### Automatically Statically Optimized Pages

For pages that are [automatically statically optimized](/docs/pages/building-your-application/rendering/automatic-static-optimization), a version of the page will be generated for each locale.

### Non-dynamic getStaticProps Pages

For non-dynamic `getStaticProps` pages, a version is generated for each locale like above. `getStaticProps` is called with each `locale` that is being rendered. If you would like to opt-out of a certain locale from being prerendered, you can return `notFound: true` from `getStaticProps` and this variant of the page will not be generated.

```js
export async function getStaticProps({ locale }) {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch(`https://.../posts?locale=${locale}`)
  const posts = await res.json()

  if (posts.length === 0) {
    return {
      notFound: true,
    }
  }

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}
```

## Limits for the i18n config

- `locales`: 100 total locales
- `domains`: 100 total locale domain items

> **Good to know**: These limits have been added initially to prevent potential [performance issues at build time](#dynamic-routes-and-getstaticprops-pages). You can workaround these limits with custom routing using [Proxy](/docs/pages/api-reference/file-conventions/proxy) in Next.js 12.


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-cypress-with-nextjs"></a>

## How to set up Cypress with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/testing/cypress](https://nextjs.org/docs/pages/guides/testing/cypress)  
> 📂 **Sección:** Pages > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Next.js with Cypress for End-to-End (E2E) and Component Testing.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="testing"></a>

## Testing

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/testing](https://nextjs.org/docs/pages/guides/testing)  
> 📂 **Sección:** Pages > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Next.js with three commonly used testing tools — Cypress, Playwright, Vitest, and Jest.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-jest-with-nextjs"></a>

## How to set up Jest with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/testing/jest](https://nextjs.org/docs/pages/guides/testing/jest)  
> 📂 **Sección:** Pages > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Next.js with Jest for Unit Testing.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-playwright-with-nextjs"></a>

## How to set up Playwright with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/testing/playwright](https://nextjs.org/docs/pages/guides/testing/playwright)  
> 📂 **Sección:** Pages > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Next.js with Playwright for End-to-End (E2E) and Integration testing.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-vitest-with-nextjs"></a>

## How to set up Vitest with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/testing/vitest](https://nextjs.org/docs/pages/guides/testing/vitest)  
> 📂 **Sección:** Pages > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Next.js with Vitest and React Testing Library - two popular unit testing libraries.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="testing-adapters"></a>

## Testing Adapters

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/adapters/testing-adapters](https://nextjs.org/docs/pages/api-reference/adapters/testing-adapters)  
> 📂 **Sección:** Pages > Api Reference > Adapters  
> 📝 **Descripción:** *Validate adapters with the Next.js compatibility test harness and custom lifecycle scripts.*  

---




[⬆ Subir al inicio del capítulo](#)

---

