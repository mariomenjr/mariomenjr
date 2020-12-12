<script>
  import Hero from "../components/Header/Hero.svelte";
  import Social from "../components/Header/Social.svelte";

  export let segment;

  export const menus = [
    [{ label: "blog", url: "/blog" }],
    [
      { label: "contacto", url: "/contacto" },
      { label: "acerca", url: "/acerca" },
    ],
  ];
</script>

<div>
  <header class="px-4">
    <div class="container mx-auto mt-2 py-5 px-2 sm:py-3 sm:px-1">
      <div class="flex flex-row items-center justify-between">
        <Hero />
        <Social />
      </div>
    </div>
  </header>
  <nav class="border-b mt-2 px-4">
    <div class="container mx-auto">
      <div class="flex flex-row items-center justify-between">
        {#each menus as menu}
          <ul class="flex flex-row items-center space-x-8">
            {#each menu as item}
              <li
                class="py-3 px-2 border-gray-900">
                <a
                  class="font-light text-sm text-gray-900 uppercase tracking-wide  hover:text-black"
                  class:font-medium={item.label.toLowerCase() === (segment === undefined ? '/' : segment)}
                  href={item.url}>
                  {item.label}
                </a>
              </li>
            {/each}
          </ul>
        {/each}
      </div>
    </div>
  </nav>
</div>
