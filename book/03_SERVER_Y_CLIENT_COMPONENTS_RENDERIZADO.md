# Capítulo 3: Server Components, Client Components y Renderizado

> 📌 **Capítulo 03** | Libro Guía Next.js v16.3.7  
> 📝 **Resumen:** *React Server Components (RSC), Client Components, patrones de composición, Streaming y Partial Prerendering (PPR).*  
> 📄 **Temas incluidos en este capítulo:** 4 secciones  

[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)

---

## Contenido del Capítulo

- [Server and Client Components](#server-and-client-components)
- [How to lazy load Client Components and libraries](#how-to-lazy-load-client-components-and-libraries)
- [Streaming](#streaming)
- [How to lazy load Client Components and libraries](#how-to-lazy-load-client-components-and-libraries)

---

<a id="server-and-client-components"></a>

## Server and Client Components

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/server-and-client-components](https://nextjs.org/docs/app/getting-started/server-and-client-components)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how you can use React Server and Client Components to render parts of your application on the server or the client.*  

---

By default, layouts and pages are [Server Components](https://react.dev/reference/rsc/server-components), which lets you fetch data and render parts of your UI on the server, optionally cache the result, and stream it to the client. When you need interactivity or browser APIs, you can use [Client Components](https://react.dev/reference/rsc/use-client) to layer in functionality.

This page explains how Server and Client Components work in Next.js and when to use them, with examples of how to compose them together in your application.

> **Good to know:** For an explanation of where each component type runs and how the boundary works, see [The Server and Client Boundary](/docs/app/guides/server-and-client-boundary).

## When to use Server and Client Components?

The client and server environments have different capabilities. Server and Client Components allow you to run logic in each environment depending on your use case.

Use **Client Components** when you need:

- [State](https://react.dev/learn/managing-state) and [event handlers](https://react.dev/learn/responding-to-events). E.g. `onClick`, `onChange`.
- [Lifecycle logic](https://react.dev/learn/lifecycle-of-reactive-effects). E.g. `useEffect`.
- Browser-only APIs. E.g. `localStorage`, `window`, `navigator.geolocation`, etc.
- [Custom hooks](https://react.dev/learn/reusing-logic-with-custom-hooks).

Use **Server Components** when you need:

- Fetch data from databases or APIs close to the source.
- Use API keys, tokens, and other secrets without exposing them to the client.
- Reduce the amount of JavaScript sent to the browser.
- Improve the [First Contentful Paint (FCP)](https://web.dev/fcp/), and stream content progressively to the client.

For example, the `<Page>` component is a Server Component that fetches data about a post, and passes it as props to the `<LikeButton>` which handles client-side interactivity.

```tsx
// Archivo: app/[id]/page.tsx highlight={1,17} switcher
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```

```jsx
// Archivo: app/[id]/page.js highlight={1,13} switcher
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({ params }) {
  const { id } = await params
  const post = await getPost(id)

  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```

```tsx
// Archivo: app/ui/like-button.tsx highlight={1} switcher
'use client'

import { useState } from 'react'

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

```jsx
// Archivo: app/ui/like-button.js highlight={1} switcher
'use client'

import { useState } from 'react'

export default function LikeButton({ likes }) {
  // ...
}
```

## How do Server and Client Components work in Next.js?

### On the server

On the server, Next.js uses React's APIs to orchestrate rendering. The rendering work is split into chunks, by individual route segments ([layouts and pages](/docs/app/getting-started/layouts-and-pages)), including [parallel route slots](/docs/app/api-reference/file-conventions/parallel-routes) whether or not they are displayed:

- **Server Components** are rendered into a special data format called the React Server Component Payload (RSC Payload).
- **Client Components** and the RSC Payload are used to [prerender](/docs/app/glossary#prerendering) HTML.

> **What is the React Server Component Payload (RSC)?**
>
> The RSC Payload is a compact, serialized representation of the rendered React Server Components tree. It's used by React on the client to update the browser's DOM. The RSC Payload contains:
>
> - The rendered result of Server Components
> - Placeholders for where Client Components should be rendered and references to their JavaScript files
> - Any props passed from a Server Component to a Client Component

### On the client (first load)

Then, on the client:

1. **HTML** is used to immediately show a fast non-interactive preview of the route to the user.
2. **RSC Payload** is used to reconcile the Client and Server Component trees.
3. **JavaScript** is used to hydrate Client Components and make the application interactive.

> **What is hydration?**
>
> Hydration is React's process for attaching [event handlers](https://react.dev/learn/responding-to-events) to the DOM, to make the static HTML interactive.

### Subsequent Navigations

On subsequent navigations:

- The **RSC Payload** is prefetched and cached for instant navigation.
- **Client Components** are rendered entirely on the client, without the server-rendered HTML.

## Examples

### Using Client Components

You can create a Client Component by adding the [`"use client"`](https://react.dev/reference/rsc/use-client) directive at the top of the file, above your imports.

```tsx
// Archivo: app/ui/counter.tsx highlight={1} switcher
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

```jsx
// Archivo: app/ui/counter.js highlight={1} switcher
'use client'

import { useState } from 'react'

export default function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

`"use client"` is used to declare a **boundary** between the Server and Client module graphs (trees).

Once a file is marked with `"use client"`, **all of its imports and the components it directly renders are included in the client bundle**. This means you don’t need to add the directive to every component that is intended for the client.

This behavior applies to components that are part of the Client Component’s [module graph](/docs/app/glossary#module-graph), which includes the modules it imports and the components it renders directly. It does not apply to Server Components passed as children or other props. Those components are not imported into the Client Component’s module graph. They are rendered on the server and passed to the Client Component as rendered output.

See [Interleaving Server and Client Components](/docs/app/getting-started/server-and-client-components#interleaving-server-and-client-components) for how Server and Client Components can be combined.

### Reducing JS bundle size

To reduce the size of your client JavaScript bundles, add `'use client'` to specific interactive components instead of marking large parts of your UI as Client Components.

For example, the `<Layout>` component contains mostly static elements like a logo and navigation links, but includes an interactive search bar. `<Search />` needs to be a Client Component, while the rest of the layout can stay a Server Component.

```tsx
// Archivo: app/layout.tsx highlight={12} switcher
// Client Component
import Search from './search'
// Server Component
import Logo from './logo'

// Layout is a Server Component by default
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

```jsx
// Archivo: app/layout.js highlight={12} switcher
// Client Component
import Search from './search'
// Server Component
import Logo from './logo'

// Layout is a Server Component by default
export default function Layout({ children }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

```tsx
// Archivo: app/ui/search.tsx highlight={1} switcher
'use client'

export default function Search() {
  // ...
}
```

```jsx
// Archivo: app/ui/search.js highlight={1} switcher
'use client'

export default function Search() {
  // ...
}
```

### Passing data from Server to Client Components

You can pass data from Server Components to Client Components using props.

```tsx
// Archivo: app/[id]/page.tsx highlight={1,12} switcher
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)

  return <LikeButton likes={post.likes} />
}
```

```jsx
// Archivo: app/[id]/page.js highlight={1,8} switcher
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'

export default async function Page({ params }) {
  const { id } = await params
  const post = await getPost(id)

  return <LikeButton likes={post.likes} />
}
```

```tsx
// Archivo: app/ui/like-button.tsx highlight={1} switcher
'use client'

export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

```jsx
// Archivo: app/ui/like-button.js highlight={1} switcher
'use client'

export default function LikeButton({ likes }) {
  // ...
}
```

Alternatively, you can stream data from a Server Component to a Client Component with the [`use` API](https://react.dev/reference/react/use). See an [example](/docs/app/getting-started/fetching-data#streaming-data-with-the-use-api).

> **Good to know**: Props passed to Client Components need to be [serializable](https://react.dev/reference/react/use-server#serializable-parameters-and-return-values) by React.

### Interleaving Server and Client Components

You can pass Server Components as a prop to a Client Component. This allows you to visually nest server-rendered UI within Client components.

A common pattern is to use `children` to create a _slot_ in a `<ClientComponent>`. For example, a `<Cart>` component that fetches data on the server, inside a `<Modal>` component that uses client state to toggle visibility.

```tsx
// Archivo: app/ui/modal.tsx switcher
'use client'

export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```

```jsx
// Archivo: app/ui/modal.js switcher
'use client'

export default function Modal({ children }) {
  return <div>{children}</div>
}
```

Then, in a parent Server Component (e.g.`<Page>`), you can pass a `<Cart>` as the child of the `<Modal>`:

```tsx
// Archivo: app/page.tsx  highlight={7} switcher
import Modal from './ui/modal'
import Cart from './ui/cart'

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

```jsx
// Archivo: app/page.js highlight={7} switcher
import Modal from './ui/modal'
import Cart from './ui/cart'

export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

In this pattern, Server Components are rendered on the server ahead of time, even when passed as props to Client Components. The React Server Component Payload contains the rendered result of those Server Components, plus placeholders for where Client Components should be rendered and references to their JavaScript files.

### Context providers

[React context](https://react.dev/learn/passing-data-deeply-with-context) is commonly used to share global state like the current theme. However, React context is not supported in Server Components.

To use context, create a Client Component that accepts `children`:

```tsx
// Archivo: app/theme-provider.tsx switcher
'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

```jsx
// Archivo: app/theme-provider.js switcher
'use client'

import { createContext } from 'react'

export const ThemeContext = createContext({})

export default function ThemeProvider({ children }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

Then, import it into a Server Component (e.g. `layout`):

```tsx
// Archivo: app/layout.tsx switcher
import ThemeProvider from './theme-provider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

```jsx
// Archivo: app/layout.js switcher
import ThemeProvider from './theme-provider'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```

Your Server Component will now be able to directly render your provider, and all other Client Components throughout your app will be able to consume this context.

> **Good to know**: You should render providers as deep as possible in the tree – notice how `ThemeProvider` only wraps `{children}` instead of the entire `<html>` document. This makes it easier for Next.js to optimize the static parts of your Server Components.

To pass server-fetched data through context and read it in Client Components with `use()`, see [Using React's `use` within a Context Provider](/docs/app/guides/single-page-applications#using-reacts-use-within-a-context-provider).

### Third-party components

When using a third-party component that relies on client-only features, you can wrap it in a Client Component to ensure it works as expected.

For example, the `<Carousel />` can be imported from the `acme-carousel` package. This component uses `useState`, but it doesn't yet have the `"use client"` directive.

If you use `<Carousel />` within a Client Component, it will work as expected:

```tsx
// Archivo: app/gallery.tsx switcher
'use client'

import { useState } from 'react'
import { Carousel } from 'acme-carousel'

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
      
      {isOpen && <Carousel />}
    </div>
  )
}
```

```jsx
// Archivo: app/gallery.js switcher
'use client'

import { useState } from 'react'
import { Carousel } from 'acme-carousel'

export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
      
      {isOpen && <Carousel />}
    </div>
  )
}
```

However, if you try to use it directly within a Server Component, you'll see an error. This is because Next.js doesn't know `<Carousel />` is using client-only features.

To fix this, you can wrap third-party components that rely on client-only features in your own Client Components:

```tsx
// Archivo: app/carousel.tsx switcher
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

```jsx
// Archivo: app/carousel.js switcher
'use client'

import { Carousel } from 'acme-carousel'

export default Carousel
```

Now, you can use `<Carousel />` directly within a Server Component:

```tsx
// Archivo: app/page.tsx switcher
import Carousel from './carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>
      
      <Carousel />
    </div>
  )
}
```

```jsx
// Archivo: app/page.js switcher
import Carousel from './carousel'

export default function Page() {
  return (
    <div>
      <p>View pictures</p>
      
      <Carousel />
    </div>
  )
}
```

> **Advice for Library Authors**
>
> If you’re building a component library, add the `"use client"` directive to entry points that rely on client-only features. This lets your users import components into Server Components without needing to create wrappers.
>
> It's worth noting some bundlers might strip out `"use client"` directives. You can find an example of how to configure esbuild to include the `"use client"` directive in the [React Wrap Balancer](https://github.com/shuding/react-wrap-balancer/blob/main/tsup.config.ts#L10-L13) and [Vercel Analytics](https://github.com/vercel/analytics/blob/main/packages/web/tsup.config.js#L26-L30) repositories.

### Preventing environment poisoning

JavaScript modules can be shared between both Server and Client Components modules. This means it's possible to accidentally import server-only code into the client. For example, consider the following function:

```ts
// Archivo: lib/data.ts switcher
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

```js
// Archivo: lib/data.js switcher
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

This function contains an `API_KEY` that should never be exposed to the client.

In Next.js, only environment variables prefixed with `NEXT_PUBLIC_` are included in the client bundle. If variables are not prefixed, Next.js replaces them with an empty string.

As a result, even though `getData()` can be imported and executed on the client, it won't work as expected.

To prevent accidental usage in Client Components, you can use the [`server-only` package](https://www.npmjs.com/package/server-only).

Then, import the package into a file that contains server-only code:

```js
// Archivo: lib/data.js
import 'server-only'

export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```

Now, if you try to import the module into a Client Component, there will be a build-time error.

The corresponding [`client-only` package](https://www.npmjs.com/package/client-only) can be used to mark modules that contain client-only logic like code that accesses the `window` object.

In Next.js, installing `server-only` or `client-only` is **optional**. However, if your linting rules flag extraneous dependencies, you may install them to avoid issues.

```bash
# Manejador de paquetes: npm
npm install server-only
```

```bash
# Manejador de paquetes: yarn
yarn add server-only
```

```bash
# Manejador de paquetes: pnpm
pnpm add server-only
```

```bash
# Manejador de paquetes: bun
bun add server-only
```

Next.js handles `server-only` and `client-only` imports internally to provide clearer error messages when a module is used in the wrong environment. The contents of these packages from NPM are not used by Next.js.

Next.js also provides its own type declarations for `server-only` and `client-only`, for TypeScript configurations where [`noUncheckedSideEffectImports`](https://www.typescriptlang.org/tsconfig/#noUncheckedSideEffectImports) is active.



[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-lazy-load-client-components-and-libraries"></a>

## How to lazy load Client Components and libraries

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/lazy-loading](https://nextjs.org/docs/app/guides/lazy-loading)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Lazy load imported libraries and React Components to improve your application's loading performance.*  

---

[Lazy loading](https://developer.mozilla.org/docs/Web/Performance/Lazy_loading) in Next.js helps improve the initial loading performance of an application by decreasing the amount of JavaScript needed to render a route.

It allows you to defer loading of **Client Components** and imported libraries, and only include them in the client bundle when they're needed. For example, you might want to defer loading a modal until a user clicks to open it.

There are two ways you can implement lazy loading in Next.js:

1. Using [Dynamic Imports](#nextdynamic) with `next/dynamic`
2. Using [`React.lazy()`](https://react.dev/reference/react/lazy) with [Suspense](https://react.dev/reference/react/Suspense)

By default, Server Components are automatically [code split](https://developer.mozilla.org/docs/Glossary/Code_splitting), and you can use [streaming](/docs/app/guides/streaming) to progressively send pieces of UI from the server to the client. Lazy loading applies to Client Components.

## `next/dynamic`

`next/dynamic` is a composite of [`React.lazy()`](https://react.dev/reference/react/lazy) and [Suspense](https://react.dev/reference/react/Suspense). It behaves the same way in the `app` and `pages` directories to allow for incremental migration.

## Examples

### Importing Client Components

```jsx
// Archivo: app/page.js
'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

// Client Components:
const ComponentA = dynamic(() => import('../components/A'))
const ComponentB = dynamic(() => import('../components/B'))
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })

export default function ClientComponentExample() {
  const [showMore, setShowMore] = useState(false)

  return (
    <div>
      
      <ComponentA />

      
      {showMore && <ComponentB />}
      <button onClick={() => setShowMore(!showMore)}>Toggle</button>

      
      <ComponentC />
    </div>
  )
}
```

> **Note:** When a Server Component dynamically imports a Client Component, automatic [code splitting](https://developer.mozilla.org/docs/Glossary/Code_splitting) is currently **not** supported.

### Skipping SSR

When using `React.lazy()` and Suspense, Client Components will be [prerendered](https://github.com/reactwg/server-components/discussions/4) (SSR) by default.

> **Note:** `ssr: false` option will only work for Client Components, move it into Client Components ensure the client code-splitting working properly.

If you want to disable prerendering for a Client Component, you can use the `ssr` option set to `false`:

```jsx
const ComponentC = dynamic(() => import('../components/C'), { ssr: false })
```

### Importing Server Components

If you dynamically import a Server Component, only the Client Components that are children of the Server Component will be lazy-loaded - not the Server Component itself.
It will also help preload the static assets such as CSS when you're using it in Server Components.

```jsx
// Archivo: app/page.js
import dynamic from 'next/dynamic'

// Server Component:
const ServerComponent = dynamic(() => import('../components/ServerComponent'))

export default function ServerComponentExample() {
  return (
    <div>
      <ServerComponent />
    </div>
  )
}
```

> **Note:** `ssr: false` option is not supported in Server Components. You will see an error if you try to use it in Server Components.
> `ssr: false` is not allowed with `next/dynamic` in Server Components. Please move it into a Client Component.

### Loading External Libraries

External libraries can be loaded on demand using the [`import()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) function. This example uses the external library `fuse.js` for fuzzy search. The module is only loaded on the client after the user types in the search input.

```jsx
// Archivo: app/page.js
'use client'

import { useState } from 'react'

const names = ['Tim', 'Joe', 'Bel', 'Lee']

export default function Page() {
  const [results, setResults] = useState()

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        onChange={async (e) => {
          const { value } = e.currentTarget
          // Dynamically load fuse.js
          const Fuse = (await import('fuse.js')).default
          const fuse = new Fuse(names)

          setResults(fuse.search(value))
        }}
      />
      <pre>Results: {JSON.stringify(results, null, 2)}</pre>
    </div>
  )
}
```

### Adding a custom loading component

```jsx
// Archivo: app/page.js
'use client'

import dynamic from 'next/dynamic'

const WithCustomLoading = dynamic(
  () => import('../components/WithCustomLoading'),
  {
    loading: () => <p>Loading...</p>,
  }
)

export default function Page() {
  return (
    <div>
      
      <WithCustomLoading />
    </div>
  )
}
```

### Importing Named Exports

To dynamically import a named export, you can return it from the Promise returned by [`import()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import) function:

```jsx
// Archivo: components/hello.js
'use client'

export function Hello() {
  return <p>Hello!</p>
}
```

```jsx
// Archivo: app/page.js
import dynamic from 'next/dynamic'

const ClientComponent = dynamic(() =>
  import('../components/hello').then((mod) => mod.Hello)
)
```

## Magic Comments

Next.js supports magic comments to control how dynamic imports are handled by the bundler. These comments work with dynamic `import()`, `require()`, `require.resolve()`, and `new Worker()` expressions.

> **Good to know:** Magic comments do not work with static `import` statements (`import x from 'y'`). They only work with dynamic expressions.

### `webpackIgnore` / `turbopackIgnore`

Use these comments to skip bundling a dynamic import. The import expression will be left as-is in the output, useful for runtime-only modules:

```js
// Skip bundling - import happens at runtime
const runtime = await import(/* webpackIgnore: true */ 'runtime-module')

// Turbopack-specific variant
const plugin = await import(/* turbopackIgnore: true */ pluginPath)

// Also works with require
const mod = require(/* webpackIgnore: true */ 'runtime-module')
```

### `turbopackOptional` (Turbopack only)

Use this comment to suppress build errors when a module might not exist. The import will still throw at runtime if the module is missing:

```js
// No build error if './optional-feature' doesn't exist
// Runtime will throw MODULE_NOT_FOUND if executed
const feature = await import(/* turbopackOptional: true */ './optional-feature')

// Also works with require
const mod = require(/* turbopackOptional: true */ './optional-module')
```

This is useful for:

- Conditional features that may not be installed
- Plugin systems where modules are optional
- Gradual migrations where some files may not exist yet

> **Good to know:** `webpackOptional` is not supported. Use `turbopackOptional` instead when using Turbopack.

> 📘 **Nota para Pages Router:**
> ## `next/dynamic`
> 
> `next/dynamic` is a composite of [`React.lazy()`](https://react.dev/reference/react/lazy) and [Suspense](https://react.dev/reference/react/Suspense). It behaves the same way in the `app` and `pages` directories to allow for incremental migration.
> 
> In the example below, by using `next/dynamic`, the header component will not be included in the page's initial JavaScript bundle. The page will render the Suspense `fallback` first, followed by the `Header` component when the `Suspense` boundary is resolved.
> 
> ```jsx
> import dynamic from 'next/dynamic'
> 
> const DynamicHeader = dynamic(() => import('../components/header'), {
>   loading: () => <p>Loading...</p>,
> })
> 
> export default function Home() {
>   return <DynamicHeader />
> }
> ```
> 
> > **Good to know**: In `import('path/to/component')`, the path must be explicitly written. It can't be a template string nor a variable. Furthermore the `import()` has to be inside the `dynamic()` call for Next.js to be able to match webpack bundles / module ids to the specific `dynamic()` call and preload them before rendering. `dynamic()` can't be used inside of React rendering as it needs to be marked in the top level of the module for preloading to work, similar to `React.lazy`.
> 
> ## Examples
> 
> ### With named exports
> 
> To dynamically import a named export, you can return it from the [Promise](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise) returned by [`import()`](https://github.com/tc39/proposal-dynamic-import#example):
> 
> ```jsx filename="components/hello.js"
> export function Hello() {
>   return <p>Hello!</p>
> }
> 
> // pages/index.js
> import dynamic from 'next/dynamic'
> 
> const DynamicComponent = dynamic(() =>
>   import('../components/hello').then((mod) => mod.Hello)
> )
> ```
> 
> ### With no SSR
> 
> To dynamically load a component on the client side, you can use the `ssr` option to disable server-rendering. This is useful if an external dependency or component relies on browser APIs like `window`.
> 
> ```jsx
> 'use client'
> 
> import dynamic from 'next/dynamic'
> 
> const DynamicHeader = dynamic(() => import('../components/header'), {
>   ssr: false,
> })
> ```
> 
> ### With external libraries
> 
> This example uses the external library `fuse.js` for fuzzy search. The module is only loaded in the browser after the user types in the search input.
> 
> ```jsx
> import { useState } from 'react'
> 
> const names = ['Tim', 'Joe', 'Bel', 'Lee']
> 
> export default function Page() {
>   const [results, setResults] = useState()
> 
>   return (
>     <div>
>       <input
>         type="text"
>         placeholder="Search"
>         onChange={async (e) => {
>           const { value } = e.currentTarget
>           // Dynamically load fuse.js
>           const Fuse = (await import('fuse.js')).default
>           const fuse = new Fuse(names)
> 
>           setResults(fuse.search(value))
>         }}
>       />
>       <pre>Results: {JSON.stringify(results, null, 2)}</pre>
>     </div>
>   )
> }
> ```



[⬆ Subir al inicio del capítulo](#)

---

<a id="streaming"></a>

## Streaming

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



[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-lazy-load-client-components-and-libraries"></a>

## How to lazy load Client Components and libraries

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/lazy-loading](https://nextjs.org/docs/pages/guides/lazy-loading)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Lazy load imported libraries and React Components to improve your application's overall loading performance.*  

---





[⬆ Subir al inicio del capítulo](#)

---

