---
title: CSS
description: "CSS的知识其实写多就会了，下面都是一些比较容易忘记的知识"
---

+++primary 选择器权重
!important[Infinity]>内联[1000]>id[100]>类、伪类、属性[10]>元素、伪元素[1]>通配符、组合(后代、子代、兄弟)、伪类:not[0]
+++

+++primary BFC(还有IFC、FFC、GFC，自行百度)
BFC，块级格式化上下文，页面盒模型中一块独立的渲染区域，是独立布局的，盒子里面的子元素的样式不会影响到外面的元素。但在同一个BFC中的两个邻的块级盒在垂直方向（和布局方向有关系）的margin会发生折叠。
`创建方式`
1. html根元素
2. float
3. absolute
4. overflow不为visible
5. display：flex或table
`解决：`
1. margin塌陷
2. 清除浮动
+++

+++primary display：none、visible：hidden、opacity：0区别
1. 完全隐藏dom元素，不占空间，无法触发事件，回流
2. 隐藏dom元素但保留空间，无法触发事件，重绘
3. 隐藏dom元素且保留空间，可以触发事件，重绘
+++

+++primary link和@import区别
1. link属于HTML标签，而@import是CSS语句，所以link还可以引入网站图标等操作
2. link会在页面加载时同时加载，@import则会等到其引入的css文件加载完成之后在加载当前css文件
3. link权重高于@import
+++

+++primary CSS性能优化
1. 少写表达式
2. 少写高级选择器、通配选择器
3. 硬件加速
4. requestAnimationFrame动画
+++

+++primary 清除浮动
1. 末尾空标签style设置clear：both
2. overflow：hidden
3. 伪元素设置

```css
::after{
content:"";
height:0;
visibility:hidden;
display:block;
clear:both;
}
```

+++

+++primary 百分比机制
|子元素                                      |父元素        |
|-------------------------------------------|--------|
|width                                      | 父级的width                    |
|height                                     | 父级的height                   |
|margin(top,right,bottom,left)              | 父级的width                    |
|padding(top,right,bottom,left)             | 父级的width                    |
|border(top,right,bottom,left)              | 父级的width                    |
|position为absolute时的left,top,right,bottom | 元素的width,height,width,height|
|position为relative时的left,top,right,bottom | 自身的width,height,width,height|
|font-size                                  | 父元素的font-size              |
|line-height                                | 自身的font-size                |
|transform(left,top)                        | 自身的width,height             |

+++

+++primary JS动画和CSS动画区别
JS在主线程执行动画，而CSS在compositor线程执行
+++
