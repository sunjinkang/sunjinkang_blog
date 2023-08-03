---
title: scrollIntoView参数项说明
date: 2022-11-10 10:39:52
tags:
---

###### scrollIntoView作用
*element.scrollIntoView*
滚动元素的父容器，使被调用scrollIntoView的元素对用户可见2，即滚动到可视区域

###### scrollIntoView用法
*element.scrollIntoView()*
等同于element.scrollIntoView(true)
<!-- more -->
*element.scrollIntoView(boolean)*
- boolean为true
  - 元素的顶端将和其所在滚动区域的可视区域的顶端对齐
  - 与element.scrollIntoView({ block: "start", inline: 'nearest'})等价
- boolean为false
  - 元素的底端将和其所在滚定区域的可视区域的底端对齐
  - 与element.scrollIntoView({ block: "end", inline: 'nearest'})等价

*element.scrollIntoView(options)*
options为一个对象，属性如下：
- behavior
  - 定义动画过渡效果
  - 值为：
    - auto(默认值)，无平滑滚动效果
    - smooth，有平滑的滚动效果
- block
  - 定义垂直方向的对齐
  - 值为：
    - start: 默认值，顶端对齐
    - center：中间对齐
    - end：底端对齐
    - nearest：如果元素完全在可视区域内，则垂直方向不发生滚动。如果元素未能完全在可视区域内，则根据最短滚动距离原则，垂直方向滚动父级容器，使元素完全在可视区域内。
- inline
  - 定义水平方向的对齐
  - 值为：
    - start：左端对齐
    - center：中间对齐
    - end：右端对齐
    - nearest: 默认值，如果元素完全在可视区域内，则水平方向不发生滚动。如果元素未能完全在可视区域内，则根据最短滚动距离原则，水平方向滚动父级容器，使元素完全在可视区域内。

**注意：取决于其他元素的布局情况，此元素可能不会完全滚动到顶端或底端**