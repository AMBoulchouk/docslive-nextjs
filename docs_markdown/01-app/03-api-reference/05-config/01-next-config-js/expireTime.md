# expireTime

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/expireTime](https://nextjs.org/docs/app/api-reference/config/next-config-js/expireTime)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Customize stale-while-revalidate expire time for ISR enabled pages.*  

---

You can specify a custom `stale-while-revalidate` expire time for CDNs to consume in the `Cache-Control` header for ISR enabled pages.

Open `next.config.js` and add the `expireTime` config:

```js
// Archivo: next.config.js
module.exports = {
  // one hour in seconds
  expireTime: 3600,
}
```

Now when sending the `Cache-Control` header the expire time will be calculated depending on the specific revalidate period.

For example, if you have a revalidate of 15 minutes on a path and the expire time is one hour the generated `Cache-Control` header will be `s-maxage=900, stale-while-revalidate=2700` so that it can stay stale for 15 minutes less than the configured expire time.
