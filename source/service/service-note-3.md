---
title: service - 搭建gitlab的步骤及遇到的问题
date: 2025-06-05 21:34:13
cover: https://cdn.pixabay.com/photo/2018/08/15/13/10/new-year-background-3608029_640.jpg
tags: [服务器, gitlab]
---

## 前言

本文主要介绍如何在服务器上搭建gitlab服务，以及在搭建的过程中遇到的问题。注意：由于服务器上已经有了个人博客，且占据了80端口，所以新的gitlab服务搭建时要注意不要再使用80端口，避免造成端口冲突。同时，需要确保服务器的安全组放开了要使用的端口。

## 搭建gitlab服务的步骤

#### 安装依赖

```bash
# 更新系统并安装必要组件
sudo yum update -y
sudo yum install -y curl policycoreutils-python openssh-server

# 启用SSH服务（如果未启动）
sudo systemctl enable sshd
sudo systemctl start sshd
```

