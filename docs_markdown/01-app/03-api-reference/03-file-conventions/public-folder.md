# public Folder

> **Documentación Oficial Next.js v16.3.7**  
> 🌐 **URL en vivo:** [https://nextjs.org/docs/app/api-reference/file-conventions/public-folder](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)  
> 📂 **Sección:** App > Api Reference > File Conventions  
> 📝 **Descripción:** *Next.js allows you to serve static files, like images, in the public directory. You can learn how it works here.*  

---

Next.js can serve static files, like images, under a folder called `public` in the root directory. Files inside `public` can then be referenced by your code starting from the base URL (`/`).

For example, the file `public/avatars/me.png` can be viewed by visiting the `/avatars/me.png` path. The code to display that image might look like:

```jsx
// Archivo: avatar.js
import Image from 'next/image'

export function Avatar({ id, alt }) {
  return 

![Illustration]()


}

export function AvatarOfMe() {
  return <Avatar id="me" alt="A portrait of me" />
}
```

## Caching

Next.js cannot safely cache assets in the `public` folder because they may change. The default caching headers applied are:

```jsx
Cache-Control: public, max-age=0
```

## Robots, Favicons, and others

> 📘 **Nota para Pages Router:**
> The folder is also useful for `robots.txt`, `favicon.ico`, Google Site Verification, and any other static files (including `.html`). But make sure to not have a static file with the same name as a file in the `pages/` directory, as this will result in an error. [Read more](/docs/messages/conflicting-public-file-page).

For static metadata files, such as `robots.txt`, `favicon.ico`, etc, you should use [special metadata files](/docs/app/api-reference/file-conventions/metadata) inside the `app` folder.
