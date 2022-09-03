---
title: JavaScript与其框架
description: "本章主要包含JavaScript的基础知识，包含ES、WebAPI、Node、框架等，因大多数题目都是非常基础的概念题，故本章不做收录"
---

## JavaScript

### 基础

+++warning 隐式类型转换
![type](https://yck-1254263422.cos.ap-shanghai.myqcloud.com/blog/2019-06-01-043719.png)
+++

+++warning ull和undefined的区别
null是一个表示”无”的对象，转为数值时为0；undefined是一个表示”无”的原始值，转为数值时为NaN。
当声明的变量还未被初始化时，变量的默认值为undefined。
null用来表示尚未存在的对象，常用来表示函数企图返回一个不存在的对象。

undefined表示”缺少值”，就是此处应该有一个值，但是还没有定义。典型用法是：

1. 变量被声明了，但没有赋值时，就等于undefined。
2. 调用函数时，应该提供的参数没有提供，该参数等于undefined。
3. 对象没有赋值的属性，该属性的值为undefined。
4. 函数没有返回值时，默认返回undefined。

null表示”没有对象”，即该处不应该有值。典型用法是：

1. 作为函数的参数，表示该函数的参数不是对象。
2. 作为对象原型链的终点。

+++

+++warning undefined>=undefined、null>=null、[]==![]
涉及隐式转换

1. NaN>=NaN,false
2. 0>=0，true
3. []==false -> []==0 -> ''==0 -> 0==0 ,true
+++

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

+++warning 垃圾回收

1. 标记清除：当变量进入环境时为其标记为'进入环境'，执行完毕后标记为'离开环境'，通过这样清除已经不用的变量
2. 引用计数：跟踪每个变量被使用的情况，当声明或赋值时引用count+1，如果变量的值改变则原值引用count-1，循环时回收引用次数为0的变量，但有循环引用导致内存泄漏的问题

更具体可查看相关文章
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

+++warning
JS 中 this 的五种情况

1. 作为普通函数执行时，this指向window。
2. 当函数作为对象的方法被调用时，this就会指向该对象。
3. 构造器调用，this指向返回的这个对象。
4. 箭头函数 箭头函数的this绑定看的是this所在函数定义在哪个对象下，就绑定哪个对象。如果有嵌套的情况，则this绑定到最近的一层对象上。
5. 基于Function.prototype上的 apply 、 call 和 bind 调用模式，这三个方法都可以显示的指定调用函数的 this 指向。apply接收参数的是数组，call接受参数列表，bind方法通过传入一个对象，返回一个 this 绑定了传入对象的新函数。这个函数的 this指向除了使用new时会被改变，其他情况下都不会改变。若为空默认是指向全局对象window。
+++

### 异步编程

+++warning 浏览器和Node中的事件循环

JS是单线程的，为了防止一个函数执行时间过长阻塞后面的代码，所以会先将同步代码压入执行栈中，依次执行，将异步代码推入异步队列，异步队列又分为宏任务队列和微任务队列，因为宏任务队列的执行时间较长，所以微任务队列要优先于宏任务队列
在浏览器环境中，有JS 引擎线程和渲染线程，且两个线程互斥。 Node环境中，只有JS 线程。 不同环境执行机制有差异，不同任务进入不同Event Queue队列。 当主程结束，先执行准备好微任务，然后再执行准备好的宏任务，一个轮询结束。

浏览器中的事件环（Event Loop)
事件环的运行机制是，先会执行栈中的内容，栈中的内容执行后执行微任务，微任务清空后再执行宏任务，先取出一个宏任务，再去执行微任务，然后在取宏任务清微任务这样不停的循环。

eventLoop 是由JS的宿主环境（浏览器）来实现的；

事件循环可以简单的描述为以下四个步骤:

1. 函数入栈，当Stack中执行到异步任务的时候，就将他丢给WebAPIs,接着执行同步任务,直到Stack为空；
2. 此期间WebAPIs完成这个事件，把回调函数放入队列中等待执行（微任务放到微任务队列，宏任务放到宏任务队列）
3. 执行栈为空时，Event Loop把微任务队列执行清空；
4. 微任务队列清空后，进入宏任务队列，取队列的第一项任务放入Stack(栈）中执行，执行完成后，查看微任务队列是否有任务，有的话，清空微任务队列。重复4，继续从宏任务中取任务执行，执行完成之后，继续清空微任务，如此反复循环，直至清空所有的任务。
![eventLoop](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/342e581223d2471d9484fc48beb9f8e1~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

Node是基于V8引擎的运行在服务端的JavaScript运行环境，在处理高并发、I/O密集(文件操作、网络操作、数据库操作等)场景有明显的优势。虽然用到也是V8引擎，但由于服务目的和环境不同，导致了它的API与原生JS有些区别，其Event Loop还要处理一些I/O，比如新的网络连接等，所以Node的Event Loop(事件环机制)与浏览器的是不太一样。
![eventLoop](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e362c1770f62428fbf3faabd99d2a64c~tplv-k3u1fbpfcp-zoom-in-crop-mark:3024:0:0:0.awebp)

`相关API`
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

1. 无法监听数组下标引起的改变、对象新增属性
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

+++info 说一下 react-fiber
1）背景
react-fiber 产生的根本原因，是大量的同步计算任务阻塞了浏览器的 UI 渲染。默认情况下，JS 运算、页面布局和页面绘制都是运行在浏览器的主线程当中，他们之间是互斥的关系。如果 JS 运算持续占用主线程，页面就没法得到及时的更新。当我们调用setState更新页面的时候，React 会遍历应用的所有节点，计算出差异，然后再更新 UI。如果页面元素很多，整个过程占用的时机就可能超过 16 毫秒，就容易出现掉帧的现象。
2）实现原理

react内部运转分三层：

Virtual DOM 层，描述页面长什么样。
Reconciler 层，负责调用组件生命周期方法，进行 Diff 运算等。
Renderer 层，根据不同的平台，渲染出相应的页面，比较常见的是 ReactDOM 和 ReactNative。

Fiber 其实指的是一种数据结构，它可以用一个纯 JS 对象来表示：

```js
const fiber = {
    stateNode,    // 节点实例
    child,        // 子节点
    sibling,      // 兄弟节点
    return,       // 父节点
}
```

为了实现不卡顿，就需要有一个调度器 (Scheduler) 来进行任务分配。优先级高的任务（如键盘输入）可以打断优先级低的任务（如Diff）的执行，从而更快的生效。任务的优先级有六种：

synchronous，与之前的Stack Reconciler操作一样，同步执行
task，在next tick之前执行
animation，下一帧之前执行
high，在不久的将来立即执行
low，稍微延迟执行也没关系
offscreen，下一次render时或scroll时才执行

Fiber Reconciler（react ）执行过程分为2个阶段：

阶段一，生成 Fiber 树，得出需要更新的节点信息。这一步是一个渐进的过程，可以被打断。阶段一可被打断的特性，让优先级更高的任务先执行，从框架层面大大降低了页面掉帧的概率。
阶段二，将需要更新的节点一次过批量更新，这个过程不能被打断。

Fiber树：React 在 render 第一次渲染时，会通过 React.createElement 创建一颗 Element 树，可以称之为 Virtual DOM Tree，由于要记录上下文信息，加入了 Fiber，每一个 Element 会对应一个 Fiber Node，将 Fiber Node 链接起来的结构成为 Fiber Tree。Fiber Tree 一个重要的特点是链表结构，将递归遍历编程循环遍历，然后配合 requestIdleCallback API, 实现任务拆分、中断与恢复。

从Stack Reconciler到Fiber Reconciler，源码层面其实就是干了一件递归改循环的事情

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

+++info 路由中hash和history的原理
URL基础知识
|属性     |含义     |示例           |
|--------|--------|---------------|
|protocal| 协议    |http:          |
|hostname| 主机名  |127.0.0.1      |
|port    | 端口号  |8001           |
|host    | 主机    |127.0.0.1:8001 |
|pathname| 访问页面 |index.html     |
|search  | 搜索内容 |?a=100&b=20    |
|hash    | 哈希值   |#/aaa/bbb      |

`Hash特点`

1. hash变化会触发网页跳转，即浏览器的前进和后退。
2. hash 可以改变 url ，但是不会触发页面重新加载（hash的改变是记录在 window.history 中），即不会刷新页面。也就是说，所有页面的跳转都是在客户端进行操作。因此，这并不算是一次 http 请求，所以这种模式不利于 SEO 优化。hash 只能修改 # 后面的部分，所以只能跳转到与当前 url 同文档的 url 。
3. hash 通过 window.onhashchange 的方式，来监听 hash 的改变，借此实现无刷新跳转的功能。
4. hash 永远不会提交到 server 端（可以理解为只在前端自生自灭）。

`History特点`

1. history API 是 H5 提供的新特性，允许开发者直接更改前端路由，即更新浏览器 URL 地址而不重新发起请求。
2. 新的 url 可以是与当前 url 同源的任意 url ，也可以是与当前 url 一样的地址，但是这样会导致的一个问题是，会把重复的这一次操作记录到栈当中。
3. 通过 history.state ，添加任意类型的数据到记录中。
4. 通过 pushState 、 replaceState 来实现无刷新跳转的功能。

`两者的差别`
使用 history 模式时，在对当前的页面进行刷新时，此时浏览器会重新发起请求。如果 nginx 没有匹配得到当前的 url ，就会出现 404 的页面。
而对于 hash 模式来说，  它虽然看着是改变了 url ，但不会被包括在 http 请求中。所以，它算是被用来指导浏览器的动作，并不影响服务器端。因此，改变 hash 并没有真正地改变 url ，所以页面路径还是之前的路径， nginx 也就不会拦截。
因此，在使用 history 模式时，需要通过服务端来允许地址可访问，如果没有设置，就很容易导致出现 404 的局面。
+++

+++info 路由权限的实现
权限管理一般需求是页面权限和按钮权限的管理

具体实现的时候分后端和前端两种方案：
前端方案会把所有路由信息在前端配置，通过路由守卫要求用户登录，用户登录后根据角色过滤出路由表。比如我会配置一个asyncRoutes数组，需要认证的页面在其路由的meta中添加一个roles字段，等获取用户角色之后取两者的交集，若结果不为空则说明可以访问。此过滤过程结束，剩下的路由就是该用户能访问的页面，最后通过router.addRoutes(accessRoutes)方式动态添加路由即可。
后端方案会把所有页面路由信息存在数据库中，用户登录的时候根据其角色查询得到其能访问的所有页面路由信息返回给前端，前端再通过addRoutes动态添加路由信息
按钮权限的控制通常会实现一个指令，例如v-permission，将按钮要求角色通过值传给v-permission指令，在指令的moutned钩子中可以判断当前用户角色和按钮是否存在交集，有则保留按钮，无则移除按钮。

纯前端方案的优点是实现简单，不需要额外权限管理页面，但是维护起来问题比较大，有新的页面和角色需求就要修改前端代码重新打包部署；服务端方案就不存在这个问题，通过专门的角色和权限管理页面，配置页面和按钮权限信息到数据库，应用每次登陆时获取的都是最新的路由信息，可谓一劳永逸！
+++

+++info 如果让你从零开始写一个vue路由，说说你的思路

- 借助hash或者history api实现url跳转页面不刷新
- 同时监听hashchange事件或者popstate事件处理跳转
- 根据hash值或者state值从routes表中匹配对应component并渲染之
  
一个SPA应用的路由需要解决的问题是页面跳转内容改变同时不刷新，同时路由还需要以插件形式存在，所以：

首先我会定义一个createRouter函数，返回路由器实例，实例内部做几件事：

1. 保存用户传入的配置项
2. 监听hash或者popstate事件
3. 回调里根据path匹配对应路由

将router定义成一个Vue插件，即实现install方法，内部做两件事：

实现两个全局组件：router-link和router-view，分别实现页面跳转和内容显示
定义两个全局变量：$route和$router，组件内可以访问当前路由和路由器实例
+++

+++info vue路由执行顺序

1. 导航被触发->在失活的组件里调用  beforeRouteLeave 守卫->调用全局 beforeEach 前置守卫->重用的组件调用 beforeRouteUpdate 守卫->路由配置调用 beforeEnter->解析异步路由组件->在被激活的组件里调用 beforeRouteEnter 守卫->调用全局的 beforeResolve 守卫->导航被确认->调用全局的 afterEach->触发 DOM 更新->调用  beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入

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
