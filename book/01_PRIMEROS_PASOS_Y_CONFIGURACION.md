# Capítulo 1: Primeros Pasos y Configuración Inicial

> 📌 **Capítulo 01** | Libro Guía Next.js v16.3.7  
> 📝 **Resumen:** *Instalación, estructura de proyectos, archivos de configuración, TypeScript, ESLint y primeros conceptos.*  
> 📄 **Temas incluidos en este capítulo:** 6 secciones  

[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)

---

## Contenido del Capítulo

- [Installation](#installation)
- [Project structure and organization](#project-structure-and-organization)
- [CSS](#css)
- [Proxy](#proxy)
- [Upgrading](#upgrading)
- [Getting Started](#getting-started)

---

<a id="installation"></a>

## Installation

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/installation](https://nextjs.org/docs/app/getting-started/installation)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to create a new Next.js application with the `create-next-app` CLI, and set up TypeScript, ESLint, and Module Path Aliases.*  

---

Create a new Next.js app and run it locally.

## Quick start

1. Create a new Next.js app named `my-app`
2. `cd my-app` and start the dev server.
3. Visit `http://localhost:3000`.

```bash
# Manejador de paquetes: pnpm
pnpm create next-app@latest my-app --yes
cd my-app
pnpm dev
```

```bash
# Manejador de paquetes: npm
npx create-next-app@latest my-app --yes
cd my-app
npm run dev
```

```bash
# Manejador de paquetes: yarn
yarn create next-app@latest my-app --yes
cd my-app
yarn dev
```

```bash
# Manejador de paquetes: bun
bun create next-app@latest my-app --yes
cd my-app
bun dev
```

- `--yes` skips prompts using saved preferences or defaults. The default setup enables TypeScript, Tailwind CSS, ESLint, App Router, and Turbopack, with import alias `@/*`, and includes `AGENTS.md` (with a `CLAUDE.md` that references it) to guide coding agents to write up-to-date Next.js code.

## System requirements

Before you begin, make sure your development environment meets the following requirements:

- Minimum Node.js version: [20.9](https://nodejs.org/)
- Operating systems: macOS, Windows (including WSL), and Linux.

## Supported browsers

Next.js supports modern browsers with zero configuration.

- Chrome 111+
- Edge 111+
- Firefox 111+
- Safari 16.4+

Learn more about [browser support](/docs/architecture/supported-browsers), including how to configure polyfills and target specific browsers.

## Create with the CLI

The quickest way to create a new Next.js app is using [`create-next-app`](/docs/app/api-reference/cli/create-next-app), which sets up everything automatically for you. To create a project, run:

```bash
# Manejador de paquetes: pnpm
pnpm create next-app
```

```bash
# Manejador de paquetes: npm
npx create-next-app@latest
```

```bash
# Manejador de paquetes: yarn
yarn create next-app
```

```bash
# Manejador de paquetes: bun
bun create next-app
```

On installation, you'll see the following prompts:

```txt
// Archivo: Terminal
What is your project named? my-app
Would you like to use the recommended Next.js defaults?
    Yes, use recommended defaults - TypeScript, ESLint, Tailwind CSS, App Router, AGENTS.md
    No, reuse previous settings
    No, customize settings - Choose your own preferences
```

If you choose to `customize settings`, you'll see the following prompts:

```txt
// Archivo: Terminal
Would you like to use TypeScript? No / Yes
Which linter would you like to use? ESLint / Biome / None
Would you like to use React Compiler? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
Would you like to include AGENTS.md to guide coding agents to write up-to-date Next.js code? No / Yes
```

After the prompts, [`create-next-app`](/docs/app/api-reference/cli/create-next-app) will create a folder with your project name and install the required dependencies.

## Manual installation

To manually create a new Next.js app, install the required packages:

```bash
# Manejador de paquetes: pnpm
pnpm i next@latest react@latest react-dom@latest
```

```bash
# Manejador de paquetes: npm
npm i next@latest react@latest react-dom@latest
```

```bash
# Manejador de paquetes: yarn
yarn add next@latest react@latest react-dom@latest
```

```bash
# Manejador de paquetes: bun
bun add next@latest react@latest react-dom@latest
```

> **Good to know**:
>
> - The `App Router` uses [React canary releases](https://react.dev/blog/2023/05/03/react-canaries) built-in, which include all the stable React 19 changes, as well as newer features being validated in frameworks, but you should still declare react and react-dom in package.json for tooling and ecosystem compatibility.
> - The `Pages Router` uses the React version from your `package.json`.

Then, add the following scripts to your `package.json` file:

```json
// Archivo: package.json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

These scripts refer to the different stages of developing an application:

- `next dev`: Starts the development server using Turbopack (default bundler).
- `next build`: Builds the application for production.
- `next start`: Starts the production server.
- `eslint`: Runs ESLint.

Turbopack is now the default bundler. To use Webpack run `next dev --webpack` or `next build --webpack`. See the [Turbopack docs](/docs/app/api-reference/turbopack) for configuration details.

### Create the `app` directory

Next.js uses file-system routing, which means the routes in your application are determined by how you structure your files.

Create an `app` folder. Then, inside `app`, create a `layout.tsx` file. This file is the [root layout](/docs/app/api-reference/file-conventions/layout#root-layout). It's required and must contain the `<html>` and `<body>` tags.

```tsx
// Archivo: app/layout.tsx switcher
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```jsx
// Archivo: app/layout.js switcher
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

Create a home page `app/page.tsx` with some initial content:

```tsx
// Archivo: app/page.tsx switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

```jsx
// Archivo: app/page.js switcher
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```

Both `layout.tsx` and `page.tsx` will be rendered when the user visits the root of your application (`/`).

![App Folder Structure]()

> **Good to know**:
>
> - If you forget to create the root layout, Next.js will automatically create this file when running the development server with `next dev`.
> - You can optionally use a [`src` folder](/docs/app/api-reference/file-conventions/src-folder) in the root of your project to separate your application's code from configuration files.

> 📘 **Nota para Pages Router:**
> ### Create the `pages` directory
> 
> Next.js uses file-system routing, which means the routes in your application are determined by how you structure your files.
> 
> Create a `pages` directory at the root of your project. Then, add an `index.tsx` file inside your `pages` folder. This will be your home page (`/`):
> 
> ```tsx filename="pages/index.tsx" switcher
> export default function Page() {
>   return <h1>Hello, Next.js!</h1>
> }
> ```
> 
> ```jsx filename="pages/index.js" switcher
> export default function Page() {
>   return <h1>Hello, Next.js!</h1>
> }
> ```
> 
> Next, add an `_app.tsx` file inside `pages/` to define the global layout. Learn more about the [custom App file](/docs/pages/building-your-application/routing/custom-app).
> 
> ```tsx filename="pages/_app.tsx" switcher
> import type { AppProps } from 'next/app'
> 
> export default function App({ Component, pageProps }: AppProps) {
>   return <Component {...pageProps} />
> }
> ```
> 
> ```jsx filename="pages/_app.js" switcher
> export default function App({ Component, pageProps }) {
>   return <Component {...pageProps} />
> }
> ```
> 
> Finally, add a `_document.tsx` file inside `pages/` to control the initial response from the server. Learn more about the [custom Document file](/docs/pages/building-your-application/routing/custom-document).
> 
> ```tsx filename="pages/_document.tsx" switcher
> import { Html, Head, Main, NextScript } from 'next/document'
> 
> export default function Document() {
>   return (
>     <Html>
>       <Head />
>       <body>
>         <Main />
>         <NextScript />
>       </body>
>     </Html>
>   )
> }
> ```
> 
> ```jsx filename="pages/_document.js" switcher
> import { Html, Head, Main, NextScript } from 'next/document'
> 
> export default function Document() {
>   return (
>     <Html>
>       <Head />
>       <body>
>         <Main />
>         <NextScript />
>       </body>
>     </Html>
>   )
> }
> ```

### Create the `public` folder (optional)

Create a [`public` folder](/docs/app/api-reference/file-conventions/public-folder) at the root of your project to store static assets such as images, fonts, etc. Files inside `public` can then be referenced by your code starting from the base URL (`/`).

You can then reference these assets using the root path (`/`). For example, `public/profile.png` can be referenced as `/profile.png`:

```tsx
// Archivo: app/page.tsx highlight={4} switcher
import Image from 'next/image'

export default function Page() {
  return 

![Profile](https://nextjs.org/profile.png)


}
```

```jsx
// Archivo: app/page.js highlight={4} switcher
import Image from 'next/image'

export default function Page() {
  return 

![Profile](https://nextjs.org/profile.png)


}
```

## Run the development server

1. Run `npm run dev` to start the development server.
2. Visit `http://localhost:3000` to view your application.
3. Edit the `app/page.tsx`

> 📘 **Nota para Pages Router:**
> `pages/index.tsx`

 file and save it to see the updated result in your browser.

## Set up TypeScript

> Minimum TypeScript version: `v5.1.0`

Next.js comes with built-in TypeScript support. To add TypeScript to your project, rename a file to `.ts` / `.tsx` and run `next dev`. Next.js will automatically install the necessary dependencies and add a `tsconfig.json` file with the recommended config options.

### IDE Plugin

Next.js includes a custom TypeScript plugin and type checker, which VSCode and other code editors can use for advanced type-checking and auto-completion.

You can enable the plugin in VS Code by:

1. Opening the command palette (`Ctrl/⌘` + `Shift` + `P`)
2. Searching for "TypeScript: Select TypeScript Version"
3. Selecting "Use Workspace Version"

![TypeScript Command Palette]()

See the [TypeScript reference](/docs/app/api-reference/config/typescript) page for more information.

## Set up your editor

The App Router names files by convention, like `page.tsx`, `layout.tsx`, and `route.ts`, so your editor quickly fills with same-named tabs. Label each tab with its enclosing folders, like `blog/[id]`, so you can tell them apart.

In VS Code 1.88+ or Cursor, add [custom editor labels](https://code.visualstudio.com/updates/v1_88#_customize-editor-labels) to `.vscode/settings.json`. Labeling two folders deep keeps dynamic routes like `blog/[id]/page.tsx` from all collapsing to the same `[id]` label:

```json
// Archivo: .vscode/settings.json
{
  "workbench.editor.customLabels.patterns": {
    "**/app/**/page.tsx": "${dirname(1)}/${dirname} - page.tsx",
    "**/app/**/layout.tsx": "${dirname(1)}/${dirname} - layout.tsx",
    "**/app/**/loading.tsx": "${dirname(1)}/${dirname} - loading.tsx",
    "**/app/**/error.tsx": "${dirname(1)}/${dirname} - error.tsx",
    "**/app/**/not-found.tsx": "${dirname(1)}/${dirname} - not-found.tsx",
    "**/app/**/template.tsx": "${dirname(1)}/${dirname} - template.tsx",
    "**/app/**/default.tsx": "${dirname(1)}/${dirname} - default.tsx",
    "**/app/**/route.ts": "${dirname(1)}/${dirname} - route.ts"
  }
}
```

Or copy this prompt to have your coding agent set it up:

```prompt
Set up custom editor labels so my Next.js App Router files are easy to tell apart. Read https://nextjs.org/docs/app/getting-started/installation#set-up-your-editor and add the workbench.editor.customLabels.patterns config shown there to my .vscode/settings.json, creating the file if it doesn't exist. Adjust the labels to taste. If I use a different editor, apply the equivalent setting or tell me it's automatic, and leave my other settings untouched.
```

> **Good to know:** JetBrains IDEs (WebStorm, IntelliJ) show the folder for same-named files automatically, so no setup is needed.

## Set up linting

Next.js supports linting with either ESLint or Biome. Choose a linter and run it directly via `package.json` scripts.

- Use **ESLint** (comprehensive rules):

```json
// Archivo: package.json
{
  "scripts": {
    "lint": "eslint",
    "lint:fix": "eslint --fix"
  }
}
```

- Or use **Biome** (fast linter + formatter):

```json
// Archivo: package.json
{
  "scripts": {
    "lint": "biome check",
    "format": "biome format --write"
  }
}
```

If your project previously used `next lint`, migrate your scripts to the ESLint CLI with the codemod:

```bash
// Archivo: Terminal
npx @next/codemod@canary next-lint-to-eslint-cli .
```

If you use ESLint, create an explicit config (recommended `eslint.config.mjs`). ESLint supports both [the legacy `.eslintrc.*` and the newer `eslint.config.mjs` formats](https://eslint.org/docs/latest/use/configure/configuration-files#configuring-eslint). See the [ESLint API reference](/docs/app/api-reference/config/eslint#with-core-web-vitals) for a recommended setup.

> **Good to know**: Starting with Next.js 16, `next build` no longer runs the linter automatically. Instead, you can run your linter through NPM scripts.

See the [ESLint Plugin](/docs/app/api-reference/config/eslint) page for more information.

## Set up Absolute Imports and Module Path Aliases

Next.js has in-built support for the `"paths"` and `"baseUrl"` options of `tsconfig.json` and `jsconfig.json` files.

These options allow you to alias project directories to absolute paths, making it easier and cleaner to import modules. For example:

```jsx
// Before
import { Button } from '../../../components/button'

// After
import { Button } from '@/components/button'
```

To configure absolute imports, add the `baseUrl` configuration option to your `tsconfig.json` or `jsconfig.json` file. For example:

```json
// Archivo: tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src/"
  }
}
```

In addition to configuring the `baseUrl` path, you can use the `"paths"` option to `"alias"` module paths.

For example, the following configuration maps `@/components/*` to `components/*`:

```json
// Archivo: tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": "src/",
    "paths": {
      "@/styles/*": ["styles/*"],
      "@/components/*": ["components/*"]
    }
  }
}
```

Each of the `"paths"` are relative to the `baseUrl` location.

## Upgrade your Next.js app

Keep your Next.js version up to date. Each release ships security patches, bug fixes, and performance optimizations alongside new features, and staying current keeps every individual upgrade small. Run the `upgrade` command:

```bash
# Manejador de paquetes: pnpm
pnpm next upgrade
```

```bash
# Manejador de paquetes: npm
npx next upgrade
```

```bash
# Manejador de paquetes: yarn
yarn next upgrade
```

```bash
# Manejador de paquetes: bun
bunx next upgrade
```

Upgrading also updates the documentation bundled inside the `next` package at `node_modules/next/dist/docs/`. New features arrive with their docs, and existing pages pick up new guidance and pitfalls discovered along the way. [AI coding agents](/docs/app/guides/ai-agents) in your project then work from the version you have installed rather than their training data. After an upgrade, you can prompt your agent to catch up:

```prompt
Let's get our Next.js knowledge up to speed, and give me a summary of what's new for you
```

See [Upgrading](/docs/app/getting-started/upgrading) for version guides and manual upgrade steps, or the [preview docs](https://preview.nextjs.org) to explore features before they ship in a stable version.



[⬆ Subir al inicio del capítulo](#)

---

<a id="project-structure-and-organization"></a>

## Project structure and organization

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/project-structure](https://nextjs.org/docs/app/getting-started/project-structure)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn the folder and file conventions in Next.js, and how to organize your project.*  

---

This page provides an overview of **all** the folder and file conventions in Next.js, and recommendations for organizing your project.

## Folder and file conventions

### Top-level folders

Top-level folders are used to organize your application's code and static assets.

![Route segments to path segments]()

|                                                                    |                                    |
| ------------------------------------------------------------------ | ---------------------------------- |
| [`app`](/docs/app)                                                 | App Router                         |
| [`pages`](/docs/pages/building-your-application/routing)           | Pages Router                       |
| [`public`](/docs/app/api-reference/file-conventions/public-folder) | Static assets to be served         |
| [`src`](/docs/app/api-reference/file-conventions/src-folder)       | Optional application source folder |

### Top-level files

Top-level files are used to configure your application, manage dependencies, run proxy, integrate monitoring tools, and define environment variables.

|                                                                              |                                                                                    |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Next.js**                                                                  |                                                                                    |
| [`next.config.js`](/docs/app/api-reference/config/next-config-js)            | Configuration file for Next.js                                                     |
| [`package.json`](/docs/app/getting-started/installation#manual-installation) | Project dependencies and scripts                                                   |
| [`instrumentation.ts`](/docs/app/guides/instrumentation)                     | OpenTelemetry and Instrumentation file                                             |
| [`proxy.ts`](/docs/app/api-reference/file-conventions/proxy)                 | Next.js request proxy                                                              |
| [`.env`](/docs/app/guides/environment-variables)                             | Environment variables (should not be tracked by version control)                   |
| [`.env.local`](/docs/app/guides/environment-variables)                       | Local environment variables (should not be tracked by version control)             |
| [`.env.production`](/docs/app/guides/environment-variables)                  | Production environment variables (should not be tracked by version control)        |
| [`.env.development`](/docs/app/guides/environment-variables)                 | Development environment variables (should not be tracked by version control)       |
| [`eslint.config.mjs`](/docs/app/api-reference/config/eslint)                 | Configuration file for ESLint                                                      |
| `.gitignore`                                                                 | Git files and folders to ignore                                                    |
| [`next-env.d.ts`](/docs/app/api-reference/config/typescript#next-envdts)     | TypeScript declaration file for Next.js (should not be tracked by version control) |
| `tsconfig.json`                                                              | Configuration file for TypeScript                                                  |
| `jsconfig.json`                                                              | Configuration file for JavaScript                                                  |

### Routing Files

Add `page` to expose a route, `layout` for shared UI such as header, nav, or footer, `loading` for skeletons, `error` for error boundaries, and `route` for APIs.

|                                                                               |                     |                              |
| ----------------------------------------------------------------------------- | ------------------- | ---------------------------- |
| [`layout`](/docs/app/api-reference/file-conventions/layout)                   | `.js` `.jsx` `.tsx` | Layout                       |
| [`page`](/docs/app/api-reference/file-conventions/page)                       | `.js` `.jsx` `.tsx` | Page                         |
| [`loading`](/docs/app/api-reference/file-conventions/loading)                 | `.js` `.jsx` `.tsx` | Loading UI                   |
| [`not-found`](/docs/app/api-reference/file-conventions/not-found)             | `.js` `.jsx` `.tsx` | Not found UI                 |
| [`error`](/docs/app/api-reference/file-conventions/error)                     | `.js` `.jsx` `.tsx` | Error UI                     |
| [`global-error`](/docs/app/api-reference/file-conventions/error#global-error) | `.js` `.jsx` `.tsx` | Global error UI              |
| [`route`](/docs/app/api-reference/file-conventions/route)                     | `.js` `.ts`         | API endpoint                 |
| [`template`](/docs/app/api-reference/file-conventions/template)               | `.js` `.jsx` `.tsx` | Re-rendered layout           |
| [`default`](/docs/app/api-reference/file-conventions/default)                 | `.js` `.jsx` `.tsx` | Parallel route fallback page |

### Nested routes

Folders define URL segments. Nesting folders nests segments. Layouts at any level wrap their child segments. A route becomes public when a `page` or `route` file exists.

| Path                        | URL pattern     | Notes                         |
| --------------------------- | --------------- | ----------------------------- |
| `app/layout.tsx`            | —               | Root layout wraps all routes  |
| `app/blog/layout.tsx`       | —               | Wraps `/blog` and descendants |
| `app/page.tsx`              | `/`             | Public route                  |
| `app/blog/page.tsx`         | `/blog`         | Public route                  |
| `app/blog/authors/page.tsx` | `/blog/authors` | Public route                  |

### Dynamic routes

Parameterize segments with square brackets. Use `[segment]` for a single param, `[...segment]` for catch‑all, and `[[...segment]]` for optional catch‑all. Access values via the [`params`](/docs/app/api-reference/file-conventions/page#params-optional) prop.

| Path                            | URL pattern                                                          |
| ------------------------------- | -------------------------------------------------------------------- |
| `app/blog/[slug]/page.tsx`      | `/blog/my-first-post`                                                |
| `app/shop/[...slug]/page.tsx`   | `/shop/clothing`, `/shop/clothing/shirts`                            |
| `app/docs/[[...slug]]/page.tsx` | `/docs`, `/docs/layouts-and-pages`, `/docs/api-reference/use-router` |

### Route groups and private folders

Organize code without changing URLs with route groups [`(group)`](/docs/app/api-reference/file-conventions/route-groups#convention), and colocate non-routable files with private folders [`_folder`](#private-folders).

| Path                            | URL pattern | Notes                                     |
| ------------------------------- | ----------- | ----------------------------------------- |
| `app/(marketing)/page.tsx`      | `/`         | Group omitted from URL                    |
| `app/(shop)/cart/page.tsx`      | `/cart`     | Share layouts within `(shop)`             |
| `app/blog/_components/Post.tsx` | —           | Not routable; safe place for UI utilities |
| `app/blog/_lib/data.ts`         | —           | Not routable; safe place for utils        |

### Parallel and Intercepted Routes

These features fit specific UI patterns, such as slot-based layouts or modal routing.

Use `@slot` for named slots rendered by a parent layout. Use intercept patterns to render another route inside the current layout without changing the URL, for example, to show a details view as a modal over a list.

| Pattern (docs)                                                                              | Meaning              | Typical use case                         |
| ------------------------------------------------------------------------------------------- | -------------------- | ---------------------------------------- |
| [`@folder`](/docs/app/api-reference/file-conventions/parallel-routes#slots)                 | Named slot           | Sidebar + main content                   |
| [`(.)folder`](/docs/app/api-reference/file-conventions/intercepting-routes#convention)      | Intercept same level | Preview sibling route in a modal         |
| [`(..)folder`](/docs/app/api-reference/file-conventions/intercepting-routes#convention)     | Intercept parent     | Open a child of the parent as an overlay |
| [`(..)(..)folder`](/docs/app/api-reference/file-conventions/intercepting-routes#convention) | Intercept two levels | Deeply nested overlay                    |
| [`(...)folder`](/docs/app/api-reference/file-conventions/intercepting-routes#convention)    | Intercept from root  | Show arbitrary route in current view     |

### Metadata file conventions

#### App icons

|                                                                                                                 |                                     |                          |
| --------------------------------------------------------------------------------------------------------------- | ----------------------------------- | ------------------------ |
| [`favicon`](/docs/app/api-reference/file-conventions/metadata/app-icons#favicon)                                | `.ico`                              | Favicon file             |
| [`icon`](/docs/app/api-reference/file-conventions/metadata/app-icons#icon)                                      | `.ico` `.jpg` `.jpeg` `.png` `.svg` | App Icon file            |
| [`icon`](/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx)       | `.js` `.ts` `.tsx`                  | Generated App Icon       |
| [`apple-icon`](/docs/app/api-reference/file-conventions/metadata/app-icons#apple-icon)                          | `.jpg` `.jpeg` `.png`               | Apple App Icon file      |
| [`apple-icon`](/docs/app/api-reference/file-conventions/metadata/app-icons#generate-icons-using-code-js-ts-tsx) | `.js` `.ts` `.tsx`                  | Generated Apple App Icon |

#### Open Graph and Twitter images

|                                                                                                                             |                              |                            |
| --------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------- |
| [`opengraph-image`](/docs/app/api-reference/file-conventions/metadata/opengraph-image#opengraph-image)                      | `.jpg` `.jpeg` `.png` `.gif` | Open Graph image file      |
| [`opengraph-image`](/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx) | `.js` `.ts` `.tsx`           | Generated Open Graph image |
| [`twitter-image`](/docs/app/api-reference/file-conventions/metadata/opengraph-image#twitter-image)                          | `.jpg` `.jpeg` `.png` `.gif` | Twitter image file         |
| [`twitter-image`](/docs/app/api-reference/file-conventions/metadata/opengraph-image#generate-images-using-code-js-ts-tsx)   | `.js` `.ts` `.tsx`           | Generated Twitter image    |

#### SEO

|                                                                                                              |             |                       |
| ------------------------------------------------------------------------------------------------------------ | ----------- | --------------------- |
| [`sitemap`](/docs/app/api-reference/file-conventions/metadata/sitemap#sitemap-files-xml)                     | `.xml`      | Sitemap file          |
| [`sitemap`](/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts) | `.js` `.ts` | Generated Sitemap     |
| [`robots`](/docs/app/api-reference/file-conventions/metadata/robots#static-robotstxt)                        | `.txt`      | Robots file           |
| [`robots`](/docs/app/api-reference/file-conventions/metadata/robots#generate-a-robots-file)                  | `.js` `.ts` | Generated Robots file |

> 📘 **Nota para Pages Router:**
> ### File conventions
> 
> |                                                                                                             |                     |                   |
> | ----------------------------------------------------------------------------------------------------------- | ------------------- | ----------------- |
> | [`_app`](/docs/pages/building-your-application/routing/custom-app)                                          | `.js` `.jsx` `.tsx` | Custom App        |
> | [`_document`](/docs/pages/building-your-application/routing/custom-document)                                | `.js` `.jsx` `.tsx` | Custom Document   |
> | [`_error`](/docs/pages/building-your-application/routing/custom-error#more-advanced-error-page-customizing) | `.js` `.jsx` `.tsx` | Custom Error Page |
> | [`404`](/docs/pages/building-your-application/routing/custom-error#404-page)                                | `.js` `.jsx` `.tsx` | 404 Error Page    |
> | [`500`](/docs/pages/building-your-application/routing/custom-error#500-page)                                | `.js` `.jsx` `.tsx` | 500 Error Page    |
> 
> ### Routes
> 
> |                                                                                                |                     |             |
> | ---------------------------------------------------------------------------------------------- | ------------------- | ----------- |
> | **Folder convention**                                                                          |                     |             |
> | [`index`](/docs/pages/building-your-application/routing/pages-and-layouts#index-routes)        | `.js` `.jsx` `.tsx` | Home page   |
> | [`folder/index`](/docs/pages/building-your-application/routing/pages-and-layouts#index-routes) | `.js` `.jsx` `.tsx` | Nested page |
> | **File convention**                                                                            |                     |             |
> | [`index`](/docs/pages/building-your-application/routing/pages-and-layouts#index-routes)        | `.js` `.jsx` `.tsx` | Home page   |
> | [`file`](/docs/pages/building-your-application/routing/pages-and-layouts)                      | `.js` `.jsx` `.tsx` | Nested page |
> 
> ### Dynamic routes
> 
> |                                                                                                                   |                     |                                  |
> | ----------------------------------------------------------------------------------------------------------------- | ------------------- | -------------------------------- |
> | **Folder convention**                                                                                             |                     |                                  |
> | [`[folder]/index`](/docs/pages/building-your-application/routing/dynamic-routes)                                  | `.js` `.jsx` `.tsx` | Dynamic route segment            |
> | [`[...folder]/index`](/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments)            | `.js` `.jsx` `.tsx` | Catch-all route segment          |
> | [`[[...folder]]/index`](/docs/pages/building-your-application/routing/dynamic-routes#optional-catch-all-segments) | `.js` `.jsx` `.tsx` | Optional catch-all route segment |
> | **File convention**                                                                                               |                     |                                  |
> | [`[file]`](/docs/pages/building-your-application/routing/dynamic-routes)                                          | `.js` `.jsx` `.tsx` | Dynamic route segment            |
> | [`[...file]`](/docs/pages/building-your-application/routing/dynamic-routes#catch-all-segments)                    | `.js` `.jsx` `.tsx` | Catch-all route segment          |
> | [`[[...file]]`](/docs/pages/building-your-application/routing/dynamic-routes#optional-catch-all-segments)         | `.js` `.jsx` `.tsx` | Optional catch-all route segment |

## Organizing your project

Next.js is **unopinionated** about how you organize and colocate your project files. But it does provide several features to help you organize your project.

### Component hierarchy

The components defined in special files are rendered in a specific hierarchy:

- `layout.js`
- `template.js`
- `error.js` (React error boundary)
- `loading.js` (React suspense boundary)
- `not-found.js` (React error boundary for "not found" UI)
- `page.js` or nested `layout.js`

![Component Hierarchy for File Conventions]()

The components are rendered recursively in nested routes, meaning the components of a route segment will be nested **inside** the components of its parent segment.

![Nested File Conventions Component Hierarchy]()

### Colocation

In the `app` directory, nested folders define route structure. Each folder represents a route segment that is mapped to a corresponding segment in a URL path.

However, even though route structure is defined through folders, a route is **not publicly accessible** until a `page.js` or `route.js` file is added to a route segment.

![A diagram showing how a route is not publicly accessible until a page.js or route.js file is added to a route segment.]()

And, even when a route is made publicly accessible, only the **content returned** by `page.js` or `route.js` is sent to the client.

![A diagram showing how page.js and route.js files make routes publicly accessible.]()

This means that **project files** can be **safely colocated** inside route segments in the `app` directory without accidentally being routable.

![A diagram showing colocated project files are not routable even when a segment contains a page.js or route.js file.]()

> **Good to know**: While you **can** colocate your project files in `app` you don't **have** to. If you prefer, you can [keep them outside the `app` directory](#store-project-files-outside-of-app).

### Private folders

Private folders can be created by prefixing a folder with an underscore: `_folderName`

This indicates the folder is a private implementation detail and should not be considered by the routing system, thereby **opting the folder and all its subfolders** out of routing.

![An example folder structure using private folders]()

Since files in the `app` directory can be [safely colocated by default](#colocation), private folders are not required for colocation. However, they can be useful for:

- Separating UI logic from routing logic.
- Consistently organizing internal files across a project and the Next.js ecosystem.
- Sorting and grouping files in code editors.
- Avoiding potential naming conflicts with future Next.js file conventions.

> **Good to know**:
>
> - While not a framework convention, you might also consider marking files outside private folders as "private" using the same underscore pattern.
> - You can create URL segments that start with an underscore by prefixing the folder name with `%5F` (the URL-encoded form of an underscore): `%5FfolderName`.
> - If you don't use private folders, it would be helpful to know Next.js [special file conventions](/docs/app/getting-started/project-structure#routing-files) to prevent unexpected naming conflicts.

### Route groups

Route groups can be created by wrapping a folder in parenthesis: `(folderName)`

This indicates the folder is for organizational purposes and should **not be included** in the route's URL path.

![An example folder structure using route groups]()

Route groups are useful for:

- Organizing routes by site section, intent, or team. e.g. marketing pages, admin pages, etc.
- Enabling nested layouts in the same route segment level:
  - [Creating multiple nested layouts in the same segment, including multiple root layouts](#creating-multiple-root-layouts)
  - [Adding a layout to a subset of routes in a common segment](#opting-specific-segments-into-a-layout)

### `src` folder

Next.js supports storing application code (including `app`) inside an optional [`src` folder](/docs/app/api-reference/file-conventions/src-folder). This separates application code from project configuration files which mostly live in the root of a project.

![An example folder structure with the `src` folder]()

## Examples

The following section lists a very high-level overview of common strategies. The simplest takeaway is to choose a strategy that works for you and your team and be consistent across the project.

> **Good to know**: In our examples below, we're using `components` and `lib` folders as generalized placeholders, their naming has no special framework significance and your projects might use other folders like `ui`, `utils`, `hooks`, `styles`, etc.

### Store project files outside of `app`

This strategy stores all application code in shared folders in the **root of your project** and keeps the `app` directory purely for routing purposes.

![An example folder structure with project files outside of app]()

### Store project files in top-level folders inside of `app`

This strategy stores all application code in shared folders in the **root of the `app` directory**.

![An example folder structure with project files inside app]()

### Split project files by feature or route

This strategy stores globally shared application code in the root `app` directory and **splits** more specific application code into the route segments that use them.

![An example folder structure with project files split by feature or route]()

### Organize routes without affecting the URL path

To organize routes without affecting the URL, create a group to keep related routes together. The folders in parenthesis will be omitted from the URL (e.g. `(marketing)` or `(shop)`).

![Organizing Routes with Route Groups]()

Even though routes inside `(marketing)` and `(shop)` share the same URL hierarchy, you can create a different layout for each group by adding a `layout.js` file inside their folders. These layouts nest within the existing app layout.

![Route Groups with Multiple Layouts]()

### Opting specific segments into a layout

To opt specific routes into a layout, create a new route group (e.g. `(shop)`) and move the routes that share the same layout into the group (e.g. `account` and `cart`). The routes outside of the group will not share the layout (e.g. `checkout`).

![Route Groups with Opt-in Layouts]()

### Opting for loading skeletons on a specific route

To apply a [loading skeleton](/docs/app/api-reference/file-conventions/loading) via a `loading.js` file to a specific route, create a new route group (e.g., `/(overview)`) and then move your `loading.tsx` inside that route group.

![Folder structure showing a loading.tsx and a page.tsx inside the route group]()

Now, the `loading.tsx` file will only apply to your dashboard → overview page instead of all your dashboard pages without affecting the URL path structure.

### Creating multiple root layouts

To create multiple [root layouts](/docs/app/api-reference/file-conventions/layout#root-layout), remove the top-level `layout.js` file, and add a `layout.js` file inside each route group. This is useful for partitioning an application into sections that have a completely different UI or experience. The `<html>` and `<body>` tags need to be added to each root layout.

![Route Groups with Multiple Root Layouts]()

In the example above, both `(marketing)` and `(shop)` have their own root layout.



[⬆ Subir al inicio del capítulo](#)

---

<a id="css"></a>

## CSS

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/css](https://nextjs.org/docs/app/getting-started/css)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn about the different ways to add CSS to your application, including Tailwind CSS, CSS Modules, Global CSS, and more.*  

---

Next.js provides several ways to style your application using CSS, including:

- [Tailwind CSS](#tailwind-css)
- [CSS Modules](#css-modules)
- [Global CSS](#global-css)
- [External Stylesheets](#external-stylesheets)
- [Sass](/docs/app/guides/sass)
- [CSS-in-JS](/docs/app/guides/css-in-js)

## Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/) is a utility-first CSS framework that provides low-level utility classes to build custom designs.

Install Tailwind CSS:

```bash
# Manejador de paquetes: pnpm
pnpm add -D tailwindcss @tailwindcss/postcss
```

```bash
# Manejador de paquetes: npm
npm install -D tailwindcss @tailwindcss/postcss
```

```bash
# Manejador de paquetes: yarn
yarn add -D tailwindcss @tailwindcss/postcss
```

```bash
# Manejador de paquetes: bun
bun add -D tailwindcss @tailwindcss/postcss
```

Add the PostCSS plugin to your `postcss.config.mjs` file:

```js
// Archivo: postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

Import Tailwind in your global CSS file:

```css
// Archivo: app/globals.css
@import 'tailwindcss';
```

Import the CSS file in your root layout:

```tsx
// Archivo: app/layout.tsx switcher
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```jsx
// Archivo: app/layout.js switcher
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

Now you can start using Tailwind's utility classes in your application:

```tsx
// Archivo: app/page.tsx switcher
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  )
}
```

```jsx
// Archivo: app/page.js switcher
export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
    </main>
  )
}
```

> 📘 **Nota para Pages Router:**
> Install Tailwind CSS:
> 
> ```bash package="pnpm"
> pnpm add -D tailwindcss @tailwindcss/postcss
> ```
> 
> ```bash package="npm"
> npm install -D tailwindcss @tailwindcss/postcss
> ```
> 
> ```bash package="yarn"
> yarn add -D tailwindcss @tailwindcss/postcss
> ```
> 
> ```bash package="bun"
> bun add -D tailwindcss @tailwindcss/postcss
> ```
> 
> Add the PostCSS plugin to your `postcss.config.mjs` file:
> 
> ```js filename="postcss.config.mjs"
> export default {
>   plugins: {
>     '@tailwindcss/postcss': {},
>   },
> }
> ```
> 
> Import Tailwind in your global CSS file:
> 
> ```css filename="styles/globals.css"
> @import 'tailwindcss';
> ```
> 
> Import the CSS file in your `pages/_app.js` file:
> 
> ```jsx filename="pages/_app.js"
> import '@/styles/globals.css'
> 
> export default function MyApp({ Component, pageProps }) {
>   return <Component {...pageProps} />
> }
> ```
> 
> Now you can start using Tailwind's utility classes in your application:
> 
> ```tsx filename="pages/index.tsx" switcher
> export default function Home() {
>   return (
>     <main className="flex min-h-screen flex-col items-center justify-between p-24">
>       <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
>     </main>
>   )
> }
> ```
> 
> ```jsx filename="pages/index.js" switcher
> export default function Home() {
>   return (
>     <main className="flex min-h-screen flex-col items-center justify-between p-24">
>       <h1 className="text-4xl font-bold">Welcome to Next.js!</h1>
>     </main>
>   )
> }
> ```

> **Good to know:** If you need broader browser support for very old browsers, see the [Tailwind CSS v3 setup instructions](/docs/app/guides/tailwind-v3-css).

## CSS Modules

CSS Modules locally scope CSS by generating unique class names. This allows you to use the same class in different files without worrying about naming collisions.

To start using CSS Modules, create a new file with the extension `.module.css` and import it into any component inside the `app` directory:

```css
// Archivo: app/blog/blog.module.css
.blog {
  padding: 24px;
}
```

```tsx
// Archivo: app/blog/page.tsx switcher
import styles from './blog.module.css'

export default function Page() {
  return <main className={styles.blog}></main>
}
```

```jsx
// Archivo: app/blog/page.js switcher
import styles from './blog.module.css'

export default function Page() {
  return <main className={styles.blog}></main>
}
```

> 📘 **Nota para Pages Router:**
> To start using CSS Modules, create a new file with the extension `.module.css` and import it into any component inside the `pages` directory:
> 
> ```css filename="styles/blog.module.css"
> .blog {
>   padding: 24px;
> }
> ```
> 
> ```tsx filename="pages/blog/index.tsx" switcher
> import styles from '@/styles/blog.module.css'
> 
> export default function Page() {
>   return <main className={styles.blog}></main>
> }
> ```
> 
> ```jsx filename="pages/blog/index.js" switcher
> import styles from '@/styles/blog.module.css'
> 
> export default function Page() {
>   return <main className={styles.blog}></main>
> }
> ```

## Global CSS

You can use global CSS to apply styles across your application.

Create a `app/global.css` file and import it in the root layout to apply the styles to **every route** in your application:

```css
// Archivo: app/global.css
body {
  padding: 20px 20px 60px;
  max-width: 680px;
  margin: 0 auto;
}
```

```tsx
// Archivo: app/layout.tsx switcher
// These styles apply to every route in the application
import './global.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

```jsx
// Archivo: app/layout.js switcher
// These styles apply to every route in the application
import './global.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

> **Good to know:** Global styles can be imported into any layout, page, or component inside the `app` directory. However, since Next.js uses React's built-in support for stylesheets to integrate with Suspense, this currently does not remove stylesheets as you navigate between routes which can lead to conflicts. We recommend using global styles for _truly_ global CSS (like Tailwind's base styles), [Tailwind CSS](#tailwind-css) for component styling, and [CSS Modules](#css-modules) for custom scoped CSS when needed.

> 📘 **Nota para Pages Router:**
> Import the stylesheet in the `pages/_app.js` file to apply the styles to **every route** in your application:
> 
> ```jsx filename="pages/_app.js"
> import '@/styles/global.css'
> 
> export default function MyApp({ Component, pageProps }) {
>   return <Component {...pageProps} />
> }
> ```
> 
> Due to the global nature of stylesheets, and to avoid conflicts, you should import them inside [`pages/_app.js`](/docs/pages/building-your-application/routing/custom-app).

## External stylesheets

Stylesheets published by external packages can be imported anywhere in the `app` directory, including colocated components:

```tsx
// Archivo: app/layout.tsx switcher
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

```jsx
// Archivo: app/layout.js switcher
import 'bootstrap/dist/css/bootstrap.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="container">{children}</body>
    </html>
  )
}
```

> **Good to know:** In React 19, `<link rel="stylesheet" href="..." />` can also be used. See the [React `link` documentation](https://react.dev/reference/react-dom/components/link) for more information.

> 📘 **Nota para Pages Router:**
> Next.js allows you to import CSS files from a JavaScript file. This is possible because Next.js extends the concept of [`import`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/import) beyond JavaScript.
> 
> ### Import styles from `node_modules`
> 
> Since Next.js **9.5.4**, importing a CSS file from `node_modules` is permitted anywhere in your application.
> 
> For global stylesheets, like `bootstrap` or `nprogress`, you should import the file inside `pages/_app.js`. For example:
> 
> ```jsx filename="pages/_app.js"
> import 'bootstrap/dist/css/bootstrap.css'
> 
> export default function MyApp({ Component, pageProps }) {
>   return <Component {...pageProps} />
> }
> ```
> 
> To import CSS required by a third-party component, you can do so in your component. For example:
> 
> ```jsx filename="components/example-dialog.js"
> import { useState } from 'react'
> import { Dialog } from '@reach/dialog'
> import VisuallyHidden from '@reach/visually-hidden'
> import '@reach/dialog/styles.css'
> 
> function ExampleDialog(props) {
>   const [showDialog, setShowDialog] = useState(false)
>   const open = () => setShowDialog(true)
>   const close = () => setShowDialog(false)
> 
>   return (
>     <div>
>       <button onClick={open}>Open Dialog</button>
>       <Dialog isOpen={showDialog} onDismiss={close}>
>         <button className="close-button" onClick={close}>
>           <VisuallyHidden>Close</VisuallyHidden>
>           <span aria-hidden>×</span>
>         </button>
>         <p>Hello there. I am a dialog</p>
>       </Dialog>
>     </div>
>   )
> }
> ```

## Ordering and Merging

Next.js optimizes CSS during production builds by automatically chunking (merging) stylesheets. The **order of your CSS** depends on the **order you import styles in your code**.

For example, `base-button.module.css` will be ordered before `page.module.css` since `<BaseButton>` is imported before `page.module.css`:

```tsx
// Archivo: page.tsx switcher
import { BaseButton } from './base-button'
import styles from './page.module.css'

export default function Page() {
  return <BaseButton className={styles.primary} />
}
```

```jsx
// Archivo: page.js switcher
import { BaseButton } from './base-button'
import styles from './page.module.css'

export default function Page() {
  return <BaseButton className={styles.primary} />
}
```

```tsx
// Archivo: base-button.tsx switcher
import styles from './base-button.module.css'

export function BaseButton() {
  return <button className={styles.primary} />
}
```

```jsx
// Archivo: base-button.js switcher
import styles from './base-button.module.css'

export function BaseButton() {
  return <button className={styles.primary} />
}
```

### Recommendations

To keep CSS ordering predictable:

- Try to contain CSS imports to a single JavaScript or TypeScript entry file
- Import global styles and Tailwind stylesheets in the root of your application.
- **Use Tailwind CSS** for most styling needs as it covers common design patterns with utility classes.
- Use CSS Modules for component-specific styles when Tailwind utilities aren't sufficient.
- Use a consistent naming convention for your CSS modules. For example, using `<name>.module.css` over `<name>.tsx`.
- Extract shared styles into shared components to avoid duplicate imports.
- Turn off linters or formatters that auto-sort imports like ESLint’s [`sort-imports`](https://eslint.org/docs/latest/rules/sort-imports).
- You can use the [`cssChunking`](/docs/app/api-reference/config/next-config-js/cssChunking) option in `next.config.js` to control how CSS is chunked.

## Development vs Production

- In development (`next dev`), CSS updates apply instantly with [Fast Refresh](/docs/architecture/fast-refresh).
- In production (`next build`), all CSS files are automatically concatenated into **many minified and code-split** `.css` files, ensuring the minimal amount of CSS is loaded for a route.
- CSS still loads with JavaScript disabled in production, but JavaScript is required in development for Fast Refresh.
- CSS ordering can behave differently in development, always ensure to check the build (`next build`) to verify the final CSS order.



[⬆ Subir al inicio del capítulo](#)

---

<a id="proxy"></a>

## Proxy

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/proxy](https://nextjs.org/docs/app/getting-started/proxy)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Use Next.js Proxy to rewrite, redirect, modify headers, or respond directly before a request completes.*  

---

## Proxy

> **Good to know**: Starting with Next.js 16, Middleware is now called Proxy to better reflect its purpose. The functionality remains the same.

Proxy allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers, or responding directly.

### Use cases

Some common scenarios where Proxy is effective include:

- Modifying headers for all pages or a subset of pages
- Rewriting to different pages based on A/B tests or experiments
- Programmatic redirects based on incoming request properties

For simple redirects, consider using the [`redirects`](/docs/app/api-reference/config/next-config-js/redirects) configuration in `next.config.ts` first. Proxy should be used when you need access to request data or more complex logic.

Proxy is _not_ intended for slow data fetching. While Proxy can be helpful for [optimistic checks](/docs/app/guides/authentication#optimistic-checks-with-proxy-optional) such as permission-based redirects, it should not be used as a full session management or authorization solution.

Using fetch with `options.cache`, `options.next.revalidate`, or `options.next.tags`, has no effect in Proxy.

### Convention

Create a `proxy.ts` (or `.js`) file in the project root, or inside `src` if applicable, so that it is located at the same level as `pages` or `app`.

> **Note**: While only one `proxy.ts` file is supported per project, you can still organize your proxy logic into modules. Break out proxy functionalities into separate `.ts` or `.js` files and import them into your main `proxy.ts` file. This allows for cleaner management of route-specific proxy, aggregated in the `proxy.ts` for centralized control. By enforcing a single proxy file, it simplifies configuration, prevents potential conflicts, and optimizes performance by avoiding multiple proxy layers.

### Example

You can export your proxy function as either a default export or a named `proxy` export:

```ts
// Archivo: proxy.ts switcher
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: '/about/:path*',
}
```

```js
// Archivo: proxy.js switcher
import { NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request) {
  return NextResponse.redirect(new URL('/home', request.url))
}

// Alternatively, you can use a default export:
// export default function proxy(request) { ... }

export const config = {
  matcher: '/about/:path*',
}
```

The `matcher` config allows you to filter Proxy to run on specific paths. See the [Matcher](/docs/app/api-reference/file-conventions/proxy#matcher) documentation for more details on path matching.

Read more about [using `proxy`](/docs/app/guides/backend-for-frontend#proxy), or refer to the `proxy` [API reference](/docs/app/api-reference/file-conventions/proxy).



[⬆ Subir al inicio del capítulo](#)

---

<a id="upgrading"></a>

## Upgrading

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/upgrading](https://nextjs.org/docs/app/getting-started/upgrading)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to upgrade your Next.js application to the latest version or canary.*  

---

## Latest version

To update to the latest version of Next.js, you can use the `upgrade` command:

```bash
# Manejador de paquetes: pnpm
pnpm next upgrade
```

```bash
# Manejador de paquetes: npm
npx next upgrade
```

```bash
# Manejador de paquetes: yarn
yarn next upgrade
```

```bash
# Manejador de paquetes: bun
bunx next upgrade
```

Versions before Next.js 16.1.0 do not support the `upgrade` command and need to use a separate package instead:

```bash
// Archivo: Terminal
npx @next/codemod@canary upgrade latest
```

If you prefer to upgrade manually, install the latest Next.js and React versions:

```bash
# Manejador de paquetes: pnpm
pnpm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash
# Manejador de paquetes: npm
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash
# Manejador de paquetes: yarn
yarn add next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash
# Manejador de paquetes: bun
bun add next@latest react@latest react-dom@latest eslint-config-next@latest
```

## Canary version

To update to the latest canary, make sure you're on the latest version of Next.js and everything is working as expected. Then, run the following command:

```bash
# Manejador de paquetes: pnpm
pnpm add next@canary
```

```bash
# Manejador de paquetes: npm
npm i next@canary
```

```bash
# Manejador de paquetes: yarn
yarn add next@canary
```

```bash
# Manejador de paquetes: bun
bun add next@canary
```

### Features available in canary

The following features are currently available in canary:

**Authentication**:

- [`forbidden`](/docs/app/api-reference/functions/forbidden)
- [`unauthorized`](/docs/app/api-reference/functions/unauthorized)
- [`forbidden.js`](/docs/app/api-reference/file-conventions/forbidden)
- [`unauthorized.js`](/docs/app/api-reference/file-conventions/unauthorized)
- [`authInterrupts`](/docs/app/api-reference/config/next-config-js/authInterrupts)



[⬆ Subir al inicio del capítulo](#)

---

<a id="getting-started"></a>

## Getting Started

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started](https://nextjs.org/docs/app/getting-started)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to create full-stack web applications with the Next.js App Router.*  

---

Welcome to the Next.js documentation!

This **Getting Started** section will help you create your first Next.js app and learn the core features you'll use in every project.

## Pre-requisite knowledge

Our documentation assumes some familiarity with web development. Before getting started, it'll help if you're comfortable with:

- HTML
- CSS
- JavaScript
- React

If you're new to React or need a refresher, we recommend starting with our [React Foundations course](/learn/react-foundations), and the [Next.js Foundations course](/learn/dashboard-app) that has you building an application as you learn.

## Next Steps



[⬆ Subir al inicio del capítulo](#)

---

