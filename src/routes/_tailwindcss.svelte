<style global>
  @tailwind base;
  @tailwind components;

  .c-article h1 {
    @apply leading-tight text-4xl mb-4;
  }

  .c-article h2 {
    @apply leading-tight text-2xl mb-4;
  }

  .c-article p {
    @apply my-5;
  }

  .c-article a {
    @apply text-blue-500;
  }

  .c-article ul {
    @apply list-disc ml-4;
  }

  .c-article table {
    @apply table-auto w-full mx-4;
  }

  .c-article table thead th {
    @apply px-4 py-2;
  }

  .c-article table tbody td {
    @apply border px-4 py-2;
  }

  .c-article pre {
    @apply p-4 m-1 bg-gray-400;
  }

  .c-article blockquote {
    @apply text-gray-600 ml-4 italic; 
  }

  .c-label-last-updated {
    @apply text-xs text-gray-600 mb-5;
  }

  @tailwind utilities;
</style>
