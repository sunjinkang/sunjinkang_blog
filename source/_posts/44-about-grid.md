---
title: 关于grid布局的相关内容
date: 2023-01-03 15:28:21
cover: https://cdn.pixabay.com/photo/2024/06/20/11/12/nature-8841864_1280.png
tags:
---

###### 什么是grid布局？
###### 怎么实现grid布局？
###### grid布局的好处
###### grid布局中一些常用设置说明
- grid-row: grid-row-start / grid-row-end;
  - grid-row-start	指定在哪一行开始显示网格元素。
  - grid-row-end	指定停止显示网格元素的行，或要跨越多少行。

<!-- more -->
```css
/* 设置 "item1" 在第 1 行开始，在第 4 行前结束 */
.item1 {
  grid-row: 1 / 4;
}
/* 可以参考行号来设置网格元素，也可以使用关键字 "span" 来定义元素将跨越的行数。 */
/* 设置 "item1" 跨越两行 */
.item1 {
  grid-row: 1 / span 2;
}
```
- grid-template-columns
  - 规定网格布局中的列数（和宽度）
```css
/* 设置三列，每列10px */
.grid-container {
  grid-template-columns: 10px 10px 10px;
}
/* 设置四列，每列宽度自适应 */
.grid-container {
  grid-template-columns: auto auto auto auto;
}
```
- repeat()
  - 函数表示轨道列表的重复片段，允许以更紧凑的形式写入大量显示重复模式的列或行。
  - 该函数可以用于 CSS Grid 属性中 grid-template-columns 和 grid-template-rows。
```css
/* repeat(4, 1fr) */
/* 设置四列，每列均分 */
.grid-container {
  grid-template-columns: repeat(4, 1fr);
}
```
- fr
  - 一种新的长度单位 fr(fraction)。它表示 Grid 布局中中剩余空间(leftover space)的一部分(fraction)。
  - 一般来说 1fr 的意思是“100%的剩余空间”, .25fr 意味着“25%的剩余空间”。当时当 fr 大于 1 的时候，则会重新计算比例来分配
  - 一般都建议使用 fr>=1 的情况, 比如说 1fr 2fr 就比 .33fr .67fr 可读性更强。