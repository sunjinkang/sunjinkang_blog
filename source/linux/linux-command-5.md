---
title: linux - 关于man手册
date: 2024-02-28 11:09:30
tags: [linux, man手册]
---

#### 以上内容可在man手册中查看具体内容
man手册地址：https://man7.org

man手册分为man1-man8：
- man1:用户命令；
- man2:系统调用；
- man3:C库调用；
- man4:设备文件及特殊文件；
- man5:文件格式：(配置文件格式)；
- man6:游戏使用帮助；
- man7:杂项；
- man8:管理工具及守护进行。

*man只是包含了一些基础的东西，而man-pages包含了详细的帮助手册*

#### 安装man手册命令
```sh
# 有时候可能需要在命令前面加上 sudo
# -y 表示安装过程中出现的问询直接使用yes进行后续操作，对于 -y 的位置并没有特别说明，放在yum后面貌似都可以

# 安装man
yum -y install man
# 或
yum install -y man
# 或
yum install man -y

# 安装man-pages
yum -y install man-pages

# 安装 man 和 man-pages
yum -y install man man-pages

# 卸载man
yum -y remove man

# 卸载man-pages
yum -y remove man-pages

# 卸载 man 和 man-pages
yum -y remove man man-pages

```
#### Docker容器中安装man后无法使用man问题？

现象：在docker容器中安装了man之后，使用man查看命令时，直接报错，无法查看
> No manual entry for man

原因：
1. 我们使用的docker镜像已经被官方精简过了，把所有已安装软件的man页都删除了，这样镜像可以更小
2. docker镜像中的/etc/yum.conf 也被刻意处理了一下，里面有个tsflags的选项，配置了nodocs，这样的话，新安装的软件也会被自动剔掉man文件（估计rpm知道man文件是被故意删掉的，所以也不报错）

解决办法：
将 /etc/yum.conf 中下面的代码注释掉：
> tsflags=nodocs
卸载掉相关软件，重新yum安装，即可正常使用man手册查看命令