# bundlePagesRouterDependencies

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
