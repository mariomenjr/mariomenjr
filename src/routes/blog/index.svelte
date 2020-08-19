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
  
  <meta name="description" content="Blog by Mario Menjívar" />
  <meta name="keywords" content="blog,javascript,software,aprender programación,,mariomenjr,mario,menjivar,mario menjivar"/>
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
