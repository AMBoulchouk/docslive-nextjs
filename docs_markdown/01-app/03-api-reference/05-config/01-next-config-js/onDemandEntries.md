# onDemandEntries

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/onDemandEntries](https://nextjs.org/docs/app/api-reference/config/next-config-js/onDemandEntries)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Configure how Next.js will dispose and keep in memory pages created in development.*  

---

Next.js exposes some options that give you some control over how the server will dispose or keep in memory built pages in development.

To change the defaults, open `next.config.js` and add the `onDemandEntries` config:

```js
// Archivo: next.config.js
module.exports = {
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
}
```
