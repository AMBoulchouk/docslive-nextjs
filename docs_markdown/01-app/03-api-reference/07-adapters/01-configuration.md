# Configuration

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/adapters/configuration](https://nextjs.org/docs/app/api-reference/adapters/configuration)  
> 📂 **Sección:** App > Api Reference > Adapters  
> 📝 **Descripción:** *Configure `adapterPath` or `NEXT_ADAPTER_PATH` to use a custom deployment adapter.*  

---

To use an adapter, specify the path to your adapter module in `adapterPath`:

```js
// Archivo: next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  adapterPath: require.resolve('./my-adapter.js'),
}

module.exports = nextConfig
```

Alternatively `NEXT_ADAPTER_PATH` can be set to enable zero-config usage in deployment platforms.
