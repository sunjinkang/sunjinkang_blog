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