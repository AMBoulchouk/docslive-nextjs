# Capítulo 4: Data Fetching, Caching Moderno y Revalidación

> 📌 **Capítulo 04** | Libro Guía Next.js v16.3.7  
> 📝 **Resumen:** *El nuevo modelo de caché de Next.js 16: Cache Components, fetch caching, revalidación bajo demanda y CDN caching.*  
> 📄 **Temas incluidos:** 13 secciones  

[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)

---

## Contenido del Capítulo

- [Fetching Data](#fetching-data)
- [Caching](#caching)
- [Revalidating](#revalidating)
- [Caching and Revalidating (Previous Model)](#caching-and-revalidating-previous-model)
- [Using a CDN with Next.js](#using-a-cdn-with-nextjs)
- [How to configure Continuous Integration (CI) build caching](#how-to-configure-continuous-integration-ci-build-caching)
- [Client-side data fetching](#client-side-data-fetching)
- [How to fetch client-side data with SWR](#how-to-fetch-client-side-data-with-swr)
- [How to fetch client-side data with TanStack Query](#how-to-fetch-client-side-data-with-tanstack-query)
- [Incremental Static Regeneration with Cache Components](#incremental-static-regeneration-with-cache-components)
- [How to implement Incremental Static Regeneration (ISR)](#how-to-implement-incremental-static-regeneration-isr)
- [How to configure Continuous Integration (CI) build caching](#how-to-configure-continuous-integration-ci-build-caching)
- [How to implement Incremental Static Regeneration (ISR)](#how-to-implement-incremental-static-regeneration-isr)

---

<a id="fetching-data"></a>

## Fetching Data

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/fetching-data](https://nextjs.org/docs/app/getting-started/fetching-data)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to fetch data and stream content that depends on data.*  

---

This page will walk you through how you can fetch data in [Server](#server-components) and [Client](#client-components) Components, and how to [stream](#streaming) components that depend on uncached data.

## Fetching data

### Server Components

You can fetch data in Server Components using any asynchronous I/O, such as:

1. The [`fetch` API](#with-the-fetch-api)
2. An [ORM or database](#with-an-orm-or-database)

#### With the `fetch` API

To fetch data with the `fetch` API, turn your component into an asynchronous function, and await the `fetch` call. For example:

```tsx
// Archivo: app/blog/page.tsx switcher
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

```jsx
// Archivo: app/blog/page.js switcher
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

> **Good to know:**
>
> - Identical `fetch` requests in a React component tree are [memoized](/docs/app/glossary#memoization) by default, so you can fetch data in the component that needs it instead of drilling props.
> - `fetch` requests are not cached by default and will block the page from rendering until the request is complete. Use the [`use cache`](/docs/app/api-reference/directives/use-cache) directive to cache results, or wrap the fetching component in [`<Suspense>`](/docs/app/getting-started/caching#streaming-uncached-data) to stream fresh data at request time. See [caching](/docs/app/getting-started/caching) for details.
> - During development, you can log `fetch` calls for better visibility and debugging. See the [`logging` API reference](/docs/app/api-reference/config/next-config-js/logging).

#### With an ORM or database

Since Server Components are rendered on the server, credentials and query logic will not be included in the client bundle so you can safely make database queries using an ORM or database client.

```tsx
// Archivo: app/blog/page.tsx switcher
import { db, posts } from '@/lib/db'

export default async function Page() {
  const allPosts = await db.select().from(posts)
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

```jsx
// Archivo: app/blog/page.js switcher
import { db, posts } from '@/lib/db'

export default async function Page() {
  const allPosts = await db.select().from(posts)
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

You should still ensure requests are properly authenticated and authorized. For best practices on securing server-side data access, see the [data security guide](/docs/app/guides/data-security).

### Streaming

When you fetch data in Server Components, the data is fetched and rendered on the server for each request. If you have any slow data requests, the whole route will be blocked from rendering until all the data is fetched.

To improve the initial load time and user experience, you can break the page into smaller _chunks_ and progressively send those chunks from the server to the client. This is called streaming. See the [Streaming guide](/docs/app/guides/streaming) for a deeper look at how streaming works, including the HTTP contract, infrastructure considerations, and performance trade-offs.

![How Server Rendering with Streaming Works]()

There are two ways you can use streaming in your application:

1. Wrapping a page with a [`loading.js` file](#with-loadingjs)
2. Wrapping a component with [`<Suspense>`](#with-suspense)

> **Good to know:** Bots and crawlers are served differently from browsers. Next.js waits for data fetching to finish and sends the fully rendered page instead of streaming it progressively. See [Bots and crawlers](/docs/app/guides/streaming#bots-and-crawlers).

#### With `loading.js`

You can create a `loading.js` file in the same folder as your page to stream the **entire page** while the data is being fetched. For example, to stream `app/blog/page.js`, add the file inside the `app/blog` folder.

![Blog folder structure with loading.js file]()

```tsx
// Archivo: app/blog/loading.tsx switcher
export default function Loading() {
  // Define the Loading UI here
  return <div>Loading...</div>
}
```

```jsx
// Archivo: app/blog/loading.js switcher
export default function Loading() {
  // Define the Loading UI here
  return <div>Loading...</div>
}
```

On navigation, the user will immediately see the layout and a [loading state](#creating-meaningful-loading-states) while the page is being rendered. The new content will then be automatically swapped in once rendering is complete.

![Loading UI]()

Behind the scenes, `loading.js` will be [nested inside `layout.js`](/docs/app/getting-started/project-structure#component-hierarchy), and will automatically wrap the `page.js` file and any children below in a `<Suspense>` boundary.

![loading.js overview]()

Because of this, a layout that accesses uncached or runtime data (e.g. `cookies()`, `headers()`, or uncached fetches) does not fall back to a same route segment `loading.js`. Instead, it blocks navigation until the layout finishes rendering. [Cache Components](/docs/app/getting-started/caching) prevents this by guiding you with a build-time error.

To fix this, wrap the uncached access in its own [`<Suspense>`](#with-suspense) boundary with a fallback, or move the data fetching into `page.js` where `loading.js` can cover it. See [`loading.js`](/docs/app/api-reference/file-conventions/loading) for more details.

This is why, while `loading.js` works well for streaming route segments, using `<Suspense>` closer to the runtime or uncached data access is recommended.

#### With `<Suspense>`

`<Suspense>` allows you to be more granular about what parts of the page to stream. For example, you can immediately show any page content that falls outside of the `<Suspense>` boundary, and stream in the list of blog posts inside the boundary.

```tsx
// Archivo: app/blog/page.tsx switcher
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'

export default function BlogPage() {
  return (
    <div>
      
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>
      <main>
        
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

```jsx
// Archivo: app/blog/page.js switcher
import { Suspense } from 'react'
import BlogList from '@/components/BlogList'
import BlogListSkeleton from '@/components/BlogListSkeleton'

export default function BlogPage() {
  return (
    <div>
      
      <header>
        <h1>Welcome to the Blog</h1>
        <p>Read the latest posts below.</p>
      </header>
      <main>
        
        <Suspense fallback={<BlogListSkeleton />}>
          <BlogList />
        </Suspense>
      </main>
    </div>
  )
}
```

#### Creating meaningful loading states

An instant loading state is fallback UI that is shown immediately to the user after navigation. For the best user experience, we recommend designing loading states that are meaningful and help users understand the app is responding. For example, you can use skeletons and spinners, or a small but meaningful part of future screens such as a cover photo, title, etc.

In development, you can preview and inspect the loading state of your components using the [React Devtools](https://react.dev/learn/react-developer-tools).

### Client Components

There are two ways to fetch data in Client Components, using:

1. React's [`use` API](https://react.dev/reference/react/use)
2. A community library like [SWR](https://swr.vercel.app/) or [React Query](https://tanstack.com/query/latest)

#### Streaming data with the `use` API

You can use React's [`use` API](https://react.dev/reference/react/use) to [stream](#streaming) data from the server to client. Start by fetching data in your Server component, and pass the promise to your Client Component as prop:

```tsx
// Archivo: app/blog/page.tsx switcher
import Posts from '@/app/ui/posts'
import { Suspense } from 'react'

export default function Page() {
  // Don't await the data fetching function
  const posts = getPosts()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

```jsx
// Archivo: app/blog/page.js switcher
import Posts from '@/app/ui/posts'
import { Suspense } from 'react'

export default function Page() {
  // Don't await the data fetching function
  const posts = getPosts()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

Then, in your Client Component, use the `use` API to read the promise:

```tsx
// Archivo: app/ui/posts.tsx switcher
'use client'
import { use } from 'react'

export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>
}) {
  const allPosts = use(posts)

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

```jsx
// Archivo: app/ui/posts.js switcher
'use client'
import { use } from 'react'

export default function Posts({ posts }) {
  const allPosts = use(posts)

  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

In the example above, the `<Posts>` component is wrapped in a [`<Suspense>` boundary](https://react.dev/reference/react/Suspense). This means the fallback will be shown while the promise is being resolved. Learn more about [streaming](#streaming).

You can resolve a promise on the server with `await` or in a Client Component with `use()`. React covers [when to resolve a Promise in a Server or Client Component](https://react.dev/reference/react/use#resolve-promise-in-server-or-client-component). To share one promise with many Client Components instead of passing it as a prop, provide it through context. See [Using React's `use` within a Context Provider](/docs/app/guides/single-page-applications#using-reacts-use-within-a-context-provider).

#### Community libraries

You can use a community library like [SWR](https://swr.vercel.app/) or [React Query](https://tanstack.com/query/latest) to fetch data in Client Components. These libraries have their own semantics for caching, streaming, and other features. For example, with SWR:

```tsx
// Archivo: app/blog/page.tsx switcher
'use client'
import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function BlogPage() {
  const { data, error, isLoading } = useSWR(
    'https://api.vercel.app/blog',
    fetcher
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map((post: { id: string; title: string }) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

```jsx
// Archivo: app/blog/page.js switcher
'use client'

import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export default function BlogPage() {
  const { data, error, isLoading } = useSWR(
    'https://api.vercel.app/blog',
    fetcher
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

See [Client-side data fetching](/docs/app/guides/client-side-data-fetching) for direct browser fetching, providing initial data from a Server Component, and coordinating a library cache with the Next.js server and client caches.

## Examples

### Sequential data fetching

Sequential data fetching happens when one request depends on data from another.

For example, `<Playlists>` can only fetch data after `getArtist()` resolves because it needs the `artistID`:

```tsx
// Archivo: app/artist/[username]/page.tsx switcher
export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  // Get artist information
  const artist = await getArtist(username)

  return (
    <>
      <h1>{artist.name}</h1>
      
      <Suspense fallback={<div>Loading...</div>}>
        
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  )
}

async function Playlists({ artistID }: { artistID: string }) {
  // Use the artist ID to fetch playlists
  const playlists = await getArtistPlaylists(artistID)

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  )
}
```

```jsx
// Archivo: app/artist/[username]/page.js switcher
export default async function Page({ params }) {
  const { username } = await params
  // Get artist information
  const artist = await getArtist(username)

  return (
    <>
      <h1>{artist.name}</h1>
      
      <Suspense fallback={<div>Loading...</div>}>
        
        <Playlists artistID={artist.id} />
      </Suspense>
    </>
  )
}

async function Playlists({ artistID }) {
  // Use the artist ID to fetch playlists
  const playlists = await getArtistPlaylists(artistID)

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>{playlist.name}</li>
      ))}
    </ul>
  )
}
```

In this example, `<Suspense>` allows the playlists to stream in after the artist data loads. However, the page still waits for the artist data before displaying anything. To prevent this, you can wrap the entire page component in a `<Suspense>` boundary (for example, using a [`loading.js` file](#with-loadingjs)) to show a loading state immediately.

Ensure your data source can resolve the first request quickly, as it blocks everything else. If you can't optimize the request further, consider [caching](/docs/app/getting-started/caching) the result if the data changes infrequently.

### Parallel data fetching

Parallel data fetching happens when data requests in a route are eagerly initiated and start at the same time.

By default, [layouts and pages](/docs/app/getting-started/layouts-and-pages) are rendered in parallel. So each segment starts fetching data as soon as possible.

However, within _any_ component, multiple `async`/`await` requests can still be sequential if placed after the other. For example, `getAlbums` will be blocked until `getArtist` is resolved:

```tsx
// Archivo: app/artist/[username]/page.tsx switcher
import { getArtist, getAlbums } from '@/app/lib/data'

export default async function Page({ params }) {
  // These requests will be sequential
  const { username } = await params
  const artist = await getArtist(username)
  const albums = await getAlbums(username)
  return <div>{artist.name}</div>
}
```

Start multiple requests by calling `fetch`, then await them with [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all). Requests begin as soon as `fetch` is called.

```tsx
// Archivo: app/artist/[username]/page.tsx highlight={3,8,24} switcher
import Albums from './albums'

async function getArtist(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}`)
  return res.json()
}

async function getAlbums(username: string) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`)
  return res.json()
}

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params

  // Initiate requests
  const artistData = getArtist(username)
  const albumsData = getAlbums(username)

  const [artist, albums] = await Promise.all([artistData, albumsData])

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  )
}
```

```jsx
// Archivo: app/artist/[username]/page.js highlight={3,8,20} switcher
import Albums from './albums'

async function getArtist(username) {
  const res = await fetch(`https://api.example.com/artist/${username}`)
  return res.json()
}

async function getAlbums(username) {
  const res = await fetch(`https://api.example.com/artist/${username}/albums`)
  return res.json()
}

export default async function Page({ params }) {
  const { username } = await params

  // Initiate requests
  const artistData = getArtist(username)
  const albumsData = getAlbums(username)

  const [artist, albums] = await Promise.all([artistData, albumsData])

  return (
    <>
      <h1>{artist.name}</h1>
      <Albums list={albums} />
    </>
  )
}
```

> **Good to know:** If one request fails when using `Promise.all`, the entire operation will fail. To handle this, you can use the [`Promise.allSettled`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) method instead.

### Reusing data with `React.cache`

For data access that does not use `fetch`, such as an ORM or database query, wrap the function in [`React.cache`](https://react.dev/reference/react/cache). Multiple components can then call the function within the same request while sharing one result:

```ts
// Archivo: app/lib/user.ts switcher
import { cache } from 'react'
import { db, eq, users } from '@/lib/db'

export const getUser = cache(async (id: string) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  })
})
```

```js
// Archivo: app/lib/user.js switcher
import { cache } from 'react'
import { db, eq, users } from '@/lib/db'

export const getUser = cache(async (id) => {
  return db.query.users.findFirst({
    where: eq(users.id, id),
  })
})
```

Server Components can call `getUser()` directly:

```tsx
// Archivo: app/dashboard/page.tsx switcher
import { getUser } from '../lib/user'

export default async function DashboardPage() {
  const user = await getUser('1')

  if (!user) {
    return null
  }

  return <h1>Dashboard for {user.name}</h1>
}
```

```jsx
// Archivo: app/dashboard/page.js switcher
import { getUser } from '../lib/user'

export default async function DashboardPage() {
  const user = await getUser('1')

  if (!user) {
    return null
  }

  return <h1>Dashboard for {user.name}</h1>
}
```

Since `getUser` is wrapped with `React.cache`, calls with the same `id` within one request return the same memoized result.

> **Good to know:** [`React.cache`](https://react.dev/reference/react/cache#caveats) is scoped to the current request only. Each request gets its own memoization scope with no sharing between requests.

### Preloading data

When a component renders after other blocking work, its data request starts late even if the request inputs are already available. Preloading starts the request earlier so it can run in parallel with that work and avoid a request waterfall.

To preload data, call the data-fetching function without `await` before blocking work, then call the same function in the component that consumes the result.

The data-fetching function must deduplicate matching calls so the component can reuse the request started during preloading. Use one of the following approaches:

- For `fetch`, [identical requests are memoized automatically](/docs/app/api-reference/functions/fetch#memoization).
- For an ORM or database, wrap the data-fetching function in [`React.cache`](#reusing-data-with-reactcache).
- With Cache Components, add [`'use cache'`](/docs/app/api-reference/directives/use-cache) to the data-fetching function. If the function reads request APIs such as `cookies()` or `headers()`, use [`'use cache: private'`](/docs/app/api-reference/directives/use-cache-private).

In production, matching calls to a private Cache Function can reuse the same result within one request. This lets a component reuse a request started during preloading without storing the result in a server cache across requests.

Keep the preload function next to the component that consumes the data. This makes the dependency easier to find if you move or remove the component:

```tsx
// Archivo: app/item/[id]/item.tsx switcher
async function getItem(id: string) {
  const res = await fetch(`https://api.example.com/items/${id}`)
  return res.json()
}

export const preload = (id: string) => {
  void getItem(id)
}

export default async function Item({ id }: { id: string }) {
  const item = await getItem(id)
  return <div>{item.name}</div>
}
```

```jsx
// Archivo: app/item/[id]/item.js switcher
async function getItem(id) {
  const res = await fetch(`https://api.example.com/items/${id}`)
  return res.json()
}

export const preload = (id) => {
  void getItem(id)
}

export default async function Item({ id }) {
  const item = await getItem(id)
  return <div>{item.name}</div>
}
```

Call `preload()` before another blocking request to start loading the item earlier:

```tsx
// Archivo: app/item/[id]/page.tsx switcher
import Item, { preload } from './item'
import { checkIsAvailable } from '@/app/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  preload(id)
  const isAvailable = await checkIsAvailable(id)

  return isAvailable ? <Item id={id} /> : null
}
```

```jsx
// Archivo: app/item/[id]/page.js switcher
import Item, { preload } from './item'
import { checkIsAvailable } from '@/app/lib/data'

export default async function Page({ params }) {
  const { id } = await params

  preload(id)
  const isAvailable = await checkIsAvailable(id)

  return isAvailable ? <Item id={id} /> : null
}
```

The item request continues while `checkIsAvailable()` runs. If the page renders `<Item>`, the identical `fetch` call reuses the request that `preload()` started.


[⬆ Subir al inicio del capítulo](#)

---

<a id="caching"></a>

## Caching

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

Instead, wrap the component in [`<Suspense>`](https://react.dev/reference/react/Suspense) and provide a fallback UI. The fallback ships with the prerendered shell while the async work runs at request time.

```tsx
// Archivo: page.tsx
import { Suspense } from 'react'

async function LatestPosts() {
  const data = await fetch('https://api.example.com/posts')
  const posts = await data.json()
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

export default function Page() {
  return (
    <>
      <h1>My Blog</h1>
      <Suspense fallback={<p>Loading posts...</p>}>
        <LatestPosts />
      </Suspense>
    </>
  )
}
```

For example, `<p>Loading posts...</p>` is included in the static shell, and the posts stream in at request time.

Without a `<Suspense>` boundary around the uncached read, the dev overlay surfaces the **blocking-route** insight with this fix:


  <FixCard
    group="stream"
    title="Wrap in or move into Suspense"
    href="/docs/messages/blocking-prerender-dynamic#wrap-in-or-move-into-suspense"
    snippets={[
      { text: '<Suspense fallback={…}>', highlight: true },
      { text: '  <DataChild />' },
      { text: '</Suspense>', highlight: true },
    ]}
  />


> **Good to know:** Each fix card links to a detailed walkthrough with patterns, code samples, and trade-offs. Click a card to dive in.


`<Suspense>` provides a fallback UI while async work completes, but it does not itself opt a component into dynamic rendering. If a component only performs synchronous work, it will complete during prerendering regardless of whether it is wrapped in `<Suspense>`.

## Working with runtime APIs

Runtime APIs require information that is only available when a user makes a request. These include:

- [`cookies`](/docs/app/api-reference/functions/cookies) - User's cookie data
- [`headers`](/docs/app/api-reference/functions/headers) - Request headers
- [`searchParams`](/docs/app/api-reference/file-conventions/page#searchparams-optional) - URL query parameters
- [`params`](/docs/app/api-reference/file-conventions/page#params-optional) - Dynamic route parameters. Use [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) to prerender specific values at build time, or [ISR with Cache Components](/docs/app/guides/incremental-static-regeneration-cache-components) to serve an [App Shell](/docs/app/glossary#app-shell) while unknown params resolve in the background.

Components that access runtime APIs should be wrapped in `<Suspense>`:

```tsx
// Archivo: page.tsx
import { cookies } from 'next/headers'
import { Suspense } from 'react'

async function UserGreeting() {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme')?.value || 'light'
  return <p>Your theme: {theme}</p>
}

export default function Page() {
  return (
    <>
      <h1>Dashboard</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <UserGreeting />
      </Suspense>
    </>
  )
}
```

A runtime API access without `<Suspense>` surfaces the same **blocking-route** insight in the dev overlay, with the same fix:


  <FixCard
    group="stream"
    title="Wrap in or move into Suspense"
    href="/docs/messages/blocking-prerender-dynamic#wrap-in-or-move-into-suspense"
    snippets={[
      { text: '<Suspense fallback={…}>', highlight: true },
      { text: '  <DataChild />' },
      { text: '</Suspense>', highlight: true },
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
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
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

      
      <Suspense fallback={<p>Loading your preferences...</p>}>
        <UserPreferences />
      </Suspense>
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

Just as `<Suspense>` contains async access, an **error boundary** contains failures: wrap them around a subtree that might error during rendering. Use [`catchError`](/docs/app/api-reference/functions/catchError) for component-level boundaries, or the [`error.js`](/docs/app/api-reference/file-conventions/error) file convention for route-level boundaries.

As you build, consider that inside [`generateMetadata`](/docs/app/api-reference/functions/generate-metadata#with-cache-components) and [`generateViewport`](/docs/app/api-reference/functions/generate-viewport#with-cache-components), uncached fetches or runtime data access surface the same insights and errors as in your page, guiding you to the rendering you intend. For incremental static regeneration with both known and unknown param values, see [ISR with Cache Components](/docs/app/guides/incremental-static-regeneration-cache-components).

## Random values and timestamps

Operations like `Math.random()`, `Date.now()`, or `crypto.randomUUID()` produce different values each time they execute. Cache Components requires you to explicitly handle these.

> **Good to know:** `performance.now()` is meant for telemetry, so Next.js doesn't treat it as a value to guard. Use it for timing and pass the result to your logger or metrics rather than rendering it.

**To generate unique values per request**, defer to request time by calling [`connection()`](/docs/app/api-reference/functions/connection) before these operations, and wrap the component in `<Suspense>`:

```tsx
// Archivo: page.tsx highlight={1,4-6}
import { connection } from 'next/server'
import { Suspense } from 'react'

async function UniqueContent() {
  await connection()
  const uuid = crypto.randomUUID()
  return <p>Request ID: {uuid}</p>
}

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UniqueContent />
    </Suspense>
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


  <FixCard
    group="dynamic"
    title="Generate on every request"
    href="/docs/messages/blocking-prerender-random#generate-on-every-request"
    snippets={[
      { text: 'await connection()', highlight: true },
      { text: 'const id = Math.random()' },
      { text: 'return <Item id={id} />' },
    ]}
  />
  <FixCard
    group="cache"
    title="Cache the value"
    href="/docs/messages/blocking-prerender-random#cache-the-random-value"
    snippets={[
      { text: 'function RandomId() {' },
      { text: '  "use cache"', highlight: true },
      { text: '  return String(Math.random())' },
    ]}
  />


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

In this example, the configuration file is expected to be the same for every request, so it is read once at module scope. Calling `await readFile()` inside the component would be treated as uncached data that must be either accessed within `use cache` or behind a `<Suspense>` boundary. Since this file does not depend on the request and is not expected to change, module scope is the simplest option.

## Prerendering

At build time, Next.js renders your route's component tree. How each component is handled depends on the APIs it uses:

- [`use cache`](#usage): the result is cached and included in the static shell, as long as its lifetime [isn't too short](/docs/app/api-reference/functions/cacheLife#prerendering-behavior)
- [`<Suspense>`](#streaming-uncached-data): fallback UI is included in the static shell while the content streams at request time
- [Predictable values](#predictable-values): module imports, `fs.readFileSync`, and pure computations complete during prerender and are included in the static shell automatically
- [Random values and timestamps](#random-values-and-timestamps): use `connection()` + `<Suspense>` to get a unique value per request, or `use cache` to share one across users

This generates a static shell consisting of HTML for initial page loads and a serialized [RSC Payload](/docs/app/getting-started/server-and-client-components#on-the-server) for client-side navigation, ensuring the browser receives fully rendered content instantly whether users navigate directly to the URL or transition from another page. This rendering approach is called **Partial Prerendering (PPR)**, the default behavior with Cache Components.

![Partially re-rendered Product Page showing static nav and product information, and dynamic cart and recommended products]()

Every produced static shell can be served directly from a CDN, without going through to the upstream server. This makes direct navigations [instant](#instant-navigation).

What ends up in a route's static shell depends on what's known at build time. When a route's [dynamic params](/docs/app/api-reference/functions/generate-static-params) are known, the shell contains that concrete content, and any remaining uncached or runtime data still streams behind its `<Suspense>` fallback. When the params aren't known, the reusable, URL-independent version is the [**App Shell**](/docs/app/glossary#app-shell): the same static shell with the param-specific parts left behind their fallbacks. [Incremental Static Regeneration](#incremental-static-regeneration) fills in the concrete versions after the first visit.

Next.js requires you to explicitly handle components that can't complete during prerendering. It surfaces a validation insight in the dev overlay and dev server console that names the route and points at fixes (cache the access, move it into a `<Suspense>` boundary, or opt the route out). This validation keeps every route producing a static shell, so direct navigations stay instant.

![Diagram showing partially rendered page on the client, with loading UI for chunks that are being streamed.]()

> **🎥 Watch:** Why Partial Prerendering and how it works → [YouTube (10 minutes)](https://www.youtube.com/watch?v=MTcPrTIBkpA).

### Maximizing the static shell

The deeper your async work sits in the tree, the more of the page can be prerendered. This is the structural pattern Cache Components rewards: a general practice worth applying everywhere, and the foundation for the instant navigation and prefetching that follow. It applies to all [runtime APIs](#working-with-runtime-apis) and async operations like data fetches.

Consider a layout that destructures `params` at the top level:

```tsx
// Archivo: app/shop/[slug]/layout.tsx
export default async function Layout({
  children,
  params,
}: LayoutProps<'/shop/[slug]'>) {
  const { slug } = await params

  return (
    <div>
      <Sidebar />
      <h1>{slug}</h1>
      {children}
    </div>
  )
}
```

If this param is dynamic (not provided by [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params)), it is runtime data and the layout cannot be prerendered.

However, it is often possible to read the parameter value further down the tree. Instead of awaiting at the layout level, pass the params promise down and await there:

```tsx
// Archivo: app/shop/[slug]/layout.tsx highlight={3-4,11-16}
import { Suspense } from 'react'

// Not async: this layout never awaits params
export default function Layout({
  children,
  params,
}: LayoutProps<'/shop/[slug]'>) {
  return (
    <div>
      <Sidebar />
      <Suspense fallback={<h1>Loading...</h1>}>
        
        {params.then(({ slug }) => (
          <SlugHeading slug={slug} />
        ))}
      </Suspense>
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

Cache Components shipped in 16.0.0 with verification that direct visits to a route produce a static shell. Client navigations are different: a `<Suspense>` boundary that covers a direct visit may not be part of the render during a transition. Getting that structure right is easier when the framework steps in. Cache Components now validates these navigations too, giving you insights and errors that guide you to make navigations to your route instant. For example, wrap data in `<Suspense>`, cache it with `use cache`, or move where the access happens.

Read the [Instant navigation guide](/docs/app/guides/instant-navigation) for examples and inspection tools.

### Prefetching

With [Partial Prefetching](/docs/app/api-reference/config/next-config-js/partialPrefetching) enabled, the router prefetches each route's [App Shell](/docs/app/glossary#app-shell) by default. The App Shell includes static content and session data derived from `cookies()` and `headers()`. To also prefetch cached content that depends on a link's **URL data**, such as `searchParams` or dynamic `params`, set `prefetch={true}` on that link.

With [`<Link prefetch={true}>`](/docs/app/api-reference/components/link#prefetch) pointing at a [Partial Prefetching](/docs/app/api-reference/config/next-config-js/partialPrefetching) route, Next.js renders that route's component tree again at prefetch time, this time with the destination URL resolved. The same rules apply, but more of the tree resolves now that its `searchParams` and `params` are in scope:

- [`use cache`](#usage) called with values extracted from runtime APIs (passed as arguments) joins the per-link prefetch
- [`use cache: private`](/docs/app/api-reference/directives/use-cache-private) executes on the server, reads runtime data directly, and caches the result in the browser as part of the per-link prefetch
- [`<Suspense>`](#streaming-uncached-data) fallbacks stay in the prefetched UI while uncached content streams at request time

This per-link prefetch includes cached content that resolves after the destination URL is known. It costs a server invocation per prefetchable link.

For example, take a search page that reads `searchParams` from the URL:

```tsx
// Archivo: app/search/page.tsx
import { Suspense } from 'react'

export default function SearchPage(props: PageProps<'/search'>) {
  return (
    <Suspense fallback={<p>Loading results...</p>}>
      <Results searchParams={props.searchParams} />
    </Suspense>
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


[⬆ Subir al inicio del capítulo](#)

---

<a id="revalidating"></a>

## Revalidating

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/revalidating](https://nextjs.org/docs/app/getting-started/revalidating)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to revalidate cached data using time-based and on-demand strategies.*  

---

> This page covers revalidation with [Cache Components](/docs/app/api-reference/config/next-config-js/cacheComponents), enabled by setting [`cacheComponents: true`](/docs/app/api-reference/config/next-config-js/cacheComponents) in your `next.config.ts` file. If you're not using Cache Components, see the [Caching and Revalidating (Previous Model)](/docs/app/guides/caching-without-cache-components) guide.

Revalidation is the process of updating cached data. It lets you keep serving fast, cached responses while ensuring content stays fresh. There are two strategies:

- **Time-based revalidation**: Automatically refresh cached data after a set duration using [`cacheLife`](#cachelife).
- **On-demand revalidation**: Manually invalidate cached data after a mutation using [`revalidateTag`](#revalidatetag), [`updateTag`](#updatetag), or [`revalidatePath`](#revalidatepath).

## `cacheLife`

[`cacheLife`](/docs/app/api-reference/functions/cacheLife) controls how long cached data remains valid. Use it inside a [`use cache`](/docs/app/api-reference/directives/use-cache) scope to set the cache lifetime.

```tsx
// Archivo: app/lib/data.ts highlight={1,4,5}
import { cacheLife } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheLife('hours')
  return db.query('SELECT * FROM products')
}
```

`cacheLife` accepts a profile name or a custom configuration object:

| Profile   | `stale` | `revalidate` | `expire` |
| --------- | ------- | ------------ | -------- |
| `default` | 5m      | 15m          | never    |
| `seconds` | 30s     | 1s           | 60s      |
| `minutes` | 5m      | 1m           | 1h       |
| `hours`   | 5m      | 1h           | 1d       |
| `days`    | 5m      | 1d           | 1w       |
| `weeks`   | 5m      | 1w           | 30d      |
| `max`     | 5m      | 30d          | 1y       |

For fine-grained control, pass an object:

```tsx highlight={2-6}
'use cache'
cacheLife({
  stale: 3600, // 1 hour until considered stale
  revalidate: 7200, // 2 hours until revalidated
  expire: 86400, // 1 day until expired
})
```

> **Good to know:** A cache is considered "short-lived" when it uses the `seconds` profile, `revalidate: 0`, or `expire` under 5 minutes. Short-lived caches are automatically excluded from prerenders and become dynamic holes instead. See [Prerendering behavior](/docs/app/api-reference/functions/cacheLife#prerendering-behavior) for details.

See the [`cacheLife` API reference](/docs/app/api-reference/functions/cacheLife) for all profiles and custom configuration options.

## `cacheTag`

[`cacheTag`](/docs/app/api-reference/functions/cacheTag) lets you tag cached data so it can be invalidated on-demand. Use it inside a [`use cache`](/docs/app/api-reference/directives/use-cache) scope:

```tsx
// Archivo: app/lib/data.ts switcher
import { cacheTag } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheTag('products')
  return db.query('SELECT * FROM products')
}
```

```jsx
// Archivo: app/lib/data.js switcher
import { cacheTag } from 'next/cache'

export async function getProducts() {
  'use cache'
  cacheTag('products')
  return db.query('SELECT * FROM products')
}
```

Once tagged, invalidate the cache using [`revalidateTag`](#revalidatetag) or [`updateTag`](#updatetag).

See the [`cacheTag` API reference](/docs/app/api-reference/functions/cacheTag) to learn more.

## `revalidateTag`

`revalidateTag` invalidates cache entries by tag using stale-while-revalidate semantics — stale content is served immediately while fresh content loads in the background. This is ideal for content where a slight delay in updates is acceptable, like blog posts or product catalogs.

```tsx
// Archivo: app/lib/actions.ts highlight={1,5} switcher
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string) {
  // Mutate data
  revalidateTag('user', 'max') // Recommended: stale-while-revalidate
}
```

```jsx
// Archivo: app/lib/actions.js highlight={1,5} switcher
import { revalidateTag } from 'next/cache'

export async function updateUser(id) {
  // Mutate data
  revalidateTag('user', 'max') // Recommended: stale-while-revalidate
}
```

You can reuse the same tag in multiple functions to revalidate them all at once. Call `revalidateTag` in a [Server Action](/docs/app/getting-started/mutating-data) or [Route Handler](/docs/app/api-reference/file-conventions/route).

> **Good to know:** The second argument sets how long stale content can be served while fresh content generates in the background. Once it expires, subsequent requests block until fresh content is ready. Using `'max'` gives the longest stale window.

See the [`revalidateTag` API reference](/docs/app/api-reference/functions/revalidateTag) to learn more.

## `updateTag`

`updateTag` immediately expires cached data for read-your-own-writes scenarios — the user sees their change right away instead of stale content. Unlike `revalidateTag`, it can only be used in [Server Actions](/docs/app/guides/server-actions).

```tsx
// Archivo: app/lib/actions.ts highlight={1,12} switcher
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content'),
    },
  })

  updateTag('posts')
  redirect(`/posts/${post.id}`)
}
```

```jsx
// Archivo: app/lib/actions.js highlight={1,12} switcher
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData) {
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content'),
    },
  })

  updateTag('posts')
  redirect(`/posts/${post.id}`)
}
```

|              | `updateTag`                                   | `revalidateTag`                      |
| ------------ | --------------------------------------------- | ------------------------------------ |
| **Where**    | Server Actions only                           | Server Actions and Route Handlers    |
| **Behavior** | Immediately expires cache                     | Stale-while-revalidate               |
| **Use case** | Read-your-own-writes (user sees their change) | Background refresh (slight delay OK) |

See the [`updateTag` API reference](/docs/app/api-reference/functions/updateTag) to learn more.

## `revalidatePath`

`revalidatePath` invalidates all cached data for a specific route path. Use it when you want to revalidate a route without knowing which tags are associated with it.

```tsx
// Archivo: app/lib/actions.ts highlight={1,5} switcher
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  // Mutate data
  revalidatePath('/profile')
}
```

```jsx
// Archivo: app/lib/actions.js highlight={1,5} switcher
import { revalidatePath } from 'next/cache'

export async function updateUser(id) {
  // Mutate data
  revalidatePath('/profile')
}
```

> **Good to know**: Prefer tag-based revalidation (`revalidateTag`/`updateTag`) over path-based when possible — it's more precise and avoids over-invalidating.

See the [`revalidatePath` API reference](/docs/app/api-reference/functions/revalidatePath) to learn more.

## What should I cache?

Cache data that doesn't depend on [runtime data](/docs/app/getting-started/caching#working-with-runtime-apis) and that you're OK serving from cache for a period of time. Use `use cache` with `cacheLife` to describe that behavior.

When content doesn't need time-based revalidation, for example data from a CMS, use [`cacheTag`](#cachetag) and a long [`cacheLife`](#cachelife) like `max` to keep it in the static shell. Configure the content source to trigger a webhook, or other notification, that calls [`revalidateTag`](#revalidatetag) when the content changes. This reduces unnecessary time-based revalidation for content that hasn't changed.

> **Good to know:** In serverless environments, in-memory cache entries may not persist across revalidations. See [runtime caching considerations](/docs/app/api-reference/directives/use-cache#runtime-caching-considerations) for details.


[⬆ Subir al inicio del capítulo](#)

---

<a id="caching-and-revalidating-previous-model"></a>

## Caching and Revalidating (Previous Model)

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/caching-without-cache-components](https://nextjs.org/docs/app/guides/caching-without-cache-components)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to cache and revalidate data using fetch options, unstable_cache, and route segment configs for projects not using Cache Components.*  

---

> This guide assumes you are **not** using [Cache Components](/docs/app/getting-started/caching) which was introduced in version 16 under the [`cacheComponents` flag](/docs/app/api-reference/config/next-config-js/cacheComponents).

## Caching `fetch` requests

By default, [`fetch`](/docs/app/api-reference/functions/fetch) requests are not cached. You can cache individual requests by setting the `cache` option to `'force-cache'`.

```tsx
// Archivo: app/page.tsx switcher
export default async function Page() {
  const data = await fetch('https://...', { cache: 'force-cache' })
}
```

```jsx
// Archivo: app/page.jsx switcher
export default async function Page() {
  const data = await fetch('https://...', { cache: 'force-cache' })
}
```

See the [`fetch` API reference](/docs/app/api-reference/functions/fetch) to learn more.

### `unstable_cache` for non-`fetch` functions

`unstable_cache` allows you to cache the result of database queries and other async functions that don't use `fetch`. Wrap `unstable_cache` around the function:

```ts
// Archivo: app/lib/data.ts switcher
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'

export const getCachedUser = unstable_cache(
  async (id: string) => {
    return db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0])
  },
  ['user'], // cache key prefix
  {
    tags: ['user'],
    revalidate: 3600,
  }
)
```

```js
// Archivo: app/lib/data.js switcher
import { unstable_cache } from 'next/cache'
import { db } from '@/lib/db'

export const getCachedUser = unstable_cache(
  async (id) => {
    return db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .then((res) => res[0])
  },
  ['user'], // cache key prefix
  {
    tags: ['user'],
    revalidate: 3600,
  }
)
```

The third argument accepts:

- `tags`: an array of tags for on-demand revalidation with `revalidateTag`.
- `revalidate`: the number of seconds before the cache is revalidated.

See the [`unstable_cache` API reference](/docs/app/api-reference/functions/unstable_cache) to learn more.

### Route segment config

You can configure caching behavior at the route level by exporting config options from a [Page](/docs/app/api-reference/file-conventions/page), [Layout](/docs/app/api-reference/file-conventions/layout), or [Route Handler](/docs/app/api-reference/file-conventions/route).

#### `dynamic`

Change the dynamic behavior of a layout or page to fully static or fully dynamic.

```tsx
// Archivo: layout.tsx | page.tsx | route.ts switcher
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

```jsx
// Archivo: layout.js | page.js | route.js switcher
export const dynamic = 'auto'
// 'auto' | 'force-dynamic' | 'error' | 'force-static'
```

- **`'auto'`** (default): The default option to cache as much as possible without preventing any components from opting into dynamic behavior.
- **`'force-dynamic'`**: Force [dynamic rendering](/docs/app/glossary#dynamic-rendering), which will result in routes being rendered for each user at request time. This option is equivalent to:
  - Setting the option of every `fetch()` request in a layout or page to `{ cache: 'no-store', next: { revalidate: 0 } }`.
  - Setting the segment config to `export const fetchCache = 'force-no-store'`
- **`'error'`**: Force prerendering and cache the data of a layout or page by causing an error if any components use Request-time APIs or uncached data. This option is equivalent to:
  - `getStaticProps()` in the `pages` directory.
  - Setting the option of every `fetch()` request in a layout or page to `{ cache: 'force-cache' }`.
  - Setting the segment config to `fetchCache = 'only-cache'`.
- **`'force-static'`**: Force prerendering and cache the data of a layout or page by forcing [`cookies`](/docs/app/api-reference/functions/cookies), [`headers()`](/docs/app/api-reference/functions/headers) and [`useSearchParams()`](/docs/app/api-reference/functions/use-search-params) to return empty values. It is possible to [`revalidate`](#route-segment-config-revalidate), [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath), or [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag), in pages or layouts rendered with `force-static`.

#### `fetchCache`

<details>
  <summary>This is an advanced option that should only be used if you specifically need to override the default behavior.</summary>

A `fetch` request that sets no `cache` option is fetched once during `next build` if it is reachable **before** any Request-time APIs are used, because the route is prerendered up to that point. Requests discovered **after** a Request-time API run on every request.

`fetchCache` allows you to override the default `cache` option of all `fetch` requests in a layout or page.

```tsx
// Archivo: layout.tsx | page.tsx | route.ts switcher
export const fetchCache = 'auto'
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'
```

```jsx
// Archivo: layout.js | page.js | route.js switcher
export const fetchCache = 'auto'
// 'auto' | 'default-cache' | 'only-cache'
// 'force-cache' | 'force-no-store' | 'default-no-store' | 'only-no-store'
```

- **`'auto'`** (default): The default option to cache `fetch` requests before Request-time APIs with the `cache` option they provide and not cache `fetch` requests after Request-time APIs.
- **`'default-cache'`**: Allow any `cache` option to be passed to `fetch` but if no option is provided then set the `cache` option to `'force-cache'`. This means that even `fetch` requests after Request-time APIs are considered static.
- **`'only-cache'`**: Ensure all `fetch` requests opt into caching by changing the default to `cache: 'force-cache'` if no option is provided and causing an error if any `fetch` requests use `cache: 'no-store'`.
- **`'force-cache'`**: Ensure all `fetch` requests opt into caching by setting the `cache` option of all `fetch` requests to `'force-cache'`.
- **`'default-no-store'`**: Allow any `cache` option to be passed to `fetch` but if no option is provided then set the `cache` option to `'no-store'`. This means that even `fetch` requests before Request-time APIs are considered dynamic.
- **`'only-no-store'`**: Ensure all `fetch` requests opt out of caching by changing the default to `cache: 'no-store'` if no option is provided and causing an error if any `fetch` requests use `cache: 'force-cache'`
- **`'force-no-store'`**: Ensure all `fetch` requests opt out of caching by setting the `cache` option of all `fetch` requests to `'no-store'`. This forces all `fetch` requests to be re-fetched every request even if they provide a `'force-cache'` option.

##### Cross-route segment behavior

- Any options set across each layout and page of a single route need to be compatible with each other.
  - If both the `'only-cache'` and `'force-cache'` are provided, then `'force-cache'` wins. If both `'only-no-store'` and `'force-no-store'` are provided, then `'force-no-store'` wins. The force option changes the behavior across the route so a single segment with `'force-*'` would prevent any errors caused by `'only-*'`.
  - The intention of the `'only-*'` and `'force-*'` options is to guarantee the whole route is either fully static or fully dynamic. This means:
    - A combination of `'only-cache'` and `'only-no-store'` in a single route is not allowed.
    - A combination of `'force-cache'` and `'force-no-store'` in a single route is not allowed.
  - A parent cannot provide `'default-no-store'` if a child provides `'auto'` or `'*-cache'` since that could make the same fetch have different behavior.
- It is generally recommended to leave shared parent layouts as `'auto'` and customize the options where child segments diverge.

</details>

## Time-based revalidation

Use the `next.revalidate` option on `fetch` to revalidate data after a specified number of seconds:

```tsx
// Archivo: app/page.tsx switcher
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```

```jsx
// Archivo: app/page.jsx switcher
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```

For non-`fetch` functions, `unstable_cache` accepts a `revalidate` option in its configuration (see [example above](#unstable_cache-for-non-fetch-functions)).

### Route segment config `revalidate`

Set the default revalidation time for a layout or page. This option does not override the `revalidate` value set by individual `fetch` requests.

```tsx
// Archivo: layout.tsx | page.tsx | route.ts switcher
export const revalidate = false
// false | 0 | number
```

```jsx
// Archivo: layout.js | page.js | route.js switcher
export const revalidate = false
// false | 0 | number
```

- **`false`** (default): The default heuristic to cache any `fetch` requests that set their `cache` option to `'force-cache'` or are discovered before a Request-time API is used. Semantically equivalent to `revalidate: Infinity` which effectively means the resource should be cached indefinitely. It is still possible for individual `fetch` requests to use `cache: 'no-store'` or `revalidate: 0` to avoid being cached and make the route dynamically rendered. Or set `revalidate` to a positive number lower than the route default to increase the revalidation frequency of a route.
- **`0`**: Ensure a layout or page is always dynamically rendered even if no Request-time APIs or uncached data fetches are discovered. This option changes the default of `fetch` requests that do not set a `cache` option to `'no-store'` but leaves `fetch` requests that opt into `'force-cache'` or use a positive `revalidate` as is.
- **`number`**: (in seconds) Set the default revalidation frequency of a layout or page to `n` seconds.

> **Good to know**:
>
> - The revalidate value needs to be statically analyzable. For example `revalidate = 600` is valid, but `revalidate = 60 * 10` is not.
> - The revalidate value is not available when using the deprecated `runtime = 'edge'`.
> - In Development, Pages are _always_ rendered on-demand and are never cached. This allows you to see changes immediately without waiting for a revalidation period to pass.

#### Revalidation frequency

- The lowest `revalidate` across each layout and page of a single route will determine the revalidation frequency of the _entire_ route. This ensures that child pages are revalidated as frequently as their parent layouts.
- Individual `fetch` requests can set a lower `revalidate` than the route's default `revalidate` to increase the revalidation frequency of the entire route. This allows you to dynamically opt-in to more frequent revalidation for certain routes based on some criteria.

## On-demand revalidation

To revalidate cached data after an event, use [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) or [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath) in a [Server Action](/docs/app/getting-started/mutating-data) or [Route Handler](/docs/app/api-reference/file-conventions/route).

### Tagging cached data

Tag `fetch` requests with `next.tags` to enable on-demand cache invalidation:

```tsx
// Archivo: app/lib/data.ts switcher
export async function getUserById(id: string) {
  const data = await fetch(`https://...`, {
    next: { tags: ['user'] },
  })
}
```

```jsx
// Archivo: app/lib/data.js switcher
export async function getUserById(id) {
  const data = await fetch(`https://...`, {
    next: { tags: ['user'] },
  })
}
```

For non-`fetch` functions, `unstable_cache` also accepts a `tags` option (see [example above](#unstable_cache-for-non-fetch-functions)).

### `revalidateTag`

Invalidate cached data by tag using [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag):

```tsx
// Archivo: app/lib/actions.ts switcher
import { revalidateTag } from 'next/cache'

export async function updateUser(id: string) {
  // Mutate data
  revalidateTag('user', 'max')
}
```

```jsx
// Archivo: app/lib/actions.js switcher
import { revalidateTag } from 'next/cache'

export async function updateUser(id) {
  // Mutate data
  revalidateTag('user', 'max')
}
```

### `revalidatePath`

Invalidate all cached data for a specific route path using [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath):

```tsx
// Archivo: app/lib/actions.ts switcher
import { revalidatePath } from 'next/cache'

export async function updateUser(id: string) {
  // Mutate data
  revalidatePath('/profile')
}
```

```jsx
// Archivo: app/lib/actions.js switcher
import { revalidatePath } from 'next/cache'

export async function updateUser(id) {
  // Mutate data
  revalidatePath('/profile')
}
```

## Deduplicating requests

If you are not using `fetch` (which is [automatically memoized](/docs/app/api-reference/functions/fetch#memoization)), and instead using an ORM or database directly, you can wrap your data access with the [React `cache`](https://react.dev/reference/react/cache) function to deduplicate requests within a single render pass:

```tsx
// Archivo: app/lib/data.ts switcher
import { cache } from 'react'
import { db, posts, eq } from '@/lib/db'

export const getPost = cache(async (id: string) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  })
})
```

```jsx
// Archivo: app/lib/data.js switcher
import { cache } from 'react'
import { db, posts, eq } from '@/lib/db'

export const getPost = cache(async (id) => {
  const post = await db.query.posts.findFirst({
    where: eq(posts.id, parseInt(id)),
  })
})
```

## Preloading data

You can preload data by creating a utility function that you eagerly call above blocking requests. This lets you initiate data fetching early, so the data is already available by the time the component renders.

Combine the [`server-only` package](https://www.npmjs.com/package/server-only) with React's [`cache`](https://react.dev/reference/react/cache) to create a reusable preload utility:

```ts
// Archivo: utils/get-item.ts switcher
import { cache } from 'react'
import 'server-only'

export const getItem = cache(async (id: string) => {
  // ...
})

export const preload = (id: string) => {
  void getItem(id)
}
```

```js
// Archivo: utils/get-item.js switcher
import { cache } from 'react'
import 'server-only'

export const getItem = cache(async (id) => {
  // ...
})

export const preload = (id) => {
  void getItem(id)
}
```

Then call `preload()` before any blocking work so the data starts loading immediately:

```tsx
// Archivo: app/item/[id]/page.tsx switcher
import { getItem, preload, checkIsAvailable } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  // Start loading item data
  preload(id)
  // Perform another asynchronous task
  const isAvailable = await checkIsAvailable()

  return isAvailable ? <Item id={id} /> : null
}

async function Item({ id }: { id: string }) {
  const result = await getItem(id)
  // ...
}
```

```jsx
// Archivo: app/item/[id]/page.js switcher
import { getItem, preload, checkIsAvailable } from '@/lib/data'

export default async function Page({ params }) {
  const { id } = await params
  // Start loading item data
  preload(id)
  // Perform another asynchronous task
  const isAvailable = await checkIsAvailable()

  return isAvailable ? <Item id={id} /> : null
}

async function Item({ id }) {
  const result = await getItem(id)
  // ...
}
```

## Statically generating dynamic routes

To prerender dynamic routes with [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) and revalidate them over time, see the [Incremental Static Regeneration](/docs/app/guides/incremental-static-regeneration) guide.


[⬆ Subir al inicio del capítulo](#)

---

<a id="using-a-cdn-with-nextjs"></a>

## Using a CDN with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/cdn-caching](https://nextjs.org/docs/app/guides/cdn-caching)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how CDN caching works with Next.js, including what works today, cache variability, and the direction toward pathname-based cache keying.*  

---

Next.js sets standard `Cache-Control` headers that CDNs can use to cache responses at the edge. This page covers what works today, where CDN caching is challenging, and the direction toward eliminating custom-header dependencies.

## What Works Today

### Cache-Control headers

Next.js sets `Cache-Control` headers based on the rendering strategy of each route:

- **Static pages** (no revalidation): `s-maxage=31536000` (one year)
- **ISR pages** (time-based revalidation): `s-maxage={revalidate}, stale-while-revalidate={expire - revalidate}`. The default `expire` is one year, so `stale-while-revalidate` is included in the response header by default. You can customize this with [`cacheLife`](/docs/app/api-reference/functions/cacheLife).
- **Dynamic pages** (no caching): `private, no-cache, no-store, max-age=0, must-revalidate`

CDNs that respect `s-maxage` and `stale-while-revalidate` can cache static and ISR pages at the edge. However, CDN-level caching alone does not support on-demand revalidation ([`revalidateTag()`](/docs/app/api-reference/functions/revalidateTag) / [`revalidatePath()`](/docs/app/api-reference/functions/revalidatePath)): those calls invalidate the Next.js server cache, but the CDN will continue serving its cached copy until the `s-maxage` TTL expires. To propagate on-demand revalidation to the CDN, trigger CDN purges alongside your revalidation call. A common pattern is: call `revalidateTag()`/`revalidatePath()` to invalidate the Next.js server cache, then call your CDN purge API for the affected keys (including both HTML and RSC variants).

### Static assets

Static assets (JavaScript, CSS, images, fonts) served from `/_next/static/` include content hashes in their filenames and have a 1 year `max-age` and `immutable` directive: `public, max-age=31536000, immutable`

You can use [`assetPrefix`](/docs/app/api-reference/config/next-config-js/assetPrefix) to serve static assets from a different domain or CDN origin.

### Static prefetches (PPR-enabled routes)

When a route has Partial Prerendering enabled and the `next-router-prefetch` header is set (indicating a static prefetch), the response is deterministic: it returns the same prerendered content regardless of the client's router state. The `next-router-state-tree` header is not parsed for these requests, so it does not affect the response.

For PPR-enabled routes, a CDN can cache static prefetch responses if it:

1. Includes the `_rsc` search parameter in the cache key (to distinguish prefetch variants from HTML responses).
2. Respects the `Cache-Control` headers Next.js sets on the response.

> **Good to know:** For routes without PPR, the `next-router-state-tree` header is read during prefetch requests to determine which segments to include, which increases cache `vary` as it passes the current router state. When Cache Components is enabled, segment-level prefetches already use pathname-based routes (for example, `/page.segments/_tree.segment.rsc`), and CDNs can cache these with standard pathname-based cache keys.

## Where CDN Caching Is Challenging

App Router responses can vary based on several custom request headers. Next.js sets a `Vary` header on responses to signal this to CDNs:

- `rsc` — whether the request should return a React Server Components (RSC) payload instead of HTML
- `next-router-state-tree` — the client's current router state, used for targeted segment updates during dynamic navigations
- `next-router-prefetch` — whether this is a prefetch request
- `next-router-segment-prefetch` — the specific segment being prefetched
- `next-url` — added only for routes that use [interception routes](/docs/app/api-reference/file-conventions/intercepting-routes), carries the URL being intercepted

> **Good to know:** [`proxy.js`](/docs/app/api-reference/file-conventions/proxy) (previously Middleware) should run before the CDN cache so it remains the source of truth for auth, redirects, and rewrites. If your deployment places `proxy.js` behind the CDN, configure the cache layer to bypass caching for routes that depend on `proxy.js` decisions.

Many CDNs don't support `Vary` without additional configuration. Next.js addresses this with the `_rsc` search parameter: a hash of the relevant request header values that acts as a cache-key, ensuring different response variants get different cache keys. This ensures correct responses even on CDNs that ignore `Vary`.

## Handling Headers at the CDN

### What you can safely ignore

These headers can be omitted in specific cases without causing protocol errors. The server still returns a parseable response, but it may be larger or less targeted to the specific navigation:

**`next-router-state-tree`**: when omitted on non-prefetch RSC requests, the server returns a full payload instead of a targeted segment update.

**`next-router-segment-prefetch`**: when omitted on prefetch requests, the server falls back to a broader prefetch payload instead of a segment-specific one.

**`next-url`**: used for [interception routes](/docs/app/api-reference/file-conventions/intercepting-routes) to vary the response based on the referring page. If omitted, interception routes are not supported as the server doesn't know what original path to match against. The response returned is for regular navigation when `next-url` is omitted: the user sees the target page instead of the intercepted target page.

### What you must preserve

**The `rsc` header** must be forwarded from the client to the server. This header tells the server to return an RSC payload instead of HTML. If a CDN strips it, the server returns HTML when the client-side router expects RSC data, which breaks client-side navigation, causing browser navigations instead. The `Vary` header and `_rsc` parameter exist specifically to prevent CDNs from serving a cached HTML response to an RSC request (or vice versa).

**When `next-router-prefetch` is present, preserve both the prefetch header and the `_rsc` search parameter.** For prefetch flows, `_rsc` is a required cache-busting discriminator and should be treated as mandatory.

**The `_rsc` search parameter** must be included in the cache key. It distinguishes response variants (HTML vs. RSC, different prefetch types). Ensure your CDN does not strip query parameters from cache keys, as some CDNs do this by default. By default, when an RSC request arrives without the correct `_rsc` value, the server responds with a **307 redirect** to the URL with the correct hash. This behavior can be disabled by setting `experimental.validateRSCRequestHeaders` to `false`. CDNs should follow this redirect. Platforms that compute the hash upstream can rewrite requests to include the correct `_rsc` before forwarding to avoid an extra round trip.

> **Good to know:** Today, `next-url` is included in the `_rsc` hash even during static prefetches. This means you cannot safely ignore it under the current scheme without potentially getting cache misses. The pathname-based direction described below resolves this gap.

## Direction: Pathname-Based Cache Keying

The Next.js team is working on moving all cache-affecting inputs into the URL pathname, eliminating the need for `Vary` on custom headers and removing the `_rsc` search parameter. This resolves the CDN caching challenges described above.

### How it works

The approach extends the routing scheme that [`output: 'export'`](/docs/app/guides/static-exports) and segment prefetches already use today. File extensions in the pathname identify the response type:

- **Full page RSC**: `/my/page.rsc` returns the RSC payload for the entire page
- **Segment RSC**: `/my/page.segments/path/to/segment.segment.rsc` returns the RSC payload for a specific segment

Under this model:

- **The pathname determines the cache key.** Anything in the pathname affects which response variant is returned.
- **Search parameters can be safely dropped** without affecting returned responses.
- **Standard HTTP cache headers** (`Cache-Control`, `max-age`, etc.) are respected as usual.
- **No `Vary` support needed** from the CDN.

A CDN would cache Next.js responses by using the pathname as the cache key, ignoring search parameters, and respecting standard `Cache-Control` headers. No need to understand `Vary`, inspect custom headers, or program edge logic.

### What changes for interception routes

Under the current scheme, `next-url` contributes to the `_rsc` hash, so dropping it causes cache misses. Under the pathname-based scheme, interception variability would be encoded in a search parameter (not the pathname):

- If a CDN preserves search params, interception works correctly.
- If a CDN drops search params, interception is not supported. It would gracefully degrade to the non-intercepted page, client-side navigations won't break.

This makes interception route support an opt-in CDN capability rather than a requirement.

### Current status

This direction extends patterns that are already operational in the codebase (segment prefetch paths, `output: 'export'` mode). It is in active design.

## CDN Feature Compatibility

For a full table showing the infrastructure primitives available on every major CDN (edge compute, key-value storage, blob storage, PPR resuming), see [Deploying to Platforms](/docs/app/guides/deploying-to-platforms#cdn-infrastructure-compatibility).


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-configure-continuous-integration-ci-build-caching"></a>

## How to configure Continuous Integration (CI) build caching

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/ci-build-caching](https://nextjs.org/docs/app/guides/ci-build-caching)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to configure CI to cache Next.js builds*  

---

To improve build performance, Next.js saves a cache to `.next/cache` that is shared between builds.

To take advantage of this cache in Continuous Integration (CI) environments, your CI workflow will need to be configured to correctly persist the cache between builds.

> If your CI is not configured to persist `.next/cache` between builds, you may see a [No Cache Detected](/docs/messages/no-cache) error.

Here are some example cache configurations for common CI providers:

## Vercel

Next.js caching is automatically configured for you. There's no action required on your part. If you are using Turborepo on Vercel, [learn more here](https://vercel.com/docs/monorepos/turborepo).

## CircleCI

Edit your `save_cache` step in `.circleci/config.yml` to include `.next/cache`:

```yaml
steps:
  - save_cache:
      key: dependency-cache-{{ checksum "yarn.lock" }}
      paths:
        - ./node_modules
        - ./.next/cache
```

If you do not have a `save_cache` key, please follow CircleCI's [documentation on setting up build caching](https://circleci.com/docs/2.0/caching/).

## Travis CI

Add or merge the following into your `.travis.yml`:

```yaml
cache:
  directories:
    - $HOME/.cache/yarn
    - node_modules
    - .next/cache
```

## GitLab CI

Add or merge the following into your `.gitlab-ci.yml`:

```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
    - .next/cache/
```

## Netlify CI

Use [Netlify Plugins](https://www.netlify.com/products/build/plugins/) with [`@netlify/plugin-nextjs`](https://www.npmjs.com/package/@netlify/plugin-nextjs).

## AWS CodeBuild

Add (or merge in) the following to your `buildspec.yml`:

```yaml
cache:
  paths:
    - 'node_modules/**/*' # Cache `node_modules` for faster `yarn` or `npm i`
    - '.next/cache/**/*' # Cache Next.js for faster application rebuilds
```

## GitHub Actions

Using GitHub's [actions/cache](https://github.com/actions/cache), add the following step in your workflow file:

```yaml
uses: actions/cache@v4
with:
  # See here for caching with `yarn`, `bun` or other package managers https://github.com/actions/cache/blob/main/examples.md or you can leverage caching with actions/setup-node https://github.com/actions/setup-node
  path: |
    ~/.npm
    ${{ github.workspace }}/.next/cache
  # Generate a new cache whenever packages or source files change.
  key: ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-${{ hashFiles('**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx') }}
  # If source files changed but packages didn't, rebuild from a prior cache.
  restore-keys: |
    ${{ runner.os }}-nextjs-${{ hashFiles('**/package-lock.json') }}-
```

## Bitbucket Pipelines

Add or merge the following into your `bitbucket-pipelines.yml` at the top level (same level as `pipelines`):

```yaml
definitions:
  caches:
    nextcache: .next/cache
```

Then reference it in the `caches` section of your pipeline's `step`:

```yaml
- step:
    name: your_step_name
    caches:
      - node
      - nextcache
```

## Heroku

Using Heroku's [custom cache](https://devcenter.heroku.com/articles/nodejs-support#custom-caching), add a `cacheDirectories` array in your top-level package.json:

```javascript
"cacheDirectories": [".next/cache"]
```

## Azure Pipelines

Using Azure Pipelines' [Cache task](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/utility/cache), add the following task to your pipeline yaml file somewhere prior to the task that executes `next build`:

```yaml
- task: Cache@2
  displayName: 'Cache .next/cache'
  inputs:
    key: next | $(Agent.OS) | yarn.lock
    path: '$(System.DefaultWorkingDirectory)/.next/cache'
```

## Jenkins (Pipeline)

Using Jenkins' [Job Cacher](https://www.jenkins.io/doc/pipeline/steps/jobcacher/) plugin, add the following build step to your `Jenkinsfile` where you would normally run `next build` or `npm install`:

```yaml
stage("Restore npm packages") {
    steps {
        // Writes lock-file to cache based on the GIT_COMMIT hash
        writeFile file: "next-lock.cache", text: "$GIT_COMMIT"

        cache(caches: [
            arbitraryFileCache(
                path: "node_modules",
                includes: "**/*",
                cacheValidityDecidingFile: "package-lock.json"
            )
        ]) {
            sh "npm install"
        }
    }
}
stage("Build") {
    steps {
        // Writes lock-file to cache based on the GIT_COMMIT hash
        writeFile file: "next-lock.cache", text: "$GIT_COMMIT"

        cache(caches: [
            arbitraryFileCache(
                path: ".next/cache",
                includes: "**/*",
                cacheValidityDecidingFile: "next-lock.cache"
            )
        ]) {
            // aka `next build`
            sh "npm run build"
        }
    }
}
```


[⬆ Subir al inicio del capítulo](#)

---

<a id="client-side-data-fetching"></a>

## Client-side data fetching

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/client-side-data-fetching](https://nextjs.org/docs/app/guides/client-side-data-fetching)  
> 📂 **Sección:** App > Guides > Client Side Data Fetching  
> 📝 **Descripción:** *Fetch data in Client Components with a data-fetching library, optionally provide initial data from a Server Component, and coordinate server and client caches.*  

---

Many apps can provide responsive interactions without a client data-fetching library. If a Client Component only needs to read server data once, [pass it a Promise and unwrap it with React's `use()`](/docs/app/getting-started/fetching-data#streaming-data-with-the-use-api).

This avoids adding a library for data that never revalidates on the client. See [Building interactive apps](/docs/app/guides/interactive-apps) for patterns using Server Functions, transitions, optimistic UI, and pending feedback.

Use a client data-fetching library such as [SWR](https://swr.vercel.app), [TanStack Query](https://tanstack.com/query), or [Apollo Client](https://www.apollographql.com/docs/react) when Client Components need a shared browser cache. These libraries can add focus revalidation, interval polling, request deduplication, or optimistic updates across components.

## Choose a client fetching pattern

First decide whether the initial view needs data from the server or can wait for a browser request after hydration. Client data-fetching libraries support three common patterns:

| Pattern                 | SWR                            | TanStack Query        | When data becomes available            |
| ----------------------- | ------------------------------ | --------------------- | -------------------------------------- |
| Inline loading states   | `useSWR`                       | `useQuery`            | Browser request after hydration        |
| Suspense loading states | `useSWR` with `suspense: true` | `useSuspenseQuery`    | Browser request after hydration        |
| Provided by the server  | `<SWRConfig fallback>`         | `<HydrationBoundary>` | Initial render or streamed from server |

Use inline loading states when each component should render its own loading UI. Use [Suspense](/docs/app/getting-started/fetching-data#streaming) to define loading UI at a boundary and coordinate which parts of the interface reveal together or progressively. For client-only fetching, choose the pattern that matches the loading experience you want. Suspense coordinates rendering, while the data library and component structure determine when requests start.

For browser-driven interactions such as autocomplete, you can use either client-only pattern. The initial result waits for hydration and a browser request, which is often the right tradeoff for data that is not needed until an interaction.

Provide initial data from a [Server Component](/docs/app/getting-started/server-and-client-components) when the server knows what the initial render needs. The value can be included in the initial render or streamed through Suspense. The library receives it in the React Server Component payload and can continue managing it in the browser.

## Cache server data with Cache Components (optional)

Providing initial data and caching it on the server are independent choices. Add Cache Components when the server read or rendered view should be reused. When both are enabled, three cache layers can hold related data:

| Layer                        | What it stores                                                    | Freshness control                                                                    |
| ---------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Next.js server cache         | Cached data and Server Component output                           | [`cacheLife`](/docs/app/api-reference/functions/cacheLife) `revalidate` and `expire` |
| Next.js client cache         | React Server Component payloads for visited and prefetched routes | [`cacheLife`](/docs/app/api-reference/functions/cacheLife) `stale`                   |
| Client data-fetching library | Browser data stored under an SWR key or TanStack query key        | The library's revalidation options and mutations                                     |

Next.js [prefetching](/docs/app/guides/prefetching) can place a route's React Server Component payload in the client cache before navigation.

The cache layers keep independent freshness policies and do not need matching durations. Cache identities and mutation invalidation must stay coordinated across layers.

## Coordinate mutations

Server Components, data-fetching libraries, and mutations manage different parts of the data flow:

- **Server Components** provide the initial data, scoped to the segment that owns it.
- **The data-fetching library** stores the browser value under a shared cache identity.
- **Mutations** can update the browser cache immediately and invalidate cached server data so the next render can read a fresh value.

An optimistic update should restore the previous browser value if the write fails. If the server read is not cached, there is no server tag to invalidate.

After a mutation, invalidate any cached server read that provided the initial data:

| Method                                                                                 | Use when                                                   | Next server read                     |
| -------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------ |
| [`updateTag(tag)`](/docs/app/api-reference/functions/updateTag)                        | A Server Action must make its update visible immediately   | Waits for fresh data                 |
| [`revalidateTag(tag, 'max')`](/docs/app/api-reference/functions/revalidateTag)         | The update is passive or stale data is acceptable          | Serves stale data while revalidating |
| [`revalidateTag(tag, { expire: 0 })`](/docs/app/api-reference/functions/revalidateTag) | A webhook or external system requires immediate expiration | Waits for fresh data                 |

## Apply these patterns with SWR or TanStack Query

- [Client-side data fetching with SWR](/docs/app/guides/client-side-data-fetching/swr)
- [Client-side data fetching with TanStack Query](/docs/app/guides/client-side-data-fetching/tanstack-query)

See both patterns in the live [`next-spa-patterns` demo](https://next-spa-patterns.labs.vercel.dev) and its [source code](https://github.com/vercel-labs/next-spa-patterns).


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-fetch-client-side-data-with-swr"></a>

## How to fetch client-side data with SWR

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/client-side-data-fetching/swr](https://nextjs.org/docs/app/guides/client-side-data-fetching/swr)  
> 📂 **Sección:** App > Guides > Client Side Data Fetching  
> 📝 **Descripción:** *Fetch client-side data with SWR, optionally provide initial data from a Server Component, and coordinate server and client caches.*  

---

Use [SWR](https://swr.vercel.app) to fetch data in Client Components, provide initial data from Server Components, and coordinate browser mutations with cached server data. See [Client-side data fetching](/docs/app/guides/client-side-data-fetching) to choose a pattern.

## Fetch data on the client

SWR can fetch entirely in the browser when the initial view can wait for a browser request after hydration. Choose an [inline or Suspense loading state](/docs/app/guides/client-side-data-fetching#choose-a-client-fetching-pattern) based on where the loading UI should appear. In these examples, `query` starts empty and updates from client state after hydration.

Use `useSWR` when the component should render its own loading and error states. A conditional key delays the request until the interaction provides an input:

```tsx
// Archivo: app/product-autocomplete.tsx
'use client'

import useSWR from 'swr'

type Product = { id: string; name: string }

async function fetcher(url: string): Promise<Product[]> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export function ProductAutocomplete({ query }: { query: string }) {
  const {
    data = [],
    error,
    isLoading,
  } = useSWR(
    query ? `/api/products?query=${encodeURIComponent(query)}` : null,
    fetcher
  )

  if (!query) return null
  if (error) return <p>Failed to load products.</p>
  if (isLoading) return <p>Loading products...</p>

  return (
    <ul>
      {data.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

## Use Suspense for client data

Use `suspense: true` when the nearest Suspense boundary should define the loading UI. Keep the interactive shell outside the boundary so it remains available while the results load:

```tsx
// Archivo: app/product-autocomplete.tsx
'use client'

import { Suspense } from 'react'
import useSWR from 'swr'

type Product = { id: string; name: string }

async function fetcher(url: string): Promise<Product[]> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export function ProductAutocomplete({ query }: { query: string }) {
  if (!query) return null

  return (
    <Suspense fallback={<p>Loading products...</p>}>
      <ProductResults query={query} />
    </Suspense>
  )
}

function ProductResults({ query }: { query: string }) {
  const { data } = useSWR(
    `/api/products?query=${encodeURIComponent(query)}`,
    fetcher,
    { suspense: true }
  )

  return (
    <ul>
      {data.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

With an unconditional key, SWR defines `data` after Suspense resolves. Handle request errors with the nearest [error boundary](/docs/app/getting-started/error-handling#nested-error-boundaries).

The `isLoading` value is `true` when a request is running and there is no loaded data to display. The `isValidating` value is `true` whenever a request is running, including background revalidation.

With `suspense: true`, Suspense handles the initial no-data state. Later revalidation for the same key keeps the current data rendered instead of showing the Suspense fallback again. Use `isValidating` to provide background refresh feedback. Learn more about [SWR loading states](https://swr.vercel.app/docs/advanced/understanding#combining-with-isloading-and-isvalidating-for-better-ux).

Learn more: [SWR data fetching](https://swr.vercel.app/docs/data-fetching).

> **Good to know:** Independent Suspense reads can start in parallel when they render in sibling components. Multiple Suspense reads in one component run sequentially. Learn more about [network waterfalls](/docs/app/guides/migrating/from-create-react-app#network-waterfalls) and [SWR Suspense](https://swr.vercel.app/docs/suspense).

## Provide initial data from a Server Component

Use the [server-provided data pattern](/docs/app/guides/client-side-data-fetching#choose-a-client-fetching-pattern) when the initial render needs the data and SWR should continue managing it in the browser. With SWR 2.3.0 and React 19, a Server Component can provide fallback data before the client takes over.

Scope `<SWRConfig>` to the route segment that owns the data. The provider keeps the `fallback` close to its consumer and avoids adding feature data to a shared layout:

```tsx
// Archivo: app/products/[id]/page.tsx switcher
import { Suspense } from 'react'
import { SWRConfig } from 'swr'
import { getProduct } from './data' // some server-side function
import { productCache } from './product-cache'
import { ProductView } from './product-view'

export default function Page({ params }: PageProps<'/products/[id]'>) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      {params.then(({ id }) => (
        <ProductData id={id} />
      ))}
    </Suspense>
  )
}

function ProductData({ id }: { id: string }) {
  return (
    <SWRConfig
      value={{
        fallback: {
          // Not awaited: only components that read this key suspend
          [productCache.key(id)]: getProduct(id),
        },
      }}
    >
      <ProductView id={id} />
    </SWRConfig>
  )
}
```

```jsx
// Archivo: app/products/[id]/page.js switcher
import { Suspense } from 'react'
import { SWRConfig } from 'swr'
import { getProduct } from './data' // some server-side function
import { productCache } from './product-cache'
import { ProductView } from './product-view'

export default function Page({ params }) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      {params.then(({ id }) => (
        <ProductData id={id} />
      ))}
    </Suspense>
  )
}

function ProductData({ id }) {
  return (
    <SWRConfig
      value={{
        fallback: {
          // Not awaited: only components that read this key suspend
          [productCache.key(id)]: getProduct(id),
        },
      }}
    >
      <ProductView id={id} />
    </SWRConfig>
  )
}
```

The fallback and Client Component must use the same SWR key. Define the key once so both call sites share the same identity:

```ts
// Archivo: app/products/[id]/product-cache.ts switcher
export const productCache = {
  key: (id: string) => `/api/products/${id}`,
}
```

```js
// Archivo: app/products/[id]/product-cache.js switcher
export const productCache = {
  key: (id) => `/api/products/${id}`,
}
```

In the page example, the Promise returned by `params.then()` keeps the fallback visible until the route parameters resolve. `ProductData` then creates a separate, unawaited `getProduct(id)` Promise for the SWR `fallback`. React passes that Promise through the React Server Component payload, and the component reading the matching key suspends until the data resolves.

The Client Component reads the data with `useSWR` using the same key:

```tsx
// Archivo: app/products/[id]/product-view.tsx switcher
'use client'

import useSWR from 'swr'
import { productCache } from './product-cache'

type Product = { id: string; name: string }

async function fetcher(url: string): Promise<Product> {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch product')
  return response.json()
}

export function ProductView({ id }: { id: string }) {
  const { data } = useSWR(productCache.key(id), fetcher, { suspense: true })

  return <h1>{data.name}</h1>
}
```

```jsx
// Archivo: app/products/[id]/product-view.js switcher
'use client'

import useSWR from 'swr'
import { productCache } from './product-cache'

async function fetcher(url) {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch product')
  return response.json()
}

export function ProductView({ id }) {
  const { data } = useSWR(productCache.key(id), fetcher, { suspense: true })

  return <h1>{data.name}</h1>
}
```

> **Good to know:** The `fallback` key and the `useSWR` key must match exactly. If they drift, SWR ignores the fallback value and fetches on the client.

The `fallback` provides the hook's initial value. By default, SWR treats fallback data as stale and starts a browser revalidation after hydration.

SWR does not provide a time-based freshness window for fallback data. Setting `revalidateIfStale: false` skips revalidation when the hook mounts with cached data. This setting applies to every mount, unlike TanStack Query's `staleTime`.

Focus, reconnect, polling, and `mutate` can still revalidate the key. To refresh on a schedule, set [`refreshInterval`](https://swr.vercel.app/docs/revalidation#revalidate-on-interval).

The SWR key points to a [Route Handler](/docs/app/api-reference/file-conventions/route) with a `GET` method. The Route Handler can call the same `getProduct` function that provides the fallback, while the browser uses the URL for revalidation and polling.

Learn more: [SWR arguments and keys](https://swr.vercel.app/docs/arguments) and [SWR with Next.js App Router](https://swr.vercel.app/docs/with-nextjs).

## Cache server-provided data with Cache Components

Enable [`cacheComponents`](/docs/app/api-reference/config/next-config-js/cacheComponents) in `next.config.ts` before using this pattern. You can then cache the server data used as the SWR fallback. Add [`use cache`](/docs/app/api-reference/directives/use-cache), choose a [`cacheLife`](/docs/app/api-reference/functions/cacheLife) profile, and apply [`cacheTag`](/docs/app/api-reference/functions/cacheTag) so mutations can invalidate it:

```ts
// Archivo: app/products/[id]/data.ts switcher
import { cacheLife, cacheTag } from 'next/cache'

export async function getProduct(id: string) {
  'use cache'
  cacheLife('max')
  cacheTag(`product:${id}`)

  const product = await db.product.findUnique({ where: { id } })
  if (!product) throw new Error('Product not found')
  return product
}
```

```js
// Archivo: app/products/[id]/data.js switcher
import { cacheLife, cacheTag } from 'next/cache'

export async function getProduct(id) {
  'use cache'
  cacheLife('max')
  cacheTag(`product:${id}`)

  const product = await db.product.findUnique({ where: { id } })
  if (!product) throw new Error('Product not found')
  return product
}
```

This example uses `cacheLife('max')` because writes invalidate the product tag. Within the cache profile, `stale` controls how long the Next.js client cache can reuse a prefetched payload, while `revalidate` and `expire` control the server cache. Choose a shorter profile when the server value should refresh with time.

SWR owns a separate browser cache, so its revalidation options do not need to match `cacheLife`.

When the same mutation updates the browser cache and invalidates cached server data, you may define both identities in one shared contract:

```diff
// Archivo: app/products/[id]/product-cache.ts switcher
 export const productCache = {
   key: (id: string) => `/api/products/${id}`,
+  tag: (id: string) => `product:${id}`,
 }
```

```diff
// Archivo: app/products/[id]/product-cache.js switcher
 export const productCache = {
   key: (id) => `/api/products/${id}`,
+  tag: (id) => `product:${id}`,
 }
```

The server function can then call `cacheTag(productCache.tag(id))`. Keep this contract free of server-only and client-only imports so both cache layers can reuse it.

## Coordinate server and client caches after mutations

The fallback provides the initial value. After hydration, SWR manages the browser cache and revalidation. For reused data, keep the SWR key and server tag in the same cache contract:

```ts
// Archivo: app/activity/activity-cache.ts switcher
export const activityCache = {
  key: '/api/activity/unread',
  tag: (userId: string) => `activity:${userId}`,
}
```

```js
// Archivo: app/activity/activity-cache.js switcher
export const activityCache = {
  key: '/api/activity/unread',
  tag: (userId) => `activity:${userId}`,
}
```

Use the same key for the fallback, the Client Component read, and the mutation. With SWR, pass the write to [`mutate`](https://swr.vercel.app/docs/mutation) and provide `optimisticData`. SWR shows the optimistic value immediately and rolls it back if the write fails. This example keeps the optimistic value after the action succeeds because the final value is known:

```tsx
// Archivo: app/activity/mark-read-button.tsx switcher
'use client'

import { useSWRConfig } from 'swr'
import { markActivityReadAction } from './actions'
import { activityCache } from './activity-cache'

export function MarkReadButton() {
  const { mutate } = useSWRConfig()

  function markRead() {
    return mutate(
      activityCache.key,
      async () => {
        await markActivityReadAction()
        return { count: 0 }
      },
      {
        optimisticData: { count: 0 },
        revalidate: false,
        rollbackOnError: true,
        throwOnError: false,
      }
    )
  }

  return <button onClick={markRead}>Mark read</button>
}
```

```jsx
// Archivo: app/activity/mark-read-button.js switcher
'use client'

import { useSWRConfig } from 'swr'
import { markActivityReadAction } from './actions'
import { activityCache } from './activity-cache'

export function MarkReadButton() {
  const { mutate } = useSWRConfig()

  function markRead() {
    return mutate(
      activityCache.key,
      async () => {
        await markActivityReadAction()
        return { count: 0 }
      },
      {
        optimisticData: { count: 0 },
        revalidate: false,
        rollbackOnError: true,
        throwOnError: false,
      }
    )
  }

  return <button onClick={markRead}>Mark read</button>
}
```

The Server Action writes to the database and expires the tagged server data with [`updateTag`](/docs/app/api-reference/functions/updateTag). Tag the cached server query with [`cacheTag`](/docs/app/api-reference/functions/cacheTag) so the tag matches:

```ts
// Archivo: app/activity/actions.ts switcher
'use server'

import { updateTag } from 'next/cache'
import {
  getCurrentUserId,
  markActivityRead as markActivityReadInDatabase,
} from './data'
import { activityCache } from './activity-cache'

export async function markActivityReadAction() {
  const userId = await getCurrentUserId()
  await markActivityReadInDatabase(userId)
  updateTag(activityCache.tag(userId))
}
```

```js
// Archivo: app/activity/actions.js switcher
'use server'

import { updateTag } from 'next/cache'
import {
  getCurrentUserId,
  markActivityRead as markActivityReadInDatabase,
} from './data'
import { activityCache } from './activity-cache'

export async function markActivityReadAction() {
  const userId = await getCurrentUserId()
  await markActivityReadInDatabase(userId)
  updateTag(activityCache.tag(userId))
}
```

The optimistic SWR value updates the current screen. `updateTag` ensures the next cached server read returns fresh activity.

> **Good to know:** Call `updateTag` when a Server Action changes a cached read that must reflect the write immediately. An uncached read does not have a server tag to update. See [Client-side data fetching](/docs/app/guides/client-side-data-fetching#coordinate-mutations) for other invalidation behaviors.

See the [live `next-spa-patterns` demo](https://next-spa-patterns.labs.vercel.dev/swr) and its [source code](https://github.com/vercel-labs/next-spa-patterns/tree/main/app/swr). Learn more about [SWR mutation and optimistic updates](https://swr.vercel.app/docs/mutation) and the [SWR documentation](https://swr.vercel.app/docs/getting-started).


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-fetch-client-side-data-with-tanstack-query"></a>

## How to fetch client-side data with TanStack Query

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/client-side-data-fetching/tanstack-query](https://nextjs.org/docs/app/guides/client-side-data-fetching/tanstack-query)  
> 📂 **Sección:** App > Guides > Client Side Data Fetching  
> 📝 **Descripción:** *Fetch client-side data with TanStack Query, optionally provide initial data from a Server Component, and coordinate server and client caches.*  

---

Use [TanStack Query](https://tanstack.com/query) to fetch data in Client Components, provide initial data from Server Components, and coordinate browser mutations with cached server data. See [Client-side data fetching](/docs/app/guides/client-side-data-fetching) to choose a pattern.

## Set up the provider

Wrap the routes that use TanStack Query in a `QueryClientProvider`. Create a new query client for each server render and reuse one query client in the browser:

```tsx
// Archivo: app/products/providers.tsx
'use client'

import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  // Keep server requests isolated and preserve the browser cache across renders.
  if (typeof window === 'undefined') return new QueryClient()
  browserQueryClient ??= new QueryClient()
  return browserQueryClient
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={getQueryClient()}>
      {children}
    </QueryClientProvider>
  )
}
```

Render the provider from the nearest shared layout:

```tsx
// Archivo: app/products/layout.tsx
import { Providers } from './providers'

export default function Layout({ children }: LayoutProps<'/products'>) {
  return <Providers>{children}</Providers>
}
```

See the [complete provider setup in the demo source](https://github.com/vercel-labs/next-spa-patterns/tree/main/app/react-query) or learn about provider options in the [TanStack Query Advanced SSR guide](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr).

## Fetch data on the client

TanStack Query can fetch entirely in the browser when the initial view can wait for a browser request after hydration. Choose an [inline or Suspense loading state](/docs/app/guides/client-side-data-fetching#choose-a-client-fetching-pattern) based on where the loading UI should appear. In these examples, `query` starts empty and updates from client state after hydration.

Use `useQuery` when the component should render its own loading and error states. The `enabled` option delays the request until the interaction provides an input:

```tsx
// Archivo: app/product-autocomplete.tsx
'use client'

import { useQuery } from '@tanstack/react-query'

type Product = { id: string; name: string }

async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(
    `/api/products?query=${encodeURIComponent(query)}`
  )
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export function ProductAutocomplete({ query }: { query: string }) {
  const {
    data = [],
    error,
    isPending,
  } = useQuery({
    queryKey: ['product-search', query],
    queryFn: () => searchProducts(query),
    enabled: query.length > 0,
  })

  if (!query) return null
  if (error) return <p>Failed to load products.</p>
  if (isPending) return <p>Loading products...</p>

  return (
    <ul>
      {data.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

Learn more: [TanStack Query queries](https://tanstack.com/query/latest/docs/framework/react/guides/queries).

## Use Suspense for client data

Use `useSuspenseQuery` when the nearest Suspense boundary should define the loading UI. Keep the interactive shell outside the boundary so it remains available while the results load:

```tsx
// Archivo: app/product-autocomplete.tsx
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { Suspense } from 'react'

type Product = { id: string; name: string }

async function searchProducts(query: string): Promise<Product[]> {
  const response = await fetch(
    `/api/products?query=${encodeURIComponent(query)}`
  )
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export function ProductAutocomplete({ query }: { query: string }) {
  if (!query) return null

  return (
    <Suspense fallback={<p>Loading products...</p>}>
      <ProductResults query={query} />
    </Suspense>
  )
}

function ProductResults({ query }: { query: string }) {
  const { data } = useSuspenseQuery({
    queryKey: ['product-search', query],
    queryFn: () => searchProducts(query),
  })

  return (
    <ul>
      {data.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}
```

If the initial request fails, `useSuspenseQuery` propagates the error to the nearest [error boundary](/docs/app/getting-started/error-handling#nested-error-boundaries).

After a query has data, later refetches for the same query keep the cached data rendered instead of showing the Suspense fallback again. Use `isFetching` to provide background refresh feedback.

If the initial view needs the data, provide it from a Server Component as shown below.

> **Good to know:** Multiple `useSuspenseQuery` calls in one component run sequentially. Put independent queries in sibling components, or use [`useSuspenseQueries`](https://tanstack.com/query/latest/docs/framework/react/reference/useSuspenseQueries). Learn more about [request waterfalls](https://tanstack.com/query/latest/docs/framework/react/guides/request-waterfalls).

## Provide initial data from a Server Component

Use the [server-provided data pattern](/docs/app/guides/client-side-data-fetching#choose-a-client-fetching-pattern) when the initial render needs the data and TanStack Query should continue managing it in the browser. A Server Component can provide initial query data before the client takes over.

TanStack Query 5.40.0 or later can dehydrate pending queries. Start `prefetchQuery` without awaiting it, then pass the dehydrated state to `<HydrationBoundary>`. Override `queryFn` on the server because the Route Handler's relative URL only resolves in the browser:

```tsx
// Archivo: app/products/[id]/page.tsx switcher
import { Suspense } from 'react'
import {
  defaultShouldDehydrateQuery,
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getProduct } from './data'
import { productCache } from './product-cache'
import { ProductView } from './product-view'

export default function Page({ params }: PageProps<'/products/[id]'>) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      {params.then(({ id }) => (
        <ProductData id={id} />
      ))}
    </Suspense>
  )
}

function ProductData({ id }: { id: string }) {
  const queryClient = new QueryClient()

  // Not awaited, so rendering is not blocked.
  void queryClient.prefetchQuery({
    ...productCache.options(id),
    queryFn: () => getProduct(id),
  })

  return (
    <HydrationBoundary
      state={dehydrate(queryClient, {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      })}
    >
      <ProductView id={id} />
    </HydrationBoundary>
  )
}
```

```jsx
// Archivo: app/products/[id]/page.js switcher
import { Suspense } from 'react'
import {
  defaultShouldDehydrateQuery,
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { getProduct } from './data'
import { productCache } from './product-cache'
import { ProductView } from './product-view'

export default function Page({ params }) {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      {params.then(({ id }) => (
        <ProductData id={id} />
      ))}
    </Suspense>
  )
}

function ProductData({ id }) {
  const queryClient = new QueryClient()

  // Not awaited, so rendering is not blocked.
  void queryClient.prefetchQuery({
    ...productCache.options(id),
    queryFn: () => getProduct(id),
  })

  return (
    <HydrationBoundary
      state={dehydrate(queryClient, {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      })}
    >
      <ProductView id={id} />
    </HydrationBoundary>
  )
}
```

The server and Client Component must use the same query key. Keep the key and query options together so both call sites share the same identity:

```ts
// Archivo: app/products/[id]/product-cache.ts switcher
import { queryOptions } from '@tanstack/react-query'

export type Product = { id: string; name: string }

export const productCache = {
  key: (id: string) => ['product', id] as const,
  options: (id: string) =>
    queryOptions({
      queryKey: productCache.key(id),
      queryFn: async (): Promise<Product> => {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error('Failed to fetch product')
        return res.json()
      },
      staleTime: 30_000,
    }),
}
```

```js
// Archivo: app/products/[id]/product-cache.js switcher
import { queryOptions } from '@tanstack/react-query'

export const productCache = {
  key: (id) => ['product', id],
  options: (id) =>
    queryOptions({
      queryKey: productCache.key(id),
      queryFn: async () => {
        const res = await fetch(`/api/products/${id}`)
        if (!res.ok) throw new Error('Failed to fetch product')
        return res.json()
      },
      staleTime: 30_000,
    }),
}
```

The query function fetches a [Route Handler](/docs/app/api-reference/file-conventions/route) so it can run on the client. The `staleTime` prevents an immediate client refetch by keeping the hydrated data fresh for 30 seconds. Choose a duration based on how quickly the data can change.

Larger features can place query options in a separate client-facing module as long as every caller imports the key from the same cache contract. Learn more about [TanStack Query defaults](https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults).

As with SWR, `params.then()` resolves the `id` inside `<Suspense>`, and `ProductData` prefetches below the boundary.

The Client Component reads the same query key with `useSuspenseQuery` (or `useQuery` to render `isPending` and `error` states inline):

```tsx
// Archivo: app/products/[id]/product-view.tsx switcher
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { productCache } from './product-cache'

export function ProductView({ id }: { id: string }) {
  const { data } = useSuspenseQuery(productCache.options(id))

  return <h1>{data.name}</h1>
}
```

```jsx
// Archivo: app/products/[id]/product-view.js switcher
'use client'

import { useSuspenseQuery } from '@tanstack/react-query'
import { productCache } from './product-cache'

export function ProductView({ id }) {
  const { data } = useSuspenseQuery(productCache.options(id))

  return <h1>{data.name}</h1>
}
```

Learn more: [TanStack Query Advanced SSR](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr).

## Cache server-provided data with Cache Components

Enable [`cacheComponents`](/docs/app/api-reference/config/next-config-js/cacheComponents) in `next.config.ts` before using this pattern. You can then cache the server data provided to TanStack Query. Add [`use cache`](/docs/app/api-reference/directives/use-cache), choose a [`cacheLife`](/docs/app/api-reference/functions/cacheLife) profile, and apply [`cacheTag`](/docs/app/api-reference/functions/cacheTag) so mutations can invalidate it:

```ts
// Archivo: app/products/[id]/data.ts switcher
import { cacheLife, cacheTag } from 'next/cache'
import type { Product } from './product-cache'

export async function getProduct(id: string): Promise<Product> {
  'use cache'
  cacheLife('max')
  cacheTag(`product:${id}`)

  const product = await db.product.findUnique({ where: { id } })
  if (!product) throw new Error('Product not found')
  return product
}
```

```js
// Archivo: app/products/[id]/data.js switcher
import { cacheLife, cacheTag } from 'next/cache'

export async function getProduct(id) {
  'use cache'
  cacheLife('max')
  cacheTag(`product:${id}`)

  const product = await db.product.findUnique({ where: { id } })
  if (!product) throw new Error('Product not found')
  return product
}
```

This example uses `cacheLife('max')` because writes invalidate the product tag. Within the cache profile, `stale` controls how long the Next.js client cache can reuse a prefetched payload, while `revalidate` and `expire` control the server cache. Choose a shorter profile when the server value should refresh with time.

TanStack Query owns a separate browser cache, so its `staleTime` does not need to match `cacheLife`.

With Cache Components enabled, Next.js also prerenders Client Components. Keep a query needed during the initial render behind [Suspense](/docs/app/getting-started/fetching-data#streaming). TanStack Query can read the current time while creating active query state, and the boundary lets Next.js defer that work instead of raising a [current-time prerender error](/docs/messages/blocking-prerender-current-time-client).

When the same mutation updates the browser cache and invalidates cached server data, you may define both identities in one shared contract:

```diff
// Archivo: app/products/[id]/product-cache.ts switcher
 export const productCache = {
   key: (id: string) => ['product', id] as const,
+  tag: (id: string) => `product:${id}`,
   // ...
 }
```

```diff
// Archivo: app/products/[id]/product-cache.js switcher
 export const productCache = {
   key: (id) => ['product', id],
+  tag: (id) => `product:${id}`,
   // ...
 }
```

The server function can then call `cacheTag(productCache.tag(id))`. Keep this contract free of server-only and client-only imports so both cache layers can reuse it.

> **Good to know:** TanStack Query's `dehydrate()` reads the current time during Cache Components prerendering. Use the [prerenderable hydration helper](#build-a-prerenderable-hydration-state) for cached initial data.

## Coordinate server and client caches after mutations

Hydration provides the initial client cache value. After hydration, TanStack Query owns the browser copy and its revalidation. For reused data, keep the query key and server tag in the same cache contract:

```ts
// Archivo: app/activity/activity-cache.ts switcher
export const activityCache = {
  key: ['activity', 'unread'] as const,
  tag: (userId: string) => `activity:${userId}`,
}
```

```js
// Archivo: app/activity/activity-cache.js switcher
export const activityCache = {
  key: ['activity', 'unread'],
  tag: (userId) => `activity:${userId}`,
}
```

On mutation, use `useMutation`'s [`onMutate`](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates) callback to update the cache immediately and restore the previous value in `onError` if the write fails. This example keeps the optimistic value after the action succeeds because the final value is known:

```tsx
// Archivo: app/activity/mark-read-button.tsx switcher
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markActivityReadAction } from './actions'
import { activityCache } from './activity-cache'

export function MarkReadButton() {
  const queryClient = useQueryClient()
  const queryKey = activityCache.key

  const markRead = useMutation({
    mutationFn: markActivityReadAction,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, { count: 0 })
      return { previous }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
  })

  return <button onClick={() => markRead.mutate()}>Mark read</button>
}
```

```jsx
// Archivo: app/activity/mark-read-button.js switcher
'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markActivityReadAction } from './actions'
import { activityCache } from './activity-cache'

export function MarkReadButton() {
  const queryClient = useQueryClient()
  const queryKey = activityCache.key

  const markRead = useMutation({
    mutationFn: markActivityReadAction,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, { count: 0 })
      return { previous }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(queryKey, context?.previous)
    },
  })

  return <button onClick={() => markRead.mutate()}>Mark read</button>
}
```

The Server Action writes to the database and expires the tagged server data with [`updateTag`](/docs/app/api-reference/functions/updateTag). Tag the cached server query with [`cacheTag`](/docs/app/api-reference/functions/cacheTag) so the tag matches:

```ts
// Archivo: app/activity/actions.ts switcher
'use server'

import { updateTag } from 'next/cache'
import {
  getCurrentUserId,
  markActivityRead as markActivityReadInDatabase,
} from './data'
import { activityCache } from './activity-cache'

export async function markActivityReadAction() {
  const userId = await getCurrentUserId()
  await markActivityReadInDatabase(userId)
  updateTag(activityCache.tag(userId))
}
```

```js
// Archivo: app/activity/actions.js switcher
'use server'

import { updateTag } from 'next/cache'
import {
  getCurrentUserId,
  markActivityRead as markActivityReadInDatabase,
} from './data'
import { activityCache } from './activity-cache'

export async function markActivityReadAction() {
  const userId = await getCurrentUserId()
  await markActivityReadInDatabase(userId)
  updateTag(activityCache.tag(userId))
}
```

The optimistic query value updates the current screen. `updateTag` ensures the next cached server read returns fresh activity.

> **Good to know:** Call `updateTag` when a Server Action changes a cached read that must reflect the write immediately. An uncached read does not have a server tag to update. See [Client-side data fetching](/docs/app/guides/client-side-data-fetching#coordinate-mutations) for other invalidation behaviors.

## Build a prerenderable hydration state

The TanStack Query pattern above uses `dehydrate()` to create the hydration state. With Cache Components, `dehydrate()` reads the current time (`Date.now()`) while prerendering and causes a [current-time prerender error](/docs/messages/blocking-prerender-current-time).

Instead, cache only that timestamp and build the dehydrated state by hand. Wrap the time read in [`use cache`](/docs/app/api-reference/directives/use-cache) with the same tags as the data reads. When a mutation invalidates those tags, the data and its timestamp advance together, so `<HydrationBoundary>` overwrites the client query on the next navigation:

```tsx
// Archivo: app/lib/hydrate.ts switcher
import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import {
  defaultShouldDehydrateQuery,
  QueryClient,
  type DehydratedState,
  type QueryKey,
} from '@tanstack/react-query'

type HydratedQuery = {
  queryKey: QueryKey
  data: unknown
}

type HydrationOptions = {
  tags: string[]
}

async function getHydrationUpdatedAt(tags: string[]) {
  'use cache'
  cacheTag(...tags)
  cacheLife('max')
  return Date.now()
}

export async function dehydrate(
  queries: HydratedQuery[],
  options: HydrationOptions
): Promise<DehydratedState> {
  const updatedAt = await getHydrationUpdatedAt(options.tags)

  const queryClient = new QueryClient()

  for (const query of queries) {
    queryClient.setQueryData(query.queryKey, query.data, { updatedAt })
  }

  return {
    mutations: [],
    queries: queryClient
      .getQueryCache()
      .getAll()
      .filter((query) => defaultShouldDehydrateQuery(query))
      .map((query) => ({
        dehydratedAt: updatedAt,
        queryHash: query.queryHash,
        queryKey: query.queryKey,
        state: query.state,
        ...(query.meta ? { meta: query.meta } : {}),
      })),
  }
}
```

```js
// Archivo: app/lib/hydrate.js switcher
import 'server-only'

import { cacheLife, cacheTag } from 'next/cache'
import { defaultShouldDehydrateQuery, QueryClient } from '@tanstack/react-query'

async function getHydrationUpdatedAt(tags) {
  'use cache'
  cacheTag(...tags)
  cacheLife('max')
  return Date.now()
}

export async function dehydrate(queries, options) {
  const updatedAt = await getHydrationUpdatedAt(options.tags)

  const queryClient = new QueryClient()

  for (const query of queries) {
    queryClient.setQueryData(query.queryKey, query.data, { updatedAt })
  }

  return {
    mutations: [],
    queries: queryClient
      .getQueryCache()
      .getAll()
      .filter((query) => defaultShouldDehydrateQuery(query))
      .map((query) => ({
        dehydratedAt: updatedAt,
        queryHash: query.queryHash,
        queryKey: query.queryKey,
        state: query.state,
        ...(query.meta ? { meta: query.meta } : {}),
      })),
  }
}
```

Await the helper in the segment that owns the data, passing the data and the same tags used on the underlying `getProduct` read. Hand the result to `<HydrationBoundary>` inside `ProductData`:

```tsx
// Archivo: app/products/[id]/page.tsx switcher
import { HydrationBoundary } from '@tanstack/react-query'
import { dehydrate } from '@/app/lib/hydrate'
import { getProduct } from './data'
import { productCache } from './product-cache'
import { ProductView } from './product-view'

async function ProductData({ id }: { id: string }) {
  const product = await getProduct(id)
  const state = await dehydrate(
    [{ queryKey: productCache.key(id), data: product }],
    { tags: [productCache.tag(id)] }
  )

  return (
    <HydrationBoundary state={state}>
      <ProductView id={id} />
    </HydrationBoundary>
  )
}
```

```jsx
// Archivo: app/products/[id]/page.js switcher
import { HydrationBoundary } from '@tanstack/react-query'
import { dehydrate } from '@/app/lib/hydrate'
import { getProduct } from './data'
import { productCache } from './product-cache'
import { ProductView } from './product-view'

async function ProductData({ id }) {
  const product = await getProduct(id)
  const state = await dehydrate(
    [{ queryKey: productCache.key(id), data: product }],
    { tags: [productCache.tag(id)] }
  )

  return (
    <HydrationBoundary state={state}>
      <ProductView id={id} />
    </HydrationBoundary>
  )
}
```

> **Good to know:** The timestamp must advance whenever the hydrated data changes. The helper suits tag-driven server data because both use the same tags. For time-driven server data, derive the data and hydration timestamp from the same cached snapshot instead of maintaining unrelated time windows.

See the [live `next-spa-patterns` demo](https://next-spa-patterns.labs.vercel.dev/react-query) and its [source code](https://github.com/vercel-labs/next-spa-patterns/tree/main/app/react-query). Learn more about [TanStack Query optimistic updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates) and the [TanStack Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).


[⬆ Subir al inicio del capítulo](#)

---

<a id="incremental-static-regeneration-with-cache-components"></a>

## Incremental Static Regeneration with Cache Components

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components](https://nextjs.org/docs/app/guides/incremental-static-regeneration-cache-components)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to prerender a subset of dynamic routes, serve App Shells for the rest, and upgrade them after the first visit.*  

---

[Incremental Static Regeneration (ISR)](/docs/app/glossary#incremental-static-regeneration-isr) with [`cacheComponents`](/docs/app/api-reference/config/next-config-js/cacheComponents) and [Partial Prefetching](/docs/app/api-reference/config/next-config-js/partialPrefetching) gives every route an instant first visit, even for URLs that weren't included in the build.

During build, Partial Prerendering splits each render into two parts:

- The **App Shell**: the generic, reusable part of the page that doesn't depend on URL data
- The rest of the statically renderable content: the param-specific prerenders for the URLs you list in [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params)

For a visit to a URL whose params were included in `generateStaticParams`, Next.js serves the fully prerendered page from the cache. For a visit to a URL whose params weren't, Next.js serves the App Shell instantly, then upgrades it in the background with the now-known params. Subsequent visits to that URL get the upgraded result from the cache, skipping the App Shell entirely.

If you have used [ISR](/docs/app/guides/incremental-static-regeneration) or [`fallback: true`](https://nextjs.org/docs/pages/api-reference/functions/get-static-paths#fallback-true) in the Pages Router, this is the Cache Components equivalent.

Enable both [`cacheComponents`](/docs/app/api-reference/config/next-config-js/cacheComponents) and [Partial Prefetching](/docs/app/api-reference/config/next-config-js/partialPrefetching). Cache Components produces the App Shell, while Partial Prefetching upgrades it to a full route once the params are known.

```ts
// Archivo: next.config.ts highlight={4-5}
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
}

export default nextConfig
```

## Example

We'll build a product catalog with category layouts and product detail pages using the [Recipe API](https://next-recipe-api.vercel.dev/). You can find the resources used in this example here:

- [Demo](https://partial-fallbacks.labs.vercel.dev/)
- [Code](https://github.com/vercel-labs/partial-fallbacks)

### Prepare your routes

Use [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) to define which param values to prerender. When rendering these routes, the param values are known at build time. The prerender process builds a static shell until it hits runtime APIs or uncached data. See [Prerendering](/docs/app/getting-started/caching#prerendering) for more details.

The category layout prerenders two categories:

```tsx
// Archivo: app/[category]/layout.tsx highlight={5-8}
import Link from 'next/link'
import { Suspense } from 'react'
import { getCategory, getTopCategories } from '../lib/data'

export async function generateStaticParams() {
  const categories = await getTopCategories()
  return categories.map((c) => ({ category: c.slug }))
}

async function CategoryHeader({
  params,
}: Pick<LayoutProps<'/[category]'>, 'params'>) {
  const { category } = await params
  const data = await getCategory(category)

  return (
    <div>
      [&larr; All categories](/)
      <h1>{data?.name ?? 'Category'}</h1>
      {data?.description && <p>{data.description}</p>}
    </div>
  )
}

export default function CategoryLayout(props: LayoutProps<'/[category]'>) {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <CategoryHeader params={props.params} />
      </Suspense>
      {props.children}
    </div>
  )
}
```

Notice that `CategoryLayout` does not `await props.params` itself. Instead, it passes the `params` promise to `CategoryHeader` inside `<Suspense>`. The `await` happens inside the boundary, so for unknown categories Next.js can still generate the App Shell. Keep the read inside the boundary even for the categories `generateStaticParams` covers. A statically known param still belongs to one URL, so awaiting it above the Suspense boundary would tie this layout's App Shell to that URL. See [Instant navigation](/docs/app/guides/instant-navigation) for structuring routes this way.

The product page prerenders one product per category. `generateStaticParams` receives the parent `category` param:

```tsx
// Archivo: app/[category]/[product]/page.tsx highlight={5-12}
import { Suspense } from 'react'
import Link from 'next/link'
import { getProduct, getPopularProducts } from '../../lib/data'

export async function generateStaticParams({
  params,
}: {
  params: { category: string }
}) {
  const products = await getPopularProducts(params.category)
  return products.map((p) => ({ product: p.slug }))
}

async function ProductDetails(props: PageProps<'/[category]/[product]'>) {
  const { category, product } = await props.params
  const data = await getProduct(category, product)

  if (!data) {
    return <p>Product not found.</p>
  }

  return (
    <>
      <Link href={`/${category}`}>&larr; Back to products</Link>
      <h2>{data.name}</h2>
      <p>${data.price}</p>
      <p>{data.description}</p>
    </>
  )
}

export default function ProductPage(props: PageProps<'/[category]/[product]'>) {
  return (
    <div>
      <Suspense fallback={<div>Loading product...</div>}>
        <ProductDetails {...props} />
      </Suspense>
    </div>
  )
}
```

> **Good to know:** You can also use [`loading.tsx`](/docs/app/api-reference/file-conventions/loading) files instead of `<Suspense>` in JSX. `loading.tsx` puts the boundary at the segment edge, while inline `<Suspense>` lets you place it anywhere in the tree.

The data helpers use `'use cache'` at the module level so all exported functions are cached. This lets their results be included in the static shell:

```ts
// Archivo: app/lib/data.ts highlight={1}
'use cache'

const API = 'https://next-recipe-api.vercel.dev'

export async function getCategory(slug: string) {
  const res = await fetch(`${API}/categories/${slug}`)
  if (!res.ok) return null
  return res.json()
}

export async function getProduct(category: string, slug: string) {
  const res = await fetch(`${API}/products/${category}/${slug}`)
  if (!res.ok) return null
  return res.json()
}

export async function getTopCategories() {
  const res = await fetch(`${API}/categories`)
  const categories = await res.json()
  return categories.slice(0, 2)
}

export async function getPopularProducts(category: string) {
  const res = await fetch(`${API}/products?category=${category}`)
  const products = await res.json()
  return products.slice(0, 1)
}
```

If your components access runtime APIs like `cookies` or `headers`, wrap them in `<Suspense>`. Their fallback UI is included in the static shell instead.

### At build time

When you run `next build`, Next.js prerenders the layout for each known category (`tops`, `shorts`), plus one render where `await params` suspends, producing the App Shell for `[category]`.

It also prerenders the page for each known product under each category (`tee` under `tops`, `joggers` under `shorts`), plus one render where `await params` suspends, producing the App Shell for `[product]`.

These are combined into:

- `/tops/tee`, `/shorts/joggers`: fully static pages, both params known
- `/tops/[product]`, `/shorts/[product]`: category header rendered, product shows fallback
- `/[category]/[product]`: both show fallback

### At runtime

A visitor navigates to `/tops/tee`. Both params were prerendered. They get a fully static page.

The first visit to `/tops/overshirt`. The product `overshirt` is unknown, but the category `tops` was prerendered. Next.js serves the App Shell for `/tops/[product]` with the category header already rendered. The product streams in.

The first visit to `/shoes/basketball-shoes`. Neither param was prerendered. Next.js serves the generic App Shell for `/[category]/[product]`. Both the category and the product stream in.

After the first visit, Next.js renders these routes in the background with the now-known params. The next visitor to the same URLs gets the upgraded result.

A prefetch counts as that first visit. When a [`<Link>`](/docs/app/api-reference/components/link) to an unlisted URL enters the viewport, or you call [`router.prefetch`](/docs/app/api-reference/functions/use-router), Next.js starts the background upgrade before the click, so navigation lands on the upgraded result.

> **Good to know**: The App Shell for unlisted params is served from Next.js 16.3. Earlier versions wait for a full server render before sending the response.

### What the upgrade produces

After the first visit, Next.js renders the page in the background with the known params and tries to push the static boundary as far down the component tree as possible:

- If every data access is cached and all params are resolved, the upgrade produces a **fully static page**.
- If all params are resolved but the render still hits uncached data or runtime APIs (`cookies`, `headers`) wrapped in `<Suspense>` boundaries, the upgrade produces a **cached page with those fallbacks**. The uncached or runtime parts stream in at request time.
- Params are resolved in route order. A param value not returned by `generateStaticParams` stays unresolved and prevents any deeper params from upgrading.

## Choosing what to prerender

Not every route needs to be prerendered. Every page you prerender increases build work and produces output that has to be stored and deployed. Many routes may never be visited before your next deployment, making that work unnecessary.

Instead, use [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) to prerender the routes that benefit most from being ready ahead of time, such as popular pages or predictable content. Less frequently visited routes are generated on demand and upgraded after their first visit, so you don't spend build time and storage on pages that may never be requested.

## Coming from the Pages Router

If you are migrating from the Pages Router:

- `fallback: true` in `getStaticPaths` is now the default behavior with `cacheComponents`. Visitors get a `<Suspense>` fallback instantly and content streams in.
- `router.isFallback` is not needed. The prerendering step generates a static shell, and you can grow it further with `'use cache'`.
- `getStaticProps` with `revalidate` maps to `'use cache'` with [`cacheLife`](/docs/app/api-reference/functions/cacheLife).
- `getStaticPaths` maps to [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params).

## Next steps

- [Caching with Cache Components](/docs/app/getting-started/caching) for the full caching model
- [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) for controlling which param combinations are prerendered
- [`loading.tsx`](/docs/app/api-reference/file-conventions/loading) for providing skeleton UI in App Shells
- [Streaming](/docs/app/guides/streaming) to learn how to progressively render UI as data becomes available
- [Self-hosting](/docs/app/guides/self-hosting#caching-and-isr) to keep an existing ISR [`cacheHandler`](/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath) alongside [`cacheHandlers`](/docs/app/api-reference/config/next-config-js/cacheHandlers) for `'use cache'`


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-implement-incremental-static-regeneration-isr"></a>

## How to implement Incremental Static Regeneration (ISR)

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/incremental-static-regeneration](https://nextjs.org/docs/app/guides/incremental-static-regeneration)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to create or update static pages at runtime with Incremental Static Regeneration.*  

---

<details>
  <summary>Examples</summary>

- [Next.js Commerce](https://vercel.com/templates/next.js/nextjs-commerce)
- [On-Demand ISR](https://on-demand-isr.vercel.app)
- [Next.js Forms](https://github.com/vercel/next.js/tree/canary/examples/next-forms)

</details>

> **Good to know**: This guide covers ISR without Cache Components. If you are using [`cacheComponents`](/docs/app/api-reference/config/next-config-js/cacheComponents), see [ISR with Cache Components](/docs/app/guides/incremental-static-regeneration-cache-components) instead.

Incremental Static Regeneration (ISR) enables you to:

- Update static content without rebuilding the entire site
- Reduce server load by serving prerendered, static pages for most requests
- Ensure proper `cache-control` headers are automatically added to pages
- Handle large amounts of content pages without long `next build` times

Here's a minimal example:

```tsx
// Archivo: app/blog/[id]/page.tsx switcher
interface Post {
  id: string
  title: string
  content: string
}

// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60

export async function generateStaticParams() {
  const posts: Post[] = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )
  return posts.map((post) => ({
    id: String(post.id),
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post: Post = await fetch(`https://api.vercel.app/blog/${id}`).then(
    (res) => res.json()
  )
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
```

```jsx
// Archivo: app/blog/[id]/page.jsx switcher
// Next.js will invalidate the cache when a
// request comes in, at most once every 60 seconds.
export const revalidate = 60

export async function generateStaticParams() {
  const posts = await fetch('https://api.vercel.app/blog').then((res) =>
    res.json()
  )
  return posts.map((post) => ({
    id: String(post.id),
  }))
}

export default async function Page({ params }) {
  const { id } = await params
  const post = await fetch(`https://api.vercel.app/blog/${id}`).then((res) =>
    res.json()
  )
  return (
    <main>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </main>
  )
}
```

Here's how this example works:

1. [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) enables ISR for the dynamic route by returning the list of posts to prerender
2. During `next build`, a page is prerendered for each post
3. All requests made to these pages (e.g. `/blog/1`) are cached and instantaneous
4. After 60 seconds has passed, the next request will still return the cached (now stale) page
5. The cache is invalidated and a new version of the page begins generating in the background
6. Once generated successfully, the next request will return the updated page and cache it for subsequent requests
7. If `/blog/26` is requested, and it exists, the page will be generated on-demand. This behavior can be changed by using a different [dynamicParams](/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams) value. However, if the post does not exist, then 404 is returned.

> 📘 **Nota para Pages Router:**
> ```tsx filename="pages/blog/[id].tsx" switcher
> import type { GetStaticPaths, GetStaticProps } from 'next'
> 
> interface Post {
>   id: string
>   title: string
>   content: string
> }
> 
> interface Props {
>   post: Post
> }
> 
> export const getStaticPaths: GetStaticPaths = async () => {
>   const posts = await fetch('https://api.vercel.app/blog').then((res) =>
>     res.json()
>   )
>   const paths = posts.map((post: Post) => ({
>     params: { id: String(post.id) },
>   }))
> 
>   return { paths, fallback: 'blocking' }
> }
> 
> export const getStaticProps: GetStaticProps<Props> = async ({
>   params,
> }: {
>   params: { id: string }
> }) => {
>   const post = await fetch(`https://api.vercel.app/blog/${params.id}`).then(
>     (res) => res.json()
>   )
> 
>   return {
>     props: { post },
>     // Next.js will invalidate the cache when a
>     // request comes in, at most once every 60 seconds.
>     revalidate: 60,
>   }
> }
> 
> export default function Page({ post }: Props) {
>   return (
>     <main>
>       <h1>{post.title}</h1>
>       <p>{post.content}</p>
>     </main>
>   )
> }
> ```
> 
> ```jsx filename="pages/blog/[id].jsx" switcher
> export async function getStaticPaths() {
>   const posts = await fetch('https://api.vercel.app/blog').then((res) =>
>     res.json()
>   )
>   const paths = posts.map((post) => ({
>     params: { id: post.id },
>   }))
> 
>   return { paths, fallback: 'blocking' }
> }
> 
> export async function getStaticProps({ params }) {
>   const post = await fetch(`https://api.vercel.app/blog/${params.id}`).then(
>     (res) => res.json()
>   )
> 
>   return {
>     props: { post },
>     // Next.js will invalidate the cache when a
>     // request comes in, at most once every 60 seconds.
>     revalidate: 60,
>   }
> }
> 
> export default function Page({ post }) {
>   return (
>     <main>
>       <h1>{post.title}</h1>
>       <p>{post.content}</p>
>     </main>
>   )
> }
> ```
> 
> Here's how this example works:
> 
> 1. During `next build`, all known blog posts are generated
> 2. All requests made to these pages (e.g. `/blog/1`) are cached and instantaneous
> 3. After 60 seconds has passed, the next request will still return the cached (now stale) page
> 4. The cache is invalidated and a new version of the page begins generating in the background
> 5. Once generated successfully, the next request will return the updated page and cache it for subsequent requests
> 6. If `/blog/26` is requested, and it exists, the page will be generated on-demand. This behavior can be changed by using a different [fallback](/docs/pages/api-reference/functions/get-static-paths#fallback-false) value. However, if the post does not exist, then 404 is returned.

## Reference

### Route segment config

- [`revalidate`](/docs/app/guides/caching-without-cache-components#route-segment-config-revalidate)
- [`dynamicParams`](/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams)

### Functions

- [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params)
- [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath)
- [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag)

> 📘 **Nota para Pages Router:**
> ### Functions
> 
> - [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props)
> - [`res.revalidate`](/docs/pages/building-your-application/routing/api-routes#response-helpers)

## Examples

### Time-based revalidation

This fetches and displays a list of blog posts on /blog. After an hour has passed, the next visitor will still receive the cached (stale) version of the page immediately for a fast response. Simultaneously, Next.js triggers regeneration of a fresh version in the background. Once the new version is successfully generated, it replaces the cached version, and subsequent visitors will receive the updated content.

```tsx
// Archivo: app/blog/page.tsx switcher
interface Post {
  id: string
  title: string
  content: string
}

export const revalidate = 3600 // invalidate every hour

export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts: Post[] = await data.json()
  return (
    <main>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  )
}
```

```jsx
// Archivo: app/blog/page.js switcher
export const revalidate = 3600 // invalidate every hour

export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog')
  const posts = await data.json()
  return (
    <main>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </main>
  )
}
```

We recommend setting a high revalidation time. For instance, 1 hour instead of 1 second. If you need more precision, consider using on-demand revalidation. If you need real-time data, consider switching to [dynamic rendering](/docs/app/glossary#dynamic-rendering).

### On-demand revalidation with `revalidatePath`

For a more precise method of revalidation, invalidate cached pages on-demand with the `revalidatePath` function.

For example, this Server Action would get called after adding a new post. Regardless of how you retrieve your data in your Server Component, either using `fetch` or connecting to a database, this will invalidate the cache for the entire route. The next request to that route will trigger regeneration and serve fresh data, which will then be cached for subsequent requests.

> **Note:** `revalidatePath` invalidates the cache entries but regeneration happens on the next request. If you want to eagerly regenerate the cache entry immediately instead of waiting for the next request, you can use the Pages router [`res.revalidate`](/docs/pages/guides/incremental-static-regeneration#on-demand-validation-with-resrevalidate) method. We're working on adding new methods to provide eager regeneration capabilities for the App Router.

```ts
// Archivo: app/actions.ts switcher
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  // Invalidate the cache for the /posts route
  revalidatePath('/posts')
}
```

```js
// Archivo: app/actions.js switcher
'use server'

import { revalidatePath } from 'next/cache'

export async function createPost() {
  // Invalidate the cache for the /posts route
  revalidatePath('/posts')
}
```

[View a demo](https://on-demand-isr.vercel.app) and [explore the source code](https://github.com/vercel/on-demand-isr).

### On-demand revalidation with `revalidateTag`

For most use cases, prefer revalidating entire paths. If you need more granular control, you can use the `revalidateTag` function. For example, you can tag individual `fetch` calls:

```tsx
// Archivo: app/blog/page.tsx switcher
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog', {
    next: { tags: ['posts'] },
  })
  const posts = await data.json()
  // ...
}
```

```jsx
// Archivo: app/blog/page.js switcher
export default async function Page() {
  const data = await fetch('https://api.vercel.app/blog', {
    next: { tags: ['posts'] },
  })
  const posts = await data.json()
  // ...
}
```

If you are using an ORM or connecting to a database, you can use `unstable_cache`:

```tsx
// Archivo: app/blog/page.tsx switcher
import { unstable_cache } from 'next/cache'
import { db, posts } from '@/lib/db'

const getCachedPosts = unstable_cache(
  async () => {
    return await db.select().from(posts)
  },
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
)

export default async function Page() {
  const posts = getCachedPosts()
  // ...
}
```

```jsx
// Archivo: app/blog/page.js switcher
import { unstable_cache } from 'next/cache'
import { db, posts } from '@/lib/db'

const getCachedPosts = unstable_cache(
  async () => {
    return await db.select().from(posts)
  },
  ['posts'],
  { revalidate: 3600, tags: ['posts'] }
)

export default async function Page() {
  const posts = getCachedPosts()
  // ...
}
```

You can then use `revalidateTag` in a [Server Actions](/docs/app/getting-started/mutating-data) or [Route Handler](/docs/app/api-reference/file-conventions/route):

```ts
// Archivo: app/actions.ts switcher
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() {
  // Invalidate all data tagged with 'posts'
  revalidateTag('posts', 'max')
}
```

```js
// Archivo: app/actions.js switcher
'use server'

import { revalidateTag } from 'next/cache'

export async function createPost() {
  // Invalidate all data tagged with 'posts'
  revalidateTag('posts', 'max')
}
```

> 📘 **Nota para Pages Router:**
> ### On-demand validation with `res.revalidate()`
> 
> For a more precise method of revalidation, use `res.revalidate` to generate a new page on-demand from an API Router.
> 
> For example, this API Route can be called at `/api/revalidate?secret=<token>` to revalidate a given blog post. Create a secret token only known by your Next.js app. This secret will be used to prevent unauthorized access to the revalidation API Route.
> 
> ```ts filename="pages/api/revalidate.ts" switcher
> import type { NextApiRequest, NextApiResponse } from 'next'
> 
> export default async function handler(
>   req: NextApiRequest,
>   res: NextApiResponse
> ) {
>   // Check for secret to confirm this is a valid request
>   if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
>     return res.status(401).json({ message: 'Invalid token' })
>   }
> 
>   try {
>     // This should be the actual path not a rewritten path
>     // e.g. for "/posts/[id]" this should be "/posts/1"
>     await res.revalidate('/posts/1')
>     return res.json({ revalidated: true })
>   } catch (err) {
>     // If there was an error, Next.js will continue
>     // to show the last successfully generated page
>     return res.status(500).send('Error revalidating')
>   }
> }
> ```
> 
> ```js filename="pages/api/revalidate.js" switcher
> export default async function handler(req, res) {
>   // Check for secret to confirm this is a valid request
>   if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
>     return res.status(401).json({ message: 'Invalid token' })
>   }
> 
>   try {
>     // This should be the actual path not a rewritten path
>     // e.g. for "/posts/[id]" this should be "/posts/1"
>     await res.revalidate('/posts/1')
>     return res.json({ revalidated: true })
>   } catch (err) {
>     // If there was an error, Next.js will continue
>     // to show the last successfully generated page
>     return res.status(500).send('Error revalidating')
>   }
> }
> ```
> 
> If you are using on-demand revalidation, you do not need to specify a `revalidate` time inside of `getStaticProps`. Next.js will use the default value of `false` (no revalidation) and only revalidate the page on-demand when `res.revalidate()` is called.

### Handling uncaught exceptions

If an error is thrown while attempting to revalidate data, the last successfully generated data will continue to be served from the cache. On the next subsequent request, Next.js will retry revalidating the data. [Learn more about error handling](/docs/app/getting-started/error-handling).

> 📘 **Nota para Pages Router:**
> If there is an error inside `getStaticProps` when handling background regeneration, or you manually throw an error, the last successfully generated page will continue to show. On the next subsequent request, Next.js will retry calling `getStaticProps`.
> 
> ```tsx filename="pages/blog/[id].tsx" switcher
> import type { GetStaticProps } from 'next'
> 
> interface Post {
>   id: string
>   title: string
>   content: string
> }
> 
> interface Props {
>   post: Post
> }
> 
> export const getStaticProps: GetStaticProps<Props> = async ({
>   params,
> }: {
>   params: { id: string }
> }) => {
>   // If this request throws an uncaught error, Next.js will
>   // not invalidate the currently shown page and
>   // retry getStaticProps on the next request.
>   const res = await fetch(`https://api.vercel.app/blog/${params.id}`)
>   const post: Post = await res.json()
> 
>   if (!res.ok) {
>     // If there is a server error, you might want to
>     // throw an error instead of returning so that the cache is not updated
>     // until the next successful request.
>     throw new Error(`Failed to fetch posts, received status ${res.status}`)
>   }
> 
>   return {
>     props: { post },
>     // Next.js will invalidate the cache when a
>     // request comes in, at most once every 60 seconds.
>     revalidate: 60,
>   }
> }
> ```
> 
> ```jsx filename="pages/blog/[id].jsx" switcher
> export async function getStaticProps({ params }) {
>   // If this request throws an uncaught error, Next.js will
>   // not invalidate the currently shown page and
>   // retry getStaticProps on the next request.
>   const res = await fetch(`https://api.vercel.app/blog/${params.id}`)
>   const post = await res.json()
> 
>   if (!res.ok) {
>     // If there is a server error, you might want to
>     // throw an error instead of returning so that the cache is not updated
>     // until the next successful request.
>     throw new Error(`Failed to fetch posts, received status ${res.status}`)
>   }
> 
>   return {
>     props: { post },
>     // Next.js will invalidate the cache when a
>     // request comes in, at most once every 60 seconds.
>     revalidate: 60,
>   }
> }
> ```

### Customizing the cache location

You can configure the Next.js cache location if you want to persist cached pages and data to durable storage, or share the cache across multiple containers or instances of your Next.js application. [Learn more](/docs/app/guides/self-hosting#caching-and-isr).

## Troubleshooting

### Debugging cached data in local development

If you are using the `fetch` API, you can add additional logging to understand which requests are cached or uncached. [Learn more about the `logging` option](/docs/app/api-reference/config/next-config-js/logging).

```jsx
// Archivo: next.config.js
module.exports = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}
```

### Verifying correct production behavior

To verify your pages are cached and revalidated correctly in production, you can test locally by running `next build` and then `next start` to run the production Next.js server.

This will allow you to test ISR behavior as it would work in a production environment. For further debugging, add the following environment variable to your `.env` file:

```bash
// Archivo: .env
NEXT_PRIVATE_DEBUG_CACHE=1
```

This will make the Next.js server console log ISR cache hits and misses. You can inspect the output to see which pages are generated during `next build`, as well as how pages are updated as paths are accessed on-demand.

## Caveats

- ISR is only supported when using the Node.js runtime (default).
- ISR is not supported when creating a [Static Export](/docs/app/guides/static-exports).
- If you have multiple `fetch` requests in a prerendered route, and each has a different `revalidate` frequency, the lowest time will be used for ISR. However, those revalidate frequencies will still be respected by the [cache](/docs/app/getting-started/caching).
- If any of the `fetch` requests used on a route have a `revalidate` time of `0`, or an explicit `no-store`, the route will be dynamically rendered.
- Proxy won't be executed for on-demand ISR requests, meaning any path rewrites or logic in Proxy will not be applied. Ensure you are revalidating the exact path. For example, `/post/1` instead of a rewritten `/post-1`.
- When running multiple instances, the default file-system cache is per-instance. On-demand revalidation only invalidates the instance that receives the call. Use a shared [custom cache handler](/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath) to coordinate across instances. See [How Revalidation Works](/docs/app/guides/how-revalidation-works) for the full architecture.
- Background regeneration (stale-while-revalidate) runs on the instance that receives the triggering request. On platforms with per-request billing, this background work counts as additional compute.
- You can use the `x-nextjs-cache` response header to observe cache behavior. Values are `HIT` (served from cache), `STALE` (served from cache, revalidating in background), `MISS` (not in cache, rendered fresh), or `REVALIDATED` (regenerated via on-demand revalidation).

> 📘 **Nota para Pages Router:**
> - ISR is only supported when using the Node.js runtime (default).
> - ISR is not supported when creating a [Static Export](/docs/app/guides/static-exports).
> - Proxy won't be executed for on-demand ISR requests, meaning any path rewrites or logic in Proxy will not be applied. Ensure you are revalidating the exact path. For example, `/post/1` instead of a rewritten `/post-1`.

## Platform Support

| Deployment Option                                                   | Supported         |
| ------------------------------------------------------------------- | ----------------- |
| [Node.js server](/docs/app/getting-started/deploying#nodejs-server) | Yes               |
| [Docker container](/docs/app/getting-started/deploying#docker)      | Yes               |
| [Static export](/docs/app/getting-started/deploying#static-export)  | No                |
| [Adapters](/docs/app/getting-started/deploying#adapters)            | Platform-specific |

Learn how to [configure ISR](/docs/app/guides/self-hosting#caching-and-isr) when self-hosting Next.js.

## Version history

| Version   | Changes                                                                             |
| --------- | ----------------------------------------------------------------------------------- |
| `v14.1.0` | Custom `cacheHandler` is stable.                                                    |
| `v13.0.0` | App Router is introduced.                                                           |
| `v12.2.0` | Pages Router: On-Demand ISR is stable                                               |
| `v12.0.0` | Pages Router: [Bot-aware ISR fallback](/blog/next-12#bot-aware-isr-fallback) added. |
| `v9.5.0`  | Pages Router: [Stable ISR introduced](/blog/next-9-5).                              |


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-configure-continuous-integration-ci-build-caching"></a>

## How to configure Continuous Integration (CI) build caching

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/ci-build-caching](https://nextjs.org/docs/pages/guides/ci-build-caching)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to configure CI to cache Next.js builds*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-implement-incremental-static-regeneration-isr"></a>

## How to implement Incremental Static Regeneration (ISR)

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/incremental-static-regeneration](https://nextjs.org/docs/pages/guides/incremental-static-regeneration)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to create or update static pages at runtime with Incremental Static Regeneration.*  

---




[⬆ Subir al inicio del capítulo](#)

---

