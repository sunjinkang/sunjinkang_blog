---
title: 如何更新服务器上的页面
date: 2025-07-09 17:39:17
cover: https://cdn.pixabay.com/photo/2016/10/18/21/22/beach-1751455_640.jpg
tags: html server nginx
---

## 前言
本文主要是用于更新服务器上的nginx对应的页面。

## 更新步骤
*获取页面的编译文件夹*
根据实际情况，本人的编译文件夹时通过hexo命令生成的。

*上传编译结果的文件夹*

*查找nginx需要更新的目录*
我的nginx需要更新的位置如下：
```bash
/usr/share/nginx/html
# html文件夹及未需要更新的文件夹
```
删除需要更新的文件夹
```bash
rm -rf html
```

*将上传的文件夹名修改为html,将修改后的文件夹移动到上面对应的位置*
```bash
# 改名
mv public html

# 移动文件夹
mv html /usr/share/nginx/
```
