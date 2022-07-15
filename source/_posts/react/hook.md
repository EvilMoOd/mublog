---
title: React hook汇总
date: 2022/07/12 14:45:48
update: 2022/07/14 14:45:48
categories:
 - [react]
tags:
 - react hook
sticky: true
description: react18已经出了接近一个多月了，hook作为react函数式组件最重要的功能，需要熟练运用和掌握其中的原理和使用场景
mermaid: true
---

## why hook？

在我学react时，恰好刚学完vue3中的compositionAPI，对hook有一个初步的了解，hook不同于vue2中的选项式定义数据方法或是react类组件中对状态的集中管理，它更像是code调用了一个库，而非框架调用code，使得复用性更强了。
[那么为什么不用mixin呢？]{.orange} mixin模式下伴随着隐式依赖，代码冲突覆盖等问题，使得vue和react都已经放弃使用mixin来复用逻辑
类组件作为一种面向对象思想的提醒，但由于其功能的堆加在使得代码臃肿，后期维护和tree shaking难度过高，hook便孕育而生

## hooks

### 响应式数据

#### useState

```js
const [state, setState] = useState(initData)

//例子
const [state, setState] = useState(0);
  return (
    <>
      <div onClick={()=>setState(state + 1)}>{state}</div>
    </>
  );
```

`state`就是响应式数据，与vue不同的是，hook需要用`setState`去重新为`state`赋值才能响应式刷新页面，`initData`则是数据初始值

:::warn no-icon

- 两次`setState`传入相同值，`state`不会更新，[特别注意，state是对象或数组时，修改state中的值再重新setState（state），视图不会更新，因为其地址相同].{red}
- 在组件一次执行上下文中，state的值固定不变。如在SI定时器中，若直接赋值`setState(state+1)`,则会使页面一直显示1，且控制台输出state的值为0。若需要使用定时器完成此功能，则需要使用`setState((state)=>state+1)`，回调函数中的参数为先前计算的状态
:::

#### useContext

useContext类型于vue中的provide Inject，需要在父组件中设置Provider，然后再子组件中使用

```js
const themes = {
  light: {
    foreground: "#000000",
    background: "#eeeeee"
  },
  dark: {
    foreground: "#ffffff",
    background: "#222222"
  }
};

const ThemeContext = createContext(themes.light);

function App() {
  return (
    <ThemeContext.Provider value={themes.dark}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background, color: theme.foreground }}>
      I am styled by theme context!
    </button>
  );
}
```

#### useReducer

```js
const [state, dispatch] = useReducer(reducer)

// 例子
  const [state, dispatch] = useReducer((state, action) => {
    const { payload, name } = action;
    switch (name) {
      case "add":
        return state + 1;
      case "sub":
        return state - 1;
      case "reset":
        return payload;
      default:
    }
    return state;
  }, 0);
  return (
    <>
      <div>{state}</div>
      <div onClick={() => dispatch({ name: "add" })}>+</div>
      <div onClick={() => dispatch({ name: "sub" })}>-</div>
      <div onClick={() => dispatch({ name: "reset", payload: 123 })}>re</div>
      {/* 传给子组件 */}
    </>
  );
```

这个hook有点类似于redux的状态管理方案，但我个人不太喜欢，推荐使用recoil

[接下来介绍三个react18新加入的数据钩子]{.orange}

#### useSyncExternalStore

```js
useSyncExternalStore(subscribe,getSnapshot,getServerSnapshot)
```

- subscribe为订阅函数，当数据改变时触发subscribe，通过比较getSnapshot决定是否更新数据
- getSnapshot是对数据的缓存，当变化时响应更新页面
- getServerSnapshot用于hydration模式下替代getSnapshot

这个hook类似于订阅store，store变化触发回调，目前运用的场景可能是持久化存储store
  
#### useTransition

```js
const [isPending , startTransition] = useTransition()

//例子
export default function Index(){
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);
  
  function handleClick() {
    startTransition(() => {
      setCount(c => c + 1);
    })
  }
  return (
    <div>
      {isPending && <Spinner />}
      <button onClick={handleClick}>{count}</button>
    </div>
  );
}
```

- isPending为处理状态标识，若处理中则为true，处理完毕则为false
- startTransition接受一个回调函数，该回调函数中所有工作(同步或异步)处理完毕之后才会将isPending置false
`useTransition`主要运用于loading场景，当一些数据处于网络请求加载中时，我们可以将其添加一个暂时的loading界面提高用户的体验，而不是白屏等待
业务上如通过切换tab时，tab为非网络响应任务，则可以立即完成，而获取数据渲染列表则为网络响应任务，需要等待，我们可以用该hook优化

#### useDeferredValue

```js
useDeferredValue()
```

该hook与上面类似，将任务推迟执行，推迟到react所有工作执行完成后再执行，但不同的是，`useTransition`侧重于过程，`useDeferredValue`侧重于状态，
可以用该hook将某个诸如输入框的状态进行防抖

### 数据派生缓存

组件更新时导致重新渲染时，所有的非缓存代码都会重新执行，若某些状态或函数传递给子代props，则会间接导致子组件也进行了重复的渲染，造成性能的浪费，为了避免于此，我们需要使用memorize(记忆)

#### useMemo

```js
const memo = useMemo(() => state+1, [state])
```

用过vue的话，对于computed和pinia的getter都不会感到陌生，这个hook跟其相似，都是对状态的派生缓存，只有当第二个参数数组中的state改变时，才会重新进行计算缓存，算是性能优化的一种方式
常常用于缓存大量数据的计算结果，防止组件其他无关状态变化而刷新组件导致重复计算丢失性能

#### useCallback

```js
const memoFn = useCallback(
  () => {
    //函数
  },
  [state],
)

```

千万不要拿此hook与vue的watch相提并论，这完全不是同一个东西，如同useMemo缓存状态（数据），此hook缓存的是函数，当组件更新时，函数会重复执行，造成性能浪费，该hook就是解决了这一个问题，若是函数还要传入给子组件，那么可以使用该钩子优雅地解决性能问题（子组件需要memo）

#### `memo`

memo这个并不是hook，而是一个HOC（高阶函数）包裹需要缓存的组件（与缓存相关所以提一下），多与上述两个hook搭配使用，被缓存的组件只有在prop变化时才会重新渲染

```js
export default memo(function app() {
  return (
    <div>app</div>
  )
})

```

:::success no-icon
useMemo缓存状态（数据）
useCallback缓存函数
memo缓存组件
:::

### 副作用

副作用钩子的出现主要解决了函数组件没有生命周期的缺陷，但对其的使用必须有熟悉的生命周期概念，才能更好地理解，下面对组件生命周期进行一个新的概述。

:::primary no-icon
框架的生命周期大概有这几个阶段（箭头表示该阶段后执行对应vue3中的生命周期钩子和react副作用hook）
1、初始化组件函数，将组件编译执行一遍
2、生成虚拟dom-->beforeMounted（页面更新时beforeUpdated）=>useInsertionEffect
3、生成真实dom-->mounted（页面更新时updated）=>useLayoutEffect
4、将dom渲染到页面-->render=>useEffect
5、当页面被更新，重新回到2（页面卸载，跳出生命周期-->unMounted）=>三个effect return的函数
:::

#### useEffect

```js
useEffect(() => {
  //mounted时执行函数

  return () => {
    //unmounted时执行
  }
}, [state])
```

刚开始对该钩子开始的理解，以为他是生命周期钩子的替代品，但如果是这么想就大错特错

- useEffect是异步的（生命周期钩子是同步的会阻塞线程）
- useEffect执行的时间点再render后,也就是4后（该时间点没有对应的钩子）

下面举个例子来讨论useEffect用法

```js
// APP
export default function App() {
  const [show, setShow] = useState(true);

  return (
    <>
      <div
        onClick={() => {
          setState(!show);
        }}
      >
        卸载组件
      </div>
      {show && <Counter />}
    </>
  );
}
//Counter组件
export default memo(function Index() {
  console.log("渲染");
  const [state, setState] = useState(0);
  useEffect(() => {
    console.log(state);
    return () => {
      console.log(state);
    };
  }, [state]);
  return <div onClick={() => setState(state + 1)}>{state}</div>;
});
```

![useEffect](https://s2.loli.net/2022/07/14/8rKJuRcoFAxBLtk.png)  

通过实验我们可以得出结论（分5段，若数组为空，则只有1、4、5）
1、在一开始组件render时会执行一次副作用函数
2、当我们点击+1更新数据时，会先执行return中的函数（阶段5），也就是在下一个副作用函数之前且数据还是旧的（并非beforeUpdated，该钩子执行时虚拟dom已经生成完毕了，数据是最新的），然后setState更新之后再次执行副作用函数打印出最新数据，对应新页面生命周期render
3、再次加一同上
4、当我们点击卸载组件后，执行一次return中的回调函数(阶段5)
5、此时我们再次点击卸载组件将组件挂载，得到与1相同的结果

一般可以在useEffect中进行数据请求，设置和清除定时器，操作dom绑定事件等操作

:::danger no-icon
在react18中，useEffect函数会再执行多一次，可能为了适应并发模式，可以通过关闭严格模式解决
:::

#### useLayoutEffect

```js
useLayoutEffect(() => {
  //beforeMounted时执行回调函数

  return () => {
    //同useEffect
  };
}, [])
```

该hook采用同步执行，算是真正意义上的生命周期钩子
当第二个参数数组中为空时，hook可作为mounted使用，真实dom生成但页面还没渲染时执行一次第一个参数中的回调函数，在此钩子中执行dom操作会比在useEffect中好，主要是为了避免浏览器再次回流重绘造成的闪屏
当第二个参数数组中填入状态（数据）时，hook作为类似vue中的watch使用，状态更新时调用第一个参数中的回调函数[(页面首次生成真实dom时也会执行一次回调函数)]{.red}
[为什么这个不是updated而是watch呢？updated和watch两者根本上都是状态(数据)改变导致页面重新渲染而触发函数，虽然触发动机略有差别，但最终结果都是一致的。显然该hook更像watch，是数据改变驱动函数执行，但其执行的时间点恰好是在updated，所以也可以当作updated来用]{.orange}
第一个参数中的回调函数return时与useEffect作用相同

:::warning
该hook中的回调函数会阻塞浏览器的绘制
因为如此，react官方更推荐使用useEffect完成网络请求更新数据等操作
:::

#### useInsertionEffect

```js
export default function Index(){

  useInsertionEffect(()=>{
     /* 动态创建 style 标签插入到 head 中 */
     const style = document.createElement('style')
     style.innerHTML = `
       .css-in-js{
         color: red;
         font-size: 20px;
       }
     `
     document.head.appendChild(style)
  },[])

  return <div className="css-in-js" > hello , useInsertionEffect </div>
}
```

该hook执行时间点比useLayoutEffect更早（阶段2），也就是最早执行的副作用钩子，执行时真实dom还未更新，主要的运用场景时解决CSS in JS渲染中注入样式的性能问题，其他场景估计用不太到

### 访问dom

#### useRef

众所周知，react是数据驱动型的MVVM框架，但某些场景我们仍需要直接操作dom来实现业务需求

```js
export default function hook() {
  const dom = useRef(null)
  return (
    <div ref={dom}>hook</div>
  )
}
```

另外useRef还可以用来保存状态

```js
export default function hook() {
  const status = useREF(false)
  const changeStatus = () => {
    status.current = true
  }
}
```

:::info no-icon
可以将此状态作为useCallback的依赖项，这样一来useCallback中的函数将永久性缓存，且其依赖的状态通过ref.current访问到时一直是最新的，性能优化终极方案！
:::

#### useImperativeHandle

父组件可以将状态和函数通过prop传给子组件，子组件想将数据和函数暴露给父组件也是有方法的，在vue中我们可以通过defineExpose来决定暴露的状态方法并在父组件中获取组件ref的方式调用数据方法，在react中我们同样可以用useImperativeHandle搭配forwardRef来实现defineExpose相同的功能

```js
//子组件
function Son(props: any, ref: any) {
  useImperativeHandle(ref, () => ({
    log: () => {
      console.log(123);
    },
    a: 1
  }));
  return <></>;
}
export default forwardRef(Son);
//父组件
import Son from "./components/Son";
export default function App() {
  const son = useRef(null);
  useEffect(() => {
    son.current.log();
  }, []);

  return (
    <>
      <Son ref={son} />
    </>
  );
}
```

我们先将子组件用高阶函数forwardRef暴露出去，暴露之后forwardRef会传给子组件一个ref作为第二个参数[(第二个参数 ref 只在使用 React.forwardRef 定义组件时存在)]{.red}，这个ref指向子组件本身，我们将该ref作为useImperativeHandle的第一个参数，并且在第二个参数中写入我们需要暴露的属性方法
然后在父组件中我们使用ref的方式访问组件dom来获取上面的属性和方法

### 工具hook

#### useDebugValue

该hook主要是为了在react开发工具中显示自定义hook的标签，检查自定义hook

#### useId

此hook是react18的新hook，它可以在客户端和服务端生成唯一的id，解决服务端渲染中，两端产生id不一致的问题，更重要是保障了react18中的streaming renderer（流式渲染）中id的稳定性

## 总结

以上就是所有hook的介绍，hook的出现大大方便了react的使用，我一开始学react时是从类组件开始的，类组件的使用让人非常难受，this问题一直让我怀疑react真的那么好用嘛？后来接触到hook才知道react真正牛逼的地方，这也是vue3中compositionAPI的前身吧。
官方强烈推荐使用函数式组件和hook的搭配使用来彻底代替类组件的使用，那么我们也没有理由再去学习类组件了，哪怕是还没接触过react的小白，所以现在就彻底拥抱react函数组件和hook吧!!!:smile:

[不得不说，vue3和react真的越来越像同一个模子的框架了，template+compositionAPI和jsx+hook的使用竟十分相像，以至于我从vue3转react的时候十分的平滑（react文档尽快重置啊！！！里面很多类组件的用法看的我头大）]{.green}
