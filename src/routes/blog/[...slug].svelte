<script context="module">
    import marked from "marked";

    export async function preload({ params }) {
        let [year, month, day, slug] = params.slug;

        const res = await this.fetch(`/archive/${year}-${month}-${day}@${slug}.md`);
        const text = await res.text();

        const [pairs, content] = text.split("%content%");

        const post = marked(content);
        const metadata = pairs.split("\n").reduce((meta, keyPair) => {
            if (keyPair.trim().length === 0) return meta;

            const [key, pair] = keyPair.split("=");
            return { ...meta, [key]: pair };
        }, {});

        metadata.updatedOn = new Date(metadata.updatedOn).toLocaleString();

        return { year, month, day, slug, post, metadata };
    };
</script>

<script>
    export let post;
    export let metadata;
</script>

<p class="c-label-last-updated">Last updated on {metadata.updatedOn} by {metadata.author}</p>
<article class="c-article">
    {@html post}
</article>