---
title: 深入编程&深入javascript
date: 2024-12-15 13:44:49
---


### 深入编程
- **代码与表达式基础**：JavaScript代码由一系列语句和表达式组成。语句如变量声明、条件判断、循环等，用于执行操作；表达式则会产生一个值，如算术表达式、函数调用等。理解它们的基本概念和用法是编程的基础。
- **实践操作**：书中通过实际的代码示例展示了如何进行输出和输入操作。例如，使用`console.log()`进行输出，通过浏览器的开发者工具控制台查看结果；在浏览器环境中，还可以使用`prompt()`函数获取用户输入。

### 深入JavaScript
- **值与类型**：JavaScript中有多种基本数据类型，如数字、字符串、布尔值、null、undefined等，还有复杂的数据类型如对象和数组。不同类型的值在内存中的存储方式和操作方法有所不同。例如，对象是一种无序的键值对集合，可以通过点号或方括号访问属性。
- **变量与作用域**：变量用于存储数据，在JavaScript中存在函数作用域和块作用域。使用`var`声明的变量具有函数级作用域，而`let`和`const`声明的变量具有块级作用域。例如：
```javascript
function example() {
  if (true) {
    let x = 10;
    const y = 20;
    console.log(x); // 10
    console.log(y); // 20
  }
  console.log(x); // ReferenceError: x is not defined
  console.log(y); // ReferenceError: y is not defined
}
```
- **函数特性**：函数在JavaScript中是一等公民，可以作为参数传递、作为返回值返回等。同时，还介绍了立即调用函数表达式（IIFE）和闭包的概念。闭包是指函数能够访问其定义时所在的词法作用域，即使在函数外部执行时也能保留对该作用域中变量的引用。例如：
```javascript
function outerFunction() {
  let count = 0;
  function innerFunction() {
    count++;
    console.log(count);
  }
  return innerFunction;
}

const myClosure = outerFunction();
myClosure(); // 1
myClosure(); // 2
```

### 深入“你不知道的JavaScript”系列
- **作用域和闭包**：再次深入探讨了作用域链和闭包的原理。当在函数内部访问变量时，JavaScript引擎会沿着作用域链从内向外查找变量。闭包可以用于实现数据隐藏和状态保持，例如在循环中创建闭包来保存每次迭代的状态。
```javascript
for (var i = 0; i < 5; i++) {
  setTimeout(function() {
    console.log(i);
  }, 1000);
}
// 输出 5 个 5

for (let j = 0; j < 5; j++) {
  setTimeout(function() {
    console.log(j);
  }, 1000);
}
// 输出 0 1 2 3 4
```
- **this和对象原型**：`this`关键字在JavaScript中是一个复杂但重要的概念，它的值取决于函数的调用方式。对象原型则是JavaScript实现继承的一种方式，通过原型链可以实现对象之间的属性和方法共享。
```javascript
var person = {
  name: 'Alice',
  sayHello: function() {
    console.log('Hello, ' + this.name);
  }
};

person.sayHello(); // Hello, Alice

var anotherPerson = {
  name: 'Bob'
};

person.sayHello.call(anotherPerson); // Hello, Bob
```
- **类型和语法**：详细介绍了JavaScript中的各种数据类型转换规则和语法特性，如隐式类型转换、`==`和`===`的区别等。还提到了一些容易被忽视的语法细节，如语句末尾的分号自动插入机制等。
- **异步和性能**：随着JavaScript在前端和后端的广泛应用，异步编程变得越来越重要。书中介绍了JavaScript中的异步操作，如回调函数、Promise等，以及如何优化异步代码的性能，避免回调地狱等问题。
- **ES6及更新版本**：对ES6及后续版本中引入的新特性进行了概述，如箭头函数、模板字面量、解构赋值、类等。这些新特性使JavaScript代码更加简洁和易读。

### 总结
- **基础巩固**：通过对JavaScript基础概念的深入剖析，进一步巩固了对代码、表达式、值与类型、变量、函数等基础知识的理解。
- **核心机制理解**：对作用域、闭包、`this`、对象原型等核心机制的详细讲解，有助于更深入地理解JavaScript的运行原理，写出更高效、更易维护的代码。
- **新特性展望**：对ES6及更新版本新特性的介绍，让读者对JavaScript的发展趋势有了初步了解，为后续学习和使用新特性打下了基础。


### ES现在与未来
- **版本演进**：JavaScript标准正式称为“ECMAScript”（简称“ES”），早期版本如ES1和ES2不太知名或未广泛实现，ES3是早期广泛使用的基线版本。2009年ES5正式定稿，成为现代浏览器的主流标准。而ES6是JavaScript的一次重大飞跃，引入了大量新特性。
- **Transpiling机制**：由于浏览器对新特性的支持程度不同，为了在旧浏览器中使用新的ES6及后续版本的特性，就需要使用Transpiling（转换编译）技术。例如，ES6中的简洁属性写法`var obj = { foo };`，在Transpiling后会转换为`var obj = { foo: foo };`。

### 语法
- **块作用域声明**：
    - **let声明**：与`var`不同，`let`具有块级作用域。例如：
```javascript
{
  let x = 10;
  console.log(x); // 10
}
console.log(x); // ReferenceError: x is not defined
```
    - **const声明**：用于声明常量，一旦赋值就不能再重新赋值。例如：
```javascript
const PI = 3.14159;
PI = 3.14; // TypeError: Assignment to constant variable.
```
    - **块作用域函数**：在块级作用域中定义函数，该函数只能在该块内访问。
- **解构赋值**：可以从数组或对象中提取值并赋值给变量。例如：
```javascript
// 数组解构
let [a, b, c] = [1, 2, 3];
console.log(a); // 1
console.log(b); // 2
console.log(c); // 3

// 对象解构
let { x, y } = { x: 10, y: 20 };
console.log(x); // 10
console.log(y); // 20
```
- **对象字面量扩展**：
    - **简洁属性**：如果属性名和变量名相同，可以省略冒号和值。例如：`let x = 10; let obj = { x };`等价于`let x = 10; let obj = { x: x };`。
    - **简洁方法**：在对象字面量中定义方法时，可以省略`function`关键字。例如：`let obj = { sayHello() { console.log('Hello!'); } };`。
    - **计算属性名**：可以使用表达式作为对象的属性名。例如：`let key = 'name'; let obj = { [key]: 'Alice' }; console.log(obj.name); // Alice`。
- **模板字面量**：使用反引号（`）来定义字符串，可以在字符串中嵌入表达式。例如：
```javascript
let name = 'Alice';
let greeting = `Hello, ${name}!`;
console.log(greeting); // Hello, Alice!
```
- **箭头函数**：一种更简洁的函数定义方式，并且没有自己的`this`绑定，会继承定义时所在上下文的`this`值。例如：
```javascript
let numbers = [1, 2, 3];
let doubled = numbers.map((num) => num * 2);
console.log(doubled); // [2, 4, 6]
```

### 代码组织
- **迭代器**：提供了一种统一的遍历数据结构的方式，通过`next()`方法依次获取下一个值。例如：
```javascript
let arr = [1, 2, 3];
let iterator = arr[Symbol.iterator]();
console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```
- **生成器**：是一种特殊的函数，可以暂停和恢复执行，通过`yield`关键字返回中间结果。例如：
```javascript
function* generatorFunction() {
  yield 1;
  yield 2;
  yield 3;
}

let generator = generatorFunction();
console.log(generator.next()); // { value: 1, done: false }
console.log(generator.next()); // { value: 2, done: false }
console.log(generator.next()); // { value: 3, done: false }
console.log(generator.next()); // { value: undefined, done: true }
```
- **模块**：ES6引入了模块系统，用于将代码分割成独立的模块，方便代码的维护和复用。例如，创建一个`math.js`模块：
```javascript
// math.js
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}
```
在另一个文件中使用该模块：
```javascript
// main.js
import { add, subtract } from './math.js';
console.log(add(5, 3)); // 8
console.log(subtract(5, 3)); // 2
```
- **类**：提供了一种更面向对象的编程方式，使用`class`关键字定义类，通过`extends`关键字实现继承。例如：
```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound.`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks.`);
  }
}

let dog = new Dog('Fido');
dog.speak(); // Fido barks.
```

 