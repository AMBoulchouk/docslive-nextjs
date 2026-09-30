# How to implement authentication with Cache Components

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
