---
title: nodejs基础知识(11)
date: 2023-01-25 18:45:46
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
**Windows 与 POSIX 的对比**
node:path 模块的默认操作因运行 Node.js 应用程序的操作系统而异。 具体来说，当在 Windows 操作系统上运行时，node:path 模块将假定正在使用 Windows 风格的路径。

因此，在 POSIX 和 Windows 上使用 path.basename() 可能会产生不同的结果：
- 在 POSIX 上：
```
path.basename('C:\\temp\\myfile.html');
// 返回: 'C:\\temp\\myfile.html'
```
- 在 Windows 上：
```
path.basename('C:\\temp\\myfile.html');
// 返回: 'myfile.html'
```
**当使用 Windows 文件路径时，若要在任何操作系统上获得一致的结果，则使用 path.win32**
- 在 POSIX 和 Windows 上：
```
path.win32.basename('C:\\temp\\myfile.html');
// 返回: 'myfile.html'
```
**当使用 POSIX 文件路径时，若要在任何操作系统上获得一致的结果，则使用 path.posix**
- 在 POSIX 和 Windows 上：
```
path.posix.basename('/tmp/myfile.html');
// 返回: 'myfile.html'
```
**在 Windows 上，Node.js 遵循独立驱动器工作目录的概念。 当使用不带反斜杠的驱动器路径时，可以观察到此行为。 例如，path.resolve('C:\\') 可能返回与 path.resolve('C:') 不同的结果。**

path.basename(path[, ext])
path.basename() 方法返回 path 的最后一部分，类似于 Unix basename 命令。 尾随的目录分隔符被忽略，见 path.sep。
```
path.basename('/foo/bar/baz/asdf/quux.html');
// 返回: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 返回: 'quux'
```
**尽管 Windows 通常以不区分大小写的方式处理文件名（包括文件扩展名），但此函数不会。**
例如，C:\\foo.html 和 C:\\foo.HTML 指的是同一个文件，但 basename 将扩展名视为区分大小写的字符串：
```
path.win32.basename('C:\\foo.html', '.html');
// 返回: 'foo'

path.win32.basename('C:\\foo.HTML', '.html');
// 返回: 'foo.HTML'
```
如果 path 不是字符串，或者如果给定 ext 并且不是字符串，则抛出 TypeError。

path.delimiter
提供特定于平台的路径定界符：
- ; 用于 Windows
- : 用于 POSIX
例如，在 POSIX 上：
```
console.log(process.env.PATH);
// 打印: '/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin'

process.env.PATH.split(path.delimiter);
// 返回: ['/usr/bin', '/bin', '/usr/sbin', '/sbin', '/usr/local/bin']
<!-- 在 Windows 上： -->

console.log(process.env.PATH);
// 打印: 'C:\Windows\system32;C:\Windows;C:\Program Files\node\'

process.env.PATH.split(path.delimiter);
// 返回: ['C:\\Windows\\system32', 'C:\\Windows', 'C:\\Program Files\\node\\']
```
path.dirname(path)
path.dirname() 方法返回 path 的目录名，类似于 Unix dirname 命令。 尾随的目录分隔符被忽略，见 path.sep。
```
path.dirname('/foo/bar/baz/asdf/quux');
// 返回: '/foo/bar/baz/asdf'
```
如果 path 不是字符串，则抛出 TypeError。

path.extname(path)
path.extname() 方法返回 path 的扩展名，即 path 的最后一部分中从最后一次出现的 .（句点）字符到字符串的结尾。 如果 path 的最后一部分中没有 .，或者除了 path 的基本名称（参见 path.basename()）的第一个字符之外没有 . 个字符，则返回空字符串。
```
path.extname('index.html');
// 返回: '.html'

path.extname('index.coffee.md');
// 返回: '.md'

path.extname('index.');
// 返回: '.'

path.extname('index');
// 返回: ''

path.extname('.index');
// 返回: ''

path.extname('.index.md');
// 返回: '.md'
```
如果 path 不是字符串，则抛出 TypeError。

path.format(pathObject)
pathObject <Object> 任何具有以下属性的 JavaScript 对象：
- dir <string>
- root <string>
- base <string>
- name <string>
- ext <string>
**path.format() 方法从对象返回路径字符串。 这与 path.parse() 相反。**

当向 pathObject 提供属性时，存在一个属性优先于另一个属性的组合：
*如果提供 pathObject.dir，则忽略 pathObject.root*
*如果 pathObject.base 存在，则忽略 pathObject.ext 和 pathObject.name*
例如，在 POSIX 上：
```javascript
// 如果提供 `dir`、`root` 和 `base`，
// 则将返回 `${dir}${path.sep}${base}`。
// `root` 将被忽略。
path.format({
  root: '/ignored',
  dir: '/home/user/dir',
  base: 'file.txt'
});
// 返回: '/home/user/dir/file.txt'

// 如果未指定 `dir`，则将使用 `root`。
// 如果仅提供 `root` 或 `dir` 等于 `root`，则将不包括平台分隔符。
// `ext` 将被忽略。
path.format({
  root: '/',
  base: 'file.txt',
  ext: 'ignored'
});
// 返回: '/file.txt'

// 如果未指定 `base`，则将使用 `name` + `ext`。
path.format({
  root: '/',
  name: 'file',
  ext: '.txt'
});
// 返回: '/file.txt'
```
在 Windows 上：
```javascript
path.format({
  dir: 'C:\\path\\dir',
  base: 'file.txt'
});
// 返回: 'C:\\path\\dir\\file.txt'
```

path.isAbsolute(path)
path.isAbsolute() 方法确定 path 是否为绝对路径。
*如果给定的 path 是零长度字符串，则将返回 false。*
例如，在 POSIX 上：
```javascript
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('/baz/..');  // true
path.isAbsolute('qux/');     // false
path.isAbsolute('.');        // false
```
在 Windows 上：
```javascript
path.isAbsolute('//server');    // true
path.isAbsolute('\\\\server');  // true
path.isAbsolute('C:/foo/..');   // true
path.isAbsolute('C:\\foo\\..'); // true
path.isAbsolute('bar\\baz');    // false
path.isAbsolute('bar/baz');     // false
path.isAbsolute('.');           // false
```
如果 path 不是字符串，则抛出 TypeError。

path.join([...paths])
...paths <string> 路径片段的序列
返回: <string>
*path.join() 方法使用特定于平台的分隔符作为定界符将所有给定的 path 片段连接在一起，然后规范化生成的路径。*
*零长度的 path 片段被忽略。 如果连接的路径字符串是零长度字符串，则将返回 '.'，表示当前工作目录。*
```
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'
```
如果任何路径片段不是字符串，则抛出 TypeError。

path.normalize(path)
path.normalize() 方法规范化给定的 path，解析 '..' 和 '.' 片段。
*当找到多个连续的路径片段分隔符（例如 POSIX 上的 / 和 Windows 上的 \ 或 /）时，则它们将被平台特定路径片段分隔符（POSIX 上的 / 和 Windows 上的 \）的单个实例替换。 保留尾随的分隔符。*
如果 path 是零长度字符串，则返回 '.'，表示当前工作目录。
```javascript
<!-- 例如，在 POSIX 上： -->
path.normalize('/foo/bar//baz/asdf/quux/..');
// 返回: '/foo/bar/baz/asdf'
<!-- 在 Windows 上： -->
path.normalize('C:\\temp\\\\foo\\bar\\..\\');
// 返回: 'C:\\temp\\foo\\'
<!-- 由于 Windows 识别多个路径分隔符，两个分隔符都将被 Windows 首选分隔符 (\) 的实例替换： -->

path.win32.normalize('C:////temp\\\\/\\/\\/foo/bar');
// 返回: 'C:\\temp\\foo\\bar'
```
如果 path 不是字符串，则抛出 TypeError。

path.parse(path)
path.parse() 方法返回一个对象，其属性表示 path 的重要元素。 尾随的目录分隔符被忽略，见 path.sep。

返回的对象将具有以下属性：
- dir <string>
- root <string>
- base <string>
- name <string>
- ext <string>
```
<!-- 例如，在 POSIX 上： -->

path.parse('/home/user/dir/file.txt');
// 返回:
// { root: '/',
//   dir: '/home/user/dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
"  /    home/user/dir / file  .txt "
└──────┴──────────────┴──────┴─────┘
("" 行中的所有空格都应被忽略。它们纯粹是为了格式化。)
<!-- 在 Windows 上： -->

path.parse('C:\\path\\dir\\file.txt');
// 返回:
// { root: 'C:\\',
//   dir: 'C:\\path\\dir',
//   base: 'file.txt',
//   ext: '.txt',
//   name: 'file' }
┌─────────────────────┬────────────┐
│          dir        │    base    │
├──────┬              ├──────┬─────┤
│ root │              │ name │ ext │
" C:\      path\dir   \ file  .txt "
└──────┴──────────────┴──────┴─────┘
("" 行中的所有空格都应被忽略。它们纯粹是为了格式化。)
```
如果 path 不是字符串，则抛出 TypeError。

path.posix
path.posix 属性提供对 path 方法的 POSIX 特定实现的访问。
*API 可通过 require('node:path').posix 或 require('node:path/posix') 访问。*

path.relative(from, to)
*path.relative() 方法根据当前工作目录返回从 from 到 to 的相对路径。 如果 from 和 to 都解析为相同的路径（在分别调用 path.resolve() 之后），则返回零长度字符串。*
*如果零长度字符串作为 from 或 to 传入，则将使用当前工作目录而不是零长度字符串。*
```
<!-- 例如，在 POSIX 上： -->

path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// 返回: '../../impl/bbb'
<!-- 在 Windows 上： -->

path.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb');
// 返回: '..\\..\\impl\\bbb'
```
如果 from 或 to 不是字符串，则抛出 TypeError。

path.resolve([...paths])
path.resolve() 方法将路径或路径片段的序列解析为绝对路径。
**给定的路径序列从右到左处理，每个后续的 path 会被追加到前面，直到构建绝对路径。 例如，给定路径片段的序列：/foo、/bar、baz，调用 path.resolve('/foo', '/bar', 'baz') 将返回 /bar/baz，因为 'baz' 不是绝对路径，而 '/bar' + '/' + 'baz' 是。**
*如果在处理完所有给定的 path 片段之后，还没有生成绝对路径，则使用当前工作目录。*
生成的路径被规范化，并删除尾部斜杠（除非路径解析为根目录）。
零长度的 path 片段被忽略。
*如果没有传入 path 片段，则 path.resolve() 将返回当前工作目录的绝对路径。*
```
path.resolve('/foo/bar', './baz');
// 返回: '/foo/bar/baz'

path.resolve('/foo/bar', '/tmp/file/');
// 返回: '/tmp/file'

path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// 如果当前工作目录是 /home/myself/node，
// 则返回 '/home/myself/node/wwwroot/static_files/gif/image.gif'
```
如果任何参数不是字符串，则抛出 TypeError。

path.sep
提供特定于平台的路径片段分隔符：
- Windows 上是 \
- POSIX 上是 /
```
例如，在 POSIX 上：

'foo/bar/baz'.split(path.sep);
// 返回: ['foo', 'bar', 'baz']
在 Windows 上：

'foo\\bar\\baz'.split(path.sep);
// 返回: ['foo', 'bar', 'baz']
```
在 Windows 上，正斜杠 (/) 和反斜杠 (\) 都被接受作为路径片段分隔符；但是，path 方法只添加反斜杠 (\)。

path.toNamespacedPath(path)
仅在 Windows 系统上，返回给定 path 的等效命名空间前缀路径。 如果 path 不是字符串，则 path 将不加修改地返回。
此方法仅在 Windows 系统上有意义。 在 POSIX 系统上，该方法是不可操作的，并且始终返回 path 而不进行修改。

path.win32
path.win32 属性提供对 path 方法的 Windows 特定实现的访问。
API 可通过 require('node:path').win32 或 require('node:path/win32') 访问。