---
title: 解决VSCode下使用vue报错找不到模块“./App.vue”或其相应的类型声明
date: 2023/02/26
categories:
 - [Vue]
tags:
 - Vue
description: "解决VSCode下使用vue报错找不到模块“./App.vue”或其相应的类型声明"
---

## VSCode写vue代码时会有这样的报错，强迫症看得很难受

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e005f6a3b6ca44ed89db432a15b2cf11~tplv-k3u1fbpfcp-watermark.image?)

## 可以通过声明xxx.d.ts的方式解决

但是这样点击组件名称就会导致ts跳转一直跳到那个声明文件，我们不这样解决

## volar接管模式

VSCode原生是不支持vue文件的，所以需要volar插件支持，而VSCode本身的Typescript与volar中有冲突，所以我们需要在工作区禁用VSCode默认的TS

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d323fb068f7946cdb7ec409740e81ad5~tplv-k3u1fbpfcp-watermark.image?)

禁用之后重新加载VSCode下面状态栏会出现

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f0771a9ed454cea8bcaed09cc59e944~tplv-k3u1fbpfcp-watermark.image?)

且`Ctrl+点击`App组件即可跳转到该组件文件下,而且报错也消失了

参考链接
https://vuejs.org/guide/typescript/overview.html#volar-takeover-mode
