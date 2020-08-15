<script context="module">
  export const redirect = "https://facebook.com/horchatajs";
  export async function preload() {
    return this.redirect(301, redirect);
  }
</script>

<script>
	export let title = "HorchataJS streaming con Mario Menjívar";
  export let description = "Web Scraping con JS";
  export let redirect;
</script>

<svelte:head>
  <title>{title}</title>

  <meta name="description" content="{title}" />
  <meta
    name="keywords"
    content="horchatajs,charla,javascript,web-scraping,scraping" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={redirect} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={redirect} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
</svelte:head>
