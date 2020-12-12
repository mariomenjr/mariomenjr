<style global>
  @tailwind base;
  @tailwind components;

  .blog h1 {
    @apply leading-tight;
    @apply text-4xl;
    @apply mb-4;
  }

  .blog h2 {
    @apply leading-tight;
    @apply text-2xl;
    @apply mb-4;
  }

  .blog h3 {
    @apply leading-tight;
    @apply text-xl; 
    @apply mb-4;
  }

  .blog p {
    @apply my-5;
  }

  .blog a {
    @apply text-blue-500;
  }

  .blog ul {
    @apply list-disc;
    @apply ml-4;
  }

  .blog table {
    @apply table-auto;
    @apply w-full;
    @apply mx-4;
  }

  .blog table thead th {
    @apply px-4; 
    @apply py-2;
  }

  .blog table tbody td {
    @apply border; 
    @apply px-4;
    @apply py-2;
  }

  .blog pre code {
    @apply px-5;
    @apply py-4;
    @apply m-1;
  }

  .blog blockquote {
    @apply text-gray-600;
    @apply ml-4;
    @apply italic;
  }

  .blog-timestamp {
    @apply text-xs;
    @apply text-gray-600;
    @apply mb-5;
  }

  @tailwind utilities;
</style>
