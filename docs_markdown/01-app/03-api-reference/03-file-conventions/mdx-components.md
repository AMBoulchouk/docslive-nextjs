# mdx-components.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components](https://nextjs.org/docs/app/api-reference/file-conventions/mdx-components)  
> 📂 **Sección:** App > Api Reference > File Conventions  
> 📝 **Descripción:** *API reference for the mdx-components.js file.*  

---

The `mdx-components.js|tsx` file is **required** to use [`@next/mdx` with App Router](/docs/app/guides/mdx) and will not work without it. Additionally, you can use it to [customize styles](/docs/app/guides/mdx#using-custom-styles-and-components).

Use the file `mdx-components.tsx` (or `.js`) in the root of your project to define MDX Components. For example, at the same level as `pages` or `app`, or inside `src` if applicable.

```tsx
// Archivo: mdx-components.tsx switcher
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

```js
// Archivo: mdx-components.js switcher
const components = {}

export function useMDXComponents() {
  return components
}
```

## Exports

### `useMDXComponents` function

The file must export a single function named `useMDXComponents`. This function does not accept any arguments.

```tsx
// Archivo: mdx-components.tsx switcher
import type { MDXComponents } from 'mdx/types'

const components: MDXComponents = {}

export function useMDXComponents(): MDXComponents {
  return components
}
```

```js
// Archivo: mdx-components.js switcher
const components = {}

export function useMDXComponents() {
  return components
}
```

## Version History

| Version   | Changes              |
| --------- | -------------------- |
| `v13.1.2` | MDX Components added |
