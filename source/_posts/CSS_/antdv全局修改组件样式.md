---
title: antdv全局修改组件样式
date: 2022/12/18
categories:
 - [CSS]
tags:
 - CSS
description: "ant design vue 组件样式的全局修改"
---

## 需求：因为a-slider的组件颜色过浅与背景颜色重合用户不容易看到，现在需要在全局修改其背景颜色更深色一些

通过调试台我们知道其颜色主要由antdv样式文件中的`ant-slider-rail`控制，而我们需要修改其background-color属性使其深色一些，且需要全局生效，也就是说其他组件在使用这个组件时，也默认受到影响

![antdv样式修改图1.png](https://s11.ax1x.com/2024/02/09/pF312CQ.png)

### :deep()样式穿透

样式穿透修改组件虽然简单高效，但受到限制，它只能在局部组件使用，而且用这种方式设置覆盖ant-design-vue的slider类会使其在hover时也默认为该色，也就是hover失效。显然这种解法非常拉胯，也无法在App.vue下全局生效
后面改用:global()和>>>也无济于事

:::success
2022-12-27日小更新，/deep/在vue文档中找不到了，后来发现现在改用新的写法，感觉非常不错，有点类似less的函数式编程又或是伪类的写法
:::

### style文件下的全局样式覆盖

我们知道项目引入antdv需要在main.ts引入其js和css文件，而当前项目的css文件统一在style目录下引入方便统一管理，由于当前流行多主题模式，所以项目也适配了白黑主题的切换，就设置了白黑两个css文件进行切换，而公共样式放在common下
![antd图0.png](https://s11.ax1x.com/2024/02/09/pF314uq.png)

antdv也有对应的白天黑夜主题，所以light引入的就是antdv下的antd.less，而dark引入的是antd.dark.less，两个主题分别在App.ts中导入并设置好切换按钮让用户方便切换。

:::success no-icon
antdv的样式文件入口就是antd.less或antd.dark.less
:::

![antdv样式修改图2.png](https://s11.ax1x.com/2024/02/09/pF315D0.png)
通过fork antdv的源码并找到该类名，可以发现其背景色由该变量决定，所以我们只要在我们项目的`light.less`文件下重新给变量赋值成一个稍微深一点的颜色即可
![antdv样式修改图3.png](https://s11.ax1x.com/2024/02/09/pF31fvn.png)

:::warning no-icon
注意这里覆盖要在`@import 'antd.less'`之后，才能有效覆盖
:::

这样就可以全局生效了，而且也不会影响到hover
