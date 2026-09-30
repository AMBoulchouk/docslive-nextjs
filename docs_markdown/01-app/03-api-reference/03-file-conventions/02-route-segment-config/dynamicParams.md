# dynamicParams

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/dynamicParams)  
> 📂 **Sección:** App > Api Reference > File Conventions > Route Segment Config  
> 📝 **Descripción:** *API reference for the dynamicParams route segment config option.*  

---

The `dynamicParams` option allows you to control what happens when a dynamic segment is visited that was not generated with [generateStaticParams](/docs/app/api-reference/functions/generate-static-params).

```tsx
// Archivo: layout.tsx | page.tsx switcher
export const dynamicParams = true // true | false
```

```js
// Archivo: layout.js | page.js | route.js switcher
export const dynamicParams = true // true | false
```

- **`true`** (default): Dynamic route segments not included in `generateStaticParams` are generated at request time.
- **`false`**: Dynamic route segments not included in `generateStaticParams` will return a 404.

> **Good to know**:
>
> - This option replaces the `fallback: true | false | blocking` option of `getStaticPaths` in the `pages` directory.
> - `dynamicParams` is not available when [Cache Components](/docs/app/api-reference/config/next-config-js/cacheComponents) is enabled.
