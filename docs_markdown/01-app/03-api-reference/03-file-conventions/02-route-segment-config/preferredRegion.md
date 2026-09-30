# preferredRegion (deprecated)

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/preferredRegion](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/preferredRegion)  
> 📂 **Sección:** App > Api Reference > File Conventions > Route Segment Config  
> 📝 **Descripción:** *API reference for the preferredRegion route segment config option.*  

---

> **Deprecated:** The `preferredRegion` route segment config is deprecated. Remove the `preferredRegion` export from your route files. See the [deprecation message](/docs/messages/preferred-region-deprecated) for details.

The `preferredRegion` option allows you to specify the preferred deployment region for a route segment. This value is passed to your deployment platform.

```tsx
// Archivo: layout.tsx | page.tsx | route.ts switcher
export const preferredRegion = // string || string[]
```

```js
// Archivo: layout.js | page.js | route.js switcher
export const preferredRegion = // string || string[]
```

- **`string`**: Deploy the route to a specific region. Available region codes are platform-specific. For example, `'iad1'`.
- **`string[]`**: Deploy the route to multiple specific regions. The route is deployed to **all** listed regions, not a single one chosen from the list. For example, `['iad1', 'sfo1']`.

> **Good to know**:
>
> - If a `preferredRegion` is not specified, it will inherit the option of the nearest parent layout. The root layout defaults to `'auto'`.
> - A child segment's value overrides the parent, values are not merged.
> - Next.js passes the region values through to the deployment platform. The exact behavior and available region codes are platform-specific. Refer to your deployment platform's documentation for supported values.

## Vercel

If deploying Next.js on Vercel, regions were previously only supported with `export const runtime = 'edge'`, which is now [deprecated](/docs/messages/edge-runtime-deprecated). The following options can be passed:

- **`'auto'`** (default): Uses the default region.
- **`'global'`**: Prefer deploying the route to all availableregions.
- **`'home'`**: Prefer deploying the route to the home region.

If an unsupported value is passed, an error will be thrown.
