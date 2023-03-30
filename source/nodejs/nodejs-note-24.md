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

以下示例将 readable 中的所有数据通过管道传输到名为 file.txt 的文件中：

const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// 可读流的所有数据进入 'file.txt'。
readable.pipe(writable);
可以将多个 Writable 流绑定到单个 Readable 流。

readable.pipe() 方法返回对目标流的引用，从而可以建立管道流链：

const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
默认情况下，当源 Readable 流触发 'end' 时，则在目标 Writable 流上调用 stream.end()，因此目标不再可写。 要禁用此默认行为，可以将 end 选项作为 false 传入，从而使目标流保持打开状态：

reader.pipe(writer, { end: false });
reader.on('end', () => {
  writer.end('Goodbye\n');
});
有个重要的注意事项，如果 Readable 流在处理过程中触发错误，则 Writable 目标不会自动关闭。 如果发生错误，则需要手动关闭每个流以防止内存泄漏。

process.stderr 和 process.stdout Writable 流在 Node.js 进程退出之前永远不会关闭，无论指定的选项如何。

readable.read([size])#
中英对照

新增于: v0.9.4
size <number> 用于指定要读取的数据量的可选参数。
返回: <string> | <Buffer> | <null> | <any>
readable.read() 方法从内部缓冲区中读取数据并返回。 如果没有数据可以读取，则返回 null。 默认情况下，除非使用 readable.setEncoding() 方法指定了编码或流在对象模式下运行，否则数据将作为 Buffer 对象返回。

可选的 size 参数指定要读取的特定字节数。 如果无法读取 size 字节，则将返回 null，除非流已结束，在这种情况下，将返回内部缓冲区中剩余的所有数据。

如果未指定 size 参数，则将返回内部缓冲区中包含的所有数据。

size 参数必须小于或等于 1 GiB。

readable.read() 方法应该只在暂停模式下操作的 Readable 流上调用。 在流动模式下，会自动调用 readable.read()，直到内部缓冲区完全排空。

const readable = getReadableStreamSomehow();

// 随着数据被缓冲，'readable' 可能会被多次触发
readable.on('readable', () => {
  let chunk;
  console.log('Stream is readable (new data received in buffer)');
  // 使用循环来确保读取所有当前可用的数据
  while (null !== (chunk = readable.read())) {
    console.log(`Read ${chunk.length} bytes of data...`);
  }
});

// 当没有更多可用数据时，则触发一次 'end'。
readable.on('end', () => {
  console.log('Reached end of stream.');
});
每次调用 readable.read() 都会返回一个数据块或 null。 块不是串联的。 需要 while 循环来消费当前缓冲区中的所有数据。 当读取大文件时，.read() 可能会返回 null，到目前为止已经消费了所有缓冲的内容，但是还有更多的数据尚未缓冲。 在这种情况下，当缓冲区中有更多数据时，将触发新的 'readable' 事件。 最后，当没有更多数据时，则将触发 'end' 事件。

因此，要从 readable 读取文件的全部内容，必须跨越多个 'readable' 事件来收集块：

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
对象模式下的 Readable 流将始终从对 readable.read(size) 的调用返回单个条目，而不管 size 参数的值如何。

如果 readable.read() 方法返回数据块，则还将触发 'data' 事件。

在 'end' 事件触发后调用 stream.read([size]) 将返回 null。 不会引发运行时错误。

readable.readable#
中英对照

新增于: v11.4.0
<boolean>
如果调用 readable.read() 是安全的，则为 true，这意味着流尚未被销毁或触发 'error' 或 'end'。

readable.readableAborted#
中英对照

新增于: v16.8.0
稳定性: 1 - 实验
<boolean>
返回在触发 'end' 之前流是被破销毁或出错。

readable.readableDidRead#
中英对照

新增于: v16.7.0, v14.18.0
稳定性: 1 - 实验
<boolean>
返回是否已触发 'data'。

readable.readableEncoding#
中英对照

新增于: v12.7.0
<null> | <string>
给定 Readable 流的属性 encoding 的获取器。 可以使用 readable.setEncoding() 方法设置 encoding 属性。

readable.readableEnded#
中英对照

新增于: v12.9.0
<boolean>
当触发 'end' 事件时变为 true。

readable.errored#
中英对照

新增于: v18.0.0
<Error>
如果流因错误而被销毁，则返回错误。

readable.readableFlowing#
中英对照

新增于: v9.4.0
<boolean>
此属性反映了 Readable 流的当前状态，如三种状态章节所述。

readable.readableHighWaterMark#
中英对照

新增于: v9.3.0
<number>
返回创建此 Readable 时传入的 highWaterMark 的值。

readable.readableLength#
中英对照

新增于: v9.4.0
<number>
此属性包含队列中准备读取的字节数（或对象数）。 该值提供有关 highWaterMark 状态的内省数据。

readable.readableObjectMode#
中英对照

新增于: v12.3.0
<boolean>
给定 Readable 流的属性 objectMode 的获取器。

readable.resume()#
中英对照

版本历史
返回: <this>
readable.resume() 方法使被显式暂停的 Readable 流恢复触发 'data' 事件，将流切换到流动模式。

readable.resume() 方法可用于完全地消费流中的数据，而无需实际处理任何数据：

getReadableStreamSomehow()
  .resume()
  .on('end', () => {
    console.log('Reached the end, but did not read anything.');
  });
如果有 'readable' 事件监听器，则 readable.resume() 方法不起作用。

readable.setEncoding(encoding)#
中英对照

新增于: v0.9.4
encoding <string> 要使用的编码。
返回: <this>
readable.setEncoding() 方法为从 Readable 流读取的数据设置字符编码。

默认情况下，没有分配编码，流数据将作为 Buffer 对象返回。 设置编码会导致流数据作为指定编码的字符串而不是 Buffer 对象返回。 例如，调用 readable.setEncoding('utf8') 将导致输出数据被解释为 UTF-8 数据，并作为字符串传入。 调用 readable.setEncoding('hex') 将使数据以十六进制字符串格式进行编码。

Readable 流将正确地处理通过流传递的多字节字符，否则如果简单地从流中提取为 Buffer 对象，这些字符将无法正确解码。

const readable = getReadableStreamSomehow();
readable.setEncoding('utf8');
readable.on('data', (chunk) => {
  assert.equal(typeof chunk, 'string');
  console.log('Got %d characters of string data:', chunk.length);
});
readable.unpipe([destination])#
中英对照

新增于: v0.9.4
destination <stream.Writable> 可选的要取消管道的特定流
返回: <this>
readable.unpipe() 方法分离先前使用 stream.pipe() 方法绑定的 Writable 流。

如果未指定 destination，则所有管道都将分离。

如果指定了 destination，但没有为其设置管道，则该方法不执行任何操作。

const fs = require('node:fs');
const readable = getReadableStreamSomehow();
const writable = fs.createWriteStream('file.txt');
// 可读流的所有数据进入 'file.txt'，
// 但只有第一秒。
readable.pipe(writable);
setTimeout(() => {
  console.log('Stop writing to file.txt.');
  readable.unpipe(writable);
  console.log('Manually close the file stream.');
  writable.end();
}, 1000);
readable.unshift(chunk[, encoding])#
中英对照

版本历史
chunk <Buffer> | <Uint8Array> | <string> | <null> | <any> 要取消转移到读取队列的数据块。 对于不在对象模式下操作的流，chunk 必须是字符串、Buffer、Uint8Array、或 null。 对于对象模式的流，chunk 可以是任何 JavaScript 值。
encoding <string> 字符串块的编码。 必须是有效的 Buffer 编码，例如 'utf8' 或 'ascii'。
将 chunk 作为 null 传入信号流结束 (EOF)，其行为与 readable.push(null) 相同，之后无法写入更多数据。 EOF 信号放在缓冲区的末尾，任何缓冲的数据仍将被刷新。

readable.unshift() 方法将数据块推回内部缓冲区。 这在某些情况下很有用，其中流被代码消费，需要"取消消耗"它已经从源中提取的一定数量的数据，以便数据可以传给其他方。

'end' 事件触发后不能调用 stream.unshift(chunk) 方法，否则会抛出运行时错误。

使用 stream.unshift() 的开发者通常应该考虑改用 Transform 流。 有关更多信息，请参阅流实现者的 API 章节。

// 拉出由 \n\n 分隔的标题。
// 如果获取太多，则使用 unshift()。
// 使用 (error, header, stream) 调用回调。
const { StringDecoder } = require('node:string_decoder');
function parseHeader(stream, callback) {
  stream.on('error', callback);
  stream.on('readable', onReadable);
  const decoder = new StringDecoder('utf8');
  let header = '';
  function onReadable() {
    let chunk;
    while (null !== (chunk = stream.read())) {
      const str = decoder.write(chunk);
      if (str.includes('\n\n')) {
        // 找到标题边界。
        const split = str.split(/\n\n/);
        header += split.shift();
        const remaining = split.join('\n\n');
        const buf = Buffer.from(remaining, 'utf8');
        stream.removeListener('error', callback);
        // 在取消移位之前删除 'readable' 监听器。
        stream.removeListener('readable', onReadable);
        if (buf.length)
          stream.unshift(buf);
        // 现在可以从流中读取消息的正文。
        callback(null, header, stream);
        return;
      }
      // 仍在阅读标题。
      header += str;
    }
  }
}
与 stream.push(chunk) 不同，stream.unshift(chunk) 不会通过重置流的内部读取状态来结束读取过程。 如果在读取期间调用 readable.unshift()（即从自定义流上的 stream._read() 实现中调用），这可能会导致意外结果。 在立即调用 stream.push('') 之后调用 readable.unshift() 将适当地重置读取状态，但是最好避免在执行读取过程中调用 readable.unshift()。

readable.wrap(stream)#
中英对照

新增于: v0.9.4
stream <Stream> “旧式”的可读流
返回: <this>
在 Node.js 0.10 之前，流没有实现当前定义的整个 node:stream 模块 API。 （有关更多信息，请参阅兼容性。）

当使用旧的 Node.js 库，它触发 'data' 事件并且有一个 stream.pause() 方法只是建议性的，readable.wrap() 方法可用于创建一个使用旧流作为其数据源的 Readable 流。

很少需要使用 readable.wrap()，但提供该方法是为了方便与较旧的 Node.js 应用程序和库进行交互。

const { OldReader } = require('./old-api-module.js');
const { Readable } = require('node:stream');
const oreader = new OldReader();
const myReader = new Readable().wrap(oreader);

myReader.on('readable', () => {
  myReader.read(); // 等等。
});
readable[Symbol.asyncIterator]()#
中英对照

版本历史
返回: <AsyncIterator> 以完全消费流。
const fs = require('node:fs');

async function print(readable) {
  readable.setEncoding('utf8');
  let data = '';
  for await (const chunk of readable) {
    data += chunk;
  }
  console.log(data);
}

print(fs.createReadStream('file')).catch(console.error);
如果循环以 break、return 或 throw 终止，则流将被销毁。 换句话说，遍历流将完全消费流。 流将以大小等于 highWaterMark 选项的块读取。 在上面的代码示例中，如果文件的数据少于 64 KiB，则数据将位于单个块中，因为没有为 fs.createReadStream() 提供 highWaterMark 选项。

readable.iterator([options])#
中英对照

新增于: v16.3.0
稳定性: 1 - 实验
options <Object>
destroyOnReturn <boolean> 当设置为 false 时，在异步迭代器上调用 return 或使用 break、return 或 throw 退出 for await...of 迭代不会销毁流。 默认值: true。
返回: <AsyncIterator> 消费流。
如果 for await...of 循环由 return、break 或 throw 退出，或者如果流在迭代期间发出错误，迭代器是否应该销毁流，则此方法创建的迭代器为用户提供了取消流销毁的选项。

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
readable.map(fn[, options])#
中英对照

新增于: v17.4.0, v16.14.0
稳定性: 1 - 实验
fn <Function> | <AsyncFunction> 映射流中每个块的函数。
data <any> 来自流的数据块。
options <Object>
signal <AbortSignal> 如果流被销毁则中止，允许提前中止 fn 调用。
options <Object>
concurrency <number> 一次调用流的最大并发调用 fn。 默认值: 1。
signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Readable> 使用函数 fn 映射的流。
此方法允许映射流。 将为流中的每个块调用 fn 函数。 如果 fn 函数返回 promise，则该 promise 将在被传到结果流之前被 await。

import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// 使用同步映射器。
for await (const chunk of Readable.from([1, 2, 3, 4]).map((x) => x * 2)) {
  console.log(chunk); // 2, 4, 6, 8
}
// 使用异步映射器，单次最多进行 2 个查询。
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map((domain) => resolver.resolve4(domain), { concurrency: 2 });
for await (const result of dnsResults) {
  console.log(result); // 记录 resolver.resolve4 的 DNS 结果。
}
readable.filter(fn[, options])#
中英对照

新增于: v17.4.0, v16.14.0
稳定性: 1 - 实验
fn <Function> | <AsyncFunction> 从流中过滤块的函数。
data <any> 来自流的数据块。
options <Object>
signal <AbortSignal> 如果流被销毁则中止，允许提前中止 fn 调用。
options <Object>
concurrency <number> 一次调用流的最大并发调用 fn。 默认值: 1。
signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Readable> 使用谓词 fn 过滤的流。
此方法允许过滤流。 对于流中的每个块，将调用 fn 函数，如果它返回真值，则该块将被传给结果流。 如果 fn 函数返回 promise，则该 Promise 将被 await。

import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// 使用同步谓词。
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// 使用异步谓词，单次最多进行 2 个查询。
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).filter(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address.ttl > 60;
}, { concurrency: 2 });
for await (const result of dnsResults) {
  // 在解析的 dns 记录上记录超过 60 秒的域。
  console.log(result);
}
readable.forEach(fn[, options])#
中英对照

新增于: v17.5.0
稳定性: 1 - 实验
fn <Function> | <AsyncFunction> 调用流的每个块的函数。
data <any> 来自流的数据块。
options <Object>
signal <AbortSignal> 如果流被销毁则中止，允许提前中止 fn 调用。
options <Object>
concurrency <number> 一次调用流的最大并发调用 fn。 默认值: 1。
signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Promise> 当流结束时的 promise。
此方法允许迭代流。 对于流中的每个块，将调用 fn 函数。 如果 fn 函数返回 promise，则该 Promise 将被 await。

此方法与 for await...of 循环不同，它可以选择性地同时处理块。 此外，forEach 迭代只能通过传入 signal 选项并中止相关 AbortController 来停止，而 for await...of 可以通过 break 或 return 停止。 无论哪种情况，流都将被销毁。

此方法与监听 'data' 事件不同，它使用底层机器中的 readable 事件，可以限制 fn 并发调用的数量。

import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

// 使用同步谓词。
for await (const chunk of Readable.from([1, 2, 3, 4]).filter((x) => x > 2)) {
  console.log(chunk); // 3, 4
}
// 使用异步谓词，单次最多进行 2 个查询。
const resolver = new Resolver();
const dnsResults = Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 });
await dnsResults.forEach((result) => {
  // 记录结果，类似于 `for await (const result of dnsResults)`
  console.log(result);
});
console.log('done'); // 流已结束
readable.toArray([options])#
中英对照

新增于: v17.5.0
稳定性: 1 - 实验
options <Object>
signal <AbortSignal> 如果信号被中止，则允许取消 toArray 操作。
返回: <Promise> 包含流内容数组的 promise。
此方法可以轻松获取流的内容。

由于此方法将整个流读入内存，它否定了流的好处。 它旨在实现互操作性和便利性，而不是作为消费流的主要方式。

import { Readable } from 'node:stream';
import { Resolver } from 'node:dns/promises';

await Readable.from([1, 2, 3, 4]).toArray(); // [1, 2, 3, 4]

// 使用 .map 同时进行 dns 查询
// 并使用 toArray 将结果收集到一个数组中
const dnsResults = await Readable.from([
  'nodejs.org',
  'openjsf.org',
  'www.linuxfoundation.org',
]).map(async (domain) => {
  const { address } = await resolver.resolve4(domain, { ttl: true });
  return address;
}, { concurrency: 2 }).toArray();
readable.some(fn[, options])#
中英对照

新增于: v17.5.0
稳定性: 1 - 实验
fn <Function> | <AsyncFunction> 调用流的每个块的函数。
data <any> 来自流的数据块。
options <Object>
signal <AbortSignal> 如果流被销毁则中止，允许提前中止 fn 调用。
options <Object>
concurrency <number> 一次调用流的最大并发调用 fn。 默认值: 1。
signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Promise> 如果 fn 为至少一个块返回了真值，则为对 true 进行评估的 promise。
此方法类似于 Array.prototype.some，并在流中的每个块上调用 fn，直到等待的返回值为 true（或任何真值）。 一旦对块等待返回值的 fn 调用为真，则流将被销毁，并使用 true 履行 promise。 如果对块的 fn 调用都没有返回真值，则 promise 使用 false 履行。

import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// 使用同步谓词。
await Readable.from([1, 2, 3, 4]).some((x) => x > 2); // true
await Readable.from([1, 2, 3, 4]).some((x) => x < 0); // false

// 使用异步谓词，一次最多进行 2 个文件检查。
const anyBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).some(async (fileName) => {
  const stats = await stat(fileName);
  return stat.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(anyBigFile); // 如果列表中的任何文件大于 1MB，则为 `true`
console.log('done'); // 流已结束
readable.find(fn[, options])#
中英对照

新增于: v17.5.0
稳定性: 1 - 实验
fn <Function> | <AsyncFunction> 调用流的每个块的函数。
data <any> 来自流的数据块。
options <Object>
signal <AbortSignal> 如果流被销毁则中止，允许提前中止 fn 调用。
options <Object>
concurrency <number> 一次调用流的最大并发调用 fn。 默认值: 1。
signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Promise> 对第一个块进行评估的 promise，其中 fn 评估为真值，如果没有找到元素，则评估为 undefined。
此方法类似于 Array.prototype.find，并在流中的每个块上调用 fn 以查找具有 fn 的真值的块。 一旦 fn 调用的等待返回值为真值，则流就会被销毁，并且 promise 使用 fn 返回真值的值来履行。 如果对块的所有 fn 调用都返回非真值，则 promise 使用 undefined 履行。

import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// 使用同步谓词。
await Readable.from([1, 2, 3, 4]).find((x) => x > 2); // 3
await Readable.from([1, 2, 3, 4]).find((x) => x > 0); // 1
await Readable.from([1, 2, 3, 4]).find((x) => x > 10); // undefined

// 使用异步谓词，一次最多进行 2 个文件检查。
const foundBigFile = await Readable.from([
  'file1',
  'file2',
  'file3',
]).find(async (fileName) => {
  const stats = await stat(fileName);
  return stat.size > 1024 * 1024;
}, { concurrency: 2 });
console.log(foundBigFile); // 大文件的文件名，如果列表中有大于 1MB 的文件
console.log('done'); // 流已结束
readable.every(fn[, options])#
中英对照

新增于: v17.5.0
稳定性: 1 - 实验
fn <Function> | <AsyncFunction> 调用流的每个块的函数。
data <any> 来自流的数据块。
options <Object>
signal <AbortSignal> 如果流被销毁则中止，允许提前中止 fn 调用。
options <Object>
concurrency <number> 一次调用流的最大并发调用 fn。 默认值: 1。
signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Promise> 如果 fn 返回所有块的真值，则对 true 进行评估的 promise。
此方法类似于 Array.prototype.every，并在流中的每个块上调用 fn 以检查所有等待的返回值是否为 fn 的真值。 一旦对块等待返回值的 fn 调用是非真的，则流就会被销毁，并且 promise 会使用 false 履行 如果对块的所有 fn 调用都返回真值，则该 promise 使用 true 履行。

import { Readable } from 'node:stream';
import { stat } from 'node:fs/promises';

// 使用同步谓词。
await Readable.from([1, 2, 3, 4]).every((x) => x > 2); // false
await Readable.from([1, 2, 3, 4]).every((x) => x > 0); // true

// 使用异步谓词，一次最多进行 2 个文件检查。
const allBigFiles = await Readable.from([
  'file1',
  'file2',
  'file3',
]).every(async (fileName) => {
  const stats = await stat(fileName);
  return stat.size > 1024 * 1024;
}, { concurrency: 2 });
// 如果列表中的所有文件都大于 1MiB，则为 `true`
console.log(allBigFiles);
console.log('done'); // 流已结束
readable.flatMap(fn[, options])#
中英对照

新增于: v17.5.0
稳定性: 1 - 实验
fn <Function> | <AsyncGeneratorFunction> | <AsyncFunction> 映射流中每个块的函数。
data <any> 来自流的数据块。
options <Object>
signal <AbortSignal> 如果流被销毁则中止，允许提前中止 fn 调用。
options <Object>
concurrency <number> 一次调用流的最大并发调用 fn。 默认值: 1。
signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Readable> 使用函数 fn 展平映射的流。
此方法通过将给定的回调应用到流的每个块然后展平结果来返回新的流。

可以从 fn 返回流或另一个迭代或异步迭代，结果流将被合并（展平）到返回的流中。

import { Readable } from 'node:stream';
import { createReadStream } from 'node:fs';

// 使用同步映射器。
for await (const chunk of Readable.from([1, 2, 3, 4]).flatMap((x) => [x, x])) {
  console.log(chunk); // 1, 1, 2, 2, 3, 3, 4, 4
}
// 使用异步的映射器，合并 4 个文件的内容
const concatResult = Readable.from([
  './1.mjs',
  './2.mjs',
  './3.mjs',
  './4.mjs',
]).flatMap((fileName) => createReadStream(fileName));
for await (const result of concatResult) {
  // 这将包含所有 4 个文件的内容（所有块）
  console.log(result);
}
readable.drop(limit[, options])#
中英对照

新增于: v17.5.0
稳定性: 1 - 实验
limit <number> 从可读文件中删除的块数。
options <Object>
signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Readable> 丢弃了 limit 个块的流。
此方法返回新的流，其前 limit 个块被丢弃。

import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).drop(2).toArray(); // [3, 4]
readable.take(limit[, options])#
中英对照

新增于: v17.5.0
稳定性: 1 - 实验
limit <number> 从可读块中获取的块数。
options <Object>
signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Readable> 带有 limit 个块的流。
此方法返回带有前 limit 个块的新流。

import { Readable } from 'node:stream';

await Readable.from([1, 2, 3, 4]).take(2).toArray(); // [1, 2]
readable.asIndexedPairs([options])#
中英对照

新增于: v17.5.0
稳定性: 1 - 实验
options <Object>
signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Readable> 索引对的流。
此方法返回新的流，其中包含与 [index, chunk] 形式的计数器配对的底层流块。 第一个索引值为 0，每产生一个块，则增加 1。

import { Readable } from 'node:stream';

const pairs = await Readable.from(['a', 'b', 'c']).asIndexedPairs().toArray();
console.log(pairs); // [[0, 'a'], [1, 'b'], [2, 'c']]
readable.reduce(fn[, initial[, options]])#
中英对照

新增于: v17.5.0
稳定性: 1 - 实验
fn <Function> | <AsyncFunction> 调用流中每个块的减数函数。
previous <any> 从最后一次调用 fn 获得的值或 initial 值（如果指定）或流的第一个块。
data <any> 来自流的数据块。
options <Object>
signal <AbortSignal> 如果流被销毁则中止，允许提前中止 fn 调用。
initial <any> 在减数中使用的初始值。
options <Object>
signal <AbortSignal> 如果信号被中止，则允许销毁流。
返回: <Promise> 用于减数最终值的 promise。
此方法按顺序在流的每个块上调用 fn，并将对前一个元素的计算结果传给它。 它返回减数最终值的 promise。

减数函数逐个元素地迭代流，这意味着没有 concurrency 参数或并行性。 要同时执行 reduce，则可以链接到 readable.map 方法。

如果没有提供 initial 值，则将流的第一个块用作初始值。 如果流为空，则使用带有 ERR_INVALID_ARGS 代码属性的 TypeError 拒绝 promise。

import { Readable } from 'node:stream';

const ten = await Readable.from([1, 2, 3, 4]).reduce((previous, data) => {
  return previous + data;
});
console.log(ten); // 10
双工流与转换流#
stream.Duplex 类#
中英对照

版本历史
双工流是同时实现 Readable 和 Writable 接口的流。

Duplex 流的示例包括：

TCP 套接字
压缩流
加密流
duplex.allowHalfOpen#
中英对照

新增于: v0.9.4
<boolean>
如果为 false，则当可读端结束时，流将自动结束可写端。 最初由 allowHalfOpen 构造函数选项设置，默认为 true。

这可以手动更改以更改现有 Duplex 流实例的半开行为，但必须在触发 'end' 事件之前更改。

stream.Transform 类#
中英对照

新增于: v0.9.4
转换流是 Duplex 流，其中输出以某种方式与输入相关。 与所有 Duplex 流一样，Transform 流实现了 Readable 和 Writable 接口。

Transform 流的示例包括：

压缩流
加密流
transform.destroy([error])#
中英对照

版本历史
error <Error>
返回: <this>
销毁流，并可选择地触发 'error' 事件。 在此调用之后，转换流将释放任何内部资源。 实现者不应覆盖此方法，而应实现 readable._destroy()。 Transform 的 _destroy() 的默认实现也会触发 'close'，除非 emitClose 设置为 false。

一旦 destroy() 被调用，任何进一步的调用都将是空操作，并且除了来自 _destroy() 的其他错误不会作为 'error' 触发。

stream.finished(stream[, options], callback)#
中英对照

版本历史
stream <Stream> 可读和/或可写的流。
options <Object>
error <boolean> 如果设置为 false，则对 emit('error', err) 的调用不会被视为已完成。 默认值: true。
readable <boolean> 当设置为 false 时，即使流可能仍然可读，也会在流结束时调用回调。 默认值: true。
writable <boolean> 当设置为 false 时，即使流可能仍可写，也会在流结束时调用回调。 默认值: true。
signal <AbortSignal> 允许中止等待流完成。 如果信号被中止，底层流将不会被中止。 回调将使用 AbortError 调用。 此函数添加的所有已注册监听器也将被删除。
callback <Function> 采用可选的错误参数的回调函数。
返回: <Function> 清除所有已注册监听器的函数。
当流不再可读、可写或遇到错误或过早关闭事件时获得通知的函数。

const { finished } = require('node:stream');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

finished(rs, (err) => {
  if (err) {
    console.error('Stream failed.', err);
  } else {
    console.log('Stream is done reading.');
  }
});

rs.resume(); // 排空流。
在流被过早销毁（如中止的 HTTP 请求）并且不会触发 'end' 或 'finish' 的错误处理场景中特别有用。

finished API 提供了 promise 版本：

const { finished } = require('node:stream/promises');
const fs = require('node:fs');

const rs = fs.createReadStream('archive.tar');

async function run() {
  await finished(rs);
  console.log('Stream is done reading.');
}

run().catch(console.error);
rs.resume(); // 排空流。
stream.finished() 在调用 callback 后离开悬空事件监听器（特别是 'error'、'end'、'finish' 和 'close'）。 这样做的原因是意外的 'error' 事件（由于不正确的流实现）不会导致意外崩溃。 如果这是不需要的行为，则需要在回调中调用返回的清理函数：

const cleanup = finished(rs, (err) => {
  cleanup();
  // ...
});
stream.pipeline(source[, ...transforms], destination, callback)#
stream.pipeline(streams, callback)#
中英对照

版本历史
streams <Stream[]> | <Iterable[]> | <AsyncIterable[]> | <Function[]>
source <Stream> | <Iterable> | <AsyncIterable> | <Function>
返回: <Iterable> | <AsyncIterable>
...transforms <Stream> | <Function>
source <AsyncIterable>
返回: <AsyncIterable>
destination <Stream> | <Function>
source <AsyncIterable>
返回: <AsyncIterable> | <Promise>
callback <Function> 当管道完全完成时调用。
err <Error>
val destination 返回的 Promise 的解析值。
返回: <Stream>
模块方法，用于在流和生成器之间进行管道转发错误并正确清理并在管道完成时提供回调。

const { pipeline } = require('node:stream');
const fs = require('node:fs');
const zlib = require('node:zlib');

// 使用管道 API 可以轻松地将一系列流传输到一起，
// 并在管道完全完成时收到通知。

// 有效地 gzip 潜在巨大的 tar 文件的管道：

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed.', err);
    } else {
      console.log('Pipeline succeeded.');
    }
  }
);
pipeline API 提供了 promise 版本，它也可以接收一选项参数作为带有 signal <AbortSignal> 属性的最后一个参数。 当信号中止时，将在底层管道上调用 destroy，并带有 中止错误。

const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz')
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
要使用 AbortSignal，则将其作为最后一个参数传到选项对象中：

const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  const ac = new AbortController();
  const signal = ac.signal;

  setTimeout(() => ac.abort(), 1);
  await pipeline(
    fs.createReadStream('archive.tar'),
    zlib.createGzip(),
    fs.createWriteStream('archive.tar.gz'),
    { signal },
  );
}

run().catch(console.error); // AbortError
pipeline API 还支持异步生成器：

const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    fs.createReadStream('lowercase.txt'),
    async function* (source, { signal }) {
      source.setEncoding('utf8');  // 使用字符串而不是 `Buffer`。
      for await (const chunk of source) {
        yield await processChunk(chunk, { signal });
      }
    },
    fs.createWriteStream('uppercase.txt')
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
记得处理传入异步生成器的 signal 参数。 特别是在异步生成器是管道的来源（即第一个参数）或管道永远不会完成的情况下。

const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');

async function run() {
  await pipeline(
    async function* ({ signal }) {
      await someLongRunningfn({ signal });
      yield 'asd';
    },
    fs.createWriteStream('uppercase.txt')
  );
  console.log('Pipeline succeeded.');
}

run().catch(console.error);
stream.pipeline() 将在所有流上调用 stream.destroy(err)，除了：

已触发 'end' 或 'close' 的 Readable 流。
已触发 'finish' 或 'close' 的 Writable 流。
在调用 callback 后，stream.pipeline() 在流上留下悬空事件监听器。 在失败后重用流的情况下，这可能会导致事件监听器泄漏和吞下错误。 如果最后一个流是可读的，则悬空的事件监听器将被移除，以便稍后可以使用最后一个流。

stream.pipeline() 在出现错误时关闭所有流。 IncomingRequest 与 pipeline 一起使用可能会导致意外行为，一旦发生它会销毁套接字且不发送预期的响应。 参见以下示例：

const fs = require('node:fs');
const http = require('node:http');
const { pipeline } = require('node:stream');

const server = http.createServer((req, res) => {
  const fileStream = fs.createReadStream('./fileNotExist.txt');
  pipeline(fileStream, res, (err) => {
    if (err) {
      console.log(err); // 没有这样的文件
      // 一旦 `pipeline` 已经销毁了套接字，则无法发送此消息
      return res.end('error!!!');
    }
  });
});
stream.compose(...streams)#
中英对照

新增于: v16.9.0
稳定性: 1 - stream.compose 是实验的。
streams <Stream[]> | <Iterable[]> | <AsyncIterable[]> | <Function[]>
返回: <stream.Duplex>
将两个或多个流组合成一个 Duplex 流，其写入第一个流并从最后一个流读取。 每个提供的流都通过管道传输到下一个，使用 stream.pipeline。 如果任何流错误，则所有流都将被销毁，包括外部的 Duplex 流。

因为 stream.compose 返回新的流，该流又可以（并且应该）通过管道传输到其他流中，所以它支持组合。 相比之下，当将流传到 stream.pipeline 时，通常第一个流是可读流，最后一个流是可写流，从而形成闭合回路。

如果传入了 Function，则它必须是采用 source Iterable 的工厂方法。

import { compose, Transform } from 'node:stream';

const removeSpaces = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, String(chunk).replace(' ', ''));
  }
});

async function* toUpper(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
}

let res = '';
for await (const buf of compose(removeSpaces, toUpper).end('hello world')) {
  res += buf;
}

console.log(res); // 打印 'HELLOWORLD'
stream.compose 可用于将异步迭代器、生成器和函数转换为流。

AsyncIterable 转换为可读的 Duplex。 无法产生 null。
AsyncGeneratorFunction 转换为可读/可写的转换 Duplex。 必须将源 AsyncIterable 作为第一个参数。 无法产生 null。
AsyncFunction 转换为可写的 Duplex。 必须返回 null 或 undefined。
import { compose } from 'node:stream';
import { finished } from 'node:stream/promises';

// 将 AsyncIterable 转换为可读的 Duplex。
const s1 = compose(async function*() {
  yield 'Hello';
  yield 'World';
}());

// 将 AsyncGenerator 转换为转换 Duplex。
const s2 = compose(async function*(source) {
  for await (const chunk of source) {
    yield String(chunk).toUpperCase();
  }
});

let res = '';

// 将 AsyncFunction 转换为可写的 Duplex。
const s3 = compose(async function(source) {
  for await (const chunk of source) {
    res += chunk;
  }
});

await finished(compose(s1, s2, s3));

console.log(res); // 打印 'HELLOWORLD'
stream.Readable.from(iterable[, options])#
中英对照

新增于: v12.3.0, v10.17.0
iterable <Iterable> 实现 Symbol.asyncIterator 或 Symbol.iterator 可迭代协议的对象。 如果传入空值，则触发 'error' 事件。
options <Object> 提供给 new stream.Readable([options]) 的选项。 默认情况下，Readable.from() 会将 options.objectMode 设置为 true，除非通过将 options.objectMode 设置为 false 来明确选择退出。
返回: <stream.Readable>
一个从迭代器中创建可读流的实用方法。

const { Readable } = require('node:stream');

async function * generate() {
  yield 'hello';
  yield 'streams';
}

const readable = Readable.from(generate());

readable.on('data', (chunk) => {
  console.log(chunk);
});
出于性能原因，调用 Readable.from(string) 或 Readable.from(buffer) 不会迭代字符串或缓冲区以匹配其他流语义。

stream.Readable.fromWeb(readableStream[, options])#
新增于: v17.0.0
稳定性: 1 - 实验
readableStream <ReadableStream>
options <Object>
encoding <string>
highWaterMark <number>
objectMode <boolean>
signal <AbortSignal>
返回: <stream.Readable>
stream.Readable.isDisturbed(stream)#
中英对照

新增于: v16.8.0
稳定性: 1 - 实验
stream <stream.Readable> | <ReadableStream>
返回: boolean
返回流是否已被读取或取消。

stream.isErrored(stream)#
中英对照

新增于: v17.3.0, v16.14.0
稳定性: 1 - 实验
stream <Readable> | <Writable> | <Duplex> | <WritableStream> | <ReadableStream>
返回: <boolean>
返回流是否遇到错误。

stream.isReadable(stream)#
中英对照

新增于: v17.4.0, v16.14.0
稳定性: 1 - 实验
stream <Readable> | <Duplex> | <ReadableStream>
返回: <boolean>
返回流是否可读。

stream.Readable.toWeb(streamReadable)#
新增于: v17.0.0
稳定性: 1 - 实验
streamReadable <stream.Readable>
返回: <ReadableStream>
stream.Writable.fromWeb(writableStream[, options])#
新增于: v17.0.0
稳定性: 1 - 实验
writableStream <WritableStream>
options <Object>
decodeStrings <boolean>
highWaterMark <number>
objectMode <boolean>
signal <AbortSignal>
返回: <stream.Writable>
stream.Writable.toWeb(streamWritable)#
新增于: v17.0.0
稳定性: 1 - 实验
streamWritable <stream.Writable>
返回: <WritableStream>
stream.Duplex.from(src)#
中英对照

新增于: v16.8.0
src <Stream> | <Blob> | <ArrayBuffer> | <string> | <Iterable> | <AsyncIterable> | <AsyncGeneratorFunction> | <AsyncFunction> | <Promise> | <Object>
创建双工流的实用方法。

Stream 将可写流转换为可写的 Duplex，将可读流转换为 Duplex。
Blob 转换为可读的 Duplex。
string 转换为可读的 Duplex。
ArrayBuffer 转换为可读的 Duplex。
AsyncIterable 转换为可读的 Duplex。 无法产生 null。
AsyncGeneratorFunction 转换为可读/可写的转换 Duplex。 必须将源 AsyncIterable 作为第一个参数。 无法产生 null。
AsyncFunction 转换为可写的 Duplex。 必须返回 null 或 undefined
Object ({ writable, readable }) 将 readable 和 writable 转换为 Stream，然后将它们组合成 Duplex，其中 Duplex 将写入 writable 并从 readable 读取。
Promise 转换为可读的 Duplex。 值 null 被忽略。
返回: <stream.Duplex>
stream.Duplex.fromWeb(pair[, options])#
新增于: v17.0.0
稳定性: 1 - 实验
pair <Object>
readable <ReadableStream>
writable <WritableStream>
options <Object>
allowHalfOpen <boolean>
decodeStrings <boolean>
encoding <string>
highWaterMark <number>
objectMode <boolean>
signal <AbortSignal>
返回: <stream.Duplex>
import { Duplex } from 'node:stream';
import {
  ReadableStream,
  WritableStream
} from 'node:stream/web';

const readable = new ReadableStream({
  start(controller) {
    controller.enqueue('world');
  },
});

const writable = new WritableStream({
  write(chunk) {
    console.log('writable', chunk);
  }
});

const pair = {
  readable,
  writable
};
const duplex = Duplex.fromWeb(pair, { encoding: 'utf8', objectMode: true });

duplex.write('hello');

for await (const chunk of duplex) {
  console.log('readable', chunk);
}
stream.Duplex.toWeb(streamDuplex)#
新增于: v17.0.0
稳定性: 1 - 实验
streamDuplex <stream.Duplex>
返回: <Object>
readable <ReadableStream>
writable <WritableStream>
import { Duplex } from 'node:stream';

const duplex = Duplex({
  objectMode: true,
  read() {
    this.push('world');
    this.push(null);
  },
  write(chunk, encoding, callback) {
    console.log('writable', chunk);
    callback();
  }
});

const { readable, writable } = Duplex.toWeb(duplex);
writable.getWriter().write('hello');

const { value } = await readable.getReader().read();
console.log('readable', value);
stream.addAbortSignal(signal, stream)#
中英对照

新增于: v15.4.0
signal <AbortSignal> 代表可能取消的信号
stream <Stream> 将信号绑定到的流
将中止信号绑定到可读或可写的流。 这让代码可以使用 AbortController 来控制流销毁。

在与传入的 AbortSignal 对应的 AbortController 上调用 abort 的行为与在流上调用 .destroy(new AbortError()) 的行为相同。

const fs = require('node:fs');

const controller = new AbortController();
const read = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json'))
);
// 稍后，中止关闭流的操作
controller.abort();
或者使用带有可读流的 AbortSignal 作为异步可迭代对象：

const controller = new AbortController();
setTimeout(() => controller.abort(), 10_000); // 设置超时
const stream = addAbortSignal(
  controller.signal,
  fs.createReadStream(('object.json'))
);
(async () => {
  try {
    for await (const chunk of stream) {
      await process(chunk);
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      // 操作被取消
    } else {
      throw e;
    }
  }
})();
流实现者的 API#
中英对照

node:stream 模块 API 旨在使使用 JavaScript 的原型继承模型轻松实现流成为可能。

首先，流开发者将声明新的 JavaScript 类，该类扩展四个基本流类（stream.Writable、stream.Readable、stream.Duplex 或 stream.Transform）之一，确保它们调用适当的父类构造函数：

const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
当扩展流时，在将这些选项转发给基本构造函数之前，请记住用户可以和应该提供哪些选项。 例如，如果实现对 autoDestroy 和 emitClose 选项做出假设，则不允许用户覆盖这些。 显式转发哪些选项，而不是隐式转发所有选项。

然后，新的流类必须实现一个或多个特定方法，具体取决于正在创建的流的类型，如下图所示：

Use-case	Class	Method(s) to implement
只读	Readable	_read()
只写	Writable	_write(), _writev(), _final()
可读可写	Duplex	_read(), _write(), _writev(), _final()
对写入的数据进行操作，然后读取结果	Transform	_transform(), _flush(), _final()
流的实现代码永远不应该调用供消费者使用的流的“公共”方法（如流消费者的 API 章节所述）。 这样做可能会对使用流的应用程序代码产生不利的副作用。

避免覆盖公共方法，例如 write()、end()、cork()、uncork()、read() 和 destroy()，或触发内部事件，例如 'error'、'data'、'end'、'finish' 和 'close' 到 .emit()。 这样做可能会破坏当前和未来的流的不变量，从而导致行为和/或与其他流、流实用程序和用户期望的兼容性问题。

简单的实现#
中英对照

新增于: v1.2.0
对于许多简单的情况，可以在不依赖继承的情况下创建流。 这可以通过直接创建 stream.Writable、stream.Readable、stream.Duplex 或 stream.Transform 对象的实例并传入适当的方法作为构造函数选项来实现。

const { Writable } = require('node:stream');

const myWritable = new Writable({
  construct(callback) {
    // 初始化状态并加载资源...
  },
  write(chunk, encoding, callback) {
    // ...
  },
  destroy() {
    // 释放资源...
  }
});
实现可写流#
中英对照

stream.Writable 类被扩展以实现 Writable 流。

自定义的 Writable 流必须调用 new stream.Writable([options]) 构造函数并实现 writable._write() 和/或 writable._writev() 方法

new stream.Writable([options])#
中英对照

版本历史
options <Object>
highWaterMark <number> stream.write() 开始返回 false 时的缓冲级别。 默认值: 16384 （16 KiB），或者 16 用于 objectMode 流。
decodeStrings <boolean> 是否将传给 stream.write() 的 string 编码为 Buffer（使用 stream.write() 调用中指定的编码），然后再将它们传给 stream._write()。 其他类型的数据不会被转换（即 Buffer 不会被解码为 string）。 设置为 false 将阻止 string 被转换。 默认值: true。
defaultEncoding <string> 当没有将编码指定为 stream.write() 的参数时使用的默认编码。 默认值: 'utf8'。
objectMode <boolean> stream.write(anyObj) 是否为有效操作。 当设置后，如果流实现支持，则可以写入字符串、Buffer 或 Uint8Array 以外的 JavaScript 值。 默认值: false。
emitClose <boolean> 流被销毁后是否应该触发 'close'。 默认值: true。
write <Function> stream._write() 方法的实现。
writev <Function> stream._writev() 方法的实现。
destroy <Function> stream._destroy() 方法的实现。
final <Function> stream._final() 方法的实现。
construct <Function> stream._construct() 方法的实现。
autoDestroy <boolean> 此流是否应在结束后自动调用自身的 .destroy()。 默认值: true。
signal <AbortSignal> 表示可能取消的信号。
const { Writable } = require('node:stream');

class MyWritable extends Writable {
  constructor(options) {
    // 调用 stream.Writable() 构造函数。
    super(options);
    // ...
  }
}
或者，当使用 ES6 之前的风格构造函数时：

const { Writable } = require('node:stream');
const util = require('node:util');

function MyWritable(options) {
  if (!(this instanceof MyWritable))
    return new MyWritable(options);
  Writable.call(this, options);
}
util.inherits(MyWritable, Writable);
或者，使用简化的构造函数方法：

const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  }
});
在与传入的 AbortSignal 对应的 AbortController 上调用 abort 的行为与在可写流上调用 .destroy(new AbortError()) 的行为相同。

const { Writable } = require('node:stream');

const controller = new AbortController();
const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  },
  signal: controller.signal
});
// 稍后，中止关闭流的操作
controller.abort();
writable._construct(callback)#
中英对照

新增于: v15.0.0
callback <Function> 当流完成初始化时调用此函数（可选地带有错误参数）。
不得直接调用 _construct() 方法。 它可以由子类实现，如果是，则只能由内部 Writable 类方法调用。

这个可选函数将在流构造函数返回后的一个滴答中被调用，延迟任何 _write()、_final() 和 _destroy() 调用，直到调用 callback。 这对于在使用流之前初始化状态或异步初始化资源很有用。

const { Writable } = require('node:stream');
const fs = require('node:fs');

class WriteStream extends Writable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _write(chunk, encoding, callback) {
    fs.write(this.fd, chunk, callback);
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
writable._write(chunk, encoding, callback)#
中英对照

版本历史
chunk <Buffer> | <string> | <any> 要写入的 Buffer，从 string 转换为 stream.write()。 如果流的 decodeStrings 选项是 false 或者流在对象模式下运行，则块将不会被转换，而是传给 stream.write() 的任何内容。
encoding <string> 如果块是字符串，则 encoding 是该字符串的字符编码。 如果块是 Buffer，或者如果流在对象模式下运行，则可以忽略 encoding。
callback <Function> 当对提供的块的处理完成时调用此函数（可选地带有错误参数）。
所有 Writable 流实现都必须提供 writable._write() 和/或 writable._writev() 方法来将数据发送到底层资源。

Transform 流提供了它们自己的 writable._write() 实现。

此函数不得由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 Writable 类方法调用。

callback 函数必须在 writable._write() 内部同步调用或异步调用（即不同的滴答），以表示写入成功完成或因错误而失败。 如果调用失败，则传给 callback 的第一个参数必须是 Error 对象，如果写入成功，则传入 null 对象。

在调用 writable._write() 和调用 callback 之间发生的对 writable.write() 的所有调用都将导致写入的数据被缓冲。 当调用 callback 时，流可能会触发 'drain' 事件。 如果流实现能够同时处理多个数据块，则应实现 writable._writev() 方法。

如果在构造函数选项中将 decodeStrings 属性显式设置为 false，则 chunk 将保持传给 .write() 的相同对象，并且可能是字符串而不是 Buffer。 这是为了支持对某些字符串数据编码进行优化处理的实现。 在这种情况下，encoding 参数将指示字符串的字符编码。 否则，可以安全地忽略 encoding 参数。

writable._write() 方法以下划线为前缀，因为它是定义它的类的内部方法，不应由用户程序直接调用。

writable._writev(chunks, callback)#
中英对照

chunks <Object[]> 要写入的数据。 该值是 <Object> 数组，每个数组表示要写入的离散数据块。 这些对象的属性是：
chunk <Buffer> | <string> 包含要写入的数据的缓冲区实例或字符串。 如果 Writable 是在 decodeStrings 选项设置为 false 的情况下创建的，并且字符串已传给 write()，则 chunk 将是字符串。
encoding <string> chunk 的字符编码。 如果 chunk 是 Buffer，则 encoding 将是 'buffer'。
callback <Function> 当对提供的块的处理完成时要调用的回调函数（可选地带有错误参数）。
此函数不得由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 Writable 类方法调用。

writable._writev() 方法可以在能够同时处理多个数据块的流实现中作为 writable._write() 的补充或替代来实现。 如果实现并且有来自先前写入的缓冲数据，则将调用 _writev() 而不是 _write()。

writable._writev() 方法以下划线为前缀，因为它是定义它的类的内部方法，不应由用户程序直接调用。

writable._destroy(err, callback)#
中英对照

新增于: v8.0.0
err <Error> 可能的错误。
callback <Function> 采用可选的错误参数的回调函数。
_destroy() 方法由 writable.destroy() 调用。 它可以被子类覆盖，但不能直接调用。 此外，callback 不应与 async/await 混合，一旦它在 promise 被解决时执行。

writable._final(callback)#
中英对照

新增于: v8.0.0
callback <Function> 完成写入任何剩余数据后调用此函数（可选地带有错误参数）。
不得直接调用 _final() 方法。 它可以由子类实现，如果是，则只能由内部 Writable 类方法调用。

这个可选函数将在流关闭之前被调用，将 'finish' 事件延迟到 callback 被调用。 这对于在流结束之前关闭资源或写入缓冲数据很有用。

写入时出错#
中英对照

在 writable._write()、writable._writev() 和 writable._final() 方法的处理过程中发生的错误必须通过调用回调并将错误作为第一个参数传入来传播。 从这些方法中抛出 Error 或手动触发 'error' 事件会导致未定义的行为。

如果 Readable 流在 Writable 触发错误时通过管道传输到 Writable 流，则 Readable 流将被取消管道。

const { Writable } = require('node:stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
});
可写流的示例#
中英对照

下面说明了一个相当简单（有些毫无意义）的自定义 Writable 流的实现。 虽然这个特定的 Writable 流实例没有任何真正的特殊用途，但该示例说明了自定义 Writable 流实例的每个必需元素：

const { Writable } = require('node:stream');

class MyWritable extends Writable {
  _write(chunk, encoding, callback) {
    if (chunk.toString().indexOf('a') >= 0) {
      callback(new Error('chunk is invalid'));
    } else {
      callback();
    }
  }
}
在可写流中解码缓冲区#
中英对照

解码缓冲区是一项常见任务，例如，在使用输入为字符串的转换器时。 在使用多字节字符编码（例如 UTF-8）时，这不是一个简单的过程。 以下示例显示如何使用 StringDecoder 和 Writable 解码多字节字符串。

const { Writable } = require('node:stream');
const { StringDecoder } = require('node:string_decoder');

class StringWritable extends Writable {
  constructor(options) {
    super(options);
    this._decoder = new StringDecoder(options && options.defaultEncoding);
    this.data = '';
  }
  _write(chunk, encoding, callback) {
    if (encoding === 'buffer') {
      chunk = this._decoder.write(chunk);
    }
    this.data += chunk;
    callback();
  }
  _final(callback) {
    this.data += this._decoder.end();
    callback();
  }
}

const euro = [[0xE2, 0x82], [0xAC]].map(Buffer.from);
const w = new StringWritable();

w.write('currency: ');
w.write(euro[0]);
w.end(euro[1]);

console.log(w.data); // currency: €
实现可读流#
中英对照

stream.Readable 类被扩展以实现 Readable 流。

自定义 Readable 流必须调用 new stream.Readable([options]) 构造函数并实现 readable._read() 方法。

new stream.Readable([options])#
中英对照

版本历史
options <Object>
highWaterMark <number> 在停止从底层资源读取之前存储在内部缓冲区中的最大字节数。 默认值: 16384 （16 KiB），或者 16 用于 objectMode 流。
encoding <string> 如果指定，则缓冲区将使用指定的编码解码为字符串。 默认值: null。
objectMode <boolean> 此流是否应表现为对象流。 这意味着 stream.read(n) 返回单个值而不是大小为 n 的 Buffer。 默认值: false。
emitClose <boolean> 流被销毁后是否应该触发 'close'。 默认值: true。
read <Function> stream._read() 方法的实现。
destroy <Function> stream._destroy() 方法的实现。
construct <Function> stream._construct() 方法的实现。
autoDestroy <boolean> 此流是否应在结束后自动调用自身的 .destroy()。 默认值: true。
signal <AbortSignal> 表示可能取消的信号。
const { Readable } = require('node:stream');

class MyReadable extends Readable {
  constructor(options) {
    // 调用 stream.Readable(options) 构造函数。
    super(options);
    // ...
  }
}
或者，当使用 ES6 之前的风格构造函数时：

const { Readable } = require('node:stream');
const util = require('node:util');

function MyReadable(options) {
  if (!(this instanceof MyReadable))
    return new MyReadable(options);
  Readable.call(this, options);
}
util.inherits(MyReadable, Readable);
或者，使用简化的构造函数方法：

const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    // ...
  }
});
在对应于传入的 AbortSignal 的 AbortController 上调用 abort 的行为与在创建的可读文件上调用 .destroy(new AbortError()) 的行为相同。

const { Readable } = require('node:stream');
const controller = new AbortController();
const read = new Readable({
  read(size) {
    // ...
  },
  signal: controller.signal
});
// 稍后，中止关闭流的操作
controller.abort();
readable._construct(callback)#
中英对照

新增于: v15.0.0
callback <Function> 当流完成初始化时调用此函数（可选地带有错误参数）。
不得直接调用 _construct() 方法。 它可以由子类实现，如果是，则只能由内部 Readable 类方法调用。

这个可选函数将由流的构造函数在下一个滴答中调度，延迟任何 _read() 和 _destroy() 调用，直到调用 callback。 这对于在使用流之前初始化状态或异步初始化资源很有用。

const { Readable } = require('node:stream');
const fs = require('node:fs');

class ReadStream extends Readable {
  constructor(filename) {
    super();
    this.filename = filename;
    this.fd = null;
  }
  _construct(callback) {
    fs.open(this.filename, (err, fd) => {
      if (err) {
        callback(err);
      } else {
        this.fd = fd;
        callback();
      }
    });
  }
  _read(n) {
    const buf = Buffer.alloc(n);
    fs.read(this.fd, buf, 0, n, null, (err, bytesRead) => {
      if (err) {
        this.destroy(err);
      } else {
        this.push(bytesRead > 0 ? buf.slice(0, bytesRead) : null);
      }
    });
  }
  _destroy(err, callback) {
    if (this.fd) {
      fs.close(this.fd, (er) => callback(er || err));
    } else {
      callback(err);
    }
  }
}
readable._read(size)#
中英对照

新增于: v0.9.4
size <number> 异步地读取的字节数
此函数不得由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 Readable 类方法调用。

所有 Readable 流实现都必须提供 readable._read() 方法的实现，以从底层资源中获取数据。

调用 readable._read() 时，如果资源中的数据可用，则实现应开始使用 this.push(dataChunk) 方法将该数据推送到读取队列中。 一旦流准备好接受更多数据，则 _read() 将在每次调用 this.push(dataChunk) 后再次调用。 _read() 可能会继续从资源中读取并推送数据，直到 readable.push() 返回 false。 只有当 _read() 停止后再次被调用时，它才能继续将额外的数据推入队列。

一旦调用了 readable._read() 方法，则不会再次调用它，直到通过 readable.push() 方法推送更多数据。 空缓冲区和字符串等空数据不会导致调用 readable._read()。

size 参数是建议性的。 对于“读取”是返回数据的单个操作的实现，可以使用 size 参数来确定要获取多少数据。 其他实现可能会忽略此参数，并在数据可用时简单地提供数据。 在调用 stream.push(chunk) 之前不需要“等待”直到 size 个字节可用。

readable._read() 方法以下划线为前缀，因为它是定义它的类的内部方法，不应由用户程序直接调用。

readable._destroy(err, callback)#
中英对照

新增于: v8.0.0
err <Error> 可能的错误。
callback <Function> 采用可选的错误参数的回调函数。
_destroy() 方法由 readable.destroy() 调用。 它可以被子类覆盖，但不能直接调用。

readable.push(chunk[, encoding])#
中英对照

版本历史
chunk <Buffer> | <Uint8Array> | <string> | <null> | <any> 要推入读取队列的数据块。 对于不在对象模式下操作的流，chunk 必须是字符串、Buffer 或 Uint8Array。 对于对象模式的流，chunk 可以是任何 JavaScript 值。
encoding <string> 字符串块的编码。 必须是有效的 Buffer 编码，例如 'utf8' 或 'ascii'。
返回: <boolean> 如果可以继续推送额外的数据块，则为 true；否则为 false。
当 chunk 为 Buffer、Uint8Array 或 string 时，数据的 chunk 将被添加到内部队列中供流的用户消费。 将 chunk 作为 null 传递信号表示流结束 (EOF)，之后不能再写入数据。

当 Readable 处于暂停模式时，在 'readable' 事件触发时调用 readable.read() 方法可以读出添加了 readable.push() 的数据。

当 Readable 工作在流动模式时，添加了 readable.push() 的数据将通过触发 'data' 事件来传递。

readable.push() 方法设计得尽可能灵活。 例如，当封装提供某种形式的暂停/恢复机制和数据回调的低层源时，低层源可以由自定义 Readable 实例封装：

// `_source` 是一个具有 readStop() 和 readStart() 方法的对象，
// 当有数据时调用 `ondata` 成员，
// 当数据结束时调用 `onend` 成员。

class SourceWrapper extends Readable {
  constructor(options) {
    super(options);

    this._source = getLowLevelSourceObject();

    // 每次有数据时，将其推入内部缓冲区。
    this._source.ondata = (chunk) => {
      // 如果 push() 返回 false，则停止从源读取。
      if (!this.push(chunk))
        this._source.readStop();
    };

    // 当源结束时，推送 EOF 信令 `null` 块。
    this._source.onend = () => {
      this.push(null);
    };
  }
  // 当流想要拉入更多数据时将调用 _read() 。
  // 在这种情况下，会忽略建议的大小参数。
  _read(size) {
    this._source.readStart();
  }
}
readable.push() 方法用于将内容推送到内部缓冲区中。 它可以由 readable._read() 方法驱动。

对于非对象模式的流，如果 readable.push() 的 chunk 参数为 undefined，它将被视为空字符串或缓冲区。 有关详细信息，请参阅 readable.push('')。

读取时出错#
中英对照

readable._read() 处理过程中发生的错误必须通过 readable.destroy(err) 方法传播。 从 readable._read() 中抛出 Error 或手动触发 'error' 事件会导致未定义的行为。

const { Readable } = require('node:stream');

const myReadable = new Readable({
  read(size) {
    const err = checkSomeErrorCondition();
    if (err) {
      this.destroy(err);
    } else {
      // 做一些工作。
    }
  }
});
可读流的示例#
中英对照

下面是一个 Readable 流的基本示例，它按升序触发从 1 到 1,000,000 的数字，然后结束。

const { Readable } = require('node:stream');

class Counter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 1000000;
    this._index = 1;
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      const str = String(i);
      const buf = Buffer.from(str, 'ascii');
      this.push(buf);
    }
  }
}
实现双工流#
中英对照

Duplex 流是同时实现 Readable 和 Writable 的流，例如 TCP 套接字连接。

因为 JavaScript 不支持多重继承，所以扩展了 stream.Duplex 类以实现 Duplex 流（与扩展 stream.Readable 和 stream.Writable 类相反）。

stream.Duplex 类原型继承自 stream.Readable 并寄生于 stream.Writable，但由于覆盖了 stream.Writable 上的 Symbol.hasInstance，instanceof 将适用于两个基类。

自定义的 Duplex 流必须调用 new stream.Duplex([options]) 构造函数并实现 readable._read() 和 writable._write() 方法。

new stream.Duplex(options)#
中英对照

版本历史
options <Object> 传给 Writable 和 Readable 构造函数。 还具有以下字段：
allowHalfOpen <boolean> 如果设置为 false，则流将在可读端结束时自动结束可写端。 默认值: true。
readable <boolean> 设置 Duplex 是否可读。 默认值: true。
writable <boolean> 设置 Duplex 是否可写。 默认值: true。
readableObjectMode <boolean> 为流的可读端设置 objectMode。 如果 objectMode 是 true，则无效。 默认值: false。
writableObjectMode <boolean> 为流的可写端设置 objectMode。 如果 objectMode 是 true，则无效。 默认值: false。
readableHighWaterMark <number> 为流的可读端设置 highWaterMark。 如果提供 highWaterMark，则无效。
writableHighWaterMark <number> 为流的可写端设置 highWaterMark。 如果提供 highWaterMark，则无效。
const { Duplex } = require('node:stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}
或者，当使用 ES6 之前的风格构造函数时：

const { Duplex } = require('node:stream');
const util = require('node:util');

function MyDuplex(options) {
  if (!(this instanceof MyDuplex))
    return new MyDuplex(options);
  Duplex.call(this, options);
}
util.inherits(MyDuplex, Duplex);
或者，使用简化的构造函数方法：

const { Duplex } = require('node:stream');

const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  }
});
当使用管道时：

const { Transform, pipeline } = require('node:stream');
const fs = require('node:fs');

pipeline(
  fs.createReadStream('object.json')
    .setEncoding('utf8'),
  new Transform({
    decodeStrings: false, // 接受字符串输入而不是缓冲区
    construct(callback) {
      this.data = '';
      callback();
    },
    transform(chunk, encoding, callback) {
      this.data += chunk;
      callback();
    },
    flush(callback) {
      try {
        // 确保是有效的 json。
        JSON.parse(this.data);
        this.push(this.data);
        callback();
      } catch (err) {
        callback(err);
      }
    }
  }),
  fs.createWriteStream('valid-object.json'),
  (err) => {
    if (err) {
      console.error('failed', err);
    } else {
      console.log('completed');
    }
  }
);
双工流的例子#
中英对照

下面说明了一个简单的 Duplex 流的示例，它封装了一个假设的低层源对象，可以向其中写入数据，也可以从中读取数据，尽管使用的 API 与 Node.js 流不兼容。 下面说明了一个简单的 Duplex 流的示例，它缓冲通过 Writable 接口传入的写入数据，然后通过 Readable 接口读回。

const { Duplex } = require('node:stream');
const kSource = Symbol('source');

class MyDuplex extends Duplex {
  constructor(source, options) {
    super(options);
    this[kSource] = source;
  }

  _write(chunk, encoding, callback) {
    // 底层源代码只处理字符串。
    if (Buffer.isBuffer(chunk))
      chunk = chunk.toString();
    this[kSource].writeSomeData(chunk);
    callback();
  }

  _read(size) {
    this[kSource].fetchSomeData(size, (data, encoding) => {
      this.push(Buffer.from(data, encoding));
    });
  }
}
Duplex 流最重要的方面是 Readable 和 Writable 端彼此独立运行，尽管它们共存于单个对象实例中。

对象模式的双工流#
中英对照

对于 Duplex 流，可以分别使用 readableObjectMode 和 writableObjectMode 选项为 Readable 或 Writable 侧专门设置 objectMode。

例如，在下面的示例中，创建了新的 Transform 流（它是 Duplex 流），它具有对象模式的 Writable 端，该端接受 JavaScript 数字，这些数字在 Readable 端转换为十六进制字符串。

const { Transform } = require('node:stream');

// 所有转换流也是双工流。
const myTransform = new Transform({
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
    // 如有必要，将块强制为数字。
    chunk |= 0;

    // 将块转换为其他东西。
    const data = chunk.toString(16);

    // 将数据推送到可读队列中。
    callback(null, '0'.repeat(data.length % 2) + data);
  }
});

myTransform.setEncoding('ascii');
myTransform.on('data', (chunk) => console.log(chunk));

myTransform.write(1);
// 打印: 01
myTransform.write(10);
// 打印: 0a
myTransform.write(100);
// 打印: 64
实现转换流#
中英对照

Transform 流是 Duplex 流，其中输出以某种方式从输入计算。 示例包括压缩、加密、或解密数据的压缩流或加密流。

不要求输出与输入大小相同、块数相同或同时到达。 例如，Hash 流只会有一个单一的输出块，它在输入结束时提供。 zlib 流将产生比其输入小得多或大得多的输出。

stream.Transform 类被扩展以实现 Transform 流。

stream.Transform 类原型上继承自 stream.Duplex 并实现其自己版本的 writable._write() 和 readable._read() 方法。 自定义的 Transform 实现必须实现 transform._transform() 方法，也可以实现 transform._flush() 方法。

使用 Transform 流时必须小心，因为如果不消耗 Readable 端的输出，写入流的数据可能导致流的 Writable 端暂停。

new stream.Transform([options])#
中英对照

options <Object> 传给 Writable 和 Readable 构造函数。 还具有以下字段：
transform <Function> stream._transform() 方法的实现。
flush <Function> stream._flush() 方法的实现。
const { Transform } = require('node:stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}
或者，当使用 ES6 之前的风格构造函数时：

const { Transform } = require('node:stream');
const util = require('node:util');

function MyTransform(options) {
  if (!(this instanceof MyTransform))
    return new MyTransform(options);
  Transform.call(this, options);
}
util.inherits(MyTransform, Transform);
或者，使用简化的构造函数方法：

const { Transform } = require('node:stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  }
});
'end' 事件#
中英对照

'end' 事件来自 stream.Readable 类。 'end' 事件在所有数据输出后触发，该事件发生在调用 transform._flush() 中的回调之后。 在出现错误的情况下，不应触发 'end'。

'finish' 事件#
中英对照

'finish' 事件来自 stream.Writable 类。 'finish' 事件在调用 stream.end() 并且所有块都已被 stream._transform() 处理后触发。 在出现错误的情况下，不应触发 'finish'。

transform._flush(callback)#
中英对照

callback <Function> 在刷新剩余数据时调用的回调函数（可选地带有错误参数和数据）。
此函数不得由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 Readable 类方法调用。

在某些情况下，转换操作可能需要在流的末尾触发额外的数据位。 例如，zlib 压缩流将存储用于优化压缩输出的内部状态量。 但是，当流结束时，需要刷新额外的数据，以便完成压缩数据。

自定义的 Transform 实现可以实现 transform._flush() 方法。 当没有更多的写入数据被消耗时，但在触发 'end' 事件以表示 Readable 流结束之前，将调用此方法。

在 transform._flush() 实现中，transform.push() 方法可以被调用零次或多次，视情况而定。 必须在刷新操作完成时调用 callback 函数。

transform._flush() 方法以下划线为前缀，因为它是定义它的类的内部方法，不应由用户程序直接调用。

transform._transform(chunk, encoding, callback)#
中英对照

chunk <Buffer> | <string> | <any> 要转换的 Buffer，从 string 转换为 stream.write()。 如果流的 decodeStrings 选项是 false 或者流在对象模式下运行，则块将不会被转换，而是传给 stream.write() 的任何内容。
encoding <string> 如果块是字符串，则这是编码类型。 如果块是缓冲区，则这是特殊值 'buffer'。 在这种情况下忽略它。
callback <Function> 在处理提供的 chunk 后调用的回调函数（可选地带有错误参数和数据）。
此函数不得由应用程序代码直接调用。 它应该由子类实现，并且只能由内部 Readable 类方法调用。

所有 Transform 流实现都必须提供 _transform() 方法来接受输入并产生输出。 transform._transform() 实现处理写入的字节，计算输出，然后使用 transform.push() 方法将该输出传给可读部分。

transform.push() 方法可以被调用零次或多次以从单个输入块生成输出，这取决于作为块的结果要输出多少。

任何给定的输入数据块都可能不会产生任何输出。

callback 函数必须在当前块被完全消耗时才被调用。 如果在处理输入时发生错误，则传给 callback 的第一个参数必须是 Error 对象，否则传给 null。 如果将第二个参数传给 callback，它将被转发到 transform.push() 方法。 换句话说，以下内容是等效的：

transform.prototype._transform = function(data, encoding, callback) {
  this.push(data);
  callback();
};

transform.prototype._transform = function(data, encoding, callback) {
  callback(null, data);
};
transform._transform() 方法以下划线为前缀，因为它是定义它的类的内部方法，不应由用户程序直接调用。

transform._transform() 永远不会被并行调用；流实现了一个队列机制，为了接收下一个块，必须同步或异步调用 callback。

stream.PassThrough 类#
中英对照

stream.PassThrough 类是 Transform 流的简单实现，它只是将输入字节传到输出。 它的目的主要是用于示例和测试，但在某些用例中，stream.PassThrough 可用作新型流的构建块。

其他注意事项#
流与异步生成器和异步迭代器的兼容性#
中英对照

在 JavaScript 中异步生成器和迭代器的支持下，异步生成器在这一点上实际上是一流的语言级流构造。

下面提供了一些将 Node.js 流与异步生成器和异步迭代器一起使用的常见互操作案例。

使用异步迭代器消费可读流#
中英对照

(async function() {
  for await (const chunk of readable) {
    console.log(chunk);
  }
})();
异步迭代器在流上注册一个永久的错误句柄，以防止任何未处理的销毁后错误。

使用异步生成器创建可读流#
中英对照

可以使用 Readable.from() 实用方法从异步生成器创建 Node.js 可读流：

const { Readable } = require('node:stream');

const ac = new AbortController();
const signal = ac.signal;

async function * generate() {
  yield 'a';
  await someLongRunningFn({ signal });
  yield 'b';
  yield 'c';
}

const readable = Readable.from(generate());
readable.on('close', () => {
  ac.abort();
});

readable.on('data', (chunk) => {
  console.log(chunk);
});
从异步迭代器管道到可写流#
中英对照

当从异步迭代器写入可写流时，确保正确处理背压和错误。 stream.pipeline() 抽象了背压和背压相关错误的处理：

const fs = require('node:fs');
const { pipeline } = require('node:stream');
const { pipeline: pipelinePromise } = require('node:stream/promises');

const writable = fs.createWriteStream('./file');

const ac = new AbortController();
const signal = ac.signal;

const iterator = createIterator({ signal });

// 回调模式
pipeline(iterator, writable, (err, value) => {
  if (err) {
    console.error(err);
  } else {
    console.log(value, 'value returned');
  }
}).on('close', () => {
  ac.abort();
});

// Promise 模式
pipelinePromise(iterator, writable)
  .then((value) => {
    console.log(value, 'value returned');
  })
  .catch((err) => {
    console.error(err);
    ac.abort();
  });
兼容旧版本的 Node.js#
中英对照

在 Node.js 0.10 之前，Readable 流接口更简单，但功能更弱，实用性也更低。

'data' 事件将立即开始触发，而不是等待对 stream.read() 方法的调用。 需要执行一些工作来决定如何处理数据的应用程序需要将读取数据存储到缓冲区中，这样数据就不会丢失。
stream.pause() 方法是建议性的，而不是保证性的。 这意味着即使流处于暂停状态，仍然需要准备接收 'data' 事件。
在 Node.js 0.10 中，添加了 Readable 类。 为了与旧的 Node.js 程序向后兼容，当添加 'data' 事件处理程序或调用 stream.resume() 方法时，Readable 流会切换到“流动模式”。 效果是，即使不使用新的 stream.read() 方法和 'readable' 事件，也不再需要担心丢失 'data' 块。

虽然大多数应用程序将继续正常运行，但这会在以下情况下引入边缘情况：

未添加 'data' 事件监听器。
永远不会调用 stream.resume() 方法。
流不会通过管道传输到任何可写目的地。
例如，考虑以下代码：

// 警告！破碎的！
net.createServer((socket) => {

  // 添加了 'end' 监听器，但从不使用数据。
  socket.on('end', () => {
    // 它永远不会到达这里。
    socket.end('The message was received but was not processed.\n');
  });

}).listen(1337);
在 Node.js 0.10 之前，传入的消息数据将被简单地丢弃。 但是，在 Node.js 0.10 及更高版本中，套接字永远处于暂停状态。

这种情况下的解决方法是调用 stream.resume() 方法开始数据流：

// 解决方法。
net.createServer((socket) => {
  socket.on('end', () => {
    socket.end('The message was received but was not processed.\n');
  });

  // 启动数据流，丢弃它。
  socket.resume();
}).listen(1337);
除了新的 Readable 流切换到流动模式之外，0.10 之前的样式流可以使用 readable.wrap() 方法封装在 Readable 类中。

readable.read(0)#
中英对照

在某些情况下，需要触发底层可读流机制的刷新，而不实际消耗任何数据。 在这种情况下，可以调用 readable.read(0)，它总是返回 null。

如果内部读取缓冲区在 highWaterMark 之下，并且当前没有读取流，那么调用 stream.read(0) 将触发低级 stream._read() 调用。

虽然大多数应用程序几乎不需要这样做，但在 Node.js 中也有这样做的情况，特别是在 Readable 流类内部。

readable.push('')#
中英对照

不推荐使用 readable.push('')。

将零字节字符串 Buffer 或 Uint8Array 推送到非对象模式的流有一个有趣的副作用。 因为是对 readable.push() 的调用，所以调用会结束读取过程。 然而，因为参数是空字符串，没有数据被添加到可读缓冲区，所以用户没有任何东西可以消费。

调用 `readable.setEncoding()` 之后 `highWaterMark` 的差异#
中英对照

readable.setEncoding() 的使用将改变 highWaterMark 在非对象模式下的操作方式。

通常，当前缓冲区的大小是根据 highWaterMark 以字节为单位来衡量的。 但是，在调用 setEncoding() 之后，比较函数将开始以字符为单位测量缓冲区的大小。

在 latin1 或 ascii 的常见情况下，这不是问题。 但建议在处理可能包含多字节字符的字符串时注意这种行为。