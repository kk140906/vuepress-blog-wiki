---
title: Frontmatter 常用属性
date: 2022-06-03
icon: char-f
category:
  - VuePress
tag:
  - Frontmatter
---

本篇文章主要汇总自己在使用 VuePress 写笔记过程中可能会比较常用到的 Frontmatter 属性。

:::warning
Frontmatter 与 VuePress 的主题相关性较高，建议结合自己的主题查看，本博客采用 [vuepress-theme-hope](https://vuepress-theme-hope.github.io/v2/zh/) 主题。
更多配置详情参考 [Frontmatter 配置](https://vuepress-theme-hope.github.io/v2/zh/config/frontmatter/info.html)。
:::

:::center

|       属性       |     属性值类型      |                     说明                     |
| :--------------: | :-----------------: | :------------------------------------------: |
|      title       |       strring       | 一级标题，也是导航栏、侧边栏、路径导航的名称 |
|    shortTitle    |       string        |            一级短标题，优先级更高            |
|       icon       |       string        |                   页面图标                   |
|       date       |     DateString      |          写作时间, 格式: YYYY-MM-DD          |
|     category     | string \| string[ ] |                   文章分类                   |
|       tag        | string \| string[ ] |                   文章标签                   |
|    isOriginal    |       boolean       |                 文章是否原创                 |
|      sticky      |  boolean \| number  |     控制文章是否在列表中置顶以及置顶顺序     |
|       star       |  boolean \| number  |      控制文章是否添加到博客的文章列表中      |
|     article      |       boolean       |         控制文章是否加入到文章列表中         |
| sitemap.exclude  |       boolean       |        控制文章是否加入到 sitemap 中         |
| sitemap.priority |       number        |          0-1 范围，表示页面的优先级          |
|     comment      |       boolean       |             控制文章是否开启评论             |

:::

==dir 属性 接收一个对象，通过这个属性可以控制侧边栏的布局等==

:::center

| dir 属性值  |   属性值类型    |                     说明                     |
| :---------: | :-------------: | :------------------------------------------: |
|    text     |     string      |                   目标标题                   |
|    icon     |     string      |                   目录图标                   |
| collapsable |     boolean     |                目录是否可折叠                |
|    link     |     boolean     |                目录是否可点击                |
|    index    |     boolean     |                是否索引此目录                |
|    order    | number \| false | 控制目录在侧边栏的顺序，正数情况下越小越靠前 |

:::
