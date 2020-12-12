<script>
  import { onMount } from 'svelte';

  import Tailwindcss from './_tailwindcss.svelte';
  import Header from "../containers/Header.svelte";
  import Main from "../containers/Main.svelte";
  import Sidebar from "../containers/Sidebar.svelte";
  import Footer from "../containers/Footer.svelte";

  export let segment;
  export let visibility = `hidden`;

  onMount(() => {
    visibility = `visible`;
  });
</script>

<Tailwindcss />

<div class="box-border min-w-screen min-h-screen">
  <div class="flex flex-col justify-between h-100" style="visibility:{visibility};">
    <Header {segment} />
    <div class="bg-gray-100 px-4">
      <div class="container mx-auto">
        <div class="grid grid-cols-4 gap-2">
          <div class="col-span-4 sm:col-span-3">
            <Main >
              <slot />
            </Main>
          </div>
          <div class="col-span-4 sm:col-span-1">
            <Sidebar /> 
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</div>
