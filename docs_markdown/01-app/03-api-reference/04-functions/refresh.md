# refresh

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/functions/refresh](https://nextjs.org/docs/app/api-reference/functions/refresh)  
> 📂 **Sección:** App > Api Reference > Functions  
> 📝 **Descripción:** *API Reference for the refresh function.*  

---

`refresh` allows you to refresh the client router from within a [Server Action](/docs/app/guides/server-actions).

## Usage

`refresh` can **only** be called from within Server Actions. It cannot be used in Route Handlers, Client Components, or any other context.

## Parameters

```tsx
refresh(): void;
```

## Returns

`refresh` does not return a value.

## Examples

```ts
// Archivo: app/actions.ts switcher
'use server'

import { refresh } from 'next/cache'

export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')

  // Create the post in your database
  const post = await db.post.create({
    data: { title, content },
  })

  refresh()
}
```

```js
// Archivo: app/actions.js switcher
'use server'

import { refresh } from 'next/cache'

export async function createPost(formData) {
  const title = formData.get('title')
  const content = formData.get('content')

  // Create the post in your database
  const post = await db.post.create({
    data: { title, content },
  })

  refresh()
}
```

### Error when used outside Server Actions

```ts
// Archivo: app/api/posts/route.ts switcher
import { refresh } from 'next/cache'

export async function POST() {
  // This will throw an error
  refresh()
}
```
