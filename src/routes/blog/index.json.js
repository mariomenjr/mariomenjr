import { getPosts } from "../../utils/posts";

export function get(_, res) {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify(getPosts()));
}
