---
title: linux - yum配置本地源
date: 2024-03-21 18:39:10
tags: [linux, yum]
---

yum仓库配置文件位于 /etc/yum.repos.d

#### 查看yum仓库清单
> yum repolist

```sh
[root@xxx yum.repos.d]# yum repolist
Loaded plugins: ovl
repo id                             repo name                                                         status
!base/7/x86_64                      CentOS-7 - Base - mirrors.aliyun.com                              10,072
!epel/x86_64                        Extra Packages for Enterprise Linux 7 - x86_64                    13,625
!extras/7/x86_64                    CentOS-7 - Extras - mirrors.aliyun.com                               498
!updates/7/x86_64                   CentOS-7 - Updates - mirrors.aliyun.com                            2,542
repolist: 26,737
```

#### yum清空缓存&重建缓存
> yum clean
> yum clean all  //清空缓存目录下的软件包及旧的headers
> yum clean packages
> yum clean headers
> yum clean oldheaders

> yum makecache

### yum搜索
> yum provides 命令  //查看命令是由哪个包提供的
> yum search [string]  // 根据关键字string查找安装包

#### 查看包的依赖
> yum deplist [安装包名]









yum缓存目录下的 headers是什么东西？？
解决需要多次下载问题

什么时候需要被删？
硬件损坏
包损坏

yum配置文件地址有多个时使用了baseurl，既然有多个，为什么不用mirrorlist ??
baseurl=http://mirrors.aliyun.com/centos/$releasever/contrib/$basearch/
        http://mirrors.aliyuncs.com/centos/$releasever/contrib/$basearch/
        http://mirrors.cloud.aliyuncs.com/centos/$releasever/contrib/$basearch/

随机选择一个地址下载，失败后换新的下载。
确认某一个mirrorlist哪个最快，类似每一个都ping一下，但只能确定ping的时候哪一个最快。所以实际连接时候可能


3d for js 编译为rpk??
andiriod 


Makefile语言学习，实现一个脚本
选择之前先考量一下，类似makefile的语言，大家都在用什么，未来走向，对比一下，再确定。
时间久，过时了，有没有什么新的