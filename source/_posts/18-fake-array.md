---
title: 伪数组
date: 2022-08-04 10:57:14
cover: https://cdn.pixabay.com/photo/2016/11/29/02/20/astronomy-1866822_640.jpg
tags:
---

#### 概念
ArrayLike，也叫作类数组。是一种按照索引存储数据且具有length属性的对象。

#### 特征
1、具有length属性
2、按照索引方式存储数据
3、不具有数组的方法，如push、pop等
{% asset_img document.png document获取的伪数组 %}

<!-- more -->

#### 有哪些常见的伪数组
1、function的arguments对象
2、document.getElementsByTagName、document.getElementsByClassName等document方法获取的NodeList对象
3、上传文件是选择的file对象
4、自定义的某些对象

#### 判断一个数组是不是伪数组的方法
1、Array.isArray
```javascript
// fakeArray表示伪数组
// array 表示正常数组
Array.isArray(fakeArray); // false
Array.isArray(array); // true
```
2、instanceof
```javascript
// fakeArray表示伪数组
// array 表示正常数组
fakeArray instanceof Array; // false
array instanceof Array; // true
```

#### 将数组转为真正数组的方法
1、使用Array.prototype.slice.call()
{% asset_img prototype_call.png Array.prototype.slice.call转换 %}
2、使用[].slice.call()
{% asset_img slice_call.png slice.call转换 %}
3、使用Array.from()
{% asset_img array_from.png array.from转换 %}
