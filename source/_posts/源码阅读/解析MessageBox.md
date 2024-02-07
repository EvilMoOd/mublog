---
title: 源码解析--MessageBox组件
date: 2024/02/05
categories:
 - [源码解析]
tags:
 - 源码解析
 - ElementPlus
description: "分析ElementPlus是如何用Promise实现Dialog窗口关闭时的then和catch操作--打通vue组件视图层和ts代码逻辑层之间的交互桥梁"
---

:::success no-icon
建议clone源码配合食用，不懂的可以及时跳转至定义进行反复推敲味道更佳
:::

## MessageBox使用

看源码前先看看实现和效果，确认功能点：

``` javascript
// 常规写法
ElMessageBox('内容','标题',{}).then().catch()
// 指定样式
ElMessageBox.confirm()
ElMessageBox.alert()
ElMessageBox.prompt()
```

正常的调用逻辑如上，用的比较多的是下面三种，配合tsx可以大大提高代码可读性，另外，如果用户点选确定按钮，则会走then逻辑，关闭或者取消则会走catch逻辑

## 点选按钮走then和catch逻辑是怎么实现的？

首先我们直接定位到项目的messageBox文件，找到`MessageBox`函数（这里删除了与实现无关代码，完整代码请移步[源码](https://github.com/element-plus/element-plus/blob/dev/packages/components/message-box/src/messageBox.ts)）

```javascript
// MessageBox.ts
const messageInstance = new Map<
  ComponentPublicInstance<{ doClose: () => void }>, // marking doClose as function
  {
    options: any
    callback: Callback | undefined
    resolve: (res: any) => void
    reject: (reason?: any) => void
  }
>()
function MessageBox(
  options: ElMessageBoxOptions | string | VNode,
  appContext: AppContext | null = null
): Promise<{ value: string; action: Action } | Action> {
  // 初始化也就是弹窗时，函数返回一个promise，在关闭时（onActions）进行resolve或者reject
  return new Promise((resolve, reject) => {
    const vm = showMessage(
      options,
      appContext ?? (MessageBox as IElMessageBox)._context
    )
    // collect this vm in order to handle upcoming events.
    messageInstance.set(vm, {
      options,
      callback,
      resolve,
      reject,
    })
  })
}
```

直接看到返回promise这一部分，我们可以看到在Promise的`executor`函数中，`resolve`和`reject`被set到了`messageInstance`上，该变量相当于缓存message函数的上下文

这里还执行了一个showMessage的操作，跳转至showMessage函数我们可以看到, 在options上绑定了一个actions事件。该事件从messageInstance中拿到当前msg实例后，便可以直接使用实例已经在前面挂载好的resolve和reject属性了

:::info no-icon
我们知道vue的事件绑定可以用@action写，也可以用onAction
:::

```javascript
// showMessage函数中
options.onAction = (action: Action) => {
  // messageBox
  const currentMsg = messageInstance.get(vm)!
  let resolve: Action | { value: string; action: Action }
  if (action === 'cancel' || action === 'close') {
    if (options.distinguishCancelAndClose && action !== 'cancel') {
      currentMsg.reject('close')
    } else {
      currentMsg.reject('cancel')
    }
  } else {
    currentMsg.resolve(resolve)
  }
}

```

## 如何连接组件与TS代码？

将事件添加到options作为属性后，接下来需要创建一个实例

```javascript
// showMessage函数中
const instance = initInstance(options, container, appContext)!

const initInstance = (
  props: any,
  container: HTMLElement,
  appContext: AppContext | null = null
) => {
  const vnode = createVNode(
    MessageBoxConstructor,
    props,
    isFunction(props.message) || isVNode(props.message)
      ? {
          default: isFunction(props.message)
            ? props.message
            : () => props.message,
        }
      : null
  )
  vnode.appContext = appContext
  render(vnode, container) //渲染Dialog
  getAppendToElement(props).appendChild(container.firstElementChild!)
  return vnode.component
}

vm.visible = true // 将Dialog visible设置为true

```

我们可以看到`options`在`initInstance`中作为props，通过`createVNode`函数传给了`MessageBoxConstructor`（index.vue），也就是说在index.vue中只要 `emit('action')`，就会触发`onAction`绑定的函数，也就是将`Promise`进行`resolve`或者`reject`。

另外dialog的渲染与展示也在上面代码中标注出来

## 总结

在调用`MessageBox`时，ElementPlus通过`createNode`创建并`render`了vue组件，并将其`visible`设置为`true`，并且通过传入`options（props）`来绑定action事件。调用`MessageBox`函数返回的`promise`其中的`resolve`和`reject`被挂载到了`messageInstance`实例上，并在`action`事件中直接获取该`messageInstance`进行`resolve`和`reject`达到交互型的promise效果。

另外也可以稍微看一下 `messageBoxFactory` 工厂函数是如何实现`MessageBox.confirm`几个函数的，实现并不复杂，对未来封装工厂函数具有一定启发。
