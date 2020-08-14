<script context="module">
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
  import "highlight.js/styles/github.css";

  export let post;
  export let timestamp = new Date(post.timestamp);
  export let title = `${post.title} by ${post.author}`;
</script>

<svelte:head>
  <title>{title}</title>

  <meta name="description" content="{post.brief}" />
  <meta name="keywords" content="{post.keywords}"/>

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://mariomenjr.com/blog/{post.endpoint}">
  <meta property="og:title" content="{title}" >
  <meta property="og:description" content="{post.brief}">
  {#if post.cover}
    <meta property="og:image" content="{post.cover}">
  {:else}
    <meta property="og:image" content="https://avatars3.githubusercontent.com/u/1946936?s=460&v=4">
  {/if}
  

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://mariomenjr.com/blog/{post.endpoint}" />
  <meta property="twitter:title" content="{title}" />
  <meta property="twitter:description" content="{post.brief}" />

  {#if post.cover}
    <meta property="twitter:image" content="{post.cover}">
  {:else}
    <meta property="twitter:image" content="https://avatars3.githubusercontent.com/u/1946936?s=460&v=4">
  {/if}
</svelte:head>

<p class="c-label-last-updated">Última actualización en {timestamp.toLocaleString()} por {post.author}</p>
<a
  href="https://twitter.com/share?ref_src=twsrc%5Etfw&text=hola&via=mariomenjr"
  class="twitter-share-button"
  data-show-count="false">
  Tweet
</a>

<article class="c-article">
  {@html post.content}
</article>
