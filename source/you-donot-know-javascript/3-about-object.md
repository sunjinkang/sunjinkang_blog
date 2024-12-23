---
title: 对象&原型
date: 2024-10-29 21:24:43
---


### 对象
- **对象基础**：JavaScript中的对象是一种复杂的数据类型，它可以存储多个键值对，其中键是字符串或Symbol类型，值可以是任意数据类型。对象可以通过对象字面量、构造函数或`Object.create()`方法创建。
- **属性操作**
    - **可计算属性名**：在ES6中，可以使用方括号语法来定义可计算的属性名，这使得属性名可以根据表达式的值动态生成。例如：`let prefix = "prop"; let obj = {[prefix + "Name"]: "value"}; console.log(obj.propName); // "value"` 。
    - **属性描述符**：通过`Object.getOwnPropertyDescriptor()`和`Object.defineProperty()`方法，可以获取和设置对象属性的描述符。属性描述符包括`value`（属性的值）、`writable`（是否可写）、`enumerable`（是否可枚举）和`configurable`（是否可配置）。例如：
```javascript
let obj = {a: 1};
let descriptor = Object.getOwnPropertyDescriptor(obj, 'a');
console.log(descriptor.value); // 1
console.log(descriptor.writable); // true
console.log(descriptor.enumerable); // true
console.log(descriptor.configurable); // true
```
    - **遍历对象属性**：可以使用`for...in`循环遍历对象的可枚举属性，也可以使用`Object.keys()`、`Object.values()`和`Object.entries()`方法分别获取对象的属性名数组、属性值数组和键值对数组。例如：
```javascript
let obj = {a: 1, b: 2, c: 3};
for (let key in obj) {
  console.log(key + ": " + obj[key]);
}
let keys = Object.keys(obj);
console.log(keys); // ["a", "b", "c"]
let values = Object.values(obj);
console.log(values); // [1, 2, 3]
let entries = Object.entries(obj);
console.log(entries); // [["a", 1], ["b", 2], ["c", 3]]
```
- **对象的继承与原型链**：JavaScript中的对象继承是通过原型链实现的。每个对象都有一个`__proto__`属性，它指向该对象的原型对象。当访问一个对象的属性时，如果该对象本身没有该属性，JavaScript会沿着原型链向上查找，直到找到该属性或到达原型链的顶端。

### 混合对象“类”
- **类的本质**：在JavaScript中，“类”是基于原型的继承的语法糖。虽然ES6引入了`class`关键字，但它本质上仍然是通过原型链来实现继承的。
- **类的机制**
    - **构造函数**：构造函数是用于创建对象的特殊函数，通常与类名相同。当使用`new`关键字调用构造函数时，会创建一个新的对象，并将构造函数中的`this`指向该对象。例如：
```javascript
function Person(name) {
  this.name = name;
}
let person = new Person("Alice");
console.log(person.name); // "Alice"
```
    - **实例化**：通过`new`关键字调用构造函数创建对象的过程称为实例化。实例化会创建一个新的对象，并将该对象的原型指向构造函数的`prototype`属性。
- **类的继承**
    - **原型链继承**：在JavaScript中，子类可以通过原型链继承父类的属性和方法。通过将子类的原型设置为父类的实例，可以实现原型链继承。例如：
```javascript
function Animal() {
  this.species = "Animal";
}
Animal.prototype.eat = function() {
  console.log("Eating...");
};
function Dog() {
  this.name = "Dog";
}
Dog.prototype = new Animal();
let dog = new Dog();
console.log(dog.species); // "Animal"
dog.eat(); // "Eating..."
```
    - **多态**：多态是指同一个操作作用于不同的对象，可以产生不同的执行结果。在JavaScript中，可以通过在子类中重写父类的方法来实现多态。
- **混入**
    - **显式混入**：通过手动将一个对象的属性和方法复制到另一个对象中，可以实现显式混入。例如：
```javascript
function mixin(target, source) {
  for (let key in source) {
    if (!(key in target)) {
      target[key] = source[key];
    }
  }
  return target;
}
let obj1 = {a: 1};
let obj2 = {b: 2};
let result = mixin(obj1, obj2);
console.log(result); // {a: 1, b: 2}
```
    - **隐式混入**：通过在函数中调用`this`来实现隐式混入。例如：
```javascript
function Foo() {
  this.a = 1;
}
function Bar() {
  Foo.call(this);
  this.b = 2;
}
let bar = new Bar();
console.log(bar.a); // 1
console.log(bar.b); // 2
```

### 原型
- **原型链基础**：在JavaScript中，每个对象都有一个内部链接指向其原型对象，这个原型对象也可以有自己的原型，从而形成一条原型链。当访问一个对象的属性或方法时，如果该对象本身没有定义，JavaScript会沿着原型链向上查找，直到找到对应的属性或方法或到达原型链的顶端。
- **属性设置和屏蔽**：当在对象上设置属性时，如果该属性在原型链上已经存在，就会发生屏蔽现象。此时，对象自身的属性会覆盖原型链上的同名属性。例如：
```javascript
const oldObj = {a: 2};
const newObj = Object.create(oldObj);
console.log(oldObj.a); // 2
console.log(newObj.a); // 2
newObj.a++;
console.log(oldObj.a); // 2
console.log(newObj.a); // 3
console.log(oldObj.hasOwnProperty("a")); // true
console.log(newObj.hasOwnProperty("a")); // true
```
- **“类”与原型**：JavaScript中的“类”实际上是基于原型的语法糖。通过构造函数和原型对象，可以模拟传统面向对象语言中的类和继承。例如：
```javascript
function A(name) {
  this.name = name;
}
A.prototype.getName = function () {
  return "my name is " + this.name;
};
function B(name) {
  A.call(this, name);
}
B.prototype = Object.create(A.prototype);
B.prototype.greeting = function () {
  console.log("hello, " + this.getName());
};
const b1 = new B("b1");
const b2 = new B("b2");
b1.greeting(); // hello, my name is b1
b2.greeting(); // hello, my name is b2
```

### 行为委托
- **委托理论**：行为委托是一种基于原型链的设计模式，它强调对象之间的委托关系，而不是传统的类继承关系。通过将对象的原型设置为另一个对象，可以实现行为委托。例如：
```javascript
const Task = {
  setId: function (ID) {
    this.id = ID;
  },
  outputId: function () {
    console.log(this.id);
  }
};
const XYZ = Object.create(Task);
XYZ.prepareTask = function (ID, label) {
  this.setId(ID);
  this.label = label;
};
XYZ.outputTaskDetails = function () {
  this.outputId();
  console.log(this.label);
};
const xyz = Object.create(XYZ);
xyz.prepareTask(1, "task1");
xyz.outputTaskDetails();
```
- **与面向类设计的比较**
    - **对象关系**：在行为委托中，对象之间是对等的，通过委托来共享和重用代码，关系是动态的。而面向类的继承中，存在明确的父类和子类关系，是静态的。
    - **代码组织方式**：行为委托的代码组织更灵活，可根据需要动态组合对象。面向类则通过类的层次结构组织代码，相对固定。
    - **继承机制**：行为委托通过委托共享代码，而非传统继承。面向类通过子类继承父类属性和方法实现复用。

### 总结
- 原型链是JavaScript实现继承和代码复用的重要机制，理解原型链的工作原理对于深入掌握JavaScript对象系统至关重要。
- 行为委托提供了一种更灵活的设计模式，它可以使代码更加简洁和易于维护，尤其在处理复杂的对象关系时具有优势。
- 在实际开发中，可以根据具体需求选择使用传统的类继承或行为委托，或者结合两者的优点来设计代码结构。