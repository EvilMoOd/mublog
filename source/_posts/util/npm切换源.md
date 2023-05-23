---
title: npm切换源
date: 2023/05/23
categories:
 - [工具]
tags:
 - 工具
description: "npm 切换各种源"
---

## 查看当前源

```shell
npm config get registry
```

## 切换 NPM 官方源

```shell
npm config set registry https://registry.npmjs.org
```

## 切换淘宝镜像源

```shell
npm config set registry https://registry.npmmirror.com/
```

## 指定单个包

```shell
npm --registry https://registry.npm.taobao.org install [name]
```