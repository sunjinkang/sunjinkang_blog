---
title: service - 部署纯前端服务
date: 2025-05-12 20:18:30
tags: [服务器, 部署, 纯前端]
---

以下内容以阿里云服务器进行操作

## 安装nginx

```bash
sudo apt update
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 重启命令
sudo systemctl restart nginx

```

## 上传前端资源
1. 将前端资源文件上传到nginx的默认根目录，以下以博客文件为例进行说明，博客文件夹为public
```bash
# 删除 Nginx 默认测试页（可选）
sudo rm -rf /usr/share/nginx/html/*

# 将 public 文件夹内所有内容复制到 Nginx 根目录
sudo cp -r ~/public/* /usr/share/nginx/html/

# 若 public 文件夹位于其他路径，替换 `~/public` 为实际路径，例如：
# sudo cp -r /home/your_username/public/* /usr/share/nginx/html/
```

2. 设置文件权限
```bash
sudo chown -R nginx:nginx /usr/share/nginx/html
sudo chmod -R 755 /usr/share/nginx/html
```

3. 配置nginx服务器
编辑默认配置文件 `/etc/nginx/conf.d/default.conf`：
```bash
sudo vim /etc/nginx/conf.d/default.conf
```
*注意：修改默认配置文件这里出现了问题，具体可以查看下面的错误处理*

修改 server 块中的 root 路径和 index（若使用单页应用需配置 try_files）
```nginx
server {
    listen       80;
    server_name  localhost;

    # 根目录指向 Nginx 默认路径（已确认无需修改）
    root   /usr/share/nginx/html;
    index  index.html index.htm;

    # 单页应用（如 Vue/React）需添加以下规则
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 其他配置（如代理 API 请求）
    # location /api {
    #     proxy_pass http://backend_ip:port;
    # }
}
```

1.  检查配置并重启 Nginx
```bash
# 检查配置语法
sudo nginx -t

# 重启 Nginx 生效
sudo systemctl restart nginx
```


## 错误处理
- 安装nginx报错：sudo: apt: command not found
原因：服务器操作系统 不是基于 Debian/Ubuntu 的发行版（如 CentOS、AlmaLinux、Rocky Linux 等），因此无法使用 apt 包管理工具。
解决步骤：
  - 查看系统信息
```bash
cat /etc/os-release
# NAME="Alibaba Cloud Linux"
# VERSION="3 (OpenAnolis Edition)"
# ID="alinux"
# ID_LIKE="rhel fedora centos anolis"
# VERSION_ID="3"
# VARIANT="OpenAnolis Edition"
# VARIANT_ID="openanolis"
# ALINUX_MINOR_ID="2104"
# ALINUX_UPDATE_ID="11"
# PLATFORM_ID="platform:al8"
# PRETTY_NAME="Alibaba Cloud Linux 3.2104 U11 (OpenAnolis Edition)"
# ANSI_COLOR="0;31"
# HOME_URL="https://www.aliyun.com/"

# 或

cat /etc/redhat-release
# Alibaba Cloud Linux release 3 (OpenAnolis Edition)
```
  - 根据不同操作系统安装nginx
```bash
# (1) 安装 EPEL 仓库（Nginx 在 EPEL 中）
sudo yum install epel-release

# (2) 安装 Nginx
sudo yum install nginx

# (3) 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx
```

- 安装过程中报错：
```bash
Last metadata expiration check: 0:13:18 ago on Wed 21 May 2025 06:59:54 PM CST.
Error: 
 Problem: problem with installed package epel-aliyuncs-release-8-15.1.al8.noarch
  - package epel-aliyuncs-release-8-15.1.al8.noarch from @System conflicts with epel-release provided by epel-release-8-22.el8.noarch from epel
  - package epel-aliyuncs-release-8-15.1.al8.noarch from alinux3-updates conflicts with epel-release provided by epel-release-8-22.el8.noarch from epel
  - conflicting requests
(try to add '--allowerasing' to command line to replace conflicting packages or '--skip-broken' to skip uninstallable packages or '--nobest' to use not only best candidate packages)
```
错误原因：系统已经安装了来自阿里云源 (alinux3-updates) 的 epel-aliyuncs-release 包，与官方 epel-release 存在冲突
解决步骤：
  - 使用 --allowerasing 强制替换冲突包
```bash
sudo yum install epel-release --allowerasing
```
注意：执行时会提示你确认替换操作（旧包 epel-aliyuncs-release 将被移除），输入 y 确认即可

  - 验证 EPEL 仓库是否启用
```bash
yum repolist | grep epel
# 正常输出
# epel                          Extra Packages for Enterprise Linux 8 - x86_64
```

  - 安装 Nginx
```bash
sudo yum install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

- 前端文件上传并修改配置，重启nginx后，访问页面失败：Failed to load resource: the server responded with a status of 502 ()
原因：多个地方添加了nginx配置，导致解析失败
解决步骤：
- 确认有哪些导致的原因
  - 服务器安全组的入向规则是否修改，允许80端口及所有ip可访问
    - 查看后发现未修改规则，登录阿里云控制台修改了规则
  - 是否开启了防火墙
    - 查看后未开启防火墙
```bash
# 查看防火墙状态
sudo systemctl status firewalld

# 若防火墙启用，放行 80 端口
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --reload

# 结果为 FirewallD is not running
```
  - 确认nginx是否监听了80端口
```bash
sudo netstat -tuln | grep 80

# 正常输出
tcp   0   0 0.0.0.0:80    0.0.0.0:*    LISTEN
```
  - 验证nginx配置文件是否正确
```bash
sudo nginx -t
# 输出 syntax is ok 和 test is successful，说明配置无语法错误
```
  - 查看错误日志
```bash
sudo tail -f /var/log/nginx/error.log

# 输出
2025/05/22 10:03:52 [warn] 15384#0: conflicting server name "_" on 0.0.0.0:80, ignored
2025/05/22 10:03:52 [warn] 15387#0: conflicting server name "_" on 0.0.0.0:80, ignored
2025/05/22 10:19:28 [warn] 15914#0: conflicting server name "_" on 0.0.0.0:80, ignored
```
根据日志中的警告信息 conflicting server name "_" on 0.0.0.0:80, ignored，说明你的 Nginx 配置中存在 多个 server 块监听同一端口（80）和地址（0.0.0.0），导致 Nginx 无法确定使用哪个配置，从而忽略部分配置。

根据以上确认存在多个server块监听同一端口，且`/etc/nginx/conf.d/default.conf`配置文件中仅存在一处，查看其他地方是否还存在server监听代码

  - 查看nginx配置文件`/etc/nginx/nginx.conf`
```bash
# For more information on configuration, see:
#   * Official English Documentation: http://nginx.org/en/docs/
#   * Official Russian Documentation: http://nginx.org/ru/docs/

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 4096;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    server {
        listen       80;
        listen       [::]:80;
        server_name  _;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

# Settings for a TLS enabled server.
#
#    server {
#        listen       443 ssl http2;
#        listen       [::]:443 ssl http2;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers PROFILE=SYSTEM;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }

}
```
确认：主配置文件中已经定义了监听 80 端口的 server 块，同时 `/etc/nginx/conf.d/default.conf` 中也存在重复的 server 块，导致 Nginx 配置冲突，引发 502 错误。

修复步骤如下：将`/etc/nginx/nginx.conf`中server块注释，修改`/etc/nginx/conf.d/default.conf`中server块代码
```bash
server {
    listen       80;
    server_name  _;
    root         /usr/share/nginx/html;
    index        index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```
重启nginx
```bash
# 检查配置语法
sudo nginx -t

# 重启服务
sudo systemctl restart nginx
```
重启后页面可以正常访问，问题解决！