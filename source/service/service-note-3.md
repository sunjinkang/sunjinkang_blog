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

注意：我在使用上述脚本的时候遇到了报错关于policycoreutils-python的报错
```bash
[root@xxxxxxxx ~]# sudo yum install -y curl policycoreutils-python openssh-server
alinux3-os                                                                                                    11 MB/s | 5.5 MB     00:00    
alinux3-updates                                                                                               80 MB/s |  33 MB     00:00    
alinux3-module                                                                                               5.8 MB/s | 605 kB     00:00    
alinux3-plus                                                                                                  81 MB/s |  31 MB     00:00    
alinux3-powertools                                                                                            21 MB/s | 1.6 MB     00:00    
Extra Packages for Enterprise Linux 8 - x86_64                                                               215 kB/s |  14 MB     01:07    
Last metadata expiration check: 0:00:01 ago on Wed 18 Jun 2025 01:19:24 PM CST.
Package curl-7.61.1-35.0.2.al8.3.x86_64 is already installed.
No match for argument: policycoreutils-python
Package openssh-server-8.0p1-25.0.1.1.al8.x86_64 is already installed.
Error: Unable to find a match: policycoreutils-python
```
原因：在 Alibaba Cloud Linux 3 中，policycoreutils-python 包已被替代为 policycoreutils-python-utils。

所以改为使用如下命令安装依赖包
```bash
# 安装 policycoreutils-python-utils 替代包
sudo yum install -y policycoreutils-python-utils

# 确认其他依赖已安装
sudo yum install -y curl openssh-server
```

#### 修复gitlab的安装问题（非必须）
由于我之前已经安装过一次gitlab，但是安装失败了，所以需要完全清理后重新安装

```bash
# 停止并卸载现有 GitLab（如果存在）
sudo gitlab-ctl stop 2>/dev/null
sudo yum remove -y gitlab-ee
sudo rm -rf /opt/gitlab /var/opt/gitlab /etc/gitlab /var/log/gitlab
```

#### 重新安装gitlab（使用8090端口）

```bash
# 手动下载最新 RPM 包
LATEST=$(curl -s "https://packages.gitlab.com/gitlab/gitlab-ee" | grep -oP 'gitlab-ee-\d+\.\d+\.\d+[^"]*\.el8\.x86_64\.rpm' | sort -V | tail -1)
wget "https://packages.gitlab.com/gitlab/gitlab-ee/packages/el/8/${LATEST}/download.rpm" -O gitlab-ee.rpm

# 安装并指定 8090 端口
sudo EXTERNAL_URL="http://$(hostname -I | awk '{print $1}'):8090" yum localinstall -y gitlab-ee.rpm
```

#### 配置gitlab使用8090端口

```bash
sudo vi /etc/gitlab/gitlab.rb
```

在gitlab.rb文件中添加如下配置
```bash
# 基本配置
external_url 'http://your_server_ip:8090'

# Nginx 设置
nginx['enable'] = true
nginx['listen_port'] = 8090
nginx['listen_https'] = false

# 禁用 Puma 的 TCP 监听
puma['port'] = 0
puma['socket'] = '/var/opt/gitlab/gitlab-rails/sockets/gitlab.socket'

## 由于我的内存为8GB，所以没有执行下面的优化

# 内存优化（如果服务器内存 < 4GB）
puma['worker_processes'] = 2
sidekiq['max_concurrency'] = 5
postgresql['shared_buffers'] = "256MB"
```

注意：
- external_url一般在文件中已经存在，使用下面的命令找到对应的行，跳转到对应行修改即可
```bash
grep -n "external_url" /etc/gitlab/gitlab.rb
```
- 关于nginx和puma的设置一般来说直接跟在external_url后面就可以，但是需要在配置文件中搜索之后确认一下是否已存在相关的配置，避免重复设置导致设置失效
```bash
grep -n "nginx" /etc/gitlab/gitlab.rb

grep -n "puma" /etc/gitlab/gitlab.rb
```

#### 应用配置并启动

```bash
sudo gitlab-ctl reconfigure
sudo gitlab-ctl restart
sudo gitlab-ctl status
```

执行上面的步骤之后成功后，打开浏览器，输入`http://your_server_ip:8090`，地址，一般来说就能正常显示gitlab的登录页

PS: 可能会遇到打开后页面显示502 Waiting for Gitlab to boot，一般来说等一会就可以，但是如果等待了超过10分钟还是这样，就不要再等了，应该是产生错误了，需要查看错误原因进行修改

## 搭建gitlab遇到的问题

一开始搭建使用8080端口，搭建后，浏览器打开一直显示502，通过`sudo gitlab-ctl status`命令查看，所有服务正常运行
排查步骤如下：
（1）服务器内存不足，搭建gitlab需要至少4+GB
但是使用`free -h`发现服务器内存为8GB，该原因排除
（2）查看错误日志
```bash
sudo tail -n 100 /var/log/gitlab/puma/current
sudo tail -n 100 /var/log/gitlab/gitlab-rails/production.log
```
错误日志中发现如下信息：
```bash
2025-06-18_02:29:41.47011 bundler: failed to load command: puma (/opt/gitlab/embedded/bin/puma)
2025-06-18_02:29:41.47211 /opt/gitlab/embedded/lib/ruby/gems/3.2.0/gems/puma-6.5.0/lib/puma/binder.rb:335:in initialize': Address already in use - bind(2) for "127.0.0.1" port 8080 (Errno::EADDRINUSE)
2025-06-18_02:29:41.47212       from /opt/gitlab/embedded/lib/ruby/gems/3.2.0/gems/puma-6.5.0/lib/puma/binder.rb:335:in new'
```
该信息表明：已有服务正在侦听端口 8080，导致 Puma 启动失败，所以无法建立 socket，Workhorse 请求一直被拒绝，最终导致 502 错误。

使用`sudo ss -ltnp | grep :8080`查询占用8080端口的进程，发现端口被nginx占用。然后改为使用8090端口搭建，页面可以正常打开。
