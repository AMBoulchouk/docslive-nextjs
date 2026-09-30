# 📖 Next.js v16.3.7 — Libro Guía Definitivo

> **Compilación de la Documentación Oficial de Next.js**  
> **Versión de referencia:** v16.3.7 (Última versión estable)  
> **Fuente:** [https://nextjs.org/docs](https://nextjs.org/docs)  
> **Total de Secciones:** 456 archivos  

Este libro guía recopila de forma estructurada, limpia y navegable toda la documentación oficial de Next.js 16.3.7. Cada sección contiene código TypeScript/JavaScript verificado, explicaciones de arquitectura y enlaces a la documentación oficial en vivo.

---

## 📚 Índice de Capítulos del Libro

### [Capítulo 1: Primeros Pasos y Configuración Inicial](./01_PRIMEROS_PASOS_Y_CONFIGURACION.md)
*Instalación, estructura de proyectos, archivos de configuración, TypeScript, ESLint y primeros conceptos.*

### [Capítulo 2: Enrutamiento, Layouts y Navegación (App Router)](./02_ENRUTAMIENTO_LAYOUTS_Y_NAVEGACION.md)
*Layouts anidados, páginas, navegación dinámica, Link component, Route Handlers y organización de rutas.*

### [Capítulo 3: Server Components, Client Components y Renderizado](./03_SERVER_Y_CLIENT_COMPONENTS_RENDERIZADO.md)
*React Server Components (RSC), Client Components, patrones de composición, Streaming y Partial Prerendering (PPR).*

### [Capítulo 4: Data Fetching, Caching Moderno y Revalidación](./04_DATA_FETCHING_CACHING_Y_REVALIDACION.md)
*El nuevo modelo de caché de Next.js 16: Cache Components, fetch caching, revalidación bajo demanda y CDN caching.*

### [Capítulo 5: Server Actions, Formularios y Mutación de Datos](./05_SERVER_ACTIONS_FORMULARIOS_Y_MUTACIONES.md)
*Manejo de mutaciones con Server Actions, estados pendientes, UI optimista, manejo de errores y validación.*

### [Capítulo 6: Directivas de Nueva Generación en Next.js 16](./06_DIRECTIVAS_AVANZADAS_NEXT16.md)
*Guía exhaustiva de directivas: 'use cache', 'use cache: private', 'use cache: remote', 'use client' y 'use server'.*

### [Capítulo 7: Optimización de Assets: Imágenes, Fuentes, Scripts y SEO](./07_OPTIMIZACION_ASSETS_IMAGENES_FUENTES_Y_SEO.md)
*next/image, next/font, Scripts de terceros, Metadata, Open Graph, Sitemap y Robots.txt.*

### [Capítulo 8: Seguridad, Autenticación y Protección de Datos](./08_SEGURIDAD_AUTENTICACION_Y_DATOS.md)
*Autenticación con Cache Components, Content Security Policy (CSP), protección contra ataques, cookies y middleware.*

### [Capítulo 9: Patrones Avanzados, Agentes de IA y Arquitectura BFF](./09_PATRONES_AVANZADOS_E_IA.md)
*Desarrollo de Agentes de IA en Next.js, Backend-for-Frontend (BFF), internacionalización, testing y observabilidad.*

### [Capítulo 10: Despliegue, Rendimiento en Producción y Turbopack](./10_DESPLIEGUE_PRODUCCION_Y_TURBOPACK.md)
*Compilación con Turbopack, despliegue en Vercel, Docker y servidores propios, CI build caching y servidor personalizado.*

### [Capítulo 11: Referencia de API Completa (App Router)](./11_API_REFERENCE_APP_ROUTER.md)
*Catálogo exhaustivo de componentes integrados, convenciones de archivos, funciones de servidor, hooks y configuración.*

### [Capítulo 12: Pages Router (Soporte Legacy) y Estrategias de Migración](./12_PAGES_ROUTER_GUIA_Y_MIGRACION.md)
*getStaticProps, getServerSideProps, getInitialProps, API Routes y guía paso a paso para migrar hacia App Router.*

### [Capítulo 13: Arquitectura Interna, Compilador Next.js y Comunidad](./13_ARQUITECTURA_INTERNA_Y_COMPILADOR.md)
*Next.js Compiler (SWC / Rust), Fast Refresh, compatibilidad con navegadores, guías de contribución y rspack.*

---

## 🗂️ Índice Detallado por Secciones Oficiales

### 📁 App Router (01-app) (283 temas)

- [**Installation**](../docs_markdown/01-app/01-getting-started/01-installation.md) — *Learn how to create a new Next.js application with the `create-next-app` CLI, and set up TypeScript, ESLint, and Module Path Aliases.*
- [**Project structure and organization**](../docs_markdown/01-app/01-getting-started/02-project-structure.md) — *Learn the folder and file conventions in Next.js, and how to organize your project.*
- [**Layouts and Pages**](../docs_markdown/01-app/01-getting-started/03-layouts-and-pages.md) — *Learn how to create your first pages and layouts, and link between them with the Link component.*
- [**Linking and Navigating**](../docs_markdown/01-app/01-getting-started/04-linking-and-navigating.md) — *Learn how the built-in navigation optimizations work, including prefetching, prerendering, and client-side navigation, and how to optimize navigation for dynamic routes and slow networks.*
- [**Server and Client Components**](../docs_markdown/01-app/01-getting-started/05-server-and-client-components.md) — *Learn how you can use React Server and Client Components to render parts of your application on the server or the client.*
- [**Fetching Data**](../docs_markdown/01-app/01-getting-started/06-fetching-data.md) — *Learn how to fetch data and stream content that depends on data.*
- [**Mutating Data**](../docs_markdown/01-app/01-getting-started/07-mutating-data.md) — *Learn how to mutate data using Server Functions and Server Actions in Next.js.*
- [**Caching**](../docs_markdown/01-app/01-getting-started/08-caching.md) — *Learn how to cache data and UI in Next.js*
- [**Revalidating**](../docs_markdown/01-app/01-getting-started/09-revalidating.md) — *Learn how to revalidate cached data using time-based and on-demand strategies.*
- [**Error Handling**](../docs_markdown/01-app/01-getting-started/10-error-handling.md) — *Learn how to display expected errors and handle uncaught exceptions.*
- [**CSS**](../docs_markdown/01-app/01-getting-started/11-css.md) — *Learn about the different ways to add CSS to your application, including Tailwind CSS, CSS Modules, Global CSS, and more.*
- [**Image Optimization**](../docs_markdown/01-app/01-getting-started/12-images.md) — *Learn how to optimize images in Next.js*
- [**Font Optimization**](../docs_markdown/01-app/01-getting-started/13-fonts.md) — *Learn how to optimize fonts in Next.js*
- [**Metadata and OG images**](../docs_markdown/01-app/01-getting-started/14-metadata-and-og-images.md) — *Learn how to add metadata to your pages and create dynamic OG images.*
- [**Route Handlers**](../docs_markdown/01-app/01-getting-started/15-route-handlers.md) — *Create custom request handlers with Next.js Route Handlers using the Web Request and Response APIs.*
- [**Proxy**](../docs_markdown/01-app/01-getting-started/16-proxy.md) — *Use Next.js Proxy to rewrite, redirect, modify headers, or respond directly before a request completes.*
- [**Deploying**](../docs_markdown/01-app/01-getting-started/17-deploying.md) — *Learn how to deploy your Next.js application.*
- [**Upgrading**](../docs_markdown/01-app/01-getting-started/18-upgrading.md) — *Learn how to upgrade your Next.js application to the latest version or canary.*
- [**Getting Started**](../docs_markdown/01-app/01-getting-started/index.md) — *Learn how to create full-stack web applications with the Next.js App Router.*
- [**Adopting Partial Prefetching**](../docs_markdown/01-app/02-guides/adopting-partial-prefetching.md) — *Learn how to enable Partial Prefetching and what changes for `<Link>`.*
- [**How to set up your Next.js project for AI coding agents**](../docs_markdown/01-app/02-guides/ai-agents.md) — *Learn how to configure your Next.js project so AI coding agents use up-to-date documentation instead of outdated training data.*
- [**How to add analytics to your Next.js application**](../docs_markdown/01-app/02-guides/analytics.md) — *Measure and track page performance using Next.js Speed Insights*
- [**How to implement authentication with Cache Components**](../docs_markdown/01-app/02-guides/authentication-with-cache-components.md) — *Learn how to read the user session, show authenticated UI without slowing down the page, and cache data derived from the session when Cache Components is enabled.*
- [**How to implement authentication in Next.js**](../docs_markdown/01-app/02-guides/authentication.md) — *Learn how to implement authentication in your Next.js application.*
- [**How to use Next.js as a backend for your frontend**](../docs_markdown/01-app/02-guides/backend-for-frontend.md) — *Learn how to use Next.js as a backend framework*
- [**Building your application**](../docs_markdown/01-app/02-guides/building.md) — *Learn what happens when you run next build and how to read the build output.*
- [**Caching and Revalidating (Previous Model)**](../docs_markdown/01-app/02-guides/caching-without-cache-components.md) — *Learn how to cache and revalidate data using fetch options, unstable_cache, and route segment configs for projects not using Cache Components.*
- [**Using a CDN with Next.js**](../docs_markdown/01-app/02-guides/cdn-caching.md) — *Learn how CDN caching works with Next.js, including what works today, cache variability, and the direction toward pathname-based cache keying.*
- [**How to configure Continuous Integration (CI) build caching**](../docs_markdown/01-app/02-guides/ci-build-caching.md) — *Learn how to configure CI to cache Next.js builds*
- [**Client-side data fetching**](../docs_markdown/01-app/02-guides/client-side-data-fetching/index.md) — *Fetch data in Client Components with a data-fetching library, optionally provide initial data from a Server Component, and coordinate server and client caches.*
- [**How to fetch client-side data with SWR**](../docs_markdown/01-app/02-guides/client-side-data-fetching/swr.md) — *Fetch client-side data with SWR, optionally provide initial data from a Server Component, and coordinate server and client caches.*
- [**How to fetch client-side data with TanStack Query**](../docs_markdown/01-app/02-guides/client-side-data-fetching/tanstack-query.md) — *Fetch client-side data with TanStack Query, optionally provide initial data from a Server Component, and coordinate server and client caches.*
- [**How to set a Content Security Policy (CSP) for your Next.js application**](../docs_markdown/01-app/02-guides/content-security-policy.md) — *Learn how to set a Content Security Policy (CSP) for your Next.js application.*
- [**How to use CSS-in-JS libraries**](../docs_markdown/01-app/02-guides/css-in-js.md) — *Use CSS-in-JS libraries with Next.js*
- [**How to set up a custom server in Next.js**](../docs_markdown/01-app/02-guides/custom-server.md) — *Start a Next.js app programmatically using a custom server.*
- [**How to think about data security in Next.js**](../docs_markdown/01-app/02-guides/data-security.md) — *Learn the built-in data security features in Next.js and learn best practices for protecting your application's data.*
- [**How to use debugging tools with Next.js**](../docs_markdown/01-app/02-guides/debugging.md) — *Learn how to debug your Next.js application with VS Code, Chrome DevTools, or Firefox DevTools.*
- [**Deploying Next.js to different platforms**](../docs_markdown/01-app/02-guides/deploying-to-platforms.md) — *Understand which Next.js features require specific platform capabilities and how to choose the right deployment target.*
- [**How to preview content with Draft Mode in Next.js**](../docs_markdown/01-app/02-guides/draft-mode.md) — *Bypass Next.js caching for a request so editors can preview unpublished content from a headless CMS.*
- [**How to use environment variables in Next.js**](../docs_markdown/01-app/02-guides/environment-variables.md) — *Learn to add and access environment variables in your Next.js application.*
- [**How to create forms with Server Actions**](../docs_markdown/01-app/02-guides/forms.md) — *Learn how to create forms in Next.js with React Server Actions.*
- [**How revalidation works in Next.js**](../docs_markdown/01-app/02-guides/how-revalidation-works.md) — *A deep dive into how Next.js revalidates cached content, including the tag system, cache consistency, and multi-instance coordination.*
- [**Incremental Static Regeneration with Cache Components**](../docs_markdown/01-app/02-guides/incremental-static-regeneration-cache-components.md) — *Learn how to prerender a subset of dynamic routes, serve App Shells for the rest, and upgrade them after the first visit.*
- [**How to implement Incremental Static Regeneration (ISR)**](../docs_markdown/01-app/02-guides/incremental-static-regeneration.md) — *Learn how to create or update static pages at runtime with Incremental Static Regeneration.*
- [**Guides**](../docs_markdown/01-app/02-guides/index.md) — *Learn how to implement common patterns and real-world use cases using Next.js*
- [**Ensuring instant navigations**](../docs_markdown/01-app/02-guides/instant-navigation.md) — *Learn how to structure your app to prefetch and prerender more content, providing instant page loads and client navigations.*
- [**How to set up instrumentation**](../docs_markdown/01-app/02-guides/instrumentation.md) — *Learn how to use instrumentation to run code at server startup in your Next.js app*
- [**Building interactive apps**](../docs_markdown/01-app/02-guides/interactive-apps.md) — *Learn how to build responsive interactions with Server Functions, transitions, optimistic UI, and pending feedback.*
- [**Internationalization**](../docs_markdown/01-app/02-guides/internationalization.md) — *Add support for multiple languages with internationalized routing and localized content.*
- [**How to implement JSON-LD in your Next.js application**](../docs_markdown/01-app/02-guides/json-ld.md) — *Learn how to add JSON-LD to your Next.js application to describe your content to search engines and AI.*
- [**How to lazy load Client Components and libraries**](../docs_markdown/01-app/02-guides/lazy-loading.md) — *Lazy load imported libraries and React Components to improve your application's loading performance.*
- [**How to optimize your local development environment**](../docs_markdown/01-app/02-guides/local-development.md) — *Learn how to optimize your local development environment with Next.js.*
- [**Enabling Next.js MCP Server for Coding Agents**](../docs_markdown/01-app/02-guides/mcp.md) — *Learn how to use Next.js MCP support to allow coding agents access to your application state*
- [**How to use markdown and MDX in Next.js**](../docs_markdown/01-app/02-guides/mdx.md) — *Learn how to configure MDX and use it in your Next.js apps.*
- [**How to optimize memory usage**](../docs_markdown/01-app/02-guides/memory-usage.md) — *Optimize memory used by your application in development and production.*
- [**Migrating to Cache Components**](../docs_markdown/01-app/02-guides/migrating-to-cache-components.md) — *Learn how to migrate from route segment configs to Cache Components in Next.js.*
- [**How to migrate from Pages to the App Router**](../docs_markdown/01-app/02-guides/migrating/app-router-migration.md) — *Learn how to upgrade your existing Next.js application from the Pages Router to the App Router.*
- [**How to migrate from Create React App to Next.js**](../docs_markdown/01-app/02-guides/migrating/from-create-react-app.md) — *Learn how to migrate your existing React application from Create React App to Next.js.*
- [**How to migrate from Vite to Next.js**](../docs_markdown/01-app/02-guides/migrating/from-vite.md) — *Learn how to migrate your existing React application from Vite to Next.js.*
- [**Migrating**](../docs_markdown/01-app/02-guides/migrating/index.md) — *Learn how to migrate from popular frameworks to Next.js*
- [**How to build multi-tenant apps in Next.js**](../docs_markdown/01-app/02-guides/multi-tenant.md) — *Learn how to build multi-tenant apps with the App Router.*
- [**How to build micro-frontends using multi-zones and Next.js**](../docs_markdown/01-app/02-guides/multi-zones.md) — *Learn how to build micro-frontends using Next.js Multi-Zones to deploy multiple Next.js apps under a single domain.*
- [**Handling connectivity drops**](../docs_markdown/01-app/02-guides/offline-support.md) — *How a Next.js app can recover when the network drops mid-fetch or mid-Server Action, and how to communicate that state to the user.*
- [**How to set up instrumentation with OpenTelemetry**](../docs_markdown/01-app/02-guides/open-telemetry.md) — *Learn how to instrument your Next.js app with OpenTelemetry.*
- [**Optimizing prefetching**](../docs_markdown/01-app/02-guides/optimizing-prefetching.md) — *Resolve per-link URL data with the prefetch prop, or include session data in the App Shell.*
- [**Optimizing package bundling**](../docs_markdown/01-app/02-guides/package-bundling.md) — *Learn how to analyze and optimize your application's server and client bundles with the Next.js Bundle Analyzer for Turbopack, and the `@next/bundle-analyzer` plugin for Webpack.*
- [**Implementing Partial Prerendering on your platform**](../docs_markdown/01-app/02-guides/ppr-platform-guide.md) — *A guide for platform engineers on implementing PPR support, from basic origin rendering to optimized CDN integration.*
- [**Prefetching**](../docs_markdown/01-app/02-guides/prefetching.md) — *Learn how to configure prefetching in Next.js*
- [**How Next.js preserves UI state with Activity**](../docs_markdown/01-app/02-guides/preserving-ui-state.md) — *Learn how React's Activity component preserves UI state across navigations in Next.js and how to control what resets.*
- [**How to prevent flash before hydration**](../docs_markdown/01-app/02-guides/preventing-flash-before-hydration.md) — *Learn how to correct server-rendered content before the browser paints, avoiding visible flash when the page hydrates.*
- [**How to optimize your Next.js application for production**](../docs_markdown/01-app/02-guides/production-checklist.md) — *Recommendations to ensure the best performance and user experience before taking your Next.js application to production.*
- [**How to build a Progressive Web Application (PWA) with Next.js**](../docs_markdown/01-app/02-guides/progressive-web-apps.md) — *Learn how to build a Progressive Web Application (PWA) with Next.js.*
- [**Building public pages**](../docs_markdown/01-app/02-guides/public-static-pages.md) — *Learn how to build public, "static" pages that share data across users, such as landing pages, list pages (products, blogs, etc.), marketing and news sites.*
- [**How to handle redirects in Next.js**](../docs_markdown/01-app/02-guides/redirecting.md) — *Learn the different ways to handle redirects in Next.js.*
- [**Next.js Rendering Philosophy**](../docs_markdown/01-app/02-guides/rendering-philosophy.md) — *Learn how Next.js treats static and dynamic rendering as a spectrum at the component level, and what this means for deployment.*
- [**How to use Sass**](../docs_markdown/01-app/02-guides/sass.md) — *Style your Next.js application using Sass.*
- [**How to load and optimize scripts**](../docs_markdown/01-app/02-guides/scripts.md) — *Optimize 3rd party scripts with the built-in Script component.*
- [**How to self-host your Next.js application**](../docs_markdown/01-app/02-guides/self-hosting.md) — *Learn how to self-host your Next.js application on a Node.js server, Docker image, or static HTML files (static exports).*
- [**Server Actions and Mutations**](../docs_markdown/01-app/02-guides/server-actions.md) — *How Server Actions work in Next.js, including the single-roundtrip response model, sequential dispatch, security, and caching integration.*
- [**The Server and Client Boundary**](../docs_markdown/01-app/02-guides/server-and-client-boundary.md) — *Learn where Server and Client Components run in the App Router and how the boundary between them works.*
- [**How to build single-page applications with Next.js**](../docs_markdown/01-app/02-guides/single-page-applications.md) — *Next.js fully supports building Single-Page Applications (SPAs).*
- [**How to create a static export of your Next.js application**](../docs_markdown/01-app/02-guides/static-exports.md) — *Next.js enables starting as a static site or Single-Page Application (SPA), then later optionally upgrading to use features that require a server.*
- [**Streaming**](../docs_markdown/01-app/02-guides/streaming.md) — *Learn how streaming works in Next.js and how to use it to progressively render UI as data becomes available.*
- [**How to install Tailwind CSS v3 in your Next.js application**](../docs_markdown/01-app/02-guides/tailwind-v3-css.md) — *Style your Next.js Application using Tailwind CSS v3 for broader browser support.*
- [**How to set up Cypress with Next.js**](../docs_markdown/01-app/02-guides/testing/cypress.md) — *Learn how to set up Cypress with Next.js for End-to-End (E2E) and Component Testing.*
- [**Testing**](../docs_markdown/01-app/02-guides/testing/index.md) — *Learn how to set up Next.js with four commonly used testing tools — Cypress, Playwright, Vitest, and Jest.*
- [**How to set up Jest with Next.js**](../docs_markdown/01-app/02-guides/testing/jest.md) — *Learn how to set up Jest with Next.js for Unit Testing and Snapshot Testing.*
- [**How to set up Playwright with Next.js**](../docs_markdown/01-app/02-guides/testing/playwright.md) — *Learn how to set up Playwright with Next.js for End-to-End (E2E) Testing.*
- [**How to set up Vitest with Next.js**](../docs_markdown/01-app/02-guides/testing/vitest.md) — *Learn how to set up Vitest with Next.js for Unit Testing.*
- [**How to optimize third-party libraries**](../docs_markdown/01-app/02-guides/third-party-libraries.md) — *Optimize the performance of third-party libraries in your application with the `@next/third-parties` package.*
- [**Codemods**](../docs_markdown/01-app/02-guides/upgrading/codemods.md) — *Use codemods to upgrade your Next.js codebase when new features are released.*
- [**Upgrade Guides**](../docs_markdown/01-app/02-guides/upgrading/index.md) — *Learn how to upgrade to the latest versions of Next.js.*
- [**How to upgrade to version 14**](../docs_markdown/01-app/02-guides/upgrading/version-14.md) — *Upgrade your Next.js Application from Version 13 to 14.*
- [**How to upgrade to version 15**](../docs_markdown/01-app/02-guides/upgrading/version-15.md) — *Upgrade your Next.js Application from Version 14 to 15.*
- [**How to upgrade to version 16**](../docs_markdown/01-app/02-guides/upgrading/version-16.md) — *Upgrade your Next.js Application from Version 15 to 16.*
- [**How to use and optimize videos**](../docs_markdown/01-app/02-guides/videos.md) — *Recommendations and best practices for optimizing videos in your Next.js application.*
- [**Designing view transitions**](../docs_markdown/01-app/02-guides/view-transitions.md) — *Learn how to use view transitions to communicate meaning during navigation, loading, and content changes in a Next.js app.*
- [**Directives**](../docs_markdown/01-app/03-api-reference/01-directives/index.md) — *Learn how React and Next.js directives define client entry points, Server Functions, and cached output.*
- [**use cache: private**](../docs_markdown/01-app/03-api-reference/01-directives/use-cache-private.md) — *Learn how to use the "use cache: private" directive to cache functions that access runtime request APIs.*
- [**use cache: remote**](../docs_markdown/01-app/03-api-reference/01-directives/use-cache-remote.md) — *Learn how to use the "use cache: remote" directive for persistent, shared caching using remote cache handlers.*
- [**use cache**](../docs_markdown/01-app/03-api-reference/01-directives/use-cache.md) — *Learn how to use the "use cache" directive to cache data in your Next.js application.*
- [**use client**](../docs_markdown/01-app/03-api-reference/01-directives/use-client.md) — *Learn how to use the use client directive to render a component on the client.*
- [**use server**](../docs_markdown/01-app/03-api-reference/01-directives/use-server.md) — *Learn how to use the use server directive to execute code on the server.*
- [**Font Module**](../docs_markdown/01-app/03-api-reference/02-components/font.md) — *Optimizing loading web fonts with the built-in `next/font` loaders.*
- [**Form Component**](../docs_markdown/01-app/03-api-reference/02-components/form.md) — *Learn how to use the `<Form>` component to handle form submissions and search params updates with client-side navigation.*
- [**Image Component**](../docs_markdown/01-app/03-api-reference/02-components/image.md) — *Optimize Images in your Next.js Application using the built-in `next/image` Component.*
- [**Components**](../docs_markdown/01-app/03-api-reference/02-components/index.md) — *API Reference for Next.js built-in components.*
- [**Link Component**](../docs_markdown/01-app/03-api-reference/02-components/link.md) — *Enable fast client-side navigation with the built-in `next/link` component.*
- [**Script Component**](../docs_markdown/01-app/03-api-reference/02-components/script.md) — *Optimize third-party scripts in your Next.js application using the built-in `next/script` Component.*
- [**favicon, icon, and apple-icon**](../docs_markdown/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md) — *API Reference for the Favicon, Icon and Apple Icon file conventions.*
- [**Metadata Files API Reference**](../docs_markdown/01-app/03-api-reference/03-file-conventions/01-metadata/index.md) — *API documentation for the metadata file conventions.*
- [**manifest.json**](../docs_markdown/01-app/03-api-reference/03-file-conventions/01-metadata/manifest.md) — *API Reference for manifest.json file.*
- [**opengraph-image and twitter-image**](../docs_markdown/01-app/03-api-reference/03-file-conventions/01-metadata/opengraph-image.md) — *API Reference for the Open Graph Image and Twitter Image file conventions.*
- [**robots.txt**](../docs_markdown/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md) — *API Reference for robots.txt file.*
- [**sitemap.xml**](../docs_markdown/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md) — *API Reference for the sitemap.xml file.*
- [**dynamicParams**](../docs_markdown/01-app/03-api-reference/03-file-conventions/02-route-segment-config/dynamicParams.md) — *API reference for the dynamicParams route segment config option.*
- [**Route Segment Config**](../docs_markdown/01-app/03-api-reference/03-file-conventions/02-route-segment-config/index.md) — *Learn about how to configure options for Next.js route segments.*
- [**instant**](../docs_markdown/01-app/03-api-reference/03-file-conventions/02-route-segment-config/instant.md) — *API reference for the instant route segment config.*
- [**maxDuration**](../docs_markdown/01-app/03-api-reference/03-file-conventions/02-route-segment-config/maxDuration.md) — *API reference for the maxDuration route segment config option.*
- [**preferredRegion (deprecated)**](../docs_markdown/01-app/03-api-reference/03-file-conventions/02-route-segment-config/preferredRegion.md) — *API reference for the preferredRegion route segment config option.*
- [**prefetch**](../docs_markdown/01-app/03-api-reference/03-file-conventions/02-route-segment-config/prefetch.md) — *API reference for the prefetch route segment config.*
- [**runtime**](../docs_markdown/01-app/03-api-reference/03-file-conventions/02-route-segment-config/runtime.md) — *API reference for the runtime route segment config option.*
- [**default.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/default.md) — *API Reference for the default.js file.*
- [**Dynamic Route Segments**](../docs_markdown/01-app/03-api-reference/03-file-conventions/dynamic-routes.md) — *Use Dynamic Segments to read URL path params and generate routes from dynamic data.*
- [**error.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/error.md) — *API reference for the error.js special file.*
- [**forbidden.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/forbidden.md) — *API reference for the forbidden.js special file.*
- [**File-system conventions**](../docs_markdown/01-app/03-api-reference/03-file-conventions/index.md) — *API Reference for Next.js file-system conventions.*
- [**instrumentation-client.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/instrumentation-client.md) — *Learn how to add client-side instrumentation to track and monitor your Next.js application's frontend performance.*
- [**instrumentation.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/instrumentation.md) — *API reference for the instrumentation.js file.*
- [**Intercepting Routes**](../docs_markdown/01-app/03-api-reference/03-file-conventions/intercepting-routes.md) — *Use intercepting routes to load a new route within the current layout while masking the browser URL, useful for advanced routing patterns such as modals.*
- [**layout.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/layout.md) — *API reference for the layout.js file.*
- [**loading.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/loading.md) — *API reference for the loading.js file.*
- [**mdx-components.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/mdx-components.md) — *API reference for the mdx-components.js file.*
- [**middleware.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/middleware.md) — *API reference for the middleware.js file (deprecated, renamed to proxy.js).*
- [**not-found.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/not-found.md) — *API reference for the not-found.js file.*
- [**page.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/page.md) — *API reference for the page.js file.*
- [**Parallel Routes**](../docs_markdown/01-app/03-api-reference/03-file-conventions/parallel-routes.md) — *Simultaneously render one or more pages in the same view that can be navigated independently. A pattern for highly dynamic applications.*
- [**proxy.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/proxy.md) — *API reference for the proxy.js file.*
- [**public Folder**](../docs_markdown/01-app/03-api-reference/03-file-conventions/public-folder.md) — *Next.js allows you to serve static files, like images, in the public directory. You can learn how it works here.*
- [**Route Groups**](../docs_markdown/01-app/03-api-reference/03-file-conventions/route-groups.md) — *Route Groups can be used to partition your Next.js application into different sections.*
- [**route.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/route.md) — *API reference for the route.js special file.*
- [**src Folder**](../docs_markdown/01-app/03-api-reference/03-file-conventions/src-folder.md) — *Save pages under the `src` folder as an alternative to the root `pages` directory.*
- [**template.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/template.md) — *API Reference for the template.js file.*
- [**unauthorized.js**](../docs_markdown/01-app/03-api-reference/03-file-conventions/unauthorized.md) — *API reference for the unauthorized.js special file.*
- [**after**](../docs_markdown/01-app/03-api-reference/04-functions/after.md) — *API Reference for the after function.*
- [**cacheLife**](../docs_markdown/01-app/03-api-reference/04-functions/cacheLife.md) — *Learn how to use the cacheLife function to set the cache expiration time for a cached function or component.*
- [**cacheTag**](../docs_markdown/01-app/03-api-reference/04-functions/cacheTag.md) — *Learn how to use the cacheTag function to manage cache invalidation in your Next.js application.*
- [**catchError**](../docs_markdown/01-app/03-api-reference/04-functions/catchError.md) — *API Reference for the catchError function.*
- [**connection**](../docs_markdown/01-app/03-api-reference/04-functions/connection.md) — *API Reference for the connection function.*
- [**cookies**](../docs_markdown/01-app/03-api-reference/04-functions/cookies.md) — *API Reference for the cookies function.*
- [**draftMode**](../docs_markdown/01-app/03-api-reference/04-functions/draft-mode.md) — *API Reference for the draftMode function.*
- [**fetch**](../docs_markdown/01-app/03-api-reference/04-functions/fetch.md) — *API reference for the extended fetch function.*
- [**forbidden**](../docs_markdown/01-app/03-api-reference/04-functions/forbidden.md) — *API Reference for the forbidden function.*
- [**generateImageMetadata**](../docs_markdown/01-app/03-api-reference/04-functions/generate-image-metadata.md) — *Learn how to generate multiple images in a single Metadata API special file.*
- [**generateMetadata**](../docs_markdown/01-app/03-api-reference/04-functions/generate-metadata.md) — *Learn how to add Metadata to your Next.js application for improved search engine optimization (SEO) and web shareability.*
- [**generateSitemaps**](../docs_markdown/01-app/03-api-reference/04-functions/generate-sitemaps.md) — *Learn how to use the generateSiteMaps function to create multiple sitemaps for your application.*
- [**generateStaticParams**](../docs_markdown/01-app/03-api-reference/04-functions/generate-static-params.md) — *API reference for the generateStaticParams function.*
- [**generateViewport**](../docs_markdown/01-app/03-api-reference/04-functions/generate-viewport.md) — *API Reference for the generateViewport function.*
- [**headers**](../docs_markdown/01-app/03-api-reference/04-functions/headers.md) — *API reference for the headers function.*
- [**ImageResponse**](../docs_markdown/01-app/03-api-reference/04-functions/image-response.md) — *API Reference for the ImageResponse constructor.*
- [**Functions**](../docs_markdown/01-app/03-api-reference/04-functions/index.md) — *API Reference for Next.js Functions and Hooks.*
- [**io**](../docs_markdown/01-app/03-api-reference/04-functions/io.md) — *API Reference for the io function.*
- [**NextRequest**](../docs_markdown/01-app/03-api-reference/04-functions/next-request.md) — *API Reference for NextRequest.*
- [**NextResponse**](../docs_markdown/01-app/03-api-reference/04-functions/next-response.md) — *API Reference for NextResponse.*
- [**next/root-params**](../docs_markdown/01-app/03-api-reference/04-functions/next-root-params.md) — *API Reference for the next/root-params module that provides access to root-level route parameters.*
- [**notFound**](../docs_markdown/01-app/03-api-reference/04-functions/not-found.md) — *API Reference for the notFound function.*
- [**permanentRedirect**](../docs_markdown/01-app/03-api-reference/04-functions/permanentRedirect.md) — *API Reference for the permanentRedirect function.*
- [**redirect**](../docs_markdown/01-app/03-api-reference/04-functions/redirect.md) — *API Reference for the redirect function.*
- [**refresh**](../docs_markdown/01-app/03-api-reference/04-functions/refresh.md) — *API Reference for the refresh function.*
- [**revalidatePath**](../docs_markdown/01-app/03-api-reference/04-functions/revalidatePath.md) — *API Reference for the revalidatePath function.*
- [**revalidateTag**](../docs_markdown/01-app/03-api-reference/04-functions/revalidateTag.md) — *API Reference for the revalidateTag function.*
- [**unauthorized**](../docs_markdown/01-app/03-api-reference/04-functions/unauthorized.md) — *API Reference for the unauthorized function.*
- [**unstable_cache**](../docs_markdown/01-app/03-api-reference/04-functions/unstable_cache.md) — *API Reference for the unstable_cache function.*
- [**unstable_noStore**](../docs_markdown/01-app/03-api-reference/04-functions/unstable_noStore.md) — *API Reference for the unstable_noStore function.*
- [**unstable_rethrow**](../docs_markdown/01-app/03-api-reference/04-functions/unstable_rethrow.md) — *API Reference for the unstable_rethrow function.*
- [**updateTag**](../docs_markdown/01-app/03-api-reference/04-functions/updateTag.md) — *API Reference for the updateTag function.*
- [**useLinkStatus**](../docs_markdown/01-app/03-api-reference/04-functions/use-link-status.md) — *API Reference for the useLinkStatus hook.*
- [**useOffline**](../docs_markdown/01-app/03-api-reference/04-functions/use-offline.md) — *API Reference for the useOffline hook.*
- [**useParams**](../docs_markdown/01-app/03-api-reference/04-functions/use-params.md) — *API Reference for the useParams hook.*
- [**usePathname**](../docs_markdown/01-app/03-api-reference/04-functions/use-pathname.md) — *API Reference for the usePathname hook.*
- [**useReportWebVitals**](../docs_markdown/01-app/03-api-reference/04-functions/use-report-web-vitals.md) — *API Reference for the useReportWebVitals function.*
- [**useRouter**](../docs_markdown/01-app/03-api-reference/04-functions/use-router.md) — *API reference for the useRouter hook.*
- [**useSearchParams**](../docs_markdown/01-app/03-api-reference/04-functions/use-search-params.md) — *API Reference for the useSearchParams hook.*
- [**useSelectedLayoutSegment**](../docs_markdown/01-app/03-api-reference/04-functions/use-selected-layout-segment.md) — *API Reference for the useSelectedLayoutSegment hook.*
- [**useSelectedLayoutSegments**](../docs_markdown/01-app/03-api-reference/04-functions/use-selected-layout-segments.md) — *API Reference for the useSelectedLayoutSegments hook.*
- [**userAgent**](../docs_markdown/01-app/03-api-reference/04-functions/userAgent.md) — *The userAgent helper extends the Web Request API with additional properties and methods to interact with the user agent object from the request.*
- [**adapterPath**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/adapterPath.md) — *Configure a custom adapter for Next.js to hook into the build process.*
- [**allowedDevOrigins**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/allowedDevOrigins.md) — *Use `allowedDevOrigins` to configure additional origins that can request the dev server.*
- [**appDir**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/appDir.md) — *Enable the App Router to use layouts, streaming, and more.*
- [**assetPrefix**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/assetPrefix.md) — *Learn how to use the assetPrefix config option to configure your CDN.*
- [**authInterrupts**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/authInterrupts.md) — *Learn how to enable the experimental `authInterrupts` configuration option to use `forbidden` and `unauthorized`.*
- [**basePath**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/basePath.md) — *Use `basePath` to deploy a Next.js application under a sub-path of a domain.*
- [**cacheComponents**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/cacheComponents.md) — *Learn how to enable the cacheComponents flag in Next.js.*
- [**cacheHandlers**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/cacheHandlers.md) — *Configure custom cache handlers for use cache directives in Next.js.*
- [**cacheLife**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/cacheLife.md) — *Learn how to set up cacheLife configurations in Next.js.*
- [**cacheMaxMemorySize**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/cacheMaxMemorySize.md) — *Configure the size of the in-memory cache that Next.js keeps in each server instance.*
- [**compress**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/compress.md) — *Next.js provides gzip compression to compress rendered content and static files, it only works with the server target. Learn more about it here.*
- [**crossOrigin**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/crossOrigin.md) — *Use the `crossOrigin` option to add a crossOrigin tag on the `script` tags generated by `next/script`.*
- [**cssChunking**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/cssChunking.md) — *Use the `cssChunking` option to control how CSS files are chunked in your Next.js application.*
- [**deploymentId**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/deploymentId.md) — *Configure a deployment identifier used for version skew protection and cache busting.*
- [**devIndicators**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/devIndicators.md) — *Configuration options for the on-screen indicator that gives context about the current route you're viewing during development.*
- [**distDir**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/distDir.md) — *Set a custom build directory to use instead of the default .next directory.*
- [**env**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/env.md) — *Learn to add and access environment variables in your Next.js application at build time.*
- [**expireTime**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/expireTime.md) — *Customize stale-while-revalidate expire time for ISR enabled pages.*
- [**exportPathMap**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/exportPathMap.md) — *Customize the pages that will be exported as HTML files when using `next export`.*
- [**generateBuildId**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/generateBuildId.md) — *Configure the build id, which is used to identify the current build in which your application is being served.*
- [**generateEtags**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/generateEtags.md) — *Next.js will generate etags for every page by default. Learn more about how to disable etag generation here.*
- [**headers**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/headers.md) — *Add custom HTTP headers to your Next.js app.*
- [**htmlLimitedBots**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/htmlLimitedBots.md) — *Specify a list of user agents that should receive blocking metadata.*
- [**httpAgentOptions**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/httpAgentOptions.md) — *Next.js will automatically use HTTP Keep-Alive by default. Learn more about how to disable HTTP Keep-Alive here.*
- [**images**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/images.md) — *Custom configuration for the next/image loader*
- [**Custom Next.js Cache Handler**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/incrementalCacheHandlerPath.md) — *Configure the Next.js cache used for storing and revalidating data to use any external service like Redis, Memcached, or others.*
- [**next.config.js**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/index.md) — *Learn how to configure your application with next.config.js.*
- [**inlineCss**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/inlineCss.md) — *Enable inline CSS support.*
- [**instrumentationClientInject**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/instrumentationClientInject.md) — *Inject additional client-side instrumentation modules before the user's `instrumentation-client.{js,ts}` file.*
- [**logging**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/logging.md) — *Configure logging behavior in the terminal when running Next.js in development mode, including fetch logging, incoming requests, and forwarding browser console logs to the terminal.*
- [**mdxRs**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/mdxRs.md) — *Use the new Rust compiler to compile MDX files in the App Router.*
- [**onDemandEntries**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/onDemandEntries.md) — *Configure how Next.js will dispose and keep in memory pages created in development.*
- [**optimizePackageImports**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/optimizePackageImports.md) — *API Reference for optimizePackageImports Next.js Config Option*
- [**output**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/output.md) — *Next.js automatically traces which files are needed by each page to allow for easy deployment of your application. Learn how it works here.*
- [**outputHashSalt**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/outputHashSalt.md) — *Learn how to incorporate a custom salt string into content-addressed output filenames.*
- [**pageExtensions**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/pageExtensions.md) — *Extend the default page extensions used by Next.js when resolving pages in the Pages Router.*
- [**partialPrefetching**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/partialPrefetching.md) — *Configure the default link prefetch behavior to fetch only the static parts of each route.*
- [**poweredByHeader**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/poweredByHeader.md) — *Next.js will add the `x-powered-by` header by default. Learn to opt-out of it here.*
- [**prefetchInlining**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/prefetchInlining.md) — *Override how the App Router bundles small prefetch responses together.*
- [**productionBrowserSourceMaps**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/productionBrowserSourceMaps.md) — *Enables browser source map generation during the production build.*
- [**proxyClientMaxBodySize**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/proxyClientMaxBodySize.md) — *Configure the maximum request body size when using proxy.*
- [**reactCompiler**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/reactCompiler.md) — *Enable the React Compiler to automatically optimize component rendering.*
- [**reactMaxHeadersLength**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/reactMaxHeadersLength.md) — *The maximum length of the headers that are emitted by React and added to the response.*
- [**reactStrictMode**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/reactStrictMode.md) — *The complete Next.js runtime is now Strict Mode-compliant, learn how to opt-in*
- [**redirects**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/redirects.md) — *Add redirects to your Next.js app.*
- [**rewrites**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/rewrites.md) — *Add rewrites to your Next.js app.*
- [**sassOptions**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/sassOptions.md) — *Configure Sass options.*
- [**serverActions**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/serverActions.md) — *Configure Server Actions behavior in your Next.js application.*
- [**serverComponentsHmrCache**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/serverComponentsHmrCache.md) — *Configure whether fetch responses in Server Components are cached across HMR refresh requests.*
- [**serverExternalPackages**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/serverExternalPackages.md) — *Opt-out specific dependencies from the Server Components bundling and use native Node.js `require`.*
- [**skipProxyUrlNormalize**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/skipProxyUrlNormalize.md) — *Let Proxy see the original request instead of Next.js's normalized version. Formerly skipMiddlewareUrlNormalize.*
- [**skipTrailingSlashRedirect**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/skipTrailingSlashRedirect.md) — *Disable the automatic trailing slash redirects so you can handle trailing slashes yourself in Proxy.*
- [**staleTimes**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/staleTimes.md) — *Learn how to override the invalidation time of the client cache.*
- [**staticGeneration***](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/staticGeneration.md) — *Learn how to configure static generation in your Next.js application.*
- [**supportsImmutableAssets**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/supportsImmutableAssets.md) — *Configure support for immutable static assets*
- [**taint**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/taint.md) — *Enable tainting Objects and Values.*
- [**trailingSlash**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/trailingSlash.md) — *Configure Next.js pages to resolve with or without a trailing slash.*
- [**transpilePackages**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/transpilePackages.md) — *Transpile and bundle dependencies from monorepo workspace packages or `node_modules` libraries that ship TypeScript, JSX, or modern syntax.*
- [**turbopack**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/turbopack.md) — *Configure Next.js with Turbopack-specific options*
- [**turbopackChunking**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/turbopackChunking.md) — *Configure how Turbopack splits your client-side JavaScript into chunks in production.*
- [**Turbopack FileSystem Caching**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/turbopackFileSystemCache.md) — *Learn how to enable and configure FileSystem Caching for Turbopack builds*
- [**turbopack.ignoreIssue**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/turbopackIgnoreIssue.md) — *Suppress specific Turbopack errors and warnings from the CLI output and error overlay.*
- [**turbopackLocalPostcssConfig**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/turbopackLocalPostcssConfig.md) — *Enable per-directory PostCSS config resolution in Turbopack so that the config closest to each CSS file takes precedence over the project root config.*
- [**Turbopack Memory Eviction**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/turbopackMemoryEviction.md) — *Learn how to control Turbopack's memory eviction strategy for the persistent cache.*
- [**turbopackRustReactCompiler**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/turbopackRustReactCompiler.md) — *Use the native Rust port of the React Compiler with Turbopack instead of the Babel transform.*
- [**typedRoutes**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/typedRoutes.md) — *Enable support for statically typed links.*
- [**typescript**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/typescript.md) — *Configure how Next.js handles TypeScript errors during production builds and specify a custom tsconfig file.*
- [**urlImports**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/urlImports.md) — *Configure Next.js to allow importing modules from external URLs.*
- [**useLightningcss**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/useLightningcss.md) — *Enable experimental support for Lightning CSS.*
- [**useOffline**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/useOffline.md) — *Learn how to enable the experimental `useOffline` configuration option to detect connectivity and retry failed requests automatically.*
- [**useTypeScriptCli**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/useTypeScriptCli.md) — *Run the project-local TypeScript CLI for type checking during production builds.*
- [**webVitalsAttribution**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/webVitalsAttribution.md) — *Learn how to use the webVitalsAttribution option to pinpoint the source of Web Vitals issues.*
- [**Custom Webpack Config**](../docs_markdown/01-app/03-api-reference/05-config/01-next-config-js/webpack.md) — *Learn how to customize the webpack config used by Next.js*
- [**TypeScript**](../docs_markdown/01-app/03-api-reference/05-config/02-typescript.md) — *Next.js provides a TypeScript-first development experience for building your React application.*
- [**ESLint Plugin**](../docs_markdown/01-app/03-api-reference/05-config/03-eslint.md) — *Learn how to use and configure the ESLint plugin to catch common issues and problems in a Next.js application.*
- [**Configuration**](../docs_markdown/01-app/03-api-reference/05-config/index.md) — *Learn how to configure Next.js applications.*
- [**create-next-app**](../docs_markdown/01-app/03-api-reference/06-cli/create-next-app.md) — *Create Next.js apps using one command with the create-next-app CLI.*
- [**CLI**](../docs_markdown/01-app/03-api-reference/06-cli/index.md) — *API Reference for the Next.js Command Line Interface (CLI) tools.*
- [**next CLI**](../docs_markdown/01-app/03-api-reference/06-cli/next.md) — *Learn how to run and build your application with the Next.js CLI.*
- [**Configuration**](../docs_markdown/01-app/03-api-reference/07-adapters/01-configuration.md) — *Configure `adapterPath` or `NEXT_ADAPTER_PATH` to use a custom deployment adapter.*
- [**Creating an Adapter**](../docs_markdown/01-app/03-api-reference/07-adapters/02-creating-an-adapter.md) — *Create an adapter module that implements the `NextAdapter` interface.*
- [**API Reference**](../docs_markdown/01-app/03-api-reference/07-adapters/03-api-reference.md) — *Reference for `modifyConfig` and `onBuildComplete` in the `NextAdapter` interface.*
- [**Testing Adapters**](../docs_markdown/01-app/03-api-reference/07-adapters/04-testing-adapters.md) — *Validate adapters with the Next.js compatibility test harness and custom lifecycle scripts.*
- [**Routing with @next/routing**](../docs_markdown/01-app/03-api-reference/07-adapters/05-routing-with-next-routing.md) — *Use `@next/routing` to apply Next.js route matching behavior in adapters.*
- [**Implementing PPR in an Adapter**](../docs_markdown/01-app/03-api-reference/07-adapters/06-implementing-ppr-in-an-adapter.md) — *Implement Partial Prerendering support in an adapter using fallback output and cache hooks.*
- [**Runtime Integration**](../docs_markdown/01-app/03-api-reference/07-adapters/07-runtime-integration.md) — *Understand how build-time adapters and runtime cache interfaces work together.*
- [**Invoking Entrypoints**](../docs_markdown/01-app/03-api-reference/07-adapters/08-invoking-entrypoints.md) — *Invoke Node.js and Edge build entrypoints with adapter runtime context.*
- [**Output Types**](../docs_markdown/01-app/03-api-reference/07-adapters/09-output-types.md) — *Reference for all build output types exposed to adapters.*
- [**Routing Information**](../docs_markdown/01-app/03-api-reference/07-adapters/10-routing-information.md) — *Reference for routing phases and route fields exposed in `onBuildComplete`.*
- [**Use Cases**](../docs_markdown/01-app/03-api-reference/07-adapters/11-use-cases.md) — *Common patterns and examples for deployment adapter implementations.*
- [**Supporting Immutable Static Assets**](../docs_markdown/01-app/03-api-reference/07-adapters/12-immutable-static-assets.md) — *Support immutable static assets in an adapter*
- [**Adapters**](../docs_markdown/01-app/03-api-reference/07-adapters/index.md) — *Build deployment adapters for Next.js platforms and infrastructure.*
- [**Edge Runtime**](../docs_markdown/01-app/03-api-reference/07-edge.md) — *API Reference for the Edge Runtime.*
- [**Turbopack**](../docs_markdown/01-app/03-api-reference/08-turbopack.md) — *Turbopack is an incremental bundler optimized for JavaScript and TypeScript, written in Rust, and built into Next.js.*
- [**API Reference**](../docs_markdown/01-app/03-api-reference/index.md) — *Next.js API Reference for the App Router.*
- [**Next.js Glossary**](../docs_markdown/01-app/04-glossary.md) — *A glossary of common terms used in Next.js.*
- [**App Router**](../docs_markdown/01-app/index.md) — *The App Router is a file-system based router that uses React's latest features such as Server Components, Suspense, Server Functions, and more.*

### 📁 Pages Router (02-pages) (164 temas)

- [**Create a new Next.js application**](../docs_markdown/02-pages/01-getting-started/01-installation.md) — *How to create a new Next.js application with `create-next-app`. Set up TypeScript, ESLint,and configure your `next.config.js` file.*
- [**Project Structure and Organization**](../docs_markdown/02-pages/01-getting-started/02-project-structure.md) — *Learn about the folder and file conventions in a Next.js project, and how to organize your project.*
- [**Image Optimization**](../docs_markdown/02-pages/01-getting-started/04-images.md) — *Optimize your images with the built-in `next/image` component.*
- [**How to use fonts**](../docs_markdown/02-pages/01-getting-started/05-fonts.md) — *Learn how to use fonts in Next.js*
- [**How to use CSS in your application**](../docs_markdown/02-pages/01-getting-started/06-css.md) — *Learn about the different ways to add CSS to your application, including CSS Modules, Global CSS, Tailwind CSS, and more.*
- [**How to deploy your Next.js application**](../docs_markdown/02-pages/01-getting-started/11-deploying.md) — *Learn how to deploy your Next.js application.*
- [**Getting Started - Pages Router**](../docs_markdown/02-pages/01-getting-started/index.md) — *Learn how to create full-stack web applications with Next.js with the Pages Router.*
- [**How to set up analytics**](../docs_markdown/02-pages/02-guides/analytics.md) — *Measure and track page performance using Next.js*
- [**How to implement authentication in Next.js**](../docs_markdown/02-pages/02-guides/authentication.md) — *Learn how to implement authentication in Next.js, covering best practices, securing routes, authorization techniques, and session management.*
- [**How to configure Babel in Next.js**](../docs_markdown/02-pages/02-guides/babel.md) — *Extend the babel preset added by Next.js with your own configs.*
- [**How to configure Continuous Integration (CI) build caching**](../docs_markdown/02-pages/02-guides/ci-build-caching.md) — *Learn how to configure CI to cache Next.js builds*
- [**How to set a Content Security Policy (CSP) for your Next.js application**](../docs_markdown/02-pages/02-guides/content-security-policy.md) — *Learn how to set a Content Security Policy (CSP) for your Next.js application.*
- [**How to use CSS-in-JS libraries**](../docs_markdown/02-pages/02-guides/css-in-js.md) — *Use CSS-in-JS libraries with Next.js*
- [**How to set up a custom server in Next.js**](../docs_markdown/02-pages/02-guides/custom-server.md) — *Start a Next.js app programmatically using a custom server.*
- [**How to use debugging tools with Next.js**](../docs_markdown/02-pages/02-guides/debugging.md) — *Learn how to debug your Next.js application with VS Code or Chrome DevTools.*
- [**How to preview content with Draft Mode in Next.js**](../docs_markdown/02-pages/02-guides/draft-mode.md) — *Next.js has draft mode to toggle between static and dynamic pages. You can learn how it works with Pages Router.*
- [**How to use environment variables in Next.js**](../docs_markdown/02-pages/02-guides/environment-variables.md) — *Learn to add and access environment variables in your Next.js application.*
- [**How to create forms with API Routes**](../docs_markdown/02-pages/02-guides/forms.md) — *Learn how to handle form submissions and data mutations with Next.js.*
- [**How to implement Incremental Static Regeneration (ISR)**](../docs_markdown/02-pages/02-guides/incremental-static-regeneration.md) — *Learn how to create or update static pages at runtime with Incremental Static Regeneration.*
- [**Guides**](../docs_markdown/02-pages/02-guides/index.md) — *Learn how to implement common UI patterns and use cases using Next.js*
- [**How to set up instrumentation**](../docs_markdown/02-pages/02-guides/instrumentation.md) — *Learn how to use instrumentation to run code at server startup in your Next.js app*
- [**How to implement internationalization in Next.js**](../docs_markdown/02-pages/02-guides/internationalization.md) — *Next.js has built-in support for internationalized routing and language detection. Learn more here.*
- [**How to lazy load Client Components and libraries**](../docs_markdown/02-pages/02-guides/lazy-loading.md) — *Lazy load imported libraries and React Components to improve your application's overall loading performance.*
- [**How to use markdown and MDX in Next.js**](../docs_markdown/02-pages/02-guides/mdx.md) — *Learn how to configure MDX to write JSX in your markdown files.*
- [**How to migrate from Pages to the App Router**](../docs_markdown/02-pages/02-guides/migrating/app-router-migration.md) — *Learn how to upgrade your existing Next.js application from the Pages Router to the App Router.*
- [**How to migrate from Create React App to Next.js**](../docs_markdown/02-pages/02-guides/migrating/from-create-react-app.md) — *Learn how to migrate your existing React application from Create React App to Next.js.*
- [**How to migrate from Vite to Next.js**](../docs_markdown/02-pages/02-guides/migrating/from-vite.md) — *Learn how to migrate your existing React application from Vite to Next.js.*
- [**Migrating**](../docs_markdown/02-pages/02-guides/migrating/index.md) — *Learn how to migrate from popular frameworks to Next.js*
- [**How to build micro-frontends using multi-zones and Next.js**](../docs_markdown/02-pages/02-guides/multi-zones.md) — *Learn how to build micro-frontends using Next.js Multi-Zones to deploy multiple Next.js apps under a single domain.*
- [**How to instrument your Next.js app with OpenTelemetry**](../docs_markdown/02-pages/02-guides/open-telemetry.md) — *Learn how to instrument your Next.js app with OpenTelemetry.*
- [**How to optimize package bundling**](../docs_markdown/02-pages/02-guides/package-bundling.md) — *Learn how to optimize your application's server and client bundles.*
- [**How to configure PostCSS in Next.js**](../docs_markdown/02-pages/02-guides/post-css.md) — *Extend the PostCSS config and plugins added by Next.js with your own.*
- [**How to preview content with Preview Mode in Next.js**](../docs_markdown/02-pages/02-guides/preview-mode.md) — *Next.js has the preview mode for statically generated pages. You can learn how it works here.*
- [**How to optimize your Next.js application for production**](../docs_markdown/02-pages/02-guides/production-checklist.md) — *Recommendations to ensure the best performance and user experience before taking your Next.js application to production.*
- [**How to handle redirects in Next.js**](../docs_markdown/02-pages/02-guides/redirecting.md) — *Learn the different ways to handle redirects in Next.js.*
- [**How to use Sass in Next.js**](../docs_markdown/02-pages/02-guides/sass.md) — *Learn how to use Sass in your Next.js application.*
- [**How to load and optimize scripts**](../docs_markdown/02-pages/02-guides/scripts.md) — *Optimize 3rd party scripts with the built-in Script component.*
- [**How to self-host your Next.js application**](../docs_markdown/02-pages/02-guides/self-hosting.md) — *Learn how to self-host your Next.js application on a Node.js server, Docker image, or static HTML files (static exports).*
- [**How to create a static export of your Next.js application**](../docs_markdown/02-pages/02-guides/static-exports.md) — *Next.js enables starting as a static site or Single-Page Application (SPA), then later optionally upgrading to use features that require a server.*
- [**Tailwind CSS**](../docs_markdown/02-pages/02-guides/tailwind-v3-css.md) — *Style your Next.js Application using Tailwind CSS.*
- [**How to set up Cypress with Next.js**](../docs_markdown/02-pages/02-guides/testing/cypress.md) — *Learn how to set up Next.js with Cypress for End-to-End (E2E) and Component Testing.*
- [**Testing**](../docs_markdown/02-pages/02-guides/testing/index.md) — *Learn how to set up Next.js with three commonly used testing tools — Cypress, Playwright, Vitest, and Jest.*
- [**How to set up Jest with Next.js**](../docs_markdown/02-pages/02-guides/testing/jest.md) — *Learn how to set up Next.js with Jest for Unit Testing.*
- [**How to set up Playwright with Next.js**](../docs_markdown/02-pages/02-guides/testing/playwright.md) — *Learn how to set up Next.js with Playwright for End-to-End (E2E) and Integration testing.*
- [**How to set up Vitest with Next.js**](../docs_markdown/02-pages/02-guides/testing/vitest.md) — *Learn how to set up Next.js with Vitest and React Testing Library - two popular unit testing libraries.*
- [**How to optimize third-party libraries**](../docs_markdown/02-pages/02-guides/third-party-libraries.md) — *Optimize the performance of third-party libraries in your application with the `@next/third-parties` package.*
- [**Codemods**](../docs_markdown/02-pages/02-guides/upgrading/codemods.md) — *Use codemods to upgrade your Next.js codebase when new features are released.*
- [**Upgrading**](../docs_markdown/02-pages/02-guides/upgrading/index.md) — *Learn how to upgrade to the latest versions of Next.js.*
- [**How to upgrade to version 10**](../docs_markdown/02-pages/02-guides/upgrading/version-10.md) — *Upgrade your Next.js Application from Version 9 to Version 10.*
- [**How to upgrade to version 11**](../docs_markdown/02-pages/02-guides/upgrading/version-11.md) — *Upgrade your Next.js Application from Version 10 to Version 11.*
- [**How to upgrade to version 12**](../docs_markdown/02-pages/02-guides/upgrading/version-12.md) — *Upgrade your Next.js Application from Version 11 to Version 12.*
- [**How to upgrade to version 13**](../docs_markdown/02-pages/02-guides/upgrading/version-13.md) — *Upgrade your Next.js Application from Version 12 to 13.*
- [**How to upgrade to version 14**](../docs_markdown/02-pages/02-guides/upgrading/version-14.md) — *Upgrade your Next.js Application from Version 13 to 14.*
- [**How to upgrade to version 9**](../docs_markdown/02-pages/02-guides/upgrading/version-9.md) — *Upgrade your Next.js Application from Version 8 to Version 9.*
- [**Pages and Layouts**](../docs_markdown/02-pages/03-building-your-application/01-routing/01-pages-and-layouts.md) — *Create your first page and shared layout with the Pages Router.*
- [**Dynamic Routes**](../docs_markdown/02-pages/03-building-your-application/01-routing/02-dynamic-routes.md) — *Dynamic Routes are pages that allow you to add custom params to your URLs. Start creating Dynamic Routes and learn more here.*
- [**Linking and Navigating**](../docs_markdown/02-pages/03-building-your-application/01-routing/03-linking-and-navigating.md) — *Learn how navigation works in Next.js, and how to use the Link Component and `useRouter` hook.*
- [**Custom App**](../docs_markdown/02-pages/03-building-your-application/01-routing/05-custom-app.md) — *Control page initialization and add a layout that persists for all pages by overriding the default App component used by Next.js.*
- [**Custom Document**](../docs_markdown/02-pages/03-building-your-application/01-routing/06-custom-document.md) — *Extend the default document markup added by Next.js.*
- [**API Routes**](../docs_markdown/02-pages/03-building-your-application/01-routing/07-api-routes.md) — *Next.js supports API Routes, which allow you to build your API without leaving your Next.js app. Learn how it works here.*
- [**Custom Errors**](../docs_markdown/02-pages/03-building-your-application/01-routing/08-custom-error.md) — *Override and extend the built-in Error page to handle custom errors.*
- [**Routing**](../docs_markdown/02-pages/03-building-your-application/01-routing/index.md) — *Learn the fundamentals of routing for front-end applications with the Pages Router.*
- [**Server-side Rendering (SSR)**](../docs_markdown/02-pages/03-building-your-application/02-rendering/01-server-side-rendering.md) — *Use Server-side Rendering to render pages on each request.*
- [**Static Site Generation (SSG)**](../docs_markdown/02-pages/03-building-your-application/02-rendering/02-static-site-generation.md) — *Use Static Site Generation (SSG) to prerender pages at build time.*
- [**Automatic Static Optimization**](../docs_markdown/02-pages/03-building-your-application/02-rendering/04-automatic-static-optimization.md) — *Next.js automatically optimizes your app to be static HTML whenever possible. Learn how it works here.*
- [**Client-side Rendering (CSR)**](../docs_markdown/02-pages/03-building-your-application/02-rendering/05-client-side-rendering.md) — *Learn how to implement client-side rendering in the Pages Router.*
- [**Rendering**](../docs_markdown/02-pages/03-building-your-application/02-rendering/index.md) — *Learn the fundamentals of rendering in React and Next.js.*
- [**getStaticProps**](../docs_markdown/02-pages/03-building-your-application/03-data-fetching/01-get-static-props.md) — *Fetch data and generate static pages with `getStaticProps`. Learn more about this API for data fetching in Next.js.*
- [**getStaticPaths**](../docs_markdown/02-pages/03-building-your-application/03-data-fetching/02-get-static-paths.md) — *Fetch data and generate static pages with `getStaticPaths`. Learn more about this API for data fetching in Next.js.*
- [**getServerSideProps**](../docs_markdown/02-pages/03-building-your-application/03-data-fetching/03-get-server-side-props.md) — *Fetch data on each request with `getServerSideProps`.*
- [**Client-side Fetching**](../docs_markdown/02-pages/03-building-your-application/03-data-fetching/05-client-side.md) — *Learn about client-side data fetching, and how to use SWR, a data fetching React Hook library that handles caching, revalidation, focus tracking, refetching on interval and more.*
- [**Data Fetching**](../docs_markdown/02-pages/03-building-your-application/03-data-fetching/index.md) — *Next.js allows you to fetch data in multiple ways, with prerendering, server-side rendering or static-site generation, and incremental static regeneration. Learn how to manage your application data in Next.js.*
- [**Error Handling**](../docs_markdown/02-pages/03-building-your-application/06-configuring/12-error-handling.md) — *Handle errors in your Next.js app.*
- [**Configuring**](../docs_markdown/02-pages/03-building-your-application/06-configuring/index.md) — *Learn how to configure your Next.js application.*
- [**Building Your Application**](../docs_markdown/02-pages/03-building-your-application/index.md) — *Learn how to use Next.js features to build your application.*
- [**Font Module**](../docs_markdown/02-pages/04-api-reference/01-components/font.md) — *API Reference for the Font Module*
- [**Form**](../docs_markdown/02-pages/04-api-reference/01-components/form.md) — *Learn how to use the `<Form>` component to handle form submissions and search params updates with client-side navigation.*
- [**Head**](../docs_markdown/02-pages/04-api-reference/01-components/head.md) — *Add custom elements to the `head` of your page with the built-in Head component.*
- [**Image (Legacy)**](../docs_markdown/02-pages/04-api-reference/01-components/image-legacy.md) — *Backwards compatible Image Optimization with the Legacy Image component.*
- [**Image**](../docs_markdown/02-pages/04-api-reference/01-components/image.md) — *Optimize Images in your Next.js Application using the built-in `next/image` Component.*
- [**Components**](../docs_markdown/02-pages/04-api-reference/01-components/index.md) — *API Reference for Next.js built-in components in the Pages Router.*
- [**Link**](../docs_markdown/02-pages/04-api-reference/01-components/link.md) — *API reference for the `<Link>` component.*
- [**Script**](../docs_markdown/02-pages/04-api-reference/01-components/script.md) — *Optimize third-party scripts in your Next.js application using the built-in `next/script` Component.*
- [**File-system conventions**](../docs_markdown/02-pages/04-api-reference/02-file-conventions/index.md) — *API Reference for Next.js file-system conventions.*
- [**instrumentation.js**](../docs_markdown/02-pages/04-api-reference/02-file-conventions/instrumentation.md) — *API reference for the instrumentation.js file.*
- [**Proxy**](../docs_markdown/02-pages/04-api-reference/02-file-conventions/proxy.md) — *Learn how to use Proxy to run code before a request is completed.*
- [**public Folder**](../docs_markdown/02-pages/04-api-reference/02-file-conventions/public-folder.md) — *Next.js allows you to serve static files, like images, in the public directory. You can learn how it works here.*
- [**src Directory**](../docs_markdown/02-pages/04-api-reference/02-file-conventions/src-folder.md) — *Save pages under the `src` folder as an alternative to the root `pages` directory.*
- [**catchError**](../docs_markdown/02-pages/04-api-reference/03-functions/catchError.md) — *API Reference for the catchError function.*
- [**getInitialProps**](../docs_markdown/02-pages/04-api-reference/03-functions/get-initial-props.md) — *Fetch dynamic data on the server for your React component with getInitialProps.*
- [**getServerSideProps**](../docs_markdown/02-pages/04-api-reference/03-functions/get-server-side-props.md) — *API reference for `getServerSideProps`. Learn how to fetch data on each request with Next.js.*
- [**getStaticPaths**](../docs_markdown/02-pages/04-api-reference/03-functions/get-static-paths.md) — *API reference for `getStaticPaths`. Learn how to fetch data and generate static pages with `getStaticPaths`.*
- [**getStaticProps**](../docs_markdown/02-pages/04-api-reference/03-functions/get-static-props.md) — *API reference for `getStaticProps`. Learn how to use `getStaticProps` to generate static pages with Next.js.*
- [**Functions**](../docs_markdown/02-pages/04-api-reference/03-functions/index.md) — *API Reference for Functions and Hooks in Pages Router.*
- [**NextRequest**](../docs_markdown/02-pages/04-api-reference/03-functions/next-request.md) — *API Reference for NextRequest.*
- [**NextResponse**](../docs_markdown/02-pages/04-api-reference/03-functions/next-response.md) — *API Reference for NextResponse.*
- [**useParams**](../docs_markdown/02-pages/04-api-reference/03-functions/use-params.md) — *API Reference for the useParams hook in the Pages Router.*
- [**useReportWebVitals**](../docs_markdown/02-pages/04-api-reference/03-functions/use-report-web-vitals.md) — *Use the Next.js `useReportWebVitals` hook to send Core Web Vitals and custom performance metrics to analytics.*
- [**useRouter**](../docs_markdown/02-pages/04-api-reference/03-functions/use-router.md) — *Learn more about the API of the Next.js Router, and access the router instance in your page with the useRouter hook.*
- [**useSearchParams**](../docs_markdown/02-pages/04-api-reference/03-functions/use-search-params.md) — *API Reference for the useSearchParams hook in the Pages Router.*
- [**userAgent**](../docs_markdown/02-pages/04-api-reference/03-functions/userAgent.md) — *The userAgent helper extends the Web Request API with additional properties and methods to interact with the user agent object from the request.*
- [**adapterPath**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/adapterPath.md) — *Configure a custom adapter for Next.js to hook into the build process.*
- [**allowedDevOrigins**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/allowedDevOrigins.md) — *Use `allowedDevOrigins` to configure additional origins that can request the dev server.*
- [**assetPrefix**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/assetPrefix.md) — *Learn how to use the assetPrefix config option to configure your CDN.*
- [**basePath**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/basePath.md) — *Use `basePath` to deploy a Next.js application under a sub-path of a domain.*
- [**bundlePagesRouterDependencies**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/bundlePagesRouterDependencies.md) — *Enable automatic dependency bundling for Pages Router*
- [**compress**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/compress.md) — *Next.js provides gzip compression to compress rendered content and static files, it only works with the server target. Learn more about it here.*
- [**crossOrigin**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/crossOrigin.md) — *Use the `crossOrigin` option to add a crossOrigin tag on the `script` tags generated by `next/script` and `next/head`.*
- [**deploymentId**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/deploymentId.md) — *Configure a deployment identifier used for version skew protection and cache busting.*
- [**devIndicators**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/devIndicators.md) — *Optimized pages include an indicator to let you know if it's being statically optimized. You can opt-out of it here.*
- [**distDir**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/distDir.md) — *Set a custom build directory to use instead of the default .next directory.*
- [**env**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/env.md) — *Learn to add and access environment variables in your Next.js application at build time.*
- [**exportPathMap**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/exportPathMap.md) — *Customize the pages that will be exported as HTML files when using `next export`.*
- [**generateBuildId**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/generateBuildId.md) — *Configure the build id, which is used to identify the current build in which your application is being served.*
- [**generateEtags**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/generateEtags.md) — *Next.js will generate etags for every page by default. Learn more about how to disable etag generation here.*
- [**headers**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/headers.md) — *Add custom HTTP headers to your Next.js app.*
- [**httpAgentOptions**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/httpAgentOptions.md) — *Next.js will automatically use HTTP Keep-Alive by default. Learn more about how to disable HTTP Keep-Alive here.*
- [**images**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/images.md) — *Custom configuration for the next/image loader*
- [**next.config.js Options**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/index.md) — *Learn about the options available in next.config.js for the Pages Router.*
- [**logging**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/logging.md) — *Configure logging behavior in the terminal when running Next.js in development mode.*
- [**onDemandEntries**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/onDemandEntries.md) — *Configure how Next.js will dispose and keep in memory pages created in development.*
- [**optimizePackageImports**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/optimizePackageImports.md) — *API Reference for optimizePackageImports Next.js Config Option*
- [**output**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/output.md) — *Next.js automatically traces which files are needed by each page to allow for easy deployment of your application. Learn how it works here.*
- [**pageExtensions**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/pageExtensions.md) — *Extend the default page extensions used by Next.js when resolving pages in the Pages Router.*
- [**poweredByHeader**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/poweredByHeader.md) — *Next.js will add the `x-powered-by` header by default. Learn to opt-out of it here.*
- [**productionBrowserSourceMaps**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/productionBrowserSourceMaps.md) — *Enables browser source map generation during the production build.*
- [**experimental.proxyClientMaxBodySize**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/proxyClientMaxBodySize.md) — *Configure the maximum request body size when using proxy.*
- [**reactStrictMode**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/reactStrictMode.md) — *The complete Next.js runtime is now Strict Mode-compliant, learn how to opt-in*
- [**redirects**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/redirects.md) — *Add redirects to your Next.js app.*
- [**rewrites**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/rewrites.md) — *Add rewrites to your Next.js app.*
- [**serverExternalPackages**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/serverExternalPackages.md) — *Opt-out specific dependencies from the dependency bundling enabled by `bundlePagesRouterDependencies`.*
- [**skipProxyUrlNormalize**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/skipProxyUrlNormalize.md) — *Let Proxy see the original request instead of Next.js's normalized version. Formerly skipMiddlewareUrlNormalize.*
- [**skipTrailingSlashRedirect**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/skipTrailingSlashRedirect.md) — *Disable the automatic trailing slash redirects so you can handle trailing slashes yourself in Proxy.*
- [**trailingSlash**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/trailingSlash.md) — *Configure Next.js pages to resolve with or without a trailing slash.*
- [**transpilePackages**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/transpilePackages.md) — *Automatically transpile and bundle dependencies from local packages (like monorepos) or from external dependencies (`node_modules`).*
- [**turbopack**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/turbopack.md) — *Configure Next.js with Turbopack-specific options*
- [**turbopackChunking**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/turbopackChunking.md) — *Configure how Turbopack splits your client-side JavaScript into chunks in production.*
- [**typescript**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/typescript.md) — *Next.js reports TypeScript errors by default. Learn to opt-out of this behavior here.*
- [**urlImports**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/urlImports.md) — *Configure Next.js to allow importing modules from external URLs.*
- [**useLightningcss**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/useLightningcss.md) — *Enable experimental support for Lightning CSS.*
- [**useTypeScriptCli**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/useTypeScriptCli.md) — *Run the project-local TypeScript CLI for type checking during production builds.*
- [**webVitalsAttribution**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/webVitalsAttribution.md) — *Learn how to use the webVitalsAttribution option to pinpoint the source of Web Vitals issues.*
- [**Custom Webpack Config**](../docs_markdown/02-pages/04-api-reference/04-config/01-next-config-js/webpack.md) — *Learn how to customize the webpack config used by Next.js*
- [**TypeScript**](../docs_markdown/02-pages/04-api-reference/04-config/01-typescript.md) — *Next.js provides a TypeScript-first development experience for building your React application.*
- [**ESLint**](../docs_markdown/02-pages/04-api-reference/04-config/02-eslint.md) — *Next.js reports ESLint errors and warnings during builds by default. Learn how to opt-out of this behavior here.*
- [**Configuration**](../docs_markdown/02-pages/04-api-reference/04-config/index.md) — *Learn how to configure your Next.js application.*
- [**create-next-app CLI**](../docs_markdown/02-pages/04-api-reference/05-cli/create-next-app.md) — *Create Next.js apps using one command with the create-next-app CLI.*
- [**CLI**](../docs_markdown/02-pages/04-api-reference/05-cli/index.md) — *API Reference for the Next.js Command Line Interface (CLI) tools.*
- [**next CLI**](../docs_markdown/02-pages/04-api-reference/05-cli/next.md) — *Learn how to run and build your application with the Next.js CLI.*
- [**Configuration**](../docs_markdown/02-pages/04-api-reference/06-adapters/01-configuration.md) — *Configure `adapterPath` or `NEXT_ADAPTER_PATH` to use a custom deployment adapter.*
- [**Creating an Adapter**](../docs_markdown/02-pages/04-api-reference/06-adapters/02-creating-an-adapter.md) — *Create an adapter module that implements the `NextAdapter` interface.*
- [**API Reference**](../docs_markdown/02-pages/04-api-reference/06-adapters/03-api-reference.md) — *Reference for `modifyConfig` and `onBuildComplete` in the `NextAdapter` interface.*
- [**Testing Adapters**](../docs_markdown/02-pages/04-api-reference/06-adapters/04-testing-adapters.md) — *Validate adapters with the Next.js compatibility test harness and custom lifecycle scripts.*
- [**Routing with @next/routing**](../docs_markdown/02-pages/04-api-reference/06-adapters/05-routing-with-next-routing.md) — *Use `@next/routing` to apply Next.js route matching behavior in adapters.*
- [**Runtime Integration**](../docs_markdown/02-pages/04-api-reference/06-adapters/06-runtime-integration.md) — *Understand how build-time adapters and runtime cache interfaces work together.*
- [**Invoking Entrypoints**](../docs_markdown/02-pages/04-api-reference/06-adapters/07-invoking-entrypoints.md) — *Invoke Node.js and Edge build entrypoints with adapter runtime context.*
- [**Output Types**](../docs_markdown/02-pages/04-api-reference/06-adapters/08-output-types.md) — *Reference for all build output types exposed to adapters.*
- [**Routing Information**](../docs_markdown/02-pages/04-api-reference/06-adapters/09-routing-information.md) — *Reference for routing phases and route fields exposed in `onBuildComplete`.*
- [**Use Cases**](../docs_markdown/02-pages/04-api-reference/06-adapters/10-use-cases.md) — *Common patterns and examples for deployment adapter implementations.*
- [**Adapters**](../docs_markdown/02-pages/04-api-reference/06-adapters/index.md) — *Build deployment adapters for Next.js platforms and infrastructure.*
- [**Edge Runtime**](../docs_markdown/02-pages/04-api-reference/06-edge.md) — *API Reference for the Edge Runtime.*
- [**Turbopack**](../docs_markdown/02-pages/04-api-reference/08-turbopack.md) — *Turbopack is an incremental bundler optimized for JavaScript and TypeScript, written in Rust, and built into Next.js.*
- [**API Reference**](../docs_markdown/02-pages/04-api-reference/index.md) — *Next.js API Reference for the Pages Router.*
- [**Pages Router**](../docs_markdown/02-pages/index.md) — *Before Next.js 13, the Pages Router was the main way to create routes in Next.js with an intuitive file-system router.*

### 📁 Arquitectura e Internals (03-architecture) (5 temas)

- [**Accessibility**](../docs_markdown/03-architecture/accessibility.md) — *The built-in accessibility features of Next.js.*
- [**Fast Refresh**](../docs_markdown/03-architecture/fast-refresh.md) — *Fast Refresh is a hot module reloading experience that gives you instantaneous feedback on edits made to your React components.*
- [**Architecture**](../docs_markdown/03-architecture/index.md) — *How Next.js Works*
- [**Next.js Compiler**](../docs_markdown/03-architecture/nextjs-compiler.md) — *Next.js Compiler, written in Rust, which transforms and minifies your Next.js application.*
- [**Supported Browsers**](../docs_markdown/03-architecture/supported-browsers.md) — *Browser support and which JavaScript features are supported by Next.js.*

### 📁 Comunidad y Ecosistema (04-community) (3 temas)

- [**Docs Contribution Guide**](../docs_markdown/04-community/01-contribution-guide.md) — *Learn how to contribute to Next.js Documentation*
- [**Rspack Integration**](../docs_markdown/04-community/02-rspack.md) — *Use the `next-rspack` plugin to bundle your Next.js with Rspack.*
- [**Next.js Community**](../docs_markdown/04-community/index.md) — *Get involved in the Next.js community.*

