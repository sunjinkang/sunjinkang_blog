---
title: es6对象增强
date: 2022-09-02 10:42:05
tags:
---

#### 对象字面量语法扩展

(1)属性赋值简写：给一个属性赋变量值时，如果变量和属性的名称相同，可以省略冒号、变量名，直接写属性名即可，js 引擎执行代码时，会自动查找与属性名相同的变量进行属性赋值。

```javascript
var name = 'test';
var obj = {
  name,
};
console.log(obj); // {name: 'test'}
```

(2)简化属性方法定义：给一个属性赋匿名函数方法时，可以使用更简洁的方法

```javascript
// ES5
const es5Obj = {
  testFunction: function () {
    console.log('es5');
  },
};
console.log(es5Obj.testFunction()); // es5

// es6
const es6Obj = {
  testFunction() {
    console.log('es6');
  },
};
console.log(es6Obj.testFunction()); // es6

// **注意：只有赋值的是匿名函数，才可以使用简介语法**
const es6Obj1 = {
  testFunction: function Hello() {
    console.log('hello');
  },
};
console.log(es6Obj1.testFunction()); // hello
```

**常见给函数取名字的情况：(1)递归，自己调用自己；(2)debugger 的时候，方便问题定位**

(3)计算属性名：属性可以动态生成，需要把动态属性用[]包括起来

```javascript
const es6Obj = {
  ['first' + 'second']: 'hanmeimei',
};
console.log(es6Obj['first' + 'second']); // hanmeimei

const first = 'first';
const es6Obj1 = {
  [first + 'second']: 'hanmeimei',
};
console.log(es6Obj[first + 'second']); // hanmeimei
```

(4)重复属性名的处理：es5 中，给对象赋值，如果存在相同的属性名，会报错；es6 中，不会报错，相同属性名的最后一个，会覆盖之前的属性

```javascript
const es6Obj = {
  name: 'first',
  name: 'second',
};
console.log(es6Obj); // {name: 'second'}
```

#### 新方法

(1)Object.is()
作用：判断两个数是否相等，与===基本一致，不过有两点不同：+0 不等于-0；NaN 等于 NaN

```javascript
console.log(+0 == -0); // true
console.log(Object.is(+0, -0)); // false
console.log(Object.is(NaN, NaN)); // true
```

(2)Object.assign()
作用：将所有可枚举属性从一个或多个源对象复制到目标对象，并返回目标对象

```javascript
// Object.assign(target, ...sources);  target为目标对象  sources为源对象
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };
const returnedTarget = Object.assign(target, source);
console.log(target); // Object { a: 1, b: 4, c: 5 }
console.log(returnedTarget); // Object { a: 1, b: 4, c: 5 }
```

(3)Object.setPrototypeOf()
作用：设置对象的原型对象，有两个参数，一个是对象，一个是对象要链接到的原型对象
```javascript
// Object.setPrototypeOf(object, prototypeObject);
let person = {
  greeting() {
    return 'hello';
  },
};
let dog = {
  greeting() {
    return 'woof';
  },
};
let obj = {};
// obj 链接到person
Object.setPrototypeOf(obj, person);
console.log(obj.greeting()); // hello
// obj 链接到dog
Object.setPrototypeOf(obj, dog);
console.log(obj.greeting()); // woof
```
当在对象上有某个方法时，会直接调用对象上的方法，不会去原型链上找
```javascript
let person = {
  greeting() {
    return 'hello';
  },
};
let dog = {
  greeting() {
    return 'woof';
  },
};
let obj = {
 greeting() {
    return 'obj';
  },
};
Object.setPrototypeOf(obj, person);
console.log(obj.greeting()); // obj
Object.setPrototypeOf(obj, dog);
console.log(obj.greeting()); // obj
```
在obj 对象中定义的方法，可能使用到原型对象上的同名方法， 只要调用原型对象上面的方法再进行一下组装就可以达到要求了。ES6 提供了super 关键词，它就指向原型对象
```javascript
let person = {
  greeting() {
    return 'hello';
  },
};
let dog = {
  greeting() {
    return 'woof';
  },
};
let obj = {
 greeting() {
    return super.greeting() + 'obj';
  },
};
Object.setPrototypeOf(obj, person);
console.log(obj.greeting()); // helloobj
Object.setPrototypeOf(obj, dog);
console.log(obj.greeting()); // woofobj
```
对象方法的定义只能使用简洁的语法形式，否则报错:Uncaught SyntaxError: 'super' keyword unexpected here
**为什么？？**
```javascript
let person = {
  greeting: function() {
    return 'hello';
  },
};
let dog = {
  greeting: function() {
    return 'woof';
  },
};
let obj = {
 // 以下写法报错：Uncaught SyntaxError: 'super' keyword unexpected here
 greeting: function() {
    return super.greeting() + 'obj';
  },
};
Object.setPrototypeOf(obj, person);
console.log(obj.greeting());
Object.setPrototypeOf(obj, dog);
console.log(obj.greeting());

let person = {
  greeting: function() {
    return 'hello';
  },
};
let dog = {
  greeting: function() {
    return 'woof';
  },
};
let obj = {
 // 以下方法可以正常运行
 greeting() {
    return super.greeting() + 'obj';
  },
};
Object.setPrototypeOf(obj, person);
console.log(obj.greeting()); // helloobj
Object.setPrototypeOf(obj, dog);
console.log(obj.greeting()); // woofobj
```
**在ES6 中，如果一个对象中定义了方法，这个方法自动获取到一个内置的属性[[HomeObject]], 来指向这个对象。super 呢，就是通过Object.getPrototypeOf([[HomeObject]]) 来获取到原型对象。obj.greeting() greeting() 方法中的[[HomeObject]] 就指向了obj.  那里面的super 就是Object.getPrototypeOf(obj), 那就是person 或dog 了，super.greeting() 就相当于person.greeting()了， 更为准确的说是 person.greeting.call(this).  因为如果person中的greenting有this, 我们还要给它指定this 指向， 不能让里面的this 指向别的对象， 只能让this 指向 obj 了。**