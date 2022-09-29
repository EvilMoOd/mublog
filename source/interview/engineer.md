---
title: 工程化
description: "本章主要记录npm、yarn、pnpm包管理工具vite、webpack打包构建工具，git版本控制的知识"
---

## webpack

+++info webpack工作流程
![webpack](https://user-images.githubusercontent.com/26785201/89747816-fe344280-daf2-11ea-820a-6a1a99e34f14.png)

1. 初始化阶段
初始化参数：从配置文件、配置对象和 Shell 参数中读取并与默认参数进行合并，组合成最终使用的参数。
创建编译对象：用上一步得到的参数创建 Compiler 对象。
初始化编译环境：包括注入内置插件、注册各种模块工厂、初始化 RuleSet 集合、加载配置的插件等。
2. 构建阶段
开始编译：执行 Compiler 对象的 run 方法，创建 Compilation 对象。
确认编译入口：进入 entryOption 阶段，读取配置的 Entries，递归遍历所有的入口文件，调用 Compilation.addEntry 将入口文件转换为 Dependency 对象。
编译模块（make）： 调用 normalModule 中的 build 开启构建，从 entry 文件开始，调用 loader 对模块进行转译处理，然后调用 JS 解释器（acorn）将内容转化为 AST 对象，然后递归分析依赖，依次处理全部文件。
完成模块编译：在上一步处理好所有模块后，得到模块编译产物和依赖关系图。
3. 生成阶段
输出资源（seal）：根据入口和模块之间的依赖关系，组装成多个包含多个模块的 Chunk，再把每个 Chunk 转换成一个 Asset 加入到输出列表，这步是可以修改输出内容的最后机会。
写入文件系统（emitAssets）：确定好输出内容后，根据配置的 output 将内容写入文件系统。

具体参考站内贴子(https://evilmood.github.io/mublog/util/webpack%E5%B7%A5%E4%BD%9C%E6%B5%81)

+++
+++info webpack热更新
(https://zhuanlan.zhihu.com/p/30669007)
+++

+++info 打包构建优化

1. 压缩代码
2. 开启TreeShanking
3. 小图转base64
4. 开启多线程
5. splitChunks抽离公共文件和第三方资源包
6. sourceMap优化，如开发环境下用eval-cheap-module-source-map，生产环境直接none
7. 合理配置hash，ts、js代码一般用chunkHash，css一般用contentHash,assets的静态资源一般用hash
+++

+++info loader和plugin区别
loader：Loader 本质就是一个函数，在该函数中对接收到的内容进行转换，返回转换后的结果。 因为 Webpack 只认识 JavaScript，所以Loader 就成了翻译官，对其他类型的资源进行转译的预处理工作。
plugin：就是插件，基于事件流框架 Tapable，插件可以扩展 Webpack 的功能，在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。
+++

+++info source map是什么？生产环境怎么用？
source map 是将编译、打包、压缩后的代码映射回源代码的过程。打包压缩后的代码不具备良好的可读性，想要调试源码就需要 soucre map。
map文件只要不打开开发者工具，浏览器是不会加载的。
线上环境一般有三种处理方案：

hidden-source-map：借助第三方错误监控平台 Sentry 使用
nosources-source-map：只会显示具体行数以及查看源代码的错误栈。安全性比 sourcemap 高
sourcemap：通过 nginx 设置将 .map 文件只对白名单开放(公司内网)
:::warning no-icon
注意：避免在生产中使用 inline- 和 eval-，因为它们会增加 bundle 体积大小，并降低整体性能。
:::
+++

+++info 在实际工程中，配置文件上百行乃是常事，如何保证各个loader按照预想方式工作？
可以使用 enforce 强制执行 loader 的作用顺序，pre 代表在所有正常 loader 之前执行，post 是所有 loader 之后执行。(inline 官方不推荐使用)

+++

+++warning babel原理
Babel 的功能很纯粹，它只是一个编译器。大多数编译器的工作过程可以分为三部分以及核心模块（@babel/core）：

解析（Parse） ：将源代码转换成更加抽象的表示方法（例如抽象语法树）。包括词法分析和语法分析。词法分析主要把字符流源代码（Char Stream）转换成令牌流（ Token Stream），语法分析主要是将令牌流转换成抽象语法树（Abstract Syntax Tree，AST）。（@babel/parser ）
转换（Transform） ：通过 Babel 的插件能力，对（抽象语法树）做一些特殊处理，将高版本语法的 AST 转换成支持低版本语法的 AST。让它符合编译器的期望，当然在此过程中也可以对 AST 的 Node 节点进行优化操作，比如添加、更新以及移除节点等。（@babel/traverse）
生成（Generate） ：将 AST 转换成字符串形式的低版本代码，同时也能创建 Source Map 映射。（@babel/generator）

![babel](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a30bf2739fec4c29847ba1675c03b62f~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
![babel](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c73423b335c34399b4e69b61515365ad~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
+++
