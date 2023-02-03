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

server.close([callback])
停止服务器接受新连接并保持现有连接。 该函数是异步的，当所有连接都结束并且服务器触发 'close' 事件时，则服务器最终关闭。 一旦 'close' 事件发生，则可选的 callback 将被调用。 与该事件不同，如果服务器在关闭时未打开，它将以 Error 作为唯一参数被调用。?????

server.listen()
*当且仅当在第一次调用 server.listen() 期间出现错误或调用 server.close() 时，才能再次调用 server.listen() 方法。 否则，将抛出 ERR_SERVER_ALREADY_LISTEN 错误。*
监听时最常见的错误之一是 EADDRINUSE。 当另一个服务器已经在监听请求的 port/path/handle 时会发生这种情况。 处理此问题的方法之一是在一定时间后重试：
```
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});
```
server.maxConnections
设置此属性以在服务器的连接计数变高时拒绝连接。
*一旦套接字已发送给具有 child_process.fork() 的子进程，则不建议使用此选项。*

server.ref()
与 unref() 相反，如果它是唯一剩下的服务器（默认行为），则在以前的 unref 的服务器上调用 ref() 不会让程序退出。 如果服务器被 ref，则再次调用 ref() 将无效。

server.unref()
如果服务器是事件系统中唯一的活动服务器，则在服务器上调用 unref() 将允许程序退出。 如果服务器已经被 unref，则再次调用 unref() 将无效。

**net.Socket 类**
此类是 TCP 套接字或流式 IPC 端点（在 Windows 上使用命名管道，否则使用 Unix 域套接字）的抽象。 它也是 EventEmitter。
net.Socket 可以由用户创建并直接用于与服务器交互。
它也可以由 Node.js 创建并在接收到连接时传给用户。

'timeout' 事件
*如果套接字因不活动而超时则触发。 这只是通知套接字已空闲。 用户必须手动关闭连接。*























与该事件不同，如果服务器在关闭时未打开，它将以 Error 作为唯一参数被调用。?????