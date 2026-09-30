# Capítulo 5: Server Actions, Formularios y Mutación de Datos

> 📌 **Capítulo 05** | Libro Guía Next.js v16.3.7  
> 📝 **Resumen:** *Manejo de mutaciones con Server Actions, estados pendientes, UI optimista, manejo de errores y validación.*  
> 📄 **Temas incluidos:** 7 secciones  

[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)

---

## Contenido del Capítulo

- [Mutating Data](#mutating-data)
- [Error Handling](#error-handling)
- [Deploying Next.js to different platforms](#deploying-nextjs-to-different-platforms)
- [How to create forms with Server Actions](#how-to-create-forms-with-server-actions)
- [Server Actions and Mutations](#server-actions-and-mutations)
- [How to create forms with API Routes](#how-to-create-forms-with-api-routes)
- [Error Handling](#error-handling)

---

<a id="mutating-data"></a>

## Mutating Data

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/mutating-data](https://nextjs.org/docs/app/getting-started/mutating-data)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to mutate data using Server Functions and Server Actions in Next.js.*  

---

You can mutate data in Next.js using [React Server Functions](https://react.dev/reference/rsc/server-functions). This page will go through how you can [create](#creating-server-functions) and [invoke](#invoking-server-functions) Server Functions. For Next.js-specific behaviors (single-roundtrip response, sequential dispatch, security, deployment), see [Server Actions and Mutations](/docs/app/guides/server-actions).

## What are Server Functions?

A **Server Function** is an asynchronous function that runs on the server. You can call them from the client through a network request, which is why they must be asynchronous.

In an `action` or mutation context, they are also called **Server Actions**.

By convention, a Server Action is an async function used with [`startTransition`](https://react.dev/reference/react/startTransition). This happens automatically when the function is:

- Passed to a `<form>` using the `action` prop.
- Passed to a `<button>` using the `formAction` prop.

When an action is invoked, Next.js can return both the updated UI and new data in a single server roundtrip.

Behind the scenes, actions use the `POST` method, and only this HTTP method can invoke them.

> [!WARNING]
> Server Functions are reachable via direct POST requests, not just through your application's UI. Always verify authentication and authorization inside every Server Function. See the [Data Security guide](/docs/app/guides/data-security#authentication-and-authorization) for recommended patterns.

> **Good to know:** A Server Action is a Server Function used in a specific way (for handling form submissions and mutations). Server Function is the broader term.

## Creating Server Functions

A Server Function can be defined by using the [`use server`](https://react.dev/reference/rsc/use-server) directive. You can place the directive at the top of an **asynchronous** function to mark the function as a Server Function, or at the top of a separate file to mark all exports of that file.

```ts
// Archivo: app/lib/actions.ts switcher
import { auth } from '@/lib/auth'

export async function createPost(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title')
  const content = formData.get('content')

  // Mutate data
  // Revalidate cache
}

export async function deletePost(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')

  // Verify the user owns this resource before deleting
  // Mutate data
  // Revalidate cache
}
```

```js
// Archivo: app/lib/actions.js switcher
import { auth } from '@/lib/auth'

export async function createPost(formData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title')
  const content = formData.get('content')

  // Mutate data
  // Revalidate cache
}

export async function deletePost(formData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const id = formData.get('id')

  // Verify the user owns this resource before deleting
  // Mutate data
  // Revalidate cache
}
```

### Server Components

Server Functions can be inlined in Server Components by adding the `"use server"` directive to the top of the function body:

```tsx
// Archivo: app/page.tsx switcher
export default function Page() {
  // Server Action
  async function createPost(formData: FormData) {
    'use server'
    // ...
  }

  return <></>
}
```

```jsx
// Archivo: app/page.js switcher
export default function Page() {
  // Server Action
  async function createPost(formData) {
    'use server'
    // ...
  }

  return <></>
}
```

> **Good to know:** Server Components support progressive enhancement by default, meaning forms that call Server Actions will be submitted even if JavaScript hasn't loaded yet or is disabled.

### Client Components

It's not possible to define Server Functions in Client Components. However, you can invoke them in Client Components by importing them from a file that has the `"use server"` directive at the top of it:

```ts
// Archivo: app/actions.ts switcher
'use server'

export async function createPost() {}
```

```js
// Archivo: app/actions.js switcher
'use server'

export async function createPost() {}
```

```tsx
// Archivo: app/ui/button.tsx switcher
'use client'

import { createPost } from '@/app/actions'

export function Button() {
  return <button formAction={createPost}>Create</button>
}
```

```jsx
// Archivo: app/ui/button.js switcher
'use client'

import { createPost } from '@/app/actions'

export function Button() {
  return <button formAction={createPost}>Create</button>
}
```

> **Good to know:** In Client Components, forms invoking Server Actions will queue submissions if JavaScript isn't loaded yet, and will be prioritized for hydration. After hydration, the browser does not refresh on form submission.

### Passing actions as props

You can also pass an action to a Client Component as a prop:

```jsx
<ClientComponent updateItemAction={updateItem} />
```

```tsx
// Archivo: app/client-component.tsx switcher
'use client'

export default function ClientComponent({
  updateItemAction,
}: {
  updateItemAction: (formData: FormData) => void
}) {
  return <form action={updateItemAction}></form>
}
```

```jsx
// Archivo: app/client-component.js switcher
'use client'

export default function ClientComponent({ updateItemAction }) {
  return <form action={updateItemAction}></form>
}
```

## Invoking Server Functions

There are two main ways you can invoke a Server Function:

1. [Forms](#forms) in Server and Client Components
2. [Event Handlers](#event-handlers) and [useEffect](#useeffect) in Client Components

> **Good to know:** Server Functions are designed for server-side mutations. The client currently dispatches and awaits them one at a time. This is an implementation detail and may change. If you need parallel data fetching, use [data fetching](/docs/app/getting-started/fetching-data#server-components) in Server Components, or perform parallel work inside a single Server Function or [Route Handler](/docs/app/guides/backend-for-frontend#manipulating-data).

### Forms

React extends the HTML [`<form>`](https://react.dev/reference/react-dom/components/form) element to allow a Server Function to be invoked with the HTML `action` prop.

When invoked in a form, the function automatically receives the [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData) object. You can extract the data using the native [`FormData` methods](https://developer.mozilla.org/en-US/docs/Web/API/FormData#instance_methods):

```tsx
// Archivo: app/ui/form.tsx switcher
import { createPost } from '@/app/actions'

export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Create</button>
    </form>
  )
}
```

```jsx
// Archivo: app/ui/form.js switcher
import { createPost } from '@/app/actions'

export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Create</button>
    </form>
  )
}
```

```ts
// Archivo: app/actions.ts switcher
'use server'

import { auth } from '@/lib/auth'

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title')
  const content = formData.get('content')

  // Mutate data
  // Revalidate cache
}
```

```js
// Archivo: app/actions.js switcher
'use server'

import { auth } from '@/lib/auth'

export async function createPost(formData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const title = formData.get('title')
  const content = formData.get('content')

  // Mutate data
  // Revalidate cache
}
```

### Event Handlers

You can invoke a Server Function in a Client Component by using event handlers such as `onClick`.

```tsx
// Archivo: app/like-button.tsx switcher
'use client'

import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

```jsx
// Archivo: app/like-button.js switcher
'use client'

import { incrementLike } from './actions'
import { useState } from 'react'

export default function LikeButton({ initialLikes }) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

## Examples

### Showing a pending state

While executing a Server Function, you can show a loading indicator with React's [`useActionState`](https://react.dev/reference/react/useActionState) hook. This hook returns a `pending` boolean:

```tsx
// Archivo: app/ui/button.tsx switcher
'use client'

import { useActionState, startTransition } from 'react'
import { createPost } from '@/app/actions'
import { LoadingSpinner } from '@/app/ui/loading-spinner'

export function Button() {
  const [state, action, pending] = useActionState(createPost, false)

  return (
    <button onClick={() => startTransition(action)}>
      {pending ? <LoadingSpinner /> : 'Create Post'}
    </button>
  )
}
```

```jsx
// Archivo: app/ui/button.js switcher
'use client'

import { useActionState, startTransition } from 'react'
import { createPost } from '@/app/actions'
import { LoadingSpinner } from '@/app/ui/loading-spinner'

export function Button() {
  const [state, action, pending] = useActionState(createPost, false)

  return (
    <button onClick={() => startTransition(action)}>
      {pending ? <LoadingSpinner /> : 'Create Post'}
    </button>
  )
}
```

See the [Building interactive apps](/docs/app/guides/interactive-apps) guide for a deeper walkthrough of responsive interactions, including pending feedback, optimistic UI, transitions, and error handling.

> **Good to know**: With the **experimental** [`useOffline`](/docs/app/guides/offline-support) config enabled, a Server Action interrupted by a connectivity drop stays pending and completes when the network returns.

### Refresh data

After a mutation, you may want to refresh the current page to show the latest data. You can do this by calling [`refresh`](/docs/app/api-reference/functions/refresh) from `next/cache` in a Server Action:

```ts
// Archivo: app/lib/actions.ts switcher
'use server'

import { auth } from '@/lib/auth'
import { refresh } from 'next/cache'

export async function updatePost(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // Mutate data
  // ...

  refresh()
}
```

```js
// Archivo: app/lib/actions.js switcher
'use server'

import { auth } from '@/lib/auth'
import { refresh } from 'next/cache'

export async function updatePost(formData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // Mutate data
  // ...

  refresh()
}
```

This refreshes the client router, ensuring the UI reflects the latest state. The `refresh()` function does not revalidate tagged data. To revalidate tagged data, use [`updateTag`](/docs/app/api-reference/functions/updateTag) or [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) instead.

### Revalidate data

After performing a mutation, you can revalidate the Next.js cache and show the updated data by calling [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath) or [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) within the Server Function:

```ts
// Archivo: app/lib/actions.ts switcher
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // Mutate data
  // ...

  revalidatePath('/posts')
}
```

```js
// Archivo: app/lib/actions.js switcher
import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function createPost(formData) {
  'use server'
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // Mutate data
  // ...
  revalidatePath('/posts')
}
```

### Redirect after a mutation

You may want to redirect the user to a different page after a mutation. You can do this by calling [`redirect`](/docs/app/api-reference/functions/redirect) within the Server Function.

```ts
// Archivo: app/lib/actions.ts switcher
'use server'

import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // Mutate data
  // ...

  revalidatePath('/posts')
  redirect('/posts')
}
```

```js
// Archivo: app/lib/actions.js switcher
'use server'

import { auth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createPost(formData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  // Mutate data
  // ...

  revalidatePath('/posts')
  redirect('/posts')
}
```

Calling `redirect` [throws](/docs/app/api-reference/functions/redirect#behavior) a framework handled control-flow exception. Any code after it won't execute. If you need fresh data, call [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath) or [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) beforehand.

### Cookies

You can `get`, `set`, and `delete` cookies inside a Server Action using the [`cookies`](/docs/app/api-reference/functions/cookies) API.

When you [set or delete](/docs/app/api-reference/functions/cookies#understanding-cookie-behavior-in-server-functions) a cookie in a Server Action, Next.js re-renders the current page and its layouts on the server so the **UI reflects the new cookie value**.

> **Good to know**: The server update applies to the current React tree, re-rendering, mounting, or unmounting components, as needed. Client state is preserved for re-rendered components, and effects re-run if their dependencies changed.

```ts
// Archivo: app/actions.ts switcher
'use server'

import { cookies } from 'next/headers'

export async function exampleAction() {
  const cookieStore = await cookies()

  // Get cookie
  cookieStore.get('name')?.value

  // Set cookie
  cookieStore.set('name', 'Delba')

  // Delete cookie
  cookieStore.delete('name')
}
```

```js
// Archivo: app/actions.js switcher
'use server'

import { cookies } from 'next/headers'

export async function exampleAction() {
  // Get cookie
  const cookieStore = await cookies()

  // Get cookie
  cookieStore.get('name')?.value

  // Set cookie
  cookieStore.set('name', 'Delba')

  // Delete cookie
  cookieStore.delete('name')
}
```

### useEffect

You can use the React [`useEffect`](https://react.dev/reference/react/useEffect) hook to invoke a Server Action when the component mounts or a dependency changes. This is useful for mutations that depend on global events or need to be triggered automatically. For example, `onKeyDown` for app shortcuts, an intersection observer hook for infinite scrolling, or when the component mounts to update a view count:

```tsx
// Archivo: app/view-count.tsx switcher
'use client'

import { incrementViews } from './actions'
import { useState, useEffect, useTransition } from 'react'

export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const updatedViews = await incrementViews()
      setViews(updatedViews)
    })
  }, [])

  // You can use `isPending` to give users feedback
  return <p>Total Views: {views}</p>
}
```

```jsx
// Archivo: app/view-count.js switcher
'use client'

import { incrementViews } from './actions'
import { useState, useEffect, useTransition } from 'react'

export default function ViewCount({ initialViews }) {
  const [views, setViews] = useState(initialViews)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    startTransition(async () => {
      const updatedViews = await incrementViews()
      setViews(updatedViews)
    })
  }, [])

  // You can use `isPending` to give users feedback
  return <p>Total Views: {views}</p>
}
```


[⬆ Subir al inicio del capítulo](#)

---

<a id="error-handling"></a>

## Error Handling

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/error-handling](https://nextjs.org/docs/app/getting-started/error-handling)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to display expected errors and handle uncaught exceptions.*  

---

Errors can be divided into two categories: [expected errors](#handling-expected-errors) and [uncaught exceptions](#handling-uncaught-exceptions). This page will walk you through how you can handle these errors in your Next.js application.

## Handling expected errors

Expected errors are those that can occur during the normal operation of the application, such as those from [server-side form validation](/docs/app/guides/forms) or failed requests. These errors should be handled explicitly and returned to the client.

### Server Functions

You can use the [`useActionState`](https://react.dev/reference/react/useActionState) hook to handle expected errors in [Server Functions](https://react.dev/reference/rsc/server-functions).

For these errors, avoid using `try`/`catch` blocks and throw errors. Instead, model expected errors as return values.

```ts
// Archivo: app/actions.ts switcher
'use server'

export async function createPost(prevState: any, formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')

  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: { title, content },
  })
  const json = await res.json()

  if (!res.ok) {
    return { message: 'Failed to create post' }
  }
}
```

```js
// Archivo: app/actions.js switcher
'use server'

export async function createPost(prevState, formData) {
  const title = formData.get('title')
  const content = formData.get('content')

  const res = await fetch('https://api.vercel.app/posts', {
    method: 'POST',
    body: { title, content },
  })
  const json = await res.json()

  if (!res.ok) {
    return { message: 'Failed to create post' }
  }
}
```

You can pass your action to the `useActionState` hook and use the returned `state` to display an error message.

```tsx
// Archivo: app/ui/form.tsx highlight={11,19} switcher
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions'

const initialState = {
  message: '',
}

export function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" required />
      <label htmlFor="content">Content</label>
      <textarea id="content" name="content" required />
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button disabled={pending}>Create Post</button>
    </form>
  )
}
```

```jsx
// Archivo: app/ui/form.js highlight={11,19} switcher
'use client'

import { useActionState } from 'react'
import { createPost } from '@/app/actions'

const initialState = {
  message: '',
}

export function Form() {
  const [state, formAction, pending] = useActionState(createPost, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="title">Title</label>
      <input type="text" id="title" name="title" required />
      <label htmlFor="content">Content</label>
      <textarea id="content" name="content" required />
      {state?.message && <p aria-live="polite">{state.message}</p>}
      <button disabled={pending}>Create Post</button>
    </form>
  )
}
```

### Server Components

When fetching data inside of a Server Component, you can use the response to conditionally render an error message or [`redirect`](/docs/app/api-reference/functions/redirect).

```tsx
// Archivo: app/page.tsx switcher
export default async function Page() {
  const res = await fetch(`https://...`)
  const data = await res.json()

  if (!res.ok) {
    return 'There was an error.'
  }

  return '...'
}
```

```jsx
// Archivo: app/page.js switcher
export default async function Page() {
  const res = await fetch(`https://...`)
  const data = await res.json()

  if (!res.ok) {
    return 'There was an error.'
  }

  return '...'
}
```

### Not found

You can call the [`notFound`](/docs/app/api-reference/functions/not-found) function within a route segment and use the [`not-found.js`](/docs/app/api-reference/file-conventions/not-found) file to show a 404 UI.

```tsx
// Archivo: app/blog/[slug]/page.tsx switcher
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <div>{post.title}</div>
}
```

```jsx
// Archivo: app/blog/[slug]/page.js switcher
import { notFound } from 'next/navigation'
import { getPostBySlug } from '@/lib/posts'

export default async function Page({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return <div>{post.title}</div>
}
```

```tsx
// Archivo: app/blog/[slug]/not-found.tsx switcher
export default function NotFound() {
  return <div>404 - Page Not Found</div>
}
```

```jsx
// Archivo: app/blog/[slug]/not-found.js switcher
export default function NotFound() {
  return <div>404 - Page Not Found</div>
}
```

## Handling uncaught exceptions

Uncaught exceptions are unexpected errors that indicate bugs or issues that should not occur during the normal flow of your application. These should be handled by throwing errors, which will then be caught by error boundaries.

### Nested error boundaries

Next.js uses error boundaries to handle uncaught exceptions. Error boundaries catch errors in their child components and display a fallback UI instead of the component tree that crashed.

Create an error boundary by adding an [`error.js`](/docs/app/api-reference/file-conventions/error) file inside a route segment and exporting a React component:

```tsx
// Archivo: app/dashboard/error.tsx switcher
'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by re-fetching and re-rendering the segment
          () => retry()
        }
      >
        Try again
      </button>
    </div>
  )
}
```

```jsx
// Archivo: app/dashboard/error.js switcher
'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function ErrorPage({ error, retry }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button
        onClick={
          // Attempt to recover by re-fetching and re-rendering the segment
          () => retry()
        }
      >
        Try again
      </button>
    </div>
  )
}
```

Errors will bubble up to the nearest parent error boundary. This allows for granular error handling by placing `error.tsx` files at different levels in the [route hierarchy](/docs/app/getting-started/project-structure#component-hierarchy).

![Nested Error Component Hierarchy]()

For component-level error recovery, the [`catchError`](/docs/app/api-reference/functions/catchError) function lets you create error boundaries that can wrap any part of your component tree:

```tsx
// Archivo: app/custom-error-boundary.tsx switcher
'use client'

import { catchError, type ErrorInfo } from 'next/error'

function ErrorFallback(props: { title: string }, { error, retry }: ErrorInfo) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{error.message}</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}

export default catchError(ErrorFallback)
```

```jsx
// Archivo: app/custom-error-boundary.js switcher
'use client'

import { catchError } from 'next/error'

function ErrorFallback(props, { error, retry }) {
  return (
    <div>
      <h2>{props.title}</h2>
      <p>{error.message}</p>
      <button onClick={() => retry()}>Try again</button>
    </div>
  )
}

export default catchError(ErrorFallback)
```

Then use the returned component as a wrapper in any layout or page:

```tsx
// Archivo: app/some-component.tsx switcher
import ErrorBoundary from './custom-error-boundary'

export default function Component({ children }: { children: React.ReactNode }) {
  return <ErrorBoundary title="Dashboard Error">{children}</ErrorBoundary>
}
```

```jsx
// Archivo: app/some-component.js switcher
import ErrorBoundary from './custom-error-boundary'

export default function Component({ children }) {
  return <ErrorBoundary title="Dashboard Error">{children}</ErrorBoundary>
}
```

Error boundaries don't catch errors inside event handlers. They're designed to catch errors [during rendering](https://react.dev/reference/react/Component#static-getderivedstatefromerror) to show a **fallback UI** instead of crashing the whole app.

In general, errors in event handlers or async code aren’t handled by error boundaries because they run after rendering.

To handle these cases, catch the error manually and store it using `useState` or `useReducer`, then update the UI to inform the user.

```tsx
'use client'

import { useState } from 'react'

export function Button() {
  const [error, setError] = useState(null)

  const handleClick = () => {
    try {
      // do some work that might fail
      throw new Error('Exception')
    } catch (reason) {
      setError(reason)
    }
  }

  if (error) 

  return (
    <button type="button" onClick={handleClick}>
      Click me
    </button>
  )
}
```

Note that unhandled errors inside `startTransition` from `useTransition`, will bubble up to the nearest error boundary.

```tsx
'use client'

import { useTransition } from 'react'

export function Button() {
  const [pending, startTransition] = useTransition()

  const handleClick = () =>
    startTransition(() => {
      throw new Error('Exception')
    })

  return (
    <button type="button" onClick={handleClick}>
      Click me
    </button>
  )
}
```

### Global errors

While less common, you can handle errors in the root layout using the [`global-error.js`](/docs/app/api-reference/file-conventions/error#global-error) file, located in the root app directory, even when leveraging [internationalization](/docs/app/guides/internationalization). Global error UI must define its own `<html>` and `<body>` tags, since it is replacing the root layout or template when active.

```tsx
// Archivo: app/global-error.tsx switcher
'use client' // Error boundaries must be Client Components

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string }
  retry: () => void
}) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => retry()}>Try again</button>
      </body>
    </html>
  )
}
```

```jsx
// Archivo: app/global-error.js switcher
'use client' // Error boundaries must be Client Components

export default function GlobalError({ error, retry }) {
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => retry()}>Try again</button>
      </body>
    </html>
  )
}
```


[⬆ Subir al inicio del capítulo](#)

---

<a id="deploying-nextjs-to-different-platforms"></a>

## Deploying Next.js to different platforms

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/deploying-to-platforms](https://nextjs.org/docs/app/guides/deploying-to-platforms)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Understand which Next.js features require specific platform capabilities and how to choose the right deployment target.*  

---

Next.js [treats static and dynamic content as a spectrum](/docs/app/guides/rendering-philosophy) at the component level. Different features in this model require different platform capabilities. This page helps you understand what your platform needs to support and how to configure your deployment.

## Minimum Requirements

To run Next.js, your platform needs **a Node.js server**. That's it.

A single `next start` process handles every Next.js feature correctly: Server Components, ISR, PPR, Cache Components, Server Actions, Proxy, and `after()`. Streaming support is needed for features like PPR and Server Components to deliver content progressively (without it, responses are buffered and sent as a whole, which still works but loses the streaming performance benefit). Additional infrastructure (CDN caching, edge compute, shared cache) primarily improves performance and multi-instance consistency. In multi-instance deployments, shared cache and tag coordination reduce stale divergence between instances. The only additional dependency is the `sharp` package, which is required for [Image Optimization](/docs/app/api-reference/components/image).

## Functional Fidelity vs. Performance Fidelity

When evaluating platform support for Next.js, it helps to distinguish between two levels:

**Functional fidelity** means every Next.js feature works correctly. The [adapter test suite](/docs/app/api-reference/adapters/testing-adapters) is the contract: if a platform's adapter passes the tests, it supports Next.js. This is binary: it passes or it doesn't.

**Performance fidelity** means features achieve their optimal performance characteristics. Examples include PPR's static shell served at CDN latency rather than origin latency, or ISR serving stale content instantly with sub-second revalidation propagation. Performance fidelity is a spectrum that every platform will achieve differently based on their architecture.

A platform that achieves functional fidelity is a fully supported deployment target for Next.js. Performance fidelity is how platforms differentiate, and it improves incrementally over time.

Use the feature matrix below through this lens: "Streaming Required" and "Shared Cache Recommended" describe what is needed for functional fidelity. "Edge Stitching" is a performance fidelity optimization.

## Feature Support Matrix

Different features require different infrastructure capabilities. The "Edge Stitching" column is a **performance optimization**, not a correctness requirement. All features work correctly from a single origin server.

| Feature                        | Streaming | Shared Cache | Edge Stitching | Notes                                                                                            |
| ------------------------------ | --------- | ------------ | -------------- | ------------------------------------------------------------------------------------------------ |
| Server Components              | Required  | No           | No             | Basic streaming support                                                                          |
| ISR (time-based)               | No        | Recommended  | No             | Works per-instance without shared cache                                                          |
| ISR (on-demand)                | No        | Recommended  | No             | [Tag propagation](/docs/app/guides/how-revalidation-works) needs shared cache for multi-instance |
| Partial Prerendering           | Required  | Recommended  | Optional       | [See PPR Platform Guide](/docs/app/guides/ppr-platform-guide)                                    |
| Cache Components (`use cache`) | Required  | Recommended  | No             | Shared cache enables cross-instance consistency                                                  |
| Proxy / Middleware             | No        | No           | No             | Runs at edge or origin                                                                           |
| Server Actions                 | Required  | No           | No             | POST requests with streaming response                                                            |
| `after()`                      | No        | No           | No             | Requires [graceful shutdown](/docs/app/guides/self-hosting#after) support                        |

**Streaming Required** means the platform must support chunked transfer encoding or HTTP/2 streaming and must not buffer the response before sending it to the client.

**Shared Cache Recommended** means multiple server instances benefit from shared cache backends to coordinate. For ISR and server response caching, use [`cacheHandler`](/docs/app/api-reference/config/next-config-js/incrementalCacheHandlerPath). For `'use cache'` entries, use [`cacheHandlers`](/docs/app/api-reference/config/next-config-js/cacheHandlers). Without shared cache, each instance maintains its own cache independently — features still work correctly on each instance, but revalidation events don't propagate across instances.

## CDN Infrastructure Compatibility

The following table maps infrastructure primitives for each major CDN. These are available building blocks, not finished integrations:

| CDN               | Edge Compute | Key-Value / Tags | Blob Storage   | PPR Resuming |
| ----------------- | ------------ | ---------------- | -------------- | ------------ |
| Cloudflare        | Workers      | KV               | R2             | Yes (worker) |
| Akamai            | EdgeWorkers  | EdgeKV           | Object Storage | Yes (worker) |
| Amazon CloudFront | Lambda@Edge  | KeyValueStore    | S3             | Yes (Lambda) |
| Fastly            | Compute      | KV Store         | Object Storage | Yes (WASM)   |
| Azure             | Functions    | Managed Redis    | Blob Storage   | Yes (server) |
| Google Cloud      | Cloud Run    | Various KV       | Cloud Storage  | Yes (server) |

These are available building blocks, not finished integrations. Most community adapters today deploy Next.js as a Docker container or Node.js server without leveraging CDN-specific primitives like edge KV or PPR resuming. See the [Deploying](/docs/app/getting-started/deploying#adapters) page for the current list of adapters. For CDN-specific caching considerations (including known limitations with `Vary` on custom headers), see [CDN Caching](/docs/app/guides/cdn-caching).

## Adapters

Next.js provides a [Deployment Adapter API](/docs/app/api-reference/config/next-config-js/adapterPath) that lets platforms customize how Next.js applications are built and deployed for their infrastructure. Adapters run at build time and produce platform-specific output from the standard Next.js build. Anyone can build an adapter using the public API with no special access required.

The adapter API plus Next.js caching interfaces form the complete platform integration surface. The adapter handles build-time output, while `cacheHandler` and `cacheHandlers` cover different runtime caching paths. `cacheHandler` (singular) covers server cache paths like ISR, route handlers, patched `fetch`/`unstable_cache`, and image optimization. `cacheHandlers` (plural) configures `'use cache'` directive backends.

### Verified Adapters

A **verified adapter** is one that meets two requirements:

1. **Open source.** The adapter source code is publicly available so the community and the Next.js team can inspect, contribute to, and verify it.
2. **Runs the compatibility test suite.** The platform provides a way to run the full [Next.js compatibility test suite](/docs/app/api-reference/adapters/testing-adapters) against their adapter. This gives visibility into which features work, which are in progress, and where gaps remain.

Verified adapters are hosted under the [Next.js GitHub organization](https://github.com/nextjs), listed as supported deployment targets in the Next.js documentation, and maintained by their respective platform teams. There are no private framework hooks or integration paths: Vercel's adapter uses the same public API as every other adapter.

For verified adapters and platforms working toward verified status through the [Ecosystem Working Group](https://nextjs.org/ecosystem-working-group), the Next.js team commits to:

- **Coordinated testing.** Before major releases, we work with platform teams to run the compatibility test suite and surface issues early.
- **Early access.** Adapter authors receive early access to API changes during RFCs and release candidates.
- **Direct support.** When the adapter contract needs updating, we work directly with adapter teams.

> **Good to know:** Platforms can build closed-source adapters on the same public API and test suite. However, closed-source adapters will not be listed as verified, since the Next.js team cannot verify what it cannot inspect.

## A Note on Infrastructure Requirements

Next.js's [rendering model](/docs/app/guides/rendering-philosophy) places the static/dynamic boundary at the component level rather than the route level. Finer-grained boundaries provide more flexibility for developers at the cost of broader requirements for hosting platforms. This is a deliberate trade-off: the infrastructure requirements on this page exist because of what the rendering model delivers.


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-create-forms-with-server-actions"></a>

## How to create forms with Server Actions

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/forms](https://nextjs.org/docs/app/guides/forms)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to create forms in Next.js with React Server Actions.*  

---

React Server Actions are [Server Functions](https://react.dev/reference/rsc/server-functions) that execute on the server. They can be called in Server and Client Components to handle form submissions. This guide will walk you through how to create forms in Next.js with Server Actions. For Server Action behaviors beyond forms (single-roundtrip response, sequential dispatch, security, deployment), see [Server Actions and Mutations](/docs/app/guides/server-actions).

> [!WARNING]
> Always verify [authentication and authorization](/docs/app/guides/authentication) inside each Server Action, even if the form is only rendered on an authenticated page. See the [Data Security guide](/docs/app/guides/data-security) for more details.

## How it works

React extends the HTML [`<form>`](https://developer.mozilla.org/docs/Web/HTML/Element/form) element to allow Server Actions to be invoked with the [`action`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form#action) attribute.

When used in a form, the function automatically receives the [`FormData`](https://developer.mozilla.org/docs/Web/API/FormData/FormData) object. You can then extract the data using the native [`FormData` methods](https://developer.mozilla.org/en-US/docs/Web/API/FormData#instance_methods):

```tsx
// Archivo: app/invoices/page.tsx switcher
import { auth } from '@/lib/auth'

export default function Page() {
  async function createInvoice(formData: FormData) {
    'use server'

    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }

    // mutate data
    // revalidate the cache
  }

  return <form action={createInvoice}>...</form>
}
```

```jsx
// Archivo: app/invoices/page.js switcher
import { auth } from '@/lib/auth'

export default function Page() {
  async function createInvoice(formData) {
    'use server'

    const session = await auth()
    if (!session?.user) {
      throw new Error('Unauthorized')
    }

    const rawFormData = {
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    }

    // mutate data
    // revalidate the cache
  }

  return <form action={createInvoice}>...</form>
}
```

> **Good to know:** When working with forms that have multiple fields, use JavaScript's [`Object.fromEntries()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries). For example: `const rawFormData = Object.fromEntries(formData)`. Note that this object will contain extra properties prefixed with `$ACTION_`.

## Passing additional arguments

Outside of form fields, you can pass additional arguments to a Server Function using the JavaScript [`bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) method. For example, to pass the `userId` argument to the `updateUser` Server Function:

```tsx
// Archivo: app/client-component.tsx highlight={6} switcher
'use client'

import { updateUser } from './actions'

export function UserProfile({ userId }: { userId: string }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">Update User Name</button>
    </form>
  )
}
```

```jsx
// Archivo: app/client-component.js highlight={6} switcher
'use client'

import { updateUser } from './actions'

export function UserProfile({ userId }) {
  const updateUserWithId = updateUser.bind(null, userId)

  return (
    <form action={updateUserWithId}>
      <input type="text" name="name" />
      <button type="submit">Update User Name</button>
    </form>
  )
}
```

The Server Function will receive the `userId` as an additional argument:

```ts
// Archivo: app/actions.ts switcher
'use server'

export async function updateUser(userId: string, formData: FormData) {}
```

```js
// Archivo: app/actions.js switcher
'use server'

export async function updateUser(userId, formData) {}
```

> **Good to know**:
>
> - An alternative is to pass arguments as hidden input fields in the form (e.g. `<input type="hidden" name="userId" value={userId} />`). However, the value will be part of the rendered HTML and will not be encoded.
> - `bind` works in both Server and Client Components and supports progressive enhancement.

## Form validation

Forms can be validated on the client or server.

- For **client-side validation**, you can use the HTML attributes like `required` and `type="email"` for basic validation.
- For **server-side validation**, you can use a schema validation library like [Zod](https://zod.dev/) or [Valibot](https://valibot.dev/) to validate the form fields. For example:

```tsx
// Archivo: app/actions.ts switcher
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
})

export default async function createUser(formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Mutate data
}
```

```jsx
// Archivo: app/actions.js switcher
'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
})

export default async function createUser(formData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Mutate data
}
```

## Validation errors

To display validation errors or messages, turn the component that defines the `<form>` into a Client Component and use React [`useActionState`](https://react.dev/reference/react/useActionState).

When using `useActionState`, the Server function signature will change to receive a new `prevState` or `initialState` parameter as its first argument.

```tsx
// Archivo: app/actions.ts highlight={5} switcher
'use server'

import { z } from 'zod'

export async function createUser(initialState: any, formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })
  // ...
}
```

```jsx
// Archivo: app/actions.ts highlight={7} switcher
'use server'

import { z } from 'zod'

// ...

export async function createUser(initialState, formData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })
  // ...
}
```

You can then conditionally render the error message based on the `state` object.

```tsx
// Archivo: app/ui/signup.tsx highlight={11,18-20} switcher
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
  message: '',
}

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      
      <p aria-live="polite">{state?.message}</p>
      <button disabled={pending}>Sign up</button>
    </form>
  )
}
```

```jsx
// Archivo: app/ui/signup.js highlight={11,18-20} switcher
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

const initialState = {
  message: '',
}

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" id="email" name="email" required />
      
      <p aria-live="polite">{state?.message}</p>
      <button disabled={pending}>Sign up</button>
    </form>
  )
}
```

## Pending states

The [`useActionState`](https://react.dev/reference/react/useActionState) hook exposes a `pending` boolean that can be used to show a loading indicator or disable the submit button while the action is being executed.

```tsx
// Archivo: app/ui/signup.tsx highlight={7,12} switcher
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      
      <button disabled={pending}>Sign up</button>
    </form>
  )
}
```

```jsx
// Archivo: app/ui/signup.js highlight={7,12} switcher
'use client'

import { useActionState } from 'react'
import { createUser } from '@/app/actions'

export function Signup() {
  const [state, formAction, pending] = useActionState(createUser, initialState)

  return (
    <form action={formAction}>
      
      <button disabled={pending}>Sign up</button>
    </form>
  )
}
```

Alternatively, you can use the [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus) hook to show a loading indicator while the action is being executed. When using this hook, you'll need to create a separate component to render the loading indicator. For example, to disable the button when the action is pending:

```tsx
// Archivo: app/ui/button.tsx highlight={6} switcher
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} type="submit">
      Sign Up
    </button>
  )
}
```

```jsx
// Archivo: app/ui/button.js highlight={6} switcher
'use client'

import { useFormStatus } from 'react-dom'

export function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} type="submit">
      Sign Up
    </button>
  )
}
```

You can then nest the `SubmitButton` component inside the form:

```tsx
// Archivo: app/ui/signup.tsx switcher
import { SubmitButton } from './button'
import { createUser } from '@/app/actions'

export function Signup() {
  return (
    <form action={createUser}>
      
      <SubmitButton />
    </form>
  )
}
```

```jsx
// Archivo: app/ui/signup.js switcher
import { SubmitButton } from './button'
import { createUser } from '@/app/actions'

export function Signup() {
  return (
    <form action={createUser}>
      
      <SubmitButton />
    </form>
  )
}
```

> **Good to know:** In React 19, `useFormStatus` includes additional keys on the returned object, like data, method, and action. If you are not using React 19, only the `pending` key is available.

> **Good to know**: With the **experimental** [`useOffline`](/docs/app/guides/offline-support) config enabled, a Server Action interrupted by a connectivity drop stays pending and completes when the network returns, so a user does not lose their submission.

## Optimistic updates

You can use the React [`useOptimistic`](https://react.dev/reference/react/useOptimistic) hook to optimistically update the UI before the Server Function finishes executing, rather than waiting for the response:

```tsx
// Archivo: app/page.tsx switcher
'use client'

import { useOptimistic } from 'react'
import { send } from './actions'

type Message = {
  message: string
}

export function Thread({ messages }: { messages: Message[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic<
    Message[],
    string
  >(messages, (state, newMessage) => [...state, { message: newMessage }])

  const formAction = async (formData: FormData) => {
    const message = formData.get('message') as string
    addOptimisticMessage(message)
    await send(message)
  }

  return (
    <div>
      {optimisticMessages.map((m, i) => (
        <div key={i}>{m.message}</div>
      ))}
      <form action={formAction}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

```jsx
// Archivo: app/page.js switcher
'use client'

import { useOptimistic } from 'react'
import { send } from './actions'

export function Thread({ messages }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state, newMessage) => [...state, { message: newMessage }]
  )

  const formAction = async (formData) => {
    const message = formData.get('message')
    addOptimisticMessage(message)
    await send(message)
  }

  return (
    <div>
      {optimisticMessages.map((m) => (
        <div>{m.message}</div>
      ))}
      <form action={formAction}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}
```

## Nested form elements

You can call Server Actions in elements nested inside `<form>` such as `<button>`, `<input type="submit">`, and `<input type="image">`. These elements accept the `formAction` prop or event handlers.

This is useful in cases where you want to call multiple Server Actions within a form. For example, you can create a specific `<button>` element for saving a post draft in addition to publishing it. See the [React `<form>` docs](https://react.dev/reference/react-dom/components/form#handling-multiple-submission-types) for more information.

## Programmatic form submission

You can trigger a form submission programmatically using the [`requestSubmit()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormElement/requestSubmit) method. For example, when the user submits a form using the `⌘` + `Enter` keyboard shortcut, you can listen for the `onKeyDown` event:

```tsx
// Archivo: app/entry.tsx switcher
'use client'

export function Entry() {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === 'Enter' || e.key === 'NumpadEnter')
    ) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div>
      <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
    </div>
  )
}
```

```jsx
// Archivo: app/entry.js switcher
'use client'

export function Entry() {
  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey || e.metaKey) &&
      (e.key === 'Enter' || e.key === 'NumpadEnter')
    ) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div>
      <textarea name="entry" rows={20} required onKeyDown={handleKeyDown} />
    </div>
  )
}
```

This will trigger the submission of the nearest `<form>` ancestor, which will invoke the Server Function.


[⬆ Subir al inicio del capítulo](#)

---

<a id="server-actions-and-mutations"></a>

## Server Actions and Mutations

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/server-actions](https://nextjs.org/docs/app/guides/server-actions)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *How Server Actions work in Next.js, including the single-roundtrip response model, sequential dispatch, security, and caching integration.*  

---

A **Server Action** is a [React Server Function](https://react.dev/reference/rsc/server-functions) invoked through React's action mechanisms, such as `<form action>`, `<button formAction>`, or a client-side transition.

You create one by adding the [`'use server'`](/docs/app/api-reference/directives/use-server) directive, then invoke it from a form, or from an event handler or `useEffect` wrapped in `startTransition`. For the basics of creating and invoking Server Functions, see [Mutating data](/docs/app/getting-started/mutating-data) and the [Forms guide](/docs/app/guides/forms).

This page covers the parts of Server Actions that are specific to Next.js: how they commonly map to mutations, how the response carries both returned data and re-rendered UI, how the client dispatches them, the security boundary the framework enforces, and the configuration available.

## Sequential dispatch on the client

Next.js dispatches Server Actions one at a time per client. If a user triggers three actions in quick succession, the second waits for the first to finish, then the third waits for the second. This keeps the re-rendered server tree consistent with the action result that produced it.

A consequence: do not rely on `Promise.all` to parallelize Server Actions from the client. If you need parallel work, do it inside a single Server Action, fetch in parallel from a [Server Component](/docs/app/getting-started/fetching-data#server-components), or use a [Route Handler](/docs/app/guides/backend-for-frontend#manipulating-data) for non-mutation requests.

> **Good to know:** This is a property of the client dispatcher, not of Server Functions in general. Server-side, an action runs in its own request and can do anything an async function can do.

## A single response carries data and UI

When a Server Action triggers an immediate revalidation, Next.js does the work inside one HTTP request: it runs the action, then re-renders the current route server-side. The response that comes back contains both pieces in the same Flight stream:

- The action's return value, consumed by `useActionState` or the awaited promise on the client.
- A newly rendered [RSC Payload](/docs/app/glossary#rsc-payload) for the current route, which the client commits as a seeded navigation.

Your application code does not need a follow-up fetch to see the updated UI for the current page.

A re-render is included in the same response when the action does any of these:

- Calls [`updateTag`](/docs/app/api-reference/functions/updateTag) or [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath) to immediately invalidate cached data.
- Calls [`refresh`](/docs/app/api-reference/functions/refresh) to refetch the current route's RSC Payload.
- Mutates cookies through [`cookies()`](/docs/app/api-reference/functions/cookies#understanding-cookie-behavior-in-server-functions). Setting or deleting a cookie automatically re-renders the current page so the UI reflects the new value.
- Calls [`redirect`](/docs/app/api-reference/functions/redirect). The response navigates the router and streams the destination's RSC Payload.

```ts
// Archivo: app/posts/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function createPost(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await db.post.create({
    data: {
      title: String(formData.get('title')),
      authorId: session.user.id,
    },
  })

  revalidatePath('/posts')
}
```

The mutation, the cache invalidation, and the page re-render all complete in a single roundtrip. Because [`redirect`](/docs/app/api-reference/functions/redirect#behavior) throws a control-flow exception, any code after it does not run. Place revalidation calls before `redirect` if the destination needs the fresh data.

[`revalidateTag`](/docs/app/api-reference/functions/revalidateTag) with a stale-while-revalidate profile is the exception: it marks the tag for background refresh and does **not** include a re-render in the action response. The page reflects the change on a later read. An action that does none of the above carries only its return value, and the current route is not re-rendered.

## Security

A Server Action runs as a POST request against the page that invokes it. At build time, the `'use server'` directive tells the compiler to swap the function's implementation in client bundles for a reference (an action ID plus a dispatcher) that POSTs back to the server. The implementation stays on the server, but the route is reachable to anyone who can send the same POST. Treat every action as an untrusted entry point.

Next.js enforces a few framework-level protections:

- **CSRF check.** The request's `Origin` is compared to the `Host` (or `X-Forwarded-Host`). Mismatches are rejected. Configure [`serverActions.allowedOrigins`](/docs/app/api-reference/config/next-config-js/serverActions#allowedorigins) for proxy or CDN domains.
- **Body size limit.** Action requests are capped at 1MB by default. Configure [`serverActions.bodySizeLimit`](/docs/app/api-reference/config/next-config-js/serverActions#bodysizelimit) when accepting larger payloads.
- **Encrypted action IDs and dead code elimination.** Action references are encrypted at build time, and unused Server Functions are stripped from client bundles so they have no public endpoint. See [Built-in Server Actions security features](/docs/app/guides/data-security#built-in-server-actions-security-features).
- **Closure variable encryption.** Variables captured by an inline action are encrypted before being sent to the client. For multi-instance and self-hosted deployments, set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` to a stable key shared across instances. See [Closures and encryption](/docs/app/guides/data-security#closures-and-encryption).

Framework protections are not a substitute for application-level checks. Inside every action:

- **Authenticate and authorize.** Render-time gating (only rendering a form on an authenticated page) is not a security boundary, because requests can be sent without going through the UI.
- **Validate inputs.** Treat `FormData`, query parameters, and headers as untrusted.
- **Constrain return values.** Action returns are serialized to the client. Shape them to what the UI renders, not raw database records.

For end-to-end patterns including a Data Access Layer, return-value tainting, and rate limiting, see the [Data Security guide](/docs/app/guides/data-security#mutating-data).

Destructive operations like deletes may warrant stronger handling, such as elevated session checks or re-authentication, and a loud failure when those checks miss.

```ts
// Archivo: app/posts/actions.ts highlight={6,7,8}
'use server'

import { auth } from '@/lib/auth'

export async function deletePost(postId: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')
  if (!(await canDelete(session.user, postId))) throw new Error('Forbidden')

  await db.post.delete({ where: { id: postId } })
}
```

If you've enabled the experimental [`authInterrupts`](/docs/app/api-reference/config/next-config-js/authInterrupts) flag, you can throw [`unauthorized()`](/docs/app/api-reference/functions/unauthorized) and [`forbidden()`](/docs/app/api-reference/functions/forbidden) from `next/navigation` instead, so Next.js renders the corresponding `unauthorized.tsx` / `forbidden.tsx` UI segment automatically.

For example, a client legitimately tells the server _which_ item to act on, but it should not supply the row's contents or ownership. Send a reference (typically an ID) plus the user's change, and re-read the rest from a trusted source using the session. Schema validation (zod or similar) only checks the _shape_ of the input. A well-formed `Item` object can still refer to a row the caller does not own.

```ts
// Archivo: app/items/actions.ts
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// Unsafe: no auth, no ownership check. The whole item, including its id, comes
// from the client, so anyone who can POST here can mark any item complete.
export async function completeItemUnsafe(item: Item) {
  await db.item.update({ where: { id: item.id }, data: { completed: true } })
}

// Safe: take only the change, derive identity from the session, look up by ownership.
export async function completeItem(itemId: string) {
  const session = await auth()
  if (!session?.user) return

  const item = await db.item.findFirst({
    where: { id: itemId, ownerId: session.user.id },
  })
  if (!item) return

  await db.item.update({ where: { id: item.id }, data: { completed: true } })
}
```

## Choosing a cache update

After mutating data, on-demand revalidation updates the server cache, the client router, or both. Choose based on what needs to change:

- [`updateTag`](/docs/app/api-reference/functions/updateTag): immediate expiration of a tag. The next read (including the route re-render that ships with the action's response) waits for fresh data. Use when the action needs **read-your-own-writes** so the user immediately sees their change. Server Actions only.
- [`revalidateTag`](/docs/app/api-reference/functions/revalidateTag): stale-while-revalidate refresh of a tag with a cache-life profile. Subsequent reads get the stale value while a fresh fetch happens in the background, so the action's own re-render does **not** wait for the new data.
- [`revalidatePath`](/docs/app/api-reference/functions/revalidatePath): invalidate by URL path. Use when one route is affected and tagging is overkill.
- [`refresh`](/docs/app/api-reference/functions/refresh): refetch the current route's RSC Payload without invalidating cached data. Use when the view depends on state outside the cache that the action just changed.

When `updateTag`, `revalidatePath`, or `refresh` runs, Next.js re-renders the current route server-side and includes a newly rendered [RSC Payload](/docs/app/glossary#rsc-payload) in the action's response, so the page reflects the change in the same roundtrip. `revalidateTag` with a stale-while-revalidate profile intentionally skips that immediate re-render.

Unlike [`redirect`](/docs/app/api-reference/functions/redirect), none of these throw, so an action can call them and still return a value to the caller. See [How revalidation works](/docs/app/guides/how-revalidation-works) for the underlying model.

## Configuration

The [`serverActions`](/docs/app/api-reference/config/next-config-js/serverActions) option in `next.config.js` controls framework-level behavior:

```js
// Archivo: next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
      bodySizeLimit: '2mb',
    },
  },
}
```

For the closure encryption key, set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` in the deployment environment. See [Self-hosting: Server Functions encryption key](/docs/app/guides/self-hosting#server-functions-encryption-key) for deployment-specific guidance.

## Deployment considerations

Each Server Action is identified by the [action ID](#security) that is part of its build artifacts. New deployments typically generate new IDs (Next.js rotates them at most every 14 days, even when the source is unchanged), so a client still running the previous build may invoke an action ID that no longer exists. The error surfaces as "[Failed to find Server Action](https://nextjs.org/docs/messages/failed-to-find-server-action)".

To minimize disruption:

- Prefer rolling deployments over abrupt cutovers when active users are likely to be mid-mutation.
- Keep `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` stable across instances so action references remain decryptable everywhere.
- Surface the error as a retry path in the UI rather than a hard failure, so a refresh recovers the user.


[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-create-forms-with-api-routes"></a>

## How to create forms with API Routes

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/forms](https://nextjs.org/docs/pages/guides/forms)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to handle form submissions and data mutations with Next.js.*  

---

Forms enable you to create and update data in web applications. Next.js provides a powerful way to handle data mutations using **API Routes**. This guide will walk you through how to handle form submission on the server.

## Server Forms

To handle form submissions on the server, create an API endpoint that securely mutates data.

```ts
// Archivo: pages/api/submit.ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body
  const id = await createItem(data)
  res.status(200).json({ id })
}
```

```js
// Archivo: pages/api/submit.js switcher
export default function handler(req, res) {
  const data = req.body
  // call your database, etc.
  // const id = await createItem(data)
  // ...
  res.status(200).json({ data })
}
```

Then, call the API Route from the client with an event handler:

```tsx
// Archivo: pages/index.tsx switcher
import { SubmitEvent } from 'react'

export default function Page() {
  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    })

    // Handle response if necessary
    const data = await response.json()
    // ...
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

```jsx
// Archivo: pages/index.jsx switcher
export default function Page() {
  async function onSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    })

    // Handle response if necessary
    const data = await response.json()
    // ...
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

> **Good to know:**
>
> - API Routes [do not specify CORS headers](https://developer.mozilla.org/docs/Web/HTTP/CORS), meaning they are same-origin only by default.
> - Since API Routes run on the server, we're able to use sensitive values (like API keys) through [Environment Variables](/docs/pages/guides/environment-variables) without exposing them to the client. This is critical for the security of your application.

## Form validation

We recommend using HTML validation like `required` and `type="email"` for basic client-side form validation.

For more advanced server-side validation, you can use a schema validation library like [Zod](https://zod.dev/) or [Valibot](https://valibot.dev/) to validate the form fields before mutating the data:

```ts
// Archivo: pages/api/submit.ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

const schema = z.object({
  // ...
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const parsed = schema.parse(req.body)
  // ...
}
```

```js
// Archivo: pages/api/submit.js switcher
import { z } from 'zod'

const schema = z.object({
  // ...
})

export default async function handler(req, res) {
  const parsed = schema.parse(req.body)
  // ...
}
```

### Error handling

You can use React state to show an error message when a form submission fails:

```tsx
// Archivo: pages/index.tsx switcher
import React, { useState, SubmitEvent } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError(null) // Clear previous errors when a new request starts

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }

      // Handle response if necessary
      const data = await response.json()
      // ...
    } catch (error) {
      // Capture the error message to display to the user
      setError(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <input type="text" name="name" required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
```

```jsx
// Archivo: pages/index.jsx switcher
import React, { useState } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true)
    setError(null) // Clear previous errors when a new request starts

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to submit the data. Please try again.')
      }

      // Handle response if necessary
      const data = await response.json()
      // ...
    } catch (error) {
      // Capture the error message to display to the user
      setError(error.message)
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <input type="text" name="name" required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
      </form>
    </div>
  )
}
```

## Displaying loading state

You can use React state to show a loading state when a form is submitting on the server:

```tsx
// Archivo: pages/index.tsx switcher
import React, { useState, SubmitEvent } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function onSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true) // Set loading to true when the request starts

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      // Handle response if necessary
      const data = await response.json()
      // ...
    } catch (error) {
      // Handle error if necessary
      console.error(error)
    } finally {
      setIsLoading(false) // Set loading to false when the request completes
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  )
}
```

```jsx
// Archivo: pages/index.jsx switcher
import React, { useState } from 'react'

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event) {
    event.preventDefault()
    setIsLoading(true) // Set loading to true when the request starts

    try {
      const formData = new FormData(event.currentTarget)
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: formData,
      })

      // Handle response if necessary
      const data = await response.json()
      // ...
    } catch (error) {
      // Handle error if necessary
      console.error(error)
    } finally {
      setIsLoading(false) // Set loading to false when the request completes
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <input type="text" name="name" />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
    </form>
  )
}
```

### Redirecting

If you would like to redirect the user to a different route after a mutation, you can [`redirect`](/docs/pages/building-your-application/routing/api-routes#response-helpers) to any absolute or relative URL:

```ts
// Archivo: pages/api/submit.ts switcher
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = await addPost()
  res.redirect(307, `/post/${id}`)
}
```

```js
// Archivo: pages/api/submit.js switcher
export default async function handler(req, res) {
  const id = await addPost()
  res.redirect(307, `/post/${id}`)
}
```


[⬆ Subir al inicio del capítulo](#)

---

<a id="error-handling"></a>

## Error Handling

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/building-your-application/configuring/error-handling](https://nextjs.org/docs/pages/building-your-application/configuring/error-handling)  
> 📂 **Sección:** Pages > Building Your Application > Configuring  
> 📝 **Descripción:** *Handle errors in your Next.js app.*  

---

This documentation explains how you can handle development, server-side, and client-side errors.

## Handling Errors in Development

When there is a runtime error during the development phase of your Next.js application, you will encounter an **overlay**. It is a modal that covers the webpage. It is **only** visible when the development server runs using `next dev` via `pnpm dev`, `npm run dev`, `yarn dev`, or `bun dev` and will not be shown in production. Fixing the error will automatically dismiss the overlay.

## Handling Server Errors

Next.js provides a static 500 page by default to handle server-side errors that occur in your application. You can also [customize this page](/docs/pages/building-your-application/routing/custom-error#customizing-the-500-page) by creating a `pages/500.js` file.

Having a 500 page in your application does not show specific errors to the app user.

You can also use [404 page](/docs/pages/building-your-application/routing/custom-error#404-page) to handle specific runtime error like `file not found`.

## Handling Client Errors

React [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) is a graceful way to handle a JavaScript error on the client so that the other parts of the application continue working. In addition to preventing the page from crashing, it allows you to provide a custom fallback component and even log error information.

To use Error Boundaries for your Next.js application, you must create a class component `ErrorBoundary` and wrap the `Component` prop in the `pages/_app.js` file. This component will be responsible to:

- Render a fallback UI after an error is thrown
- Provide a way to reset the Application's state
- Log error information

You can create an `ErrorBoundary` class component by extending `React.Component`. For example:

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI

    return { hasError: true }
  }
  componentDidCatch(error, errorInfo) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })
  }
  render() {
    // Check if the error is thrown
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      )
    }

    // Return children components in case of no error

    return this.props.children
  }
}

export default ErrorBoundary
```

The `ErrorBoundary` component keeps track of an `hasError` state. The value of this state variable is a boolean. When the value of `hasError` is `true`, then the `ErrorBoundary` component will render a fallback UI. Otherwise, it will render the children components.

After creating an `ErrorBoundary` component, import it in the `pages/_app.js` file to wrap the `Component` prop in your Next.js application.

```jsx
// Import the ErrorBoundary component
import ErrorBoundary from '../components/ErrorBoundary'

function MyApp({ Component, pageProps }) {
  return (
    // Wrap the Component prop with ErrorBoundary component
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}

export default MyApp
```

You can learn more about [Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) in React's documentation.

### Reporting Errors

To monitor client errors, use a service like [Sentry](https://github.com/vercel/next.js/tree/canary/examples/with-sentry), Bugsnag or Datadog.


[⬆ Subir al inicio del capítulo](#)

---

