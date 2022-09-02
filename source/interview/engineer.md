---
title: 工程化
description: "本章主要记录npm、yarn、pnpm包管理工具vite、webpack打包构建工具，git版本控制的知识"
---

## webpack

+++info 打包构建优化

1. 压缩代码
2. 开启TreeShanking
3. 小图转base64
4. 开启多线程
5. splitChunks抽离公共文件和第三方资源包
6. sourceMap优化，如开发环境下用eval-cheap-module-source-map，生产环境直接none
7. 合理配置hash，ts、js代码一般用chunkHash，css、assets的静态资源一般用contentHash
+++

+++info loader和plugin区别
loader：loader 是一个转换器，将 A 文件进行编译成 B 文件，属于单纯的文件转换过程；
plugin：plugin 是一个扩展器，它丰富了 webpack 本身，针对是 loader 结束后，webpack 打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些节点执行任务。
+++
