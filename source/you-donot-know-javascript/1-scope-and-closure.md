---
title: 作用域和闭包
date: 2024-10-07 20:35:50
---


## 一、作用域基础

### 编译原理与作用域
- JavaScript代码执行前会先编译，编译过程中编译器与作用域交互确定变量声明位置等。如`var a = 2`，编译器先询问作用域是否已有`a`变量，若没有则在当前作用域声明一个新变量。
- 变量查询分为LHS（获取存储变量的空间，用于赋值）和RHS（获取变量的值）。

### 作用域嵌套
- 内层作用域可访问外层作用域变量，反之则不行。如：
```javascript
var globalVar = "I'm global";
function outerFunction() {
  var outerVar = "I'm in outer function";
  function innerFunction() {
    console.log(outerVar);
    console.log(globalVar);
  }
  innerFunction();
}
outerFunction();
```

### 异常处理
- 当访问未声明的变量进行RHS查询时，会抛出`ReferenceError`异常。


## 二、词法作用域
词法作用域是一套关于引擎如何寻找变量以及会在何处找到变量的规则
词法作用域是在写代码或者说定义时确定的，而动态作用域是在运行时确定的。（this 也是！）词法作用域关注函数在何处声明，而动态作用域关注函数从何处调用。

### 词法阶段确定作用域
- 词法作用域在代码书写完成时就已确定，根据函数和变量声明的位置来决定作用域范围。
```javascript
function outer() {
  var x = 10;
  function inner() {
    console.log(x);
  }
  return inner;
}
var innerFunc = outer();
innerFunc(); // 10
```

### 欺骗词法作用域
- `eval`函数可在运行时修改词法作用域，但不推荐使用，在严格模式下其行为也受到限制。
```javascript
function change(str) {
  'use strict';
  var b = 3;
  eval(str);
  console.log(b);
}
change('var b = 666');

// 在严格模式的程序中，eval(..) 在运行时有其自己的词法作用域，意味着其中的声明无法修改所在的作用域
function foo(str) {
  "use strict";
  eval( str );
  console.log( a ); // ReferenceError: a is not defined
}
foo( "var a = 2" );
```
- `with`语句也会在运行时创建新的词法作用域，同样不建议使用。
```javascript
var obj = {
  a: 1,
  b: 2,
  c: 3
};
// 单调乏味的重复 "obj"
obj.a = 2;
obj.b = 3;
obj.c = 4;
// 简单的快捷方式
with (obj) {
  a = 3;
  b = 4;
  c = 5;
}


function foo(obj) {
  with (obj) {
    a = 2;
  }
}
var o1 = {
  a: 3
};
var o2 = {
  b: 3
};
foo( o1 );
console.log( o1.a ); // 2
foo( o2 );
console.log( o2.a ); // undefined
console.log( a ); // 2——不好，a 被泄漏到全局作用域上了！
```
当我们传递 o1 给 with 时，with 所声明的作用域是 o1，而这个作用域中含有一个同 o1.a 属性相符的标识符。但当我们将 o2 作为作用域时，其中并没有 a 标识符，因此进行了正常的 LHS 标识符查找。
o2 的作用域、foo(..) 的作用域和全局作用域中都没有找到标识符 a，因此当 a＝2 执行时，自动创建了一个全局变量（因为是非严格模式）。


## 三、函数作用域和块作用域

### 函数作用域特点
- 函数内部声明的变量在函数外部不可见，可用于隐藏内部实现细节。
```javascript
function createModule() {
  var privateVariable = "This is private";
  function publicFunction() {
    console.log(privateVariable);
  }
  return publicFunction;
}
var moduleFunction = createModule();
moduleFunction();
```

### 立即执行函数表达式（IIFE）
- 可创建独立作用域，用于隔离变量。
```javascript
(function () {
  var privateVar = "I'm private";
  console.log(privateVar);
})();
```

### 块作用域
- `let`和`const`关键字在ES6中引入用于创建块作用域变量。
```javascript
{
  let blockVar = "I'm in block scope";
  console.log(blockVar);
}
console.log(blockVar); // 报错，blockVar在此处不可访问
```

## 四、提升
变量和函数声明从它们在代码中出现的位置被“移动”到了最上面。这个过程就叫作提升。换句话说，先有蛋（声明）后有鸡（赋值）。
只有声明本身会被提升，而赋值或其他运行逻辑会留在原地。如果提升改变了代码执行的顺序，会造成非常严重的破坏。

### 变量和函数提升
- 变量和函数声明在编译阶段会被提升到所在作用域的顶部。
```javascript
console.log(a); // undefined
var a = 10;
```

### 函数优先
- 函数声明的提升优先级高于变量声明。
```javascript
console.log(a); // function a() {}
function a() {}
var a = 10;
```

## 五、作用域闭包

### 闭包的本质
- 函数能够记住并访问其词法作用域，即使函数在其词法作用域之外被执行。
```javascript
function outerFunction() {
  var count = 0;
  return function () {
    count++;
    console.log(count);
  };
}
var counter = outerFunction();
counter(); // 1
counter(); // 2
```

### 循环和闭包
- 在循环中使用闭包要注意变量共享问题。
```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log(i); // 3次打印3
  }, 100);
}
```
可使用IIFE解决：
```javascript
for (var i = 0; i < 3; i++) {
  (function (j) {
    setTimeout(function () {
      console.log(j); // 0, 1, 2
    }, 100);
  })(i);
}
```
### 模块中的闭包
- 现代模块机制利用闭包实现代码封装和隔离。

模块模式需要具备两个必要条件
- 必须有外部的封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块实例）。
- 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有的状态。
```javascript
// module.js
var privateVariable = "I'm private";
function publicFunction() {
  console.log(privateVariable);
}
export { publicFunction };

// main.js
import { publicFunction } from './module.js';
publicFunction();
```

