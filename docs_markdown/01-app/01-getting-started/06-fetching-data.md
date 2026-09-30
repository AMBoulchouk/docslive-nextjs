# Fetching Data

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
> - `fetch` requests are not cached by default and will block the page from rendering until the request is complete. Use the [`use cache`](/docs/app/api-reference/directives/use-cache) directive to cache results, or wrap the fetching component in [```<Suspense>``
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
        
        ``<Suspense>``}>
          <BlogList />
        `<Suspense>`
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
    ``<Suspense>``
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
    ``<Suspense>``
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

In the example above, the `<Posts>` component is wrapped in a [```<Suspense>``
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
      
      ``<Suspense>``
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

In this example, ``<Suspense>`` allows the playlists to stream in after the artist data loads. However, the page still waits for the artist data before displaying anything. To prevent this, you can wrap the entire page component in a ``<Suspense>`` boundary (for example, using a [`loading.js` file](#with-loadingjs)) to show a loading state immediately.

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

  return isAvailable ? ``<Item>`` : null
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

  return isAvailable ? ``<Item>`` : null
}
```

The item request continues while `checkIsAvailable()` runs. If the page renders ``<Item>``, the identical `fetch` call reuses the request that `preload()` started.
