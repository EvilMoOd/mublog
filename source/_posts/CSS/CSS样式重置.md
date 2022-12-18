---
title: CSS样式重置
date: 2022/12/18
categories:
 - [CSS]
tags:
 - CSS
description: "启动项目时都会做的CSS样式重置"
---

## 废话不多说直接上代码

```css
/*
  1. 使用更直观的 box-sizing 模型
*/
*, *::before, *::after {
  box-sizing: border-box;
}
/*
  2. 移除默认 margin
*/
* {
  margin: 0;
}
/*
  3. 在应用中允许基于百分比的高度
*/
html, body {
  height: 100%;
}
/*
  排版调整
  4. 添加无障碍行高
  5. 改进文本渲染
*/
body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}
/*
  6. 改进媒体默认设置
*/
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}
/*
  7. 删除内置表单排版样式
*/
input, button, textarea, select {
  font: inherit;
}
/*
  8. 避免文字溢出
*/
p, h1, h2, h3, h4, h5, h6 {
  overflow-wrap: break-word;
}
/*
  9. 创建根层叠上下文
*/
#root, #__next {
  isolation: isolate;
}
```
