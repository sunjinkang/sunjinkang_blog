---
title: babel插件笔记
date: 2023-04-09 10:12:34
---

#### 什么是babel？
Babel 是一个通用的多功能的 JavaScript 编译器，是一种从源码到源码的编译器，将拿到的代码进行处理后生成新的代码。此外它还拥有众多模块可用于不同形式的静态分析。
> 静态分析是在不需要执行代码的前提下对代码进行分析的处理过程 （执行代码的同时进行代码分析即是动态分析）。 静态分析的目的是多种多样的， 它可用于语法检查，编译，代码高亮，代码转换，优化，压缩等等场景。

抽象语法树中的处理type类型的方法：
将页面代码复制到在线转换网页中，看有哪些type类型，哪些type类型是需要转换的，依据这个去做处理。
没有好的办法解决在一个页面中处理完成，在另一个页面中出现新的需要处理的type，方法：
1、新的页面在在线转换网页中转换处理一下，看需要处理的是否都已处理
2、另写一个脚本，去做比较，看看两边的结果是否一致，或原有的转换之后，另一个脚本是否又做了处理

- [babel笔记1](/babel/babel-note-1.html)
- [babel笔记2](/babel/babel-note-2.html)
- [babel笔记3](/babel/babel-note-3.html)
- [babel笔记4](/babel/babel-note-4.html)
- [babel笔记5](/babel/babel-note-5.html)

babel插件练习：https://github.com/sunjinkang/custom_replace_babel_plugin



javascript duck-typing接口

lebab：https://github.com/lebab/lebab
和babel作用相反

css中使用 white-space: pre-wrap;如果行位存在空格的话会挂起，使用white-space: break-spaces;时行位空格会保留
这个挂起是什么意思？挂起和保留的区别是什么？
