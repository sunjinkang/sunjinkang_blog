---
title: nodejs基础知识(1)
date: 2022-10-19 19:12:12
tags: [node, docs]
---

###### nodejs是什么
脚本语言需要一个解析器才能运行，JavaScript是脚本语言，在不同的位置有不一样的解析器，如写入html的js语言，浏览器是它的解析器角色。而对于需要独立运行的JS，nodejs就是一个解析器。

每一种解析器都是一个运行环境，不但允许js定义各种数据结构，进行各种计算，还允许js使用允许环境提供的内置对象和方法做一些事情。如运行在浏览器中的js的用途是操作DOM，浏览器就提供了document之类的内置对象。而运行在nodejs中的js的用途是操作磁盘文件或搭建http服务器，nodejs就相应提供了fs,http等内置对象。

###### nodejs的安装
官网地址：https://nodejs.org/en/

直接从官网下载nodejs安装包，使用默认安装即可
安装完成后打开dos，输入 *node -v*，如果出现对应的版本信息，代表成功，如果安装失败，查看环境变量等设置是否正常，或者Google一下

**注意**
1、不同nodejs版本在使用上可能存在差异，需要根据自己实际情况，选择对应的版本安装（如果没有特别要求，一般使用标注的推荐版本进行安装即可）
2、安装时如无特殊需要，直接选择下一步，使用默认设置即可，环境变量会默认进行设置
3、新版的nodejs集成了npm，安装nodejs之后，可直接使用npm，打开dos，输入 *npm -v*，查看npm版本

根据不同的前端框架，使用不同的命令，安装对应的依赖、脚手架等，即可进行开发

**nodejs官网地址：https://nodejs.org/zh-cn/docs/**
**nodejs中文文档地址：https://www.nodeapp.cn/documentation.html**

