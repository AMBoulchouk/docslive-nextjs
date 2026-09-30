# poweredByHeader

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/poweredByHeader](https://nextjs.org/docs/app/api-reference/config/next-config-js/poweredByHeader)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Next.js will add the `x-powered-by` header by default. Learn to opt-out of it here.*  

---

By default Next.js will add the `x-powered-by` header. To opt-out of it, open `next.config.js` and disable the `poweredByHeader` config:

```js
// Archivo: next.config.js
module.exports = {
  poweredByHeader: false,
}
```
