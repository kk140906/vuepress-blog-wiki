import { docsearchPlugin } from "@vuepress/plugin-docsearch";
import { defineUserConfig } from "vuepress";
import theme from "./theme";

export default defineUserConfig({
  lang: "zh-CN",
  title: "KK's Blog And Wiki",
  description:
    "这个网站用来记录自己平时和工作期间的学习笔记，自己的主职工作偏底层电子设计开发，除此之外平时主要使用 C++、Go、JavaScript 等编程语言。",
  base: "/",
  head: [["link", { rel: "icon", href: "/images/favicon.png" }]],
  theme,
  // shouldPrefetch: false,
  plugins: [
    docsearchPlugin({
      appId: "5T2BJPD7VM",
      apiKey: "8a19be13d1b0953d30725ef3e4417f8c",
      indexName: "blog",
    }),
  ],
});
