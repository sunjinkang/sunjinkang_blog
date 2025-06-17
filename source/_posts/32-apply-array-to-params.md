---
title: js中apply怎么把数组转化为参数？
date: 2022-09-21 17:07:53
cover: https://cdn.pixabay.com/photo/2020/08/15/09/45/starry-sky-5490119_640.jpg
tags:
---

###### apply可以改变函数的this指向（类似的还有call和bind），且函数的输入参数需要是一个数组
```javascript
function test(a, b) {
 console.log(a);
 console.log(b);
}
const array = [1, 10];
test(array);
// [1, 10]
// undefined

test.apply(null, array);
// 1
// 10

var test = {
 func: function (a, b) {
  console.log(a);
  console.log(b);
 }
}
const array = [1, 10];
test.func(array);
// [1, 10]
// undefined
test.func.apply(test.func, array);
test.func.apply(null, array);
// 1
// 10

const array = [1, 2, 4, 6, 2, 8];
Math.max(array);
// NaN
const array = [1, 2, 4, 6, 2, 8];
Math.max.apply(null, array);
// 8
```
<!-- more -->

###### ES6中的扩展符
```javascript
function test(a, b) {
 console.log(a);
 console.log(b);
}
const array = [1, 10];
test(...array);
// 1
// 10

var test = {
 func: function (a, b) {
  console.log(a);
  console.log(b);
 }
}
const array = [1, 10];
test.func(...array);
// 1
// 10

const array = [1, 2, 4, 6, 2, 8];
Math.max(...array);
// 8
```

###### 使用arguments对象（不建议使用）
函数内的arguments对象，其本身是由给函数传入的参数，以类似数组的形式组合而成的对象。
```javascript
function test() {
 for (let i = 0; i < arguments.length; i++) {
  console.log(arguments[i]);
 }
}
test(1,12,5);
// 1 12 5
test(1,12,3,4,5);
// 1 12 3 4 5
```