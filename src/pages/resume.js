import React from "react";
import Layout from "@theme/Layout";

const frameStyle = { height: "90vh", width: "100%" };
const frameSrc = `https://docs.google.com/document/d/1EjOqIIqDXXIl7ms5COV55TbI8xFFvzZHD_7QwmTcqT4/edit?usp=sharing`;

export default function Resume() {
  return <Layout title="Resume" description="">
    <iframe style={frameStyle} src={frameSrc} />
  </Layout>;
}
