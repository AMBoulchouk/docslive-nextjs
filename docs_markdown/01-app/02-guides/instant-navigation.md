# Ensuring instant navigations

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/instant-navigation](https://nextjs.org/docs/app/guides/instant-navigation)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Learn how to structure your app to prefetch and prerender more content, providing instant page loads and client navigations.*  

---

This guide walks through understanding instant navigations, writing a route that navigates instantly, visualizing what's in the initial UI, and locking the behavior in with end-to-end tests.

## What "instant" means

A navigation is **instant** when the browser can start rendering the new page the moment the user clicks, with static, cached, and fallback content showing up right away, while the server streams the remaining content into its fallbacks.

> **Good to know:** This definition assumes caches are warm. Cold caches still require the server to compute the cached result once, so the first navigation to a route may still wait.

A direct visit and a client navigation to the same route can produce different initial UI. **Direct visits** get the [**static shell**](/docs/app/glossary#static-shell) as HTML, typically from a CDN. **Client navigations** only re-render below the layout the current and destination routes share, so the fallback UI defined by a ```<Suspense>``
      ``<Suspense>``
    </div>
  )
}

type Params = PageProps<'/store/[slug]'>['params']

async function ProductInfo({ params }: { params: Params }) {
  const { slug } = await params
  const product = await getProduct(slug)
  return (
    <>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </>
  )
}

async function getProduct(slug: string) {
  'use cache'
  return db.products.findBySlug(slug)
}

async function Inventory({ params }: { params: Params }) {
  const { slug } = await params
  const item = await db.inventory.findBySlug(slug)
  return <p>{item.count} in stock</p>
}
```

Cache Components validates this route automatically in development. If something would block a navigation, the dev overlay surfaces a **blocking-route** insight that names the offending component and points at these fixes:


  
> 💡 **Solución recomendada (cache):** Cache the component or data — [Ver guía de solución](https://nextjs.org/docs/messages/blocking-prerender-dynamic#cache-the-component-or-data)
' },
    ]}
  />
  
> 💡 **Solución recomendada (stream):** Wrap in or move into Suspense — [Ver guía de solución](https://nextjs.org/docs/messages/blocking-prerender-dynamic#wrap-in-or-move-into-suspense)
' },
      { text: '`<Suspense>`', highlight: true },
    ]}
  />


> **Good to know:** Each fix card links to a detailed walkthrough with patterns, code samples, and trade-offs. Click a card to dive in, or use **Copy prompt** to hand the fix to your agent. See [AI workflow](#ai-workflow) for the loop.

Validation runs on every page load using the real request from your browser, so dynamic params like `[slug]` are checked against actual values as you navigate.

### Client Component Pages

A soft navigation into a page with `"use client"` at the top behaves like a single-page app transition, with no server render at navigation time, which makes it instant. The dev overlay doesn't include this in its fix cards because it has bigger implications than the recommended approaches, which keep the page in the server-component model. Reach for `"use client"` when the page is fully interactive and must be a client component.

> **Good to know**: `"use client"` doesn't skip validation for the static shell. Hooks like `useSearchParams()` still need a ```<Suspense>``
    </div>
  )
}
```

Now `await props.params` and the product fetch suspend together. The product-fetch error clears, and validation moves on to the next blocker.

### Step 2: Cache the featured fetch

Validation now fires on `getFeatured()`.

<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  }}
>
  

![Dev overlay insight for the uncached getFeatured() fetch, with Stream, Cache, and Block fix cards]()


</div>

Add a `"use cache"` directive to the fetching function:

```tsx
// Archivo: app/products/[slug]/page.tsx
async function getFeatured() {
  'use cache'
  const res = await fetch('https://next-recipe-api.vercel.dev/products?limit=3')
  return res.json()
}
```

The result is cached at the fetch level. The featured list ships with the App Shell.

> **Good to know:** In serverless deployments, in-memory caching with `"use cache"` will not persist across instances. Consider using [`"use cache: remote"`](/docs/app/api-reference/directives/use-cache-remote) for persistent caching.

Validation passes. Open the DevTools and try a client navigation. The featured section appears immediately, and **"Loading product..."** shows where the product details will stream in.

### Iterate on loading states

Validation passing means the navigation is instant. It does not mean the loading states are good. A ``<Suspense>`` boundary placed high in the tree (say, wrapping the whole page) might satisfy validation, but it replaces most of the page with a single fallback on every navigation.

The best loading states keep as much real, cached content visible as possible and only show fallbacks where data is actually in flight. A product page that keeps the header, image, and description visible with only the price and availability behind a fallback feels faster than a full-page skeleton, even at the same total load time.

Use the [DevTools](#visualize-loading-states-with-the-nextjs-devtools) to see what your users see, or see the [AI workflow](#ai-workflow) for automating the loop with an agent.

## AI workflow

At a high level, an agent optimizes a single navigation like this:

- **Observe**: read validation insights and choose the exact navigation and UI that should appear immediately.
- **Test**: confirm the target UI renders normally, then write an `instant()` test and verify that it fails before changing the route.
- **Fix**: validation errors name a specific component and suggest a fix (`use cache` or ``<Suspense>``). The agent applies the fix and re-runs validation.
- **Verify**: run the test against a production-like build and keep the passing test as a regression guard.

The agent doesn't need to understand the full caching model, only to follow the insights and errors until they're gone. It does need your app-specific intent, though. Tell it what should appear immediately, what can stream in, and what must stay fresh. When a caching decision is unclear, keep the data fresh behind ``<Suspense>`` rather than guessing a cache lifetime.

For [iterating on loading states](#iterate-on-loading-states), a prompt like "maximize my content, and reduce the amount that needs to be behind a spinner" works well for pushing boundaries down.

Agents working on a Cache Components route typically reach for three levers:

- **Push down**: extract I/O into a Suspense-wrapped child so the parent stays static and static siblings lift into the shell.
- **Cache**: pair `'use cache'` with [`cacheLife`](/docs/app/api-reference/functions/cacheLife) to assign a freshness profile.
- **Per-link prefetching** (nav-only): when a route reads URL data (`searchParams` or `params`), opt it into [per-link prefetching](/docs/app/guides/optimizing-prefetching) so the framework resolves that data at link-prefetch time. Session data from `cookies()` or `headers()` already lands in the App Shell without it.

Each refactor should pair with a before/after capture to verify the change actually landed. Identical-looking captures mean the refactor didn't take effect.

For agents to see what their changes actually render, pair this with [agent-browser](https://github.com/vercel-labs/agent-browser). With React DevTools enabled it reports the component tree and which ``<Suspense>`` boundaries are still pending, so an agent can make a change, snapshot the shell, check what landed, and adjust. See [Runtime visibility](/docs/app/guides/ai-agents#step-2-give-agents-runtime-visibility) in the AI agents guide for the setup.

The [`next-cache-components-optimizer`](/docs/app/guides/ai-agents#next-cache-components-optimizer) Skill packages this loop. It confirms the target UI renders normally, writes an `instant()` test that fails before the fix, then works it to green against a production-like build and ships it as a regression guard. Use it for the initial load (hard navigation), client-side navigation (soft navigation), or both.

## Opting out

Not every layout or page can or should be instant. When the structural fix isn't worth the work, or when a route isn't a priority for instant navigation, refine validation at one of two scopes.

The dev overlay surfaces this as the **Block** fix alongside every insight:


  
> 💡 **Solución recomendada (block):** Allow blocking route — [Ver guía de solución](https://nextjs.org/docs/messages/blocking-prerender-dynamic#allow-blocking-route)

Set `instant = false` on the page or layout file. This opts the segment out of validation feedback. The segment may still navigate instantly if its structure supports it; the framework just won't surface insights for it. Navigations between sibling segments below are still validated.

```tsx
// Archivo: app/dashboard/layout.tsx
export const instant = false
```

With `false` on `/dashboard/layout.tsx`, validation no longer flags navigations into `/dashboard` from outside; navigations between `/dashboard/a` and `/dashboard/b` are still checked.

For opted-out segments, the navigation blocks on the server. If the content depends on cookies or headers but has a known cache lifetime, caching it with [`use cache: private`](/docs/app/api-reference/directives/use-cache-private) lets the App Shell carry it ahead of the click instead of opting out, as long as its [`stale`](/docs/app/api-reference/functions/cacheLife#stale) time is at least 5 minutes.

## Next steps

- [Adopting Partial Prefetching](/docs/app/guides/adopting-partial-prefetching) for the recommended `<Link>` defaults and the migration path off `unstable_eager`
- [`instant` API reference](/docs/app/api-reference/file-conventions/route-segment-config/instant) for the full configuration
- [Optimizing prefetching](/docs/app/guides/optimizing-prefetching) when parts of your route depend on URL data (`searchParams` or `params`) and should resolve before navigation
- [Caching](/docs/app/getting-started/caching) for background on `use cache`, Suspense, and Partial Prerendering
- [Revalidating](/docs/app/getting-started/revalidating) for how to expire cached data with `cacheLife` and `updateTag`
