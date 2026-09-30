# Capítulo 13: Arquitectura Interna, Compilador Next.js y Comunidad

> 📌 **Capítulo 13** | Libro Guía Next.js v16.3.7  
> 📝 **Resumen:** *Next.js Compiler (SWC / Rust), Fast Refresh, compatibilidad con navegadores, guías de contribución y rspack.*  
> 📄 **Temas incluidos en este capítulo:** 8 secciones  

[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)

---

## Contenido del Capítulo

- [Accessibility](#accessibility)
- [Fast Refresh](#fast-refresh)
- [Architecture](#architecture)
- [Next.js Compiler](#nextjs-compiler)
- [Supported Browsers](#supported-browsers)
- [Docs Contribution Guide](#docs-contribution-guide)
- [Rspack Integration](#rspack-integration)
- [Next.js Community](#nextjs-community)

---

<a id="accessibility"></a>

## Accessibility

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/architecture/accessibility](https://nextjs.org/docs/architecture/accessibility)  
> 📂 **Sección:** Architecture  
> 📝 **Descripción:** *The built-in accessibility features of Next.js.*  

---

The Next.js team is committed to making Next.js accessible to all developers (and their end-users). By adding accessibility features to Next.js by default, we aim to make the Web more inclusive for everyone.

## Route Announcements

When transitioning between pages rendered on the server (e.g. using the `<a href>` tag) screen readers and other assistive technology announce the page title when the page loads so that users understand that the page has changed.

In addition to traditional page navigations, Next.js also supports client-side transitions for improved performance (using `next/link`). To ensure that client-side transitions are also announced to assistive technology, Next.js includes a route announcer by default.

The Next.js route announcer looks for the page name to announce by first inspecting `document.title`, then the `<h1>` element, and finally the URL pathname. For the most accessible user experience, ensure that each page in your application has a unique and descriptive title.

## Linting

Next.js provides an [integrated ESLint experience](/docs/pages/api-reference/config/eslint) out of the box, including custom rules for Next.js. By default, Next.js includes `eslint-plugin-jsx-a11y` to help catch accessibility issues early, including warning on:

- [aria-props](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/aria-props.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)
- [aria-proptypes](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/aria-proptypes.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)
- [aria-unsupported-elements](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/aria-unsupported-elements.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)
- [role-has-required-aria-props](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/role-has-required-aria-props.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)
- [role-supports-aria-props](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/HEAD/docs/rules/role-supports-aria-props.md?rgh-link-date=2021-06-04T02%3A10%3A36Z)

For example, this plugin helps ensure you add alt text to `img` tags, use correct `aria-*` attributes, use correct `role` attributes, and more.

## Accessibility Resources

- [WebAIM WCAG checklist](https://webaim.org/standards/wcag/checklist)
- [WCAG 2.2 Guidelines](https://www.w3.org/TR/WCAG22/)
- [The A11y Project](https://www.a11yproject.com/)
- Check [color contrast ratios](https://developer.mozilla.org/docs/Web/Accessibility/Understanding_WCAG/Perceivable/Color_contrast) between foreground and background elements
- Use [`prefers-reduced-motion`](https://web.dev/prefers-reduced-motion/) when working with animations



[⬆ Subir al inicio del capítulo](#)

---

<a id="fast-refresh"></a>

## Fast Refresh

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/architecture/fast-refresh](https://nextjs.org/docs/architecture/fast-refresh)  
> 📂 **Sección:** Architecture  
> 📝 **Descripción:** *Fast Refresh is a hot module reloading experience that gives you instantaneous feedback on edits made to your React components.*  

---

Fast refresh is a React feature integrated into Next.js that allows you to live reload the browser page while maintaining temporary client-side state when you save changes to a file. It's enabled by default in all Next.js applications on **9.4 or newer**. With Fast Refresh enabled, most edits should be visible within a second.

## How It Works

- If you edit a file that **only exports React component(s)**, Fast Refresh will
  update the code only for that file, and re-render your component. You can edit
  anything in that file, including styles, rendering logic, event handlers, or
  effects.
- If you edit a file with exports that _aren't_ React components, Fast Refresh
  will re-run both that file, and the other files importing it. So if both
  `Button.js` and `Modal.js` import `theme.js`, editing `theme.js` will update
  both components.
- Finally, if you **edit a file** that's **imported by files outside of the
  React tree**, Fast Refresh **will fall back to doing a full reload**. You
  might have a file which renders a React component but also exports a value
  that is imported by a **non-React component**. For example, maybe your
  component also exports a constant, and a non-React utility file imports it. In
  that case, consider migrating the constant to a separate file and importing it
  into both files. This will re-enable Fast Refresh to work. Other cases can
  usually be solved in a similar way.

## Error Resilience

### Syntax Errors

If you make a syntax error during development, you can fix it and save the file
again. The error will disappear automatically, so you won't need to reload the
app. **You will not lose component state**.

### Runtime Errors

If you make a mistake that leads to a runtime error inside your component,
you'll be greeted with a contextual overlay. Fixing the error will automatically
dismiss the overlay, without reloading the app.

Component state will be retained if the error did not occur during rendering. If
the error did occur during rendering, React will remount your application using
the updated code.

If you have [error boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
in your app (which is a good idea for graceful failures in production), they
will retry rendering on the next edit after a rendering error. This means having
an error boundary can prevent you from always getting reset to the root app
state. However, keep in mind that error boundaries shouldn't be _too_ granular.
They are used by React in production, and should always be designed
intentionally.

## Limitations

Fast Refresh tries to preserve local React state in the component you're
editing, but only if it's safe to do so. Here's a few reasons why you might see
local state being reset on every edit to a file:

- Local state is not preserved for class components (only function components
  and Hooks preserve state).
- The file you're editing might have _other_ exports in addition to a React
  component.
- Sometimes, a file would export the result of calling a higher-order component
  like `HOC(WrappedComponent)`. If the returned component is a
  class, its state will be reset.
- Anonymous arrow functions like `export default () => <div />;` cause Fast Refresh to not preserve local component state. For large codebases you can use our [`name-default-component` codemod](/docs/pages/guides/upgrading/codemods#name-default-component).

As more of your codebase moves to function components and Hooks, you can expect
state to be preserved in more cases.

## Tips

- Fast Refresh preserves React local state in function components (and Hooks) by
  default.
- Sometimes you might want to _force_ the state to be reset, and a component to
  be remounted. For example, this can be handy if you're tweaking an animation
  that only happens on mount. To do this, you can add `// @refresh reset`
  anywhere in the file you're editing. This directive is local to the file, and
  instructs Fast Refresh to remount components defined in that file on every
  edit.
- You can put `console.log` or `debugger;` into the components you edit during
  development.
- Remember that imports are case sensitive. Both fast and full refresh can fail,
  when your import doesn't match the actual filename.
  For example, `'./header'` vs `'./Header'`.

## Fast Refresh and Hooks

When possible, Fast Refresh attempts to preserve the state of your component
between edits. In particular, `useState` and `useRef` preserve their previous
values as long as you don't change their arguments or the order of the Hook
calls.

Hooks with dependencies—such as `useEffect`, `useMemo`, and `useCallback`—will
_always_ update during Fast Refresh. Their list of dependencies will be ignored
while Fast Refresh is happening.

For example, when you edit `useMemo(() => x * 2, [x])` to
`useMemo(() => x * 10, [x])`, it will re-run even though `x` (the dependency)
has not changed. If React didn't do that, your edit wouldn't reflect on the
screen!

Sometimes, this can lead to unexpected results. For example, even a `useEffect`
with an empty array of dependencies would still re-run once during Fast Refresh.

However, writing code resilient to occasional re-running of `useEffect` is a good practice even
without Fast Refresh. It will make it easier for you to introduce new dependencies to it later on
and it's enforced by [React Strict Mode](/docs/pages/api-reference/config/next-config-js/reactStrictMode),
which we highly recommend enabling.



[⬆ Subir al inicio del capítulo](#)

---

<a id="architecture"></a>

## Architecture

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/architecture](https://nextjs.org/docs/architecture)  
> 📂 **Sección:** Architecture  
> 📝 **Descripción:** *How Next.js Works*  

---

Learn about the Next.js architecture and how it works under the hood.



[⬆ Subir al inicio del capítulo](#)

---

<a id="nextjs-compiler"></a>

## Next.js Compiler

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/architecture/nextjs-compiler](https://nextjs.org/docs/architecture/nextjs-compiler)  
> 📂 **Sección:** Architecture  
> 📝 **Descripción:** *Next.js Compiler, written in Rust, which transforms and minifies your Next.js application.*  

---

The Next.js Compiler, written in Rust using [SWC](https://swc.rs/), allows Next.js to transform and minify your JavaScript code for production. This replaces Babel for individual files and Terser for minifying output bundles.

Compilation using the Next.js Compiler is 17x faster than Babel and enabled by default since Next.js version 12. If you have an existing Babel configuration or are using [unsupported features](#unsupported-features), your application will opt-out of the Next.js Compiler and continue using Babel.

## Why SWC?

[SWC](https://swc.rs/) is an extensible Rust-based platform for the next generation of fast developer tools.

SWC can be used for compilation, minification, bundling, and more – and is designed to be extended. It's something you can call to perform code transformations (either built-in or custom). Running those transformations happens through higher-level tools like Next.js.

We chose to build on SWC for a few reasons:

- **Extensibility:** SWC can be used as a Crate inside Next.js, without having to fork the library or workaround design constraints.
- **Performance:** We were able to achieve ~3x faster Fast Refresh and ~5x faster builds in Next.js by switching to SWC, with more room for optimization still in progress.
- **WebAssembly:** Rust's support for WASM is essential for supporting all possible platforms and taking Next.js development everywhere.
- **Community:** The Rust community and ecosystem are amazing and still growing.

## Supported Features

### Styled Components

We're working to port `babel-plugin-styled-components` to the Next.js Compiler.

First, update to the latest version of Next.js: `npm install next@latest`. Then, update your `next.config.js` file:

```js
// Archivo: next.config.js
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

For advanced use cases, you can configure individual properties for styled-components compilation.

> Note: `ssr` and `displayName` transforms are the main requirement for using `styled-components` in Next.js.

```js
// Archivo: next.config.js
module.exports = {
  compiler: {
    // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
    styledComponents: {
      // Enabled by default in development, disabled in production to reduce file size,
      // setting this will override the default for all environments.
      displayName?: boolean,
      // Enabled by default.
      ssr?: boolean,
      // Enabled by default.
      fileName?: boolean,
      // Empty by default.
      topLevelImportPaths?: string[],
      // Defaults to ["index"].
      meaninglessFileNames?: string[],
      // Enabled by default.
      minify?: boolean,
      // Enabled by default.
      transpileTemplateLiterals?: boolean,
      // Empty by default.
      namespace?: string,
      // Disabled by default.
      pure?: boolean,
      // Enabled by default.
      cssProp?: boolean,
    },
  },
}
```

### Jest

The Next.js Compiler transpiles your tests and simplifies configuring Jest together with Next.js including:

- Auto mocking of `.css`, `.module.css` (and their `.scss` variants), and image imports
- Automatically sets up `transform` using SWC
- Loading `.env` (and all variants) into `process.env`
- Ignores `node_modules` from test resolving and transforms
- Ignoring `.next` from test resolving
- Loads `next.config.js` for flags that enable experimental SWC transforms

First, update to the latest version of Next.js: `npm install next@latest`. Then, update your `jest.config.js` file:

```js
// Archivo: jest.config.js
const nextJest = require('next/jest')

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({ dir: './' })

// Any custom config you want to pass to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
}

// createJestConfig is exported in this way to ensure that next/jest can load the Next.js configuration, which is async
module.exports = createJestConfig(customJestConfig)
```

### Relay

To enable [Relay](https://relay.dev/) support:

```js
// Archivo: next.config.js
module.exports = {
  compiler: {
    relay: {
      // This should match relay.config.js
      src: './',
      artifactDirectory: './__generated__',
      language: 'typescript',
      eagerEsModules: false,
    },
  },
}
```

> **Good to know**: In Next.js, all JavaScript files in `pages` directory are considered routes. So, for `relay-compiler` you'll need to specify `artifactDirectory` configuration settings outside of the `pages`, otherwise `relay-compiler` will generate files next to the source file in the `__generated__` directory, and this file will be considered a route, which will break production builds.

### Remove React Properties

Allows to remove JSX properties. This is often used for testing. Similar to `babel-plugin-react-remove-properties`.

To remove properties matching the default regex `^data-test`:

```js
// Archivo: next.config.js
module.exports = {
  compiler: {
    reactRemoveProperties: true,
  },
}
```

To remove custom properties:

```js
// Archivo: next.config.js
module.exports = {
  compiler: {
    // The regexes defined here are processed in Rust so the syntax is different from
    // JavaScript `RegExp`s. See https://docs.rs/regex.
    reactRemoveProperties: { properties: ['^data-custom$'] },
  },
}
```

### Remove Console

This transform allows for removing all `console.*` calls in application code (not `node_modules`). Similar to `babel-plugin-transform-remove-console`.

Remove all `console.*` calls:

```js
// Archivo: next.config.js
module.exports = {
  compiler: {
    removeConsole: true,
  },
}
```

Remove `console.*` output except `console.error`:

```js
// Archivo: next.config.js
module.exports = {
  compiler: {
    removeConsole: {
      exclude: ['error'],
    },
  },
}
```

### Legacy Decorators

Next.js will automatically detect `experimentalDecorators` in `jsconfig.json` or `tsconfig.json`. Legacy decorators are commonly used with older versions of libraries like `mobx`.

This flag is only supported for compatibility with existing applications. We do not recommend using legacy decorators in new applications.

First, update to the latest version of Next.js: `npm install next@latest`. Then, update your `jsconfig.json` or `tsconfig.json` file:

```js
{
  "compilerOptions": {
    "experimentalDecorators": true
  }
}
```

### importSource

Next.js will automatically detect `jsxImportSource` in `jsconfig.json` or `tsconfig.json` and apply that. This is commonly used with libraries like [Theme UI](https://theme-ui.com).

First, update to the latest version of Next.js: `npm install next@latest`. Then, update your `jsconfig.json` or `tsconfig.json` file:

```js
{
  "compilerOptions": {
    "jsxImportSource": "theme-ui"
  }
}
```

### Emotion

We're working to port `@emotion/babel-plugin` to the Next.js Compiler.

First, update to the latest version of Next.js: `npm install next@latest`. Then, update your `next.config.js` file:

```js
// Archivo: next.config.js

module.exports = {
  compiler: {
    emotion: boolean | {
      // default is true. It will be disabled when build type is production.
      sourceMap?: boolean,
      // default is 'dev-only'.
      autoLabel?: 'never' | 'dev-only' | 'always',
      // default is '[local]'.
      // Allowed values: `[local]` `[filename]` and `[dirname]`
      // This option only works when autoLabel is set to 'dev-only' or 'always'.
      // It allows you to define the format of the resulting label.
      // The format is defined via string where variable parts are enclosed in square brackets [].
      // For example labelFormat: "my-classname--[local]", where [local] will be replaced with the name of the variable the result is assigned to.
      labelFormat?: string,
      // default is undefined.
      // This option allows you to tell the compiler what imports it should
      // look at to determine what it should transform so if you re-export
      // Emotion's exports, you can still use transforms.
      importMap?: {
        [packageName: string]: {
          [exportName: string]: {
            canonicalImport?: [string, string],
            styledBaseImport?: [string, string],
          }
        }
      },
    },
  },
}
```

### Minification

Next.js' swc compiler is used for minification by default since v13. This is 7x faster than Terser.

> **Good to know:** Starting with v15, minification cannot be customized using `next.config.js`. Support for the `swcMinify` flag has been removed.

### Module Transpilation

Next.js can automatically transpile and bundle dependencies from local packages (like monorepos) or from external dependencies (`node_modules`). This replaces the `next-transpile-modules` package.

```js
// Archivo: next.config.js
module.exports = {
  transpilePackages: ['@acme/ui', 'lodash-es'],
}
```

### Modularize Imports

This option has been superseded by [`optimizePackageImports`](/docs/app/api-reference/config/next-config-js/optimizePackageImports) in Next.js 13.5. We recommend upgrading to use the new option that does not require manual configuration of import paths.

### Define (Replacing variables during build)

The `define` option allows you to statically replace variables in your code at build-time.
The option takes an object as key-value pairs, where the keys are the variables that should be replaced with the corresponding values.

Use the `compiler.define` field in `next.config.js` to define variables for all environments (server, edge, and client). Or, use `compiler.defineServer` to define variables only for server-side (server and edge) code:

```js
// Archivo: next.config.js
module.exports = {
  compiler: {
    define: {
      MY_VARIABLE: 'my-string',
      'process.env.MY_ENV_VAR': 'my-env-var',
    },
    defineServer: {
      MY_SERVER_VARIABLE: 'my-server-var',
    },
  },
}
```

### Build Lifecycle Hooks

The Next.js Compiler supports lifecycle hooks that allow you to run custom code at specific points during the build process. Currently, the following hook is supported:

#### runAfterProductionCompile

A hook function that executes after production build compilation finishes, but before running post-compilation tasks such as type checking and static page generation. This hook provides access to project metadata including the project directory and build output directory, making it useful for third-party tools to collect build outputs like sourcemaps.

```js
// Archivo: next.config.js
module.exports = {
  compiler: {
    runAfterProductionCompile: async ({ distDir, projectDir }) => {
      // Your custom code here
    },
  },
}
```

The hook receives an object with the following properties:

- `distDir`: The build output directory (defaults to `.next`)
- `projectDir`: The root directory of the project

## Experimental Features

### SWC Trace profiling

You can generate SWC's internal transform traces as chromium's [trace event format](https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview?mode=html#%21=).

```js
// Archivo: next.config.js
module.exports = {
  experimental: {
    swcTraceProfiling: true,
  },
}
```

Once enabled, swc will generate trace named as `swc-trace-profile-${timestamp}.json` under `.next/`. Chromium's trace viewer (chrome://tracing/, https://ui.perfetto.dev/), or compatible flamegraph viewer (https://www.speedscope.app/) can load & visualize generated traces.

### SWC Plugins (experimental)

You can configure swc's transform to use SWC's experimental plugin support written in wasm to customize transformation behavior.

```js
// Archivo: next.config.js
module.exports = {
  experimental: {
    swcPlugins: [
      [
        'plugin',
        {
          ...pluginOptions,
        },
      ],
    ],
  },
}
```

`swcPlugins` accepts an array of tuples for configuring plugins. A tuple for the plugin contains the path to the plugin and an object for plugin configuration. The path to the plugin can be an npm module package name or an absolute path to the `.wasm` binary itself.

## Unsupported Features

When your application has a `.babelrc` file, Next.js will automatically fall back to using Babel for transforming individual files. This ensures backwards compatibility with existing applications that leverage custom Babel plugins.

If you're using a custom Babel setup, [please share your configuration](https://github.com/vercel/next.js/discussions/30174). We're working to port as many commonly used Babel transformations as possible, as well as supporting plugins in the future.

## Version History

| Version   | Changes                                                                                                                                                                                                  |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v13.1.0` | [Module Transpilation](https://nextjs.org/blog/next-13-1#built-in-module-transpilation-stable) and [Modularize Imports](https://nextjs.org/blog/next-13-1#import-resolution-for-smaller-bundles) stable. |
| `v13.0.0` | SWC Minifier enabled by default.                                                                                                                                                                         |
| `v12.3.0` | SWC Minifier [stable](https://nextjs.org/blog/next-12-3#swc-minifier-stable).                                                                                                                            |
| `v12.2.0` | [SWC Plugins](#swc-plugins-experimental) experimental support added.                                                                                                                                     |
| `v12.1.0` | Added support for Styled Components, Jest, Relay, Remove React Properties, Legacy Decorators, Remove Console, and jsxImportSource.                                                                       |
| `v12.0.0` | Next.js Compiler [introduced](https://nextjs.org/blog/next-12).                                                                                                                                          |



[⬆ Subir al inicio del capítulo](#)

---

<a id="supported-browsers"></a>

## Supported Browsers

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/architecture/supported-browsers](https://nextjs.org/docs/architecture/supported-browsers)  
> 📂 **Sección:** Architecture  
> 📝 **Descripción:** *Browser support and which JavaScript features are supported by Next.js.*  

---

Next.js supports **modern browsers** with zero configuration.

- Chrome 111+
- Edge 111+
- Firefox 111+
- Safari 16.4+

## Browserslist

If you would like to target specific browsers or features, Next.js supports [Browserslist](https://browsersl.ist) configuration in your `package.json` file. Next.js uses the following Browserslist configuration by default:

```json
// Archivo: package.json
{
  "browserslist": ["chrome 111", "edge 111", "firefox 111", "safari 16.4"]
}
```

## Polyfills

We inject [widely used polyfills](https://github.com/vercel/next.js/blob/canary/packages/next-polyfill-nomodule/src/index.js), including:

- [**fetch()**](https://developer.mozilla.org/docs/Web/API/Fetch_API) — Replacing: `whatwg-fetch` and `unfetch`.
- [**URL**](https://developer.mozilla.org/docs/Web/API/URL) — Replacing: the [`url` package (Node.js API)](https://nodejs.org/api/url.html).
- [**Object.assign()**](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) — Replacing: `object-assign`, `object.assign`, and `core-js/object/assign`.

If any of your dependencies include these polyfills, they’ll be eliminated automatically from the production build to avoid duplication.

In addition, to reduce bundle size, Next.js will only load these polyfills for browsers that require them. The majority of the web traffic globally will not download these polyfills.

### Custom Polyfills

If your own code or any external npm dependencies require features not supported by your target browsers (such as IE 11), you need to add polyfills yourself.

#### In App Router

To include polyfills, you can import them into the [`instrumentation-client.js` file](/docs/app/api-reference/file-conventions/instrumentation-client).

```ts
// Archivo: instrumentation-client.ts
import './polyfills'
```

#### In Pages Router

In this case, you should add a top-level import for the **specific polyfill** you need in your [Custom `<App>`](/docs/pages/building-your-application/routing/custom-app) or the individual component.

```tsx
// Archivo: pages/_app.tsx switcher
import './polyfills'

import type { AppProps } from 'next/app'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
```

```jsx
// Archivo: pages/_app.jsx switcher
import './polyfills'

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

#### Conditionally loading polyfills

The best approach is to isolate unsupported features to specific UI sections and conditionally load the polyfill if needed.

```ts
// Archivo: hooks/analytics.ts switcher
import { useCallback } from 'react'

export const useAnalytics = () => {
  const tracker = useCallback(async (data: unknown) => {
    if (!('structuredClone' in globalThis)) {
      const mod = await import('polyfills/structured-clone')
      globalThis.structuredClone = mod.default
    }

    /* Do some work that uses structured clone */
  }, [])

  return tracker
}
```

```js
// Archivo: hooks/analytics.js switcher
import { useCallback } from 'react'

export const useAnalytics = () => {
  const tracker = useCallback(async (data) => {
    if (!('structuredClone' in globalThis)) {
      const mod = await import('polyfills/structured-clone')
      globalThis.structuredClone = mod.default
    }

    /* Do some work that uses structured clone */
  }, [])

  return tracker
}
```

## JavaScript Language Features

Next.js allows you to use the latest JavaScript features out of the box. In addition to [ES6 features](https://github.com/lukehoban/es6features), Next.js also supports:

- [Async/await](https://github.com/tc39/ecmascript-asyncawait) (ES2017)
- [Object Rest/Spread Properties](https://github.com/tc39/proposal-object-rest-spread) (ES2018)
- [Dynamic `import()`](https://github.com/tc39/proposal-dynamic-import) (ES2020)
- [Optional Chaining](https://github.com/tc39/proposal-optional-chaining) (ES2020)
- [Nullish Coalescing](https://github.com/tc39/proposal-nullish-coalescing) (ES2020)
- [Class Fields](https://github.com/tc39/proposal-class-fields) and [Static Properties](https://github.com/tc39/proposal-static-class-features) (ES2022)
- and more!

### TypeScript Features

Next.js has built-in TypeScript support. [Learn more here](/docs/pages/api-reference/config/typescript).

### Customizing Babel Config (Advanced)

You can customize babel configuration. [Learn more here](/docs/pages/guides/babel).



[⬆ Subir al inicio del capítulo](#)

---

<a id="docs-contribution-guide"></a>

## Docs Contribution Guide

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/community/contribution-guide](https://nextjs.org/docs/community/contribution-guide)  
> 📂 **Sección:** Community  
> 📝 **Descripción:** *Learn how to contribute to Next.js Documentation*  

---

Welcome to the Next.js Docs Contribution Guide! We're excited to have you here.

This page provides instructions on how to edit the Next.js documentation. Our goal is to ensure that everyone in the community feels empowered to contribute and improve our docs.

## Why Contribute?

Open-source work is never done, and neither is documentation. Contributing to docs is a good way for beginners to get involved in open-source and for experienced developers to clarify more complex topics while sharing their knowledge with the community.

By contributing to the Next.js docs, you're helping us build a more robust learning resource for all developers. Whether you've found a typo, a confusing section, or you've realized that a particular topic is missing, your contributions are welcomed and appreciated.

## How to Contribute

The docs content can be found on the [Next.js repo](https://github.com/vercel/next.js/tree/canary/docs). To contribute, you can edit the files directly on GitHub or clone the repo and edit the files locally.

### GitHub Workflow

If you're new to GitHub, we recommend reading the [GitHub Open Source Guide](https://opensource.guide/how-to-contribute/#opening-a-pull-request) to learn how to fork a repository, create a branch, and submit a pull request.

> **Good to know**: The underlying docs code lives in a private codebase that is synced to the Next.js public repo. This means that you can't preview the docs locally. However, you'll see your changes on [nextjs.org](https://nextjs.org/docs) after merging a pull request.

### Writing MDX

The docs are written in [MDX](https://mdxjs.com/), a markdown format that supports JSX syntax. This allows us to embed React components in the docs. See the [GitHub Markdown Guide](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) for a quick overview of markdown syntax.

### VSCode

#### Previewing Changes Locally

VSCode has a built-in markdown previewer that you can use to see your edits locally. To enable the previewer for MDX files, you'll need to add a configuration option to your user settings.

Open the command palette (`⌘ + ⇧ + P` on Mac or `Ctrl + Shift + P` on Windows) and search for `Preferences: Open User Settings (JSON)`.

Then, add the following line to your `settings.json` file:

```json
// Archivo: settings.json
{
  "files.associations": {
    "*.mdx": "markdown"
  }
}
```

Next, open the command palette again, and search for `Markdown: Preview File` or `Markdown: Open Preview to the Side`. This will open a preview window where you can see your formatted changes.

#### Extensions

We also recommend the following extensions for VSCode users:

- [MDX](https://marketplace.visualstudio.com/items?itemName=unifiedjs.vscode-mdx): Intellisense and syntax highlighting for MDX.
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): Format MDX files on save.

### Review Process

Once you've submitted your contribution, the Next.js or Developer Experience teams will review your changes, provide feedback, and merge the pull request when it's ready.

Please let us know if you have any questions or need further assistance in your PR's comments. Thank you for contributing to the Next.js docs and being a part of our community!

> **Tip:** Run `pnpm prettier-fix` to run Prettier before submitting your PR.

## File Structure

The docs use **file-system routing**. Each folder and files inside [`/docs`](https://github.com/vercel/next.js/tree/canary/docs) represent a route segment. These segments are used to generate the URL paths, navigation, and breadcrumbs.

The file structure reflects the navigation that you see on the site, and by default, navigation items are sorted alphabetically. However, we can change the order of the items by prepending a two-digit number (`00-`) to the folder or file name.

For example, in the [functions API Reference](/docs/app/api-reference/functions), the pages are sorted alphabetically because it makes it easier for developers to find a specific function:

```txt
04-functions
├── after.mdx
├── cacheLife.mdx
├── cacheTag.mdx
└── ...
```

But, in the [app router section](/docs/app), the files are prefixed with a two-digit number, sorted in the order developers should learn these concepts:

```txt
01-getting-started
├── 01-installation.mdx
├── 02-project-structure.mdx
├── 03-layouts-and-pages.mdx
└── ...
```

To quickly find a page, you can use `⌘ + P` (Mac) or `Ctrl + P` (Windows) to open the search bar on VSCode. Then, type the slug of the page you're looking for. E.g. `installation`

> **Why not use a manifest?**
>
> We considered using a manifest file (another popular way to generate the docs navigation), but we found that a manifest would quickly get out of sync with the files. File-system routing forces us to think about the structure of the docs and feels more native to Next.js.

## Metadata

Each page has a metadata block at the top of the file separated by three dashes.

### Required Fields

The following fields are **required**:

| Field         | Description                                                                  |
| ------------- | ---------------------------------------------------------------------------- |
| `title`       | The page's `<h1>` title, used for SEO and OG Images.                         |
| `description` | The page's description, used in the `<meta name="description">` tag for SEO. |

```yaml
// Archivo: required-fields.mdx
---
title: Page Title
description: Page Description
---
```

It's good practice to limit the page title to 2-3 words (e.g. Optimizing Images) and the description to 1-2 sentences (e.g. Learn how to optimize images in Next.js).

### Optional Fields

The following fields are **optional**:

| Field       | Description                                                                                                                                        |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nav_title` | Overrides the page's title in the navigation. This is useful when the page's title is too long to fit. If not provided, the `title` field is used. |
| `source`    | Pulls content into a shared page. See [Shared Pages](#shared-pages).                                                                               |
| `related`   | A list of related pages at the bottom of the document. These will automatically be turned into cards. See [Related Links](#related-links).         |
| `version`   | A stage of development. e.g. `experimental`,`legacy`,`unstable`,`RC`                                                                               |

```yaml
// Archivo: optional-fields.mdx
---
nav_title: Nav Item Title
source: app/building-your-application/optimizing/images
related:
  description: See the image component API reference.
  links:
    - app/api-reference/components/image
version: experimental
---
```

## `App` and `Pages` Docs

Since most of the features in the **App Router** and **Pages Router** are completely different, their docs for each are kept in separate sections (`02-app` and `03-pages`). However, there are a few features that are shared between them.

### Shared Pages

To avoid content duplication and risk the content becoming out of sync, we use the `source` field to pull content from one page into another. For example, the `<Link>` component behaves _mostly_ the same in **App** and **Pages**. Instead of duplicating the content, we can pull the content from `app/.../link.mdx` into `pages/.../link.mdx`:

```mdx
// Archivo: app/.../link.mdx
---
title: <Link>
description: API reference for the <Link> component.
---

This API reference will help you understand how to use the props
and configuration options available for the Link Component.
```

```mdx
// Archivo: pages/.../link.mdx
---
title: <Link>
description: API reference for the <Link> component.
source: app/api-reference/components/link
---

```

We can therefore edit the content in one place and have it reflected in both sections.

### Shared Content

In shared pages, sometimes there might be content that is **App Router** or **Pages Router** specific. For example, the `<Link>` component has a `shallow` prop that is only available in **Pages** but not in **App**.

To make sure the content only shows in the correct router, we can wrap content blocks in an `` or `` components:

```mdx
// Archivo: app/.../link.mdx
This content is shared between App and Pages.

This content will only be shown on the Pages docs.

This content is shared between App and Pages.
```

You'll likely use these components for examples and code blocks.

## Code Blocks

Code blocks should contain a minimum working example that can be copied and pasted. This means that the code should be able to run without any additional configuration.

For example, if you're showing how to use the `<Link>` component, you should include the `import` statement and the `<Link>` component itself.

```tsx
// Archivo: app/page.tsx
import Link from 'next/link'

export default function Page() {
  return [About](/about)
}
```

Always run examples locally before committing them. This will ensure that the code is up-to-date and working.

### Language and Filename

Code blocks should have a header that includes the language and the `filename`. For example:

````mdx filename="code-example.mdx"
```tsx
// Archivo: app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>
}
```
````

For CLI commands, use the `package` prop to show the command for each package manager:

````mdx filename="code-example.mdx"
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
````

Most examples in the docs are written in `tsx` and `jsx`, and a few in `bash`. However, you can use any supported language, here's the [full list](https://github.com/shikijs/shiki/blob/main/docs/languages.md#all-languages).

When writing JavaScript code blocks, we use the following language and extension combinations.

|                                | Language   | Extension |
| ------------------------------ | ---------- | --------- |
| JavaScript files with JSX code | ` ```jsx ` | .js       |
| JavaScript files without JSX   | ` ```js `  | .js       |
| TypeScript files with JSX      | ` ```tsx ` | .tsx      |
| TypeScript files without JSX   | ` ```ts `  | .ts       |

> **Good to know**:
>
> - Make sure to use **`.js`** extension for JavaScript files with **JSX** code.
> - For example, ` ```jsx filename="app/layout.js" `

### TS and JS Switcher

Add a language switcher to toggle between TypeScript and JavaScript. Code blocks should be TypeScript first with a JavaScript version to accommodate users.

Currently, we write TS and JS examples one after the other, and link them with `switcher` prop:

````mdx filename="code-example.mdx"
```tsx
// Archivo: app/page.tsx switcher

```

```jsx
// Archivo: app/page.js switcher

```
````

> **Good to know**: We plan to automatically compile TypeScript snippets to JavaScript in the future. In the meantime, you can use [transform.tools](https://transform.tools/typescript-to-javascript).

### Line Highlighting

Code lines can be highlighted. This is useful when you want to draw attention to a specific part of the code. You can highlight lines by passing a number to the `highlight` prop.

**Single Line:** `highlight={1}`

```tsx
// Archivo: app/page.tsx {1}
import Link from 'next/link'

export default function Page() {
  return [About](/about)
}
```

**Multiple Lines:** `highlight={1,3}`

```tsx
// Archivo: app/page.tsx highlight={1,3}
import Link from 'next/link'

export default function Page() {
  return [About](/about)
}
```

**Range of Lines:** `highlight={1-5}`

```tsx
// Archivo: app/page.tsx highlight={1-5}
import Link from 'next/link'

export default function Page() {
  return [About](/about)
}
```

## Icons

The following icons are available for use in the docs:

```mdx
// Archivo: mdx-icon.mdx
<Check size={18} />
<Cross size={18} />
```

**Output:**

<Check size={18} />
<Cross size={18} />

We do not use emojis in the docs.

## Notes

For information that is important but not critical, use notes. Notes are a good way to add information without distracting the user from the main content.

```mdx
// Archivo: notes.mdx
> **Good to know**: This is a single line note.

> **Good to know**:
>
> - We also use this format for multi-line notes.
> - There are sometimes multiple items worth knowing or keeping in mind.
```

**Output:**

> **Good to know**: This is a single line note.

> **Good to know**:
>
> - We also use this format for multi-line notes.
> - There are sometimes multiple items worth knowing or keeping in mind.

## Related Links

Related Links guide the user's learning journey by adding links to logical next steps.

- Links will be displayed in cards under the main content of the page.
- Links will be automatically generated for pages that have child pages.

Create related links using the `related` field in the page's metadata.

```yaml
// Archivo: example.mdx
---
related:
  description: Learn how to quickly get started with your first application.
  links:
    - app/building-your-application/routing/defining-routes
    - app/building-your-application/data-fetching
    - app/api-reference/file-conventions/page
---
```

### Nested Fields

| Field         | Required? | Description                                                                                                                                               |
| ------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | Optional  | The title of the card list. Defaults to **Next Steps**.                                                                                                   |
| `description` | Optional  | The description of the card list.                                                                                                                         |
| `links`       | Required  | A list of links to other doc pages. Each list item should be a relative URL path (without a leading slash) e.g. `app/api-reference/file-conventions/page` |

## Diagrams

Diagrams are a great way to explain complex concepts. We use [Figma](https://www.figma.com/) to create diagrams, following Vercel's design guide.

The diagrams currently live in the `/public` folder in our private Next.js site. If you'd like to update or add a diagram, please open a [GitHub issue](https://github.com/vercel/next.js/issues/new?assignees=&labels=template%3A+documentation&projects=&template=4.docs_request.yml&title=Docs%3A+) with your ideas.

## Custom Components and HTML

These are the React Components available for the docs: `

![Illustration]()

` (next/image), `<PagesOnly />`, `<AppOnly />`, `❌`, and `✅`. We do not allow raw HTML in the docs besides the `<details>` tag.

If you have ideas for new components, please open a [GitHub issue](https://github.com/vercel/next.js/issues/new/choose).

## Style Guide

This section contains guidelines for writing docs for those who are new to technical writing.

### Page Templates

While we don't have a strict template for pages, there are page sections you'll see repeated across the docs:

- **Overview:** The first paragraph of a page should tell the user what the feature is and what it's used for. Followed by a minimum working example or its API reference.
- **Convention:** If the feature has a convention, it should be explained here.
- **Examples**: Show how the feature can be used with different use cases.
- **API Tables**: API Pages should have an overview table at the top of the page with jump-to-section links (when possible).
- **Next Steps (Related Links)**: Add links to related pages to guide the user's learning journey.

Feel free to add these sections as needed.

### Page Types

Docs pages are also split into two categories: Conceptual and Reference.

- **Conceptual** pages are used to explain a concept or feature. They are usually longer and contain more information than reference pages. In the Next.js docs, conceptual pages are found in the **Building Your Application** section.
- **Reference** pages are used to explain a specific API. They are usually shorter and more focused. In the Next.js docs, reference pages are found in the **API Reference** section.

> **Good to know**: Depending on the page you're contributing to, you may need to follow a different voice and style. For example, conceptual pages are more instructional and use the word _you_ to address the user. Reference pages are more technical, they use more imperative words like "create, update, accept" and tend to omit the word _you_.

### Voice

Here are some guidelines to maintain a consistent style and voice across the docs:

- Write clear, concise sentences. Avoid tangents.
  - If you find yourself using a lot of commas, consider breaking the sentence into multiple sentences or use a list.
  - Swap out complex words for simpler ones. For example, _use_ instead of _utilize_.
- Be mindful with the word _this_. It can be ambiguous and confusing, don't be afraid to repeat the subject of the sentence if unclear.
  - For example, _Next.js uses React_ instead of _Next.js uses this_.
- Use an active voice instead of passive. An active sentence is easier to read.
  - For example, _Next.js uses React_ instead of _React is used by Next.js_. If you find yourself using words like _was_ and _by_ you may be using a passive voice.
- Avoid using words like _easy_, _quick_, _simple_, _just_, etc. This is subjective and can be discouraging to users.
- Avoid negative words like _don't_, _can't_, _won't_, etc. This can be discouraging to readers.
  - For example, _"You can use the `Link` component to create links between pages"_ instead of _"Don't use the `<a>` tag to create links between pages"_.
- Write in second person (you/your). This is more personal and engaging.
- Use gender-neutral language. Use _developers_, _users_, or _readers_, when referring to the audience.
- If adding code examples, ensure they are properly formatted and working.

While these guidelines are not exhaustive, they should help you get started. If you'd like to dive deeper into technical writing, check out the [Google Technical Writing Course](https://developers.google.com/tech-writing/overview).

---

Thank you for contributing to the docs and being part of the Next.js community!



[⬆ Subir al inicio del capítulo](#)

---

<a id="rspack-integration"></a>

## Rspack Integration

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/community/rspack](https://nextjs.org/docs/community/rspack)  
> 📂 **Sección:** Community  
> 📝 **Descripción:** *Use the `next-rspack` plugin to bundle your Next.js with Rspack.*  

---

The Rspack team has created a community plugin for Next.js, which is part of a [partnering effort](https://rspack.rs/blog/rspack-next-partner) with the Rspack team.

This plugin is currently experimental. Please use this [discussion thread](https://github.com/vercel/next.js/discussions/77800) to give feedback on any issues you encounter.

Learn more on the [Rspack docs](https://rspack.rs/guide/tech/next) and try out [this example](https://github.com/vercel/next.js/tree/canary/examples/with-rspack).



[⬆ Subir al inicio del capítulo](#)

---

<a id="nextjs-community"></a>

## Next.js Community

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/community](https://nextjs.org/docs/community)  
> 📂 **Sección:** Community  
> 📝 **Descripción:** *Get involved in the Next.js community.*  

---

With over 5 million weekly downloads, Next.js has a large and active community of developers across the world. Here's how you can get involved in our community:

## Contributing

There are a couple of ways you can contribute to the development of Next.js:

- [Documentation](/docs/community/contribution-guide): Suggest improvements or even write new sections to help our users understand how to use Next.js.
- [Examples](https://github.com/vercel/next.js/tree/canary/examples): Help developers integrate Next.js with other tools and services by creating a new example or improving an existing one.
- [Codebase](https://github.com/vercel/next.js/tree/canary/contributing/core): Learn more about the underlying architecture, contribute to bug fixes, errors, and suggest new features.

## Discussions

If you have a question about Next.js, or want to help others, you're always welcome to join the conversation:

- [GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [Discord](https://discord.com/invite/bUG2bvbtHy)
- [Reddit](https://www.reddit.com/r/nextjs)

## Social Media

Follow Next.js on [Twitter](https://x.com/nextjs) for the latest updates, and subscribe to the [Vercel YouTube channel](https://www.youtube.com/@VercelHQ) for Next.js videos.

## Code of Conduct

We believe in creating an inclusive, welcoming community. As such, we ask all members to adhere to our [Code of Conduct](https://github.com/vercel/next.js/blob/canary/CODE_OF_CONDUCT.md). This document outlines our expectations for participant behavior. We invite you to read it and help us maintain a safe and respectful environment.



[⬆ Subir al inicio del capítulo](#)

---

