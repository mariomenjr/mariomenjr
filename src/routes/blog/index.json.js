import fs from "fs";
import path from "path";
import grayMatter from "gray-matter";

function getAllPosts() {
  const posts = fs
    .readdirSync("content")
    .map((fileName) => {
      const post = fs.readFileSync(path.resolve("content", fileName), "utf-8");
      return grayMatter(post).data;
    })
    .sort((a, b) => {
      if (b.timestamp < a.timestamp) return -1;
      if (b.timestamp > a.timestamp) return 1;

      return 0;
    });
  return posts;
}

export function get(req, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(getAllPosts()));
}
