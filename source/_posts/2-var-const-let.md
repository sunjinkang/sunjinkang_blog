---
title: var、const、let区别
date: 2022-03-26 21:04:12
tags:
---

#### 1、挂载节点不同：var声明的变量挂载在window上，const与let声明的变量不会
```javascript
var a = 100;
console.log(a,window.a);    // 100 100
let b = 10;
console.log(b,window.b);    // 10 undefined
const c = 1;
console.log(c,window.c);    // 1 undefined
```
let声明的变量或const声明的常量会挂载到Script下，var会挂载到Global下（window类似于Global的代理）。可查看文章[let和const声明的变量到底去哪里了？](https://zhuanlan.zhihu.com/p/114128108)

<!-- more -->

#### 2、