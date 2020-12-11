<style global>
  @tailwind base;
  @tailwind components;

  .blog h1 {
    @apply leading-tight text-4xl mb-4;
  }

  .blog h2 {
    @apply leading-tight text-2xl mb-4;
  }

  .blog h3 {
    @apply leading-tight text-xl mb-4;
  }

  .blog p {
    @apply my-5;
  }

  .blog a {
    @apply text-blue-500;
  }

  .blog ul {
    @apply list-disc ml-4;
  }

  .blog table {
    @apply table-auto w-full mx-4;
  }

  .blog table thead th {
    @apply px-4 py-2;
  }

  .blog table tbody td {
    @apply border px-4 py-2;
  }

  .blog pre {
    @apply p-4 m-1 bg-gray-400;
  }

  .blog blockquote {
    @apply text-gray-600 ml-4 italic; 
  }

  .blog-timestamp {
    @apply text-xs text-gray-600 mb-5;
  }

  @tailwind utilities;
</style>
