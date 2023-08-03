---
title: 开发中使用的便捷代码
date: 2022-09-05 13:24:10
tags:
---

###### 基于条件设置对象属性
```javascript
// 空值
const name = '';
const obj = { ...name && {name}};
console.log(obj); // {}
// 非空值
const name = 'test_name';
const obj = { ...name && {name}};
console.log(obj); // { name: 'test_name'}
```
<!-- more -->
###### 无中间变量交换变量值
```javascript
let one = '12';
let two = '34';
[one, two] = [two, one];
console.log(one); // '34'
console.log(two); // '12'
```

###### 过滤Boolean值为false的值
```javascript
const array = [0, false, 12, true, '12', undefined, '', 8, null];
const result = array.filter(Boolean);
console.log(result); // [12, true, '12', 8]
```

###### 转换元素类型
```javascript
// 将Number类型转换为String
const string = [1, 2, 3, 12].map(String);
console.log(string); // ['1', '2', '3', '12']
// 将String类型转换为Number
const string = ['1', '2', '3', '12'].map(Number);
console.log(string); // [1, 2, 3, 12]
```

###### 数组去重
```javascript
const repeatArray = [1,1,1,3,5,6,7,8,9,23,45,1,2,3,5,6];
const result = [...new Set(repeatArray)];
console.log(result); // [1, 3, 5, 6, 7, 8, 9, 23, 45, 2]
```