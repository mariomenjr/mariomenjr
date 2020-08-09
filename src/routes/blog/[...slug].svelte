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
	export let timestamp = new Date(post.timestamp).toLocaleString();
</script>
	
<svelte:head>
	<title>{post.title} by {post.author}</title>
</svelte:head>
  
<p class="c-label-last-updated">Last updated on {timestamp} by {post.author}</p>
<a href="https://twitter.com/share?ref_src=twsrc%5Etfw&text=hola&via=mariomenjr" class="twitter-share-button" data-show-count="false">Tweet</a>

<article class="c-article">
    {@html post.html}
</article> 
