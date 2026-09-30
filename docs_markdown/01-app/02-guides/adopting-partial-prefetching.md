# Adopting Partial Prefetching

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/adopting-partial-prefetching](https://nextjs.org/docs/app/guides/adopting-partial-prefetching)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to enable Partial Prefetching and what changes for `<Link>`.*  

---

[Partial Prefetching](/docs/app/glossary#partial-prefetching) changes what a `<Link>` downloads for a Cache Components route. With Partial Prefetching enabled, a `<Link>` prefetches the route's [App Shell](/docs/app/glossary#app-shell): its static content and the cached content that doesn't depend on the URL. Next.js builds one App Shell per route and reuses it for every link to that route, rather than prefetching each link separately as it did before.

To prefetch more than the App Shell, a link can opt into [per-link prefetching](/docs/app/guides/optimizing-prefetching) with [`<Link prefetch={true}>`](/docs/app/api-reference/components/link#prefetch). The prefetch can then resolve cached URL-specific content that depends on `params`, `searchParams`, or the full URL.

Along the way, Next.js surfaces [instant navigation](/docs/app/guides/instant-navigation) insights in development, naming the link or route to change.

> **Good to know**: Partial Prefetching only works when [`cacheComponents`](/docs/app/api-reference/config/next-config-js/cacheComponents) is enabled.

## Use the adoption skill (recommended)

The [`next-partial-prefetching-adoption`](https://github.com/vercel/next.js/tree/canary/skills/next-partial-prefetching-adoption) skill drives this adoption with a coding agent. It reviews your `<Link prefetch={true}>` calls, captures the prefetched UI to preserve with [`instant()` tests](#verify-prefetched-ui-with-tests) when a production test rig is available, then enables the flag and checks each route for the insights this guide covers.

Install the skill:

```bash
// Archivo: Terminal
npx skills add vercel/next.js --skill next-partial-prefetching-adoption
```

Then give the agent this prompt:

```prompt
Adopt Partial Prefetching in this project using the next-partial-prefetching-adoption skill.
```

## Or adopt by hand

To adopt an existing app by hand:

1. [Review existing full prefetches](#migrate-existing-full-prefetches) and choose which part of each destination should continue to be prefetched. You can use [`instant()` tests](#verify-prefetched-ui-with-tests) to add regression coverage.
2. [Enable `partialPrefetching`](#enable-partial-prefetching). For larger migrations, you can [adopt incrementally](#adopting-incrementally) with the global flag off. The [dynamic data during prefetching](/docs/messages/instant-link-prefetch-partial) insight identifies each destination that still uses the legacy full prefetch.
3. [Move URL data behind Suspense](#move-url-data-behind-suspense), resolving the [URL data outside of Suspense](/docs/messages/instant-shell-url-data) insight.
4. Optionally, [prefetch URL data](#prefetching-url-data) on the routes where streaming in after navigation isn't enough.

Both insights are development-only and never block the build. They appear in the dev overlay with fix cards that link the docs page for each fix. If a route isn't ready to adopt, export [`instant = false`](/docs/app/api-reference/file-conventions/route-segment-config/instant) from its page or layout to opt the route out of instant-navigation validation, and return to it later.

## Enable Partial Prefetching

> **Good to know**: In an existing app, review the UI delivered by [`<Link prefetch={true}>`](#migrate-existing-full-prefetches) before enabling Partial Prefetching. These links use the legacy full prefetch, and enabling Partial Prefetching changes their behavior.

Enable [`partialPrefetching`](/docs/app/api-reference/config/next-config-js/partialPrefetching) in `next.config.ts`:

```ts
// Archivo: next.config.ts highlight={5}
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
```

After enabling the flag, links using the default behavior, `prefetch="auto"`, or `prefetch={true}` prefetch the destination's App Shell. A link with `prefetch={true}` can also resolve cached URL-specific content, but it no longer includes uncached dynamic content from the legacy full prefetch. New projects can enable the flag without this audit because they have no legacy full prefetches to migrate.

## What changes for `<Link>`

| `<Link>` prop                       | Before (Cache Components default)                              | After Partial Prefetching                                                                                                                              |
| ----------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `[`                  | Prefetched the cached page render.                             | Prefetches the shared App Shell for `/x`.                                                                                                              |
| `<Link href="/x" prefetch>`         | Prefetched the cached page render **and** any dynamic content. | Prefetches the App Shell, plus cached URL-specific content through [per-link prefetching](/docs/app/guides/optimizing-prefetching) when `/x` reads it. |
| `<Link href="/x" prefetch={false}>` | Disabled prefetching for this link.                            | Unchanged. Still disabled.                                                                                                                             |

The App Shell is shared across every link to a given route, regardless of dynamic params, so rendering many `<Link>`s to the same destination doesn't multiply the work.

## Migrate existing full prefetches

Before Partial Prefetching, a `<Link>` whose effective `prefetch` value is `true` prefetches the complete destination, including uncached dynamic content. This includes `prefetch={true}`, the bare `prefetch` prop, and wrapper or conditional props that resolve to `true`. The default value, `prefetch="auto"`, and `prefetch={false}` don't use the legacy full prefetch.

A legacy full prefetch can include more UI than the navigation needs. In most cases, the primary content at the top of the destination should be available before navigation, while secondary or frequently changing content can stream afterward.

> **Good to know**: `cookies()` and `headers()` don't tie a prefetch to a URL. They vary per session, not per link, so the App Shell still carries session content. Only `params` and `searchParams` are [URL data](/docs/app/glossary#url-data), which varies per link and can't be included in the shared App Shell.

### Verify prefetched UI with tests

To verify the migration programmatically, an [`instant()`](/docs/app/guides/instant-navigation#prevent-regressions-with-e2e-tests) test can capture the UI that should stay available from an existing full prefetch. Run this baseline against a production build with `partialPrefetching` disabled because automatic prefetching doesn't run in `next dev`. Then rerun the same assertions after adopting the destination. A failure identifies UI the App Shell no longer carries, so you can cache the data or subtree that restores it. The passing test provides regression coverage.

### Static or cached content

The output is already in the App Shell. Remove the now-redundant `prefetch={true}`:

```tsx
// Archivo: app/nav.tsx
// Before
<Link href="/about" prefetch={true}>About](/x)
// After
[About](/about)
```

### Uncached content

Cache it with `use cache` so it gets included in the App Shell, then remove `prefetch={true}` from the links:

```tsx
// Archivo: app/products/page.tsx switcher
// Before
export default async function Page() {
  const res = await fetch('https://api.example.com/products')
  return <ProductList products={await res.json()} />
}
```

```jsx
// Archivo: app/products/page.js switcher
// Before
export default async function Page() {
  const res = await fetch('https://api.example.com/products')
  return <ProductList products={await res.json()} />
}
```

```tsx
// Archivo: app/products/page.tsx switcher
// After - cached, so the App Shell carries it
async function getProducts() {
  'use cache'
  const res = await fetch('https://api.example.com/products')
  return res.json()
}

export default async function Page() {
  return <ProductList products={await getProducts()} />
}
```

```jsx
// Archivo: app/products/page.js switcher
// After - cached, so the App Shell carries it
async function getProducts() {
  'use cache'
  const res = await fetch('https://api.example.com/products')
  return res.json()
}

export default async function Page() {
  return <ProductList products={await getProducts()} />
}
```

> **Good to know**: The App Shell carries cached content whose [`stale`](/docs/app/api-reference/functions/cacheLife#stale) time is at least 5 minutes, which holds for the `default` profile used above and every preset except `seconds`. Shorter-lived content streams in after the navigation instead. See [Prerendering behavior](/docs/app/api-reference/functions/cacheLife#prerendering-behavior).

### Session content

Content behind [`cookies()`](/docs/app/api-reference/functions/cookies) or [`headers()`](/docs/app/api-reference/functions/headers) varies per session, not per link, and [session data resolves in the App Shell](/docs/app/guides/optimizing-prefetching#include-session-data-in-the-shell), so cached session content still gets included. Read the session value outside the cached function and pass it in, then remove `prefetch={true}` from the links:

```tsx
// Archivo: app/dashboard/page.tsx switcher
// Before
import { Suspense } from 'react'
import { cookies } from 'next/headers'

async function TeamTopics() {
  const team = (await cookies()).get('team')?.value
  const topics = await db.topics.forTeam(team)
  return <TopicList topics={topics} />
}

export default function Page() {
  return (
    ``<Suspense>``}>
      <TeamTopics />
    `<Suspense>`
  )
}
```

```jsx
// Archivo: app/dashboard/page.js switcher
// Before
import { Suspense } from 'react'
import { cookies } from 'next/headers'

async function TeamTopics() {
  const team = (await cookies()).get('team')?.value
  const topics = await db.topics.forTeam(team)
  return <TopicList topics={topics} />
}

export default function Page() {
  return (
    ``<Suspense>``}>
      <TeamTopics />
    `<Suspense>`
  )
}
```

```tsx
// Archivo: app/dashboard/page.tsx switcher
// After - the lookup is cached behind the session value
import { Suspense } from 'react'
import { cookies } from 'next/headers'

async function getTopics(team: string | undefined) {
  'use cache'
  return db.topics.forTeam(team)
}

async function TeamTopics() {
  const team = (await cookies()).get('team')?.value
  return <TopicList topics={await getTopics(team)} />
}

export default function Page() {
  return (
    ``<Suspense>``}>
      <TeamTopics />
    `<Suspense>`
  )
}
```

```jsx
// Archivo: app/dashboard/page.js switcher
// After - the lookup is cached behind the session value
import { Suspense } from 'react'
import { cookies } from 'next/headers'

async function getTopics(team) {
  'use cache'
  return db.topics.forTeam(team)
}

async function TeamTopics() {
  const team = (await cookies()).get('team')?.value
  return <TopicList topics={await getTopics(team)} />
}

export default function Page() {
  return (
    ``<Suspense>``}>
      <TeamTopics />
    `<Suspense>`
  )
}
```

### URL data

[URL data](/docs/app/glossary#url-data) (`params`, `searchParams`) varies per link, so content that depends on it can't be included in the shared App Shell and streams in after navigation from behind its ```<Suspense>``', highlight: true },
    ]}
  />
  
> 💡 **Solución recomendada (block):** Allow blocking route — [Ver guía de solución](https://nextjs.org/docs/messages/instant-shell-url-data#allow-blocking-route)

The insight never blocks the build, so this pass can happen any time after the flag is on. Load every route in `next dev` to check for it.

The fix is to keep the URL-independent parts of the route outside the boundary and move the `params` or `searchParams` read into a child wrapped in ```<Suspense>``
    </ProductLayout>
  )
}
```

```jsx
// Archivo: app/products/[slug]/page.js switcher
// After - pass the promise down without awaiting it
import { Suspense } from 'react'
import { ProductDetails } from './product-details'

export default function Page({ params }) {
  return (
    <ProductLayout>
      ``<Suspense>``}>
        <ProductDetails params={params} />
      `<Suspense>`
    </ProductLayout>
  )
}
```

The child awaits the promise inside the boundary:

```tsx
// Archivo: app/products/[slug]/product-details.tsx switcher
export async function ProductDetails({
  params,
}: Pick<PageProps<'/products/[slug]'>, 'params'>) {
  const { slug } = await params
  const product = await getProduct(slug)
  return ``<Details>``
}
```

```jsx
// Archivo: app/products/[slug]/product-details.js switcher
export async function ProductDetails({ params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  return ``<Details>``
}
```

Everything outside the boundary stays in the shared App Shell, and only the URL-specific region renders per navigation. Load or navigate to the route again to confirm the insight is gone and the page still paints meaningful UI.

> **Good to know**: A `params` or `searchParams` read inside [`generateMetadata`](/docs/app/api-reference/functions/generate-metadata) surfaces as [URL data in `generateMetadata()`](/docs/messages/blocking-prerender-metadata-runtime) instead.

## Prefetching URL data

Content that depends on [URL data](/docs/app/glossary#url-data) (`params`, `searchParams`) can't be included in the shared App Shell, so it streams in after navigation. [Per-link prefetching](/docs/app/guides/optimizing-prefetching) resolves it ahead of the click for links with `prefetch={true}`, at the cost of a server invocation per prefetchable link. To make the content resolvable at prefetch time, cache it behind the read with [`use cache`](/docs/app/api-reference/directives/use-cache). For a search page that reads `searchParams`:

```tsx
// Archivo: app/search/page.tsx switcher
// Before - the results stream in after navigation
import { Suspense } from 'react'

async function getResults(query: string) {
  const res = await fetch(`https://api.example.com/search?q=${query}`)
  return res.json()
}

async function Results({
  searchParams,
}: Pick<PageProps<'/search'>, 'searchParams'>) {
  const { q } = await searchParams
  return <ResultList results={await getResults(q)} />
}

export default function Page({ searchParams }: PageProps<'/search'>) {
  return (
    ``<Suspense>``}>
      <Results searchParams={searchParams} />
    `<Suspense>`
  )
}
```

```jsx
// Archivo: app/search/page.js switcher
// Before - the results stream in after navigation
import { Suspense } from 'react'

async function getResults(query) {
  const res = await fetch(`https://api.example.com/search?q=${query}`)
  return res.json()
}

async function Results({ searchParams }) {
  const { q } = await searchParams
  return <ResultList results={await getResults(q)} />
}

export default function Page({ searchParams }) {
  return (
    ``<Suspense>``}>
      <Results searchParams={searchParams} />
    `<Suspense>`
  )
}
```

```tsx
// Archivo: app/search/page.tsx switcher
// After - the results are cached and prefetched behind the resolved searchParams
import { Suspense } from 'react'

async function getResults(query: string) {
  'use cache'
  const res = await fetch(`https://api.example.com/search?q=${query}`)
  return res.json()
}

async function Results({
  searchParams,
}: Pick<PageProps<'/search'>, 'searchParams'>) {
  const { q } = await searchParams
  return <ResultList results={await getResults(q)} />
}

export default function Page({ searchParams }: PageProps<'/search'>) {
  return (
    ``<Suspense>``}>
      <Results searchParams={searchParams} />
    `<Suspense>`
  )
}
```

```jsx
// Archivo: app/search/page.js switcher
// After - the results are cached and prefetched behind the resolved searchParams
import { Suspense } from 'react'

async function getResults(query) {
  'use cache'
  const res = await fetch(`https://api.example.com/search?q=${query}`)
  return res.json()
}

async function Results({ searchParams }) {
  const { q } = await searchParams
  return <ResultList results={await getResults(q)} />
}

export default function Page({ searchParams }) {
  return (
    ``<Suspense>``}>
      <Results searchParams={searchParams} />
    `<Suspense>`
  )
}
```

The [Optimizing prefetching guide](/docs/app/guides/optimizing-prefetching) covers when the cost pays off and the caching patterns behind runtime reads.
