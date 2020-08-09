import fs from "fs";
import path from "path";
import marked from "marked";
import hljs from "highlight.js";
import grayMatter from "gray-matter";

function getPost(year, month, day, fileName) {
  return fs.readFileSync(
    path.resolve("content", `${year}-${month}-${day}_${fileName}.md`),
    "utf-8"
  );
}

export function get(req, res, next) {
  let [year, month, day, slug] = req.params.slug;
  const postMarkdown = getPost(year, month, day, slug);
  const renderer = new marked.Renderer();

  renderer.code = (source, lang) => {
    const { value: highlighted } = hljs.highlight(lang, source);
    return `<pre class='language-${lang} overflow-x-auto'><code>${highlighted}</code></pre>`;
  };

  marked.use({ renderer });

  const { data, content } = grayMatter(postMarkdown);
  const html = marked(content);

  if (html) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ html, ...data }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({message: `Not found`}));
  }
}
