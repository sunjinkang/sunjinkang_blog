---
title: github推送代码弹窗应该怎么输入？
date: 2022-06-30 10:45:15
tags:
---

#### github推送代码弹窗应该怎么输入?

当本地修改代码后，需要推送到github仓库时，由于本地未记录用户名与密码，导致push时，先后出现GitHub登录弹窗，以及一个小弹窗，
鉴于在输入实际操作中，两次输入username和password不知道应该怎么输入，做个记录，避免遗忘。

(1)本地修改代码，提交。本文仅从git push开始记录，之前的命令和操作如果不知道怎么办，请自行百度或Google。
```javascript
git push
```
---- 注意：有时推送代码时，会出现超时等情况，可能是网络问题，可多试几次或稍后再试
```javascript
$ git push
fatal: unable to access 'https://github.com/sunjinkang/test_vue3_sql.git/': Failed to connect to github.com port 443: Timed out

// --------
$ git push
fatal: unable to access 'https://github.com/sunjinkang/test_vue3_sql.git/': OpenSSL SSL_read: Connection was aborted, errno 10053
```
(2)第一个GitHub登录弹窗
![github_login]()
该弹窗中 **username为github的登录邮箱，password为GitHub的登录密码**
---- 注意：本次输入完成后，虽然输入的均为正确信息，但是由于GitHub不在支持用户名密码推送，改为使用令牌，导致输入后悔提示登录失败
```javascript
Logon failed, use ctrl+c to cancel basic credential prompt.
remote: Support for password authentication was removed on August 13, 2021. Please use a personal access token instead.
```
(3)第二个登录弹窗
![login_insert]
该弹窗会出现两次，第一次输入username，第二次输入password，**username为GitHub的登录邮箱，<font color="Red">password为GitHub网站的连接令牌(Personal access tokens)(如何生成token可以查看文章[github生成令牌](/2022/06/30/github生成令牌-Personal-access-tokens-操作步骤/))</font>**
---- 注意：如果password输入错误，会导致无法提交
```javascript
$ git push
Logon failed, use ctrl+c to cancel basic credential prompt.
remote: Support for password authentication was removed on August 13, 2021. Please use a personal access token instead.
remote: Please see https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/ for more information.
fatal: Authentication failed for 'https://github.com/xxxxxxx.git/'
```

当username和password输入完成后，就可以正常push代码啦