# maxDuration

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/maxDuration](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/maxDuration)  
> 📂 **Sección:** App > Api Reference > File Conventions > Route Segment Config  
> 📝 **Descripción:** *API reference for the maxDuration route segment config option.*  

---

The `maxDuration` option allows you to set the maximum execution time (in seconds) for server-side logic in a route segment. Deployment platforms can use `maxDuration` from the Next.js build output to add specific execution limits.

```tsx
// Archivo: layout.tsx | page.tsx | route.ts switcher
export const maxDuration = 5
```

```js
// Archivo: layout.js | page.js | route.js switcher
export const maxDuration = 5
```

## Server Actions

If using [Server Actions](/docs/app/getting-started/mutating-data), set the `maxDuration` at the page level to change the default timeout of all Server Actions used on the page.

## Version History

| Version    | Changes                   |
| ---------- | ------------------------- |
| `v13.4.10` | `maxDuration` introduced. |
