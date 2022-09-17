---
title: 性能优化
description: ""
---

+++danger 如何渲染几万条数据并不卡住界面

这道题考察了如何在不卡住页面的情况下渲染数据，也就是说不能一次性将几万条都渲染出来，而应该一次渲染部分 DOM，那么就可以通过 requestAnimationFrame 来每 16 ms 刷新一次。

+++

+++danger 图片懒加载
img.offsetTop < window.innerHeight + document.body.scrollTop;
![懒加载](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c57fc165a4ce4d5b9a2885867d4f1cab~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
+++

+++danger 框架如何优化首页的加载速度？首页白屏是什么问题引起的？如何解决呢？
首页加载过慢，其原因是因为它是一个单页应用，需要将所有需要的资源都下载到浏览器端并解析。
解决办法

1. 使用首屏SSR + 跳转SPA方式来优化
2. 改单页应用为多页应用，需要修改webpack的entry
3. 改成多页以后使用应该使用prefetch的就使用
4. 处理加载的时间片，合理安排加载顺序，尽量不要有大面积空隙
5. CDN资源还是很重要的，最好分开，也能减少一些不必要的资源损耗
6. 使用Quicklink，在网速好的时候 可以帮助你预加载页面资源
7. 骨架屏这种的用户体验的东西一定要上，最好借助stream先将这部分输出给浏览器解析
8. 合理使用web worker优化一些计算
9. 缓存一定要使用，但是请注意合理使用
10. 可以借助一些工具进行性能评测，重点调优，例如使用performance自己实现下等
+++
