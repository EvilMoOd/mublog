---
title: Fiber架构解析
date: 2022/09/09
categories:
 - [react]
tags:
 - react Fiber
sticky: false
description: "React 16采用新协调引擎支持虚拟DOM的渐进式渲染，并将原有的StackReconciler 替换为 FiberReconciler，提高复杂应用的可响应性和性能"
---


## Fiber出现背景

react-fiber 产生的根本原因，是大量的同步计算任务阻塞了浏览器的 UI 渲染。默认情况下，JS 运算、页面布局和页面绘制都是运行在浏览器的主线程当中，他们之间是互斥的关系。如果 JS 运算持续占用主线程，页面就没法得到及时的更新。当我们调用setState更新页面的时候，React 会遍历应用的所有节点，计算出差异，然后再更新 UI。如果页面元素很多，整个过程占用的时机就可能超过 16 毫秒，就容易出现掉帧的现象。

## Fiber核心概念

React 在 render 第一次渲染时，会通过 React.createElement 创建一颗 Element 树，可以称之为 Virtual DOM Tree，由于要记录上下文信息，加入了 Fiber，每一个 Element 会对应一个 Fiber Node，将 Fiber Node 链接起来的结构称为 Fiber Tree。Fiber Tree 一个重要的特点是链表结构，将递归遍历编程循环遍历，然后配合 requestIdleCallback API, 实现任务拆分、中断与恢复。
Fiber 也称协程或者纤程。它和线程并不一样，协程本身是没有并发或者并行能力的（需要配合线程），它只是一种控制流程的让出机制。让出 CPU 的执行权，让 CPU 能在这段时间执行其他的操作。渲染的过程可以被中断，可以将控制权交回浏览器，让位给高优先级的任务，浏览器空闲后再恢复渲染。
在 Fiber 中，会把一个耗时很长的任务分成很多小的任务片，每一个任务片的运行时间很短。虽然总的任务执行时间依然很长，但是在每个任务小片执行完之后，都会给其他任务一个执行机会。 这样，唯一的线程就不会被独占，其他任务也能够得到执行机会。

## Fiber的主要实现

- 对大型复杂任务的分片。
- 对任务划分优先级，优先调度高优先级的任务。
- 调度过程中，可以对任务进行挂起、恢复、终止等操作。

Fiber 对现有代码的影响： 由于 Fiber 采用了全新的调度方式，任务的更新过程可能会被打断，这意味着在组件更新过程中，render 及其之前的生命周期函数可能会调用多次。因此，在下列生命周期函数中不应出现副作用。

- shouldComponentUpdate
- React 16 中已经声明废弃的钩子
componentWillMount（UNSAFE_componentWillMount）
componentWillReceiveProps（UNSAFE_componentWillReceiveProps）
componentWillUpdate（UNSAFE_componentWillUpdate）

## Fiber结构

react内部运转分三层：

Virtual DOM 层，描述页面长什么样。
Reconciler 层，负责调用组件生命周期方法，进行 Diff 运算等。
Renderer 层，根据不同的平台，渲染出相应的页面，比较常见的是 ReactDOM 和 ReactNative。

Fiber 其实指的是一种数据结构，它可以用一个纯 JS 对象来表示：

```js
const fiber = {
    tag: TypeOfWork, // 标识 fiber 类型
    type: 'div', // 和 fiber 相关的组件类型
    return: Fiber | null, // 父节点
    child: Fiber | null, // 子节点
    sibling: Fiber | null, // 同级节点
    alternate: Fiber | null, // diff 的变化记录在这个节点上
    ...
}
```

![Fiber](https://user-images.githubusercontent.com/11912260/44942438-4c0e7f00-ade3-11e8-83ea-161e2aedcf8e.png)

## Fiber工作流程

一个 React 组件的渲染主要经历两个阶段：

调度阶段（Reconciler）：用新的数据生成一棵新的树，然后通过 Diff 算法，遍历旧的树，快速找出需要更新的元素，放到更新队列中去，得到新的更新队列。
渲染阶段（Renderer）：遍历更新队列，通过调用宿主环境的 API，实际更新渲染对应的元素。宿主环境如 DOM，Native 等。
对于调度阶段，新老架构中有不同的处理方式：

`React16前`
React 16 之前使用的是 Stack Reconciler（栈协调器），使用递归的方式创建虚拟 DOM，递归的过程是不能中断的。如果组件树的层级很深，递归更新组件的时间超过 16ms（以 60Hz 频率的显示器为例，浏览器绘制一帧的最小时间间隔为 1/60s 约等于 16ms），这时会发生俗称的掉帧现象，帧率不稳定时，用户就会感觉到卡顿。

为了实现不卡顿，就需要有一个调度器 (Scheduler) 来进行任务分配。优先级高的任务（如键盘输入）可以打断优先级低的任务（如Diff）的执行，从而更快的生效。任务的优先级有六种：

synchronous：与之前的Stack Reconciler操作一样，同步执行
task：在next tick之前执行
animation：下一帧之前执行
high：在不久的将来立即执行
low：稍微延迟执行也没关系
offscreen：下一次render时或scroll时才执行

`React16后`
React 16 及以后使用的是 Fiber Reconciler（纤维协调器），将递归中无法中断的更新重构为迭代中的异步可中断更新过程，这样就能够更好的控制组件的渲染。

为了实现渐进渲染的目的，Fiber 架构中引入了新的数据结构：Fiber Node，Fiber Node Tree 根据 React Element Tree 生成，并用来驱动真实 DOM 的渲染。

Fiber Reconciler（react ）执行过程分为2个阶段：

阶段一（1~3）：生成 Fiber 树，得出需要更新的节点信息。这一步是一个渐进的过程，可以被打断。阶段一可被打断的特性，让优先级更高的任务先执行，从框架层面大大降低了页面掉帧的概率。
阶段二(4)，将需要更新的节点一次过批量更新，这个过程不能被打断。

Fiber工作流程：

1. ReactDOM.render() 引导 React 启动或调用 setState() 的时候开始创建或更新 Fiber 树。
2. 从根节点开始遍历 Fiber Node Tree， 并且构建 workInProgress Tree（reconciliation 阶段）。
本阶段可以暂停、终止、和重启，会导致 react 相关生命周期重复执行。
React 会生成两棵树，一棵是代表当前状态的 current tree，一棵是待更新的 workInProgress tree。
遍历 current tree，重用或更新 Fiber Node 到 workInProgress tree，workInProgress tree 完成后会替换 current tree。
每更新一个节点，同时生成该节点对应的 Effect List。
为每个节点创建更新任务。
3. 将创建的更新任务加入任务队列，等待调度。
调度由 scheduler 模块完成，其核心职责是执行回调。
scheduler 模块实现了跨平台兼容的 requestIdleCallback。
每处理完一个 Fiber Node 的更新，可以中断、挂起，或恢复。
4. 根据 Effect List 更新 DOM （commit 阶段）。
React 会遍历 Effect List 将所有变更一次性更新到 DOM 上。
这一阶段的工作会导致用户可见的变化。因此该过程不可中断，必须一直执行直到更新完成。

![Fiber工作流程](https://user-images.githubusercontent.com/4338052/127530996-23513132-f3ef-4a3e-8553-8bfef2e3669b.png)

## 总结

从Stack Reconciler到Fiber Reconciler，源码层面其实就是干了一件递归改循环的事情
所以 React 通过Fiber 架构，让这个执行过程变成可被中断。“适时”地让出 CPU 执行权，除了可以让浏览器及时地响应用户的交互，还有其他好处:
分批延时对DOM进行操作，避免一次性操作大量 DOM 节点，可以得到更好的用户体验；
给浏览器一点喘息的机会，它会对代码进行编译优化（JIT）及进行热代码优化，或者对 reflow 进行修正。
