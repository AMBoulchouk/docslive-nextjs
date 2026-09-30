# Capítulo 12: Pages Router (Soporte Legacy) y Estrategias de Migración

> 📌 **Capítulo 12** | Libro Guía Next.js v16.3.7  
> 📝 **Resumen:** *getStaticProps, getServerSideProps, getInitialProps, API Routes y guía paso a paso para migrar hacia App Router.*  
> 📄 **Temas incluidos:** 164 secciones  

[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)

---

## Contenido del Capítulo

- [Create a new Next.js application](#create-a-new-nextjs-application)
- [Project Structure and Organization](#project-structure-and-organization)
- [Image Optimization](#image-optimization)
- [How to use fonts](#how-to-use-fonts)
- [How to use CSS in your application](#how-to-use-css-in-your-application)
- [How to deploy your Next.js application](#how-to-deploy-your-nextjs-application)
- [Getting Started - Pages Router](#getting-started-pages-router)
- [How to set up analytics](#how-to-set-up-analytics)
- [How to implement authentication in Next.js](#how-to-implement-authentication-in-nextjs)
- [How to configure Babel in Next.js](#how-to-configure-babel-in-nextjs)
- [How to configure Continuous Integration (CI) build caching](#how-to-configure-continuous-integration-ci-build-caching)
- [How to set a Content Security Policy (CSP) for your Next.js application](#how-to-set-a-content-security-policy-csp-for-your-nextjs-application)
- [How to use CSS-in-JS libraries](#how-to-use-css-in-js-libraries)
- [How to set up a custom server in Next.js](#how-to-set-up-a-custom-server-in-nextjs)
- [How to use debugging tools with Next.js](#how-to-use-debugging-tools-with-nextjs)
- [How to preview content with Draft Mode in Next.js](#how-to-preview-content-with-draft-mode-in-nextjs)
- [How to use environment variables in Next.js](#how-to-use-environment-variables-in-nextjs)
- [How to create forms with API Routes](#how-to-create-forms-with-api-routes)
- [How to implement Incremental Static Regeneration (ISR)](#how-to-implement-incremental-static-regeneration-isr)
- [Guides](#guides)
- [How to set up instrumentation](#how-to-set-up-instrumentation)
- [How to implement internationalization in Next.js](#how-to-implement-internationalization-in-nextjs)
- [How to lazy load Client Components and libraries](#how-to-lazy-load-client-components-and-libraries)
- [How to use markdown and MDX in Next.js](#how-to-use-markdown-and-mdx-in-nextjs)
- [How to migrate from Pages to the App Router](#how-to-migrate-from-pages-to-the-app-router)
- [How to migrate from Create React App to Next.js](#how-to-migrate-from-create-react-app-to-nextjs)
- [How to migrate from Vite to Next.js](#how-to-migrate-from-vite-to-nextjs)
- [Migrating](#migrating)
- [How to build micro-frontends using multi-zones and Next.js](#how-to-build-micro-frontends-using-multi-zones-and-nextjs)
- [How to instrument your Next.js app with OpenTelemetry](#how-to-instrument-your-nextjs-app-with-opentelemetry)
- [How to optimize package bundling](#how-to-optimize-package-bundling)
- [How to configure PostCSS in Next.js](#how-to-configure-postcss-in-nextjs)
- [How to preview content with Preview Mode in Next.js](#how-to-preview-content-with-preview-mode-in-nextjs)
- [How to optimize your Next.js application for production](#how-to-optimize-your-nextjs-application-for-production)
- [How to handle redirects in Next.js](#how-to-handle-redirects-in-nextjs)
- [How to use Sass in Next.js](#how-to-use-sass-in-nextjs)
- [How to load and optimize scripts](#how-to-load-and-optimize-scripts)
- [How to self-host your Next.js application](#how-to-self-host-your-nextjs-application)
- [How to create a static export of your Next.js application](#how-to-create-a-static-export-of-your-nextjs-application)
- [Tailwind CSS](#tailwind-css)
- [How to set up Cypress with Next.js](#how-to-set-up-cypress-with-nextjs)
- [Testing](#testing)
- [How to set up Jest with Next.js](#how-to-set-up-jest-with-nextjs)
- [How to set up Playwright with Next.js](#how-to-set-up-playwright-with-nextjs)
- [How to set up Vitest with Next.js](#how-to-set-up-vitest-with-nextjs)
- [How to optimize third-party libraries](#how-to-optimize-third-party-libraries)
- [Codemods](#codemods)
- [Upgrading](#upgrading)
- [How to upgrade to version 10](#how-to-upgrade-to-version-10)
- [How to upgrade to version 11](#how-to-upgrade-to-version-11)
- [How to upgrade to version 12](#how-to-upgrade-to-version-12)
- [How to upgrade to version 13](#how-to-upgrade-to-version-13)
- [How to upgrade to version 14](#how-to-upgrade-to-version-14)
- [How to upgrade to version 9](#how-to-upgrade-to-version-9)
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
- [Font Module](#font-module)
- [Form](#form)
- [Head](#head)
- [Image (Legacy)](#image-legacy)
- [Image](#image)
- [Components](#components)
- [Link](#link)
- [Script](#script)
- [File-system conventions](#file-system-conventions)
- [instrumentation.js](#instrumentationjs)
- [Proxy](#proxy)
- [public Folder](#public-folder)
- [src Directory](#src-directory)
- [catchError](#catcherror)
- [getInitialProps](#getinitialprops)
- [getServerSideProps](#getserversideprops)
- [getStaticPaths](#getstaticpaths)
- [getStaticProps](#getstaticprops)
- [Functions](#functions)
- [NextRequest](#nextrequest)
- [NextResponse](#nextresponse)
- [useParams](#useparams)
- [useReportWebVitals](#usereportwebvitals)
- [useRouter](#userouter)
- [useSearchParams](#usesearchparams)
- [userAgent](#useragent)
- [adapterPath](#adapterpath)
- [allowedDevOrigins](#alloweddevorigins)
- [assetPrefix](#assetprefix)
- [basePath](#basepath)
- [bundlePagesRouterDependencies](#bundlepagesrouterdependencies)
- [compress](#compress)
- [crossOrigin](#crossorigin)
- [deploymentId](#deploymentid)
- [devIndicators](#devindicators)
- [distDir](#distdir)
- [env](#env)
- [exportPathMap](#exportpathmap)
- [generateBuildId](#generatebuildid)
- [generateEtags](#generateetags)
- [headers](#headers)
- [httpAgentOptions](#httpagentoptions)
- [images](#images)
- [next.config.js Options](#nextconfigjs-options)
- [logging](#logging)
- [onDemandEntries](#ondemandentries)
- [optimizePackageImports](#optimizepackageimports)
- [output](#output)
- [pageExtensions](#pageextensions)
- [poweredByHeader](#poweredbyheader)
- [productionBrowserSourceMaps](#productionbrowsersourcemaps)
- [experimental.proxyClientMaxBodySize](#experimentalproxyclientmaxbodysize)
- [reactStrictMode](#reactstrictmode)
- [redirects](#redirects)
- [rewrites](#rewrites)
- [serverExternalPackages](#serverexternalpackages)
- [skipProxyUrlNormalize](#skipproxyurlnormalize)
- [skipTrailingSlashRedirect](#skiptrailingslashredirect)
- [trailingSlash](#trailingslash)
- [transpilePackages](#transpilepackages)
- [turbopack](#turbopack)
- [turbopackChunking](#turbopackchunking)
- [typescript](#typescript)
- [urlImports](#urlimports)
- [useLightningcss](#uselightningcss)
- [useTypeScriptCli](#usetypescriptcli)
- [webVitalsAttribution](#webvitalsattribution)
- [Custom Webpack Config](#custom-webpack-config)
- [TypeScript](#typescript)
- [ESLint](#eslint)
- [Configuration](#configuration)
- [create-next-app CLI](#create-next-app-cli)
- [CLI](#cli)
- [next CLI](#next-cli)
- [Configuration](#configuration)
- [Creating an Adapter](#creating-an-adapter)
- [API Reference](#api-reference)
- [Testing Adapters](#testing-adapters)
- [Routing with @next/routing](#routing-with-nextrouting)
- [Runtime Integration](#runtime-integration)
- [Invoking Entrypoints](#invoking-entrypoints)
- [Output Types](#output-types)
- [Routing Information](#routing-information)
- [Use Cases](#use-cases)
- [Adapters](#adapters)
- [Edge Runtime](#edge-runtime)
- [Turbopack](#turbopack)
- [API Reference](#api-reference)
- [Pages Router](#pages-router)

---

<a id="create-a-new-nextjs-application"></a>

## Create a new Next.js application

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/getting-started/installation](https://nextjs.org/docs/pages/getting-started/installation)  
> 📂 **Sección:** Pages > Getting Started  
> 📝 **Descripción:** *How to create a new Next.js application with `create-next-app`. Set up TypeScript, ESLint,and configure your `next.config.js` file.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="project-structure-and-organization"></a>

## Project Structure and Organization

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/getting-started/project-structure](https://nextjs.org/docs/pages/getting-started/project-structure)  
> 📂 **Sección:** Pages > Getting Started  
> 📝 **Descripción:** *Learn about the folder and file conventions in a Next.js project, and how to organize your project.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="image-optimization"></a>

## Image Optimization

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/getting-started/images](https://nextjs.org/docs/pages/getting-started/images)  
> 📂 **Sección:** Pages > Getting Started  
> 📝 **Descripción:** *Optimize your images with the built-in `next/image` component.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-use-fonts"></a>

## How to use fonts

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/getting-started/fonts](https://nextjs.org/docs/pages/getting-started/fonts)  
> 📂 **Sección:** Pages > Getting Started  
> 📝 **Descripción:** *Learn how to use fonts in Next.js*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-use-css-in-your-application"></a>

## How to use CSS in your application

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/getting-started/css](https://nextjs.org/docs/pages/getting-started/css)  
> 📂 **Sección:** Pages > Getting Started  
> 📝 **Descripción:** *Learn about the different ways to add CSS to your application, including CSS Modules, Global CSS, Tailwind CSS, and more.*  

---




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

<a id="getting-started-pages-router"></a>

## Getting Started - Pages Router

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/getting-started](https://nextjs.org/docs/pages/getting-started)  
> 📂 **Sección:** Pages > Getting Started  
> 📝 **Descripción:** *Learn how to create full-stack web applications with Next.js with the Pages Router.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-analytics"></a>

## How to set up analytics

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/analytics](https://nextjs.org/docs/pages/guides/analytics)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Measure and track page performance using Next.js*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-implement-authentication-in-nextjs"></a>

## How to implement authentication in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/authentication](https://nextjs.org/docs/pages/guides/authentication)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to implement authentication in Next.js, covering best practices, securing routes, authorization techniques, and session management.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-configure-babel-in-nextjs"></a>

## How to configure Babel in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/babel](https://nextjs.org/docs/pages/guides/babel)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Extend the babel preset added by Next.js with your own configs.*  

---

<details>
  <summary>Examples</summary>

- [Customizing babel configuration](https://github.com/vercel/next.js/tree/canary/examples/with-custom-babel-config)

</details>

Next.js includes the `next/babel` preset to your app, which includes everything needed to compile React applications and server-side code. But if you want to extend the default Babel configs, it's also possible.

## Adding Presets and Plugins

To start, you only need to define a `.babelrc` file (or `babel.config.js`) in the root directory of your project. If such a file is found, it will be considered as the _source of truth_, and therefore it needs to define what Next.js needs as well, which is the `next/babel` preset.

Here's an example `.babelrc` file:

```json
// Archivo: .babelrc
{
  "presets": ["next/babel"],
  "plugins": []
}
```

You can [take a look at this file](https://github.com/vercel/next.js/blob/canary/packages/next/src/build/babel/preset.ts) to learn about the presets included by `next/babel`.

To add presets/plugins **without configuring them**, you can do it this way:

```json
// Archivo: .babelrc
{
  "presets": ["next/babel"],
  "plugins": ["@babel/plugin-proposal-do-expressions"]
}
```

## Customizing Presets and Plugins

To add presets/plugins **with custom configuration**, do it on the `next/babel` preset like so:

```json
// Archivo: .babelrc
{
  "presets": [
    [
      "next/babel",
      {
        "preset-env": {},
        "transform-runtime": {},
        "styled-jsx": {},
        "class-properties": {}
      }
    ]
  ],
  "plugins": []
}
```

To learn more about the available options for each config, visit babel's [documentation](https://babeljs.io/docs/) site.

> **Good to know**:
>
> - Next.js uses the [**current** Node.js version](https://github.com/nodejs/release#release-schedule) for server-side compilations.
> - The `modules` option on `"preset-env"` should be kept to `false`, otherwise webpack code splitting is turned off.


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

<a id="how-to-set-a-content-security-policy-csp-for-your-nextjs-application"></a>

## How to set a Content Security Policy (CSP) for your Next.js application

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/content-security-policy](https://nextjs.org/docs/pages/guides/content-security-policy)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to set a Content Security Policy (CSP) for your Next.js application.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-use-css-in-js-libraries"></a>

## How to use CSS-in-JS libraries

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/css-in-js](https://nextjs.org/docs/pages/guides/css-in-js)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Use CSS-in-JS libraries with Next.js*  

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

<a id="how-to-use-debugging-tools-with-nextjs"></a>

## How to use debugging tools with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/debugging](https://nextjs.org/docs/pages/guides/debugging)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to debug your Next.js application with VS Code or Chrome DevTools.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-preview-content-with-draft-mode-in-nextjs"></a>

## How to preview content with Draft Mode in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/draft-mode](https://nextjs.org/docs/pages/guides/draft-mode)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Next.js has draft mode to toggle between static and dynamic pages. You can learn how it works with Pages Router.*  

---

In the [Pages documentation](/docs/pages/building-your-application/routing/pages-and-layouts) and the [Data Fetching documentation](/docs/pages/building-your-application/data-fetching), we talked about how to prerender a page at build time (**Static Generation**) using `getStaticProps` and `getStaticPaths`.

Static Generation is useful when your pages fetch data from a headless CMS. However, it’s not ideal when you’re writing a draft on your headless CMS and want to view the draft immediately on your page. You’d want Next.js to render these pages at **request time** instead of build time and fetch the draft content instead of the published content. You’d want Next.js to bypass Static Generation only for this specific case.

Next.js has a feature called **Draft Mode** which solves this problem. Here are instructions on how to use it.

## Step 1: Create and access the API route

> Take a look at the [API Routes documentation](/docs/pages/building-your-application/routing/api-routes) first if you’re not familiar with Next.js API Routes.

First, create the **API route**. It can have any name - e.g. `pages/api/draft.ts`

In this API route, you need to call `setDraftMode` on the response object.

```js
export default function handler(req, res) {
  // ...
  res.setDraftMode({ enable: true })
  // ...
}
```

This will set a **cookie** to enable draft mode. Subsequent requests containing this cookie will trigger **Draft Mode** changing the behavior for statically generated pages (more on this later).

You can test this manually by creating an API route like below and accessing it from your browser manually:

```ts
// Archivo: pages/api/draft.ts
// simple example for testing it manually from your browser.
export default function handler(req, res) {
  res.setDraftMode({ enable: true })
  res.end('Draft mode is enabled')
}
```

If you open your browser’s developer tools and visit `/api/draft`, you’ll notice a `Set-Cookie` response header with a cookie named `__prerender_bypass`.

### Securely accessing it from your Headless CMS

In practice, you’d want to call this API route _securely_ from your headless CMS. The specific steps will vary depending on which headless CMS you’re using, but here are some common steps you could take.

These steps assume that the headless CMS you’re using supports setting **custom draft URLs**. If it doesn’t, you can still use this method to secure your draft URLs, but you’ll need to construct and access the draft URL manually.

**First**, you should create a **secret token string** using a token generator of your choice. This secret will only be known by your Next.js app and your headless CMS. This secret prevents people who don’t have access to your CMS from accessing draft URLs.

**Second**, if your headless CMS supports setting custom draft URLs, specify the following as the draft URL. This assumes that your draft API route is located at `pages/api/draft.ts`.

```bash
// Archivo: Terminal
https://<your-site>/api/draft?secret=<token>&slug=<path>
```

- `<your-site>` should be your deployment domain.
- `<token>` should be replaced with the secret token you generated.
- `<path>` should be the path for the page that you want to view. If you want to view `/posts/foo`, then you should use `&slug=/posts/foo`.

Your headless CMS might allow you to include a variable in the draft URL so that `<path>` can be set dynamically based on the CMS’s data like so: `&slug=/posts/{entry.fields.slug}`

**Finally**, in the draft API route:

- Check that the secret matches and that the `slug` parameter exists (if not, the request should fail).
-
- Call `res.setDraftMode`.
- Then redirect the browser to the path specified by `slug`. (The following example uses a [307 redirect](https://developer.mozilla.org/docs/Web/HTTP/Status/307)).

```js
export default async (req, res) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== 'MY_SECRET_TOKEN' || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  const post = await getPostBySlug(req.query.slug)

  // If the slug doesn't exist prevent draft mode from being enabled
  if (!post) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  // Enable Draft Mode by setting the cookie
  res.setDraftMode({ enable: true })

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.redirect(post.slug)
}
```

If it succeeds, then the browser will be redirected to the path you want to view with the draft mode cookie.

## Step 2: Update `getStaticProps`

The next step is to update `getStaticProps` to support draft mode.

If you request a page which has `getStaticProps` with the cookie set (via `res.setDraftMode`), then `getStaticProps` will be called at **request time** (instead of at build time).

Furthermore, it will be called with a `context` object where `context.draftMode` will be `true`.

```js
export async function getStaticProps(context) {
  if (context.draftMode) {
    // dynamic data
  }
}
```

We used `res.setDraftMode` in the draft API route, so `context.draftMode` will be `true`.

If you’re also using `getStaticPaths`, then `context.params` will also be available.

### Fetch draft data

You can update `getStaticProps` to fetch different data based on `context.draftMode`.

For example, your headless CMS might have a different API endpoint for draft posts. If so, you can modify the API endpoint URL like below:

```js
export async function getStaticProps(context) {
  const url = context.draftMode
    ? 'https://draft.example.com'
    : 'https://production.example.com'
  const res = await fetch(url)
  // ...
}
```

That’s it! If you access the draft API route (with `secret` and `slug`) from your headless CMS or manually, you should now be able to see the draft content. And if you update your draft without publishing, you should be able to view the draft.

Set this as the draft URL on your headless CMS or access manually, and you should be able to see the draft.

```bash
// Archivo: Terminal
https://<your-site>/api/draft?secret=<token>&slug=<path>
```

## More Details

### Clear the Draft Mode cookie

By default, the Draft Mode session ends when the browser is closed.

To clear the Draft Mode cookie manually, create an API route that calls `setDraftMode({ enable: false })`:

```ts
// Archivo: pages/api/disable-draft.ts
export default function handler(req, res) {
  res.setDraftMode({ enable: false })
}
```

Then, send a request to `/api/disable-draft` to invoke the API Route. If calling this route using [`next/link`](/docs/pages/api-reference/components/link), you must pass `prefetch={false}` to prevent accidentally deleting the cookie on prefetch.

### Works with `getServerSideProps`

Draft Mode works with `getServerSideProps`, and is available as a `draftMode` key in the [`context`](/docs/pages/api-reference/functions/get-server-side-props#context-parameter) object.

> **Good to know**: You shouldn't set the `Cache-Control` header when using Draft Mode because it cannot be bypassed. Instead, we recommend using [ISR](/docs/pages/guides/incremental-static-regeneration).

### Works with API Routes

API Routes will have access to `draftMode` on the request object. For example:

```js
export default function myApiRoute(req, res) {
  if (req.draftMode) {
    // get draft data
  }
}
```

### Unique per `next build`

A new bypass cookie value will be generated each time you run `next build`.

This ensures that the bypass cookie can’t be guessed.

> **Good to know**: To test Draft Mode locally over HTTP, your browser will need to allow third-party cookies and local storage access.


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-use-environment-variables-in-nextjs"></a>

## How to use environment variables in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/environment-variables](https://nextjs.org/docs/pages/guides/environment-variables)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn to add and access environment variables in your Next.js application.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-create-forms-with-api-routes"></a>

## How to create forms with API Routes

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/forms](https://nextjs.org/docs/pages/guides/forms)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to handle form submissions and data mutations with Next.js.*  

---

Forms enable you to create and update data in web applications. Next.js provides a powerful way to handle data mutations using **API Routes**. This guide will walk you through how to handle form submission on the server.

## Server Forms

To handle form submissions on the server, create an API endpoint that securely mutates data.

```ts
// Archivo: pages/api/submit.ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body
  const id = await createItem(data)
  res.status(200).json({ id })
}
```

```js
// Archivo: pages/api/submit.js switcher
export default function handler(req, res) {
  const data = req.body
  // call your database, etc.
  // const id = await createItem(data)
  // ...
  res.status(200).json({ data })
}
```

Then, call the API Route from the client with an event handler:

```tsx
// Archivo: pages/index.tsx switcher
import { SubmitEvent } from 'react'

export default function Page() {
  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    })

    // Handle response if necessary
    const data = await response.json()
    // ...
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

```jsx
// Archivo: pages/index.jsx switcher
export default function Page() {
  async function onSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    })

    // Handle response if necessary
    const data = await response.json()
    // ...
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

> **Good to know:**
>
> - API Routes [do not specify CORS headers](https://developer.mozilla.org/docs/Web/HTTP/CORS), meaning they are same-origin only by default.
> - Since API Routes run on the server, we're able to use sensitive values (like API keys) through [Environment Variables](/docs/pages/guides/environment-variables) without exposing them to the client. This is critical for the security of your application.

## Form validation

We recommend using HTML validation like `required` and `type="email"` for basic client-side form validation.

For more advanced server-side validation, you can use a schema validation library like [Zod](https://zod.dev/) or [Valibot](https://valibot.dev/) to validate the form fields before mutating the data:

```ts
// Archivo: pages/api/submit.ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const schema = z.object({
  // ...
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsed = schema.parse(req.body)
  // ...
}
```

```js
// Archivo: pages/api/submit.js switcher
import { z } from 'zod'

const schema = z.object({
  // ...
})

export default async function handler(req, res) {
  const parsed = schema.parse(req.body)
  // ...
}
```

### Error handling

You can use React state to show an error message when a form submission fails:

```tsx
// Archivo: pages/index.tsx switcher
import React, { useState, SubmitEvent } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null) // Clear previous errors when a new request starts

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }

      // Handle response if necessary
      const data = await response.json()
      // ...
    } catch (error) {
      // Capture the error message to display to the user
      setError(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <input type="text" name="name" required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
```

```jsx
// Archivo: pages/index.jsx switcher
import React, { useState } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError(null) // Clear previous errors when a new request starts

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }

      // Handle response if necessary
      const data = await response.json()
      // ...
    } catch (error) {
      // Capture the error message to display to the user
      setError(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <input type="text" name="name" required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
```

## Displaying loading state

You can use React state to show a loading state when a form is submitting on the server:

```tsx
// Archivo: pages/index.tsx switcher
import React, { useState, SubmitEvent } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true) // Set loading to true when the request starts

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      // Handle response if necessary
      const data = await response.json()
      // ...
    } catch (error) {
      // Handle error if necessary
      console.error(error)
    } finally {
      setIsLoading(false) // Set loading to false when the request completes
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  )
}
```

```jsx
// Archivo: pages/index.jsx switcher
import React, { useState } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true) // Set loading to true when the request starts

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      // Handle response if necessary
      const data = await response.json()
      // ...
    } catch (error) {
      // Handle error if necessary
      console.error(error)
    } finally {
      setIsLoading(false) // Set loading to false when the request completes
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  )
}
```

### Redirecting

If you would like to redirect the user to a different route after a mutation, you can [`redirect`](/docs/pages/building-your-application/routing/api-routes#response-helpers) to any absolute or relative URL:

```ts
// Archivo: pages/api/submit.ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = await addPost()
  res.redirect(307, `/post/${id}`)
}
```

```js
// Archivo: pages/api/submit.js switcher
export default async function handler(req, res) {
  const id = await addPost()
  res.redirect(307, `/post/${id}`)
}
```


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

<a id="guides"></a>

## Guides

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides](https://nextjs.org/docs/pages/guides)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to implement common UI patterns and use cases using Next.js*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-instrumentation"></a>

## How to set up instrumentation

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/instrumentation](https://nextjs.org/docs/pages/guides/instrumentation)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to use instrumentation to run code at server startup in your Next.js app*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-implement-internationalization-in-nextjs"></a>

## How to implement internationalization in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/internationalization](https://nextjs.org/docs/pages/guides/internationalization)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Next.js has built-in support for internationalized routing and language detection. Learn more here.*  

---

<details>
  <summary>Examples</summary>

- [i18n routing](https://github.com/vercel/next.js/tree/canary/examples/i18n-routing-pages)

</details>

Next.js has built-in support for internationalized ([i18n](https://en.wikipedia.org/wiki/Internationalization_and_localization#Naming)) routing since `v10.0.0`. You can provide a list of locales, the default locale, and domain-specific locales and Next.js will automatically handle the routing.

The i18n routing support is currently meant to complement existing i18n library solutions like [`react-intl`](https://formatjs.io/docs/getting-started/installation), [`react-i18next`](https://react.i18next.com/), [`lingui`](https://lingui.dev/), [`rosetta`](https://github.com/lukeed/rosetta), [`next-intl`](https://github.com/amannn/next-intl), [`next-translate`](https://github.com/aralroca/next-translate), [`next-multilingual`](https://github.com/Avansai/next-multilingual), [`tolgee`](https://tolgee.io/integrations/next), [`paraglide-next`](https://inlang.com/m/osslbuzt/paraglide-next-i18n), [`next-intlayer`](https://intlayer.org/doc/environment/nextjs/next-with-page-router), [`gt-react`](https://generaltranslation.com/en/docs/react) and others by streamlining the routes and locale parsing.

## Getting started

To get started, add the `i18n` config to your `next.config.js` file.

Locales are [UTS Locale Identifiers](https://www.unicode.org/reports/tr35/tr35-59/tr35.html#Identifiers), a standardized format for defining locales.

Generally a Locale Identifier is made up of a language, region, and script separated by a dash: `language-region-script`. The region and script are optional. An example:

- `en-US` - English as spoken in the United States
- `nl-NL` - Dutch as spoken in the Netherlands
- `nl` - Dutch, no specific region

If user locale is `nl-BE` and it is not listed in your configuration, they will be redirected to `nl` if available, or to the default locale otherwise.
If you don't plan to support all regions of a country, it is therefore a good practice to include country locales that will act as fallbacks.

```js
// Archivo: next.config.js
module.exports = {
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en-US', 'fr', 'nl-NL'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'en-US',
    // This is a list of locale domains and the default locale they
    // should handle (these are only required when setting up domain routing)
    // Note: subdomains must be included in the domain value to be matched e.g. "fr.example.com".
    domains: [
      {
        domain: 'example.com',
        defaultLocale: 'en-US',
      },
      {
        domain: 'example.nl',
        defaultLocale: 'nl-NL',
      },
      {
        domain: 'example.fr',
        defaultLocale: 'fr',
        // an optional http field can also be used to test
        // locale domains locally with http instead of https
        http: true,
      },
    ],
  },
}
```

## Locale Strategies

There are two locale handling strategies: Sub-path Routing and Domain Routing.

### Sub-path Routing

Sub-path Routing puts the locale in the url path.

```js
// Archivo: next.config.js
module.exports = {
  i18n: {
    locales: ['en-US', 'fr', 'nl-NL'],
    defaultLocale: 'en-US',
  },
}
```

With the above configuration `en-US`, `fr`, and `nl-NL` will be available to be routed to, and `en-US` is the default locale. If you have a `pages/blog.js` the following urls would be available:

- `/blog`
- `/fr/blog`
- `/nl-nl/blog`

The default locale does not have a prefix.

### Domain Routing

By using domain routing you can configure locales to be served from different domains:

```js
// Archivo: next.config.js
module.exports = {
  i18n: {
    locales: ['en-US', 'fr', 'nl-NL', 'nl-BE'],
    defaultLocale: 'en-US',

    domains: [
      {
        // Note: subdomains must be included in the domain value to be matched
        // e.g. www.example.com should be used if that is the expected hostname
        domain: 'example.com',
        defaultLocale: 'en-US',
      },
      {
        domain: 'example.fr',
        defaultLocale: 'fr',
      },
      {
        domain: 'example.nl',
        defaultLocale: 'nl-NL',
        // specify other locales that should be redirected
        // to this domain
        locales: ['nl-BE'],
      },
    ],
  },
}
```

For example if you have `pages/blog.js` the following urls will be available:

- `example.com/blog`
- `www.example.com/blog`
- `example.fr/blog`
- `example.nl/blog`
- `example.nl/nl-BE/blog`

## Automatic Locale Detection

When a user visits the application root (generally `/`), Next.js will try to automatically detect which locale the user prefers based on the [`Accept-Language`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Accept-Language) header and the current domain.

If a locale other than the default locale is detected, the user will be redirected to either:

- **When using Sub-path Routing:** The locale prefixed path
- **When using Domain Routing:** The domain with that locale specified as the default

When using Domain Routing, if a user with the `Accept-Language` header `fr;q=0.9` visits `example.com`, they will be redirected to `example.fr` since that domain handles the `fr` locale by default.

When using Sub-path Routing, the user would be redirected to `/fr`.

### Prefixing the Default Locale

With Next.js 12 and [Proxy](/docs/pages/api-reference/file-conventions/proxy), we can add a prefix to the default locale with a [workaround](https://github.com/vercel/next.js/discussions/18419).

For example, here's a `next.config.js` file with support for a few languages. Note the `"default"` locale has been added intentionally.

```js
// Archivo: next.config.js
module.exports = {
  i18n: {
    locales: ['default', 'en', 'de', 'fr'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  trailingSlash: true,
}
```

Next, we can use [Proxy](/docs/pages/api-reference/file-conventions/proxy) to add custom routing rules:

```ts
// Archivo: proxy.ts
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_FILE = /\.(.*)$/

export async function proxy(req: NextRequest) {
  if (
    req.nextUrl.pathname.startsWith('/_next') ||
    req.nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(req.nextUrl.pathname)
  ) {
    return
  }

  if (req.nextUrl.locale === 'default') {
    const locale = req.cookies.get('NEXT_LOCALE')?.value || 'en'

    return NextResponse.redirect(
      new URL(`/${locale}${req.nextUrl.pathname}${req.nextUrl.search}`, req.url)
    )
  }
}
```

This [Proxy](/docs/pages/api-reference/file-conventions/proxy) skips adding the default prefix to [API Routes](/docs/pages/building-your-application/routing/api-routes) and [public](/docs/pages/api-reference/file-conventions/public-folder) files like fonts or images. If a request is made to the default locale, we redirect to our prefix `/en`.

### Disabling Automatic Locale Detection

The automatic locale detection can be disabled with:

```js
// Archivo: next.config.js
module.exports = {
  i18n: {
    localeDetection: false,
  },
}
```

When `localeDetection` is set to `false` Next.js will no longer automatically redirect based on the user's preferred locale and will only provide locale information detected from either the locale based domain or locale path as described above.

## Accessing the locale information

You can access the locale information via the Next.js router. For example, using the [`useRouter()`](/docs/pages/api-reference/functions/use-router) hook the following properties are available:

- `locale` contains the currently active locale.
- `locales` contains all configured locales.
- `defaultLocale` contains the configured default locale.

When [prerendering](/docs/pages/building-your-application/rendering/static-site-generation) pages with `getStaticProps` or `getServerSideProps`, the locale information is provided in [the context](/docs/pages/building-your-application/data-fetching/get-static-props) provided to the function.

When leveraging `getStaticPaths`, the configured locales are provided in the context parameter of the function under `locales` and the configured defaultLocale under `defaultLocale`.

## Transition between locales

You can use `next/link` or `next/router` to transition between locales.

For `next/link`, a `locale` prop can be provided to transition to a different locale from the currently active one. If no `locale` prop is provided, the currently active `locale` is used during client-transitions. For example:

```jsx
import Link from 'next/link'

export default function IndexPage(props) {
  return (
    <Link href="/another" locale="fr">
      To /fr/another
    </Link>
  )
}
```

When using the `next/router` methods directly, you can specify the `locale` that should be used via the transition options. For example:

```jsx
import { useRouter } from 'next/router'

export default function IndexPage(props) {
  const router = useRouter()

  return (
    <div
      onClick={() => {
        router.push('/another', '/another', { locale: 'fr' })
      }}
    >
      to /fr/another
    </div>
  )
}
```

Note that to handle switching only the `locale` while preserving all routing information such as [dynamic route](/docs/pages/building-your-application/routing/dynamic-routes) query values or hidden href query values, you can provide the `href` parameter as an object:

```jsx
import { useRouter } from 'next/router'
const router = useRouter()
const { pathname, asPath, query } = router
// change just the locale and maintain all other route information including href's query
router.push({ pathname, query }, asPath, { locale: nextLocale })
```

See [here](/docs/pages/api-reference/functions/use-router#with-url-object) for more information on the object structure for `router.push`.

If you have a `href` that already includes the locale you can opt-out of automatically handling the locale prefixing:

```jsx
import Link from 'next/link'

export default function IndexPage(props) {
  return (
    <Link href="/fr/another" locale={false}>
      To /fr/another
    </Link>
  )
}
```

## Leveraging the `NEXT_LOCALE` cookie

Next.js allows setting a `NEXT_LOCALE=the-locale` cookie, which takes priority over the accept-language header. This cookie can be set using a language switcher and then when a user comes back to the site it will leverage the locale specified in the cookie when redirecting from `/` to the correct locale location.

For example, if a user prefers the locale `fr` in their accept-language header but a `NEXT_LOCALE=en` cookie is set the `en` locale when visiting `/` the user will be redirected to the `en` locale location until the cookie is removed or expired.

## Search Engine Optimization

Since Next.js knows what language the user is visiting it will automatically add the `lang` attribute to the `<html>` tag.

Next.js doesn't know about variants of a page so it's up to you to add the `hreflang` meta tags using [`next/head`](/docs/pages/api-reference/components/head). You can learn more about `hreflang` in the [Google Webmasters documentation](https://support.google.com/webmasters/answer/189077).

## How does this work with Static Generation?

> Note that Internationalized Routing does not integrate with [`output: 'export'`](/docs/pages/guides/static-exports) as it does not leverage the Next.js routing layer. Hybrid Next.js applications that do not use `output: 'export'` are fully supported.

### Dynamic Routes and `getStaticProps` Pages

For pages using `getStaticProps` with [Dynamic Routes](/docs/pages/building-your-application/routing/dynamic-routes), all locale variants of the page desired to be prerendered need to be returned from [`getStaticPaths`](/docs/pages/building-your-application/data-fetching/get-static-paths). Along with the `params` object returned for `paths`, you can also return a `locale` field specifying which locale you want to render. For example:

```jsx
// Archivo: pages/blog/[slug].js
export const getStaticPaths = ({ locales }) => {
  return {
    paths: [
      // if no `locale` is provided only the defaultLocale will be generated
      { params: { slug: 'post-1' }, locale: 'en-US' },
      { params: { slug: 'post-1' }, locale: 'fr' },
    ],
    fallback: true,
  }
}
```

For [Automatically Statically Optimized](/docs/pages/building-your-application/rendering/automatic-static-optimization) and non-dynamic `getStaticProps` pages, **a version of the page will be generated for each locale**. This is important to consider because it can increase build times depending on how many locales are configured inside `getStaticProps`.

For example, if you have 50 locales configured with 10 non-dynamic pages using `getStaticProps`, this means `getStaticProps` will be called 500 times. 50 versions of the 10 pages will be generated during each build.

To decrease the build time of dynamic pages with `getStaticProps`, use a [`fallback` mode](/docs/pages/api-reference/functions/get-static-paths#fallback-true). This allows you to return only the most popular paths and locales from `getStaticPaths` for prerendering during the build. Then, Next.js will build the remaining pages at runtime as they are requested.

### Automatically Statically Optimized Pages

For pages that are [automatically statically optimized](/docs/pages/building-your-application/rendering/automatic-static-optimization), a version of the page will be generated for each locale.

### Non-dynamic getStaticProps Pages

For non-dynamic `getStaticProps` pages, a version is generated for each locale like above. `getStaticProps` is called with each `locale` that is being rendered. If you would like to opt-out of a certain locale from being prerendered, you can return `notFound: true` from `getStaticProps` and this variant of the page will not be generated.

```js
export async function getStaticProps({ locale }) {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch(`https://.../posts?locale=${locale}`)
  const posts = await res.json()

  if (posts.length === 0) {
    return {
      notFound: true,
    }
  }

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}
```

## Limits for the i18n config

- `locales`: 100 total locales
- `domains`: 100 total locale domain items

> **Good to know**: These limits have been added initially to prevent potential [performance issues at build time](#dynamic-routes-and-getstaticprops-pages). You can workaround these limits with custom routing using [Proxy](/docs/pages/api-reference/file-conventions/proxy) in Next.js 12.


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

<a id="how-to-use-markdown-and-mdx-in-nextjs"></a>

## How to use markdown and MDX in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/mdx](https://nextjs.org/docs/pages/guides/mdx)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to configure MDX to write JSX in your markdown files.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-migrate-from-pages-to-the-app-router"></a>

## How to migrate from Pages to the App Router

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/migrating/app-router-migration](https://nextjs.org/docs/pages/guides/migrating/app-router-migration)  
> 📂 **Sección:** Pages > Guides > Migrating  
> 📝 **Descripción:** *Learn how to upgrade your existing Next.js application from the Pages Router to the App Router.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-migrate-from-create-react-app-to-nextjs"></a>

## How to migrate from Create React App to Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/migrating/from-create-react-app](https://nextjs.org/docs/pages/guides/migrating/from-create-react-app)  
> 📂 **Sección:** Pages > Guides > Migrating  
> 📝 **Descripción:** *Learn how to migrate your existing React application from Create React App to Next.js.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-migrate-from-vite-to-nextjs"></a>

## How to migrate from Vite to Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/migrating/from-vite](https://nextjs.org/docs/pages/guides/migrating/from-vite)  
> 📂 **Sección:** Pages > Guides > Migrating  
> 📝 **Descripción:** *Learn how to migrate your existing React application from Vite to Next.js.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="migrating"></a>

## Migrating

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/migrating](https://nextjs.org/docs/pages/guides/migrating)  
> 📂 **Sección:** Pages > Guides > Migrating  
> 📝 **Descripción:** *Learn how to migrate from popular frameworks to Next.js*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-build-micro-frontends-using-multi-zones-and-nextjs"></a>

## How to build micro-frontends using multi-zones and Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/multi-zones](https://nextjs.org/docs/pages/guides/multi-zones)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to build micro-frontends using Next.js Multi-Zones to deploy multiple Next.js apps under a single domain.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-instrument-your-nextjs-app-with-opentelemetry"></a>

## How to instrument your Next.js app with OpenTelemetry

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/open-telemetry](https://nextjs.org/docs/pages/guides/open-telemetry)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to instrument your Next.js app with OpenTelemetry.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-optimize-package-bundling"></a>

## How to optimize package bundling

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/package-bundling](https://nextjs.org/docs/pages/guides/package-bundling)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to optimize your application's server and client bundles.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-configure-postcss-in-nextjs"></a>

## How to configure PostCSS in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/post-css](https://nextjs.org/docs/pages/guides/post-css)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Extend the PostCSS config and plugins added by Next.js with your own.*  

---

## Default Behavior

Next.js compiles CSS for its [built-in CSS support](/docs/app/getting-started/css) using PostCSS.

Out of the box, with no configuration, Next.js compiles CSS with the following transformations:

- [Autoprefixer](https://github.com/postcss/autoprefixer) automatically adds vendor prefixes to CSS rules (back to IE11).
- [Cross-browser Flexbox bugs](https://github.com/philipwalton/flexbugs) are corrected to behave like [the spec](https://www.w3.org/TR/css-flexbox-1/).
- New CSS features are automatically compiled for Internet Explorer 11 compatibility:
  - [`all` Property](https://developer.mozilla.org/docs/Web/CSS/all)
  - [Break Properties](https://developer.mozilla.org/docs/Web/CSS/break-after)
  - [`font-variant` Property](https://developer.mozilla.org/docs/Web/CSS/font-variant)
  - [Gap Properties](https://developer.mozilla.org/docs/Web/CSS/gap)
  - [Media Query Ranges](https://developer.mozilla.org/docs/Web/CSS/Media_Queries/Using_media_queries#Syntax_improvements_in_Level_4)

By default, [CSS Grid](https://www.w3.org/TR/css-grid-1/) and [Custom Properties](https://developer.mozilla.org/docs/Web/CSS/var) (CSS variables) are **not compiled** for IE11 support.

To compile [CSS Grid Layout](https://developer.mozilla.org/docs/Web/CSS/grid) for IE11, you can place the following comment at the top of your CSS file:

```css
/* autoprefixer grid: autoplace */
```

You can also enable IE11 support for [CSS Grid Layout](https://developer.mozilla.org/docs/Web/CSS/grid)
in your entire project by configuring autoprefixer with the configuration shown below (collapsed).
See ["Customizing Plugins"](#customizing-plugins) below for more information.

<details>
  <summary>Click to view the configuration to enable CSS Grid Layout</summary>

```json
// Archivo: postcss.config.json
{
  "plugins": [
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        "autoprefixer": {
          "flexbox": "no-2009",
          "grid": "autoplace"
        },
        "stage": 3,
        "features": {
          "custom-properties": false
        }
      }
    ]
  ]
}
```

</details>

CSS variables are not compiled because it is [not possible to safely do so](https://github.com/MadLittleMods/postcss-css-variables#caveats).
If you must use variables, consider using something like [Sass variables](https://sass-lang.com/documentation/variables) which are compiled away by [Sass](https://sass-lang.com/).

## Customizing Target Browsers

Next.js allows you to configure the target browsers (for [Autoprefixer](https://github.com/postcss/autoprefixer) and compiled css features) through [Browserslist](https://github.com/browserslist/browserslist).

To customize browserslist, create a `browserslist` key in your `package.json` like so:

```json
// Archivo: package.json
{
  "browserslist": [">0.3%", "not dead", "not op_mini all"]
}
```

You can use the [browsersl.ist](https://browsersl.ist/?q=%3E0.3%25%2C+not+ie+11%2C+not+dead%2C+not+op_mini+all) tool to visualize what browsers you are targeting.

## CSS Modules

No configuration is needed to support CSS Modules. To enable CSS Modules for a file, rename the file to have the extension `.module.css`.

You can learn more about [Next.js' CSS Module support here](/docs/app/getting-started/css).

## Customizing Plugins

> **Warning**: When you define a custom PostCSS configuration file, Next.js **completely disables** the [default behavior](#default-behavior).
> Be sure to manually configure all the features you need compiled, including [Autoprefixer](https://github.com/postcss/autoprefixer).
> You also need to install any plugins included in your custom configuration manually, i.e. `npm install postcss-flexbugs-fixes postcss-preset-env`.

To customize the PostCSS configuration, create a `postcss.config.json` file in the root of your project.

This is the default configuration used by Next.js:

```json
// Archivo: postcss.config.json
{
  "plugins": [
    "postcss-flexbugs-fixes",
    [
      "postcss-preset-env",
      {
        "autoprefixer": {
          "flexbox": "no-2009"
        },
        "stage": 3,
        "features": {
          "custom-properties": false
        }
      }
    ]
  ]
}
```

> **Good to know**: Next.js also allows the file to be named `.postcssrc.json`, or, to be read from the `postcss` key in `package.json`.

It is also possible to configure PostCSS with a `postcss.config.js` file, which is useful when you want to conditionally include plugins based on environment:

```js
// Archivo: postcss.config.js
module.exports = {
  plugins:
    process.env.NODE_ENV === 'production'
      ? [
          'postcss-flexbugs-fixes',
          [
            'postcss-preset-env',
            {
              autoprefixer: {
                flexbox: 'no-2009',
              },
              stage: 3,
              features: {
                'custom-properties': false,
              },
            },
          ],
        ]
      : [
          // No transformations in development
        ],
}
```

> **Good to know**: Next.js also allows the file to be named `.postcssrc.js`.

Do **not use `require()`** to import the PostCSS Plugins. Plugins must be provided as strings.

> **Good to know**: If your `postcss.config.js` needs to support other non-Next.js tools in the same project, you must use the interoperable object-based format instead:
>
> ```js
> module.exports = {
>   plugins: {
>     'postcss-flexbugs-fixes': {},
>     'postcss-preset-env': {
>       autoprefixer: {
>         flexbox: 'no-2009',
>       },
>       stage: 3,
>       features: {
>         'custom-properties': false,
>       },
>     },
>   },
> }
> ```


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-preview-content-with-preview-mode-in-nextjs"></a>

## How to preview content with Preview Mode in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/preview-mode](https://nextjs.org/docs/pages/guides/preview-mode)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Next.js has the preview mode for statically generated pages. You can learn how it works here.*  

---

> **Note**: This feature is superseded by [Draft Mode](/docs/pages/guides/draft-mode).

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

</details>

In the [Pages documentation](/docs/pages/building-your-application/routing/pages-and-layouts) and the [Data Fetching documentation](/docs/pages/building-your-application/data-fetching), we talked about how to prerender a page at build time (**Static Generation**) using `getStaticProps` and `getStaticPaths`.

Static Generation is useful when your pages fetch data from a headless CMS. However, it’s not ideal when you’re writing a draft on your headless CMS and want to **preview** the draft immediately on your page. You’d want Next.js to render these pages at **request time** instead of build time and fetch the draft content instead of the published content. You’d want Next.js to bypass Static Generation only for this specific case.

Next.js has a feature called **Preview Mode** which solves this problem. Here are instructions on how to use it.

## Step 1: Create and access a preview API route

> Take a look at the [API Routes documentation](/docs/pages/building-your-application/routing/api-routes) first if you’re not familiar with Next.js API Routes.

First, create a **preview API route**. It can have any name - e.g. `pages/api/preview.js` (or `.ts` if using TypeScript).

In this API route, you need to call `setPreviewData` on the response object. The argument for `setPreviewData` should be an object, and this can be used by `getStaticProps` (more on this later). For now, we’ll use `{}`.

```js
export default function handler(req, res) {
  // ...
  res.setPreviewData({})
  // ...
}
```

`res.setPreviewData` sets some **cookies** on the browser which turns on the preview mode. Any requests to Next.js containing these cookies will be considered as the **preview mode**, and the behavior for statically generated pages will change (more on this later).

You can test this manually by creating an API route like below and accessing it from your browser manually:

```js
// Archivo: pages/api/preview.js
// simple example for testing it manually from your browser.
export default function handler(req, res) {
  res.setPreviewData({})
  res.end('Preview mode enabled')
}
```

If you open your browser’s developer tools and visit `/api/preview`, you’ll notice that the `__prerender_bypass` and `__next_preview_data` cookies will be set on this request.

### Securely accessing it from your Headless CMS

In practice, you’d want to call this API route _securely_ from your headless CMS. The specific steps will vary depending on which headless CMS you’re using, but here are some common steps you could take.

These steps assume that the headless CMS you’re using supports setting **custom preview URLs**. If it doesn’t, you can still use this method to secure your preview URLs, but you’ll need to construct and access the preview URL manually.

**First**, you should create a **secret token string** using a token generator of your choice. This secret will only be known by your Next.js app and your headless CMS. This secret prevents people who don’t have access to your CMS from accessing preview URLs.

**Second**, if your headless CMS supports setting custom preview URLs, specify the following as the preview URL. This assumes that your preview API route is located at `pages/api/preview.js`.

```bash
// Archivo: Terminal
https://<your-site>/api/preview?secret=<token>&slug=<path>
```

- `<your-site>` should be your deployment domain.
- `<token>` should be replaced with the secret token you generated.
- `<path>` should be the path for the page that you want to preview. If you want to preview `/posts/foo`, then you should use `&slug=/posts/foo`.

Your headless CMS might allow you to include a variable in the preview URL so that `<path>` can be set dynamically based on the CMS’s data like so: `&slug=/posts/{entry.fields.slug}`

**Finally**, in the preview API route:

- Check that the secret matches and that the `slug` parameter exists (if not, the request should fail).
-
- Call `res.setPreviewData`.
- Then redirect the browser to the path specified by `slug`. (The following example uses a [307 redirect](https://developer.mozilla.org/docs/Web/HTTP/Status/307)).

```js
export default async (req, res) => {
  // Check the secret and next parameters
  // This secret should only be known to this API route and the CMS
  if (req.query.secret !== 'MY_SECRET_TOKEN' || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  // Fetch the headless CMS to check if the provided `slug` exists
  // getPostBySlug would implement the required fetching logic to the headless CMS
  const post = await getPostBySlug(req.query.slug)

  // If the slug doesn't exist prevent preview mode from being enabled
  if (!post) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  // Enable Preview Mode by setting the cookies
  res.setPreviewData({})

  // Redirect to the path from the fetched post
  // We don't redirect to req.query.slug as that might lead to open redirect vulnerabilities
  res.redirect(post.slug)
}
```

If it succeeds, then the browser will be redirected to the path you want to preview with the preview mode cookies being set.

## Step 2: Update `getStaticProps`

The next step is to update `getStaticProps` to support the preview mode.

If you request a page which has `getStaticProps` with the preview mode cookies set (via `res.setPreviewData`), then `getStaticProps` will be called at **request time** (instead of at build time).

Furthermore, it will be called with a `context` object where:

- `context.preview` will be `true`.
- `context.previewData` will be the same as the argument used for `setPreviewData`.

```js
export async function getStaticProps(context) {
  // If you request this page with the preview mode cookies set:
  //
  // - context.preview will be true
  // - context.previewData will be the same as
  //   the argument used for `setPreviewData`.
}
```

We used `res.setPreviewData({})` in the preview API route, so `context.previewData` will be `{}`. You can use this to pass session information from the preview API route to `getStaticProps` if necessary.

If you’re also using `getStaticPaths`, then `context.params` will also be available.

### Fetch preview data

You can update `getStaticProps` to fetch different data based on `context.preview` and/or `context.previewData`.

For example, your headless CMS might have a different API endpoint for draft posts. If so, you can use `context.preview` to modify the API endpoint URL like below:

```js
export async function getStaticProps(context) {
  // If context.preview is true, append "/preview" to the API endpoint
  // to request draft data instead of published data. This will vary
  // based on which headless CMS you're using.
  const res = await fetch(`https://.../${context.preview ? 'preview' : ''}`)
  // ...
}
```

That’s it! If you access the preview API route (with `secret` and `slug`) from your headless CMS or manually, you should now be able to see the preview content. And if you update your draft without publishing, you should be able to preview the draft.

Set this as the preview URL on your headless CMS or access manually, and you should be able to see the preview.

```bash
// Archivo: Terminal
https://<your-site>/api/preview?secret=<token>&slug=<path>
```

## More Details

> **Good to know**: during rendering `next/router` exposes an `isPreview` flag, see the [router object docs](/docs/pages/api-reference/functions/use-router#router-object) for more info.

### Specify the Preview Mode duration

`setPreviewData` takes an optional second parameter which should be an options object. It accepts the following keys:

- `maxAge`: Specifies the number (in seconds) for the preview session to last for.
- `path`: Specifies the path the cookie should be applied under. Defaults to `/` enabling preview mode for all paths.

```js
setPreviewData(data, {
  maxAge: 60 * 60, // The preview mode cookies expire in 1 hour
  path: '/about', // The preview mode cookies apply to paths with /about
})
```

### Clear the Preview Mode cookies

By default, no expiration date is set for Preview Mode cookies, so the preview session ends when the browser is closed.

To clear the Preview Mode cookies manually, create an API route that calls `clearPreviewData()`:

```js
// Archivo: pages/api/clear-preview-mode-cookies.js
export default function handler(req, res) {
  res.clearPreviewData({})
}
```

Then, send a request to `/api/clear-preview-mode-cookies` to invoke the API Route. If calling this route using [`next/link`](/docs/pages/api-reference/components/link), you must pass `prefetch={false}` to prevent calling `clearPreviewData` during link prefetching.

If a path was specified in the `setPreviewData` call, you must pass the same path to `clearPreviewData`:

```js
// Archivo: pages/api/clear-preview-mode-cookies.js
export default function handler(req, res) {
  const { path } = req.query

  res.clearPreviewData({ path })
}
```

### `previewData` size limits

You can pass an object to `setPreviewData` and have it be available in `getStaticProps`. However, because the data will be stored in a cookie, there’s a size limitation. Currently, preview data is limited to 2KB.

### Works with `getServerSideProps`

The preview mode works on `getServerSideProps` as well. It will also be available on the `context` object containing `preview` and `previewData`.

> **Good to know**: You shouldn't set the `Cache-Control` header when using Preview Mode because it cannot be bypassed. Instead, we recommend using [ISR](/docs/pages/guides/incremental-static-regeneration).

### Works with API Routes

API Routes will have access to `preview` and `previewData` under the request object. For example:

```js
export default function myApiRoute(req, res) {
  const isPreview = req.preview
  const previewData = req.previewData
  // ...
}
```

### Unique per `next build`

Both the bypass cookie value and the private key for encrypting the `previewData` change when `next build` is completed.
This ensures that the bypass cookie can’t be guessed.

> **Good to know**: To test Preview Mode locally over HTTP your browser will need to allow third-party cookies and local storage access.


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-optimize-your-nextjs-application-for-production"></a>

## How to optimize your Next.js application for production

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/production-checklist](https://nextjs.org/docs/pages/guides/production-checklist)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Recommendations to ensure the best performance and user experience before taking your Next.js application to production.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-handle-redirects-in-nextjs"></a>

## How to handle redirects in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/redirecting](https://nextjs.org/docs/pages/guides/redirecting)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn the different ways to handle redirects in Next.js.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-use-sass-in-nextjs"></a>

## How to use Sass in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/sass](https://nextjs.org/docs/pages/guides/sass)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to use Sass in your Next.js application.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-load-and-optimize-scripts"></a>

## How to load and optimize scripts

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/scripts](https://nextjs.org/docs/pages/guides/scripts)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Optimize 3rd party scripts with the built-in Script component.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-self-host-your-nextjs-application"></a>

## How to self-host your Next.js application

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/self-hosting](https://nextjs.org/docs/pages/guides/self-hosting)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to self-host your Next.js application on a Node.js server, Docker image, or static HTML files (static exports).*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-create-a-static-export-of-your-nextjs-application"></a>

## How to create a static export of your Next.js application

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/static-exports](https://nextjs.org/docs/pages/guides/static-exports)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Next.js enables starting as a static site or Single-Page Application (SPA), then later optionally upgrading to use features that require a server.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="tailwind-css"></a>

## Tailwind CSS

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/tailwind-v3-css](https://nextjs.org/docs/pages/guides/tailwind-v3-css)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Style your Next.js Application using Tailwind CSS.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-cypress-with-nextjs"></a>

## How to set up Cypress with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/testing/cypress](https://nextjs.org/docs/pages/guides/testing/cypress)  
> 📂 **Sección:** Pages > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Next.js with Cypress for End-to-End (E2E) and Component Testing.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="testing"></a>

## Testing

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/testing](https://nextjs.org/docs/pages/guides/testing)  
> 📂 **Sección:** Pages > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Next.js with three commonly used testing tools — Cypress, Playwright, Vitest, and Jest.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-jest-with-nextjs"></a>

## How to set up Jest with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/testing/jest](https://nextjs.org/docs/pages/guides/testing/jest)  
> 📂 **Sección:** Pages > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Next.js with Jest for Unit Testing.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-playwright-with-nextjs"></a>

## How to set up Playwright with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/testing/playwright](https://nextjs.org/docs/pages/guides/testing/playwright)  
> 📂 **Sección:** Pages > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Next.js with Playwright for End-to-End (E2E) and Integration testing.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-up-vitest-with-nextjs"></a>

## How to set up Vitest with Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/testing/vitest](https://nextjs.org/docs/pages/guides/testing/vitest)  
> 📂 **Sección:** Pages > Guides > Testing  
> 📝 **Descripción:** *Learn how to set up Next.js with Vitest and React Testing Library - two popular unit testing libraries.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-optimize-third-party-libraries"></a>

## How to optimize third-party libraries

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/third-party-libraries](https://nextjs.org/docs/pages/guides/third-party-libraries)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Optimize the performance of third-party libraries in your application with the `@next/third-parties` package.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="codemods"></a>

## Codemods

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/upgrading/codemods](https://nextjs.org/docs/pages/guides/upgrading/codemods)  
> 📂 **Sección:** Pages > Guides > Upgrading  
> 📝 **Descripción:** *Use codemods to upgrade your Next.js codebase when new features are released.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="upgrading"></a>

## Upgrading

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/upgrading](https://nextjs.org/docs/pages/guides/upgrading)  
> 📂 **Sección:** Pages > Guides > Upgrading  
> 📝 **Descripción:** *Learn how to upgrade to the latest versions of Next.js.*  

---

Learn how to upgrade to the latest versions of Next.js following the versions-specific guides:


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-upgrade-to-version-10"></a>

## How to upgrade to version 10

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/upgrading/version-10](https://nextjs.org/docs/pages/guides/upgrading/version-10)  
> 📂 **Sección:** Pages > Guides > Upgrading  
> 📝 **Descripción:** *Upgrade your Next.js Application from Version 9 to Version 10.*  

---

There were no breaking changes between versions 9 and 10.

To upgrade to version 10, run the following command:

```bash
// Archivo: Terminal
npm i next@10
```

```bash
// Archivo: Terminal
yarn add next@10
```

```bash
// Archivo: Terminal
pnpm up next@10
```

```bash
// Archivo: Terminal
bun add next@10
```

> **Good to know:** If you are using TypeScript, ensure you also upgrade `@types/react` and `@types/react-dom` to their corresponding versions.


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-upgrade-to-version-11"></a>

## How to upgrade to version 11

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/upgrading/version-11](https://nextjs.org/docs/pages/guides/upgrading/version-11)  
> 📂 **Sección:** Pages > Guides > Upgrading  
> 📝 **Descripción:** *Upgrade your Next.js Application from Version 10 to Version 11.*  

---

To upgrade to version 11, run the following command:

```bash
// Archivo: Terminal
npm i next@11 react@17 react-dom@17
```

```bash
// Archivo: Terminal
yarn add next@11 react@17 react-dom@17
```

```bash
// Archivo: Terminal
pnpm up next@11 react@17 react-dom@17
```

```bash
// Archivo: Terminal
bun add next@11 react@17 react-dom@17
```

> **Good to know:** If you are using TypeScript, ensure you also upgrade `@types/react` and `@types/react-dom` to their corresponding versions.

### Webpack 5

Webpack 5 is now the default for all Next.js applications. If you did not have a custom webpack configuration, your application is already using webpack 5. If you do have a custom webpack configuration, you can refer to the [Next.js webpack 5 documentation](/docs/messages/webpack5) for upgrade guidance.

### Cleaning the `distDir` is now a default

The build output directory (defaults to `.next`) is now cleared by default except for the Next.js caches. You can refer to [the cleaning `distDir` RFC](https://github.com/vercel/next.js/discussions/6009) for more information.

If your application was relying on this behavior previously you can disable the new default behavior by adding the `cleanDistDir: false` flag in `next.config.js`.

### `PORT` is now supported for `next dev` and `next start`

Next.js 11 supports the `PORT` environment variable to set the port the application runs on. Using `-p`/`--port` is still recommended but if you were prohibited from using `-p` in any way you can now use `PORT` as an alternative:

Example:

```
PORT=4000 next start
```

### `next.config.js` customization to import images

Next.js 11 supports static image imports with `next/image`. This new feature relies on being able to process image imports. If you previously added the `next-images` or `next-optimized-images` packages you can either move to the new built-in support using `next/image` or disable the feature:

```js
// Archivo: next.config.js
module.exports = {
  images: {
    disableStaticImages: true,
  },
}
```

### Remove `super.componentDidCatch()` from `pages/_app.js`

The `next/app` component's `componentDidCatch` was deprecated in Next.js 9 as it's no longer needed and has since been a no-op. In Next.js 11, it was removed.

If your `pages/_app.js` has a custom `componentDidCatch` method you can remove `super.componentDidCatch` as it is no longer needed.

### Remove `Container` from `pages/_app.js`

This export was deprecated in Next.js 9 as it's no longer needed and has since been a no-op with a warning during development. In Next.js 11 it was removed.

If your `pages/_app.js` imports `Container` from `next/app` you can remove `Container` as it was removed. Learn more in [the documentation](/docs/messages/app-container-deprecated).

### Remove `props.url` usage from page components

This property was deprecated in Next.js 4 and has since shown a warning during development. With the introduction of `getStaticProps` / `getServerSideProps` these methods already disallowed the usage of `props.url`. In Next.js 11, it was removed completely.

You can learn more in [the documentation](/docs/messages/url-deprecated).

### Remove `unsized` property on `next/image`

The `unsized` property on `next/image` was deprecated in Next.js 10.0.1. You can use `layout="fill"` instead. In Next.js 11 `unsized` was removed.

### Remove `modules` property on `next/dynamic`

The `modules` and `render` option for `next/dynamic` were deprecated in Next.js 9.5. This was done in order to make the `next/dynamic` API closer to `React.lazy`. In Next.js 11, the `modules` and `render` options were removed.

This option hasn't been mentioned in the documentation since Next.js 8 so it's less likely that your application is using it.

If your application does use `modules` and `render` you can refer to [the documentation](/docs/messages/next-dynamic-modules).

### Remove `Head.rewind`

`Head.rewind` has been a no-op since Next.js 9.5, in Next.js 11 it was removed. You can safely remove your usage of `Head.rewind`.

### Moment.js locales excluded by default

Moment.js includes translations for a lot of locales by default. Next.js now automatically excludes these locales by default to optimize bundle size for applications using Moment.js.

To load a specific locale use this snippet:

```js
import moment from 'moment'
import 'moment/locale/ja'

moment.locale('ja')
```

You can opt-out of this new default by adding `excludeDefaultMomentLocales: false` to `next.config.js` if you do not want the new behavior, do note it's highly recommended to not disable this new optimization as it significantly reduces the size of Moment.js.

### Update usage of `router.events`

In case you're accessing `router.events` during rendering, in Next.js 11 `router.events` is no longer provided during prerendering. Ensure you're accessing `router.events` in `useEffect`:

```js
useEffect(() => {
  const handleRouteChange = (url, { shallow }) => {
    console.log(
      `App is changing to ${url} ${
        shallow ? 'with' : 'without'
      } shallow routing`
    )
  }

  router.events.on('routeChangeStart', handleRouteChange)

  // If the component is unmounted, unsubscribe
  // from the event with the `off` method:
  return () => {
    router.events.off('routeChangeStart', handleRouteChange)
  }
}, [router])
```

If your application uses `router.router.events` which was an internal property that was not public please make sure to use `router.events` as well.

## React 16 to 17

React 17 introduced a new [JSX Transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html) that brings a long-time Next.js feature to the wider React ecosystem: Not having to `import React from 'react'` when using JSX. When using React 17 Next.js will automatically use the new transform. This transform does not make the `React` variable global, which was an unintended side-effect of the previous Next.js implementation. A [codemod is available](/docs/pages/guides/upgrading/codemods#add-missing-react-import) to automatically fix cases where you accidentally used `React` without importing it.

Most applications already use the latest version of React, with Next.js 11 the minimum React version has been updated to 17.0.2.

To upgrade you can run the following command:

```
npm install react@latest react-dom@latest
```

Or using `yarn`:

```
yarn add react@latest react-dom@latest
```


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-upgrade-to-version-12"></a>

## How to upgrade to version 12

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/upgrading/version-12](https://nextjs.org/docs/pages/guides/upgrading/version-12)  
> 📂 **Sección:** Pages > Guides > Upgrading  
> 📝 **Descripción:** *Upgrade your Next.js Application from Version 11 to Version 12.*  

---

To upgrade to version 12, run the following command:

```bash
// Archivo: Terminal
npm i next@12 react@17 react-dom@17 eslint-config-next@12
```

```bash
// Archivo: Terminal
yarn add next@12 react@17 react-dom@17 eslint-config-next@12
```

```bash
// Archivo: Terminal
pnpm up next@12 react@17 react-dom@17 eslint-config-next@12
```

```bash
// Archivo: Terminal
bun add next@12 react@17 react-dom@17 eslint-config-next@12
```

> **Good to know:** If you are using TypeScript, ensure you also upgrade `@types/react` and `@types/react-dom` to their corresponding versions.

### Upgrading to 12.2

[Middleware](/docs/messages/middleware-upgrade-guide) - If you were using Middleware prior to `12.2`, please see the [upgrade guide](/docs/messages/middleware-upgrade-guide) for more information.

### Upgrading to 12.0

[Minimum Node.js Version](https://nodejs.org/en/) - The minimum Node.js version has been bumped from `12.0.0` to `12.22.0` which is the first version of Node.js with native ES Modules support.

[Minimum React Version](https://react.dev/learn/add-react-to-an-existing-project) - The minimum required React version is `17.0.2`. To upgrade you can run the following command in the terminal:

```bash
// Archivo: Terminal
npm install react@latest react-dom@latest

yarn add react@latest react-dom@latest

pnpm update react@latest react-dom@latest

bun add react@latest react-dom@latest
```

#### SWC replacing Babel

Next.js now uses the Rust-based compiler [SWC](https://swc.rs/) to compile JavaScript/TypeScript. This new compiler is up to 17x faster than Babel when compiling individual files and up to 5x faster Fast Refresh.

Next.js provides full backward compatibility with applications that have [custom Babel configuration](/docs/pages/guides/babel). All transformations that Next.js handles by default like styled-jsx and tree-shaking of `getStaticProps` / `getStaticPaths` / `getServerSideProps` have been ported to Rust.

When an application has a custom Babel configuration, Next.js will automatically opt-out of using SWC for compiling JavaScript/TypeScript and will fall back to using Babel in the same way that it was used in Next.js 11.

Many of the integrations with external libraries that currently require custom Babel transformations will be ported to Rust-based SWC transforms in the near future. These include but are not limited to:

- Styled Components
- Emotion
- Relay

In order to prioritize transforms that will help you adopt SWC, please provide your `.babelrc` on [this feedback thread](https://github.com/vercel/next.js/discussions/30174).

#### SWC replacing Terser for minification

You can opt-in to replacing Terser with SWC for minifying JavaScript up to 7x faster using a flag in `next.config.js`:

```js
// Archivo: next.config.js
module.exports = {
  swcMinify: true,
}
```

Minification using SWC is an opt-in flag to ensure it can be tested against more real-world Next.js applications before it becomes the default in Next.js 12.1. If you have feedback about minification, please leave it on [this feedback thread](https://github.com/vercel/next.js/discussions/30237).

#### Improvements to styled-jsx CSS parsing

On top of the Rust-based compiler we've implemented a new CSS parser based on the one used for the styled-jsx Babel transform. This new parser has improved handling of CSS and now errors when invalid CSS is used that would previously slip through and cause unexpected behavior.

Because of this change invalid CSS will throw an error during development and `next build`. This change only affects styled-jsx usage.

#### `next/image` changed wrapping element

`next/image` now renders the `<img>` inside a `<span>` instead of `<div>`.

If your application has specific CSS targeting span such as `.container span`, upgrading to Next.js 12 might incorrectly match the wrapping element inside the `<Image>` component. You can avoid this by restricting the selector to a specific class such as `.container span.item` and updating the relevant component with that className, such as `<span className="item" />`.

If your application has specific CSS targeting the `next/image` `<div>` tag, for example `.container div`, it may not match anymore. You can update the selector `.container span`, or preferably, add a new `<div className="wrapper">` wrapping the `<Image>` component and target that instead such as `.container .wrapper`.

The `className` prop is unchanged and will still be passed to the underlying `<img>` element.

See the [documentation](/docs/pages/api-reference/components/image#styling-images) for more info.

#### HMR connection now uses a WebSocket

Previously, Next.js used a [server-sent events](https://developer.mozilla.org/docs/Web/API/Server-sent_events) connection to receive HMR events. Next.js 12 now uses a WebSocket connection.

In some cases when proxying requests to the Next.js dev server, you will need to ensure the upgrade request is handled correctly. For example, in `nginx` you would need to add the following configuration:

```nginx
location /_next/webpack-hmr {
    proxy_pass http://localhost:3000/_next/webpack-hmr;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
}
```

If you are using Apache (2.x), you can add the following configuration to enable web sockets to the server. Review the port, host name and server names.

```
<VirtualHost *:443>
 # ServerName yourwebsite.local
 ServerName "${WEBSITE_SERVER_NAME}"
 ProxyPass / http://localhost:3000/
 ProxyPassReverse / http://localhost:3000/
 # Next.js 12 uses websocket
 <Location /_next/webpack-hmr>
    RewriteEngine On
    RewriteCond %{QUERY_STRING} transport=websocket [NC]
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule /(.*) ws://localhost:3000/_next/webpack-hmr/$1 [P,L]
    ProxyPass ws://localhost:3000/_next/webpack-hmr retry=0 timeout=30
    ProxyPassReverse ws://localhost:3000/_next/webpack-hmr
 </Location>
</VirtualHost>
```

For custom servers, such as `express`, you may need to use `app.all` to ensure the request is passed correctly, for example:

```js
app.all('/_next/webpack-hmr', (req, res) => {
  nextjsRequestHandler(req, res)
})
```

> **Note:** In Next.js 16, the HMR WebSocket path was renamed from `/_next/webpack-hmr` to `/_next/hmr`.

#### Webpack 4 support has been removed

If you are already using webpack 5 you can skip this section.

Next.js has adopted webpack 5 as the default for compilation in Next.js 11. As communicated in the [webpack 5 upgrading documentation](/docs/messages/webpack5) Next.js 12 removes support for webpack 4.

If your application is still using webpack 4 using the opt-out flag, you will now see an error linking to the [webpack 5 upgrading documentation](/docs/messages/webpack5).

#### `target` option deprecated

If you do not have `target` in `next.config.js` you can skip this section.

The target option has been deprecated in favor of built-in support for tracing what dependencies are needed to run a page.

During `next build`, Next.js will automatically trace each page and its dependencies to determine all of the files that are needed for deploying a production version of your application.

If you are currently using the `target` option set to `serverless`, please read the [documentation on how to leverage the new output](/docs/pages/api-reference/config/next-config-js/output).


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-upgrade-to-version-13"></a>

## How to upgrade to version 13

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/upgrading/version-13](https://nextjs.org/docs/pages/guides/upgrading/version-13)  
> 📂 **Sección:** Pages > Guides > Upgrading  
> 📝 **Descripción:** *Upgrade your Next.js Application from Version 12 to 13.*  

---

## Upgrading from 12 to 13

To update to Next.js version 13, run the following command using your preferred package manager:

```bash
// Archivo: Terminal
npm i next@13 react@latest react-dom@latest eslint-config-next@13
```

```bash
// Archivo: Terminal
yarn add next@13 react@latest react-dom@latest eslint-config-next@13
```

```bash
// Archivo: Terminal
pnpm i next@13 react@latest react-dom@latest eslint-config-next@13
```

```bash
// Archivo: Terminal
bun add next@13 react@latest react-dom@latest eslint-config-next@13
```

> **Good to know:** If you are using TypeScript, ensure you also upgrade `@types/react` and `@types/react-dom` to their latest versions.

### v13 Summary

- The [Supported Browsers](/docs/architecture/supported-browsers) have been changed to drop Internet Explorer and target modern browsers.
- The minimum Node.js version has been bumped from 12.22.0 to 16.14.0, since 12.x and 14.x have reached end-of-life.
- The minimum React version has been bumped from 17.0.2 to 18.2.0.
- The `swcMinify` configuration property was changed from `false` to `true`. See [Next.js Compiler](/docs/architecture/nextjs-compiler) for more info.
- The `next/image` import was renamed to `next/legacy/image`. The `next/future/image` import was renamed to `next/image`. A [codemod is available](/docs/pages/guides/upgrading/codemods#next-image-to-legacy-image) to safely and automatically rename your imports.
- The `next/link` child can no longer be `<a>`. Add the `legacyBehavior` prop to use the legacy behavior or remove the `<a>` to upgrade. A [codemod is available](/docs/pages/guides/upgrading/codemods#new-link) to automatically upgrade your code.
- The `target` configuration property has been removed and superseded by [Output File Tracing](/docs/pages/api-reference/config/next-config-js/output).

## Migrating shared features

Next.js 13 introduces a new [`app` directory](/docs/app) with new features and conventions. However, upgrading to Next.js 13 does **not** require using the new `app` Router.

You can continue using `pages` with new features that work in both directories, such as the updated [Image component](#image-component), [Link component](#link-component), [Script component](#script-component), and [Font optimization](#font-optimization).

### `<Image/>` Component

Next.js 12 introduced many improvements to the Image Component with a temporary import: `next/future/image`. These improvements included less client-side JavaScript, easier ways to extend and style images, better accessibility, and native browser lazy loading.

Starting in Next.js 13, this new behavior is now the default for `next/image`.

There are two codemods to help you migrate to the new Image Component:

- [next-image-to-legacy-image](/docs/pages/guides/upgrading/codemods#next-image-to-legacy-image): This codemod will safely and automatically rename `next/image` imports to `next/legacy/image` to maintain the same behavior as Next.js 12. We recommend running this codemod to quickly update to Next.js 13 automatically.
- [next-image-experimental](/docs/pages/guides/upgrading/codemods#next-image-experimental): After running the previous codemod, you can optionally run this experimental codemod to upgrade `next/legacy/image` to the new `next/image`, which will remove unused props and add inline styles. Please note this codemod is experimental and only covers static usage (such as `

![Illustration]()

`) but not dynamic usage (such as `

![Illustration]()

`).

Alternatively, you can manually update by following the [migration guide](/docs/pages/guides/upgrading/codemods#next-image-experimental) and also see the [legacy comparison](/docs/pages/api-reference/components/image-legacy#comparison).

### `<Link>` Component

The [`<Link>` Component](/docs/pages/api-reference/components/link) no longer requires manually adding an `<a>` tag as a child. This behavior was added as an experimental option in [version 12.2](https://nextjs.org/blog/next-12-2) and is now the default. In Next.js 13, `<Link>` always renders `<a>` and allows you to forward props to the underlying tag.

For example:

```jsx
import Link from 'next/link'

// Next.js 12: `<a>` has to be nested otherwise it's excluded
[
  <a>About</a>
](/about)

// Next.js 13: `<Link>` always renders `<a>` under the hood
[
  About
](/about)
```

To upgrade your links to Next.js 13, you can use the [`new-link` codemod](/docs/pages/guides/upgrading/codemods#new-link).

### `<Script>` Component

The behavior of [`next/script`](/docs/pages/api-reference/components/script) has been updated to support both `pages` and `app`. If incrementally adopting `app`, read the [upgrade guide](/docs/pages/guides/upgrading).

### Font Optimization

Previously, Next.js helped you optimize fonts by inlining font CSS. Version 13 introduces the new [`next/font`](/docs/pages/api-reference/components/font) module which gives you the ability to customize your font loading experience while still ensuring great performance and privacy.

See [Optimizing Fonts](/docs/pages/api-reference/components/font) to learn how to use `next/font`.


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-upgrade-to-version-14"></a>

## How to upgrade to version 14

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/upgrading/version-14](https://nextjs.org/docs/pages/guides/upgrading/version-14)  
> 📂 **Sección:** Pages > Guides > Upgrading  
> 📝 **Descripción:** *Upgrade your Next.js Application from Version 13 to 14.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-upgrade-to-version-9"></a>

## How to upgrade to version 9

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/upgrading/version-9](https://nextjs.org/docs/pages/guides/upgrading/version-9)  
> 📂 **Sección:** Pages > Guides > Upgrading  
> 📝 **Descripción:** *Upgrade your Next.js Application from Version 8 to Version 9.*  

---

To upgrade to version 9, run the following command:

```bash
// Archivo: Terminal
npm i next@9
```

```bash
// Archivo: Terminal
yarn add next@9
```

```bash
// Archivo: Terminal
pnpm up next@9
```

```bash
// Archivo: Terminal
bun add next@9
```

> **Good to know:** If you are using TypeScript, ensure you also upgrade `@types/react` and `@types/react-dom` to their corresponding versions.

## Check your Custom App File (`pages/_app.js`)

If you previously copied the [Custom `<App>`](/docs/pages/building-your-application/routing/custom-app) example, you may be able to remove your `getInitialProps`.

Removing `getInitialProps` from `pages/_app.js` (when possible) is important to leverage new Next.js features!

The following `getInitialProps` does nothing and may be removed:

```js
class MyApp extends App {
  // Remove me, I do nothing!
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  render() {
    // ... etc
  }
}
```

## Breaking Changes

### `@zeit/next-typescript` is no longer necessary

Next.js will now ignore usage `@zeit/next-typescript` and warn you to remove it. Please remove this plugin from your `next.config.js`.

Remove references to `@zeit/next-typescript/babel` from your custom `.babelrc` (if present).

The usage of [`fork-ts-checker-webpack-plugin`](https://github.com/Realytics/fork-ts-checker-webpack-plugin/issues) should also be removed from your `next.config.js`.

TypeScript Definitions are published with the `next` package, so you need to uninstall `@types/next` as they would conflict.

The following types are different:

> This list was created by the community to help you upgrade, if you find other differences please send a pull-request to this list to help other users.

From:

```tsx
import { NextContext } from 'next'
import { NextAppContext, DefaultAppIProps } from 'next/app'
import { NextDocumentContext, DefaultDocumentIProps } from 'next/document'
```

to

```tsx
import { NextPageContext } from 'next'
import { AppContext, AppInitialProps } from 'next/app'
import { DocumentContext, DocumentInitialProps } from 'next/document'
```

### The `config` key is now an export on a page

You may no longer export a custom variable named `config` from a page (i.e. `export { config }` / `export const config ...`).
This exported variable is now used to specify page-level Next.js configuration like Opt-in AMP and API Route features.

You must rename a non-Next.js-purposed `config` export to something different.

### `next/dynamic` no longer renders "loading..." by default while loading

Dynamic components will not render anything by default while loading. You can still customize this behavior by setting the `loading` property:

```jsx
import dynamic from 'next/dynamic'

const DynamicComponentWithCustomLoading = dynamic(
  () => import('../components/hello2'),
  {
    loading: () => <p>Loading</p>,
  }
)
```

### `withAmp` has been removed in favor of an exported configuration object

Next.js now has the concept of page-level configuration, so the `withAmp` higher-order component has been removed for consistency.

This change can be **automatically migrated by running the following commands in the root of your Next.js project:**

```bash
// Archivo: Terminal
curl -L https://github.com/vercel/next-codemod/archive/master.tar.gz | tar -xz --strip=2 next-codemod-master/transforms/withamp-to-config.js npx jscodeshift -t ./withamp-to-config.js pages/**/*.js
```

To perform this migration by hand, or view what the codemod will produce, see below:

**Before**

```jsx
import { withAmp } from 'next/amp'

function Home() {
  return <h1>My AMP Page</h1>
}

export default withAmp(Home)
// or
export default withAmp(Home, { hybrid: true })
```

**After**

```jsx
export default function Home() {
  return <h1>My AMP Page</h1>
}

export const config = {
  amp: true,
  // or
  amp: 'hybrid',
}
```

### `next export` no longer exports pages as `index.html`

Previously, exporting `pages/about.js` would result in `out/about/index.html`. This behavior has been changed to result in `out/about.html`.

You can revert to the previous behavior by creating a `next.config.js` with the following content:

```js
// Archivo: next.config.js
module.exports = {
  trailingSlash: true,
}
```

### `pages/api/` is treated differently

Pages in `pages/api/` are now considered [API Routes](https://nextjs.org/blog/next-9#api-routes).
Pages in this directory will no longer contain a client-side bundle.

## Deprecated Features

### `next/dynamic` has deprecated loading multiple modules at once

The ability to load multiple modules at once has been deprecated in `next/dynamic` to be closer to React's implementation (`React.lazy` and `Suspense`).

Updating code that relies on this behavior is relatively straightforward! We've provided an example of a before/after to help you migrate your application:

**Before**

```jsx
import dynamic from 'next/dynamic'

const HelloBundle = dynamic({
  modules: () => {
    const components = {
      Hello1: () => import('../components/hello1').then((m) => m.default),
      Hello2: () => import('../components/hello2').then((m) => m.default),
    }

    return components
  },
  render: (props, { Hello1, Hello2 }) => (
    <div>
      <h1>{props.title}</h1>
      <Hello1 />
      <Hello2 />
    </div>
  ),
})

function DynamicBundle() {
  return <HelloBundle title="Dynamic Bundle" />
}

export default DynamicBundle
```

**After**

```jsx
import dynamic from 'next/dynamic'

const Hello1 = dynamic(() => import('../components/hello1'))
const Hello2 = dynamic(() => import('../components/hello2'))

function HelloBundle({ title }) {
  return (
    <div>
      <h1>{title}</h1>
      <Hello1 />
      <Hello2 />
    </div>
  )
}

function DynamicBundle() {
  return <HelloBundle title="Dynamic Bundle" />
}

export default DynamicBundle
```


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

<a id="font-module"></a>

## Font Module

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/components/font](https://nextjs.org/docs/pages/api-reference/components/font)  
> 📂 **Sección:** Pages > Api Reference > Components  
> 📝 **Descripción:** *API Reference for the Font Module*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="form"></a>

## Form

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/components/form](https://nextjs.org/docs/pages/api-reference/components/form)  
> 📂 **Sección:** Pages > Api Reference > Components  
> 📝 **Descripción:** *Learn how to use the `<Form>` component to handle form submissions and search params updates with client-side navigation.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="head"></a>

## Head

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/components/head](https://nextjs.org/docs/pages/api-reference/components/head)  
> 📂 **Sección:** Pages > Api Reference > Components  
> 📝 **Descripción:** *Add custom elements to the `head` of your page with the built-in Head component.*  

---

We expose a built-in component for appending elements to the `head` of the page:

```jsx
import Head from 'next/head'

function IndexPage() {
  return (
    <div>
      <Head>
        <title>My page title</title>
      </Head>
      <p>Hello world!</p>
    </div>
  )
}

export default IndexPage
```

## Avoid duplicated tags

To avoid duplicate tags in your `head` you can use the `key` property, which will make sure the tag is only rendered once, as in the following example:

```jsx
import Head from 'next/head'

function IndexPage() {
  return (
    <div>
      <Head>
        <title>My page title</title>
        <meta property="og:title" content="My page title" key="title" />
      </Head>
      <Head>
        <meta property="og:title" content="My new title" key="title" />
      </Head>
      <p>Hello world!</p>
    </div>
  )
}

export default IndexPage
```

In this case only the second `<meta property="og:title" />` is rendered. `meta` tags with duplicate `key` attributes are automatically handled.

> **Good to know**: `<title>` and `<base>` tags are automatically checked for duplicates by Next.js, so using key is not necessary for these tags.

> The contents of `head` get cleared upon unmounting the component, so make sure each page completely defines what it needs in `head`, without making assumptions about what other pages added.

## Use minimal nesting

`title`, `meta` or any other elements (e.g. `script`) need to be contained as **direct** children of the `Head` element,
or wrapped into maximum one level of `<React.Fragment>` or arrays—otherwise the tags won't be correctly picked up on client-side navigations.

## Use `next/script` for scripts

We recommend using [`next/script`](/docs/pages/guides/scripts) in your component instead of manually creating a `<script>` in `next/head`.

## No `html` or `body` tags

You **cannot** use `<Head>` to set attributes on `<html>` or `<body>` tags. This will result in an `next-head-count is missing` error. `next/head` can only handle tags inside the HTML `<head>` tag.


[⬆ Subir al inicio del capítulo](#)

---

<a id="image-legacy"></a>

## Image (Legacy)

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/components/image-legacy](https://nextjs.org/docs/pages/api-reference/components/image-legacy)  
> 📂 **Sección:** Pages > Api Reference > Components  
> 📝 **Descripción:** *Backwards compatible Image Optimization with the Legacy Image component.*  

---

Starting with Next.js 13, the `next/image` component was rewritten to improve both the performance and developer experience. In order to provide a backwards compatible upgrade solution, the old `next/image` was renamed to `next/legacy/image`.

> **Warning**: `next/legacy/image` is deprecated and will be removed in a future version of Next.js. Please use [`next/image`](/docs/app/api-reference/components/image) instead.

## Comparison

Compared to `next/legacy/image`, the new `next/image` component has the following changes:

- Removes `<span>` wrapper around `<img>` in favor of [native computed aspect ratio](https://caniuse.com/mdn-html_elements_img_aspect_ratio_computed_from_attributes)
- Adds support for canonical `style` prop
  - Removes `layout` prop in favor of `style` or `className`
  - Removes `objectFit` prop in favor of `style` or `className`
  - Removes `objectPosition` prop in favor of `style` or `className`
- Removes `IntersectionObserver` implementation in favor of [native lazy loading](https://caniuse.com/loading-lazy-attr)
  - Removes `lazyBoundary` prop since there is no native equivalent
  - Removes `lazyRoot` prop since there is no native equivalent
- Removes `loader` config in favor of [`loader`](#loader) prop
- Changed `alt` prop from optional to required
- Changed `onLoadingComplete` callback to receive reference to `<img>` element

## Required Props

The `

![Illustration]()

` component requires the following properties.

### src

Must be one of the following:

- A [statically imported](/docs/pages/api-reference/components/image#src) image file
- A path string. This can be either an absolute external URL, or an internal path depending on the [loader](#loader) prop or [loader configuration](#loader-configuration).

When using the default [loader](#loader), also consider the following for source images:

- When src is an external URL, you must also configure [remotePatterns](#remote-patterns)
- When src is [animated](#animated-images) or not a known format (JPEG, PNG, WebP, AVIF, GIF, TIFF) the image will be served as-is
- When src is SVG format, it will be blocked unless `unoptimized` or `dangerouslyAllowSVG` is enabled

### width

The `width` property can represent either the _rendered_ width or _original_ width in pixels, depending on the [`layout`](#layout) and [`sizes`](#sizes) properties.

When using `layout="intrinsic"` or `layout="fixed"` the `width` property represents the _rendered_ width in pixels, so it will affect how large the image appears.

When using `layout="responsive"`, `layout="fill"`, the `width` property represents the _original_ width in pixels, so it will only affect the aspect ratio.

The `width` property is required, except for [statically imported images](/docs/pages/api-reference/components/image#src), or those with `layout="fill"`.

### height

The `height` property can represent either the _rendered_ height or _original_ height in pixels, depending on the [`layout`](#layout) and [`sizes`](#sizes) properties.

When using `layout="intrinsic"` or `layout="fixed"` the `height` property represents the _rendered_ height in pixels, so it will affect how large the image appears.

When using `layout="responsive"`, `layout="fill"`, the `height` property represents the _original_ height in pixels, so it will only affect the aspect ratio.

The `height` property is required, except for [statically imported images](/docs/pages/api-reference/components/image#src), or those with `layout="fill"`.

## Optional Props

The `

![Illustration]()

` component accepts a number of additional properties beyond those which are required. This section describes the most commonly-used properties of the Image component. Find details about more rarely-used properties in the [Advanced Props](#advanced-props) section.

### layout

The layout behavior of the image as the viewport changes size.

| `layout`              | Behavior                                                 | `srcSet`                                                                                                    | `sizes` | Has wrapper and sizer |
| --------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------- | --------------------- |
| `intrinsic` (default) | Scale _down_ to fit width of container, up to image size | `1x`, `2x` (based on [imageSizes](#image-sizes))                                                            | N/A     | yes                   |
| `fixed`               | Sized to `width` and `height` exactly                    | `1x`, `2x` (based on [imageSizes](#image-sizes))                                                            | N/A     | yes                   |
| `responsive`          | Scale to fit width of container                          | `640w`, `750w`, ... `2048w`, `3840w` (based on [imageSizes](#image-sizes) and [deviceSizes](#device-sizes)) | `100vw` | yes                   |
| `fill`                | Grow in both X and Y axes to fill container              | `640w`, `750w`, ... `2048w`, `3840w` (based on [imageSizes](#image-sizes) and [deviceSizes](#device-sizes)) | `100vw` | yes                   |

- [Demo the `intrinsic` layout (default)](https://image-legacy-component.nextjs.gallery/layout-intrinsic)
  - When `intrinsic`, the image will scale the dimensions down for smaller viewports, but maintain the original dimensions for larger viewports.
- [Demo the `fixed` layout](https://image-legacy-component.nextjs.gallery/layout-fixed)
  - When `fixed`, the image dimensions will not change as the viewport changes (no responsiveness) similar to the native `img` element.
- [Demo the `responsive` layout](https://image-legacy-component.nextjs.gallery/layout-responsive)
  - When `responsive`, the image will scale the dimensions down for smaller viewports and scale up for larger viewports.
  - Ensure the parent element uses `display: block` in their stylesheet.
- [Demo the `fill` layout](https://image-legacy-component.nextjs.gallery/layout-fill)
  - When `fill`, the image will stretch both width and height to the dimensions of the parent element, provided the parent element is relative.
  - This is usually paired with the [`objectFit`](#objectfit) property.
  - Ensure the parent element has `position: relative` in their stylesheet.
- [Demo background image](https://image-legacy-component.nextjs.gallery/background)

### loader

A custom function used to resolve URLs. Setting the loader as a prop on the Image component overrides the default loader defined in the [`images` section of `next.config.js`](#loader-configuration).

A `loader` is a function returning a URL string for the image, given the following parameters:

- [`src`](#src)
- [`width`](#width)
- [`quality`](#quality)

Here is an example of using a custom loader:

```js
import Image from 'next/legacy/image'

const myLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}

const MyImage = (props) => {
  return (
    

![Picture of the author](me.png)


  )
}
```

### sizes

A string that provides information about how wide the image will be at different breakpoints. The value of `sizes` will greatly affect performance for images using `layout="responsive"` or `layout="fill"`. It will be ignored for images using `layout="intrinsic"` or `layout="fixed"`.

The `sizes` property serves two important purposes related to image performance:

First, the value of `sizes` is used by the browser to determine which size of the image to download, from `next/legacy/image`'s automatically-generated source set. When the browser chooses, it does not yet know the size of the image on the page, so it selects an image that is the same size or larger than the viewport. The `sizes` property allows you to tell the browser that the image will actually be smaller than full screen. If you don't specify a `sizes` value, a default value of `100vw` (full screen width) is used.

Second, the `sizes` value is parsed and used to trim the values in the automatically-created source set. If the `sizes` property includes sizes such as `50vw`, which represent a percentage of the viewport width, then the source set is trimmed to not include any values which are too small to ever be necessary.

For example, if you know your styling will cause an image to be full-width on mobile devices, in a 2-column layout on tablets, and a 3-column layout on desktop displays, you should include a sizes property such as the following:

```js
import Image from 'next/legacy/image'
const Example = () => (
  <div className="grid-element">
    

![Illustration](https://nextjs.org/example.png)


  </div>
)
```

This example `sizes` could have a dramatic effect on performance metrics. Without the `33vw` sizes, the image selected from the server would be 3 times as wide as it needs to be. Because file size is proportional to the square of the width, without `sizes` the user would download an image that's 9 times larger than necessary.

Learn more about `srcset` and `sizes`:

- [web.dev](https://web.dev/learn/design/responsive-images/#sizes)
- [mdn](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-sizes)

### quality

The quality of the optimized image, an integer between `1` and `100` where `100` is the best quality. Defaults to `75`.

### priority

When true, the image will be considered high priority and
[preload](https://web.dev/preload-responsive-images/). Lazy loading is automatically disabled for images using `priority`.

You should use the `priority` property on any image detected as the [Largest Contentful Paint (LCP)](https://nextjs.org/learn/seo/web-performance/lcp) element. It may be appropriate to have multiple priority images, as different images may be the LCP element for different viewport sizes.

Should only be used when the image is visible above the fold. Defaults to `false`.

### placeholder

A placeholder to use while the image is loading. Possible values are `blur` or `empty`. Defaults to `empty`.

When `blur`, the [`blurDataURL`](#blurdataurl) property will be used as the placeholder. If `src` is an object from a [static import](/docs/pages/api-reference/components/image#src) and the imported image is `.jpg`, `.png`, `.webp`, or `.avif`, then `blurDataURL` will be automatically populated.

For dynamic images, you must provide the [`blurDataURL`](#blurdataurl) property. Solutions such as [Plaiceholder](https://github.com/joe-bell/plaiceholder) can help with `base64` generation.

When `empty`, there will be no placeholder while the image is loading, only empty space.

Try it out:

- [Demo the `blur` placeholder](https://image-legacy-component.nextjs.gallery/placeholder)
- [Demo the shimmer effect with `blurDataURL` prop](https://image-legacy-component.nextjs.gallery/shimmer)
- [Demo the color effect with `blurDataURL` prop](https://image-legacy-component.nextjs.gallery/color)

## Advanced Props

In some cases, you may need more advanced usage. The `

![Illustration]()

` component optionally accepts the following advanced properties.

### style

Allows [passing CSS styles](https://developer.mozilla.org/docs/Web/HTML/Element/style) to the underlying image element.

Note that all `layout` modes apply their own styles to the image element, and these automatic styles take precedence over the `style` prop.

Also keep in mind that the required `width` and `height` props can interact with your styling. If you use styling to modify an image's `width`, you must set the `height="auto"` style as well, or your image will be distorted.

### objectFit

Defines how the image will fit into its parent container when using `layout="fill"`.

This value is passed to the [object-fit CSS property](https://developer.mozilla.org/docs/Web/CSS/object-fit) for the `src` image.

### objectPosition

Defines how the image is positioned within its parent element when using `layout="fill"`.

This value is passed to the [object-position CSS property](https://developer.mozilla.org/docs/Web/CSS/object-position) applied to the image.

### onLoadingComplete

A callback function that is invoked once the image is completely loaded and the [placeholder](#placeholder) has been removed.

The `onLoadingComplete` function accepts one parameter, an object with the following properties:

- [`naturalWidth`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/naturalWidth)
- [`naturalHeight`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/naturalHeight)

### loading

The loading behavior of the image. Defaults to `lazy`.

When `lazy`, defer loading the image until it reaches a calculated distance from
the viewport.

When `eager`, load the image immediately.

[Learn more](https://developer.mozilla.org/docs/Web/HTML/Element/img#attr-loading)

### blurDataURL

A [Data URL](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) to
be used as a placeholder image before the `src` image successfully loads. Only takes effect when combined
with [`placeholder="blur"`](#placeholder).

Must be a base64-encoded image. It will be enlarged and blurred, so a very small image (10px or
less) is recommended. Including larger images as placeholders may harm your application performance.

Try it out:

- [Demo the default `blurDataURL` prop](https://image-legacy-component.nextjs.gallery/placeholder)
- [Demo the shimmer effect with `blurDataURL` prop](https://image-legacy-component.nextjs.gallery/shimmer)
- [Demo the color effect with `blurDataURL` prop](https://image-legacy-component.nextjs.gallery/color)

You can also [generate a solid color Data URL](https://png-pixel.com) to match the image.

### lazyBoundary

A string (with similar syntax to the margin property) that acts as the bounding box used to detect the intersection of the viewport with the image and trigger lazy [loading](#loading). Defaults to `"200px"`.

If the image is nested in a scrollable parent element other than the root document, you will also need to assign the [lazyRoot](#lazyroot) prop.

[Learn more](https://developer.mozilla.org/docs/Web/API/IntersectionObserver/rootMargin)

### lazyRoot

A React [Ref](https://react.dev/learn/referencing-values-with-refs) pointing to the scrollable parent element. Defaults to `null` (the document viewport).

The Ref must point to a DOM element or a React component that [forwards the Ref](https://react.dev/reference/react/forwardRef) to the underlying DOM element.

**Example pointing to a DOM element**

```jsx
import Image from 'next/legacy/image'
import React from 'react'

const Example = () => {
  const lazyRoot = React.useRef(null)

  return (
    <div ref={lazyRoot} style={{ overflowX: 'scroll', width: '500px' }}>
      

![Illustration](https://nextjs.org/one.jpg)


      

![Illustration](https://nextjs.org/two.jpg)


    </div>
  )
}
```

**Example pointing to a React component**

```jsx
import Image from 'next/legacy/image'
import React from 'react'

const Container = React.forwardRef((props, ref) => {
  return (
    <div ref={ref} style={{ overflowX: 'scroll', width: '500px' }}>
      {props.children}
    </div>
  )
})

const Example = () => {
  const lazyRoot = React.useRef(null)

  return (
    <Container ref={lazyRoot}>
      

![Illustration](https://nextjs.org/one.jpg)


      

![Illustration](https://nextjs.org/two.jpg)


    </Container>
  )
}
```

[Learn more](https://developer.mozilla.org/docs/Web/API/IntersectionObserver/root)

### unoptimized

When true, the source image will be served as-is from the `src` instead of changing quality, size, or format. Defaults to `false`.

This is useful for images that do not benefit from optimization such as small images (less than 1KB), vector images (SVG), or animated images (GIF).

```js
import Image from 'next/image'

const UnoptimizedImage = (props) => {
  return 

![Illustration]()


}
```

Since Next.js 12.3.0, this prop can be assigned to all images by updating `next.config.js` with the following configuration:

```js
// Archivo: next.config.js
module.exports = {
  images: {
    unoptimized: true,
  },
}
```

## Other Props

Other properties on the `

![Illustration]()

` component will be passed to the underlying
`img` element with the exception of the following:

- `srcSet`. Use
  [Device Sizes](#device-sizes)
  instead.
- `ref`. Use [`onLoadingComplete`](#onloadingcomplete) instead.
- `decoding`. It is always `"async"`.

## Configuration Options

### Remote Patterns

To protect your application from malicious users, configuration is required in order to use external images. This ensures that only external images from your account can be served from the Next.js Image Optimization API. These external images can be configured with the `remotePatterns` property in your `next.config.js` file, as shown below:

```js
// Archivo: next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        port: '',
        pathname: '/account123/**',
        search: '',
      },
    ],
  },
}
```

> **Good to know**: The example above will ensure the `src` property of `next/legacy/image` must start with `https://example.com/account123/` and must not have a query string. Any other protocol, hostname, port, or unmatched path will respond with 400 Bad Request.

Below is an example of the `remotePatterns` property in the `next.config.js` file using a wildcard pattern in the `hostname`:

```js
// Archivo: next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.example.com',
        port: '',
        search: '',
      },
    ],
  },
}
```

> **Good to know**: The example above will ensure the `src` property of `next/legacy/image` must start with `https://img1.example.com` or `https://me.avatar.example.com` or any number of subdomains. It cannot have a port or query string. Any other protocol or unmatched hostname will respond with 400 Bad Request.

Wildcard patterns can be used for both `pathname` and `hostname` and have the following syntax:

- `*` match a single path segment or subdomain
- `**` match any number of path segments at the end or subdomains at the beginning

The `**` syntax does not work in the middle of the pattern.

> **Good to know**: When omitting `protocol`, `port`, `pathname`, or `search` then the wildcard `**` is implied. This is not recommended because it may allow malicious actors to optimize urls you did not intend.

Below is an example of the `remotePatterns` property in the `next.config.js` file using `search`:

```js
// Archivo: next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.example.com',
        search: '?v=1727111025337',
      },
    ],
  },
}
```

> **Good to know**: The example above will ensure the `src` property of `next/legacy/image` must start with `https://assets.example.com` and must have the exact query string `?v=1727111025337`. Any other protocol or query string will respond with 400 Bad Request.

### Domains

> **Warning**: Deprecated since Next.js 14 in favor of strict [`remotePatterns`](#remote-patterns) in order to protect your application from malicious users. Only use `domains` if you own all the content served from the domain.

Similar to [`remotePatterns`](#remote-patterns), the `domains` configuration can be used to provide a list of allowed hostnames for external images.

However, the `domains` configuration does not support wildcard pattern matching and it cannot restrict protocol, port, or pathname.

Below is an example of the `domains` property in the `next.config.js` file:

```js
// Archivo: next.config.js
module.exports = {
  images: {
    domains: ['assets.acme.com'],
  },
}
```

### Loader Configuration

If you want to use a cloud provider to optimize images instead of using the Next.js built-in Image Optimization API, you can configure the `loader` and `path` prefix in your `next.config.js` file. This allows you to use relative URLs for the Image [`src`](#src) and automatically generate the correct absolute URL for your provider.

```js
// Archivo: next.config.js
module.exports = {
  images: {
    loader: 'imgix',
    path: 'https://example.com/myaccount/',
  },
}
```

#### Customizing the Built-in Image Path

If you want to change or prefix the default path for the built-in Next.js image optimization, you can do so with the `path` property. The default value for `path` is `/_next/image`.

```js
// Archivo: next.config.js
module.exports = {
  images: {
    path: '/my-prefix/_next/image',
  },
}
```

### Built-in Loaders

The following Image Optimization cloud providers are included:

- Default: Works automatically with `next dev`, `next start`, or a custom server
- [Vercel](https://vercel.com): Works automatically when you deploy on Vercel, no configuration necessary. [Learn more](https://vercel.com/docs/image-optimization?utm_source=next-site&utm_medium=docs&utm_campaign=next-website)
- [Imgix](https://www.imgix.com): `loader: 'imgix'`
- [Cloudinary](https://cloudinary.com): `loader: 'cloudinary'`
- [Akamai](https://www.akamai.com): `loader: 'akamai'`
- Custom: `loader: 'custom'` use a custom cloud provider by implementing the [`loader`](#loader) prop on the `next/legacy/image` component

If you need a different provider, you can use the [`loader`](#loader) prop with `next/legacy/image`.

> Images cannot be optimized at build time using [`output: 'export'`](/docs/pages/guides/static-exports), only on-demand. To use `next/legacy/image` with `output: 'export'`, you will need to use a different loader than the default. [Read more in the discussion.](https://github.com/vercel/next.js/discussions/19065)

## Advanced

The following configuration is for advanced use cases and is usually not necessary. If you choose to configure the properties below, you will override any changes to the Next.js defaults in future updates.

### Device Sizes

If you know the expected device widths of your users, you can specify a list of device width breakpoints using the `deviceSizes` property in `next.config.js`. These widths are used when the `next/legacy/image` component uses `layout="responsive"` or `layout="fill"` to ensure the correct image is served for user's device.

If no configuration is provided, the default below is used.

```js
// Archivo: next.config.js
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```

### Image Sizes

You can specify a list of image widths using the `images.imageSizes` property in your `next.config.js` file. These widths are concatenated with the array of [device sizes](#device-sizes) to form the full array of sizes used to generate image [srcset](https://developer.mozilla.org/docs/Web/API/HTMLImageElement/srcset)s.

The reason there are two separate lists is that imageSizes is only used for images which provide a [`sizes`](#sizes) prop, which indicates that the image is less than the full width of the screen. **Therefore, the sizes in imageSizes should all be smaller than the smallest size in deviceSizes.**

If no configuration is provided, the default below is used.

```js
// Archivo: next.config.js
module.exports = {
  images: {
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
  },
}
```

### Acceptable Formats

The default [Image Optimization API](#loader-configuration) will automatically detect the browser's supported image formats via the request's `Accept` header in order to determine the best output format.

If the `Accept` header matches more than one of the configured formats, the first match in the array is used. Therefore, the array order matters. If there is no match (or the source image is [animated](#animated-images)), the Image Optimization API will fallback to the original image's format.

If no configuration is provided, the default below is used.

```js
// Archivo: next.config.js
module.exports = {
  images: {
    formats: ['image/webp'],
  },
}
```

You can enable AVIF support, which will fallback to the original format of the src image if the browser [does not support AVIF](https://caniuse.com/avif):

```js
// Archivo: next.config.js
module.exports = {
  images: {
    formats: ['image/avif'],
  },
}
```

You can also enable both AVIF and WebP formats together. AVIF will be preferred for browsers that support it, with WebP as a fallback:

```js
// Archivo: next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

> **Good to know**:
>
> - We still recommend using WebP for most use cases.
> - AVIF generally takes 50% longer to encode but it compresses 20% smaller compared to WebP. This means that the first time an image is requested, it will typically be slower and then subsequent requests that are cached will be faster.
> - When using multiple formats, Next.js will cache each format separately. This means increased storage requirements compared to using a single format, as both AVIF and WebP versions of images will be stored for different browser support.
> - If you self-host with a Proxy/CDN in front of Next.js, you must configure the Proxy to forward the `Accept` header.

## Caching Behavior

The following describes the caching algorithm for the default [loader](#loader). For all other loaders, please refer to your cloud provider's documentation.

Images are optimized dynamically upon request and stored in the `<distDir>/cache/images` directory. The optimized image file will be served for subsequent requests until the expiration is reached. When a request is made that matches a cached but expired file, the expired image is served stale immediately. Then the image is optimized again in the background (also called revalidation) and saved to the cache with the new expiration date.

The cache status of an image can be determined by reading the value of the `x-nextjs-cache` (`x-vercel-cache` when deployed on Vercel) response header. The possible values are the following:

- `MISS` - the path is not in the cache (occurs at most once, on the first visit)
- `STALE` - the path is in the cache but exceeded the revalidate time so it will be updated in the background
- `HIT` - the path is in the cache and has not exceeded the revalidate time

The expiration (or rather Max Age) is defined by either the [`minimumCacheTTL`](#minimum-cache-ttl) configuration or the upstream image `Cache-Control` header, whichever is larger. Specifically, the `max-age` value of the `Cache-Control` header is used. If both `s-maxage` and `max-age` are found, then `s-maxage` is preferred. The `max-age` is also passed-through to any downstream clients including CDNs and browsers.

- You can configure [`minimumCacheTTL`](#minimum-cache-ttl) to increase the cache duration when the upstream image does not include `Cache-Control` header or the value is very low.
- You can configure [`deviceSizes`](#device-sizes) and [`imageSizes`](#image-sizes) to reduce the total number of possible generated images.
- You can configure [formats](#acceptable-formats) to disable multiple formats in favor of a single image format.

### Minimum Cache TTL

You can configure the Time to Live (TTL) in seconds for cached optimized images. In many cases, it's better to use a [Static Image Import](/docs/pages/api-reference/components/image#src) which will automatically hash the file contents and cache the image forever with a `Cache-Control` header of `immutable`.

If no configuration is provided, the default below is used.

```js
// Archivo: next.config.js
module.exports = {
  images: {
    minimumCacheTTL: 14400, // 4 hours
  },
}
```

You can increase the TTL to reduce the number of revalidations and potentially lower cost:

```js
// Archivo: next.config.js
module.exports = {
  images: {
    minimumCacheTTL: 2678400, // 31 days
  },
}
```

The expiration (or rather Max Age) of the optimized image is defined by either the `minimumCacheTTL` or the upstream image `Cache-Control` header, whichever is larger.

If you need to change the caching behavior per image, you can configure [`headers`](/docs/pages/api-reference/config/next-config-js/headers) to set the `Cache-Control` header on the upstream image (e.g. `/some-asset.jpg`, not `/_next/image` itself).

There is no mechanism to invalidate the cache at this time, so its best to keep `minimumCacheTTL` low. Otherwise you may need to manually change the [`src`](#src) prop or delete `<distDir>/cache/images`.

### Disable Static Imports

The default behavior allows you to import static files such as `import icon from './icon.png'` and then pass that to the `src` property.

In some cases, you may wish to disable this feature if it conflicts with other plugins that expect the import to behave differently.

You can disable static image imports inside your `next.config.js`:

```js
// Archivo: next.config.js
module.exports = {
  images: {
    disableStaticImages: true,
  },
}
```

### Dangerously Allow SVG

The default [loader](#loader) does not optimize SVG images for a few reasons. First, SVG is a vector format meaning it can be resized losslessly. Second, SVG has many of the same features as HTML/CSS, which can lead to vulnerabilities without proper [Content Security Policy (CSP) headers](/docs/app/api-reference/config/next-config-js/headers#content-security-policy).

Therefore, we recommended using the [`unoptimized`](#unoptimized) prop when the [`src`](#src) prop is known to be SVG. This happens automatically when `src` ends with `".svg"`.

However, if you need to serve SVG images with the default Image Optimization API, you can set `dangerouslyAllowSVG` inside your `next.config.js`:

```js
// Archivo: next.config.js
module.exports = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}
```

In addition, it is strongly recommended to also set `contentDispositionType` to force the browser to download the image, as well as `contentSecurityPolicy` to prevent scripts embedded in the image from executing.

### `contentDispositionType`

The default [loader](#loader) sets the [`Content-Disposition`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Disposition#as_a_response_header_for_the_main_body) header to `attachment` for added protection since the API can serve arbitrary remote images.

The default value is `attachment` which forces the browser to download the image when visiting directly. This is particularly important when [`dangerouslyAllowSVG`](#dangerously-allow-svg) is true.

You can optionally configure `inline` to allow the browser to render the image when visiting directly, without downloading it.

```js
// Archivo: next.config.js
module.exports = {
  images: {
    contentDispositionType: 'inline',
  },
}
```

### Animated Images

The default [loader](#loader) will automatically bypass Image Optimization for animated images and serve the image as-is.

Auto-detection for animated files is best-effort and supports GIF, APNG, and WebP. If you want to explicitly bypass Image Optimization for a given animated image, use the [unoptimized](#unoptimized) prop.

## Version History

| Version   | Changes                                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------------------------- |
| `v16.0.0` | `next/legacy/image` deprecated and will be removed in a future version of Next.js. Please use `next/image` instead. |
| `v13.0.0` | `next/image` renamed to `next/legacy/image`                                                                         |


[⬆ Subir al inicio del capítulo](#)

---

<a id="image"></a>

## Image

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/components/image](https://nextjs.org/docs/pages/api-reference/components/image)  
> 📂 **Sección:** Pages > Api Reference > Components  
> 📝 **Descripción:** *Optimize Images in your Next.js Application using the built-in `next/image` Component.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="components"></a>

## Components

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/components](https://nextjs.org/docs/pages/api-reference/components)  
> 📂 **Sección:** Pages > Api Reference > Components  
> 📝 **Descripción:** *API Reference for Next.js built-in components in the Pages Router.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="link"></a>

## Link

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/components/link](https://nextjs.org/docs/pages/api-reference/components/link)  
> 📂 **Sección:** Pages > Api Reference > Components  
> 📝 **Descripción:** *API reference for the `<Link>` component.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="script"></a>

## Script

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/components/script](https://nextjs.org/docs/pages/api-reference/components/script)  
> 📂 **Sección:** Pages > Api Reference > Components  
> 📝 **Descripción:** *Optimize third-party scripts in your Next.js application using the built-in `next/script` Component.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="file-system-conventions"></a>

## File-system conventions

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/file-conventions](https://nextjs.org/docs/pages/api-reference/file-conventions)  
> 📂 **Sección:** Pages > Api Reference > File Conventions  
> 📝 **Descripción:** *API Reference for Next.js file-system conventions.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="instrumentationjs"></a>

## instrumentation.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/file-conventions/instrumentation](https://nextjs.org/docs/pages/api-reference/file-conventions/instrumentation)  
> 📂 **Sección:** Pages > Api Reference > File Conventions  
> 📝 **Descripción:** *API reference for the instrumentation.js file.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="proxy"></a>

## Proxy

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/file-conventions/proxy](https://nextjs.org/docs/pages/api-reference/file-conventions/proxy)  
> 📂 **Sección:** Pages > Api Reference > File Conventions  
> 📝 **Descripción:** *Learn how to use Proxy to run code before a request is completed.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="public-folder"></a>

## public Folder

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/file-conventions/public-folder](https://nextjs.org/docs/pages/api-reference/file-conventions/public-folder)  
> 📂 **Sección:** Pages > Api Reference > File Conventions  
> 📝 **Descripción:** *Next.js allows you to serve static files, like images, in the public directory. You can learn how it works here.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="src-directory"></a>

## src Directory

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/file-conventions/src-folder](https://nextjs.org/docs/pages/api-reference/file-conventions/src-folder)  
> 📂 **Sección:** Pages > Api Reference > File Conventions  
> 📝 **Descripción:** *Save pages under the `src` folder as an alternative to the root `pages` directory.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="catcherror"></a>

## catchError

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions/catchError](https://nextjs.org/docs/pages/api-reference/functions/catchError)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *API Reference for the catchError function.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="getinitialprops"></a>

## getInitialProps

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions/get-initial-props](https://nextjs.org/docs/pages/api-reference/functions/get-initial-props)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *Fetch dynamic data on the server for your React component with getInitialProps.*  

---

> **Good to know**: `getInitialProps` is a legacy API. We recommend using [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props) or [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props) instead.

`getInitialProps` is an `async` function that can be added to the default exported React component for the page. It will run on both the server-side and again on the client-side during page transitions. The result of the function will be forwarded to the React component as `props`.

```tsx
// Archivo: pages/index.tsx switcher
import { NextPageContext } from 'next'

Page.getInitialProps = async (ctx: NextPageContext) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default function Page({ stars }: { stars: number }) {
  return stars
}
```

```jsx
// Archivo: pages/index.js switcher
Page.getInitialProps = async (ctx) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default function Page({ stars }) {
  return stars
}
```

> **Good to know**:
>
> - Data returned from `getInitialProps` is serialized when server rendering. Ensure the returned object from `getInitialProps` is a plain `Object`, and not using `Date`, `Map` or `Set`.
> - For the initial page load, `getInitialProps` will run on the server only. `getInitialProps` will then also run on the client when navigating to a different route with the [`next/link`](/docs/pages/api-reference/components/link) component or by using [`next/router`](/docs/pages/api-reference/functions/use-router).
> - If `getInitialProps` is used in a custom `_app.js`, and the page being navigated to is using `getServerSideProps`, then `getInitialProps` will **only** run on the server.

## Context Object

`getInitialProps` receives a single argument called `context`, which is an object with the following properties:

| Name       | Description                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------- |
| `pathname` | Current route, the path of the page in `/pages`                                                       |
| `query`    | Query string of the URL, parsed as an object                                                          |
| `asPath`   | `String` of the actual path (including the query) shown in the browser                                |
| `req`      | [HTTP request object](https://nodejs.org/api/http.html#http_class_http_incomingmessage) (server only) |
| `res`      | [HTTP response object](https://nodejs.org/api/http.html#http_class_http_serverresponse) (server only) |
| `err`      | Error object if any error is encountered during the rendering                                         |

## Caveats

- `getInitialProps` can only be used in `pages/` top level files, and not in nested components. To have nested data fetching at the component level, consider exploring the [App Router](/docs/app/getting-started/fetching-data).
- Regardless of whether your route is static or dynamic, any data returned from `getInitialProps` as `props` will be able to be examined on the client-side in the initial HTML. This is to allow the page to be [hydrated](https://react.dev/reference/react-dom/hydrate) correctly. Make sure that you don't pass any sensitive information that shouldn't be available on the client in `props`.


[⬆ Subir al inicio del capítulo](#)

---

<a id="getserversideprops"></a>

## getServerSideProps

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props](https://nextjs.org/docs/pages/api-reference/functions/get-server-side-props)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *API reference for `getServerSideProps`. Learn how to fetch data on each request with Next.js.*  

---

When exporting a function called `getServerSideProps` (Server-Side Rendering) from a page, Next.js will prerender this page on each request using the data returned by `getServerSideProps`. This is useful if you want to fetch data that changes often, and have the page update to show the most current data.

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

You can import modules in top-level scope for use in `getServerSideProps`. Imports used will **not be bundled for the client-side**. This means you can write **server-side code directly in `getServerSideProps`**, including fetching data from your database.

## Context parameter

The `context` parameter is an object containing the following keys:

| Name            | Description                                                                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `params`        | If this page uses a [dynamic route](/docs/pages/building-your-application/routing/dynamic-routes), `params` contains the route parameters. If the page name is `[id].js`, then `params` will look like `{ id: ... }`. |
| `req`           | [The `HTTP` IncomingMessage object](https://nodejs.org/api/http.html#http_class_http_incomingmessage), with an additional `cookies` prop, which is an object with string keys mapping to string values of cookies.    |
| `res`           | [The `HTTP` response object](https://nodejs.org/api/http.html#http_class_http_serverresponse).                                                                                                                        |
| `query`         | An object representing the query string, including dynamic route parameters.                                                                                                                                          |
| `preview`       | (Deprecated for `draftMode`) `preview` is `true` if the page is in the [Preview Mode](/docs/pages/guides/preview-mode) and `false` otherwise.                                                                         |
| `previewData`   | (Deprecated for `draftMode`) The [preview](/docs/pages/guides/preview-mode) data set by `setPreviewData`.                                                                                                             |
| `draftMode`     | `draftMode` is `true` if the page is in the [Draft Mode](/docs/pages/guides/draft-mode) and `false` otherwise.                                                                                                        |
| `resolvedUrl`   | A normalized version of the request `URL` that strips the `_next/data` prefix for client transitions and includes original query values.                                                                              |
| `locale`        | Contains the active locale (if enabled).                                                                                                                                                                              |
| `locales`       | Contains all supported locales (if enabled).                                                                                                                                                                          |
| `defaultLocale` | Contains the configured default locale (if enabled).                                                                                                                                                                  |

## getServerSideProps return values

The `getServerSideProps` function should return an object with **any one of the following** properties:

### `props`

The `props` object is a key-value pair, where each value is received by the page component. It should be a [serializable object](https://developer.mozilla.org/docs/Glossary/Serialization) so that any props passed, could be serialized with [`JSON.stringify`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```jsx
export async function getServerSideProps(context) {
  return {
    props: { message: `Next.js is awesome` }, // will be passed to the page component as props
  }
}
```

### `notFound`

The `notFound` boolean allows the page to return a `404` status and [404 Page](/docs/pages/building-your-application/routing/custom-error#404-page). With `notFound: true`, the page will return a `404` even if there was a successfully generated page before. This is meant to support use cases like user-generated content getting removed by its author.

```js
export async function getServerSideProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
  }
}
```

### `redirect`

The `redirect` object allows redirecting to internal and external resources. It should match the shape of `{ destination: string, permanent: boolean }`. In some rare cases, you might need to assign a custom status code for older `HTTP` clients to properly redirect. In these cases, you can use the `statusCode` property instead of the `permanent` property, but not both.

```js
export async function getServerSideProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  if (!data) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {}, // will be passed to the page component as props
  }
}
```

## Version History

| Version   | Changes                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------- |
| `v13.4.0` | [App Router](/docs/app/getting-started/fetching-data) is now stable with simplified data fetching |
| `v10.0.0` | `locale`, `locales`, `defaultLocale`, and `notFound` options added.                               |
| `v9.3.0`  | `getServerSideProps` introduced.                                                                  |


[⬆ Subir al inicio del capítulo](#)

---

<a id="getstaticpaths"></a>

## getStaticPaths

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions/get-static-paths](https://nextjs.org/docs/pages/api-reference/functions/get-static-paths)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *API reference for `getStaticPaths`. Learn how to fetch data and generate static pages with `getStaticPaths`.*  

---

When exporting a function called `getStaticPaths` from a page that uses [Dynamic Routes](/docs/pages/building-your-application/routing/dynamic-routes), Next.js will statically prerender all the paths specified by `getStaticPaths`.

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

## getStaticPaths return values

The `getStaticPaths` function should return an object with the following **required** properties:

### `paths`

The `paths` key determines which paths will be prerendered. For example, suppose that you have a page that uses [Dynamic Routes](/docs/pages/building-your-application/routing/dynamic-routes) named `pages/posts/[id].js`. If you export `getStaticPaths` from this page and return the following for `paths`:

```js
return {
  paths: [
    { params: { id: '1' }},
    {
      params: { id: '2' },
      // with i18n configured the locale for the path can be returned as well
      locale: "en",
    },
  ],
  fallback: ...
}
```

Then, Next.js will statically generate `/posts/1` and `/posts/2` during `next build` using the page component in `pages/posts/[id].js`.

The value for each `params` object must match the parameters used in the page name:

- If the page name is `pages/posts/[postId]/[commentId]`, then `params` should contain `postId` and `commentId`.
- If the page name uses [catch-all routes](/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments) like `pages/[...slug]`, then `params` should contain `slug` (which is an array). If this array is `['hello', 'world']`, then Next.js will statically generate the page at `/hello/world`.
- If the page uses an [optional catch-all route](/docs/pages/building-your-application/routing/dynamic-routes#optional-catch-all-segments), use `null`, `[]`, `undefined` or `false` to render the root-most route. For example, if you supply `slug: false` for `pages/[[...slug]]`, Next.js will statically generate the page `/`.

The `params` strings are **case-sensitive** and ideally should be normalized to ensure the paths are generated correctly. For example, if `WoRLD` is returned for a param it will only match if `WoRLD` is the actual path visited, not `world` or `World`.

Separate of the `params` object a `locale` field can be returned when [i18n is configured](/docs/pages/guides/internationalization), which configures the locale for the path being generated.

### `fallback: false`

If `fallback` is `false`, then any paths not returned by `getStaticPaths` will result in a **404 page**.

When `next build` is run, Next.js will check if `getStaticPaths` returned `fallback: false`, it will then build **only** the paths returned by `getStaticPaths`. This option is useful if you have a small number of paths to create, or new page data is not added often. If you find that you need to add more paths, and you have `fallback: false`, you will need to run `next build` again so that the new paths can be generated.

The following example prerenders one blog post per page called `pages/posts/[id].js`. The list of blog posts will be fetched from a CMS and returned by `getStaticPaths`. Then, for each page, it fetches the post data from a CMS using [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props).

```jsx
// Archivo: pages/posts/[id].js
function Post({ post }) {
  // Render post...
}

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

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return { props: { post } }
}

export default Post
```

### `fallback: true`

<details>
  <summary>Examples</summary>

- [Static generation of a large number of pages](https://react-tweet.vercel.app/)

</details>

If `fallback` is `true`, then the behavior of `getStaticProps` changes in the following ways:

- The paths returned from `getStaticPaths` will be rendered to `HTML` at build time by `getStaticProps`.
- The paths that have not been generated at build time will **not** result in a 404 page. Instead, Next.js will serve a [“fallback”](#fallback-pages) version of the page on the first request to such a path. Web crawlers, such as Google, won't be served a fallback and instead the path will behave as in [`fallback: 'blocking'`](#fallback-blocking).
- When a page with `fallback: true` is navigated to through `next/link` or `next/router` (client-side) Next.js will _not_ serve a fallback and instead the page will behave as [`fallback: 'blocking'`](#fallback-blocking).
- In the background, Next.js will statically generate the requested path `HTML` and `JSON`. This includes running `getStaticProps`.
- When complete, the browser receives the `JSON` for the generated path. This will be used to automatically render the page with the required props. From the user’s perspective, the page will be swapped from the fallback page to the full page.
- At the same time, Next.js adds this path to the list of prerendered pages. Subsequent requests to the same path will serve the generated page, like other pages prerendered at build time.

> **Good to know**: `fallback: true` is not supported when using [`output: 'export'`](/docs/pages/guides/static-exports).

#### When is `fallback: true` useful?

`fallback: true` is useful if your app has a very large number of static pages that depend on data (such as a very large e-commerce site). If you want to prerender all product pages, the builds would take a very long time.

Instead, you may statically generate a small subset of pages and use `fallback: true` for the rest. When someone requests a page that is not generated yet, the user will see the page with a loading indicator or skeleton component.

Shortly after, `getStaticProps` finishes and the page will be rendered with the requested data. From now on, everyone who requests the same page will get the statically prerendered page.

This ensures that users always have a fast experience while preserving fast builds and the benefits of Static Generation.

`fallback: true` will not _update_ generated pages, for that take a look at [Incremental Static Regeneration](/docs/pages/guides/incremental-static-regeneration).

### `fallback: 'blocking'`

If `fallback` is `'blocking'`, new paths not returned by `getStaticPaths` will wait for the `HTML` to be generated, identical to SSR (hence why _blocking_), and then be cached for future requests so it only happens once per path.

`getStaticProps` will behave as follows:

- The paths returned from `getStaticPaths` will be rendered to `HTML` at build time by `getStaticProps`.
- The paths that have not been generated at build time will **not** result in a 404 page. Instead, Next.js will SSR on the first request and return the generated `HTML`.
- When complete, the browser receives the `HTML` for the generated path. From the user’s perspective, it will transition from "the browser is requesting the page" to "the full page is loaded". There is no flash of loading/fallback state.
- At the same time, Next.js adds this path to the list of prerendered pages. Subsequent requests to the same path will serve the generated page, like other pages prerendered at build time.

`fallback: 'blocking'` will not _update_ generated pages by default. To update generated pages, use [Incremental Static Regeneration](/docs/pages/guides/incremental-static-regeneration) in conjunction with `fallback: 'blocking'`.

> **Good to know**: `fallback: 'blocking'` is not supported when using [`output: 'export'`](/docs/pages/guides/static-exports).

### Fallback pages

In the “fallback” version of a page:

- The page’s props will be empty.
- Using the [router](/docs/pages/api-reference/functions/use-router), you can detect if the fallback is being rendered, `router.isFallback` will be `true`.

The following example showcases using `isFallback`:

```jsx
// Archivo: pages/posts/[id].js
import { useRouter } from 'next/router'

function Post({ post }) {
  const router = useRouter()

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // Render post...
}

// This function gets called at build time
export async function getStaticPaths() {
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  }
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return {
    props: { post },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  }
}

export default Post
```

## Version History

| Version   | Changes                                                                                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v13.4.0` | [App Router](/docs/app/getting-started/fetching-data) is now stable with simplified data fetching, including [`generateStaticParams()`](/docs/app/api-reference/functions/generate-static-params) |
| `v12.2.0` | [On-Demand Incremental Static Regeneration](/docs/pages/guides/incremental-static-regeneration#on-demand-revalidation-with-revalidatepath) is stable.                                             |
| `v12.1.0` | [On-Demand Incremental Static Regeneration](/docs/pages/guides/incremental-static-regeneration#on-demand-revalidation-with-revalidatepath) added (beta).                                          |
| `v9.5.0`  | Stable [Incremental Static Regeneration](/docs/pages/guides/incremental-static-regeneration)                                                                                                      |
| `v9.3.0`  | `getStaticPaths` introduced.                                                                                                                                                                      |


[⬆ Subir al inicio del capítulo](#)

---

<a id="getstaticprops"></a>

## getStaticProps

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions/get-static-props](https://nextjs.org/docs/pages/api-reference/functions/get-static-props)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *API reference for `getStaticProps`. Learn how to use `getStaticProps` to generate static pages with Next.js.*  

---

Exporting a function called `getStaticProps` will prerender a page at build time using the props returned from the function:

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

You can import modules in top-level scope for use in `getStaticProps`. Imports used will **not be bundled for the client-side**. This means you can write **server-side code directly in `getStaticProps`**, including fetching data from your database.

## Context parameter

The `context` parameter is an object containing the following keys:

| Name               | Description                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `params`           | Contains the route parameters for pages using [dynamic routes](/docs/pages/building-your-application/routing/dynamic-routes). For example, if the page name is `[id].js`, then `params` will look like `{ id: ... }`. You should use this together with `getStaticPaths`, which we'll explain later.                                                                                                                                 |
| `preview`          | (Deprecated for `draftMode`) `preview` is `true` if the page is in the [Preview Mode](/docs/pages/guides/preview-mode) and `false` otherwise.                                                                                                                                                                                                                                                                                        |
| `previewData`      | (Deprecated for `draftMode`) The [preview](/docs/pages/guides/preview-mode) data set by `setPreviewData`.                                                                                                                                                                                                                                                                                                                            |
| `draftMode`        | `draftMode` is `true` if the page is in the [Draft Mode](/docs/pages/guides/draft-mode) and `false` otherwise.                                                                                                                                                                                                                                                                                                                       |
| `locale`           | Contains the active locale (if enabled).                                                                                                                                                                                                                                                                                                                                                                                             |
| `locales`          | Contains all supported locales (if enabled).                                                                                                                                                                                                                                                                                                                                                                                         |
| `defaultLocale`    | Contains the configured default locale (if enabled).                                                                                                                                                                                                                                                                                                                                                                                 |
| `revalidateReason` | Provides a reason for why the function was called. Can be one of: "build" (run at build time), "stale" (revalidate period expired, or running in [development mode](/docs/pages/building-your-application/data-fetching/get-static-props#runs-on-every-request-in-development)), "on-demand" (triggered via [on-demand revalidation](/docs/pages/guides/incremental-static-regeneration#on-demand-revalidation-with-revalidatepath)) |

## getStaticProps return values

The `getStaticProps` function should return an object containing either `props`, `redirect`, or `notFound` followed by an **optional** `revalidate` property.

### `props`

The `props` object is a key-value pair, where each value is received by the page component. It should be a [serializable object](https://developer.mozilla.org/docs/Glossary/Serialization) so that any props passed, could be serialized with [`JSON.stringify`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify).

```jsx
export async function getStaticProps(context) {
  return {
    props: { message: `Next.js is awesome` }, // will be passed to the page component as props
  }
}
```

### `revalidate`

The `revalidate` property is the amount in seconds after which a page re-generation can occur (defaults to `false` or no revalidation).

```js
// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}
```

Learn more about [Incremental Static Regeneration](/docs/pages/guides/incremental-static-regeneration).

The cache status of a page leveraging ISR can be determined by reading the value of the `x-nextjs-cache` response header. The possible values are the following:

- `MISS` - the path is not in the cache (occurs at most once, on the first visit)
- `STALE` - the path is in the cache but exceeded the revalidate time so it will be updated in the background
- `HIT` - the path is in the cache and has not exceeded the revalidate time

### `notFound`

The `notFound` boolean allows the page to return a `404` status and [404 Page](/docs/pages/building-your-application/routing/custom-error#404-page). With `notFound: true`, the page will return a `404` even if there was a successfully generated page before. This is meant to support use cases like user-generated content getting removed by its author. Note, `notFound` follows the same `revalidate` behavior [described here](#revalidate).

```js
export async function getStaticProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
  }
}
```

> **Good to know**: `notFound` is not needed for [`fallback: false`](/docs/pages/api-reference/functions/get-static-paths#fallback-false) mode as only paths returned from `getStaticPaths` will be prerendered.

### `redirect`

The `redirect` object allows redirecting to internal or external resources. It should match the shape of `{ destination: string, permanent: boolean }`.

In some rare cases, you might need to assign a custom status code for older `HTTP` clients to properly redirect. In these cases, you can use the `statusCode` property instead of the `permanent` property, **but not both**. You can also set `basePath: false` similar to redirects in `next.config.js`.

```js
export async function getStaticProps(context) {
  const res = await fetch(`https://...`)
  const data = await res.json()

  if (!data) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
        // statusCode: 301
      },
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
  }
}
```

If the redirects are known at build-time, they should be added in [`next.config.js`](/docs/pages/api-reference/config/next-config-js/redirects) instead.

## Reading files: Use `process.cwd()`

Files can be read directly from the filesystem in `getStaticProps`.

In order to do so you have to get the full path to a file.

Since Next.js compiles your code into a separate directory you can't use `__dirname` as the path it returns will be different from the Pages Router.

Instead you can use `process.cwd()` which gives you the directory where Next.js is being executed.

```jsx
import { promises as fs } from 'fs'
import path from 'path'

// posts will be populated at build time by getStaticProps()
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>
          <h3>{post.filename}</h3>
          <p>{post.content}</p>
        </li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries.
export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts')
  const filenames = await fs.readdir(postsDirectory)

  const posts = filenames.map(async (filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = await fs.readFile(filePath, 'utf8')

    // Generally you would parse/transform the contents
    // For example you can transform markdown to HTML here

    return {
      filename,
      content: fileContents,
    }
  })
  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts: await Promise.all(posts),
    },
  }
}

export default Blog
```

## Version History

| Version   | Changes                                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v13.4.0` | [App Router](/docs/app/getting-started/fetching-data) is now stable with simplified data fetching                                                        |
| `v12.2.0` | [On-Demand Incremental Static Regeneration](/docs/pages/guides/incremental-static-regeneration#on-demand-revalidation-with-revalidatepath) is stable.    |
| `v12.1.0` | [On-Demand Incremental Static Regeneration](/docs/pages/guides/incremental-static-regeneration#on-demand-revalidation-with-revalidatepath) added (beta). |
| `v10.0.0` | `locale`, `locales`, `defaultLocale`, and `notFound` options added.                                                                                      |
| `v10.0.0` | `fallback: 'blocking'` return option added.                                                                                                              |
| `v9.5.0`  | Stable [Incremental Static Regeneration](/docs/pages/guides/incremental-static-regeneration)                                                             |
| `v9.3.0`  | `getStaticProps` introduced.                                                                                                                             |


[⬆ Subir al inicio del capítulo](#)

---

<a id="functions"></a>

## Functions

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions](https://nextjs.org/docs/pages/api-reference/functions)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *API Reference for Functions and Hooks in Pages Router.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="nextrequest"></a>

## NextRequest

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions/next-request](https://nextjs.org/docs/pages/api-reference/functions/next-request)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *API Reference for NextRequest.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="nextresponse"></a>

## NextResponse

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions/next-response](https://nextjs.org/docs/pages/api-reference/functions/next-response)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *API Reference for NextResponse.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="useparams"></a>

## useParams

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions/use-params](https://nextjs.org/docs/pages/api-reference/functions/use-params)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *API Reference for the useParams hook in the Pages Router.*  

---

`useParams` is a hook that lets you read a route's [dynamic params](/docs/pages/building-your-application/routing/dynamic-routes) filled in by the current URL.

```tsx
// Archivo: pages/shop/[slug].tsx switcher
import { useParams } from 'next/navigation'

export default function ShopPage() {
  const params = useParams<{ slug: string }>()

  if (!params) {
    // Render fallback UI while params are not yet available
    return null
  }

  // Route -> /shop/[slug]
  // URL -> /shop/shoes
  // `params` -> { slug: 'shoes' }
  return <>Shop: {params.slug}</>
}
```

```jsx
// Archivo: pages/shop/[slug].js switcher
import { useParams } from 'next/navigation'

export default function ShopPage() {
  const params = useParams()

  if (!params) {
    // Render fallback UI while params are not yet available
    return null
  }

  // Route -> /shop/[slug]
  // URL -> /shop/shoes
  // `params` -> { slug: 'shoes' }
  return <>Shop: {params.slug}</>
}
```

## Parameters

```tsx
const params = useParams()
```

`useParams` does not take any parameters.

## Returns

`useParams` returns an object containing the current route's filled in [dynamic parameters](/docs/pages/building-your-application/routing/dynamic-routes), or `null` during [prerendering](#behavior-during-prerendering).

- Each property in the object is an active dynamic segment.
- The property name is the segment's name, and the property value is what the segment is filled in with.
- The property value will either be a `string` or array of `string`s depending on the [type of dynamic segment](/docs/pages/building-your-application/routing/dynamic-routes).
- If the route contains no dynamic parameters, `useParams` returns an empty object.

For example:

| Route                        | URL         | `useParams()`             |
| ---------------------------- | ----------- | ------------------------- |
| `pages/shop/page.js`         | `/shop`     | `{}`                      |
| `pages/shop/[slug].js`       | `/shop/1`   | `{ slug: '1' }`           |
| `pages/shop/[tag]/[item].js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
| `pages/shop/[...slug].js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

> **Good to know**: `useParams` is a [React Hook](https://react.dev/learn#using-hooks) and cannot be used with classes.

## Behavior

### Behavior during prerendering

For pages that are [statically optimized](/docs/pages/building-your-application/rendering/automatic-static-optimization), `useParams` will return `null` on the initial render. After hydration, the value will be updated to the actual params once the router is ready.

This is because params cannot be known during static generation for dynamic routes.

```tsx
// Archivo: pages/shop/[slug].tsx switcher
import { useParams } from 'next/navigation'

export default function ShopPage() {
  const params = useParams<{ slug: string }>()

  if (!params) {
    // Return a fallback UI while params are loading
    // This prevents hydration mismatches
    return <ShopPageSkeleton />
  }

  return <>Shop: {params.slug}</>
}
```

```jsx
// Archivo: pages/shop/[slug].js switcher
import { useParams } from 'next/navigation'

export default function ShopPage() {
  const params = useParams()

  if (!params) {
    // Return a fallback UI while params are loading
    // This prevents hydration mismatches
    return <ShopPageSkeleton />
  }

  return <>Shop: {params.slug}</>
}
```

### Using with `getServerSideProps`

When using [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props), the page is server-rendered on each request and `useParams` will return the actual params immediately:

```tsx
// Archivo: pages/shop/[slug].tsx switcher
import { useParams } from 'next/navigation'

export default function ShopPage() {
  const params = useParams<{ slug: string }>()

  // With getServerSideProps, this fallback is never rendered because
  // params is always available on the server. However, keeping
  // the fallback allows this component to be reused on other pages
  // that may not use getServerSideProps.
  if (!params) {
    return null
  }

  return <>Shop: {params.slug}</>
}

export async function getServerSideProps() {
  return { props: {} }
}
```

```jsx
// Archivo: pages/shop/[slug].js switcher
import { useParams } from 'next/navigation'

export default function ShopPage() {
  const params = useParams()

  // With getServerSideProps, this fallback is never rendered because
  // params is always available on the server. However, keeping
  // the fallback allows this component to be reused on other pages
  // that may not use getServerSideProps.
  if (!params) {
    return null
  }

  return <>Shop: {params.slug}</>
}

export async function getServerSideProps() {
  return { props: {} }
}
```

### Comparison with `router.query`

`useParams` only returns the dynamic route parameters, whereas [`router.query`](/docs/pages/api-reference/functions/use-router#router-object) from `useRouter` includes both dynamic parameters and query string parameters.

```tsx
// Archivo: pages/shop/[slug].tsx switcher
import { useRouter } from 'next/router'
import { useParams } from 'next/navigation'

export default function ShopPage() {
  const router = useRouter()
  const params = useParams()

  // URL -> /shop/shoes?color=red

  // router.query -> { slug: 'shoes', color: 'red' }
  // params -> { slug: 'shoes' }

  // ...
}
```

```jsx
// Archivo: pages/shop/[slug].js switcher
import { useRouter } from 'next/router'
import { useParams } from 'next/navigation'

export default function ShopPage() {
  const router = useRouter()
  const params = useParams()

  // URL -> /shop/shoes?color=red

  // router.query -> { slug: 'shoes', color: 'red' }
  // params -> { slug: 'shoes' }

  // ...
}
```

## Examples

### Sharing components with App Router

`useParams` from `next/navigation` works in both the Pages Router and App Router. This allows you to create shared components that work in either context:

```tsx
// Archivo: components/breadcrumb.tsx switcher
import { useParams } from 'next/navigation'

// This component works in both pages/ and app/
export function Breadcrumb() {
  const params = useParams<{ slug: string }>()

  if (!params) {
    // Fallback for Pages Router during prerendering
    return <nav>Home / ...</nav>
  }

  return <nav>Home / {params.slug}</nav>
}
```

```jsx
// Archivo: components/breadcrumb.js switcher
import { useParams } from 'next/navigation'

// This component works in both pages/ and app/
export function Breadcrumb() {
  const params = useParams()

  if (!params) {
    // Fallback for Pages Router during prerendering
    return <nav>Home / ...</nav>
  }

  return <nav>Home / {params.slug}</nav>
}
```

> **Good to know**: When using this component in the App Router, `useParams` never returns `null`, so the fallback branch will not be rendered.

## Version History

| Version   | Changes                 |
| --------- | ----------------------- |
| `v13.3.0` | `useParams` introduced. |


[⬆ Subir al inicio del capítulo](#)

---

<a id="usereportwebvitals"></a>

## useReportWebVitals

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions/use-report-web-vitals](https://nextjs.org/docs/pages/api-reference/functions/use-report-web-vitals)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *Use the Next.js `useReportWebVitals` hook to send Core Web Vitals and custom performance metrics to analytics.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="userouter"></a>

## useRouter

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions/use-router](https://nextjs.org/docs/pages/api-reference/functions/use-router)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *Learn more about the API of the Next.js Router, and access the router instance in your page with the useRouter hook.*  

---

If you want to access the [`router` object](#router-object) inside any function component in your app, you can use the `useRouter` hook, take a look at the following example:

```jsx
import { useRouter } from 'next/router'

function ActiveLink({ children, href }) {
  const router = useRouter()
  const style = {
    marginRight: 10,
    color: router.asPath === href ? 'red' : 'black',
  }

  const handleClick = (e) => {
    e.preventDefault()
    router.push(href)
  }

  return (
    <a href={href} onClick={handleClick} style={style}>
      {children}
    </a>
  )
}

export default ActiveLink
```

> `useRouter` is a [React Hook](https://react.dev/learn#using-hooks), meaning it cannot be used with classes. You can either use [withRouter](#withrouter) or wrap your class in a function component.

## `router` object

The following is the definition of the `router` object returned by both [`useRouter`](#top) and [`withRouter`](#withrouter):

- `pathname`: `String` - The path for current route file that comes after `/pages`. Therefore, `basePath`, `locale` and trailing slash (`trailingSlash: true`) are not included.
- `query`: `Object` - The query string parsed to an object, including [dynamic route](/docs/pages/building-your-application/routing/dynamic-routes) parameters. It will be an empty object during prerendering if the page doesn't use [Server-side Rendering](/docs/pages/building-your-application/data-fetching/get-server-side-props). Defaults to `{}`
- `asPath`: `String` - The path as shown in the browser including the search params and respecting the `trailingSlash` configuration. `basePath` and `locale` are not included.
- `isFallback`: `boolean` - Whether the current page is in [fallback mode](/docs/pages/api-reference/functions/get-static-paths#fallback-true).
- `basePath`: `String` - The active [basePath](/docs/app/api-reference/config/next-config-js/basePath) (if enabled).
- `locale`: `String` - The active locale (if enabled).
- `locales`: `String[]` - All supported locales (if enabled).
- `defaultLocale`: `String` - The current default locale (if enabled).
- `domainLocales`: `Array<{domain, defaultLocale, locales}>` - Any configured domain locales.
- `isReady`: `boolean` - Whether the router fields are updated client-side and ready for use. Should only be used inside of `useEffect` methods and not for conditionally rendering on the server. See related docs for use case with [automatically statically optimized pages](/docs/pages/building-your-application/rendering/automatic-static-optimization)
- `isPreview`: `boolean` - Whether the application is currently in [preview mode](/docs/pages/guides/preview-mode).

> Using the `asPath` field may lead to a mismatch between client and server if the page is rendered using server-side rendering or [automatic static optimization](/docs/pages/building-your-application/rendering/automatic-static-optimization). Avoid using `asPath` until the `isReady` field is `true`.

The following methods are included inside `router`:

### router.push

Handles client-side transitions, this method is useful for cases where [`next/link`](/docs/pages/api-reference/components/link) is not enough.

```js
router.push(url, as, options)
```

- `url`: `UrlObject | String` - The URL to navigate to (see [Node.JS URL module documentation](https://nodejs.org/api/url.html#legacy-urlobject) for `UrlObject` properties).
- `as`: `UrlObject | String` - Optional decorator for the path that will be shown in the browser URL bar. Before Next.js 9.5.3 this was used for dynamic routes.
- `options` - Optional object with the following configuration options:
  - `scroll` - Optional boolean, controls scrolling to the top of the page after navigation. Defaults to `true`
  - [`shallow`](/docs/pages/building-your-application/routing/linking-and-navigating#shallow-routing): Update the path of the current page without rerunning [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props), [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props) or [`getInitialProps`](/docs/pages/api-reference/functions/get-initial-props). Defaults to `false`
  - `locale` - Optional string, indicates locale of the new page

> You don't need to use `router.push` for external URLs. [window.location](https://developer.mozilla.org/docs/Web/API/Window/location) is better suited for those cases.

Navigating to `pages/about.js`, which is a predefined route:

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/about')}>
      Click me
    </button>
  )
}
```

Navigating `pages/post/[pid].js`, which is a dynamic route:

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/post/abc')}>
      Click me
    </button>
  )
}
```

Redirecting the user to `pages/login.js`, useful for pages behind [authentication](/docs/pages/guides/authentication):

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Here you would fetch and return the user
const useUser = () => ({ user: null, loading: false })

export default function Page() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!(user || loading)) {
      router.push('/login')
    }
  }, [user, loading])

  return <p>Redirecting...</p>
}
```

#### Resetting state after navigation

When navigating to the same page in Next.js, the page's state **will not** be reset by default as React does not unmount unless the parent component has changed.

```jsx
// Archivo: pages/[slug].js
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Page(props) {
  const router = useRouter()
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1>Page: {router.query.slug}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increase count</button>
      [one](/one) [two](/two)
    </div>
  )
}
```

In the above example, navigating between `/one` and `/two` **will not** reset the count . The `useState` is maintained between renders because the top-level React component, `Page`, is the same.

If you do not want this behavior, you have a couple of options:

- Manually ensure each state is updated using `useEffect`. In the above example, that could look like:

  ```jsx
  useEffect(() => {
    setCount(0)
  }, [router.query.slug])
  ```

- Use a React `key` to [tell React to remount the component](https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key). To do this for all pages, you can use a custom app:

  ```jsx filename="pages/_app.js"
  import { useRouter } from 'next/router'

  export default function MyApp({ Component, pageProps }) {
    const router = useRouter()
    return <Component key={router.asPath} {...pageProps} />
  }
  ```

#### With URL object

You can use a URL object in the same way you can use it for [`next/link`](/docs/pages/api-reference/components/link#passing-a-url-object). Works for both the `url` and `as` parameters:

```jsx
import { useRouter } from 'next/router'

export default function ReadMore({ post }) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => {
        router.push({
          pathname: '/post/[pid]',
          query: { pid: post.id },
        })
      }}
    >
      Click here to read more
    </button>
  )
}
```

If you omit `pathname`, the query is applied to the URL shown in the browser ([`asPath`](#router-object)) rather than to the current page's route (`pathname`). This keeps [rewrites](/docs/pages/api-reference/config/next-config-js/rewrites) intact: on a page served by a rewrite, a query-only navigation preserves the URL the visitor requested instead of revealing the rewrite destination.

The two values also differ when you mask the URL yourself with the `as` parameter. Pass `pathname` explicitly in that case, otherwise the query is applied to the masked URL and can resolve to a different page:

```jsx
// On the `/` page, with the URL masked as `/p/1`
router.push({ pathname: '/', query: { photoId: 2 } }, '/p/2', { shallow: true })
```

### router.replace

Similar to the `replace` prop in [`next/link`](/docs/pages/api-reference/components/link), `router.replace` will prevent adding a new URL entry into the `history` stack.

```js
router.replace(url, as, options)
```

- The API for `router.replace` is exactly the same as the API for [`router.push`](#routerpush).

Take a look at the following example:

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.replace('/home')}>
      Click me
    </button>
  )
}
```

### router.prefetch

Prefetch pages for faster client-side transitions. This method is only useful for navigations without [`next/link`](/docs/pages/api-reference/components/link), as `next/link` takes care of prefetching pages automatically.

> This is a production only feature. Next.js doesn't prefetch pages in development.

```js
router.prefetch(url, as, options)
```

- `url` - The URL to prefetch, including explicit routes (e.g. `/dashboard`) and dynamic routes (e.g. `/product/[id]`)
- `as` - Optional decorator for `url`. Before Next.js 9.5.3 this was used to prefetch dynamic routes.
- `options` - Optional object with the following allowed fields:
  - `locale` - allows providing a different locale from the active one. If `false`, `url` has to include the locale as the active locale won't be used.

Let's say you have a login page, and after a login, you redirect the user to the dashboard. For that case, we can prefetch the dashboard to make a faster transition, like in the following example:

```jsx
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login() {
  const router = useRouter()
  const handleSubmit = useCallback((e) => {
    e.preventDefault()

    fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(),
    }).then((res) => {
      // Do a fast client-side transition to the already prefetched dashboard page
      if (res.ok) router.push('/dashboard')
    })
  }, [])

  useEffect(() => {
    // Prefetch the dashboard page
    router.prefetch('/dashboard')
  }, [router])

  return (
    <form onSubmit={handleSubmit}>
      
      <button type="submit">Login</button>
    </form>
  )
}
```

### router.beforePopState

In some cases (for example, if using a [Custom Server](/docs/pages/guides/custom-server)), you may wish to listen to [popstate](https://developer.mozilla.org/docs/Web/API/Window/popstate_event) and do something before the router acts on it.

```js
router.beforePopState(cb)
```

- `cb` - The function to run on incoming `popstate` events. The function receives the state of the event as an object with the following props:
  - `url`: `String` - the route for the new state. This is usually the name of a `page`
  - `as`: `String` - the url that will be shown in the browser
  - `options`: `Object` - Additional options sent by [router.push](#routerpush)

If `cb` returns `false`, the Next.js router will not handle `popstate`, and you'll be responsible for handling it in that case. See [Disabling file-system routing](/docs/pages/guides/custom-server#disabling-file-system-routing).

You could use `beforePopState` to manipulate the request, or force a SSR refresh, as in the following example:

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    router.beforePopState(({ url, as, options }) => {
      // I only want to allow these two routes!
      if (as !== '/' && as !== '/other') {
        // Have SSR render bad routes as a 404.
        window.location.href = as
        return false
      }

      return true
    })
  }, [router])

  return <p>Welcome to the page</p>
}
```

### router.back

Navigate back in history. Equivalent to clicking the browser’s back button. It executes `window.history.back()`.

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.back()}>
      Click here to go back
    </button>
  )
}
```

### router.reload

Reload the current URL. Equivalent to clicking the browser’s refresh button. It executes `window.location.reload()`.

```jsx
import { useRouter } from 'next/router'

export default function Page() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.reload()}>
      Click here to reload
    </button>
  )
}
```

### router.events

You can listen to different events happening inside the Next.js Router. Here's a list of supported events:

- `routeChangeStart(url, { shallow })` - Fires when a route starts to change
- `routeChangeComplete(url, { shallow })` - Fires when a route changed completely
- `routeChangeError(err, url, { shallow })` - Fires when there's an error when changing routes, or a route load is cancelled
  - `err.cancelled` - Indicates if the navigation was cancelled
- `beforeHistoryChange(url, { shallow })` - Fires before changing the browser's history
- `hashChangeStart(url, { shallow })` - Fires when the hash will change but not the page
- `hashChangeComplete(url, { shallow })` - Fires when the hash has changed but not the page

> **Good to know**: Here `url` is the URL shown in the browser, including the [`basePath`](/docs/app/api-reference/config/next-config-js/basePath).

For example, to listen to the router event `routeChangeStart`, open or create `pages/_app.js` and subscribe to the event, like so:

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url, { shallow }) => {
      console.log(
        `App is changing to ${url} ${
          shallow ? 'with' : 'without'
        } shallow routing`
      )
    }

    router.events.on('routeChangeStart', handleRouteChange)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
  }, [router])

  return <Component {...pageProps} />
}
```

> We use a [Custom App](/docs/pages/building-your-application/routing/custom-app) (`pages/_app.js`) for this example to subscribe to the event because it's not unmounted on page navigations, but you can subscribe to router events on any component in your application.

Router events should be registered when a component mounts ([useEffect](https://react.dev/reference/react/useEffect) or [componentDidMount](https://react.dev/reference/react/Component#componentdidmount) / [componentWillUnmount](https://react.dev/reference/react/Component#componentwillunmount)) or imperatively when an event happens.

If a route load is cancelled (for example, by clicking two links rapidly in succession), `routeChangeError` will fire. And the passed `err` will contain a `cancelled` property set to `true`, as in the following example:

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function MyApp({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeError = (err, url) => {
      if (err.cancelled) {
        console.log(`Route to ${url} was cancelled!`)
      }
    }

    router.events.on('routeChangeError', handleRouteChangeError)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeError', handleRouteChangeError)
    }
  }, [router])

  return <Component {...pageProps} />
}
```

## The `next/compat/router` export

This is the same `useRouter` hook, but can be used in both `app` and `pages` directories.

It differs from `next/router` in that it does not throw an error when the pages router is not mounted, and instead has a return type of `NextRouter | null`.
This allows developers to convert components to support running in both `app` and `pages` as they transition to the `app` router.

A component that previously looked like this:

```jsx
import { useRouter } from 'next/router'
const MyComponent = () => {
  const { isReady, query } = useRouter()
  // ...
}
```

Will error when converted over to `next/compat/router`, as `null` cannot be destructured. Instead, developers will be able to take advantage of new hooks:

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/compat/router'
import { useSearchParams } from 'next/navigation'
const MyComponent = () => {
  const router = useRouter() // may be null or a NextRouter instance
  const searchParams = useSearchParams()
  useEffect(() => {
    if (router && !router.isReady) {
      return
    }
    // In `app/`, searchParams will be ready immediately with the values, in
    // `pages/` it will be available after the router is ready.
    const search = searchParams.get('search')
    // ...
  }, [router, searchParams])
  // ...
}
```

This component will now work in both `pages` and `app` directories. When the component is no longer used in `pages`, you can remove the references to the compat router:

```jsx
import { useSearchParams } from 'next/navigation'
const MyComponent = () => {
  const searchParams = useSearchParams()
  // As this component is only used in `app/`, the compat router can be removed.
  const search = searchParams.get('search')
  // ...
}
```

### Using `useRouter` outside of Next.js context in pages

Another specific use case is when rendering components outside of a Next.js application context, such as inside `getServerSideProps` on the `pages` directory. In this case, the compat router can be used to avoid errors:

```jsx
import { renderToString } from 'react-dom/server'
import { useRouter } from 'next/compat/router'
const MyComponent = () => {
  const router = useRouter() // may be null or a NextRouter instance
  // ...
}
export async function getServerSideProps() {
  const renderedComponent = renderToString(<MyComponent />)
  return {
    props: {
      renderedComponent,
    },
  }
}
```

## Potential ESLint errors

Certain methods accessible on the `router` object return a Promise. If you have the ESLint rule, [no-floating-promises](https://typescript-eslint.io/rules/no-floating-promises) enabled, consider disabling it either globally, or for the affected line.

If your application needs this rule, you should either `void` the promise – or use an `async` function, `await` the Promise, then void the function call. **This is not applicable when the method is called from inside an `onClick` handler**.

The affected methods are:

- `router.push`
- `router.replace`
- `router.prefetch`

### Potential solutions

```jsx
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Here you would fetch and return the user
const useUser = () => ({ user: null, loading: false })

export default function Page() {
  const { user, loading } = useUser()
  const router = useRouter()

  useEffect(() => {
    // disable the linting on the next line - This is the cleanest solution
    // eslint-disable-next-line no-floating-promises
    router.push('/login')

    // void the Promise returned by router.push
    if (!(user || loading)) {
      void router.push('/login')
    }
    // or use an async function, await the Promise, then void the function call
    async function handleRouteChange() {
      if (!(user || loading)) {
        await router.push('/login')
      }
    }
    void handleRouteChange()
  }, [user, loading])

  return <p>Redirecting...</p>
}
```

## withRouter

If [`useRouter`](#router-object) is not the best fit for you, `withRouter` can also add the same [`router` object](#router-object) to any component.

### Usage

```jsx
import { withRouter } from 'next/router'

function Page({ router }) {
  return <p>{router.pathname}</p>
}

export default withRouter(Page)
```

### TypeScript

To use class components with `withRouter`, the component needs to accept a router prop:

```tsx
import React from 'react'
import { withRouter, NextRouter } from 'next/router'

interface WithRouterProps {
  router: NextRouter
}

interface MyComponentProps extends WithRouterProps {}

class MyComponent extends React.Component<MyComponentProps> {
  render() {
    return <p>{this.props.router.pathname}</p>
  }
}

export default withRouter(MyComponent)
```


[⬆ Subir al inicio del capítulo](#)

---

<a id="usesearchparams"></a>

## useSearchParams

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions/use-search-params](https://nextjs.org/docs/pages/api-reference/functions/use-search-params)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *API Reference for the useSearchParams hook in the Pages Router.*  

---

`useSearchParams` is a hook that lets you read the current URL's **query string**.

`useSearchParams` returns a **read-only** version of the [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) interface.

```tsx
// Archivo: pages/dashboard.tsx switcher
import { useSearchParams } from 'next/navigation'

export default function Dashboard() {
  const searchParams = useSearchParams()

  if (!searchParams) {
    // Render fallback UI while search params are not yet available
    return null
  }

  const search = searchParams.get('search')

  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>Search: {search}</>
}
```

```jsx
// Archivo: pages/dashboard.js switcher
import { useSearchParams } from 'next/navigation'

export default function Dashboard() {
  const searchParams = useSearchParams()

  if (!searchParams) {
    // Render fallback UI while search params are not yet available
    return null
  }

  const search = searchParams.get('search')

  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  return <>Search: {search}</>
}
```

## Parameters

```tsx
const searchParams = useSearchParams()
```

`useSearchParams` does not take any parameters.

## Returns

`useSearchParams` returns a **read-only** version of the [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams) interface, or `null` during [prerendering](#behavior-during-prerendering).

The interface includes utility methods for reading the URL's query string:

- [`URLSearchParams.get()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/get): Returns the first value associated with the search parameter. For example:

  | URL                  | `searchParams.get("a")`                                                                                         |
  | -------------------- | --------------------------------------------------------------------------------------------------------------- |
  | `/dashboard?a=1`     | `'1'`                                                                                                           |
  | `/dashboard?a=`      | `''`                                                                                                            |
  | `/dashboard?b=3`     | `null`                                                                                                          |
  | `/dashboard?a=1&a=2` | `'1'` _- use [`getAll()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/getAll) to get all values_ |

- [`URLSearchParams.has()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/has): Returns a boolean value indicating if the given parameter exists. For example:

  | URL              | `searchParams.has("a")` |
  | ---------------- | ----------------------- |
  | `/dashboard?a=1` | `true`                  |
  | `/dashboard?b=3` | `false`                 |

- Learn more about other **read-only** methods of [`URLSearchParams`](https://developer.mozilla.org/docs/Web/API/URLSearchParams), including the [`getAll()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/getAll), [`keys()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/keys), [`values()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/values), [`entries()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/entries), [`forEach()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/forEach), and [`toString()`](https://developer.mozilla.org/docs/Web/API/URLSearchParams/toString).

> **Good to know**: `useSearchParams` is a [React Hook](https://react.dev/learn#using-hooks) and cannot be used with classes.

## Behavior

### Behavior during prerendering

For pages that are [statically optimized](/docs/pages/building-your-application/rendering/automatic-static-optimization) (not using `getServerSideProps`), `useSearchParams` will return `null` during prerendering. After hydration, the value will be updated to the actual search params.

This is because search params cannot be known during static generation as they depend on the request.

```tsx
// Archivo: pages/dashboard.tsx switcher
import { useSearchParams } from 'next/navigation'

export default function Dashboard() {
  const searchParams = useSearchParams()

  if (!searchParams) {
    // Return a fallback UI while search params are loading
    // This prevents hydration mismatches
    return <DashboardSkeleton />
  }

  const search = searchParams.get('search')

  return <>Search: {search}</>
}
```

```jsx
// Archivo: pages/dashboard.js switcher
import { useSearchParams } from 'next/navigation'

export default function Dashboard() {
  const searchParams = useSearchParams()

  if (!searchParams) {
    // Return a fallback UI while search params are loading
    // This prevents hydration mismatches
    return <DashboardSkeleton />
  }

  const search = searchParams.get('search')

  return <>Search: {search}</>
}
```

### Using with `getServerSideProps`

When using [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props), the page is server-rendered on each request and `useSearchParams` will return the actual search params immediately:

```tsx
// Archivo: pages/dashboard.tsx switcher
import { useSearchParams } from 'next/navigation'

export default function Dashboard() {
  const searchParams = useSearchParams()

  // With getServerSideProps, this fallback is never rendered because
  // searchParams is always available on the server. However, keeping
  // the fallback allows this component to be reused on other pages
  // that may not use getServerSideProps.
  if (!searchParams) {
    return null
  }

  const search = searchParams.get('search')

  return <>Search: {search}</>
}

export async function getServerSideProps() {
  return { props: {} }
}
```

```jsx
// Archivo: pages/dashboard.js switcher
import { useSearchParams } from 'next/navigation'

export default function Dashboard() {
  const searchParams = useSearchParams()

  // With getServerSideProps, this fallback is never rendered because
  // searchParams is always available on the server. However, keeping
  // the fallback allows this component to be reused on other pages
  // that may not use getServerSideProps.
  if (!searchParams) {
    return null
  }

  const search = searchParams.get('search')

  return <>Search: {search}</>
}

export async function getServerSideProps() {
  return { props: {} }
}
```

## Examples

### Updating search params

You can use the [`useRouter`](/docs/pages/api-reference/functions/use-router) hook to update search params:

```tsx
// Archivo: pages/dashboard.tsx switcher
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export default function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams?.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  if (!searchParams) {
    return null
  }

  return (
    <>
      <p>Sort By</p>
      <button
        onClick={() => {
          router.push(router.pathname + '?' + createQueryString('sort', 'asc'))
        }}
      >
        ASC
      </button>
      <button
        onClick={() => {
          router.push(router.pathname + '?' + createQueryString('sort', 'desc'))
        }}
      >
        DESC
      </button>
    </>
  )
}
```

```jsx
// Archivo: pages/dashboard.js switcher
import { useRouter } from 'next/router'
import { useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export default function Dashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams?.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  if (!searchParams) {
    return null
  }

  return (
    <>
      <p>Sort By</p>
      <button
        onClick={() => {
          router.push(router.pathname + '?' + createQueryString('sort', 'asc'))
        }}
      >
        ASC
      </button>
      <button
        onClick={() => {
          router.push(router.pathname + '?' + createQueryString('sort', 'desc'))
        }}
      >
        DESC
      </button>
    </>
  )
}
```

### Sharing components with App Router

`useSearchParams` from `next/navigation` works in both the Pages Router and App Router. This allows you to create shared components that work in either context:

```tsx
// Archivo: components/search-bar.tsx switcher
import { useSearchParams } from 'next/navigation'

// This component works in both pages/ and app/
export function SearchBar() {
  const searchParams = useSearchParams()

  if (!searchParams) {
    // Fallback for Pages Router during prerendering
    return <input defaultValue="" placeholder="Search..." />
  }

  const search = searchParams.get('search') ?? ''

  return <input defaultValue={search} placeholder="Search..." />
}
```

```jsx
// Archivo: components/search-bar.js switcher
import { useSearchParams } from 'next/navigation'

// This component works in both pages/ and app/
export function SearchBar() {
  const searchParams = useSearchParams()

  if (!searchParams) {
    // Fallback for Pages Router during prerendering
    return <input defaultValue="" placeholder="Search..." />
  }

  const search = searchParams.get('search') ?? ''

  return <input defaultValue={search} placeholder="Search..." />
}
```

> **Good to know**: When using this component in the App Router, wrap it in a `<Suspense>` boundary for [prerendering](/docs/app/api-reference/functions/use-search-params#prerendering) support.

## Version History

| Version   | Changes                       |
| --------- | ----------------------------- |
| `v13.0.0` | `useSearchParams` introduced. |


[⬆ Subir al inicio del capítulo](#)

---

<a id="useragent"></a>

## userAgent

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/functions/userAgent](https://nextjs.org/docs/pages/api-reference/functions/userAgent)  
> 📂 **Sección:** Pages > Api Reference > Functions  
> 📝 **Descripción:** *The userAgent helper extends the Web Request API with additional properties and methods to interact with the user agent object from the request.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="adapterpath"></a>

## adapterPath

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/adapterPath](https://nextjs.org/docs/pages/api-reference/config/next-config-js/adapterPath)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure a custom adapter for Next.js to hook into the build process.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="alloweddevorigins"></a>

## allowedDevOrigins

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/allowedDevOrigins](https://nextjs.org/docs/pages/api-reference/config/next-config-js/allowedDevOrigins)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Use `allowedDevOrigins` to configure additional origins that can request the dev server.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="assetprefix"></a>

## assetPrefix

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/assetPrefix](https://nextjs.org/docs/pages/api-reference/config/next-config-js/assetPrefix)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Learn how to use the assetPrefix config option to configure your CDN.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="basepath"></a>

## basePath

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/basePath](https://nextjs.org/docs/pages/api-reference/config/next-config-js/basePath)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Use `basePath` to deploy a Next.js application under a sub-path of a domain.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="bundlepagesrouterdependencies"></a>

## bundlePagesRouterDependencies

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/bundlePagesRouterDependencies](https://nextjs.org/docs/pages/api-reference/config/next-config-js/bundlePagesRouterDependencies)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Enable automatic dependency bundling for Pages Router*  

---

Enable automatic server-side dependency bundling for Pages Router applications. Matches the automatic dependency bundling in App Router.

```js
// Archivo: next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  bundlePagesRouterDependencies: true,
}

module.exports = nextConfig
```

Explicitly opt-out certain packages from being bundled using the [`serverExternalPackages`](/docs/pages/api-reference/config/next-config-js/serverExternalPackages) option.

## Version History

| Version   | Changes                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------------------- |
| `v15.0.0` | Moved from experimental to stable. Renamed from `bundlePagesExternals` to `bundlePagesRouterDependencies` |


[⬆ Subir al inicio del capítulo](#)

---

<a id="compress"></a>

## compress

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/compress](https://nextjs.org/docs/pages/api-reference/config/next-config-js/compress)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Next.js provides gzip compression to compress rendered content and static files, it only works with the server target. Learn more about it here.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="crossorigin"></a>

## crossOrigin

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/crossOrigin](https://nextjs.org/docs/pages/api-reference/config/next-config-js/crossOrigin)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Use the `crossOrigin` option to add a crossOrigin tag on the `script` tags generated by `next/script` and `next/head`.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="deploymentid"></a>

## deploymentId

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/deploymentId](https://nextjs.org/docs/pages/api-reference/config/next-config-js/deploymentId)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure a deployment identifier used for version skew protection and cache busting.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="devindicators"></a>

## devIndicators

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/devIndicators](https://nextjs.org/docs/pages/api-reference/config/next-config-js/devIndicators)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Optimized pages include an indicator to let you know if it's being statically optimized. You can opt-out of it here.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="distdir"></a>

## distDir

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/distDir](https://nextjs.org/docs/pages/api-reference/config/next-config-js/distDir)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Set a custom build directory to use instead of the default .next directory.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="env"></a>

## env

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/env](https://nextjs.org/docs/pages/api-reference/config/next-config-js/env)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Learn to add and access environment variables in your Next.js application at build time.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="exportpathmap"></a>

## exportPathMap

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/exportPathMap](https://nextjs.org/docs/pages/api-reference/config/next-config-js/exportPathMap)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Customize the pages that will be exported as HTML files when using `next export`.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="generatebuildid"></a>

## generateBuildId

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/generateBuildId](https://nextjs.org/docs/pages/api-reference/config/next-config-js/generateBuildId)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure the build id, which is used to identify the current build in which your application is being served.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="generateetags"></a>

## generateEtags

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/generateEtags](https://nextjs.org/docs/pages/api-reference/config/next-config-js/generateEtags)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Next.js will generate etags for every page by default. Learn more about how to disable etag generation here.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="headers"></a>

## headers

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/headers](https://nextjs.org/docs/pages/api-reference/config/next-config-js/headers)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Add custom HTTP headers to your Next.js app.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="httpagentoptions"></a>

## httpAgentOptions

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/httpAgentOptions](https://nextjs.org/docs/pages/api-reference/config/next-config-js/httpAgentOptions)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Next.js will automatically use HTTP Keep-Alive by default. Learn more about how to disable HTTP Keep-Alive here.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="images"></a>

## images

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/images](https://nextjs.org/docs/pages/api-reference/config/next-config-js/images)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Custom configuration for the next/image loader*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="nextconfigjs-options"></a>

## next.config.js Options

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js](https://nextjs.org/docs/pages/api-reference/config/next-config-js)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Learn about the options available in next.config.js for the Pages Router.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="logging"></a>

## logging

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/logging](https://nextjs.org/docs/pages/api-reference/config/next-config-js/logging)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure logging behavior in the terminal when running Next.js in development mode.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="ondemandentries"></a>

## onDemandEntries

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/onDemandEntries](https://nextjs.org/docs/pages/api-reference/config/next-config-js/onDemandEntries)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure how Next.js will dispose and keep in memory pages created in development.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="optimizepackageimports"></a>

## optimizePackageImports

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/optimizePackageImports](https://nextjs.org/docs/pages/api-reference/config/next-config-js/optimizePackageImports)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *API Reference for optimizePackageImports Next.js Config Option*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="output"></a>

## output

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/output](https://nextjs.org/docs/pages/api-reference/config/next-config-js/output)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Next.js automatically traces which files are needed by each page to allow for easy deployment of your application. Learn how it works here.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="pageextensions"></a>

## pageExtensions

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/pageExtensions](https://nextjs.org/docs/pages/api-reference/config/next-config-js/pageExtensions)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Extend the default page extensions used by Next.js when resolving pages in the Pages Router.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="poweredbyheader"></a>

## poweredByHeader

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/poweredByHeader](https://nextjs.org/docs/pages/api-reference/config/next-config-js/poweredByHeader)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Next.js will add the `x-powered-by` header by default. Learn to opt-out of it here.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="productionbrowsersourcemaps"></a>

## productionBrowserSourceMaps

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/productionBrowserSourceMaps](https://nextjs.org/docs/pages/api-reference/config/next-config-js/productionBrowserSourceMaps)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Enables browser source map generation during the production build.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="experimentalproxyclientmaxbodysize"></a>

## experimental.proxyClientMaxBodySize

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/proxyClientMaxBodySize](https://nextjs.org/docs/pages/api-reference/config/next-config-js/proxyClientMaxBodySize)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure the maximum request body size when using proxy.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="reactstrictmode"></a>

## reactStrictMode

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/reactStrictMode](https://nextjs.org/docs/pages/api-reference/config/next-config-js/reactStrictMode)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *The complete Next.js runtime is now Strict Mode-compliant, learn how to opt-in*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="redirects"></a>

## redirects

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/redirects](https://nextjs.org/docs/pages/api-reference/config/next-config-js/redirects)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Add redirects to your Next.js app.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="rewrites"></a>

## rewrites

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/rewrites](https://nextjs.org/docs/pages/api-reference/config/next-config-js/rewrites)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Add rewrites to your Next.js app.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="serverexternalpackages"></a>

## serverExternalPackages

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/serverExternalPackages](https://nextjs.org/docs/pages/api-reference/config/next-config-js/serverExternalPackages)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Opt-out specific dependencies from the dependency bundling enabled by `bundlePagesRouterDependencies`.*  

---

Opt-out specific dependencies from being included in the automatic bundling of the [`bundlePagesRouterDependencies`](/docs/pages/api-reference/config/next-config-js/bundlePagesRouterDependencies) option.

These pages will then use native Node.js `require` to resolve the dependency.

```js
// Archivo: next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@acme/ui'],
}

module.exports = nextConfig
```

Next.js includes a [short list of popular packages](https://github.com/vercel/next.js/blob/canary/packages/next/src/lib/server-external-packages.jsonc) that currently are working on compatibility and automatically opt-ed out:

- `@alinea/generated`
- `@appsignal/nodejs`
- `@aws-sdk/client-s3`
- `@aws-sdk/s3-presigned-post`
- `@blockfrost/blockfrost-js`
- `@highlight-run/node`
- `@huggingface/transformers`
- `@jpg-store/lucid-cardano`
- `@libsql/client`
- `@mikro-orm/core`
- `@mikro-orm/knex`
- `@node-rs/argon2`
- `@node-rs/bcrypt`
- `@prisma/client`
- `@react-pdf/renderer`
- `@sentry/profiling-node`
- `@sparticuz/chromium`
- `@sparticuz/chromium-min`
- `@statsig/statsig-node-core`
- `@swc/core`
- `@xenova/transformers`
- `@zenstackhq/runtime`
- `argon2`
- `autoprefixer`
- `aws-crt`
- `bcrypt`
- `better-sqlite3`
- `canvas`
- `chromadb-default-embed`
- `config`
- `cpu-features`
- `cypress`
- `dd-trace`
- `eslint`
- `express`
- `firebase-admin`
- `htmlrewriter`
- `import-in-the-middle`
- `isolated-vm`
- `jest`
- `jsdom`
- `keyv`
- `libsql`
- `mdx-bundler`
- `mongodb`
- `mongoose`
- `newrelic`
- `next-mdx-remote`
- `next-seo`
- `node-cron`
- `node-pty`
- `node-web-audio-api`
- `onnxruntime-node`
- `oslo`
- `pg`
- `pino`
- `pino-pretty`
- `pino-roll`
- `playwright`
- `playwright-core`
- `postcss`
- `prettier`
- `prisma`
- `puppeteer-core`
- `puppeteer`
- `ravendb`
- `require-in-the-middle`
- `rimraf`
- `sharp`
- `shiki`
- `sqlite3`
- `thread-stream`
- `ts-morph`
- `ts-node`
- `typescript`
- `vscode-oniguruma`
- `webpack`
- `websocket`
- `zeromq`


[⬆ Subir al inicio del capítulo](#)

---

<a id="skipproxyurlnormalize"></a>

## skipProxyUrlNormalize

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/skipProxyUrlNormalize](https://nextjs.org/docs/pages/api-reference/config/next-config-js/skipProxyUrlNormalize)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Let Proxy see the original request instead of Next.js's normalized version. Formerly skipMiddlewareUrlNormalize.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="skiptrailingslashredirect"></a>

## skipTrailingSlashRedirect

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/skipTrailingSlashRedirect](https://nextjs.org/docs/pages/api-reference/config/next-config-js/skipTrailingSlashRedirect)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Disable the automatic trailing slash redirects so you can handle trailing slashes yourself in Proxy.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="trailingslash"></a>

## trailingSlash

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/trailingSlash](https://nextjs.org/docs/pages/api-reference/config/next-config-js/trailingSlash)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure Next.js pages to resolve with or without a trailing slash.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="transpilepackages"></a>

## transpilePackages

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/transpilePackages](https://nextjs.org/docs/pages/api-reference/config/next-config-js/transpilePackages)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Automatically transpile and bundle dependencies from local packages (like monorepos) or from external dependencies (`node_modules`).*  

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

<a id="typescript"></a>

## typescript

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/typescript](https://nextjs.org/docs/pages/api-reference/config/next-config-js/typescript)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Next.js reports TypeScript errors by default. Learn to opt-out of this behavior here.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="urlimports"></a>

## urlImports

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/urlImports](https://nextjs.org/docs/pages/api-reference/config/next-config-js/urlImports)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure Next.js to allow importing modules from external URLs.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="uselightningcss"></a>

## useLightningcss

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/useLightningcss](https://nextjs.org/docs/pages/api-reference/config/next-config-js/useLightningcss)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Enable experimental support for Lightning CSS.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="usetypescriptcli"></a>

## useTypeScriptCli

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/useTypeScriptCli](https://nextjs.org/docs/pages/api-reference/config/next-config-js/useTypeScriptCli)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Run the project-local TypeScript CLI for type checking during production builds.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="webvitalsattribution"></a>

## webVitalsAttribution

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/webVitalsAttribution](https://nextjs.org/docs/pages/api-reference/config/next-config-js/webVitalsAttribution)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Learn how to use the webVitalsAttribution option to pinpoint the source of Web Vitals issues.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="custom-webpack-config"></a>

## Custom Webpack Config

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/webpack](https://nextjs.org/docs/pages/api-reference/config/next-config-js/webpack)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Learn how to customize the webpack config used by Next.js*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="typescript"></a>

## TypeScript

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/typescript](https://nextjs.org/docs/pages/api-reference/config/typescript)  
> 📂 **Sección:** Pages > Api Reference > Config  
> 📝 **Descripción:** *Next.js provides a TypeScript-first development experience for building your React application.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="eslint"></a>

## ESLint

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/eslint](https://nextjs.org/docs/pages/api-reference/config/eslint)  
> 📂 **Sección:** Pages > Api Reference > Config  
> 📝 **Descripción:** *Next.js reports ESLint errors and warnings during builds by default. Learn how to opt-out of this behavior here.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="configuration"></a>

## Configuration

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config](https://nextjs.org/docs/pages/api-reference/config)  
> 📂 **Sección:** Pages > Api Reference > Config  
> 📝 **Descripción:** *Learn how to configure your Next.js application.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="create-next-app-cli"></a>

## create-next-app CLI

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/cli/create-next-app](https://nextjs.org/docs/pages/api-reference/cli/create-next-app)  
> 📂 **Sección:** Pages > Api Reference > Cli  
> 📝 **Descripción:** *Create Next.js apps using one command with the create-next-app CLI.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="cli"></a>

## CLI

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/cli](https://nextjs.org/docs/pages/api-reference/cli)  
> 📂 **Sección:** Pages > Api Reference > Cli  
> 📝 **Descripción:** *API Reference for the Next.js Command Line Interface (CLI) tools.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="next-cli"></a>

## next CLI

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/cli/next](https://nextjs.org/docs/pages/api-reference/cli/next)  
> 📂 **Sección:** Pages > Api Reference > Cli  
> 📝 **Descripción:** *Learn how to run and build your application with the Next.js CLI.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="configuration"></a>

## Configuration

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/adapters/configuration](https://nextjs.org/docs/pages/api-reference/adapters/configuration)  
> 📂 **Sección:** Pages > Api Reference > Adapters  
> 📝 **Descripción:** *Configure `adapterPath` or `NEXT_ADAPTER_PATH` to use a custom deployment adapter.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="creating-an-adapter"></a>

## Creating an Adapter

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/adapters/creating-an-adapter](https://nextjs.org/docs/pages/api-reference/adapters/creating-an-adapter)  
> 📂 **Sección:** Pages > Api Reference > Adapters  
> 📝 **Descripción:** *Create an adapter module that implements the `NextAdapter` interface.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="api-reference"></a>

## API Reference

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/adapters/api-reference](https://nextjs.org/docs/pages/api-reference/adapters/api-reference)  
> 📂 **Sección:** Pages > Api Reference > Adapters  
> 📝 **Descripción:** *Reference for `modifyConfig` and `onBuildComplete` in the `NextAdapter` interface.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="testing-adapters"></a>

## Testing Adapters

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/adapters/testing-adapters](https://nextjs.org/docs/pages/api-reference/adapters/testing-adapters)  
> 📂 **Sección:** Pages > Api Reference > Adapters  
> 📝 **Descripción:** *Validate adapters with the Next.js compatibility test harness and custom lifecycle scripts.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="routing-with-nextrouting"></a>

## Routing with @next/routing

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/adapters/routing-with-next-routing](https://nextjs.org/docs/pages/api-reference/adapters/routing-with-next-routing)  
> 📂 **Sección:** Pages > Api Reference > Adapters  
> 📝 **Descripción:** *Use `@next/routing` to apply Next.js route matching behavior in adapters.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="runtime-integration"></a>

## Runtime Integration

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/adapters/runtime-integration](https://nextjs.org/docs/pages/api-reference/adapters/runtime-integration)  
> 📂 **Sección:** Pages > Api Reference > Adapters  
> 📝 **Descripción:** *Understand how build-time adapters and runtime cache interfaces work together.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="invoking-entrypoints"></a>

## Invoking Entrypoints

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/adapters/invoking-entrypoints](https://nextjs.org/docs/pages/api-reference/adapters/invoking-entrypoints)  
> 📂 **Sección:** Pages > Api Reference > Adapters  
> 📝 **Descripción:** *Invoke Node.js and Edge build entrypoints with adapter runtime context.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="output-types"></a>

## Output Types

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/adapters/output-types](https://nextjs.org/docs/pages/api-reference/adapters/output-types)  
> 📂 **Sección:** Pages > Api Reference > Adapters  
> 📝 **Descripción:** *Reference for all build output types exposed to adapters.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="routing-information"></a>

## Routing Information

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/adapters/routing-information](https://nextjs.org/docs/pages/api-reference/adapters/routing-information)  
> 📂 **Sección:** Pages > Api Reference > Adapters  
> 📝 **Descripción:** *Reference for routing phases and route fields exposed in `onBuildComplete`.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="use-cases"></a>

## Use Cases

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/adapters/use-cases](https://nextjs.org/docs/pages/api-reference/adapters/use-cases)  
> 📂 **Sección:** Pages > Api Reference > Adapters  
> 📝 **Descripción:** *Common patterns and examples for deployment adapter implementations.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="adapters"></a>

## Adapters

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/adapters](https://nextjs.org/docs/pages/api-reference/adapters)  
> 📂 **Sección:** Pages > Api Reference > Adapters  
> 📝 **Descripción:** *Build deployment adapters for Next.js platforms and infrastructure.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="edge-runtime"></a>

## Edge Runtime

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/edge](https://nextjs.org/docs/pages/api-reference/edge)  
> 📂 **Sección:** Pages > Api Reference  
> 📝 **Descripción:** *API Reference for the Edge Runtime.*  

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

<a id="api-reference"></a>

## API Reference

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference](https://nextjs.org/docs/pages/api-reference)  
> 📂 **Sección:** Pages > Api Reference  
> 📝 **Descripción:** *Next.js API Reference for the Pages Router.*  

---




[⬆ Subir al inicio del capítulo](#)

---

<a id="pages-router"></a>

## Pages Router

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages](https://nextjs.org/docs/pages)  
> 📂 **Sección:** Pages  
> 📝 **Descripción:** *Before Next.js 13, the Pages Router was the main way to create routes in Next.js with an intuitive file-system router.*  

---

> You're viewing the documentation for the Pages Router. See the [App Router](/docs/app) documentation for the latest features.

The **Pages Router** uses an intuitive file-system router to map each file to a route.

Before Next.js 13, the Pages Router was the main way to create routes in Next.js. It's still supported in newer versions of Next.js, but we recommend migrating to the new [App Router](/docs/app) to leverage React's latest features.


[⬆ Subir al inicio del capítulo](#)

---

