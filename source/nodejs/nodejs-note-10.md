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
