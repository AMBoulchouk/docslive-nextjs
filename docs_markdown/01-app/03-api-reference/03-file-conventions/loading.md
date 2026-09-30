# loading.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/loading](https://nextjs.org/docs/app/api-reference/file-conventions/loading)  
> 📂 **Sección:** App > Api Reference > File Conventions  
> 📝 **Descripción:** *API reference for the loading.js file.*  

---

The special file `loading.js` helps you create meaningful Loading UI with [React Suspense](https://react.dev/reference/react/Suspense). With this convention, you can show an [instant loading state](#instant-loading-states) from the server while the content of a route segment streams in. The new content is automatically swapped in once complete.

![Loading UI]()

```tsx
// Archivo: app/feed/loading.tsx switcher
export default function Loading() {
  // Or a custom loading skeleton component
  return <p>Loading...</p>
}
```

```jsx
// Archivo: app/feed/loading.js switcher
export default function Loading() {
  // Or a custom loading skeleton component
  return <p>Loading...</p>
}
```

Inside the `loading.js` file, you can add any light-weight loading UI. You may find it helpful to use the [React Developer Tools](https://react.dev/learn/react-developer-tools) to manually toggle Suspense boundaries.

By default, this file is a [Server Component](/docs/app/getting-started/server-and-client-components) - but can also be used as a Client Component through the `"use client"` directive.

## Reference

### Parameters

Loading UI components do not accept any parameters.

## Behavior

### Navigation

- The Fallback UI is [prefetched](/docs/app/getting-started/linking-and-navigating#prefetching), making navigation immediate unless prefetching hasn't completed.
- Navigation is interruptible, meaning changing routes does not need to wait for the content of the route to fully load before navigating to another route.
- Shared layouts remain interactive while new route segments load.

### Instant Loading States

An instant loading state is fallback UI that is shown immediately upon navigation. You can prerender loading indicators such as skeletons and spinners, or a small but meaningful part of future screens such as a cover photo, title, etc. This helps users understand the app is responding and provides a better user experience.

Create a loading state by adding a `loading.js` file inside a folder.

![loading.js special file]()

```tsx
// Archivo: app/dashboard/loading.tsx switcher
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingSkeleton />
}
```

```jsx
// Archivo: app/dashboard/loading.js switcher
export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return <LoadingSkeleton />
}
```

In the same folder, `loading.js` will be nested inside `layout.js`. It will automatically wrap the `page.js` file and any children below in a ```<Suspense>``
      ``<Suspense>``
    </section>
  )
}
```

```jsx
// Archivo: app/dashboard/page.js switcher
import { Suspense } from 'react'
import { PostFeed, Weather } from './Components'

export default function Posts() {
  return (
    <section>
      ``<Suspense>``
      ``<Suspense>``
    </section>
  )
}
```

By using Suspense, you get the benefits of:

1. **Streaming Server Rendering** - Progressively rendering HTML from the server to the client.
2. **Selective Hydration** - React prioritizes what components to make interactive first based on user interaction.

For more Suspense examples and use cases, please see the [React Documentation](https://react.dev/reference/react/Suspense).

## Version History

| Version   | Changes               |
| --------- | --------------------- |
| `v13.0.0` | `loading` introduced. |
