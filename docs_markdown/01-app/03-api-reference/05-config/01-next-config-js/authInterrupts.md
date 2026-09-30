# authInterrupts

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/authInterrupts](https://nextjs.org/docs/app/api-reference/config/next-config-js/authInterrupts)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Learn how to enable the experimental `authInterrupts` configuration option to use `forbidden` and `unauthorized`.*  

---

The `authInterrupts` configuration option allows you to use [`forbidden`](/docs/app/api-reference/functions/forbidden) and [`unauthorized`](/docs/app/api-reference/functions/unauthorized) APIs in your application. While these functions are experimental, you must enable the `authInterrupts` option in your `next.config.js` file to use them:

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
}

export default nextConfig
```

```js
// Archivo: next.config.js switcher
module.exports = {
  experimental: {
    authInterrupts: true,
  },
}
```
