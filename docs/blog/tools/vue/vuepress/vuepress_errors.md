---
title: VuePress 异常问题汇总
date: 2022-06-09
category:
  - VuePress
tag:
  - build error
icon: error
---

这篇文章汇总所有在 VuePress 中遇到的异常问题。

## Build 异常

### Invalid value used as weak map key

**起因**：自己为了省事，直接拷贝了某个网站的表格数据，开发中没有出现错误，打包时出现如题错误。
**解决**：表格中含有 tt 标签，该标签无法被正确识别，删除解决。

## 主题异常

### 首页微信 hover 取消后二维码消失缺少过渡动画

**解决思路**：之前是 hover 之后再设置 background，现在将 background 属性移到标签自身，通过控制可见性来保留过渡动画。

### 其他页面中无法通过页面链接跳转二级标题

**解决思路**：未看源码，观察页面内标题跳转链接，将其改为匹配的跳转链接即可。 [跳转至测试页面](../../../other/deployment/test.md)
