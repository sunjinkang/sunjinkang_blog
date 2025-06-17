---
title: 生成器函数和yield关键字
date: 2023-03-31 14:00:46
cover: https://cdn.pixabay.com/photo/2016/12/22/09/50/science-1925058_640.png
tags:
---

###### 什么是生成器函数？
> function* 这种声明方式 (function关键字后跟一个星号）会定义一个生成器函数 (generator function)，它返回一个 Generator 对象。
> 也可以使用构造函数 GeneratorFunction 或 function* expression 定义**生成器函数 **

###### 语法
```javascript
function* name([param[, param[, ... param]]]) { statements }
// name: 函数名
// param: 参数
// statements: 执行语句
// 声明方式可以为：function* name(){} 或者 function *name(){}
```
<!-- more -->
###### 简单举例
```javascript
function* generator(i) {
    return  i+1;
}
const gen = generator(3);
console.log(gen.next());
// {value: 4, done: true}
```
*生成器函数不能作为构造函数使用*
```javascript
function* Test() {
 // some operation
}
const newTest = new Test();
```

###### 生成器函数的特性
1、调用一个生成器函数并不会马上执行它里面的语句，而是返回一个这个生成器的 迭代器 （ iterator ）对象。通过next()方法获取返回值

2、next()方法返回一个对象，这个对象包含两个属性：value 和 done, done为true表示函数完成，为false函数未完成，可继续调用next方法

###### 生成器函数的相关特性
1、yield
yield 关键字用于暂停和恢复生成器函数。
```javascript
function* testYield() {
  for (let num = 0; num < 3; num++) {
    yield num;
  }
}
const result = testYield();
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
// { value: 0, done: false }
// { value: 1, done: false }
// { value: 2, done: false }
// { value: undefined, done: true }
```

yield 关键字使生成器函数执行暂停，yield 关键字后面的表达式的值返回给生成器的调用者，即表达式的值为返回对象中的value。它可以被认为是一个基于生成器的版本的 return 关键字。

返回：
- IteratorResult 对象
  - value
  - done

一旦遇到 yield 表达式，生成器的代码将被暂停运行，直到生成器的 next() 方法被调用。每次调用生成器的 next() 方法时，生成器都会恢复执行，直到达到以下某个值：
- yield：导致生成器再次暂停并返回生成器的新值。下一次调用 next() 时，在 yield 之后紧接着的语句继续执行。
- throw：用于从生成器中抛出异常。这让生成器完全停止执行，并在调用者中继续执行，正如通常情况下抛出异常一样。
- 到达生成器函数的结尾.在这种情况下，生成器的执行结束，并且 IteratorResult 给调用者返回 value 的值是 undefined 并且 done 为 true。
- 到达 return 语句。在这种情况下，生成器的执行结束，并将 IteratorResult 返回给调用者，其 value 的值是由 return 语句指定的，并且 done 为 true。
```javascript
// throw
function* testYield() {
  for (let num = 0; num < 3; num++) {
    yield num;
  }
}
const result = testYield();
console.log(result.next());
console.log(result.throw(new Error('1')));
console.log(result.next());
console.log(result.next());
// { value: 0, done: false }
// Error: 1

// return
function* testYield() {
  for (let num = 0; num < 3; num++) {
    yield num;
    return 45;
  }
}
const result = testYield();
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
// { value: 0, done: false }
// { value: 45, done: true }
// { value: undefined, done: true }
// { value: undefined, done: true }
```
如果将参数传递给生成器的 next() 方法，则该值将成为生成器当前 yield 操作返回的值
*注意：第一个next只是为了启动生成器，传递的参数不起作用*
```javascript
function* testYield() {
  let num = 0;
  while (true) {
    const result = yield num;
    console.log(result);
  }
}
const result = testYield();
console.log(result.next(2)); // no result return
console.log(result.next(3)); // result: 3
console.log(result.next(6)); // result: 6
console.log(result.next());
```

2、yield*
用于委托给另一个generator或可迭代对象
- yield* 表达式迭代操作数，并产生它返回的每个值。
- yield* 表达式本身的值是当迭代器关闭时返回的值（即done为true时）。
- yield* 还可以 yield 其他任意的可迭代对象，比如说数组、字符串、arguments 对象等等。
```javascript
// eg:one
function* testOne() {
 yield 1;
 yield 4;
}

function* testTwo() {
 yield 2;
 yield* testOne();
 yield 3;
}
const result = testTwo();
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
// { value: 1, done: false }
// { value: 2, done: false }
// { value: 3, done: false }
// { value: 4, done: false }
// { value: undefined, done: true }

// eg:two
function* test () {
 yield* [1,2];
 yield* '3,4';
 yield* arguments;
}
const result = test(5, 6);
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
console.log(result.next());
// { value: 1, done: false }
// { value: 2, done: false }
// { value: '3', done: false }
// { value: ',', done: false }
// { value: '4', done: false }
// { value: 5, done: false }
// { value: 6, done: false }
// { value: undefined, done: true }
```

*调用 next()方法时，如果传入了参数，那么这个参数会传给上一条执行的 yield 语句左边的变量*
```javascript
function* test() {
  yield 1;
  const x = yield 'one';
  yield x;
}

var result = test();
console.log(result.next());
console.log(result.next());
console.log(result.next(100));
console.log(result.next());
// { value: 1, done: false }
// { value: 'one', done: false }
// { value: 100, done: false }
// { value: undefined, done: true }
```

###### 生成器函数的作用
生成器函数是ES6引入的新特性

延迟执行：生成器可以在需要时逐个生成值，而不是一次性生成所有值。这种延迟执行可以节省内存和提高性能。
无限序列：生成器可以用来创建无限序列，如斐波那契数列或素数序列，这些序列通常很难使用常规方法来实现。
异步编程：生成器可以用来实现异步编程，通过使用生成器来实现异步函数，可以更方便地处理异步调用和异步错误。
迭代器：生成器可以用来创建迭代器，使得对集合的遍历变得更加方便和可读。
生成器协程：生成器可以用作协程，在 JavaScript 中实现类似线程的功能，从而实现更高级的并发和并行编程。

*举例*
```javascript
function* iterArr(arr) {
  if (Array.isArray(arr)) {
      for(let i=0; i < arr.length; i++) {
          yield* iterArr(arr[i]);
      }
  } else {
      yield arr;
  }
}
let arr = [ 'a', ['b',[ 'c', ['d', 'e']]]];
const result = iterArr(arr);
arr = [...result];
console.log(arr);
// [ 'a', 'b', 'c', 'd', 'e' ]
```

###### 参考文献
[MDN: 生成器函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)

issue:
- co,执行生成器函数的库
- 生成器函数的回收机制
- 实现异步的操作，生成器函数比较鸡肋，使用async、await
- 生成器函数是目前js中唯一可以实现暂停执行的方法