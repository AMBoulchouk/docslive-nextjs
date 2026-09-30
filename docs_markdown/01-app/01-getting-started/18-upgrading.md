# Upgrading

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/upgrading](https://nextjs.org/docs/app/getting-started/upgrading)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to upgrade your Next.js application to the latest version or canary.*  

---

## Latest version

To update to the latest version of Next.js, you can use the `upgrade` command:

```bash
# Manejador de paquetes: pnpm
pnpm next upgrade
```

```bash
# Manejador de paquetes: npm
npx next upgrade
```

```bash
# Manejador de paquetes: yarn
yarn next upgrade
```

```bash
# Manejador de paquetes: bun
bunx next upgrade
```

Versions before Next.js 16.1.0 do not support the `upgrade` command and need to use a separate package instead:

```bash
// Archivo: Terminal
npx @next/codemod@canary upgrade latest
```

If you prefer to upgrade manually, install the latest Next.js and React versions:

```bash
# Manejador de paquetes: pnpm
pnpm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash
# Manejador de paquetes: npm
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash
# Manejador de paquetes: yarn
yarn add next@latest react@latest react-dom@latest eslint-config-next@latest
```

```bash
# Manejador de paquetes: bun
bun add next@latest react@latest react-dom@latest eslint-config-next@latest
```

## Canary version

To update to the latest canary, make sure you're on the latest version of Next.js and everything is working as expected. Then, run the following command:

```bash
# Manejador de paquetes: pnpm
pnpm add next@canary
```

```bash
# Manejador de paquetes: npm
npm i next@canary
```

```bash
# Manejador de paquetes: yarn
yarn add next@canary
```

```bash
# Manejador de paquetes: bun
bun add next@canary
```

### Features available in canary

The following features are currently available in canary:

**Authentication**:

- [`forbidden`](/docs/app/api-reference/functions/forbidden)
- [`unauthorized`](/docs/app/api-reference/functions/unauthorized)
- [`forbidden.js`](/docs/app/api-reference/file-conventions/forbidden)
- [`unauthorized.js`](/docs/app/api-reference/file-conventions/unauthorized)
- [`authInterrupts`](/docs/app/api-reference/config/next-config-js/authInterrupts)
