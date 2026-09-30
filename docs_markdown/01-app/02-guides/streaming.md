# Streaming

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/streaming](https://nextjs.org/docs/app/guides/streaming)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how streaming works in Next.js and how to use it to progressively render UI as data becomes available.*  

---

## What is streaming?

In traditional server-side rendering, the server produces the full HTML document before sending anything. A single slow database query or API call can block the entire page. Streaming changes this by using [chunked transfer encoding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding) to send parts of the response as they become ready. The browser starts rendering HTML while the server is still generating the rest.

This is especially impactful for pages that combine fast static content (headers, navigation, layout) with slower dynamic content (personalized data, analytics, recommendations). The static parts can be prerendered and served from a CDN, painting instantly, while the dynamic parts stream in from the server as they become ready.

React's server renderer produces HTML in chunks aligned with ```<Suspense>``
        ``<Suspense>``
      </div>
      ``<Suspense>``
    </div>
  )
}
```

```jsx
// Archivo: app/dashboard/page.js switcher
import { Suspense } from 'react'
import { Revenue } from './revenue'
import { RecentOrders } from './recent-orders'
import { Recommendations } from './recommendations'

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        ``<Suspense>``
        ``<Suspense>``
      </div>
      ``<Suspense>``
    </div>
  )
}
```

In this example, if `Revenue` resolves in 200ms, `RecentOrders` in 1s, and `Recommendations` in 3s, the user sees each section appear as soon as its data is ready.

### Nested boundaries for progressive detail

You can nest ```<Suspense>``
      `<Suspense>`
    </div>
  )
}
```

```jsx
// Archivo: app/product/[id]/page.js switcher
import { Suspense } from 'react'
import { ProductDetails } from './product-details'
import { Reviews } from './reviews'

export async function generateStaticParams() {
  const products = await getTopProducts()
  return products.map((product) => ({ id: product.id }))
}

export default async function ProductPage({ params }) {
  const { id } = await params

  return (
    <div>
      <h1>Product</h1>
      ``<Suspense>``
      `<Suspense>`
    </div>
  )
}
```

The outer boundary shows "Loading product details..." until `ProductDetails` resolves. Once it does, the inner boundary becomes visible, showing "Loading reviews..." until `Reviews` resolves. This creates a progressive reveal.

### Push dynamic access down

The key to maximizing what streams instantly is to defer dynamic data access to the component that actually needs it. This applies to `params`, `searchParams`, `cookies()`, `headers()`, and data fetches. If you `await` any of these at the top of a layout or page, everything below that point becomes dynamic and cannot be prerendered as part of the static shell.

Instead, pass the promise down and let the consuming component resolve it inside a ```<Suspense>``
      </Nav>
      {children}
    </div>
  )
}
```

```jsx
// Archivo: app/dashboard/layout.js switcher
import { Suspense } from 'react'
import { Nav } from './nav'
import { UserMenu } from './user-menu'
import { cookies } from 'next/headers'

export default function DashboardLayout({ children }) {
  const cookieStore = cookies() // Start the work, but don't await

  return (
    <div>
      <Nav>
        ``<Suspense>``
      </Nav>
      {children}
    </div>
  )
}
```

In this example, `<Nav>` and `{children}` render as part of the static shell because nothing in the layout awaits. Only `<UserMenu>` suspends when it resolves the cookie promise. If the layout had called `await cookies()` at the top instead, the entire layout and all its children would be blocked from prerendering.

The same principle applies to `params` and `searchParams`. Rather than destructuring them at the page level, pass the promise to the component that needs the value:

```tsx
// Archivo: app/shop/[category]/page.tsx switcher
import { Suspense } from 'react'
import { Hero } from './hero'
import { ProductGrid } from './product-grid'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ category: c.slug }))
}

export default function ShopPage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  return (
    <div>
      <Hero />
      ``<Suspense>``
    </div>
  )
}
```

```jsx
// Archivo: app/shop/[category]/page.js switcher
import { Suspense } from 'react'
import { Hero } from './hero'
import { ProductGrid } from './product-grid'

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ category: c.slug }))
}

export default function ShopPage({ params }) {
  return (
    <div>
      <Hero />
      ``<Suspense>``
    </div>
  )
}
```

`<Hero />` paints as part of the static shell. `<ProductGrid>` resolves `params` when it needs the category, suspending only within its boundary.

You can also unwrap the promise inline with `.then()`, so the child component receives a plain value instead of a promise:

```tsx
// Archivo: app/shop/[category]/page.tsx switcher
``<Suspense>``
```

```jsx
// Archivo: app/shop/[category]/page.js switcher
``<Suspense>``
```

This keeps `ProductGrid` simple (it takes a `string`, not a `Promise`) while still deferring the `params` access to inside the Suspense boundary.

### When to use `loading.js` vs ```<Suspense>``
  )
}
```

```jsx
// Archivo: app/dashboard/page.js switcher
import { Suspense } from 'react'
import { StatsChart } from './stats-chart'

async function getStats() {
  const res = await fetch('https://api.example.com/stats')
  return res.json()
}

export default function Dashboard() {
  // Start the fetch during server render, don't await it
  const statsPromise = getStats()

  return (
    ``<Suspense>``
  )
}
```

```tsx
// Archivo: app/dashboard/stats-chart.tsx switcher
'use client'

import { use } from 'react'

type Stats = { revenue: number; orders: number }

export function StatsChart({ dataPromise }: { dataPromise: Promise<Stats> }) {
  const stats = use(dataPromise)

  return <div></div>
}
```

```jsx
// Archivo: app/dashboard/stats-chart.js switcher
'use client'

import { use } from 'react'

export function StatsChart({ dataPromise }) {
  const stats = use(dataPromise)

  return <div></div>
}
```

The fallback is sent immediately with the static shell. When the promise resolves, React streams the completed HTML into the page.

### Sharing a promise across the tree

When multiple components need the same data, start the fetch once and pass the promise through a context provider so any component in the subtree can resolve it with `use()`:

```tsx
// Archivo: app/layout.tsx
import { getUser } from '@/lib/data'
// Stores the promise in React context for the subtree
import { UserProvider } from './user-provider'

export default function Layout({ children }: { children: React.ReactNode }) {
  const userPromise = getUser()

  return <UserProvider userPromise={userPromise}>{children}</UserProvider>
}
```

See [Using React's `use` within a Context Provider](/docs/app/guides/single-page-applications#using-reacts-use-within-a-context-provider) for the full pattern.

## Streaming in Route Handlers

The patterns above rely on React and Suspense to stream UI. Outside of React rendering, [Route Handlers](/docs/app/api-reference/file-conventions/route) can stream raw responses using the Web Streams API. This is useful for Server-Sent Events, large file generation, or any response where you want data to arrive progressively:

```ts
// Archivo: app/api/stream/route.ts switcher
export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(encoder.encode(`Chunk ${i + 1}\n`))
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
```

```js
// Archivo: app/api/stream/route.js switcher
export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      for (let i = 0; i < 10; i++) {
        controller.enqueue(encoder.encode(`Chunk ${i + 1}\n`))
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
```

Visit this route directly in the browser or with `curl` to see chunks arrive one at a time:

```bash
curl http://localhost:3000/api/stream
```

You can also stream files without loading them entirely into memory. Use `FileHandle.readableWebStream()` to get a Web `ReadableStream` directly from a file:

```ts
// Archivo: app/api/download/route.ts switcher
import { open } from 'node:fs/promises'

export async function GET() {
  const file = await open('/path/to/large-file.csv')

  return new Response(file.readableWebStream(), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="data.csv"',
    },
  })
}
```

```js
// Archivo: app/api/download/route.js switcher
import { open } from 'node:fs/promises'

export async function GET() {
  const file = await open('/path/to/large-file.csv')

  return new Response(file.readableWebStream(), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="data.csv"',
    },
  })
}
```

See the [Route Handler API reference](/docs/app/api-reference/file-conventions/route) for more details on building streaming endpoints.

## Streaming and Web Vitals

[Web Vitals](https://web.dev/articles/vitals) are the metrics Google uses to measure user experience. Streaming directly affects several of them.

### TTFB and FCP

Without streaming, the server waits for all data before sending any HTML, so TTFB equals the slowest query. With streaming, the server sends the static shell as soon as it's ready. TTFB drops to the time it takes to render your layouts and fallbacks. The browser paints the static shell immediately, so FCP is decoupled from your data fetching time.

### LCP (Largest Contentful Paint)

If your LCP element (a hero image, a main heading, a product photo) is inside a Suspense boundary, it can't paint until that boundary's content is swapped in. The element then depends on the work the server does to render it, not on your initial server response time. Revealing it costs something on the client too, because React streams a small inline script alongside the boundary's HTML and the content only appears once that script runs.

Data fetching is not the only reason a boundary delays your LCP element. React also holds back a large boundary, because sending its HTML takes time. See [what activates a Suspense boundary](https://react.dev/reference/react/Suspense#what-activates-a-suspense-boundary).

> **Good to know:** As a rule of thumb, if there's a Suspense boundary, React might use it. Under a slow network or a busy CPU, concurrent rendering can fall back to it even when you didn't expect it. Adding a boundary means accepting that, so don't add one you don't need.

To keep LCP fast:

- Keep LCP elements **outside** or **above** Suspense boundaries so they render as part of the static shell.
- Use the [`preload`](/docs/app/api-reference/components/image#preload) prop on `next/image` for LCP images. This injects a `<link rel="preload">` into the `<head>`, so the browser starts fetching the image from the very first chunk, before the `<img>` tag even appears in the HTML. It controls when the image is fetched, not when it paints. An image inside a boundary still waits for the swap.
- For non-image LCP elements (text, headings), render them outside Suspense boundaries.

### CLS (Cumulative Layout Shift)

When a Suspense fallback is replaced by the resolved content, the browser reflows the page. If the fallback and the resolved content are different sizes, the surrounding layout shifts. To minimize CLS:

- Design skeleton fallbacks that **match the dimensions** of the content they represent. A skeleton with the same height and width as the final card grid prevents shifts.
- Use fixed or min-height containers around Suspense boundaries so the space is reserved before content arrives.

### INP (Interaction to Next Paint)

Streaming enables [selective hydration](https://react.dev/reference/react-dom/client/hydrateRoot): React hydrates components independently as they stream in, and prioritizes hydrating whatever the user is interacting with. Each ```<Suspense>``
  )
}
```

```jsx
// Archivo: app/post/[slug]/page.js switcher
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { PostContent } from './post-content'

export async function generateStaticParams() {
  const posts = await getPublishedPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }) {
  const { slug } = await params
  const exists = await checkSlugExists(slug) // Fast existence check
  if (!exists) notFound() // Real 404, before any Suspense boundary

  return (
    ``<Suspense>``
  )
}
```

> **Good to know:** You can also reject requests early using [`proxy`](/docs/app/api-reference/file-conventions/proxy) (for redirects, rewrites, or returning a response) or [`next.config.js` redirects](/docs/app/api-reference/config/next-config-js/redirects). Both run before the page renders, so HTTP status codes are still available.

### Bots and crawlers

HTML-limited bots and crawlers need metadata to be available in the `<head>` of the initial HTML. Next.js detects them by their user agent and waits for [`generateMetadata`](/docs/app/api-reference/functions/generate-metadata) to resolve before streaming the page content. Full browsers and DOM-capable crawlers can instead receive [streaming metadata](/docs/app/api-reference/functions/generate-metadata#streaming-metadata) alongside the page content.

You can customize which bots receive blocking metadata with the [`htmlLimitedBots`](/docs/app/api-reference/config/next-config-js/htmlLimitedBots) configuration option. See the [`loading.js` SEO section](/docs/app/api-reference/file-conventions/loading#seo) for more details.

#### Cache Components

With [Cache Components](/docs/app/getting-started/caching), visitors and DOM-capable crawlers receive the prerendered shell immediately, and dynamic content streams in as it resolves. HTML-limited bots skip the prerendered shell and render the page dynamically so metadata can be placed in the `<head>`. Once the metadata resolves, the remaining page content can still stream.

Keep this in mind when your prerendered shell depends on inputs that only exist while prerendering, such as build-time data or values that are not reachable in the request-time environment. Visitors and DOM-capable crawlers receive the shell without re-running that code, but an HTML-limited bot re-renders it dynamically, so a page that loads for a person can fail to render for a crawler. Make sure any data the shell relies on is also available at request time.

## What can affect streaming

Any layer between your server and the client that buffers the response can diminish the benefits of streaming. The HTML may be fully generated progressively on the server, but if a proxy, CDN, or even the client itself collects all the chunks before rendering them, the user sees a single delayed response instead of progressive rendering.

### Reverse proxies

Nginx and similar reverse proxies buffer responses by default. Disable buffering by setting the `X-Accel-Buffering` header to `no`:

```js
// Archivo: next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'X-Accel-Buffering',
            value: 'no',
          },
        ],
      },
    ]
  },
}
```

### CDNs

Content Delivery Networks may buffer entire responses before forwarding them to the client. Check your CDN provider's documentation for streaming support. Some require specific configuration or plan tiers to pass through chunked responses.

### Serverless platforms

Not all serverless environments support streaming. AWS Lambda, for example, requires [response streaming mode](https://docs.aws.amazon.com/lambda/latest/dg/configuration-response-streaming.html) to be explicitly enabled (it is not the default). Vercel supports streaming natively.

### Compression

Gzip and Brotli compression can buffer chunks internally before flushing, as the compression algorithm needs enough data to compress efficiently. This can add latency to the first visible chunk. If you notice streaming delays, check whether your compression layer is flushing aggressively enough.

### Clients

Buffering also happens at the client. [Safari/WebKit](https://bugs.webkit.org/show_bug.cgi?id=252413) buffers streaming responses until 1024 bytes have been received, so very small responses paint all at once instead of progressively. Real applications easily exceed this threshold (layouts, styles, scripts), so it only affects minimal demos or tiny Route Handler responses.

Command-line tools like `curl` also buffer by default. The `-N` flag disables output buffering, but `curl` still relies on newline characters to flush lines to the terminal. A stream that sends chunks without newlines may appear to stall even with `-N`.

### Verifying that streaming works

This section is about confirming the HTTP response is actually arriving in chunks through your infrastructure. For guidance on designing meaningful loading states and placing Suspense boundaries effectively, see [Granular streaming with ``<Suspense>``](#granular-streaming-with-suspense) and the [Cache Components](/docs/app/getting-started/caching) guide.

**Check the Network tab.** In Chrome DevTools, select the document request and look at the "Timing" breakdown. A long "Content Download" phase with an early "Time to First Byte" confirms the response is streaming rather than arriving all at once.

**Observe raw chunks.** To see exactly what the server sends and when, use a small script that reads the response as a stream. This is more reliable than `curl` for observing timed chunks, since `curl` has its own buffering behavior:

```js
// Archivo: stream-observer.mjs
const res = await fetch(
  'https://streaming-demo.labs.vercel.dev/suspense-demo',
  {
    headers: { 'Accept-Encoding': 'identity' },
  }
)

const reader = res.body.getReader()
const decoder = new TextDecoder()
let i = 0
const start = Date.now()

while (true) {
  const { done, value } = await reader.read()
  if (done) break
  console.log(`\nchunk ${i++} (+${Date.now() - start}ms)\n`)
  console.log(decoder.decode(value))
}
```

Run with `node stream-observer.mjs`. For a page with two sibling Suspense boundaries (like the [companion demo's Suspense page](https://streaming-demo.labs.vercel.dev/suspense-demo)), you will see output similar to:

```text
// Archivo: Terminal
chunk 0 (+0ms)    # Static shell: <head>, CSS, nav, fallback skeletons,
                  # <template id="B:0"> and <template id="B:1"> placeholders,
                  # bootstrap scripts
chunk 1 (+170ms)  # Component payload (self.__next_f.push) for hydration
chunk 2 (+1000ms) # Weather widget: payload + <div hidden id="S:0"> (swaps B:0)
chunk 3 (+3000ms) # Analytics dashboard: payload + <div hidden id="S:1"> (swaps B:1)
```

The `<template id="B:0">` markers are the Suspense fallback placeholders. When a boundary resolves, React streams a `<div hidden id="S:0">` containing the completed HTML and a script that swaps it into the page. The timestamps show each boundary resolving independently.

> **Good to know:** The `Accept-Encoding: identity` header disables compression so chunks are not buffered by the compression layer.

**Compare a bot request.** Add a bot user agent to the same script with `headers: { 'User-Agent': 'Twitterbot/1.0', 'Accept-Encoding': 'identity' }`. Now `await fetch()` itself blocks until the full render completes (around 3 seconds for this page), because the server holds the response until it has the finished document. The body then arrives all at once, with none of the staggered `+1000ms` / `+3000ms` timestamps:

```text
// Archivo: Terminal
chunk 0 (+0ms) # Entire document in a single burst, after fetch() already waited
```

This is the [bots and crawlers](#bots-and-crawlers) behavior: the server waits for the full render and sends one fully formed HTML document instead of streaming.

### Platform support

| Deployment Option                                                   | Supported         |
| ------------------------------------------------------------------- | ----------------- |
| [Node.js server](/docs/app/getting-started/deploying#nodejs-server) | Yes               |
| [Docker container](/docs/app/getting-started/deploying#docker)      | Yes               |
| [Static export](/docs/app/getting-started/deploying#static-export)  | No                |
| [Adapters](/docs/app/getting-started/deploying#adapters)            | Platform-specific |

See the [Self-Hosting guide](/docs/app/guides/self-hosting#streaming-and-suspense) for detailed configuration instructions.

## Summary

The trigger is **your code**: async work, non-deterministic output, or runtime data. When the framework encounters these, it walks up the tree looking for a ``<Suspense>`` boundary to use as a fallback. Everything above those boundaries forms the [static shell](#the-static-shell), which is sent immediately. As each boundary resolves, React streams the result into the page.

The key decisions are **what to cache** and **where to place Suspense boundaries**. Cache what you can with [`"use cache"`](/docs/app/api-reference/directives/use-cache) to grow the static shell. Push dynamic access down to the components that need it, and wrap those in ``<Suspense>``. Everything else becomes part of the shell.

## Further reading

- [RSC Explorer](https://rscexplorer.dev/) - interactive tool to explore the component payload format and see how React reconstructs the tree from streamed chunks
- [Streams API on web.dev](https://web.dev/articles/streams) - introduction to the Web Streams API that underpins streaming in Route Handlers
- [Chunked transfer encoding (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Transfer-Encoding) - the HTTP/1.1 mechanism that enables streaming responses
- [browser.engineering](https://browser.engineering/) - deep dive into how browsers handle network responses, rendering, and progressive display
- [Preventing flash before hydration](/docs/app/guides/preventing-flash-before-hydration) - how to update server-rendered HTML with client-specific values (locale, theme, persisted state) before the browser paints
