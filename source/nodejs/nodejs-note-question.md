---
title: nodejs问题整理
date: 2023-02-22 18:11:10
tags: []
---

- 使用module.createRequire创建的require和直接使用require有什么区别？？？
*问题来源：nodejs module模块*
使用createRequire创建的require独立于直接使用的require，可以读取新文件，直接使用的require是从cache缓存中读取文件，不能及时读取到刚更新后的文件

- Node.js 不能保证拷贝操作的原子性，是什么意思？
*问题来源：fs.copyFile*
原子性在这里的意思是指要么复制之前报错，要么全部复制，不会复制一半。nodejs会尝试保证拷贝操作的原子性，但是可能由于缺少权限等原因导致无法保证。
比如：执行复制操作，打开文件出错，nodejs会尝试删除它，但是没有权限，删除失败。

- beforeunload监听页面是否存在操作，存在操作时提示，需要鼠标点击页面事件才生效
**一定要是手动操作、模拟执行的都不能使事件生效**

