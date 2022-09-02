---
title: JavaScript与其框架
description: "本章主要包含JavaScript的基础知识，包含ES、WebAPI、Node、框架等，因大多数题目都是非常基础的概念题，故本章不做收录"
---

## JavaScript

### 基础

+++warning 严格模式
`规则：`

- 变量必须声明后再使用
- 函数的参数不能有同名属性，否则报错
- 不能使用with语句
- 不能对只读属性赋值，否则报错
- 不能使用前缀0表示八进制数，否则报错
- 不能删除不可删除的属性，否则报错
- 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
- eval不会在它的外层作用域引入变量
- eval和arguments不能被重新赋值
- arguments不会自动反映函数参数的变化
- 不能使用arguments.callee
- 不能使用arguments.caller
- 禁止this指向全局对象
- 不能使用fn.caller和fn.arguments获取函数调用的堆栈
- 增加了保留字（比如protected、static和interface）

`目的：`

- 消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
- 消除代码运行的一些不安全之处，保证代码运行的安全；
- 提高编译器效率，增加运行速度；
- 为未来新版本的Javascript做好铺垫。
+++

+++warning undefined>=undefined、null>=null、[]==![]
涉及隐式转换

1. NaN>=NaN,false
2. 0>=0，true
3. []==false -> []==0 -> ''==0 -> 0==0 ,true
+++

+++warning 垃圾回收

1. 标记清除：当变量进入环境时为其标记为'进入环境'，执行完毕后标记为'离开环境'，通过这样清除已经不用的变量
2. 引用计数：跟踪每个变量被使用的情况，当声明或赋值时引用count+1，如果变量的值改变则原值引用count-1，循环时回收引用次数为0的变量，但有循环引用导致内存泄漏的问题
+++

+++warning 内存泄漏方式

1. 闭包
2. 定时器未解绑
3. 事件监听未销毁
+++

+++warning 模块化AMD和CommonJs的理解
CommonJS加载模块是同步的，适用nodeJs，因为本地加载很快，拷贝输出，可修改引用值，运行时
AMD规范则是异步步加载模块，允许指定回调函数，适用浏览器，网络请求不一定很快，引用输出，只读，编译时
+++

+++warning includes和indexOf差别
includes内部使用Number.isNaN对NaN进行检测，而indexOf无法检测NaN
+++

+++warning 箭头函数特性

1. 没有this
2. 没有prototype，故不能作为构造函数
3. 没有arguments对象
+++

+++warning forEach如何跳出循环
try catch捕获函数，在特定条件下throw error
+++

+++warning [1,2,3].map(parseInt)
[1,NaN,NaN]
+++

+++warning 高阶函数
高阶组件主要是为了复用逻辑降低代码耦合度，和面向对象编程类似，封装axios再封装成api就类似这种思想
+++

### ES6

### 作用域、作用域链、闭包、预编译

+++warning 作用域和作用域链的理解
函数的变量访问基于函数目前所处的环境，优先访问函数作用域也就是代码块中的变量，若没有则沿作用域链向上单向访问直到window/global
+++

### 原型、原型链、继承、this

### 异步编程

+++warning 浏览器和Node中的事件循环
`浏览器：`
宏任务：setTimeout、setInterval、requestAnimationFrame
微任务：promise.then（async/await）、MutationObserver
`Node：`
宏任务：setTimeout、setInterval、setImmediate、I/O
微任务：promise.then（async/await）、process.nextTick

`区别`
node环境下定时器时依次一起执行的，而浏览器是一个个分开的，有单独的线程处理
浏览器的微任务执行是在每个宏任务之后，而node中则是在按阶段执行，一个阶段一轮回
+++

+++warning 如何做到并发请求
Promise.all或者web worker
+++

+++warning Window.onLoad和DOMContentLoaded事件执行优先级
dom树构建完成时执行DOMContentLoaded，然后页面挂载时执行Window.onLoad。
+++

## Vue

+++success Object.defineProperty有什么缺陷

1. 无法监听数组下标引起的改变
2. 需要深度遍历整个dom树为每个节点添加getter和setter
+++

+++success Vue双向数据绑定
Vue2采用Object.defineProperty为虚拟dom对象的每个属性添加getter和setter方法（观察者模式）
Vue3采用Proxy做数据代理，相当于有一面墙在一个对象外，每次读写都会穿过这一面墙进行get、set
+++

+++success Vue3diff算法（虚拟dom、keys原理与下面react相同）
vue2中diff算法对虚拟dom进行全量对比，而3中新增了静态标记（PatchFlag），在与旧树对比时只对比带有标记的节点（如模板语法节点）。
所以说vue2中每次都要重新创建元素，而vue3只需要对不参与更新的元素创建一次，之后不断复用
优化静态slot，使其父级元素改变时slot不做重渲染
事件缓存
+++

+++success Vue的生命周期（vue3）
![Vue生命周期](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5fa490ee4d948dba86a950bfe08dede~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
+++

+++success v-if和v-show区别、v-if和v-for执行顺序
v-if控制dom有无，v-show控制节点属性display:none
v-for > v-if,v-for套v-if可以用computed解决，v-if套v-for可以用template
+++

+++success vue组件通信

1. prop（父子）
2. emit（子传父）
3. provide/inject（多级向下）
4. mitt（组件间）
5. pinia（状态仓库）
+++

+++success Vue性能优化

1. 事件代理
2. keep-alive缓存组件
3. 组件懒加载、图片懒加载、虚拟列表
4. 防抖节流
+++

+++success nextTick的实现原理
nextTick会在dom更新循环结束后执行延迟回调，主要使用了任务队列，根据环境兼容性分别使用
Promise->MutationObserver->setImmediate->setTimeout
+++

## React

+++info React 虚拟DOM diff算法原理（keys 的作用是什么）
虚拟DOM本质是对象，通过遍历dom树克隆dom上的属性生成。操作对象比操作dom性能消耗更少
diff算法是将新生成的虚拟dom树按树形结构比较旧树的同级元素，为每个组件状态中需要改变的dom节点标记为dirty，并在事件循环结束时重新渲染
keys一般出现在for循环中，且每个for循环的keys是独立的，keys是react追踪哪些列表中的元素被增删改的辅助标识，它保证一个for循环中某个元素的唯一性，使得react在进行diff算法时能更高效的进行比对，以确定哪些元素需要被增删改，keys尽量不要用index，否则删除节点时也会重新渲染整个列表
+++

+++info React的生命周期

![React生命周期](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b5fa490ee4d948dba86a950bfe08dede~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)
+++

+++info React的事件代理机制（react17事件合成机制）
React中的事件代理并非和原生一样（为了解决跨浏览器兼容），而是采用合成事件（SyntheticEvent），将事件绑定冒泡到根节点（16是document）统一管理
具体可以看这条链接
https://juejin.cn/post/6955636911214067720#heading-1
+++

+++info React性能优化
主要方向有以下几个

1. 减少组件重新渲染（memo）
2. 缓存状态和函数（useMemo、useCallback）
3. 长列表懒加载（虚拟列表），组件懒加载、图片懒加载
+++

+++info React组件通信方式

1. props（父传子、子传父[回调函数]）
2. useImperativeHandle（子传父）
3. Context（多级往下）
4. mitt（两个组件间）
5. mobx、recoil（状态仓库）
+++

## 框架综合

+++info Vue和React区别
状态：Vue采用Proxy做数据代理监听每个状态的变换；React默认通过比较引用（diff）进行，因此react需要绑定很多的memo、useMemo、useCallback做缓存处理
主要是react更强调数据不可变以及单向数据流，而vue强调可变数据以及数据的双向绑定，
渲染：Vue再渲染时会跟踪每一个组件的依赖关系，不需要重新渲染整个渲染树，React在渲染时则会直接渲染该组件以及其子组件
+++

+++info 单页面应用(SPA)的优缺点
优点：1、利用ajax技术，前后端分离，实现数据局部获取渲染 2、基于动态路由，页面转换时可以自定义动画，记录location
缺点：1、不利于seo 2、没有路由导航 3、资源大，加载耗时长，首屏问题（可以用组件懒加载解决）
+++

## Web

### DOM

### BOM

+++warning BOM中的各种位置
layer：最近相对定位父级元素
clint：浏览器可视窗口（不包括控制台、菜单、滚动条、工具栏）
offset：浏览器可视窗口（包括上面这些）
scroll：目前可视窗口+滚动条离顶部或左边隐藏的部分
page：document对象
screen：屏幕
+++

## Node

+++success require 的模块加载机制

1. 计算模块绝对路径
2. 如果缓存中有该模块，则从缓存中取出该模块
3. 按优先级依次寻找并编译执行模块，将模块推入缓存（require.cache）中
4. 输出模块的 exports 属性
+++

+++success Node 更适合处理 I/O 密集型任务还是 CPU 密集型任务？为什么？
Node 更适合处理 I/O 密集型的任务。因为 Node 的 I/O 密集型任务可以异步调用，利用事件循环的处理能力，资源占用极少。Javascript 是单线程的原因，Node 不适合处理 CPU 密集型的任务，CPU 密集型的任务会导致 CPU 时间片不能释放，使得后续 I/O 无法发起，从而造成阻塞。
+++
