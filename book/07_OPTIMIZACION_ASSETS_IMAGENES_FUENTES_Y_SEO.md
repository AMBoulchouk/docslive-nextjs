# Capítulo 7: Optimización de Assets: Imágenes, Fuentes, Scripts y SEO

> 📌 **Capítulo 07** | Libro Guía Next.js v16.3.7  
> 📝 **Resumen:** *next/image, next/font, Scripts de terceros, Metadata, Open Graph, Sitemap y Robots.txt.*  
> 📄 **Temas incluidos en este capítulo:** 18 secciones  

[⬅ Volver al Índice General](./00_INDICE_GENERAL.md)

---

## Contenido del Capítulo

- [Image Optimization](#image-optimization)
- [Font Optimization](#font-optimization)
- [Metadata and OG images](#metadata-and-og-images)
- [How to load and optimize scripts](#how-to-load-and-optimize-scripts)
- [favicon, icon, and apple-icon](#favicon-icon-and-apple-icon)
- [Metadata Files API Reference](#metadata-files-api-reference)
- [manifest.json](#manifestjson)
- [opengraph-image and twitter-image](#opengraph-image-and-twitter-image)
- [robots.txt](#robotstxt)
- [sitemap.xml](#sitemapxml)
- [generateImageMetadata](#generateimagemetadata)
- [generateMetadata](#generatemetadata)
- [generateSitemaps](#generatesitemaps)
- [images](#images)
- [Image Optimization](#image-optimization)
- [How to use fonts](#how-to-use-fonts)
- [How to load and optimize scripts](#how-to-load-and-optimize-scripts)
- [images](#images)

---

<a id="image-optimization"></a>

## Image Optimization

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/images](https://nextjs.org/docs/app/getting-started/images)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to optimize images in Next.js*  

---

The Next.js [`<Image>`](/docs/app/api-reference/components/image) component extends the HTML `<img>` element to provide:

- **Size optimization:** Automatically serving correctly sized images for each device, using modern image formats like WebP.
- **Visual stability:** Preventing [layout shift](https://web.dev/articles/cls) automatically when images are loading.
- **Faster page loads:** Only loading images when they enter the viewport using native browser lazy loading, with optional blur-up placeholders.
- **Asset flexibility:** Resizing images on-demand, even images stored on remote servers.

To start using `<Image>`, import it from `next/image` and render it within your component.

```tsx
// Archivo: app/page.tsx switcher
import Image from 'next/image'

export default function Page() {
  return 

![]()


}
```

```jsx
// Archivo: app/page.js switcher
import Image from 'next/image'

export default function Page() {
  return 

![]()


}
```

The `src` property can be a [local](#local-images) or [remote](#remote-images) image.

> **🎥 Watch:** Learn more about how to use `next/image` → [YouTube (9 minutes)](https://youtu.be/IU_qq_c_lKA).

## Local images

You can store static files, like images and fonts, under a folder called [`public`](/docs/app/api-reference/file-conventions/public-folder) in the root directory. Files inside `public` can then be referenced by your code starting from the base URL (`/`).

![Folder structure showing app and public folders]()

```tsx
// Archivo: app/page.tsx switcher
import Image from 'next/image'

export default function Page() {
  return (
    

![Picture of the author](https://nextjs.org/profile.png)


  )
}
```

```jsx
// Archivo: app/page.js switcher
import Image from 'next/image'

export default function Page() {
  return (
    

![Picture of the author](https://nextjs.org/profile.png)


  )
}
```

If the image is statically imported, Next.js will automatically determine the intrinsic [`width`](/docs/app/api-reference/components/image#width-and-height) and [`height`](/docs/app/api-reference/components/image#width-and-height). These values are used to determine the image ratio and prevent [Cumulative Layout Shift](https://web.dev/articles/cls) while your image is loading.

```tsx
// Archivo: app/page.tsx switcher
import Image from 'next/image'
import ProfileImage from './profile.png'

export default function Page() {
  return (
    

![Picture of the author]()


  )
}
```

```jsx
// Archivo: app/page.js switcher
import Image from 'next/image'
import ProfileImage from './profile.png'

export default function Page() {
  return (
    

![Picture of the author]()


  )
}
```

### Images without static imports

If you can't use a static `import` for your images, you can use a dynamic `import()` in a Server Component to still get automatic `width`, `height`, and `blurDataURL`:

```tsx
// Archivo: app/blog/[slug]/page.tsx switcher
import Image from 'next/image'

async function PostImage({
  imageFilename,
  alt,
}: {
  imageFilename: string
  alt: string
}) {
  const { default: image } = await import(
    `../content/blog/images/${imageFilename}`
  )
  // image contains width, height, and blurDataURL
  return 

![Illustration]()


}
```

```jsx
// Archivo: app/blog/[slug]/page.js switcher
import Image from 'next/image'

async function PostImage({ imageFilename, alt }) {
  const { default: image } = await import(
    `../content/blog/images/${imageFilename}`
  )
  // image contains width, height, and blurDataURL
  return 

![Illustration]()


}
```

If you have a [path alias](https://www.typescriptlang.org/tsconfig/#paths) configured (e.g. `@/`), you can use it instead of a relative path:

```tsx
const { default: image } = await import(
  `@/content/blog/images/${imageFilename}`
)
```

The path must include a static prefix (like `../content/blog/images/`). Be as specific as possible, since **all** files matching that prefix are bundled. Only files in your specified directory are included, so external input cannot reach outside of it.

## Remote images

To use a remote image, you can provide a URL string for the `src` property.

```tsx
// Archivo: app/page.tsx switcher
import Image from 'next/image'

export default function Page() {
  return (
    

![Picture of the author](https://s3.amazonaws.com/my-bucket/profile.png)


  )
}
```

```jsx
// Archivo: app/page.js switcher
import Image from 'next/image'

export default function Page() {
  return (
    

![Picture of the author](https://s3.amazonaws.com/my-bucket/profile.png)


  )
}
```

Since Next.js does not have access to remote files during the build process, you'll need to provide the [`width`](/docs/app/api-reference/components/image#width-and-height), [`height`](/docs/app/api-reference/components/image#width-and-height) and optional [`blurDataURL`](/docs/app/api-reference/components/image#blurdataurl) props manually. The `width` and `height` are used to infer the correct aspect ratio of image and avoid layout shift from the image loading in. Alternatively, you can use the [`fill` property](/docs/app/api-reference/components/image#fill) to make the image fill the size of the parent element.

To safely allow images from remote servers, you need to define a list of supported URL patterns in [`next.config.js`](/docs/app/api-reference/config/next-config-js). Be as specific as possible to prevent malicious usage. For example, the following configuration will only allow images from a specific AWS S3 bucket:

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
}

export default config
```

```js
// Archivo: next.config.js switcher
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
        search: '',
      },
    ],
  },
}
```



[⬆ Subir al inicio del capítulo](#)

---

<a id="font-optimization"></a>

## Font Optimization

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/fonts](https://nextjs.org/docs/app/getting-started/fonts)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to optimize fonts in Next.js*  

---

The [`next/font`](/docs/app/api-reference/components/font) module automatically optimizes your fonts and removes external network requests for improved privacy and performance.

It includes **built-in self-hosting** for any font file. This means you can optimally load web fonts with no layout shift.

To start using `next/font`, import it from [`next/font/local`](#local-fonts) or [`next/font/google`](#google-fonts), call it as a function with the appropriate options, and set the `className` of the element you want to apply the font to. For example:

```tsx
// Archivo: app/layout.tsx highlight={1,3-5,9} switcher
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx
// Archivo: app/layout.js highlight={1,3-5,9} switcher
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function Layout({ children }) {
  return (
    <html className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

Fonts are scoped to the component they're used in. To apply a font to your entire application, add it to the [Root Layout](/docs/app/api-reference/file-conventions/layout#root-layout).

> 📘 **Nota para Pages Router:**
> To start using `next/font`, import it from [`next/font/local`](#local-fonts) or [`next/font/google`](#google-fonts), call it as a function with the appropriate options, and set the `className` of the element you want to apply the font to. For example, you can apply fonts globally in your [Custom App](/docs/pages/building-your-application/routing/custom-app) (`pages/_app`):
> 
> ```tsx filename="pages/_app.tsx" highlight={1,4-6,10} switcher
> import { Geist } from 'next/font/google'
> import type { AppProps } from 'next/app'
> 
> const geist = Geist({
>   subsets: ['latin'],
> })
> 
> export default function MyApp({ Component, pageProps }: AppProps) {
>   return (
>     <main className={geist.className}>
>       <Component {...pageProps} />
>     </main>
>   )
> }
> ```
> 
> ```jsx filename="pages/_app.js" highlight={1,3-5,9} switcher
> import { Geist } from 'next/font/google'
> 
> const geist = Geist({
>   subsets: ['latin'],
> })
> 
> export default function MyApp({ Component, pageProps }) {
>   return (
>     <main className={geist.className}>
>       <Component {...pageProps} />
>     </main>
>   )
> }
> ```

## Google fonts

You can automatically self-host any Google Font. Fonts are included as static assets and served from the same domain as your deployment, meaning no requests are sent to Google by the browser when the user visits your site.

To start using a Google Font, import your chosen font from `next/font/google`:

```tsx
// Archivo: app/layout.tsx switcher
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx
// Archivo: app/layout.js switcher
import { Geist } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.className}>
      <body>{children}</body>
    </html>
  )
}
```

> 📘 **Nota para Pages Router:**
> ```tsx filename="pages/_app.tsx" switcher
> import { Geist } from 'next/font/google'
> import type { AppProps } from 'next/app'
> 
> const geist = Geist({
>   subsets: ['latin'],
> })
> 
> export default function MyApp({ Component, pageProps }: AppProps) {
>   return (
>     <main className={geist.className}>
>       <Component {...pageProps} />
>     </main>
>   )
> }
> ```
> 
> ```jsx filename="pages/_app.js" switcher
> import { Geist } from 'next/font/google'
> 
> const geist = Geist({
>   subsets: ['latin'],
> })
> 
> export default function MyApp({ Component, pageProps }) {
>   return (
>     <main className={geist.className}>
>       <Component {...pageProps} />
>     </main>
>   )
> }
> ```

We recommend using [variable fonts](https://fonts.google.com/variablefonts) for the best performance and flexibility. But if you can't use a variable font, you will need to specify a weight:

```tsx
// Archivo: app/layout.tsx highlight={4} switcher
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx
// Archivo: app/layout.js  highlight={4} switcher
import { Roboto } from 'next/font/google'

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={roboto.className}>
      <body>{children}</body>
    </html>
  )
}
```

> 📘 **Nota para Pages Router:**
> ```tsx filename="pages/_app.tsx" highlight={5} switcher
> import { Roboto } from 'next/font/google'
> import type { AppProps } from 'next/app'
> 
> const roboto = Roboto({
>   weight: '400',
>   subsets: ['latin'],
> })
> 
> export default function MyApp({ Component, pageProps }: AppProps) {
>   return (
>     <main className={roboto.className}>
>       <Component {...pageProps} />
>     </main>
>   )
> }
> ```
> 
> ```jsx filename="pages/_app.js" highlight={4} switcher
> import { Roboto } from 'next/font/google'
> 
> const roboto = Roboto({
>   weight: '400',
>   subsets: ['latin'],
> })
> 
> export default function MyApp({ Component, pageProps }) {
>   return (
>     <main className={roboto.className}>
>       <Component {...pageProps} />
>     </main>
>   )
> }
> ```

## Local fonts

To use a local font, import the `localFont` function from `next/font/local` and specify the [`src`](/docs/app/api-reference/components/font#src) of your local font file. The path is resolved relative to the file where `localFont` is called. Fonts can be stored anywhere in the project, including the [`public`](/docs/app/api-reference/file-conventions/public-folder) folder or co-located inside the `app` folder. For example, to use a font stored in `app/fonts/`:

```tsx
// Archivo: app/layout.tsx switcher
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

```jsx
// Archivo: app/layout.js switcher
import localFont from 'next/font/local'

const myFont = localFont({
  src: './my-font.woff2',
})

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={myFont.className}>
      <body>{children}</body>
    </html>
  )
}
```

> 📘 **Nota para Pages Router:**
> To use a local font, import your font from `next/font/local` and specify the [`src`](/docs/pages/api-reference/components/font#src) of your local font file. Fonts can be stored in the [`public`](/docs/pages/api-reference/file-conventions/public-folder) folder or inside the `pages` folder. For example:
> 
> ```tsx filename="pages/_app.tsx" switcher
> import localFont from 'next/font/local'
> import type { AppProps } from 'next/app'
> 
> const myFont = localFont({
>   src: './my-font.woff2',
> })
> 
> export default function MyApp({ Component, pageProps }: AppProps) {
>   return (
>     <main className={myFont.className}>
>       <Component {...pageProps} />
>     </main>
>   )
> }
> ```
> 
> ```jsx filename="pages/_app.js" switcher
> import localFont from 'next/font/local'
> 
> const myFont = localFont({
>   src: './my-font.woff2',
> })
> 
> export default function MyApp({ Component, pageProps }) {
>   return (
>     <main className={myFont.className}>
>       <Component {...pageProps} />
>     </main>
>   )
> }
> ```

If you want to use multiple files for a single font family, `src` can be an array:

```js
const roboto = localFont({
  src: [
    {
      path: './Roboto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Roboto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: './Roboto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './Roboto-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})
```



[⬆ Subir al inicio del capítulo](#)

---

<a id="metadata-and-og-images"></a>

## Metadata and OG images

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/getting-started/metadata-and-og-images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)  
> 📂 **Sección:** App > Getting Started  
> 📝 **Descripción:** *Learn how to add metadata to your pages and create dynamic OG images.*  

---

The Metadata APIs can be used to define your application metadata for improved SEO and web shareability and include:

1. [The static `metadata` object](#static-metadata)
2. [The dynamic `generateMetadata` function](#generated-metadata)
3. Special [file conventions](/docs/app/api-reference/file-conventions/metadata) that can be used to add static or dynamically generated [favicons](#favicons) and [OG images](#static-open-graph-images).

With all the options above, Next.js will automatically generate the relevant `<head>` tags for your page, which can be inspected in the browser's developer tools.

The `metadata` object and `generateMetadata` function exports are only supported in Server Components.

## Default fields

There are two default `meta` tags that are always added even if a route doesn't define metadata:

- The [meta charset tag](https://developer.mozilla.org/docs/Web/HTML/Element/meta#attr-charset) sets the character encoding for the website.
- The [meta viewport tag](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) sets the viewport width and scale for the website to adjust for different devices.

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

The other metadata fields can be defined with the `Metadata` object (for [static metadata](#static-metadata)) or the `generateMetadata` function (for [generated metadata](#generated-metadata)).

## Static metadata

To define static metadata, export a [`Metadata` object](/docs/app/api-reference/functions/generate-metadata#metadata-object) from a static [`layout.js`](/docs/app/api-reference/file-conventions/layout) or [`page.js`](/docs/app/api-reference/file-conventions/page) file. For example, to add a title and description to the blog route:

```tsx
// Archivo: app/blog/layout.tsx switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Blog',
  description: '...',
}

export default function Layout() {}
```

```jsx
// Archivo: app/blog/layout.js switcher
export const metadata = {
  title: 'My Blog',
  description: '...',
}

export default function Layout() {}
```

You can view a full list of available options, in the [`generateMetadata` documentation](/docs/app/api-reference/functions/generate-metadata#metadata-fields).

## Generated metadata

You can use [`generateMetadata`](/docs/app/api-reference/functions/generate-metadata) function to `fetch` metadata that depends on data. For example, to fetch the title and description for a specific blog post:

```tsx
// Archivo: app/blog/[slug]/page.tsx switcher
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = (await params).slug

  // fetch post information
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json()
  )

  return {
    title: post.title,
    description: post.description,
  }
}

export default function Page({ params, searchParams }: Props) {}
```

```jsx
// Archivo: app/blog/[slug]/page.js switcher
export async function generateMetadata({ params, searchParams }, parent) {
  const slug = (await params).slug

  // fetch post information
  const post = await fetch(`https://api.vercel.app/blog/${slug}`).then((res) =>
    res.json()
  )

  return {
    title: post.title,
    description: post.description,
  }
}

export default function Page({ params, searchParams }) {}
```

### Streaming metadata

For dynamically rendered pages, Next.js streams metadata separately, injecting it into the HTML once `generateMetadata` resolves, without blocking UI rendering.

Streaming metadata improves perceived performance by allowing visual content to stream first.

Streaming metadata is **disabled for bots and crawlers** that expect metadata to be in the `<head>` tag (e.g. `Twitterbot`, `Slackbot`, `Bingbot`). These are detected by using the User Agent header from the incoming request.

You can customize or **disable** streaming metadata completely, with the [`htmlLimitedBots`](/docs/app/api-reference/config/next-config-js/htmlLimitedBots#disabling) option in your Next.js config file.

Prerendered pages don’t use streaming since metadata is resolved at build time.

Learn more about [streaming metadata](/docs/app/api-reference/functions/generate-metadata#streaming-metadata).

### Memoizing data requests

There may be cases where you need to fetch the **same** data for metadata and the page itself. To avoid duplicate requests, you can use React's [`cache` function](https://react.dev/reference/react/cache) to memoize the return value and only fetch the data once. For example, to fetch the blog post information for both the metadata and the page:

```ts
// Archivo: app/lib/data.ts highlight={5} switcher
import { cache } from 'react'
import { db } from '@/app/lib/db'

// getPost will be used twice, but execute only once
export const getPost = cache(async (slug: string) => {
  const res = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
  return res
})
```

```js
// Archivo: app/lib/data.js highlight={5} switcher
import { cache } from 'react'
import { db } from '@/app/lib/db'

// getPost will be used twice, but execute only once
export const getPost = cache(async (slug) => {
  const res = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
  return res
})
```

```tsx
// Archivo: app/blog/[slug]/page.tsx switcher
import { getPost } from '@/app/lib/data'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  return {
    title: post.title,
    description: post.description,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
  return <div>{post.title}</div>
}
```

```jsx
// Archivo: app/blog/[slug]/page.js switcher
import { getPost } from '@/app/lib/data'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  return {
    title: post.title,
    description: post.description,
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const post = await getPost(slug)
  return <div>{post.title}</div>
}
```

## File-based metadata

The following special files are available for metadata:

- [favicon.ico, apple-icon.jpg, and icon.jpg](/docs/app/api-reference/file-conventions/metadata/app-icons)
- [opengraph-image.jpg and twitter-image.jpg](/docs/app/api-reference/file-conventions/metadata/opengraph-image)
- [robots.txt](/docs/app/api-reference/file-conventions/metadata/robots)
- [sitemap.xml](/docs/app/api-reference/file-conventions/metadata/sitemap)

You can use these for static metadata, or you can programmatically generate these files with code.

## Favicons

Favicons are small icons that represent your site in bookmarks and search results. To add a favicon to your application, create a `favicon.ico` and add to the root of the app folder.

![Favicon Special File inside the App Folder with sibling layout and page files]()

> You can also programmatically generate favicons using code. See the [favicon docs](/docs/app/api-reference/file-conventions/metadata/app-icons) for more information.

## Static Open Graph images

Open Graph (OG) images are images that represent your site in social media. To add a static OG image to your application, create a `opengraph-image.jpg` file in the root of the app folder.

![OG image special file inside the App folder with sibling layout and page files]()

You can also add OG images for specific routes by creating a `opengraph-image.jpg` deeper down the folder structure. For example, to create an OG image specific to the `/blog` route, add a `opengraph-image.jpg` file inside the `blog` folder.

![OG image special file inside the blog folder]()

The more specific image will take precedence over any OG images above it in the folder structure.

> Other image formats such as `jpeg`, `png`, and `gif` are also supported. See the [Open Graph Image docs](/docs/app/api-reference/file-conventions/metadata/opengraph-image) for more information.

## Generated Open Graph images

The [`ImageResponse` constructor](/docs/app/api-reference/functions/image-response) allows you to generate dynamic images using JSX and CSS. This is useful for OG images that depend on data.

For example, to generate a unique OG image for each blog post, add an `opengraph-image.tsx` file inside the `blog/[slug]` folder, and import the `ImageResponse` constructor from `next/og`:

```tsx
// Archivo: app/blog/[slug]/opengraph-image.tsx switcher
import { ImageResponse } from 'next/og'
import { getPost } from '@/app/lib/data'

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    )
  )
}
```

```jsx
// Archivo: app/blog/[slug]/opengraph-image.js switcher
import { ImageResponse } from 'next/og'
import { getPost } from '@/app/lib/data'

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image({ params }) {
  const { slug } = await params
  const post = await getPost(slug)

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    )
  )
}
```

`ImageResponse` supports common CSS properties including flexbox and absolute positioning, custom fonts, text wrapping, centering, and nested images. [See the full list of supported CSS properties](/docs/app/api-reference/functions/image-response).

> **Good to know**:
>
> - Examples are available in the [Vercel OG Playground](https://og-playground.vercel.app/).
> - `ImageResponse` uses [`@vercel/og`](https://vercel.com/docs/og-image-generation), [`satori`](https://github.com/vercel/satori), and `resvg` to convert HTML and CSS into PNG.
> - Only flexbox and a subset of CSS properties are supported. Advanced layouts (e.g. `display: grid`) will not work.



[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-load-and-optimize-scripts"></a>

## How to load and optimize scripts

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/guides/scripts](https://nextjs.org/docs/app/guides/scripts)  
> 📂 **Sección:** App > Guides  
> 📝 **Descripción:** *Optimize 3rd party scripts with the built-in Script component.*  

---

### Layout Scripts

To load a third-party script for multiple routes, import `next/script` and include the script directly in your layout component:

```tsx
// Archivo: app/dashboard/layout.tsx switcher
import Script from 'next/script'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

```jsx
// Archivo: app/dashboard/layout.js switcher
import Script from 'next/script'

export default function DashboardLayout({ children }) {
  return (
    <>
      <section>{children}</section>
      <Script src="https://example.com/script.js" />
    </>
  )
}
```

The third-party script is fetched when the folder route (e.g. `dashboard/page.js`) or any nested route (e.g. `dashboard/settings/page.js`) is accessed by the user. Next.js will ensure the script will **only load once**, even if a user navigates between multiple routes in the same layout.

### Application Scripts

To load a third-party script for all routes, import `next/script` and include the script directly in your root layout:

```tsx
// Archivo: app/layout.tsx switcher
import Script from 'next/script'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

```jsx
// Archivo: app/layout.js switcher
import Script from 'next/script'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
      <Script src="https://example.com/script.js" />
    </html>
  )
}
```

> 📘 **Nota para Pages Router:**
> To load a third-party script for all routes, import `next/script` and include the script directly in your custom `_app`:
> 
> ```jsx filename="pages/_app.js"
> import Script from 'next/script'
> 
> export default function MyApp({ Component, pageProps }) {
>   return (
>     <>
>       <Component {...pageProps} />
>       <Script src="https://example.com/script.js" />
>     </>
>   )
> }
> ```

This script will load and execute when _any_ route in your application is accessed. Next.js will ensure the script will **only load once**, even if a user navigates between multiple pages.

> **Recommendation**: We recommend only including third-party scripts in specific pages or layouts in order to minimize any unnecessary impact to performance.

### Strategy

Although the default behavior of `next/script` allows you to load third-party scripts in any page or layout, you can fine-tune its loading behavior by using the `strategy` property:

- `beforeInteractive`: Load the script before any Next.js code and before any page hydration occurs.
- `afterInteractive`: (**default**) Load the script early but after some hydration on the page occurs.
- `lazyOnload`: Load the script later during browser idle time.
- `worker`: (experimental) Load the script in a web worker.

Refer to the [`next/script`](/docs/app/api-reference/components/script#strategy) API reference documentation to learn more about each strategy and their use cases.

### Offloading Scripts To A Web Worker (experimental)

> **Warning:** The `worker` strategy is not yet stable and does not yet work with the App Router. Use with caution.

Scripts that use the `worker` strategy are offloaded and executed in a web worker with [Partytown](https://partytown.qwik.dev/). This can improve the performance of your site by dedicating the main thread to the rest of your application code.

This strategy is still experimental and can only be used if the `nextScriptWorkers` flag is enabled in `next.config.js`:

```js
// Archivo: next.config.js
module.exports = {
  experimental: {
    nextScriptWorkers: true,
  },
}
```

Then, run the development server and Next.js will guide you through the installation of the required packages to finish the setup:

```bash
# Manejador de paquetes: pnpm
pnpm dev
```

```bash
# Manejador de paquetes: npm
npm run dev
```

```bash
# Manejador de paquetes: yarn
yarn dev
```

```bash
# Manejador de paquetes: bun
bun dev
```

You'll see instructions like these: Please install Partytown by running `npm install @qwik.dev/partytown`

Once setup is complete, defining `strategy="worker"` will automatically instantiate Partytown in your application and offload the script to a web worker.

```tsx
// Archivo: pages/home.tsx switcher
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="worker" />
    </>
  )
}
```

```jsx
// Archivo: pages/home.js switcher
import Script from 'next/script'

export default function Home() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="worker" />
    </>
  )
}
```

There are a number of trade-offs that need to be considered when loading a third-party script in a web worker. Please see Partytown's [tradeoffs](https://partytown.qwik.dev/trade-offs) documentation for more information.

> 📘 **Nota para Pages Router:**
> #### Using custom Partytown configuration
> 
> Although the `worker` strategy does not require any additional configuration to work, Partytown supports the use of a config object to modify some of its settings, including enabling `debug` mode and forwarding events and triggers.
> 
> If you would like to add additional configuration options, you can include it within the `<Head />` component used in a [custom `_document.js`](/docs/pages/building-your-application/routing/custom-document):
> 
> ```jsx filename="pages/_document.js"
> import { Html, Head, Main, NextScript } from 'next/document'
> 
> export default function Document() {
>   return (
>     <Html>
>       <Head>
>         <script
>           data-partytown-config
>           dangerouslySetInnerHTML={{
>             __html: `
>               partytown = {
>                 lib: "/_next/static/~partytown/",
>                 debug: true
>               };
>             `,
>           }}
>         />
>       </Head>
>       <body>
>         <Main />
>         <NextScript />
>       </body>
>     </Html>
>   )
> }
> ```
> 
> In order to modify Partytown's configuration, the following conditions must be met:
> 
> 1. The `data-partytown-config` attribute must be used in order to overwrite the default configuration used by Next.js
> 2. Unless you decide to save Partytown's library files in a separate directory, the `lib: "/_next/static/~partytown/"` property and value must be included in the configuration object in order to let Partytown know where Next.js stores the necessary static files.
> 
> > **Note**: If you are using an [asset prefix](/docs/pages/api-reference/config/next-config-js/assetPrefix) and would like to modify Partytown's default configuration, you must include it as part of the `lib` path.
> 
> Take a look at Partytown's [configuration options](https://partytown.qwik.dev/configuration) to see the full list of other properties that can be added.

### Inline Scripts

Inline scripts, or scripts not loaded from an external file, are also supported by the Script component. They can be written by placing the JavaScript within curly braces:

```jsx
<Script id="show-banner">
  {`document.getElementById('banner').classList.remove('hidden')`}
</Script>
```

Or by using the `dangerouslySetInnerHTML` property:

```jsx
<Script
  id="show-banner"
  dangerouslySetInnerHTML={{
    __html: `document.getElementById('banner').classList.remove('hidden')`,
  }}
/>
```

> **Warning**: An `id` property must be assigned for inline scripts in order for Next.js to track and optimize the script.

### Executing Additional Code

Event handlers can be used with the Script component to execute additional code after a certain event occurs:

- `onLoad`: Execute code after the script has finished loading.
- `onReady`: Execute code after the script has finished loading and every time the component is mounted.
- `onError`: Execute code if the script fails to load.

These handlers will only work when `next/script` is imported and used inside of a [Client Component](/docs/app/getting-started/server-and-client-components) where `"use client"` is defined as the first line of code:

```tsx
// Archivo: app/page.tsx switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onLoad={() => {
          console.log('Script has loaded')
        }}
      />
    </>
  )
}
```

```jsx
// Archivo: app/page.js switcher
'use client'

import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        onLoad={() => {
          console.log('Script has loaded')
        }}
      />
    </>
  )
}
```

Refer to the [`next/script`](/docs/app/api-reference/components/script#onload) API reference to learn more about each event handler and view examples.

> 📘 **Nota para Pages Router:**
> These handlers will only work when `next/script` is imported and used inside of a [Client Component](/docs/app/getting-started/server-and-client-components) where `"use client"` is defined as the first line of code:
> 
> ```tsx filename="pages/index.tsx" switcher
> import Script from 'next/script'
> 
> export default function Page() {
>   return (
>     <>
>       <Script
>         src="https://example.com/script.js"
>         onLoad={() => {
>           console.log('Script has loaded')
>         }}
>       />
>     </>
>   )
> }
> ```
> 
> ```jsx filename="pages/index.js" switcher
> import Script from 'next/script'
> 
> export default function Page() {
>   return (
>     <>
>       <Script
>         src="https://example.com/script.js"
>         onLoad={() => {
>           console.log('Script has loaded')
>         }}
>       />
>     </>
>   )
> }
> ```
> 
> Refer to the [`next/script`](/docs/pages/api-reference/components/script#onload) API reference to learn more about each event handler and view examples.

### Additional Attributes

There are many DOM attributes that can be assigned to a `<script>` element that are not used by the Script component, like [`nonce`](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/nonce) or [custom data attributes](https://developer.mozilla.org/docs/Web/HTML/Global_attributes/data-*). Including any additional attributes will automatically forward it to the final, optimized `<script>` element that is included in the HTML.

```tsx
// Archivo: app/page.tsx switcher
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```

```jsx
// Archivo: app/page.js switcher
import Script from 'next/script'

export default function Page() {
  return (
    <>
      <Script
        src="https://example.com/script.js"
        id="example-script"
        nonce="XUENAJFW"
        data-test="script"
      />
    </>
  )
}
```

> 📘 **Nota para Pages Router:**
> ```tsx filename="pages/index.tsx" switcher
> import Script from 'next/script'
> 
> export default function Page() {
>   return (
>     <>
>       <Script
>         src="https://example.com/script.js"
>         id="example-script"
>         nonce="XUENAJFW"
>         data-test="script"
>       />
>     </>
>   )
> }
> ```
> 
> ```jsx filename="pages/index.js" switcher
> import Script from 'next/script'
> 
> export default function Page() {
>   return (
>     <>
>       <Script
>         src="https://example.com/script.js"
>         id="example-script"
>         nonce="XUENAJFW"
>         data-test="script"
>       />
>     </>
>   )
> }
> ```



[⬆ Subir al inicio del capítulo](#)

---

<a id="favicon-icon-and-apple-icon"></a>

## favicon, icon, and apple-icon

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons)  
> 📂 **Sección:** App > Api Reference > File Conventions > Metadata  
> 📝 **Descripción:** *API Reference for the Favicon, Icon and Apple Icon file conventions.*  

---

The `favicon`, `icon`, or `apple-icon` file conventions allow you to set icons for your application.

They are useful for adding app icons that appear in places like web browser tabs, phone home screens, and search engine results.

There are two ways to set app icons:

- [Using image files (.ico, .jpg, .png)](#image-files-ico-jpg-png)
- [Using code to generate an icon (.js, .ts, .tsx)](#generate-icons-using-code-js-ts-tsx)

## Image files (.ico, .jpg, .png)

Use an image file to set an app icon by placing a `favicon`, `icon`, or `apple-icon` image file within your `/app` directory.
The `favicon` image can only be located in the top level of `app/`.

Next.js will evaluate the file and automatically add the appropriate tags to your app's `<head>` element.

| File convention             | Supported file types                    | Valid locations |
| --------------------------- | --------------------------------------- | --------------- |
| [`favicon`](#favicon)       | `.ico`                                  | `app/`          |
| [`icon`](#icon)             | `.ico`, `.jpg`, `.jpeg`, `.png`, `.svg` | `app/**/*`      |
| [`apple-icon`](#apple-icon) | `.jpg`, `.jpeg`, `.png`                 | `app/**/*`      |

### `favicon`

Add a `favicon.ico` image file to the root `/app` route segment.

```html
// Archivo: <head> output
<link rel="icon" href="/favicon.ico" sizes="any" />
```

### `icon`

Add an `icon.(ico|jpg|jpeg|png|svg)` image file.

```html
// Archivo: <head> output
<link
  rel="icon"
  href="/icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

### `apple-icon`

Add an `apple-icon.(jpg|jpeg|png)` image file.

```html
// Archivo: <head> output
<link
  rel="apple-touch-icon"
  href="/apple-icon?<generated>"
  type="image/<generated>"
  sizes="<generated>"
/>
```

> **Good to know**:
>
> - You can set multiple icons by adding a number suffix to the file name. For example, `icon1.png`, `icon2.png`, etc. Numbered files will sort lexically.
> - Favicons can only be set in the root `/app` segment. If you need more granularity, you can use [`icon`](#icon).
> - The appropriate `<link>` tags and attributes such as `rel`, `href`, `type`, and `sizes` are determined by the icon type and metadata of the evaluated file.
> - For example, a 32 by 32px `.png` file will have `type="image/png"` and `sizes="32x32"` attributes.
> - `sizes="any"` is added to icons when the extension is `.svg` or the image size of the file is not determined. More details in this [favicon handbook](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs).

## Generate icons using code (.js, .ts, .tsx)

In addition to using [literal image files](#image-files-ico-jpg-png), you can programmatically **generate** icons using code.

Generate an app icon by creating an `icon` or `apple-icon` route that default exports a function.

| File convention | Supported file types |
| --------------- | -------------------- |
| `icon`          | `.js`, `.ts`, `.tsx` |
| `apple-icon`    | `.js`, `.ts`, `.tsx` |

The easiest way to generate an icon is to use the [`ImageResponse`](/docs/app/api-reference/functions/image-response) API from `next/og`.

```tsx
// Archivo: app/icon.tsx switcher
import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}
```

```jsx
// Archivo: app/icon.js switcher
import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'black',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
        }}
      >
        A
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      ...size,
    }
  )
}
```

```html
// Archivo: <head> output
<link rel="icon" href="/icon?<generated>" type="image/png" sizes="32x32" />
```

> **Good to know**:
>
> - By default, generated icons are [**statically optimized**](/docs/app/glossary#prerendering) (generated at build time and cached) unless they use [Request-time APIs](/docs/app/glossary#request-time-apis) or uncached data.
> - You can generate multiple icons in the same file using [`generateImageMetadata`](/docs/app/api-reference/functions/generate-image-metadata).
> - You cannot generate a `favicon` icon. Use [`icon`](#icon) or a [favicon.ico](#favicon) file instead.
> - App icons are special Route Handlers that are cached by default unless they use a [Request-time API](/docs/app/glossary#request-time-apis) or [dynamic config](/docs/app/guides/caching-without-cache-components#dynamic) option.

### Props

The default export function receives the following props:

#### `params` (optional)

A promise that resolves to an object containing the [dynamic route parameters](/docs/app/api-reference/file-conventions/dynamic-routes) object from the root segment down to the segment `icon` or `apple-icon` is colocated in.

> **Good to know**: If you use [`generateImageMetadata`](/docs/app/api-reference/functions/generate-image-metadata), the function will also receive an `id` prop that is a promise resolving to the `id` value from one of the items returned by `generateImageMetadata`.

```tsx
// Archivo: app/shop/[slug]/icon.tsx switcher
export default async function Icon({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

```jsx
// Archivo: app/shop/[slug]/icon.js switcher
export default async function Icon({ params }) {
  const { slug } = await params
  // ...
}
```

| Route                           | URL         | `params`                           |
| ------------------------------- | ----------- | ---------------------------------- |
| `app/shop/icon.js`              | `/shop`     | `undefined`                        |
| `app/shop/[slug]/icon.js`       | `/shop/1`   | `Promise<{ slug: '1' }>`           |
| `app/shop/[tag]/[item]/icon.js` | `/shop/1/2` | `Promise<{ tag: '1', item: '2' }>` |

### Returns

The default export function should return a `Blob` | `ArrayBuffer` | `TypedArray` | `DataView` | `ReadableStream` | `Response`.

> **Good to know**: `ImageResponse` satisfies this return type.

### Config exports

You can optionally configure the icon's metadata by exporting `size` and `contentType` variables from the `icon` or `apple-icon` route.

| Option                        | Type                                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [`size`](#size)               | `{ width: number; height: number }`                                                                             |
| [`contentType`](#contenttype) | `string` - [image MIME type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types) |

#### `size`

```tsx
// Archivo: icon.tsx | apple-icon.tsx switcher
export const size = { width: 32, height: 32 }

export default function Icon() {}
```

```jsx
// Archivo: icon.js | apple-icon.js switcher
export const size = { width: 32, height: 32 }

export default function Icon() {}
```

```html
// Archivo: <head> output
<link rel="icon" sizes="32x32" />
```

#### `contentType`

```tsx
// Archivo: icon.tsx | apple-icon.tsx switcher
export const contentType = 'image/png'

export default function Icon() {}
```

```jsx
// Archivo: icon.js | apple-icon.js switcher
export const contentType = 'image/png'

export default function Icon() {}
```

```html
// Archivo: <head> output
<link rel="icon" type="image/png" />
```

#### Route Segment Config

`icon` and `apple-icon` are specialized [Route Handlers](/docs/app/api-reference/file-conventions/route) that can use the same [route segment configuration](/docs/app/api-reference/file-conventions/route-segment-config) options as Pages and Layouts.

## Version History

| Version   | Changes                                              |
| --------- | ---------------------------------------------------- |
| `v16.0.0` | `params` is now a promise that resolves to an object |
| `v13.3.0` | `favicon` `icon` and `apple-icon` introduced         |



[⬆ Subir al inicio del capítulo](#)

---

<a id="metadata-files-api-reference"></a>

## Metadata Files API Reference

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/metadata](https://nextjs.org/docs/app/api-reference/file-conventions/metadata)  
> 📂 **Sección:** App > Api Reference > File Conventions > Metadata  
> 📝 **Descripción:** *API documentation for the metadata file conventions.*  

---

This section of the docs covers **Metadata file conventions**. File-based metadata can be defined by adding special metadata files to route segments.

Each file convention can be defined using a static file (e.g. `opengraph-image.jpg`), or a dynamic variant that uses code to generate the file (e.g. `opengraph-image.js`).

Once a file is defined, Next.js will automatically serve the file (with hashes in production for caching) and update the relevant head elements with the correct metadata, such as the asset's URL, file type, and image size.

> **Good to know**:
>
> - Special Route Handlers like [`sitemap.ts`](/docs/app/api-reference/file-conventions/metadata/sitemap), [`opengraph-image.tsx`](/docs/app/api-reference/file-conventions/metadata/opengraph-image), and [`icon.tsx`](/docs/app/api-reference/file-conventions/metadata/app-icons), and other [metadata files](/docs/app/api-reference/file-conventions/metadata) are cached by default.
> - If using along with [`proxy.ts`](/docs/app/api-reference/file-conventions/proxy), [configure the matcher](/docs/app/api-reference/file-conventions/proxy#matcher) to exclude the metadata files.



[⬆ Subir al inicio del capítulo](#)

---

<a id="manifestjson"></a>

## manifest.json

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest)  
> 📂 **Sección:** App > Api Reference > File Conventions > Metadata  
> 📝 **Descripción:** *API Reference for manifest.json file.*  

---

Add or generate a `manifest.(json|webmanifest)` file that matches the [Web Manifest Specification](https://developer.mozilla.org/docs/Web/Manifest) in the **root** of `app` directory to provide information about your web application for the browser.

## Static Manifest file

```json
// Archivo: app/manifest.json | app/manifest.webmanifest
{
  "name": "My Next.js Application",
  "short_name": "Next.js App",
  "description": "An application built with Next.js",
  "start_url": "/"
  // ...
}
```

## Generate a Manifest file

Add a `manifest.js` or `manifest.ts` file that returns a [`Manifest` object](#manifest-object).

> Good to know: `manifest.js` is a special Route Handlers that is cached by default unless it uses a [Request-time API](/docs/app/glossary#request-time-apis) or [dynamic config](/docs/app/guides/caching-without-cache-components#dynamic) option.

```ts
// Archivo: app/manifest.ts switcher
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Next.js App',
    short_name: 'Next.js App',
    description: 'Next.js App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

```js
// Archivo: app/manifest.js switcher
export default function manifest() {
  return {
    name: 'Next.js App',
    short_name: 'Next.js App',
    description: 'Next.js App',
    start_url: '/',
    display: 'standalone',
    background_color: '#fff',
    theme_color: '#fff',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  }
}
```

### Manifest Object

The manifest object contains an extensive list of options that may be updated due to new web standards. For information on all the current options, refer to the `MetadataRoute.Manifest` type in your code editor if using [TypeScript](/docs/app/api-reference/config/typescript#ide-plugin) or see the [MDN](https://developer.mozilla.org/docs/Web/Manifest) docs.



[⬆ Subir al inicio del capítulo](#)

---

<a id="opengraph-image-and-twitter-image"></a>

## opengraph-image and twitter-image

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image)  
> 📂 **Sección:** App > Api Reference > File Conventions > Metadata  
> 📝 **Descripción:** *API Reference for the Open Graph Image and Twitter Image file conventions.*  

---

The `opengraph-image` and `twitter-image` file conventions allow you to set Open Graph and Twitter images for a route segment.

They are useful for setting the images that appear on social networks and messaging apps when a user shares a link to your site.

There are two ways to set Open Graph and Twitter images:

- [Using image files (.jpg, .png, .gif)](#image-files-jpg-png-gif)
- [Using code to generate images (.js, .ts, .tsx)](#generate-images-using-code-js-ts-tsx)

## Image files (.jpg, .png, .gif)

Use an image file to set a route segment's shared image by placing an `opengraph-image` or `twitter-image` image file in the segment.

Next.js will evaluate the file and automatically add the appropriate tags to your app's `<head>` element.

| File convention                                 | Supported file types            |
| ----------------------------------------------- | ------------------------------- |
| [`opengraph-image`](#opengraph-image)           | `.jpg`, `.jpeg`, `.png`, `.gif` |
| [`twitter-image`](#twitter-image)               | `.jpg`, `.jpeg`, `.png`, `.gif` |
| [`opengraph-image.alt`](#opengraph-imagealttxt) | `.txt`                          |
| [`twitter-image.alt`](#twitter-imagealttxt)     | `.txt`                          |

> **Good to know**:
>
> The `twitter-image` file size must not exceed [5MB](https://developer.x.com/en/docs/x-for-websites/cards/overview/summary), and the `opengraph-image` file size must not exceed [8MB](https://developers.facebook.com/docs/sharing/webmasters/images). If the image file size exceeds these limits, the build will fail.

### `opengraph-image`

Add an `opengraph-image.(jpg|jpeg|png|gif)` image file to any route segment.

```html
// Archivo: <head> output
<meta property="og:image" content="<generated>" />
<meta property="og:image:type" content="<generated>" />
<meta property="og:image:width" content="<generated>" />
<meta property="og:image:height" content="<generated>" />
```

### `twitter-image`

Add a `twitter-image.(jpg|jpeg|png|gif)` image file to any route segment.

```html
// Archivo: <head> output
<meta name="twitter:image" content="<generated>" />
<meta name="twitter:image:type" content="<generated>" />
<meta name="twitter:image:width" content="<generated>" />
<meta name="twitter:image:height" content="<generated>" />
```

### `opengraph-image.alt.txt`

Add an accompanying `opengraph-image.alt.txt` file in the same route segment as the `opengraph-image.(jpg|jpeg|png|gif)` image its alt text.

```txt
// Archivo: opengraph-image.alt.txt
About Acme
```

```html
// Archivo: <head> output
<meta property="og:image:alt" content="About Acme" />
```

### `twitter-image.alt.txt`

Add an accompanying `twitter-image.alt.txt` file in the same route segment as the `twitter-image.(jpg|jpeg|png|gif)` image its alt text.

```txt
// Archivo: twitter-image.alt.txt
About Acme
```

```html
// Archivo: <head> output
<meta name="twitter:image:alt" content="About Acme" />
```

## Generate images using code (.js, .ts, .tsx)

In addition to using [literal image files](#image-files-jpg-png-gif), you can programmatically **generate** images using code.

Generate a route segment's shared image by creating an `opengraph-image` or `twitter-image` route that default exports a function.

| File convention   | Supported file types |
| ----------------- | -------------------- |
| `opengraph-image` | `.js`, `.ts`, `.tsx` |
| `twitter-image`   | `.js`, `.ts`, `.tsx` |

> **Good to know**:
>
> - By default, generated images are [**statically optimized**](/docs/app/glossary#prerendering) (generated at build time and cached) unless they use [Request-time APIs](/docs/app/glossary#request-time-apis) or uncached data.
> - You can generate multiple Images in the same file using [`generateImageMetadata`](/docs/app/api-reference/functions/generate-image-metadata).
> - `opengraph-image.js` and `twitter-image.js` are special Route Handlers that are cached by default unless it uses a [Request-time API](/docs/app/glossary#request-time-apis) or [dynamic config](/docs/app/guides/caching-without-cache-components#dynamic) option.

The easiest way to generate an image is to use the [ImageResponse](/docs/app/api-reference/functions/image-response) API from `next/og`.

```tsx
// Archivo: app/about/opengraph-image.tsx switcher
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Image metadata
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

const interSemiBold = await readFile(
  join(process.cwd(), 'assets/Inter-SemiBold.ttf')
)

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        About Acme
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
```

```jsx
// Archivo: app/about/opengraph-image.js switcher
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

// Image metadata
export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

const interSemiBold = await readFile(
  join(process.cwd(), 'assets/Inter-SemiBold.ttf')
)

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        About Acme
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'Inter',
          data: interSemiBold,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  )
}
```

```html
// Archivo: <head> output
<meta property="og:image" content="<generated>" />
<meta property="og:image:alt" content="About Acme" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

### Props

The default export function receives the following props:

#### `params` (optional)

A promise that resolves to an object containing the [dynamic route parameters](/docs/app/api-reference/file-conventions/dynamic-routes) object from the root segment down to the segment `opengraph-image` or `twitter-image` is colocated in.

> **Good to know**: If you use [`generateImageMetadata`](/docs/app/api-reference/functions/generate-image-metadata), the function will also receive an `id` prop that is a promise resolving to the `id` value from one of the items returned by `generateImageMetadata`.

```tsx
// Archivo: app/shop/[slug]/opengraph-image.tsx switcher
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```

```jsx
// Archivo: app/shop/[slug]/opengraph-image.js switcher
export default async function Image({ params }) {
  const { slug } = await params
  // ...
}
```

| Route                                      | URL         | `params`                           |
| ------------------------------------------ | ----------- | ---------------------------------- |
| `app/shop/opengraph-image.js`              | `/shop`     | `undefined`                        |
| `app/shop/[slug]/opengraph-image.js`       | `/shop/1`   | `Promise<{ slug: '1' }>`           |
| `app/shop/[tag]/[item]/opengraph-image.js` | `/shop/1/2` | `Promise<{ tag: '1', item: '2' }>` |

### Returns

The default export function should return a `Response`.

> **Good to know**: `ImageResponse` satisfies this return type.

### Config exports

You can optionally configure the image's metadata by exporting `alt`, `size`, and `contentType` variables from `opengraph-image` or `twitter-image` route.

| Option                        | Type                                                                                                            |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------- |
| [`alt`](#alt)                 | `string`                                                                                                        |
| [`size`](#size)               | `{ width: number; height: number }`                                                                             |
| [`contentType`](#contenttype) | `string` - [image MIME type](https://developer.mozilla.org/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types) |

#### `alt`

```tsx
// Archivo: opengraph-image.tsx | twitter-image.tsx switcher
export const alt = 'My images alt text'

export default function Image() {}
```

```jsx
// Archivo: opengraph-image.js | twitter-image.js switcher
export const alt = 'My images alt text'

export default function Image() {}
```

```html
// Archivo: <head> output
<meta property="og:image:alt" content="My images alt text" />
```

#### `size`

```tsx
// Archivo: opengraph-image.tsx | twitter-image.tsx switcher
export const size = { width: 1200, height: 630 }

export default function Image() {}
```

```jsx
// Archivo: opengraph-image.js | twitter-image.js switcher
export const size = { width: 1200, height: 630 }

export default function Image() {}
```

```html
// Archivo: <head> output
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

#### `contentType`

```tsx
// Archivo: opengraph-image.tsx | twitter-image.tsx switcher
export const contentType = 'image/png'

export default function Image() {}
```

```jsx
// Archivo: opengraph-image.js | twitter-image.js switcher
export const contentType = 'image/png'

export default function Image() {}
```

```html
// Archivo: <head> output
<meta property="og:image:type" content="image/png" />
```

#### Route Segment Config

`opengraph-image` and `twitter-image` are specialized [Route Handlers](/docs/app/api-reference/file-conventions/route) that can use the same [route segment configuration](/docs/app/api-reference/file-conventions/route-segment-config) options as Pages and Layouts.

### Examples

#### Using external data

This example uses the `params` object and external data to generate the image.

> **Good to know**:
> By default, this generated image will be statically optimized. You can configure the individual `fetch` [`options`](/docs/app/api-reference/functions/fetch) or route segments [options](/docs/app/guides/caching-without-cache-components#route-segment-config-revalidate) to change this behavior.

```tsx
// Archivo: app/posts/[slug]/opengraph-image.tsx switcher
import { ImageResponse } from 'next/og'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await fetch(`https://.../posts/${slug}`).then((res) =>
    res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    {
      ...size,
    }
  )
}
```

```jsx
// Archivo: app/posts/[slug]/opengraph-image.js switcher
import { ImageResponse } from 'next/og'

export const alt = 'About Acme'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image({ params }) {
  const { slug } = await params
  const post = await fetch(`https://.../posts/${slug}`).then((res) =>
    res.json()
  )

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {post.title}
      </div>
    ),
    {
      ...size,
    }
  )
}
```

#### Using Node.js runtime with local assets

These examples use the Node.js runtime to fetch a local image from the file system and pass it to the `<img>` `src` attribute, either as a base64 string or an `ArrayBuffer`. Place the local asset relative to the project root, not the example source file.

The asset doesn't depend on request data, so read it once at module scope. See [Predictable values](/docs/app/getting-started/caching#predictable-values).

```tsx
// Archivo: app/opengraph-image.tsx switcher
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

const logoData = await readFile(join(process.cwd(), 'logo.png'), 'base64')
const logoSrc = `data:image/png;base64,${logoData}`

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

```jsx
// Archivo: app/opengraph-image.js switcher
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

const logoData = await readFile(join(process.cwd(), 'logo.png'), 'base64')
const logoSrc = `data:image/png;base64,${logoData}`

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

Passing an `ArrayBuffer` to the `src` attribute of an `<img>` element is not part of the HTML spec. The rendering engine used by `next/og` supports it, but because TypeScript definitions follow the spec, you need a `@ts-expect-error` directive or similar to use this [feature](https://github.com/vercel/satori/issues/606#issuecomment-2144000453).

```tsx
// Archivo: app/opengraph-image.tsx switcher
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

const logoData = await readFile(join(process.cwd(), 'logo.png'))
const logoSrc = Uint8Array.from(logoData).buffer

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

```jsx
// Archivo: app/opengraph-image.js switcher
import { ImageResponse } from 'next/og'
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

const logoData = await readFile(join(process.cwd(), 'logo.png'))
const logoSrc = Uint8Array.from(logoData).buffer

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={logoSrc} height="100" />
      </div>
    )
  )
}
```

## Version History

| Version   | Changes                                              |
| --------- | ---------------------------------------------------- |
| `v16.0.0` | `params` is now a promise that resolves to an object |
| `v13.3.0` | `opengraph-image` and `twitter-image` introduced.    |



[⬆ Subir al inicio del capítulo](#)

---

<a id="robotstxt"></a>

## robots.txt

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots)  
> 📂 **Sección:** App > Api Reference > File Conventions > Metadata  
> 📝 **Descripción:** *API Reference for robots.txt file.*  

---

Add or generate a `robots.txt` file that matches the [Robots Exclusion Standard](https://en.wikipedia.org/wiki/Robots.txt#Standard) in the **root** of `app` directory to tell search engine crawlers which URLs they can access on your site.

## Static `robots.txt`

```txt
// Archivo: app/robots.txt
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

## Generate a Robots file

Add a `robots.js` or `robots.ts` file that returns a [`Robots` object](#robots-object).

> **Good to know**: `robots.js` is a special Route Handler that is cached by default unless it uses a [Request-time API](/docs/app/glossary#request-time-apis) or [dynamic config](/docs/app/guides/caching-without-cache-components#dynamic) option.

```ts
// Archivo: app/robots.ts switcher
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

```js
// Archivo: app/robots.js switcher
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/private/',
    },
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

Output:

```txt
User-Agent: *
Allow: /
Disallow: /private/

Sitemap: https://acme.com/sitemap.xml
```

### Customizing specific user agents

You can customize how individual search engine bots crawl your site by passing an array of user agents to the `rules` property. For example:

```ts
// Archivo: app/robots.ts switcher
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: '/private/',
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        disallow: ['/'],
      },
    ],
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

```js
// Archivo: app/robots.js switcher
export default function robots() {
  return {
    rules: [
      {
        userAgent: 'Googlebot',
        allow: ['/'],
        disallow: ['/private/'],
      },
      {
        userAgent: ['Applebot', 'Bingbot'],
        disallow: ['/'],
      },
    ],
    sitemap: 'https://acme.com/sitemap.xml',
  }
}
```

Output:

```txt
User-Agent: Googlebot
Allow: /
Disallow: /private/

User-Agent: Applebot
Disallow: /

User-Agent: Bingbot
Disallow: /

Sitemap: https://acme.com/sitemap.xml
```

### Non-standard directives

Some search engines support directives that aren't part of the [Robots Exclusion Standard](https://en.wikipedia.org/wiki/Robots.txt#Standard), such as `Request-Rate` (Seznam) or `Clean-param` (Yandex). Pass these through the `other` field on a rule. Keys preserve their casing and array values emit one line per entry, scoped to the rule's `User-Agent` block.

```ts
// Archivo: app/robots.ts switcher
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: 'SeznamBot',
        allow: '/',
        other: {
          'Request-Rate': '10/1m',
        },
      },
    ],
  }
}
```

```js
// Archivo: app/robots.js switcher
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      {
        userAgent: 'SeznamBot',
        allow: '/',
        other: {
          'Request-Rate': '10/1m',
        },
      },
    ],
  }
}
```

Output:

```txt
User-Agent: *
Allow: /

User-Agent: SeznamBot
Allow: /
Request-Rate: 10/1m
```

> **Good to know**: Values in `other` are passed through verbatim. Next.js does not validate directive names or values, so refer to the target search engine's documentation for the exact syntax.

### Robots object

```tsx
type Robots = {
  rules:
    | {
        userAgent?: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
        other?: Record<string, string | number | Array<string | number>>
      }
    | Array<{
        userAgent: string | string[]
        allow?: string | string[]
        disallow?: string | string[]
        crawlDelay?: number
        other?: Record<string, string | number | Array<string | number>>
      }>
  sitemap?: string | string[]
  host?: string
}
```

## Version History

| Version   | Changes                                                    |
| --------- | ---------------------------------------------------------- |
| `v16.3.0` | Added `other` field for non-standard per-agent directives. |
| `v13.3.0` | `robots` introduced.                                       |



[⬆ Subir al inicio del capítulo](#)

---

<a id="sitemapxml"></a>

## sitemap.xml

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap)  
> 📂 **Sección:** App > Api Reference > File Conventions > Metadata  
> 📝 **Descripción:** *API Reference for the sitemap.xml file.*  

---

`sitemap.(xml|js|ts)` is a special file that matches the [Sitemaps XML format](https://www.sitemaps.org/protocol.html) to help search engine crawlers index your site more efficiently.

### Sitemap files (.xml)

For smaller applications, you can create a `sitemap.xml` file and place it in the root of your `app` directory.

```xml
// Archivo: app/sitemap.xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### Generating a sitemap using code (.js, .ts)

You can use the `sitemap.(js|ts)` file convention to programmatically **generate** a sitemap by exporting a default function that returns an array of URLs. If using TypeScript, a [`Sitemap`](#returns) type is available.

> **Good to know**: `sitemap.js` is a special Route Handler that is cached by default unless it uses a [Request-time API](/docs/app/glossary#request-time-apis) or [dynamic config](/docs/app/guides/caching-without-cache-components#dynamic) option.

```ts
// Archivo: app/sitemap.ts switcher
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
```

```js
// Archivo: app/sitemap.js switcher
export default function sitemap() {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ]
}
```

Output:

```xml
// Archivo: acme.com/sitemap.xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://acme.com</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>yearly</changefreq>
    <priority>1</priority>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### Image Sitemaps

You can use `images` property to create image sitemaps. Learn more details in the [Google Developer Docs](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps).

```ts
// Archivo: app/sitemap.ts switcher
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: '2021-01-01',
      changeFrequency: 'weekly',
      priority: 0.5,
      images: ['https://example.com/image.jpg'],
    },
  ]
}
```

Output:

```xml
// Archivo: acme.com/sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
>
  <url>
    <loc>https://example.com</loc>
    <image:image>
      <image:loc>https://example.com/image.jpg</image:loc>
    </image:image>
    <lastmod>2021-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### Video Sitemaps

You can use `videos` property to create video sitemaps. Learn more details in the [Google Developer Docs](https://developers.google.com/search/docs/crawling-indexing/sitemaps/video-sitemaps).

```ts
// Archivo: app/sitemap.ts switcher
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://example.com',
      lastModified: '2021-01-01',
      changeFrequency: 'weekly',
      priority: 0.5,
      videos: [
        {
          title: 'example',
          thumbnail_loc: 'https://example.com/image.jpg',
          description: 'this is the description',
        },
      ],
    },
  ]
}
```

Output:

```xml
// Archivo: acme.com/sitemap.xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
  <url>
    <loc>https://example.com</loc>
    <video:video>
      <video:title>example</video:title>
      <video:thumbnail_loc>https://example.com/image.jpg</video:thumbnail_loc>
      <video:description>this is the description</video:description>
    </video:video>
    <lastmod>2021-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### Generate a localized Sitemap

```ts
// Archivo: app/sitemap.ts switcher
import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es',
          de: 'https://acme.com/de',
        },
      },
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/about',
          de: 'https://acme.com/de/about',
        },
      },
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/blog',
          de: 'https://acme.com/de/blog',
        },
      },
    },
  ]
}
```

```js
// Archivo: app/sitemap.js switcher
export default function sitemap() {
  return [
    {
      url: 'https://acme.com',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es',
          de: 'https://acme.com/de',
        },
      },
    },
    {
      url: 'https://acme.com/about',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/about',
          de: 'https://acme.com/de/about',
        },
      },
    },
    {
      url: 'https://acme.com/blog',
      lastModified: new Date(),
      alternates: {
        languages: {
          es: 'https://acme.com/es/blog',
          de: 'https://acme.com/de/blog',
        },
      },
    },
  ]
}
```

Output:

```xml
// Archivo: acme.com/sitemap.xml
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://acme.com</loc>
    <xhtml:link
      rel="alternate"
      hreflang="es"
      href="https://acme.com/es"/>
    <xhtml:link
      rel="alternate"
      hreflang="de"
      href="https://acme.com/de"/>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
  </url>
  <url>
    <loc>https://acme.com/about</loc>
    <xhtml:link
      rel="alternate"
      hreflang="es"
      href="https://acme.com/es/about"/>
    <xhtml:link
      rel="alternate"
      hreflang="de"
      href="https://acme.com/de/about"/>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
  </url>
  <url>
    <loc>https://acme.com/blog</loc>
    <xhtml:link
      rel="alternate"
      hreflang="es"
      href="https://acme.com/es/blog"/>
    <xhtml:link
      rel="alternate"
      hreflang="de"
      href="https://acme.com/de/blog"/>
    <lastmod>2023-04-06T15:02:24.021Z</lastmod>
  </url>
</urlset>
```

### Generating multiple sitemaps

While a single sitemap will work for most applications. For large web applications, you may need to split a sitemap into multiple files.

There are two ways you can create multiple sitemaps:

- By nesting `sitemap.(xml|js|ts)` inside multiple route segments e.g. `app/sitemap.xml` and `app/products/sitemap.xml`.
- By using the [`generateSitemaps`](/docs/app/api-reference/functions/generate-sitemaps) function.

For example, to split a sitemap using `generateSitemaps`, return an array of objects with the sitemap `id`. Then, use the `id` to generate the unique sitemaps.

```ts
// Archivo: app/product/sitemap.ts switcher
import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }))
}
```

```js
// Archivo: app/product/sitemap.js switcher
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap(props) {
  const id = await props.id
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }))
}
```

Your generated sitemaps will be available at `/.../sitemap/[id].xml`. For example, `/product/sitemap/1.xml`.

See the [`generateSitemaps` API reference](/docs/app/api-reference/functions/generate-sitemaps) for more information.

## Returns

The default function exported from `sitemap.(xml|ts|js)` should return an array of objects with the following properties:

```tsx
type Sitemap = Array<{
  url: string
  lastModified?: string | Date
  changeFrequency?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
  alternates?: {
    languages?: Languages<string>
  }
  images?: string[]
  videos?: Videos[]
}>
```

## Version History

| Version    | Changes                                                      |
| ---------- | ------------------------------------------------------------ |
| `v16.0.0`  | `id` is now a promise that resolves to a `string`.           |
| `v14.2.0`  | Add localizations support.                                   |
| `v13.4.14` | Add `changeFrequency` and `priority` attributes to sitemaps. |
| `v13.3.0`  | `sitemap` introduced.                                        |



[⬆ Subir al inicio del capítulo](#)

---

<a id="generateimagemetadata"></a>

## generateImageMetadata

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata](https://nextjs.org/docs/app/api-reference/functions/generate-image-metadata)  
> 📂 **Sección:** App > Api Reference > Functions  
> 📝 **Descripción:** *Learn how to generate multiple images in a single Metadata API special file.*  

---

You can use `generateImageMetadata` to generate different versions of one image or return multiple images for one route segment. This is useful for when you want to avoid hard-coding metadata values, such as for icons.

## Parameters

`generateImageMetadata` function accepts the following parameters:

#### `params` (optional)

An object containing the [dynamic route parameters](/docs/app/api-reference/file-conventions/dynamic-routes) object from the root segment down to the segment `generateImageMetadata` is called from.

```tsx
// Archivo: icon.tsx switcher
export function generateImageMetadata({
  params,
}: {
  params: { slug: string }
}) {
  // ...
}
```

```jsx
// Archivo: icon.js switcher
export function generateImageMetadata({ params }) {
  // ...
}
```

| Route                           | URL         | `params`                  |
| ------------------------------- | ----------- | ------------------------- |
| `app/shop/icon.js`              | `/shop`     | `undefined`               |
| `app/shop/[slug]/icon.js`       | `/shop/1`   | `{ slug: '1' }`           |
| `app/shop/[tag]/[item]/icon.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |

## Returns

The `generateImageMetadata` function should return an `array` of objects containing the image's metadata such as `alt` and `size`. In addition, each item **must** include an `id` value which will be passed as a promise to the props of the image generating function.

| Image Metadata Object | Type                                |
| --------------------- | ----------------------------------- |
| `id`                  | `string` (required)                 |
| `alt`                 | `string`                            |
| `size`                | `{ width: number; height: number }` |
| `contentType`         | `string`                            |

```tsx
// Archivo: icon.tsx switcher
import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: 'medium',
    },
  ]
}

export default async function Icon({ id }: { id: Promise<string | number> }) {
  const iconId = await id
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 88,
          background: '#000',
          color: '#fafafa',
        }}
      >
        Icon {iconId}
      </div>
    )
  )
}
```

```jsx
// Archivo: icon.js switcher
import { ImageResponse } from 'next/og'

export function generateImageMetadata() {
  return [
    {
      contentType: 'image/png',
      size: { width: 48, height: 48 },
      id: 'small',
    },
    {
      contentType: 'image/png',
      size: { width: 72, height: 72 },
      id: 'medium',
    },
  ]
}

export default async function Icon({ id }) {
  const iconId = await id
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 88,
          background: '#000',
          color: '#fafafa',
        }}
      >
        Icon {iconId}
      </div>
    )
  )
}
```

## Image generation function props

When using `generateImageMetadata`, the default export image generation function receives the following props:

#### `id`

A promise that resolves to the `id` value from one of the items returned by `generateImageMetadata`. The `id` will be a `string` or `number` depending on what was returned from `generateImageMetadata`.

```tsx
// Archivo: icon.tsx switcher
export default async function Icon({ id }: { id: Promise<string | number> }) {
  const iconId = await id
  // Use iconId to generate the image
}
```

```jsx
// Archivo: icon.js switcher
export default async function Icon({ id }) {
  const iconId = await id
  // Use iconId to generate the image
}
```

#### `params` (optional)

A promise that resolves to an object containing the [dynamic route parameters](/docs/app/api-reference/file-conventions/dynamic-routes) from the root segment down to the segment the image is colocated in.

```tsx
// Archivo: icon.tsx switcher
export default async function Icon({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // Use slug to generate the image
}
```

```jsx
// Archivo: icon.js switcher
export default async function Icon({ params }) {
  const { slug } = await params
  // Use slug to generate the image
}
```

### Examples

#### Using external data

This example uses the `params` object and external data to generate multiple [Open Graph images](/docs/app/api-reference/file-conventions/metadata/opengraph-image) for a route segment.

```tsx
// Archivo: app/products/[id]/opengraph-image.tsx switcher
import { ImageResponse } from 'next/og'
import { getCaptionForImage, getOGImages } from '@/app/utils/images'

export async function generateImageMetadata({
  params,
}: {
  params: { id: string }
}) {
  const images = await getOGImages(params.id)

  return images.map((image, idx) => ({
    id: idx,
    size: { width: 1200, height: 600 },
    alt: image.text,
    contentType: 'image/png',
  }))
}

export default async function Image({
  params,
  id,
}: {
  params: Promise<{ id: string }>
  id: Promise<number>
}) {
  const productId = (await params).id
  const imageId = await id
  const text = await getCaptionForImage(productId, imageId)

  return new ImageResponse(
    (
      <div
        style={
          {
            // ...
          }
        }
      >
        {text}
      </div>
    )
  )
}
```

```jsx
// Archivo: app/products/[id]/opengraph-image.js switcher
import { ImageResponse } from 'next/og'
import { getCaptionForImage, getOGImages } from '@/app/utils/images'

export async function generateImageMetadata({ params }) {
  const images = await getOGImages(params.id)

  return images.map((image, idx) => ({
    id: idx,
    size: { width: 1200, height: 600 },
    alt: image.text,
    contentType: 'image/png',
  }))
}

export default async function Image({ params, id }) {
  const productId = (await params).id
  const imageId = await id
  const text = await getCaptionForImage(productId, imageId)

  return new ImageResponse(
    (
      <div
        style={
          {
            // ...
          }
        }
      >
        {text}
      </div>
    )
  )
}
```

## Version History

| Version   | Changes                                                                                             |
| --------- | --------------------------------------------------------------------------------------------------- |
| `v16.0.0` | `id` passed to the Image generation function is now a promise that resolves to `string` or `number` |
| `v16.0.0` | `params` passed to the Image generation function is now a promise that resolves to an object        |
| `v13.3.0` | `generateImageMetadata` introduced.                                                                 |



[⬆ Subir al inicio del capítulo](#)

---

<a id="generatemetadata"></a>

## generateMetadata

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/functions/generate-metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)  
> 📂 **Sección:** App > Api Reference > Functions  
> 📝 **Descripción:** *Learn how to add Metadata to your Next.js application for improved search engine optimization (SEO) and web shareability.*  

---

You can use the `metadata` object or the `generateMetadata` function to define metadata.

## The `metadata` object

To define static metadata, export a [`Metadata` object](#metadata-fields) from a `layout.js` or `page.js` file.

```tsx
// Archivo: layout.tsx | page.tsx switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '...',
  description: '...',
}

export default function Page() {}
```

```jsx
// Archivo: layout.js | page.js switcher
export const metadata = {
  title: '...',
  description: '...',
}

export default function Page() {}
```

> See the [Metadata Fields](#metadata-fields) for a complete list of supported options.

## `generateMetadata` function

Dynamic metadata depends on **dynamic information**, such as the current route parameters, external data, or `metadata` in parent segments, can be set by exporting a `generateMetadata` function that returns a [`Metadata` object](#metadata-fields).

Resolving `generateMetadata` is part of rendering the page. If the page can be prerendered and `generateMetadata` doesn't introduce dynamic behavior, the resulting metadata is included in the page's initial HTML.

Otherwise the metadata resolved from `generateMetadata` [can be streamed](/docs/app/api-reference/functions/generate-metadata#streaming-metadata) after sending the initial UI.

```tsx
// Archivo: app/products/[id]/page.tsx switcher
import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const { id } = await params

  // fetch data
  const product = await fetch(`https://.../${id}`).then((res) => res.json())

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}

export default function Page({ params, searchParams }: Props) {}
```

```jsx
// Archivo: app/products/[id]/page.js switcher
export async function generateMetadata({ params, searchParams }, parent) {
  // read route params
  const { id } = await params

  // fetch data
  const product = await fetch(`https://.../${id}`).then((res) => res.json())

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []

  return {
    title: product.title,
    openGraph: {
      images: ['/some-specific-page-image.jpg', ...previousImages],
    },
  }
}

export default function Page({ params, searchParams }) {}
```

For type completion of `params` and `searchParams`, you can type the first argument with [`PageProps<'/route'>`](/docs/app/api-reference/file-conventions/page#page-props-helper) or [`LayoutProps<'/route'>`](/docs/app/api-reference/file-conventions/layout#layout-props-helper) for pages and layouts respectively.

> **Good to know**:
>
> - Metadata can be added to `layout.js` and `page.js` files.
> - Next.js will automatically resolve the metadata, and create the relevant `<head>` tags for the page.
> - The `metadata` object and `generateMetadata` function exports are **only supported in Server Components**.
> - You cannot export both the `metadata` object and `generateMetadata` function from the same route segment.
> - `fetch` requests inside `generateMetadata` are automatically [memoized](/docs/app/glossary#memoization) for the same data across `generateMetadata`, `generateStaticParams`, Layouts, Pages, and Server Components.
> - React [`cache` can be used](https://react.dev/reference/react/cache) if `fetch` is unavailable.
> - [File-based metadata](/docs/app/api-reference/file-conventions/metadata) has the higher priority and will override the `metadata` object and `generateMetadata` function.

## Why `generateMetadata` is Server Component only

`generateMetadata` and the `metadata` export are only supported in Server Components because metadata must be resolved on the server before the page component is rendered. This allows Next.js to include the metadata in the initial HTML response.

If you need to use Client Component features, keep your `page.tsx` as a Server Component and move the Client Component logic to a separate file:

```tsx
// Archivo: app/page.tsx switcher
import type { Metadata } from 'next'
import { InteractiveComponent } from './interactive-component'

export const metadata: Metadata = {
  title: 'My Page',
}

export default function Page() {
  return <InteractiveComponent />
}
```

```jsx
// Archivo: app/page.js switcher
import { InteractiveComponent } from './interactive-component'

export const metadata = {
  title: 'My Page',
}

export default function Page() {
  return <InteractiveComponent />
}
```

```tsx
// Archivo: app/interactive-component.tsx switcher
'use client'

export function InteractiveComponent() {
  // Client-side interactivity (hooks, event handlers, etc.)
}
```

```jsx
// Archivo: app/interactive-component.js switcher
'use client'

export function InteractiveComponent() {
  // Client-side interactivity (hooks, event handlers, etc.)
}
```

## Reference

### Parameters

`generateMetadata` function accepts the following parameters:

- `props` - An object containing the parameters of the current route:
  - `params` - An object containing the [dynamic route parameters](/docs/app/api-reference/file-conventions/dynamic-routes) object from the root segment down to the segment `generateMetadata` is called from. Examples:

    | Route                           | URL         | `params`                  |
    | ------------------------------- | ----------- | ------------------------- |
    | `app/shop/[slug]/page.js`       | `/shop/1`   | `{ slug: '1' }`           |
    | `app/shop/[tag]/[item]/page.js` | `/shop/1/2` | `{ tag: '1', item: '2' }` |
    | `app/shop/[...slug]/page.js`    | `/shop/1/2` | `{ slug: ['1', '2'] }`    |

  - `searchParams` - An object containing the current URL's [search params](https://developer.mozilla.org/docs/Learn/Common_questions/What_is_a_URL#parameters). Examples:

    | URL             | `searchParams`       |
    | --------------- | -------------------- |
    | `/shop?a=1`     | `{ a: '1' }`         |
    | `/shop?a=1&b=2` | `{ a: '1', b: '2' }` |
    | `/shop?a=1&a=2` | `{ a: ['1', '2'] }`  |

- `parent` - A promise of the resolved metadata from parent route segments.

### Returns

`generateMetadata` should return a [`Metadata` object](#metadata-fields) containing one or more metadata fields.

> **Good to know**:
>
> - If metadata doesn't depend on request information, it should be defined using the static [`metadata` object](#the-metadata-object) rather than `generateMetadata`.
> - `fetch` requests are automatically memoized for the same data across `generateMetadata`, `generateStaticParams`, Layouts, Pages, and Server Components. React [`cache` can be used](https://react.dev/reference/react/cache) if `fetch` is unavailable.
> - `searchParams` are only available in `page.js` segments.
> - The [`redirect()`](/docs/app/api-reference/functions/redirect) and [`notFound()`](/docs/app/api-reference/functions/not-found) Next.js methods can also be used inside `generateMetadata`.

### Metadata Fields

The following fields are supported:

#### `title`

The `title` attribute is used to set the title of the document. It can be defined as a simple [string](#string) or an optional [template object](#template).

##### String

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  title: 'Next.js',
}
```

```html
// Archivo: <head> output hideLineNumbers
<title>Next.js</title>
```

##### `default`

`title.default` can be used to provide a **fallback title** to child route segments that don't define a `title`.

```tsx
// Archivo: app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Acme',
  },
}
```

```tsx
// Archivo: app/about/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {}

// Output: <title>Acme</title>
```

##### `template`

`title.template` can be used to add a prefix or a suffix to `titles` defined in **child** route segments.

```tsx
// Archivo: app/layout.tsx switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Acme',
    default: 'Acme', // a default is required when creating a template
  },
}
```

```jsx
// Archivo: app/layout.js switcher
export const metadata = {
  title: {
    template: '%s | Acme',
    default: 'Acme', // a default is required when creating a template
  },
}
```

```tsx
// Archivo: app/about/page.tsx switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
}

// Output: <title>About | Acme</title>
```

```jsx
// Archivo: app/about/page.js switcher
export const metadata = {
  title: 'About',
}

// Output: <title>About | Acme</title>
```

> **Good to know**:
>
> - `title.template` applies to **child** route segments and **not** the segment it's defined in. This means:
>   - `title.default` is **required** when you add a `title.template`.
>   - `title.template` defined in `layout.js` will not apply to a `title` defined in a `page.js` of the same route segment.
>   - `title.template` defined in `page.js` has no effect because a page is always the terminating segment (it doesn't have any children route segments).
> - `title.template` has **no effect** if a route has not defined a `title` or `title.default`.

##### `absolute`

`title.absolute` can be used to provide a title that **ignores** `title.template` set in parent segments.

```tsx
// Archivo: app/layout.tsx switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | Acme',
  },
}
```

```jsx
// Archivo: app/layout.js switcher
export const metadata = {
  title: {
    template: '%s | Acme',
  },
}
```

```tsx
// Archivo: app/about/page.tsx switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: 'About',
  },
}

// Output: <title>About</title>
```

```jsx
// Archivo: app/about/page.js switcher
export const metadata = {
  title: {
    absolute: 'About',
  },
}

// Output: <title>About</title>
```

> **Good to know**:
>
> - `layout.js`
>   - `title` (string) and `title.default` define the default title for child segments (that do not define their own `title`). It will augment `title.template` from the closest parent segment if it exists.
>   - `title.absolute` defines the default title for child segments. It ignores `title.template` from parent segments.
>   - `title.template` defines a new title template for child segments.
> - `page.js`
>   - If a page does not define its own title the closest parents resolved title will be used.
>   - `title` (string) defines the routes title. It will augment `title.template` from the closest parent segment if it exists.
>   - `title.absolute` defines the route title. It ignores `title.template` from parent segments.
>   - `title.template` has no effect in `page.js` because a page is always the terminating segment of a route.

### `description`

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  description: 'The React Framework for the Web',
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta name="description" content="The React Framework for the Web" />
```

### Other fields

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  generator: 'Next.js',
  applicationName: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: ['Next.js', 'React', 'JavaScript'],
  authors: [{ name: 'Seb' }, { name: 'Josh', url: 'https://nextjs.org' }],
  creator: 'Jiachi Liu',
  publisher: 'Sebastian Markbåge',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta name="application-name" content="Next.js" />
<meta name="author" content="Seb" />
<link rel="author" href="https://nextjs.org" />
<meta name="author" content="Josh" />
<meta name="generator" content="Next.js" />
<meta name="keywords" content="Next.js,React,JavaScript" />
<meta name="referrer" content="origin-when-cross-origin" />
<meta name="creator" content="Jiachi Liu" />
<meta name="publisher" content="Sebastian Markbåge" />
<meta name="format-detection" content="telephone=no, address=no, email=no" />
```

#### `metadataBase`

`metadataBase` is a convenience option to set a base URL prefix for `metadata` fields that require a fully qualified URL.

- `metadataBase` allows URL-based `metadata` fields defined in the **current route segment and below** to use a **relative path** instead of an otherwise required absolute URL.
- The field's relative path will be composed with `metadataBase` to form a fully qualified URL.

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  metadataBase: new URL('https://acme.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    images: '/og-image.png',
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<link rel="canonical" href="https://acme.com" />
<link rel="alternate" hreflang="en-US" href="https://acme.com/en-US" />
<link rel="alternate" hreflang="de-DE" href="https://acme.com/de-DE" />
<meta property="og:image" content="https://acme.com/og-image.png" />
```

> **Good to know**:
>
> - `metadataBase` is typically set in root `app/layout.js` to apply to URL-based `metadata` fields across all routes.
> - When `generateMetadata` uses `'use cache'`, its return value must be serializable. `URL` instances are not supported by Cache Functions, so values such as `metadataBase` should be returned as strings (for example, `url.toString()`). See [`use cache` serialization requirements](/docs/app/api-reference/directives/use-cache#serialization).
> - All URL-based `metadata` fields that require absolute URLs can be configured with a `metadataBase` option.
> - `metadataBase` can contain a subdomain e.g. `https://app.acme.com` or base path e.g. `https://acme.com/start/from/here`
> - If a `metadata` field provides an absolute URL, `metadataBase` will be ignored.
> - Using a relative path in a URL-based `metadata` field without configuring a `metadataBase` will cause a build error.
> - Next.js will normalize duplicate slashes between `metadataBase` (e.g. `https://acme.com/`) and a relative field (e.g. `/path`) to a single slash (e.g. `https://acme.com/path`)

#### URL Composition

URL composition favors developer intent over default directory traversal semantics.

- Trailing slashes between `metadataBase` and `metadata` fields are normalized.
- An "absolute" path in a `metadata` field (that typically would replace the whole URL path) is treated as a "relative" path (starting from the end of `metadataBase`).

For example, given the following `metadataBase`:

```tsx
// Archivo: app/layout.tsx switcher
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://acme.com'),
}
```

```jsx
// Archivo: app/layout.js switcher
export const metadata = {
  metadataBase: new URL('https://acme.com'),
}
```

Any `metadata` fields that inherit the above `metadataBase` and set their own value will be resolved as follows:

| `metadata` field                 | Resolved URL                     |
| -------------------------------- | -------------------------------- |
| `/`                              | `https://acme.com`               |
| `./`                             | `https://acme.com`               |
| `payments`                       | `https://acme.com/payments`      |
| `/payments`                      | `https://acme.com/payments`      |
| `./payments`                     | `https://acme.com/payments`      |
| `../payments`                    | `https://acme.com/payments`      |
| `https://beta.acme.com/payments` | `https://beta.acme.com/payments` |

### `openGraph`

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    url: 'https://nextjs.org',
    siteName: 'Next.js',
    images: [
      {
        url: 'https://nextjs.org/og.png', // Must be an absolute URL
        width: 800,
        height: 600,
      },
      {
        url: 'https://nextjs.org/og-alt.png', // Must be an absolute URL
        width: 1800,
        height: 1600,
        alt: 'My custom alt',
      },
    ],
    videos: [
      {
        url: 'https://nextjs.org/video.mp4', // Must be an absolute URL
        width: 800,
        height: 600,
      },
    ],
    audio: [
      {
        url: 'https://nextjs.org/audio.mp3', // Must be an absolute URL
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta property="og:title" content="Next.js" />
<meta property="og:description" content="The React Framework for the Web" />
<meta property="og:url" content="https://nextjs.org/" />
<meta property="og:site_name" content="Next.js" />
<meta property="og:locale" content="en_US" />
<meta property="og:image" content="https://nextjs.org/og.png" />
<meta property="og:image:width" content="800" />
<meta property="og:image:height" content="600" />
<meta property="og:image" content="https://nextjs.org/og-alt.png" />
<meta property="og:image:width" content="1800" />
<meta property="og:image:height" content="1600" />
<meta property="og:image:alt" content="My custom alt" />
<meta property="og:video" content="https://nextjs.org/video.mp4" />
<meta property="og:video:width" content="800" />
<meta property="og:video:height" content="600" />
<meta property="og:audio" content="https://nextjs.org/audio.mp3" />
<meta property="og:type" content="website" />
```

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  openGraph: {
    title: 'Next.js',
    description: 'The React Framework for the Web',
    type: 'article',
    publishedTime: '2023-01-01T00:00:00.000Z',
    authors: ['Seb', 'Josh'],
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta property="og:title" content="Next.js" />
<meta property="og:description" content="The React Framework for the Web" />
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2023-01-01T00:00:00.000Z" />
<meta property="article:author" content="Seb" />
<meta property="article:author" content="Josh" />
```

> **Good to know**:
>
> - It may be more convenient to use the [file-based Metadata API](/docs/app/api-reference/file-conventions/metadata/opengraph-image#image-files-jpg-png-gif) for Open Graph images. Rather than having to sync the config export with actual files, the file-based API will automatically generate the correct metadata for you.

### `robots`

```tsx
// Archivo: layout.tsx | page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta name="robots" content="index, follow" />
<meta
  name="googlebot"
  content="index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"
/>
```

### `icons`

> **Good to know**: We recommend using the [file-based Metadata API](/docs/app/api-reference/file-conventions/metadata/app-icons#image-files-ico-jpg-png) for icons where possible. Rather than having to sync the config export with actual files, the file-based API will automatically generate the correct metadata for you.

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  icons: {
    icon: '/icon.png',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<link rel="shortcut icon" href="/shortcut-icon.png" />
<link rel="icon" href="/icon.png" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
<link
  rel="apple-touch-icon-precomposed"
  href="/apple-touch-icon-precomposed.png"
/>
```

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  icons: {
    icon: [
      { url: '/icon.png' },
      new URL('/icon.png', 'https://example.com'),
      { url: '/icon-dark.png', media: '(prefers-color-scheme: dark)' },
    ],
    shortcut: ['/shortcut-icon.png'],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-x3.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/apple-touch-icon-precomposed.png',
      },
    ],
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<link rel="shortcut icon" href="/shortcut-icon.png" />
<link rel="icon" href="/icon.png" />
<link rel="icon" href="https://example.com/icon.png" />
<link rel="icon" href="/icon-dark.png" media="(prefers-color-scheme: dark)" />
<link rel="apple-touch-icon" href="/apple-icon.png" />
<link
  rel="apple-touch-icon-precomposed"
  href="/apple-touch-icon-precomposed.png"
/>
<link
  rel="apple-touch-icon"
  href="/apple-icon-x3.png"
  sizes="180x180"
  type="image/png"
/>
```

> **Good to know**: The `msapplication-*` meta tags are no longer supported in Chromium builds of Microsoft Edge, and thus no longer needed.

### `themeColor`

> **Deprecated**: The `themeColor` option in `metadata` is deprecated as of Next.js 14. Please use the [`viewport` configuration](/docs/app/api-reference/functions/generate-viewport) instead.

### `colorScheme`

> **Deprecated**: The `colorScheme` option in `metadata` is deprecated as of Next.js 14. Please use the [`viewport` configuration](/docs/app/api-reference/functions/generate-viewport) instead.

### `manifest`

A web application manifest, as defined in the [Web Application Manifest specification](https://developer.mozilla.org/docs/Web/Manifest).

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  manifest: 'https://nextjs.org/manifest.json',
}
```

```html
// Archivo: <head> output hideLineNumbers
<link rel="manifest" href="https://nextjs.org/manifest.json" />
```

### `twitter`

The Twitter specification is (surprisingly) used for more than just X (formerly known as Twitter).

Learn more about the [Twitter Card markup reference](https://developer.x.com/en/docs/twitter-for-websites/cards/overview/markup).

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: ['https://nextjs.org/og.png'], // Must be an absolute URL
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site:id" content="1467726470533754880" />
<meta name="twitter:creator" content="@nextjs" />
<meta name="twitter:creator:id" content="1467726470533754880" />
<meta name="twitter:title" content="Next.js" />
<meta name="twitter:description" content="The React Framework for the Web" />
<meta name="twitter:image" content="https://nextjs.org/og.png" />
```

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  twitter: {
    card: 'app',
    title: 'Next.js',
    description: 'The React Framework for the Web',
    siteId: '1467726470533754880',
    creator: '@nextjs',
    creatorId: '1467726470533754880',
    images: {
      url: 'https://nextjs.org/og.png',
      alt: 'Next.js Logo',
    },
    app: {
      name: 'twitter_app',
      id: {
        iphone: 'twitter_app://iphone',
        ipad: 'twitter_app://ipad',
        googleplay: 'twitter_app://googleplay',
      },
      url: {
        iphone: 'https://iphone_url',
        ipad: 'https://ipad_url',
      },
    },
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta name="twitter:site:id" content="1467726470533754880" />
<meta name="twitter:creator" content="@nextjs" />
<meta name="twitter:creator:id" content="1467726470533754880" />
<meta name="twitter:title" content="Next.js" />
<meta name="twitter:description" content="The React Framework for the Web" />
<meta name="twitter:card" content="app" />
<meta name="twitter:image" content="https://nextjs.org/og.png" />
<meta name="twitter:image:alt" content="Next.js Logo" />
<meta name="twitter:app:name:iphone" content="twitter_app" />
<meta name="twitter:app:id:iphone" content="twitter_app://iphone" />
<meta name="twitter:app:id:ipad" content="twitter_app://ipad" />
<meta name="twitter:app:id:googleplay" content="twitter_app://googleplay" />
<meta name="twitter:app:url:iphone" content="https://iphone_url" />
<meta name="twitter:app:url:ipad" content="https://ipad_url" />
<meta name="twitter:app:name:ipad" content="twitter_app" />
<meta name="twitter:app:name:googleplay" content="twitter_app" />
```

### `viewport`

> **Deprecated**: The `viewport` option in `metadata` is deprecated as of Next.js 14. Please use the [`viewport` configuration](/docs/app/api-reference/functions/generate-viewport) instead.

### `verification`

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  verification: {
    google: 'google',
    yandex: 'yandex',
    yahoo: 'yahoo',
    other: {
      me: ['my-email', 'my-link'],
    },
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta name="google-site-verification" content="google" />
<meta name="y_key" content="yahoo" />
<meta name="yandex-verification" content="yandex" />
<meta name="me" content="my-email" />
<meta name="me" content="my-link" />
```

### `appleWebApp`

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  itunes: {
    appId: 'myAppStoreID',
    appArgument: 'myAppArgument',
  },
  appleWebApp: {
    title: 'Apple Web App',
    statusBarStyle: 'black-translucent',
    startupImage: [
      '/assets/startup/apple-touch-startup-image-768x1004.png',
      {
        url: '/assets/startup/apple-touch-startup-image-1536x2008.png',
        media: '(device-width: 768px) and (device-height: 1024px)',
      },
    ],
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta
  name="apple-itunes-app"
  content="app-id=myAppStoreID, app-argument=myAppArgument"
/>
<meta name="mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Apple Web App" />
<link
  href="/assets/startup/apple-touch-startup-image-768x1004.png"
  rel="apple-touch-startup-image"
/>
<link
  href="/assets/startup/apple-touch-startup-image-1536x2008.png"
  media="(device-width: 768px) and (device-height: 1024px)"
  rel="apple-touch-startup-image"
/>
<meta
  name="apple-mobile-web-app-status-bar-style"
  content="black-translucent"
/>
```

### `alternates`

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  alternates: {
    canonical: 'https://nextjs.org',
    languages: {
      'en-US': 'https://nextjs.org/en-US',
      'de-DE': 'https://nextjs.org/de-DE',
    },
    media: {
      'only screen and (max-width: 600px)': 'https://nextjs.org/mobile',
    },
    types: {
      'application/rss+xml': 'https://nextjs.org/rss',
    },
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<link rel="canonical" href="https://nextjs.org" />
<link rel="alternate" hreflang="en-US" href="https://nextjs.org/en-US" />
<link rel="alternate" hreflang="de-DE" href="https://nextjs.org/de-DE" />
<link
  rel="alternate"
  media="only screen and (max-width: 600px)"
  href="https://nextjs.org/mobile"
/>
<link
  rel="alternate"
  type="application/rss+xml"
  href="https://nextjs.org/rss"
/>
```

### `appLinks`

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  appLinks: {
    ios: {
      url: 'https://nextjs.org/ios',
      app_store_id: 'app_store_id',
    },
    android: {
      package: 'com.example.android/package',
      app_name: 'app_name_android',
    },
    web: {
      url: 'https://nextjs.org/web',
      should_fallback: true,
    },
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta property="al:ios:url" content="https://nextjs.org/ios" />
<meta property="al:ios:app_store_id" content="app_store_id" />
<meta property="al:android:package" content="com.example.android/package" />
<meta property="al:android:app_name" content="app_name_android" />
<meta property="al:web:url" content="https://nextjs.org/web" />
<meta property="al:web:should_fallback" content="true" />
```

### `archives`

Describes a collection of records, documents, or other materials of historical interest ([source](https://www.w3.org/TR/2011/WD-html5-20110113/links.html#rel-archives)).

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  archives: ['https://nextjs.org/13'],
}
```

```html
// Archivo: <head> output hideLineNumbers
<link rel="archives" href="https://nextjs.org/13" />
```

### `assets`

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  assets: ['https://nextjs.org/assets'],
}
```

```html
// Archivo: <head> output hideLineNumbers
<link rel="assets" href="https://nextjs.org/assets" />
```

### `bookmarks`

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  bookmarks: ['https://nextjs.org/13'],
}
```

```html
// Archivo: <head> output hideLineNumbers
<link rel="bookmarks" href="https://nextjs.org/13" />
```

### `pagination`

Describes the previous and next pages in a paginated sequence.

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  pagination: {
    previous: 'https://nextjs.org/blog?page=1',
    next: 'https://nextjs.org/blog?page=3',
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<link rel="prev" href="https://nextjs.org/blog?page=1" />
<link rel="next" href="https://nextjs.org/blog?page=3" />
```

### `category`

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  category: 'technology',
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta name="category" content="technology" />
```

### `facebook`

You can connect a Facebook app or Facebook account to your webpage for certain Facebook Social Plugins [Facebook Documentation](https://developers.facebook.com/docs/plugins/comments/#moderation-setup-instructions)

> **Good to know**: You can specify either appId or admins, but not both.

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  facebook: {
    appId: '12345678',
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta property="fb:app_id" content="12345678" />
```

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  facebook: {
    admins: '12345678',
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta property="fb:admins" content="12345678" />
```

If you want to generate multiple fb:admins meta tags you can use array value.

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  facebook: {
    admins: ['12345678', '87654321'],
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta property="fb:admins" content="12345678" />
<meta property="fb:admins" content="87654321" />
```

### `pinterest`

You can enable or disable [Pinterest Rich Pins](https://developers.pinterest.com/docs/web-features/rich-pins-overview/) on your webpage.

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  pinterest: {
    richPin: true,
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta name="pinterest-rich-pin" content="true" />
```

### `other`

All metadata options should be covered using the built-in support. However, there may be custom metadata tags specific to your site, or brand new metadata tags just released. You can use the `other` option to render any custom metadata tag.

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  other: {
    custom: 'meta',
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta name="custom" content="meta" />
```

If you want to generate multiple same key meta tags you can use array value.

```jsx
// Archivo: layout.js | page.js
export const metadata = {
  other: {
    custom: ['meta1', 'meta2'],
  },
}
```

```html
// Archivo: <head> output hideLineNumbers
<meta name="custom" content="meta1" /> <meta name="custom" content="meta2" />
```

### Types

You can add type safety to your metadata by using the `Metadata` type. If you are using the [built-in TypeScript plugin](/docs/app/api-reference/config/typescript) in your IDE, you do not need to manually add the type, but you can still explicitly add it if you want.

#### `metadata` object

```tsx
// Archivo: layout.tsx | page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Next.js',
}
```

#### `generateMetadata` function

##### Regular function

```tsx
// Archivo: layout.tsx | page.tsx
import type { Metadata } from 'next'

export function generateMetadata(): Metadata {
  return {
    title: 'Next.js',
  }
}
```

##### Async function

```tsx
// Archivo: layout.tsx | page.tsx
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Next.js',
  }
}
```

##### With segment props

```tsx
// Archivo: layout.tsx | page.tsx
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export function generateMetadata({ params, searchParams }: Props): Metadata {
  return {
    title: 'Next.js',
  }
}

export default function Page({ params, searchParams }: Props) {}
```

##### With parent metadata

```tsx
// Archivo: layout.tsx | page.tsx
import type { Metadata, ResolvingMetadata } from 'next'

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  return {
    title: 'Next.js',
  }
}
```

##### JavaScript Projects

For JavaScript projects, you can use JSDoc to add type safety.

```js
// Archivo: layout.js | page.js
/** @type {import("next").Metadata} */
export const metadata = {
  title: 'Next.js',
}
```

### Unsupported Metadata

The following metadata types do not currently have built-in support. However, they can still be rendered in the layout or page itself.

| Metadata                      | Recommendation                                                                                                                                                                                                                               |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `<meta http-equiv="...">`     | Use appropriate HTTP Headers via [`redirect()`](/docs/app/api-reference/functions/redirect), [Proxy](/docs/app/api-reference/file-conventions/proxy#nextresponse), [Security Headers](/docs/app/api-reference/config/next-config-js/headers) |
| `<base>`                      | Render the tag in the layout or page itself.                                                                                                                                                                                                 |
| `<noscript>`                  | Render the tag in the layout or page itself.                                                                                                                                                                                                 |
| `<style>`                     | Learn more about [styling in Next.js](/docs/app/getting-started/css).                                                                                                                                                                        |
| `<script>`                    | Learn more about [using scripts](/docs/app/guides/scripts).                                                                                                                                                                                  |
| `<link rel="stylesheet" />`   | `import` stylesheets directly in the layout or page itself.                                                                                                                                                                                  |
| `<link rel="preload" />`      | Use [ReactDOM preload method](#link-relpreload)                                                                                                                                                                                              |
| `<link rel="preconnect" />`   | Use [ReactDOM preconnect method](#link-relpreconnect)                                                                                                                                                                                        |
| `<link rel="dns-prefetch" />` | Use [ReactDOM prefetchDNS method](#link-reldns-prefetch)                                                                                                                                                                                     |

### Resource hints

The `<link>` element has a number of `rel` keywords that can be used to hint to the browser that an external resource is likely to be needed. The browser uses this information to apply preloading optimizations depending on the keyword.

While the Metadata API doesn't directly support these hints, you can use new [`ReactDOM` methods](https://github.com/facebook/react/pull/26237) to safely insert them into the `<head>` of the document.

```tsx
// Archivo: app/preload-resources.tsx switcher
'use client'

import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload('...', { as: '...' })
  ReactDOM.preconnect('...', { crossOrigin: '...' })
  ReactDOM.prefetchDNS('...')

  return '...'
}
```

```jsx
// Archivo: app/preload-resources.js switcher
'use client'

import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload('...', { as: '...' })
  ReactDOM.preconnect('...', { crossOrigin: '...' })
  ReactDOM.prefetchDNS('...')

  return '...'
}
```

#### `<link rel="preload">`

Start loading a resource early in the page rendering (browser) lifecycle. [MDN Docs](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/preload).

```tsx
ReactDOM.preload(href: string, options: { as: string })
```

```html
// Archivo: <head> output hideLineNumbers
<link rel="preload" href="..." as="..." />
```

##### `<link rel="preconnect">`

Preemptively initiate a connection to an origin. [MDN Docs](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/preconnect).

```tsx
ReactDOM.preconnect(href: string, options?: { crossOrigin?: string })
```

```html
// Archivo: <head> output hideLineNumbers
<link rel="preconnect" href="..." crossorigin />
```

#### `<link rel="dns-prefetch">`

Attempt to resolve a domain name before resources get requested. [MDN Docs](https://developer.mozilla.org/docs/Web/HTML/Attributes/rel/dns-prefetch).

```tsx
ReactDOM.prefetchDNS(href: string)
```

```html
// Archivo: <head> output hideLineNumbers
<link rel="dns-prefetch" href="..." />
```

> **Good to know**:
>
> - These methods are currently only supported in Client Components, which are still Server Side Rendered on initial page load.
> - Next.js in-built features such as `next/font`, `next/image` and `next/script` automatically handle relevant resource hints.

## Behavior

### Default Fields

There are two default `meta` tags that are always added even if a route doesn't define metadata:

- The [meta charset tag](https://developer.mozilla.org/docs/Web/HTML/Element/meta#attr-charset) sets the character encoding for the website.
- The [meta viewport tag](https://developer.mozilla.org/docs/Web/HTML/Viewport_meta_tag) sets the viewport width and scale for the website to adjust for different devices.

```html
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

> **Good to know**: You can overwrite the default [`viewport`](/docs/app/api-reference/functions/generate-metadata#viewport) meta tag.

### Streaming metadata

Streaming metadata allows Next.js to render and send the initial UI to the browser, without waiting for `generateMetadata` to complete.

When `generateMetadata` resolves, the resulting metadata tags are appended to the `<body>` tag. We have verified that metadata is interpreted correctly by bots that execute JavaScript and inspect the full DOM (e.g. `Googlebot`).

For **HTML-limited bots** that can’t execute JavaScript (e.g. `facebookexternalhit`), metadata continues to block page rendering. The resulting metadata will be available in the `<head>` tag.

Next.js automatically detects **HTML-limited bots** by looking at the User Agent header. You can use the [`htmlLimitedBots`](/docs/app/api-reference/config/next-config-js/htmlLimitedBots) option in your Next.js config file to override the default [User Agent list](https://github.com/vercel/next.js/blob/canary/packages/next/src/shared/lib/router/utils/html-bots.ts).

To fully disable streaming metadata:

```ts
// Archivo: next.config.ts switcher
import type { NextConfig } from 'next'

const config: NextConfig = {
  htmlLimitedBots: /.*/,
}

export default config
```

```js
// Archivo: next.config.js switcher
module.exports = {
  htmlLimitedBots: /.*/,
}
```

Streaming metadata improves perceived performance by reducing [TTFB](https://developer.mozilla.org/docs/Glossary/Time_to_first_byte) and can help lowering [LCP](https://developer.mozilla.org/docs/Glossary/Largest_contentful_paint) time.

Overriding `htmlLimitedBots` could lead to longer response times. Streaming metadata is an advanced feature, and the default should be sufficient for most cases.

### With Cache Components

When [Cache Components](/docs/app/getting-started/caching) is enabled, `generateMetadata` follows the same rules as other components. If metadata accesses runtime data (`cookies()`, `headers()`, `params`, `searchParams`) or performs uncached data fetching, it defers to request time.

How Next.js handles this depends on the rest of your page:

- **If other parts also defer to request time**: Prerendering generates a static shell, and metadata streams in with other deferred content.
- **If the page or layout is otherwise fully prerenderable**: Next.js requires an explicit choice: cache the data if possible, or signal that deferred rendering is intentional.

Streaming metadata at runtime while the rest of the page is fully prerenderable is not common. To ensure this behavior is intentional, an error is raised indicating which page or layout needs to be handled.

To resolve this, you have two options. If metadata depends on external data but not runtime data, use `use cache`:

```tsx
// Archivo: app/page.tsx highlight={2}
export async function generateMetadata() {
  'use cache'
  const { title, description } = await db.query('site-metadata')
  return { title, description }
}
```

If metadata genuinely requires runtime data, add a dynamic marker component to your page:

```tsx
// Archivo: app/page.tsx highlight={11-14,19,31}
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { connection } from 'next/server'

export async function generateMetadata() {
  const token = (await cookies()).get('token')?.value
  // ... use token to fetch personalized metadata
  return { title: 'Personalized Title' }
}

const Connection = async () => {
  await connection()
  return null
}

async function DynamicMarker() {
  return (
    ``<Suspense>``
  )
}

export default function Page() {
  // DO NOT place await connection() here
  // doing so prevents the article tag content from
  // being included in the static shell
  return (
    <>
      <article>Static content</article>
      <DynamicMarker />
    </>
  )
}
```

The `DynamicMarker` component renders nothing but tells Next.js the page has intentional dynamic content. By wrapping it in Suspense, the static content still prerenders normally.

See [Next.js encountered runtime data in `generateMetadata()`](/docs/messages/blocking-prerender-metadata-runtime) and [Next.js encountered uncached data in `generateMetadata()`](/docs/messages/blocking-prerender-metadata-dynamic) for full fix options and trade-offs.

### Ordering

Metadata is evaluated in order, starting from the root segment down to the segment closest to the final `page.js` segment. For example:

1. `app/layout.tsx` (Root Layout)
2. `app/blog/layout.tsx` (Nested Blog Layout)
3. `app/blog/[slug]/page.tsx` (Blog Page)

### Merging

Following the [evaluation order](#ordering), Metadata objects exported from multiple segments in the same route are **shallowly** merged together to form the final metadata output of a route. Duplicate keys are **replaced** based on their ordering.

This means metadata with nested fields such as [`openGraph`](/docs/app/api-reference/functions/generate-metadata#opengraph) and [`robots`](/docs/app/api-reference/functions/generate-metadata#robots) that are defined in an earlier segment are **overwritten** by the last segment to define them.

#### Overwriting fields

```jsx
// Archivo: app/layout.js
export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme is a...',
  },
}
```

```jsx
// Archivo: app/blog/page.js
export const metadata = {
  title: 'Blog',
  openGraph: {
    title: 'Blog',
  },
}

// Output:
// <title>Blog</title>
// <meta property="og:title" content="Blog" />
```

In the example above:

- `title` from `app/layout.js` is **replaced** by `title` in `app/blog/page.js`.
- All `openGraph` fields from `app/layout.js` are **replaced** in `app/blog/page.js` because `app/blog/page.js` sets `openGraph` metadata. Note the absence of `openGraph.description`.

If you'd like to share some nested fields between segments while overwriting others, you can pull them out into a separate variable:

```jsx
// Archivo: app/shared-metadata.js
export const openGraphImage = { images: ['http://...'] }
```

```jsx
// Archivo: app/page.js
import { openGraphImage } from './shared-metadata'

export const metadata = {
  openGraph: {
    ...openGraphImage,
    title: 'Home',
  },
}
```

```jsx
// Archivo: app/about/page.js
import { openGraphImage } from '../shared-metadata'

export const metadata = {
  openGraph: {
    ...openGraphImage,
    title: 'About',
  },
}
```

In the example above, the OG image is shared between `app/layout.js` and `app/about/page.js` while the titles are different.

#### Inheriting fields

```jsx
// Archivo: app/layout.js
export const metadata = {
  title: 'Acme',
  openGraph: {
    title: 'Acme',
    description: 'Acme is a...',
  },
}
```

```jsx
// Archivo: app/about/page.js
export const metadata = {
  title: 'About',
}

// Output:
// <title>About</title>
// <meta property="og:title" content="Acme" />
// <meta property="og:description" content="Acme is a..." />
```

**Notes**

- `title` from `app/layout.js` is **replaced** by `title` in `app/about/page.js`.
- All `openGraph` fields from `app/layout.js` are **inherited** in `app/about/page.js` because `app/about/page.js` doesn't set `openGraph` metadata.

## Version History

| Version   | Changes                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v15.2.0` | Introduced streaming support to `generateMetadata`.                                                                                                     |
| `v14.0.0` | `viewport`, `themeColor`, and `colorScheme` deprecated in favor of the [`viewport` configuration](/docs/app/api-reference/functions/generate-viewport). |
| `v13.2.0` | `metadata` and `generateMetadata` introduced.                                                                                                           |



[⬆ Subir al inicio del capítulo](#)

---

<a id="generatesitemaps"></a>

## generateSitemaps

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps](https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps)  
> 📂 **Sección:** App > Api Reference > Functions  
> 📝 **Descripción:** *Learn how to use the generateSiteMaps function to create multiple sitemaps for your application.*  

---

You can use the `generateSitemaps` function to generate multiple sitemaps for your application.

## Returns

The `generateSitemaps` returns an array of objects with an `id` property.

## URLs

Your generated sitemaps will be available at `/.../sitemap/[id].xml`. For example, `/product/sitemap/1.xml`.

## Example

For example, to split a sitemap using `generateSitemaps`, return an array of objects with the sitemap `id`. Then, use the `id` to generate the unique sitemaps.

```ts
// Archivo: app/product/sitemap.ts switcher
import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap(props: {
  id: Promise<string>
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }))
}
```

```js
// Archivo: app/product/sitemap.js switcher
import { BASE_URL } from '@/app/lib/constants'

export async function generateSitemaps() {
  // Fetch the total number of products and calculate the number of sitemaps needed
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
}

export default async function sitemap(props) {
  const id = await props.id
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000
  const end = start + 50000
  const products = await getProducts(
    `SELECT id, date FROM products WHERE id BETWEEN ${start} AND ${end}`
  )
  return products.map((product) => ({
    url: `${BASE_URL}/product/${product.id}`,
    lastModified: product.date,
  }))
}
```

## Version History

| Version   | Changes                                                                                                                                              |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v16.0.0` | The `id` values returned from `generateSitemaps` are now passed as a promise that resolves to a `string` to the sitemap function.                    |
| `v15.0.0` | `generateSitemaps` now generates consistent URLs between development and production                                                                  |
| `v13.3.2` | `generateSitemaps` introduced. In development, you can view the generated sitemap on `/.../sitemap.xml/[id]`. For example, `/product/sitemap.xml/1`. |



[⬆ Subir al inicio del capítulo](#)

---

<a id="images"></a>

## images

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/config/next-config-js/images](https://nextjs.org/docs/app/api-reference/config/next-config-js/images)  
> 📂 **Sección:** App > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Custom configuration for the next/image loader*  

---

If you want to use a cloud provider to optimize images instead of using the Next.js built-in Image Optimization API, you can configure `next.config.js` with the following:

```js
// Archivo: next.config.js
module.exports = {
  images: {
    loader: 'custom',
    loaderFile: './my/image/loader.js',
  },
}
```

This `loaderFile` must point to a file relative to the root of your Next.js application. The file must export a default function that returns a string, for example:

```js
// Archivo: my/image/loader.js
'use client'

export default function myImageLoader({ src, width, quality }) {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
}
```

Alternatively, you can use the [`loader` prop](/docs/app/api-reference/components/image#loader) to pass the function to each instance of `next/image`.

> **Good to know**: Customizing the image loader file, which accepts a function, requires using [Client Components](/docs/app/getting-started/server-and-client-components) to serialize the provided function.

To learn more about configuring the behavior of the built-in [Image Optimization API](/docs/app/api-reference/components/image) and the [Image Component](/docs/app/api-reference/components/image), see [Image Configuration Options](/docs/app/api-reference/components/image#configuration-options) for available options.

> 📘 **Nota para Pages Router:**
> ```js filename="my/image/loader.js"
> export default function myImageLoader({ src, width, quality }) {
>   return `https://example.com/${src}?w=${width}&q=${quality || 75}`
> }
> ```
> 
> Alternatively, you can use the [`loader` prop](/docs/pages/api-reference/components/image#loader) to pass the function to each instance of `next/image`.
> 
> To learn more about configuring the behavior of the built-in [Image Optimization API](/docs/pages/api-reference/components/image) and the [Image Component](/docs/pages/api-reference/components/image), see [Image Configuration Options](/docs/pages/api-reference/components/image#configuration-options) for available options.

## Example Loader Configuration

- [Akamai](#akamai)
- [AWS CloudFront](#aws-cloudfront)
- [Cloudinary](#cloudinary)
- [Cloudflare](#cloudflare)
- [Contentful](#contentful)
- [Fastly](#fastly)
- [Gumlet](#gumlet)
- [ImageEngine](#imageengine)
- [Imgix](#imgix)
- [PixelBin](#pixelbin)
- [Sanity](#sanity)
- [Sirv](#sirv)
- [Supabase](#supabase)
- [Thumbor](#thumbor)
- [Imagekit](#imagekitio)
- [Nitrogen AIO](#nitrogen-aio)

### Akamai

```js
// Docs: https://techdocs.akamai.com/ivm/reference/test-images-on-demand
export default function akamaiLoader({ src, width, quality }) {
  return `https://example.com/${src}?imwidth=${width}`
}
```

### AWS CloudFront

```js
// Docs: https://aws.amazon.com/developer/application-security-performance/articles/image-optimization
export default function cloudfrontLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('format', 'auto')
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.href
}
```

### Cloudinary

```js
// Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
export default function cloudinaryLoader({ src, width, quality }) {
  const params = ['f_auto', 'c_limit', `w_${width}`, `q_${quality || 'auto'}`]
  return `https://example.com/${params.join(',')}${src}`
}
```

### Cloudflare

```js
// Docs: https://developers.cloudflare.com/images/transform-images
export default function cloudflareLoader({ src, width, quality }) {
  const params = [`width=${width}`, `quality=${quality || 75}`, 'format=auto']
  return `https://example.com/cdn-cgi/image/${params.join(',')}/${src}`
}
```

### Contentful

```js
// Docs: https://www.contentful.com/developers/docs/references/images-api/
export default function contentfulLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('fm', 'webp')
  url.searchParams.set('w', width.toString())
  url.searchParams.set('q', (quality || 75).toString())
  return url.href
}
```

### Fastly

```js
// Docs: https://developer.fastly.com/reference/io/
export default function fastlyLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('auto', 'webp')
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.href
}
```

### Gumlet

```js
// Docs: https://docs.gumlet.com/reference/image-transform-size
export default function gumletLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('format', 'auto')
  url.searchParams.set('w', width.toString())
  url.searchParams.set('q', (quality || 75).toString())
  return url.href
}
```

### ImageEngine

```js
// Docs: https://support.imageengine.io/hc/en-us/articles/360058880672-Directives
export default function imageengineLoader({ src, width, quality }) {
  const compression = 100 - (quality || 50)
  const params = [`w_${width}`, `cmpr_${compression}`]
  return `https://example.com${src}?imgeng=/${params.join('/')}`
}
```

### Imgix

```js
// Demo: https://static.imgix.net/daisy.png?format=auto&fit=max&w=300
export default function imgixLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  const params = url.searchParams
  params.set('auto', params.getAll('auto').join(',') || 'format')
  params.set('fit', params.get('fit') || 'max')
  params.set('w', params.get('w') || width.toString())
  params.set('q', (quality || 50).toString())
  return url.href
}
```

### PixelBin

```js
// Doc (Resize): https://www.pixelbin.io/docs/transformations/basic/resize/#width-w
// Doc (Optimise): https://www.pixelbin.io/docs/optimizations/quality/#image-quality-when-delivering
// Doc (Auto Format Delivery): https://www.pixelbin.io/docs/optimizations/format/#automatic-format-selection-with-f_auto-url-parameter
export default function pixelBinLoader({ src, width, quality }) {
  const name = '<your-cloud-name>'
  const opt = `t.resize(w:${width})~t.compress(q:${quality || 75})`
  return `https://cdn.pixelbin.io/v2/${name}/${opt}/${src}?f_auto=true`
}
```

### Sanity

```js
// Docs: https://www.sanity.io/docs/image-urls
export default function sanityLoader({ src, width, quality }) {
  const prj = 'zp7mbokg'
  const dataset = 'production'
  const url = new URL(`https://cdn.sanity.io/images/${prj}/${dataset}${src}`)
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'max')
  url.searchParams.set('w', width.toString())
  if (quality) {
    url.searchParams.set('q', quality.toString())
  }
  return url.href
}
```

### Sirv

```js
// Docs: https://sirv.com/help/articles/dynamic-imaging/
export default function sirvLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  const params = url.searchParams
  params.set('format', params.getAll('format').join(',') || 'optimal')
  params.set('w', params.get('w') || width.toString())
  params.set('q', (quality || 85).toString())
  return url.href
}
```

### Supabase

```js
// Docs: https://supabase.com/docs/guides/storage/image-transformations#nextjs-loader
export default function supabaseLoader({ src, width, quality }) {
  const url = new URL(`https://example.com${src}`)
  url.searchParams.set('width', width.toString())
  url.searchParams.set('quality', (quality || 75).toString())
  return url.href
}
```

### Thumbor

```js
// Docs: https://thumbor.readthedocs.io/en/latest/
export default function thumborLoader({ src, width, quality }) {
  const params = [`${width}x0`, `filters:quality(${quality || 75})`]
  return `https://example.com${params.join('/')}${src}`
}
```

### ImageKit.io

```js
// Docs: https://imagekit.io/docs/image-transformation
export default function imageKitLoader({ src, width, quality }) {
  const params = [`w-${width}`, `q-${quality || 80}`]
  return `https://ik.imagekit.io/your_imagekit_id/${src}?tr=${params.join(',')}`
}
```

### Nitrogen AIO

```js
// Docs: https://docs.n7.io/aio/intergrations/
export default function aioLoader({ src, width, quality }) {
  const url = new URL(src, window.location.href)
  const params = url.searchParams
  const aioParams = params.getAll('aio')
  aioParams.push(`w-${width}`)
  if (quality) {
    aioParams.push(`q-${quality.toString()}`)
  }
  params.set('aio', aioParams.join(';'))
  return url.href
}
```



[⬆ Subir al inicio del capítulo](#)

---

<a id="image-optimization"></a>

## Image Optimization

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/getting-started/images](https://nextjs.org/docs/pages/getting-started/images)  
> 📂 **Sección:** Pages > Getting Started  
> 📝 **Descripción:** *Optimize your images with the built-in `next/image` component.*  

---





[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-use-fonts"></a>

## How to use fonts

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/getting-started/fonts](https://nextjs.org/docs/pages/getting-started/fonts)  
> 📂 **Sección:** Pages > Getting Started  
> 📝 **Descripción:** *Learn how to use fonts in Next.js*  

---





[⬆ Subir al inicio del capítulo](#)

---

<a id="how-to-load-and-optimize-scripts"></a>

## How to load and optimize scripts

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/guides/scripts](https://nextjs.org/docs/pages/guides/scripts)  
> 📂 **Sección:** Pages > Guides  
> 📝 **Descripción:** *Optimize 3rd party scripts with the built-in Script component.*  

---





[⬆ Subir al inicio del capítulo](#)

---

<a id="images"></a>

## images

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/pages/api-reference/config/next-config-js/images](https://nextjs.org/docs/pages/api-reference/config/next-config-js/images)  
> 📂 **Sección:** Pages > Api Reference > Config > Next Config Js  
> 📝 **Descripción:** *Custom configuration for the next/image loader*  

---





[⬆ Subir al inicio del capítulo](#)

---

