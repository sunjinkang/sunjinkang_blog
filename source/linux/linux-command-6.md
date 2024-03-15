---
title: linux - uname命令
date: 2024-02-28 11:09:30
tags: [linux, uname]
---

#### 关于uname命令介绍及常用参数说明

*uname 常用于获取服务器信息，包括但不限于主机名称、处理信息、架构信息等*

- 参数说明
| 参数 | 作用 |
| -a | 显示全部系统信息 |
| -m 或 -p | 显示CPU信息 |
| -n | 显示主机名 |
| -r | 显示内核版本 |
| -s | 显示系统名称 |
| -o | 显示操作系统名称 |
| -v | 显示系统版本 |
| -i | 显示硬件平台 |

- 举例
```sh
root@ubuntu:~# uname -a
Linux ubuntu 4.15.0-36-generic #39-Ubuntu SMP Mon Sep 24 16:19:09 UTC 2018 x86_64 x86_64 x86_64 GNU/Linux
root@ubuntu:~# uname -v
#39-Ubuntu SMP Mon Sep 24 16:19:09 UTC 2018
root@ubuntu:~# uname -s
Linux
root@ubuntu:~# uname -r
4.15.0-36-generic
root@ubuntu:~# uname -n
ubuntu
root@ubuntu:~# uname -p
x86_64
root@ubuntu:~# uname -m
x86_64
root@ubuntu:~# uname -i
x86_64
root@ubuntu:~# uname -o
GNU/Linux
```

#### Linux系统信息查看命令

> lsb_release -a

```sh
root@ubuntu:~# lsb_release -a
No LSB modules are available.
Distributor ID: Ubuntu
Description:    Ubuntu 18.04.1 LTS
Release:        18.04
Codename:       bionic
```
