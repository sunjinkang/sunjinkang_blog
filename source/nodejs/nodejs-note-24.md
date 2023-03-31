---
title: nodejs基础知识(14)
date: 2023-03-05 20:23:34
tags: [node, readline 逐行读取, stream 流]
---

#### readline 逐行读取

###### InterfaceConstructor 类
InterfaceConstructor 类的实例是使用 readlinePromises.createInterface() 或 readline.createInterface() 方法构造的。 每个实例都与单个 input 可读流和单个 output 可写流相关联。 output 流用于打印到达并从 input 流中读取的用户输入的提示。

'close' 事件
发生以下情况之一时会触发 'close' 事件：
- rl.close() 方法被调用，InterfaceConstructor 实例放弃了对 input 和 output 流的控制；
- input 流接收到它的 'end' 事件；
- input 流接收 Ctrl+D 以发出传输结束（EOT）的信号；
- input 流接收 Ctrl+C 以发出 SIGINT 信号，并且在 InterfaceConstructor 实例上没有注册 'SIGINT' 事件监听器。

调用监听器函数时不传入任何参数。
一旦触发 'close' 事件，则 InterfaceConstructor 实例就完成了。


'line' 事件
每当 input 流接收到行尾输入（\n、\r 或 \r\n）时，则会触发 'line' 事件。 这通常发生在用户按下 回车 或 返回 时。
如果从流中读取了新数据并且该流在没有最终行尾标记的情况下结束，也会触发 'line' 事件。
使用包含单行接收输入的字符串调用监听器函数。

'history' 事件
每当历史数组发生更改时，则会触发 'history' 事件。
使用包含历史数组的数组调用监听器函数。 它将反映由于 historySize 和 removeHistoryDuplicates 引起的所有更改、添加的行和删除的行。
主要目的是允许监听器保留历史记录。 监听器也可以更改历史对象。 这可能有助于防止将某些行添加到历史记录中，例如密码。


'resume' 事件
每当 input 流恢复时，则会触发 'resume' 事件。
调用监听器函数时不传入任何参数。

'SIGCONT' 事件
当之前使用 Ctrl+Z（即 SIGTSTP）移动到后台的 Node.js 进程然后使用 fg(1p) 返回到前台时，则会触发 'SIGCONT' 事件。
如果 input 流在 SIGTSTP 请求之前暂停，则不会触发此事件。
Windows 不支持 'SIGCONT' 事件。

'SIGINT' 事件
每当 input 流接收到 Ctrl+C 输入（通常称为 SIGINT）时，则会触发 'SIGINT' 事件。 如果在 input 流接收到 SIGINT 时没有注册 'SIGINT' 事件监听器，则将触发 'pause' 事件。

rl.close()
rl.close() 方法关闭 InterfaceConstructor 实例并放弃对 input 和 output 流的控制。 当调用时，将触发 'close' 事件。
调用 rl.close() 不会立即阻止其他由 InterfaceConstructor 实例触发的事件（包括 'line'）。

rl.pause()
rl.pause() 方法暂停 input 流，允许它稍后在必要时恢复。
调用 rl.pause() 不会立即暂停其他由 InterfaceConstructor 实例触发的事件（包括 'line'）。

rl.prompt([preserveCursor])
preserveCursor <boolean> 如果为 true，则防止光标位置重置为 0。
rl.prompt() 方法将配置为 prompt 的 InterfaceConstructor 实例写入 output 中的新行，以便为用户提供用于提供输入的新位置。
当调用时，如果 rl.prompt() 流已暂停，则 rl.prompt() 将恢复 input 流。
如果 InterfaceConstructor 是在 output 设置为 null 或 undefined 的情况下创建的，则不会写入提示。

rl.question(query[, options], callback)
query <string> 要写入 output 的语句或查询，位于提示之前。
options <Object>
- signal <AbortSignal> 可选择允许使用 AbortController 取消 question()。
callback <Function> 使用用户输入调用的回调函数以响应 query。
rl.question() 方法通过将 query 写入 output 来显示 query，等待在 input 上提供用户输入，然后调用 callback 函数，将提供的输入作为第一个参数传入。

当调用时，如果 rl.question() 流已暂停，则 rl.question() 将恢复 input 流。
如果 InterfaceConstructor 是在 output 设置为 null 或 undefined 的情况下创建的，则不会写入 query。
传给 rl.question() 的 callback 函数不遵循接受 Error 对象或 null 作为第一个参数的典型模式。 以提供的答案作为唯一参数调用 callback。
在 rl.close() 之后调用 rl.question() 会报错。

rl.resume()
如果 input 流已暂停，则 rl.resume() 方法会恢复该流。

rl.setPrompt(prompt)
rl.setPrompt() 方法设置了在调用 rl.prompt() 时将写入 output 的提示。

rl.getPrompt()
rl.getPrompt() 方法返回 rl.prompt() 使用的当前提示。

rl.write(data[, key])
data <string>
key <Object>
- ctrl <boolean> true 表示 Ctrl 键。
- meta <boolean> true 表示 Meta 键。
- shift <boolean> true 表示 Shift 键。
- name <string> 键的名称。
rl.write() 方法会将 data 或由 key 标识的键序列写入 output。 仅当 output 是 TTY 文本终端时才支持 key 参数。 
如果指定了 key，则忽略 data。
当调用时，如果 rl.write() 流已暂停，则 rl.write() 将恢复 input 流。

如果 InterfaceConstructor 是在 output 设置为 null 或 undefined 的情况下创建的，则不会写入 data 和 key。
rl.write() 方法将数据写入 readline Interface 的 input，就好像它是由用户提供的一样。

rl[Symbol.asyncIterator]()
创建 AsyncIterator 对象，该对象遍历输入流中的每一行作为字符串。 此方法允许通过 for await...of 循环异步迭代 InterfaceConstructor 对象。
输入流中的错误不会被转发。
*如果循环以 break、throw 或 return 终止，则将调用 rl.close()。 换句话说，迭代 InterfaceConstructor 将始终完全消费输入流。*
性能无法与传统的 'line' 事件 API 相提并论。 *对于性能敏感的应用程序，请改用 'line'。*
*readline.createInterface() 将在调用后开始使用输入流。 在接口创建和异步迭代之间进行异步操作可能会导致丢失行。*


Promises API

readlinePromises.Interface 类
readlinePromises.Interface 类的实例是使用 readlinePromises.createInterface() 方法构造的。 每个实例都与单个 input 可读流和单个 output 可写流相关联。 output 流用于打印到达并从 input 流中读取的用户输入的提示。

rl.question(query[, options])
query <string> 要写入 output 的语句或查询，位于提示之前。
options <Object>
- signal <AbortSignal> 可选择允许使用 AbortSignal 取消 question()。
返回: <Promise> 使用用户响应 query 的输入履行的 promise。
*其他特性与rl.question(query[, options], callback)类似*


readlinePromises.Readline 类

new readlinePromises.Readline(stream[, options])
stream <stream.Writable> TTY 流。
options <Object>
- autoCommit <boolean> 如果是 true，则不需要调用 rl.commit()。


rl.clearLine(dir)
dir <integer>
-1: 从光标向左
1: 从光标向右
0: 整行
rl.clearLine() 方法在待处理动作的内部列表中添加一个动作，该动作在 dir 标识的指定方向上清除关联 stream 的当前行。 调用 rl.commit() 看看这个方法的效果，除非 autoCommit: true 传给了构造函数。


rl.clearScreenDown()
rl.clearScreenDown() 方法向待处理动作的内部列表添加一个动作，该动作从光标向下的当前位置清除关联流。 

rl.commit()
rl.commit() 方法将所有待处理的操作发送到关联的 stream 并清除待处理操作的内部列表。

rl.rollback()
rl.rollback 方法清除内部待处理操作列表，而不将其发送到关联的 stream。

readlinePromises.createInterface(options)

completer 函数的使用
completer 函数将用户输入的当前行作为参数，并返回包含 2 个条目的 Array：
- 使用匹配条目的 Array 补全。
- 用于匹配的子字符串。
completer 函数也可以返回 <Promise>，或者是异步的

###### Callback API

readline.Interface 类
继承自: <readline.InterfaceConstructor>
readline.Interface 类的实例是使用 readline.createInterface() 方法构造的。 每个实例都与单个 input 可读流和单个 output 可写流相关联。 output 流用于打印到达并从 input 流中读取的用户输入的提示。


示例：微型 CLI
下面的例子说明了使用 readline.Interface 类来实现一个微型的命令行界面：
```javascript
const readline = require('node:readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> '
});

rl.prompt();

rl.on('line', (line) => {
  switch (line.trim()) {
    case 'hello':
      console.log('world!');
      break;
    default:
      console.log(`Say what? I might have heard '${line.trim()}'`);
      break;
  }
  rl.prompt();
}).on('close', () => {
  console.log('Have a great day!');
  process.exit(0);
});
```

示例：逐行读取文件流
readline 的一个常见用例是每次一行地消费输入文件。 最简单的方式是利用 fs.ReadStream API 和 for await...of 循环：
```javascript
const fs = require('node:fs');
const readline = require('node:readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('input.txt');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // 注意：使用 crlfDelay 选项
  // 将 input.txt 中的所有 CR LF ('\r\n') 实例识别为单个换行符。

  for await (const line of rl) {
    // input.txt 中的每一行都将在此处作为 `line` 连续可用。
    console.log(`Line from file: ${line}`);
  }
}
processLineByLine();
```
或者，可以使用 'line' 事件：
```javascript
const fs = require('node:fs');
const readline = require('node:readline');

const rl = readline.createInterface({
  input: fs.createReadStream('sample.txt'),
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  console.log(`Line from file: ${line}`);
});
```
目前，for await...of 循环可能会慢一点。 如果 async / await 流量和速度都必不可少，则可以应用混合方法：
```javascript
const { once } = require('node:events');
const { createReadStream } = require('node:fs');
const { createInterface } = require('node:readline');

(async function processLineByLine() {
  try {
    const rl = createInterface({
      input: createReadStream('big-file.txt'),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      // 处理行。
    });

    await once(rl, 'close');

    console.log('File processed.');
  } catch (err) {
    console.error(err);
  }
})();
```

#### stream 流

流的类型
Node.js 中有四种基本的流类型：
- Writable: 可以写入数据的流（例如，fs.createWriteStream()）。
- Readable: 可以从中读取数据的流（例如，fs.createReadStream()）。
- Duplex: Readable 和 Writable 的流（例如，net.Socket）。
- Transform: 可以在写入和读取数据时修改或转换数据的 Duplex 流（例如，zlib.createDeflate()）。
此外，此模块还包括实用函数 stream.pipeline()、stream.finished()、stream.Readable.from() 和 stream.addAbortSignal()。

流的 Promise API
stream/promises API 为返回 Promise 对象（而不是使用回调）的流提供了一组替代的异步实用函数。 API 可通过 require('node:stream/promises') 或 require('node:stream').promises 访问。

对象模式
Node.js API 创建的所有流都只对字符串和 Buffer（或 Uint8Array）对象进行操作。 但是，流的实现可以使用其他类型的 JavaScript 值（除了 null，它在流中具有特殊用途）。 这样的流被认为是在"对象模式"下运行的。

*流的实例在创建流时使用 objectMode 选项切换到对象模式。 尝试将现有的流切换到对象模式是不安全的。*

缓冲
Writable 和 Readable 流都将数据存储在内部缓冲区中。
可能缓冲的数据量取决于传给流的构造函数的 highWaterMark 选项。 
*对于普通的流，highWaterMark 选项指定字节的总数。 对于在对象模式下操作的流，highWaterMark 指定对象的总数。*

当实现调用 stream.push(chunk) 时，数据缓存在 Readable 流中。 如果流的消费者没有调用 stream.read()，则数据会一直驻留在内部队列中，直到被消费。

一旦内部读取缓冲区的总大小达到 highWaterMark 指定的阈值，则流将暂时停止从底层资源读取数据，直到可以消费当前缓冲的数据（也就是，流将停止调用内部的用于填充读取缓冲区 readable._read() 方法）。

当重复调用 writable.write(chunk) 方法时，数据会缓存在 Writable 流中。 虽然内部的写入缓冲区的总大小低于 highWaterMark 设置的阈值，但对 writable.write() 的调用将返回 true。 一旦内部缓冲区的大小达到或超过 highWaterMark，则将返回 false。

stream API 的一个关键目标，尤其是 stream.pipe() 方法，是将数据缓冲限制在可接受的水平，以便不同速度的来源和目标不会压倒可用内存。

highWaterMark 选项是阈值，而不是限制：它规定了流在停止请求更多数据之前缓冲的数据量。 它通常不强制执行严格的内存限制。 特定的流实现可能会选择实施更严格的限制，但这样做是可选的。

由于 Duplex 和 Transform 流都是 Readable 和 Writable，因此每个流都维护两个独立的内部缓冲区，用于读取和写入，允许每一端独立操作，同时保持适当且高效的数据流。 例如，net.Socket 实例是 Duplex 流，其 Readable 端允许消费从套接字接收的数据，其 Writable 端允许将数据写入套接字。 因为数据可能以比接收数据更快或更慢的速度写入套接字，所以每一端都应该独立于另一端进行操作（和缓冲）。

内部缓冲的机制是内部的实现细节，可能随时更改。 但是，对于某些高级实现，可以使用 writable.writableBuffer 或 readable.readableBuffer 检索内部的缓冲区。 不鼓励使用这些未记录的属性。

流消费者的 API
几乎所有的 Node.js 应用程序，无论多么简单，都以某种方式使用流。 以下是在实现 HTTP 服务器的 Node.js 应用程序中使用流的示例：
```javascript
const http = require('node:http');

const server = http.createServer((req, res) => {
  // `req` 是 http.IncomingMessage，它是可读流。
  // `res` 是 http.ServerResponse，它是可写流。

  let body = '';
  // 以 utf8 字符串形式获取数据。
  // 如果未设置编码，则将接收缓冲区对象。
  req.setEncoding('utf8');

  // 一旦添加了监听器，则可读流就会触发 'data' 事件。
  req.on('data', (chunk) => {
    body += chunk;
  });

  // 'end' 事件表示已经接收到整个正文。
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // 给用户回写一些有趣的东西：
      res.write(typeof data);
      res.end();
    } catch (er) {
      // 哦哦！糟糕的 json！
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token o in JSON at position 1
```
Writable 流（例如示例中的 res）暴露了用于将数据写入流的方法，例如 write() 和 end()。

当数据可从流中读取时，Readable 流使用 EventEmitter API 来通知应用程序代码。 可以通过多种方式从流中读取可用数据。

Writable 和 Readable 流都以各种方式使用 EventEmitter API 来传达流的当前状态。

Duplex 和 Transform 流都是 Writable 和 Readable。

向流中写入数据或从流中消费数据的应用程序不需要直接实现流的接口，并且通常没有理由调用 require('node:stream')。

希望实现新类型的流的开发者应参考流实现者的 API 章节。

可写流
Writable 流的示例包括：
- 客户端上的 HTTP 请求
- 服务器上的 HTTP 响应
- 文件系统写入流
- 压缩流
- 加密流
- TCP 套接字
- 子进程标准输入
- process.stdout、process.stderr
其中一些示例实际上是实现 Writable 接口的 Duplex 流。

所有的 Writable 流都实现了 stream.Writable 类定义的接口。

虽然 Writable 流的特定实例可能以各种方式不同，但所有的 Writable 流都遵循相同的基本使用模式，如下例所示：


stream.Writable 类

'close' 事件
当流及其任何底层资源（例如文件描述符）已关闭时，则会触发 'close' 事件。 该事件表明将不再触发更多事件，并且不会发生进一步的计算。

*如果 Writable 流是使用 emitClose 选项创建的，则始终会触发 'close' 事件。*


'error' 事件
如果在写入或管道数据时发生错误，则会触发 'error' 事件。 监听器回调在调用时传入单个 Error 参数。
除非在创建流时将 autoDestroy 选项设置为 false，否则当触发 'error' 事件时将关闭流。
在 'error' 之后，不应触发除 'close' 之外的其他事件（包括 'error' 事件）。

'finish' 事件
在调用 stream.end() 方法之后，并且所有数据都已刷新到底层系统，则触发 'finish' 事件。
```javascript
const writer = getWritableStreamSomehow();
for (let i = 0; i < 100; i++) {
  writer.write(`hello, #${i}!\n`);
}
writer.on('finish', () => {
  console.log('All writes are now complete.');
});
writer.end('This is the end\n');
```

'pipe' 事件
src <stream.Readable> 管道到此可写流的源流
当在可读流上调用 stream.pipe() 方法将此可写流添加到其目标集时，则触发 'pipe' 事件。
```javascript
const writer = getWritableStreamSomehow();
const reader = getReadableStreamSomehow();
writer.on('pipe', (src) => {
  console.log('Something is piping into the writer.');
  assert.equal(src, reader);
});
reader.pipe(writer);
```

'unpipe' 事件
src <stream.Readable> 取消管道此可写流的源流
当在 Readable 流上调用 stream.unpipe() 方法时，则会触发 'unpipe' 事件，从其目标集合中删除此 Writable。
当 Readable 流管道进入它时，如果此 Writable 流触发错误，则这也会触发。

writable.cork()
writable.cork() 方法强制所有写入的数据都缓存在内存中。 当调用 stream.uncork() 或 stream.end() 方法时，缓冲的数据将被刷新。

writable.cork() 的主要目的是适应将几个小块快速连续写入流的情况。 writable.cork() 不是立即将它们转发到底层目标，而是缓冲所有块，直到 writable.uncork() 被调用，如果存在，writable.uncork() 会将它们全部传给 writable._writev()。 这可以防止在等待处理第一个小块时正在缓冲数据的行头阻塞情况。 但是，在不实现 writable._writev() 的情况下使用 writable.cork() 可能会对吞吐量产生不利影响。


writable.destroy([error])
error <Error> 可选，与 'error' 事件一起触发的错误。
返回: <this>
销毁流 可选地触发 'error' 事件，并且触发 'close' 事件（除非 emitClose 设置为 false）。 在此调用之后，则可写流已结束，随后对 write() 或 end() 的调用将导致 ERR_STREAM_DESTROYED 错误。 这是销毁流的破坏性和直接的方式。 先前对 write() 的调用可能没有排空，并且可能触发 ERR_STREAM_DESTROYED 错误。 如果数据应该在关闭之前刷新，或者在销毁流之前等待 'drain' 事件，则使用 end() 而不是销毁。
```javascript
const { Writable } = require('node:stream');

const myStream = new Writable();

const fooErr = new Error('foo error');
myStream.destroy(fooErr);
myStream.on('error', (fooErr) => console.error(fooErr.message)); // foo error


const { Writable } = require('node:stream');

const myStream = new Writable();

myStream.destroy();
myStream.on('error', function wontHappen() {});


const { Writable } = require('node:stream');

const myStream = new Writable();
myStream.destroy();

myStream.write('foo', (error) => console.error(error.code));
// ERR_STREAM_DESTROYED
```
一旦 destroy() 被调用，任何进一步的调用都将是空操作，除了来自 _destroy() 的其他错误可能不会作为 'error' 触发。
实现者不应覆盖此方法，而应实现 writable._destroy()。


writable.uncork()
writable.uncork() 方法会刷新自调用 stream.cork() 以来缓冲的所有数据。

当使用 writable.cork() 和 writable.uncork() 管理写入流的缓冲时，使用 process.nextTick() 推迟对 writable.uncork() 的调用。 这样做允许对在给定 Node.js 事件循环阶段中发生的所有 writable.write() 调用进行批处理。
如果在一个流上多次调用 writable.cork() 方法，则必须调用相同数量的 writable.uncork() 调用来刷新缓冲的数据。
```javascript
stream.cork();
stream.write('some ');
stream.cork();
stream.write('data ');
process.nextTick(() => {
  stream.uncork();
  // 在第二次调用 uncork() 之前不会刷新数据。
  stream.uncork();
});
```
另见: writable.cork()。


writable.writableCorked
需要调用 writable.uncork() 以完全解开流的次数。

writable.errored
如果流因错误而被销毁，则返回错误。

writable.writableHighWaterMark
返回创建此 Writable 时传入的 highWaterMark 的值。

writable.writableLength
此属性包含队列中准备写入的字节数（或对象数）。 该值提供有关 highWaterMark 状态的内省数据。


可读流
可读流是对被消费的数据的来源的抽象。

Readable 流的示例包括：
- 客户端上的 HTTP 响应
- 服务器上的 HTTP 请求
- 文件系统读取流
- 压缩流
- 加密流
- TCP 套接字
- 子进程的标准输出和标准错误
- process.stdin
所有的 Readable 流都实现了 stream.Readable 类定义的接口。

两种读取模式
Readable 流以两种模式之一有效地运行：流动和暂停。 这些模式与对象模式是分开的。 Readable 流可以处于或不处于对象模式，无论其是处于流动模式还是暂停模式。

在流动模式下，数据会自动从底层系统读取，并通过 EventEmitter 接口使用事件尽快提供给应用程序。
在暂停模式下，必须显式调用 stream.read() 方法以从流中读取数据块。
所有的 Readable 流都以暂停模式开始，但可以通过以下方式之一切换到流动模式：
- 添加 'data' 事件句柄。
- 调用 stream.resume() 方法。
- 调用 stream.pipe() 方法将数据发送到 Writable。

Readable 可以使用以下方法之一切换回暂停模式：
- 如果没有管道目标，则通过调用 stream.pause() 方法。
- 如果有管道目标，则删除所有管道目标。 可以通过调用 stream.unpipe() 方法删除多个管道目标。
要记住的重要概念是，在提供消费或忽略该数据的机制之前，Readable 不会产生数据。 如果消费机制被禁用或移除，则 Readable 将尝试停止产生数据。

出于向后兼容性的原因，删除 'data' 事件句柄不会自动暂停流。 此外，如果有管道目标，则调用 stream.pause() 将不能保证一旦这些目标排空并要求更多数据，流将保持暂停状态。

如果 Readable 切换到流动模式并且没有消费者可用于处理数据，则数据将被丢失。 例如，当调用 readable.resume() 方法而没有绑定到 'data' 事件的监听器时，或者当从流中删除 'data' 事件句柄时，就会发生这种情况。

添加 'readable' 事件句柄会自动使流停止流动，并且必须通过 readable.read() 来消费数据。 如果删除了 'readable' 事件句柄，则如果有 'data' 事件句柄，流将再次开始流动。


三种状态
Readable 流的操作的"两种模式"是对 Readable 流实现中发生的更复杂的内部状态管理的简化抽象。
具体来说，在任何给定的时间点，每个 Readable 都处于三种可能的状态之一：
- readable.readableFlowing === null
- readable.readableFlowing === false
- readable.readableFlowing === true
当 readable.readableFlowing 为 null 时，则不提供消费流数据的机制。 因此，流不会生成数据。 在此状态下，为 'data' 事件绑定监听器、调用 readable.pipe() 方法、或调用 readable.resume() 方法会将 readable.readableFlowing 切换到 true，从而使 Readable 在生成数据时开始主动触发事件。

调用readable.pause()、readable.unpipe()、或者接收背压都会导致 readable.readableFlowing 被设置为 false，暂时停止事件的流动，但不会停止数据的生成。 在此状态下，为 'data' 事件绑定监听器不会将 readable.readableFlowing 切换到 true。
```javascript
const { PassThrough, Writable } = require('node:stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing 现在为 false。

pass.on('data', (chunk) => { console.log(chunk.toString()); });
pass.write('ok');  // 不会触发 'data'。
pass.resume();     // 必须调用才能使流触发 'data'。
```
虽然 readable.readableFlowing 是 false，但数据可能会在流的内部缓冲区中累积。

选择一种接口风格
*Readable 流的 API 跨越多个 Node.js 版本的演进，并提供了多种消费流数据的方法。 一般情况下，开发者应该选择其中一种消费数据的方式，切忌使用多种方式消费单一流中的数据。 具体来说，使用 on('data')、on('readable')、pipe() 或异步迭代器的组合可能会导致不直观的行为。*

stream.Readable 类

readable.pipe(destination[, options])
- destination <stream.Writable> 写入数据的目标
- options <Object> 管道选项
  - end <boolean> 当读取结束时结束写入。 默认值: true。
返回: <stream.Writable> 目标，如果它是 Duplex 或 Transform 流，则允许使用管道链
readable.pipe() 方法将 Writable 流绑定到 readable，使其自动切换到流动模式并将其所有数据推送到绑定的 Writable。 数据流将被自动管理，以便目标 Writable 流不会被更快的 Readable 流漫过。
可以将多个 Writable 流绑定到单个 Readable 流。

readable.read([size])
size <number> 用于指定要读取的数据量的可选参数。
返回: <string> | <Buffer> | <null> | <any>
readable.read() 方法从内部缓冲区中读取数据并返回。 如果没有数据可以读取，则返回 null。 
*默认情况下，除非使用 readable.setEncoding() 方法指定了编码或流在对象模式下运行，否则数据将作为 Buffer 对象返回。*
可选的 size 参数指定要读取的特定字节数。 如果无法读取 size 字节，则将返回 null，除非流已结束，在这种情况下，将返回内部缓冲区中剩余的所有数据。
如果未指定 size 参数，则将返回内部缓冲区中包含的所有数据。
*size 参数必须小于或等于 1 GiB。*
*readable.read() 方法应该只在暂停模式下操作的 Readable 流上调用。 在流动模式下，会自动调用 readable.read()，直到内部缓冲区完全排空。*

每次调用 readable.read() 都会返回一个数据块或 null。 块不是串联的。 需要 while 循环来消费当前缓冲区中的所有数据。 当读取大文件时，.read() 可能会返回 null，到目前为止已经消费了所有缓冲的内容，但是还有更多的数据尚未缓冲。 在这种情况下，当缓冲区中有更多数据时，将触发新的 'readable' 事件。 最后，当没有更多数据时，则将触发 'end' 事件。

因此，要从 readable 读取文件的全部内容，必须跨越多个 'readable' 事件来收集块：
```javascript
const chunks = [];

readable.on('readable', () => {
  let chunk;
  while (null !== (chunk = readable.read())) {
    chunks.push(chunk);
  }
});

readable.on('end', () => {
  const content = chunks.join('');
});
```
*对象模式下的 Readable 流将始终从对 readable.read(size) 的调用返回单个条目，而不管 size 参数的值如何。*
*如果 readable.read() 方法返回数据块，则还将触发 'data' 事件。*
在 'end' 事件触发后调用 stream.read([size]) 将返回 null。 不会引发运行时错误。

readable.readable
如果调用 readable.read() 是安全的，则为 true，这意味着流尚未被销毁或触发 'error' 或 'end'。

readable.readableAborted
返回在触发 'end' 之前流是被破销毁或出错。

readable.readableDidRead
返回是否已触发 'data'。

readable.errored
如果流因错误而被销毁，则返回错误。

readable.readableFlowing
此属性反映了 Readable 流的当前状态，如三种状态章节所述。

readable.resume()
readable.resume() 方法使被显式暂停的 Readable 流恢复触发 'data' 事件，将流切换到流动模式。

readable.resume() 方法可用于完全地消费流中的数据，而无需实际处理任何数据：
```javascript
getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('Reached the end, but did not read anything.');
  });
```
*如果有 'readable' 事件监听器，则 readable.resume() 方法不起作用。*

readable.iterator([options])
options <Object>
- destroyOnReturn <boolean> 当设置为 false 时，在异步迭代器上调用 return 或使用 break、return 或 throw 退出 for await...of 迭代不会销毁流。 默认值: true。
返回: <AsyncIterator> 消费流。
如果 for await...of 循环由 return、break 或 throw 退出，或者如果流在迭代期间发出错误，迭代器是否应该销毁流，则此方法创建的迭代器为用户提供了取消流销毁的选项。
```javascript
const { Readable } = require('node:stream');

async function printIterator(readable) {
  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // false

  for await (const chunk of readable.iterator({ destroyOnReturn: false })) {
    console.log(chunk); // 将打印 2 然后打印 3
  }

  console.log(readable.destroyed); // true，流被完全消费了
}

async function printSymbolAsyncIterator(readable) {
  for await (const chunk of readable) {
    console.log(chunk); // 1
    break;
  }

  console.log(readable.destroyed); // true
}

async function showBoth() {
  await printIterator(Readable.from([1, 2, 3]));
  await printSymbolAsyncIterator(Readable.from([1, 2, 3]));
}

showBoth();
```

readable.map(fn[, options])
fn <Function> | <AsyncFunction> 映射流中每个块的函数。
- data <any> 来自流的数据块。
- options <Object>
  - signal <AbortSignal> 如果流被销毁则中止，允许提前中止 fn 调用。
options <Object>
- concurrency <number> 一次调用流的最大并发调用 fn。 默认值: 1。
- signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Readable> 使用函数 fn 映射的流。
此方法允许映射流。 将为流中的每个块调用 fn 函数。 如果 fn 函数返回 promise，则该 promise 将在被传到结果流之前被 await。

readable.drop(limit[, options])
limit <number> 从可读文件中删除的块数。
options <Object>
- signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Readable> 丢弃了 limit 个块的流。
此方法返回新的流，其前 limit 个块被丢弃。
```javascript
import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
```

readable.take(limit[, options])
此方法返回带有前 limit 个块的新流。

readable.asIndexedPairs([options])
options <Object>
- signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Readable> 索引对的流。
此方法返回新的流，其中包含与 [index, chunk] 形式的计数器配对的底层流块。 第一个索引值为 0，每产生一个块，则增加 1。
```javascript
import { Readable } from 'node:stream';

const pairs = await Readable.from(['a', 'b', 'c']).asIndexedPairs().toArray();
console.log(pairs); // [[0, 'a'], [1, 'b'], [2, 'c']]
```

###### 双工流与转换流

stream.Duplex 类
双工流是同时实现 Readable 和 Writable 接口的流。

Duplex 流的示例包括：
- TCP 套接字
- 压缩流
- 加密流

Transform 流的示例包括：
- 压缩流
- 加密流


stream.compose(...streams)
streams <Stream[]> | <Iterable[]> | <AsyncIterable[]> | <Function[]>
返回: <stream.Duplex>
将两个或多个流组合成一个 Duplex 流，其写入第一个流并从最后一个流读取。 每个提供的流都通过管道传输到下一个，使用 stream.pipeline。 如果任何流错误，则所有流都将被销毁，包括外部的 Duplex 流。

因为 stream.compose 返回新的流，该流又可以（并且应该）通过管道传输到其他流中，所以它支持组合。 相比之下，当将流传到 stream.pipeline 时，通常第一个流是可读流，最后一个流是可写流，从而形成闭合回路。

如果传入了 Function，则它必须是采用 source Iterable 的工厂方法。

stream.compose 可用于将异步迭代器、生成器和函数转换为流。

AsyncIterable 转换为可读的 Duplex。 无法产生 null。
AsyncGeneratorFunction 转换为可读/可写的转换 Duplex。 必须将源 AsyncIterable 作为第一个参数。 无法产生 null。
AsyncFunction 转换为可写的 Duplex。 必须返回 null 或 undefined。

stream.Readable.from(iterable[, options])
iterable <Iterable> 实现 Symbol.asyncIterator 或 Symbol.iterator 可迭代协议的对象。 如果传入空值，则触发 'error' 事件。
options <Object> 提供给 new stream.Readable([options]) 的选项。 默认情况下，Readable.from() 会将 options.objectMode 设置为 true，除非通过将 options.objectMode 设置为 false 来明确选择退出。
返回: <stream.Readable>
一个从迭代器中创建可读流的实用方法。

出于性能原因，调用 Readable.from(string) 或 Readable.from(buffer) 不会迭代字符串或缓冲区以匹配其他流语义。


stream.addAbortSignal(signal, stream)
signal <AbortSignal> 代表可能取消的信号
stream <Stream> 将信号绑定到的流
将中止信号绑定到可读或可写的流。 这让代码可以使用 AbortController 来控制流销毁。
在与传入的 AbortSignal 对应的 AbortController 上调用 abort 的行为与在流上调用 .destroy(new AbortError()) 的行为相同。


readable.read(0)
在某些情况下，需要触发底层可读流机制的刷新，而不实际消耗任何数据。 在这种情况下，可以调用 readable.read(0)，它总是返回 null。

如果内部读取缓冲区在 highWaterMark 之下，并且当前没有读取流，那么调用 stream.read(0) 将触发低级 stream._read() 调用。

虽然大多数应用程序几乎不需要这样做，但在 Node.js 中也有这样做的情况，特别是在 Readable 流类内部。

readable.push('')
不推荐使用 readable.push('')。

将零字节字符串 Buffer 或 Uint8Array 推送到非对象模式的流有一个有趣的副作用。 因为是对 readable.push() 的调用，所以调用会结束读取过程。 然而，因为参数是空字符串，没有数据被添加到可读缓冲区，所以用户没有任何东西可以消费。

调用 `readable.setEncoding()` 之后 `highWaterMark` 的差异
readable.setEncoding() 的使用将改变 highWaterMark 在非对象模式下的操作方式。
通常，当前缓冲区的大小是根据 highWaterMark 以字节为单位来衡量的。 但是，在调用 setEncoding() 之后，比较函数将开始以字符为单位测量缓冲区的大小。

在 latin1 或 ascii 的常见情况下，这不是问题。 但建议在处理可能包含多字节字符的字符串时注意这种行为。