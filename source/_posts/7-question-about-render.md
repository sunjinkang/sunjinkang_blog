---
title: react & vue渲染问题
date: 2022-06-23 13:21:12
tags:
---

#### 疑问点
(1)react中的快照的具体作用是什么？vue3中是否有类似的操作？
类似渲染的子节点？？？
(2)react中将调试打印的信息放在块级作用域中？为什么不直接放在代码里面？
没什么特别意义，团队规范规定
(3)vue3中在patch的时候，为什么在有了patchElement（感觉能满足大部分情况了）的情况下，分了其他几种类型？
性能、更新
(4)react中react和react-dom的关系？vue3中vue.cjs.js和vue.global.js
react-dom =》 渲染浏览器
vue可以搭配react-dom
(5)vue3中是否有类似react的hooks那样返回的内容含有页面代码？
可以，使用createElement
(6)hooks和函数的区别是什么？没区别
(7)vue3中element-plus组件函数的类型从哪里获取？
(8)如何将看到的东西和实际应用联系起来？
(9)怎么抓住重点？
