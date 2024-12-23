---
title: 62-关于在工作中遇到的前端自适应问题整理
date: 2024-08-09 06:48:08
tags:
---

#### 前言
之前在做一个前端项目的登录页时，按照设计给的设计图，前端把样式直接写死为设计图中的px单位。由于设计图是1920*1080的宽高，进而导致了页面在大屏幕上展示正常，但在小屏幕上会出现滚动条，影响用户体验，本片文章主要是关于这个问题解决的过程记录。

#### 解决方法
遇到了问题，肯定是要解决的。那么关于这个页面自适应问题，都有哪些解决方法？下面我们先来看一下，常见的自适应解决方案。

1. 百分比
  给页面的元素宽高设置为百分比形式，实现在不同大小屏幕上的改变。但这种方式局限性太大，使用场景较少。

2. css布局
  css中flex、grid属性经常用来自适应页面，设置display为flex或者grid，再配合一些其他的样式属性即可。但实际上这种较常用于布局方面，也存在一定的局限性。通常还需要配合其他方法。

3. calc计算属性
  使用calc计算不同的宽高，达到自适应的目的。

4. rem
  rem是相对于根元素的字体大小单位，即如果根元素的字体大小不同，页面中使用rem作为单位的元素会展示出不同的效果，同时，我们可以使用px2rem自动将px转为rem。

5. vw和vh
  vh和vw是一种视窗单位，也是相对单位，是css3新增的一种自适应方案。vw和vh和百分比类似，1vw代表1%，100vw代表100%，不同点在于css的百分比相对于父元素，vw和vh表示的百分比是相对于视口
（1）对于pc端，vw和vh相对于浏览器的可视区域（承载网页的区域），100vh是浏览器可视区域的最大高度,100vw是浏览器可视区域的最大宽度
（2）当将页面内嵌于iframe时，vw和vh相对于iframe的可视区域（iframe的大小），100vh是iframe的最大高度，100vw是iframe的最大宽度

6. media媒体查询
  通过针对不同的浏览器屏幕大小显示不同样式的方式达到自适应的目的。
  ```css
  /* 组合多个媒体查询 */
@media screen and (min-width: 600px) and (orientation: landscape) {
  /* 在这里应用适合大屏幕横向设备的样式 */
}

/* or 运算符 */
@media (min-width: 600px), print {
  /* 在这里应用适合宽度大于等于600px的样式，或打印样式 */
}

/* not 运算符 */
@media not screen {
  /* 在这里应用适合非屏幕设备的样式 */
}

/* 嵌套媒体查询 */
@media screen {
  /* 屏幕样式规则 */

  @media (min-width: 600px) {
    /* 大屏幕样式规则 */
  }

  @media (max-width: 600px) {
    /* 小屏幕样式规则 */
  }
}

/* 小屏幕设备，宽度小于600px */
@media screen and (max-width: 600px) {
  /* 在这里应用适合小屏幕的样式 */
}

/* 大屏幕设备，宽度大于等于1200px */
@media screen and (min-width: 1200px) {
  /* 在这里应用适合大屏幕的样式 */
}

/* 横向设备 */
@media screen and (orientation: landscape) {
  /* 在这里应用适合横向设备的样式 */
}

/* 纵向设备 */
@media screen and (orientation: portrait) {
  /* 在这里应用适合纵向设备的样式 */
}

/* 高分辨率设备，分辨率大于等于2x */
@media screen and (min-resolution: 2dppx) {
  /* 在这里应用适合高分辨率设备的样式 */
}

/* 低分辨率设备，分辨率小于1.5x */
@media screen and (max-resolution: 1.5dppx) {
  /* 在这里应用适合低分辨率设备的样式 */
}
  ```
  
7. scale按比例缩放
   通过 css 的 scale 属性，根据屏幕大小，对图表进行整体的等比缩放，从而达到自适应效果。
   transform: scaleX(x); / 沿x轴方向缩放/
transform: scaleY(y); / 沿y轴方向缩放/
transform: scale(); / 同时沿x轴和y轴缩放/

```js
    const designDraftWidth = 1920; //设计稿的宽度
    const designDraftHeight = 1080; //设计稿的高度
    const screenWidth = document.documentElement.clientWidth;
    const screenHeight = document.documentElement.clientHeight;
    if (screenWidth > 0 && screenHeight > 0 && designDraftWidth > 0 && designDraftHeight > 0) {
      const scale = screenWidth / screenHeight < designDraftWidth / designDraftHeight
        ? screenWidth / designDraftWidth
        : screenHeight / designDraftHeight;
      const screenElement = document.querySelector('#screen') as HTMLElement;
      if (screenElement) {
        screenElement.style.transform = `scale(${scale}) translate(0, 0)`;
      }
    }

```

页面的自适应主要就是上面这些方式，实际使用中，往往根据实际需要采用多种方式结合的方案。说回我们一开始的项目登录页的问题。下面我们说一下具体的处理过程。

#### 问题解决过程

结合这个项目，出于成本，方便性考虑，我们先来看一下有哪些可行的方案：
1. 已有tailwindcss，而tailwindcss本身支持rem单位。我们是不是可以直接通过添加class的方式达到自适应的目的？
实际使用时，发现了这些问题：
- 部分样式的属性，在tailwindcss中没有，比如width：70px，试了一下，没有相关的class，如果要使用的话，需要自定义。
- 由于tailwindcss使用rem做自适应。涉及到根元素的处理，所以需要添加媒体查询，在不同屏幕宽高时改变根元素的字体单位大小。
- 由于已经添加了样式，需要删除已有的相关样式代码。
结合以上考虑，该方案先放着，看看有没有其他更好一点的方案。

2. 页面的设计图是1920*1080，那么我以这个基准，使用vw替换已有的样式单位？
已有的样式单位，通过使用这个vscode插件，能较为便利的转化为vw单位的数据。
但是这种方式，把实际的样式代码做了变更，导致和设计图图不一致，不利于后续的开发。而且，在屏幕比较小时，会导致页面元素过小，屏幕较大时，页面中的元素又过大，该方案放弃。

3. 保留原有代码的基础上，做一次转化，保证在浏览器的页面上是以rem做为单位？
  找了一个插件，将原有的px单位代码做了一次包裹转化。再添加媒体查询，在不同屏幕宽高时改变根元素的字体单位大小。考虑到成本问题，目前采用了这种处理方案。

