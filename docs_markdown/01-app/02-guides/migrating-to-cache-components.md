# Migrating to Cache Components

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/migrating-to-cache-components](https://nextjs.org/docs/app/guides/migrating-to-cache-components)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to migrate from route segment configs to Cache Components in Next.js.*  

---

When [Cache Components](/docs/app/api-reference/config/next-config-js/cacheComponents) is enabled, route segment configs like `dynamic`, `revalidate`, and `fetchCache` are replaced by [`use cache`](/docs/app/api-reference/directives/use-cache) and [`cacheLife`](/docs/app/api-reference/functions/cacheLife).

The migration is driven by **instant navigation validation**. With Cache Components enabled, Next.js validates in development whether navigating into each route renders instantly, and surfaces the code that would block it as an error or insight.

## Use the adoption skill (recommended)

The [`next-cache-components-adoption`](https://github.com/vercel/next.js/tree/canary/skills/next-cache-components-adoption) skill drives this migration with a coding agent, one feature at a time, checking in at every feature boundary. It supports two modes:

- **Incremental.** Opens a single mechanical PR that opts every route out of validation, then ships each feature as a follow-up PR. This automates the [Adopting incrementally](#adopting-incrementally) flow below.
- **Direct.** Adopts every route in place on one branch.

Install the skill:

```bash
// Archivo: Terminal
npx skills add vercel/next.js --skill next-cache-components-adoption
```

Then give the agent this prompt:

```prompt
Adopt Cache Components in this project using the next-cache-components-adoption skill.
```

## Or migrate by hand

Migrating an existing app by hand follows a few steps, in order:

1. [Enable Cache Components](#enable-cache-components) in `next.config.ts`.
2. Decide your approach: convert every route now, or [adopt incrementally](#adopting-incrementally) by [opting routes out of validation](#opting-out-of-validation) first and converting one at a time.
3. [Follow the validation errors and insights](#following-validation) it surfaces, replacing each route segment config with its Cache Components equivalent and caching uncached data with [`use cache`](/docs/app/api-reference/directives/use-cache) or wrapping runtime data in [```<Suspense>``', highlight: true },
    ]}
  />


Each card is clickable and opens a page with patterns, code samples, and trade-offs. Work through the insights and errors until they're gone. For the full validation workflow, the DevTools, and CI testing, see the [instant navigation guide](/docs/app/guides/instant-navigation).

Insights don't show up in the HTTP response. An offending route still returns `200` with rendered HTML in dev. The insight only appears in the dev overlay, the dev-server log, or the [MCP `get_errors` tool](/docs/app/guides/mcp). To see them, read the overlay (or query the MCP).

## `dynamic = "force-dynamic"`

**Not needed.** All pages are dynamic by default.

```tsx
// Archivo: app/page.tsx switcher
// Before - No longer needed
export const dynamic = 'force-dynamic'

export default function Page() {
  return <div>...</div>
}
```

```jsx
// Archivo: app/page.js switcher
// Before - No longer needed
export const dynamic = 'force-dynamic'

export default function Page() {
  return <div>...</div>
}
```

```tsx
// Archivo: app/page.tsx switcher
// After - Just remove it
export default function Page() {
  return <div>...</div>
}
```

```jsx
// Archivo: app/page.js switcher
// After - Just remove it
export default function Page() {
  return <div>...</div>
}
```

## `dynamic = "force-static"`

Start by removing it. When unhandled uncached or runtime data access is detected during development and build time, Next.js raises an error. Otherwise, the prerendering step automatically extracts the static HTML shell.

For uncached data access, add [`use cache`](/docs/app/api-reference/directives/use-cache) as close to the data access as possible with a long [`cacheLife`](/docs/app/api-reference/functions/cacheLife) like `'max'` to maintain cached behavior. If needed, add it at the top of the page or layout.

For runtime data access (`cookies()`, `headers()`, etc.), errors will direct you to wrap it with ```<Suspense>``
  )
}

async function Post({ params }: Pick<PageProps<'/blog/[slug]'>, 'params'>) {
  const { slug } = await params
  // ...
}
```

```jsx
// Archivo: app/blog/[slug]/page.js switcher
import { Suspense } from 'react'

// After - await inside Suspense so the shell can prerender
export default function Page({ params }) {
  return (
    ``<Suspense>``
  )
}

async function Post({ params }) {
  const { slug } = await params
  // ...
}
```

The same applies to client hooks that read the route. When the route's pathname is fully known, they resolve during prerendering and need no boundary. When it depends on dynamic params not yet known, they suspend, wherever the component sits. A nav or breadcrumb in a shared layout, for instance, suspends while Next.js generates the static shell for any route below it that has dynamic params. Wrap the component that reads the hook in ```<Suspense>``
  )
}

async function Dashboard() {
  const theme = (await cookies()).get('theme')?.value
  // ...
}
```

```jsx
// Archivo: app/page.js switcher
import { cookies } from 'next/headers'
import { Suspense } from 'react'

// After - the page prerenders; only Dashboard streams at request time
export default function Page() {
  return (
    ``<Suspense>``
  )
}

async function Dashboard() {
  const theme = (await cookies()).get('theme')?.value
  // ...
}
```

Your page receives `params` and `searchParams` as props, and both are promises. Apply the same pattern: pass the promise straight through to the ```<Suspense>``
  )
}

async function Results({ searchParams }: Pick<PageProps<'/'>, 'searchParams'>) {
  const { query } = await searchParams
  // ...
}
```

```jsx
// Archivo: app/page.js switcher
import { Suspense } from 'react'

export default function Page({ searchParams }) {
  return (
    ``<Suspense>``
  )
}

async function Results({ searchParams }) {
  const { query } = await searchParams
  // ...
}
```

> **Good to know**: When a cookie or header value drives an attribute on the `<html>` element in the root layout (`lang`, `dir`, `data-theme`, etc.), reading it on the server makes the whole subtree request-bound, so there's no child to wrap in ```<Suspense>``
  )
}

async function Connection() {
  await connection()
  return null
}

export default function Page() {
  return (
    <>
      <article>Static content</article>
      <DynamicMarker />
    </>
  )
}
```

See [`generateMetadata` with Cache Components](/docs/app/api-reference/functions/generate-metadata#with-cache-components) and [`generateViewport` with Cache Components](/docs/app/api-reference/functions/generate-viewport#with-cache-components) for the full set of fix options and trade-offs.

## `runtime = 'edge'`

**Not supported.** Cache Components requires the Node.js runtime. Switch to the Node.js runtime (the default) by removing the [deprecated](/docs/messages/edge-runtime-deprecated) `runtime = 'edge'` export. If you need edge behavior for specific routes, use [Proxy](/docs/app/api-reference/file-conventions/proxy) instead.

## `experimental_ppr`

**Removed. Enable `cacheComponents` instead.** Next.js 16 removes the experimental Partial Prerendering flag (`experimental.ppr`) and the `experimental_ppr` route segment config. Partial Prerendering is now part of [Cache Components](/docs/app/api-reference/config/next-config-js/cacheComponents), so remove `experimental.ppr` from `next.config` and `experimental_ppr` from your segments. A [codemod](/docs/app/guides/upgrading/codemods#remove-experimental_ppr-route-segment-config-from-app-router-pages-and-layouts) removes the segment config for you.

```tsx
// Archivo: app/page.tsx switcher
// Before - no longer needed
export const experimental_ppr = true

export default function Page() {
  return <div>...</div>
}
```

```jsx
// Archivo: app/page.js switcher
// Before - no longer needed
export const experimental_ppr = true

export default function Page() {
  return <div>...</div>
}
```

```tsx
// Archivo: app/page.tsx switcher
// After - remove it; cacheComponents enables Partial Prerendering
export default function Page() {
  return <div>...</div>
}
```

```jsx
// Archivo: app/page.js switcher
// After - remove it; cacheComponents enables Partial Prerendering
export default function Page() {
  return <div>...</div>
}
```

## UI state preservation

**Component state now persists across navigations.** With Cache Components, Next.js preserves routes using React's [`<Activity>`](https://react.dev/reference/react/Activity) component in [`"hidden"`](https://react.dev/reference/react/Activity#activity) mode instead of unmounting them. Effects clean up and re-run normally, but `useState` values, form inputs, and scroll position are no longer reset when navigating away and back.

If your code relied on unmounting to clear state, you may need to add explicit reset logic:

- **Dropdowns and popovers**: stay open when navigating back. Close them in a `useLayoutEffect` cleanup function.
- **Dialogs with initialization logic**: Effects that depend on dialog state (like focusing an input) won't re-fire if the state was preserved. Derive dialog state from the URL instead.
- **Forms after submission**: input values and `useActionState` results (success/error messages) persist when returning. Reset in the submit handler or user action when possible, otherwise use a cleanup effect.

See [Preserving UI state across navigations](/docs/app/guides/preserving-ui-state) for detailed examples of each pattern.
