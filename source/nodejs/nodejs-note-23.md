---
title: nodejs基础知识(13)
date: 2023-02-28 21:09:20
tags: [node, process 进程]
---

#### process 进程

'beforeExit' 事件
当 Node.js 清空其事件循环并且没有额外的工作要安排时，则会触发 'beforeExit' 事件。 通常情况下，当没有工作要调度时，Node.js 进程会退出，但是注册在 'beforeExit' 事件上的监听器可以进行异步的调用，从而使 Node.js 进程继续。

调用监听器回调函数时将 process.exitCode 的值作为唯一的参数传入。

对于导致显式终止的条件，例如调用 process.exit() 或未捕获的异常，则不会触发 'beforeExit' 事件。

'beforeExit' 不应用作 'exit' 事件的替代，除非打算安排额外的工作。
```javascript
import process from 'node:process';

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

console.log('This message is displayed first.');

// 打印:
// This message is displayed first.
// Process beforeExit event with code: 0
// Process exit event with code: 0
```

'disconnect' 事件#
如果 Node.js 进程是使用 IPC 通道衍生（参见子进程和集群文档），则在 IPC 通道关闭时将触发 'disconnect' 事件。

'exit' 事件
code <integer>
当 Node.js 进程由于以下任一原因即将退出时，则会触发 'exit' 事件：
- process.exit() 方法被显式调用；
- Node.js 事件循环不再需要执行任何额外的工作。
此时没有办法阻止事件循环的退出，一旦所有 'exit' 监听器都运行完毕，则 Node.js 进程将终止。
监听器回调函数使用 process.exitCode 属性指定的退出码或传给 process.exit() 方法的 exitCode 参数调用。
```javascript
import process from 'node:process';

process.on('exit', (code) => {
  console.log(`About to exit with code: ${code}`);
});
```
监听器函数必须只执行同步的操作。 Node.js 进程将在调用 'exit' 事件监听器之后立即退出，从而使任何仍在事件循环中排队的其他工作被丢弃。 例如，在以下示例中，超时永远不会发生：
```javascript
import process from 'node:process';

process.on('exit', (code) => {
  setTimeout(() => {
    console.log('This will not run');
  }, 0);
});
```

'message' 事件
message <Object> | <boolean> | <number> | <string> | <null> 解析的 JSON 对象或可序列化的原始值。
sendHandle <net.Server> | <net.Socket> net.Server 或 net.Socket 对象、或未定义。
如果 Node.js 进程是使用 IPC 通道衍生（参见子进程和集群文档），则每当子进程收到父进程使用 childprocess.send() 发送的消息时，就会触发 'message' 事件。
*消息经过序列化和解析。 结果消息可能与最初发送的消息不同。*
*如果在衍生进程时将 serialization 选项设置为 advanced，则 message 参数可以包含 JSON 无法表示的数据。*

'rejectionHandled' 事件
promise <Promise> 最近处理的 promise。
每当 Promise 被拒绝并且错误句柄被附加到它（例如使用 promise.catch()）晚于一轮 Node.js 事件循环时，则 'rejectionHandled' 事件就会触发。

Promise 对象会在 'unhandledRejection' 事件中先处理，但在处理过程中获得了拒绝句柄。
对于 Promise 链，没有始终可以处理拒绝的顶层概念。 由于本质上是异步的，Promise 拒绝可以在未来的某个时间点处理，可能比触发 'unhandledRejection' 事件所需的事件循环轮询要晚得多。

另一种表述方式是，与同步代码中未处理的异常列表不断增长不同，promise 中未处理的拒绝列表可能会不断增长和缩小。

在同步代码中，当未处理的异常列表增长时，会触发 'uncaughtException' 事件。
在异步代码中，当未处理的拒绝列表增长时，会触发 'unhandledRejection' 事件，当未处理的拒绝列表缩小时，会触发 'rejectionHandled' 事件。
```javascript
import process from 'node:process';

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});
```
在这个例子中，unhandledRejections Map 将随着时间的推移而增长和缩小，反映了开始未处理然后变成处理的拒绝。 可以定期在错误日志中记录此类错误（这可能最适合长时间运行的应用程序）或在进程退出时（这可能对脚本最方便）。

'uncaughtException' 事件
err <Error> 未捕获的异常。
origin <string> 指示异常是源自未处理的拒绝还是源自同步错误。 可以是 'uncaughtException' 或 'unhandledRejection'。 后者用于在基于 Promise 的异步上下文中发生异常（或者如果 Promise 被拒绝）并且 --unhandled-rejections 标志设置为 strict 或 throw（这是默认值）并且拒绝未被处理，或者当拒绝发生在命令行入口点的 ES 模块静态加载阶段。
当未捕获的 JavaScript 异常一直冒泡回到事件循环时，则会触发 'uncaughtException' 事件。 默认情况下，Node.js 通过将堆栈跟踪打印到 stderr 并以代码 1 退出，覆盖任何先前设置的 process.exitCode 来处理此类异常。 为 'uncaughtException' 事件添加句柄会覆盖此默认行为。 或者，更改 'uncaughtException' 处理程序中的 process.exitCode，这将导致进程以提供的退出码退出。 否则，在存在此类句柄的情况下，进程将以 0 退出。
```javascript
import process from 'node:process';

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`
  );
});

setTimeout(() => {
  console.log('This will still run.');
}, 500);

// 故意引发异常，但不捕获。
nonexistentFunc();
console.log('This will not run.');
```
通过安装 'uncaughtExceptionMonitor' 监听器，可以在不覆盖退出进程的默认行为的情况下监视 'uncaughtException' 事件。

注意: 正确使用 'uncaughtException'
'uncaughtException' 是用于异常处理的粗略机制，仅用作最后的手段。 事件_不应该_用作 On Error Resume Next 的等价物。 未处理的异常本质上意味着应用程序处于未定义状态。 在没有从异常中正确恢复的情况下尝试恢复应用程序代码可能会导致其他不可预见和不可预测的问题。

从事件句柄中抛出的异常将不会被捕获。 而是，该进程将以非零退出码退出，并将打印堆栈跟踪。 这是为了避免无限递归。

尝试在未捕获异常后正常恢复类似于升级计算机时拔掉电源线。 十有八九，什么都没有发生。 但是第十次，系统损坏了。

'uncaughtException' 的正确用法是在关闭进程之前对分配的资源（例如文件描述符、句柄等）执行同步清理。 在 'uncaughtException' 之后恢复正常操作是不安全的。

为了以更可靠的方式重新启动崩溃的应用程序，无论 'uncaughtException' 是否触发，都应该在单独的进程中使用外部监视器来检测应用程序故障并根据需要恢复或重新启动。

'uncaughtExceptionMonitor' 事件
err <Error> 未捕获的异常。
origin <string> 指示异常是源自未处理的拒绝还是源自同步错误。 可以是 'uncaughtException' 或 'unhandledRejection'。 后者用于在基于 Promise 的异步上下文中发生异常（或者如果 Promise 被拒绝）并且 --unhandled-rejections 标志设置为 strict 或 throw（这是默认值）并且拒绝未被处理，或者当拒绝发生在命令行入口点的 ES 模块静态加载阶段。
'uncaughtExceptionMonitor' 事件在 'uncaughtException' 事件触发或通过 process.setUncaughtExceptionCaptureCallback() 安装的钩子被调用之前触发。

一旦触发 'uncaughtException' 事件，则安装 'uncaughtExceptionMonitor' 监听器不会更改行为。 如果没有安装 'uncaughtException' 监听器，则进程仍然会崩溃。
```javascript
import process from 'node:process';

process.on('uncaughtExceptionMonitor', (err, origin) => {
  MyMonitoringTool.logSync(err, origin);
});

// 故意引发异常，但不捕获。
nonexistentFunc();
// 仍然崩溃 Node.js
```

'unhandledRejection' 事件
reason <Error> | <any> Promise 被拒绝的对象（通常是 Error 对象）。
promise <Promise> 被拒绝的 promise。
每当 Promise 被拒绝并且在事件循环的一个轮询内没有错误句柄附加到承诺时，则会触发 'unhandledRejection' 事件。 使用 Promise 进行编程时，异常被封装为“被拒绝的 promise”。 拒绝可以使用 promise.catch() 捕获和处理，并通过 Promise 链传播。 'unhandledRejection' 事件对于检测和跟踪尚未处理的被拒绝的 promise 很有用。
```javascript
import process from 'node:process';

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // 应用程序特定的日志记录，在此处抛出错误或其他逻辑
});

somePromise.then((res) => {
  return reportToUser(JSON.pasre(res)); // 注意错别字 (`pasre`)
}); // 无 `.catch()` 或 `.then()`
// 以下也将触发 'unhandledRejection' 事件被触发：

import process from 'node:process';

function SomeResource() {
  // 最初将加载状态设置为被拒绝的 promise
  this.loaded = Promise.reject(new Error('Resource not yet loaded!'));
}

const resource = new SomeResource();
// resource.loaded 上没有 .catch 或 .then
```
在此示例情况下，可以将拒绝作为开发人员错误进行跟踪，这通常是其他 'unhandledRejection' 事件的情况。 为了解决此类故障，可以将非操作 .catch(() => { }) 句柄附加到 resource.loaded，这将阻止触发 'unhandledRejection' 事件。

'warning' 事件
warning <Error> 警告的主要属性是：
- name <string> 警告的名称。 默认值: 'Warning'。
- message <string> 系统提供的警告描述。
- stack <string> 代码中发出警告的位置的堆栈跟踪。
每当 Node.js 触发进程警告时，则会触发 'warning' 事件。

进程警告类似于错误，因为其描述了引起用户注意的异常情况。 但是，警告不是正常 Node.js 和 JavaScript 错误处理流程的一部分。 Node.js 可以在检测到可能导致次优应用程序性能、错误或安全漏洞的不良编码实践时触发警告。
```javascript
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 打印警告名称
  console.warn(warning.message); // 打印警告信息
  console.warn(warning.stack);   // 打印堆栈跟踪
});
```

默认情况下，Node.js 会将进程警告打印到 stderr。 --no-warnings 命令行选项可用于抑制默认控制台输出，但 'warning' 事件仍将由 process 对象触发。

以下示例说明了在向事件添加过多监听器时打印到 stderr 的警告：
```javascript
$ node
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> (node:38638) MaxListenersExceededWarning: Possible EventEmitter memory leak
// detected. 2 foo listeners added. Use emitter.setMaxListeners() to increase limit
```
相比之下，以下示例关闭默认警告输出并向 'warning' 事件添加自定义句柄：
```javascript
$ node --no-warnings
> const p = process.on('warning', (warning) => console.warn('Do not do that!'));
> events.defaultMaxListeners = 1;
> process.on('foo', () => {});
> process.on('foo', () => {});
> Do not do that!
```

--trace-warnings 命令行选项可用于使警告的默认控制台输出包括警告的完整堆栈跟踪。
使用 --throw-deprecation 命令行标志启动 Node.js 将导致自定义弃用警告作为异常抛出。
使用 --trace-deprecation 命令行标志将导致自定义弃用与堆栈跟踪一起打印到 stderr。
使用 --no-deprecation 命令行标志将抑制自定义弃用的所有报告。
*-deprecation 命令行标志仅影响使用名称 'DeprecationWarning' 的警告。

'worker' 事件
worker <Worker> 创建的 <Worker>。
创建新的 <Worker> 线程后会触发 'worker' 事件。

触发自定义的告警
请参阅 process.emitWarning() 方法以发出自定义或特定于应用程序的警告。

Node.js 警告的名称
Node.js 触发的警告类型（由 name 属性标识）没有严格的指导方针。 可以随时添加新类型的警告。 一些最常见的警告类型包括：

'DeprecationWarning' - 表示使用已弃用的 Node.js API 或功能。 此类警告必须包含标识弃用代码的 'code' 属性。
'ExperimentalWarning' - 表示使用实验的 Node.js API 或功能。 必须谨慎使用此类功能，因为它们可能随时更改，并且不受与受支持功能相同的严格语义版本控制和长期支持政策的约束。
'MaxListenersExceededWarning' - 表示在 EventEmitter 或 EventTarget 上注册了太多给定事件的监听器。 这通常表示内存泄漏。
'TimeoutOverflowWarning' - 表示已向 setTimeout() 或 setInterval() 函数提供了无法容纳在 32 位有符号整数内的数值。
'UnsupportedWarning' - 表示使用不受支持的选项或功能，这些选项或功能将被忽略而不是被视为错误。 一个示例是在使用 HTTP/2 兼容性 API 时使用 HTTP 响应状态消息。


信号事件
当 Node.js 进程收到信号时，则将触发信号事件。 有关标准 POSIX 信号名称（例如 'SIGINT'、'SIGHUP' 等）的列表，请参阅 signal(7)。

信号在 Worker 线程上不可用。
信号句柄将接收信号的名称（'SIGINT'、'SIGTERM' 等）作为第一个参数。
每个事件的名称将是信号的大写通用名称（例如 'SIGINT' 表示 SIGINT 信号）。
```javascript
import process from 'node:process';

// 从标准输入开始读取，因此进程不会退出。
process.stdin.resume();

process.on('SIGINT', () => {
  console.log('Received SIGINT. Press Control-D to exit.');
});

// 使用单个函数处理多个信号
function handle(signal) {
  console.log(`Received ${signal}`);
}

process.on('SIGINT', handle);
process.on('SIGTERM', handle);
```
'SIGUSR1' 由 Node.js 预留以启动调试器。 可以安装监听器，但这样做可能会干扰调试器。
'SIGTERM' 和 'SIGINT' 在非 Windows 平台上具有默认的句柄，其在使用代码 128 + signal number 退出之前重置终端模式。 如果这些信号之一安装了监听器，则其默认行为将被删除（Node.js 将不再退出）。
'SIGPIPE' 默认情况下忽略。 它可以安装监听器。
'SIGHUP' 在 Windows 上是在关闭控制台窗口时生成，在其他平台上是在各种类似条件下生成。 参见 signal(7)。 它可以安装监听器，但是 Node.js 将在大约 10 秒后被 Windows 无条件地终止。 在非 Windows 平台上，SIGHUP 的默认行为是终止 Node.js，但一旦安装了监听器，则其默认行为将被删除。
'SIGTERM' Windows 上不支持，可以监听。
所有平台都支持来自终端的 'SIGINT'，通常可以使用 Ctrl+C 生成（但是这是可配置的）。 当启用终端原始模式并使用 Ctrl+C 时不会生成它。
'SIGBREAK' 在 Windows 上，当按下 Ctrl+Break 时会发送。 在非 Windows 平台上，它可以被监听，但无法发送或生成它。
'SIGWINCH' 当调整控制台大小时会发送。 在 Windows 上，这只会发生在当光标移动时写入控制台，或者当在原始模式下使用可读的终端时。
'SIGKILL' 不能安装监听器，它会无条件地终止所有平台上的 Node.js。
'SIGSTOP' 不能安装监听器。
'SIGBUS'、'SIGFPE'、'SIGSEGV' 和 'SIGILL'，当不使用 kill(2) 人为引发时，本质上会使进程处于调用 JS 监听器不安全的状态。 这样做可能会导致进程停止响应。
0 可以发送来测试进程是否存在，如果进程存在则没影响，如果进程不存在则抛出错误。
Windows 不支持信号，因此没有等价的使用信号来终止，但 Node.js 提供了一些对 process.kill() 和 subprocess.kill() 的模拟：
发送 SIGINT、SIGTERM、和 SIGKILL 会导致目标进程无条件的终止，之后子进程会报告进程被信号终止。
发送信号 0 可以作为独立于平台的方式来测试进程是否存在。


process.abort()
process.abort() 方法会导致 Node.js 进程立即退出并生成一个核心文件。
*此特性在 Worker 线程中不可用。*

process.allowedNodeEnvironmentFlags
process.allowedNodeEnvironmentFlags 属性是 NODE_OPTIONS 环境变量中允许的特殊的只读 Set 标志。

process.allowedNodeEnvironmentFlags 继承了 Set，但覆盖了 Set.prototype.has 以识别几种不同的可能标志表示。 在以下情况下，process.allowedNodeEnvironmentFlags.has() 将返回 true：
- 标志可以省略前导单（-）或双（--）破折号；例如，inspect-brk 代表 --inspect-brk，或 r 代表 -r。
- 传给 V8 的标志（如 --v8-options 中所列）可能会替换一个或多个_非前导_破折号作为下划线，反之亦然；例如，--perf_basic_prof、--perf-basic-prof、--perf_basic-prof 等。
- 标志可能包含一个或多个等于 (=) 字符；在第一个等号之后并包括在内的所有字符都将被忽略；例如，--stack-trace-limit=100。
- 标志_必须_在 NODE_OPTIONS 中是允许的。

在 process.allowedNodeEnvironmentFlags 上迭代时，标志只会出现_一次_；每个都以一个或多个破折号开头。 传给 V8 的标志将包含下划线而不是非前导破折号：
```javascript
import { allowedNodeEnvironmentFlags } from 'node:process';

allowedNodeEnvironmentFlags.forEach((flag) => {
  // -r
  // --inspect-brk
  // --abort_on_uncaught_exception
  // ...
});
// process.allowedNodeEnvironmentFlags 的方法 add()、clear() 和 delete() 什么都不做，会静默失败。
```
如果 Node.js 编译时_没有_ NODE_OPTIONS 支持（显示在 process.config 中），那么 process.allowedNodeEnvironmentFlags 将包含_本来_允许的内容。

process.arch
为其编译 Node.js 二进制文件的操作系统 CPU 架构。 可能的值为：'arm'、'arm64'、'ia32'、'mips'、'mipsel'、'ppc'、'ppc64'、's390'、's390x'、以及 'x64'。
```javascript
import { arch } from 'node:process';

console.log(`This processor architecture is ${arch}`);
```

process.argv
process.argv 属性返回数组，其中包含启动 Node.js 进程时传入的命令行参数。 第一个元素将是 process.execPath。 如果需要访问 argv[0] 的原始值，请参阅 process.argv0。 第二个元素将是正在执行的 JavaScript 文件的路径。 其余元素将是任何其他命令行参数。

例如，假设 process-args.js 有以下脚本：
```javascript
import { argv } from 'node:process';

// 打印 process.argv
argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});
```
以如下方式启动 Node.js 进程：
```javascript
$ node process-args.js one two=three four
将生成输出：

0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one
3: two=three
4: four
```

process.argv0
process.argv0 属性存储了 Node.js 启动时传入的 argv[0] 原始值的只读副本。
```javascript
$ bash -c 'exec -a customArgv0 ./node'
> process.argv[0]
'/Volumes/code/external/node/out/Release/node'
> process.argv0
'customArgv0'
```

process.channel
如果 Node.js 进程是使用 IPC 通道衍生（参见子进程文档），则 process.channel 属性是对 IPC 通道的引用。 如果不存在 IPC 通道，则此属性为 undefined。

process.channel.ref()
如果之前已调用过 .unref()，则此方法使 IPC 通道保持进程的事件循环运行。
通常，这是通过 process 对象上的 'disconnect' 和 'message' 监听器的数量来管理的。 但是，此方法可用于显式请求特定行为。

process.channel.unref()
此方法使 IPC 通道不会保持进程的事件循环运行，并且即使在通道打开时也让它完成。
通常，这是通过 process 对象上的 'disconnect' 和 'message' 监听器的数量来管理的。 但是，此方法可用于显式请求特定行为。

process.chdir(directory)
directory <string>
process.chdir() 方法更改 Node.js 进程的当前工作目录，如果失败则抛出异常（例如，如果指定的 directory 不存在）。
```javascript
import { chdir, cwd } from 'node:process';

console.log(`Starting directory: ${cwd()}`);
try {
  chdir('/tmp');
  console.log(`New directory: ${cwd()}`);
} catch (err) {
  console.error(`chdir: ${err}`);
}
```
此特性在 Worker 线程中不可用。

process.config
process.config 属性返回 Object，其中包含用于编译当前 Node.js 可执行文件的配置选项的 JavaScript 表示。 这与运行 ./configure 脚本时生成的 config.gypi 文件相同。
可能的输出示例如下所示：
```javascript
{
  target_defaults:
   { cflags: [],
     default_configuration: 'Release',
     defines: [],
     include_dirs: [],
     libraries: [] },
  variables:
   {
     host_arch: 'x64',
     napi_build_version: 5,
     node_install_npm: 'true',
     node_prefix: '',
     node_shared_cares: 'false',
     node_shared_http_parser: 'false',
     node_shared_libuv: 'false',
     node_shared_zlib: 'false',
     node_use_dtrace: 'false',
     node_use_openssl: 'true',
     node_shared_openssl: 'false',
     strict_aliasing: 'true',
     target_arch: 'x64',
     v8_use_snapshot: 1
   }
}
```
process.config 属性是非只读的，并且生态系统中存在已知扩展、修改或完全替换 process.config 值的现有模块。
*修改 process.config 属性或 process.config 对象的任何子属性已被弃用。 在未来的版本中，process.config 将变为只读。*

process.connected
如果 Node.js 进程使用 IPC 通道衍生（参见子进程和集群文档），则只要 IPC 通道连接，process.connected 属性将返回 true，并在调用 process.disconnect() 后返回 false。
一旦 process.connected 为 false，就不能再使用 process.send() 通过 IPC 通道发送消息。

process.cpuUsage([previousValue])#
previousValue <Object> 先前调用 process.cpuUsage() 的返回值
返回: <Object>
- user <integer>
- system <integer>
process.cpuUsage() 方法在具有属性 user 和 system 的对象中返回当前进程的用户和系统 CPU 时间使用情况，其值为微秒值（百万分之一秒）。 这些值分别测量在用户和系统代码中花费的时间，如果多个 CPU 内核为此进程执行工作，则最终可能会大于实际经过的时间。

先前调用 process.cpuUsage() 的结果可以作为参数传给函数，以获取差异读数。
```javascript
import { cpuUsage } from 'node:process';

const startUsage = cpuUsage();
// { user: 38579, system: 6986 }

// 使 CPU 旋转 500 毫秒
const now = Date.now();
while (Date.now() - now < 500);

console.log(cpuUsage(startUsage));
// { user: 514883, system: 11226 }
```

process.cwd()
process.cwd() 方法返回 Node.js 进程的当前工作目录。
```javascript
import { cwd } from 'node:process';

console.log(`Current directory: ${cwd()}`);
```

process.debugPort
启用时 Node.js 调试器使用的端口。
```javascript
import process from 'node:process';

process.debugPort = 5858;
```

process.disconnect()
如果 Node.js 进程是使用 IPC 通道衍生（参见子进程和集群文档），则 process.disconnect() 方法将关闭通往父进程的 IPC 通道，一旦没有其他连接使其保持活动状态，则允许子进程正常退出。
调用 process.disconnect() 的效果和从父进程调用 ChildProcess.disconnect() 是一样的。
如果 Node.js 进程不是使用 IPC 通道衍生，则 process.disconnect() 将是 undefined。

process.dlopen(module, filename[, flags])
- module <Object>
- filename <string>
- flags <os.constants.dlopen> 默认值: os.constants.dlopen.RTLD_LAZY
process.dlopen() 方法允许动态加载共享对象。 require() 主要用于加载 C++ 插件，除非特殊情况，否则不应直接使用。 换句话说，require() 应该优先于 process.dlopen()，除非有特定的原因，例如自定义 dlopen 标志或从 ES 模块加载。

flags 参数是整数，允许指定 dlopen 行为。 有关详细信息，请参阅 os.constants.dlopen 文档。
调用 process.dlopen() 时的一个重要要求是必须传入 module 实例。 然后可以通过 module.exports 访问由 C++ 插件导出的函数。

下面的示例显示了如何加载名为 local.node 的 C++ 插件，该插件导出 foo 函数。 通过传入 RTLD_NOW 常量，在调用返回之前加载所有符号。 在此示例中，假定常量可用。
```javascript
import { dlopen } from 'node:process';
import { constants } from 'node:os';
import { fileURLToPath } from 'node:url';

const module = { exports: {} };
dlopen(module, fileURLToPath(new URL('local.node', import.meta.url)),
       constants.dlopen.RTLD_NOW);
module.exports.foo();
```

process.emitWarning(warning[, options])
warning <string> | <Error> 要触发的警告。
options <Object>
- type <string> 当 warning 是 String 时，type 是用于触发警告的 type 的名称。 默认值: 'Warning'。
- code <string> 触发的警告实例的唯一标识符。
- ctor <Function> 当 warning 为 String 时，ctor 是可选函数，用于限制生成的堆栈跟踪。 默认值: process.emitWarning。
- detail <string> 要包含在错误中的额外文本。
process.emitWarning() 方法可用于触发自定义或特定于应用程序的进程警告。 这些可以通过向 'warning' 事件添加句柄来监听。
```javascript
import { emitWarning } from 'node:process';

// 触发带有代码和其他详细信息的警告。
emitWarning('Something happened!', {
  code: 'MY_WARNING',
  detail: 'This is some additional information'
});
// 触发:
// (node:56338) [MY_WARNING] Warning: Something happened!
// This is some additional information
```
在此示例中，Error 对象由 process.emitWarning() 在内部生成并传给 'warning' 句柄。
```javascript
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);    // 'Warning'
  console.warn(warning.message); // 'Something happened!'
  console.warn(warning.code);    // 'MY_WARNING'
  console.warn(warning.stack);   // Stack trace
  console.warn(warning.detail);  // 'This is some additional information'
});
```
如果 warning 作为 Error 对象传入，则忽略 options 参数。

process.emitWarning(warning[, type[, code]][, ctor])
- warning <string> | <Error> 要触发的警告。
- type <string> 当 warning 是 String 时，type 是用于触发警告的 type 的名称。 默认值: 'Warning'。
- code <string> 触发的警告实例的唯一标识符。
- ctor <Function> 当 warning 为 String 时，ctor 是可选函数，用于限制生成的堆栈跟踪。 默认值: process.emitWarning。
process.emitWarning() 方法可用于触发自定义或特定于应用程序的进程警告。 这些可以通过向 'warning' 事件添加句柄来监听。
```javascript
import { emitWarning } from 'node:process';

// 使用字符串触发警告。
emitWarning('Something happened!');
// 触发: (node: 56338) Warning: Something happened!
import { emitWarning } from 'node:process';

// 使用字符串和类型触发警告。
emitWarning('Something Happened!', 'CustomWarning');
// 触发: (node:56338) CustomWarning: Something Happened!
import { emitWarning } from 'node:process';

emitWarning('Something happened!', 'CustomWarning', 'WARN001');
// 触发: (node:56338) [WARN001] CustomWarning: Something happened!
```
在前面的每个示例中，Error 对象由 process.emitWarning() 在内部生成并传给 'warning' 句柄。
```javascript
import process from 'node:process';

process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.code);
  console.warn(warning.stack);
});
```
如果 warning 作为 Error 对象传入，则它将被不加修改地传给 'warning' 事件句柄（并且可选的 type、code 和 ctor 参数将被忽略）：
```javascript
import { emitWarning } from 'node:process';

// 使用 Error 对象触发警告。
const myWarning = new Error('Something happened!');
// 使用错误名称属性指定类型名称
myWarning.name = 'CustomWarning';
myWarning.code = 'WARN001';

emitWarning(myWarning);
// 触发: (node:56338) [WARN001] CustomWarning: Something happened!
```
如果 warning 不是字符串或 Error 对象，则抛出 TypeError。
虽然进程警告使用 Error 对象，但进程警告机制不是替代正常错误处理机制。
如果警告 type 为 'DeprecationWarning'，则执行以下额外处理：
- 如果使用 --throw-deprecation 命令行标志，则弃用警告将作为异常抛出，而不是作为事件触发。
- 如果使用 --no-deprecation 命令行标志，则会取消弃用警告。
- 如果使用 --trace-deprecation 命令行标志，则弃用警告将与完整堆栈跟踪一起打印到 stderr。

避免重复警告
作为最佳实践，每个进程只应触发一次警告。 为此，则将 emitWarning() 放在布尔值后面。
```javascript
import { emitWarning } from 'node:process';

function emitMyWarning() {
  if (!emitMyWarning.warned) {
    emitMyWarning.warned = true;
    emitWarning('Only warn once!');
  }
}
emitMyWarning();
// 触发: (node: 56339) Warning: Only warn once!
emitMyWarning();
// 什么都不触发
```

process.env
process.env 属性返回包含用户环境的对象。 参见 environ(7)。

此对象的示例如下所示：
```javascript
{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}
```
可以修改此对象，但此类修改不会反映在 Node.js 进程之外，或反映到其他 Worker 线程（除非显示请求）。 换句话说，以下示例将不起作用：

$ node -e 'process.env.foo = "bar"' && echo $foo
但是以下示例则将起作用：
```javascript
import { env } from 'node:process';

env.foo = 'bar';
console.log(env.foo);
```
在 process.env 上分配属性会将值隐式转换为字符串。 此行为已弃用。 当值不是字符串、数字或布尔值时，Node.js 的未来版本可能会抛出错误。
```javascript
import { env } from 'node:process';

env.test = null;
console.log(env.test);
// => 'null'
env.test = undefined;
console.log(env.test);
// => 'undefined'
// 使用 delete 从 process.env 中删除属性。

import { env } from 'node:process';

env.TEST = 1;
delete env.TEST;
console.log(env.TEST);
// => undefined
// 在 Windows 操作系统上，环境变量不区分大小写。

import { env } from 'node:process';

env.TEST = 1;
console.log(env.test);
// => 1
```
除非在创建 Worker 实例时显式地指定，否则每个 Worker 线程都有自己的 process.env 副本，基于其父线程的 process.env，或任何指定为 Worker 构造函数的 env 选项。 对 process.env 的更改不会跨 Worker 线程可见，只有主线程可以进行对操作系统或原生插件可见的更改。

process.execArgv
process.execArgv 属性返回 Node.js 进程启动时传入的一组特定于 Node.js 的命令行选项。 
**这些选项不会出现在 process.argv 属性返回的数组中，也不包括 Node.js 可执行文件、脚本名称或脚本名称后面的任何选项。 这些选项可用于衍生与父进程具有相同执行环境的子进程。**
```javascript
$ node --harmony script.js --version
process.execArgv 的结果：

['--harmony']
process.argv 的结果：

['/usr/local/bin/node', 'script.js', '--version']
```
有关具有此属性的工作线程的详细行为，请参阅 Worker 构造函数。

process.execPath
process.execPath 属性返回启动 Node.js 进程的可执行文件的绝对路径名。 符号链接（如果有）会被解析。

process.exit([code])
code <integer> 退出码。 默认值: 0。
process.exit() 方法指示 Node.js 以 code 的退出状态同步终止进程。 如果省略 code，则退出将使用“成功”代码 0 或 process.exitCode 的值（如果已设置）。 直到所有 'exit' 事件监听器都被调用，Node.js 才会终止。

以“失败”代码退出：
```javascript
import { exit } from 'node:process';

exit(1);
```
执行 Node.js 的 shell 应该看到退出码为 1。
调用 process.exit() 将强制进程尽快退出，即使仍有未完全完成的异步操作挂起，包括对 process.stdout 和 process.stderr 的 I/O 操作。

在大多数情况下，实际上没有必要显式调用 process.exit()。 如果事件循环中没有其他待处理的工作，则 Node.js 进程将自行退出。 可以设置 process.exitCode 属性来告诉进程在进程正常退出时使用哪个退出码。

例如，以下示例说明了 process.exit() 方法的误用，其可能导致打印到标准输出的数据被截断和丢失：
```javascript
import { exit } from 'node:process';

// 这是不该做的示例：
if (someConditionNotMet()) {
  printUsageToStdout();
  exit(1);
}
```
这是有问题的原因是因为在 Node.js 中写入 process.stdout 有时是异步的，并且可能发生在 Node.js 事件循环的多个滴答上。 但是，调用 process.exit() 会强制进程在执行对 stdout 的其他写入之前退出。

代码应该设置 process.exitCode 并通过避免为事件循环安排任何额外工作来允许进程自然退出，而不是直接调用 process.exit()：
```javascript
import process from 'node:process';

// 如何正确设置退出码，同时让进程正常退出。
if (someConditionNotMet()) {
  printUsageToStdout();
  process.exitCode = 1;
}
```
如果由于错误情况需要终止 Node.js 进程，则抛出未捕获的错误并允许进程相应地终止比调用 process.exit() 更安全。
在 Worker 线程中，该函数停止当前线程而不是当前进程。

process.exitCode
当进程正常退出或通过 process.exit() 退出而不指定代码时，将作为进程退出码的数字。
将代码指定为 process.exit(code) 将覆盖 process.exitCode 的任何先前设置。

process.getActiveResourcesInfo()
process.getActiveResourcesInfo() 方法返回字符串数组，其中包含当前保持事件循环活动的活动资源的类型。
```javascript
import { getActiveResourcesInfo } from 'node:process';
import { setTimeout } from 'node:timers';

console.log('Before:', getActiveResourcesInfo());
setTimeout(() => {}, 1000);
console.log('After:', getActiveResourcesInfo());
// 打印:
//   Before: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap' ]
//   After: [ 'CloseReq', 'TTYWrap', 'TTYWrap', 'TTYWrap', 'Timeout' ]
```

process.getegid()
process.getegid() 方法返回 Node.js 进程的数字有效群组标识。 （见 getegid(2)。）
```javascript
import process from 'node:process';

if (process.getegid) {
  console.log(`Current gid: ${process.getegid()}`);
}
```
*此功能仅适用于 POSIX 平台（即不适用于 Windows 或安卓）。*

process.geteuid()
process.geteuid() 方法返回进程的数字有效用户身份。 （见 geteuid(2)。）
```javascript
import process from 'node:process';

if (process.geteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
}
```
*此功能仅适用于 POSIX 平台（即不适用于 Windows 或安卓）。*

process.getgid()
process.getgid() 方法返回进程的数字群组标识。 （见 getgid(2)。）
```javascript
import process from 'node:process';

if (process.getgid) {
  console.log(`Current gid: ${process.getgid()}`);
}
```
此功能仅适用于 POSIX 平台（即不适用于 Windows 或安卓）。

process.getgroups()
process.getgroups() 方法返回带有补充组 ID 的数组。 POSIX 不指定是否包含有效组 ID，但 Node.js 确保它始终包含。
```javascript
import process from 'node:process';

if (process.getgroups) {
  console.log(process.getgroups()); // [ 16, 21, 297 ]
}
```
此功能仅适用于 POSIX 平台（即不适用于 Windows 或安卓）。

process.getuid()
process.getuid() 方法返回进程的数字用户标识。 （见 getuid(2)。）
```javascript
import process from 'node:process';

if (process.getuid) {
  console.log(`Current uid: ${process.getuid()}`);
}
```
此功能仅适用于 POSIX 平台（即不适用于 Windows 或安卓）。

process.hasUncaughtExceptionCaptureCallback()
指示是否已使用 process.setUncaughtExceptionCaptureCallback() 设置回调。

process.hrtime([time])
time <integer[]> 先前调用 process.hrtime() 的结果
返回: <integer[]>
这是 process.hrtime.bigint() 在 JavaScript 中引入 bigint 之前的旧版本。
process.hrtime() 方法在 [seconds, nanoseconds] 元组 Array 中返回当前高解析度实时，其中 nanoseconds 是无法以秒精度表示的实时剩余部分。

time 是可选参数，它必须是先前 process.hrtime() 调用 diff 与当前时间的结果。 如果传入的参数不是元组 Array，则会抛出 TypeError。 传入用户定义的数组而不是先前调用 process.hrtime() 的结果将导致未定义的行为。

这些时间相对于过去的任意时间，与一天中的时间无关，因此不受时钟漂移的影响。 主要用途是测量间隔之间的性能：
```javascript
import { hrtime } from 'node:process';

const NS_PER_SEC = 1e9;
const time = hrtime();
// [ 1800216, 25 ]

setTimeout(() => {
  const diff = hrtime(time);
  // [ 1, 552 ]

  console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
  // 基准测试耗时 1000000552 纳秒
}, 1000);
```

process.hrtime.bigint()
process.hrtime() 方法的 bigint 版本以纳秒为单位返回当前高解析度实时作为 bigint。
与 process.hrtime() 不同，它不支持额外的 time 参数，因为可以直接通过减去两个 bigint 来计算差异。
```javascript
import { hrtime } from 'node:process';

const start = hrtime.bigint();
// 191051479007711n

setTimeout(() => {
  const end = hrtime.bigint();
  // 191052633396993n

  console.log(`Benchmark took ${end - start} nanoseconds`);
  // 基准测试耗时 1154389282 纳秒
}, 1000);
```

process.initgroups(user, extraGroup)
- user <string> | <number> 用户名或数字标识符。
- extraGroup <string> | <number> 群组名或数字标识符。
process.initgroups() 方法读取 /etc/group 文件并使用用户所属的所有组初始化组访问列表。 这是一个特权操作，要求 Node.js 进程具有 root 访问权限或 CAP_SETGID 能力。

删除权限时要小心：
```javascript
import { getgroups, initgroups, setgid } from 'node:process';

console.log(getgroups());         // [ 0 ]
initgroups('nodeuser', 1000);     // 切换用户
console.log(getgroups());         // [ 27, 30, 46, 1000, 0 ]
setgid(1000);                     // 删除 root 的 gid
console.log(getgroups());         // [ 27, 30, 46, 1000 ]
```
此功能仅适用于 POSIX 平台（即不适用于 Windows 或安卓）。 此特性在 Worker 线程中不可用。

process.kill(pid[, signal])
pid <number> 进程标识
signal <string> | <number> 要发送的信号，可以是字符串或数字。 默认值: 'SIGTERM'。
process.kill() 方法将 signal 发送到由 pid 标识的进程。

信号名称是字符串，例如 'SIGINT' 或 'SIGHUP'。 有关详细信息，请参阅信号事件和 kill(2)。

如果目标 pid 不存在，则此方法将抛出错误。 作为特殊情况，可以使用信号 0 来测试进程是否存在。 如果使用 pid 来杀死进程组，则 Windows 平台将抛出错误。
尽管此函数的名字是 process.kill()，但它实际上只是信号发送者，就像 kill 系统调用。 发送的信号可能会做其他事情而不是杀死目标进程。
```javascript
import process, { kill } from 'node:process';

process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
});

setTimeout(() => {
  console.log('Exiting.');
  process.exit(0);
}, 100);

kill(process.pid, 'SIGHUP');
```
当 Node.js 进程收到 SIGUSR1 时，Node.js 将启动调试器。 参见信号事件。

process.memoryUsage()
返回: <Object>
- rss <integer>
- heapTotal <integer>
- heapUsed <integer>
- external <integer>
- arrayBuffers <integer>
返回描述 Node.js 进程的内存使用量（以字节为单位）的对象。
```javascript
import { memoryUsage } from 'node:process';

console.log(memoryUsage());
// 打印:
// {
//  rss: 4935680,
//  heapTotal: 1826816,
//  heapUsed: 650472,
//  external: 49879,
//  arrayBuffers: 9386
// }
// heapTotal 和 heapUsed 指的是 V8 的内存使用量。
// external 指的是绑定到 V8 管理的 JavaScript 对象的 C++ 对象的内存使用量。
// rss，常驻集大小，是进程在主内存设备（即总分配内存的子集）中占用的空间量，包括所有 C++ 和 JavaScript 对象和代码。
// arrayBuffers 是指为 ArrayBuffer 和 SharedArrayBuffer 分配的内存，包括所有 Node.js Buffer。 这也包含在 external 值中。 当 Node.js 被用作嵌入式库时，此值可能为 0，因为在这种情况下可能不会跟踪 ArrayBuffer 的分配。
// 当使用 Worker 线程时，则 rss 将是对整个进程都有效的值，而其他字段仅涉及当前线程。
```
process.memoryUsage() 方法遍历每个页面以收集有关内存使用情况的信息，这可能会根据程序内存分配而变慢。

process.memoryUsage.rss()
process.memoryUsage.rss() 方法返回以字节为单位表示驻留集大小的整数 (RSS)。
驻留集大小是进程在主内存设备（即总分配内存的子集）中占用的空间量，包括所有 C++ 和 JavaScript 对象和代码。
*这与 process.memoryUsage() 提供的 rss 属性值相同，但 process.memoryUsage.rss() 更快。*
```javascript
import { memoryUsage } from 'node:process';

console.log(memoryUsage.rss());
// 35655680
```

process.nextTick(callback[, ...args])
callback <Function>
...args <any> 当调用 callback 时要传入的额外参数
process.nextTick() 将 callback 添加到"下一个滴答队列"。 在 JavaScript 堆栈上的当前操作运行完成之后，且在允许事件循环继续之前，此队列将被完全排空。 如果递归地调用 process.nextTick()，则可能会创建无限的循环。
```javascript
import { nextTick } from 'node:process';

console.log('start');
nextTick(() => {
  console.log('nextTick callback');
});
console.log('scheduled');
// 输出：
// start
// scheduled
// nextTick callback
```

这在开发 API 时很重要，以便让用户有机会在对象构建之后但在任何 I/O 发生之前分配事件句柄：
```javascript
import { nextTick } from 'node:process';

function MyThing(options) {
  this.setupOptions(options);

  nextTick(() => {
    this.startDoingStuff();
  });
}

const thing = new MyThing();
thing.getReadyForStuff();

// thing.startDoingStuff() 现在被调用，而不是之前。
```
这对于要 100% 同步或 100% 异步的 API 非常重要。 设想这个示例：

// 警告！不要使用！不安全的危险！
function maybeSync(arg, cb) {
  if (arg) {
    cb();
    return;
  }

  fs.stat('file', cb);
}
此 API 是危险的，因为在以下情况下：

const maybeTrue = Math.random() > 0.5;

maybeSync(maybeTrue, () => {
  foo();
});

bar();
并不清楚是先调用 foo() 还是 bar()。

以下方法要好得多：

import { nextTick } from 'node:process';

function definitelyAsync(arg, cb) {
  if (arg) {
    nextTick(cb);
    return;
  }

  fs.stat('file', cb);
}
何时使用 queueMicrotask() 与 process.nextTick()#
中英对照

queueMicrotask() API 是 process.nextTick() 的替代方案，它还使用用于执行 then、catch 和 finally 处理程序的相同微任务队列来延迟函数的执行。 在 Node.js 中，每次“下一个滴答队列”被排空时，微任务队列也会立即排空。

import { nextTick } from 'node:process';

Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
nextTick(() => console.log(1));
// 输出：
// 1
// 2
// 3
对于_大多数_用户空间用例，queueMicrotask() API 提供了一种可移植且可靠的延迟执行机制，该机制适用于多个 JavaScript 平台环境，应该比 process.nextTick() 更受青睐。 在简单的场景中，queueMicrotask() 可以直接替代 process.nextTick()。

console.log('start');
queueMicrotask(() => {
  console.log('microtask callback');
});
console.log('scheduled');
// 输出：
// start
// scheduled
// microtask callback
两个 API 之间一个值得注意的区别是 process.nextTick() 允许指定额外值，这些值将在调用时作为参数传递给延迟函数。 使用 queueMicrotask() 实现相同的结果需要使用闭包或绑定函数：

function deferred(a, b) {
  console.log('microtask', a + b);
}

console.log('start');
queueMicrotask(deferred.bind(undefined, 1, 2));
console.log('scheduled');
// 输出：
// start
// scheduled
// microtask 3
从下一个滴答队列和微任务队列中引发的错误的处理方式存在细微差别。 在排队的微任务回调中抛出的错误应该在可能的情况下在排队的回调中处理。 如果不是，则可以使用 process.on('uncaughtException') 事件句柄来捕获和处理错误。

如有疑问，除非需要 process.nextTick() 的特定功能，否则请使用 queueMicrotask()。

process.noDeprecation#
中英对照

新增于: v0.8.0
<boolean>
process.noDeprecation 属性指示是否在当前 Node.js 进程上设置了 --no-deprecation 标志。 有关此标志行为的更多信息，请参阅 'warning' 事件和 emitWarning() 方法的文档。

process.pid#
中英对照

新增于: v0.1.15
<integer>
process.pid 属性返回进程的 PID。

import { pid } from 'node:process';

console.log(`This process is pid ${pid}`);
process.platform#
中英对照

新增于: v0.1.16
<string>
process.platform 属性返回用于标识编译 Node.js 二进制文件的操作系统平台的字符串。

目前可能的值是：

'aix'
'darwin'
'freebsd'
'linux'
'openbsd'
'sunos'
'win32'
import { platform } from 'node:process';

console.log(`This platform is ${platform}`);
如果 Node.js 是在安卓操作系统上构建的，则也可能返回值 'android'。 但是，Node.js 中的安卓支持是实验的。

process.ppid#
中英对照

新增于: v9.2.0, v8.10.0, v6.13.0
<integer>
process.ppid 属性返回当前进程的父进程的 PID。

import { ppid } from 'node:process';

console.log(`The parent process is pid ${ppid}`);
process.release#
中英对照

版本历史
<Object>
process.release 属性返回 Object，其中包含与当前版本相关的元数据，包括源 tarball 和 headers-only tarball 的网址。

process.release 包含以下属性：

name <string> 始终为 'node' 的值。
sourceUrl <string> 指向包含当前版本源代码的 .tar.gz 文件的绝对网址。
headersUrl<string> 指向 .tar.gz 文件的绝对网址，该文件仅包含当前版本的源头文件。 该文件比完整的源文件小得多，可用于编译 Node.js 原生插件。
libUrl <string> 指向与当前版本的体系结构和版本匹配的 node.lib 文件的绝对网址。 此文件用于编译 Node.js 原生插件。 此属性仅存在于 Windows 构建的 Node.js 中，在所有其他平台上将缺失。
lts <string> 标识此版本的 LTS 标签的字符串标签。 此属性仅适用于 LTS 版本，对于所有其他版本类型（包括 Current 版本）为 undefined。 有效值包括 LTS 版本代码名称（包括不再受支持的代码名称）。
'Dubnium' 表示以 10.13.0 开头的 10.x LTS 行。
'Erbium' 表示以 12.13.0 开头的 12.x LTS 行。其他 LTS 版本代码名称，请参见 Node.js 更新日志存档
{
  name: 'node',
  lts: 'Erbium',
  sourceUrl: 'https://nodejs.org/download/release/v12.18.1/node-v12.18.1.tar.gz',
  headersUrl: 'https://nodejs.org/download/release/v12.18.1/node-v12.18.1-headers.tar.gz',
  libUrl: 'https://nodejs.org/download/release/v12.18.1/win-x64/node.lib'
}
在源代码树的非发布版本的自定义构建中，可能只存在 name 属性。 不应依赖附加属性的存在。

process.report#
中英对照

版本历史
<Object>
process.report 是一个对象，其方法用于为当前进程生成诊断报告。 报告文档中提供了额外文档。

process.report.compact#
中英对照

新增于: v13.12.0, v12.17.0
<boolean>
以紧凑的单行 JSON 格式编写报告，与专为人类使用而设计的默认多行格式相比，日志处理系统更易于使用。

import { report } from 'node:process';

console.log(`Reports are compact? ${report.compact}`);
process.report.directory#
中英对照

版本历史
<string>
写入报告的目录。 默认值为空字符串，表示将报告写入 Node.js 进程的当前工作目录。

import { report } from 'node:process';

console.log(`Report directory is ${report.directory}`);
process.report.filename#
中英对照

版本历史
<string>
写入报告的文件名。 如果设置为空字符串，则输出文件名将由时间戳、PID 和序列号组成。 默认值为空字符串。

import { report } from 'node:process';

console.log(`Report filename is ${report.filename}`);
process.report.getReport([err])#
中英对照

版本历史
err <Error> 用于报告 JavaScript 堆栈的自定义错误。
返回: <Object>
返回正在运行的进程的诊断报告的 JavaScript 对象表示形式。 报告的 JavaScript 堆栈跟踪取自 err（如果存在）。

import { report } from 'node:process';

const data = report.getReport();
console.log(data.header.nodejsVersion);

// 类似于 process.report.writeReport()
import fs from 'node:fs';
fs.writeFileSync('my-report.log', util.inspect(data), 'utf8');
报告文档中提供了额外文档。

process.report.reportOnFatalError#
中英对照

版本历史
<boolean>
如果为 true，则会生成有关致命错误（例如内存不足错误或 C++ 断言失败）的诊断报告。

import { report } from 'node:process';

console.log(`Report on fatal error: ${report.reportOnFatalError}`);
process.report.reportOnSignal#
中英对照

版本历史
<boolean>
如果为 true，则当进程接收到 process.report.signal 指定的信号时生成诊断报告。

import { report } from 'node:process';

console.log(`Report on signal: ${report.reportOnSignal}`);
process.report.reportOnUncaughtException#
中英对照

版本历史
<boolean>
如果为 true，则针对未捕获的异常生成诊断报告。

import { report } from 'node:process';

console.log(`Report on exception: ${report.reportOnUncaughtException}`);
process.report.signal#
中英对照

版本历史
<string>
用于触发诊断报告创建的信号。 默认为 'SIGUSR2'。

import { report } from 'node:process';

console.log(`Report signal: ${report.signal}`);
process.report.writeReport([filename][, err])#
中英对照

版本历史
filename <string> 写入报告的文件的名称。 这应该是相对路径，如果未指定，它将附加到 process.report.directory 中指定的目录或 Node.js 进程的当前工作目录。

err <Error> 用于报告 JavaScript 堆栈的自定义错误。

返回: <string> 返回生成的报告的文件名。

将诊断报告写入文件。 如果未提供 filename，则默认文件名包括日期、时间、PID 和序列号。 报告的 JavaScript 堆栈跟踪取自 err（如果存在）。

import { report } from 'node:process';

report.writeReport();
报告文档中提供了额外文档。

process.resourceUsage()#
中英对照

新增于: v12.6.0
返回: <Object> 当前进程的资源使用情况。 所有这些值都来自返回 uv_rusage_t struct 的 uv_getrusage 调用。
userCPUTime <integer> 映射到以微秒计算的 ru_utime。 它与 process.cpuUsage().user 的值相同。
systemCPUTime <integer> 映射到以微秒计算的 ru_stime。 它与 process.cpuUsage().system 的值相同。
maxRSS <integer> 映射到 ru_maxrss，其以千字节为单位使用的最大驻留集大小。
sharedMemorySize <integer> 映射到 ru_ixrss 但不受任何平台支持。
unsharedDataSize <integer> 映射到 ru_idrss 但不受任何平台支持。
unsharedStackSize <integer> 映射到 ru_isrss 但不受任何平台支持。
minorPageFault <integer> 映射到 ru_minflt，这是进程的次要页面错误的数量，请参阅这篇文章了解更多详情。
majorPageFault <integer> 映射到 ru_majflt，这是进程的主要页面错误的数量，请参阅这篇文章了解更多详情。 Windows 不支持此字段。
swappedOut <integer> 映射到 ru_nswap 但不受任何平台支持。
fsRead <integer> 映射到 ru_inblock，这是文件系统必须执行输入的次数。
fsWrite <integer> 映射到 ru_oublock，这是文件系统必须执行输出的次数。
ipcSent <integer> 映射到 ru_msgsnd 但不受任何平台支持。
ipcReceived <integer> 映射到 ru_msgrcv 但不受任何平台支持。
signalsCount <integer> 映射到 ru_nsignals 但不受任何平台支持。
voluntaryContextSwitches <integer> 映射到 ru_nvcsw，这是由于进程在其时间片完成之前自愿放弃处理器而导致 CPU 上下文切换的次数（通常是为了等待资源的可用性）。 Windows 不支持此字段。
involuntaryContextSwitches <integer> 映射到 ru_nivcsw，这是由于更高优先级的进程变得可运行或当前进程超过其时间片而导致 CPU 上下文切换的次数。 Windows 不支持此字段。
import { resourceUsage } from 'node:process';

console.log(resourceUsage());
/*
  Will output:
  {
    userCPUTime: 82872,
    systemCPUTime: 4143,
    maxRSS: 33164,
    sharedMemorySize: 0,
    unsharedDataSize: 0,
    unsharedStackSize: 0,
    minorPageFault: 2469,
    majorPageFault: 0,
    swappedOut: 0,
    fsRead: 0,
    fsWrite: 8,
    ipcSent: 0,
    ipcReceived: 0,
    signalsCount: 0,
    voluntaryContextSwitches: 79,
    involuntaryContextSwitches: 1
  }
*/
process.send(message[, sendHandle[, options]][, callback])#
中英对照

新增于: v0.5.9
message <Object>
sendHandle <net.Server> | <net.Socket>
options <Object> 用于参数化某些类型句柄的发送。options 支持以下属性：
keepOpen <boolean> 当传入 net.Socket 实例时可以使用的值。 当为 true 时，套接字在发送过程中保持打开状态。 默认值: false。
callback <Function>
返回: <boolean>
如果使用 IPC 通道衍生 Node.js，则可以使用 process.send() 方法向父进程发送消息。 消息将作为父对象 ChildProcess 对象上的 'message' 事件接收。

如果 Node.js 没有使用 IPC 通道衍生，则 process.send 将是 undefined。

消息经过序列化和解析。 结果消息可能与最初发送的消息不同。

process.setegid(id)#
中英对照

新增于: v2.0.0
id <string> | <number> 群组名或 ID
process.setegid() 方法设置进程的有效群组标识。 （请参阅 setegid(2)。）id 可以作为数字 ID 或群组名称字符串传入。 如果指定了群组名，则此方法在解析关联的数字 ID 时会阻塞。

import process from 'node:process';

if (process.getegid && process.setegid) {
  console.log(`Current gid: ${process.getegid()}`);
  try {
    process.setegid(501);
    console.log(`New gid: ${process.getegid()}`);
  } catch (err) {
    console.log(`Failed to set gid: ${err}`);
  }
}
此功能仅适用于 POSIX 平台（即不适用于 Windows 或安卓）。 此特性在 Worker 线程中不可用。

process.seteuid(id)#
中英对照

新增于: v2.0.0
id <string> | <number> 用户名或 ID
process.seteuid() 方法设置进程的有效用户身份。 （请参阅 seteuid(2)。） id 可以作为数字 ID 或用户名字符串传入。 如果指定了用户名，则该方法在解析关联的数字 ID 时会阻塞。

import process from 'node:process';

if (process.geteuid && process.seteuid) {
  console.log(`Current uid: ${process.geteuid()}`);
  try {
    process.seteuid(501);
    console.log(`New uid: ${process.geteuid()}`);
  } catch (err) {
    console.log(`Failed to set uid: ${err}`);
  }
}
此功能仅适用于 POSIX 平台（即不适用于 Windows 或安卓）。 此特性在 Worker 线程中不可用。

process.setgid(id)#
中英对照

新增于: v0.1.31
id <string> | <number> 群组名或 ID
process.setgid() 方法设置进程的群组标识。 （请参阅 setgid(2)。）id 可以作为数字 ID 或群组名称字符串传入。 如果指定了群组名，则此方法在解析关联的数字 ID 时会阻塞。

import process from 'node:process';

if (process.getgid && process.setgid) {
  console.log(`Current gid: ${process.getgid()}`);
  try {
    process.setgid(501);
    console.log(`New gid: ${process.getgid()}`);
  } catch (err) {
    console.log(`Failed to set gid: ${err}`);
  }
}
此功能仅适用于 POSIX 平台（即不适用于 Windows 或安卓）。 此特性在 Worker 线程中不可用。

process.setgroups(groups)#
中英对照

新增于: v0.9.4
groups <integer[]>
process.setgroups() 方法为 Node.js 进程设置补充群组 ID。 这是一个特权操作，需要 Node.js 进程具有 root 或 CAP_SETGID 能力。

groups 数组可以包含数字群组 ID、群组名称或两者。

import process from 'node:process';

if (process.getgroups && process.setgroups) {
  try {
    process.setgroups([501]);
    console.log(process.getgroups()); // 新组
  } catch (err) {
    console.log(`Failed to set groups: ${err}`);
  }
}
此功能仅适用于 POSIX 平台（即不适用于 Windows 或安卓）。 此特性在 Worker 线程中不可用。

process.setuid(id)#
中英对照

新增于: v0.1.28
id <integer> | <string>
process.setuid(id) 方法设置进程的用户身份。 （请参阅 setuid(2)。） id 可以作为数字 ID 或用户名字符串传入。 如果指定了用户名，则该方法在解析关联的数字 ID 时会阻塞。

import process from 'node:process';

if (process.getuid && process.setuid) {
  console.log(`Current uid: ${process.getuid()}`);
  try {
    process.setuid(501);
    console.log(`New uid: ${process.getuid()}`);
  } catch (err) {
    console.log(`Failed to set uid: ${err}`);
  }
}
此功能仅适用于 POSIX 平台（即不适用于 Windows 或安卓）。 此特性在 Worker 线程中不可用。

process.setSourceMapsEnabled(val)#
中英对照

新增于: v16.6.0, v14.18.0
稳定性: 1 - 实验
val <boolean>
此函数启用或禁用对堆栈跟踪的 Source Map v3 的支持。

它提供与使用命令行选项 --enable-source-maps 启动 Node.js 进程相同的功能。

只有在启用源映射后加载的 JavaScript 文件中的源映射才会被解析和加载。

process.setUncaughtExceptionCaptureCallback(fn)#
中英对照

新增于: v9.3.0
fn <Function> | <null>
process.setUncaughtExceptionCaptureCallback() 函数设置一个函数，当发生未捕获的异常时将调用该函数，该函数将接收异常值本身作为其第一个参数。

如果设置了这样的函数，则不会触发 'uncaughtException' 事件。 如果 --abort-on-uncaught-exception 是从命令行传入的或通过 v8.setFlagsFromString() 设置的，则进程不会中止。 配置为对异常执行的操作（例如报告生成）也将受到影响

要取消捕获功能，可以使用 process.setUncaughtExceptionCaptureCallback(null)。 在设置另一个捕获函数时使用非 null 参数调用此方法将引发错误。

使用此函数与使用已弃用的 domain 内置模块是相互排斥的。

process.stderr#
中英对照

<Stream>
process.stderr 属性返回连接到 stderr (文件描述符 2) 的流。 它是 net.Socket（也就是 Duplex 流），除非文件描述符 2 指向文件，在这种情况下它是 Writable 流。

process.stderr 在一些重要的方面不同于其他 Node.js 流。 有关更多信息，请参阅进程 I/O 的注意事项。

process.stderr.fd#
中英对照

<number>
该属性指的是 process.stderr 的底层文件描述符的值。 该值固定为 2。 在 Worker 线程中，该字段不存在。

process.stdin#
中英对照

<Stream>
process.stdin 属性返回连接到 stdin (文件描述符 0) 的流。 它是 net.Socket（也就是 Duplex 流），除非文件描述符 0 指向文件，在这种情况下它是 Readable 流。

有关如何从 stdin 读取的详细信息，请参阅 readable.read()。

作为 Duplex 流，process.stdin 还可以在为 Node.js v0.10 之前编写的脚本兼容的“旧”模式下使用。 有关更多信息，请参阅流的兼容。

在“旧”流模式下，stdin 流默认是暂停的，所以必须调用 process.stdin.resume() 来读取它。 另请注意，调用 process.stdin.resume() 本身会将流切换到“旧”模式。

process.stdin.fd#
中英对照

<number>
该属性指的是 process.stdin 的底层文件描述符的值。 该值固定为 0。 在 Worker 线程中，该字段不存在。

process.stdout#
中英对照

<Stream>
process.stdout 属性返回连接到 stdout (文件描述符 1) 的流。 它是 net.Socket（也就是 Duplex 流），除非文件描述符 1 指向文件，在这种情况下它是 Writable 流。

例如，要将 process.stdin 复制到 process.stdout：

import { stdin, stdout } from 'node:process';

stdin.pipe(stdout);
process.stdout 在一些重要的方面不同于其他 Node.js 流。 有关更多信息，请参阅进程 I/O 的注意事项。

process.stdout.fd#
中英对照

<number>
该属性指的是 process.stdout 的底层文件描述符的值。 该值固定为 1。 在 Worker 线程中，该字段不存在。

进程 I/O 的注意事项#
中英对照

process.stdout 和 process.stderr 在重要方面与其他 Node.js 流不同：

它们分别由 console.log() 和 console.error() 内部使用。
Writes may be synchronous depending on what the stream is connected to and whether the system is Windows or POSIX:
文件：在 Windows 和 POSIX 上是_同步的_
TTY（终端）: 在 Windows 上是_异步的_，在 POSIX 上是_同步的_
管道（和套接字）: 在 Windows 上是_同步的_，在 POSIX 上是_异步的_
这些行为部分是出于历史原因，因为更改它们会导致向后不兼容，但某些用户也期望它们。

同步写入避免了诸如使用 console.log() 或 console.error() 写入的输出意外交错的问题，或者如果在异步写入完成之前调用 process.exit() 则根本不写入。 有关详细信息，请参阅 process.exit()。

警告：同步写入会阻塞事件循环，直到写入完成。 在输出到文件的情况下，这可能几乎是瞬时的，但在系统负载高、接收端未读取管道或终端或文件系统速度较慢的情况下，事件循环可能经常被阻塞足够长，足以对性能产生严重的负面影响。 这在写入交互式终端会话时可能不是问题，但在对流程输出流进行生产日志记录时要特别小心。

要检查流是否连接到 TTY 上下文，请检查 isTTY 属性。

例如：

$ node -p "Boolean(process.stdin.isTTY)"
true
$ echo "foo" | node -p "Boolean(process.stdin.isTTY)"
false
$ node -p "Boolean(process.stdout.isTTY)"
true
$ node -p "Boolean(process.stdout.isTTY)" | cat
false
有关更多信息，请参阅 TTY 文档。

process.throwDeprecation#
中英对照

新增于: v0.9.12
<boolean>
process.throwDeprecation 的初始值表示当前 Node.js 进程是否设置了 --throw-deprecation 标志。 process.throwDeprecation 是可变的，因此可能会在运行时更改弃用警告是否导致错误。 有关更多信息，请参阅 'warning' 事件和 emitWarning() 方法的文档。

$ node --throw-deprecation -p "process.throwDeprecation"
true
$ node -p "process.throwDeprecation"
undefined
$ node
> process.emitWarning('test', 'DeprecationWarning');
undefined
> (node:26598) DeprecationWarning: test
> process.throwDeprecation = true;
true
> process.emitWarning('test', 'DeprecationWarning');
Thrown:
[DeprecationWarning: test] { name: 'DeprecationWarning' }
process.title#
中英对照

新增于: v0.1.104
<string>
process.title 属性返回当前进程标题（即返回 ps 的当前值）。 为 process.title 分配一个新值会修改 ps 的当前值。

分配新值时，不同平台会对标题施加不同的最大长度限制。 通常这种限制是相当有限的。 例如，在 Linux 和 macOS 上，process.title 被限制为二进制名称的大小加上命令行参数的长度，因为设置 process.title 会覆盖进程的 argv 内存。 Node.js v0.8 通过覆盖 environ 内存允许更长的进程标题字符串，但这在某些（相当模糊的）情况下可能不安全和混乱。

将值分配给 process.title 可能不会在进程管理器应用程序（例如 macOS 活动监视器或 Windows 服务管理器）中产生准确的标签。

process.traceDeprecation#
中英对照

新增于: v0.8.0
<boolean>
process.traceDeprecation 属性指示是否在当前 Node.js 进程上设置了 --trace-deprecation 标志。 有关此标志行为的更多信息，请参阅 'warning' 事件和 emitWarning() 方法的文档。

process.umask()#
中英对照

版本历史
稳定性: 0 - 弃用. 不带参数调用 process.umask() 会导致进程范围的 umask 被写入两次。 这会在线程之间引入竞争条件，并且是一个潜在的安全漏洞。 没有安全的、跨平台的替代 API。
process.umask() 返回 Node.js 进程的文件模式创建掩码。 子进程从父进程继承掩码。

process.umask(mask)#
中英对照

新增于: v0.1.19
mask <string> | <integer>
process.umask(mask) 设置 Node.js 进程的文件模式创建掩码。 子进程从父进程继承掩码。 返回上一个掩码。

import { umask } from 'node:process';

const newmask = 0o022;
const oldmask = umask(newmask);
console.log(
  `Changed umask from ${oldmask.toString(8)} to ${newmask.toString(8)}`
);
在 Worker 线程中，process.umask(mask) 会抛出异常。

process.uptime()#
中英对照

新增于: v0.5.0
返回: <number>
process.uptime() 方法返回当前 Node.js 进程已经运行的秒数。

返回值包括几分之一秒。 使用 Math.floor() 获得整秒。

process.version#
中英对照

新增于: v0.1.3
<string>
process.version 属性包含 Node.js 版本字符串。

import { version } from 'node:process';

console.log(`Version: ${version}`);
// Version: v14.8.0
要获取不带 v 的版本字符串，则使用 process.versions.node。

process.versions#
中英对照

版本历史
<Object>
process.versions 属性返回对象，其中列出了 Node.js 的版本字符串及其依赖项。 process.versions.modules 表示当前的 ABI 版本，每当 C++ API 更改时都会增加。 Node.js 将拒绝加载针对不同模块 ABI 版本编译的模块。

import { versions } from 'node:process';

console.log(versions);
将生成类似于以下内容的对象：

{ node: '11.13.0',
  v8: '7.0.276.38-node.18',
  uv: '1.27.0',
  zlib: '1.2.11',
  brotli: '1.0.7',
  ares: '1.15.0',
  modules: '67',
  nghttp2: '1.34.0',
  napi: '4',
  llhttp: '1.1.1',
  openssl: '1.1.1b',
  cldr: '34.0',
  icu: '63.1',
  tz: '2018e',
  unicode: '11.0' }
退出码#
中英对照

当没有更多异步操作挂起时，Node.js 通常会以 0 状态代码退出。 在其他情况下使用以下状态代码：

1 未捕获的致命异常：存在未捕获的异常，并且其没有被域或 'uncaughtException' 事件句柄处理。
2: 未使用（由 Bash 预留用于内置误用）
3 内部 JavaScript 解析错误：Node.js 引导过程中的内部 JavaScript 源代码导致解析错误。 这是极其罕见的，通常只能在 Node.js 本身的开发过程中发生。
4 内部 JavaScript 评估失败：Node.js 引导过程中的内部 JavaScript 源代码在评估时未能返回函数值。 这是极其罕见的，通常只能在 Node.js 本身的开发过程中发生。
5 致命错误：V8 中存在不可恢复的致命错误。 通常将打印带有前缀 FATAL ERROR 的消息到标准错误。
6 非函数的内部异常句柄：存在未捕获的异常，但内部致命异常句柄不知何故设置为非函数，无法调用。
7 内部异常句柄运行时失败：存在未捕获的异常，并且内部致命异常句柄函数本身在尝试处理时抛出错误。 例如，如果 'uncaughtException' 或 domain.on('error') 句柄抛出错误，就会发生这种情况。
8: 未使用。 在以前版本的 Node.js 中，退出码 8 有时表示未捕获的异常。
9 无效参数：指定了未知选项，或者提供了需要值的选项而没有值。
10 内部 JavaScript 运行时失败：Node.js 引导过程中的内部 JavaScript 源代码在调用引导函数时抛出错误。 这是极其罕见的，通常只能在 Node.js 本身的开发过程中发生。
12 无效的调试参数：设置了 --inspect 和/或 --inspect-brk 选项，但选择的端口号无效或不可用。
13 未完成的顶层等待：在顶层代码中的函数外使用了 await，但传入的 Promise 从未解决。
>128 信号退出：如果 Node.js 收到致命的信号，例如 SIGKILL 或 SIGHUP，则其退出码将是 128 加上信号代码的值。 这是标准的 POSIX 实践，因为退出码被定义为 7 位整数，并且信号退出设置高位，然后包含信号代码的值。 例如，信号 SIGABRT 的值是 6，因此预期的退出码将是 128 + 6 或 134。