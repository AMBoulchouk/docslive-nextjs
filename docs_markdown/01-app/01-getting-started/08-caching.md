# Caching

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/caching](https://nextjs.org/docs/app/getting-started/caching)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to cache data and UI in Next.js*  

---

> This page covers caching with [Cache Components](/docs/app/api-reference/config/next-config-js/cacheComponents), enabled by setting [`cacheComponents: true`](/docs/app/api-reference/config/next-config-js/cacheComponents) in your `next.config.ts` file. If you're not using Cache Components, see the [Caching and Revalidating (Previous Model)](/docs/app/guides/caching-without-cache-components) guide.

Caching is a technique for storing the result of data fetching and other computations so that future requests for the same data can be served faster, without doing the work again.

## Enabling Cache Components

You can enable Cache Components by adding the [`cacheComponents`](/docs/app/api-reference/config/next-config-js/cacheComponents) option to your Next config file:

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

> **Good to know:** When Cache Components is enabled, `GET` Route Handlers follow the same prerendering model as pages. See [Route Handlers with Cache Components](/docs/app/getting-started/route-handlers#with-cache-components) for details.

## Usage

The [`use cache`](/docs/app/api-reference/directives/use-cache) directive caches the return value of async functions and components. You can apply it at two levels:

- **Data-level**: Cache a function that fetches or computes data (e.g., `getProducts()`, `getUser(id)`)
- **UI-level**: Cache an entire component or page (e.g., `async function BlogPosts()`)

A cache directive gives a result a lifetime, information Next.js uses to apply rendering optimizations. See [Prerendering](#prerendering) for how cached results become part of the static shell and may be included in a [prefetch](#prefetching).

> **Good to know:** We recommend pairing every cache directive with a [`cacheLife`](/docs/app/api-reference/functions/cacheLife). Without one, the implicit `default` profile applies.

Arguments and any values captured from parent scopes automatically become part of the [cache key](/docs/app/api-reference/directives/use-cache#cache-keys), which means different inputs will produce separate cache entries. See [cache output](/docs/app/api-reference/directives/use-cache#cache-output) for what an entry holds, and [serialization requirements and constraints](/docs/app/api-reference/directives/use-cache#constraints) for details on what can be cached and how arguments work.

### Data-level caching

To cache an asynchronous function that fetches data, add the `use cache` directive at the top of the function body:

```tsx
// Archivo: app/lib/data.ts highlight={1,4,5}
import { cacheLife } from 'next/cache'

export async function getUsers() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM users')
}
```

Data-level caching is useful when the same data is used across multiple components, or when you want to cache the data independently from the UI.

### UI-level caching

To cache an entire component, page, or layout, add the `use cache` directive at the top of the component or page body:

```tsx
// Archivo: app/page.tsx highlight={1,4,5}
import { cacheLife } from 'next/cache'

export default async function Page() {
  'use cache'
  cacheLife('hours')

  const users = await db.query('SELECT * FROM users')

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

> If you add "`use cache`" at the top of a file, all exported functions in the file will be cached.

### Streaming uncached data

For components that fetch data from an asynchronous source such as an API, a database, or any other async operation, and require fresh data on every request, do not use `"use cache"`.

Instead, wrap the component in [```<Suspense>``
    </>
  )
}
```

For example, `<p>Loading posts...</p>` is included in the static shell, and the posts stream in at request time.

Without a ```<Suspense>``', highlight: true },
    ]}
  />


> **Good to know:** Each fix card links to a detailed walkthrough with patterns, code samples, and trade-offs. Click a card to dive in.


```<Suspense>``
    </>
  )
}
```

A runtime API access without ```<Suspense>``', highlight: true },
    ]}
  />


Runtime-dependent data can still be given a cache lifetime with [`"use cache: private"`](/docs/app/api-reference/directives/use-cache-private), another variant that ships with Cache Components. It gives a lifetime to a function that reads cookies, headers, or `searchParams` directly, so it can be included in a [prefetch](#prefetching).

The following section shows an alternative to `use cache: private`: extracting a runtime value and passing it to a shared cached function.

### Passing runtime values to cached functions

You can extract values from runtime APIs and pass them as arguments to cached functions:

```tsx
// Archivo: app/profile/page.tsx
import { cookies } from 'next/headers'
import { Suspense } from 'react'

export default function Page() {
  return (
    ``<Suspense>``
  )
}

// Component (not cached) reads runtime data
async function ProfileContent() {
  const session = (await cookies()).get('session')?.value
  return <CachedContent sessionId={session} />
}

// Cached component receives extracted value as a prop
async function CachedContent({ sessionId }: { sessionId: string }) {
  'use cache'
  // sessionId becomes part of the cache key
  const data = await fetchUserData(sessionId)
  return <div>{data}</div>
}
```

At request time, `<CachedContent />` executes if no matching cache entry is found, and stores the result for future requests with the same `sessionId`.

> **Good to know:** Because `<CachedContent />` is gated behind request data, it isn't added to the prerendered static shell. At runtime it's cached [in-memory](/docs/app/api-reference/directives/use-cache#runtime-caching-considerations) by default, which doesn't persist across serverless requests, so it may re-evaluate on each request. Reach for [`'use cache: remote'`](/docs/app/api-reference/directives/use-cache-remote) for durable, shared caching.

With this pattern, [prefetching](#prefetching) can prerender `<CachedContent />` with the user's actual session during a client transition and have the result ready before the click. This works even when server-side entries rarely survive between requests, because the lifetime you assign is what lets the result join the prefetch, where the client treats it as fresh for its [`cacheLife`](/docs/app/api-reference/functions/cacheLife) `stale` window.

## Static, cached, and streaming

Here's a complete example showing static content, cached dynamic content, and streaming dynamic content working together on a single page:

```tsx
// Archivo: app/blog/page.tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife, cacheTag } from 'next/cache'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <>
      
      <header>
        <h1>Our Blog</h1>
        <nav>
          [Home](/) | [About](/about)
        </nav>
      </header>

      
      <BlogPosts />

      
      ``<Suspense>``
    </>
  )
}

type Post = { id: string; title: string; author: string; date: string }

// Everyone sees the same blog posts (revalidated every hour)
async function BlogPosts() {
  'use cache'
  cacheLife('hours')
  cacheTag('posts')

  const res = await fetch('https://api.vercel.app/blog')
  const posts: Post[] = await res.json()

  return (
    <section>
      <h2>Latest Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>
              By {post.author} on {post.date}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}

// UI that depends on a value stored in cookies
async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value || 'light'
  const favoriteCategory = (await cookies()).get('category')?.value

  return (
    <aside>
      <p>Your theme: {theme}</p>
      {favoriteCategory && <p>Favorite category: {favoriteCategory}</p>}
    </aside>
  )
}
```

During prerendering, the header (static) and blog posts (cached with `use cache`) become part of the static shell, along with the fallback UI for user preferences. The UI preferences stored in cookies stream in at request time.

Reading `cookies()` here doesn't opt-in the whole route into dynamic rendering, the way the previous rendering model did. The Suspense boundary provides fallback UI where the runtime access streams, while static and cached content still ship in the initial HTML.

Just as ```<Suspense>``
  )
}
```

Alternatively, you can **cache the result** so all users see the same value until revalidation:

```tsx
// Archivo: page.tsx
export default async function Page() {
  'use cache'
  const buildId = crypto.randomUUID()
  return <p>Build ID: {buildId}</p>
}
```

You don't need to memorize which operations behave this way. The dev overlay surfaces a **blocking-prerender-random**, **blocking-prerender-current-time**, or **blocking-prerender-crypto** insight (depending on the call) with these fixes:


  
> 💡 **Solución recomendada (dynamic):** Generate on every request — [Ver guía de solución](https://nextjs.org/docs/messages/blocking-prerender-random#generate-on-every-request)
' },
    ]}
  />
  
> 💡 **Solución recomendada (cache):** Cache the value — [Ver guía de solución](https://nextjs.org/docs/messages/blocking-prerender-random#cache-the-random-value)

## Predictable values

Unlike random values and timestamps, which can vary between renders, module imports, synchronous I/O, and pure computations produce the same result every time they run. Components using only these operations are prerendered automatically, and their output becomes part of the static HTML at build time.

```tsx
// Archivo: page.tsx
import fs from 'node:fs'

export default async function Page() {
  const constants = await import('./constants.json')
  const content = fs.readFileSync('./config.json', 'utf-8')
  const items = JSON.parse(content).items ?? []

  return (
    <div>
      <h1>{constants.appName}</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.value}</li>
        ))}
      </ul>
    </div>
  )
}
```

> **Good to know:** This includes queries to embedded databases with synchronous APIs, such as `better-sqlite3` or Node.js's built-in [`node:sqlite`](https://nodejs.org/api/sqlite.html). If you need per-request data from a synchronous source, call [`connection()`](/docs/app/api-reference/functions/connection) before the query.

Some asynchronous APIs read local resources that don't depend on the incoming request, such as fonts or configuration files. When those resources are expected to be the same for every request, read them once at module scope instead of during rendering

If the data should instead be computed during rendering and reused across requests, wrap the read in [`use cache`](/docs/app/api-reference/directives/use-cache). If the data depends on the incoming request or is expected to change over time, read it during request-time rendering.

```tsx
// Archivo: page.tsx
import { readFile } from 'node:fs/promises'

const content = await readFile('./config.json', 'utf-8')
const items = JSON.parse(content).items ?? []

export default function Page() {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.value}</li>
      ))}
    </ul>
  )
}
```

In this example, the configuration file is expected to be the same for every request, so it is read once at module scope. Calling `await readFile()` inside the component would be treated as uncached data that must be either accessed within `use cache` or behind a ```<Suspense>``
      {children}
    </div>
  )
}

function SlugHeading({ slug }: { slug: string }) {
  return <h1>{slug}</h1>
}
```

Now `<Sidebar />`, `{children}`, and the Suspense fallback are all part of the static shell. Only `SlugHeading` streams in at request time. You can also pass the entire `params` promise and await it in the child component.

The same principle applies to `cookies()`, `headers()`, `searchParams`, and data fetches. See [Reusing data with `React.cache`](/docs/app/getting-started/fetching-data#reusing-data-with-reactcache) for a related pattern.

### Instant navigation

Cache Components shipped in 16.0.0 with verification that direct visits to a route produce a static shell. Client navigations are different: a ```<Suspense>``
  )
}

async function Results({
  searchParams,
}: Pick<PageProps<'/search'>, 'searchParams'>) {
  const { q } = await searchParams
  const results = await search(q)
  return (
    <ul>
      {results.map((result) => (
        <li key={result.id}>{result.title}</li>
      ))}
    </ul>
  )
}

async function search(query: string | string[] | undefined) {
  'use cache'
  return db.search(query)
}
```

On a direct visit, `<Results>` streams in behind the fallback.

When a [`<Link>`](/docs/app/api-reference/components/link) to `/search?q=shoes` is prefetched, the framework resolves `searchParams` from the link's URL, so the cached `search` result is included in the runtime prerender before the click. The browser then reuses it until its [`stale`](/docs/app/api-reference/functions/cacheLife#stale) time passes or the `searchParams` change.

See [Adopting Partial Prefetching](/docs/app/guides/adopting-partial-prefetching) to understand how `<Link>` prefetching behaves and how to adopt it.

See the [Optimizing prefetching guide](/docs/app/guides/optimizing-prefetching) for full patterns and the [`prefetch` reference](/docs/app/api-reference/file-conventions/route-segment-config/prefetch) for all modes.

## Where cached content is stored

A cached function's output is serialized into an **RSC payload**, at build time or at runtime. This payload is what everything else works from. Next.js renders it into HTML, keeps it in a server or remote store, or sends it to the browser, and [`cacheLife`](/docs/app/api-reference/functions/cacheLife) sets how long each copy stays fresh:

- **Prerendered HTML.** The payload is rendered to HTML and stored on disk when self-hosting, or in your platform's durable storage behind a CDN. That HTML is the [static shell](#prerendering) at build time and the concrete page after an [ISR](#incremental-static-regeneration) upgrade, with [`revalidate`](/docs/app/api-reference/functions/cacheLife#revalidate) and [`expire`](/docs/app/api-reference/functions/cacheLife#expire) controlling when it's rebuilt.
- **Shared store.** By default the result stays in a per-instance, in-memory store that is ephemeral on serverless. [`use cache: remote`](/docs/app/api-reference/directives/use-cache-remote) moves it to a durable [cache handler](/docs/app/api-reference/config/next-config-js/cacheHandlers) shared across instances, a network roundtrip that pays off only at a **high hit rate**.
- **Browser.** The payload is included in the RSC sent for a client navigation or [prefetch](#prefetching), where the browser keeps it fresh for its [`stale`](/docs/app/api-reference/functions/cacheLife#stale) window. [`use cache: private`](/docs/app/api-reference/directives/use-cache-private) results live only here.

> **Good to know:** An [App Shell](/docs/app/glossary#app-shell) that reads `cookies()` or `headers()` is session-specific, cached per session on the client rather than in the shared server cache.

All of these stores are scoped to a single deployment. A new deploy starts fresh, new prerenders are built, and `use cache` entries don't carry over, even durable [`remote`](/docs/app/api-reference/directives/use-cache-remote) ones, because the [cache key](/docs/app/api-reference/directives/use-cache#cache-keys) includes the build id. See [Runtime caching considerations](/docs/app/api-reference/directives/use-cache#runtime-caching-considerations) for per-environment behavior and [Self-hosting](/docs/app/guides/self-hosting#caching-and-isr) for configuring the server cache.

## Incremental Static Regeneration

In a route with dynamic param segments, [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) prerenders the URLs you list at build time. Any other URL is served the [App Shell](/docs/app/glossary#app-shell) instantly, then upgraded in the background with its now-known params and cached for the next visitor.

See [ISR with Cache Components](/docs/app/guides/incremental-static-regeneration-cache-components) for the full walkthrough.

## Bots and crawlers

Browsers receive the static shell instantly. Bots and crawlers are detected by their user agent and handled differently: because they need a complete document, Next.js skips the shell and renders the entire page dynamically at request time, then sends the finished HTML once the render completes.

Because the shell is re-rendered instead of reused, work that completed during prerendering now runs at request time for a bot. If part of your shell depends on inputs that only exist while prerendering, such as build-time data or values that are not reachable in the request-time environment, a page that loads for a person can fail to render for a crawler. Make sure the data your shell relies on is also available at request time. See [Bots and crawlers](/docs/app/guides/streaming#bots-and-crawlers) in the Streaming guide for more details.
