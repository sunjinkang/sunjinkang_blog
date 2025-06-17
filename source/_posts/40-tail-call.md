---
title: 尾调用与尾递归
date: 2022-10-17 10:26:13
cover: https://cdn.pixabay.com/photo/2022/08/28/01/33/northern-7415567_640.jpg
tags:
---

###### 什么是尾调用？
**某个函数的最后一步调用另一个函数**

```javascript
function call1(a) {
 return call2(a);
}

// 以下三种情况不属于尾调用！！！
// 函数调用后还有其他操作
function call1(a) {
 const x = call2(a);
 return x;
}

function call1(a) {
 return call2(a) + 1;
}

function call1(a) {
 call2(a);
}

// 以下属于尾调用
function call1(a) {
 if (!!a) {
  return call2(a);
 }
 return call3(a);
}
```
<!-- more -->
###### 尾调用优化

*注意：尾调用优化是否方便可行取决于运行环境对此类优化的支持度*

函数调用会在内存中形成一个‘调用记录’，又称为‘调用帧’。用来保存调用位置和内存变量等信息。如果A函数内部调用B函数，在A的调用记录上，会生成一个B的调用记录，等到B运行结束，将结果返回给A，B的调用记录才会消失。如果B的内部还调用C，那么在B上面会形成一个C的调用记录，以此类推。所有的调用记录，形成了一个‘调用栈’(call stack)。

![call-stack](call-stack.png)

但是，尾调用由于是函数调用的最后一步操作，所以不需要保存外部函数的调用记录，因为调用位置、内部变量等信息都不会再用到，只要直接用内层函数的调用记录，取代外层函数调用记录就可以了。所以，如果所有函数都是尾调用，那么每次执行的时候，只需要记录一项调用记录，从而节省大量内存，即‘尾调用优化’。

*注意：只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行‘尾调用优化’*

###### 尾递归
函数调用自身，称为递归。如果尾调用自身，就称为尾递归。

递归非常耗费内存，因为需要同时保存许多调用记录，很容易发生‘栈溢出’错误(stack overflow)。但对于尾递归来说，由于只存在一个调用记录，所以永远不会发生‘栈溢出’错误。

```javascript
// 阶乘计算
// 复杂度 O(n)
function factorial(n) {
 if (n === 1) return 1;
 return n * factorial(n - 1);
}

// 复杂度O(1)
function factorial(n, total) {
 if (n === 1) return total;
 return factorial(n -1, n* total);
}
factorial(5, 1);

// factorial(5, 1);
// factorial(4, 5);
// factorial(3, 20);
// factorial(2, 60);
// factorial(1, 120);
// 120
```

###### 递归函数的改写优化
尾递归的实现，需要将所有用到的内部参数变量改写成函数的参数，不过直接修改的函数往往不太直观，一般采用以下两种方法解决：

(1) 除尾递归函数外，在提供一个正常形式的函数，通过正常表现的函数调用递归函数

```javascript
function tailCall(n, total) {
 if (n === 1) return total;
 return tailCall(n -1, n*total);
}

function call(n) {
 return tailCall(n, 1);
}

call(5);
```

(2) 使用柯理化，将多参数的函数转化为单参数形式

```javascript
function currying(fn, n) {
 return function (m) {
  return fn.call(this, m, n);
 }
}

function tailCall(n, total) {
 if (n === 1) return total;
 return tailCall(n -1, n*total);
}

const factorial = currying(tailCall, 1);
factorial(5);

// 或者使用ES6函数默认值
function factorial(n, total = 1) {
 if (n === 1) return total;
 return tailCall(n -1, n*total);
}
factorial(5);
```

*ES6的尾调用优化只在严格模式下开启，正常模式无效*
正常模式下，函数内部有两个变量，可以跟踪函数的调用栈
- arguments 返回调用时函数的参数
- func.caller 返回调用当前函数的那个函数
尾调用优化发生时，函数调用栈会改写，上面两个变量会失真。严格模式禁用这两个变量，所以尾调用仅在严格模式下生效。

[尾调用-维基百科](https://zh.wikipedia.org/wiki/%E5%B0%BE%E8%B0%83%E7%94%A8)