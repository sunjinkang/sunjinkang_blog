---
title: 数据结构与算法阅读笔记(1)
date: 2022-09-20 17:41:00
tags:
---

ECMAScript和javascript的关系
ECMAScript是一个语言标准，JavaScript是该标准(最流行)的一个实现。

ES5、ES6、ES2015、ES7、ES2016、ES8、ES2017 和 ES.Next的区别

(1)2009年12月发布的ECMAScript5(即ES5，其中的ES是ECMAScript的简称)

(2)ECMAScript2015(ES2015)在2015年6月标准化。负责起草 ECMAScript 规范的委员会决定把定义新标准的模式改为每年更新一次，新的特性
一旦通过就加入标准。因此，ECMAScript第六版更名为ECMAScript2015(ES6)

(3)2016年6月，ECMAScript第七版被标准化，称为ECMAScript2016或ES2016(ES7)

(4)2017年6月，ECMAScript第八版被标准化。我们称它为ECMAScript2017或ES2017(ES8)

(5)ES.Next用来指代下一个版本的ECMAScript

ES6兼容性：http://kangax.github.io/compat-table/es6/
ES7兼容性：http://kangax.github.io/compat-table/es2016plus/

ES5中class类，使用属性存取器
(1)声明get和set函数，只需要在我们要暴露和使用的函数名前面加上 get 或 set 关键字
(2)可以用相同的名字声明类属性，或者在属性名前面加下划线，让这个属性看起来像是私有的
```javascript
class Person { 
 constructor (name) { 
 this._name = name; // {1} 
 } 
 get name() { // {2} 
 return this._name; 
 } 
 set name(value) { // {3} 
 this._name = value; 
 } 
} 
let lotrChar = new Person('Frodo'); 
console.log(lotrChar.name); // {4} // Frodo
lotrChar.name = 'Gandalf'; // {5} 
console.log(lotrChar.name);  // Gandalf
lotrChar._name = 'Sam'; // {6} 
console.log(lotrChar.name); // Sam
```

乘方运算符
```javascript
const area = 3.14 * r * r; 
const area = 3.14 * Math.pow(r, 2); 
// ES2016 中引入了**运算符，用来进行指数运算
const area = 3.14 * (r ** 2);
```

[JavaScript和ECMAScript的完整功能列表](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript)

###### TypeScript
TypeScript有一个名为鸭子类型的概念：如果它看起来像鸭子，像鸭子一样游泳，像鸭子一样叫，那么它一定是一只鸭子.
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

**JavaScript中使用一些类型和错误检测功能方式：在计算机上全局安装TypeScript，使用时，只需要在JavaScript文件的第一行添加一句 // @ts-check**

###### 数组
数组是最简单的内存数据结构。JavaScript里也有数组类型，但它的第一个版本并没有支持数组

(1)使用@@iterator 对象
ES2015 为 Array 类增加了一个@@iterator 属性，需要通过 Symbol.iterator 来访问
```javascript
const numbers = [1,2,3,4,5,6,7,8,9];
let iterator = numbers[Symbol.iterator](); 
console.log(iterator.next().value); // 1 
console.log(iterator.next().value); // 2 
console.log(iterator.next().value); // 3 
console.log(iterator.next().value); // 4 
console.log(iterator.next().value); // 5 

const numbers = [1,2,3,4,5,6,7,8,9];
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
console.log(names.sort((a, b) => { 
 if (a.toLowerCase() < b.toLowerCase()) { 
 return -1; 
 } 
 if (a.toLowerCase() > b.toLowerCase()) { 
 return 1; 
 } 
 return 0; 
})); 
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
for (let i=0; i<length; i++){ 
 int16[i] = i+1; 
} 
console.log(int16); 
```
类型数组作用：WebGL API、位操作、处理文件和图像

[类型数组文档](https://web.dev/webgl-typed-arrays/)