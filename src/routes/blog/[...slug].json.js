
import marked from "marked";
import hljs from "highlight.js";
import { getPost } from "../../utils/posts";

export function get(req, res) {
  let [year, month, day, slug] = req.params.slug;
  
  const post = getPost(`${year}-${month}-${day}_${slug}.md`);
  const renderer = new marked.Renderer();

  renderer.code = (source, lang) => {
    const { value: highlighted } = hljs.highlight(lang, source);
    return `<pre class='language-${lang} overflow-x-auto'><code>${highlighted}</code></pre>`;
  };

  marked.use({ renderer });
  const content = marked(post.content);

  if (content) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ...post, content }));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({message: `Not found`}));
  }
}
