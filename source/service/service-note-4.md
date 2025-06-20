---
title: service - 设置gitlab的账号与权限
date: 2025-06-10 20:56:39
cover: https://cdn.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_640.jpg
tags: [服务器, gitlab]
---

## 前言

前面介绍了如何在服务器上搭建gitlab，那么我如何登录gitlab，如何为某个账号添加gitlab的权限呢？本文将针对gitlab的账号与权限进行说明。


## 设置管理员账号（root用户）

注意：gitlab的默认用户名为 root，安装完毕后不会自动设置root密码，而是会提示你在第一次登录网页界面时设置一个密码。
但如果你已经跳过或无法打开网页设置页面，可以通过以下方式手动设置 root 密码

*重置root密码密码*
```bash
sudo gitlab-rails console

# 进入ruby控制台后，执行下面的设置操作
user = User.find_by_username('root')
user.password = '你的强密码'      # 至少8字符
user.password_confirmation = '你的强密码'
user.save!
exit
```

#### 创建新管理员账号
使用root账号登录后，到Overview -> Users页面，添加新用户，根据实际需要设置用户的名称与邮箱并设置权限。
创建后，使用新账号登录即可。