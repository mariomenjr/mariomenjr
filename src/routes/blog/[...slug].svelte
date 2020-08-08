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
	export let post;
	export let timestamp = new Date(post.timestamp).toLocaleString();
</script>

<p class="c-label-last-updated">Last updated on {timestamp}</p>
<article class="c-article">
    {@html post.html}
</article> 