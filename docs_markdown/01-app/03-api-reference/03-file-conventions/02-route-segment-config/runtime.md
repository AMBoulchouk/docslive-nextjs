# runtime

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/runtime](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/runtime)  
> 📂 **Sección:** App > Api Reference > File Conventions > Route Segment Config  
> 📝 **Descripción:** *API reference for the runtime route segment config option.*  

---

The `runtime` option allows you to select the JavaScript runtime used for rendering your route.

```tsx
// Archivo: layout.tsx | page.tsx | route.ts switcher
export const runtime = 'nodejs'
// 'nodejs'
```

```js
// Archivo: layout.js | page.js | route.js switcher
export const runtime = 'nodejs'
// 'nodejs'
```

- **`'nodejs'`** (default)
- **`'edge'`** (deprecated)

> **Good to know**:
>
> - The Edge Runtime is deprecated. Remove the `runtime` export from your route files. See [Edge Runtime Deprecated](/docs/messages/edge-runtime-deprecated).
> - This option cannot be used in [Proxy](/docs/app/api-reference/file-conventions/proxy).
