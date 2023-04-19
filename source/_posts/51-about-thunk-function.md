---
title: Thunk函数
date: 2023-04-19 17:00:23
tags:
---

###### 求值策略
在介绍Thunk函数之前，需要先介绍一下什么叫做求值策略，即函数的参数应该什么时候求值。
```javascript
function test(num) {
 return num+1;
}
test(2+3);
```
类似上面这样将一个表达式作为参数传入函数，表达式应该什么时候计算？实际上可以分为两种情况：
- 一种是**传值调用(call by value)**，即表达式在传入函数之前就已经进行了计算，test(2+3)就相当于test(5)，js、C语言、JAVA等语言使用的是这种策略。
- 一种是**传名调用(call by name)**，即直接将表达式传入函数，只在需要的时候进行表达式的运算，Haskell(哈斯克尔)使用的是这种策略。

###### 什么是Thunk函数

###### Thunk函数的语法
###### Thunk函数的使用

https://www.ruanyifeng.com/blog/2015/05/thunk.html
https://zhuanlan.zhihu.com/p/404060484