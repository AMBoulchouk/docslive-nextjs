# mdxRs

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/mdxRs](https://nextjs.org/docs/app/api-reference/config/next-config-js/mdxRs)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Use the new Rust compiler to compile MDX files in the App Router.*  

---

For experimental use with `@next/mdx`. Compiles MDX files using the new Rust compiler.

```js
// Archivo: next.config.js
const withMDX = require('@next/mdx')()

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'mdx'],
  experimental: {
    mdxRs: true,
  },
}

module.exports = withMDX(nextConfig)
```
