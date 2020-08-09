---
author: "Mario Menjívar"
slug: "como-crear-un-blog-a-base-de-markdown-y-javascript"
title: "Cómo crear un blog a base de markdown y javascript"
timestamp: "2020-08-08T10:23:17.000-07:00"
brief: "Seguramente te haz hecho la siguiente pregunta: ¿Cómo hostear mi blog sin pagar un centavo? En este post te explico una de tantas alternativas."
keywords: "javascript,svelte,blog,markdown,howto"
---

# Cómo crear un blog a base de markdown y JavaScript

Seguramente te haz hecho la siguiente pregunta: ¿Cómo hostear mi blog sin pagar un centavo? En este post te explico una de tantas alternativas.

## Empecemos

Como ya mencioné, hay muchas formas de lograrlo. Fundamentalmente una página web no es más que HTML, CSS y JavaScript. Herramientas como [Jekyll](https://jekyllrb.com/) aprovecha esta regla de oro para ayudarte a generar y administrar posts fácilmente.

Pero, ¿Qué pasa si queremos tomar ventaja de todas las herramientas disponibles en el ecosistema JavaScript que se han establecido en los últimos 10 años? Tengo 3 respuestas concretas a esa pregunta: [Gatsby](https://www.gatsbyjs.org/), [Next.js](https://nextjs.org/) y [Sapper](https://sapper.svelte.dev/docs).

_In a nutshell_, estos tres frameworks permiten hacer algo muy importante para cumplir con nuestro objetivo, generar sitios estáticos. En este post nos centraremos en _Sapper_.

## ¿Por qué Sapper?

Svelte es el nuevo chico de la cuadra. Su propuesta insignia es mover el proceso reactivo al lenguaje, sin mediadores del tipo Virtual DOM, cómo lo hace React o Vue. Esto disminuye el tamaño del _bundle_ así cómo la velocidad de ejecución.

Puedes echar un vistazo a la [comparativa](https://www.swyx.io/writing/svelte-static/) entre Gatsby y Sapper realizada por [Shawn Wang](https://twitter.com/swyx), un popular desarrollador en [egghead.io](https://egghead.io/). Se muestra una reducción del 93% en el tamaño del _bundle_ con Sapper.

## Setup

Para instalar Sapper, basta con ejecutar los siguientes comandos:

```bash
[user@host ~]$ npx degit "sveltejs/sapper-template#rollup" my-blog
[user@host ~]$ cd my-blog
[user@host my-blog]$ npm install
[user@host my-blog]$ npm run dev
```

En el folder del project _my-blog_, nos interesan los siguientes files:

```text
...
├ src
│ ├ routes
| | ├ blog
| | | ├ _posts.js
| | | ├ [slug].json.js
| | | ├ [slug].svelte
| | | ├ index.json.js
| | | ├ index.svelte
...
```

De paso creamos el siguiente directorio y archivo:

```text
...
+ ├ content
+ │ ├ 2020-08-08_hola-mundo.md
  ├ src
  │ ├ routes
...
```

Necesitamos instalar los siguientes paquetes:

```bash
[user@host my-blog]$ npm i gray-matter highlight.js marked
```

En mi caso, quiero que los posts estén ordenados por su fecha de publicación y que esto se refleje en la URL. Tendremos que hacer unos cambios a los archivos mencionados, primero renombramos dos archivos:

```text
...
- | | | ├ [slug].json.js
- | | | ├ [slug].svelte
+ | | | ├ [...slug].json.js
+ | | | ├ [...slug].svelte
...
```

Luego, reemplazamos el contenido de la siguiente manera:

```javascript
// src/routes/blog/[...slug].json.js

import fs from "fs";
import path from "path";
import marked from "marked";
import hljs from "highlight.js";
import grayMatter from "gray-matter";

/*
 * Para obtener el contenido del post
 */
function getPost(year, month, day, fileName) {
  return fs.readFileSync(
    path.resolve("content", `${year}-${month}-${day}_${fileName}.md`),
    "utf-8"
  );
}

/*
 * En Sapper, este método responde a una request a través del método GET
 * En nuestro caso, la request de un JSON
 */
export function get(req, res, next) {
  // Así es cómo resolvemos una `dynamic route` en Sapper,
  // obtenemos cada valor en su variable respectiva
  let [year, month, day, slug] = req.params.slug;

  const postMarkdown = getPost(year, month, day, slug);
  const renderer = new marked.Renderer();

  // marked provee una manera de formatear partes específicas del markdown
  // en este caso, el código
  renderer.code = (source, lang) => {
    const { value: highlighted } = hljs.highlight(lang, source);
    return `<pre class='language-${lang} overflow-x-auto'><code>${highlighted}</code></pre>`;
  };

  marked.use({ renderer });

  const { data, content } = grayMatter(postMarkdown);
  const html = marked(content);

  if (html) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ html, ...data }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: `Not found` }));
  }
}
```
```html
<!-- src/routes/blog/[...slug].svelte -->

<script context="module">
  /*
   * Este método representa un paso en el ciclo de vida de un component en Sapper.
   *
   * Únicamente se ejecuta cuando el componente es montado. Aquí haremos la petición de nuestro JSON con la información del post
   */
  export async function preload({ params }) {
    let [year, month, day, slug] = params.slug;

    const res = await this.fetch(`blog/${year}/${month}/${day}/${slug}.json`);
    const data = await res.json();

    if (res.status === 200) {
      return { post: data };
    } else {
      this.error(res.status, data.message);
    }
  }
</script>

<script>
  export let post;
</script>

<svelte:head>
  <title>{post.title} by {post.author}</title>
</svelte:head>

<article>
  {@html post.html}
</article>
```

Acabamos de programar cómo se renderizará el post. Ya deberías poder verlo en [/blog/2020/08/08/hola-mundo](http://localhost:3000/blog/2020/08/08/hola-mundo) en tu local.

Podrías pensar que ya terminamos, pero hay un pequeño detalle que debemos cubrir para cumplir con las reglas de Sapper si queremos exportar nuestro pequeño blog como un sitio estático.

> "... any pages you want to be included in the exported site must either be reachable by \<a\> elements or added to the --entry option of the sapper export command."
> at [sapper-export](https://sapper.svelte.dev/docs#How_it_works)

De acuerdo a la documentación, debemos incluir elementos **\<a\>** que apunten a nuestras páginas generadas a partir de rutas dinámicas para que al exportar el sitio, estas también se incluyan. Por eso programaremos el endpoint [/blog](http://localhost:3000/blog).

```javascript
// src/routes/blog/index.json.js

import fs from "fs";
import path from "path";
import grayMatter from "gray-matter";

function getAllPosts() {
  const posts = fs
    .readdirSync("content")
    .map((fileName) => {
      const post = fs.readFileSync(path.resolve("content", fileName), "utf-8");
      return grayMatter(post).data;
    })
    .sort((a, b) => {
      if (b.timestamp < a.timestamp) return -1;
      if (b.timestamp > a.timestamp) return 1;

      return 0;
    });
  return posts;
}

export function get(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(getAllPosts()));
}
```
```html
<!-- src/routes/blog/index.svelte -->

<script context="module">
  export function preload({ params, query }) {
    return this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => ({
        posts: posts.map((post) => {
          const timestamp = new Date(post.timestamp);
          return {
            ...post,
            timestamp,
            date: {
              year: timestamp.getFullYear(),
              month: `${timestamp.getMonth() + 1}`.padStart(2, `0`),
              day: `${timestamp.getDate()}`.padStart(2, `0`),
            },
          };
        }),
      }));
  }
</script>

<script>
  export let posts;
</script>

<svelte:head>
  <title>Blog | Mario Menjívar</title>
</svelte:head>

<ul>
  {#each posts as post}
  <li>
    <a
      rel="prefetch"
      href="blog/{post.date.year}/{post.date.month}/{post.date.day}/{post.slug}"
    >
      {post.title}
    </a>
    <p class="c-label-last-updated">
      Posted on {post.timestamp.toLocaleString()} by {post.author}
    </p>
  </li>
  {/each}
</ul>
```

Listo.

## Sitio estático

Antes de desplegar nuestro fantástico blog, necesitamos asegurarnos que las páginas estáticas se generaran sin problemas. Para eso necesitamos ejecutar lo siguiente en la línea de comandos:

```bash
[user@host my-blog]$ npm run export
[user@host my-blog]$ npx serve __sapper__/export
```

Si no tienes ningun problema al acceder a este endpoint [/blog/2020/08/08/hola-mundo](http://localhost:5000/blog/2020/08/08/hola-mundo), ¡Felicidades! solo nos falta desplegar.


## Despliegue: Github Pages

En este punto, podríamos copiar la carpeta \_\_sapper\_\_/export y llevarla a cualquier CDN para ser servido. Por ejemplo, Netlify o Github Pages. En este post te mostraré cómo hacerlo con Github Pages.


... pero hacerlo de manera manual, en mi opinión, le quita la diversión.