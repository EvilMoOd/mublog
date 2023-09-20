---
title: TS知识体系梳理
date: 2023/01/23
categories:
 - [Typescipt]
tags:
 - Typescript
sticky: true
description: "鉴于TS官方文档全英且废话多难以阅读，且ts起步知识学的比较杂乱，所以打算重新写一篇文章构建一下TS知识体系，且打算做一下类型体操，所以算是对知识点进行一次复习"
---
## 定义变量的类型

:::info
这一部分主要介绍类型系统中类型的简单定义方式，阅读完此章即可上手开发满足大部分开发需求情况
:::

### 常用类型定义

#### 三大常用基础类型

```typescript
let type1: string
let type2: number
let type3: boolean
```

#### 字面量

```typescript
// 明确变量的值，也可以用在对象属性或者函数参数返回值
let font: 'hello'
let font: 1 ｜ 2
```

#### bigint和symbol

```typescript
let big: bigint = 100n;
let sym: symbol = Symbol("lin"); 
```

#### null和undefined

```typescript
let typeN: null
let typeU: undefined
```

:::success no-icon
是任意类型子类型，strictNullChecks如果on，则严格null和undefined
:::

:::success no-icon

```typescript
function liveDangerously(x?: number | null) {
  // No error
  console.log(x!.toFixed());
}
```

ts中使用 `!.`类似于类型断言，可以明确该变量不为null和undefined
:::

#### 数组

```typescript
// 以下也可以写成 Array<string> 泛型写法
let typeArr1: string[]
let typeArr2: number[]
let typeArr3: boolean[]

// 定义数组元素（元组）
let typeArrY:[string, number, boolean] = ['123', 123, true]

// 只读数组
let arr:readonly string[]
let arr:ReadonlyArray<Type>
// 只读元组
let arr:readonly [string, number]
```

#### 内置对象

```typescript
const date: Date = new Date()
const err: Error = new Error('Error!');
const reg: RegExp = /abc/;
```

#### DOM和BOM

```typescript
let body: HTMLElement = document.body
let allDiv: NodeList = document.querySelectorAll('div');
document.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault()
  // Do something
});
```

#### any 和 unknown 还有 never

```typescript
let type: any
let typeU: unknown
let typeN: never //不存在，一般不会显式赋值，只由类型系统判断
```

#### 模板文字类型

```typescript
type World = "world";
type Greeting = `hello ${World}`;
```

更多关于模板文字示例前往官网查看

#### 联合类型

```typescript
// 类型可以是string或者number
let type: string | number
```

:::warning no-icon
如果类型不定义则默认为any，any对于类型系统来说放弃类型校验，是不好的，尽量使用unknown配合类型断言或是条件判断，让类型使用更安全一些

```typescript
function divide(param: unknown) {
  return param as number / 2;
}
```

:::

:::success no-icon
类型断言：在变量后使用 `as [type]`如上事例，可以告诉类型系统这里的类型一定是什么，可以跳过类型系统安全检查
:::

### 函数

#### 函数参数和返回值的定义

```typescript
function add(x: number, y: number, z:string | number, o: {name: string}, f:(n:number) => void): number {
    return x + y
}

// 解构写法
function sum({ a, b, c }: { a: number; b: number; c: number }) {
  console.log(a + b + c);
}

// 无返回值可以填void，也可以不写交给类型系统判断
function v(): void{
  // ...
}
```

#### 箭头函数

```typescript
let add2 = (x: number, y: number): number => x + y

// 默认参数和可选参数
let add2 = (x: number = 100, y?: number): number => x + y
```

:::success no-icon
可选参数在使用时会有undefined警告，可以用默认参数来避免
可选参数为对象，可以用解构写法配合默认参数来避免
当然在明确该参数指定不需要默认时，可以用条件判断进行约束
:::

#### 函数重载~~（用泛型更加优雅，不建议重载写法）~~

```typescript
function add(x: number[]): number
function add(x: string[]): string
```

2023.9.20日更新：
一次重构公司项目的axios函数时发现了关于函数重载的新的理解，函数重载的用法不仅仅如上面Demo这么简单，在某些时候发挥着泛型无法替代的作用
如下示例中

```typescript
interface Person {
  name: string;
  age: number;
}
interface Boy extends Person {
  gender: 'man';
}

interface Girl extends Person {
  gender: 'women';
}
// 重载：根据传入参数的不同来返回不同的值
function xxx(params: Boy): string;
function xxx(params: Girl): Promise<string>;
// 函数实现：将可能的入参和返回用联合类型写出来
function xxx(params: Boy | Girl): string | Promise<string> {
  if (params.gender === 'man') {
    return 'isMan';
  } else {
    return new Promise<string>((resolve, reject) => {
      resolve('isGirl');
    });
  }
}
// 测试用例
const person1: Boy = {
  name: 'nihao',
  age: 13,
  gender: 'man',
};
const person2: Girl = {
  name: 'nihao',
  age: 13,
  gender: 'women',
};
const res = xxx(person1); //string
const res2 = xxx(person2); // Promise<string>

```

通过上面简单的示例，可以使TS类型系统通过函数的入参正确地返回所需要的返回值，确保类型提示正确。

:::success no-icon
类型推断：Typescript对不显式定义的变量会根据赋值等情况自动推断其类型
:::

#### Call Signatures 和 Construct Signatures

这两个概念在官方文档中提到，用的不多不做收录

#### 泛型函数

泛型函数通过 `<Type>`符号定义，在使用时以同样写法输入，这种动态类型写法可以使函数更加通用

```typescript
// 类型系统自动推断
function firstElement<Type>(arr: Type[]): Type | undefined {
  return arr[0];
}
// s is of type 'string'
const s = firstElement(["a", "b", "c"]);
// n is of type 'number'
const n = firstElement([1, 2, 3]);
// u is of type undefined
const u = firstElement([]);

// 可以指定多个类型
function map<Input, Output>(arr: Input[], func: (arg: Input) => Output): Output[] {
  return arr.map(func);

// Parameter 'n' is of type 'string'
// 'parsed' is of type 'number[]'
const parsed = map(["1", "2", "3"], (n) => parseInt(n));

// 显示指定参数
function combine<Type>(arr1: Type[], arr2: Type[]): Type[] {
  return arr1.concat(arr2);
}
const arr = combine<string | number>([1, 2, 3], ["hello"]);
```

:::danger no-icon
泛型在许多代码中都会以 `<T,S>`来命名，个人推荐用更语义化的写法
:::

可以用 `extends`约束其传入类型条件

:::success no-icon
`extends`主要用于interface的继承使对象约束类型更丰富，或是泛型中的类型约束，使传入的类型更具体。`extends`在Typescript中，用[约束]{.yellow}相对于[继承]{.yellow}可以更好体现其作用
:::

```typescript
function longest<Type extends { length: number }>(a: Type, b: Type) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}
 
// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'alice' | 'bob'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);
```

官方文档提供三个例子避免泛型屎山写法，可以跳转学习

### 对象

#### 字面量定义

```typescript
let obj: {
  name: string
}
```

#### 接口描述对象

```typescript
interface Person {
    name: string
    age?: number //可选属性
    readonly id: number //只读属性
}
// 定义对象
const obj: Person
// 定义数组,元素为该对象，常用于接口返回数组时如此定义
const arr: Person[]
// 索引访问
type type1: Person['name'] // string
type Person2 = typeof arr[number]; // Person
// 索引查询 (将对象key转化成联合类型)
type UPerson = keyof Person; // 'name' | 'age' ｜ 'id' 
// 映射 (将联合类型转换为对象的key)
type Person3 =  {
  [p in keyof Person]: string // 注意这里如果in UPerson的话会失去只读和可选属性
}
// 可以用 - 取消只读或可选状态
type Person4 =  {
  -readonly [p in keyof Person]: string
}
type Person5 =  {
  [p in keyof Person]-?: string
}
// 用 as 来将赋值新key，比如将其全部大写，或者用模板文字类型包装
type Person6 = {
    [p in keyof Person as NewKeyType]: Type[Properties]
}

// 函数类型
interface ISum {
    (x:number,y:number):number
}
const add:ISum = (num1, num2) => {
    return num1 + num2
}
```

#### 索引签名

```typescript
interface RandomKey {
    [name: string]: string
}
// key若为number则为类数组，不具有数组上的方法
interface LikeArray {
    [name: number]: string
}
const arr: LikeArray = ['hello', 'lin']

```

接口可以进行重载，配合函数重载可以丰富函数，但重载写法会使代码过于臃肿，所以还是推荐用泛型定义

#### 泛型对象

```typescript
interface IPrint<T> {
    (arg: T): T
}
// 指定默认值
interface IPrint<T = number> {
    (arg: T): T
}

// 同泛型函数，可以用接口先定义后再用泛型约束
interface ILength {
  length: number
}

function printLength<T extends ILength>(arg: T): T {
    console.log(arg.length)
    return arg
}
// 可以配合keyof约束类型
const userInfo = {
  name: 'lin',
  age: '18',
}
function getValues<T, K extends keyof T>(userInfo: T, keys: K[]): T[K][] {
    return keys.map(key => userInfo[key])
}
getValues(userInfo, ['name', 'age']) // 当不为name、age时报错
```

#### 交叉类型

```typescript
interface Person {
    name: string
    age: number
}

type Student = Person & { grade: number }
```

### 枚举

```typescript
enum Direction {
    Up,
    Down,
}
console.log(Direction.Up)        // 0
console.log(Direction.Down)      // 1
// 反向映射
console.log(Direction[0])      // Up
console.log(Direction[1])      // Down
```

```typescript
// 定义值
enum Direction {
    Up = 6,
    Down,
}
console.log(Direction.Up)        // 6
console.log(Direction.Down)      // 7

enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}
const value = 'UP'
if (value === Direction.Up) {
    // do something
}
```

```typescript
// 常量枚举,编译后的代码更简洁
const enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}

const value = 'UP'
if (value === Direction.Up) {
    // do something
}

```

### 类

用的少，暂时跳过

## 类型别名

```typescript
// 对类型进行收集便于复用
type param = string | number
// 对象也可以，但interface用的比较多
type Point = {
  x: number;
  y: number;
};
let a: Point
```

:::info no-icon
type和interface区别在于

1. 继承：前者用&，后者用extends
2. 重写：type无法重写，interface可以重写

:::

## 类型获取和保护

### 使用 `typeof`运算符

使用 `typeof`运算符,可以获取变量的类型，通过条件判断可以保障类型安全性，这里用 `switch`或者三元运算符也是可以的

```typescript
function getLength(arg: number | string): number {
    if(typeof arg === 'string') {
        return arg.length
    } else {
        return arg.toString().length
    }
}

```

:::success no-icon
typeof非常强大，对于未知的变量类型，可以直接用typeof提取其类型（将变量 `var`转换成类型 `type`），当然针对函数后面会提到工具函数来更好地进行类型提取，如一些非自己定义的函数如setTimeout或其他库函数
:::

### 使用 `in`运算符

`in`运算符可以对对象中属性做判断，配合条件判断得到正确类型

```typescript
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }

  return animal.fly();
}
```

### 使用 `instanceof`运算符

`instanceof`运算符可以检测对象同上

```typescript
function logValue(x: Date | string) {
  if (x instanceof Date) {
    console.log(x.toUTCString());
  } else {
    console.log(x.toUpperCase());
  }
}
```

[更多条件类型判断例子可以前往官方文档查看，这里只举个例子进行说明]{.label .warning}

### 类型谓词

用 `is`来肯定函数返回值类型

```typescript
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

## 工具类型

直接跳转至官网查看即可

[工具类型](https://www.typescriptlang.org/docs/handbook/utility-types.html)

[模版工具](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html "四个")
