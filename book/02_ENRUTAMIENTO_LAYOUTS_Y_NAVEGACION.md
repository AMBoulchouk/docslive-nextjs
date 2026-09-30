# Capítulo 2: Enrutamiento, Layouts y Navegación (App Router)

> 📌 **Capítulo 02** | Libro Guía Next.js v16.3.7  
> 📝 **Resumen:** *Layouts anidados, páginas, navegación dinámica, Link component, Route Handlers y organización de rutas.*  
> 📄 **Temas incluidos en este capítulo:** 7 secciones  

[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)

---

## Contenido del Capítulo

- [Layouts and Pages](#layouts-and-pages)
- [Linking and Navigating](#linking-and-navigating)
- [Route Handlers](#route-handlers)
- [Adopting Partial Prefetching](#adopting-partial-prefetching)
- [How to preview content with Draft Mode in Next.js](#how-to-preview-content-with-draft-mode-in-nextjs)
- [Ensuring instant navigations](#ensuring-instant-navigations)
- [How to handle redirects in Next.js](#how-to-handle-redirects-in-nextjs)

---

<a id="layouts-and-pages"></a>

## Layouts and Pages

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/layouts-and-pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to create your first pages and layouts, and link between them with the Link component.*  

---

Next.js uses **file-system based routing**, meaning you can use folders and files to define routes. This page will guide you through how to create layouts and pages, and link between them.

## Creating a page

A **page** is UI that is rendered on a specific route. To create a page, add a [`page` file](/docs/app/api-reference/file-conventions/page) inside the `app` directory and default export a React component. For example, to create an index page (`/`):

![page.js special file]()

```tsx
// Archivo: app/page.tsx switcher
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

```jsx
// Archivo: app/page.js switcher
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

## Creating a layout

A layout is UI that is **shared** between multiple pages. On navigation, layouts preserve state, remain interactive, and do not rerender.

You can define a layout by default exporting a React component from a [`layout` file](/docs/app/api-reference/file-conventions/layout). The component should accept a `children` prop which can be a page or another [layout](#nesting-layouts).

For example, to create a layout that accepts your index page as child, add a `layout` file inside the `app` directory:

![layout.js special file]()

```tsx
// Archivo: app/layout.tsx switcher
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        
        
        <main>{children}</main>
      </body>
    </html>
  )
}
```

```jsx
// Archivo: app/layout.js switcher
export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        
        <main>{children}</main>
      </body>
    </html>
  )
}
```

The layout above is called a [root layout](/docs/app/api-reference/file-conventions/layout#root-layout) because it's defined at the root of the `app` directory. The root layout is **required** and must contain `html` and `body` tags.

## Creating a nested route

A nested route is a route composed of multiple URL segments. For example, the `/blog/[slug]` route is composed of three segments:

- `/` (Root Segment)
- `blog` (Segment)
- `[slug]` (Leaf Segment)

In Next.js:

- **Folders** are used to define the route segments that map to URL segments.
- **Files** (like `page` and `layout`) are used to create UI that is shown for a segment.

To create nested routes, you can nest folders inside each other. For example, to add a route for `/blog`, create a folder called `blog` in the `app` directory. Then, to make `/blog` publicly accessible, add a `page.tsx` file:

![File hierarchy showing blog folder and a page.js file]()

```tsx
// Archivo: app/blog/page.tsx switcher
// Dummy imports
import { getPosts } from '@/lib/posts'
import { Post } from '@/ui/post'

export default async function Page() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  )
}
```

```jsx
// Archivo: app/blog/page.js switcher
// Dummy imports
import { getPosts } from '@/lib/posts'
import { Post } from '@/ui/post'

export default async function Page() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  )
}
```

You can continue nesting folders to create nested routes. For example, to create a route for a specific blog post, create a new `[slug]` folder inside `blog` and add a `page` file:

![File hierarchy showing blog folder with a nested slug folder and a page.js file]()

```tsx
// Archivo: app/blog/[slug]/page.tsx switcher
export function generateStaticParams() {}

export default function Page() {
  return <h1>Hello, Blog Post Page!</h1>
}
```

```jsx
// Archivo: app/blog/[slug]/page.js switcher
export function generateStaticParams() {}

export default function Page() {
  return <h1>Hello, Blog Post Page!</h1>
}
```

Wrapping a folder name in square brackets (e.g. `[slug]`) creates a [dynamic route segment](/docs/app/api-reference/file-conventions/dynamic-routes) which is used to generate multiple pages from data. e.g. blog posts, product pages, etc.

## Nesting layouts

By default, layouts in the folder hierarchy are also nested, which means they wrap child layouts via their `children` prop. You can nest layouts by adding `layout` inside specific route segments (folders).

For example, to create a layout for the `/blog` route, add a new `layout` file inside the `blog` folder.

![File hierarchy showing root layout wrapping the blog layout]()

```tsx
// Archivo: app/blog/layout.tsx switcher
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}
```

```jsx
// Archivo: app/blog/layout.js switcher
export default function BlogLayout({ children }) {
  return <section>{children}</section>
}
```

If you were to combine the two layouts above, the root layout (`app/layout.js`) would wrap the blog layout (`app/blog/layout.js`), which would wrap the blog (`app/blog/page.js`) and blog post page (`app/blog/[slug]/page.js`).

## Creating a dynamic segment

[Dynamic segments](/docs/app/api-reference/file-conventions/dynamic-routes) allow you to create routes that are generated from data. For example, instead of manually creating a route for each individual blog post, you can create a dynamic segment to generate the routes based on blog post data.

To create a dynamic segment, wrap the segment (folder) name in square brackets: `[segmentName]`. For example, in the `app/blog/[slug]/page.tsx` route, the `[slug]` is the dynamic segment.

```tsx
// Archivo: app/blog/[slug]/page.tsx switcher
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

```jsx
// Archivo: app/blog/[slug]/page.js switcher
export default async function BlogPostPage({ params }) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

Learn more about [Dynamic Segments](/docs/app/api-reference/file-conventions/dynamic-routes) and the [`params`](/docs/app/api-reference/file-conventions/page#params-optional) props.

Nested [layouts within Dynamic Segments](/docs/app/api-reference/file-conventions/layout#params-optional) can also access the `params` props.

## Rendering with search params

In a Server Component **page**, you can access search parameters using the [`searchParams`](/docs/app/api-reference/file-conventions/page#searchparams-optional) prop:

```tsx
// Archivo: app/page.tsx switcher
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const filters = (await searchParams).filters
}
```

```jsx
// Archivo: app/page.jsx switcher
export default async function Page({ searchParams }) {
  const filters = (await searchParams).filters
}
```

Using `searchParams` opts your page into [**dynamic rendering**](/docs/app/glossary#dynamic-rendering) because it requires an incoming request to read the search parameters from.

Client Components can read search params using the [`useSearchParams`](/docs/app/api-reference/functions/use-search-params) hook.

Learn more about `useSearchParams` in [prerendered](/docs/app/api-reference/functions/use-search-params#prerendering) and [dynamically rendered](/docs/app/api-reference/functions/use-search-params#dynamic-rendering) routes.

### What to use and when

- Use the `searchParams` prop when you need search parameters to **load data for the page** (e.g. pagination, filtering from a database).
- Use `useSearchParams` when search parameters are used **only on the client** (e.g. filtering a list already loaded via props).
- As a small optimization, you can use `new URLSearchParams(window.location.search)` in **callbacks or event handlers** to read search params without triggering re-renders.

## Linking between pages

You can use the [`<Link>` component](/docs/app/api-reference/components/link) to navigate between routes. `<Link>` is a built-in Next.js component that extends the HTML `<a>` tag to provide [prefetching](/docs/app/getting-started/linking-and-navigating#prefetching) and [client-side navigation](/docs/app/getting-started/linking-and-navigating#client-side-transitions).

For example, to generate a list of blog posts, import `<Link>` from `next/link` and pass a `href` prop to the component:

```tsx
// Archivo: app/ui/post.tsx highlight={1,2,11} switcher
import Link from 'next/link'
import { getPosts } from '@/lib/posts'

export default async function Posts() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

```jsx
// Archivo: app/ui/post.js highlight={1,2,11} switcher
import Link from 'next/link'
import { getPosts } from '@/lib/posts'

export default async function Posts() {
  const posts = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

> **Good to know**: `<Link>` is the primary way to navigate between routes in Next.js. You can also use the [`useRouter` hook](/docs/app/api-reference/functions/use-router) for more advanced navigation.

## Route Props Helpers

Next.js exposes utility types that infer `params` and named slots from your route structure:

- [**PageProps**](/docs/app/api-reference/file-conventions/page#page-props-helper): Props for `page` components, including `params` and `searchParams`.
- [**LayoutProps**](/docs/app/api-reference/file-conventions/layout#layout-props-helper): Props for `layout` components, including `children` and any named slots (e.g. folders like `@analytics`).

These are globally available helpers, generated when running either `next dev`, `next build` or [`next typegen`](/docs/app/api-reference/cli/next#next-typegen-options).

```tsx
// Archivo: app/blog/[slug]/page.tsx
export default async function Page(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  return <h1>Blog post: {slug}</h1>
}
```

```tsx
// Archivo: app/dashboard/layout.tsx
export default function Layout(props: LayoutProps<'/dashboard'>) {
  return (
    <section>
      {props.children}
      
      
    </section>
  )
}
```

> **Good to know**
>
> - Static routes resolve `params` to `{}`.
> - `PageProps`, `LayoutProps` are global helpers — no imports required.
> - Types are generated during `next dev`, `next build` or `next typegen`.



[⬆ Subir al inicio del capítulo](#)

---

<a id="linking-and-navigating"></a>

## Linking and Navigating

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/linking-and-navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how the built-in navigation optimizations work, including prefetching, prerendering, and client-side navigation, and how to optimize navigation for dynamic routes and slow networks.*  

---

In Next.js, routes are rendered on the server by default. This often means the client has to wait for a server response before a new route can be shown. Next.js comes with built-in [prefetching](#prefetching), [streaming](#streaming), and [client-side transitions](#client-side-transitions) ensuring navigation stays fast and responsive.

This guide explains how navigation works in Next.js and how you can optimize it for [dynamic routes](#dynamic-routes-without-loadingtsx) and [slow networks](#slow-networks).

## How navigation works

To understand how navigation works in Next.js, it helps to be familiar with the following concepts:

- [Server Rendering](#server-rendering)
- [Prefetching](#prefetching)
- [Streaming](#streaming)
- [Client-side transitions](#client-side-transitions)

### Server Rendering

In Next.js, [Layouts and Pages](/docs/app/getting-started/layouts-and-pages) are [React Server Components](https://react.dev/reference/rsc/server-components) by default. On initial and subsequent navigations, the [Server Component Payload](/docs/app/getting-started/server-and-client-components#how-do-server-and-client-components-work-in-nextjs) is generated on the server before being sent to the client.

There are two types of server rendering, based on _when_ it happens:

- **Prerendering** happens at build time or during [revalidation](/docs/app/getting-started/revalidating) and the result is cached.
- **Dynamic Rendering** happens at request time in response to a client request.

The trade-off of server rendering is that the client must wait for the server to respond before the new route can be shown. Next.js addresses this delay by [prefetching](#prefetching) routes the user is likely to visit and performing [client-side transitions](#client-side-transitions).

> **Good to know**: HTML is also generated for the initial visit.

### Prefetching

Prefetching is the process of loading a route in the background before the user navigates to it. This makes navigation between routes in your application feel instant, because by the time a user clicks on a link, the data to render the next route is already available client side.

Next.js automatically prefetches routes linked with the [`<Link>` component](/docs/app/api-reference/components/link) when they enter the user's viewport.

```tsx
// Archivo: app/layout.tsx switcher
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <nav>
          
          [Blog](/blog)
          
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

```jsx
// Archivo: app/layout.js switcher
import Link from 'next/link'

export default function Layout({ children }) {
  return (
    <html>
      <body>
        <nav>
          
          [Blog](/blog)
          
          <a href="/contact">Contact</a>
        </nav>
        {children}
      </body>
    </html>
  )
}
```

How much of the route is prefetched depends on whether it's static or dynamic:

- **Static Route**: the full route is prefetched.
- **Dynamic Route**: prefetching is skipped, or the route is partially prefetched if [`loading.tsx`](/docs/app/api-reference/file-conventions/loading) is present.

By skipping or partially prefetching dynamic routes, Next.js avoids unnecessary work on the server for routes the users may never visit. However, waiting for a server response before navigation can give the users the impression that the app is not responding.

![Server Rendering without Streaming]()

> **Good to know:** See the [Prefetching guide](/docs/app/guides/prefetching) for the full behavior, including how to control prefetching per link and how it changes when you adopt [Partial Prefetching](/docs/app/guides/adopting-partial-prefetching).

To improve the navigation experience to dynamic routes, you can use [streaming](#streaming).

### Streaming

Streaming allows the server to send parts of a dynamic route to the client as soon as they're ready, rather than waiting for the entire route to be rendered. This means users see something sooner, even if parts of the page are still loading. See the [Streaming guide](/docs/app/guides/streaming) for a deep dive into how streaming works in Next.js.

For dynamic routes, it means they can be **partially prefetched**. That is, shared layouts and loading skeletons can be requested ahead of time.

![How Server Rendering with Streaming Works]()

To use streaming, create a `loading.tsx` in your route folder:

![loading.js special file]()

```tsx
// Archivo: app/dashboard/loading.tsx switcher
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return <LoadingSkeleton />
}
```

```jsx
// Archivo: app/dashboard/loading.js switcher
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return <LoadingSkeleton />
}
```

Behind the scenes, Next.js will automatically wrap the `page.tsx` contents in a ``<Suspense>`` boundary. The prefetched fallback UI will be shown while the route is loading, and swapped for the actual content once ready.

> **Good to know**: You can also use [``<Suspense>``](https://react.dev/reference/react/Suspense) to create loading UI for nested components.

Benefits of `loading.tsx`:

- Immediate navigation and visual feedback for the user.
- Shared layouts remain interactive and navigation is interruptible.
- Improved Core Web Vitals: [TTFB](https://web.dev/articles/ttfb), [FCP](https://web.dev/articles/fcp), and [TTI](https://web.dev/articles/tti).

To further improve the navigation experience, Next.js performs a [client-side transition](#client-side-transitions) with the `<Link>` component.

### Client-side transitions

Traditionally, navigation to a server-rendered page triggers a full page load. This clears state, resets scroll position, and blocks interactivity.

Next.js avoids this with client-side transitions using the `<Link>` component. Instead of reloading the page, it updates the content dynamically by:

- Keeping any shared layouts and UI.
- Replacing the current page with the prefetched loading state or a new page if available.

Client-side transitions make server-rendered apps _feel_ like client-rendered apps. And when paired with [prefetching](#prefetching) and [streaming](#streaming), they enable fast transitions, even for dynamic routes.

Next.js also handles [scrolling to the top of the page](/docs/app/api-reference/components/link#scroll) during client-side transitions. If content scrolls behind a sticky or fixed header after navigation, you can fix this with CSS [`scroll-padding-top`](/docs/app/api-reference/components/link#scroll-offset-with-sticky-headers).

## What can make transitions slow?

These Next.js optimizations make navigation fast and responsive. However, under certain conditions, transitions can still _feel_ slow. Here are some common causes and how to improve the user experience:

### Dynamic routes without `loading.tsx`

When navigating to a dynamic route, the client must wait for the server response before showing the result. This can give the users the impression that the app is not responding.

We recommend adding `loading.tsx` to dynamic routes to enable partial prefetching, trigger immediate navigation, and display a loading UI while the route renders.

```tsx
// Archivo: app/blog/[slug]/loading.tsx switcher
export default function Loading() {
  return <LoadingSkeleton />
}
```

```jsx
// Archivo: app/blog/[slug]/loading.js switcher
export default function Loading() {
  return <LoadingSkeleton />
}
```

> **Good to know**: In development mode, you can use the Next.js Devtools to identify if the route is static or dynamic. See [`devIndicators`](/docs/app/api-reference/config/next-config-js/devIndicators) for more information.

### Dynamic segments without `generateStaticParams`

If a [dynamic segment](/docs/app/api-reference/file-conventions/dynamic-routes) could be prerendered but isn't because it's missing [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params), the route will fallback to dynamic rendering at request time.

Ensure the route is statically generated at build time by adding `generateStaticParams`:

```tsx
// Archivo: app/blog/[slug]/page.tsx switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

```jsx
// Archivo: app/blog/[slug]/page.js switcher
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function Page({ params }) {
  const { slug } = await params
  // ...
}
```

### Slow networks

On slow or unstable networks, prefetching may not finish before the user clicks a link. This can affect both static and dynamic routes. In these cases, the `loading.js` fallback may not appear immediately because it hasn't been prefetched yet.

To improve perceived performance, you can use the [`useLinkStatus` hook](/docs/app/api-reference/functions/use-link-status) to show immediate feedback while the transition is in progress.

```tsx
// Archivo: app/ui/loading-indicator.tsx switcher
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

```jsx
// Archivo: app/ui/loading-indicator.js switcher
'use client'

import { useLinkStatus } from 'next/link'

export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

You can "debounce" the hint by adding an initial animation delay (e.g. 100ms) and starting as invisible (e.g. `opacity: 0`). This means the loading indicator will only be shown if the navigation takes longer than the specified delay. See the [`useLinkStatus` reference](/docs/app/api-reference/functions/use-link-status#gracefully-handling-fast-navigation) for a CSS example.

> **Good to know**: An **experimental** [`useOffline`](/docs/app/api-reference/config/next-config-js/useOffline) hook can keep prefetched routes navigable during connectivity drops. See the [offline support guide](/docs/app/guides/offline-support).

> **Good to know**: You can use other visual feedback patterns like a progress bar. View an example [here](https://github.com/vercel/react-transition-progress).

### Disabling prefetching

You can opt out of prefetching by setting the `prefetch` prop to `false` on the `<Link>` component. This is useful to avoid unnecessary usage of resources when rendering large lists of links (e.g. an infinite scroll table).

```tsx
<Link prefetch={false} href="/blog">
  Blog
</Link>
```

However, disabling prefetching comes with trade-offs:

- **Static routes** will only be fetched when the user clicks the link.
- **Dynamic routes** will need to be rendered on the server first before the client can navigate to it.

To reduce resource usage without fully disabling prefetch, you can prefetch only on hover. This limits prefetching to routes the user is more _likely_ to visit, rather than all links in the viewport.

```tsx
// Archivo: app/ui/hover-prefetch-link.tsx switcher
'use client'

import Link from 'next/link'
import { useState } from 'react'

function HoverPrefetchLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```

```jsx
// Archivo: app/ui/hover-prefetch-link.js switcher
'use client'

import Link from 'next/link'
import { useState } from 'react'

function HoverPrefetchLink({ href, children }) {
  const [active, setActive] = useState(false)

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```

### Hydration not completed

`<Link>` is a Client Component and must be hydrated before it can prefetch routes. On the initial visit, large JavaScript bundles can delay hydration, preventing prefetching from starting right away.

React mitigates this with Selective Hydration and you can further improve this by:

- Using the [`@next/bundle-analyzer`](/docs/app/guides/package-bundling#nextbundle-analyzer-for-webpack) plugin to identify and reduce bundle size by removing large dependencies.
- Moving logic from the client to the server where possible. See the [Server and Client Components](/docs/app/getting-started/server-and-client-components) docs for guidance.

## Examples

### Native History API

Next.js allows you to use the native [`window.history.pushState`](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState) and [`window.history.replaceState`](https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState) methods to update the browser's history stack without reloading the page.

`pushState` and `replaceState` calls integrate into the Next.js Router, allowing you to sync with [`usePathname`](/docs/app/api-reference/functions/use-pathname) and [`useSearchParams`](/docs/app/api-reference/functions/use-search-params).

#### `window.history.pushState`

Use it to add a new entry to the browser's history stack. The user can navigate back to the previous state. For example, to sort a list of products:

```tsx fileName="app/ui/sort-products.tsx" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

```jsx fileName="app/ui/sort-products.js" switcher
'use client'

import { useSearchParams } from 'next/navigation'

export default function SortProducts() {
  const searchParams = useSearchParams()

  function updateSorting(sortOrder) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', sortOrder)
    window.history.pushState(null, '', `?${params.toString()}`)
  }

  return (
    <>
      <button onClick={() => updateSorting('asc')}>Sort Ascending</button>
      <button onClick={() => updateSorting('desc')}>Sort Descending</button>
    </>
  )
}
```

#### `window.history.replaceState`

Use it to replace the current entry on the browser's history stack. The user is not able to navigate back to the previous state. For example, to switch the application's locale:

```tsx fileName="app/ui/locale-switcher.tsx" switcher
'use client'

import { usePathname } from 'next/navigation'

export function LocaleSwitcher() {
  const pathname = usePathname()

  function switchLocale(locale: string) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
```

```jsx fileName="app/ui/locale-switcher.js" switcher
'use client'

import { usePathname } from 'next/navigation'

export function LocaleSwitcher() {
  const pathname = usePathname()

  function switchLocale(locale) {
    // e.g. '/en/about' or '/fr/contact'
    const newPath = `/${locale}${pathname}`
    window.history.replaceState(null, '', newPath)
  }

  return (
    <>
      <button onClick={() => switchLocale('en')}>English</button>
      <button onClick={() => switchLocale('fr')}>French</button>
    </>
  )
}
```



[⬆ Subir al inicio del capítulo](#)

---

<a id="route-handlers"></a>

## Route Handlers

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/route-handlers](https://nextjs.org/docs/app/getting-started/route-handlers)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Create custom request handlers with Next.js Route Handlers using the Web Request and Response APIs.*  

---

## Route Handlers

Route Handlers allow you to create custom request handlers for a given route using the Web [Request](https://developer.mozilla.org/docs/Web/API/Request) and [Response](https://developer.mozilla.org/docs/Web/API/Response) APIs.

![Route.js Special File]()

> **Good to know**: Route Handlers are only available inside the `app` directory. They are the equivalent of [API Routes](/docs/pages/building-your-application/routing/api-routes) inside the `pages` directory meaning you **do not** need to use API Routes and Route Handlers together.

### Convention

Route Handlers are defined in a [`route.js|ts` file](/docs/app/api-reference/file-conventions/route) inside the `app` directory:

```ts
// Archivo: app/api/route.ts switcher
export async function GET(request: Request) {}
```

```js
// Archivo: app/api/route.js switcher
export async function GET(request) {}
```

Route Handlers can be nested anywhere inside the `app` directory, similar to `page.js` and `layout.js`. But there **cannot** be a `route.js` file at the same route segment level as `page.js`.

### Supported HTTP Methods

The following [HTTP methods](https://developer.mozilla.org/docs/Web/HTTP/Methods) are supported: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`. If an unsupported method is called, Next.js will return a `405 Method Not Allowed` response.

### Extended `NextRequest` and `NextResponse` APIs

In addition to supporting the native [Request](https://developer.mozilla.org/docs/Web/API/Request) and [Response](https://developer.mozilla.org/docs/Web/API/Response) APIs, Next.js extends them with [`NextRequest`](/docs/app/api-reference/functions/next-request) and [`NextResponse`](/docs/app/api-reference/functions/next-response) to provide convenient helpers for advanced use cases.

### Caching

Route Handlers are not cached by default. You can, however, opt into caching for `GET` methods. Other supported HTTP methods are **not** cached. To cache a `GET` method, use a [route config option](/docs/app/guides/caching-without-cache-components#dynamic) such as `export const dynamic = 'force-static'` in your Route Handler file.

```ts
// Archivo: app/items/route.ts switcher
export const dynamic = 'force-static'

export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()

  return Response.json({ data })
}
```

```js
// Archivo: app/items/route.js switcher
export const dynamic = 'force-static'

export async function GET() {
  const res = await fetch('https://data.mongodb-api.com/...', {
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.DATA_API_KEY,
    },
  })
  const data = await res.json()

  return Response.json({ data })
}
```

> **Good to know**: Other supported HTTP methods are **not** cached, even if they are placed alongside a `GET` method that is cached, in the same file.

#### With Cache Components

When [Cache Components](/docs/app/getting-started/caching) is enabled, `GET` Route Handlers follow the same model as normal UI routes in your application. They run at request time by default, can be prerendered when they don't access uncached or runtime data, and you can use `use cache` to include uncached data in the static response.

**Static example** - doesn't access uncached or runtime data, so it will be prerendered at build time:

```tsx
// Archivo: app/api/project-info/route.ts
export async function GET() {
  return Response.json({
    projectName: 'Next.js',
  })
}
```

**Dynamic example** - accesses non-deterministic operations. During the build, prerendering stops when `Math.random()` is called, deferring to request-time rendering:

```tsx
// Archivo: app/api/random-number/route.ts
export async function GET() {
  return Response.json({
    randomNumber: Math.random(),
  })
}
```

**Runtime data example** - accesses request-specific data. Prerendering terminates when runtime APIs like `headers()` are called:

```tsx
// Archivo: app/api/user-agent/route.ts
import { headers } from 'next/headers'

export async function GET() {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent')

  return Response.json({ userAgent })
}
```

> **Good to know**: Prerendering stops if the `GET` handler accesses network requests, database queries, async file system operations, request object properties (like `req.url`, `request.headers`, `request.cookies`, `request.body`), runtime APIs like [`cookies()`](/docs/app/api-reference/functions/cookies), [`headers()`](/docs/app/api-reference/functions/headers), [`connection()`](/docs/app/api-reference/functions/connection), or non-deterministic operations.

**Cached example** - accesses uncached data (database query) but caches it with `use cache`, allowing it to be included in the prerendered response:

```tsx
// Archivo: app/api/products/route.ts
import { cacheLife } from 'next/cache'

export async function GET() {
  const products = await getProducts()
  return Response.json(products)
}

async function getProducts() {
  'use cache'
  cacheLife('hours')

  return await db.query('SELECT * FROM products')
}
```

> **Good to know**: `use cache` cannot be used directly inside a Route Handler body; extract it to a helper function. Cached responses revalidate according to `cacheLife` when a new request arrives.

### Special Route Handlers

Special Route Handlers like [`sitemap.ts`](/docs/app/api-reference/file-conventions/metadata/sitemap), [`opengraph-image.tsx`](/docs/app/api-reference/file-conventions/metadata/opengraph-image), and [`icon.tsx`](/docs/app/api-reference/file-conventions/metadata/app-icons), and other [metadata files](/docs/app/api-reference/file-conventions/metadata) remain static by default unless they use Request-time APIs or dynamic config options.

### Route Resolution

You can consider a `route` the lowest level routing primitive.

- They **do not** participate in layouts or client-side navigations like `page`.
- There **cannot** be a `route.js` file at the same route as `page.js`.

| Page                 | Route              | Result                       |
| -------------------- | ------------------ | ---------------------------- |
| `app/page.js`        | `app/route.js`     | <Cross size={18} /> Conflict |
| `app/page.js`        | `app/api/route.js` | <Check size={18} /> Valid    |
| `app/[user]/page.js` | `app/api/route.js` | <Check size={18} /> Valid    |

Each `route.js` or `page.js` file takes over all HTTP verbs for that route.

```ts
// Archivo: app/page.ts switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}

// Conflict
// `app/route.ts`
export async function POST(request: Request) {}
```

```js
// Archivo: app/page.js switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}

// Conflict
// `app/route.js`
export async function POST(request) {}
```

Read more about how Route Handlers [complement your frontend application](/docs/app/guides/backend-for-frontend), or explore the Route Handlers [API Reference](/docs/app/api-reference/file-conventions/route).

### Route Context Helper

In TypeScript, you can type the `context` parameter for Route Handlers with the globally available [`RouteContext`](/docs/app/api-reference/file-conventions/route#route-context-helper) helper:

```ts
// Archivo: app/users/[id]/route.ts switcher
import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/users/[id]'>) {
  const { id } = await ctx.params
  return Response.json({ id })
}
```

> **Good to know**
>
> - Types are generated during `next dev`, `next build` or `next typegen`.



[⬆ Subir al inicio del capítulo](#)

---

<a id="adopting-partial-prefetching"></a>

## Adopting Partial Prefetching

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



[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-preview-content-with-draft-mode-in-nextjs"></a>

## How to preview content with Draft Mode in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/draft-mode](https://nextjs.org/docs/app/guides/draft-mode)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Bypass Next.js caching for a request so editors can preview unpublished content from a headless CMS.*  

---

**Draft Mode** lets editors see how draft or in-progress content will render on your site, without waiting for revalidation. While an editor is in Draft Mode, cached or pre-rendered content is bypassed, and fetched from upstream sources directly. Other visitors continue to see the cached or pre-rendered version of the page.

Your data-fetching code does not need to change if your CMS serves draft and published content from the same URL. Otherwise, see [When your CMS uses a separate draft endpoint](#when-your-cms-uses-a-separate-draft-endpoint).

## What Draft Mode does

When Draft Mode is enabled for a request:

- `fetch()` calls skip the Next.js fetch cache and hit the network directly.
- Components and functions inside [`'use cache'`](/docs/app/api-reference/directives/use-cache) re-execute on every request, and their results are not saved to the cache.
- [`unstable_cache`](/docs/app/api-reference/functions/unstable_cache) reads and writes are bypassed in the same way.
- The page is excluded from the ISR response cache and is served with `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`.

The effect applies whether the page is statically generated, served from cache, or revalidated through ISR.

## What this guide covers

This guide assumes:

- Your headless CMS supports configurable preview URLs (most do).
- The CMS opens a URL like `/api/draft?secret=XXX&slug=/posts/foo` in a new tab when an editor clicks "Preview". The secret is a shared token; the slug is the path to preview.
- Your Next.js app validates the secret, enables Draft Mode, and redirects to the slug.

With that contract in mind, the rest of this guide walks through:

1. Creating a Route Handler that enables Draft Mode by setting a cookie.
2. Securing that handler with the shared secret and slug from the CMS.
3. Rendering pages that read the latest draft.
4. Showing a preview banner with an exit form.

Then, depending on your setup:

- [Draft Mode with Cache Components](#draft-mode-with-cache-components) for surfacing the preview state from a `'use cache'` boundary.
- [When your CMS uses a separate draft endpoint](#when-your-cms-uses-a-separate-draft-endpoint) for branching the fetch URL on `isEnabled`.

> **Good to know:** `GET` is meant to be a safe, read-only method. Operations that affect future requests, like enabling Draft Mode via a cookie, should use `POST`. The entry handler uses `GET` because we're assuming a CMS preview integration: the CMS opens the URL in a new browser tab, which is a `GET` request. The exit flow in Step 4 uses `POST` (via [Server Action](/docs/app/getting-started/mutating-data) or `POST` Route Handler).

## Step 1: Create a Route Handler

Create a [Route Handler](/docs/app/api-reference/file-conventions/route) that sets the Draft Mode cookie. It can have any name, for example, `app/api/draft/route.ts`.

```ts
// Archivo: app/api/draft/route.ts switcher
import { draftMode } from 'next/headers'

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.enable()
  return new Response('Draft mode is enabled')
}
```

```js
// Archivo: app/api/draft/route.js switcher
import { draftMode } from 'next/headers'

export async function GET(request) {
  const draft = await draftMode()
  draft.enable()
  return new Response('Draft mode is enabled')
}
```

`draft.enable()` sets a cookie named `__prerender_bypass`. Subsequent requests that carry this cookie skip every cache layer listed above.

You can test this manually by visiting `/api/draft` and looking at your browser's developer tools. Notice the `Set-Cookie` response header.

As written, the handler is public: anyone who hits `/api/draft` enables Draft Mode for themselves. Step 2 closes that with a shared secret so only your CMS can call it.

## Step 2: Access the Route Handler from your headless CMS

> These steps assume that the headless CMS you're using supports setting **custom draft URLs**. If it doesn't, you can still use this method to secure your draft URLs, but you'll need to construct and access the draft URL manually. The specific steps will vary depending on which headless CMS you're using.

To securely access the Route Handler from your headless CMS:

1. Create a **secret token string** using a token generator of your choice. This secret is only known to your Next.js app and your headless CMS.
2. If your headless CMS supports setting custom draft URLs, specify a draft URL (this assumes that your Route Handler is located at `app/api/draft/route.ts`). For example:

```bash
// Archivo: Terminal
https://<your-site>/api/draft?secret=<token>&slug=<path>
```

> - `<your-site>` should be your deployment domain.
> - `<token>` should be replaced with the secret token you generated.
> - `<path>` should be the path for the page that you want to view. If you want to view `/posts/one`, then you should use `&slug=/posts/one`.
>
> Your headless CMS might allow you to include a variable in the draft URL so that `<path>` can be set dynamically based on the CMS's data like so: `&slug=/posts/{entry.fields.slug}`

3. In your Route Handler, check that the secret matches and that the `slug` parameter exists (if not, the request should fail), call `draft.enable()` to set the cookie, then redirect the browser to the path specified by `slug`:

```ts
// Archivo: app/api/draft/route.ts switcher
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  // This secret should only be known to this Route Handler and the CMS
  if (secret !== 'MY_SECRET_TOKEN' || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  // Verify the slug exists in the CMS before enabling Draft Mode
  const post = await getPostBySlug(slug)
  if (!post) {
    return new Response('Invalid slug', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  // Redirect to the path from the fetched post, not from searchParams,
  // to avoid open redirect vulnerabilities
  redirect(post.slug)
}
```

```js
// Archivo: app/api/draft/route.js switcher
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')

  if (secret !== 'MY_SECRET_TOKEN' || !slug) {
    return new Response('Invalid token', { status: 401 })
  }

  const post = await getPostBySlug(slug)
  if (!post) {
    return new Response('Invalid slug', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(post.slug)
}
```

If it succeeds, the browser is redirected to the target path with the Draft Mode cookie set.

## Step 3: Preview the draft content

Because Draft Mode bypasses the cache automatically, your page does not need to know whether Draft Mode is on to receive fresh content. Fetch as you normally would:

```tsx
// Archivo: app/posts/[slug]/page.tsx switcher
async function getPost(slug: string) {
  const res = await fetch(`https://cms.example.com/posts/${slug}`)
  return res.json()
}

export default async function Page({ params }: PageProps<'/posts/[slug]'>) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <main>
      <h1>{post.title}</h1>
      <article>{post.content}</article>
    </main>
  )
}
```

```jsx
// Archivo: app/posts/[slug]/page.js switcher
async function getPost(slug) {
  const res = await fetch(`https://cms.example.com/posts/${slug}`)
  return res.json()
}

export default async function Page({ params }) {
  const { slug } = await params
  const post = await getPost(slug)

  return (
    <main>
      <h1>{post.title}</h1>
      <article>{post.content}</article>
    </main>
  )
}
```

When the Draft Mode cookie is present, the `fetch` above skips the Next.js fetch cache and hits your CMS for the current draft. When it is not, the same request can be served from cache as usual.

If your CMS uses a different URL for drafts rather than serving them from the same endpoint, see [When your CMS uses a separate draft endpoint](#when-your-cms-uses-a-separate-draft-endpoint).

## Step 4: Show a preview indicator

`isEnabled` is most useful as a signal to the editor: a banner that confirms they are looking at draft content, plus a way to exit. Render an indicator from your root layout so it appears on every preview page.

```tsx
// Archivo: app/preview-banner.tsx switcher
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

async function exitPreview() {
  'use server'
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}

export async function PreviewBanner() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  return (
    <aside role="status">
      Preview mode is on.{' '}
      <form action={exitPreview}>
        <button type="submit">Exit preview</button>
      </form>
    </aside>
  )
}
```

```jsx
// Archivo: app/preview-banner.js switcher
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

async function exitPreview() {
  'use server'
  const draft = await draftMode()
  draft.disable()
  redirect('/')
}

export async function PreviewBanner() {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  return (
    <aside role="status">
      Preview mode is on.{' '}
      <form action={exitPreview}>
        <button type="submit">Exit preview</button>
      </form>
    </aside>
  )
}
```

Exiting Draft Mode also works with a `GET` Route Handler, but a `POST` is semantically more correct, for example via a form submitted through a [Server Action](/docs/app/getting-started/mutating-data) or to a `POST` Route Handler.

If you do use a `GET` Route Handler, trigger it from a `<form method="GET">` rather than a [`<Link>`](/docs/app/api-reference/components/link). Next.js prefetches `<Link>` components by default, which would clear the cookie before the editor clicks. Forms are not prefetched, regardless of method.

## Draft Mode with Cache Components

You can read `isEnabled` inside a [`'use cache'`](/docs/app/api-reference/directives/use-cache) scope to render a preview indicator from a cached component. The cache bypass still applies, so the component re-executes with fresh data on every draft request.

```tsx
// Archivo: app/posts/[slug]/page.tsx switcher
import { draftMode } from 'next/headers'

async function Post({ slug }: { slug: string }) {
  'use cache'

  const post = await fetch(`https://cms.example.com/posts/${slug}`).then((r) =>
    r.json()
  )
  const { isEnabled } = await draftMode()

  return (
    <article>
      {isEnabled && <p role="status">Draft preview</p>}
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

```jsx
// Archivo: app/posts/[slug]/page.js switcher
import { draftMode } from 'next/headers'

async function Post({ slug }) {
  'use cache'

  const post = await fetch(`https://cms.example.com/posts/${slug}`).then((r) =>
    r.json()
  )
  const { isEnabled } = await draftMode()

  return (
    <article>
      {isEnabled && <p role="status">Draft preview</p>}
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

> **Good to know:** `draftMode().enable()` and `draftMode().disable()` cannot be called inside a caching directive scope; toggle Draft Mode from a [Route Handler](/docs/app/api-reference/file-conventions/route) or [Server Action](/docs/app/getting-started/mutating-data) instead.

## When your CMS uses a separate draft endpoint

If your CMS exposes draft content at a different URL or requires different credentials, branch your fetch on `isEnabled`:

```tsx
// Archivo: app/posts/[slug]/page.tsx switcher
import { draftMode } from 'next/headers'

async function getPost(slug: string) {
  const { isEnabled } = await draftMode()
  const baseUrl = isEnabled
    ? 'https://cms.example.com/preview'
    : 'https://cms.example.com/published'

  const res = await fetch(`${baseUrl}/posts/${slug}`)
  return res.json()
}
```

```jsx
// Archivo: app/posts/[slug]/page.js switcher
import { draftMode } from 'next/headers'

async function getPost(slug) {
  const { isEnabled } = await draftMode()
  const baseUrl = isEnabled
    ? 'https://cms.example.com/preview'
    : 'https://cms.example.com/published'

  const res = await fetch(`${baseUrl}/posts/${slug}`)
  return res.json()
}
```

The cache bypass still applies to both branches; the fork only chooses where to read from.



[⬆ Subir al inicio del capítulo](#)

---

<a id="ensuring-instant-navigations"></a>

## Ensuring instant navigations

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/instant-navigation](https://nextjs.org/docs/app/guides/instant-navigation)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to structure your app to prefetch and prerender more content, providing instant page loads and client navigations.*  

---

This guide walks through understanding instant navigations, writing a route that navigates instantly, visualizing what's in the initial UI, and locking the behavior in with end-to-end tests.

## What "instant" means

A navigation is **instant** when the browser can start rendering the new page the moment the user clicks, with static, cached, and fallback content showing up right away, while the server streams the remaining content into its fallbacks.

> **Good to know:** This definition assumes caches are warm. Cold caches still require the server to compute the cached result once, so the first navigation to a route may still wait.

A direct visit and a client navigation to the same route can produce different initial UI. **Direct visits** get the [**static shell**](/docs/app/glossary#static-shell) as HTML, typically from a CDN. **Client navigations** only re-render below the layout the current and destination routes share, so the fallback UI defined by a ```<Suspense>``
      ``<Suspense>``
    </div>
  )
}

type Params = PageProps<'/store/[slug]'>['params']

async function ProductInfo({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  return (
    <>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </>
  )
}

async function getProduct(slug: string) {
  'use cache'
  return db.products.findBySlug(slug)
}

async function Inventory({ params }: { params: Params }) {
  const { slug } = await params
  const item = await db.inventory.findBySlug(slug)
  return <p>{item.count} in stock</p>
}
```

Cache Components validates this route automatically in development. If something would block a navigation, the dev overlay surfaces a **blocking-route** insight that names the offending component and points at these fixes:


  
> 💡 **Solución recomendada (cache):** Cache the component or data — [Ver guía de solución](https://nextjs.org/docs/messages/blocking-prerender-dynamic#cache-the-component-or-data)
' },
    ]}
  />
  
> 💡 **Solución recomendada (stream):** Wrap in or move into Suspense — [Ver guía de solución](https://nextjs.org/docs/messages/blocking-prerender-dynamic#wrap-in-or-move-into-suspense)
' },
      { text: '`<Suspense>`', highlight: true },
    ]}
  />


> **Good to know:** Each fix card links to a detailed walkthrough with patterns, code samples, and trade-offs. Click a card to dive in, or use **Copy prompt** to hand the fix to your agent. See [AI workflow](#ai-workflow) for the loop.

Validation runs on every page load using the real request from your browser, so dynamic params like `[slug]` are checked against actual values as you navigate.

### Client Component Pages

A soft navigation into a page with `"use client"` at the top behaves like a single-page app transition, with no server render at navigation time, which makes it instant. The dev overlay doesn't include this in its fix cards because it has bigger implications than the recommended approaches, which keep the page in the server-component model. Reach for `"use client"` when the page is fully interactive and must be a client component.

> **Good to know**: `"use client"` doesn't skip validation for the static shell. Hooks like `useSearchParams()` still need a ```<Suspense>``
    </div>
  )
}
```

Now `await props.params` and the product fetch suspend together. The product-fetch error clears, and validation moves on to the next blocker.

### Step 2: Cache the featured fetch

Validation now fires on `getFeatured()`.

<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  }}
>
  

![Dev overlay insight for the uncached getFeatured() fetch, with Stream, Cache, and Block fix cards]()


</div>

Add a `"use cache"` directive to the fetching function:

```tsx
// Archivo: app/products/[slug]/page.tsx
async function getFeatured() {
  'use cache'
  const res = await fetch('https://next-recipe-api.vercel.dev/products?limit=3')
  return res.json()
}
```

The result is cached at the fetch level. The featured list ships with the App Shell.

> **Good to know:** In serverless deployments, in-memory caching with `"use cache"` will not persist across instances. Consider using [`"use cache: remote"`](/docs/app/api-reference/directives/use-cache-remote) for persistent caching.

Validation passes. Open the DevTools and try a client navigation. The featured section appears immediately, and **"Loading product..."** shows where the product details will stream in.

### Iterate on loading states

Validation passing means the navigation is instant. It does not mean the loading states are good. A ``<Suspense>`` boundary placed high in the tree (say, wrapping the whole page) might satisfy validation, but it replaces most of the page with a single fallback on every navigation.

The best loading states keep as much real, cached content visible as possible and only show fallbacks where data is actually in flight. A product page that keeps the header, image, and description visible with only the price and availability behind a fallback feels faster than a full-page skeleton, even at the same total load time.

Use the [DevTools](#visualize-loading-states-with-the-nextjs-devtools) to see what your users see, or see the [AI workflow](#ai-workflow) for automating the loop with an agent.

## AI workflow

At a high level, an agent optimizes a single navigation like this:

- **Observe**: read validation insights and choose the exact navigation and UI that should appear immediately.
- **Test**: confirm the target UI renders normally, then write an `instant()` test and verify that it fails before changing the route.
- **Fix**: validation errors name a specific component and suggest a fix (`use cache` or ``<Suspense>``). The agent applies the fix and re-runs validation.
- **Verify**: run the test against a production-like build and keep the passing test as a regression guard.

The agent doesn't need to understand the full caching model, only to follow the insights and errors until they're gone. It does need your app-specific intent, though. Tell it what should appear immediately, what can stream in, and what must stay fresh. When a caching decision is unclear, keep the data fresh behind ``<Suspense>`` rather than guessing a cache lifetime.

For [iterating on loading states](#iterate-on-loading-states), a prompt like "maximize my content, and reduce the amount that needs to be behind a spinner" works well for pushing boundaries down.

Agents working on a Cache Components route typically reach for three levers:

- **Push down**: extract I/O into a Suspense-wrapped child so the parent stays static and static siblings lift into the shell.
- **Cache**: pair `'use cache'` with [`cacheLife`](/docs/app/api-reference/functions/cacheLife) to assign a freshness profile.
- **Per-link prefetching** (nav-only): when a route reads URL data (`searchParams` or `params`), opt it into [per-link prefetching](/docs/app/guides/optimizing-prefetching) so the framework resolves that data at link-prefetch time. Session data from `cookies()` or `headers()` already lands in the App Shell without it.

Each refactor should pair with a before/after capture to verify the change actually landed. Identical-looking captures mean the refactor didn't take effect.

For agents to see what their changes actually render, pair this with [agent-browser](https://github.com/vercel-labs/agent-browser). With React DevTools enabled it reports the component tree and which ``<Suspense>`` boundaries are still pending, so an agent can make a change, snapshot the shell, check what landed, and adjust. See [Runtime visibility](/docs/app/guides/ai-agents#step-2-give-agents-runtime-visibility) in the AI agents guide for the setup.

The [`next-cache-components-optimizer`](/docs/app/guides/ai-agents#next-cache-components-optimizer) Skill packages this loop. It confirms the target UI renders normally, writes an `instant()` test that fails before the fix, then works it to green against a production-like build and ships it as a regression guard. Use it for the initial load (hard navigation), client-side navigation (soft navigation), or both.

## Opting out

Not every layout or page can or should be instant. When the structural fix isn't worth the work, or when a route isn't a priority for instant navigation, refine validation at one of two scopes.

The dev overlay surfaces this as the **Block** fix alongside every insight:


  
> 💡 **Solución recomendada (block):** Allow blocking route — [Ver guía de solución](https://nextjs.org/docs/messages/blocking-prerender-dynamic#allow-blocking-route)

Set `instant = false` on the page or layout file. This opts the segment out of validation feedback. The segment may still navigate instantly if its structure supports it; the framework just won't surface insights for it. Navigations between sibling segments below are still validated.

```tsx
// Archivo: app/dashboard/layout.tsx
export const instant = false
```

With `false` on `/dashboard/layout.tsx`, validation no longer flags navigations into `/dashboard` from outside; navigations between `/dashboard/a` and `/dashboard/b` are still checked.

For opted-out segments, the navigation blocks on the server. If the content depends on cookies or headers but has a known cache lifetime, caching it with [`use cache: private`](/docs/app/api-reference/directives/use-cache-private) lets the App Shell carry it ahead of the click instead of opting out, as long as its [`stale`](/docs/app/api-reference/functions/cacheLife#stale) time is at least 5 minutes.

## Next steps

- [Adopting Partial Prefetching](/docs/app/guides/adopting-partial-prefetching) for the recommended `<Link>` defaults and the migration path off `unstable_eager`
- [`instant` API reference](/docs/app/api-reference/file-conventions/route-segment-config/instant) for the full configuration
- [Optimizing prefetching](/docs/app/guides/optimizing-prefetching) when parts of your route depend on URL data (`searchParams` or `params`) and should resolve before navigation
- [Caching](/docs/app/getting-started/caching) for background on `use cache`, Suspense, and Partial Prerendering
- [Revalidating](/docs/app/getting-started/revalidating) for how to expire cached data with `cacheLife` and `updateTag`



[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-handle-redirects-in-nextjs"></a>

## How to handle redirects in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/redirecting](https://nextjs.org/docs/app/guides/redirecting)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn the different ways to handle redirects in Next.js.*  

---

There are a few ways you can handle redirects in Next.js. This page will go through each available option, use cases, and how to manage large numbers of redirects.

| API                                                           | Purpose                                           | Where                                               | Status Code                            |
| ------------------------------------------------------------- | ------------------------------------------------- | --------------------------------------------------- | -------------------------------------- |
| [`redirect`](#redirect-function)                              | Redirect user after a mutation or event           | Server Components, Server Functions, Route Handlers | 307 (Temporary) or 303 (Server Action) |
| [`permanentRedirect`](#permanentredirect-function)            | Redirect user after a mutation or event           | Server Components, Server Functions, Route Handlers | 308 (Permanent)                        |
| [`useRouter`](#userouter-hook)                                | Perform a client-side navigation                  | Event Handlers in Client Components                 | N/A                                    |
| [`redirects` in `next.config.js`](#redirects-in-nextconfigjs) | Redirect an incoming request based on a path      | `next.config.js` file                               | 307 (Temporary) or 308 (Permanent)     |
| [`NextResponse.redirect`](#nextresponseredirect-in-proxy)     | Redirect an incoming request based on a condition | Proxy                                               | Any                                    |

> 📘 **Nota para Pages Router:**
> | API                                                           | Purpose                                           | Where                 | Status Code                        |
> | ------------------------------------------------------------- | ------------------------------------------------- | --------------------- | ---------------------------------- |
> | [`useRouter`](#userouter-hook)                                | Perform a client-side navigation                  | Components            | N/A                                |
> | [`redirects` in `next.config.js`](#redirects-in-nextconfigjs) | Redirect an incoming request based on a path      | `next.config.js` file | 307 (Temporary) or 308 (Permanent) |
> | [`NextResponse.redirect`](#nextresponseredirect-in-proxy)     | Redirect an incoming request based on a condition | Proxy                 | Any                                |

## `redirect` function

The `redirect` function allows you to redirect the user to another URL. You can call `redirect` in [Server Components](/docs/app/getting-started/server-and-client-components), [Route Handlers](/docs/app/api-reference/file-conventions/route), and [Server Functions](/docs/app/getting-started/mutating-data).

`redirect` is often used after a mutation or event. For example, creating a post:

```ts
// Archivo: app/actions.ts switcher
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(id: string) {
  try {
    // Call database
  } catch (error) {
    // Handle errors
  }

  revalidatePath('/posts') // Update cached posts
  redirect(`/post/${id}`) // Navigate to the new post page
}
```

```js
// Archivo: app/actions.js switcher
'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createPost(id) {
  try {
    // Call database
  } catch (error) {
    // Handle errors
  }

  revalidatePath('/posts') // Update cached posts
  redirect(`/post/${id}`) // Navigate to the new post page
}
```

> **Good to know**:
>
> - In a Server Action, `redirect` performs a client-side navigation when JavaScript is available. Without JavaScript, the form submission uses a 303 (See Other). In other contexts, `redirect` uses a 307 (Temporary Redirect).
> - `redirect` throws an error so it should be called **outside** the `try` block when using `try/catch` statements.
> - `redirect` can be called in Client Components during the rendering process but not in event handlers. You can use the [`useRouter` hook](#userouter-hook) instead.
> - `redirect` also accepts absolute URLs and can be used to redirect to external links.
> - If you'd like to redirect before the render process, use [`next.config.js`](#redirects-in-nextconfigjs) or [Proxy](#nextresponseredirect-in-proxy).

See the [`redirect` API reference](/docs/app/api-reference/functions/redirect) for more information.

## `permanentRedirect` function

The `permanentRedirect` function allows you to **permanently** redirect the user to another URL. You can call `permanentRedirect` in [Server Components](/docs/app/getting-started/server-and-client-components), [Route Handlers](/docs/app/api-reference/file-conventions/route), and [Server Functions](/docs/app/getting-started/mutating-data).

`permanentRedirect` is often used after a mutation or event that changes an entity's canonical URL, such as updating a user's profile URL after they change their username:

```ts
// Archivo: app/actions.ts switcher
'use server'

import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function updateUsername(username: string, formData: FormData) {
  try {
    // Call database
  } catch (error) {
    // Handle errors
  }

  revalidateTag('username', 'max') // Update all references to the username
  permanentRedirect(`/profile/${username}`) // Navigate to the new user profile
}
```

```js
// Archivo: app/actions.js switcher
'use server'

import { permanentRedirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'

export async function updateUsername(username, formData) {
  try {
    // Call database
  } catch (error) {
    // Handle errors
  }

  revalidateTag('username', 'max') // Update all references to the username
  permanentRedirect(`/profile/${username}`) // Navigate to the new user profile
}
```

> **Good to know**:
>
> - In a Server Action, `permanentRedirect` performs a client-side navigation when JavaScript is available. Without JavaScript, the form submission uses a 303 (See Other). In other contexts, `permanentRedirect` uses a 308 (Permanent Redirect).
> - `permanentRedirect` also accepts absolute URLs and can be used to redirect to external links.
> - If you'd like to redirect before the render process, use [`next.config.js`](#redirects-in-nextconfigjs) or [Proxy](#nextresponseredirect-in-proxy).

See the [`permanentRedirect` API reference](/docs/app/api-reference/functions/permanentRedirect) for more information.

## `useRouter()` hook

If you need to redirect inside an event handler in a Client Component, you can use the `push` method from the `useRouter` hook. For example:

```tsx
// Archivo: app/page.tsx switcher
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

```jsx
// Archivo: app/page.js switcher
'use client'

import { useRouter } from 'next/navigation'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/dashboard')}>
      Dashboard
    </button>
  )
}
```

> 📘 **Nota para Pages Router:**
> If you need to redirect inside a component, you can use the `push` method from the `useRouter` hook. For example:
> 
> ```tsx filename="app/page.tsx" switcher
> import { useRouter } from 'next/router'
> 
> export default function Page() {
>   const router = useRouter()
> 
>   return (
>     <button type="button" onClick={() => router.push('/dashboard')}>
>       Dashboard
>     </button>
>   )
> }
> ```
> 
> ```jsx filename="app/page.js" switcher
> import { useRouter } from 'next/router'
> 
> export default function Page() {
>   const router = useRouter()
> 
>   return (
>     <button type="button" onClick={() => router.push('/dashboard')}>
>       Dashboard
>     </button>
>   )
> }
> ```

> **Good to know**:
>
> - If you don't need to programmatically navigate a user, you should use a [`<Link>`](/docs/app/api-reference/components/link) component.

See the [`useRouter` API reference](/docs/app/api-reference/functions/use-router) for more information.

> 📘 **Nota para Pages Router:**
> See the [`useRouter` API reference](/docs/pages/api-reference/functions/use-router) for more information.

## `redirects` in `next.config.js`

The `redirects` option in the `next.config.js` file allows you to redirect an incoming request path to a different destination path. This is useful when you change the URL structure of pages or have a list of redirects that are known ahead of time.

`redirects` supports [path](/docs/app/api-reference/config/next-config-js/redirects#path-matching), [header, cookie, and query matching](/docs/app/api-reference/config/next-config-js/redirects#header-cookie-and-query-matching), giving you the flexibility to redirect users based on an incoming request.

To use `redirects`, add the option to your `next.config.js` file:

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      // Wildcard path matching
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
```

```js
// Archivo: next.config.js switcher
module.exports = {
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/about',
        destination: '/',
        permanent: true,
      },
      // Wildcard path matching
      {
        source: '/blog/:slug',
        destination: '/news/:slug',
        permanent: true,
      },
    ]
  },
}
```

See the [`redirects` API reference](/docs/app/api-reference/config/next-config-js/redirects) for more information.

> **Good to know**:
>
> - `redirects` can return a 307 (Temporary Redirect) or 308 (Permanent Redirect) status code with the `permanent` option.
> - `redirects` may have a limit on platforms. For example, on Vercel, there's a limit of 1,024 redirects. To manage a large number of redirects (1000+), consider creating a custom solution using [Proxy](/docs/app/api-reference/file-conventions/proxy). See [managing redirects at scale](#managing-redirects-at-scale-advanced) for more.
> - `redirects` runs **before** Proxy.

## `NextResponse.redirect` in Proxy

Proxy allows you to run code before a request is completed. Then, based on the incoming request, redirect to a different URL using `NextResponse.redirect`. This is useful if you want to redirect users based on a condition (e.g. authentication, session management, etc) or have [a large number of redirects](#managing-redirects-at-scale-advanced).

For example, to redirect the user to a `/login` page if they are not authenticated:

```ts
// Archivo: proxy.ts switcher
import { NextResponse, NextRequest } from 'next/server'
import { authenticate } from 'auth-provider'

export function proxy(request: NextRequest) {
  const isAuthenticated = authenticate(request)

  // If the user is authenticated, continue as normal
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // Redirect to login page if not authenticated
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

```js
// Archivo: proxy.js switcher
import { NextResponse } from 'next/server'
import { authenticate } from 'auth-provider'

export function proxy(request) {
  const isAuthenticated = authenticate(request)

  // If the user is authenticated, continue as normal
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // Redirect to login page if not authenticated
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: '/dashboard/:path*',
}
```

> **Good to know**:
>
> - Proxy runs **after** `redirects` in `next.config.js` and **before** rendering.

See the [Proxy](/docs/app/api-reference/file-conventions/proxy) documentation for more information.

## Managing redirects at scale (advanced)

To manage a large number of redirects (1000+), you may consider creating a custom solution using Proxy. This allows you to handle redirects programmatically without having to redeploy your application.

To do this, you'll need to consider:

1. Creating and storing a redirect map.
2. Optimizing data lookup performance.

> **Next.js Example**: See our [Proxy with Bloom filter](https://redirects-bloom-filter.vercel.app/) example for an implementation of the recommendations below.

### 1. Creating and storing a redirect map

A redirect map is a list of redirects that you can store in a database (usually a key-value store) or JSON file.

Consider the following data structure:

```json
{
  "/old": {
    "destination": "/new",
    "permanent": true
  },
  "/blog/post-old": {
    "destination": "/blog/post-new",
    "permanent": true
  }
}
```

In [Proxy](/docs/app/api-reference/file-conventions/proxy), you can read from a database such as Vercel's [Global Config](https://vercel.com/docs/global-config/get-started) or [Redis](https://vercel.com/docs/redis), and redirect the user based on the incoming request:

```ts
// Archivo: proxy.ts switcher
import { NextResponse, NextRequest } from 'next/server'
import { get } from '@vercel/global-config'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const redirectData = await get(pathname)

  if (redirectData && typeof redirectData === 'string') {
    const redirectEntry: RedirectEntry = JSON.parse(redirectData)
    const statusCode = redirectEntry.permanent ? 308 : 307
    return NextResponse.redirect(redirectEntry.destination, statusCode)
  }

  // No redirect found, continue without redirecting
  return NextResponse.next()
}
```

```js
// Archivo: proxy.js switcher
import { NextResponse } from 'next/server'
import { get } from '@vercel/global-config'

export async function proxy(request) {
  const pathname = request.nextUrl.pathname
  const redirectData = await get(pathname)

  if (redirectData) {
    const redirectEntry = JSON.parse(redirectData)
    const statusCode = redirectEntry.permanent ? 308 : 307
    return NextResponse.redirect(redirectEntry.destination, statusCode)
  }

  // No redirect found, continue without redirecting
  return NextResponse.next()
}
```

### 2. Optimizing data lookup performance

Reading a large dataset for every incoming request can be slow and expensive. There are two ways you can optimize data lookup performance:

- Use a database that is optimized for fast reads
- Use a data lookup strategy such as a [Bloom filter](https://en.wikipedia.org/wiki/Bloom_filter) to efficiently check if a redirect exists **before** reading the larger redirects file or database.

Considering the previous example, you can import a generated bloom filter file into Proxy, then, check if the incoming request pathname exists in the bloom filter.

If it does, forward the request to a [Route Handler](/docs/app/api-reference/file-conventions/route) 

> 📘 **Nota para Pages Router:**
> [API Routes](/docs/pages/building-your-application/routing/api-routes)

 which will check the actual file and redirect the user to the appropriate URL. This avoids importing a large redirects file into Proxy, which can slow down every incoming request.

```ts
// Archivo: proxy.ts switcher
import { NextResponse, NextRequest } from 'next/server'
import { ScalableBloomFilter } from 'bloom-filters'
import GeneratedBloomFilter from './redirects/bloom-filter.json'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

// Initialize bloom filter from a generated JSON file
const bloomFilter = ScalableBloomFilter.fromJSON(GeneratedBloomFilter as any)

export async function proxy(request: NextRequest) {
  // Get the path for the incoming request
  const pathname = request.nextUrl.pathname

  // Check if the path is in the bloom filter
  if (bloomFilter.has(pathname)) {
    // Forward the pathname to the Route Handler
    const api = new URL(
      `/api/redirects?pathname=${encodeURIComponent(request.nextUrl.pathname)}`,
      request.nextUrl.origin
    )

    try {
      // Fetch redirect data from the Route Handler
      const redirectData = await fetch(api)

      if (redirectData.ok) {
        const redirectEntry: RedirectEntry | undefined =
          await redirectData.json()

        if (redirectEntry) {
          // Determine the status code
          const statusCode = redirectEntry.permanent ? 308 : 307

          // Redirect to the destination
          return NextResponse.redirect(redirectEntry.destination, statusCode)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // No redirect found, continue the request without redirecting
  return NextResponse.next()
}
```

```js
// Archivo: proxy.js switcher
import { NextResponse } from 'next/server'
import { ScalableBloomFilter } from 'bloom-filters'
import GeneratedBloomFilter from './redirects/bloom-filter.json'

// Initialize bloom filter from a generated JSON file
const bloomFilter = ScalableBloomFilter.fromJSON(GeneratedBloomFilter)

export async function proxy(request) {
  // Get the path for the incoming request
  const pathname = request.nextUrl.pathname

  // Check if the path is in the bloom filter
  if (bloomFilter.has(pathname)) {
    // Forward the pathname to the Route Handler
    const api = new URL(
      `/api/redirects?pathname=${encodeURIComponent(request.nextUrl.pathname)}`,
      request.nextUrl.origin
    )

    try {
      // Fetch redirect data from the Route Handler
      const redirectData = await fetch(api)

      if (redirectData.ok) {
        const redirectEntry = await redirectData.json()

        if (redirectEntry) {
          // Determine the status code
          const statusCode = redirectEntry.permanent ? 308 : 307

          // Redirect to the destination
          return NextResponse.redirect(redirectEntry.destination, statusCode)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  // No redirect found, continue the request without redirecting
  return NextResponse.next()
}
```

Then, in the Route Handler:

```ts
// Archivo: app/api/redirects/route.ts switcher
import { NextRequest, NextResponse } from 'next/server'
import redirects from '@/app/redirects/redirects.json'

type RedirectEntry = {
  destination: string
  permanent: boolean
}

export function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) {
    return new Response('Bad Request', { status: 400 })
  }

  // Get the redirect entry from the redirects.json file
  const redirect = (redirects as Record<string, RedirectEntry>)[pathname]

  // Account for bloom filter false positives
  if (!redirect) {
    return new Response('No redirect', { status: 400 })
  }

  // Return the redirect entry
  return NextResponse.json(redirect)
}
```

```js
// Archivo: app/api/redirects/route.js switcher
import { NextResponse } from 'next/server'
import redirects from '@/app/redirects/redirects.json'

export function GET(request) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) {
    return new Response('Bad Request', { status: 400 })
  }

  // Get the redirect entry from the redirects.json file
  const redirect = redirects[pathname]

  // Account for bloom filter false positives
  if (!redirect) {
    return new Response('No redirect', { status: 400 })
  }

  // Return the redirect entry
  return NextResponse.json(redirect)
}
```

> 📘 **Nota para Pages Router:**
> Then, in the API Route:
> 
> ```ts filename="pages/api/redirects.ts" switcher
> import type { NextApiRequest, NextApiResponse } from 'next'
> import redirects from '@/app/redirects/redirects.json'
> 
> type RedirectEntry = {
>   destination: string
>   permanent: boolean
> }
> 
> export default function handler(req: NextApiRequest, res: NextApiResponse) {
>   const pathname = req.query.pathname
>   if (!pathname) {
>     return res.status(400).json({ message: 'Bad Request' })
>   }
> 
>   // Get the redirect entry from the redirects.json file
>   const redirect = (redirects as Record<string, RedirectEntry>)[pathname]
> 
>   // Account for bloom filter false positives
>   if (!redirect) {
>     return res.status(400).json({ message: 'No redirect' })
>   }
> 
>   // Return the redirect entry
>   return res.json(redirect)
> }
> ```
> 
> ```js filename="pages/api/redirects.js" switcher
> import redirects from '@/app/redirects/redirects.json'
> 
> export default function handler(req, res) {
>   const pathname = req.query.pathname
>   if (!pathname) {
>     return res.status(400).json({ message: 'Bad Request' })
>   }
> 
>   // Get the redirect entry from the redirects.json file
>   const redirect = redirects[pathname]
> 
>   // Account for bloom filter false positives
>   if (!redirect) {
>     return res.status(400).json({ message: 'No redirect' })
>   }
> 
>   // Return the redirect entry
>   return res.json(redirect)
> }
> ```

> **Good to know:**
>
> - To generate a bloom filter, you can use a library like [`bloom-filters`](https://www.npmjs.com/package/bloom-filters).
> - You should validate requests made to your Route Handler to prevent malicious requests.



[⬆ Subir al inicio del capítulo](#)

---

