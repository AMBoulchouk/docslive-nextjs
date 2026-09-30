# Capítulo 8: Seguridad, Autenticación y Protección de Datos

> 📌 **Capítulo 08** | Libro Guía Next.js v16.3.7  
> 📝 **Resumen:** *Autenticación con Cache Components, Content Security Policy (CSP), protección contra ataques, cookies y middleware.*  
> 📄 **Temas incluidos en este capítulo:** 8 secciones  

[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)

---

## Contenido del Capítulo

- [How to implement authentication with Cache Components](#how-to-implement-authentication-with-cache-components)
- [How to implement authentication in Next.js](#how-to-implement-authentication-in-nextjs)
- [How to set a Content Security Policy (CSP) for your Next.js application](#how-to-set-a-content-security-policy-csp-for-your-nextjs-application)
- [How to think about data security in Next.js](#how-to-think-about-data-security-in-nextjs)
- [How to use environment variables in Next.js](#how-to-use-environment-variables-in-nextjs)
- [How to implement authentication in Next.js](#how-to-implement-authentication-in-nextjs)
- [How to set a Content Security Policy (CSP) for your Next.js application](#how-to-set-a-content-security-policy-csp-for-your-nextjs-application)
- [How to use environment variables in Next.js](#how-to-use-environment-variables-in-nextjs)

---

<a id="how-to-implement-authentication-with-cache-components"></a>

## How to implement authentication with Cache Components

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/authentication-with-cache-components](https://nextjs.org/docs/app/guides/authentication-with-cache-components)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to read the user session, show authenticated UI without slowing down the page, and cache data derived from the session when Cache Components is enabled.*  

---

With [Cache Components](/docs/app/getting-started/caching) enabled, a session read happens at request time, so it can't be prerendered into the static shell. Authenticated UI streams in behind a ```<Suspense>``
    </main>
  )
}

async function Announcements() {
  'use cache'
  const announcements = await getAnnouncements()
  return (
    <ul>
      {announcements.map((announcement) => (
        <li key={announcement}>{announcement}</li>
      ))}
    </ul>
  )
}

async function Dashboard() {
  const user = await getCurrentUser()
  return <h1>Welcome, {user.name}</h1>
}
```

Keep the session read out of a layout's top level, too. A top-level `await` on the session in a layout holds the whole segment, including `{children}`, behind that request, so push it into a component inside a boundary. See [Push dynamic access down](/docs/app/guides/streaming#push-dynamic-access-down).

> **Good to know:** `getCurrentUser` reads the session, checks it, and returns a narrow user. Centralizing those reads in one function is the [Data Access Layer](/docs/app/guides/authentication#creating-a-data-access-layer-dal) pattern.

## Step 3: Share the user across components

You don't have to read the session again in every component that needs the user. Read it once, then hand it to as many Server and Client Components as you like from inside the same boundary.

Server Components can call `getCurrentUser()` directly. To reach Client Components without prop drilling, create the promise once, pass it through context, and unwrap it with [`use()`](https://react.dev/reference/react/use). For the general pattern, see [Using React's `use` within a Context Provider](/docs/app/guides/single-page-applications#using-reacts-use-within-a-context-provider). Because `getCurrentUser` reads the request, create its promise inside the Suspense boundary, not at the top of a layout.

```tsx
// Archivo: app/user-provider.tsx
'use client'

import { createContext, use } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/lib/auth'

const UserContext = createContext<Promise<User> | null>(null)

export function UserProvider({
  userPromise,
  children,
}: {
  userPromise: Promise<User>
  children: ReactNode
}) {
  return <UserContext value={userPromise}>{children}</UserContext>
}

export function useUser() {
  const userPromise = use(UserContext)
  if (!userPromise) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return use(userPromise)
}
```

The Server Component behind the boundary creates the promise and hands it to the provider without awaiting it. Each consumer then resolves it behind its own boundary, so the shared chrome renders without waiting on the session:

```tsx
// Archivo: app/page.tsx
function Dashboard() {
  const userPromise = getCurrentUser()

  return (
    <UserProvider userPromise={userPromise}>
      ``<Suspense>``
    </UserProvider>
  )
}
```

Client Components call `useUser()` to get the current user. Because `use()` suspends until the promise resolves, keep the component behind a ``<Suspense>`` boundary:

```tsx
// Archivo: app/user-badge.tsx
'use client'

import { useUser } from './user-provider'

export function UserBadge() {
  const user = useUser()
  return <span>Signed in as {user.name}</span>
}
```

> **Good to know:** Expose only what the client needs. The `getCurrentUser` helper returns a narrow `{ id, name }` rather than the raw session. To keep sensitive fields from reaching the client, see [`taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue).

## Step 4: Cache session-derived data

Now that you have the user, you can cache the data you fetch for them in one of two ways. Passing the user id into a plain [`use cache`](/docs/app/api-reference/directives/use-cache) function keeps the result on the server, keyed by the id (it becomes part of the [cache key](/docs/app/api-reference/directives/use-cache#cache-keys)), where a [`cacheTag`](/docs/app/api-reference/functions/cacheTag) can invalidate it later. Reading it inside a [`use cache: private`](/docs/app/api-reference/directives/use-cache-private) scope keeps it in the browser only, never on the server, which matters when requirements forbid storing certain data server-side, even ephemerally. The example passes the id, since these notes are tagged and refreshed when they change.

A plain `use cache` scope can't read `cookies()`, so the exported function resolves the user and passes just the id to the cached function:

```tsx
// Archivo: lib/data.ts
import 'server-only'
import { cacheLife, cacheTag } from 'next/cache'
import { getCurrentUser } from './auth'

export async function getNotes() {
  const user = await getCurrentUser()
  return getNotesByUserId(user.id)
}

async function getNotesByUserId(userId: string) {
  'use cache'
  cacheTag(`notes:${userId}`)
  cacheLife('minutes')

  return db.query.notes.findMany({
    where: (notes, { eq }) => eq(notes.userId, userId),
  })
}
```

Keep `getNotesByUserId` unexported so a caller can't request another user's notes by passing a different id. Resolving the user inside the exported getter is what makes that safe. See [Data Security](/docs/app/guides/data-security#data-access-layer).

Call it from a Server Component that renders the notes. There's no user id to pass, and the `getCurrentUser()` call inside the getter hits the private cache, so the session isn't read again:

```tsx
// Archivo: app/page.tsx
async function Notes() {
  const notes = await getNotes()
  // ...
}
```

> **Good to know: cache keys and tags are stored in plain text.** A cached function's arguments and captured variables are serialized into its cache key, and `cacheTag` values are stored as written. Neither is hashed: the default cache holds them as plain-text map keys and tag lists, and a [remote cache](/docs/app/api-reference/directives/use-cache-remote) receives them the same way. Key and tag on a stable identifier like the user id, and keep secrets and sensitive personal data (tokens, passwords, raw emails) out of arguments and tags.

On the server, plain `use cache` keeps the entry in memory as a best effort: it's evicted under pressure and, in serverless, doesn't persist across instances. If that data must survive across instances and requests, opt into [`use cache: remote`](/docs/app/api-reference/directives/use-cache-remote) for durable, shared storage, where [the cache key you choose](/docs/app/api-reference/directives/use-cache-remote#cache-key-considerations) drives your hit rate.

## Step 5: Update session-derived data

When a [Server Action](/docs/app/getting-started/mutating-data) changes a user's data, call [`updateTag`](/docs/app/api-reference/functions/updateTag) with the same tag to refresh the cached entry. Re-read the session inside the action so it authorizes itself rather than trusting the client. See [authentication with Server Actions](/docs/app/guides/authentication#server-actions) for why this matters.

```ts
// Archivo: app/actions.ts
'use server'
import { redirect } from 'next/navigation'
import { updateTag } from 'next/cache'
import { getSession } from '@/lib/session'
import { saveNote } from '@/lib/data'

export async function addNote(formData: FormData) {
  const { userId } = await getSession()
  if (!userId) {
    redirect('/login')
  }

  const note = String(formData.get('note') ?? '').trim()
  if (note) {
    await saveNote(userId, note)
    updateTag(`notes:${userId}`)
  }
}
```

## Step 6: Make authenticated navigations instant

Cached reads already have a lifetime, so this mostly happens on its own. A `use cache: private` scope uses the [`default` profile](/docs/app/api-reference/functions/cacheLife#preset-cache-profiles) (a five-minute `stale`) unless you set one, and a route that reads the session produces a per-session [App Shell](/docs/app/glossary#app-shell) with the authenticated content, prefetched and cached per session. Navigations to it are already instant.

Two things keep it that way:

- If you tune the lifetime with [`cacheLife`](/docs/app/api-reference/functions/cacheLife), keep `stale` at 30 seconds or more. Below that, the scope drops out of prefetching. See [`cacheLife` client cache behavior](/docs/app/api-reference/functions/cacheLife#client-cache-behavior).
- A route that _also_ depends on the URL (a `params` or `searchParams` value) needs [`<Link prefetch={true}>`](/docs/app/api-reference/components/link#prefetch) on the links pointing at it. That opts into [per-link prefetching](/docs/app/guides/optimizing-prefetching), which resolves the per-link data ahead of the click.

```tsx
// Archivo: app/page.tsx
<Link href={`/notes/${note.id}`} prefetch={true}>
  {note.text}
</Link>
```

The destination needs [Partial Prefetching](/docs/app/guides/adopting-partial-prefetching) for this, so enable the [`partialPrefetching`](/docs/app/api-reference/config/next-config-js/partialPrefetching) flag or set `prefetch = 'partial'` on the segment. Add the prop where the wait is worth it: that prefetch costs one server invocation per link, so a sidebar of `/chat/[id]` links pays that cost per item.

## Common pitfalls

- **Reading `cookies()` or `headers()` inside a plain `use cache` function.** This throws. Read the request outside and pass the value in, or use `use cache: private`.
- **Putting secrets or personal data in cache keys or tags.** Arguments and `cacheTag` values are stored in plain text. Key and tag on a stable identifier, not on sensitive input.
- **Trusting the client for authorization.** UI checks hide elements, but they don't protect data. Re-verify the session in every Server Action and [Route Handler](/docs/app/api-reference/file-conventions/route), close to the data. See [Authorization](/docs/app/guides/authentication#authorization).



[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-implement-authentication-in-nextjs"></a>

## How to implement authentication in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/authentication](https://nextjs.org/docs/app/guides/authentication)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to implement authentication in your Next.js application.*  

---

Understanding authentication is crucial for protecting your application's data. This page will guide you through what React and Next.js features to use to implement auth.

Before starting, it helps to break down the process into three concepts:

1. **[Authentication](#authentication)**: Verifies if the user is who they say they are. It requires the user to prove their identity with something they have, such as a username and password.
2. **[Session Management](#session-management)**: Tracks the user's auth state across requests.
3. **[Authorization](#authorization)**: Decides what routes and data the user can access.

This diagram shows the authentication flow using React and Next.js features:

![Diagram showing the authentication flow with React and Next.js features]()

The examples on this page walk through basic username and password auth for educational purposes. While you can implement a custom auth solution, for increased security and simplicity, we recommend using an authentication library. These offer built-in solutions for authentication, session management, and authorization, as well as additional features such as social logins, multi-factor authentication, and role-based access control. You can find a list in the [Auth Libraries](#auth-libraries) section.

> **Good to know:** With [Cache Components](/docs/app/api-reference/config/next-config-js/cacheComponents) enabled, reading the session and caching per-user data follow specific rules. See [Authentication with Cache Components](/docs/app/guides/authentication-with-cache-components).

## Authentication

### Sign-up and login functionality

You can use the [`<form>`](https://react.dev/reference/react-dom/components/form) element with React's [Server Actions](/docs/app/getting-started/mutating-data) and `useActionState` to capture user credentials, validate form fields, and call your Authentication Provider's API or database.

Since Server Actions always execute on the server, they provide a secure environment for handling authentication logic.

Here are the steps to implement signup/login functionality:

#### 1. Capture user credentials

To capture user credentials, create a form that invokes a Server Action on submission. For example, a signup form that accepts the user's name, email, and password:

```tsx
// Archivo: app/ui/signup-form.tsx switcher
import { signup } from '@/app/actions/auth'

export function SignupForm() {
  return (
    <form action={signup}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  )
}
```

```jsx
// Archivo: app/ui/signup-form.js switcher
import { signup } from '@/app/actions/auth'

export function SignupForm() {
  return (
    <form action={signup}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="Email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      <button type="submit">Sign Up</button>
    </form>
  )
}
```

```tsx
// Archivo: app/actions/auth.ts switcher
export async function signup(formData: FormData) {}
```

```jsx
// Archivo: app/actions/auth.js switcher
export async function signup(formData) {}
```

#### 2. Validate form fields on the server

Use the Server Action to validate the form fields on the server. If your authentication provider doesn't provide form validation, you can use a schema validation library like [Zod](https://zod.dev/), [Valibot](https://valibot.dev/) or [Yup](https://github.com/jquense/yup).

Using Zod as an example, you can define a form schema with appropriate error messages:

```ts
// Archivo: app/lib/definitions.ts switcher
import * as z from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    })
    .trim(),
})

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined
```

```js
// Archivo: app/lib/definitions.js switcher
import * as z from 'zod'

export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Name must be at least 2 characters long.' })
    .trim(),
  email: z.email({ error: 'Please enter a valid email.' }).trim(),
  password: z
    .string()
    .min(8, { error: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { error: 'Contain at least one letter.' })
    .regex(/[0-9]/, { error: 'Contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Contain at least one special character.',
    })
    .trim(),
})
```

To prevent unnecessary calls to your authentication provider's API or database, you can `return` early in the Server Action if any form fields do not match the defined schema.

```ts
// Archivo: app/actions/auth.ts switcher
import { SignupFormSchema, FormState } from '@/app/lib/definitions'

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Call the provider or db to create a user...
}
```

```js
// Archivo: app/actions/auth.js switcher
import { SignupFormSchema } from '@/app/lib/definitions'

export async function signup(state, formData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  // Call the provider or db to create a user...
}
```

Back in your `<SignupForm />`, you can use React's `useActionState` hook to display validation errors while the form is submitting:

```tsx
// Archivo: app/ui/signup-form.tsx switcher highlight={7,15,21,27-36}
'use client'

import { signup } from '@/app/actions/auth'
import { useActionState } from 'react'

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <button disabled={pending} type="submit">
        Sign Up
      </button>
    </form>
  )
}
```

```jsx
// Archivo: app/ui/signup-form.js switcher highlight={7,15,21,27-36}
'use client'

import { signup } from '@/app/actions/auth'
import { useActionState } from 'react'

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <form action={action}>
      <div>
        <label htmlFor="name">Name</label>
        <input id="name" name="name" placeholder="Name" />
      </div>
      {state?.errors?.name && <p>{state.errors.name}</p>}

      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" placeholder="Email" />
      </div>
      {state?.errors?.email && <p>{state.errors.email}</p>}

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      {state?.errors?.password && (
        <div>
          <p>Password must:</p>
          <ul>
            {state.errors.password.map((error) => (
              <li key={error}>- {error}</li>
            ))}
          </ul>
        </div>
      )}
      <button disabled={pending} type="submit">
        Sign Up
      </button>
    </form>
  )
}
```

> **Good to know:**
>
> - In React 19, `useFormStatus` includes additional keys on the returned object, like data, method, and action. If you are not using React 19, only the `pending` key is available.
> - Before mutating data, you should always ensure a user is also authorized to perform the action. See [Authentication and Authorization](#authorization).

#### 3. Create a user or check user credentials

After validating form fields, you can create a new user account or check if the user exists by calling your authentication provider's API or database.

Continuing from the previous example:

```tsx
// Archivo: app/actions/auth.tsx switcher
export async function signup(state: FormState, formData: FormData) {
  // 1. Validate form fields
  // ...

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Insert the user into the database or call an Auth Library's API
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id })

  const user = data[0]

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  // TODO:
  // 4. Create user session
  // 5. Redirect user
}
```

```jsx
// Archivo: app/actions/auth.js switcher
export async function signup(state, formData) {
  // 1. Validate form fields
  // ...

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Insert the user into the database or call an Library API
  const data = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
    })
    .returning({ id: users.id })

  const user = data[0]

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  // TODO:
  // 4. Create user session
  // 5. Redirect user
}
```

After successfully creating the user account or verifying the user credentials, you can create a session to manage the user's auth state. Depending on your session management strategy, the session can be stored in a cookie or database, or both. Continue to the [Session Management](#session-management) section to learn more.

> **Tips:**
>
> - The example above is verbose since it breaks down the authentication steps for the purpose of education. This highlights that implementing your own secure solution can quickly become complex. Consider using an [Auth Library](#auth-libraries) to simplify the process.
> - To improve the user experience, you may want to check for duplicate emails or usernames earlier in the registration flow. For example, as the user types in a username or the input field loses focus. This can help prevent unnecessary form submissions and provide immediate feedback to the user. You can debounce requests with libraries such as [use-debounce](https://www.npmjs.com/package/use-debounce) to manage the frequency of these checks.

> 📘 **Nota para Pages Router:**
> Here are the steps to implement a sign-up and/or login form:
> 
> 1. The user submits their credentials through a form.
> 2. The form sends a request that is handled by an API route.
> 3. Upon successful verification, the process is completed, indicating the user's successful authentication.
> 4. If verification is unsuccessful, an error message is shown.
> 
> Consider a login form where users can input their credentials:
> 
> ```tsx filename="pages/login.tsx" switcher
> import { FormEvent } from 'react'
> import { useRouter } from 'next/router'
> 
> export default function LoginPage() {
>   const router = useRouter()
> 
>   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
>     event.preventDefault()
> 
>     const formData = new FormData(event.currentTarget)
>     const email = formData.get('email')
>     const password = formData.get('password')
> 
>     const response = await fetch('/api/auth/login', {
>       method: 'POST',
>       headers: { 'Content-Type': 'application/json' },
>       body: JSON.stringify({ email, password }),
>     })
> 
>     if (response.ok) {
>       router.push('/profile')
>     } else {
>       // Handle errors
>     }
>   }
> 
>   return (
>     <form onSubmit={handleSubmit}>
>       <input type="email" name="email" placeholder="Email" required />
>       <input type="password" name="password" placeholder="Password" required />
>       <button type="submit">Login</button>
>     </form>
>   )
> }
> ```
> 
> ```jsx filename="pages/login.jsx" switcher
> import { FormEvent } from 'react'
> import { useRouter } from 'next/router'
> 
> export default function LoginPage() {
>   const router = useRouter()
> 
>   async function handleSubmit(event) {
>     event.preventDefault()
> 
>     const formData = new FormData(event.currentTarget)
>     const email = formData.get('email')
>     const password = formData.get('password')
> 
>     const response = await fetch('/api/auth/login', {
>       method: 'POST',
>       headers: { 'Content-Type': 'application/json' },
>       body: JSON.stringify({ email, password }),
>     })
> 
>     if (response.ok) {
>       router.push('/profile')
>     } else {
>       // Handle errors
>     }
>   }
> 
>   return (
>     <form onSubmit={handleSubmit}>
>       <input type="email" name="email" placeholder="Email" required />
>       <input type="password" name="password" placeholder="Password" required />
>       <button type="submit">Login</button>
>     </form>
>   )
> }
> ```
> 
> The form above has two input fields for capturing the user's email and password. On submission, it triggers a function that sends a POST request to an API route (`/api/auth/login`).
> 
> You can then call your Authentication Provider's API in the API route to handle authentication:
> 
> ```ts filename="pages/api/auth/login.ts" switcher
> import type { NextApiRequest, NextApiResponse } from 'next'
> import { signIn } from '@/auth'
> 
> export default async function handler(
>   req: NextApiRequest,
>   res: NextApiResponse
> ) {
>   try {
>     const { email, password } = req.body
>     await signIn('credentials', { email, password })
> 
>     res.status(200).json({ success: true })
>   } catch (error) {
>     if (error.type === 'CredentialsSignin') {
>       res.status(401).json({ error: 'Invalid credentials.' })
>     } else {
>       res.status(500).json({ error: 'Something went wrong.' })
>     }
>   }
> }
> ```
> 
> ```js filename="pages/api/auth/login.js" switcher
> import { signIn } from '@/auth'
> 
> export default async function handler(req, res) {
>   try {
>     const { email, password } = req.body
>     await signIn('credentials', { email, password })
> 
>     res.status(200).json({ success: true })
>   } catch (error) {
>     if (error.type === 'CredentialsSignin') {
>       res.status(401).json({ error: 'Invalid credentials.' })
>     } else {
>       res.status(500).json({ error: 'Something went wrong.' })
>     }
>   }
> }
> ```

## Session Management

Session management ensures that the user's authenticated state is preserved across requests. It involves creating, storing, refreshing, and deleting sessions or tokens.

There are two types of sessions:

1. [**Stateless**](#stateless-sessions): Session data (or a token) is stored in the browser's cookies. The cookie is sent with each request, allowing the session to be verified on the server. This method is simpler, but can be less secure if not implemented correctly.
2. [**Database**](#database-sessions): Session data is stored in a database, with the user's browser only receiving the encrypted session ID. This method is more secure, but can be complex and use more server resources.

> **Good to know:** While you can use either method, or both, we recommend using a session management library such as [iron-session](https://github.com/vvo/iron-session) or [Jose](https://github.com/panva/jose).

### Stateless Sessions

To create and manage stateless sessions, there are a few steps you need to follow:

1. Generate a secret key, which will be used to sign your session, and store it as an [environment variable](/docs/app/guides/environment-variables).
2. Write logic to encrypt/decrypt session data using a session management library.
3. Manage cookies using the Next.js [`cookies`](/docs/app/api-reference/functions/cookies) API.

In addition to the above, consider adding functionality to [update (or refresh)](#updating-or-refreshing-sessions) the session when the user returns to the application, and [delete](#deleting-the-session) the session when the user logs out.

> **Good to know:** Check if your [auth library](#auth-libraries) includes session management.

#### 1. Generating a secret key

There are a few ways you can generate secret key to sign your session. For example, you may choose to use the `openssl` command in your terminal:

```bash
// Archivo: terminal
openssl rand -base64 32
```

This command generates a 32-character random string that you can use as your secret key and store in your [environment variables file](/docs/app/guides/environment-variables):

```bash
// Archivo: .env
SESSION_SECRET=your_secret_key
```

You can then reference this key in your session management logic:

```js
// Archivo: app/lib/session.js
const secretKey = process.env.SESSION_SECRET
```

#### 2. Encrypting and decrypting sessions

Next, you can use your preferred [session management library](#session-management-libraries) to encrypt and decrypt sessions. Continuing from the previous example, we'll use [Jose](https://www.npmjs.com/package/jose) and React's [`server-only`](https://www.npmjs.com/package/server-only) package to ensure that your session management logic is only executed on the server.

```tsx
// Archivo: app/lib/session.ts switcher
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { SessionPayload } from '@/app/lib/definitions'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}
```

```jsx
// Archivo: app/lib/session.js switcher
import 'server-only'
import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}
```

> **Tips**:
>
> - The payload should contain the **minimum**, unique user data that'll be used in subsequent requests, such as the user's ID, role, etc. It should not contain personally identifiable information like phone number, email address, credit card information, etc, or sensitive data like passwords.

#### 3. Setting cookies (recommended options)

To store the session in a cookie, use the Next.js [`cookies`](/docs/app/api-reference/functions/cookies) API. The cookie should be set on the server, and include the recommended options:

- **HttpOnly**: Prevents client-side JavaScript from accessing the cookie.
- **Secure**: Use https to send the cookie.
- **SameSite**: Specify whether the cookie can be sent with cross-site requests.
- **Max-Age or Expires**: Delete the cookie after a certain period.
- **Path**: Define the URL path for the cookie.

Please refer to [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) for more information on each of these options.

```ts
// Archivo: app/lib/session.ts switcher
import 'server-only'
import { cookies } from 'next/headers'

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

```js
// Archivo: app/lib/session.js switcher
import 'server-only'
import { cookies } from 'next/headers'

export async function createSession(userId) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ userId, expiresAt })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

Back in your Server Action, you can invoke the `createSession()` function, and use the [`redirect()`](/docs/app/guides/redirecting) API to redirect the user to the appropriate page:

```ts
// Archivo: app/actions/auth.ts switcher
import { createSession } from '@/app/lib/session'

export async function signup(state: FormState, formData: FormData) {
  // Previous steps:
  // 1. Validate form fields
  // 2. Prepare data for insertion into database
  // 3. Insert the user into the database or call an Library API

  // Current steps:
  // 4. Create user session
  await createSession(user.id)
  // 5. Redirect user
  redirect('/profile')
}
```

```js
// Archivo: app/actions/auth.js switcher
import { createSession } from '@/app/lib/session'

export async function signup(state, formData) {
  // Previous steps:
  // 1. Validate form fields
  // 2. Prepare data for insertion into database
  // 3. Insert the user into the database or call an Library API

  // Current steps:
  // 4. Create user session
  await createSession(user.id)
  // 5. Redirect user
  redirect('/profile')
}
```

> **Tips**:
>
> - **Cookies should be set on the server** to prevent client-side tampering.
> - 🎥 Watch: Learn more about stateless sessions and authentication with Next.js → [YouTube (11 minutes)](https://www.youtube.com/watch?v=DJvM2lSPn6w).

#### Updating (or refreshing) sessions

You can also extend the session's expiration time. This is useful for keeping the user logged in after they access the application again. For example:

```ts
// Archivo: app/lib/session.ts switcher
import 'server-only'
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export async function updateSession() {
  const session = (await cookies()).get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}
```

```js
// Archivo: app/lib/session.js switcher
import 'server-only'
import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export async function updateSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}
```

> **Tip:** Check if your auth library supports refresh tokens, which can be used to extend the user's session.

#### Deleting the session

To delete the session, you can delete the cookie:

```ts
// Archivo: app/lib/session.ts switcher
import 'server-only'
import { cookies } from 'next/headers'

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
```

```js
// Archivo: app/lib/session.js switcher
import 'server-only'
import { cookies } from 'next/headers'

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}
```

Then you can reuse the `deleteSession()` function in your application, for example, on logout:

```ts
// Archivo: app/actions/auth.ts switcher
import { cookies } from 'next/headers'
import { deleteSession } from '@/app/lib/session'

export async function logout() {
  await deleteSession()
  redirect('/login')
}
```

```js
// Archivo: app/actions/auth.js switcher
import { cookies } from 'next/headers'
import { deleteSession } from '@/app/lib/session'

export async function logout() {
  await deleteSession()
  redirect('/login')
}
```

> 📘 **Nota para Pages Router:**
> #### Setting and deleting cookies
> 
> You can use [API Routes](/docs/pages/building-your-application/routing/api-routes) to set the session as a cookie on the server:
> 
> ```ts filename="pages/api/login.ts" switcher
> import { serialize } from 'cookie'
> import type { NextApiRequest, NextApiResponse } from 'next'
> import { encrypt } from '@/app/lib/session'
> 
> export default function handler(req: NextApiRequest, res: NextApiResponse) {
>   const sessionData = req.body
>   const encryptedSessionData = encrypt(sessionData)
> 
>   const cookie = serialize('session', encryptedSessionData, {
>     httpOnly: true,
>     secure: process.env.NODE_ENV === 'production',
>     maxAge: 60 * 60 * 24 * 7, // One week
>     path: '/',
>   })
>   res.setHeader('Set-Cookie', cookie)
>   res.status(200).json({ message: 'Successfully set cookie!' })
> }
> ```
> 
> ```js filename="pages/api/login.js" switcher
> import { serialize } from 'cookie'
> import { encrypt } from '@/app/lib/session'
> 
> export default function handler(req, res) {
>   const sessionData = req.body
>   const encryptedSessionData = encrypt(sessionData)
> 
>   const cookie = serialize('session', encryptedSessionData, {
>     httpOnly: true,
>     secure: process.env.NODE_ENV === 'production',
>     maxAge: 60 * 60 * 24 * 7, // One week
>     path: '/',
>   })
>   res.setHeader('Set-Cookie', cookie)
>   res.status(200).json({ message: 'Successfully set cookie!' })
> }
> ```

### Database Sessions

To create and manage database sessions, you'll need to follow these steps:

1. Create a table in your database to store session and data (or check if your Auth Library handles this).
2. Implement functionality to insert, update, and delete sessions
3. Encrypt the session ID before storing it in the user's browser, and ensure the database and cookie stay in sync (this is optional, but recommended for optimistic auth checks in [Proxy](#optimistic-checks-with-proxy-optional)).

For example:

```ts
// Archivo: app/lib/session.ts switcher
import { cookies } from 'next/headers'
import { db } from '@/app/lib/db'
import { encrypt } from '@/app/lib/session'

export async function createSession(id: number) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // 1. Create a session in the database
  const data = await db
    .insert(sessions)
    .values({
      userId: id,
      expiresAt,
    })
    // Return the session ID
    .returning({ id: sessions.id })

  const sessionId = data[0].id

  // 2. Encrypt the session ID
  const session = await encrypt({ sessionId, expiresAt })

  // 3. Store the session in cookies for optimistic auth checks
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

```js
// Archivo: app/lib/session.js switcher
import { cookies } from 'next/headers'
import { db } from '@/app/lib/db'
import { encrypt } from '@/app/lib/session'

export async function createSession(id) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  // 1. Create a session in the database
  const data = await db
    .insert(sessions)
    .values({
      userId: id,
      expiresAt,
    })
    // Return the session ID
    .returning({ id: sessions.id })

  const sessionId = data[0].id

  // 2. Encrypt the session ID
  const session = await encrypt({ sessionId, expiresAt })

  // 3. Store the session in cookies for optimistic auth checks
  const cookieStore = await cookies()
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })
}
```

> **Tips**:
>
> - For faster access, you may consider adding server caching for the lifetime of the session. You can also keep the session data in your primary database, and combine data requests to reduce the number of queries.
> - You may opt to use database sessions for more advanced use cases, such as keeping track of the last time a user logged in, or number of active devices, or give users the ability to log out of all devices.

After implementing session management, you'll need to add authorization logic to control what users can access and do within your application. Continue to the [Authorization](#authorization) section to learn more.

> 📘 **Nota para Pages Router:**
> **Creating a Session on the Server**:
> 
> ```ts filename="pages/api/create-session.ts" switcher
> import db from '../../lib/db'
> import type { NextApiRequest, NextApiResponse } from 'next'
> 
> export default async function handler(
>   req: NextApiRequest,
>   res: NextApiResponse
> ) {
>   try {
>     const user = req.body
>     const sessionId = generateSessionId()
>     await db.insertSession({
>       sessionId,
>       userId: user.id,
>       createdAt: new Date(),
>     })
> 
>     res.status(200).json({ sessionId })
>   } catch (error) {
>     res.status(500).json({ error: 'Internal Server Error' })
>   }
> }
> ```
> 
> ```js filename="pages/api/create-session.js" switcher
> import db from '../../lib/db'
> 
> export default async function handler(req, res) {
>   try {
>     const user = req.body
>     const sessionId = generateSessionId()
>     await db.insertSession({
>       sessionId,
>       userId: user.id,
>       createdAt: new Date(),
>     })
> 
>     res.status(200).json({ sessionId })
>   } catch (error) {
>     res.status(500).json({ error: 'Internal Server Error' })
>   }
> }
> ```

## Authorization

Once a user is authenticated and a session is created, you can implement authorization to control what the user can access and do within your application.

There are two main types of authorization checks:

1. **Optimistic**: Checks if the user is authorized to access a route or perform an action using the session data stored in the cookie. These checks are useful for quick operations, such as showing/hiding UI elements or redirecting users based on permissions or roles.
2. **Secure**: Checks if the user is authorized to access a route or perform an action using the session data stored in the database. These checks are more secure and are used for operations that require access to sensitive data or actions.

For both cases, we recommend:

- Creating a [Data Access Layer](#creating-a-data-access-layer-dal) to centralize your authorization logic
- Using [Data Transfer Objects (DTO)](#using-data-transfer-objects-dto) to only return the necessary data
- Optionally use [Proxy](#optimistic-checks-with-proxy-optional) to perform optimistic checks.

### Optimistic checks with Proxy (Optional)

There are some cases where you may want to use [Proxy](/docs/app/api-reference/file-conventions/proxy) and redirect users based on permissions:

- To perform optimistic checks. Since Proxy runs on every route, it's a good way to centralize redirect logic and pre-filter unauthorized users.
- To protect static routes that share data between users (e.g. content behind a paywall).

However, since Proxy runs on every route, including [prefetched](/docs/app/getting-started/linking-and-navigating#prefetching) routes, it's important to only read the session from the cookie (optimistic checks), and avoid database checks to prevent performance issues.

For example:

```tsx
// Archivo: proxy.ts switcher
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

```js
// Archivo: proxy.js switcher
import { NextResponse } from 'next/server'
import { decrypt } from '@/app/lib/session'
import { cookies } from 'next/headers'

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/signup', '/']

export default async function proxy(req) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  // 5. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  // 6. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}

// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
```

While Proxy can be useful for initial checks, it should not be your only line of defense in protecting your data. The majority of security checks should be performed as close as possible to your data source, see [Data Access Layer](#creating-a-data-access-layer-dal) for more information.

> **Tips**:
>
> - In Proxy, you can also read cookies using `req.cookies.get('session')?.value`.
> - Proxy uses the Node.js runtime, check if your Auth library and session management library are compatible.
> - You can use the `matcher` property in the Proxy to specify which routes Proxy should run on. Although, for auth, it's recommended Proxy runs on all routes.

### Creating a Data Access Layer (DAL)

We recommend creating a DAL to centralize your data requests and authorization logic.

The DAL should include a function that verifies the user's session as they interact with your application. At the very least, the function should check if the session is valid, then redirect or return the user information needed to make further requests.

For example, create a separate file for your DAL that includes a `verifySession()` function. Then use React's [cache](https://react.dev/reference/react/cache) API to memoize the return value of the function during a React render pass:

```tsx
// Archivo: app/lib/dal.ts switcher
import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session?.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId }
})
```

```js
// Archivo: app/lib/dal.js switcher
import 'server-only'

import { cookies } from 'next/headers'
import { decrypt } from '@/app/lib/session'

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)

  if (!session.userId) {
    redirect('/login')
  }

  return { isAuth: true, userId: session.userId }
})
```

You can then invoke the `verifySession()` function in your data requests, Server Actions, Route Handlers:

```tsx
// Archivo: app/lib/dal.ts switcher
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        name: true,
        email: true,
      },
    })

    const user = data[0]

    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})
```

```jsx
// Archivo: app/lib/dal.js switcher
export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const data = await db.query.users.findMany({
      where: eq(users.id, session.userId),
      // Explicitly return the columns you need rather than the whole user object
      columns: {
        id: true,
        name: true,
        email: true,
      },
    })

    const user = data[0]

    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})
```

> **Tip**:
>
> - A DAL can be used to protect data fetched at request time. However, for static routes that share data between users, data will be fetched at build time and not at request time. Use [Proxy](#optimistic-checks-with-proxy-optional) to protect static routes.
> - For secure checks, you can check if the session is valid by comparing the session ID with your database. Use React's [cache](https://react.dev/reference/react/cache) function to avoid unnecessary duplicate requests to the database during a render pass.
> - You may wish to consolidate related data requests in a JavaScript class that runs `verifySession()` before any methods.

### Using Data Transfer Objects (DTO)

When retrieving data, it's recommended you return only the necessary data that will be used in your application, and not entire objects. For example, if you're fetching user data, you might only return the user's ID and name, rather than the entire user object which could contain passwords, phone numbers, etc.

However, if you have no control over the returned data structure, or are working in a team where you want to avoid whole objects being passed to the client, you can use strategies such as specifying what fields are safe to be exposed to the client.

```tsx
// Archivo: app/lib/dto.ts switcher
import 'server-only'
import { getUser } from '@/app/lib/dal'

function canSeeUsername(viewer: User) {
  return true
}

function canSeePhoneNumber(viewer: User, team: string) {
  return viewer.isAdmin || team === viewer.team
}

export async function getProfileDTO(slug: string) {
  const data = await db.query.users.findMany({
    where: eq(users.slug, slug),
    // Return specific columns here
  })
  const user = data[0]

  const currentUser = await getUser(user.id)

  // Or return only what's specific to the query here
  return {
    username: canSeeUsername(currentUser) ? user.username : null,
    phonenumber: canSeePhoneNumber(currentUser, user.team)
      ? user.phonenumber
      : null,
  }
}
```

```js
// Archivo: app/lib/dto.js switcher
import 'server-only'
import { getUser } from '@/app/lib/dal'

function canSeeUsername(viewer) {
  return true
}

function canSeePhoneNumber(viewer, team) {
  return viewer.isAdmin || team === viewer.team
}

export async function getProfileDTO(slug) {
  const data = await db.query.users.findMany({
    where: eq(users.slug, slug),
    // Return specific columns here
  })
  const user = data[0]

  const currentUser = await getUser(user.id)

  // Or return only what's specific to the query here
  return {
    username: canSeeUsername(currentUser) ? user.username : null,
    phonenumber: canSeePhoneNumber(currentUser, user.team)
      ? user.phonenumber
      : null,
  }
}
```

By centralizing your data requests and authorization logic in a DAL and using DTOs, you can ensure that all data requests are secure and consistent, making it easier to maintain, audit, and debug as your application scales.

> **Good to know**:
>
> - There are a couple of different ways you can define a DTO, from using `toJSON()`, to individual functions like the example above, or JS classes. Since these are JavaScript patterns and not a React or Next.js feature, we recommend doing some research to find the best pattern for your application.
> - Learn more about security best practices in our [Security in Next.js article](/blog/security-nextjs-server-components-actions).

### Server Components

Auth check in [Server Components](/docs/app/getting-started/server-and-client-components) are useful for role-based access. For example, to conditionally render components based on the user's role:

```tsx
// Archivo: app/dashboard/page.tsx switcher
import { verifySession } from '@/app/lib/dal'

export default async function Dashboard() {
  const session = await verifySession()
  const userRole = session?.user?.role // Assuming 'role' is part of the session object

  if (userRole === 'admin') {
    return <AdminDashboard />
  } else if (userRole === 'user') {
    return <UserDashboard />
  } else {
    redirect('/login')
  }
}
```

```jsx
// Archivo: app/dashboard/page.jsx switcher
import { verifySession } from '@/app/lib/dal'

export default async function Dashboard() {
  const session = await verifySession()
  const userRole = session?.user?.role // Assuming 'role' is part of the session object

  if (userRole === 'admin') {
    return <AdminDashboard />
  } else if (userRole === 'user') {
    return <UserDashboard />
  } else {
    redirect('/login')
  }
}
```

In the example, we use the `verifySession()` function from our DAL to check for 'admin', 'user', and unauthorized roles. This pattern ensures that each user interacts only with components appropriate to their role.

### Layouts and auth checks

Due to [Partial Rendering](/docs/app/getting-started/linking-and-navigating#client-side-transitions), be cautious when doing checks in [Layouts](/docs/app/api-reference/file-conventions/layout) as these don't re-render on navigation, meaning the user session won't be checked on every route change.

A layout also does not control whether the rest of the route renders. Route segments and [parallel route slots](/docs/app/api-reference/file-conventions/parallel-routes#conditional-routes) are rendered by the router, so a layout that hides or swaps them does not stop them from running or from appearing in the [RSC Payload](/docs/app/glossary#rsc-payload).

Instead, you should do the checks close to your data source or the component that'll be conditionally rendered.

For example, consider a shared layout that fetches the user data and displays the user image in a nav. Instead of doing the auth check in the layout, you should fetch the user data (`getUser()`) in the layout and do the auth check in your [DAL](#creating-a-data-access-layer-dal).

This guarantees that wherever `getUser()` is called within your application, the auth check is performed, and prevents developers from forgetting to check that the user is authorized to access the data.

#### Auth and streaming

Session and user data often appear in shell UI (header, nav) that repeats across routes. A top-level `await` on `cookies()`, `headers()`, or the DAL in a layout delays the first streamed chunk for that segment and holds `{children}` behind that work.

If only part of the shell needs session data (for example, a user menu), move the `await` into a nested Server Component and wrap it in ``<Suspense>`` so the rest of the page streams first. See [Push dynamic access down](/docs/app/guides/streaming#push-dynamic-access-down) for the pattern.

Client Components can't import the DAL. Run `verifySession()`, `getUser()`, or similar in a parent Server Component, then pass data to client children as props or through a context provider. For that pattern, see [Using React's `use` within a Context Provider](/docs/app/guides/single-page-applications#using-reacts-use-within-a-context-provider), and use React's [`taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue) API to keep sensitive session fields from reaching the client.

#### Auth checks in page components

For example, in a dashboard page, you can verify the user session and fetch the user data:

```tsx
// Archivo: app/dashboard/page.tsx switcher
import { verifySession } from '@/app/lib/dal'

export default async function DashboardPage() {
  const session = await verifySession()

  // Fetch user-specific data from your database or data source
  const user = await getUserData(session.userId)

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      
    </div>
  )
}
```

```jsx
// Archivo: app/dashboard/page.jsx switcher
import { verifySession } from '@/app/lib/dal'

export default async function DashboardPage() {
  const session = await verifySession()

  // Fetch user-specific data from your database or data source
  const user = await getUserData(session.userId)

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      
    </div>
  )
}
```

#### Auth checks in leaf components

You can also perform auth checks in leaf components that conditionally render UI elements based on user permissions. For example, a component that displays admin-only actions:

```tsx
// Archivo: app/ui/admin-actions.tsx switcher
import { verifySession } from '@/app/lib/dal'

export default async function AdminActions() {
  const session = await verifySession()
  const userRole = session?.user?.role

  if (userRole !== 'admin') {
    return null
  }

  return (
    <div>
      <button>Delete User</button>
      <button>Edit Settings</button>
    </div>
  )
}
```

```jsx
// Archivo: app/ui/admin-actions.jsx switcher
import { verifySession } from '@/app/lib/dal'

export default async function AdminActions() {
  const session = await verifySession()
  const userRole = session?.user?.role

  if (userRole !== 'admin') {
    return null
  }

  return (
    <div>
      <button>Delete User</button>
      <button>Edit Settings</button>
    </div>
  )
}
```

This pattern allows you to show or hide UI elements based on user permissions while ensuring the auth check happens at render time in each component.

> **Good to know:**
>
> - A common pattern in SPAs is to `return null` in a layout or a top-level component if a user is not authorized. This pattern is **not recommended** since Next.js applications have multiple entry points, which will not prevent nested route segments and Server Actions from being accessed.
> - Ensure that any Server Actions called from these components also perform their own authorization checks, as client-side UI restrictions alone are not sufficient for security.

### Server Actions

Treat [Server Actions](/docs/app/guides/server-actions) with the same security considerations as public-facing API endpoints, and verify if the user is allowed to perform a mutation.

In the example below, we check the user's role before allowing the action to proceed:

```ts
// Archivo: app/lib/actions.ts switcher
'use server'
import { verifySession } from '@/app/lib/dal'

export async function serverAction(formData: FormData) {
  const session = await verifySession()
  const userRole = session?.user?.role

  // Return early if user is not authorized to perform the action
  if (userRole !== 'admin') {
    return null
  }

  // Proceed with the action for authorized users
}
```

```js
// Archivo: app/lib/actions.js switcher
'use server'
import { verifySession } from '@/app/lib/dal'

export async function serverAction() {
  const session = await verifySession()
  const userRole = session.user.role

  // Return early if user is not authorized to perform the action
  if (userRole !== 'admin') {
    return null
  }

  // Proceed with the action for authorized users
}
```

### Route Handlers

Treat [Route Handlers](/docs/app/api-reference/file-conventions/route) with the same security considerations as public-facing API endpoints, and verify if the user is allowed to access the Route Handler.

For example:

```ts
// Archivo: app/api/route.ts switcher
import { verifySession } from '@/app/lib/dal'

export async function GET() {
  // User authentication and role verification
  const session = await verifySession()

  // Check if the user is authenticated
  if (!session) {
    // User is not authenticated
    return new Response(null, { status: 401 })
  }

  // Check if the user has the 'admin' role
  if (session.user.role !== 'admin') {
    // User is authenticated but does not have the right permissions
    return new Response(null, { status: 403 })
  }

  // Continue for authorized users
}
```

```js
// Archivo: app/api/route.js switcher
import { verifySession } from '@/app/lib/dal'

export async function GET() {
  // User authentication and role verification
  const session = await verifySession()

  // Check if the user is authenticated
  if (!session) {
    // User is not authenticated
    return new Response(null, { status: 401 })
  }

  // Check if the user has the 'admin' role
  if (session.user.role !== 'admin') {
    // User is authenticated but does not have the right permissions
    return new Response(null, { status: 403 })
  }

  // Continue for authorized users
}
```

The example above demonstrates a Route Handler with a two-tier security check. It first checks for an active session, and then verifies if the logged-in user is an 'admin'.

> 📘 **Nota para Pages Router:**
> ### Creating a Data Access Layer (DAL)
> 
> #### Protecting API Routes
> 
> API Routes in Next.js are essential for handling server-side logic and data management. It's crucial to secure these routes to ensure that only authorized users can access specific functionalities. This typically involves verifying the user's authentication status and their role-based permissions.
> 
> Here's an example of securing an API Route:
> 
> ```ts filename="pages/api/route.ts" switcher
> import { NextApiRequest, NextApiResponse } from 'next'
> 
> export default async function handler(
>   req: NextApiRequest,
>   res: NextApiResponse
> ) {
>   const session = await getSession(req)
> 
>   // Check if the user is authenticated
>   if (!session) {
>     res.status(401).json({
>       error: 'User is not authenticated',
>     })
>     return
>   }
> 
>   // Check if the user has the 'admin' role
>   if (session.user.role !== 'admin') {
>     res.status(401).json({
>       error: 'Unauthorized access: User does not have admin privileges.',
>     })
>     return
>   }
> 
>   // Proceed with the route for authorized users
>   // ... implementation of the API Route
> }
> ```
> 
> ```js filename="pages/api/route.js" switcher
> export default async function handler(req, res) {
>   const session = await getSession(req)
> 
>   // Check if the user is authenticated
>   if (!session) {
>     res.status(401).json({
>       error: 'User is not authenticated',
>     })
>     return
>   }
> 
>   // Check if the user has the 'admin' role
>   if (session.user.role !== 'admin') {
>     res.status(401).json({
>       error: 'Unauthorized access: User does not have admin privileges.',
>     })
>     return
>   }
> 
>   // Proceed with the route for authorized users
>   // ... implementation of the API Route
> }
> ```
> 
> This example demonstrates an API Route with a two-tier security check for authentication and authorization. It first checks for an active session, and then verifies if the logged-in user is an 'admin'. This approach ensures secure access, limited to authenticated and authorized users, maintaining robust security for request processing.

## Resources

Now that you've learned about authentication in Next.js, here are Next.js-compatible libraries and resources to help you implement secure authentication and session management:

### Auth Libraries

- [Auth0](https://auth0.com/docs/quickstart/webapp/nextjs)
- [Better Auth](https://www.better-auth.com/docs/integrations/next)
- [Clerk](https://clerk.com/docs/quickstarts/nextjs)
- [Descope](https://docs.descope.com/getting-started/nextjs)
- [Kinde](https://kinde.com/docs/developer-tools/nextjs-sdk)
- [Logto](https://docs.logto.io/quick-starts/next-app-router)
- [NextAuth.js](https://authjs.dev/getting-started/installation?framework=next.js)
- [Ory](https://www.ory.sh/docs/getting-started/integrate-auth/nextjs)
- [Stack Auth](https://docs.stack-auth.com/getting-started/setup)
- [Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Stytch](https://stytch.com/docs/guides/quickstarts/nextjs)
- [WorkOS](https://workos.com/docs/user-management/nextjs)

### Session Management Libraries

- [Iron Session](https://github.com/vvo/iron-session)
- [Jose](https://github.com/panva/jose)

## Further Reading

To continue learning about authentication and security, check out the following resources:

- [How to think about security in Next.js](/blog/security-nextjs-server-components-actions)
- [Understanding XSS Attacks](https://vercel.com/guides/understanding-xss-attacks)
- [Understanding CSRF Attacks](https://vercel.com/guides/understanding-csrf-attacks)
- [The Copenhagen Book](https://thecopenhagenbook.com/)



[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-a-content-security-policy-csp-for-your-nextjs-application"></a>

## How to set a Content Security Policy (CSP) for your Next.js application

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/content-security-policy](https://nextjs.org/docs/app/guides/content-security-policy)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to set a Content Security Policy (CSP) for your Next.js application.*  

---

[Content Security Policy (CSP)](https://developer.mozilla.org/docs/Web/HTTP/CSP) is important to guard your Next.js application against various security threats such as cross-site scripting (XSS), clickjacking, and other code injection attacks.

By using CSP, developers can specify which origins are permissible for content sources, scripts, stylesheets, images, fonts, objects, media (audio, video), iframes, and more.

<details>
  <summary>Examples</summary>

- [Strict CSP](https://github.com/vercel/next.js/tree/canary/examples/with-strict-csp)

</details>

## Nonces

A [nonce](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/nonce) is a unique, random string of characters created for a one-time use. It is used in conjunction with CSP to selectively allow certain inline scripts or styles to execute, bypassing strict CSP directives.

### Why use a nonce?

CSP can block both inline and external scripts to prevent attacks. A nonce lets you safely allow specific scripts to run—only if they include the matching nonce value.

If an attacker wanted to load a script into your page, they'd need to guess the nonce value. That's why the nonce must be unpredictable and unique for every request.

### Adding a nonce with Proxy

[Proxy](/docs/app/api-reference/file-conventions/proxy) enables you to add headers and generate nonces before the page renders.

Every time a page is viewed, a fresh nonce should be generated. This means that you **must use [dynamic rendering](/docs/app/glossary#dynamic-rendering) to add nonces**.

For example:

> **Good to know**: In development, `'unsafe-eval'` is required because React uses `eval` to provide enhanced debugging information, such as reconstructing server-side error stacks in the browser. `unsafe-eval` is not required for production. Neither React nor Next.js use `eval` in production by default.

```ts
// Archivo: proxy.ts switcher
import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  return response
}
```

```js
// Archivo: proxy.js switcher
import { NextResponse } from 'next/server'

export function proxy(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'nonce-${nonce}';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, ' ')
    .trim()

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)
  requestHeaders.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
  response.headers.set(
    'Content-Security-Policy',
    contentSecurityPolicyHeaderValue
  )

  return response
}
```

By default, Proxy runs on all requests. You can filter Proxy to run on specific paths using a [`matcher`](/docs/app/api-reference/file-conventions/proxy#matcher).

We recommend ignoring matching prefetches (from `next/link`) and static assets that don't need the CSP header.

```ts
// Archivo: proxy.ts switcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

```js
// Archivo: proxy.js switcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
```

### How nonces work in Next.js

To use a nonce, your page must be **dynamically rendered**. This is because Next.js applies nonces during **server-side rendering**, based on the CSP header present in the request. Static pages are generated at build time, when no request or response headers exist—so no nonce can be injected.

Here’s how nonce support works in a dynamically rendered page:

1. **Proxy generates a nonce**: Your proxy creates a unique nonce for the request, adds it to your `Content-Security-Policy` header, and also sets it in a custom `x-nonce` header.
2. **Next.js extracts the nonce**: During rendering, Next.js parses the `Content-Security-Policy` header and extracts the nonce using the `'nonce-{value}'` pattern.
3. **Nonce is applied automatically**: Next.js attaches the nonce to:
   - Framework scripts (React, Next.js runtime)
   - Page-specific JavaScript bundles
   - Inline styles and scripts generated by Next.js
   - Any `<Script>` components using the `nonce` prop

Because of this automatic behavior, you don’t need to manually add a nonce to each tag.

### Forcing dynamic rendering

If you're using nonces, you may need to explicitly opt pages into dynamic rendering:

```tsx
// Archivo: app/page.tsx switcher
import { connection } from 'next/server'

export default async function Page() {
  // wait for an incoming request to render this page
  await connection()
  // Your page content
}
```

```jsx
// Archivo: app/page.jsx switcher
import { connection } from 'next/server'

export default async function Page() {
  // wait for an incoming request to render this page
  await connection()
  // Your page content
}
```

### Reading the nonce

> 📘 **Nota para Pages Router:**
> You can provide the nonce to your page using
>   [`getServerSideProps`](/docs/pages/building-your-application/data-fetching/get-server-side-props):
> 
> ```tsx filename="pages/index.tsx" switcher
> import Script from 'next/script'
> 
> import type { GetServerSideProps } from 'next'
> 
> export default function Page({ nonce }) {
>   return (
>     <Script
>       src="https://www.googletagmanager.com/gtag/js"
>       strategy="afterInteractive"
>       nonce={nonce}
>     />
>   )
> }
> 
> export const getServerSideProps: GetServerSideProps = async ({ req }) => {
>   const nonce = req.headers['x-nonce']
>   return { props: { nonce } }
> }
> ```
> 
> ```jsx filename="pages/index.jsx" switcher
> import Script from 'next/script'
> export default function Page({ nonce }) {
>   return (
>     <Script
>       src="https://www.googletagmanager.com/gtag/js"
>       strategy="afterInteractive"
>       nonce={nonce}
>     />
>   )
> }
> 
> export async function getServerSideProps({ req }) {
>   const nonce = req.headers['x-nonce']
>   return { props: { nonce } }
> }
> ```
> 
> You can also access the nonce in `_document.tsx` for Pages Router applications:
> 
> ```tsx filename="pages/_document.tsx" switcher
> import Document, {
>   Html,
>   Head,
>   Main,
>   NextScript,
>   DocumentContext,
>   DocumentInitialProps,
> } from 'next/document'
> 
> interface ExtendedDocumentProps extends DocumentInitialProps {
>   nonce?: string
> }
> 
> class MyDocument extends Document<ExtendedDocumentProps> {
>   static async getInitialProps(
>     ctx: DocumentContext
>   ): Promise<ExtendedDocumentProps> {
>     const initialProps = await Document.getInitialProps(ctx)
>     const nonce = ctx.req?.headers?.['x-nonce'] as string | undefined
> 
>     return {
>       ...initialProps,
>       nonce,
>     }
>   }
> 
>   render() {
>     const { nonce } = this.props
> 
>     return (
>       <Html lang="en">
>         <Head nonce={nonce} />
>         <body>
>           <Main />
>           <NextScript nonce={nonce} />
>         </body>
>       </Html>
>     )
>   }
> }
> 
> export default MyDocument
> ```
> 
> ```jsx filename="pages/_document.jsx" switcher
> import Document, { Html, Head, Main, NextScript } from 'next/document'
> 
> class MyDocument extends Document {
>   static async getInitialProps(ctx) {
>     const initialProps = await Document.getInitialProps(ctx)
>     const nonce = ctx.req?.headers?.['x-nonce']
> 
>     return {
>       ...initialProps,
>       nonce,
>     }
>   }
> 
>   render() {
>     const { nonce } = this.props
> 
>     return (
>       <Html lang="en">
>         <Head nonce={nonce} />
>         <body>
>           <Main />
>           <NextScript nonce={nonce} />
>         </body>
>       </Html>
>     )
>   }
> }
> 
> export default MyDocument
> ```

You can read the nonce from a [Server Component](/docs/app/getting-started/server-and-client-components) using [`headers`](/docs/app/api-reference/functions/headers):

```tsx
// Archivo: app/page.tsx switcher
import { headers } from 'next/headers'
import Script from 'next/script'

export default async function Page() {
  const nonce = (await headers()).get('x-nonce')

  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js"
      strategy="afterInteractive"
      nonce={nonce}
    />
  )
}
```

```jsx
// Archivo: app/page.jsx switcher
import { headers } from 'next/headers'
import Script from 'next/script'

export default async function Page() {
  const nonce = (await headers()).get('x-nonce')

  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js"
      strategy="afterInteractive"
      nonce={nonce}
    />
  )
}
```

## Static vs Dynamic Rendering with CSP

Using nonces has important implications for how your Next.js application renders:

### Dynamic Rendering Requirement

When you use nonces in your CSP, **all pages must be dynamically rendered**. This means:

- Pages will build successfully but may encounter runtime errors if not properly configured for dynamic rendering
- Each request generates a fresh page with a new nonce
- Static optimization and Incremental Static Regeneration (ISR) are disabled
- Pages cannot be cached by CDNs without additional configuration
- **Partial Prerendering (PPR) is incompatible** with nonce-based CSP since static shell scripts won't have access to the nonce

### Performance Implications

The shift from static to dynamic rendering affects performance:

- **Slower initial page loads**: Pages must be generated on each request
- **Increased server load**: Every request requires server-side rendering
- **No CDN caching**: Dynamic pages cannot be cached at the edge by default
- **Higher hosting costs**: More server resources needed for dynamic rendering

### When to use nonces

Consider nonces when:

- You have strict security requirements that prohibit `'unsafe-inline'`
- Your application handles sensitive data
- You need to allow specific inline scripts while blocking others
- Compliance requirements mandate strict CSP

## Without Nonces

For applications that do not require nonces, you can set the CSP header directly in your [`next.config.js`](/docs/app/api-reference/config/next-config-js) file:

```js
// Archivo: next.config.js
const isDev = process.env.NODE_ENV === 'development'

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}
```

## Subresource Integrity (Experimental)

As an alternative to nonces, Next.js offers experimental support for hash-based CSP using Subresource Integrity (SRI). This approach allows you to maintain static generation while still having a strict CSP.

> **Good to know**: This feature is experimental and available in App Router applications.

### How SRI works

Instead of using nonces, SRI generates cryptographic hashes of your JavaScript files at build time. These hashes are added as `integrity` attributes to script tags, allowing browsers to verify that files haven't been modified during transit.

### Enabling SRI

Add the experimental SRI configuration to your `next.config.js`:

```js
// Archivo: next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    sri: {
      algorithm: 'sha256', // or 'sha384' or 'sha512'
    },
  },
}

module.exports = nextConfig
```

### CSP configuration with SRI

When SRI is enabled, you can continue using your existing CSP policies. SRI works independently by adding `integrity` attributes to your assets:

> **Good to know**: For dynamic rendering scenarios, you can still generate nonces with proxy if needed, combining both SRI integrity attributes and nonce-based CSP approaches.

```js
// Archivo: next.config.js
const isDev = process.env.NODE_ENV === 'development'

const cspHeader = `
    default-src 'self';
    script-src 'self'${isDev ? " 'unsafe-eval'" : ''};
    style-src 'self';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

module.exports = {
  experimental: {
    sri: {
      algorithm: 'sha256',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\n/g, ''),
          },
        ],
      },
    ]
  },
}
```

### Benefits of SRI over nonces

- **Static generation**: Pages can be statically generated and cached
- **CDN compatibility**: Static pages work with CDN caching
- **Better performance**: No server-side rendering required for each request
- **Build-time security**: Hashes are generated at build time, ensuring integrity

### Limitations of SRI

- **Experimental**: Feature may change or be removed
- **App Router only**: Not supported in Pages Router
- **Build-time only**: Cannot handle dynamically generated scripts

## Development vs Production Considerations

CSP implementation differs between development and production environments:

### Development Environment

In development, you will need to enable `'unsafe-eval'` because React uses `eval` to provide enhanced debugging information, such as reconstructing server-side error stacks in the browser to show you where errors originated on the server:

```ts
// Archivo: proxy.ts switcher
export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''};
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`};
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

  // Rest of proxy implementation
}
```

```js
// Archivo: proxy.js switcher
export function proxy(request) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const isDev = process.env.NODE_ENV === 'development'

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ''};
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`};
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`

  // Rest of proxy implementation
}
```

### Production Deployment

Common issues in production:

- **Nonce not applied**: Ensure your proxy runs on all necessary routes
- **Static assets blocked**: Verify your CSP allows Next.js static assets
- **Third-party scripts**: Add necessary domains to your CSP policy

## Troubleshooting

### Third-party Scripts

When using third-party scripts with CSP:

```tsx
// Archivo: app/layout.tsx switcher
import { GoogleTagManager } from '@next/third-parties/google'
import { headers } from 'next/headers'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = (await headers()).get('x-nonce')

  return (
    <html lang="en">
      <body>
        {children}
        <GoogleTagManager gtmId="GTM-XYZ" nonce={nonce} />
      </body>
    </html>
  )
}
```

```jsx
// Archivo: app/layout.jsx switcher
import { GoogleTagManager } from '@next/third-parties/google'
import { headers } from 'next/headers'

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get('x-nonce')

  return (
    <html lang="en">
      <body>
        {children}
        <GoogleTagManager gtmId="GTM-XYZ" nonce={nonce} />
      </body>
    </html>
  )
}
```

> 📘 **Nota para Pages Router:**
> When using third-party scripts with CSP, ensure you add the necessary domains and pass the nonce:
> 
> ```tsx filename="pages/_app.tsx" switcher
> import type { AppProps } from 'next/app'
> import Script from 'next/script'
> 
> export default function App({ Component, pageProps }: AppProps) {
>   const nonce = pageProps.nonce
> 
>   return (
>     <>
>       <Component {...pageProps} />
>       <Script
>         src="https://www.googletagmanager.com/gtag/js"
>         strategy="afterInteractive"
>         nonce={nonce}
>       />
>     </>
>   )
> }
> ```
> 
> ```jsx filename="pages/_app.jsx" switcher
> import Script from 'next/script'
> 
> export default function App({ Component, pageProps }) {
>   const nonce = pageProps.nonce
> 
>   return (
>     <>
>       <Component {...pageProps} />
>       <Script
>         src="https://www.googletagmanager.com/gtag/js"
>         strategy="afterInteractive"
>         nonce={nonce}
>       />
>     </>
>   )
> }
> ```

Update your CSP to allow third-party domains:

```ts
// Archivo: proxy.ts switcher
const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com;
  connect-src 'self' https://www.google-analytics.com;
  img-src 'self' data: https://www.google-analytics.com;
`
```

```js
// Archivo: proxy.js switcher
const cspHeader = `
  default-src 'self';
  script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://www.googletagmanager.com;
  connect-src 'self' https://www.google-analytics.com;
  img-src 'self' data: https://www.google-analytics.com;
`
```

### Common CSP Violations

1. **Inline styles**: Use CSS-in-JS libraries that support nonces or move styles to external files
2. **Dynamic imports**: Ensure dynamic imports are allowed in your script-src policy
3. **WebAssembly**: Add `'wasm-unsafe-eval'` if using WebAssembly
4. **Service workers**: Add appropriate policies for service worker scripts

## Version History

| Version    | Changes                                                       |
| ---------- | ------------------------------------------------------------- |
| `v14.0.0`  | Experimental SRI support added for hash-based CSP             |
| `v13.4.20` | Recommended for proper nonce handling and CSP header parsing. |



[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-think-about-data-security-in-nextjs"></a>

## How to think about data security in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/data-security](https://nextjs.org/docs/app/guides/data-security)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn the built-in data security features in Next.js and learn best practices for protecting your application's data.*  

---

[React Server Components](https://react.dev/reference/rsc/server-components) improve performance and simplify data fetching, but also shift where and how data is accessed, changing some of the traditional security assumptions for handling data in frontend apps.

This guide will help you understand how to think about data security in Next.js and how to implement best practices.

## Data fetching approaches

There are three main approaches we recommend for fetching data in Next.js, depending on the size and age of your project:

- [HTTP APIs](#external-http-apis): for existing large applications and organizations.
- [Data Access Layer](#data-access-layer): for new projects.
- [Component-Level Data Access](#component-level-data-access): for prototypes and learning.

We recommend choosing one data fetching approach and avoiding mixing them. This makes it clear for both developers working in your code base and security auditors what to expect.

### External HTTP APIs

You should follow a **Zero Trust** model when adopting Server Components in an existing project. You can continue calling your existing API endpoints such as REST or GraphQL from Server Components using [`fetch`](/docs/app/api-reference/functions/fetch), just as you would in Client Components.

```tsx
// Archivo: app/page.tsx
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('AUTH_TOKEN')?.value

  const res = await fetch('https://api.example.com/profile', {
    headers: {
      Cookie: `AUTH_TOKEN=${token}`,
      // Other headers
    },
  })

  // ....
}
```

This approach works well when:

- You already have security practices in place.
- Separate backend teams use other languages or manage APIs independently.

### Data Access Layer

For new projects, we recommend creating a dedicated **Data Access Layer (DAL)**. This is an internal library that controls how and when data is fetched, and what gets passed to your render context.

A Data Access Layer should:

- Only run on the server.
- Perform authorization checks.
- Return safe, minimal **Data Transfer Objects (DTOs)**.

This approach centralizes all data access logic, making it easier to enforce consistent data access and reduces the risk of authorization bugs. You also get the benefit of sharing an in-memory cache across different parts of a request.

```ts
// Archivo: data/auth.ts
import { cache } from 'react'
import { cookies } from 'next/headers'

// Cached helper methods makes it easy to get the same value in many places
// without manually passing it around. This discourages passing it from Server
// Component to Server Component which minimizes risk of passing it to a Client
// Component.
export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('AUTH_TOKEN')
  const decodedToken = await decryptAndValidate(token)
  // Don't include secret tokens or private information as public fields.
  // Use classes to avoid accidentally passing the whole object to the client.
  return new User(decodedToken.id)
})
```

```tsx
// Archivo: data/user-dto.tsx
import 'server-only'
import { getCurrentUser } from './auth'

function canSeeUsername(viewer: User) {
  // Public info for now, but can change
  return true
}

function canSeePhoneNumber(viewer: User, team: string) {
  // Privacy rules
  return viewer.isAdmin || team === viewer.team
}

export async function getProfileDTO(slug: string) {
  // Don't pass values, read back cached values, also solves context and easier to make it lazy

  // use a database API that supports safe templating of queries
  const [rows] = await sql`SELECT * FROM user WHERE slug = ${slug}`
  const userData = rows[0]

  const currentUser = await getCurrentUser()

  // only return the data relevant for this query and not everything
  // <https://www.w3.org/2001/tag/doc/APIMinimization>
  return {
    username: canSeeUsername(currentUser) ? userData.username : null,
    phonenumber: canSeePhoneNumber(currentUser, userData.team)
      ? userData.phonenumber
      : null,
  }
}
```

```tsx
// Archivo: app/page.tsx
import { getProfileDTO } from '../../data/user-dto'

export default async function Page({ params }) {
  const { slug } = await params
  // This page can now safely pass around this profile knowing
  // that it shouldn't contain anything sensitive.
  const profile = await getProfileDTO(slug)
  ...
}
```

> **Good to know:** Secret keys should be stored in environment variables, but only the Data Access Layer should access `process.env`. This keeps secrets from being exposed to other parts of the application.

### Component-level data access

For quick prototypes and iteration, database queries can be placed directly in Server Components.

This approach, however, makes it easier to accidentally expose private data to the client, for example:

```tsx
// Archivo: app/page.tsx
import Profile from './components/profile.tsx'

export default async function Page({ params }) {
  const { slug } = await params
  const [rows] = await sql`SELECT * FROM user WHERE slug = ${slug}`
  const userData = rows[0]
  // EXPOSED: This exposes all the fields in userData to the client because
  // we are passing the data from the Server Component to the Client.
  return <Profile user={userData} />
}
```

```tsx
// Archivo: app/ui/profile.tsx
'use client'

// BAD: This is a bad props interface because it accepts way more data than the
// Client Component needs and it encourages server components to pass all that
// data down. A better solution would be to accept a limited object with just
// the fields necessary for rendering the profile.
export default async function Profile({ user }: { user: User }) {
  return (
    <div>
      <h1>{user.name}</h1>
      ...
    </div>
  )
}
```

You should sanitize the data before passing it to the Client Component:

```ts
// Archivo: data/user.ts
import { sql } from './db'

export async function getUser(slug: string) {
  const [rows] = await sql`SELECT * FROM user WHERE slug = ${slug}`
  const user = rows[0]

  // Return only the public fields
  return {
    name: user.name,
  }
}
```

```tsx
// Archivo: app/page.tsx
import { getUser } from '../data/user'
import Profile from './ui/profile'

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const publicProfile = await getUser(slug)
  return <Profile user={publicProfile} />
}
```

## Reading data

### Passing data from server to client

On the initial load, both Server and Client Components run on the server to generate HTML. However, they execute in isolated module systems. This ensures that Server Components can access private data and APIs, while Client Components cannot.

**Server Components:**

- Run only on the server.
- Can safely access environment variables, secrets, databases, and internal APIs.

**Client Components:**

- Run on the server during prerendering, but must follow the same security assumptions as code running in the browser.
- Must not access privileged data or server-only modules.

This ensures the app is secure by default, but it's possible to accidentally expose private data through how data is fetched or passed to components.

### Tainting

To prevent accidental exposure of private data to the client, you can use React Taint APIs:

- [`experimental_taintObjectReference`](https://react.dev/reference/react/experimental_taintObjectReference) for data objects.
- [`experimental_taintUniqueValue`](https://react.dev/reference/react/experimental_taintUniqueValue) for specific values.

You can enable usage in your Next.js app with the [`experimental.taint`](/docs/app/api-reference/config/next-config-js/taint) option in `next.config.js`:

```js
// Archivo: next.config.js
module.exports = {
  experimental: {
    taint: true,
  },
}
```

This prevents the tainted objects or values from being passed to the client. However, it's an additional layer of protection, you should still filter and sanitize the data in your [DAL](#data-access-layer) before passing it to React's render context.

> **Good to know:**
>
> - By default, environment variables are only available on the Server. Next.js exposes any environment variable prefixed with `NEXT_PUBLIC_` to the client. [Learn more](/docs/app/guides/environment-variables).
> - Functions and classes are already blocked from being passed to Client Components by default.

### Preventing client-side execution of server-only code

To prevent server-only code from being executed on the client, you can mark a module with the [`server-only`](https://www.npmjs.com/package/server-only) package:

```ts
// Archivo: lib/data.ts
import 'server-only'

//...
```

This ensures that proprietary code or internal business logic stays on the server by causing a build error if the module is imported in the client environment.

Next.js handles `server-only` imports internally. The contents of these packages from NPM are not used. However, if your linting rules flag extraneous dependencies, you may install them to avoid issues.

```bash
# Manejador de paquetes: npm
npm install server-only
```

```bash
# Manejador de paquetes: yarn
yarn add server-only
```

```bash
# Manejador de paquetes: pnpm
pnpm add server-only
```

```bash
# Manejador de paquetes: bun
bun add server-only
```

Read more about `server-only` in the [preventing environment poisoning](/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning) section.

## Mutating Data

Next.js handles mutations with [Server Actions](https://react.dev/reference/rsc/server-functions).

### Built-in Server Actions Security features

By default, when a Server Action is created and exported, it is reachable via a direct POST request, not just through your application's UI. This means, even if a Server Action or utility function is not imported elsewhere in your code, it can still be called externally.

To improve security, Next.js has the following built-in features:

- **Secure action IDs:** Next.js creates encrypted, non-deterministic IDs to allow the client to reference and call the Server Action. These IDs are periodically recalculated between builds for enhanced security.
- **Dead code elimination:** Unused Server Actions (referenced by their IDs) are removed from client bundle to avoid public access.

> **Good to know**:
>
> The IDs are created during compilation and are cached for a maximum of 14 days. They will be regenerated when a new build is initiated or when the build cache is invalidated.
> This security improvement reduces the risk in cases where an authentication layer is missing. However, you should still treat Server Actions as reachable via direct POST requests and verify authentication and authorization inside each one.

```jsx
// app/actions.js
'use server'

// If this action **is** used in our application, Next.js
// will create a secure ID to allow the client to reference
// and call the Server Action.
export async function updateUserAction(formData) {}

// If this action **is not** used in our application, Next.js
// will automatically remove this code during `next build`
// and will not create a public endpoint.
export async function deleteUserAction(formData) {}
```

### Validating client input

You should always validate input from client, as they can be easily modified. For example, form data, URL parameters, headers, and searchParams:

```tsx
// Archivo: app/page.tsx
// BAD: Trusting searchParams directly
export default async function Page({ searchParams }) {
  const isAdmin = (await searchParams).isAdmin
  if (isAdmin === 'true') {
    // Vulnerable: relies on untrusted client data
    return <AdminPanel />
  }
}

// GOOD: Re-verify every time
import { cookies } from 'next/headers'
import { verifyAdmin } from './auth'

export default async function Page() {
  const cookieStore = await cookies()
  const token = cookieStore.get('AUTH_TOKEN')
  const isAdmin = await verifyAdmin(token)

  if (isAdmin) {
    return <AdminPanel />
  }
}
```

### Authentication and authorization

A page-level authentication check does not extend to the Server Actions defined within it. Always re-verify inside the action:

```tsx
// Archivo: app/admin/page.tsx highlight={13,14,15,16}
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    redirect('/login')
  }

  return (
    <form
      action={async () => {
        'use server'
        const session = await auth()
        if (!session?.user?.isAdmin) {
          throw new Error('Unauthorized')
        }
        await db.record.deleteMany()
      }}
    >
      <button>Delete Records</button>
    </form>
  )
}
```

The highlighted `auth()` check inside the action is critical. The page-level redirect on line 6 controls which UI is rendered, but the Server Action is a separate entry point and must verify the caller on its own.

Beyond authentication (is the user logged in?), remember to check **authorization** (does this user have permission to act on this specific resource?). This prevents [Insecure Direct Object Reference (IDOR)](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html) vulnerabilities:

```tsx
// Archivo: app/actions.ts
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function deletePost(postId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const post = await db.post.findUnique({ where: { id: postId } })

  // Check that the user owns this resource
  if (post.authorId !== session.user.id) {
    throw new Error('Forbidden')
  }

  await db.post.delete({ where: { id: postId } })
}
```

Learn more about [Authentication](/docs/app/guides/authentication) in Next.js.

### Using a Data Access Layer for mutations

Just as we recommend a [Data Access Layer](#data-access-layer) for reading data, you can apply the same pattern to mutations. This keeps authentication, authorization, and database logic in a dedicated `server-only` module, while `"use server"` actions stay thin.

```ts
// Archivo: data/posts.ts
import 'server-only'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

export async function deletePost(postId: string) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const post = await db.post.findUnique({ where: { id: postId } })

  if (post.authorId !== session.user.id) {
    throw new Error('Forbidden')
  }

  await db.post.delete({ where: { id: postId } })
}
```

The `"use server"` action then delegates to the DAL:

```ts
// Archivo: app/actions.ts
'use server'

import { deletePost } from '@/data/posts'
import { revalidatePath } from 'next/cache'

export async function deletePostAction(postId: string) {
  await deletePost(postId) // Auth + authz happen inside the DAL
  revalidatePath('/posts')
}
```

> **Good to know:** You can use `import 'server-only'` in both the Data Access Layer and the `"use server"` file itself. Both work when the action is imported into a Client Component (for example, to pass it to `useActionState`), because `"use server"` modules are resolved in a server-only webpack layer.

### Controlling return values

Server Action return values are serialized and sent to the client. Only return what the UI needs, not raw database records.

```tsx
// Archivo: app/actions.ts
'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// BAD: Returns the full database record, which may include
// internal fields the client should not see.
export async function updateUser(data: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  return db.user.update({
    where: { id: session.user.id },
    data: { name: data.get('name') as string },
  })
}

// GOOD: Returns only what the client needs.
export async function updateUserSafe(data: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }
  await db.user.update({
    where: { id: session.user.id },
    data: { name: data.get('name') as string },
  })
  return { success: true }
}
```

### Rate limiting

For expensive operations (sending emails, writing to a database), consider adding rate limiting to prevent abuse. See the [Rate limiting](/docs/app/guides/backend-for-frontend#rate-limiting) example in the Backend for Frontend guide.

### Closures and encryption

Defining a Server Action inside a component creates a [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures) where the action has access to the outer function's scope. For example, the `publish` action has access to the `publishVersion` variable:

```tsx
// Archivo: app/page.tsx switcher
export default async function Page() {
  const publishVersion = await getLatestVersion();

  async function publish() {
    "use server";
    if (publishVersion !== await getLatestVersion()) {
      throw new Error('The version has changed since pressing publish');
    }
    ...
  }

  return (
    <form>
      <button formAction={publish}>Publish</button>
    </form>
  );
}
```

```jsx
// Archivo: app/page.js switcher
export default async function Page() {
  const publishVersion = await getLatestVersion();

  async function publish() {
    "use server";
    if (publishVersion !== await getLatestVersion()) {
      throw new Error('The version has changed since pressing publish');
    }
    ...
  }

  return (
    <form>
      <button formAction={publish}>Publish</button>
    </form>
  );
}
```

Closures are useful when you need to capture a _snapshot_ of data (e.g. `publishVersion`) at the time of rendering so that it can be used later when the action is invoked.

However, for this to happen, the captured variables are sent to the client and back to the server when the action is invoked. To prevent sensitive data from being exposed to the client, Next.js automatically encrypts the closed-over variables. A new private key is generated for each action every time a Next.js application is built. This means actions can only be invoked for a specific build.

> **Good to know:** We don't recommend relying on encryption alone to prevent sensitive values from being exposed on the client.

### Overwriting encryption keys (advanced)

When **self-hosting** your Next.js application across multiple servers, each server instance may end up with a different encryption key, leading to potential inconsistencies.

To mitigate this, you can overwrite the encryption key using the `process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` environment variable. Specifying this variable ensures that your encryption keys are persistent across builds, and all server instances use the same key.

The key must be a base64-encoded value whose decoded length matches a valid AES key size (16, 24, or 32 bytes). Next.js generates 32-byte keys by default. You can generate a compatible key using your platform’s cryptographic tools, for example:

```bash
openssl rand -base64 32
```

This is an advanced use case where consistent encryption behavior across multiple deployments is critical for your application. Follow standard security practices such as key rotation and signing. See the [Self-Hosting guide](/docs/app/guides/self-hosting#server-functions-encryption-key) for deployment-specific considerations.

### Allowed origins (advanced)

Since Server Actions can be invoked in a `<form>` element, this opens them up to [CSRF attacks](https://developer.mozilla.org/en-US/docs/Glossary/CSRF).

Behind the scenes, Server Actions use the `POST` method, and only this HTTP method is allowed to invoke them. This prevents most CSRF vulnerabilities in modern browsers, particularly with [SameSite cookies](https://web.dev/articles/samesite-cookies-explained) being the default.

As an additional protection, Server Actions in Next.js also compare the [Origin header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin) to the [Host header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Host) (or `X-Forwarded-Host`). If these don't match, the request will be aborted. In other words, Server Actions can only be invoked on the same host as the page that hosts it.

For large applications that use reverse proxies or multi-layered backend architectures (where the server API differs from the production domain), it's recommended to use the configuration option [`serverActions.allowedOrigins`](/docs/app/api-reference/config/next-config-js/serverActions) option to specify a list of safe origins. The option accepts an array of strings.

```js
// Archivo: next.config.js
/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      allowedOrigins: ['my-proxy.com', '*.my-proxy.com'],
    },
  },
}
```

Learn more about [Security and Server Actions](https://nextjs.org/blog/security-nextjs-server-components-actions).

### Avoiding side-effects during rendering

Mutations (e.g. logging out users, updating databases, invalidating caches) should never be a side-effect, either in Server or Client Components. Next.js explicitly prevents setting cookies or triggering cache revalidation within render methods to avoid unintended side effects.

```tsx
// Archivo: app/page.tsx
// BAD: Triggering a mutation during rendering
export default async function Page({ searchParams }) {
  if ((await searchParams).logout) {
    const cookieStore = await cookies()
    cookieStore.delete('AUTH_TOKEN')
  }

  return <UserProfile />
}
```

Instead, you should use Server Actions to handle mutations.

```tsx
// Archivo: app/page.tsx
// GOOD: Using Server Actions to handle mutations
import { logout } from './actions'

export default function Page() {
  return (
    <>
      <UserProfile />
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
    </>
  )
}
```

> **Good to know:** Next.js uses `POST` requests to handle mutations. This prevents accidental side-effects from GET requests, reducing Cross-Site Request Forgery (CSRF) risks.

## Auditing

If you're doing an audit of a Next.js project, here are a few things we recommend looking extra at:

- **Data Access Layer:** Is there an established practice for an isolated Data Access Layer? Verify that database packages and environment variables are not imported outside the Data Access Layer.
- **`"use client"` files:** Are the Component props expecting private data? Are the type signatures overly broad?
- **`"use server"` files:** Are the Action arguments validated in the action or inside the Data Access Layer? Is the user re-authorized inside the action? Does the action check ownership of the resource (authorization, not just authentication)? Are return values filtered to only what the client needs? Is database access delegated to a `server-only` Data Access Layer?
- **`/[param]/.`** Folders with brackets are user input. Are params validated?
- **`proxy.ts` and `route.ts`:** Have a lot of power. Spend extra time auditing these using traditional techniques. Perform Penetration Testing or Vulnerability Scanning regularly or in alignment with your team's software development lifecycle.



[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-use-environment-variables-in-nextjs"></a>

## How to use environment variables in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/environment-variables](https://nextjs.org/docs/app/guides/environment-variables)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn to add and access environment variables in your Next.js application.*  

---

Next.js comes with built-in support for environment variables, which allows you to do the following:

- [Use `.env` to load environment variables](#loading-environment-variables)
- [Bundle environment variables for the browser by prefixing with `NEXT_PUBLIC_`](#bundling-environment-variables-for-the-browser)

> **Warning:** The default `create-next-app` template ensures all `.env` files are added to your `.gitignore`. You almost never want to commit these files to your repository.

## Loading Environment Variables

Next.js has built-in support for loading environment variables from `.env*` files into `process.env`.

```txt
// Archivo: .env
DB_HOST=localhost
DB_USER=myuser
DB_PASS=mypassword
```

> 📘 **Nota para Pages Router:**
> This loads `process.env.DB_HOST`, `process.env.DB_USER`, and `process.env.DB_PASS` into the Node.js environment automatically allowing you to use them in [Next.js data fetching methods](/docs/pages/building-your-application/data-fetching) and [API routes](/docs/pages/building-your-application/routing/api-routes).
> 
> For example, using [`getStaticProps`](/docs/pages/building-your-application/data-fetching/get-static-props):
> 
> ```js filename="pages/index.js"
> export async function getStaticProps() {
>   const db = await myDB.connect({
>     host: process.env.DB_HOST,
>     username: process.env.DB_USER,
>     password: process.env.DB_PASS,
>   })
>   // ...
> }
> ```

> **Note**: Next.js also supports multiline variables inside of your `.env*` files:
>
> ```bash
> # .env
>
> # you can write with line breaks
> PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
> ...
> Kh9NV...
> ...
> -----END DSA PRIVATE KEY-----"
>
> # or with `\n` inside double quotes
> PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nKh9NV...\n-----END DSA PRIVATE KEY-----\n"
> ```

> **Note**: If you are using a `/src` folder, please note that Next.js will load the .env files **only** from the parent folder and **not** from the `/src` folder.
> This loads `process.env.DB_HOST`, `process.env.DB_USER`, and `process.env.DB_PASS` into the Node.js environment automatically allowing you to use them in [Route Handlers](/docs/app/api-reference/file-conventions/route).

For example:

```js
// Archivo: app/api/route.js
export async function GET() {
  const db = await myDB.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  })
  // ...
}
```

### Loading Environment Variables with `@next/env`

If you need to load environment variables outside of the Next.js runtime, such as in a root config file for an ORM or test runner, you can use the `@next/env` package.

This package is used internally by Next.js to load environment variables from `.env*` files.

To use it, install the package and use the `loadEnvConfig` function to load the environment variables:

```bash
# Manejador de paquetes: pnpm
pnpm add @next/env
```

```bash
# Manejador de paquetes: npm
npm install @next/env
```

```bash
# Manejador de paquetes: yarn
yarn add @next/env
```

```bash
# Manejador de paquetes: bun
bun add @next/env
```

```tsx
// Archivo: envConfig.ts switcher
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)
```

```jsx
// Archivo: envConfig.js switcher
import { loadEnvConfig } from '@next/env'

const projectDir = process.cwd()
loadEnvConfig(projectDir)
```

Then, you can import the configuration where needed. For example:

```tsx
// Archivo: orm.config.ts switcher
import './envConfig.ts'

export default defineConfig({
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
})
```

```jsx
// Archivo: orm.config.js switcher
import './envConfig.js'

export default defineConfig({
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
})
```

### Referencing Other Variables

Next.js will automatically expand variables that use `$` to reference other variables e.g. `$VARIABLE` inside of your `.env*` files. This allows you to reference other secrets. For example:

```txt
// Archivo: .env
TWITTER_USER=nextjs
TWITTER_URL=https://x.com/$TWITTER_USER
```

In the above example, `process.env.TWITTER_URL` would be set to `https://x.com/nextjs`.

> **Good to know**: If you need to use variable with a `$` in the actual value, it needs to be escaped e.g. `\$`.

## Bundling Environment Variables for the Browser

Non-`NEXT_PUBLIC_` environment variables are only available in the Node.js environment, meaning they aren't accessible to the browser (the client runs in a different _environment_).

In order to make the value of an environment variable accessible in the browser, Next.js can "inline" a value, at build time, into the js bundle that is delivered to the client, replacing all references to `process.env.[variable]` with a hard-coded value. To tell it to do this, you just have to prefix the variable with `NEXT_PUBLIC_`. For example:

```txt
// Archivo: .env
NEXT_PUBLIC_ANALYTICS_ID=abcdefghijk
```

This will tell Next.js to replace all references to `process.env.NEXT_PUBLIC_ANALYTICS_ID` in the Node.js environment with the value from the environment in which you run `next build`, allowing you to use it anywhere in your code. It will be inlined into any JavaScript sent to the browser.

> **Note**: After being built, your app will no longer respond to changes to these environment variables. For instance, if you use a Heroku pipeline to promote slugs built in one environment to another environment, or if you build and deploy a single Docker image to multiple environments, all `NEXT_PUBLIC_` variables will be frozen with the value evaluated at build time, so these values need to be set appropriately when the project is built. If you need access to runtime environment values, you'll have to set up your own API to provide them to the client (either on demand or during initialization).

```js
// Archivo: pages/index.js
import setupAnalyticsService from '../lib/my-analytics-service'

// 'NEXT_PUBLIC_ANALYTICS_ID' can be used here as it's prefixed by 'NEXT_PUBLIC_'.
// It will be transformed at build time to `setupAnalyticsService('abcdefghijk')`.
setupAnalyticsService(process.env.NEXT_PUBLIC_ANALYTICS_ID)

function HomePage() {
  return <h1>Hello World</h1>
}

export default HomePage
```

Note that dynamic lookups will _not_ be inlined, such as:

```js
// This will NOT be inlined, because it uses a variable
const varName = 'NEXT_PUBLIC_ANALYTICS_ID'
setupAnalyticsService(process.env[varName])

// This will NOT be inlined, because it uses a variable
const env = process.env
setupAnalyticsService(env.NEXT_PUBLIC_ANALYTICS_ID)
```

### Runtime Environment Variables

Next.js can support both build time and runtime environment variables.

**By default, environment variables are only available on the server**. To expose an environment variable to the browser, it must be prefixed with `NEXT_PUBLIC_`. However, these public environment variables will be inlined into the JavaScript bundle during `next build`.

> 📘 **Nota para Pages Router:**
> To read runtime environment variables, we recommend using `getServerSideProps` or [incrementally adopting the App Router](/docs/app/guides/migrating/app-router-migration).

You can safely read environment variables on the server during dynamic rendering:

```tsx
// Archivo: app/page.ts switcher
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  // cookies, headers, and other Request-time APIs
  // will also opt into dynamic rendering, meaning
  // this env variable is evaluated at runtime
  const value = process.env.MY_VALUE
  // ...
}
```

```jsx
// Archivo: app/page.js switcher
import { connection } from 'next/server'

export default async function Component() {
  await connection()
  // cookies, headers, and other Request-time APIs
  // will also opt into dynamic rendering, meaning
  // this env variable is evaluated at runtime
  const value = process.env.MY_VALUE
  // ...
}
```

This allows you to use a singular Docker image that can be promoted through multiple environments with different values.

**Good to know:**

- You can run code on server startup using the [`register` function](/docs/app/guides/instrumentation).

## Test Environment Variables

Apart from `development` and `production` environments, there is a 3rd option available: `test`. In the same way you can set defaults for development or production environments, you can do the same with a `.env.test` file for the `testing` environment (though this one is not as common as the previous two). Next.js will not load environment variables from `.env.development` or `.env.production` in the `testing` environment.

This one is useful when running tests with tools like `jest` or `cypress` where you need to set specific environment vars only for testing purposes. Test default values will be loaded if `NODE_ENV` is set to `test`, though you usually don't need to do this manually as testing tools will address it for you.

There is a small difference between `test` environment, and both `development` and `production` that you need to bear in mind: `.env.local` won't be loaded, as you expect tests to produce the same results for everyone. This way every test execution will use the same env defaults across different executions by ignoring your `.env.local` (which is intended to override the default set).

> **Good to know**: similar to Default Environment Variables, `.env.test` file should be included in your repository, but `.env.test.local` shouldn't, as `.env*.local` are intended to be ignored through `.gitignore`.

While running unit tests you can make sure to load your environment variables the same way Next.js does by leveraging the `loadEnvConfig` function from the `@next/env` package.

```js
// The below can be used in a Jest global setup file or similar for your testing set-up
import { loadEnvConfig } from '@next/env'

export default async () => {
  const projectDir = process.cwd()
  loadEnvConfig(projectDir)
}
```

## Environment Variable Load Order

Environment variables are looked up in the following places, in order, stopping once the variable is found.

1. `process.env`
1. `.env.$(NODE_ENV).local`
1. `.env.local` (Not checked when `NODE_ENV` is `test`.)
1. `.env.$(NODE_ENV)`
1. `.env`

For example, if `NODE_ENV` is `development` and you define a variable in both `.env.development.local` and `.env`, the value in `.env.development.local` will be used.

> **Good to know**: The allowed values for `NODE_ENV` are `production`, `development` and `test`.

## Good to know

- If you are using a [`/src` directory](/docs/app/api-reference/file-conventions/src-folder), `.env.*` files should remain in the root of your project.
- If the environment variable `NODE_ENV` is unassigned, Next.js automatically assigns `development` when running the `next dev` command, or `production` for all other commands.

## Version History

| Version  | Changes                                       |
| -------- | --------------------------------------------- |
| `v9.4.0` | Support `.env` and `NEXT_PUBLIC_` introduced. |



[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-implement-authentication-in-nextjs"></a>

## How to implement authentication in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/authentication](https://nextjs.org/docs/pages/guides/authentication)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to implement authentication in Next.js, covering best practices, securing routes, authorization techniques, and session management.*  

---





[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-set-a-content-security-policy-csp-for-your-nextjs-application"></a>

## How to set a Content Security Policy (CSP) for your Next.js application

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/content-security-policy](https://nextjs.org/docs/pages/guides/content-security-policy)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn how to set a Content Security Policy (CSP) for your Next.js application.*  

---





[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-use-environment-variables-in-nextjs"></a>

## How to use environment variables in Next.js

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/environment-variables](https://nextjs.org/docs/pages/guides/environment-variables)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Learn to add and access environment variables in your Next.js application.*  

---





[⬆ Subir al inicio del capítulo](#)

---

