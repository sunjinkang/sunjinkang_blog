---
title: 浏览器渲染
date: 2022-05-23 14:13:56
cover: https://cdn.pixabay.com/photo/2017/01/31/13/40/shooting-star-2024127_640.png
tags:
---

## 渲染流程
(1)深度遍历解析HTML建立DOM树
(2)解析CSS建立CSSOM树
(3)依据DOM树和CSSOM树构造Render树
(4)计算各元素尺寸、位置
(5)绘制页面像素信息
(6)浏览器将各层信息发送给GPU，GPU将各层合成，显示在屏幕上
(7)(PS:上述这个过程是逐步完成的，为了更好的用户体验，渲染引擎将会尽可能早的将内容呈现到屏幕上，并不会等到所有的html都解析完成之后再去构建和布局render树。它是解析完某一部分（整体大块的）内容就显示一部分内容，同时，可能还在通过网络下载其余内容。)

<!-- more -->

## GUI渲染线程
(1)解析HTML，CSS，构建DOM树和Render树，布局和绘制等
(2)重排/重绘
--1、重排又称重构、回流，当我们通过JavaScript或者CSS修改了元素的几何位置属性，例如改变元素的宽度、高度等，那么浏览器会触发重新布局，解析之后的一系列子阶段。重排需要更新完整的渲染流水线，所以开销也是最大的。每个页面至少需要一次reflow，就是在页面第一次加载的时候。
--2、任何页面布局和几何属性的改变都会触发重排，比如：
页面渲染初始化；(无法避免)
添加或删除可见的DOM元素；
元素位置的改变；
改变元素尺寸（宽、高、内外边距、边框等）；
浏览器窗口尺寸的变化（resize事件发生时）；
填充内容的改变，比如文本的改变或图片大小改变而引起的计算值宽度和高度的改变；
读取某些元素属性：（offsetLeft/Top/Height/Width,　clientTop/Left/Width/Height,　scrollTop/Left/Width/Height,　width/height,　getComputedStyle(),　currentStyle(IE)　)
--3、重绘是指一个元素外观的改变所触发的浏览器行为，浏览器会根据元素的新属性重新绘制，使元素呈现新的外观。比如通过 JavaScript 更改某些元素的背景颜色，没有改变元素的几何属性，那么布局阶段不会执行，而是直接进入绘制阶段。
--4、重绘省去了布局和分层阶段，效率会高于重排。重排必定会引发重绘，但重绘不一定会引发重排。
## JS引擎线程
(1)解析Javascript脚本，单线程执行
(2)与GUI互斥，GUI ON then JS Suspend.等待着任务队列中任务的到来，然后加以处理，JS执行的时间过长会导致页面渲染加载阻塞
## 事件触发线程
(1)归属于浏览器而不是JS引擎，用来控制事件循环
(2)当JS引擎执行代码块如click事件时（也可来自浏览器内核的其他线程,如鼠标点击、AJAX异步请求等），会将对应任务添加到事件待处理队列的队尾，等待JS引擎的处理
## 定时触发器线程
(1)setInterval与setTimeout所在线程
(2)浏览器定时计数器并不是由JS引擎计数的,因为JavaScript引擎是单线程的, 如果处于阻塞线程状态就会影响记计时的准确
(3)计时完毕后，将事件添加到事件队列中，等待JS引擎空闲后执行
## 异步http请求线程
(1)在XMLHttpRequest在连接后是通过浏览器新开一个线程请求
(2)将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件，将这个回调再放入事件队列中。再由JavaScript引擎执行。

## 实现hover等鼠标操作
![hover](hover.png)

## 使用performance分析页面性能
![performance](performance.png)

## 使用network调试
![network](network.png)
- preserve log 保留之前的请求
