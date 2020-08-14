---
author: "Mario Menjívar"
slug: "como-crear-un-blog-a-base-de-markdown-y-javascript"
title: "Cómo crear un blog a base de markdown y JavaScript"
timestamp: "2020-08-09T10:23:17.000-07:00"
brief: "Seguramente te haz hecho la siguiente pregunta: ¿Cómo hostear un blog que sea fácil de mantener, sin pagar un centavo? En este post te explico una de tantas alternativas."
keywords: "javascript,svelte,blog,markdown,howto"
---

# Cómo crear un blog a base de markdown y JavaScript

Seguramente te haz hecho la siguiente pregunta: ¿Cómo hostear un blog que sea fácil de mantener, sin pagar un centavo? En este post te explico una de tantas alternativas.

## Porqué

Otra pregunta que probablemente este en tu cabeza es ¿Por qué markdown y JavaScript? La respuesta es un poco más elaborada. Para empezar, ¿Qué es markdown? Según Wikipedia: 

> "Markdown es un lenguaje de marcado ligero que trata de conseguir la máxima legibilidad y facilidad de publicación tanto en su forma de entrada como de salida, inspirándose en muchas convenciones existentes para marcar mensajes de correo electrónico usando texto plano" de [Wikipedia](https://es.wikipedia.org/wiki/Markdown).

Al usar markdown para escribir un post, estamos estructurando nuestro contenido sin necesidad de incluir HTML o CSS en el momento. Es decir, nos enfocamos enteramente en lo importante: el texto. Esta simplicidad se verá potencializada al incluir _Git_ y _Github_ en la formula, ya que podremos versionar nuestro contenido.

Como mencioné, hay muchas alternativas para lograrlo. Fundamentalmente una página web no es más que HTML, CSS y JavaScript. Herramientas como [_Jekyll_](https://jekyllrb.com/), aprovechan esta regla de oro para ayudarte a generar y administrar posts fácilmente haciendo uso de markdown. Pero, ¿Qué pasa si queremos tomar ventaja de todas las herramientas disponibles en el ecosistema JavaScript que se han establecido en los últimos 10 años?  Para eso tenemos [_Gatsby_](https://www.gatsbyjs.org/), [_Next.js_](https://nextjs.org/) o [_Sapper_](https://sapper.svelte.dev/docs).

_In a nutshell_, estos tres frameworks permiten generar sitios estáticos haciendo uso de herramientas modernas como React o Svelte. En este post nos centraremos en _Sapper_.

## ¿Por qué _Sapper_?

Svelte es el nuevo chico de la cuadra. Su propuesta insignia es mover la reactividad de la UI desde mediadores como el Virtual DOM hacia el lenguaje, o mejor dicho, al compilador, en contraste con React o Vue. Esto aumenta el desempeño de las aplicaciones y disminuye el tamaño del _bundle_.

Puedes echar un vistazo a la [comparativa](https://www.swyx.io/writing/svelte-static/) entre Gatsby y Sapper realizada por [Shawn Wang](https://twitter.com/swyx), un popular desarrollador en [egghead.io](https://egghead.io/). Se muestra una reducción del 93% en el tamaño del _bundle_ con _Sapper_.

## Setup

Para instalar Sapper, basta con ejecutar los siguientes comandos:

```bash
[user@host ~]$ npx degit "sveltejs/sapper-template#rollup" my-blog
[user@host ~]$ cd my-blog
[user@host my-blog]$ npm install
[user@host my-blog]$ npm run dev
```

En el folder del projecto _my-blog_, nos interesan los siguientes files:

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

Con el siguiente contenido:

```text
---
author: 'Mario Menjívar'
slug: 'hola-mundo'
title: 'Hola Mundo'
timestamp: '2020-08-08T10:23:17.000-07:00'
---

# Hola mundo

Hola mundo.
```

Necesitamos instalar los siguientes paquetes:

```bash
[user@host my-blog]$ npm i gray-matter highlight.js marked
```

En mi caso, quiero que los posts estén ordenados por su fecha de publicación y que esto se refleje en la URL. Tendremos que hacer unos cambios a los siguientes archivos:

```text
...
- | | | ├ [slug].json.js
- | | | ├ [slug].svelte
+ | | | ├ [...slug].json.js
+ | | | ├ [...slug].svelte
...
```

Luego, reemplazamos el contenido:

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

De esta forma se renderizará el post. Ya puedes verlo en tu ambiente local yendo a [/blog/2020/08/08/hola-mundo](http://localhost:3000/blog/2020/08/08/hola-mundo).

Aún hay un pequeño detalle que debemos cubrir para cumplir con las reglas que _Sapper_ establece si queremos exportar nuestro pequeño blog como un sitio estático.

> "... cualquier página que quieras que sea incluída en el sitio (estático) exportado debe ser esta ligado con una etiqueta del tipo \<a\> o añadida cómo parametro de la opción  --entry del comando `sapper export`" de [Sapper docs](https://sapper.svelte.dev/docs#How_it_works).

De acuerdo a la documentación, debemos incluir elementos **\<a\>** que apunten a nuestras páginas generadas a partir de rutas dinámicas, para que al exportar el sitio estas también se incluyan. Por eso programaremos el endpoint [/blog](http://localhost:3000/blog).

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

Si no tienes ningun problema al acceder a este endpoint [/blog/2020/08/08/hola-mundo](http://localhost:5000/blog/2020/08/08/hola-mundo), ¡Felicidades! solo nos queda desplegar el sitio.


## Despliegue: Github Pages

Nuestro sitio estático ha sido generado y los archivos están dentro de la carpeta `__sapper__/export`. Existen una infinidad de servicios que te permiten almacenar y servir este tipo de sitios, entre los más populares tenemos Netlify o Github Pages. En este post te mostraré cómo hacerlo con _Github Pages_.

Podríamos subir el folder `__sapper__/export` a un nuevo repositorio, activar la opción _Github Pages_ y repetir este proceso manualmente cada vez que actualicemos nuestro sitio con un nuevo post. En mi opinión, hacerlo de manera manual le quita la diversión. Afortunadamente, exite _Github Actions_.

El primer paso es crear dos repositorios en _Github_, el primero es el repositorio de nuestro projecto y el segundo el repositorio al cuál subiremos nuestro sitio estático. En mi caso, [mariomenjr/mariomenjr](https://github.com/mariomenjr/mariomenjr) y [mariomenjr/mariomenjr.github.io](https://github.com/mariomenjr/mariomenjr.github.io) respectivamente. Una vez hecho esto, creamos los siguientes folders y archivos en el folder del projecto:

```text
...
├ .github
│ ├ workflows
| | | deploy.yml
├ src
...
```
```yml
# .github/workflows/deploy.yml

name: Build and deploy
on:
    push:
      branches: 
        # Únicamente cuando actualicemos master
        - master
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v2.3.1
        with:
          persist-credentials: false
      - name: Install and build
        run: |
          npm install
          npm run export
      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@3.5.9
        with:
          # Limpiará el despliegue previo
          CLEAN: true
          # Necesitamos crear este secret para el repositorio
          GITHUB_TOKEN: ${{ secrets.DEPLOY_MARIOMENJR }}
          BRANCH: master
          FOLDER: __sapper__/export
          BASE_BRANCH: master
          REPOSITORY_NAME: mariomenjr/mariomenjr.github.io

```

El archivo anterior se explica en la [documentación](https://github.com/marketplace/actions/deploy-to-github-pages) de la acción. En este post nos centraremos en un línea 1 línea: 

```yml
...
jobs:
  build-and-deploy:
    ...
    steps:
      ...
      - name: Deploy 🚀
        ...
        with:
          ...
          # Necesitamos crear este secret para el repositorio
          GITHUB_TOKEN: ${{ secrets.DEPLOY_MARIOMENJR }}
          ...
```

Es esta línea la que autoriza a la acción a hacer cambios al repositorio `mariomenjr/mariomenjr.github.io`.

Para generar tu _Github token_, dirígete a [github.com/settings/tokens](https://github.com/settings/tokens), haz clic en el botón `Generate new token`, escribe un nombre significativo en el campo `Note`, selecciona el _checkbox_ **_repo_** y, por último, haz clic en el botón `Generate token`.

![Github personal access tokens](https://imgur.com/HbbMgm7.png)

No olvides copiar el token.

Por último, dirígete al repositorio del projecto para crear la variable de entorno que incluirás en el archivo `deploy.yml`.

![Add secret to repository](https://imgur.com/iuyGLdc.png)

```yml
...
jobs:
  build-and-deploy:
    ...
    steps:
      ...
      - name: Deploy 🚀
        ...
        with:
          ...
          # Necesitamos crear este secret para el repositorio
          GITHUB_TOKEN: ${{ secrets.MI_VARIABLE }}
          ...
```

Listo. Tan pronto hagas push al repositorio del projecto, _Github Actions_ desplegará tu sitio estático.

![Github Action Deployment](https://imgur.com/fHxzGuf.png)

No olvides activar la opción Github Pages en el repositorio al que desplegaste el sitio.

![Settings](https://imgur.com/tkl8wSO.png)

![Github Pages Setting](https://imgur.com/86osvtX.png)

# Conclusión

Puedes usar WordPress, Ghosts, incluso Jekyll si lo prefieres. El objetivo de este post es mostrarte como todas esas herramientas tienen su origen en cosas básicas que con el tiempo se convierten en herramientas robustas listas para sacarles provecho.

Me decidí a construir este blog, de esta manera, para poner en práctica el concepto [Aprender en Público](https://ricardoerl.com/blog/aprender-en-publico) que presentó [Ricardo](https://ricardoerl.com), un desarrollador salvadoreño, en un charla de [Café Digital](https://twitter.com/cafedigitalsv) y así salir de mi zona de comfort. Creéme cuando te digo que me divertí.


# Referencias

- [Building a blog with Svelte, Sapper, and Markdown](https://www.mahmoudashraf.dev/blog/build-a-blog-with-svelte-and-markdown/) 
- [Sapper docs](https://sapper.svelte.dev/docs#How_it_works)
- [Static Svelte: JavaScript Blogging with 93% less JavaScript](https://www.swyx.io/writing/svelte-static/)
- [Markdown](https://es.wikipedia.org/wiki/Markdown)