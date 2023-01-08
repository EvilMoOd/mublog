---
title: Antd vue使用bug汇总
date: 2023/01/07
categories:
 - [ant design]
tags:
 - vue
description: "使用ant design过程中的一些bug积累"
---

## a-select组件在多选模式下使用reactive绑定数据会使数据失去响应

改成ref的方式绑定数据即可

