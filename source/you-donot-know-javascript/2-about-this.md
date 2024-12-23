---
title: this
date: 2024-10-18 21:05:23
---


## 一、关于this

### 常见误解
- **指向自身**：许多人认为`this`总是指向函数自身，但实际上并非如此。如在对象的方法中，`this`指向调用该方法的对象，而非函数本身。
```javascript
function foo() {
  console.log(this);
}
var obj = {
  foo: foo
};
obj.foo(); // 打印obj对象
```

- **作用域关联**：`this`与作用域没有直接关联，其指向在函数调用时确定，而非函数声明时。

### this的本质
- `this`是在函数调用时创建的执行上下文的一个属性，其值取决于函数的调用方式。
当一个函数被调用时，会创建一个活动记录（有时候也称为执行上下文）。这个记录会包含函数在哪里被调用（调用栈）、函数的调用方法、传入的参数等信息。this 就是记录的其中一个属性，会在函数执行的过程中用到


## 二、this全面解析

### 绑定规则
- **默认绑定**：在非严格模式下，独立函数调用时，`this`默认绑定到全局对象；在严格模式下，`this`绑定到`undefined`。
```javascript
function foo() {
  console.log(this.a);
}
var a = 2;
foo(); // 非严格模式下打印2，严格模式下报错
```

- **隐式绑定**：当函数作为对象的属性被调用时，`this`隐式绑定到该对象。
```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2,
  foo: foo
};
obj.foo(); // 打印2
```

对象属性引用链中只有最顶层或者说最后一层会影响调用位置
```javascript
function foo() {
  console.log( this.a );
}
var obj2 = {
  a: 42,
  foo: foo
};
var obj1 = {
  a: 2,
  obj2: obj2
};
obj1.obj2.foo(); // 42
```

隐式丢失
一个最常见的 this 绑定问题就是被隐式绑定的函数会丢失绑定对象，也就是说它会应用默认绑定，从而把 this 绑定到全局对象或者 undefined 上，取决于是否是严格模式。
```javascript
function foo() {
  console.log( this.a );
}
var obj = {
  a: 2,
  foo: foo
};
var bar = obj.foo; // 函数别名！
var a = "oops, global"; // a 是全局对象的属性
bar(); // "oops, global"
```

虽然 bar 是 obj.foo 的一个引用，但是实际上，它引用的是 foo 函数本身，因此此时的bar() 其实是一个不带任何修饰的函数调用，因此应用了默认绑定。一种更微妙、更常见并且更出乎意料的情况发生在传入回调函数时：
```js
function foo() {
  console.log( this.a );
}
function doFoo(fn) {
  // fn 其实引用的是 foo
  fn(); // <-- 调用位置！
}
var obj = {
  a: 2,
  foo: foo
};
var a = "oops, global"; // a 是全局对象的属性
doFoo( obj.foo ); // "oops, global"
```
参数传递其实就是一种隐式赋值，因此我们传入函数时也会被隐式赋值，所以结果和上一个例子一样


- **显式绑定**：通过`call`、`apply`或`bind`方法显式指定`this`的绑定对象。
```javascript
function foo() {
  console.log(this.a);
}
var obj = {
  a: 2
};
foo.call(obj); // 打印2
```
通过 foo.call(..)，我们可以在调用 foo 时强制把它的 this 绑定到 obj 上。
如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作 this 的绑定对象，这个原始值会被转换成它的对象形式（也就是 new String(..)、new Boolean(..) 或者new Number(..)）。这通常被称为“装箱”。

*硬绑定*
硬绑定是一种非常常用的模式，所以在 ES5 中提供了内置的方法 Function.prototype.bind
```js
function foo(something) {
  console.log( this.a, something );
  return this.a + something;
}
var obj = {
  a:2
};
var bar = foo.bind( obj );
var b = bar( 3 ); // 2 3
console.log( b ); // 5
```
*API调用的“上下文”*
第三方库的许多函数，以及 JavaScript 语言和宿主环境中许多新的内置函数，都提供了一个可选的参数，通常被称为“上下文”（context），其作用和 bind(..) 一样，确保你的回调函数使用指定的 this。
```js
function foo(el) {
  console.log( el, this.id );
}
var obj = {
  id: "awesome"
};
// 调用 foo(..) 时把 this 绑定到 obj
[1, 2, 3].forEach( foo, obj );
// 1 awesome 2 awesome 3 awesome
```

- **new绑定**：使用`new`关键字调用函数时，`this`绑定到新创建的对象。
```javascript
function foo(a) {
  this.a = a;
}
var bar = new foo(2);
console.log(bar.a); // 打印2
```

使用 new 来调用函数，或者说发生构造函数调用时，会自动执行下面的操作。
1. 创建（或者说构造）一个全新的对象。
2. 这个新对象会被执行 [[ 原型 ]] 连接。
3. 这个新对象会绑定到函数调用的 this。
4. 如果函数没有返回其他对象，那么 new 表达式中的函数调用会自动返回这个新对象。

### 优先级
- `new`绑定 > 显式绑定 > 隐式绑定 > 默认绑定。
```js
function foo() {
  console.log( this.a );
}
var obj1 = {
  a: 2,
  foo: foo
};
var obj2 = {
  a: 3,
  foo: foo
};
obj1.foo(); // 2
obj2.foo(); // 3
obj1.foo.call( obj2 ); // 3
obj2.foo.call( obj1 ); // 2
// 显式绑定优先级更高


function foo(something) {
  this.a = something;
}
var obj1 = {
  foo: foo
};
var obj2 = {};
obj1.foo( 2 );
console.log( obj1.a ); // 2
obj1.foo.call( obj2, 3 );
console.log( obj2.a ); // 3
var bar = new obj1.foo( 4 );
console.log( obj1.a ); // 2
console.log( bar.a ); // 4
// new 绑定比隐式绑定优先级高
```

**判断this**
现在我们可以根据优先级来判断函数在某个调用位置应用的是哪条规则。可以按照下面的顺序来进行判断：
1. 函数是否在 new 中调用（new 绑定）？如果是的话 this 绑定的是新创建的对象。
var bar = new foo()
2. 函数是否通过 call、apply（显式绑定）或者硬绑定调用？如果是的话，this 绑定的是指定的对象。
var bar = foo.call(obj2)
3. 函数是否在某个上下文对象中调用（隐式绑定）？如果是的话，this 绑定的是那个上下文对象。
var bar = obj1.foo()
4. 如果都不是的话，使用默认绑定。如果在严格模式下，就绑定到 undefined，否则绑定到全局对象。
var bar = foo()


### 绑定例外
- **被忽略的this**：如果将`null`或`undefined`作为`call`、`apply`或`bind`的第一个参数，实际会使用默认绑定。
```javascript
function foo() {
  console.log(this.a);
}
var a = 2;
foo.call(null); // 非严格模式下打印2
```
- **间接引用**：当通过赋值表达式间接引用函数并调用时，`this`可能会丢失绑定对象。
```javascript
function foo() {
  console.log(this.a);
}
var a = 2;
var o = {
  a: 3,
  foo: foo
};
var p = {
  a: 4
};
(p.foo = o.foo)(); // 打印2
```
- **软绑定**：硬绑定会降低函数灵活性，软绑定可在一定程度上解决这个问题。

### this词法
- 箭头函数没有自己的`this`，它的`this`继承自外层第一个非箭头函数的`this`或全局`this`。

 