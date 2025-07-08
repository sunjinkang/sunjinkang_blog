---
title: 进度条中同一文字颜色反差的实现
date: 2023-08-03 15:19:59
cover: https://cdn.pixabay.com/photo/2024/01/31/03/58/sky-8543170_640.jpg
tags:
---

###### 前言
生活中，大家应该都遇到过进度条，有时候进度条的文字在进度条内部，当进度覆盖到文字的时候，会有一种反差，比如：同一个文字被进度覆盖的部分是白色字体，未被进度覆盖的是黑色字体，本文即是针对这种效果的实现。
<!-- more -->
###### 实现一：使用伪类

*预置说明*
content与attr（PS: 本文仅针对需要的使用方式进行说明，不做详细说明，感兴趣的可以前往[mdn的attr](https://developer.mozilla.org/zh-CN/docs/Web/CSS/attr)进行查看）

content
CSS 的 content CSS 属性用于在元素的 ::before 和 ::after 伪元素中插入内容。使用 content 属性插入的内容都是匿名的可替换元素。
```js
<a href="http://www.mozilla.org/en-US/">Home Page</a>

a::before {
  content: url(http://www.mozilla.org/favicon.ico) " MOZILLA: ";
  font:
    x-small Arial,
    freeSans,
    sans-serif;
  color: gray;
}
```

常见用法：
> content: attr(属性名);

示例：
```js
// html code
<p data-foo="hello">world</p>
// css code
p:before {
  content: attr(data-foo) " ";
}
// result
// hello world
```

注意：attr理论上可以单独使用，但由于浏览器兼容性问题，目前最好不要使用，本文中attr是与content一起使用，限制较小。
{% asset_img content_attr.png content_attr %}

方案：使用content和attr可以获取标签中的属性，将进度条的文字同时放在标签的属性里面，再通过伪类和content、attr搭配，根据进度显示不同宽度，将新的文字覆盖到原有的底层文字之上，实现进度条文字反差的效果。

```html
<div class="progress-bar" data-content="当前进度：18%">当前进度：18%</div>
```
```css
.progress-bar {
  display: inline-block;
  font-size: 16px;
  line-height: 20px;
  color: lightblue;
  position: relative;
  overflow: hidden;
  white-space: pre;
  width: 300px;
  height: 20px;
  border: 1px solid #333;
}

.progress-bar:before {
  position: absolute;
  top: 0;
  color: #fff;
  display: block;
  width: 18%;
  content: attr(data-content);
  overflow: hidden;
  background-color: lightblue;
}
```

效果如下：
{% asset_img content-progress.png content进度条 %}

*说明*
该方案中的文字好像只能处于默认的左侧位置，使用伪类获取的内容文字无法位于中间，暂未找到解决办法

###### 方案二：使用双层元素层叠

方案：本质与方案一类似，只不过方案二是把两个元素叠在一起，元素内容相同

```html
<div class="progress-wrapper">
  <div class="progress-bottom">当前进度：18%</div>
  <div class="progress-top">当前进度：18%</div>
</div>
```
```css
body {
  margin: 0;
}
.progress-wrapper {
  overflow: hidden;
  white-space: pre;
  width: 300px;
  height: 20px;
  line-height: 20px;
  font-size: 16px;
  border: 1px solid #333;
  position: relative;
}
.progress-bottom {
  display: inline-block;
  color: lightblue;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.progress-top {
  background-color: lightblue;
  color: #fff;
  width: 18%;
  position: absolute;
  top: 0;
  overflow: hidden;
}
```

效果与方案一相同

*说明*
方案二同样存在方案一的缺陷，文字只能位于左侧

上面两种方案都存在文字只能位于左侧的问题，但实际使用中往往文字是位于中间的，进而出现了方案三

###### 方案三：使用三层元素层叠+js计算

方案：实现方式与方案二类似，不过文字都位于进度条中间，并在两层元素之间又加了一层元素，新加的这层元素仅用于进度的渲染，同时通过js计算最上层的元素与进度区域的重合部分宽度，修改最上层元素的宽度，展示不同颜色的文字。
ps: 本文中未实现具体的js计算逻辑，可根据进度条总长度，文字区域长度等进行计算。
```html
<div class="progress-wrapper">
  <div class="progress-bottom">当前进度：18%</div>
  <div class="progress-bar"></div>
  <div class="progress-top">当前进度：18%</div>
</div>
```
```css
body {
  margin: 0;
}
.progress-wrapper {
  overflow: hidden;
  white-space: pre;
  width: 300px;
  height: 20px;
  line-height: 20px;
  font-size: 16px;
  border: 1px solid #333;
  position: relative;
  text-align: center;
}
.progress-bottom {
  display: inline-block;
  color: lightblue;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}
.progress-top {
  background-color: lightblue;
  color: #fff;
  width: 19%;
  position: absolute;
  top: 0;
  overflow: hidden;
  left: 50%;
  margin-left: -56px;
}
.progress-bar {
  background-color: lightblue;
  color: #fff;
  width: 50%;
  position: absolute;
  top: 0;
  overflow: hidden;
  height: 20px;
}
```

方案三通过js的计算，在实现文字颜色反差的基础上进一步实现了文字的居中

###### 进度条插件的实现方案
暂未发现。。。