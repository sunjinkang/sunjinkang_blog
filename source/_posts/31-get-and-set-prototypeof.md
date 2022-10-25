---
title: Object获取及设置原型对象
date: 2022-09-05 13:54:58
tags:
---

###### Object获取原型对象：Object.getPrototypeOf
Object.getPrototypeOf用于获取指定对象的原型对象
```javascript
Object.getPrototypeOf(obj);
```
**参数**
obj: 参数为要获取原型对象的对象
**返回值**
返回指定对象的原型对象或null
注意：
es5中，如果参数不是对象，会抛出TypeError错误
es6中，如果参数不是对象，会强制类型转换为对象
**示例**
```javascript
console.log(Object.getPrototypeOf('12') === String.prototype); // true
// 
console.log(Object.getPrototypeOf(12) === Number.prototype); // true
//
console.log(Object.getPrototypeOf({}) === Object.prototype); // true
// 
console.log(Object.getPrototypeOf(true) === Boolean.prototype); // true
// 
console.log(Object.getPrototypeOf(Symbol('test')) === Symbol.prototype); // true
// 
console.log(Object.getPrototypeOf(null)); // Uncaught TypeError: Cannot convert undefined or null to object
// 
console.log(Object.getPrototypeOf(undefined)); // Uncaught TypeError: Cannot convert undefined or null to object

// 对没有原型对象的对象进行操作
const obj = Object.create(null);
console.log(Object.getPrototypeOf(obj)); // null
const obj = Object.create(undefined);
console.log(Object.getPrototypeOf(obj)); // Uncaught TypeError: Object prototype may only be an Object or null: undefined
```

###### Object修改原型对象: Object.setPrototypeOf
Object.setPrototypeOf用于将指定对象的原型对象设置到一个新的对象或null上
```javascript
Object.setPrototypeOf(obj, proto);
```
**参数**
obj: 要设置原型对象的对象
proto: 要设置的新原型对象或null，未设置时抛出TypeError错误

**返回值**
设置了新原型对象的对象

注意：该操作实际上是个很耗时的操作，如果对性能有更高的要求，不建议直接修改已有对象的原型，而应该通过Object.create()方法来创建一个新的对象

**示例**
```javascript
const obj = { name: 'test' };
const newObj = Object.create(obj);
Object.setPrototypeOf(newObj, obj);
console.log(newObj.name); // 'test'

const otherObj = { age: 12};
console.log(Object.getPrototypeOf(newObj) === obj); // true
Object.setPrototypeOf(newObj, otherObj);
console.log(Object.getPrototypeOf(newObj) === obj); // false
console.log(Object.getPrototypeOf(newObj) === otherObj); // true
console.log(newObj.name); // undefined
console.log(newObj.age); // 12
```