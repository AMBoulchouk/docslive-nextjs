# Capítulo 6: Directivas de Nueva Generación en Next.js 16

> 📌 **Capítulo 06** | Libro Guía Next.js v16.3.7  
> 📝 **Resumen:** *Guía exhaustiva de directivas: 'use cache', 'use cache: private', 'use cache: remote', 'use client' y 'use server'.*  
> 📄 **Temas incluidos:** 6 secciones  

[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)

---

## Contenido del Capítulo

- [Directives](#directives)
- [use cache: private](#use-cache-private)
- [use cache: remote](#use-cache-remote)
- [use cache](#use-cache)
- [use client](#use-client)
- [use server](#use-server)

---

<a id="directives"></a>

## Directives

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/directives](https://nextjs.org/docs/app/api-reference/directives)  
> 📂 **Sección:** App > Api Reference > Directives  
> 📝 **Descripción:** *Learn how React and Next.js directives define client entry points, Server Functions, and cached output.*  

---

Directives are string literals that tell the compiler and bundler how to treat the code around them. On their own, directives look like plain strings, but Next.js and React read them as instructions that transform the code they cover. A directive can create a client entry point or a Server Function, or cache a function's or component's output.

| Directive                                                       | Defined by | Effect                                              |
| --------------------------------------------------------------- | ---------- | --------------------------------------------------- |
| [`'use client'`](/docs/app/api-reference/directives/use-client) | React      | Creates a client entry point from Server Components |
| [`'use server'`](/docs/app/api-reference/directives/use-server) | React      | Exposes server-side functions as Server Functions   |
| [`'use cache'`](/docs/app/api-reference/directives/use-cache)   | Next.js    | Caches and reuses output based on the code's inputs |

The `'use cache'` directive also has [`'use cache: remote'`](/docs/app/api-reference/directives/use-cache-remote) and [`'use cache: private'`](/docs/app/api-reference/directives/use-cache-private) variants. Configure custom [cache handlers](/docs/app/api-reference/config/next-config-js/cacheHandlers) to control where cached entries are stored.

> **Good to know:** Next.js applies directives during compilation in both development and production.
>
> The error overlay, indicators, and stack traces point to your source file and line rather than the generated output.

## Where to place a directive

The `'use client'` directive must appear at the top of a file, before any imports. It applies to the entire module and defines a file-wide boundary because the module is bundled and shipped to the browser. You cannot use `'use client'` inline.

Place `'use server'` or `'use cache'` at the top of a file to apply the directive to every export. Place either directive at the top of a function to apply it only to that function.

```ts
// Archivo: app/data.ts switcher
// File-level: applies to every export
'use cache'

export async function getUser(id: string) {
  return { id }
}
```

```js
// Archivo: app/data.js switcher
// File-level: applies to every export
'use cache'

export async function getUser(id) {
  return { id }
}
```

```tsx
// Archivo: app/user.tsx switcher
// Function-level: applies to this function only
export async function User() {
  'use cache'
  return <p>User</p>
}
```

```jsx
// Archivo: app/user.js switcher
// Function-level: applies to this function only
export async function User() {
  'use cache'
  return <p>User</p>
}
```

Declare `'use server'` and `'use cache'` in server modules, not in a `'use client'` module.

To import a `'use server'` or `'use cache'` function into a Client Component, place the directive at the top of the server module. The Client Component receives a reference that invokes the function on the server.

Place the directive inside a function when it should apply only to that function or component. When it should apply to several exported functions, place it at the top of the file instead of repeating it.

Every exported function covered by a file-level `'use server'` or `'use cache'` directive must be `async`.

## What each directive requires

A directive imposes rules on the code it covers:

- **`'use client'`** marks its exports as the boundary between server and client. Client Component props that cross the boundary must be [serializable](https://react.dev/reference/rsc/use-client#serializable-types). Ordinary functions, such as event handlers, cannot cross, but Server Functions can cross as references.
- **`'use server'`** marks the functions it covers as [Server Functions](/docs/app/glossary#server-function). Server Functions must be `async`. When invoked from a Client Component, their arguments and return values are serialized across the network. The Client Component receives a reference that invokes the function on the server, not the function's code.
- **`'use cache'`** caches the output of the functions or components it covers based on their inputs. Cached functions and components must be `async`. Their arguments and return values must be serializable, except for non-serializable values that the cached code passes through without inspecting. Cached code cannot read request-time APIs like `cookies()`, `headers()`, or `searchParams` directly.

With `'use cache'` at the top of a page or layout file, exported functions such as `generateMetadata` and `generateStaticParams` must be `async`.

## Placement decides what you cache

With `'use cache'`, placement determines the scope of a cache entry. A directive at the top of a page caches the page's output and the components it imports. The same directive inside a data function caches only that function's result. When one data request performs the expensive work, cache that function instead of the page.

With [`'use cache: remote'`](/docs/app/api-reference/directives/use-cache-remote), a remote cache handler stores entries. Larger entries can increase storage and network costs.


[⬆ Subir al inicio del capítulo](#)

---

<a id="use-cache-private"></a>

## use cache: private

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/directives/use-cache-private](https://nextjs.org/docs/app/api-reference/directives/use-cache-private)  
> 📂 **Sección:** App > Api Reference > Directives  
> 📝 **Descripción:** *Learn how to use the "use cache: private" directive to cache functions that access runtime request APIs.*  

---

The `'use cache: private'` directive allows functions to access runtime request APIs like `cookies()`, `headers()`, and `searchParams` within a cached scope. In production, matching calls within one request can reuse the same result, but Next.js does not store it in a server cache across requests.

The client router can keep the rendered output in browser memory for the [`stale` time](/docs/app/api-reference/functions/cacheLife#client-cache-behavior) configured with `cacheLife`. This client-side cache does not persist across page reloads.

Reach for `'use cache: private'` when:

- You want to cache a function that already accesses runtime data, and refactoring to [move the runtime access outside and pass values as arguments](/docs/app/getting-started/caching#working-with-runtime-apis) is not practical.
- You need request-specific data to be excluded from server caches that persist across production requests.

Private Cache Functions run at request time and are excluded from [static shell](/docs/app/getting-started/caching#prerendering) generation. To start a private Cache Function before a component needs its result, see [Preloading data](/docs/app/getting-started/fetching-data#preloading-data).

It is **not** possible to configure custom cache handlers for `'use cache: private'`.

For a comparison of the different cache directives, see [How `use cache: remote` differs from `use cache` and `use cache: private`](/docs/app/api-reference/directives/use-cache-remote#how-use-cache-remote-differs-from-use-cache-and-use-cache-private).

## Usage

To use `'use cache: private'`, enable the [`cacheComponents`](/docs/app/api-reference/config/next-config-js/cacheComponents) flag in your `next.config.ts` file:

```tsx
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

```jsx
// Archivo: next.config.js switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
}

module.exports = nextConfig
```

Then add `'use cache: private'` to your function along with a `cacheLife` configuration.

### Basic example

In this example, we demonstrate that you can access cookies within a `'use cache: private'` scope:

```tsx
// Archivo: app/product/[id]/page.tsx switcher
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

export async function generateStaticParams() {
  return [{ id: '1' }]
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div>
      <ProductDetails id={id} />
      <Suspense fallback={<div>Loading recommendations...</div>}>
        <Recommendations productId={id} />
      </Suspense>
    </div>
  )
}

async function Recommendations({ productId }: { productId: string }) {
  const recommendations = await getRecommendations(productId)

  return (
    <div>
      {recommendations.map((rec) => (
        <ProductCard key={rec.id} product={rec} />
      ))}
    </div>
  )
}

async function getRecommendations(productId: string) {
  'use cache: private'
  cacheTag(`recommendations-${productId}`)
  cacheLife({ stale: 60 })

  // Access cookies within private cache functions
  const sessionId = (await cookies()).get('session-id')?.value || 'guest'

  return getPersonalizedRecommendations(productId, sessionId)
}
```

```jsx
// Archivo: app/product/[id]/page.js switcher
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

export async function generateStaticParams() {
  return [{ id: '1' }]
}

export default async function ProductPage({ params }) {
  const { id } = await params

  return (
    <div>
      <ProductDetails id={id} />
      <Suspense fallback={<div>Loading recommendations...</div>}>
        <Recommendations productId={id} />
      </Suspense>
    </div>
  )
}

async function Recommendations({ productId }) {
  const recommendations = await getRecommendations(productId)

  return (
    <div>
      {recommendations.map((rec) => (
        <ProductCard key={rec.id} product={rec} />
      ))}
    </div>
  )
}

async function getRecommendations(productId) {
  'use cache: private'
  cacheTag(`recommendations-${productId}`)
  cacheLife({ stale: 60 })

  // Access cookies within private cache functions
  const sessionId = (await cookies()).get('session-id')?.value || 'guest'

  return getPersonalizedRecommendations(productId, sessionId)
}
```

> **Good to know:** The `stale` time must be at least 30 seconds for per-link prefetching to work, and at least 5 minutes for the content to be included in the route's [App Shell](/docs/app/glossary#app-shell). See [`cacheLife` prerendering behavior](/docs/app/api-reference/functions/cacheLife#prerendering-behavior) for details.

### Configuring the client stale time

Private Cache Functions contribute their `stale` time to the route's [Client Cache](/docs/app/glossary#client-cache). If a function only needs request-scoped deduplication, use `cacheLife({ stale: Infinity })` to keep it from lowering the route's stale time.

Next.js uses the shortest stale time from the route's cache entries, so another cache or route setting can still set a finite value. Setting `stale` to `Infinity` does not store the private result on the server across production requests. Use a finite value when the client router should revalidate personalized output after a known interval.

## Request APIs allowed in private caches

The following request-specific APIs can be used inside `'use cache: private'` functions:

| API            | Allowed in `use cache` | Allowed in `'use cache: private'` |
| -------------- | ---------------------- | --------------------------------- |
| `cookies()`    | No                     | Yes                               |
| `headers()`    | No                     | Yes                               |
| `searchParams` | No                     | Yes                               |
| `connection()` | No                     | No                                |

> **Note:** The [`connection()`](https://nextjs.org/docs/app/api-reference/functions/connection) API is prohibited in both `use cache` and `'use cache: private'` as it provides connection-specific information that cannot be safely cached.

## Version History

| Version   | Changes                                                              |
| --------- | -------------------------------------------------------------------- |
| `v16.0.0` | `"use cache: private"` is enabled with the Cache Components feature. |


[⬆ Subir al inicio del capítulo](#)

---

<a id="use-cache-remote"></a>

## use cache: remote

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/directives/use-cache-remote](https://nextjs.org/docs/app/api-reference/directives/use-cache-remote)  
> 📂 **Sección:** App > Api Reference > Directives  
> 📝 **Descripción:** *Learn how to use the "use cache: remote" directive for persistent, shared caching using remote cache handlers.*  

---

While the `use cache` directive is sufficient for most application needs, you might notice that cached operations are re-running more often than expected, or that your upstream services (CMS, databases, external APIs) are getting more hits than you'd expect. This can happen because `use cache` stores entries in-memory, which has inherent limitations:

- Cache entries being evicted to make room for new ones
- Memory constraints in your deployment environment
- Cache not persisting across requests or server restarts

Note that `use cache` still provides value beyond server-side caching: it informs Next.js what can be prefetched and defines stale times for client-side navigation.

The `'use cache: remote'` directive lets you declaratively specify that a cached output should be stored in a remote cache instead of in-memory, providing durable caching shared across all server instances. This comes with tradeoffs: infrastructure cost and network latency during cache lookups.

## Usage

To use `'use cache: remote'`, enable the [`cacheComponents`](/docs/app/api-reference/config/next-config-js/cacheComponents) flag in your `next.config.ts` file:

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

```js
// Archivo: next.config.js switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
}

module.exports = nextConfig
```

Then add `'use cache: remote'` to the functions or components where you've determined remote caching is justified. The handler implementation is configured via [`cacheHandlers`](/docs/app/api-reference/config/next-config-js/cacheHandlers), though hosting providers should typically provide this automatically. If you're self-hosting, see the `cacheHandlers` configuration reference to set up your cache storage.

### When to avoid remote caching

- If you already have a server-side cache key-value store wrapping your data layer, `use cache` may be sufficient to include data in the static shell without adding another caching layer
- If operations are already fast (< 50ms) due to proximity or local access, the remote cache lookup might not improve performance
- If cache keys have mostly unique values per request (search filters, price ranges, user-specific parameters), cache utilization will be near-zero
- If data changes frequently (seconds to minutes), cache hits will quickly go stale, leading to frequent misses and waiting for upstream revalidation

### When remote caching makes sense

Remote caching provides the most value when content is deferred to request time (outside the static shell). This typically happens when a component accesses request values like [`cookies()`](/docs/app/api-reference/functions/cookies), [`headers()`](/docs/app/api-reference/functions/headers), or [`searchParams`](/docs/app/api-reference/file-conventions/page#searchparams-optional), placing it inside a Suspense boundary. In this context:

- Each request executes the component and looks up the cache
- In serverless environments, each instance has its own ephemeral memory with low cache hit rates
- Remote caching provides a shared cache across all instances, improving hit rates and reducing backend load

Compelling scenarios for `'use cache: remote'`:

- **Rate-limited APIs**: Your upstream service has rate limits or request quotas that you risk hitting
- **Protecting slow backends**: Your database or API becomes a bottleneck under high traffic
- **Expensive operations**: Database queries or computations that are costly to run repeatedly
- **Flaky or unreliable services**: External services that occasionally fail or have availability issues

In these cases, the cost and latency of remote caching is justified by avoiding worse outcomes (rate limit errors, backend overload, high compute bills, or degraded user experience).

For static shell content, `use cache` is usually sufficient. If your upstream source can't handle concurrent revalidation requests (like a rate-limited CMS), `use cache: remote` acts as a shared cache layer. This is the same pattern as putting a key-value store in front of a database, but declared in code.

### How `use cache: remote` differs from `use cache` and `use cache: private`

Next.js provides three caching directives, each designed for different use cases:

| Feature                                 | `use cache`                     | `'use cache: remote'`             | `'use cache: private'` |
| --------------------------------------- | ------------------------------- | --------------------------------- | ---------------------- |
| **Server-side caching**                 | In-memory or cache handler      | Remote cache handler              | None                   |
| **Cache scope**                         | Shared across all users         | Shared across all users           | Per-client (browser)   |
| **Can access cookies/headers directly** | No (must pass as arguments)     | No (must pass as arguments)       | Yes                    |
| **Server cache utilization**            | May be low outside static shell | High (shared across instances)    | N/A                    |
| **Additional costs**                    | None                            | Infrastructure (storage, network) | None                   |
| **Latency impact**                      | None                            | Cache handler lookup              | None                   |
| **Persists across deploys**             | No                              | No                                | N/A                    |

### Persistence across deploys

Remote cache entries do not persist across deploys. The cache key includes the `deploymentId` (when configured) or the `buildId`, so a new build produces new keys and the previous build's entries are no longer reachable. See [Cache keys](/docs/app/api-reference/directives/use-cache#cache-keys) for the full key composition.

This is intentional. Between builds, the function's identity hash or the shape of its return value can change. Upgrading a CMS client, refactoring a cached function, or changing a dependency could produce a value that doesn't match what older callers expect, so reusing entries across deploys risks serving stale or malformed data.

If you need entries that persist across deploys, use [`unstable_cache`](/docs/app/api-reference/functions/unstable_cache) for non-`fetch` functions, or rely on the [`fetch`](/docs/app/api-reference/functions/fetch) cache.

### Caching with runtime data

Both `use cache` and `'use cache: remote'` can't access runtime values like cookies or search params directly. You can extract these values and pass them as arguments to cached functions. See [with runtime data](/docs/app/getting-started/caching#working-with-runtime-apis) for this pattern.

> **Good to know**: `use cache` stores entries in-memory. In serverless environments, memory is not shared between instances and is typically destroyed after serving a request, leading to frequent cache misses for runtime caching.

### Cache key considerations

Be thoughtful about which values you include in cache keys. Each unique value creates a separate cache entry, reducing cache utilization. Consider this example with search filters:

```tsx
// Archivo: app/products/[category]/page.tsx
import { Suspense } from 'react'

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ minPrice?: string }>
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProductList params={params} searchParams={searchParams} />
    </Suspense>
  )
}

async function ProductList({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>
  searchParams: Promise<{ minPrice?: string }>
}) {
  const { category } = await params

  const { minPrice } = await searchParams

  // Cache only on category (few unique values)
  // Don't include price filter (many unique values)
  const products = await getProductsByCategory(category)

  // Filter price in memory instead of creating cache entries
  // for every price value
  const filtered = minPrice
    ? products.filter((p) => p.price >= parseFloat(minPrice))
    : products

  return <div></div>
}

async function getProductsByCategory(category: string) {
  'use cache: remote'
  // Only category is part of the cache key
  // Much better utilization than caching every price filter value
  return db.products.findByCategory(category)
}
```

In this example, the remote handler stores more data per cache entry (all products in a category) to achieve better cache hit rates. This is worth it when the cost of cache misses (hitting your backend) outweighs the storage cost of larger entries.

The same principle applies to user-specific data. Rather than caching per-user data directly, use user preferences to determine what shared data to cache.

For example, if users have a language preference in their session, extract that preference and use it to cache shared content:

- Instead of remote caching `getUserProfile(sessionID)`, which creates one entry per user
- Remote cache `getCMSContent(language)` to create one entry per language

```tsx
// Archivo: app/components/welcome-message.tsx
import { cookies } from 'next/headers'
import { cacheLife } from 'next/cache'

export async function WelcomeMessage() {
  // Extract the language preference (not unique per user)
  const language = (await cookies()).get('language')?.value || 'en'

  // Cache based on language (few unique values: en, es, fr, de, etc.)
  // All users who prefer 'en' share the same cache entry
  const content = await getCMSContent(language)

  return <div>{content.welcomeMessage}</div>
}

async function getCMSContent(language: string) {
  'use cache: remote'
  cacheLife({ expire: 3600 })
  // Creates ~10-50 cache entries (one per language)
  // instead of thousands (one per user)
  return cms.getHomeContent(language)
}
```

This way all users who prefer the same language share a cache entry, improving cache utilization and reducing load on your CMS.

The pattern is the same in both examples: find the dimension with fewer unique values (category vs. price, language vs. user ID), cache on that dimension, and filter or select the rest in memory.

If the service used by `getUserProfile` cannot scale with your frontend load, you may still be able to use the `use cache` directive with a short `cacheLife` for in-memory caching. However, for most user data, you likely want to fetch directly from the source (which might already be wrapped in a key/value store as mentioned in the guidelines above).

Only use [`'use cache: private'`](/docs/app/api-reference/directives/use-cache-private) if you have compliance requirements or can't refactor to pass runtime data as arguments.

### Nesting rules

Remote caches have specific nesting rules:

- Remote caches **can** be nested inside other remote caches (`'use cache: remote'`)
- Remote caches **can** be nested inside regular caches (`'use cache'`)
- Remote caches **cannot** be nested inside private caches (`'use cache: private'`)
- Private caches **cannot** be nested inside remote caches

```tsx
// VALID: Remote inside remote
async function outerRemote() {
  'use cache: remote'
  const result = await innerRemote()
  return result
}

async function innerRemote() {
  'use cache: remote'
  return getData()
}

// VALID: Remote inside regular cache
async function outerCache() {
  'use cache'
  // The inner remote cache will work when deferred to request time
  const result = await innerRemote()
  return result
}

async function innerRemote() {
  'use cache: remote'
  return getData()
}

// INVALID: Remote inside private
async function outerPrivate() {
  'use cache: private'
  const result = await innerRemote() // Error!
  return result
}

async function innerRemote() {
  'use cache: remote'
  return getData()
}

// INVALID: Private inside remote
async function outerRemote() {
  'use cache: remote'
  const result = await innerPrivate() // Error!
  return result
}

async function innerPrivate() {
  'use cache: private'
  return getData()
}
```

## Examples

The following examples demonstrate common patterns for using `'use cache: remote'`. For details about `cacheLife` parameters (`stale`, `revalidate`, `expire`), see the [`cacheLife` API reference](/docs/app/api-reference/functions/cacheLife).

### With user preferences

Cache product pricing based on the user's currency preference. Since the currency is stored in a cookie, this component renders at request time. Remote caching is valuable here because all users with the same currency share the cached price, and in serverless environments, all instances share the same remote cache.

```tsx
// Archivo: app/product/[id]/page.tsx switcher
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheTag, cacheLife } from 'next/cache'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div>
      <ProductDetails id={id} />
      <Suspense fallback={<div>Loading price...</div>}>
        <ProductPrice productId={id} />
      </Suspense>
    </div>
  )
}

function ProductDetails({ id }: { id: string }) {
  return <div>Product: {id}</div>
}

async function ProductPrice({ productId }: { productId: string }) {
  // Reading cookies defers this component to request time
  const currency = (await cookies()).get('currency')?.value ?? 'USD'

  // Cache the price per product and currency combination
  // All users with the same currency share this cache entry
  const price = await getProductPrice(productId, currency)

  return (
    <div>
      Price: {price} {currency}
    </div>
  )
}

async function getProductPrice(productId: string, currency: string) {
  'use cache: remote'
  cacheTag(`product-price-${productId}`)
  cacheLife({ expire: 3600 }) // 1 hour

  // Cached per (productId, currency) - few currencies means high cache utilization
  return db.products.getPrice(productId, currency)
}
```

```jsx
// Archivo: app/product/[id]/page.js switcher
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheTag, cacheLife } from 'next/cache'

export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }, { id: '3' }]
}

export default async function ProductPage({ params }) {
  const { id } = await params

  return (
    <div>
      <ProductDetails id={id} />
      <Suspense fallback={<div>Loading price...</div>}>
        <ProductPrice productId={id} />
      </Suspense>
    </div>
  )
}

function ProductDetails({ id }) {
  return <div>Product: {id}</div>
}

async function ProductPrice({ productId }) {
  // Reading cookies defers this component to request time
  const currency = (await cookies()).get('currency')?.value ?? 'USD'

  // Cache the price per product and currency combination
  // All users with the same currency share this cache entry
  const price = await getProductPrice(productId, currency)

  return (
    <div>
      Price: {price} {currency}
    </div>
  )
}

async function getProductPrice(productId, currency) {
  'use cache: remote'
  cacheTag(`product-price-${productId}`)
  cacheLife({ expire: 3600 }) // 1 hour

  // Cached per (productId, currency) - few currencies means high cache utilization
  return db.products.getPrice(productId, currency)
}
```

### Reducing database load

Cache expensive database queries, reducing load on your database. In this example, we don't access `cookies()`, `headers()`, or `searchParams`. If we had a requirement to not include these stats in the static shell, we could use [`connection()`](/docs/app/api-reference/functions/connection) to explicitly defer to request time:

```tsx
// Archivo: app/dashboard/page.tsx
import { Suspense } from 'react'
import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading stats...</div>}>
      <DashboardStats />
    </Suspense>
  )
}

async function DashboardStats() {
  // Defer to request time
  await connection()

  const stats = await getGlobalStats()

  return <StatsDisplay stats={stats} />
}

async function getGlobalStats() {
  'use cache: remote'
  cacheTag('global-stats')
  cacheLife({ expire: 60 }) // 1 minute

  // This expensive database query is cached and shared across all users,
  // reducing load on your database
  const stats = await db.analytics.aggregate({
    total_users: 'count',
    active_sessions: 'count',
    revenue: 'sum',
  })

  return stats
}
```

With this setup, your upstream database sees at most one request per minute, regardless of how many users visit the dashboard.

### API responses in streaming contexts

Cache API responses that are fetched during streaming or after dynamic operations:

```tsx
// Archivo: app/feed/page.tsx
import { Suspense } from 'react'
import { connection } from 'next/server'
import { cacheLife, cacheTag } from 'next/cache'

export default async function FeedPage() {
  return (
    <div>
      <Suspense fallback={<Skeleton />}>
        <FeedItems />
      </Suspense>
    </div>
  )
}

async function FeedItems() {
  // Defer to request time
  await connection()

  const items = await getFeedItems()

  return items.map((item) => <FeedItem key={item.id} item={item} />)
}

async function getFeedItems() {
  'use cache: remote'
  cacheTag('feed-items')
  cacheLife({ expire: 120 }) // 2 minutes

  // This API call is cached, reducing requests to your external service
  const response = await fetch('https://api.example.com/feed')
  return response.json()
}
```

### Computed data after dynamic checks

Cache expensive computations that occur after dynamic security or feature checks:

```tsx
// Archivo: app/reports/page.tsx
import { connection } from 'next/server'
import { cacheLife } from 'next/cache'

export default async function ReportsPage() {
  // Defer to request time (for security check)
  await connection()

  const report = await generateReport()

  return <ReportViewer report={report} />
}

async function generateReport() {
  'use cache: remote'
  cacheLife({ expire: 3600 }) // 1 hour

  // This expensive computation is cached and shared across all authorized users,
  // avoiding repeated calculations
  const data = await db.transactions.findMany()

  return {
    totalRevenue: calculateRevenue(data),
    topProducts: analyzeProducts(data),
    trends: calculateTrends(data),
  }
}
```

### Mixed caching strategies

Combine static, remote, and private caching for optimal performance:

```tsx
// Archivo: app/product/[id]/page.tsx
import { Suspense } from 'react'
import { connection } from 'next/server'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'

// Static product data - prerendered at build time
async function getProduct(id: string) {
  'use cache'
  cacheTag(`product-${id}`)

  // This is cached at build time and shared across all users
  return db.products.find({ where: { id } })
}

// Shared pricing data - cached at runtime in remote handler
async function getProductPrice(id: string) {
  'use cache: remote'
  cacheTag(`product-price-${id}`)
  cacheLife({ expire: 300 }) // 5 minutes

  // This is cached at runtime and shared across all users
  return db.products.getPrice({ where: { id } })
}

// User-specific recommendations - private cache per user
async function getRecommendations(productId: string) {
  'use cache: private'
  cacheLife({ expire: 60 }) // 1 minute

  const sessionId = (await cookies()).get('session-id')?.value

  // This is cached per-user and never shared
  return db.recommendations.findMany({
    where: { productId, sessionId },
  })
}

export default async function ProductPage({ params }) {
  const { id } = await params

  // Static product data
  const product = await getProduct(id)

  return (
    <div>
      <ProductDetails product={product} />

      
      <Suspense fallback={<PriceSkeleton />}>
        <ProductPriceComponent productId={id} />
      </Suspense>

      
      <Suspense fallback={<RecommendationsSkeleton />}>
        <ProductRecommendations productId={id} />
      </Suspense>
    </div>
  )
}

function ProductDetails({ product }) {
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  )
}

async function ProductPriceComponent({ productId }) {
  // Defer to request time
  await connection()

  const price = await getProductPrice(productId)
  return <div>Price: ${price}</div>
}

async function ProductRecommendations({ productId }) {
  const recommendations = await getRecommendations(productId)
  return <RecommendationsList items={recommendations} />
}

function PriceSkeleton() {
  return <div>Loading price...</div>
}

function RecommendationsSkeleton() {
  return <div>Loading recommendations...</div>
}

function RecommendationsList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  )
}
```

> **Good to know**:
>
> - Remote caches are stored in server-side cache handlers and shared across all users
> - `'use cache: remote'` works outside the static shell where [`use cache`](/docs/app/api-reference/directives/use-cache) may not provide server-side cache hits
> - Use [`cacheTag()`](/docs/app/api-reference/functions/cacheTag) and [`revalidateTag()`](/docs/app/api-reference/functions/revalidateTag) to invalidate remote caches on-demand
> - Use [`cacheLife()`](/docs/app/api-reference/functions/cacheLife) to configure cache expiration
> - For user-specific data, use [`'use cache: private'`](/docs/app/api-reference/directives/use-cache-private) instead of `'use cache: remote'`
> - Remote caches reduce origin load by storing computed or fetched data server-side

## Platform Support

| Deployment Option                                                   | Supported |
| ------------------------------------------------------------------- | --------- |
| [Node.js server](/docs/app/getting-started/deploying#nodejs-server) | Yes       |
| [Docker container](/docs/app/getting-started/deploying#docker)      | Yes       |
| [Static export](/docs/app/getting-started/deploying#static-export)  | No        |
| [Adapters](/docs/app/getting-started/deploying#adapters)            | Yes       |

## Version History

| Version   | Changes                                                             |
| --------- | ------------------------------------------------------------------- |
| `v16.0.0` | `"use cache: remote"` is enabled with the Cache Components feature. |


[⬆ Subir al inicio del capítulo](#)

---

<a id="use-cache"></a>

## use cache

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/directives/use-cache](https://nextjs.org/docs/app/api-reference/directives/use-cache)  
> 📂 **Sección:** App > Api Reference > Directives  
> 📝 **Descripción:** *Learn how to use the "use cache" directive to cache data in your Next.js application.*  

---

The `use cache` directive allows you to mark a route, React component, or a function as cacheable. It can be used at the top of a file to indicate that all exports in the file should be cached, or inline at the top of a function or component to cache the return value. Functions and components that use `use cache` must be async.

> **Good to know:**
>
> - To use cookies or headers, read them outside cached scopes and pass values as arguments. This is the preferred pattern.
> - If the in-memory cache isn't sufficient for runtime data, [`'use cache: remote'`](/docs/app/api-reference/directives/use-cache-remote) allows platforms to provide a dedicated cache handler, though it requires a network roundtrip to check the cache and typically incurs platform fees.
> - For compliance requirements or when you can't refactor to pass runtime data as arguments to a `use cache` scope, see [`'use cache: private'`](/docs/app/api-reference/directives/use-cache-private).

## Usage

`use cache` is a Cache Components feature. To enable it, add the [`cacheComponents`](/docs/app/api-reference/config/next-config-js/cacheComponents) option to your `next.config.ts` file:

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

```js
// Archivo: next.config.js switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
}

module.exports = nextConfig
```

Then, add `use cache` at the function, component, or file level. Cached functions and components must be async:

```tsx
// Function level
export async function getData() {
  'use cache'
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return data
}

// Component level
export async function MyComponent() {
  'use cache'
  return <></>
}
```

When used at file level, every exported function becomes a cached function and must also be async:

```tsx
// File level
'use cache'

export default async function Page() {
  // ...
}
```

## How `use cache` works

### Cache keys

A cache entry's key is generated using a serialized version of its inputs, which includes:

1. **Build ID** - Unique per build, changing this invalidates all cache entries. If [`deploymentId`](/docs/app/api-reference/config/next-config-js/deploymentId) is configured, it overrides the build ID for cache key purposes.
2. **Function ID** - A secure hash of the function's location and signature in the codebase
3. **Serializable arguments** - Props (for components) or function arguments
4. **HMR refresh hash** (development only) - Invalidates cache on hot module replacement

When a cached function references variables from outer scopes, those variables are automatically captured and bound as arguments, making them part of the cache key.

```tsx
// Archivo: lib/data.ts
async function Component({ userId }: { userId: string }) {
  const getData = async (filter: string) => {
    'use cache'
    // Cache key includes both userId (from closure) and filter (argument)
    const res = await fetch(
      `https://api.example.com/users/${userId}/data?filter=${filter}`
    )
    return res.json()
  }

  return getData('active')
}
```

In the snippet above, `userId` is captured from the outer scope and `filter` is passed as an argument, so both become part of the `getData` function's cache key. This means different user and filter combinations will have separate cache entries.

> **Good to know:** When a cached function reads [root parameters](/docs/app/api-reference/functions/next-root-params), only the ones it actually reads become part of its cache key.

### Cache output

A cached function produces the same output for the same inputs. The first call with a given set of inputs runs the function body and stores its output. Every later call with the same inputs reuses that output, within a render pass and across requests, for as long as the entry lasts.

Outputs are stored by a [cache handler](/docs/app/api-reference/config/next-config-js/cacheHandlers), [in memory](#runtime-caching-considerations) by default, and last until they [revalidate](#revalidation).

```tsx
// Archivo: lib/orders.ts
import { cacheLife } from 'next/cache'

export async function getOrderSummary(accountId: string) {
  'use cache'
  cacheLife('hours')

  const orders = await getOrders(accountId)
  const totals = await getOrderTotals(accountId)

  return { orders, totals }
}

export async function getOrders(accountId: string) {
  'use cache'
  cacheLife('hours')

  return db.orders.findMany({ where: { accountId } })
}

export async function getOrderTotals(accountId: string) {
  return db.orders.aggregate({ where: { accountId }, _sum: { amount: true } })
}
```

In the example above, each `accountId` has its own entry for `getOrderSummary`, holding the serialized `{ orders, totals }` object it returns. Calls to `getOrders` have their own entries, keyed by the same `accountId`. If an earlier call, through the summary or directly, already filled one, `db.orders.findMany` doesn't run and those orders become part of the summary's output. See [nested caching behavior](/docs/app/api-reference/functions/cacheLife#nested-caching-behavior) for how an inner lifetime affects the entry around it.

Note that `getOrderTotals` is not cached. It is exported so other parts of the application can read fresh totals in an uncached scope. Inside `getOrderSummary`, though, the totals query only runs when that function runs following the `'hours'` lifetime set there.

With [Cache Components](/docs/app/api-reference/config/next-config-js/cacheComponents), prerendering fills the entry and keeps rendering, so this output contributes to the route's [static shell](/docs/app/getting-started/caching#prerendering) and can contribute to its [prefetch](/docs/app/getting-started/caching#prefetching). A cache life too short to store safely leaves a hole that resolves at request time instead. See [prerendering behavior](/docs/app/api-reference/functions/cacheLife#prerendering-behavior) for the thresholds.

## Serialization

Arguments to cached functions and their return values must be serializable.

For a complete reference, see:

- [Serializable arguments](https://react.dev/reference/rsc/use-server#serializable-parameters-and-return-values) - Uses **React Server Components** serialization
- [Serializable return types](https://react.dev/reference/rsc/use-client#serializable-types) - Uses **React Client Components** serialization

> **Good to know:** Arguments and return values use different serialization systems. Server Component serialization (for arguments) is more restrictive than Client Component serialization (for return values). This means you can return JSX elements but cannot accept them as arguments unless using pass-through patterns.

### Supported types

**Arguments:**

- Primitives: `string`, `number`, `boolean`, `null`, `undefined`
- Plain objects: `{ key: value }`
- Arrays: `[1, 2, 3]`
- Dates, Maps, Sets, TypedArrays, ArrayBuffers
- React elements (as pass-through only)

**Return values:**

- Same as arguments, plus JSX elements

### Unsupported types

- Class instances
- Functions (except as pass-through)
- Symbols, WeakMaps, WeakSets
- URL instances

```tsx
// Archivo: app/components/user-card.tsx
// Valid - primitives and plain objects
async function UserCard({
  id,
  config,
}: {
  id: string
  config: { theme: string }
}) {
  'use cache'
  return <div>{id}</div>
}

// Invalid - class instance
async function UserProfile({ user }: { user: UserClass }) {
  'use cache'
  // Error: Cannot serialize class instance
  return <div>{user.name}</div>
}
```

### Pass-through (non-serializable arguments)

You can accept non-serializable values **as long as you don't introspect them**. This enables composition patterns with `children` and Server Actions:

```tsx
// Archivo: app/components/cached-wrapper.tsx
async function CachedWrapper({ children }: { children: ReactNode }) {
  'use cache'
  // Don't read or modify children - just pass it through
  return (
    <div className="wrapper">
      <header>Cached Header</header>
      {children}
    </div>
  )
}

// Usage: children can be dynamic
export default function Page() {
  return (
    <CachedWrapper>
      <DynamicComponent /> 
    </CachedWrapper>
  )
}
```

You can also pass Server Actions through cached components:

```tsx
// Archivo: app/components/cached-form.tsx
async function CachedForm({ action }: { action: () => Promise<void> }) {
  'use cache'
  // Don't call action here - just pass it through
  return <form action={action}></form>
}
```

## Constraints

Cached functions execute in an isolated environment. The following constraints ensure cache behavior remains predictable and secure.

### Request-time APIs

Cached functions and components **cannot** access runtime APIs like `cookies()`, `headers()`, or `searchParams`, and the restriction follows the call stack: a helper the cached function calls that reads one of these fails the same way, with the [`next-request-in-use-cache`](/docs/messages/next-request-in-use-cache) error. On a dynamically rendered route this surfaces when the route runs, so it can pass `next build` and fail under `next start`. Read these values outside the cached scope and pass them as arguments.

### Runtime caching considerations

While `use cache` is designed primarily to include uncached data in the static shell, it can also cache data at runtime using in-memory LRU (Least Recently Used) storage.

With the default in-memory handler, runtime cache behavior depends on your hosting environment:

| Environment     | Runtime Caching Behavior                                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Serverless**  | Cache entries typically don't persist across requests (each request can be a different instance), or during revalidation. Build-time caching works normally. |
| **Self-hosted** | Cache entries persist across requests. Control cache size with [`cacheMaxMemorySize`](/docs/app/api-reference/config/next-config-js/cacheMaxMemorySize).     |

For example, in a serverless environment, a cached function shared by two pages executes on each static shell revalidation, whereas in self-hosted or environments with persistent memory, the cached output is reused if it's still fresh.

If the default in-memory cache isn't enough, consider **[`use cache: remote`](/docs/app/api-reference/directives/use-cache-remote)** which allows platforms to provide a dedicated cache handler (like Redis or KV database). This helps reduce hits against data sources not scaled to your total traffic, though it comes with costs (storage, network latency, platform fees).

> [!NOTE]
> With the default in-memory handler, serverless instances are ephemeral, so entries may not be reused between requests, unlike with `use cache: remote`. Neither caching directive carries over to a new deploy, because the [cache key](#cache-keys) includes the build (or `deploymentId`) ID.
>
> For data that needs to persist across deploys, use [`unstable_cache`](/docs/app/api-reference/functions/unstable_cache) for non-`fetch` functions or the [`fetch`](/docs/app/api-reference/functions/fetch) cache.

Very rarely, for compliance requirements or when you can't refactor your code to pass runtime data as arguments to a `use cache` scope, you might need [`use cache: private`](/docs/app/api-reference/directives/use-cache-private).

### Draft Mode

When [Draft Mode](/docs/app/guides/draft-mode) is enabled, all cached functions and components re-execute on every request, and results are not saved to the cache. This ensures draft content is always fresh without requiring any changes to your caching code.

You can read `isEnabled` from [`draftMode()`](/docs/app/api-reference/functions/draft-mode) inside a `use cache` scope, however, other runtime APIs like `cookies()` and `headers()` are not allowed, even when Draft Mode is active. See [Passing runtime values to cached functions](/docs/app/getting-started/caching#passing-runtime-values-to-cached-functions) for the recommended pattern.

```tsx
// Archivo: app/components/content.tsx
import { draftMode } from 'next/headers'

async function Content() {
  'use cache'

  const { isEnabled } = await draftMode()
  const url = isEnabled
    ? 'https://draft.example.com/content'
    : 'https://production.example.com/content'

  const data = await fetch(url)
  return <article></article>
}
```

Calling `enable()` or `disable()` inside a caching directive scope will also throw an error. Draft Mode can only be toggled in [Route Handlers](/docs/app/api-reference/file-conventions/route) or [Server Actions](/docs/app/getting-started/mutating-data).

### React.cache isolation

[`React.cache`](https://react.dev/reference/react/cache) operates in an isolated scope inside `use cache` boundaries. Values stored via `React.cache` outside a `use cache` function are not visible inside it.

This means you cannot use `React.cache` to pass data into a `use cache` scope:

```tsx
import { cache } from 'react'

const store = cache(() => ({ current: null as string | null }))

function Parent() {
  const shared = store()
  shared.current = 'value from parent'
  return <Child />
}

async function Child() {
  'use cache'
  const shared = store()
  // shared.current is null, not 'value from parent'
  // use cache has its own isolated React.cache scope
  return <div>{shared.current}</div>
}
```

This isolation ensures cached functions have predictable, self-contained behavior. To pass data into a `use cache` scope, use function arguments instead.

## `use cache` at runtime

On the **server**, cache entries are stored in-memory and respect the `revalidate` and `expire` times from your `cacheLife` configuration. You can customize the cache storage by configuring [`cacheHandlers`](/docs/app/api-reference/config/next-config-js/cacheHandlers) in your `next.config.js` file.

On the **client**, content from the server cache is stored in the browser's memory for the duration defined by the `stale` time. The client router enforces a **minimum 30-second stale time**, regardless of configuration.

The `x-nextjs-stale-time` response header communicates cache lifetime from server to client, ensuring coordinated behavior.

## Revalidation

Cached functions revalidate based on the `revalidate` and `expire` times in their `cacheLife` profile, or on-demand through tags. These two approaches are not mutually exclusive and are often paired:

- **[Time-based](#time-based-revalidation)**: refresh automatically after a set duration with [`cacheLife`](/docs/app/api-reference/functions/cacheLife).
- **[On-demand](#on-demand-revalidation)**: invalidate after a mutation with [`cacheTag`](/docs/app/api-reference/functions/cacheTag) and [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) or [`updateTag`](/docs/app/api-reference/functions/updateTag).

For example, a blog post that changes only when its author edits it can use a long `cacheLife` like `max` with a `cacheTag`, then invalidate on demand when the post is saved. A list of recent posts that updates throughout the day can use a shorter profile like `hours` to refresh on its own, without manual invalidation.

### Time-based revalidation

Set an explicit cache lifetime with [`cacheLife`](/docs/app/api-reference/functions/cacheLife) in every `use cache` scope. It makes the cache behavior clear at the call site, instead of depending on the `default` profile or surrounding caches.

```tsx
// Archivo: lib/data.ts
import { cacheLife } from 'next/cache'

async function getData() {
  'use cache'
  cacheLife('hours') // Use built-in 'hours' profile
  const res = await fetch('https://api.example.com/data')
  return res.json()
}
```

If you omit `cacheLife`, the `default` profile applies and the lifetime is no longer explicit at the call site:

- **stale**: 5 minutes (client-side)
- **revalidate**: 15 minutes (server-side)
- **expire**: never expires by time

```tsx
// Archivo: lib/data.ts
async function getData() {
  'use cache'
  // Implicitly uses the 'default' profile
  const res = await fetch('https://api.example.com/data')
  return res.json()
}
```

Nesting a short-lived use cache inside one without an explicit [cacheLife](/docs/app/api-reference/functions/cacheLife) fails the build during prerendering. See [Nested short-lived caches](/docs/app/api-reference/functions/cacheLife#nested-short-lived-caches) for the rule and fix.

### On-demand revalidation

Use [`cacheTag`](/docs/app/api-reference/functions/cacheTag), [`updateTag`](/docs/app/api-reference/functions/updateTag), or [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) for on-demand cache invalidation:

```tsx
// Archivo: lib/data.ts
import { cacheTag } from 'next/cache'

async function getProducts() {
  'use cache'
  cacheTag('products')
  const res = await fetch('https://api.example.com/products')
  return res.json()
}
```

```tsx
// Archivo: app/actions.ts
'use server'

import { updateTag } from 'next/cache'

export async function updateProduct() {
  await db.products.update(...)
  updateTag('products') // Invalidates all 'products' caches
}
```

Both `cacheLife` and `cacheTag` integrate across client and server caching layers, meaning you configure your caching semantics in one place and they apply everywhere.

## Examples

### Caching function output with `use cache`

You can add `use cache` to any asynchronous function, not only to components and routes. You might want to cache a network request, a database query, or a slow computation.

```tsx
// Archivo: app/actions.ts highlight={2} switcher
export async function getData() {
  'use cache'

  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return data
}
```

```jsx
// Archivo: app/actions.js highlight={2} switcher
export async function getData() {
  'use cache'

  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return data
}
```

### Caching a component's output with `use cache`

You can use `use cache` at the component level to cache any fetches or computations performed within that component. The cache entry will be reused as long as the serialized props produce the same value in each instance.

```tsx
// Archivo: app/components/bookings.tsx highlight={2} switcher
export async function Bookings({ type = 'haircut' }: BookingsProps) {
  'use cache'
  async function getBookingsData() {
    const response = await fetch(
      `https://api.example.com/bookings?type=${encodeURIComponent(type)}`
    )
    const data = await response.json()
    return data
  }
  return //...
}

interface BookingsProps {
  type: string
}
```

```jsx
// Archivo: app/components/bookings.js highlight={2} switcher
export async function Bookings({ type = 'haircut' }) {
  'use cache'
  async function getBookingsData() {
    const response = await fetch(
      `https://api.example.com/bookings?type=${encodeURIComponent(type)}`
    )
    const data = await response.json()
    return data
  }
  return //...
}
```

### Interleaving

In React, composition with `children` or slots is a well-known pattern for building flexible components. When using `use cache`, you can continue to compose your UI in this way. Anything included as `children`, or other compositional slots, in the returned JSX will be passed through the cached component without affecting its cache entry.

As long as you don't directly reference any of the JSX slots inside the body of the cacheable function itself, their presence in the returned output won't affect the cache entry.

```tsx
// Archivo: app/page.tsx switcher
export default async function Page() {
  const uncachedData = await getData()
  return (
    // Pass compositional slots as props, e.g. header and children
    <CacheComponent header={<h1>Home</h1>}>
      
      <DynamicComponent data={uncachedData} />
    </CacheComponent>
  )
}

async function CacheComponent({
  header, // header: a compositional slot, injected as a prop
  children, // children: another slot for nested composition
}: {
  header: ReactNode
  children: ReactNode
}) {
  'use cache'
  const res = await fetch('https://api.example.com/cached-data')
  const cachedData = await res.json()
  return (
    <div>
      {header}
      <PrerenderedComponent data={cachedData} />
      {children}
    </div>
  )
}
```

```jsx
// Archivo: app/page.js switcher
export default async function Page() {
  const uncachedData = await getData()
  return (
    // Pass compositional slots as props, e.g. header and children
    <CacheComponent header={<h1>Home</h1>}>
      
      <DynamicComponent data={uncachedData} />
    </CacheComponent>
  )
}

async function CacheComponent({
  header, // header: a compositional slot, injected as a prop
  children, // children: another slot for nested composition
}) {
  'use cache'
  const res = await fetch('https://api.example.com/cached-data')
  const cachedData = await res.json()
  return (
    <div>
      {header}
      <PrerenderedComponent data={cachedData} />
      {children}
    </div>
  )
}
```

You can also pass Server Actions through cached components to Client Components without invoking them inside the cacheable function.

```tsx
// Archivo: app/page.tsx switcher
import ClientComponent from './ClientComponent'

export default async function Page() {
  const performUpdate = async () => {
    'use server'
    // Perform some server-side update
    await db.update(...)
  }

  return <CachedComponent performUpdate={performUpdate} />
}

async function CachedComponent({
  performUpdate,
}: {
  performUpdate: () => Promise<void>
}) {
  'use cache'
  // Do not call performUpdate here
  return <ClientComponent action={performUpdate} />
}
```

```jsx
// Archivo: app/page.js switcher
import ClientComponent from './ClientComponent'

export default async function Page() {
  const performUpdate = async () => {
    'use server'
    // Perform some server-side update
    await db.update(...)
  }

  return <CachedComponent performUpdate={performUpdate} />
}

async function CachedComponent({ performUpdate }) {
  'use cache'
  // Do not call performUpdate here
  return <ClientComponent action={performUpdate} />
}
```

```tsx
// Archivo: app/ClientComponent.tsx switcher
'use client'

export default function ClientComponent({
  action,
}: {
  action: () => Promise<void>
}) {
  return <button onClick={action}>Update</button>
}
```

```jsx
// Archivo: app/ClientComponent.js switcher
'use client'

export default function ClientComponent({ action }) {
  return <button onClick={action}>Update</button>
}
```

### Caching a module's exports with `use cache`

Placing the directive at the top of a file covers every export, instead of repeating it on each one. Every exported function it covers must be async.

```tsx
// Archivo: app/lib/reports.ts
'use cache'

export async function getMonthlyTotals(accountId: string) {
  return db.orders.aggregate({ where: { accountId }, _sum: { amount: true } })
}

export async function getTopProducts() {
  return db.products.findMany({ orderBy: { sales: 'desc' }, take: 10 })
}
```

Framework function exports are covered like any other, so [`generateMetadata`](/docs/app/api-reference/functions/generate-metadata) and [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) must be async in such a file.

> **Good to know**:
>
> - When a cached directive (`use cache`, [`use cache: private`](/docs/app/api-reference/directives/use-cache-private), or [`use cache: remote`](/docs/app/api-reference/directives/use-cache-remote)) is at the top of a file, you can import its exported functions into a Client Component and call them directly; they run on the server and return the result, similar to a [Server Function](/docs/app/glossary#server-function). Prefer calling cached functions on the server and passing results down as props.

### Caching a route segment's output with `use cache`

A `page` or `layout` file is a module too, so a file-level directive there follows the same rules. Each route segment is a separate entry point and is cached independently. To prerender a whole route, add `use cache` to the top of every segment file it renders: the `page`, the `layout`, and any [parallel route](/docs/app/api-reference/file-conventions/parallel-routes) slots.

```tsx
// Archivo: app/layout.tsx switcher
'use cache'

export default async function Layout({ children }: { children: ReactNode }) {
  return <div>{children}</div>
}
```

```jsx
// Archivo: app/layout.js switcher
'use cache'

export default async function Layout({ children }) {
  return <div>{children}</div>
}
```

A cached `layout` does not cache the `children` it renders, since slots pass through without affecting its entry. See [Interleaving](#interleaving).

```tsx
// Archivo: app/page.tsx switcher
'use cache'

async function Users() {
  const res = await fetch('https://api.example.com/users')
  const users = await res.json()
  // loop through users
}

export default async function Page() {
  return (
    <main>
      <Users />
    </main>
  )
}
```

```jsx
// Archivo: app/page.js switcher
'use cache'

async function Users() {
  const res = await fetch('https://api.example.com/users')
  const users = await res.json()
  // loop through users
}

export default async function Page() {
  return (
    <main>
      <Users />
    </main>
  )
}
```

## Troubleshooting

### Debugging cache behavior

#### Verbose logging

Set `NEXT_PRIVATE_DEBUG_CACHE=1` for verbose cache logging:

```bash
NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev
# or for production
NEXT_PRIVATE_DEBUG_CACHE=1 npm run start
```

> **Good to know:** This environment variable also logs ISR and other caching mechanisms. See [Verifying correct production behavior](/docs/app/guides/incremental-static-regeneration#verifying-correct-production-behavior) for more details.

#### Console log replays

In development, console logs from cached functions appear with a `Cache` prefix.

### Build Hangs (Cache Timeout)

If your build hangs, you're accessing Promises that resolve to uncached or runtime data, created outside a `use cache` boundary. The cached function waits for data that can't resolve during the build, causing a timeout after 50 seconds.

When the build timeouts you'll see this error message:

> Error: Filling a cache during prerender timed out, likely because request-specific arguments such as params, searchParams, cookies() or uncached data were used inside "use cache".

Common ways this happens: passing such Promises as props, accessing them via closure, or retrieving them from shared storage (Maps).

> **Good to know:** Directly calling `cookies()` or `headers()` inside `use cache` fails immediately with a [different error](/docs/messages/next-request-in-use-cache), not a timeout.

**Passing runtime data Promises as props:**

```tsx
// Archivo: app/page.tsx
import { cookies } from 'next/headers'
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dynamic />
    </Suspense>
  )
}

async function Dynamic() {
  const cookieStore = cookies()
  return <Cached promise={cookieStore} /> // Build hangs
}

async function Cached({ promise }: { promise: Promise<unknown> }) {
  'use cache'
  const data = await promise // Waits for runtime data during build
  return <p>..</p>
}
```

Await the `cookies` store in the `Dynamic` component, and pass a cookie value to the `Cached` component.

**Shared deduplication storage:**

```tsx
// Archivo: app/page.tsx
// Problem: Map stores dynamic Promises, accessed by cached code
import { Suspense } from 'react'

const cache = new Map<string, Promise<string>>()

export default function Page() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <Dynamic id="data" />
      </Suspense>
      <Cached id="data" />
    </>
  )
}

async function Dynamic({ id }: { id: string }) {
  // Stores dynamic Promise in shared Map
  cache.set(
    id,
    fetch(`https://api.example.com/${id}`).then((r) => r.text())
  )
  return <p>Dynamic</p>
}

async function Cached({ id }: { id: string }) {
  'use cache'
  return <p>{await cache.get(id)}</p> // Build hangs - retrieves dynamic Promise
}
```

Use Next.js's built-in `fetch()` deduplication or use separate Maps for cached and uncached contexts.

## Platform Support

| Deployment Option                                                   | Supported         |
| ------------------------------------------------------------------- | ----------------- |
| [Node.js server](/docs/app/getting-started/deploying#nodejs-server) | Yes               |
| [Docker container](/docs/app/getting-started/deploying#docker)      | Yes               |
| [Static export](/docs/app/getting-started/deploying#static-export)  | No                |
| [Adapters](/docs/app/getting-started/deploying#adapters)            | Platform-specific |

Learn how to [configure caching](/docs/app/guides/self-hosting#caching-and-isr) when self-hosting Next.js.

## Version History

| Version   | Changes                                                     |
| --------- | ----------------------------------------------------------- |
| `v16.0.0` | `"use cache"` is enabled with the Cache Components feature. |
| `v15.0.0` | `"use cache"` is introduced as an experimental feature.     |


[⬆ Subir al inicio del capítulo](#)

---

<a id="use-client"></a>

## use client

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/directives/use-client](https://nextjs.org/docs/app/api-reference/directives/use-client)  
> 📂 **Sección:** App > Api Reference > Directives  
> 📝 **Descripción:** *Learn how to use the use client directive to render a component on the client.*  

---

The `'use client'` directive declares an entry point for the components to be rendered on the **client side** and should be used when creating interactive user interfaces (UI) that require client-side JavaScript capabilities, such as state management, event handling, and access to browser APIs. This is a React feature.

> **Good to know:**
>
> You do not need to add the `'use client'` directive to every file that contains Client Components. You only need to add it to the files whose components you want to render directly within Server Components. The `'use client'` directive defines the [server and client boundary](/docs/app/guides/server-and-client-boundary), and the components exported from such a file serve as entry points to the client.

## Usage

To declare an entry point for the Client Components, add the `'use client'` directive **at the top of the file**, before any imports:

```tsx
// Archivo: app/components/counter.tsx highlight={1} switcher
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

```jsx
// Archivo: app/components/counter.js highlight={1} switcher
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}
```

When using the `'use client'` directive, the props of the Client Components must be [serializable](https://react.dev/reference/rsc/use-client#serializable-types). This means the props need to be in a format that React can serialize when sending data from the server to the client.

```tsx
// Archivo: app/components/counter.tsx highlight={4} switcher
'use client'

export default function Counter({
  onClick /* ❌ Function is not serializable */,
}) {
  return (
    <div>
      <button onClick={onClick}>Increment</button>
    </div>
  )
}
```

```jsx
// Archivo: app/components/counter.js highlight={4} switcher
'use client'

export default function Counter({
  onClick /* ❌ Function is not serializable */,
}) {
  return (
    <div>
      <button onClick={onClick}>Increment</button>
    </div>
  )
}
```

## Nesting Client Components within Server Components

Combining Server and Client Components allows you to build applications that are both performant and interactive:

1. **Server Components**: Use for static content, data fetching, and SEO-friendly elements.
2. **Client Components**: Use for interactive elements that require state, effects, or browser APIs.
3. **Component composition**: Nest Client Components within Server Components as needed for a clear separation of server and client logic.

In the following example:

- `Header` is a Server Component handling static content.
- `Counter` is a Client Component enabling interactivity within the page.

```tsx
// Archivo: app/page.tsx highlight={2,8} switcher
import Header from './header'
import Counter from './counter' // This is a Client Component

export default function Page() {
  return (
    <div>
      <Header />
      <Counter />
    </div>
  )
}
```

```jsx
// Archivo: app/page.js highlight={2,8} switcher
import Header from './header'
import Counter from './counter' // This is a Client Component

export default function Page() {
  return (
    <div>
      <Header />
      <Counter />
    </div>
  )
}
```

## Reference

See the [React documentation](https://react.dev/reference/rsc/use-client) for more information on `'use client'`.


[⬆ Subir al inicio del capítulo](#)

---

<a id="use-server"></a>

## use server

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/directives/use-server](https://nextjs.org/docs/app/api-reference/directives/use-server)  
> 📂 **Sección:** App > Api Reference > Directives  
> 📝 **Descripción:** *Learn how to use the use server directive to execute code on the server.*  

---

The `use server` directive designates a function or file to be executed on the **server side**. It can be used at the top of a file to indicate that all functions in the file are server-side, or inline at the top of a function to mark the function as a [Server Function](https://19.react.dev/reference/rsc/server-functions). This is a React feature.

For Next.js-specific Server Action behaviors (response model, security, configuration, deployment), see [Server Actions and Mutations](/docs/app/guides/server-actions).

## Using `use server` at the top of a file

The following example shows a file with a `use server` directive at the top. All functions in the file are executed on the server.

```tsx
// Archivo: app/actions.ts highlight={1} switcher
'use server'
import { db } from '@/lib/db' // Your database client
import { auth } from '@/lib/auth'

export async function createUser(data: { name: string; email: string }) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.create({ data })
  return { id: user.id, name: user.name }
}
```

```jsx
// Archivo: app/actions.js highlight={1} switcher
'use server'
import { db } from '@/lib/db' // Your database client
import { auth } from '@/lib/auth'

export async function createUser(data) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.create({ data })
  return { id: user.id, name: user.name }
}
```

### Using Server Functions in a Client Component

To use Server Functions in Client Components you need to create your Server Functions in a dedicated file using the `use server` directive at the top of the file. These Server Functions can then be imported into Client and Server Components and executed.

Assuming you have a `fetchUsers` Server Function in `actions.ts`:

```tsx
// Archivo: app/actions.ts highlight={1} switcher
'use server'
import { db } from '@/lib/db' // Your database client
import { auth } from '@/lib/auth'

export async function fetchUsers() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const users = await db.user.findMany({
    select: { id: true, name: true, email: true },
  })
  return users
}
```

```jsx
// Archivo: app/actions.js highlight={1} switcher
'use server'
import { db } from '@/lib/db' // Your database client
import { auth } from '@/lib/auth'

export async function fetchUsers() {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const users = await db.user.findMany({
    select: { id: true, name: true, email: true },
  })
  return users
}
```

Then you can import the `fetchUsers` Server Function into a Client Component and execute it on the client-side.

```tsx
// Archivo: app/components/my-button.tsx highlight={1,2,5} switcher
'use client'
import { fetchUsers } from '../actions'

export default function MyButton() {
  return <button onClick={() => fetchUsers()}>Fetch Users</button>
}
```

```jsx
// Archivo: app/components/my-button.js highlight={1,2,5} switcher
'use client'
import { fetchUsers } from '../actions'

export default function MyButton() {
  return <button onClick={() => fetchUsers()}>Fetch Users</button>
}
```

## Using `use server` inline

In the following example, `use server` is used inline at the top of a function to mark it as a [Server Function](https://19.react.dev/reference/rsc/server-functions):

```tsx
// Archivo: app/posts/[id]/page.tsx switcher highlight={9}
import { EditPost } from './edit-post'
import { revalidatePath } from 'next/cache'

export default async function PostPage({ params }: PageProps<'/posts/[id]'>) {
  const { id } = await params
  const post = await getPost(id)

  async function updatePost(formData: FormData) {
    'use server'
    // Verify auth before saving (e.g. inside savePost)
    await savePost(id, formData)
    revalidatePath(`/posts/${id}`)
  }

  return <EditPost updatePostAction={updatePost} post={post} />
}
```

```jsx
// Archivo: app/posts/[id]/page.js switcher highlight={9}
import { EditPost } from './edit-post'
import { revalidatePath } from 'next/cache'

export default async function PostPage({ params }) {
  const { id } = await params
  const post = await getPost(id)

  async function updatePost(formData) {
    'use server'
    // Verify auth before saving (e.g. inside savePost)
    await savePost(id, formData)
    revalidatePath(`/posts/${id}`)
  }

  return <EditPost updatePostAction={updatePost} post={post} />
}
```

## Security considerations

Design your data access functions as secure primitives: validate inputs, check authentication and authorization, and constrain return types to only what the caller needs. When Server Functions delegate to a [Data Access Layer](/docs/app/guides/data-security#using-a-data-access-layer-for-mutations), these guarantees live in one place and apply consistently.

### Authentication and authorization

Always authenticate and authorize users before performing sensitive server-side operations. Read authentication from cookies or headers rather than accepting tokens as function parameters.

```tsx
// Archivo: app/actions.ts highlight={1,7,8,9,10} switcher
'use server'

import { db } from '@/lib/db' // Your database client
import { auth } from '@/lib/auth' // Your authentication library

export async function createUser(data: { name: string; email: string }) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  const newUser = await db.user.create({ data })
  return { id: newUser.id, name: newUser.name }
}
```

```jsx
// Archivo: app/actions.js highlight={1,7,8,9,10} switcher
'use server'

import { db } from '@/lib/db' // Your database client
import { auth } from '@/lib/auth' // Your authentication library

export async function createUser(data) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  const newUser = await db.user.create({ data })
  return { id: newUser.id, name: newUser.name }
}
```

### Return values

Server Function return values are serialized and sent to the client. Only return data the UI needs, not raw database records. See the [Data Security guide](/docs/app/guides/data-security#controlling-return-values) for more details.

## Reference

See the [React documentation](https://react.dev/reference/rsc/use-server) for more information on `use server`.


[⬆ Subir al inicio del capítulo](#)

---

