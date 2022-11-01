---
title: nodejs基础知识(2)
date: 2022-10-19 19:12:12
tags: [node, assert, asyncHooks]
---

#### nodejs文档知识点

###### assert-断言
*作用：*用于测试不变式

*assert.deepEqual(a, b[, message])*
只测试可枚举的自身属性，原始值使用 == 进行比较，不测试对象原型、连接符、不可枚举属性等
注意：子对象中可枚举的属性也会被测试

*assert.deepStrictEqual(a, b[, message])*
与assert.deepEqual作用类似，使用全等 === 进行比较

*assert.doesNotThrow(block[, error][, message])*
调用block函数，如果抛出错误且错误类型与error类型一致，则抛出AssertionError，否则抛出错误

*assert.equal(actual, expected[, message])*
使用相等运算符 == 测试actual与expected是否相等

*assert.fail(message)*
*assert.fail(actual, expected[, message[, operator[, stackStartFunction]]])*
抛出AssertionError。如果 message 参数为空，则错误信息为 actual 参数 + operator 参数 + expected 参数。 如果只提供了 actual 参数与 expected 参数，则 operator 参数默认为 '!='。 如果提供了 message 参数，则它会作为错误信息，其他参数会保存在错误对象的属性中。 如果提供了 stackStartFunction 参数，则该函数上的栈帧都会从栈信息中移除

*assert.ifError(value)*
如果value为真，则抛出value，即value为错误信息

*assert.notDeepEqual(actual, expected[, message])*
测试不深度相等，与assert.deepEqual()相反

*assert.notDeepStrictEqual(actual, expected[, message])*
测试是否不深度全等，与assert.deepStrictEqual()相反

*assert.notEqual(actual, expected[, message])*
使用 != 不等运算符测试参数是否不相等

*assert.notStrictEqual(actual, expected[, message])*
使用不全等运算符（!==）测试参数是否不全等

*assert.ok(value[, message])*
测试 value 是否为真值。 相当于 assert.equal(!!value, true, message)


###### 异步钩子(Async Hooks)
Error handling(错误处理)
应用程序运行时带有--abort on uncaught可以实现退出后，打印堆栈跟踪，留下一个核心文件
**If any AsyncHook callbacks throw, the application will print the stack trace and exit. The exit path does follow that of an uncaught exception, but all 'uncaughtException' listeners are removed, thus forcing the process to exit. The 'exit' callbacks will still be called unless the application is run with --abort-on-uncaught-exception, in which case a stack trace will be printed and the application exits, leaving a core file.**

Printing in AsyncHook callbacks(异步钩子打印信息)
在异步钩子函数中，打印信息查看数据不能使用 console.log等异步操作，会导致无限递归。
推荐使用 fs.writeSync(1, msg).
```javascript
const fs = require('fs');
const util = require('util');

function debug(...args) {
  // use a function like this one when debugging inside an AsyncHooks callback
  fs.writeSync(1, `${util.format(...args)}\n`);
}
```
**Because printing to the console is an asynchronous operation, console.log() will cause AsyncHook callbacks to be called. Using console.log() or similar asynchronous operations inside an AsyncHook callback function will cause an infinite recursion. An easy solution to this when debugging is to use a synchronous logging operation such as fs.writeFileSync(file, msg, flag). This will print to the file and will not invoke AsyncHook recursively because it is synchronous.**

*asyncHook.enable()*
启用异步钩子

*asyncHook.disable()*
禁用异步钩子

*init(asyncId, type, triggerAsyncId, resource)*
asyncId: number类型，唯一标识符
type: string类型，异步类型
triggerAsyncId: number类型，在其执行上下文中创建此异步资源的异步资源的唯一ID
resource: object类型，异步操作的资源的引用，需要在销毁期间释放
应用场景：用于资源开启，被调用之前

```javascript
require('net').createServer().listen(function() { this.close(); });
// OR
clearTimeout(setTimeout(() => {}, 10));
```
注意：每个资源的ID在当前进程作用域中唯一

*type*命名一般符合资源结构，比如：
```
FSEVENTWRAP, FSREQWRAP, GETADDRINFOREQWRAP, GETNAMEINFOREQWRAP, HTTPPARSER,
JSSTREAM, PIPECONNECTWRAP, PIPEWRAP, PROCESSWRAP, QUERYWRAP, SHUTDOWNWRAP,
SIGNALWRAP, STATWATCHER, TCPCONNECTWRAP, TCPSERVER, TCPWRAP, TIMERWRAP, TTYWRAP,
UDPSENDWRAP, UDPWRAP, WRITEWRAP, ZLIB, SSLCONNECTION, PBKDF2REQUEST,
RANDOMBYTESREQUEST, TLSWRAP, Timeout, Immediate, TickObject, PROMISE
```
备注：type类型可能存在冲突，推荐给type添加前缀，比如 package name

*triggerAsyncId*
引起新资源初始化，调用init函数的资源的唯一标识符，triggerAsyncId展示资源为什么被创建
```javascript
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    fs.writeSync(
      1, `${type}(${asyncId}): trigger: ${triggerAsyncId} execution: ${eid}\n`);
  }
}).enable();

require('net').createServer((conn) => {}).listen(8080);
```

*resource*
实际初始化的异步资源

```javascript
let indent = 0;
async_hooks.createHook({
  init(asyncId, type, triggerAsyncId) {
    const eid = async_hooks.executionAsyncId();
    const indentStr = ' '.repeat(indent);
    fs.writeSync(
      1,
      `${indentStr}${type}(${asyncId}):` +
      ` trigger: ${triggerAsyncId} execution: ${eid}\n`);
  },
  before(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(1, `${indentStr}before:  ${asyncId}\n`);
    indent += 2;
  },
  after(asyncId) {
    indent -= 2;
    const indentStr = ' '.repeat(indent);
    fs.writeSync(1, `${indentStr}after:   ${asyncId}\n`);
  },
  destroy(asyncId) {
    const indentStr = ' '.repeat(indent);
    fs.writeSync(1, `${indentStr}destroy: ${asyncId}\n`);
  },
}).enable();

require('net').createServer(() => {}).listen(8080, () => {
  // Let's wait 10ms before logging the server started.
  setTimeout(() => {
    console.log('>>>', async_hooks.executionAsyncId());
  }, 10);
});


// 打印
TCPSERVERWRAP(2): trigger: 1 execution: 1
TickObject(3): trigger: 2 execution: 1
before:  3
  Timeout(4): trigger: 3 execution: 3
  TIMERWRAP(5): trigger: 3 execution: 3
after:   3
destroy: 3
before:  5
  before:  4
    TTYWRAP(6): trigger: 4 execution: 4
    SIGNALWRAP(7): trigger: 4 execution: 4
    TTYWRAP(8): trigger: 4 execution: 4
>>> 4
    TickObject(9): trigger: 4 execution: 4
  after:   4
after:   5
before:  9
after:   9
destroy: 4
destroy: 9
destroy: 5
```

*before(asyncId)*
当异步操作启动（如 TCP 服务器接收新连接）或完成（如将数据写入磁盘）时，会调用回调通知用户。 before 回调在所述回调执行之前被调用。 asyncId 是分配给即将执行回调的资源的唯一标识符。

*after(asyncId)*
在 before 中指定的回调完成后立即调用。
注意：callback执行中产生异常，after在'uncaughtException' 事件或域的处理程序运行后运行

*destroy(asyncId)*
asyncId 对应的资源销毁后调用。 它也从嵌入器 API emitDestroy() 异步调用。
注意：如果资源的回收依赖于垃圾回收机制，由于内存泄露，通过resource对象传给init的引用，destroy不会被调用。???如果不依赖垃圾回收机制，则没有上述问题。

*promiseResolve(asyncId)*
当调用传给 Promise 构造函数的 resolve 函数时调用（直接或通过其他解决 promise 的方法）。
注意：这并不一定意味着promise在此时被resolve或reject，promise可能是通过假设另一个Promise的状态来解决的

*async_hooks.executionAsyncResource()*
executionAsyncResource() 返回的资源对象通常是带有未记录 API 的内部 Node.js 句柄对象。 在对象上使用任何函数或属性都可能使您的应用程序崩溃，应该避免。

*async_hooks.executionAsyncId()*
当前执行上下文的asyncId，可用于跟踪某些函数被调用的情况
```javascript
const async_hooks = require('async_hooks');

console.log(async_hooks.executionAsyncId());  // 1 - bootstrap
fs.open(path, 'r', (err, fd) => {
  console.log(async_hooks.executionAsyncId());  // 6 - open()
});
```
executionAsyncId() 返回的 ID 与执行时机有关，与因果无关（被 triggerAsyncId() 涵盖）
```javascript
const server = net.createServer(function onConnection(conn) {
  // Returns the ID of the server, not of the new connection, because the
  // onConnection callback runs in the execution scope of the server's
  // MakeCallback().
  async_hooks.executionAsyncId();

}).listen(port, function onListening() {
  // Returns the ID of a TickObject (i.e. process.nextTick()) because all
  // callbacks passed to .listen() are wrapped in a nextTick().
  async_hooks.executionAsyncId();
});
```

*async_hooks.triggerAsyncId()*
返回正在执行资源的Id
默认情况下，promise 上下文可能无法获得有效的 triggerAsyncId。
```javascript
const server = net.createServer((conn) => {
  // The resource that caused (or triggered) this callback to be called
  // was that of the new connection. Thus the return value of triggerAsyncId()
  // is the asyncId of "conn".
  async_hooks.triggerAsyncId();

}).listen(port, () => {
  // Even though all callbacks passed to .listen() are wrapped in a nextTick()
  // the callback itself exists because the call to the server's .listen()
  // was made. So the return value would be the ID of the server.
  async_hooks.triggerAsyncId();
});
```

*async_hooks.asyncWrapProviders*
返回：提供程序类型到相应数字id的map映射。此映射包含可能由async_hooks.init发出的所有事件类型
此特性禁止使用 process.binding('async_wrap').Providers

*Promise 执行跟踪*
默认情况下，由于 V8 提供的 promise 自省 API 相对昂贵，因此不会为 promise 执行分配 asyncId。 这意味着默认情况下，使用 promise 或 async/await 的程序将无法正确执行并触发 promise 回调上下文的 id。
```javascript
import { executionAsyncId, triggerAsyncId } from 'node:async_hooks';

Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 1 tid 0
```
```javascript
import { createHook, executionAsyncId, triggerAsyncId } from 'node:async_hooks';
createHook({ init() {} }).enable(); // forces PromiseHooks to be enabled.
Promise.resolve(1729).then(() => {
  console.log(`eid ${executionAsyncId()} tid ${triggerAsyncId()}`);
});
// produces:
// eid 7 tid 6
```

###### AsyncResource类
AsyncResource类被设计为由嵌入程序的异步资源扩展。使用它，用户可以轻松地触发自己资源的生命周期事件。
```javascript
import { AsyncResource, executionAsyncId } from 'node:async_hooks';

// AsyncResource() is meant to be extended. Instantiating a
// new AsyncResource() also triggers init. If triggerAsyncId is omitted then
// async_hook.executionAsyncId() is used.
const asyncResource = new AsyncResource(
  type, { triggerAsyncId: executionAsyncId(), requireManualDestroy: false }
);

// Run a function in the execution context of the resource. This will
// * establish the context of the resource
// * trigger the AsyncHooks before callbacks
// * call the provided function `fn` with the supplied arguments
// * trigger the AsyncHooks after callbacks
// * restore the original execution context
asyncResource.runInAsyncScope(fn, thisArg, ...args);

// Call AsyncHooks destroy callbacks.
asyncResource.emitDestroy();

// Return the unique ID assigned to the AsyncResource instance.
asyncResource.asyncId();

// Return the trigger ID for the AsyncResource instance.
asyncResource.triggerAsyncId();
```

###### AsyncLocalStorage 类


###### 参考
https://www.jianshu.com/p/4a568dac41ed