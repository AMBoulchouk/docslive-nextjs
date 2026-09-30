# generateEtags

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/generateEtags](https://nextjs.org/docs/app/api-reference/config/next-config-js/generateEtags)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Next.js will generate etags for every page by default. Learn more about how to disable etag generation here.*  

---

Next.js will generate [etags](https://en.wikipedia.org/wiki/HTTP_ETag) for every page by default. You may want to disable etag generation for HTML pages depending on your cache strategy.

Open `next.config.js` and disable the `generateEtags` option:

```js
// Archivo: next.config.js
module.exports = {
  generateEtags: false,
}
```
