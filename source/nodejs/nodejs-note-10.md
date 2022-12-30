---
title: nodejs基础知识(3)
date: 2022-12-29 11:32:45
tags: [node, child_process - 子进程]
---

child_process 模块提供了衍生子进程的功能，它与 [popen(3)](https://man7.org/linux/man-pages/man3/popen.3.html) 类似，但不完全相同。 这个功能主要由 [child_process.spawn()] 函数提供
```nodejs
const { spawn } = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`输出：${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`错误：${data}`);
});

ls.on('close', (code) => {
  console.log(`子进程退出码：${code}`);
});
```
默认情况下，Node.js 的父进程与衍生的子进程之间会建立 stdin、stdout 和 stderr 的管道。 数据能以非阻塞的方式在管道中流通。 有些程序会在内部使用行缓冲 I/O，虽然这并不影响 Node.js，但发送到子进程的数据可能无法被立即使用。

- [child_process.spawn()] 函数会异步地衍生子进程，且不会阻塞 Node.js 事件循环。 
- [child_process.spawnSync()] 函数则以同步的方式提供同样的功能，但会阻塞事件循环，直到衍生的子进程退出或被终止。
- [child_process.exec()]: 衍生一个 shell 并在 shell 上运行命令，当完成时会传入 stdout 和 stderr 到回调函数。
- [child_process.execFile()]: 类似 [child_process.exec()]，但直接衍生命令，且无需先衍生 shell。
- [child_process.fork()]: 衍生一个新的 Node.js 进程，并通过建立 IPC 通讯通道来调用指定的模块，该通道允许父进程与子进程之间相互发送信息。
- [child_process.execSync()]: [child_process.exec()] 的同步函数，会阻塞 Node.js 事件循环。
- [child_process.execFileSync()]: [child_process.execFile()] 的同步函数，会阻塞 Node.js 事件循环。

*注：后续函数都是基于 [child_process.spawn()] 或 [child_process.spawnSync()] 实现的。*

**创建异步进程**
[child_process.spawn()]、[child_process.fork()]、[child_process.exec()] 和 [child_process.execFile()] 函数都遵循 Node.js API 惯用的异步编程模式。

每个函数都返回 [ChildProcess] 实例。 这些实例实现了 Node.js [EventEmitter] API，允许父进程注册监听器函数，在子进程生命周期期间，当特定的事件发生时会调用这些函数。

[child_process.exec()] 和 [child_process.execFile()] 函数可以额外指定一个可选的 callback 函数，当子进程结束时会被调用。

**在 Windows 上衍生 .bat 和 .cmd 文件**
[child_process.exec()] 和 [child_process.execFile()] 之间的区别会因平台而不同。 在类 Unix 操作系统（Unix、 Linux、 macOS）上，[child_process.execFile()] 效率更高，因为它不需要衍生 shell。 但在 Windows 上，.bat 和 .cmd 文件在没有终端的情况下是不可执行的，因此不能使用 [child_process.execFile()] 启动。 可以使用设置了 shell 选项的 [child_process.spawn()]、或使用 [child_process.exec()]、或衍生 cmd.exe 并将 .bat 或 .cmd 文件作为参数传入（也就是 shell 选项和 [child_process.exec()] 所做的工作）。 如果脚本文件名包含空格，则需要加上引号。
```
// 仅限 Windows 系统
const { spawn } = require('child_process');
const bat = spawn('cmd.exe', ['/c', 'my.bat']);

bat.stdout.on('data', (data) => {
  console.log(data.toString());
});

bat.stderr.on('data', (data) => {
  console.log(data.toString());
});

bat.on('exit', (code) => {
  console.log(`子进程退出码：${code}`);
});

// 或
const { exec } = require('child_process');
exec('my.bat', (err, stdout, stderr) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log(stdout);
});

// 文件名带有空格的脚本：
const bat = spawn('"my script.cmd"', ['a', 'b'], { shell: true });
// 或：
exec('"my script.cmd" a b', (err, stdout, stderr) => {
  // ...
});
```

**child_process.exec(command[, options][, callback])**
- command <string> 运行的命令，参数使用空格分隔。
- options <Object>
 - cwd <string> 子进程的当前工作目录。
 - env <Object> 环境变量键值对。
 - encoding <string> 默认为 'utf8'。
 - shell <string> 执行命令的 shell。在 UNIX 上默认为 '/bin/sh'，在 Windows 上默认为 process.env.ComSpec。详见Shell的要求与Windows默认的Shell。
 - timeout <number> 默认为 0。
 - maxBuffer <number> stdout 或 stderr 允许的最大字节数。默认为 200*1024。如果超过限制，则子进程会被终止。详见 maxBuffer与Unicode。
 - killSignal <string> | <integer> 默认为 'SIGTERM'。
 - uid <number> 设置进程的用户标识，详见 setuid(2)。
 - gid <number> 设置进程的组标识，详见 setgid(2)。
 - windowsHide <boolean> 隐藏子进程的控制台窗口，常用于 Windows 系统。默认为 false。
- callback <Function> 进程终止时调用。
 - error <Error>
 - stdout <string> | <Buffer>
 - stderr <string> | <Buffer>
返回: <ChildProcess>

衍生一个 shell 并在 shell 中执行 command，且缓冲任何产生的输出。 传入函数的 command 字符串会被 shell 直接处理，特殊字符（因shell而异）需要相应处理：
```
exec('"/path/to/test file/test.sh" arg1 arg2');
// 使用双引号使路径中的空格不会被理解为多个参数。

exec('echo "The \\$HOME variable is $HOME"');
// 第一个 $HOME 会被转义，而第二个不会。
```

注意：不要把未经检查的用户输入传入到该函数。 任何包括 shell 元字符的输入都可被用于触发任何命令的执行。
```
const { exec } = require('child_process');
exec('cat *.js bad_file | wc -l', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
```

如果提供了一个 callback 函数，则它被调用时会带上参数 (error, stdout, stderr)。 当成功时，error 会是 null。 当失败时，error 会是一个 [Error] 实例。 error.code 属性会是子进程的退出码，error.signal 会被设为终止进程的信号。 除 0 以外的任何退出码都被认为是一个错误。

传给回调的 stdout 和 stderr 参数会包含子进程的 stdout 和 stderr 的输出。 默认情况下，Node.js 会解码输出为 UTF-8，并将字符串传给回调。 encoding 选项可用于指定用于解码 stdout 和 stderr 输出的字符编码。 如果 encoding 是 'buffer'、或一个无法识别的字符编码，则传入 Buffer 对象到回调函数。

options 参数可以作为第二个参数传入，用于自定义如何衍生进程。

如果 timeout 大于 0，当子进程运行超过 timeout 毫秒时，父进程就会发送由 killSignal 属性标识的信号（默认为 'SIGTERM'）。

如果调用该方法的 [util.promisify()][] 版本，将会返回一个包含 stdout 和 stderr 的 Promise 对象。在出现错误的情况下，将返回 rejected 状态的 promise，拥有与回调函数一样的 error 对象，但附加了 stdout 和 stderr 属性。
```
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function lsExample() {
  const { stdout, stderr } = await exec('ls');
  console.log('stdout:', stdout);
  console.log('stderr:', stderr);
}
lsExample();
```

**child_process.execFile(file[, args][, options][, callback])**
- file <string> 要运行的可执行文件的名称或路径。
- args <string[]> 字符串参数列表。
- options <Object>
  - cwd <string> 子进程的当前工作目录。
  - env <Object> 环境变量键值对。
  - encoding <string> 默认为 'utf8'。
  - timeout <number> 默认为 0。
  - maxBuffer <number> stdout 或 stderr 允许的最大字节数。 默认为 200*1024。 如果超过限制，则子进程会被终止。 
  - killSignal <string> | <integer> 默认为 'SIGTERM'。
  - uid <number> 设置该进程的用户标识。（详见 setuid(2)）
  - gid <number> 设置该进程的组标识。（详见 setgid(2)）
  - windowsHide <boolean> 是否隐藏在Windows系统下默认会弹出的子进程控制台窗口。 默认为: false。
  - windowsVerbatimArguments <boolean> 决定在Windows系统下是否使用转义参数。 在Linux平台下会自动忽略，当指令 shell 存在的时该属性将自动被设置为true。默认为: false。
- callback <Function> 当进程终止时调用，并带上输出。
  - error <Error>
  - stdout <string> | <Buffer>
  - stderr <string> | <Buffer>
返回: <ChildProcess>
child_process.execFile() 函数类似 [child_process.exec()]，除了不衍生一个 shell。 而是，指定的可执行的 file 被直接衍生为一个新进程，这使得它比 [child_process.exec()] 更高效。

它支持和 [child_process.exec()] 一样的选项。 由于没有衍生 shell，因此不支持像 I/O 重定向和文件查找这样的行为。
```
const { execFile } = require('child_process');
const child = execFile('node', ['--version'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

**child_process.fork(modulePath[, args][, options])**
- modulePath <string> 要在子进程中运行的模块。
- args <Array> 字符串参数列表。
- options <Object>
  - cwd <string> 子进程的当前工作目录。
  - env <Object> 环境变量键值对。
  - execPath <string> 用来创建子进程的执行路径。
  - execArgv <Array> 要传给执行路径的字符串参数列表。默认为 process.execArgv。
  - silent <boolean> 如果为 true，则子进程中的 stdin、 stdout 和 stderr 会被导流到父进程中，否则它们会继承自父进程，详见 [child_process.spawn()] 的 [stdio] 中的 'pipe' 和 'inherit' 选项。 默认: false。
  - stdio <Array> | <string> 详见 [child_process.spawn()] 的 [stdio]。 当提供了该选项，则它会覆盖 silent。 如果使用了数组变量，则该数组必须包含一个值为 'ipc' 的子项，否则会抛出错误。 例如 [0, 1, 2, 'ipc']。
  - windowsVerbatimArguments <boolean> 决定在Windows系统下是否使用转义参数。 在Linux平台下会自动忽略。默认值: false。
  - uid <number> 设置该进程的用户标识。（详见 setuid(2)）
  - gid <number> 设置该进程的组标识。（详见 setgid(2)）
返回: <ChildProcess>
child_process.fork() 方法是 [child_process.spawn()] 的一个特殊情况，专门用于衍生新的 Node.js 进程。 跟 [child_process.spawn()] 一样返回一个 [ChildProcess] 对象。 返回的 [ChildProcess] 会有一个额外的内置的通信通道，它允许消息在父进程和子进程之间来回传递。 详见 [subprocess.send()]。

衍生的 Node.js 子进程与两者之间建立的 IPC 通信信道的异常是独立于父进程的。 每个进程都有自己的内存，使用自己的 V8 实例。 由于需要额外的资源分配，因此不推荐衍生大量的 Node.js 进程。

默认情况下，child_process.fork() 会使用父进程中的 [process.execPath] 衍生新的 Node.js 实例。 options 对象中的 execPath 属性可以替换要使用的执行路径。

使用自定义的 execPath 启动的 Node.js 进程，会使用子进程的环境变量 NODE_CHANNEL_FD 中指定的文件描述符（fd）与父进程通信。

注意，不像 POSIX 系统回调中的 fork(2)，child_process.fork() 不会克隆当前进程。

提示: 在使用child_process.fork() 产生的子进程内，使用 [child_process.spawn()][] 会自动忽略掉其中的shell 配置选项并不会生效。

**child_process.spawn(command[, args][, options])**
- command <string> 要运行的命令。
- args <Array> 字符串参数列表。
- options <Object>
  - cwd <string> 子进程的当前工作目录。
  - env <Object> 环境变量键值对。
  - argv0 <string> 显式地设置要发给子进程的 argv[0] 的值。 如果未指定，则设为 command。
  - stdio <Array> | <string> 子进程的 stdio 配置。 
  - detached <boolean> 准备将子进程独立于父进程运行。 具体行为取决于平台。
  - uid <number> 设置该进程的用户标识。
  - gid <number> 设置该进程的组标识。
  - shell <boolean> | <string> 如果为 true，则在一个 shell 中运行 command。 在 UNIX 上使用 '/bin/sh'，在 Windows 上使用 process.env.ComSpec。 一个不同的 shell 可以被指定为字符串。 默认为 false（没有 shell）。
  - windowsVerbatimArguments <boolean> 决定在Windows系统下是否使用转义参数。 在Linux平台下会自动忽略，当指令 shell 存在的时该属性将自动被设置为true。默认值: false。
  - windowsHide <boolean> 是否隐藏在Windows系统下默认会弹出的子进程控制台窗口。 默认为: false。
返回: <ChildProcess>

**child_process.execFileSync(file[, args][, options])**
child_process.execFileSync() 方法与 [child_process.execFile()] 基本相同，除了该方法直到子进程完全关闭后才返回。 当遇到超时且发送了 killSignal 时，则该方法直到进程完全退出后才返回结果。

注意，如果子进程拦截并处理了 SIGTERM 信号且没有退出，则父进程会一直等待直到子进程退出。

如果进程超时，或有一个非零的退出码，则该方法会抛出一个 [Error]，这个错误对象包含了底层 [child_process.spawnSync()] 的完整结果。

**child_process.execSync(command[, options])**
child_process.execSync() 方法与 [child_process.exec()] 基本相同，除了该方法直到子进程完全关闭后才返回。 当遇到超时且发送了 killSignal 时，则该方法直到进程完全退出后才返回结果。 注意，如果子进程拦截并处理了 SIGTERM 信号且没有退出，则父进程会一直等待直到子进程退出。

如果进程超时，或有一个非零的退出码，则该方法会抛出错误。 [Error] 对象会包含从 [child_process.spawnSync()] 返回的整个结果。

注意：不要把未经检查的用户输入传入到该函数。 任何包括 shell 元字符的输入都可被用于触发任何命令的执行。

**child_process.spawnSync(command[, args][, options])**
child_process.spawnSync() 方法与 [child_process.spawn()] 基本相同，除了该方法直到子进程完全关闭后才返回。 当遇到超时且发送了 killSignal 时，则该方法直到进程完全退出后才返回结果。 注意，如果子进程拦截并处理了 SIGTERM 信号且没有退出，则父进程会一直等待直到子进程退出。

注意：不要把未经检查的用户输入传入到该函数。 任何包括 shell 元字符的输入都可被用于触发任何命令的执行。

**ChildProcess 类**
ChildProcess 类的实例是 [EventEmitter]，代表衍生的子进程。

ChildProcess 的实例不被直接创建。 而是，使用 [child_process.spawn()]、[child_process.exec()]、[child_process.execFile()] 或 [child_process.fork()] 方法创建 ChildProcess 实例。

**'close' 事件**
code <number> 如果子进程退出自身，则该值是退出码。
signal <string> 子进程被终止时的信号。
当子进程的 stdio 流被关闭时会触发 'close' 事件。 这与 ['exit'] 事件不同，因为多个进程可能共享同一 stdio 流。

**'disconnect' 事件**
在父进程中调用 [subprocess.disconnect()] 或在子进程中调用 [process.disconnect()] 后会触发 'disconnect' 事件。 断开后就不能再发送或接收信息，且 [subprocess.connected] 属性会被设为 false。

**'error' 事件**
err <Error> 错误对象。
每当出现以下情况时触发 'error' 事件：
- 进程无法被衍生；
- 进程无法被杀死；
- 向子进程发送信息失败。
注意，在错误发生后，'exit' 事件可能会也可能不会触发。 当同时监听了 'exit' 和 'error' 事件，谨防处理函数被多次调用。
详见 [subprocess.kill()] 和 [subprocess.send()]。

**'exit' 事件**
code <number> 如果子进程退出自身，则该值是退出码。
signal <string> 子进程被终止时的信号。
子进程结束后会触发 'exit' 事件。 如果进程退出了，则 code 是进程的最终退出码，否则为 null。 
如果进程是收到的信号而终止的，则 signal 是信号的字符串名称，否则为 null。 
*这两个总有一个是非空的。*

注意，当 'exit' 事件被触发时，子进程的 stdio 流可能依然是打开的。

另外，还要注意，Node.js 建立了 SIGINT 和 SIGTERM 的信号处理程序，且 Node.js 进程收到这些信号也不会立即终止。 相反，Node.js 会执行一系列的清理操作后重新引发处理信号。

**'message' 事件**
message <Object> 一个已解析的 JSON 对象或原始值。
sendHandle <Handle> 一个 [net.Socket] 或 [net.Server] 对象 或 undefined。
当一个子进程使用 [process.send()] 发送消息时会触发 'message' 事件。

注意: 消息通过序列化和解析传递，结果就是消息可能跟开始发送的不完全一样。

**subprocess.channel**
<Object> 代表子进程的IPC通道的管道。
subprocess.channel 属性是当前子进程的 IPC 通道的引用。如果当前没有 IPC 通道，则该属性为 undefined。

**subprocess.connected**
<boolean> 调用 subprocess.disconnect() 后会被设为 false
subprocess.connected 属性表明是否仍可以从一个子进程发送和接收消息。 当 subprocess.connected 为 false 时，则不能再发送或接收的消息。

**subprocess.disconnect()**
关闭父进程与子进程之间的 IPC 通道，一旦没有其他的连接使其保持活跃，则允许子进程正常退出。 调用该方法后，父进程和子进程上各自的 subprocess.connected 和 process.connected 属性都会被设为 false，且进程之间不能再传递消息。

当正在接收的进程中没有消息时，就会触发 'disconnect' 事件。 这经常在调用 subprocess.disconnect() 后立即被触发。

注意，当子进程是一个 Node.js 实例时（例如通过 [child_process.fork()] 衍生的），可以在子进程内调用 process.disconnect() 方法来关闭 IPC 通道。

**subprocess.kill([signal])**
signal <string>
subprocess.kill() 方法向子进程发送一个信号。 如果没有给定参数，则进程会发送 'SIGTERM' 信号。
```
const { spawn } = require('child_process');
const grep = spawn('grep', ['ssh']);

grep.on('close', (code, signal) => {
  console.log(`子进程收到信号 ${signal} 而终止`);
});

// 发送 SIGHUP 到进程
grep.kill('SIGHUP');
```
如果信号没有被送达，[ChildProcess] 对象可能会触发一个 ['error'] 事件。 向一个已经退出的子进程发送信号不是一个错误，但可能有无法预知的后果。 特别是，如果进程的 PID 已经重新分配给其他进程，则信号会被发送到该进程，从而可能有意想不到的结果。

注意，当函数被调用 kill 时，已发送到子进程的信号可能没有实际终止该进程。

**subprocess.killed**
<boolean> 当 subprocess.kill() 已成功发送信号给子进程后会被设置为 true。
subprocess.killed 属性表明该子进程是否已成功接收到 subprocess.kill() 的信号。 该属性不代表子进程是否已被终止。

**subprocess.pid**
<number> 整数
返回子进程的进程标识（PID）。

**subprocess.send(message[, sendHandle[, options]][, callback])**
当父进程和子进程之间建立了一个 IPC 通道时（例如，使用 [child_process.fork()]），subprocess.send() 方法可用于发送消息到子进程。 当子进程是一个 Node.js 实例时，消息可以通过 [process.on('message')] 事件接收。

注意: 消息通过序列化和解析进行传递，结果就是消息可能跟开始发送的不完全一样。

**subprocess.stderr**
<stream.Readable>
一个代表子进程的 stderr 的可读流。
如果子进程被衍生时 stdio[2] 被设为任何不是 'pipe' 的值，则这会是 null。
subprocess.stderr 是 subprocess.stdio[2] 的一个别名。 这两个属性指向相同的值。

**subprocess.stdin**
<stream.Writable>
一个代表子进程的 stdin 的可写流。
注意，如果一个子进程正在等待读取所有的输入，则子进程不会继续直到流已通过 end() 关闭。
如果子进程被衍生时 stdio[0] 被设为任何不是 'pipe' 的值，则这会是 null。
subprocess.stdin 是 subprocess.stdio[0] 的一个别名。 这两个属性指向相同的值。

**subprocess.stdio**
<Array>
一个到子进程的管道的稀疏数组，对应着传给 [child_process.spawn()] 的选项中值被设为 'pipe' 的 [stdio]。 注意，subprocess.stdio[0]、subprocess.stdio[1] 和 subprocess.stdio[2] 分别可用作 subprocess.stdin、 subprocess.stdout 和 subprocess.stderr。

**subprocess.stdout**
<stream.Readable>
一个代表子进程的 stdout 的可读流。
如果子进程被衍生时 stdio[1] 被设为任何不是 'pipe' 的值，则这会是 null。
subprocess.stdout 是 subprocess.stdio[1] 的一个别名。 这两个属性指向相同的值。

**maxBuffer 与 Unicode**
maxBuffer 选项指定了 stdout 或 stderr 上允许的字节数的最大值。 如果超过这个值，则子进程会被终止。 这会影响包含多字节字符编码的输出，如 UTF-8 或 UTF-16。 例如，console.log('中文测试') 会发送 13 个 UTF-8 编码的字节到 stdout，尽管只有 4 个字符。