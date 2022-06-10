import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

// 配置详情：https://vuepress-theme-hope.github.io/v2/zh/config/theme/basic.html#navbar
export default hopeTheme({
  // 网站部署时所使用的域名
  hostname: "https://blog.kk9009.com",

  author: {
    name: "kykx",
    url: "https://blog.nas-kk.top",
  },

  iconAssets: "//at.alicdn.com/t/font_3447507_wiar32fnu7.css",

  logo: "/images/avatar.png",

  repo: "https://github.com/kk140906/vuepress-blog-wiki",

  // 文档在仓库中的目录
  docsDir: "docs",

  // navbar
  navbar: navbar,

  // sidebar
  sidebar: sidebar,

  darkmode: "toggle",
  footer: "逝者如斯夫，不舍昼夜",
  copyright: "Copyright © 2022 kykx, &lt;Email: kkisscj@gmail.com&gt;",
  displayFooter: true,
  lastUpdated: true,
  pageInfo: [
    "Author",
    "Original",
    "Date",
    "Category",
    "Tag",
    "Word",
    "ReadingTime",
    "PageView",
  ],
  // 配置详见 https://vuepress-theme-hope.github.io/v2/zh/config/theme/feature.html
  blog: {
    description: "什么都会点，什么都不精通，很头疼呐",
    intro: "/intro.html",
    medias: {
      Wechat: "javascript:void(0)",
      Gmail: "mailto:kkisscj@gmail.com",
      GitHub: "https://github.com/kk140906/",
      Reddit: "https://example.com",
      Steam: "https://steamcommunity.com/profiles/76561198089478689/",
    },
  },

  encrypt: {
    config: {
      "/guide/encrypt.html": ["1314"],
    },
  },

  plugins: {
    blog: {
      autoExcerpt: true,
    },
    // 部署教程, vercel 注意仓库的权限问题可能导致部署失败
    // https://vuepress-theme-hope.github.io/v2/zh/guide/feature/comment.html#waline
    // https://waline.js.org/guide/get-started.html#leancloud-%E8%AE%BE%E7%BD%AE-%E6%95%B0%E6%8D%AE%E5%BA%93
    comment: {
      provider: "Waline",
      emoji: [
        "https://unpkg.com/@waline/emojis@1.0.1/alus",
        "https://unpkg.com/@waline/emojis@1.0.1/tieba",
        "https://unpkg.com/@waline/emojis@1.0.1/bilibili",
      ],
      dark: "auto",
      wordLimit: 250,
      pageSize: 10,
      serverURL:
        "https://vuepress-blog-wiki-waline-24yq7owst-kk140906.vercel.app/",
    },
    copyright: {
      triggerWords: 10,
      global: true,
    },
    mdEnhance: {
      enableAll: true,
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
    },
    components: ["PDF", "Badge", "CodePen", "FontIcon", "StackBlitz"],

    // 不再启用 PWA
    // pwa: {
    //   favicon: "/images/favicon.png",
    //   cacheHTML: true,
    //   cachePic: true,
    //   update: "hint",
    // },
  },
});
