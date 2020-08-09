import fs from "fs";
import path from "path";
import grayMatter from "gray-matter";

export function _appendBlogEndpoint(data) {
  const timestamp = new Date(data.timestamp);

  const year = timestamp.getFullYear();
  const month = `${timestamp.getMonth() + 1}`.padStart(2, `0`);
  const day = `${timestamp.getDate()}`.padStart(2, `0`);

  return { ...data, endpoint: `${year}/${month}/${day}/${data.slug}` };
}

export function getPost(fileName) {
  const { data, content } = grayMatter(
    fs.readFileSync(path.resolve("content", fileName), "utf-8")
  );
  return { ..._appendBlogEndpoint(data), content };
}

export function getPosts() {
  return fs
    .readdirSync("content")
    .map((fileName) => getPost(fileName))
    .sort((a, b) => {
      if (b.timestamp < a.timestamp) return -1;
      if (b.timestamp > a.timestamp) return 1;
      return 0;
    });
}
