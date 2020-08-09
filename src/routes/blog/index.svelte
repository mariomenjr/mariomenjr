<script context="module">
  export function preload({ params, query }) {
    return this.fetch(`blog.json`)
      .then((r) => r.json())
      .then((posts) => ({
        posts: posts.map((post) => {
          const timestamp = new Date(post.timestamp);
          return { ...post, timestamp };
        }),
      }));
  }
</script>

<script>
  export let posts;
  export let title = `Blog | Mario Menjívar`;
</script>

<svelte:head>
  <title>{title}</title>

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://mariomenjr.com/blog" />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content="{posts.length} post(s)" />
  <!-- {#if post.metadata.thumb}
  <meta property="twitter:image" content="{post.metadata.thumb}">
  {/if} -->
</svelte:head>

<ul>
  {#each posts as post}
    <li>
      <a rel="prefetch" href="blog/{post.endpoint}">{post.title}</a>
      <p class="c-label-last-updated">
        Posteado en {post.timestamp.toLocaleString()} por {post.author}
      </p>
    </li>
  {/each}
</ul>
