# Capítulo 10: Despliegue, Rendimiento en Producción y Turbopack

> 📌 **Capítulo 10** | Libro Guía Next.js v16.3.7  
> 📝 **Resumen:** *Compilación con Turbopack, despliegue en Vercel, Docker y servidores propios, CI build caching y servidor personalizado.*  
> 📄 **Temas incluidos:** 40 secciones  

[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)

---

## Contenido del Capítulo

- [Deploying](#deploying)
- [Building your application](#building-your-application)
- [How to configure Continuous Integration (CI) build caching](#how-to-configure-continuous-integration-ci-build-caching)
- [How to set up a custom server in Next.js](#how-to-set-up-a-custom-server-in-nextjs)
- [Deploying Next.js to different platforms](#deploying-nextjs-to-different-platforms)
- [turbopack](#turbopack)
- [turbopackChunking](#turbopackchunking)
- [Turbopack FileSystem Caching](#turbopack-filesystem-caching)
- [turbopack.ignoreIssue](#turbopackignoreissue)
- [turbopackLocalPostcssConfig](#turbopacklocalpostcssconfig)
- [Turbopack Memory Eviction](#turbopack-memory-eviction)
- [turbopackRustReactCompiler](#turbopackrustreactcompiler)
- [Turbopack](#turbopack)
- [How to deploy your Next.js application](#how-to-deploy-your-nextjs-application)
- [How to configure Continuous Integration (CI) build caching](#how-to-configure-continuous-integration-ci-build-caching)
- [How to set up a custom server in Next.js](#how-to-set-up-a-custom-server-in-nextjs)
- [Pages and Layouts](#pages-and-layouts)
- [Dynamic Routes](#dynamic-routes)
- [Linking and Navigating](#linking-and-navigating)
- [Custom App](#custom-app)
- [Custom Document](#custom-document)
- [API Routes](#api-routes)
- [Custom Errors](#custom-errors)
- [Routing](#routing)
- [Server-side Rendering (SSR)](#server-side-rendering-ssr)
- [Static Site Generation (SSG)](#static-site-generation-ssg)
- [Automatic Static Optimization](#automatic-static-optimization)
- [Client-side Rendering (CSR)](#client-side-rendering-csr)
- [Rendering](#rendering)
- [getStaticProps](#getstaticprops)
- [getStaticPaths](#getstaticpaths)
- [getServerSideProps](#getserversideprops)
- [Client-side Fetching](#client-side-fetching)
- [Data Fetching](#data-fetching)
- [Error Handling](#error-handling)
- [Configuring](#configuring)
- [Building Your Application](#building-your-application)
- [turbopack](#turbopack)
- [turbopackChunking](#turbopackchunking)
- [Turbopack](#turbopack)

---

<a id="deploying"></a>

## Deploying

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/deploying](https://nextjs.org/docs/app/getting-started/deploying)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to deploy your Next.js application.*  

---

Next.js can be deployed as a Node.js server, Docker container, static export, or adapted to run on different platforms.

| Deployment Option                | Feature Support                                                     |
| -------------------------------- | ------------------------------------------------------------------- |
| [Node.js server](#nodejs-server) | All                                                                 |
| [Docker container](#docker)      | All                                                                 |
| [Static export](#static-export)  | Limited                                                             |
| [Adapters](#adapters)            | Varies ([verified](#verified-adapters) adapters run the test suite) |

## Node.js server

Next.js can be deployed to any provider that supports Node.js. Ensure your `package.json` has the `"build"` and `"start"` scripts:

```json
// Archivo: package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

Then, run `npm run build` to [build your application](/docs/app/guides/building) and `npm run start` to start the Node.js server. This server supports all Next.js features. If needed, you can also eject to a [custom server](/docs/app/guides/custom-server).

Node.js deployments support all Next.js features. Learn how to [configure them](/docs/app/guides/self-hosting) for your infrastructure.

### Templates

- [Flightcontrol](https://github.com/nextjs/deploy-flightcontrol)
- [Railway](https://github.com/nextjs/deploy-railway)
- [Replit](https://github.com/nextjs/deploy-replit)
- [Hostinger](https://github.com/hostinger/deploy-nextjs)

## Docker

Next.js can be deployed to any provider that supports [Docker](https://www.docker.com/) containers. This includes container orchestrators like Kubernetes or a cloud provider that runs Docker. For best practices on containerizing your app, refer to Docker's official [Next.js](https://docs.docker.com/guides/nextjs) and [React.js](https://docs.docker.com/guides/reactjs) guides.

Docker deployments support all Next.js features. Learn how to [configure them](/docs/app/guides/self-hosting) for your infrastructure.

> **Note for development:** While Docker is excellent for production deployments, consider using local development (`npm run dev`) instead of Docker during development on Mac and Windows for better performance. [Learn more about optimizing local development](/docs/app/guides/local-development).

### Templates

The following examples demonstrate best practices for containerizing Next.js applications:

- [Docker Standalone Output](https://github.com/vercel/next.js/tree/canary/examples/with-docker) - Deploy a Next.js application using `output: "standalone"` to generate a minimal, production-ready Docker image with only the required runtime files and dependencies.
- [Docker Export Output](https://github.com/vercel/next.js/tree/canary/examples/with-docker-export-output) - Deploy a fully static Next.js application using `output: "export"` to generate optimized HTML files that can be served from a lightweight container or any static hosting environment.
- [Docker Multi-Environment](https://github.com/vercel/next.js/tree/canary/examples/with-docker-multi-env) - Manage separate Docker configurations for development, staging, and production environments with different environment variables.

Additionally, hosting providers offer guidance on deploying Next.js:

- [DigitalOcean](https://github.com/nextjs/deploy-digitalocean)
- [Fly.io](https://github.com/nextjs/deploy-fly)
- [Google Cloud Run](https://github.com/nextjs/deploy-google-cloud-run)
- [Render](https://github.com/nextjs/deploy-render)
- [SST](https://github.com/nextjs/deploy-sst)

## Static export

Next.js enables starting as a static site or [Single-Page Application (SPA)](/docs/app/guides/single-page-applications), then later optionally upgrading to use features that require a server.

Since Next.js supports [static exports](/docs/app/guides/static-exports), it can be deployed and hosted on any web server that can serve HTML/CSS/JS static assets. This includes tools like AWS S3, Nginx, or Apache.

Running as a [static export](/docs/app/guides/static-exports) **does not** support Next.js features that require a server. [Learn more](/docs/app/guides/static-exports#unsupported-features).

### Templates

- [GitHub Pages](https://github.com/nextjs/deploy-github-pages)

## Adapters

Next.js can be adapted to run on different platforms to support their infrastructure capabilities. The [Deployment Adapter API](/docs/app/api-reference/config/next-config-js/adapterPath) lets platforms customize how Next.js applications are built and deployed.

### Verified Adapters

Verified adapters are open source, run the full [Next.js compatibility test suite](/docs/app/api-reference/adapters/testing-adapters), and are hosted under the [Next.js GitHub organization](https://github.com/nextjs). The Next.js team coordinates testing with these platforms before major releases. Publicly visible test results for each adapter are coming soon. [Learn more about verified adapters](/docs/app/guides/deploying-to-platforms#verified-adapters).

- [Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs)
- [Bun](https://bun.com/docs/guides/ecosystem/nextjs)

Cloudflare and Netlify are working on verified adapters built on the Adapter API. In the meantime, they offer their own Next.js integrations (see below).

### Other Platforms

The following platforms offer their own Next.js integrations. These are not built on the public [Adapter API](/docs/app/api-reference/config/next-config-js/adapterPath) and are not verified by the Next.js team, so feature support and compatibility may vary. Refer to each provider's documentation for details:

- [Appwrite Sites](https://appwrite.io/docs/products/sites/quick-start/nextjs)
- [AWS Amplify Hosting](https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components)
- [Cloudflare](https://developers.cloudflare.com/workers/frameworks/framework-guides/nextjs)
- [Deno Deploy](https://docs.deno.com/examples/next_tutorial)
- [Firebase App Hosting](https://firebase.google.com/docs/app-hosting/get-started)
- [Netlify](https://docs.netlify.com/frameworks/next-js/overview/#next-js-support-on-netlify)

For details on which Next.js features require specific platform capabilities, see [Deploying to Platforms](/docs/app/guides/deploying-to-platforms).


[⬆ Subir al inicio del capítulo](#)

---

<a id="building-your-application"></a>

## Building your application

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/building](https://nextjs.org/docs/app/guides/building)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn what happens when you run next build and how to read the build output.*  

---

Running `next build` compiles your application for production. It bundles and optimizes your code, [prerenders](/docs/app/glossary#prerendering) every route it can, and prints a route table that shows how each URL is served.

This guide will show you how to read the build output, including the route table and prerender-blocking errors.

> The output and errors on this page show [Cache Components](/docs/app/api-reference/config/next-config-js/cacheComponents) enabled, set with `cacheComponents: true` in your `next.config.ts` file. Much of the guide applies without it, but the route table symbols and the prerender-blocking errors differ. See [Enabling Cache Components](/docs/app/getting-started/caching#enabling-cache-components) for setup.

## What `next build` does

When you run `next build`, the build moves through these phases:

1. **Setup.** Loads [environment variables](/docs/app/guides/environment-variables) (`.env` files), validates your [`next.config`](/docs/app/api-reference/config/next-config-js), and generates a [build ID](/docs/app/api-reference/config/next-config-js/generateBuildId).
2. **Route discovery.** Scans the `app/` and `pages/` directories for routes, and detects root-level convention files like [`proxy`](/docs/app/api-reference/file-conventions/proxy) and [`instrumentation`](/docs/app/api-reference/file-conventions/instrumentation). Generates TypeScript route definitions.
3. **Compilation.** Bundles client, server, and edge code with [Turbopack](/docs/app/api-reference/turbopack) (or webpack). Transpiles TypeScript and JSX, tree-shakes unused code, and optimizes CSS and fonts. Type checking runs in parallel.
4. **Static analysis.** Classifies each route for prerendering versus on-demand rendering. Collects [`generateStaticParams`](/docs/app/api-reference/functions/generate-static-params) output. Checks for [prerender-blocking errors](/docs/messages/blocking-prerender-dynamic).
5. **Prerendering.** Prerenders static pages and PPR shells to HTML. Generates [RSC payloads](/docs/app/getting-started/server-and-client-components#on-the-server) for client-side navigation.
6. **Output.** Writes the build to `.next/`. For [`output: 'standalone'`](/docs/app/guides/self-hosting), bundles only the files needed at runtime. For [`output: 'export'`](/docs/app/guides/static-exports), generates a full static site. Prints the route table.

## Reading the build output

The build command depends on your package manager:

```bash
# Manejador de paquetes: pnpm
pnpm build
```

```bash
# Manejador de paquetes: npm
npm run build
```

```bash
# Manejador de paquetes: yarn
yarn build
```

```bash
# Manejador de paquetes: bun
bun run build
```

After a successful build, Next.js prints a route table with a symbol next to each route, showing how it is served:

| Symbol | Name              | Behavior                                                                     |
| ------ | ----------------- | ---------------------------------------------------------------------------- |
| `○`    | Static            | Fully prerendered at build time. Served without server rendering.            |
| `◐`    | Partial Prerender | Static shell served immediately. Dynamic content streams in at request time. |
| `●`    | SSG               | Prerendered static HTML (from `generateStaticParams` or `getStaticProps`).   |
| `ƒ`    | Dynamic           | Server-rendered on demand for each request.                                  |

`○` Static, `●` SSG, and `ƒ` Dynamic are the modes Next.js applications have always rendered in, including on the Pages Router: each route is either prerendered to static HTML or server-rendered on demand for each request.

[Cache Components](/docs/app/api-reference/config/next-config-js/cacheComponents) adds `◐` Partial Prerender and makes [Partial Prerendering](/docs/app/getting-started/caching#static-cached-and-streaming) the default rendering model. Each route is split into a static shell, prerendered at build time, and dynamic parts that stream in at request time. Routes sit on a spectrum from fully static (`○`) to partially prerendered (`◐`) and are no longer fully server-rendered: a route shows `ƒ` only when it has nothing to prerender, such as [Route Handlers](/docs/app/api-reference/file-conventions/route) that depend on the request, Proxy (Middleware), and dynamic [metadata](/docs/app/api-reference/functions/generate-metadata) like `icon` or `opengraph-image`.

The symbol reflects what the route does at prerender time, not which validation configs (such as [`instant`](/docs/app/api-reference/file-conventions/route-segment-config/instant)) it exports. Without Cache Components, or on the Pages Router, prerendered pages can also show `●` (SSG).

## Example

Prerender validation is one of the most common reasons production builds fail. This is a safeguard: Cache Components catches uncached and runtime data at build time, before it can slow down your app in production. The rest of this guide walks through one such error, from the failed build to the fix.

This example uses a store app with a dynamic product page that loads data by id:

```txt
app/
├── layout.tsx
├── page.tsx
└── products/
    └── [id]/
        └── page.tsx
```

We'll work in `app/products/[id]/page.tsx`:

```tsx
// Archivo: app/products/[id]/page.tsx switcher
export default async function Page(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

```jsx
// Archivo: app/products/[id]/page.js switcher
export default async function Page({ params }) {
  const { id } = await params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

During the build, Next.js prerenders as much of each route as it can at [build time](/docs/app/glossary#build-time). [Runtime data](/docs/app/glossary#request-time-apis) ([`params`](/docs/app/api-reference/file-conventions/page#params-optional), [`searchParams`](/docs/app/api-reference/file-conventions/page#searchparams-optional), [`cookies()`](/docs/app/api-reference/functions/cookies), [`headers()`](/docs/app/api-reference/functions/headers)) and uncached data (`fetch()`, database calls) are not available during that pass. Wrap runtime reads in [`<Suspense>`](https://react.dev/reference/react/Suspense), and cache data accesses with [`use cache`](/docs/app/api-reference/directives/use-cache) or wrap them in `<Suspense>` too. Otherwise, the build fails with a [`blocking-prerender-runtime`](/docs/messages/blocking-prerender-runtime) or [`blocking-prerender-dynamic`](/docs/messages/blocking-prerender-dynamic) error. [Random values and timestamps](/docs/app/getting-started/caching#random-values-and-timestamps) such as `Math.random()` or `new Date()` can also fail the build.

Run `next build`. It fails with a prerender-blocking error because the `params` read and the uncached `fetch` run outside a `<Suspense>` boundary:

```bash
// Archivo: Terminal
Error: Route "/products/[id]": Next.js encountered uncached or runtime data during prerendering.

`fetch(...)`, `cookies()`, `headers()`, `params`, `searchParams`, or `connection()` accessed outside of `<Suspense>` prevents the route from being prerendered, blocking the page load and leading to a slower user experience.

Ways to fix this:
  - [stream] Provide a placeholder with `<Suspense fallback={...}>` around the data access
  - [cache] For uncached data (`fetch`, database calls): cache the access with `"use cache"` (does not apply to `connection()`)
  - [block] Set `export const instant = false` to allow a blocking route

Learn more: https://nextjs.org/docs/messages/blocking-prerender-dynamic
    at body (<anonymous>)
    at html (<anonymous>)
To get a more detailed stack trace and pinpoint the issue, try one of the following:
  - Start the app in development mode by running `next dev`, then open "/products/[id]" in your browser to investigate the error.
  - Rerun the production build with `next build --debug-prerender` to generate better stack traces.
Error occurred prerendering page "/products/[id]".
```

### Debugging build errors

Sometimes the error cannot provide enough information, because production builds minify server code and don't generate source maps for it. Rerun the build with [`--debug-prerender`](/docs/app/api-reference/cli/next#debugging-prerender-errors):

```bash
// Archivo: Terminal
next build --debug-prerender
```

That disables minification, turns on source maps for server bundles, and continues past the first failure, so remaining issues surface in one run. This helps with any error thrown during prerendering, not only blocking ones. The stack now points at the first blocked access in the page, the `params` read:

```bash
// Archivo: Terminal
Error: Route "/products/[id]": Next.js encountered uncached or runtime data during prerendering.
  ...
    at Page (app/products/[id]/page.tsx:2:30)
  1 | export default async function Page(props: PageProps<'/products/[id]'>) {
> 2 |   const { id } = await props.params
    |                              ^
  3 |   const res = await fetch(`https://api.example.com/products/${id}`)
  4 |   const product = await res.json()
```

> **Warning**: Do not deploy builds produced with `--debug-prerender`. They skip optimizations you need in production.

Running the route in `next dev` shows the full error immediately, with the component and line already resolved. See [Ensuring instant navigations](/docs/app/guides/instant-navigation) for working with these errors in depth.

With the cause located, let's apply each fix and see how the build output changes.

### A streaming route

The error's first suggestion, `[stream]`, is to provide a placeholder around the data access. Add a [`loading.js`](/docs/app/api-reference/file-conventions/loading) file to wrap the whole segment in a `<Suspense>` boundary. Next.js prerenders the fallback as the route's static shell, while the params and data work runs at request time. For other boundary placements, see [Streaming](/docs/app/guides/streaming):

```tsx
// Archivo: app/products/[id]/loading.tsx switcher
export default function Loading() {
  return <div>Loading...</div>
}
```

```jsx
// Archivo: app/products/[id]/loading.js switcher
export default function Loading() {
  return <div>Loading...</div>
}
```

Run the build. It passes, and the route is [partially prerendered](/docs/app/glossary#partial-prerendering-ppr):

```bash
// Archivo: Terminal
Route (app)
┌ ○ /                   # Prerendered at build time
├ ○ /_not-found
└   /products/[id]
  └ ◐ /products/[id]    # Shell prerendered, content streams on request

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

Product URLs now serve the prerendered shell instantly, then stream the page content.

### Building specific routes

If we were iterating on this route alone in a larger app, we could also scope each build to it instead of rebuilding everything. Pass [`--debug-build-paths`](/docs/app/api-reference/cli/next#building-specific-routes) with the route files to include:

```bash
// Archivo: Terminal
next build --debug-build-paths="app/products/[id]/page.tsx"
```

Next.js compiles and prerenders only the matching routes, and skips the rest of the app. The option accepts comma-separated paths and glob patterns, with a `!` prefix to exclude, and combines with `--debug-prerender` while debugging. Our store only has a few routes, so we'll keep building the whole app.

### Prerendered params

The [dynamic segment](/docs/app/glossary#dynamic-route-segments) shows a single fallback row because Next.js doesn't know which param values exist. Export `generateStaticParams` to list them:

```tsx
// Archivo: app/products/[id]/page.tsx switcher
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  return products.map((product) => ({ id: product.id }))
}

export default async function Page(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

```jsx
// Archivo: app/products/[id]/page.js switcher
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  return products.map((product) => ({ id: product.id }))
}

export default async function Page({ params }) {
  const { id } = await params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

Running the build again adds a row for each listed param, indented under the `/products/[id]` route:

```bash
// Archivo: Terminal
Route (app)
┌ ○ /
├ ○ /_not-found
└   /products/[id]
  ├ ◐ /products/[id]
  ├ ◐ /products/1       # Params known, data still uncached
  ├ ◐ /products/2       # Params known, data still uncached
  └ ◐ /products/3       # Params known, data still uncached

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

> **Good to know**: `generateStaticParams` must return at least one param. An empty array causes a [build error](/docs/messages/empty-generate-static-params).

The new rows show `◐`, not `○`. Listing the params tells Next.js which pages exist, but their content still comes from the uncached lookup, which only runs at request time. Each page serves the static shell and streams its content.

> **Good to know**: Here the `fetch` runs during prerendering, so point it at a working endpoint or a fake async source that returns data. The `◐` rows appear only when the lookup is real uncached I/O; a synchronous in-memory value is treated as static and prerenders each param to `○` instead.

### Cached data

The error's `[cache]` fix moves the lookup to build time. Add `use cache` so it can run during prerendering:

```tsx
// Archivo: app/products/[id]/page.tsx switcher
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  return products.map((product) => ({ id: product.id }))
}

async function getProduct(id: string) {
  'use cache'
  const res = await fetch(`https://api.example.com/products/${id}`)
  return res.json()
}

export default async function Page(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params
  const product = await getProduct(id)
  return <div>{product.name}</div>
}
```

```jsx
// Archivo: app/products/[id]/page.js switcher
export async function generateStaticParams() {
  const res = await fetch('https://api.example.com/products')
  const products = await res.json()
  return products.map((product) => ({ id: product.id }))
}

async function getProduct(id) {
  'use cache'
  const res = await fetch(`https://api.example.com/products/${id}`)
  return res.json()
}

export default async function Page({ params }) {
  const { id } = await params
  const product = await getProduct(id)
  return <div>{product.name}</div>
}
```

Running the build again shows the listed params as `○`. Their params are known and their data is cached, so Next.js prerenders each page in full. The `◐` row remains for unlisted params, which serve the static shell while their content streams:

```bash
// Archivo: Terminal
Route (app)
┌ ○ /
├ ○ /_not-found
└   /products/[id]
  ├ ◐ /products/[id]    # Unlisted params stream on demand
  ├ ○ /products/1       # Prerendered in full at build time
  ├ ○ /products/2       # Prerendered in full at build time
  └ ○ /products/3       # Prerendered in full at build time

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

Pages that read `cookies()`, `headers()`, or `searchParams` stay `◐`, streaming those parts into the shell on each visit.

When a user visits an unlisted param, Next.js serves the static shell immediately while the content streams in, then upgrades the page in the background. See [Incremental Static Regeneration with Cache Components](/docs/app/guides/incremental-static-regeneration-cache-components).

When there are more prerendered paths than fit in the table, Next.js prints a short list ending with `[+N more paths]`.

Routes that contain cached functions or components also show `Revalidate` and `Expire` columns. A route reports the shortest `revalidate` and `expire` across all the caches it contains. This applies even without an explicit [`cacheLife`](/docs/app/api-reference/functions/cacheLife) call, since caches use the [`default` profile](/docs/app/api-reference/functions/cacheLife#preset-cache-profiles). Let's add a `/products` listing page that renders the same cached product data:

```bash
// Archivo: Terminal
Route (app)           Revalidate  Expire
┌ ○ /
├ ○ /_not-found
├ ○ /products                15m      1y
└   /products/[id]
  ├ ◐ /products/[id]
  ├ ○ /products/1            15m      1y
  ├ ○ /products/2            15m      1y
  └ ○ /products/3            15m      1y
```

The routes [revalidate](/docs/app/getting-started/revalidating) after 15 minutes, the value of the `default` profile. The profile never expires, and the `Expire` column caps at one year, shown as `1y`. The table doesn't show which cache produced the values, so with multiple caches in a route, check their `cacheLife` calls.

### A blocking route

The error's last suggestion, `[block]`, is the alternative to the fixes above. Say we had removed them, and only set `instant = false` on the original page. This doesn't change how the route renders. It only opts out of validation to purposely allow a blocking route:

```tsx
// Archivo: app/products/[id]/page.tsx switcher
export const instant = false

export default async function Page(props: PageProps<'/products/[id]'>) {
  const { id } = await props.params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

```jsx
// Archivo: app/products/[id]/page.js switcher
export const instant = false

export default async function Page({ params }) {
  const { id } = await params
  const res = await fetch(`https://api.example.com/products/${id}`)
  const product = await res.json()
  return <div>{product.name}</div>
}
```

The build passes, and the output looks the same as the streaming route. Dynamic segments show a `◐` fallback row even when nothing meaningful is prerendered:

```bash
// Archivo: Terminal
Route (app)
┌ ○ /
├ ○ /_not-found
└   /products/[id]
  └ ◐ /products/[id]    # Renders on demand, blocking on the lookup

○  (Static)             prerendered as static content
◐  (Partial Prerender)  prerendered as static HTML with dynamic server-streamed content
```

Unlike the streaming route, there is no fallback UI: users see nothing until the lookup completes. See [Opting out](/docs/app/guides/instant-navigation#opting-out) for when this is appropriate.

## Next steps

We've learned how to run a production build, read the route table, and understand prerender-blocking errors. Next, learn how to:

- [Deploy your application](/docs/app/getting-started/deploying)
- [Cache data and UI](/docs/app/getting-started/caching)
- [Revalidate cached routes with ISR](/docs/app/guides/incremental-static-regeneration-cache-components)
- [Configure CI build caching](/docs/app/guides/ci-build-caching)


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

<a id="how-to-set-up-a-custom-server-in-nextjs"></a>

## How to set up a custom server in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/custom-server](https://nextjs.org/docs/app/guides/custom-server)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Start a Next.js app programmatically using a custom server.*  

---

Next.js includes its own server with `next start` by default. If you have an existing backend, you can still use it with Next.js (this is not a custom server). A custom Next.js server allows you to programmatically start a server for custom patterns. The majority of the time, you will not need this approach. However, it's available if you need to eject.

> **Good to know**:
>
> - Before deciding to use a custom server, keep in mind that it should only be used when the integrated router of Next.js can't meet your app requirements.
> - When using standalone output mode, it does not trace custom server files. This mode outputs a separate minimal `server.js` file, instead. These cannot be used together.

Take a look at the [following example](https://github.com/vercel/next.js/tree/canary/examples/custom-server) of a custom server:

```ts
// Archivo: server.ts switcher
import { createServer } from 'http'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
```

```js
// Archivo: server.js switcher
import { createServer } from 'http'
import next from 'next'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(port)

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})
```

> **Set your own response headers before calling `handle`**: Next.js begins sending the response inside `handle(req, res)`, so by the time its promise resolves `res.headersSent` is already `true` and any later `res.setHeader()` call is silently discarded. Set headers you own, such as `Set-Cookie`, before handing the request to Next.js:
>
> ```js
> res.setHeader('Set-Cookie', 'sessionId=abc123; Max-Age=2592000')
>
> await handle(req, res)
> ```
>
> The same ordering applies when wrapping Next.js in another framework, for example `reply.raw` in Fastify or `res` in Express.

> `server.js` does not run through the Next.js Compiler or bundling process. Make sure the syntax and source code this file requires are compatible with the current Node.js version you are using. [View an example](https://github.com/vercel/next.js/tree/canary/examples/custom-server).

To run the custom server, you'll need to update the `scripts` in `package.json` like so:

```json
// Archivo: package.json
{
  "scripts": {
    "dev": "node server.js",
    "build": "next build",
    "start": "NODE_ENV=production node server.js"
  }
}
```

Alternatively, you can set up `nodemon` ([example](https://github.com/vercel/next.js/tree/canary/examples/custom-server)). The custom server uses the following import to connect the server with the Next.js application:

```js
import next from 'next'

const app = next({})
```

The above `next` import is a function that receives an object with the following options:

| Option       | Type               | Description                                                                         |
| ------------ | ------------------ | ----------------------------------------------------------------------------------- |
| `conf`       | `Object`           | The same object you would use in `next.config.js`. Defaults to `{}`                 |
| `dev`        | `Boolean`          | (_Optional_) Whether or not to launch Next.js in dev mode. Defaults to `false`      |
| `dir`        | `String`           | (_Optional_) Location of the Next.js project. Defaults to `'.'`                     |
| `quiet`      | `Boolean`          | (_Optional_) Hide error messages containing server information. Defaults to `false` |
| `hostname`   | `String`           | (_Optional_) The hostname the server is running behind                              |
| `port`       | `Number`           | (_Optional_) The port the server is running behind                                  |
| `httpServer` | `node:http#Server` | (_Optional_) The HTTP Server that Next.js is running behind                         |
| `turbopack`  | `Boolean`          | (_Optional_) Enable Turbopack (enabled by default)                                  |
| `webpack`    | `Boolean`          | (_Optional_) Enable webpack                                                         |

The returned `app` can then be used to let Next.js handle requests as required.

> 📘 **Nota para Pages Router:**
> ## Disabling file-system routing
> 
> By default, `Next` will serve each file in the `pages` folder under a pathname matching the filename. If your project uses a custom server, this behavior may result in the same content being served from multiple paths, which can present problems with SEO and UX.
> 
> To disable this behavior and prevent routing based on files in `pages`, open `next.config.js` and disable the `useFileSystemPublicRoutes` config:
> 
> ```js filename="next.config.js"
> module.exports = {
>   useFileSystemPublicRoutes: false,
> }
> ```
> 
> > Note that `useFileSystemPublicRoutes` disables filename routes from SSR; client-side routing may still access those paths. When using this option, you should guard against navigation to routes you do not want programmatically.
> 
> > You may also wish to configure the client-side router to disallow client-side redirects to filename routes; for that refer to [`router.beforePopState`](/docs/pages/api-reference/functions/use-router#routerbeforepopstate).


[⬆ Subir al inicio del capítulo](#)

---

<a id="deploying-nextjs-to-different-platforms"></a>

## Deploying Next.js to different platforms

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/deploying-to-platforms](https://nextjs.org/docs/app/guides/deploying-to-platforms)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Understand which Next.js features require specific platform capabilities and how to choose the right deployment target.*  

---

Next.js [treats static and dynamic content as a spectrum](/docs/app/guides/rendering-philosophy) at the component level. Different features in this model require different platform capabilities. This page helps you understand what your platform needs to support and how to configure your deployment.

## Minimum Requirements

To run Next.js, your platform needs **a Node.js server**. That's it.

A single `next start` process handles every Next.js feature correctly: Server Components, ISR, PPR, Cache Components, Server Actions, Proxy, and `after()`. Streaming support is needed for features like PPR and Server Components to deliver content progressively (without it, responses are buffered and sent as a whole, which still works but loses the streaming performance benefit). Additional infrastructure (CDN caching, edge compute, shared cache) primarily improves performance and multi-instance consistency. In multi-instance deployments, shared cache and tag coordination reduce stale divergence between instances. The only additional dependency is the `sharp` package, which is required for [Image Optimization](/docs/app/api-reference/components/image).

## Functional Fidelity vs. Performance Fidelity

When evaluating platform support for Next.js, it helps to distinguish between two levels:

**Functional fidelity** means every Next.js feature works correctly. The [adapter test suite](/docs/app/api-reference/adapters/testing-adapters) is the contract: if a platform's adapter passes the tests, it supports Next.js. This is binary: it passes or it doesn't.

**Performance fidelity** means features achieve their optimal performance characteristics. Examples include PPR's static shell served at CDN latency rather than origin latency, or ISR serving stale content instantly with sub-second revalidation propagation. Performance fidelity is a spectrum that every platform will achieve differently based on their architecture.

A platform that achieves functional fidelity is a fully supported deployment target for Next.js. Performance fidelity is how platforms differentiate, and it improves incrementally over time.

Use the feature matrix below through this lens: "Streaming Required" and "Shared Cache Recommended" describe what is needed for functional fidelity. "Edge Stitching" is a performance fidelity optimization.

## Feature Support Matrix

Different features require different infrastructure capabilities. The "Edge Stitching" column is a **performance optimization**, not a correctness requirement. All features work correctly from a single origin server.

| Feature                        | Streaming | Shared Cache | Edge Stitching | Notes                                                                                            |
| ------------------------------ | --------- | ------------ | -------------- | ------------------------------------------------------------------------------------------------ |
| Server Components              | Required  | No           | No             | Basic streaming support                                                                          |
| ISR (time-based)               | No        | Recommended  | No             | Works per-instance without shared cache                                                          |
| ISR (on-demand)                | No        | Recommended  | No             | [Tag propagation](/docs/app/guides/how-revalidation-works) needs shared cache for multi-instance |
| Partial Prerendering           | Required  | Recommended  | Optional       | [See PPR Platform Guide](/docs/app/guides/ppr-platform-guide)                                    |
| Cache Components (`use cache`) | Required  | Recommended  | No             | Shared cache enables cross-instance consistency                                                  |
| Proxy / Middleware             | No        | No           | No             | Runs at edge or origin                                                                           |
| Server Actions                 | Required  | No           | No             | POST requests with streaming response                                                            |
| `after()`                      | No        | No           | No             | Requires [graceful shutdown](/docs/app/guides/self-hosting#after) support                        |

**Streaming Required** means the platform must support chunked transfer encoding or HTTP/2 streaming and must not buffer the response before sending it to the client.

**Shared Cache Recommended** means multiple server instances benefit from shared cache backends to coordinate. For ISR and server response caching, use [`cacheHandler`](/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath). For `'use cache'` entries, use [`cacheHandlers`](/docs/app/api-reference/config/next-config-js/cacheHandlers). Without shared cache, each instance maintains its own cache independently — features still work correctly on each instance, but revalidation events don't propagate across instances.

## CDN Infrastructure Compatibility

The following table maps infrastructure primitives for each major CDN. These are available building blocks, not finished integrations:

| CDN               | Edge Compute | Key-Value / Tags | Blob Storage   | PPR Resuming |
| ----------------- | ------------ | ---------------- | -------------- | ------------ |
| Cloudflare        | Workers      | KV               | R2             | Yes (worker) |
| Akamai            | EdgeWorkers  | EdgeKV           | Object Storage | Yes (worker) |
| Amazon CloudFront | Lambda@Edge  | KeyValueStore    | S3             | Yes (Lambda) |
| Fastly            | Compute      | KV Store         | Object Storage | Yes (WASM)   |
| Azure             | Functions    | Managed Redis    | Blob Storage   | Yes (server) |
| Google Cloud      | Cloud Run    | Various KV       | Cloud Storage  | Yes (server) |

These are available building blocks, not finished integrations. Most community adapters today deploy Next.js as a Docker container or Node.js server without leveraging CDN-specific primitives like edge KV or PPR resuming. See the [Deploying](/docs/app/getting-started/deploying#adapters) page for the current list of adapters. For CDN-specific caching considerations (including known limitations with `Vary` on custom headers), see [CDN Caching](/docs/app/guides/cdn-caching).

## Adapters

Next.js provides a [Deployment Adapter API](/docs/app/api-reference/config/next-config-js/adapterPath) that lets platforms customize how Next.js applications are built and deployed for their infrastructure. Adapters run at build time and produce platform-specific output from the standard Next.js build. Anyone can build an adapter using the public API with no special access required.

The adapter API plus Next.js caching interfaces form the complete platform integration surface. The adapter handles build-time output, while `cacheHandler` and `cacheHandlers` cover different runtime caching paths. `cacheHandler` (singular) covers server cache paths like ISR, route handlers, patched `fetch`/`unstable_cache`, and image optimization. `cacheHandlers` (plural) configures `'use cache'` directive backends.

### Verified Adapters

A **verified adapter** is one that meets two requirements:

1. **Open source.** The adapter source code is publicly available so the community and the Next.js team can inspect, contribute to, and verify it.
2. **Runs the compatibility test suite.** The platform provides a way to run the full [Next.js compatibility test suite](/docs/app/api-reference/adapters/testing-adapters) against their adapter. This gives visibility into which features work, which are in progress, and where gaps remain.

Verified adapters are hosted under the [Next.js GitHub organization](https://github.com/nextjs), listed as supported deployment targets in the Next.js documentation, and maintained by their respective platform teams. There are no private framework hooks or integration paths: Vercel's adapter uses the same public API as every other adapter.

For verified adapters and platforms working toward verified status through the [Ecosystem Working Group](https://nextjs.org/ecosystem-working-group), the Next.js team commits to:

- **Coordinated testing.** Before major releases, we work with platform teams to run the compatibility test suite and surface issues early.
- **Early access.** Adapter authors receive early access to API changes during RFCs and release candidates.
- **Direct support.** When the adapter contract needs updating, we work directly with adapter teams.

> **Good to know:** Platforms can build closed-source adapters on the same public API and test suite. However, closed-source adapters will not be listed as verified, since the Next.js team cannot verify what it cannot inspect.

## A Note on Infrastructure Requirements

Next.js's [rendering model](/docs/app/guides/rendering-philosophy) places the static/dynamic boundary at the component level rather than the route level. Finer-grained boundaries provide more flexibility for developers at the cost of broader requirements for hosting platforms. This is a deliberate trade-off: the infrastructure requirements on this page exist because of what the rendering model delivers.


[⬆ Subir al inicio del capítulo](#)

---

<a id="turbopack"></a>

## turbopack

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure Next.js with Turbopack-specific options*  

---

The `turbopack` option lets you customize [Turbopack](/docs/app/api-reference/turbopack) to transform different files and change how modules are resolved.

> **Good to know**: The `turbopack` option was previously named `experimental.turbo` in Next.js versions 13.0.0 to 15.2.x, an option which still works as an alias, but new configuration should use the top-level `turbopack` option.
>
> If you are using an older version of Next.js, run `npx @next/codemod@latest next-experimental-turbo-to-turbopack .` to automatically migrate your configuration.

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    // ...
  },
}

export default nextConfig
```

```js
// Archivo: next.config.js switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    // ...
  },
}

module.exports = nextConfig
```

> **Good to know**:
>
> - Turbopack for Next.js does not require loaders or loader configuration for built-in functionality. Turbopack has built-in support for CSS and compiling modern JavaScript, so there's no need for `css-loader`, `postcss-loader`, or `babel-loader` if you're using `@babel/preset-env`.

## Reference

### Options

The following options are available for the `turbopack` configuration:

| Option              | Description                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `root`              | Sets the application root directory. Should be an absolute path.                                                                         |
| `rules`             | List of supported webpack loaders to apply when running with Turbopack.                                                                  |
| `resolveAlias`      | Map aliased imports to modules to load in their place.                                                                                   |
| `resolveExtensions` | List of extensions to resolve when importing files.                                                                                      |
| `debugIds`          | Enable generation of [debug IDs](https://github.com/tc39/ecma426/blob/main/proposals/debug-id.md) in JavaScript bundles and source maps. |

### Supported loaders

The following loaders have been tested to work with Turbopack's webpack loader implementation, but many other webpack loaders should work as well even if not listed here:

- [`babel-loader`](https://www.npmjs.com/package/babel-loader) [_(Configured automatically if a Babel configuration file is found)_](/docs/app/api-reference/turbopack#language-features)
- [`@svgr/webpack`](https://www.npmjs.com/package/@svgr/webpack)
- [`svg-inline-loader`](https://www.npmjs.com/package/svg-inline-loader)
- [`yaml-loader`](https://www.npmjs.com/package/yaml-loader)
- [`string-replace-loader`](https://www.npmjs.com/package/string-replace-loader)
- [`raw-loader`](https://www.npmjs.com/package/raw-loader)
- [`sass-loader`](https://www.npmjs.com/package/sass-loader) [_(Configured automatically)_](/docs/app/api-reference/turbopack#css-and-styling)
- [`graphql-tag/loader`](https://www.npmjs.com/package/graphql-tag)

#### Missing Webpack loader features

Turbopack uses the [`loader-runner`](https://github.com/webpack/loader-runner) library to execute webpack loaders, which provides most of the standard loader API. However, some features are not supported:

**Module loading:**

- [`importModule`](https://webpack.js.org/api/loaders/#thisimportmodule) - No support
- [`loadModule`](https://webpack.js.org/api/loaders/#thisloadmodule) - No support

**File system and output:**

- [`fs`](https://webpack.js.org/api/loaders/#thisfs) - Partial support: only `fs.readFile` is currently implemented.
- [`emitFile`](https://webpack.js.org/api/loaders/#thisemitfile) - No support

**Context properties:**

- [`version`](https://webpack.js.org/api/loaders/#thisversion) - No support
- [`mode`](https://webpack.js.org/api/loaders/#thismode) - No support
- [`target`](https://webpack.js.org/api/loaders/#thistarget) - No support

**Utilities:**

- [`utils`](https://webpack.js.org/api/loaders/#thisutils) - No support
- [`resolve`](https://webpack.js.org/api/loaders/#thisresolve) - No support (use [`getResolve`](https://webpack.js.org/api/loaders/#thisgetresolve) instead)

If you have a loader that is critically dependent upon one of these features please file an issue.

## Examples

### Root directory

Turbopack uses the root directory to resolve modules. Files outside of the project root are not resolved.

The reason files are not resolved outside of the project root is to improve cache validation, reduce filesystem watching overhead, and reduce the number of resolving steps needed.

Next.js automatically detects the root directory of your project. It does so by looking for one of these files:

- `pnpm-lock.yaml`
- `package-lock.json`
- `yarn.lock`
- `bun.lock`
- `bun.lockb`

If you have a different project structure, for example if you don't use workspaces, you can manually set the `root` option:

```js
// Archivo: next.config.js
const path = require('path')
module.exports = {
  turbopack: {
    root: path.join(__dirname, '..'),
  },
}
```

To resolve files from linked dependencies outside the project root (via `npm link`, `yarn link`, `pnpm link`, etc.), you must configure the `turbopack.root` to the parent directory of both the project and the linked dependencies.

While this expands the scope of filesystem watching, it's typically only necessary during development when actively working on linked packages.

### Configuring webpack loaders

If you need loader support beyond what's built in, many webpack loaders already work with Turbopack. There are currently some limitations:

- Only a core subset of the webpack loader API is implemented. Currently, there is enough coverage for some popular loaders, and we'll expand our API support in the future.
- Only loaders that return JavaScript code are supported. Loaders that transform files like stylesheets or images are not currently supported.
- Options passed to webpack loaders must be plain JavaScript primitives, objects, and arrays. For example, it's not possible to pass `require()` plugin modules as option values.

To configure loaders, add the names of the loaders you've installed and any options in `next.config.js`, mapping file extensions to a list of loaders. Rules are evaluated in order.

Here is an example below using the [`@svgr/webpack`](https://www.npmjs.com/package/@svgr/webpack) loader, which enables importing `.svg` files and rendering them as React components.

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}
```

> **Good to know**: Globs used in the `rules` object match based on file name, unless the glob contains a `/` character, which will cause it to match based on the full project-relative file path. Windows file paths are normalized to use unix-style `/` path separators.
>
> Turbopack uses a modified version of the [Rust `globset` library](https://docs.rs/globset/latest/globset/).

For loaders that require configuration options, you can use an object format instead of a string:

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
}
```

> **Good to know**: Prior to Next.js version 13.4.4, `turbopack.rules` was named `turbo.loaders` and only accepted file extensions like `.mdx` instead of `*.mdx`.

### Advanced webpack loader conditions

You can further restrict where a loader runs using the advanced `condition` syntax:

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    rules: {
      // '*' will match all file paths, but we restrict where our
      // rule runs with a condition.
      '*': {
        condition: {
          all: [
            // 'foreign' is a built-in condition.
            { not: 'foreign' },
            // 'path' can be a RegExp or a glob string. A RegExp matches
            // anywhere in the full project-relative file path.
            { path: /^img\/[0-9]{3}\// },
            {
              any: [
                { path: '*.svg' },
                // 'query' matches anywhere in the full query string,
                // which can be empty, or start with `?`.
                { query: /[?&]svgr(?=&|$)/ },
                // 'content' is always a RegExp, and can match
                // anywhere in the file.
                { content: /\<svg\W/ },
              ],
            },
          ],
        },
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}
```

- Supported boolean operators are `{all: [...]}`, `{any: [...]}` and `{not: ...}`.
- Supported customizable operators are `{path: string | RegExp}`, `{content: RegExp}`, `{query: string | RegExp}`, and `{contentType: string | RegExp}`. If multiple operators are specified in the same object, it acts as an implicit `and`.
  - `path` matches against the project-relative file path. A string is treated as a glob pattern, while a RegExp can be used to match the path partially.
  - `content` matches anywhere in the file content.
  - `query` matches the import's query string (e.g., `?foo` in `import './file?foo'`). A string must match exactly, while a RegExp can be used to match the query string partially.
  - `contentType` matches the MIME content type of the resource (e.g., from data URLs like `data:text/plain,...`). A string is treated as a glob pattern (e.g., `text/*`, `image/*`), while a RegExp can be used to match the content type partially.

In addition, a number of built-in conditions are supported:

- `browser`: Matches code that will execute on the client. Server code can be matched using `{not: 'browser'}`.
- `foreign`: Matches code in `node_modules`, as well as some Next.js internals. Usually you'll want to restrict loaders to `{not: 'foreign'}`. This can improve performance by reducing the number of files the loader is invoked on.
- `development`: Matches when using `next dev`.
- `production`: Matches when using `next build`.
- `node`: Matches code that will run on the default Node.js runtime.
- `edge-light`: Matches code that will run on the [Edge runtime](/docs/app/api-reference/edge) (deprecated).

Rules can be an object or an array of objects. An array is often useful for modeling disjoint conditions:

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    rules: {
      '*.svg': [
        {
          condition: 'browser',
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
        {
          condition: { not: 'browser' },
          loaders: [require.resolve('./custom-svg-loader.js')],
          as: '*.js',
        },
      ],
    },
  },
}
```

> **Good to know**: All matching rules are executed in order.

### Module types

You can set the module type directly without using a loader. This is useful for changing how files are processed, similar to webpack's [`type`](https://webpack.js.org/configuration/module/#ruletype) option.

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    rules: {
      '*.svg': {
        type: 'asset',
      },
    },
  },
}
```

When using `type: 'asset'`, importing the file returns its URL:

```tsx
// Archivo: app/page.tsx
import svgUrl from './icon.svg'

export default function Page() {
  return <img src={svgUrl} alt="Icon" />
}
```

The `type` option can be combined with `loaders` - loaders run first, then the result is processed according to the specified type.

Available module types:

| Type         | Description                                              |
| ------------ | -------------------------------------------------------- |
| `asset`      | Emit file and return URL (like webpack `asset/resource`) |
| `ecmascript` | Process as JavaScript                                    |
| `typescript` | Process as TypeScript                                    |
| `css`        | Process as CSS                                           |
| `css-module` | Process as CSS module                                    |
| `wasm`       | Process as WebAssembly                                   |
| `raw`        | Return raw contents as string                            |
| `bytes`      | Inline contents as bytes                                 |

### Inline loader configuration with import attributes

You can apply a Turbopack loader to an individual import using the `with` clause (import attributes). This is specified per-import rather than globally via `turbopack.rules`.

This is useful when you want to apply a loader to a specific import without affecting all files of that type.

```tsx
// Archivo: app/page.tsx
// Apply a raw loader to import a .txt file as a JavaScript module
import rawText from '../data.txt' with { turbopackLoader: 'raw-loader', turbopackAs: '*.js' }

export default function Page() {
  return <p>{rawText}</p>
}
```

The following import attributes are supported:

| Attribute                | Description                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| `turbopackLoader`        | The loader to apply (e.g. `'raw-loader'`).                                                                                    |
| `turbopackLoaderOptions` | JSON string of loader options (e.g. `'{"search":"X","replace":"Y"}'`).                                                        |
| `turbopackAs`            | Rename pattern for the output (same as `turbopack.rules[].as`). For example, `'*.js'` treats the loader output as JavaScript. |
| `turbopackModuleType`    | Set the module type for the output (same as `turbopack.rules[].type`).                                                        |

Loaders with options pass a JSON-encoded string via `turbopackLoaderOptions`:

```tsx
// Archivo: app/page.tsx
import value from '../data.js' with { turbopackLoader: 'string-replace-loader', turbopackLoaderOptions: '{"search":"PLACEHOLDER","replace":"replaced value"}' }
```

> **Good to know**: Import attributes with `turbopackLoader` are Turbopack-specific and are not supported by webpack. This feature requires the `with` keyword (not `assert`) in your import statements.

### Resolving aliases

Turbopack can be configured to modify module resolution through aliases, similar to webpack's [`resolve.alias`](https://webpack.js.org/configuration/resolve/#resolvealias) configuration.

To configure resolve aliases, map imported patterns to their new destination in `next.config.js`:

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
      mocha: { browser: 'mocha/browser-entry.js' },
    },
  },
}
```

This aliases imports of the `underscore` package to the `lodash` package. In other words, `import underscore from 'underscore'` will load the `lodash` module instead of `underscore`.

Turbopack also supports conditional aliasing through this field, similar to Node.js' [conditional exports](https://nodejs.org/docs/latest-v18.x/api/packages.html#conditional-exports). At the moment only the `browser` condition is supported. In the case above, imports of the `mocha` module will be aliased to `mocha/browser-entry.js` when Turbopack targets browser environments.

### Resolving custom extensions

Turbopack can be configured to resolve modules with custom extensions, similar to webpack's [`resolve.extensions`](https://webpack.js.org/configuration/resolve/#resolveextensions) configuration.

To configure resolve extensions, use the `resolveExtensions` field in `next.config.js`:

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
}
```

This overwrites the original resolve extensions with the provided list. Make sure to include the default extensions.

For more information and guidance for how to migrate your app to Turbopack from webpack, see [Turbopack's documentation on webpack compatibility](https://turbo.build/pack/docs/migrating-from-webpack).

### Debug IDs

Turbopack can be configured to generate [debug IDs](https://github.com/tc39/ecma426/blob/main/proposals/debug-id.md) in JavaScript bundles and source maps.

To configure debug IDs, use the `debugIds` field in `next.config.js`:

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    debugIds: true,
  },
}
```

The option automatically adds a polyfill for debug IDs to the JavaScript bundle to ensure compatibility. The debug IDs are available in the `globalThis._debugIds` global variable.

## Version History

| Version  | Changes                                              |
| -------- | ---------------------------------------------------- |
| `16.2.0` | `turbopackLoader` import attributes were added.      |
| `16.2.0` | `turbopack.rules.*.type` was added.                  |
| `16.2.0` | `turbopack.rules.*.condition.contentType` was added. |
| `16.2.0` | `turbopack.rules.*.condition.query` was added.       |
| `16.0.0` | `turbopack.debugIds` was added.                      |
| `16.0.0` | `turbopack.rules.*.condition` was added.             |
| `15.3.0` | `experimental.turbo` is changed to `turbopack`.      |
| `13.0.0` | `experimental.turbo` introduced.                     |


[⬆ Subir al inicio del capítulo](#)

---

<a id="turbopackchunking"></a>

## turbopackChunking

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackChunking](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackChunking)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure how Turbopack splits your client-side JavaScript into chunks in production.*  

---

`experimental.turbopackChunking` lets you configure Turbopack's production JavaScript
chunker. These options allow you to change the assumptions the chunker makes about user
behavior, tweak the raw size thresholds it uses, and enable the experimental component
chunks feature.

> 📘 **Nota para Pages Router:**
> `experimental.turbopackChunking` lets you configure Turbopack's production JavaScript
> chunker. These options allow you to change the assumptions the chunker makes about user
> behavior and tweak the raw size thresholds it uses.

By default, Turbopack's chunking is configured as follows:

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig = {
  experimental: {
    turbopackChunking: {
      minChunkSize: 50000,
      maxChunkCountPerGroup: 40,
      maxMergeChunkSize: 200000,
      minComponentChunkSize: 20000,
      generateComponentChunks: false,
    },
  },
} satisfies NextConfig

export default nextConfig
```

```js
// Archivo: next.config.js switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackChunking: {
      minChunkSize: 50000,
      maxChunkCountPerGroup: 40,
      maxMergeChunkSize: 200000,
      minComponentChunkSize: 20000,
      generateComponentChunks: false,
    },
  },
}

module.exports = nextConfig
```

> 📘 **Nota para Pages Router:**
> ```ts filename="next.config.ts" switcher
> import type { NextConfig } from 'next'
> 
> const nextConfig = {
>   experimental: {
>     turbopackChunking: {
>       minChunkSize: 50000,
>       maxChunkCountPerGroup: 40,
>       maxMergeChunkSize: 200000,
>     },
>   },
> } satisfies NextConfig
> 
> export default nextConfig
> ```
> 
> ```js filename="next.config.js" switcher
> /** @type {import('next').NextConfig} */
> const nextConfig = {
>   experimental: {
>     turbopackChunking: {
>       minChunkSize: 50000,
>       maxChunkCountPerGroup: 40,
>       maxMergeChunkSize: 200000,
>     },
>   },
> }
> 
> module.exports = nextConfig
> ```

## Size Thresholds

The following options control how aggressively Turbopack merges chunks and how large a chunk is
allowed to grow. Sizes are in bytes of uncompressed, unminified code (roughly 5x
the size of the compressed, minified output).

- **`minChunkSize`** (default `50000`): Turbopack will avoid creating more
  than one chunk smaller than this size by merging small chunks into larger ones.
  Raising this number will produce fewer, larger chunks. Meanwhile, lowering it
  will produce more chunks that are smaller.
- **`maxChunkCountPerGroup`** (default `40`): Turbopack will not emit more than
  this many chunks per chunk group (eg. a route or a dynamic import). Lowering
  this number will lead to more aggressive merging and less network requests
  per-page. Raising it will produce smaller chunks and increase the likelihood
  of cache hits when navigating.
- **`maxMergeChunkSize`** (default `200000`): Turbopack never merges a chunk
  larger than this size with other chunks. This keeps the code in large chunks
  from being duplicated across multiple large output chunks.

When merging chunks, the trade-off being made is an improvement to performance on initial page
loads at the cost of navigation performance. This is because each additional network request
being made is costly, however, smaller chunks are more likely to be re-usable across pages.

## Component Chunks

Producing component chunks is an experimental feature that aims to give you the initial
page load benefits of merged chunks without sacrificing reusability. This feature lets
the runtime dynamically choose whether to load a merged chunk as a single file, or to
load only the component chunks it doesn't already have. Additionally, chunks that were
already loaded as part of a merged chunk will not be re-downloaded.

This avoids re-downloading JavaScript the browser already has when navigating.

- **`generateComponentChunks`** (default `false`): when enabled, each merged
  production chunk also emits its constituent component chunks alongside it, so
  the browser runtime can fetch individual component chunks.
- **`minComponentChunkSize`** (default `20000`): component chunks smaller than
  this size are folded into a single component instead of being emitted on their own,
  to avoid producing many tiny chunks.

## Heuristics

These change the assumptions the chunker makes when weighing whether merging two
chunks is worth it.

- **`firstPageLoadPriority`** (a number between `0` and `1`): how heavily to
  weight the benefit of merging chunks for a single page load. Higher values
  merge more eagerly. If you don't have a better value, your site's bounce rate
  is a good approximation.
- **`priorityRoutes`** (an array of `RegExp`): routes that are often the first
  page a visitor lands on (e.g. the homepage). Their client-side bundles are
  merged more eagerly to reduce the single-route request cost, at the cost of
  extra requests when navigating to other pages.
- **`priorityBoost`** (default `1.5`): a multiplier on the single-request
  probability of `priorityRoutes` routes. Higher values merge those routes'
  bundles more aggressively.
- **`requestCost`** (default `200000`): the estimated cost of an
  additional request, in bytes of uncompressed, unminified code. Larger values
  bias toward fewer, larger chunks and fewer requests overall.


[⬆ Subir al inicio del capítulo](#)

---

<a id="turbopack-filesystem-caching"></a>

## Turbopack FileSystem Caching

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Learn how to enable and configure FileSystem Caching for Turbopack builds*  

---

## Usage

Turbopack FileSystem Cache enables Turbopack to reduce work across `next dev` or `next build` commands. When enabled, Turbopack will save and restore data under the `.next` directory between runs, which can greatly speed up subsequent builds and dev sessions.

Two options control the cache, one for `next dev` and one for `next build`. Both are enabled by default:

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
  },
}

export default nextConfig
```

```js
// Archivo: next.config.js switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackFileSystemCacheForDev: true,
    turbopackFileSystemCacheForBuild: true,
  },
}

module.exports = nextConfig
```

## Options

- **`turbopackFileSystemCacheForDev`** (default: `true`): caches Turbopack's work for `next dev` in `.next/dev/cache/turbopack`. Restarting the dev server reuses the previous compilation.
- **`turbopackFileSystemCacheForBuild`** (default: `true`): caches Turbopack's work for `next build` in `.next/cache/turbopack`. Subsequent builds start warm. See [Build environments](#build-environments).

Set either option to `false` to opt out.

## Build environments

The build cache lives in `.next/cache`. Builds only get faster when that directory is restored before each build.

- **Self-hosted builds**: reuse the same working directory between builds. Containerized builds start from a clean layer and do not carry `.next/cache` over unless you cache or mount it explicitly.
- **CI providers**: [configure build caching](/docs/app/guides/ci-build-caching) for `.next/cache`.

If your build environment never preserves `.next/cache`, set `turbopackFileSystemCacheForBuild: false` to skip writing a cache that will not be read.

## Version History

| Version   | Changes                                                        |
| --------- | -------------------------------------------------------------- |
| `v16.3.0` | FileSystem caching is enabled by default for builds            |
| `v16.1.0` | FileSystem caching is enabled by default for development       |
| `v16.0.0` | Beta release with separate flags for build and dev             |
| `v15.5.0` | Persistent caching released as experimental on canary releases |


[⬆ Subir al inicio del capítulo](#)

---

<a id="turbopackignoreissue"></a>

## turbopack.ignoreIssue

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackIgnoreIssue](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackIgnoreIssue)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Suppress specific Turbopack errors and warnings from the CLI output and error overlay.*  

---

The `turbopack.ignoreIssue` option allows you to filter out specific [Turbopack](/docs/app/api-reference/turbopack) errors and warnings so they do not appear in the CLI output or the error overlay. This is useful for suppressing known warnings that do not affect your application, such as intentionally unresolved optional dependencies.

This option is only available when using Turbopack (`next dev --turbopack`).

## Usage

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/vendor/**',
      },
    ],
  },
}

export default nextConfig
```

```js
// Archivo: next.config.js switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/vendor/**',
      },
    ],
  },
}

module.exports = nextConfig
```

## Options

Each rule in the `ignoreIssue` array is an object with the following fields:

| Field                         | Type               | Required | Description                                |
| ----------------------------- | ------------------ | -------- | ------------------------------------------ |
| [`path`](#path)               | `string \| RegExp` | Yes      | Matches against the file path of the issue |
| [`title`](#title)             | `string \| RegExp` | No       | Matches against the issue title            |
| [`description`](#description) | `string \| RegExp` | No       | Matches against the issue description      |

An issue is suppressed when it matches the `path` **and** all other specified fields in a rule. If only `path` is provided, any issue from a matching file is suppressed.

> **Good to know:** Issue titles and descriptions may change between Turbopack versions. The `path` field is generally stable, but is not guaranteed to remain consistent for all issue types. When possible, prefer using more specific `path` patterns over `title` or `description` matching.

### `path`

A **glob pattern** (when a string) or **regular expression** that matches against the file path where the issue originated.

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    ignoreIssue: [
      // Glob pattern: suppress issues from any file under vendor/
      { path: '**/vendor/**' },
      // RegExp: suppress issues from files matching a pattern
      { path: /node_modules\/legacy-lib/ },
    ],
  },
}
```

### `title`

An **exact string match** (when a string) or **regular expression** that matches against the issue title.

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/src/**',
        title: 'Module not found',
      },
    ],
  },
}
```

### `description`

An **exact string match** (when a string) or **regular expression** that matches against the issue description.

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/src/**',
        description: /Cannot find module 'optional-dep'/,
      },
    ],
  },
}
```

## Examples

### Suppressing warnings for optional dependencies

If your code uses `try/catch` around an optional `require()` call, Turbopack may report a "Module not found" warning. You can suppress it:

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/lib/optional-feature/**',
        title: 'Module not found',
      },
    ],
  },
}

export default nextConfig
```

```js
// Archivo: next.config.js switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    ignoreIssue: [
      {
        path: '**/lib/optional-feature/**',
        title: 'Module not found',
      },
    ],
  },
}

module.exports = nextConfig
```

### Combining multiple rules

You can specify multiple rules to suppress different issues:

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    ignoreIssue: [
      { path: '**/vendor/**' },
      { path: '**/legacy/**', title: 'Module not found' },
      { path: /generated\//, description: /expected identifier/ },
    ],
  },
}
```

## Version History

| Version   | Changes                             |
| --------- | ----------------------------------- |
| `v16.2.0` | `turbopack.ignoreIssue` introduced. |


[⬆ Subir al inicio del capítulo](#)

---

<a id="turbopacklocalpostcssconfig"></a>

## turbopackLocalPostcssConfig

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackLocalPostcssConfig](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackLocalPostcssConfig)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Enable per-directory PostCSS config resolution in Turbopack so that the config closest to each CSS file takes precedence over the project root config.*  

---

The `turbopackLocalPostcssConfig` option changes how Turbopack resolves `postcss.config.js` files. When enabled, Turbopack searches for the config starting from the CSS file's own directory first, then falls back to the project root. By default, Turbopack checks the project root first, meaning a root-level `postcss.config.js` always takes precedence over configs in subdirectories.

This option is only relevant when using Turbopack (`next dev` or `next build`).

## Usage

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackLocalPostcssConfig: true,
  },
}

export default nextConfig
```

```js
// Archivo: next.config.js switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackLocalPostcssConfig: true,
  },
}

module.exports = nextConfig
```

## Behavior

| Setting           | Config resolution order             |
| ----------------- | ----------------------------------- |
| `false` (default) | Project root → CSS file's directory |
| `true`            | CSS file's directory → project root |

With the default behavior, a `postcss.config.js` at the project root is used for all CSS files, and per-directory configs are only applied if no root config exists. Enabling `turbopackLocalPostcssConfig` reverses this: per-directory configs take precedence, and the root config serves as the fallback.

## Example

This is useful for projects that need different PostCSS transforms in different directories, such as a monorepo with multiple apps or design system packages:

```
my-app/
├── postcss.config.js          ← fallback (applied if no local config is found)
├── app/
│   └── page.module.css        ← uses root config
└── packages/
    └── ui/
        ├── postcss.config.js  ← takes precedence for files in this directory
        └── button.module.css  ← uses packages/ui/postcss.config.js
```

## Version History

| Version   | Changes                                   |
| --------- | ----------------------------------------- |
| `v16.3.0` | `turbopackLocalPostcssConfig` introduced. |


[⬆ Subir al inicio del capítulo](#)

---

<a id="turbopack-memory-eviction"></a>

## Turbopack Memory Eviction

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackMemoryEviction](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackMemoryEviction)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Learn how to control Turbopack's memory eviction strategy for the persistent cache.*  

---

## Usage

`turbopackMemoryEviction` controls whether Turbopack reclaims memory while the persistent (FileSystem) cache is enabled. After Turbopack writes a snapshot of its cache to disk, it can 'evict' the in-memory copies of that data and reload them from disk on demand.

Currently there are three options

- `false`: never evict. Cached data stays in memory for the lifetime of the process.
- `'auto'` (default): evict after a snapshot only once enough memory has been allocated since the last eviction to make it worthwhile. Leverages thresholds and memory pressure feedback from the operating system.
- `'full'`: evict all possible data from memory every time we save to disk.

> **Good to know:** This option only has an effect in `next dev` sessions when the [FileSystem Cache](/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache) is enabled, since eviction relies on data already being persisted to disk. It is experimental and under active development.

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    turbopackMemoryEviction: 'auto',
  },
}

export default nextConfig
```

```js
// Archivo: next.config.js switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopackMemoryEviction: 'auto',
  },
}

module.exports = nextConfig
```

## Version Changes

| Version   | Changes                                             |
| --------- | --------------------------------------------------- |
| `v16.3.0` | `turbopackMemoryEviction` released as experimental. |


[⬆ Subir al inicio del capítulo](#)

---

<a id="turbopackrustreactcompiler"></a>

## turbopackRustReactCompiler

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackRustReactCompiler](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackRustReactCompiler)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Use the native Rust port of the React Compiler with Turbopack instead of the Babel transform.*  

---

The `experimental.turbopackRustReactCompiler` option enables the native Rust version of the [React Compiler](/docs/app/api-reference/config/next-config-js/reactCompiler), running it directly inside Turbopack as native code instead of through Node.js as it does with the standard Babel version. This typically results in a noticeable performance improvement.

This option is released as experimental to gather feedback before it becomes the default.

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable the React Compiler
  reactCompiler: true,
  experimental: {
    // Use the Rust port instead of the Babel transform
    turbopackRustReactCompiler: true,
  },
}

export default nextConfig
```

```js
// Archivo: next.config.js switcher
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable the React Compiler
  reactCompiler: true,
  experimental: {
    // Use the Rust port instead of the Babel transform
    turbopackRustReactCompiler: true,
  },
}

module.exports = nextConfig
```

## Good to know

> - This option requires [`reactCompiler`](/docs/app/api-reference/config/next-config-js/reactCompiler) to be enabled. It selects which implementation runs, but does not turn the compiler on by itself.
> - This option is only supported with Turbopack. Using it with webpack will throw an error.
> - When enabled, you do not need to install `babel-plugin-react-compiler`. The Rust compiler runs natively inside Turbopack.

See the [`reactCompiler` option documentation](/docs/app/api-reference/config/next-config-js/reactCompiler) for details on how to use the compiler.

## Version History

| Version   | Changes                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------- |
| `v16.3.0` | Introduced the experimental `turbopackRustReactCompiler` option for the native Rust React Compiler. |


[⬆ Subir al inicio del capítulo](#)

---

<a id="turbopack"></a>

## Turbopack

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/turbopack](https://nextjs.org/docs/app/api-reference/turbopack)  
> 📂 **Sección:** App > Api Reference  
> 📝 **Descripción:** *Turbopack is an incremental bundler optimized for JavaScript and TypeScript, written in Rust, and built into Next.js.*  

---

Turbopack is an **incremental bundler** optimized for JavaScript and TypeScript, written in Rust, and built into **Next.js**. You can use Turbopack with both the Pages and App Router for a **much faster** local development experience.

## Why Turbopack?

We built Turbopack to push the performance of Next.js, including:

- **Unified Graph:** Next.js supports multiple output environments (e.g., client and server). Managing multiple compilers and stitching bundles together can be tedious. Turbopack uses a **single, unified graph** for all environments.
- **Bundling vs Native ESM:** Some tools skip bundling in development and rely on the browser's native ESM. This works well for small apps but can slow down large apps due to excessive network requests. Turbopack **bundles** in dev, but in an optimized way to keep large apps fast.
- **Incremental Computation:** Turbopack parallelizes work across cores and **caches** results down to the function level. Once a piece of work is done, Turbopack won’t repeat it. Results persist to disk between runs.
- **Lazy Bundling:** Turbopack only bundles what is actually requested by the dev server. This lazy approach can reduce initial compile times and memory usage.

## Supported platforms

Turbopack requires platform-specific native bindings. The following platforms are currently supported:

| Platform       | Architecture |
| -------------- | ------------ |
| macOS (Darwin) | x64, ARM64   |
| Windows        | x64, ARM64   |
| Linux (glibc)  | x64, ARM64   |
| Linux (musl)   | x64, ARM64   |

On platforms without native bindings (e.g. FreeBSD, OpenBSD), Next.js falls back to WebAssembly (WASM) bindings. WASM bindings support core SWC features like compilation and minification, but **do not support Turbopack**. On these platforms, use the `--webpack` flag:

```bash
next dev --webpack
next build --webpack
```

## Getting started

Turbopack is now the **default bundler** in Next.js. No configuration is needed to use Turbopack:

```json
// Archivo: package.json highlight={3}
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

### Using Webpack instead

If you need to use Webpack instead of Turbopack, you can opt-in with the `--webpack` flag:

```json
// Archivo: package.json
{
  "scripts": {
    "dev": "next dev --webpack",
    "build": "next build --webpack",
    "start": "next start"
  }
}
```

## Supported features

Turbopack in Next.js has **zero-configuration** for the common use cases. Below is a summary of what is supported out of the box, plus some references to how you can configure Turbopack further when needed.

### Language features

| Feature                     | Status        | Notes                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **JavaScript & TypeScript** | **Supported** | Uses SWC under the hood. Type-checking is not done by Turbopack (run `tsc --watch` or rely on your IDE for type checks).                                                                                                                                                                                                                                                                                                |
| **ECMAScript (ESNext)**     | **Supported** | Turbopack supports the latest ECMAScript features, matching SWC’s coverage.                                                                                                                                                                                                                                                                                                                                             |
| **CommonJS**                | **Supported** | `require()` syntax is handled out of the box.                                                                                                                                                                                                                                                                                                                                                                           |
| **ESM**                     | **Supported** | Static and dynamic `import` are fully supported.                                                                                                                                                                                                                                                                                                                                                                        |
| **Babel**                   | **Supported** | Starting in Next.js 16, Turbopack uses Babel automatically if it detects [a configuration file][babel-config]. Unlike in webpack, SWC is always used for Next.js's internal transforms and downleveling to older ECMAScript revisions. Next.js with webpack disables SWC if a Babel configuration file is present. Files in `node_modules` are excluded, unless you [manually configure `babel-loader`][manual-loader]. |

[babel-config]: https://babeljs.io/docs/config-files
[manual-loader]: /docs/app/api-reference/config/next-config-js/turbopack#configuring-webpack-loaders

### Framework and React features

| Feature                           | Status        | Notes                                                                                                                  |
| --------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **JSX / TSX**                     | **Supported** | SWC handles JSX/TSX compilation.                                                                                       |
| **Fast Refresh**                  | **Supported** | No configuration needed.                                                                                               |
| **React Server Components (RSC)** | **Supported** | For the Next.js App Router. Turbopack ensures correct server/client bundling.                                          |
| **Root layout creation**          | Unsupported   | Automatic creation of a root layout in App Router is not supported. Turbopack will instruct you to create it manually. |

### CSS and styling

| Feature            | Status                  | Notes                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------ | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Global CSS**     | **Supported**           | Import `.css` files directly in your application.                                                                                                                                                                                                                                                                                                                     |
| **CSS Modules**    | **Supported**           | `.module.css` files work natively (Lightning CSS).                                                                                                                                                                                                                                                                                                                    |
| **CSS Nesting**    | **Supported**           | Lightning CSS supports [modern CSS nesting](https://lightningcss.dev/).                                                                                                                                                                                                                                                                                               |
| **@import syntax** | **Supported**           | Combine multiple CSS files.                                                                                                                                                                                                                                                                                                                                           |
| **PostCSS**        | **Supported**           | Automatically processes PostCSS config files (`postcss.config.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, `.cts`) in a Node.js worker pool. Useful for Tailwind, Autoprefixer, etc.                                                                                                                                                                                           |
| **Sass / SCSS**    | **Supported** (Next.js) | For Next.js, Sass is supported out of the box. Custom Sass functions (`sassOptions.functions`) are not supported because Turbopack's Rust-based architecture cannot directly execute JavaScript functions, unlike webpack's Node.js environment. Use webpack if you need this feature. In the future, Turbopack standalone usage will likely require a loader config. |
| **Less**           | Planned via plugins     | Not yet supported by default. Will likely require a loader config once custom loaders are stable.                                                                                                                                                                                                                                                                     |
| **Lightning CSS**  | **In Use**              | Handles CSS transformations. Some low-usage CSS Modules features (like `:local/:global` as standalone pseudo-classes) are not yet supported. [See below for more details.](#unsupported-and-unplanned-features)                                                                                                                                                       |

### Assets

| Feature                           | Status        | Notes                                                                                                                      |
| --------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Static Assets** (images, fonts) | **Supported** | Importing `import img from './img.png'` works out of the box. In Next.js, returns an object for the `

![Illustration]()

` component. |
| **JSON Imports**                  | **Supported** | Named or default imports from `.json` are supported.                                                                       |

### Module resolution

| Feature               | Status              | Notes                                                                                                                                                           |
| --------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Path Aliases**      | **Supported**       | Reads `tsconfig.json`'s `paths` and `baseUrl`, matching Next.js behavior.                                                                                       |
| **Manual Aliases**    | **Supported**       | [Configure `resolveAlias` in `next.config.js`](/docs/app/api-reference/config/next-config-js/turbopack#resolving-aliases) (similar to `webpack.resolve.alias`). |
| **Custom Extensions** | **Supported**       | [Configure `resolveExtensions` in `next.config.js`](/docs/app/api-reference/config/next-config-js/turbopack#resolving-custom-extensions).                       |
| **AMD**               | Partially Supported | Basic transforms work; advanced AMD usage is limited.                                                                                                           |

### Performance and Fast Refresh

| Feature                  | Status        | Notes                                                                                                                                                       |
| ------------------------ | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Fast Refresh**         | **Supported** | Updates JavaScript, TypeScript, and CSS without a full refresh.                                                                                             |
| **Incremental Bundling** | **Supported** | Turbopack lazily builds only what's requested by the dev server, speeding up large apps.                                                                    |
| **FileSystem Cache**     | **Supported** | Persists compiler artifacts to disk between runs. See [`turbopackFileSystemCache`](/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache). |

### Magic Comments

Turbopack supports webpack-compatible magic comments for controlling import behavior. These comments work with dynamic `import()`, `require()`, `require.resolve()`, and `new Worker()` expressions (not static `import` statements).

| Comment                   | Webpack | Turbopack | Description                    |
| ------------------------- | ------- | --------- | ------------------------------ |
| `webpackIgnore: true`     | ✓       | ✓         | Skip bundling, preserve import |
| `turbopackIgnore: true`   | ✗       | ✓         | Skip bundling (Turbopack-only) |
| `turbopackOptional: true` | ✗       | ✓         | Suppress resolve errors        |
| `webpackOptional: true`   | ✗       | ✗         | Not supported                  |

See [Lazy Loading](/docs/app/guides/lazy-loading#magic-comments) for usage examples.

## import.meta.env

Turbopack supports built-in environment metadata through `import.meta.env`:

| Property   | Type      | Value                                                              |
| ---------- | --------- | ------------------------------------------------------------------ |
| `DEV`      | `boolean` | Whether `MODE` is not `"production"`                               |
| `PROD`     | `boolean` | Whether `MODE` is `"production"`                                   |
| `MODE`     | `string`  | The compile-time `NODE_ENV`, defaulting to `"development"`         |
| `BASE_URL` | `string`  | The Next.js `basePath`, with a trailing slash (`"/"` by default)   |
| `SSR`      | `boolean` | `true` in server bundles and `false` in browser and client bundles |

These values are statically analyzed, so Turbopack can remove unreachable branches:

```ts
// Archivo: app/example.ts
if (import.meta.env.DEV) {
  console.log('development mode')
}
```

You can also read the whole object, destructure it, or use static bracket access:

```ts
// Archivo: app/example.ts
const { MODE, SSR } = import.meta.env
const baseUrl = import.meta.env['BASE_URL']
```

> **Good to know**: `import.meta.env` requires Turbopack. Custom `VITE_*` variables, Vite custom modes, `envPrefix`, and `envDir` are not supported. `BASE_URL` reflects the Next.js [`basePath`](/docs/app/api-reference/config/next-config-js/basePath) configuration and includes a trailing slash to match Vite's format.

## import.meta.glob

Turbopack supports `import.meta.glob()`, a Vite-compatible API for importing multiple modules at once using glob patterns. The result is an object keyed by the file path relative to the calling file.

```js
const modules = import.meta.glob('./dir/*.js')
// {
//   './dir/foo.js': () => import('./dir/foo.js'),
//   './dir/bar.js': () => import('./dir/bar.js'),
// }
```

> **Good to know:** `import.meta.glob` requires Turbopack. It is not available when using webpack.

### Lazy loading (default)

By default, each value in the result object is a thunk — a function that returns a `Promise` for the module. This enables lazy loading:

```js
const modules = import.meta.glob('./dir/*.js')

for (const path in modules) {
  const module = await modules[path]()
  console.log(path, module)
}
```

### Eager loading

Pass `{ eager: true }` to import all matching modules up front. Each value is the module object directly instead of a thunk:

```js
const modules = import.meta.glob('./dir/*.js', { eager: true })

for (const path in modules) {
  console.log(path, modules[path].default)
}
```

### Named imports

Use the `import` option to select a specific named export from each matched module. This works in both lazy and eager modes:

```js
// Lazy: each value is () => Promise<exportValue>
const defaults = import.meta.glob('./dir/*.js', { import: 'default' })

// Eager: each value is the export value directly
const setups = import.meta.glob('./dir/*.js', { import: 'setup', eager: true })
```

### Query strings

Use the `query` option to append a query string to every import request. This is useful for loading files as raw strings or URLs:

```js
const rawFiles = import.meta.glob('./dir/*.txt', { query: '?raw' })
const urls = import.meta.glob('./dir/*.png', { query: '?url' })
```

The `query` option also accepts an object. Keys and values are URL-encoded and joined into a query string:

```js
const modules = import.meta.glob('./*.ts', {
  query: { bar: 'foo', raw: true },
})
// equivalent to: { query: '?bar=foo&raw=true' }
```

### Multiple patterns and negation

Pass an array of glob patterns as the first argument. Prefix a pattern with `!` to exclude matching files:

```js
// Combine multiple directories
const modules = import.meta.glob(['./dir/*.js', './other/*.js'])

// Exclude specific files
const withoutTests = import.meta.glob(['./src/**/*.js', '!**/*.test.js'])
```

### TypeScript

TypeScript types for `import.meta.glob` are included in Next.js. They are available automatically when `"moduleResolution": "bundler"` (or `"node16"` / `"nodenext"`) is set in your `tsconfig.json`, which is the default for new Next.js projects.

The return type differs based on the `eager` option:

```ts
// Lazy (default) — Record<string, () => Promise<unknown>>
const lazy = import.meta.glob('./dir/*.ts')

// Eager — Record<string, unknown>
const eager = import.meta.glob('./dir/*.ts', { eager: true })
```

### Options reference

| Option          | Type                                          | Default     | Description                                                                |
| --------------- | --------------------------------------------- | ----------- | -------------------------------------------------------------------------- |
| `eager`         | `boolean`                                     | `false`     | Import modules synchronously instead of returning thunks.                  |
| `import`        | `string`                                      | `undefined` | Named export to select from each matched module (e.g. `'default'`).        |
| `query`         | `string \| Record<string, string \| boolean>` | `undefined` | Query string (or object) to append to each import.                         |
| `base`          | `string`                                      | `undefined` | Override the base path used for resolving patterns and keying results.     |
| `caseSensitive` | `boolean`                                     | `true`      | Match glob patterns case-sensitively. Set to `false` to ignore ASCII case. |

> **Note:** The `as` option (deprecated in Vite 5) is not supported. Use `query: '?raw'` or `query: '?url'` instead. The legacy `import.meta.globEager()` API is also not supported — use `import.meta.glob('...', { eager: true })` instead.

## Known gaps with webpack

There are a number of non-trivial behavior differences between webpack and Turbopack that are important to be aware of when migrating an application. Generally, these are less of a concern for new applications.

### Filesystem Root

Turbopack uses the root directory to resolve modules. Files outside of the project root are not resolved.

For example, when linking dependencies outside the project root (via `npm link`, `yarn link`, `pnpm link`, etc.), those linked files will not be resolved by default. To resolve these files, you must configure the root option to the parent directory of both the project and the linked dependencies.

You can configure the filesystem root using [turbopack.root](/docs/app/api-reference/config/next-config-js/turbopack#root-directory) option in `next.config.js`.

### CSS Module Ordering

Turbopack will follow JS import order to order [CSS modules](/docs/app/getting-started/css#css-modules) which are not otherwise ordered. For example:

```jsx
// Archivo: components/BlogPost.jsx
import utilStyles from './utils.module.css'
import buttonStyles from './button.module.css'
export default function BlogPost() {
  return (
    <div className={utilStyles.container}>
      <button className={buttonStyles.primary}>Click me</button>
    </div>
  )
}
```

In this example, Turbopack will ensure that `utils.module.css` will appear before `button.module.css` in the produced CSS chunk, following the import order

Webpack generally does this as well, but there are cases where it will ignore JS inferred ordering, for example if it infers the JS file is side-effect-free.

This can lead to subtle rendering changes when adopting Turbopack, if applications have come to rely on an arbitrary ordering. Generally, the solution is easy, e.g. have `button.module.css` `@import utils.module.css` to force the ordering, or identify the conflicting rules and change them to not target the same properties.

### Sass node_modules imports

Turbopack supports importing `node_modules` Sass files out of the box. Webpack supports a legacy tilde `~` syntax for this, which is not supported by Turbopack.

From:

```scss
// Archivo: styles/globals.scss
@import '~bootstrap/dist/css/bootstrap.min.css';
```

To:

```scss
// Archivo: styles/globals.scss
@import 'bootstrap/dist/css/bootstrap.min.css';
```

If you can't update the imports, you can add a `turbopack.resolveAlias` configuration to map the `~` syntax to the actual path:

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    resolveAlias: {
      '~*': '*',
    },
  },
}
```

### CSS / Sass / SCSS decimal precision

Turbopack uses [Lightning CSS](https://lightningcss.dev/) to compile CSS. Lightning CSS uses 5 digits of decimal precision for numeric CSS values, while webpack uses 10 digits. This applies to both plain CSS and Sass/SCSS output. For example, a value that evaluates to `25/17` produces:

- **Webpack:** `line-height: 1.4705882353` (10 digits)
- **Turbopack:** `line-height: 1.47059` (5 digits)

This can lead to subtle rendering differences when migrating from webpack to Turbopack, especially for properties like `line-height`, `letter-spacing`, or other calculated values where high precision matters.

### Webpack plugins

Turbopack does not support webpack plugins. This affects third-party tools that rely on webpack's plugin system for integration. We do support [webpack loaders](/docs/app/api-reference/config/next-config-js/turbopack#configuring-webpack-loaders). If you depend on webpack plugins, you'll need to find Turbopack-compatible alternatives or continue using webpack until equivalent functionality is available.

## Unsupported and unplanned features

Some features are not yet implemented or not planned:

- **Legacy CSS Modules features**
  - Standalone `:local` and `:global` pseudo-classes (only the function variant `:global(...)` is supported).
  - The `@value` rule (superseded by CSS variables).
  - `:import` and `:export` ICSS rules.
  - `composes` in `.module.css` composing a `.css` file. In webpack this would treat the `.css` file as a CSS Module, with Turbopack the `.css` file will always be global. This means that if you want to use `composes` in a CSS Module, you need to change the `.css` file to a `.module.css` file.
  - `@import` in CSS Modules importing `.css` as a CSS Module. In webpack this would treat the `.css` file as a CSS Module, with Turbopack the `.css` file will always be global. This means that if you want to use `@import` in a CSS Module, you need to change the `.css` file to a `.module.css` file.
- **`sassOptions.functions`**
  Custom Sass functions defined in `sassOptions.functions` are not supported. This feature allows defining JavaScript functions that can be called from Sass code during compilation. Turbopack's Rust-based architecture cannot directly execute JavaScript functions passed through `sassOptions.functions`, unlike webpack's Node.js-based sass-loader which runs entirely in JavaScript. If you're using custom Sass functions, you'll need to use webpack instead of Turbopack.
- **`webpack()` configuration** in `next.config.js`
  Turbopack replaces webpack, so `webpack()` configs are not recognized. Use the [`turbopack` config](/docs/app/api-reference/config/next-config-js/turbopack) instead.
- **Yarn PnP**
  Not planned for Turbopack support in Next.js.
- **`experimental.urlImports`**
  Not planned for Turbopack.
- **`experimental.esmExternals`**
  Not planned. Turbopack does not support the legacy `esmExternals` configuration in Next.js.
- **Some Next.js Experimental Flags**
  - `experimental.nextScriptWorkers`
  - `experimental.fallbackNodePolyfills`
    We plan to implement these in the future.

For a full, detailed breakdown of each feature flag and its status, see the [Turbopack API Reference](/docs/app/api-reference/config/next-config-js/turbopack).

## Configuration

Turbopack can be configured via `next.config.js` (or `next.config.ts`) under the `turbopack` key. Configuration options include:

- **`rules`**
  Define additional [webpack loaders](/docs/app/api-reference/config/next-config-js/turbopack#configuring-webpack-loaders) for file transformations.
- **`resolveAlias`**
  Create manual aliases (like `resolve.alias` in webpack).
- **`resolveExtensions`**
  Change or extend file extensions for module resolution.
- **[`ignoreIssue`](/docs/app/api-reference/config/next-config-js/turbopackIgnoreIssue)**
  Suppress specific Turbopack errors and warnings from the CLI output and error overlay.

Additionally, the following experimental options are available under `experimental` in `next.config.js`:

| Option                                                                                                       | Description                                                                                                                                  | Default (dev) | Default (build)               |
| ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | ----------------------------- |
| [`turbopackFileSystemCacheForDev`](/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache)   | Enable filesystem cache for the dev server.                                                                                                  | `true`        | N/A                           |
| [`turbopackFileSystemCacheForBuild`](/docs/app/api-reference/config/next-config-js/turbopackFileSystemCache) | Enable filesystem cache for builds.                                                                                                          | N/A           | `true`<sup>1</sup>            |
| `turbopackMinify`                                                                                            | Enable minification.                                                                                                                         | `false`       | `true`                        |
| `turbopackSourceMaps`                                                                                        | Enable source maps.                                                                                                                          | `true`        | `productionBrowserSourceMaps` |
| `turbopackInputSourceMaps`                                                                                   | Enable extraction of source maps from input files.                                                                                           | `true`        | `true`                        |
| `turbopackModuleFragments`                                                                                   | Currently in active development. This splits modules into fragments and chunks only import the used fragments of the modules.                | `false`       | `false`                       |
| `turbopackRemoveUnusedImports`                                                                               | Enable removing unused imports. Requires `turbopackRemoveUnusedExports`.                                                                     | `false`       | `true`                        |
| `turbopackRemoveUnusedExports`                                                                               | Enable removing unused exports.                                                                                                              | `false`       | `true`                        |
| `turbopackInferModuleSideEffects`                                                                            | Enable local analysis to infer side-effect-free modules for better tree shaking.                                                             | `true`        | `true`                        |
| `turbopackScopeHoisting`                                                                                     | Enable scope hoisting. Always disabled in dev mode.                                                                                          | `false`       | `true`                        |
| `turbopackClientSideNestedAsyncChunking`                                                                     | Enable nested async chunking for client-side assets.                                                                                         | `false`       | `true`                        |
| `turbopackServerSideNestedAsyncChunking`                                                                     | Enable nested async chunking for server-side assets.                                                                                         | `false`       | `false`                       |
| `turbopackImportTypeBytes`                                                                                   | Enable support for `with {type: "bytes"}` for ESM imports.                                                                                   | `false`       | `false`                       |
| `turbopackUseBuiltinBabel`                                                                                   | Enable automatic Babel loader configuration when a Babel config file is present.                                                             | `true`        | `true`                        |
| `turbopackUseBuiltinSass`                                                                                    | Enable automatic Sass loader configuration.                                                                                                  | `true`        | `true`                        |
| `turbopackModuleIds`                                                                                         | Module ID strategy: `'named'` or `'deterministic'`.                                                                                          | `'named'`     | `'deterministic'`             |
| [`turbopackLocalPostcssConfig`](/docs/app/api-reference/config/next-config-js/turbopackLocalPostcssConfig)   | Resolve `postcss.config.js` from the CSS file's directory first, then the project root.                                                      | `false`       | `false`                       |
| `turbopackWorkerAssetPrefix`                                                                                 | Custom asset prefix for Web Worker URLs (entrypoint + module chunks), overriding `assetPrefix`. Mirrors webpack's `output.workerPublicPath`. | `undefined`   | `undefined`                   |

**Table notes:**

1. Enabled by default. Set the option to `false` when the build environment does not preserve the `.next/cache` directory between builds.

For example, to configure an alias and a custom file extension under the `turbopack` key:

```js
// Archivo: next.config.js
module.exports = {
  turbopack: {
    resolveAlias: {
      underscore: 'lodash',
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
}
```

For more in-depth configuration examples, see the [Turbopack config documentation](/docs/app/api-reference/config/next-config-js/turbopack).

## Generating trace files for performance debugging

If you encounter performance or memory issues and want to help the Next.js team diagnose them, you can generate a trace file by adding the `--internal-trace` flag to your dev command:

```bash
next dev --internal-trace
```

This will produce a `.next-profiles/trace-turbopack.bin` file. Include that file when creating a GitHub issue on the [Next.js repo](https://github.com/vercel/next.js) to help us investigate.

## Summary

Turbopack is a **Rust-based**, **incremental** bundler designed to make local development and builds fast—especially for large applications. It is integrated into Next.js, offering zero-config CSS, React, and TypeScript support.

## Version Changes

| Version   | Changes                                                                                                            |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| `v16.0.0` | Turbopack becomes the default bundler for Next.js. Automatic support for Babel when a configuration file is found. |
| `v15.5.0` | Turbopack support for `build` beta                                                                                 |
| `v15.3.0` | Experimental support for `build`                                                                                   |
| `v15.0.0` | Turbopack for `dev` stable                                                                                         |


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-deploy-your-nextjs-application"></a>

## How to deploy your Next.js application

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/getting-started/deploying](https://nextjs.org/docs/pages/getting-started/deploying)  
> 📂 **Sección:** Pages > Getting Started  
> 📝 **Descripción:** *Learn how to deploy your Next.js application.*  

---




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

<a id="how-to-set-up-a-custom-server-in-nextjs"></a>

## How to set up a custom server in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/custom-server](https://nextjs.org/docs/pages/guides/custom-server)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Start a Next.js app programmatically using a custom server.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="pages-and-layouts"></a>

## Pages and Layouts

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts](https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts)  
> 📂 **Sección:** Pages > Building Your Application > Routing  
> 📝 **Descripción:** *Create your first page and shared layout with the Pages Router.*  

---

The Pages Router has a file-system based router built on the concept of pages.

When a file is added to the `pages` directory, it's automatically available as a route.

In Next.js, a **page** is a [React Component](https://react.dev/learn/your-first-component) exported from a `.js`, `.jsx`, `.ts`, or `.tsx` file in the `pages` directory. Each page is associated with a route based on its file name.

**Example**: If you create `pages/about.js` that exports a React component like below, it will be accessible at `/about`.

```jsx
export default function About() {
  return <div>About</div>
}
```

## Index routes

The router will automatically route files named `index` to the root of the directory.

- `pages/index.js` → `/`
- `pages/blog/index.js` → `/blog`

## Nested routes

The router supports nested files. If you create a nested folder structure, files will automatically be routed in the same way still.

- `pages/blog/first-post.js` → `/blog/first-post`
- `pages/dashboard/settings/username.js` → `/dashboard/settings/username`

## Pages with Dynamic Routes

Next.js supports pages with dynamic routes. For example, if you create a file called `pages/posts/[id].js`, then it will be accessible at `posts/1`, `posts/2`, etc.

> To learn more about dynamic routing, check the [Dynamic Routing documentation](/docs/pages/building-your-application/routing/dynamic-routes).

## Layout Pattern

The React model allows us to deconstruct a [page](/docs/pages/building-your-application/routing/pages-and-layouts) into a series of components. Many of these components are often reused between pages. For example, you might have the same navigation bar and footer on every page.

```jsx
// Archivo: components/layout.js
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```

## Examples

### Single Shared Layout with Custom App

If you only have one layout for your entire application, you can create a [Custom App](/docs/pages/building-your-application/routing/custom-app) and wrap your application with the layout. Since the `<Layout />` component is re-used when changing pages, its component state will be preserved (e.g. input values).

```jsx
// Archivo: pages/_app.js
import Layout from '../components/layout'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
```

### Per-Page Layouts

If you need multiple layouts, you can add a property `getLayout` to your page, allowing you to return a React component for the layout. This allows you to define the layout on a _per-page basis_. Since we're returning a function, we can have complex nested layouts if desired.

```jsx
// Archivo: pages/index.js

import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'

export default function Page() {
  return (
    /** Your content */
  )
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}
```

```jsx
// Archivo: pages/_app.js
export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
```

When navigating between pages, we want to _persist_ page state (input values, scroll position, etc.) for a Single-Page Application (SPA) experience.

This layout pattern enables state persistence because the React component tree is maintained between page transitions. With the component tree, React can understand which elements have changed to preserve state.

> **Good to know**: This process is called [reconciliation](https://react.dev/learn/preserving-and-resetting-state), which is how React understands which elements have changed.

### With TypeScript

When using TypeScript, you must first create a new type for your pages which includes a `getLayout` function. Then, you must create a new type for your `AppProps` which overrides the `Component` property to use the previously created type.

```tsx
// Archivo: pages/index.tsx switcher
import type { ReactElement } from 'react'
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'
import type { NextPageWithLayout } from './_app'

const Page: NextPageWithLayout = () => {
  return <p>hello world</p>
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}

export default Page
```

```jsx
// Archivo: pages/index.js switcher
import Layout from '../components/layout'
import NestedLayout from '../components/nested-layout'

const Page = () => {
  return <p>hello world</p>
}

Page.getLayout = function getLayout(page) {
  return (
    <Layout>
      <NestedLayout>{page}</NestedLayout>
    </Layout>
  )
}

export default Page
```

```tsx
// Archivo: pages/_app.tsx switcher
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
```

```jsx
// Archivo: pages/_app.js switcher
export default function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(<Component {...pageProps} />)
}
```

### Data Fetching

Inside your layout, you can fetch data on the client-side using `useEffect` or a library like [SWR](https://swr.vercel.app/). Because this file is not a [Page](/docs/pages/building-your-application/routing/pages-and-layouts), you cannot use `getStaticProps` or `getServerSideProps` currently.

```jsx
// Archivo: components/layout.js
import useSWR from 'swr'
import Navbar from './navbar'
import Footer from './footer'

export default function Layout({ children }) {
  const { data, error } = useSWR('/api/navigation', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <>
      <Navbar links={data.links} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
```


[⬆ Subir al inicio del capítulo](#)

---

<a id="dynamic-routes"></a>

## Dynamic Routes

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes](https://nextjs.org/docs/pages/building-your-application/routing/dynamic-routes)  
> 📂 **Sección:** Pages > Building Your Application > Routing  
> 📝 **Descripción:** *Dynamic Routes are pages that allow you to add custom params to your URLs. Start creating Dynamic Routes and learn more here.*  

---

When you don't know the exact segment names ahead of time and want to create routes from dynamic data, you can use Dynamic Segments that are filled in at request time or [prerendered](/docs/pages/building-your-application/data-fetching/get-static-paths) at build time.

## Convention

A Dynamic Segment can be created by wrapping a file or folder name in square brackets: `[segmentName]`. For example, `[id]` or `[slug]`.

Dynamic Segments can be accessed from [`useRouter`](/docs/pages/api-reference/functions/use-router).

## Example

For example, a blog could include the following route `pages/blog/[slug].js` where `[slug]` is the Dynamic Segment for blog posts.

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()
  return <p>Post: {router.query.slug}</p>
}
```

| Route                  | Example URL | `params`        |
| ---------------------- | ----------- | --------------- |
| `pages/blog/[slug].js` | `/blog/a`   | `{ slug: 'a' }` |
| `pages/blog/[slug].js` | `/blog/b`   | `{ slug: 'b' }` |
| `pages/blog/[slug].js` | `/blog/c`   | `{ slug: 'c' }` |

## Catch-all Segments

Dynamic Segments can be extended to **catch-all** subsequent segments by adding an ellipsis inside the brackets `[...segmentName]`.

For example, `pages/shop/[...slug].js` will match `/shop/clothes`, but also `/shop/clothes/tops`, `/shop/clothes/tops/t-shirts`, and so on.

| Route                     | Example URL   | `params`                    |
| ------------------------- | ------------- | --------------------------- |
| `pages/shop/[...slug].js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `pages/shop/[...slug].js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `pages/shop/[...slug].js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |

## Optional Catch-all Segments

Catch-all Segments can be made **optional** by including the parameter in double square brackets: `[[...segmentName]]`.

For example, `pages/shop/[[...slug]].js` will **also** match `/shop`, in addition to `/shop/clothes`, `/shop/clothes/tops`, `/shop/clothes/tops/t-shirts`.

The difference between **catch-all** and **optional catch-all** segments is that with optional, the route without the parameter is also matched (`/shop` in the example above).

| Route                       | Example URL   | `params`                    |
| --------------------------- | ------------- | --------------------------- |
| `pages/shop/[[...slug]].js` | `/shop`       | `{ slug: undefined }`       |
| `pages/shop/[[...slug]].js` | `/shop/a`     | `{ slug: ['a'] }`           |
| `pages/shop/[[...slug]].js` | `/shop/a/b`   | `{ slug: ['a', 'b'] }`      |
| `pages/shop/[[...slug]].js` | `/shop/a/b/c` | `{ slug: ['a', 'b', 'c'] }` |


[⬆ Subir al inicio del capítulo](#)

---

<a id="linking-and-navigating"></a>

## Linking and Navigating

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating](https://nextjs.org/docs/pages/building-your-application/routing/linking-and-navigating)  
> 📂 **Sección:** Pages > Building Your Application > Routing  
> 📝 **Descripción:** *Learn how navigation works in Next.js, and how to use the Link Component and `useRouter` hook.*  

---

The Next.js router allows you to do client-side route transitions between pages, similar to a single-page application.

A React component called `Link` is provided to do this client-side route transition.

```jsx
import Link from 'next/link'

function Home() {
  return (
    <ul>
      <li>
        [Home](/)
      </li>
      <li>
        [About Us](/about)
      </li>
      <li>
        [Blog Post](/blog/hello-world)
      </li>
    </ul>
  )
}

export default Home
```

The example above uses multiple links. Each one maps a path (`href`) to a known page:

- `/` → `pages/index.js`
- `/about` → `pages/about.js`
- `/blog/hello-world` → `pages/blog/[slug].js`

Any `<Link />` in the viewport (initially or through scroll) will be prefetched by default (including the corresponding data) for pages using [Static Generation](/docs/pages/building-your-application/data-fetching/get-static-props). The corresponding data for [server-rendered](/docs/pages/building-your-application/data-fetching/get-server-side-props) routes is fetched _only when_ the `<Link />` is clicked.

## Linking to dynamic paths

You can also use interpolation to create the path, which comes in handy for [dynamic route segments](/docs/pages/building-your-application/routing/dynamic-routes). For example, to show a list of posts which have been passed to the component as a prop:

```jsx
import Link from 'next/link'

function Posts({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts
```

> [`encodeURIComponent`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) is used in the example to keep the path utf-8 compatible.

Alternatively, using a URL Object:

```jsx
import Link from 'next/link'

function Posts({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            href={{
              pathname: '/blog/[slug]',
              query: { slug: post.slug },
            }}
          >
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default Posts
```

Now, instead of using interpolation to create the path, we use a URL object in `href` where:

- `pathname` is the name of the page in the `pages` directory. `/blog/[slug]` in this case.
- `query` is an object with the dynamic segment. `slug` in this case.

## Injecting the router

To access the [`router` object](/docs/pages/api-reference/functions/use-router#router-object) in a React component you can use [`useRouter`](/docs/pages/api-reference/functions/use-router) or [`withRouter`](/docs/pages/api-reference/functions/use-router#withrouter).

In general we recommend using [`useRouter`](/docs/pages/api-reference/functions/use-router).

## Imperative Routing

[`next/link`](/docs/pages/api-reference/components/link) should be able to cover most of your routing needs, but you can also do client-side navigations without it, take a look at the [documentation for `next/router`](/docs/pages/api-reference/functions/use-router).

The following example shows how to do basic page navigations with [`useRouter`](/docs/pages/api-reference/functions/use-router):

```jsx
import { useRouter } from 'next/router'

export default function ReadMore() {
  const router = useRouter()

  return (
    <button onClick={() => router.push('/about')}>
      Click here to read more
    </button>
  )
}
```

## Shallow Routing

<details>
  <summary>Examples</summary>

- [Shallow Routing](https://github.com/vercel/next.js/tree/canary/examples/with-shallow-routing)

</details>

Shallow routing allows you to change the URL without running data fetching methods again, that includes [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props), [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props), and [`getInitialProps`](/docs/pages/api-reference/functions/get-initial-props).

You'll receive the updated `pathname` and the `query` via the [`router` object](/docs/pages/api-reference/functions/use-router#router-object) (added by [`useRouter`](/docs/pages/api-reference/functions/use-router) or [`withRouter`](/docs/pages/api-reference/functions/use-router#withrouter)), without losing state.

To enable shallow routing, set the `shallow` option to `true`. Consider the following example:

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Current URL is '/'
function Page() {
  const router = useRouter()

  useEffect(() => {
    // Always do navigations after the first render
    router.push('/?counter=10', undefined, { shallow: true })
  }, [])

  useEffect(() => {
    // The counter changed!
  }, [router.query.counter])
}

export default Page
```

The URL will get updated to `/?counter=10` and the page won't get replaced, only the state of the route is changed.

You can also watch for URL changes via [`componentDidUpdate`](https://react.dev/reference/react/Component#componentdidupdate) as shown below:

```jsx
componentDidUpdate(prevProps) {
  const { pathname, query } = this.props.router
  // verify props have changed to avoid an infinite loop
  if (query.counter !== prevProps.router.query.counter) {
    // fetch data based on the new query
  }
}
```

### Caveats

Shallow routing **only** works for URL changes in the current page. For example, let's assume we have another page called `pages/about.js`, and you run this:

```js
router.push('/?counter=10', '/about?counter=10', { shallow: true })
```

Since that's a new page, it'll unload the current page, load the new one and wait for data fetching even though we asked to do shallow routing.

When shallow routing is used with proxy it will not ensure the new page matches the current page like previously done without proxy. This is due to proxy being able to rewrite dynamically and can't be verified client-side without a data fetch which is skipped with shallow, so a shallow route change must always be treated as shallow.


[⬆ Subir al inicio del capítulo](#)

---

<a id="custom-app"></a>

## Custom App

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/routing/custom-app](https://nextjs.org/docs/pages/building-your-application/routing/custom-app)  
> 📂 **Sección:** Pages > Building Your Application > Routing  
> 📝 **Descripción:** *Control page initialization and add a layout that persists for all pages by overriding the default App component used by Next.js.*  

---

Next.js uses the `App` component to initialize pages. You can override it and control the page initialization and:

- Create a shared layout between page changes
- Inject additional data into pages
- [Add global CSS](/docs/app/getting-started/css)

## Usage

To override the default `App`, create the file `pages/_app` as shown below:

```tsx
// Archivo: pages/_app.tsx switcher
import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

```jsx
// Archivo: pages/_app.jsx switcher
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

The `Component` prop is the active `page`, so whenever you navigate between routes, `Component` will change to the new `page`. Therefore, any props you send to `Component` will be received by the `page`.

`pageProps` is an object with the initial props that were preloaded for your page by one of our [data fetching methods](/docs/pages/building-your-application/data-fetching), otherwise it's an empty object.

> **Good to know**:
>
> - If your app is running and you added a custom `App`, you'll need to restart the development server. Only required if `pages/_app.js` didn't exist before.
> - `App` does not support Next.js [Data Fetching methods](/docs/pages/building-your-application/data-fetching) like [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) or [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props).

## `getInitialProps` with `App`

Using [`getInitialProps`](/docs/pages/api-reference/functions/get-initial-props) in `App` will disable [Automatic Static Optimization](/docs/pages/building-your-application/rendering/automatic-static-optimization) for pages without [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props).

**We do not recommend using this pattern.** Instead, consider [incrementally adopting](/docs/app/guides/migrating/app-router-migration) the App Router, which allows you to more easily fetch data for pages and layouts.

```tsx
// Archivo: pages/_app.tsx switcher
import App, { AppContext, AppInitialProps, AppProps } from 'next/app'

type AppOwnProps = { example: string }

export default function MyApp({
  Component,
  pageProps,
  example,
}: AppProps & AppOwnProps) {
  return (
    <>
      <p>Data: {example}</p>
      <Component {...pageProps} />
    </>
  )
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppOwnProps & AppInitialProps> => {
  const ctx = await App.getInitialProps(context)

  return { ...ctx, example: 'data' }
}
```

```jsx
// Archivo: pages/_app.jsx switcher
import App from 'next/app'

export default function MyApp({ Component, pageProps, example }) {
  return (
    <>
      <p>Data: {example}</p>
      <Component {...pageProps} />
    </>
  )
}

MyApp.getInitialProps = async (context) => {
  const ctx = await App.getInitialProps(context)

  return { ...ctx, example: 'data' }
}
```


[⬆ Subir al inicio del capítulo](#)

---

<a id="custom-document"></a>

## Custom Document

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/routing/custom-document](https://nextjs.org/docs/pages/building-your-application/routing/custom-document)  
> 📂 **Sección:** Pages > Building Your Application > Routing  
> 📝 **Descripción:** *Extend the default document markup added by Next.js.*  

---

A custom `Document` can update the `<html>` and `<body>` tags used to render a [Page](/docs/pages/building-your-application/routing/pages-and-layouts).

To override the default `Document`, create the file `pages/_document` as shown below:

```tsx
// Archivo: pages/_document.tsx switcher
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

```jsx
// Archivo: pages/_document.jsx switcher
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

> **Good to know**:
>
> - `_document` is only rendered on the server, so event handlers like `onClick` cannot be used in this file.
> - `<Html>`, `<Head />`, `<Main />` and `<NextScript />` are required for the page to be properly rendered.

## Caveats

- The `<Head />` component used in `_document` is not the same as [`next/head`](/docs/pages/api-reference/components/head). The `<Head />` component used here should only be used for any `<head>` code that is common for all pages. For all other cases, such as `<title>` tags, we recommend using [`next/head`](/docs/pages/api-reference/components/head) in your pages or components.
- React components outside of `<Main />` will not be initialized by the browser. Do _not_ add application logic here or custom CSS (like `styled-jsx`). If you need shared components in all your pages (like a menu or a toolbar), read [Layouts](/docs/pages/building-your-application/routing/pages-and-layouts#layout-pattern) instead.
- `Document` currently does not support Next.js [Data Fetching methods](/docs/pages/building-your-application/data-fetching) like [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) or [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props).

## Customizing `renderPage`

Customizing `renderPage` is advanced and only needed for libraries like CSS-in-JS to support server-side rendering. This is not needed for built-in `styled-jsx` support.

**We do not recommend using this pattern.** Instead, consider [incrementally adopting](/docs/app/guides/migrating/app-router-migration) the App Router, which allows you to more easily fetch data for pages and layouts.

```tsx
// Archivo: pages/_document.tsx switcher
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const originalRenderPage = ctx.renderPage

    // Run the React rendering logic synchronously
    ctx.renderPage = () =>
      originalRenderPage({
        // Useful for wrapping the whole react tree
        enhanceApp: (App) => App,
        // Useful for wrapping in a per-page basis
        enhanceComponent: (Component) => Component,
      })

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

```jsx
// Archivo: pages/_document.jsx switcher
import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage

    // Run the React rendering logic synchronously
    ctx.renderPage = () =>
      originalRenderPage({
        // Useful for wrapping the whole react tree
        enhanceApp: (App) => App,
        // Useful for wrapping in a per-page basis
        enhanceComponent: (Component) => Component,
      })

    // Run the parent `getInitialProps`, it now includes the custom `renderPage`
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
```

> **Good to know**:
>
> - `getInitialProps` in `_document` is not called during client-side transitions.
> - The `ctx` object for `_document` is equivalent to the one received in [`getInitialProps`](/docs/pages/api-reference/functions/get-initial-props#context-object), with the addition of `renderPage`.


[⬆ Subir al inicio del capítulo](#)

---

<a id="api-routes"></a>

## API Routes

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/routing/api-routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)  
> 📂 **Sección:** Pages > Building Your Application > Routing  
> 📝 **Descripción:** *Next.js supports API Routes, which allow you to build your API without leaving your Next.js app. Learn how it works here.*  

---

<details>
  <summary>Examples</summary>

- [API Routes Request Helpers](https://github.com/vercel/next.js/tree/canary/examples/api-routes-proxy)
- [API Routes with GraphQL](https://github.com/vercel/next.js/tree/canary/examples/api-routes-graphql)
- [API Routes with REST](https://github.com/vercel/next.js/tree/canary/examples/api-routes-rest)
- [API Routes with CORS](https://github.com/vercel/next.js/tree/canary/examples/api-routes-cors)

</details>

> **Good to know**: If you are using the App Router, you can use [Server Components](/docs/app/getting-started/server-and-client-components) or [Route Handlers](/docs/app/api-reference/file-conventions/route) instead of API Routes.

API routes provide a solution to build a **public API** with Next.js.

Any file inside the folder `pages/api` is mapped to `/api/*` and will be treated as an API endpoint instead of a `page`. They are server-side only bundles and won't increase your client-side bundle size.

For example, the following API route returns a JSON response with a status code of `200`:

```ts
// Archivo: pages/api/hello.ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

```js
// Archivo: pages/api/hello.js switcher
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

> **Good to know**:
>
> - API Routes [do not specify CORS headers](https://developer.mozilla.org/docs/Web/HTTP/CORS), meaning they are **same-origin only** by default. You can customize such behavior by wrapping the request handler with the [CORS request helpers](https://github.com/vercel/next.js/tree/canary/examples/api-routes-cors).
> - API Routes can't be used with [static exports](/docs/pages/guides/static-exports). However, [Route Handlers](/docs/app/api-reference/file-conventions/route) in the App Router can.
> - API Routes will be affected by [`pageExtensions` configuration](/docs/pages/api-reference/config/next-config-js/pageExtensions) in `next.config.js`.

## Parameters

```tsx
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // ...
}
```

- `req`: An instance of [http.IncomingMessage](https://nodejs.org/api/http.html#class-httpincomingmessage)
- `res`: An instance of [http.ServerResponse](https://nodejs.org/api/http.html#class-httpserverresponse)

## HTTP Methods

To handle different HTTP methods in an API route, you can use `req.method` in your request handler, like so:

```ts
// Archivo: pages/api/hello.ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```

```js
// Archivo: pages/api/hello.js switcher
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Process a POST request
  } else {
    // Handle any other HTTP method
  }
}
```

## Request Helpers

API Routes provide built-in request helpers which parse the incoming request (`req`):

- `req.cookies` - An object containing the cookies sent by the request. Defaults to `{}`
- `req.query` - An object containing the [query string](https://en.wikipedia.org/wiki/Query_string). Defaults to `{}`
- `req.body` - An object containing the body parsed by `content-type`, or `null` if no body was sent

### Custom config

Every API Route can export a `config` object to change the default configuration, which is the following:

```js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
  // Specifies the maximum allowed duration for this function to execute (in seconds)
  maxDuration: 5,
}
```

`bodyParser` is automatically enabled. If you want to consume the body as a `Stream` or with [`raw-body`](https://www.npmjs.com/package/raw-body), you can set this to `false`.

One use case for disabling the automatic `bodyParsing` is to allow you to verify the raw body of a **webhook** request, for example [from GitHub](https://docs.github.com/en/developers/webhooks-and-events/webhooks/securing-your-webhooks#validating-payloads-from-github).

```js
export const config = {
  api: {
    bodyParser: false,
  },
}
```

`bodyParser.sizeLimit` is the maximum size allowed for the parsed body, in any format supported by [bytes](https://github.com/visionmedia/bytes.js), like so:

```js
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '500kb',
    },
  },
}
```

`externalResolver` is an explicit flag that tells the server that this route is being handled by an external resolver like _express_ or _connect_. Enabling this option disables warnings for unresolved requests.

```js
export const config = {
  api: {
    externalResolver: true,
  },
}
```

`responseLimit` is automatically enabled, warning when an API Routes' response body is over 4MB.

If you are not using Next.js in a serverless environment, and understand the performance implications of not using a CDN or dedicated media host, you can set this limit to `false`.

```js
export const config = {
  api: {
    responseLimit: false,
  },
}
```

`responseLimit` can also take the number of bytes or any string format supported by `bytes`, for example `1000`, `'500kb'` or `'3mb'`.
This value will be the maximum response size before a warning is displayed. Default is 4MB. (see above)

```js
export const config = {
  api: {
    responseLimit: '8mb',
  },
}
```

## Response Helpers

The [Server Response object](https://nodejs.org/api/http.html#http_class_http_serverresponse), (often abbreviated as `res`) includes a set of Express.js-like helper methods to improve the developer experience and increase the speed of creating new API endpoints.

The included helpers are:

- `res.status(code)` - A function to set the status code. `code` must be a valid [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes)
- `res.json(body)` - Sends a JSON response. `body` must be a [serializable object](https://developer.mozilla.org/docs/Glossary/Serialization)
- `res.send(body)` - Sends the HTTP response. `body` can be a `string`, an `object` or a `Buffer`
- `res.redirect([status,] path)` - Redirects to a specified path or URL. `status` must be a valid [HTTP status code](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes). If not specified, `status` defaults to "307" "Temporary redirect".
- `res.revalidate(urlPath)` - [Revalidate a page on demand](/docs/pages/guides/incremental-static-regeneration#on-demand-revalidation-with-revalidatepath) using `getStaticProps`. `urlPath` must be a `string`.

### Setting the status code of a response

When sending a response back to the client, you can set the status code of the response.

The following example sets the status code of the response to `200` (`OK`) and returns a `message` property with the value of `Hello from Next.js!` as a JSON response:

```ts
// Archivo: pages/api/hello.ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

```js
// Archivo: pages/api/hello.js switcher
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

### Sending a JSON response

When sending a response back to the client you can send a JSON response, this must be a [serializable object](https://developer.mozilla.org/docs/Glossary/Serialization).
In a real world application you might want to let the client know the status of the request depending on the result of the requested endpoint.

The following example sends a JSON response with the status code `200` (`OK`) and the result of the async operation. It's contained in a try catch block to handle any errors that may occur, with the appropriate status code and error message caught and sent back to the client:

```ts
// Archivo: pages/api/hello.ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await someAsyncOperation()
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
```

```js
// Archivo: pages/api/hello.js switcher
export default async function handler(req, res) {
  try {
    const result = await someAsyncOperation()
    res.status(200).json({ result })
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' })
  }
}
```

### Sending a HTTP response

Sending an HTTP response works the same way as when sending a JSON response. The only difference is that the response body can be a `string`, an `object` or a `Buffer`.

The following example sends a HTTP response with the status code `200` (`OK`) and the result of the async operation.

```ts
// Archivo: pages/api/hello.ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await someAsyncOperation()
    res.status(200).send({ result })
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
```

```js
// Archivo: pages/api/hello.js switcher
export default async function handler(req, res) {
  try {
    const result = await someAsyncOperation()
    res.status(200).send({ result })
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
```

### Redirects to a specified path or URL

Taking a form as an example, you may want to redirect your client to a specified path or URL once they have submitted the form.

The following example redirects the client to the `/` path if the form is successfully submitted:

```ts
// Archivo: pages/api/hello.ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name, message } = req.body

  try {
    await handleFormInputAsync({ name, message })
    res.redirect(307, '/')
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch data' })
  }
}
```

```js
// Archivo: pages/api/hello.js switcher
export default async function handler(req, res) {
  const { name, message } = req.body

  try {
    await handleFormInputAsync({ name, message })
    res.redirect(307, '/')
  } catch (err) {
    res.status(500).send({ error: 'failed to fetch data' })
  }
}
```

### Adding TypeScript types

You can make your API Routes more type-safe by importing the `NextApiRequest` and `NextApiResponse` types from `next`, in addition to those, you can also type your response data:

```ts
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ message: 'Hello from Next.js!' })
}
```

> **Good to know**: The body of `NextApiRequest` is `any` because the client may include any payload. You should validate the type/shape of the body at runtime before using it.

## Dynamic API Routes

API Routes support [dynamic routes](/docs/pages/building-your-application/routing/dynamic-routes), and follow the same file naming rules used for `pages/`.

```ts
// Archivo: pages/api/post/[pid].ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { pid } = req.query
  res.end(`Post: ${pid}`)
}
```

```js
// Archivo: pages/api/post/[pid].js switcher
export default function handler(req, res) {
  const { pid } = req.query
  res.end(`Post: ${pid}`)
}
```

Now, a request to `/api/post/abc` will respond with the text: `Post: abc`.

### Catch all API routes

API Routes can be extended to catch all paths by adding three dots (`...`) inside the brackets. For example:

- `pages/api/post/[...slug].js` matches `/api/post/a`, but also `/api/post/a/b`, `/api/post/a/b/c` and so on.

> **Good to know**: You can use names other than `slug`, such as: `[...param]`

Matched parameters will be sent as a query parameter (`slug` in the example) to the page, and it will always be an array, so, the path `/api/post/a` will have the following `query` object:

```json
{ "slug": ["a"] }
```

And in the case of `/api/post/a/b`, and any other matching path, new parameters will be added to the array, like so:

```json
{ "slug": ["a", "b"] }
```

For example:

```ts
// Archivo: pages/api/post/[...slug].ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query
  res.end(`Post: ${slug.join(', ')}`)
}
```

```js
// Archivo: pages/api/post/[...slug].js switcher
export default function handler(req, res) {
  const { slug } = req.query
  res.end(`Post: ${slug.join(', ')}`)
}
```

Now, a request to `/api/post/a/b/c` will respond with the text: `Post: a, b, c`.

### Optional catch all API routes

Catch all routes can be made optional by including the parameter in double brackets (`[[...slug]]`).

For example, `pages/api/post/[[...slug]].js` will match `/api/post`, `/api/post/a`, `/api/post/a/b`, and so on.

The main difference between catch all and optional catch all routes is that with optional, the route without the parameter is also matched (`/api/post` in the example above).

The `query` objects are as follows:

```json
{ } // GET `/api/post` (empty object)
{ "slug": ["a"] } // `GET /api/post/a` (single-element array)
{ "slug": ["a", "b"] } // `GET /api/post/a/b` (multi-element array)
```

### Caveats

- Predefined API routes take precedence over dynamic API routes, and dynamic API routes over catch all API routes. Take a look at the following examples:
  - `pages/api/post/create.js` - Will match `/api/post/create`
  - `pages/api/post/[pid].js` - Will match `/api/post/1`, `/api/post/abc`, etc. But not `/api/post/create`
  - `pages/api/post/[...slug].js` - Will match `/api/post/1/2`, `/api/post/a/b/c`, etc. But not `/api/post/create`, `/api/post/abc`

## Streaming responses

While the Pages Router does support streaming responses with API Routes, we recommend incrementally adopting the App Router and using [Route Handlers](/docs/app/api-reference/file-conventions/route) if you are on Next.js 14+.

Here's how you can stream a response from an API Route with `writeHead`:

```ts
// Archivo: pages/api/hello.ts switcher
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store',
  })
  let i = 0
  while (i < 10) {
    res.write(`data: ${i}\n\n`)
    i++
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  res.end()
}
```

```js
// Archivo: pages/api/hello.js switcher
export default async function handler(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-store',
  })
  let i = 0
  while (i < 10) {
    res.write(`data: ${i}\n\n`)
    i++
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  res.end()
}
```


[⬆ Subir al inicio del capítulo](#)

---

<a id="custom-errors"></a>

## Custom Errors

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/routing/custom-error](https://nextjs.org/docs/pages/building-your-application/routing/custom-error)  
> 📂 **Sección:** Pages > Building Your Application > Routing  
> 📝 **Descripción:** *Override and extend the built-in Error page to handle custom errors.*  

---

## 404 Page

A 404 page may be accessed very often. Server-rendering an error page for every visit increases the load of the Next.js server. This can result in increased costs and slow experiences.

To avoid the above pitfalls, Next.js provides a static 404 page by default without having to add any additional files.

> **Good to know**: The default 404 and 500 pages follow the operating system's color scheme via `prefers-color-scheme` and do not read an app-level theme. Because `pages/404.js` and `pages/500.js` render inside your custom `App`, providing your own files lets your global styles and theme apply.

### Customizing The 404 Page

To create a custom 404 page you can create a `pages/404.js` file. This file is statically generated at build time.

```jsx
// Archivo: pages/404.js
export default function Custom404() {
  return <h1>404 - Page Not Found</h1>
}
```

> **Good to know**: You can use [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) inside this page if you need to fetch data at build time.

## 500 Page

Server-rendering an error page for every visit adds complexity to responding to errors. To help users get responses to errors as fast as possible, Next.js provides a static 500 page by default without having to add any additional files.

### Customizing The 500 Page

To customize the 500 page you can create a `pages/500.js` file. This file is statically generated at build time.

```jsx
// Archivo: pages/500.js
export default function Custom500() {
  return <h1>500 - Server-side error occurred</h1>
}
```

> **Good to know**: You can use [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) inside this page if you need to fetch data at build time.

### More Advanced Error Page Customizing

500 errors are handled both client-side and server-side by the `Error` component. If you wish to override it, define the file `pages/_error.js` and add the following code:

```jsx
function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client'}
    </p>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
```

> `pages/_error.js` is only used in production. In development you’ll get an error with the call stack to know where the error originated from.

### Reusing the built-in error page

If you want to render the built-in error page you can by importing the `Error` component:

```jsx
import Error from 'next/error'

export async function getServerSideProps() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const errorCode = res.ok ? false : res.status
  const json = await res.json()

  return {
    props: { errorCode, stars: json.stargazers_count },
  }
}

export default function Page({ errorCode, stars }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }

  return <div>Next stars: {stars}</div>
}
```

The `Error` component also takes `title` as a property if you want to pass in a text message along with a `statusCode`.

If you have a custom `Error` component be sure to import that one instead. `next/error` exports the default component used by Next.js.

### Caveats

- `Error` does not currently support Next.js [Data Fetching methods](/docs/pages/building-your-application/data-fetching) like [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) or [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props).
- `_error`, like `_app`, is a reserved pathname. `_error` is used to define the customized layouts and behaviors of the error pages. `/_error` will render 404 when accessed directly via [routing](/docs/pages/building-your-application/routing) or rendering in a [custom server](/docs/pages/guides/custom-server).


[⬆ Subir al inicio del capítulo](#)

---

<a id="routing"></a>

## Routing

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/routing](https://nextjs.org/docs/pages/building-your-application/routing)  
> 📂 **Sección:** Pages > Building Your Application > Routing  
> 📝 **Descripción:** *Learn the fundamentals of routing for front-end applications with the Pages Router.*  

---

The Pages Router has a file-system based router built on concepts of pages. When a file is added to the `pages` directory it's automatically available as a route. Learn more about routing in the Pages Router:


[⬆ Subir al inicio del capítulo](#)

---

<a id="server-side-rendering-ssr"></a>

## Server-side Rendering (SSR)

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering](https://nextjs.org/docs/pages/building-your-application/rendering/server-side-rendering)  
> 📂 **Sección:** Pages > Building Your Application > Rendering  
> 📝 **Descripción:** *Use Server-side Rendering to render pages on each request.*  

---

> Also referred to as "SSR" or "Dynamic Rendering".

If a page uses **Server-side Rendering**, the page HTML is generated on **each request**.

To use Server-side Rendering for a page, you need to `export` an `async` function called `getServerSideProps`. This function will be called by the server on every request.

For example, suppose that your page needs to prerender frequently updated data (fetched from an external API). You can write `getServerSideProps` which fetches this data and passes it to `Page` like below:

```jsx
export default function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}
```

As you can see, `getServerSideProps` is similar to `getStaticProps`, but the difference is that `getServerSideProps` is run on every request instead of on build time.

To learn more about how `getServerSideProps` works, check out our [Data Fetching documentation](/docs/pages/building-your-application/data-fetching/get-server-side-props).


[⬆ Subir al inicio del capítulo](#)

---

<a id="static-site-generation-ssg"></a>

## Static Site Generation (SSG)

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation](https://nextjs.org/docs/pages/building-your-application/rendering/static-site-generation)  
> 📂 **Sección:** Pages > Building Your Application > Rendering  
> 📝 **Descripción:** *Use Static Site Generation (SSG) to prerender pages at build time.*  

---

<details>
  <summary>Examples</summary>

- [Agility CMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-agilitycms) ([Demo](https://next-blog-agilitycms.vercel.app/))
- [Builder.io Example](https://github.com/vercel/next.js/tree/canary/examples/cms-builder-io) ([Demo](https://cms-builder-io.vercel.app/))
- [ButterCMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-buttercms) ([Demo](https://next-blog-buttercms.vercel.app/))
- [Contentful Example](https://github.com/vercel/next.js/tree/canary/examples/cms-contentful) ([Demo](https://app-router-contentful.vercel.app/))
- [Cosmic Example](https://github.com/vercel/next.js/tree/canary/examples/cms-cosmic) ([Demo](https://next-blog-cosmic.vercel.app/))
- [DatoCMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-datocms) ([Demo](https://next-blog-datocms.vercel.app/))
- [DotCMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-dotcms) ([Demo](https://nextjs-dotcms-blog.vercel.app/))
- [Drupal Example](https://github.com/vercel/next.js/tree/canary/examples/cms-drupal) ([Demo](https://cms-drupal.vercel.app/))
- [Enterspeed Example](https://github.com/vercel/next.js/tree/canary/examples/cms-enterspeed) ([Demo](https://next-blog-demo.enterspeed.com/))
- [GraphCMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-graphcms) ([Demo](https://next-blog-graphcms.vercel.app/))
- [Keystone Example](https://github.com/vercel/next.js/tree/canary/examples/cms-keystonejs-embedded) ([Demo](https://nextjs-keystone-demo.vercel.app/))
- [Kontent.ai Example](https://github.com/vercel/next.js/tree/canary/examples/cms-kontent-ai) ([Demo](https://next-blog-kontent-ai.vercel.app/))
- [Makeswift Example](https://github.com/vercel/next.js/tree/canary/examples/cms-makeswift) ([Demo](https://nextjs-makeswift-example.vercel.app/))
- [Plasmic Example](https://github.com/vercel/next.js/tree/canary/examples/cms-plasmic) ([Demo](https://nextjs-plasmic-example.vercel.app/))
- [Prepr Example](https://github.com/vercel/next.js/tree/canary/examples/cms-prepr) ([Demo](https://next-blog-prepr.vercel.app/))
- [Prismic Example](https://github.com/vercel/next.js/tree/canary/examples/cms-prismic) ([Demo](https://next-blog-prismic.vercel.app/))
- [Sanity Example](https://github.com/vercel/next.js/tree/canary/examples/cms-sanity) ([Demo](https://next-blog.sanity.build/))
- [Sitecore XM Cloud Example](https://github.com/vercel/next.js/tree/canary/examples/cms-sitecore-xmcloud) ([Demo](https://vercel-sitecore-xmcloud-demo.vercel.app/))
- [Storyblok Example](https://github.com/vercel/next.js/tree/canary/examples/cms-storyblok) ([Demo](https://next-blog-storyblok.vercel.app/))
- [Strapi Example](https://github.com/vercel/next.js/tree/canary/examples/cms-strapi) ([Demo](https://next-blog-strapi.vercel.app/))
- [TakeShape Example](https://github.com/vercel/next.js/tree/canary/examples/cms-takeshape) ([Demo](https://next-blog-takeshape.vercel.app/))
- [Tina Example](https://github.com/vercel/next.js/tree/canary/examples/cms-tina) ([Demo](https://cms-tina-example.vercel.app/))
- [Umbraco Example](https://github.com/vercel/next.js/tree/canary/examples/cms-umbraco) ([Demo](https://nextjs-umbraco-sample-blog.vercel.app/))
- [Umbraco Heartcore Example](https://github.com/vercel/next.js/tree/canary/examples/cms-umbraco-heartcore) ([Demo](https://next-blog-umbraco-heartcore.vercel.app/))
- [Webiny Example](https://github.com/vercel/next.js/tree/canary/examples/cms-webiny) ([Demo](https://webiny-headlesscms-nextjs-example.vercel.app/))
- [WordPress Example](https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress) ([Demo](https://next-blog-wordpress.vercel.app/))
- [Blog Starter Example](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) ([Demo](https://next-blog-starter.vercel.app/))
- [Static Tweet (Demo)](https://react-tweet.vercel.app/)

</details>

If a page uses **Static Generation**, the page HTML is generated at **build time**. That means in production, the page HTML is generated when you run `next build`. This HTML will then be reused on each request. It can be cached by a CDN.

In Next.js, you can statically generate pages **with or without data**. Let's take a look at each case.

### Static Generation without data

By default, Next.js prerenders pages using Static Generation without fetching data. Here's an example:

```jsx
function About() {
  return <div>About</div>
}

export default About
```

Note that this page does not need to fetch any external data to be prerendered. In cases like this, Next.js generates a single HTML file per page during build time.

### Static Generation with data

Some pages require fetching external data for prerendering. There are two scenarios, and one or both might apply. In each case, you can use these functions that Next.js provides:

1. Your page **content** depends on external data: Use `getStaticProps`.
2. Your page **paths** depend on external data: Use `getStaticPaths` (usually in addition to `getStaticProps`).

#### Scenario 1: Your page content depends on external data

**Example**: Your blog page might need to fetch the list of blog posts from a CMS (content management system).

```jsx
// TODO: Need to fetch `posts` (by calling some API endpoint)
//       before this page can be prerendered.
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}
```

To fetch this data on prerender, Next.js allows you to `export` an `async` function called `getStaticProps` from the same file. This function gets called at build time and lets you pass fetched data to the page's `props` on prerender.

```jsx
export default function Blog({ posts }) {
  // Render posts...
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}
```

To learn more about how `getStaticProps` works, check out the [Data Fetching documentation](/docs/pages/building-your-application/data-fetching/get-static-props).

#### Scenario 2: Your page paths depend on external data

Next.js allows you to create pages with **dynamic routes**. For example, you can create a file called `pages/posts/[id].js` to show a single blog post based on `id`. This will allow you to show a blog post with `id: 1` when you access `posts/1`.

> To learn more about dynamic routing, check the [Dynamic Routing documentation](/docs/pages/building-your-application/routing/dynamic-routes).

However, which `id` you want to prerender at build time might depend on external data.

**Example**: suppose that you've only added one blog post (with `id: 1`) to the database. In this case, you'd only want to prerender `posts/1` at build time.

Later, you might add the second post with `id: 2`. Then you'd want to prerender `posts/2` as well.

So your page **paths** that are prerendered depend on external data. To handle this, Next.js lets you `export` an `async` function called `getStaticPaths` from a dynamic page (`pages/posts/[id].js` in this case). This function gets called at build time and lets you specify which paths you want to prerender.

```jsx
// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to prerender based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll prerender only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
```

Also in `pages/posts/[id].js`, you need to export `getStaticProps` so that you can fetch the data about the post with this `id` and use it to prerender the page:

```jsx
export default function Post({ post }) {
  // Render post...
}

export async function getStaticPaths() {
  // ...
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return { props: { post } }
}
```

To learn more about how `getStaticPaths` works, check out the [Data Fetching documentation](/docs/pages/building-your-application/data-fetching/get-static-paths).

### When should I use Static Generation?

We recommend using **Static Generation** (with and without data) whenever possible because your page can be built once and served by CDN, which makes it much faster than having a server render the page on every request.

You can use Static Generation for many types of pages, including:

- Marketing pages
- Blog posts and portfolios
- E-commerce product listings
- Help and documentation

You should ask yourself: "Can I prerender this page **ahead** of a user's request?" If the answer is yes, then you should choose Static Generation.

On the other hand, Static Generation is **not** a good idea if you cannot prerender a page ahead of a user's request. Maybe your page shows frequently updated data, and the page content changes on every request.

In cases like this, you can do one of the following:

- Use Static Generation with **Client-side data fetching:** You can skip prerendering some parts of a page and then use client-side JavaScript to populate them. To learn more about this approach, check out the [Data Fetching documentation](/docs/pages/building-your-application/data-fetching/client-side).
- Use **Server-Side Rendering:** Next.js prerenders a page on each request. It will be slower because the page cannot be cached by a CDN, but the prerendered page will always be up-to-date. We'll talk about this approach below.


[⬆ Subir al inicio del capítulo](#)

---

<a id="automatic-static-optimization"></a>

## Automatic Static Optimization

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization](https://nextjs.org/docs/pages/building-your-application/rendering/automatic-static-optimization)  
> 📂 **Sección:** Pages > Building Your Application > Rendering  
> 📝 **Descripción:** *Next.js automatically optimizes your app to be static HTML whenever possible. Learn how it works here.*  

---

Next.js automatically determines that a page is static (can be prerendered) if it has no blocking data requirements. This determination is made by the absence of `getServerSideProps` and `getInitialProps` in the page.

This feature allows Next.js to emit hybrid applications that contain **both server-rendered and statically generated pages**.

> **Good to know**: Statically generated pages are still reactive. Next.js will hydrate your application client-side to give it full interactivity.

One of the main benefits of this feature is that optimized pages require no server-side computation, and can be instantly streamed to the end-user from multiple CDN locations. The result is an _ultra fast_ loading experience for your users.

## How it works

If `getServerSideProps` or `getInitialProps` is present in a page, Next.js will switch to render the page on-demand, per-request (meaning [Server-Side Rendering](/docs/pages/building-your-application/rendering/server-side-rendering)).

If the above is not the case, Next.js will **statically optimize** your page automatically by prerendering the page to static HTML.

During prerendering, the router's `query` object will be empty since we do not have `query` information to provide during this phase. After hydration, Next.js will trigger an update to your application to provide the route parameters in the `query` object.

The cases where the query will be updated after hydration triggering another render are:

- The page is a [dynamic-route](/docs/pages/building-your-application/routing/dynamic-routes).
- The page has query values in the URL.
- [Rewrites](/docs/pages/api-reference/config/next-config-js/rewrites) are configured in your `next.config.js` since these can have parameters that may need to be parsed and provided in the `query`.

To be able to distinguish if the query is fully updated and ready for use, you can leverage the `isReady` field on [`next/router`](/docs/pages/api-reference/functions/use-router#router-object).

> **Good to know**: Parameters added with [dynamic routes](/docs/pages/building-your-application/routing/dynamic-routes) to a page that's using [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) will always be available inside the `query` object.

`next build` will emit `.html` files for statically optimized pages. For example, the result for the page `pages/about.js` would be:

```bash
// Archivo: Terminal
.next/server/pages/about.html
```

And if you add `getServerSideProps` to the page, it will then be JavaScript, like so:

```bash
// Archivo: Terminal
.next/server/pages/about.js
```

## Caveats

- If you have a [custom `App`](/docs/pages/building-your-application/routing/custom-app) with `getInitialProps` then this optimization will be turned off in pages without [Static Generation](/docs/pages/building-your-application/data-fetching/get-static-props).
- If you have a [custom `Document`](/docs/pages/building-your-application/routing/custom-document) with `getInitialProps` be sure you check if `ctx.req` is defined before assuming the page is server-side rendered. `ctx.req` will be `undefined` for pages that are prerendered.
- Avoid using the `asPath` value on [`next/router`](/docs/pages/api-reference/functions/use-router#router-object) in the rendering tree until the router's `isReady` field is `true`. Statically optimized pages only know `asPath` on the client and not the server, so using it as a prop may lead to mismatch errors. The [`active-class-name` example](https://github.com/vercel/next.js/tree/canary/examples/active-class-name) demonstrates one way to use `asPath` as a prop.


[⬆ Subir al inicio del capítulo](#)

---

<a id="client-side-rendering-csr"></a>

## Client-side Rendering (CSR)

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/rendering/client-side-rendering](https://nextjs.org/docs/pages/building-your-application/rendering/client-side-rendering)  
> 📂 **Sección:** Pages > Building Your Application > Rendering  
> 📝 **Descripción:** *Learn how to implement client-side rendering in the Pages Router.*  

---

In Client-Side Rendering (CSR) with React, the browser downloads a minimal HTML page and the JavaScript needed for the page. The JavaScript is then used to update the DOM and render the page. When the application is first loaded, the user may notice a slight delay before they can see the full page, this is because the page isn't fully rendered until all the JavaScript is downloaded, parsed, and executed.

After the page has been loaded for the first time, navigating to other pages on the same website is typically faster, as only necessary data needs to be fetched, and JavaScript can re-render parts of the page without requiring a full page refresh.

In Next.js, there are two ways you can implement client-side rendering:

1. Using React's `useEffect()` hook inside your pages instead of the server-side rendering methods ([`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) and [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props)).
2. Using a data fetching library like [SWR](https://swr.vercel.app/) or [TanStack Query](https://tanstack.com/query/latest/) to fetch data on the client (recommended).

Here's an example of using `useEffect()` inside a Next.js page:

```jsx
// Archivo: pages/index.js
import React, { useState, useEffect } from 'react'

export function Page() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://api.example.com/data')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      setData(result)
    }

    fetchData().catch((e) => {
      // handle the error as needed
      console.error('An error occurred while fetching the data: ', e)
    })
  }, [])

  return <p>{data ? `Your data: ${data}` : 'Loading...'}</p>
}
```

In the example above, the component starts by rendering `Loading...`. Then, once the data is fetched, it re-renders and displays the data.

Although fetching data in a `useEffect` is a pattern you may see in older React Applications, we recommend using a data-fetching library for better performance, caching, optimistic updates, and more. Here's a minimum example using [SWR](https://swr.vercel.app/) to fetch data on the client:

```jsx
// Archivo: pages/index.js
import useSWR from 'swr'

export function Page() {
  const { data, error, isLoading } = useSWR(
    'https://api.example.com/data',
    fetcher
  )

  if (error) return <p>Failed to load.</p>
  if (isLoading) return <p>Loading...</p>

  return <p>Your Data: {data}</p>
}
```

> **Good to know**:
>
> Keep in mind that CSR can impact SEO. Some search engine crawlers might not execute JavaScript and therefore only see the initial empty or loading state of your application. It can also lead to performance issues for users with slower internet connections or devices, as they need to wait for all the JavaScript to load and run before they can see the full page. Next.js promotes a hybrid approach that allows you to use a combination of [server-side rendering](/docs/pages/building-your-application/rendering/server-side-rendering), [static site generation](/docs/pages/building-your-application/rendering/static-site-generation), and client-side rendering, **depending on the needs of each page** in your application. In the App Router, you can also use [Loading UI with Suspense](/docs/app/api-reference/file-conventions/loading) to show a loading indicator while the page is being rendered.


[⬆ Subir al inicio del capítulo](#)

---

<a id="rendering"></a>

## Rendering

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/rendering](https://nextjs.org/docs/pages/building-your-application/rendering)  
> 📂 **Sección:** Pages > Building Your Application > Rendering  
> 📝 **Descripción:** *Learn the fundamentals of rendering in React and Next.js.*  

---

By default, Next.js **prerenders** every page. This means that Next.js generates HTML for each page in advance, instead of having it all done by client-side JavaScript. Prerendering can result in better performance and SEO.

Each generated HTML is associated with minimal JavaScript code necessary for that page. When a page is loaded by the browser, its JavaScript code runs and makes the page fully interactive (this process is called [hydration](https://react.dev/reference/react-dom/client/hydrateRoot) in React).

### Prerendering

Next.js has two forms of prerendering: **Static Generation** and **Server-side Rendering**. The difference is in **when** it generates the HTML for a page.

- Static Generation: The HTML is generated at **build time** and will be reused on each request.
- Server-side Rendering: The HTML is generated on **each request**.

Importantly, Next.js lets you choose which prerendering form you'd like to use for each page. You can create a "hybrid" Next.js app by using Static Generation for most pages and using Server-side Rendering for others.

We recommend using Static Generation over Server-side Rendering for performance reasons. Statically generated pages can be cached by CDN with no extra configuration to boost performance. However, in some cases, Server-side Rendering might be the only option.

You can also use client-side data fetching along with Static Generation or Server-side Rendering. That means some parts of a page can be rendered entirely by clientside JavaScript. To learn more, take a look at the [Data Fetching](/docs/pages/building-your-application/data-fetching/client-side) documentation.


[⬆ Subir al inicio del capítulo](#)

---

<a id="getstaticprops"></a>

## getStaticProps

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props)  
> 📂 **Sección:** Pages > Building Your Application > Data Fetching  
> 📝 **Descripción:** *Fetch data and generate static pages with `getStaticProps`. Learn more about this API for data fetching in Next.js.*  

---

If you export a function called `getStaticProps` (Static Site Generation) from a page, Next.js will prerender this page at build time using the props returned by `getStaticProps`.

```tsx
// Archivo: pages/index.tsx switcher
import type { InferGetStaticPropsType, GetStaticProps } from 'next'

type Repo = {
  name: string
  stargazers_count: number
}

export const getStaticProps = (async (context) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}) satisfies GetStaticProps<{
  repo: Repo
}>

export default function Page({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return repo.stargazers_count
}
```

```jsx
// Archivo: pages/index.js switcher
export async function getStaticProps() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}

export default function Page({ repo }) {
  return repo.stargazers_count
}
```

> Note that irrespective of rendering type, any `props` will be passed to the page component and can be viewed on the client-side in the initial HTML. This is to allow the page to be [hydrated](https://react.dev/reference/react-dom/hydrate) correctly. Make sure that you don't pass any sensitive information that shouldn't be available on the client in `props`.

The [`getStaticProps` API reference](/docs/pages/api-reference/functions/get-static-props) covers all parameters and props that can be used with `getStaticProps`.

## When should I use getStaticProps?

You should use `getStaticProps` if:

- The data required to render the page is available at build time ahead of a user’s request
- The data comes from a headless CMS
- The page must be prerendered (for SEO) and be very fast — `getStaticProps` generates `HTML` and `JSON` files, both of which can be cached by a CDN for performance
- The data can be publicly cached (not user-specific). This condition can be bypassed in certain specific situation by using a Proxy to rewrite the path.

## When does getStaticProps run

`getStaticProps` always runs on the server and never on the client. You can validate code written inside `getStaticProps` is removed from the client-side bundle [with this tool](https://next-code-elimination.vercel.app/).

- `getStaticProps` always runs during `next build`
- `getStaticProps` runs in the background when using [`fallback: true`](/docs/pages/api-reference/functions/get-static-paths#fallback-true)
- `getStaticProps` is called before initial render when using [`fallback: blocking`](/docs/pages/api-reference/functions/get-static-paths#fallback-blocking)
- `getStaticProps` runs in the background when using `revalidate`
- `getStaticProps` runs on-demand in the background when using [`revalidate()`](/docs/pages/guides/incremental-static-regeneration#on-demand-revalidation-with-revalidatepath)

When combined with [Incremental Static Regeneration](/docs/pages/guides/incremental-static-regeneration), `getStaticProps` will run in the background while the stale page is being revalidated, and the fresh page served to the browser.

`getStaticProps` does not have access to the incoming request (such as query parameters or HTTP headers) as it generates static HTML. If you need access to the request for your page, consider using [Proxy](/docs/pages/api-reference/file-conventions/proxy) in addition to `getStaticProps`.

## Using getStaticProps to fetch data from a CMS

The following example shows how you can fetch a list of blog posts from a CMS.

```tsx
// Archivo: pages/blog.tsx switcher
// posts will be populated at build time by getStaticProps()
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}
```

```jsx
// Archivo: pages/blog.js switcher
// posts will be populated at build time by getStaticProps()
export default function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}
```

The [`getStaticProps` API reference](/docs/pages/api-reference/functions/get-static-props) covers all parameters and props that can be used with `getStaticProps`.

## Write server-side code directly

As `getStaticProps` runs only on the server-side, it will never run on the client-side. It won’t even be included in the JS bundle for the browser, so you can write direct database queries without them being sent to browsers.

This means that instead of fetching an **API route** from `getStaticProps` (that itself fetches data from an external source), you can write the server-side code directly in `getStaticProps`.

Take the following example. An API route is used to fetch some data from a CMS. That API route is then called directly from `getStaticProps`. This produces an additional call, reducing performance. Instead, the logic for fetching the data from the CMS can be shared by using a `lib/` directory. Then it can be shared with `getStaticProps`.

```js
// Archivo: lib/load-posts.js
// The following function is shared
// with getStaticProps and API routes
// from a `lib/` directory
export async function loadPosts() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts/')
  const data = await res.json()

  return data
}
```

```jsx
// Archivo: pages/blog.js
// pages/blog.js
import { loadPosts } from '../lib/load-posts'

// This function runs only on the server side
export async function getStaticProps() {
  // Instead of fetching your `/api` route you can call the same
  // function directly in `getStaticProps`
  const posts = await loadPosts()

  // Props returned will be passed to the page component
  return { props: { posts } }
}
```

Alternatively, if you are **not** using API routes to fetch data, then the [`fetch()`](https://developer.mozilla.org/docs/Web/API/Fetch_API) API _can_ be used directly in `getStaticProps` to fetch data.

To verify what Next.js eliminates from the client-side bundle, you can use the [next-code-elimination tool](https://next-code-elimination.vercel.app/).

## Statically generates both HTML and JSON

When a page with `getStaticProps` is prerendered at build time, in addition to the page HTML file, Next.js generates a JSON file holding the result of running `getStaticProps`.

This JSON file will be used in client-side routing through [`next/link`](/docs/pages/api-reference/components/link) or [`next/router`](/docs/pages/api-reference/functions/use-router). When you navigate to a page that’s prerendered using `getStaticProps`, Next.js fetches this JSON file (pre-computed at build time) and uses it as the props for the page component. This means that client-side page transitions will **not** call `getStaticProps` as only the exported JSON is used.

When using Incremental Static Generation, `getStaticProps` will be executed in the background to generate the JSON needed for client-side navigation. You may see this in the form of multiple requests being made for the same page, however, this is intended and has no impact on end-user performance.

## Where can I use getStaticProps

`getStaticProps` can only be exported from a **page**. You **cannot** export it from non-page files, `_app`, `_document`, or `_error`.

One of the reasons for this restriction is that React needs to have all the required data before the page is rendered.

Also, you must use export `getStaticProps` as a standalone function — it will **not** work if you add `getStaticProps` as a property of the page component.

> **Good to know**: if you have created a [custom app](/docs/pages/building-your-application/routing/custom-app), ensure you are passing the `pageProps` to the page component as shown in the linked document, otherwise the props will be empty.

## Runs on every request in development

In development (`next dev`), `getStaticProps` will be called on every request.

## Preview Mode

You can temporarily bypass static generation and render the page at **request time** instead of build time using [**Preview Mode**](/docs/pages/guides/preview-mode). For example, you might be using a headless CMS and want to preview drafts before they're published.


[⬆ Subir al inicio del capítulo](#)

---

<a id="getstaticpaths"></a>

## getStaticPaths

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-paths](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-paths)  
> 📂 **Sección:** Pages > Building Your Application > Data Fetching  
> 📝 **Descripción:** *Fetch data and generate static pages with `getStaticPaths`. Learn more about this API for data fetching in Next.js.*  

---

If a page has [Dynamic Routes](/docs/pages/building-your-application/routing/dynamic-routes) and uses `getStaticProps`, it needs to define a list of paths to be statically generated.

When you export a function called `getStaticPaths` (Static Site Generation) from a page that uses dynamic routes, Next.js will statically prerender all the paths specified by `getStaticPaths`.

```tsx
// Archivo: pages/repo/[name].tsx switcher
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from 'next'

type Repo = {
  name: string
  stargazers_count: number
}

export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          name: 'next.js',
        },
      }, // See the "paths" section below
    ],
    fallback: true, // false or "blocking"
  }
}) satisfies GetStaticPaths

export const getStaticProps = (async (context) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}) satisfies GetStaticProps<{
  repo: Repo
}>

export default function Page({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return repo.stargazers_count
}
```

```jsx
// Archivo: pages/repo/[name].js switcher
export async function getStaticPaths() {
  return {
    paths: [
      {
        params: {
          name: 'next.js',
        },
      }, // See the "paths" section below
    ],
    fallback: true, // false or "blocking"
  }
}

export async function getStaticProps() {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}

export default function Page({ repo }) {
  return repo.stargazers_count
}
```

The [`getStaticPaths` API reference](/docs/pages/api-reference/functions/get-static-paths) covers all parameters and props that can be used with `getStaticPaths`.

## When should I use getStaticPaths?

You should use `getStaticPaths` if you’re statically prerendering pages that use dynamic routes and:

- The data comes from a headless CMS
- The data comes from a database
- The data comes from the filesystem
- The data can be publicly cached (not user-specific)
- The page must be prerendered (for SEO) and be very fast — `getStaticProps` generates `HTML` and `JSON` files, both of which can be cached by a CDN for performance

## When does getStaticPaths run

`getStaticPaths` will only run during build in production, it will not be called during runtime. You can validate code written inside `getStaticPaths` is removed from the client-side bundle [with this tool](https://next-code-elimination.vercel.app/).

### How does getStaticProps run with regards to getStaticPaths

- `getStaticProps` runs during `next build` for any `paths` returned during build
- `getStaticProps` runs in the background when using `fallback: true`
- `getStaticProps` is called before initial render when using `fallback: blocking`

## Where can I use getStaticPaths

- `getStaticPaths` **must** be used with `getStaticProps`
- You **cannot** use `getStaticPaths` with [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props)
- You can export `getStaticPaths` from a [Dynamic Route](/docs/pages/building-your-application/routing/dynamic-routes) that also uses `getStaticProps`
- You **cannot** export `getStaticPaths` from non-page file (e.g. your `components` folder)
- You must export `getStaticPaths` as a standalone function, and not a property of the page component

## Runs on every request in development

In development (`next dev`), `getStaticPaths` will be called on every request.

## Generating paths on-demand

`getStaticPaths` allows you to control which pages are generated during the build instead of on-demand with [`fallback`](/docs/pages/api-reference/functions/get-static-paths#fallback-blocking). Generating more pages during a build will cause slower builds.

You can defer generating all pages on-demand by returning an empty array for `paths`. This can be especially helpful when deploying your Next.js application to multiple environments. For example, you can have faster builds by generating all pages on-demand for previews (but not production builds). This is helpful for sites with hundreds/thousands of static pages.

```jsx
// Archivo: pages/posts/[id].js
export async function getStaticPaths() {
  // When this is true (in preview environments) don't
  // prerender any static pages
  // (faster builds, but slower initial page load)
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: 'blocking',
    }
  }

  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to prerender based on posts
  // In production environments, prerender all pages
  // (slower builds, but faster initial page load)
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // { fallback: false } means other routes should 404
  return { paths, fallback: false }
}
```


[⬆ Subir al inicio del capítulo](#)

---

<a id="getserversideprops"></a>

## getServerSideProps

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props)  
> 📂 **Sección:** Pages > Building Your Application > Data Fetching  
> 📝 **Descripción:** *Fetch data on each request with `getServerSideProps`.*  

---

`getServerSideProps` is a Next.js function that can be used to fetch data and render the contents of a page at request time.

## Example

You can use `getServerSideProps` by exporting it from a Page Component. The example below shows how you can fetch data from a 3rd party API in `getServerSideProps`, and pass the data to the page as props:

```tsx
// Archivo: pages/index.tsx switcher
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'

type Repo = {
  name: string
  stargazers_count: number
}

export const getServerSideProps = (async () => {
  // Fetch data from external API
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo: Repo = await res.json()
  // Pass data to the page via props
  return { props: { repo } }
}) satisfies GetServerSideProps<{ repo: Repo }>

export default function Page({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <p>{repo.stargazers_count}</p>
    </main>
  )
}
```

```jsx
// Archivo: pages/index.js switcher
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  // Pass data to the page via props
  return { props: { repo } }
}

export default function Page({ repo }) {
  return (
    <main>
      <p>{repo.stargazers_count}</p>
    </main>
  )
}
```

## When should I use `getServerSideProps`?

You should use `getServerSideProps` if you need to render a page that relies on personalized user data, or information that can only be known at request time. For example, `authorization` headers or a geolocation.

If you do not need to fetch the data at request time, or would prefer to cache the data and prerendered HTML, we recommend using [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props).

## Behavior

- `getServerSideProps` runs on the server.
- `getServerSideProps` can only be exported from a **page**.
- `getServerSideProps` returns JSON.
- When a user visits a page, `getServerSideProps` will be used to fetch data at request time, and the data is used to render the initial HTML of the page.
- `props` passed to the page component can be viewed on the client as part of the initial HTML. This is to allow the page to be [hydrated](https://react.dev/reference/react-dom/hydrate) correctly. Make sure that you don't pass any sensitive information that shouldn't be available on the client in `props`.
- When a user visits the page through [`next/link`](/docs/pages/api-reference/components/link) or [`next/router`](/docs/pages/api-reference/functions/use-router), Next.js sends an API request to the server, which runs `getServerSideProps`.
- You do not have to call a Next.js [API Route](/docs/pages/building-your-application/routing/api-routes) to fetch data when using `getServerSideProps` since the function runs on the server. Instead, you can call a CMS, database, or other third-party APIs directly from inside `getServerSideProps`.

> **Good to know:**
>
> - See [`getServerSideProps` API reference](/docs/pages/api-reference/functions/get-server-side-props) for parameters and props that can be used with `getServerSideProps`.
> - You can use the [next-code-elimination tool](https://next-code-elimination.vercel.app/) to verify what Next.js eliminates from the client-side bundle.

## Error Handling

If an error is thrown inside `getServerSideProps`, it will show the `pages/500.js` file. Check out the documentation for [500 page](/docs/pages/building-your-application/routing/custom-error#500-page) to learn more on how to create it. During development, this file will not be used and the development error overlay will be shown instead.

## Edge Cases

### Caching with Server-Side Rendering (SSR)

You can use caching headers (`Cache-Control`) inside `getServerSideProps` to cache dynamic responses. For example, using [`stale-while-revalidate`](https://web.dev/stale-while-revalidate/).

```jsx
// This value is considered fresh for ten seconds (s-maxage=10).
// If a request is repeated within the next 10 seconds, the previously
// cached value will still be fresh. If the request is repeated before 59 seconds,
// the cached value will be stale but still render (stale-while-revalidate=59).
//
// In the background, a revalidation request will be made to populate the cache
// with a fresh value. If you refresh the page, you will see the new value.
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {},
  }
}
```

However, before reaching for `cache-control`, we recommend seeing if [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) with [ISR](/docs/pages/guides/incremental-static-regeneration) is a better fit for your use case.


[⬆ Subir al inicio del capítulo](#)

---

<a id="client-side-fetching"></a>

## Client-side Fetching

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/data-fetching/client-side](https://nextjs.org/docs/pages/building-your-application/data-fetching/client-side)  
> 📂 **Sección:** Pages > Building Your Application > Data Fetching  
> 📝 **Descripción:** *Learn about client-side data fetching, and how to use SWR, a data fetching React Hook library that handles caching, revalidation, focus tracking, refetching on interval and more.*  

---

Client-side data fetching is useful when your page doesn't require SEO indexing, when you don't need to prerender your data, or when the content of your pages needs to update frequently. Unlike the server-side rendering APIs, you can use client-side data fetching at the component level.

If done at the page level, the data is fetched at runtime, and the content of the page is updated as the data changes. When used at the component level, the data is fetched at the time of the component mount, and the content of the component is updated as the data changes.

It's important to note that using client-side data fetching can affect the performance of your application and the load speed of your pages. This is because the data fetching is done at the time of the component or pages mount, and the data is not cached.

## Client-side data fetching with useEffect

The following example shows how you can fetch data on the client side using the useEffect hook.

```jsx
import { useState, useEffect } from 'react'

function Profile() {
  const [data, setData] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/profile-data')
      .then((res) => res.json())
      .then((data) => {
        setData(data)
        setLoading(false)
      })
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!data) return <p>No profile data</p>

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
    </div>
  )
}
```

## Client-side data fetching with SWR

The team behind Next.js has created a React Hook library for data fetching called [**SWR**](https://swr.vercel.app/). It is **highly recommended** if you are fetching data on the client-side. It handles caching, revalidation, focus tracking, refetching on intervals, and more.

Using the same example as above, we can now use SWR to fetch the profile data. SWR will automatically cache the data for us and will revalidate the data if it becomes stale.

For more information on using SWR, check out the [SWR docs](https://swr.vercel.app/docs/getting-started).

```jsx
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function Profile() {
  const { data, error } = useSWR('/api/profile-data', fetcher)

  if (error) return <div>Failed to load</div>
  if (!data) return <div>Loading...</div>

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.bio}</p>
    </div>
  )
}
```


[⬆ Subir al inicio del capítulo](#)

---

<a id="data-fetching"></a>

## Data Fetching

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/data-fetching](https://nextjs.org/docs/pages/building-your-application/data-fetching)  
> 📂 **Sección:** Pages > Building Your Application > Data Fetching  
> 📝 **Descripción:** *Next.js allows you to fetch data in multiple ways, with prerendering, server-side rendering or static-site generation, and incremental static regeneration. Learn how to manage your application data in Next.js.*  

---

Data fetching in Next.js allows you to render your content in different ways, depending on your application's use case. These include prerendering with **Server-side Rendering** or **Static Generation**, and updating or creating content at runtime with **Incremental Static Regeneration**.

## Examples

- [Agility CMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-agilitycms) ([Demo](https://next-blog-agilitycms.vercel.app/))
- [Builder.io Example](https://github.com/vercel/next.js/tree/canary/examples/cms-builder-io) ([Demo](https://cms-builder-io.vercel.app/))
- [ButterCMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-buttercms) ([Demo](https://next-blog-buttercms.vercel.app/))
- [Contentful Example](https://github.com/vercel/next.js/tree/canary/examples/cms-contentful) ([Demo](https://app-router-contentful.vercel.app/))
- [Cosmic Example](https://github.com/vercel/next.js/tree/canary/examples/cms-cosmic) ([Demo](https://next-blog-cosmic.vercel.app/))
- [DatoCMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-datocms) ([Demo](https://next-blog-datocms.vercel.app/))
- [DotCMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-dotcms) ([Demo](https://nextjs-dotcms-blog.vercel.app/))
- [Drupal Example](https://github.com/vercel/next.js/tree/canary/examples/cms-drupal) ([Demo](https://cms-drupal.vercel.app/))
- [Enterspeed Example](https://github.com/vercel/next.js/tree/canary/examples/cms-enterspeed) ([Demo](https://next-blog-demo.enterspeed.com/))
- [GraphCMS Example](https://github.com/vercel/next.js/tree/canary/examples/cms-graphcms) ([Demo](https://next-blog-graphcms.vercel.app/))
- [Keystone Example](https://github.com/vercel/next.js/tree/canary/examples/cms-keystonejs-embedded) ([Demo](https://nextjs-keystone-demo.vercel.app/))
- [Kontent.ai Example](https://github.com/vercel/next.js/tree/canary/examples/cms-kontent-ai) ([Demo](https://next-blog-kontent-ai.vercel.app/))
- [Makeswift Example](https://github.com/vercel/next.js/tree/canary/examples/cms-makeswift) ([Demo](https://nextjs-makeswift-example.vercel.app/))
- [Plasmic Example](https://github.com/vercel/next.js/tree/canary/examples/cms-plasmic) ([Demo](https://nextjs-plasmic-example.vercel.app/))
- [Prepr Example](https://github.com/vercel/next.js/tree/canary/examples/cms-prepr) ([Demo](https://next-blog-prepr.vercel.app/))
- [Prismic Example](https://github.com/vercel/next.js/tree/canary/examples/cms-prismic) ([Demo](https://next-blog-prismic.vercel.app/))
- [Sanity Example](https://github.com/vercel/next.js/tree/canary/examples/cms-sanity) ([Demo](https://next-blog.sanity.build/))
- [Sitecore XM Cloud Example](https://github.com/vercel/next.js/tree/canary/examples/cms-sitecore-xmcloud) ([Demo](https://vercel-sitecore-xmcloud-demo.vercel.app/))
- [Storyblok Example](https://github.com/vercel/next.js/tree/canary/examples/cms-storyblok) ([Demo](https://next-blog-storyblok.vercel.app/))
- [Strapi Example](https://github.com/vercel/next.js/tree/canary/examples/cms-strapi) ([Demo](https://next-blog-strapi.vercel.app/))
- [TakeShape Example](https://github.com/vercel/next.js/tree/canary/examples/cms-takeshape) ([Demo](https://next-blog-takeshape.vercel.app/))
- [Tina Example](https://github.com/vercel/next.js/tree/canary/examples/cms-tina) ([Demo](https://cms-tina-example.vercel.app/))
- [Umbraco Example](https://github.com/vercel/next.js/tree/canary/examples/cms-umbraco) ([Demo](https://nextjs-umbraco-sample-blog.vercel.app/))
- [Umbraco Heartcore Example](https://github.com/vercel/next.js/tree/canary/examples/cms-umbraco-heartcore) ([Demo](https://next-blog-umbraco-heartcore.vercel.app/))
- [Webiny Example](https://github.com/vercel/next.js/tree/canary/examples/cms-webiny) ([Demo](https://webiny-headlesscms-nextjs-example.vercel.app/))
- [WordPress Example](https://github.com/vercel/next.js/tree/canary/examples/cms-wordpress) ([Demo](https://next-blog-wordpress.vercel.app/))
- [Blog Starter Example](https://github.com/vercel/next.js/tree/canary/examples/blog-starter) ([Demo](https://next-blog-starter.vercel.app/))
- [Static Tweet (Demo)](https://react-tweet.vercel.app/)


[⬆ Subir al inicio del capítulo](#)

---

<a id="error-handling"></a>

## Error Handling

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/configuring/error-handling](https://nextjs.org/docs/pages/building-your-application/configuring/error-handling)  
> 📂 **Sección:** Pages > Building Your Application > Configuring  
> 📝 **Descripción:** *Handle errors in your Next.js app.*  

---

This documentation explains how you can handle development, server-side, and client-side errors.

## Handling Errors in Development

When there is a runtime error during the development phase of your Next.js application, you will encounter an **overlay**. It is a modal that covers the webpage. It is **only** visible when the development server runs using `next dev` via `pnpm dev`, `npm run dev`, `yarn dev`, or `bun dev` and will not be shown in production. Fixing the error will automatically dismiss the overlay.

## Handling Server Errors

Next.js provides a static 500 page by default to handle server-side errors that occur in your application. You can also [customize this page](/docs/pages/building-your-application/routing/custom-error#customizing-the-500-page) by creating a `pages/500.js` file.

Having a 500 page in your application does not show specific errors to the app user.

You can also use [404 page](/docs/pages/building-your-application/routing/custom-error#404-page) to handle specific runtime error like `file not found`.

## Handling Client Errors

React [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) is a graceful way to handle a JavaScript error on the client so that the other parts of the application continue working. In addition to preventing the page from crashing, it allows you to provide a custom fallback component and even log error information.

To use Error Boundaries for your Next.js application, you must create a class component `ErrorBoundary` and wrap the `Component` prop in the `pages/_app.js` file. This component will be responsible to:

- Render a fallback UI after an error is thrown
- Provide a way to reset the Application's state
- Log error information

You can create an `ErrorBoundary` class component by extending `React.Component`. For example:

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true }
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      )
    }

    // Return children components in case of no error

    return this.props.children
  }
}

export default ErrorBoundary
```

The `ErrorBoundary` component keeps track of an `hasError` state. The value of this state variable is a boolean. When the value of `hasError` is `true`, then the `ErrorBoundary` component will render a fallback UI. Otherwise, it will render the children components.

After creating an `ErrorBoundary` component, import it in the `pages/_app.js` file to wrap the `Component` prop in your Next.js application.

```jsx
// Import the ErrorBoundary component
import ErrorBoundary from '../components/ErrorBoundary'

function MyApp({ Component, pageProps }) {
  return (
    // Wrap the Component prop with ErrorBoundary component
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}

export default MyApp
```

You can learn more about [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) in React's documentation.

### Reporting Errors

To monitor client errors, use a service like [Sentry](https://github.com/vercel/next.js/tree/canary/examples/with-sentry), Bugsnag or Datadog.


[⬆ Subir al inicio del capítulo](#)

---

<a id="configuring"></a>

## Configuring

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/configuring](https://nextjs.org/docs/pages/building-your-application/configuring)  
> 📂 **Sección:** Pages > Building Your Application > Configuring  
> 📝 **Descripción:** *Learn how to configure your Next.js application.*  

---

Next.js allows you to customize your project to meet specific requirements. This includes integrations with TypeScript, ESlint, and more, as well as internal configuration options such as Absolute Imports and Environment Variables.


[⬆ Subir al inicio del capítulo](#)

---

<a id="building-your-application"></a>

## Building Your Application

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application](https://nextjs.org/docs/pages/building-your-application)  
> 📂 **Sección:** Pages > Building Your Application  
> 📝 **Descripción:** *Learn how to use Next.js features to build your application.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="turbopack"></a>

## turbopack

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/turbopack](https://nextjs.org/docs/pages/api-reference/config/next-config-js/turbopack)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure Next.js with Turbopack-specific options*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="turbopackchunking"></a>

## turbopackChunking

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/turbopackChunking](https://nextjs.org/docs/pages/api-reference/config/next-config-js/turbopackChunking)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure how Turbopack splits your client-side JavaScript into chunks in production.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="turbopack"></a>

## Turbopack

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/turbopack](https://nextjs.org/docs/pages/api-reference/turbopack)  
> 📂 **Sección:** Pages > Api Reference  
> 📝 **Descripción:** *Turbopack is an incremental bundler optimized for JavaScript and TypeScript, written in Rust, and built into Next.js.*  

---




[⬆ Subir al inicio del capítulo](#)

---

