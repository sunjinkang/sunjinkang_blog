---
title: nodejs基础知识(5)
date: 2023-01-10 13:13:23
tags: [node, ECMAScript模块, Error (错误), events (事件)]
---

**启用**
--experimental-modules 标志可用于启用加载ES模块的功能。
一旦被设置启用，以 .mjs 为后缀的文件将能够作为ES模块加载。
```nodejs
node --experimental-modules my-app.mjs
```

#### Error(错误)
Node.js 中运行的应用程序一般会遇到以下四类错误：
- 标准的 JavaScript 错误：
 - <EvalError> : 当调用 eval() 失败时抛出。
 - <SyntaxError> : 当 JavaScript 语法错误时抛出。
 - <RangeError> : 当值不在预期范围内时抛出。
 - <ReferenceError> : 当使用未定义的变量时抛出。
 - <TypeError> : 当传入错误类型的参数时抛出。
 - <URIError> : 当全局的 URI 处理函数被误用时抛出。
- 由底层操作系触发的系统错误，例如试图打开一个不存在的文件、试图通过一个已关闭的 socket 发送数据等。
- 由应用程序代码触发的用户自定义的错误。
- 断言错误是错误的一个特殊类别，每当 Node.js 检测到一个不应该发生的异常逻辑时触发。 这类错误通常由 assert 模块引起。
所有由 Node.js 引起的 JavaScript 错误与系统错误都继承自或实例化自标准的 JavaScript <Error> 类，且保证至少提供类中的属性。

**错误的冒泡和捕获**
Node.js 支持几种当应用程序运行时发生的错误的冒泡和处理的机制。 如何报告和处理这些错误完全取决于错误的类型和被调用的 API 的风格。
所有 JavaScript 错误都会被作为异常处理，异常会立即产生并使用标准的 JavaScript throw 机制抛出一个错误。 这些都是使用 JavaScript 语言提供的 try / catch 语句处理的。
```javascript
// 抛出一个 ReferenceError，因为 z 为 undefined
try {
  const m = 1;
  const n = m + z;
} catch (err) {
  // 在这里处理错误。
}
```
JavaScript 的 throw 机制的任何使用都会引起异常，异常必须使用 try / catch 处理，否则 Node.js 进程会立即退出。
除了少数例外，同步的 API（任何不接受 callback 函数的阻塞方法，例如 [fs.readFileSync]）会使用 throw 报告错误。
异步的 API 中发生的错误可能会以多种方式进行报告:
- 大多数的异步方法都接受一个 callback 函数，该函数会接受一个 Error 对象传入作为第一个参数。 如果第一个参数不是 null 而是一个 Error 实例，则说明发生了错误，应该进行处理。
```javascript
 const fs = require('fs');
  fs.readFile('一个不存在的文件', (err, data) => {
    if (err) {
      console.error('读取文件出错！', err);
      return;
    }
    // 否则处理数据
  });

```
- 当一个异步方法被一个 EventEmitter 对象调用时，错误会被分发到对象的 'error' 事件上。
```javascript
const net = require('net');
const connection = net.connect('localhost');

// 添加一个 'error' 事件句柄到一个流：
connection.on('error', (err) => {
  // 如果连接被服务器重置，或无法连接，或发生任何错误，则错误会被发送到这里。 
  console.error(err);
});

connection.pipe(process.stdout);
```
- Node.js API 中有一小部分普通的异步方法仍可能使用 throw 机制抛出异常，且必须使用 try / catch 处理。
对于所有的 EventEmitter 对象，如果没有提供一个 'error' 事件句柄，则错误会被抛出，并造成 Node.js 进程报告一个未处理的异常且随即崩溃，除非： 适当地使用 domain 模块或已经注册了一个 [process.on('uncaughtException')] 事件的句柄。
```javascript
// THIS WILL NOT WORK:
const fs = require('fs');

try {
  fs.readFile('/some/file/that/does-not-exist', (err, data) => {
    // mistaken assumption: throwing here...
    if (err) {
      throw err;
    }
  });
} catch (err) {
  // This will not catch the throw!
  console.error(err);
}
```

**Error 类**
一个通用的 JavaScript Error 对象，它不表示错误发生的具体情况。 Error 对象会捕捉一个“堆栈跟踪”，详细说明被实例化的 Error 对象在代码中的位置，并可能提供错误的文字描述。
只对于加密，如果在抛出错误时可以使用 Error 对象，则会将OpenSSL错误堆栈放入到名为 opensslErrorStack 的单独属性中。
所有由 Node.js 产生的错误，包括所有系统的和 JavaScript 的错误都实例化自或继承自 Error 类。

new Error(message)
message <string>
新建一个 Error 实例，并设置 error.message 属性以提供文本信息。 如果 message 传的是一个对象，则会调用 message.toString() 生成文本信息。 error.stack 属性表示被调用的 new Error() 在代码中的位置。 堆栈跟踪是基于 V8 的堆栈跟踪 API 的。 堆栈跟踪只会取（a）异步代码执行的开头或（b）Error.stackTraceLimit 属性给出的栈帧中的最小项。

Error.captureStackTrace(targetObject[, constructorOpt])
- targetObject <Object>
- constructorOpt <Function>
在 targetObject 上创建一个 .stack 属性，当访问时返回一个表示代码中调用 Error.captureStackTrace() 的位置的字符串。
```javascript
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // 类似 `new Error().stack`
```
可选的 constructorOpt 参数接受一个函数。 如果提供了，则 constructorOpt 之上包括自身在内的全部栈帧都会被生成的堆栈跟踪省略。
constructorOpt 参数用在向最终用户隐藏错误生成的具体细节时非常有用。
```javascript
function MyError() {
  Error.captureStackTrace(this, MyError);
}

// 没传入 MyError 到 captureStackTrace，MyError 帧会显示在 .stack 属性。
// 通过传入构造函数，可以省略该帧，且保留其下面的所有帧。
new MyError().stack;
```

**Error.stackTraceLimit**
<number>
Error.stackTraceLimit 属性指定了堆栈跟踪收集的栈帧数量（无论是 new Error().stack 或 Error.captureStackTrace(obj) 产生的）。
默认值为 10 ，但可设为任何有效的 JavaScript 数值。 值改变后的变化会影响所有捕获到的堆栈跟踪。
如果设为一个非数值或负数，则堆栈跟踪不会捕捉任何栈帧。

**error.code**
<string>
error.code 属性是标识错误类别的字符标签。

**error.message**
<string>
error.message 属性是错误的字符串描述，通过调用 new Error(message) 设置。 传给构造函数的 message 也会出现在 Error 的堆栈跟踪的第一行。 但是，Error 对象创建后改变这个属性可能不会改变堆栈跟踪的第一行（比如当 error.stack 在该属性被改变之前被读取）。

**error.stack**
<string>
error.stack 属性是一个字符串，描述代码中 Error 被实例化的位置。
第一行会被格式化为 <error class name>: <error message>，且带上一系列栈帧（每一行都以 "at " 开头）。 每一帧描述了一个代码中导致错误生成的调用点。 V8 引擎会试图显示每个函数的名称（变量名、函数名、或对象的方法名），但偶尔也可能找不到一个合适的名称。 如果 V8 引擎没法确定一个函数的名称，则只显示帧的位置信息。 否则，在位置信息的旁边会显示明确的函数名。
帧只由 JavaScript 函数产生。 例如，同步地执行一个名为 cheetahify 的 C++ 插件，且插件自身调用一个 JavaScript 函数，代表 cheetahify 回调的栈帧不会出现在堆栈跟踪里
```javascript
Error
    at new MyError (C:\Users\xxx\Desktop\learning\xxxxxxx\source\nodejs\file\test.js:516:9)
    at Object.<anonymous> (C:\Users\xxx\Desktop\learning\xxxxxxx\source\nodejs\file\test.js:519:13)
    at Module._compile (node:internal/modules/cjs/loader:1159:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1213:10)
    at Module.load (node:internal/modules/cjs/loader:1037:32)
    at Module._load (node:internal/modules/cjs/loader:878:12)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:81:12)
    at node:internal/main/run_main_module:23:47
```

位置信息会是其中之一：
- native，帧表示一个 V8 引擎内部的调用（比如，[].forEach）。
- plain-filename.js:line:column，帧表示一个 Node.js 内部的调用。
- /absolute/path/to/file.js:line:column，帧表示一个用户程序或其依赖的调用。
代表堆栈跟踪的字符串是在 error.stack 属性被访问时才生成的。
堆栈跟踪捕获的帧的数量是由 Error.stackTraceLimit 或当前事件循环中可用的帧数量的最小值界定的。
系统级的错误是由扩展的 Error 实例产生的

**Class: AssertionError**
Error 的子类，表示断言失败。 这种错误通常表示实际值和预期值不相等。
比如:
```
assert.strictEqual(1, 2);
// AssertionError [ERR_ASSERTION]: 1 === 2
```

**RangeError 类**
Error 的一个子类，表明一个函数的一个给定的参数的值不在可接受的集合或范围内； 无论是一个数字范围还是给定函数参数的选项的集合。
例子：
```
require('net').connect(-1);
// 抛出 "RangeError: "port" option should be >= 0 and < 65536: -1"
```
Node.js 会生成并以参数校验的形式立即抛出 RangeError 实例。

**ReferenceError 类**
Error 的一个子类，表明试图访问一个未定义的变量。 这些错误通常表明代码有拼写错误或程序已损坏。
虽然客户端代码可能产生和传播这些错误，但在实践中，只有 V8 引擎会这么做。
```
doesNotExist;
// 抛出 ReferenceError，在这个程序中 doesNotExist 不是一个变量。
```
除非应用程序是动态生成并运行的代码，否则 ReferenceError 实例应该始终被视为代码中或其依赖中的错误。

**SyntaxError 类**
Error 的一个子类，表明程序不是有效的 JavaScript 代码。 这些错误是代码执行的结果产生和传播的。 代码执行可能产生自 eval、Function、require 或 [vm]。 这些错误几乎都表明程序已损坏。
```
try {
  require('vm').runInThisContext('binary ! isNotOk');
} catch (err) {
  // err 是一个 SyntaxError
}
```
SyntaxError 实例在创建它们的上下文中是不可恢复的。 它们只可被其他上下文捕获。

**TypeError 类**
Error 的一个子类，表明提供的参数不是一个被允许的类型。 例如，将一个函数传给一个期望字符串的参数会被视为一个 TypeError。
```
require('url').parse(() => { });
// 抛出 TypeError，因为它期望的是一个字符串
```
Node.js 会生成并以参数校验的形式立即抛出 TypeError 实例。

###### 系统错误类
error.code
<String>
error.code 属性是一个表示错误码的字符串，总是 E 带上一串大写字母。

error.errno
<string> | <number>
error.errno 属性是一个数值或字符串。 如果返回一个数值，则数值是一个负数，对应 libuv 错误处理 中定义的错误码。 详见 uv-errno.h 头文件（Node.js 源代码中的 deps/uv/include/uv-errno.h）。 如果返回一个字符串，则同 error.code。

error.syscall
<string>
error.syscall 属性是一个字符串，描述失败的 系统调用。

error.path
<string>
错误出现时 (比如 在 fs 或 child_process), error.path属性是一个字符串，包含了相关不可用路径名。

error.address
<string>
错误出现时 (比如 在 net 或 dgram), error.address 属性是对链接失败的地址的描述。

error.port
<number>
错误出现时 (比如 在 net 或 dgram), error.port是一个链接端口不可用的端口值

**常见的系统错误**
[详细列表地址](https://man7.org/linux/man-pages/man3/errno.3.html)
- EACCES (拒绝访问): 试图以被一个文件的访问权限禁止的方式访问一个文件。
- EADDRINUSE (地址已被使用): 试图绑定一个服务器（[net]、[http] 或 [https]）到本地地址，但因另一个本地系统的服务器已占用了该地址而导致失败。
- ECONNREFUSED (连接被拒绝): 无法连接，因为目标机器积极拒绝。 这通常是因为试图连接到外部主机上的废弃的服务。
- ECONNRESET (连接被重置): 一个连接被强行关闭。 这通常是因为连接到远程 socket 超时或重启。 常发生于 [http] 和 [net] 模块。
- EEXIST (文件已存在): 一个操作的目标文件已存在，而要求目标不存在。
- EISDIR (是一个目录): 一个操作要求一个文件，但给定的路径是一个目录。
- EMFILE (系统打开了太多文件): 已达到系统文件描述符允许的最大数量，且描述符的请求不能被满足直到至少关闭其中一个。 当一次并行打开多个文件时会发生这个错误，尤其是在进程的文件描述限制数量较低的操作系统（如 macOS）。 要解决这个限制，可在运行 Node.js 进程的同一 shell 中运行 ulimit -n 2048。
- ENOENT (无此文件或目录): 通常是由 [fs] 操作引起的，表明指定的路径不存在，即给定的路径找不到文件或目录。
- ENOTDIR (不是一个目录): 给定的路径虽然存在，但不是一个目录。 通常是由 [fs.readdir] 引起的。
- ENOTEMPTY (目录非空): 一个操作的目标是一个非空的目录，而要求的是一个空目录。 通常是由 [fs.unlink] 引起的。
- EPERM (操作不被允许): 试图执行一个需要更高权限的操作。
- EPIPE (管道损坏): 写入一个管道、socket 或 FIFO 时没有进程读取数据。 常见于 [net] 和 [http] 层，表明远端要写入的流已被关闭。
- ETIMEDOUT (操作超时): 一个连接或发送的请求失败，因为连接方在一段时间后没有做出合适的响应。 常见于 [http] 或 [net]。 往往标志着 socket.end() 没有被正确地调用。

**Node.js Error Codes**

ERR_ARG_NOT_ITERABLE
需要可遍历的参数（也就是可使用 for...of 遍历的值）。

ERR_ASYNC_CALLBACK
试图注册不是 AsyncHooks 回调的函数。

ERR_ASYNC_TYPE
异步资源的类型不合法。 如果使用公共嵌入的 API，则用户可以定义自己的类型。

ERR_ENCODING_INVALID_ENCODED_DATA
提供给 util.TextDecoder() API 的数据不符合指定的编码。

ERR_ENCODING_NOT_SUPPORTED
提供给 util.TextDecoder() API 的字符编码不是WHATWG支持的字符编码。

ERR_FALSY_VALUE_REJECTION
通过util.callbackify()调用的Promise被拒绝，值是假的。

ERR_HTTP_HEADERS_SENT
当消息头已发送后，还试图添加消息头。

ERR_HTTP_INVALID_CHAR
HTTP 响应的状态信息中存在非法字符。

ERR_HTTP_INVALID_STATUS_CODE
状态码超出正常范围（100-999）。

ERR_HTTP_TRAILER_INVALID
即使传输编码不支持，也设置了Trailer头。

ERR_HTTP2_CONNECT_AUTHORITY
对于使用CONNECT方法的HTTP/2请求，:authority伪报头是必需的。

ERR_HTTP2_CONNECT_PATH
通过CONNECT方法发送的HTTP/2请求时，:path 伪header 被禁用

ERR_HTTP2_CONNECT_SCHEME
通过CONNECT方法发送HTTP/2请求时，:scheme伪header 被禁用。

ERR_HTTP2_FRAME_ERROR
通过 HTTP/2 会话发送单个数据帧失败。

ERR_HTTP2_HEADER_REQUIRED
HTTP/2 消息缺少必需的消息头。

ERR_HTTP2_HEADER_SINGLE_VALUE
为只需一个值的 HTTP/2 消息头提供了多个值。

ERR_HTTP2_HEADERS_AFTER_RESPOND
在发起HTTP/2响应后指定了额外的报头。

ERR_HTTP2_HEADERS_OBJECT
需要一个HTTP/2 Headers对象

ERR_HTTP2_HEADERS_SENT
尝试发送多个响应标头。

ERR_HTTP2_INFO_HEADERS_AFTER_RESPOND
HTTP/2信息头必须只在调用http2stream.prototype.response()方法之前发送。

ERR_HTTP2_INFO_STATUS_NOT_ALLOWED
信息性HTTP状态码(1xx)不能设置为HTTP/2响应上的响应状态码。

#### events(事件)
所有能触发事件的对象都是 EventEmitter 类的实例。 这些对象开放了一个 eventEmitter.on() 函数，允许将一个或多个函数绑定到会被对象触发的命名事件上。 事件名称通常是驼峰式的字符串，但也可以使用任何有效的 JavaScript 属性名。
当 EventEmitter 对象触发一个事件时，所有绑定在该事件上的函数都被同步地调用。 监听器的返回值会被丢弃。
```javascript
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('触发了一个事件！');
});
myEmitter.emit('event');
```
**给监听器传入参数与 this**
- eventEmitter.emit() 方法允许将任意参数传给监听器函数。 当一个普通的监听器函数被 EventEmitter 调用时，标准的 this 关键词会被设置指向监听器所附加的 EventEmitter。
- 也可以使用 ES6 的箭头函数作为监听器。但是这样 this 关键词就不再指向 EventEmitter 实例
```javascript
const myEmitter = new MyEmitter();
myEmitter.on('event', function(a, b) {
  console.log(a, b, this);
  // 打印:
  //   a b MyEmitter {
  //     domain: null,
  //     _events: { event: [Function] },
  //     _eventsCount: 1,
  //     _maxListeners: undefined }
});
myEmitter.emit('event', 'a', 'b');

// 箭头函数
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  console.log(a, b, this);
  // 打印: a b {}
});
myEmitter.emit('event', 'a', 'b');
```
**异步与同步**
EventEmitter 会按照监听器注册的顺序同步地调用所有监听器。 所以需要确保事件的正确排序且避免竞争条件或逻辑错误。 监听器函数可以使用 setImmediate() 或 process.nextTick() 方法切换到异步操作模式：
```javascript
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('这个是异步发生的');
  });
});
myEmitter.emit('event', 'a', 'b');
```

**只处理事件一次**
当使用 eventEmitter.on() 方法注册监听器时，监听器会在每次触发命名事件时被调用。
使用 eventEmitter.once() 方法时可以注册一个对于特定事件最多被调用一次的监听器。 当事件被触发时，监听器会被注销，然后再调用。
```javascript
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// 打印: 1
myEmitter.emit('event');
// 打印: 2

// once
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// 打印: 1
myEmitter.emit('event');
// 忽略
```

**错误事件**
当 EventEmitter 实例中发生错误时，会触发一个 'error' 事件。 这在 Node.js 中是特殊情况。
如果 EventEmitter 没有为 'error' 事件注册至少一个监听器，则当 'error' 事件触发时，会抛出错误、打印堆栈跟踪、且退出 Node.js 进程。
为了防止 Node.js 进程崩溃，可以在使用 domain 模块。 （注意，domain 模块已被废弃。）
作为最佳实践，应该始终为 'error' 事件注册监听器。
```javascript
const myEmitter = new MyEmitter();
myEmitter.emit('error', new Error('whoops!'));
// 抛出错误，并使 Node.js 崩溃


const myEmitter = new MyEmitter();
myEmitter.on('error', (err) => {
  console.error('有错误');
});
myEmitter.emit('error', new Error('whoops!'));
// 打印: 有错误
```

**EventEmitter 类**
当新的监听器被添加时，所有的 EventEmitter 会触发 'newListener' 事件；当移除已存在的监听器时，则触发 'removeListener'。

'newListener' 事件
- eventName <any> 要监听的事件的名称
- listener <Function> 事件的句柄函数
EventEmitter 实例会在一个监听器被添加到其内部监听器数组之前触发自身的 'newListener' 事件。
注册了 'newListener' 事件的监听器会传入事件名与被添加的监听器的引用。
事实上，在添加监听器之前触发事件有一个微妙但重要的副作用： 在'newListener' 回调函数中, 一个监听器的名字如果和已有监听器名称相同, 则在被插入到EventEmitter实例的内部监听器数组时, 该监听器会被添加到其它同名监听器的前面。
```javascript
const myEmitter = new MyEmitter();
// 只处理一次，所以不会无限循环
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 在开头插入一个新的监听器
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// 打印:
//   B
//   A
```

'removeListener' 事件
- eventName <any> 事件名
- listener <Function> 事件句柄函数
'removeListener' 事件在 listener 被移除后触发。

EventEmitter.defaultMaxListeners
每个事件默认可以注册最多 10 个监听器。 单个 EventEmitter 实例的限制可以使用 emitter.setMaxListeners(n) 方法改变。 所有 EventEmitter 实例的默认值可以使用 EventEmitter.defaultMaxListeners 属性改变。 如果这个值不是正数, 那将抛出 TypeError错误.
*设置 EventEmitter.defaultMaxListeners 要谨慎，因为会影响所有 EventEmitter 实例，包括之前创建的。 因而，调用 emitter.setMaxListeners(n) 优先于 EventEmitter.defaultMaxListeners。*
注意，这不是一个硬性限制。 EventEmitter 实例允许添加更多的监听器，但会向 stderr 输出跟踪警告，表明检测到一个可能的 EventEmitter 内存泄漏。 对于任何单个 EventEmitter 实例，emitter.getMaxListeners() 和 emitter.setMaxListeners() 方法可用于暂时地消除此警告：
```javascript
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // 做些操作
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```
*--trace-warnings 命令行标志可用于显示此类警告的堆栈跟踪。*
触发的警告可以使用 process.on('warning') 检查，还有额外的 emitter、type 和 count 属性，分别代表事件触发器实例的引用、事件的名称、和附加的监听器的数量。其 name 属性设置为 MaxListenersExceededWarning。

emitter.addListener(eventName, listener)
- eventName <any>
- listener <Function>
emitter.on(eventName, listener) 的别名。

emitter.emit(eventName[, ...args])
- eventName <any>
- ...args <any>
按监听器的注册顺序，同步地调用每个注册到名为 eventName 事件的监听器，并传入提供的参数。
如果事件有监听器，则返回 true ，否则返回 false。

emitter.eventNames()
返回一个列出触发器已注册监听器的事件的数组。 数组中的值为字符串或符号。
```javascript
const EventEmitter = require('events');
const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// 打印: [ 'foo', 'bar', Symbol(symbol) ]
```

emitter.getMaxListeners()
返回 EventEmitter 当前的最大监听器限制值，该值可以通过 emitter.setMaxListeners(n) 设置或默认为 EventEmitter.defaultMaxListeners。

emitter.listenerCount(eventName)
- eventName <any> 正在被监听的事件名
返回正在监听名为 eventName 的事件的监听器的数量。

emitter.listeners(eventName)
- eventName <any>
返回名为 eventName 的事件的监听器数组的副本。
```javascript
server.on('connection', (stream) => {
  console.log('someone connected!');
});
console.log(util.inspect(server.listeners('connection')));
// 打印: [ [Function] ]
```

emitter.on(eventName, listener)
- eventName <any> 事件名
- listener <Function> 回调函数
添加 listener 函数到名为 eventName 的事件的监听器数组的末尾。 不会检查 listener 是否已被添加。 多次调用并传入相同的 eventName 和 listener 会导致 listener 被添加与调用多次。
返回一个 EventEmitter 引用，可以链式调用。
默认情况下，事件监听器会按照添加的顺序依次调用。 emitter.prependListener() 方法可用于将事件监听器添加到监听器数组的开头。
```javascript
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// 打印:
//   b
//   a
```

emitter.once(eventName, listener)
- eventName <any> 事件名
- listener <Function> 回调函数
添加一个单次 listener 函数到名为 eventName 的事件。 下次触发 eventName 事件时，监听器会被移除，然后调用。
返回一个 EventEmitter 引用，可以链式调用。
默认情况下，事件监听器会按照添加的顺序依次调用。 emitter.prependOnceListener() 方法可用于将事件监听器添加到监听器数组的开头。
```javascript
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
myEE.emit('foo');
// 打印:
//   b
//   a
```

emitter.prependListener(eventName, listener)
- eventName <any> 事件名
- listener <Function> 回调函数
添加 listener 函数到名为 eventName 的事件的监听器数组的开头。 不会检查 listener 是否已被添加。 多次调用并传入相同的 eventName 和 listener 会导致 listener 被添加与调用多次。
返回一个 EventEmitter 引用，可以链式调用。

emitter.prependOnceListener(eventName, listener)
- eventName <any> 事件名
- listener <Function> 回调函数
添加一个单次 listener 函数到名为 eventName 的事件的监听器数组的开头。 下次触发 eventName 事件时，监听器会被移除，然后调用。
返回一个 EventEmitter 引用，可以链式调用。

emitter.removeAllListeners([eventName])
- eventName <any>
移除全部或指定 eventName 的监听器。
*注意，在代码中移除其他地方添加的监听器是一个不好的做法，尤其是当 EventEmitter 实例是其他组件或模块（如 socket 或文件流）创建的。*
返回一个 EventEmitter 引用，可以链式调用。

emitter.removeListener(eventName, listener)
- eventName <any>
- listener <Function>
从名为 eventName 的事件的监听器数组中移除指定的 listener。
*removeListener 最多只会从监听器数组里移除一个监听器实例。 如果任何单一的监听器被多次添加到指定 eventName 的监听器数组中，则必须多次调用 removeListener 才能移除每个实例。*
*注意，一旦一个事件被触发，所有绑定到它的监听器都会按顺序依次触发。 这意味着，在事件触发后、最后一个监听器完成执行前，任何 removeListener() 或 removeAllListeners() 调用都不会从 emit() 中移除它们。 随后的事件会像预期的那样发生。*
```javascript
const myEmitter = new MyEmitter();

const callbackA = () => {
  console.log('A');
  myEmitter.removeListener('event', callbackB);
};

const callbackB = () => {
  console.log('B');
};

myEmitter.on('event', callbackA);

myEmitter.on('event', callbackB);

// callbackA 移除了监听器 callbackB，但它依然会被调用。
// 触发是内部的监听器数组为 [callbackA, callbackB]
myEmitter.emit('event');
// 打印:
//   A
//   B

// callbackB 被移除了。
// 内部监听器数组为 [callbackA]
myEmitter.emit('event');
// 打印:
//   A
```
*因为监听器是使用内部数组进行管理的，所以调用它会改变在监听器被移除后注册的任何监听器的位置索引。 虽然这不会影响监听器的调用顺序，但意味着由 emitter.listeners() 方法返回的监听器数组副本需要被重新创建。*
返回一个 EventEmitter 引用，可以链式调用。

emitter.setMaxListeners(n)
- n <integer>
默认情况下，如果为特定事件添加了超过 10 个监听器，则 EventEmitter 会打印一个警告。 此限制有助于寻找内存泄露。 但是，并不是所有的事件都要被限为 10 个。 emitter.setMaxListeners() 方法允许修改指定的 EventEmitter 实例的限制。 值设为 Infinity（或 0）表明不限制监听器的数量。
返回一个 EventEmitter 引用，可以链式调用。