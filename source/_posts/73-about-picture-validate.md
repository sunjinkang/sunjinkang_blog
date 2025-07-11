---
title: 如何实现一个图片验证？
date: 2024-08-16 15:05:58
cover: https://cdn.pixabay.com/photo/2024/09/08/05/59/ai-generated-9031225_640.jpg
tags:
---
## 前言
相信大家都遇到过拖动某块拼图到对应的位置，拖到大致和缺口重合的位置之后，图片验证通过，可以进行后续的操作，那么这种效果是怎么实现的？下面我们来看一下具体的实现。

{% asset_img demo.png demo %}

## 相关知识
CSS Sprite
> CSS Sprite，我们一般叫他雪碧图或精灵图，它是一种图像拼合技术。该方法是将小图标和背景图像合并到一张图片上，然后利用 css 的背景定位来显示需要显示的图片部分。

精灵图的优点：

- 多张图片合成一张，减少图片的字节 
- 减少网页的http请求，从而大大的提高页面的性能。
  background-position
  background-position有两个值，第一个值是水平位置，第二个值是垂直位置。即需要将背景图向右调的时候用正值，向左则为负值 同理将背景图上下调动的时候上是用负值，下是正值。
  offsetLeft：该元素左外边框至窗口左边界的距离。
  clientX：当事件被触发时鼠标指针相对于窗口左边界的水平坐标。
  offsetX：当事件被触发时鼠标指针相对于所触发的标签元素的左内边框的水平坐标。
{% asset_img client.png client %}
{% asset_img client-1.png client-1 %}

## 图片验证的原理
图片验证核心其实就是按钮的拖动，也就是位置的计算： 
- 设置两层图片，在下层图片中设置一个缺口，用于匹配验证 
- 将上层的图片通过background-position以及其他一些css样式设置，保证只露出和下层缺口一样大小和对应区域的显示 
- 通过js控制上层图片的移动，并对比上层图片和下层缺口的位置数据，当两者位置相同或在允许的误差范围内时，即判定验证成功。
{% asset_img offset.png offset %}

## 图片验证的实现
- html代码
  - {% asset_img html.png html %}
- css代码
  - {% asset_img css.png css %}
- js代码
  - {% asset_img js-1.png js-1 %}
  - {% asset_img js-2.png js-2 %}

*用户还可以根据自身需要进行进一步的扩展，比如设置多张验证图片，每次随机显示不同的图片等等。*

