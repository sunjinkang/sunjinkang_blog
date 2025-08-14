---
title: 关于博客网站的说明
date: 2025-08-14 10:54:00
cover: https://cdn.pixabay.com/photo/2016/11/22/23/19/constellations-1851128_640.jpg
tags: blog website
---

## 说明

由于将博客部署在了阿里云的服务器上，并绑定了域名，在这里做一些说明，避免有一些改动遗忘，后续再次修改时找不到

博客地址：
- IP：8.153.174.230
- 域名：sunjinkang.me

在阿里的平台上申请了安全证书，所以可以通过https协议访问

给博客申请了安全备案，但是当前的主题flexblock的配置仅支持填写备案号，公网安备的无法显示。
有两种方案：
- 第一种：
  - 将hexo-theme-flexblock的文件夹放到themes目录下，手动修改这个文件（hexo-theme-flexblock\layout\_partial\footer.ejs）中的模板内容，或者直接从根目录下找到footer.ejs，用根目录的文件替换即可
- 第二种：
  - 当前hexo-theme-flexblock文件夹在node_modules中，直接改node_modules中的文件，改动方法参考第一个方法
    - D:\sunjinkang\learning\sunjinkang_blog\node_modules\hexo-theme-flexblock\layout\_partial\footer.ejs
    - *注意：这种修改会重新安装node_modules之后丢失修改，所以需要重新修改*
