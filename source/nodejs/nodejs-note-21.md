---
title: nodejs基础知识(11)
date: 2023-01-20 09:38:46
tags: [node, net 网络, os 操作系统, path 路径]
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

socket.end([data[, encoding]][, callback])
- data <string> | <Buffer> | <Uint8Array>
- encoding <string> 仅当数据为 string 时使用。 默认值: 'utf8'。
- callback <Function> 套接字完成时的可选回调。
半关闭套接字。 即，它发送一个 FIN 数据包。 服务器可能仍会发送一些数据。

socket.pause()
暂停读取数据。 也就是说，不会触发 'data' 事件。 用于限制上传。

socket.pending
如果套接字尚未连接，则为 true，要么是因为 .connect() 尚未被调用，要么是因为它仍在连接过程中

socket.resume()
调用 socket.pause() 后继续读取。

socket.setNoDelay([noDelay])
- noDelay <boolean> 默认值: true
启用/禁用 Nagle 算法的使用。
创建 TCP 连接时，它将启用 Nagle 算法。
Nagle 的算法在数据通过网络发送之前延迟数据。 它试图以延迟为代价来优化吞吐量。
为 noDelay 传入 true 或不传入参数将禁用套接字的 Nagle 算法。 为 noDelay 传入 false 将启用 Nagle 的算法。

socket.setTimeout(timeout[, callback])
- timeout <number>
- callback <Function>
将套接字设置为在套接字上 timeout 毫秒不活动后超时。 默认情况下 net.Socket 没有超时。
当空闲超时被触发时，套接字将收到 'timeout' 事件，但连接不会被切断。 用户必须手动调用 socket.end() 或 socket.destroy() 才能结束连接。

socket.readyState
此属性将连接状态表示为字符串。
- 如果流正在连接，则 socket.readyState 是 opening。
- 如果流可读可写，则为 open。
- 如果流可读不可写，则为 readOnly。
- 如果流不可读写，则为 writeOnly。

net.connect()
- net.createConnection() 的别名。

net.createConnection()
- 工厂函数，其创建新的 net.Socket，并立即使用 socket.connect() 发起连接，然后返回启动连接的 net.Socket。
- 建立连接后，将在返回的套接字上触发 'connect' 事件。 最后一个参数 connectListener（如果提供）将作为 'connect' 事件的监听器添加一次。

net.createConnection(path[, connectListener])
- 发起 IPC 连接

net.createConnection(port[, host][, connectListener])
- 发起 TCP 连接

net.createServer([options][, connectionListener])
- 如果 allowHalfOpen 设置为 true，则当套接字的另一端发出传输结束信号时，服务器仅在显式调用 socket.end() 时才发回传输结束。 例如，在 TCP 上下文中，当接收到 FIN 数据包时，只有在显式调用 socket.end() 时才会发送回 FIN 数据包。 在此之前，连接是半关闭的（不可读但仍可写）。
- 如果 pauseOnConnect 设置为 true，则与每个传入连接关联的套接字将被暂停，并且不会从其句柄读取数据。 这允许在进程之间传递连接，而原始进程不会读取任何数据。 要开始从暂停的套接字读取数据，则调用 socket.resume()。

net.isIP(input)
- 如果 input 是 IPv6 地址，则返回 6。 如果 input 是点十进制表示法中没有前导零的 IPv4 地址，则返回 4。 否则，返回 0。

net.isIPv4(input)
- 如果 input 是点十进制表示法中没有前导零的 IPv4 地址，则返回 true。 否则，返回 false。

net.isIPv6(input)
- 如果 input 是 IPv6 地址，则返回 true。 否则，返回 false。

#### os 操作系统

os.EOL
- 操作系统特定的行尾标记。
POSIX 上是 \n
Windows 上是 \r\n

os.arch()
返回为其编译 Node.js 二进制文件的操作系统 CPU 架构。 可能的值为 'arm'、'arm64'、'ia32'、'mips'、'mipsel'、'ppc'、'ppc64'、's390'、's390x'、以及 'x64'。
*返回值相当于 process.arch*

os.constants
包含用于错误码、进程信号等的常用操作系统特定常量。 定义的特定常量在操作系统常量中描述。

os.cpus()
返回包含有关每个逻辑 CPU 内核的信息的对象数组。
每个对象上包含的属性包括：
- model <string>
- speed <number> （以兆赫为单位）
- times <Object>
  - user <number> CPU 在用户模式下花费的毫秒数。
  - nice <number> CPU 在良好模式下花费的毫秒数。
  - sys <number> CPU 在系统模式下花费的毫秒数。
  - idle <number> CPU 在空闲模式下花费的毫秒数。
  - irq <number> CPU 在中断请求模式下花费的毫秒数。
*nice 值仅适用于 POSIX。 在 Windows 上，所有处理器的 nice 值始终为 0。*

os.devNull
空设备的特定于平台的文件路径。
Windows 上是 \\.\nul
POSIX 上是 /dev/null

os.endianness()
返回标识为其编译 Node.js 二进制文件的 CPU 的字节序的字符串。
可能的值是大端序的 'BE' 和小端序的 'LE'。

os.freemem()
以整数形式返回空闲的系统内存量（以字节为单位）。

os.homedir()
返回当前用户的主目录的字符串路径。
- 在 POSIX 上，它使用 $HOME 环境变量（如果已定义）。 否则，它使用有效的 UID 来查找用户的主目录。
- 在 Windows 上，它使用 USERPROFILE 环境变量（如果已定义）。 否则，它使用当前用户的配置文件目录的路径。

os.loadavg()
返回包含 1、5 和 15 分钟平均负载的数组。
平均负载是操作系统计算的系统活动量度，并表示为小数。
平均负载是 Unix 特有的概念。 在 Windows 上，返回值始终为 [0, 0, 0]。

os.networkInterfaces()
返回包含已分配网络地址的网络接口的对象。
返回对象上的每个键都标识一个网络接口。 关联的值是每个对象描述一个分配的网络地址的对象数组。
分配的网络地址对象上可用的属性包括：
- address <string> 分配的 IPv4 或 IPv6 地址
- netmask <string> IPv4 或 IPv6 网络掩码
- family <string> IPv4 或 IPv6
- mac <string> 网络接口的 MAC 地址
- internal <boolean> 如果网络接口是不能远程访问的环回或类似接口，则为 true；否则为 false
- scopeid <number> 数字的 IPv6 范围 ID（仅在 family 为 IPv6 时指定）
- cidr <string> 使用 CIDR 表示法的路由前缀分配的 IPv4 或 IPv6 地址。 如果 netmask 无效，则此属性设置为 null。

os.platform()
返回标识为其编译 Node.js 二进制文件的操作系统平台的字符串。 该值在编译时设置。 可能的值为 'aix'、'darwin'、'freebsd'、'linux'、'openbsd'、'sunos'、以及 'win32'。
*返回值相当于 process.platform。*
*如果 Node.js 是在安卓操作系统上构建的，则也可能返回值 'android'。 安卓支持是实验的。*

os.release()
以字符串形式返回操作系统。
在 POSIX 系统上，操作系统版本是通过调用 uname(3) 来确定的。 在 Windows 上，使用 GetVersionExW()。 

os.setPriority([pid, ]priority)
- pid <integer> 要为其设置调度优先级的进程 ID。 默认值: 0。
- priority <integer> 分配给进程的调度优先级。
尝试为 pid 指定的进程设置调度优先级。 如果未提供 pid 或为 0，则使用当前进程的进程 ID。
priority 输入必须是 -20（高优先级）和 19（低优先级）之间的整数。 由于 Unix 优先级和 Windows 优先级之间的差异，priority 映射到 os.constants.priority 中的六个优先级常量之一。 当检索进程优先级时，此范围映射可能会导致返回值在 Windows 上略有不同。 为避免混淆，请将 priority 设置为优先级常量之一。
*在 Windows 上，将优先级设置为 PRIORITY_HIGHEST 需要提升用户权限。 否则设置的优先级将被静默地降低到 PRIORITY_HIGH。*

os.tmpdir()
以字符串形式返回操作系统默认的临时文件的目录。

os.totalmem()
以整数形式返回系统内存总量（以字节为单位）。

os.type()
返回 uname(3) 返回的操作系统名称。 例如，它在 Linux 上返回 'Linux'，在 macOS 上返回 'Darwin'，在 Windows 上返回 'Windows_NT'。

s.userInfo([options])
- options <Object>
encoding <string> 用于解释结果字符串的字符编码。 如果 encoding 设置为 'buffer'，则 username、shell 和 homedir 的值将是 Buffer 实例。 默认值: 'utf8'。
返回有关当前有效用户的信息。 在 POSIX 平台上，这通常是密码文件的子集。 返回的对象包括 username、uid、gid、shell 和 homedir。 在 Windows 上，uid 和 gid 字段是 -1，而 shell 是 null。
os.userInfo() 返回的 homedir 的值由操作系统提供。 这与 os.homedir() 的结果不同，后者在回退到操作系统响应之前查询主目录的环境变量。
如果用户没有 username 或 homedir，则抛出 SystemError。

#### path 路径
