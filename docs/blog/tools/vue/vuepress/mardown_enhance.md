---
title: Markdown 增强语法
date: 2022-06-02
category:
  - VuePress
tag:
  - Markdown
icon: markdown
---

本篇文章主要汇总自己在使用 VuePress 写笔记过程中可能会比较常用到的 Markdwon 增强语法。

:::warning
Markdown 增强与主题所使用的插件相关性较高，建议结合自己的主题所使用的插件查看，本博客采用 [vuepress-theme-hope](https://vuepress-theme-hope.github.io/v2/zh/) 主题。
更多配置详情参考 [Markdown 增强语法](https://vuepress-theme-hope.github.io/v2/zh/guide/markdown/)。
:::

## 自定义容器

主题新增 6 种信息提示的容器：info, note, tip, warning, danger, details，且这 6 种容器均可添加自定义的标题。

```md
:::info
:::

:::info 自定义标题
:::
```

## 选项卡

主题可以给指定的内容添加选项卡，选项卡既可以单独使用，也可以通过绑定相同 ID 实现分组操作。选项卡中的内容需要添加到 _tabs_ 容器中，在 _tabs_ 容器后面通过 `#id` 可以将选项卡绑定到指定的 id 上，当属于同一 id 的选项被选中时实现自动的分组操作。
_tabs_ 容器内部使用 `@tabs` 标记和分隔选项卡的内容，同时在 `@tabs` 标记的后面可以添加 `:active` 来指定默认激活的选项卡。

```md
<!-- tabs 容器, 容器后面使用 #id 可以绑定某个id-->

:::tabs#id

<!-- 标题后面使用 #title 可以覆盖前面的标题 -->

@tab:active 标题 1#新标题

<!-- 标题1 对应的内容 -->

@tab 标题 2

<!-- 标题2 对应的内容 -->

:::
```

:::tabs#lang
@tab c

这是 C 语言的输出示例

```c
puts("hello world");
```

@tab go

这是 go 语言的输出示例

```go
fmt.Print("hello world")
```

@tab js

这是 js 语言的输出示例

```js
console.log("hello world");
```

:::

:::tabs#lang
@tab c++

```cpp
std::cout << "23333" << std::endl;
```

@tab go

```go
fmt.Print("23333")
```

@tab:active js

```js
console.log("23333");
```

:::

从上面这个示例中可以看到切换分组时，`@tabs` 中的 Markdown 内容都会发生切换，而主题设计了一个 code-tabs 的容器，可以只切换 `@tabs` 内部的代码块。其他所有内容都将被忽略。

## 图片属性

可以在图片链接后面添加 `#light` 或 `#dark` 控制在不同模式下显示不同的图片，也可以添加 `=widthxheight` 指定图片的宽度和高度，设定大小时可以省略宽度和高度中任意一个值。注意 = 前面需要有一个空格符。

## 居中和居右

通过 center 和 right 容器注入可以让内容实现居中或者局右

```md
:::center

<!-- 居中的内容 -->

:::

:::right

<!-- 居右的内容 -->

:::
```

## 高亮标记

使用两个 "==" 符号包裹需要高亮的内容即可实现高亮标记，标记内容的两侧不能有多余的空格。

==这是高亮内容==

## 代码块高亮

代码块的语言标识后面使用 `{ }` 可以指定高亮的行, 大括号内不要随意加空格。

- `{start-end}` 高亮 start 到 end 之间的所有行
- `{1,3,5}` 高亮第 1, 3, 5 行
- `{1-3,6,9-10}` 高亮第 1-3, 6, 9-10 行

```cpp{2,6-8}
// 高亮第 2, 6-8 行
#include <iosttream>

using namespace std;

int main (int argc, char **argv) {
  cout << "hello world" << endl;
  return 0;
}
```

## 导入代码块

- 使用 `@[code](file)` 语法可以从指定的文件中导入代码块
- 只导入其中一部分 `@[code{2-7}](file)` 导入指定文件的第 2-7 行
- 显式指定导入的代码语言 `@[code go](file)`
- 显式指定导入的代码语言和行数 `@[code go{2-7}](file)`，导入第 2-7 行，代码标识为 go 语言。

## 文件导入

- 通过 `@include(file)` 导入指定的文件内容
- 通过 `@include(file{start-end})` 在导入过程中指定起始和终止行，起始和终止可省略其中之一。

```cpp
@include(./main.cpp)
```

```cpp
@include(./main.cpp{3-5})
```

## 直接使用 Vue 的代码

你好，{{ msg }}

<RedDiv>

当前计数为： {{ count }}

</RedDiv>

<button @click="count++">点我！</button>

<script setup>
import { h, ref } from 'vue'

const RedDiv = (_, ctx) => h(
  'div',
  {
    class: 'red-div',
  },
  ctx.slots.default()
)
const msg = 'Markdown 中的 Vue'
const count = ref(0)
</script>

<style>
.red-div {
  color: red;
}
</style>

:::details 示例代码

```vue
你好， {{ msg }}

<RedDiv>

当前计数为： {{ count }}

</RedDiv>

<button @click="count++">点我！</button>

<script setup>
import { h, ref } from "vue";

const RedDiv = (_, ctx) =>
  h(
    "div",
    {
      class: "red-div",
    },
    ctx.slots.default()
  );
const msg = "Markdown 中的 Vue";
const count = ref(0);
</script>

<style>
.red-div {
  color: red;
}
</style>
```

:::

## 外部引入

允许通过 &lt;iframe&gt; 和 &lt;img&gt; 标签从外部链接引入内容，从而增强 Markdown。例如引入 <https://shields.io/> 的勋章等。

![Ansible Quality Score](https://img.shields.io/ansible/quality/555?color=23&logo=2345&logoColor=345&style=for-the-badge)

```md
![Ansible Quality Score](https://img.shields.io/ansible/quality/555?color=23&logo=2345&logoColor=345&style=for-the-badge)
```

## 使用组件

在 Markdown 中可以使用一些组件丰富内容，可用的组件包括: Badge、CodePen、FontIcon、PDF、StackBlitz。由于网络环境和兼容性问题，我基本不会使用 CodePen 和 StackBlitz 这两个优秀的组件，实属遗憾。

### Badge

可自定义徽章，常用属性:

- text <Badge text="必须" type="tip"/> : 徽章内容
- type: 徽章类型, 内置: tip, info, warning, danger, note
- color: 徽章颜色, CSS 颜色值, 优先级高于 type
- vertical: 徽章垂直方向的位置， 内置：top, middle

<Badge text="hello" type="tip" color="red" vertical="middle"/>

```md
<Badge text="hello" type="tip" color="red" vertical="middle"/>
```

### FontIcon

使用 FontIcon 组件可展示字体图标， 常用属性:

- icon <Badge text="必须" type="tip"/>: icon 名字
- color: icon 颜色
- size: 字体大小

<FontIcon icon="github" color="#456789" size="64"/>

```md
<FontIcon icon="github" color="#456789" size="64"/>
```

### PDF

通过 PDF 组件可嵌入 PDF 的阅读器, 常用属性:

- url <Badge text="必须" type="tip"/> : PDF 文件链接，必须使用绝对路径

<PDF url="/pdf/test/test.pdf" />
