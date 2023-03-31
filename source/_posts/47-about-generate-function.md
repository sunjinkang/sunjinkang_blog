---
title: 生成器函数和yield关键字
date: 2023-03-31 14:00:46
tags:
---

###### 什么是生成器函数？
> function* 这种声明方式 (function关键字后跟一个星号）会定义一个生成器函数 (generator function)，它返回一个 Generator 对象。

###### 语法
```javascript
function* name([param[, param[, ... param]]]) { statements }
// name: 函数名
// param: 参数
// statements: 执行语句
```

###### 生成器函数的特性
1、调用一个生成器函数并不会马上执行它里面的语句，而是返回一个这个生成器的 迭代器 （ iterator ）对象。通过next()方法获取返回值

2、next()方法返回一个对象，这个对象包含两个属性：value 和 done

###### 生成器函数的相关特性
1、yield
yield 关键字用于暂停和恢复生成器函数。

2、yield*

###### 生成器函数的作用
生成器函数是ES6引入的新特性

###### 参考文献
[MDN: 生成器函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)
