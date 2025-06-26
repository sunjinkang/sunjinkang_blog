---
title: service - 搭建GOCD及注意事项
date: 2025-06-26 17:08:34
cover: https://cdn.pixabay.com/photo/2023/10/21/11/46/sunset-8331285_640.jpg
tags: [服务器, GOCD]
---

## 前言

GOCD平台用于编译打包项目，本文主要介绍如何在服务器上部署GOCD，以及部署中遇到的问题及解决方法。


## 说明

- 由于经费有限。。。只有一台服务器，gitlab与gocd部署在了同一台服务器上，且先部署了gitlab，gitlab的某个服务占用了8153端口，所以gocd使用18153、18154端口。
- 服务器系统为Alibaba Cloud Linux 3（基于 RHEL/CentOS 系统），因此需要使用 yum/dnf 包管理器而不是 apt。
- 由于使用的是阿里云服务的服务器，使用的端口需要先通过安全组放开，允许外部访问

## 使用频率较高的命令

```bash
# 查看端口占用情况
sudo netstat -tulpn | grep ':端口号'
# 举例：sudo netstat -tulpn | grep ':8153'


# 验证go-server服务状态
sudo systemctl status go-server


# gocd服务无法启动，查看日志
# 查看最新日志
sudo tail -50 /var/log/go-server/go-server-wrapper.log
sudo tail -50 /var/log/go-server/go-server.log

# 启动报错
sudo cat /var/log/go-server/go-server-wrapper.log | tail -40
sudo cat /var/log/go-agent/go-agent-bootstrapper-wrapper.log | tail -40


```

## 部署GOCD

*添加GOCD YUM仓库*
```bash
# 创建 GoCD 仓库文件
sudo tee /etc/yum.repos.d/gocd.repo <<EOL
[gocd]
name=GoCD YUM Repository
baseurl=https://download.gocd.org
enabled=1
gpgcheck=1
gpgkey=https://download.gocd.org/GOCD-GPG-KEY.asc
EOL

# 导入 GPG 密钥
sudo rpm --import https://download.gocd.org/GOCD-GPG-KEY.asc
```

使用YUM源时报错
```bash
[root@iZuf67coc42l6mbacxpizeZ ~]# sudo yum install go-server go-agent -y
GoCD YUM Repository                                                                                         179  B/s | 303  B     00:01    
Errors during downloading metadata for repository 'GoCD':
  - Status code: 403 for https://download.gocd.org/yum/el/7/noarch/repodata/repomd.xml (IP: 18.155.68.42)
Error: Failed to download metadata for repo 'GoCD': Cannot download repomd.xml: Cannot download repodata/repomd.xml: All mirrors were tried
```

改为直接下载rpm包
```bash
# 安装依赖
sudo yum install java-11-openjdk -y

# 下载 RPM 包
wget https://download.gocd.org/binaries/25.2.0-20485/rpm/go-server-25.2.0-20485.noarch.rpm
wget https://download.gocd.org/binaries/25.2.0-20485/rpm/go-agent-25.2.0-20485.noarch.rpm

# 安装
sudo rpm -ivh go-server-25.2.0-20485.noarch.rpm
sudo rpm -ivh go-agent-25.2.0-20485.noarch.rpm
```


*安装gocd服务器*
```bash
# 安装依赖
sudo yum install -y java-11-openjdk-devel

# 安装 GoCD 服务器
sudo yum install -y go-server

# 启动服务
sudo systemctl start go-server
sudo systemctl enable go-server

# 检查状态
sudo systemctl status go-server
```

*修改端口*
```bash
# 编辑配置文件
sudo vi /etc/default/go-server

# 修改以下两行：
GO_SERVER_PORT=18153       # 原 8153
GO_SERVER_SSL_PORT=18154   # 原 8154

# 保存后重启服务
sudo systemctl restart go-server
```


*安装gocd agent*
```bash
sudo yum install -y go-agent
sudo systemctl start go-agent
sudo systemctl enable go-agent

# 检查状态
sudo systemctl status go-agent
```

*修改go-agent连接端口*
```bash
sudo vi /etc/default/go-agent

GO_SERVER=127.0.0.1
GO_SERVER_PORT=18153
```




## 问题及解决方法

*当/etc/default/go-server文件不存在时，需要手动创建*
```bash
# 创建配置文件
sudo tee /etc/default/go-server << 'EOF'
# GoCD server configuration
GO_SERVER_PORT=18153
GO_SERVER_SSL_PORT=18154
GO_SERVER_SYSTEM_PROPERTIES="-Xms512m -Xmx1024m"

# Java home (检查并设置正确的路径)
# JAVA_HOME=$(dirname $(dirname $(readlink -f $(which java)))
EOF

# 设置正确的java路径
java_path=$(dirname $(dirname $(readlink -f $(which java))))
echo "Java 安装路径: $java_path"

sudo sed -i "s|# JAVA_HOME=|JAVA_HOME=$java_path|" /etc/default/go-server
```

*修改的端口不生效*
原因：改错了配置文件，导致修改被覆盖，修改不生效


*报错：Running GoCD requires Java version >= 17. You are currently running with Java version 11. GoCD will now exit!*
原因：GoCD 25.2.0 版本最低要求 Java 17，当前系统安装的是 Java 11
升级java
```bash
# 安装 OpenJDK 17（以 Alibaba Cloud Linux 3 为例）
sudo yum install java-17-openjdk-devel -y

# 切换默认 java 版本，选择java17作为默认版本
sudo alternatives --config java


java -version
# 显示版本是 17+
```
