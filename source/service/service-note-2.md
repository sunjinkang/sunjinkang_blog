---
title: service - 资源传输开启压缩
date: 2025-05-13 20:54:25
tags: [服务器, 传输, 压缩]
---

## 前言
前一篇文章中介绍了在阿里云服务器中部署纯前端服务页面的步骤以及遇到的问题和对应的解决方法，本篇文章中将介绍开启图片、js文件、css文件等传输压缩的方式

## 修改nginx配置文件
```bash
http {
    # 启用 Gzip 压缩
    gzip on;
    gzip_disable "msie6";          # 禁用对旧版本 IE 的压缩
    gzip_vary on;                  # 告知代理服务器启用压缩
    gzip_proxied any;              # 对所有代理请求启用压缩
    gzip_comp_level 6;             # 压缩级别（1-9，6 为平衡性能与压缩率）
    gzip_buffers 16 8k;            # 压缩缓冲区大小
    gzip_http_version 1.1;         # 最低 HTTP 版本要求
    gzip_min_length 256;           # 仅压缩大于 256 字节的文件

    # 指定需要压缩的 MIME 类型（包含图片格式）
    gzip_types
        text/plain
        text/css
        text/javascript
        application/javascript
        application/json
        application/x-javascript
        application/xml
        application/xml+rss
        image/svg+xml             # SVG 矢量图（可压缩）
        image/x-icon             # 图标文件（如 .ico）
        image/jpeg
        image/png;
    
    # 配置图片格式的压缩（部分格式已内置压缩，无需重复处理）
    # 如 JPEG/PNG 本身已压缩，建议不启用 Gzip 压缩
}
```

验证配置并重启nginx
```bash
# 检查配置语法
sudo nginx -t

# 重启 Nginx 生效
sudo systemctl restart nginx
```

## 验证压缩是否生效
打开浏览器开发者工具（按 F12），切换到 Network 标签。
刷新页面，点击资源的请求。
查看响应头中是否包含 Content-Encoding: gzip。

## 遇到的问题
首次修改后，指定需要压缩的 MIME 类型缺少部分图片类型，导致部分图片传输未开启压缩，比如jpeg和png。
所以需要压缩的图片需要添加对应的指定需要压缩的 MIME 类型，注意不要遗漏

## 常见问题排查
| 问题                            | 原因                       | 解决方案                                                 |
| ------------------------------- | -------------------------- | -------------------------------------------------------- |
| 压缩未生效                      | 未正确配置 gzip_types      | 检查配置文件中是否包含目标 MIME 类型（如 image/svg+xml） |
| 响应头无 Content-Encoding: gzip | 文件小于 gzip_min_length   | 调整 gzip_min_length 为更小值（如 0）                    |
| 服务器 CPU 负载高               | 压缩级别过高或并发请求过多 | 降低 gzip_comp_level 或升级服务器配置                    |

## 使用pagespeed验证压缩开启后网页传输速度是否提高
pagespeed地址：https://pagespeed.web.dev/

网页开启压缩前：
性能：42
无障碍：71
最佳做法：75
SEO: 54

开启压缩后：
性能：82
无障碍：71
最佳做法：79
SEO: 54