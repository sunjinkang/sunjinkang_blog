---
title: js类型化数组
date: 2023-04-18 18:17:14
cover: https://cdn.pixabay.com/photo/2024/08/26/04/47/ai-generated-8998132_640.png
tags:
---

###### 什么是类型化数组（Typed Array）?
> JavaScript 类型化数组（typed array）是一种类似数组的对象，并提供了一种用于在内存缓冲区中访问原始二进制数据的机制。

*JavaScript 类型化数组中的每一个元素都是原始二进制值，而二进制值采用多种支持的格式之一（从 8 位整数到 64 位浮点数）。*
<!-- more -->
**注意：类型数组和普通数组不一样，使用Array.isArray()判断类型数组返回false，此外，一些在普通数组上使用的方法，在类型数组上无法使用**
```javascript
const bufferArray = new ArrayBuffer(16);
console.log(Array.isArray(bufferArray));
// false
bufferArray.push(1);
// TypeError: bufferArray.push is not a function
bufferArray.pop(1);
// TypeError: bufferArray.pop is not a function
```
###### 类型化数组的语法
###### 类型化数组的特性、方法、使用场景
###### 类型化数组的局限性、限制
