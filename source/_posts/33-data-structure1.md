---
title: 数据结构与算法阅读笔记(1)
date: 2022-09-20 17:41:00
tags:
---

ECMAScript 和 javascript 的关系
ECMAScript 是一个语言标准，JavaScript 是该标准(最流行)的一个实现。

ES5、ES6、ES2015、ES7、ES2016、ES8、ES2017 和 ES.Next 的区别

(1)2009 年 12 月发布的 ECMAScript5(即 ES5，其中的 ES 是 ECMAScript 的简称)

(2)ECMAScript2015(ES2015)在 2015 年 6 月标准化。负责起草 ECMAScript 规范的委员会决定把定义新标准的模式改为每年更新一次，新的特性
一旦通过就加入标准。因此，ECMAScript 第六版更名为 ECMAScript2015(ES6)

(3)2016 年 6 月，ECMAScript 第七版被标准化，称为 ECMAScript2016 或 ES2016(ES7)

(4)2017 年 6 月，ECMAScript 第八版被标准化。我们称它为 ECMAScript2017 或 ES2017(ES8)

(5)ES.Next 用来指代下一个版本的 ECMAScript

ES6 兼容性：http://kangax.github.io/compat-table/es6/
ES7 兼容性：http://kangax.github.io/compat-table/es2016plus/

ES5 中 class 类，使用属性存取器
(1)声明 get 和 set 函数，只需要在我们要暴露和使用的函数名前面加上 get 或 set 关键字
(2)可以用相同的名字声明类属性，或者在属性名前面加下划线，让这个属性看起来像是私有的

```javascript
class Person {
  constructor(name) {
    this._name = name; // {1}
  }
  get name() {
    // {2}
    return this._name;
  }
  set name(value) {
    // {3}
    this._name = value;
  }
}
let lotrChar = new Person('Frodo');
console.log(lotrChar.name); // {4} // Frodo
lotrChar.name = 'Gandalf'; // {5}
console.log(lotrChar.name); // Gandalf
lotrChar._name = 'Sam'; // {6}
console.log(lotrChar.name); // Sam
```

乘方运算符

```javascript
const area = 3.14 * r * r;
const area = 3.14 * Math.pow(r, 2);
// ES2016 中引入了**运算符，用来进行指数运算
const area = 3.14 * r ** 2;
```

[JavaScript 和 ECMAScript 的完整功能列表](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

###### TypeScript

TypeScript 有一个名为鸭子类型的概念：如果它看起来像鸭子，像鸭子一样游泳，像鸭子一样叫，那么它一定是一只鸭子.
(1)接口

```javascript
// 第一种定义接口的方式
interface Person {
  name: string;
  age: number;
}
function printName(person: Person) {
  console.log(person.name);
}
/** 第二种定义接口的方式：Comparable 接口告诉 MyObject 类，它需要实现一个叫作 compareTo 的方法，
并且该方法接收一个参数。在该方法内部，我们可以实现需要的逻辑。**/
interface Comparable {
  compareTo(b): number;
}
class MyObject implements Comparable {
  age: number;
  compareTo(b): number {
    if (this.age === b.age) {
      return 0;
    }
    return this.age > b.age ? 1 : -1;
  }
}
```

**JavaScript 中使用一些类型和错误检测功能方式：在计算机上全局安装 TypeScript，使用时，只需要在 JavaScript 文件的第一行添加一句 // @ts-check**

###### 数组

数组是最简单的内存数据结构。JavaScript 里也有数组类型，但它的第一个版本并没有支持数组

(1)使用@@iterator 对象
ES2015 为 Array 类增加了一个@@iterator 属性，需要通过 Symbol.iterator 来访问

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let iterator = numbers[Symbol.iterator]();
console.log(iterator.next().value); // 1
console.log(iterator.next().value); // 2
console.log(iterator.next().value); // 3
console.log(iterator.next().value); // 4
console.log(iterator.next().value); // 5

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
iterator = numbers[Symbol.iterator]();
for (const n of iterator) {
  console.log(n);
}

// 复制已有数组
let numbers2 = Array.from(numbers);
let numbers3 = Array.of(...numbers);
```

(2)copyWithin
copyWithin 方法复制数组中的一系列元素到同一数组指定的起始位置

```javascript
copyArray = [1, 2, 3, 4, 5, 6];
copyArray.copyWithin(1, 3, 5);
// copyWithin(起始位置，开始位置，结束位置)
// [1, 4, 5, 4, 5, 6]
```

(3)排序

```javascript
// 自定义排序
const friends = [
  { name: 'John', age: 30 },
  { name: 'Ana', age: 20 },
  { name: 'Chris', age: 25 }, // ES2017 允许存在尾逗号
];
function comparePerson(a, b) {
  if (a.age < b.age) {
    return -1;
  }
  if (a.age > b.age) {
    return 1;
  }
  return 0;
}
console.log(friends.sort(comparePerson));
/**
[ 
 { name: 'Ana', age: 20 }, 
 { name: 'Chris', age: 25 },
 { name: 'John', age: 30 }, 
]
*/
// 忽略大小写的比较
const names = ['Ana', 'ana', 'john', 'John']; // 重置数组的初始状态
console.log(
  names.sort((a, b) => {
    if (a.toLowerCase() < b.toLowerCase()) {
      return -1;
    }
    if (a.toLowerCase() > b.toLowerCase()) {
      return 1;
    }
    return 0;
  })
);
// 希望小写字母排在前面或者对带有重音符号的字符做排序的话，那么需要使用 localeCompare 方法
const names = ['Ana', 'ana', 'john', 'John'];
names.sort((a, b) => a.localeCompare(b));
// ['ana', 'Ana', 'john', 'John']

const names2 = ['Maève', 'Maeve'];
console.log(names2.sort((a, b) => a.localeCompare(b)));
// ["Maeve", "Maève"]
```

###### 类型数组

| 类型数组          | 数据类型            |
| ----------------- | ------------------- |
| Int8Array         | 8 位二进制补码整数  |
| Uint8Array        | 8 位无符号整数      |
| Uint8ClampedArray | 8 位无符号整数      |
| Int16Array        | 16 位二进制补码整数 |
| Uint16Array       | 16 位无符号整数     |
| Int32Array        | 32 位二进制补码整数 |
| Uint32Array       | 32 位无符号整数     |
| Float32Array      | 32 位 IEEE 浮点数   |
| Float64Array      | 64 位 IEEE 浮点数   |

```javascript
let length = 5;
let int16 = new Int16Array(length);
let array16 = [];
array16.length = length;
for (let i = 0; i < length; i++) {
  int16[i] = i + 1;
}
console.log(int16);
```

类型数组作用：WebGL API、位操作、处理文件和图像

[类型数组文档](https://web.dev/webgl-typed-arrays/)

###### 栈

栈是一种遵从后进先出（LIFO）原则的有序集合。新添加或待删除的元素都保存在栈的同一端，称作栈顶，另一端就叫栈底。在栈里，新元素都靠近栈顶，旧元素都接近栈底

栈被用在编程语言的编译器和内存中保存变量、方法调用等，也被用于浏览器历史记录（浏览器的返回按钮）

(1)创建一个基于数组的栈

```javascript
class Stack {
  constructor() {
    this.items = [];
  }
  // 添加一个（或几个）新元素到栈顶
  push(element) {
    this.items.push(element);
  }
  // 移除栈顶的元素，同时返回被移除的元素
  pop() {
    return this.items.pop();
  }
  // 返回栈顶的元素，不对栈做任何修改（该方法不会移除栈顶的元素，仅仅返回它）
  peek() {
    return this.items[this.items.length - 1];
  }
  // 如果栈里没有任何元素就返回 true，否则返回 false
  isEmpty() {
    return this.items.length === 0;
  }
  // 返回栈里的元素个数。该方法和数组的 length 属性很类似
  size() {
    return this.items.length;
  }
  // 移除栈里的所有元素
  clear() {
    this.items = [];
  }
}
```

**在使用数组时，大部分方法的时间复杂度是 O(n)。O(n)的意思是，我们需要迭代整个数组直到找到要找的那个元素，在最坏的情况下需要迭代数组的所有位置，其中的 n 代表数组的长度。如果数组有更多元素的话，所需的时间会更长。另外，数组是元素的一个有序集合，为了保证元素排列有序，它会占用更多的内存空间。**
(2)创建一个基于 JavaScript 对象的 Stack 类

```javascript
class Stack {
  constructor() {
    this.count = 0; // count 属性记录栈的大小,也能帮助我们从数据结构中添加和删除元素
    this.items = {};
  }
  // 向栈中插入元素,只允许一次插入一个元素
  push(element) {
    this.items[this.count] = element;
    this.count++;
  }
  // 验证一个栈的大小
  size() {
    return this.count;
  }
  // 获取栈是否为空
  isEmpty() {
    return this.count === 0;
  }
  // 从栈中弹出元素
  pop() {
    if (this.isEmpty()) {
      return undefined;
    }
    this.count--;
    const result = this.items[this.count];
    delete this.items[this.count];
    return result;
  }
  // 查看栈顶的值
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.count - 1];
  }
  // 清空栈
  clear() {
    this.items = {};
    this.count = 0;
    //  while (!this.isEmpty()) {
    //  this.pop();
    // }
  }
  toString() {
    if (this.isEmpty()) {
      return '';
    }
    let objString = `${this.items[0]}`; // {1}
    for (let i = 1; i < this.count; i++) {
      // {2}
      objString = `${objString},${this.items[i]}`; // {3}
    }
    return objString;
  }
}
```

**javascript 实现私有属性的方法**
下划线命名约定

```javascript
// 中使用下划线命名约定来标记一个属性为私有属性
class Stack {
  constructor() {
    this._count = 0;
    this._items = {};
  }
}
```

_下划线命名约定就是在属性名称之前加上一个下划线（\_）。不过这种方式只是一种约定，并不能保护数据，而且只能依赖于使用我们代码的开发者所具备的常识_

**用 ES2015 的限定作用域 Symbol 实现类**

```javascript
const _items = Symbol('stackItems');
class Stack {
  constructor() {
    this[_items] = [];
  }
  // 栈的方法
}

const stack = new Stack();
stack.push(5);
stack.push(8);
let objectSymbols = Object.getOwnPropertySymbols(stack);
console.log(objectSymbols.length); // 输出 1
console.log(objectSymbols); // [Symbol()]
console.log(objectSymbols[0]); // Symbol()
stack[objectSymbols[0]].push(1);
stack.print(); // 输出 5, 8, 1
```

_访问 stack[objectSymbols[0]]得到\_items,并且，\_items 属性是一个数组，可以进行任意的数组操作，不符合栈的要求_

**用 ES2015 的 WeakMap 实现类**
WeakMap 可以存储键值对，其中键是对象，值可以是任意数据类型

```javascript
const items = new WeakMap(); // {1}
class Stack {
  constructor() {
    items.set(this, []); // {2}
  }
  push(element) {
    const s = items.get(this); // {3}
    s.push(element);
  }
  pop() {
    const s = items.get(this);
    const r = s.pop();
    return r;
  }
  // 其他方法
}
```

_代码的可读性不强，而且在扩展该类时无法继承私有属性_

**ECMAScript 类属性提案**

```javascript
class Stack {
  #count = 0;
  #items = 0;
  // 栈的方法
}
```

**从十进制转二进制**

```javascript
function decimalToBinary(decNumber) {
  const remStack = new Stack();
  let number = decNumber;
  let rem;
  let binaryString = '';
  while (number > 0) {
    rem = Math.floor(number % 2);
    remStack.push(rem);
    number = Math.floor(number / 2);
  }
  while (!remStack.isEmpty()) {
    binaryString += remStack.pop().toString();
  }
  return binaryString;
}
```

**进制转换算法**

```javascript
function baseConverter(decNumber, base) {
  const remStack = new Stack();
  const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // {6}
  let number = decNumber;
  let rem;
  let baseString = '';
  if (!(base >= 2 && base <= 36)) {
    return '';
  }
  while (number > 0) {
    rem = Math.floor(number % base);
    remStack.push(rem);
    number = Math.floor(number / base);
  }
  while (!remStack.isEmpty()) {
    baseString += digits[remStack.pop()]; // {7}
  }
  return baseString;
}
```
