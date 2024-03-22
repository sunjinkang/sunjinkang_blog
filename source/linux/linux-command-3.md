---
title: linux - 软件管理(2)-rpm
date: 2024-02-21 15:41:52
tags:
---

#### 什么是RPM？

RPM（Red Hat Package Manager）是一种常见且强大的二进制软件包管理工具，它以 .rpm 格式打包软件，并提供了一系列命令和工具来方便地安装、升级、查询和卸载软件包。

#### 常见命令及举例
1. 安装、卸载rpm软件包
安装命令：
> rpm -i [软件包名]
> rpm -ivh [软件包名]
-i 安装软件包
-v 显示详细输出
-h 显示安装进度
*根据需要，安装命令可能需要在前面加 sudo*
**注意：rpm安装包时，包名一定要完整**
[root@diagno opt]# rpm -i httpd
error: open of httpd failed: No such file or directory
使用 *rpm -ivh /路径/完整包名* 才能正常安装。
但是，使用yum时，直接使用 *yum install httpd* 即可安装，yum会自行解决包之间的依赖关系
**rpm安装一般不用，因为不能解决包之间的依赖关系**

卸载命令：
> rpm -e [软件包名]


2. 查询、验证rpm软件的相关信息
命令：
> rpm -q  [软件包名]	查询是否下载软件包（常用）
> rpm -qa [软件包名]	查询已下载的软件包的信息
> rpm -ql  [软件包名]	查询已下载的软件包的安装列表
> rpm -qc  [软件包名]	只想知道已下载软件包的配置文件
> rpm -qi  [软件包名]	查询下载软件包的基础信息

```sh
[root@diagno opt]# rpm -q httpd
httpd-2.4.6-99.el7.centos.1.x86_64
[root@diagno opt]# rpm -qa httpd
httpd-2.4.6-99.el7.centos.1.x86_64
[root@diagno opt]# rpm -ql httpd
/etc/httpd
/etc/httpd/conf
/etc/httpd/conf.d
/etc/httpd/conf.d/README
...
# 一堆安装列表文件
/var/www/html
[root@diagno opt]# rpm -qc httpd
/etc/httpd/conf.d/autoindex.conf
/etc/httpd/conf.d/userdir.conf
/etc/httpd/conf.d/welcome.conf
...
# 一堆配置文件
/etc/sysconfig/httpd
[root@diagno opt]# rpm -qi httpd
Name        : httpd
Version     : 2.4.6
Release     : 99.el7.centos.1
Architecture: x86_64
Install Date: 2024年03月18日 星期一 10时30分33秒
Group       : System Environment/Daemons
Size        : 9829328
License     : ASL 2.0
Signature   : RSA/SHA256, 2023年05月30日 星期二 23时15分45秒, Key ID 24c6a8a7f4a80eb5
Source RPM  : httpd-2.4.6-99.el7.centos.1.src.rpm
Build Date  : 2023年05月30日 星期二 22时02分56秒
Build Host  : x86-01.bsys.centos.org
Relocations : (not relocatable)
Packager    : CentOS BuildSystem <http://bugs.centos.org>
Vendor      : CentOS
URL         : http://httpd.apache.org/
Summary     : Apache HTTP Server
Description :
The Apache HTTP Server is a powerful, efficient, and extensible
web server.
```

#### RPM数据库信息
RPM数据库信息通常存储在一个或多个文件中，这些文件构成了RPM的存储系统。这些文件包括包信息文件（Package Database）、文件标签数据库（Tag Database）和文件属性数据库（File Attribute Database）。
在Linux系统中，RPM数据库通常位于 */var/lib/rpm* 目录下。其中：
- Basenames：包含所有已安装的文件基本名称。
- Conflictname：包含可能与其他包发生冲突的文件列表。
- Dirnames：包含所有已安装的目录名称。
- Group：包含所有已安装的包的组信息。
- Installtid：包含安装事务日志，记录了安装、升级和删除操作的详细信息。
- Name：包含所有已安装的软件包的名称。
- Obsoletename：包含已安装的软件包中已过时的文件列表。
- Packages：包含所有已安装的软件包的头信息和文件索引。
- Providename：包含已安装的软件包提供的功能列表。
- Requirename：包含已安装的软件包所需的文件列表。
- Shadow：包含已安装的软件包的阴影信息。
- Sigmd5：包含所有已安装软件包的MD5签名。
- Triggeruid：包含触发器的UID信息。
要查看RPM数据库信息，你可以使用rpm命令行工具。

> rpm -qa  查看所有已安装的软件包的列表
> rpm --rebuilddb  查看RPM数据库的完整性，将重建RPM数据库，并修复损坏的数据库文件

