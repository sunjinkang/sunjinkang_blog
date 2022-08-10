---
title: js-新建固定长度数据
date: 2022-06-27 10:20:46
tags:
---

#### 新建固定长度数组

###### 使用primitives填充数组
```javascript
const newArray = Array(3).fill(3);
console.log(newArray);  // [3, 3, 3]
```
Array(length).fill(initialValue) 是一种创建具有所需长度并使用原始值（数字、字符串、布尔值）初始化的数组的便捷方法

###### 使用对象填充数组
(1)使用Array().fill()创建数组
```javascript
const newArray = Array(3).fill({ value: 0 });
console.log(newArray);  // [{value: 0}, {value: 0}, {value: 0}]
```
Array(length).fill({ value: 0 })创建一个 length 数组3，并为每个项目分配{ value: 0 }，要注意的是：分配相同的对象实例。
这种方法创建了一个具有相同对象实例的数组。如果碰巧修改了数组中的任何一项，那么数组中的每一项都会受到影响:
```javascript
const newArray = Array(3).fill({ value: 0 });
console.log(newArray);  // [{value: 0}, {value: 0}, {value: 0}]
newArray[1].value = 2;
console.log(newArray);  // [{value: 2}, {value: 2}, {value: 2}]
```
(2)使用Array.from()创建数组
Array.from() 方法对一个数组或可迭代对象创建一个新的，浅拷贝的数组实例。
因此利用 Array.from() 方法可以轻松地创建和初始化具有不同对象实例的数组:
```javascript
const newArray = Array.from(Array(3), () => {
  return { value: 0 };
});
console.log(newArray);  // [{value: 0}, {value: 0}, {value: 0}]
```
如果修改数组中的任何项目，则只有该项目会受到影响，其他项目不受影响：
```javascript
const newArray = Array.from(Array(3), () => {
  return { value: 0 };
});
console.log(newArray);  // [{value: 0}, {value: 0}, {value: 0}]
newArray[1].value = 2
console.log(newArray);  // [{value: 0}, {value: 2}, {value: 0}]
```
(3)使用Array.map()结合Array.fill()创建数组
注意：不要直接使用map新建数组，**array.map()跳过 empty 元素**
```javascript
const newArray = Array(3).map(() => {
  return { value: 0 };
});
console.log(newArray);  // [empty x 3]
```
解决方法很简单，将 empty 数组 fill null 即可：
```javascript
const newArray = Array(3).fill(null).map(() => {
  return { value: 0 };
});
console.log(newArray);  // [{value: 0}, {value: 0}, {value: 0}]
```
注意：使用这种方法创建的数组，修改某一项时不影响其他项：
```javascript
const newArray = Array(3).fill(null).map(() => {
  return { value: 0 };
});
console.log(newArray);  // [{value: 0}, {value: 0}, {value: 0}]
newArray[1].value = 2;
console.log(newArray);  // [{value: 0}, {value: 2}, {value: 0}]
```
