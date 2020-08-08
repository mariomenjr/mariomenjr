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
  {#each posts as post, index}
    <li>
      <a
        rel="prefetch"
        href="blog/{post.date.year}/{post.date.month}/{post.date.day}/{post.slug}">
        {post.title}
      </a>
      <p class="c-label-last-updated">
        Posted on {post.timestamp.toLocaleString()} by {post.author}
      </p>
    </li>
  {/each}
</ul>
