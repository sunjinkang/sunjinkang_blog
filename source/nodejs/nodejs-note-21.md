---
title: nodejs基础知识(11)
date: 2023-01-20 09:38:46
tags: [node, net 网络]
---

#### net 网络
node:net 模块在 Windows 上使用命名管道支持 IPC，在其他操作系统上则使用 Unix 域套接字。

在 Unix 上，本地域也称为 Unix 域。 路径是文件系统路径名。 它被截断为与操作系统相关的 sizeof(sockaddr_un.sun_path) - 1 长度。 典型的值为 Linux 上的 107 字节和 macOS 上的 103 字节。

在 Windows 上，本地域是使用命名管道实现的。 路径必须引用 \\?\pipe\ 或 \\.\pipe\ 中的条目。 
管道不会持续存在。 当对它们的最后一个引用关闭时，它们将被删除。 与 Unix 域套接字不同，Windows 将在拥有进程退出时关闭并删除管道。

JavaScript 字符串转义需要使用额外的反斜杠转义来指定路径，例如：
```
net.createServer().listen(path.join('\\\\?\\pipe', process.cwd(), 'myctl'));
```

**net.Server 类**
'drop' 事件
*当连接数达到 server.maxConnections 的阈值时，服务器将丢弃新的连接并触发 'drop' 事件。*

