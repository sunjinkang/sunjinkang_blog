---
title: nodejs基础知识(11)
date: 2023-03-10 21:15:16
tags: [node, timers 定时器]
---

#### timers 定时器
Immediate 类
此对象是在 setImmediate() 内部创建并返回。 它可以传给 clearImmediate() 以取消调度的行动。

默认情况下，当立即调度时，只要立即处于活动状态，则 Node.js 事件循环就会继续运行。 setImmediate() 返回的 Immediate 对象导出可用于控制此默认行为的 immediate.ref() 和 immediate.unref() 函数。

immediate.hasRef()
如果为 true，则 Immediate 对象将使 Node.js 事件循环保持活动状态。

immediate.ref()
调用时，只要 Immediate 处于活动状态，就请求 Node.js 事件循环不退出。 多次调用 immediate.ref() 将不起作用。

默认情况下，所有 Immediate 对象都被“引用”，这使得通常不需要调用 immediate.ref() 除非之前已经调用过 immediate.unref()。

immediate.unref()
调用时，活动的 Immediate 对象不需要 Node.js 事件循环保持活动状态。 如果没有其他活动保持事件循环运行，则进程可能会在调用 Immediate 对象的回调之前退出。 多次调用 immediate.unref() 将不起作用。

Timeout 类
此对象是在 setTimeout() 和 setInterval() 内部创建并返回。 它可以传给 clearTimeout() 或 clearInterval() 以取消调度的行动。

默认情况下，当使用 setTimeout() 或 setInterval() 调度定时器时，只要定时器处于活动状态，则 Node.js 事件循环就会继续运行。 这些函数返回的每个 Timeout 对象都导出可用于控制此默认行为的 timeout.ref() 和 timeout.unref() 函数。

timeout.close()
取消超时。

timeout.hasRef()
如果为 true，则 Timeout 对象将使 Node.js 事件循环保持活动状态。

timeout.ref()
调用时，只要 Timeout 处于活动状态，就请求 Node.js 事件循环不退出。 多次调用 timeout.ref() 将不起作用。
默认情况下，所有 Timeout 对象都被“引用”，这使得通常不需要调用 timeout.ref() 除非之前已经调用过 timeout.unref()。

timeout.refresh()
将定时器的开始时间设置为当前时间，并重新调度定时器在调整为当前时间的先前指定的时长调用其回调。 这对于在不分配新的 JavaScript 对象的情况下刷新定时器很有用。
在已经调用其回调的定时器上使用它会重新激活定时器。

timeout.unref()
调用时，活动的 Timeout 对象不需要 Node.js 事件循环保持活动状态。 如果没有其他活动保持事件循环运行，则进程可能会在调用 Timeout 对象的回调之前退出。 多次调用 timeout.unref() 将不起作用。

timeout[Symbol.toPrimitive]()
将 Timeout 强制为原始类型。 该原始类型可用于清除 Timeout。 该原始类型只能在创建超时的同一线程中使用。 因此，要在 worker_threads 上使用它，则必须首先将其传给正确的线程。 这允许增强与浏览器 setTimeout() 和 setInterval() 实现的兼容性。

调度定时器
Node.js 中的定时器是一种会在一段时间后调用给定函数的内部构造。 定时器函数的调用时间取决于用于创建定时器的方法以及 Node.js 事件循环正在执行的其他工作。

setImmediate(callback[, ...args])
callback <Function> 在本轮 Node.js 事件循环结束时调用的函数
...args <any> 调用 callback 时要传入的可选参数。
返回: <Immediate> 用于 clearImmediate()
在 I/O 事件的回调之后调度 callback 的“立即”执行。

当多次调用 setImmediate() 时，则 callback 函数会按照它们的创建顺序排队执行。 每次事件循环迭代都会处理整个回调队列。 如果立即定时器从正在执行的回调中排队，则直到下一次事件循环迭代才会触发该定时器。
*如果 callback 不是函数，则将抛出 TypeError。*
此方法具有可使用 timersPromises.setImmediate() 获得的 promise 的自定义变体。

setInterval(callback[, delay[, ...args]])
每 delay 毫秒调度重复执行 callback。
当 delay 大于 2147483647 或小于 1 时，则 delay 将设置为 1。 非整数延迟被截断为整数。
如果 callback 不是函数，则将抛出 TypeError。
此方法具有可使用 timersPromises.setInterval() 获得的 promise 的自定义变体。

setTimeout(callback[, delay[, ...args]])
在 delay 毫秒后调度单次的 callback 的执行。
callback 可能不会在精确的 delay 毫秒内被调用。 Node.js 不保证回调将触发的确切时间，也不保证它们的顺序。 回调将在尽可能接近指定的时间时调用。
当 delay 大于 2147483647 或小于 1 时，则 delay 将设置为 1。 非整数延迟被截断为整数。
如果 callback 不是函数，则将抛出 TypeError。
此方法具有可使用 timersPromises.setTimeout() 获得的 promise 的自定义变体。

取消定时器
setImmediate()、setInterval() 和 setTimeout() 方法各自返回表示调度的定时器的对象。 这些可用于取消定时器并防止其触发。
对于 setImmediate() 和 setTimeout() 的 promise 化变体，可以使用 AbortController 来取消定时器。 
当取消时，返回的 Promise 将使用 'AbortError' 拒绝。

对于 setImmediate()：
```javascript
const { setImmediate: setImmediatePromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setImmediatePromise('foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.log('The immediate was aborted');
  });

ac.abort();
```
对于 setTimeout()：
```javascript
const { setTimeout: setTimeoutPromise } = require('node:timers/promises');

const ac = new AbortController();
const signal = ac.signal;

setTimeoutPromise(1000, 'foobar', { signal })
  .then(console.log)
  .catch((err) => {
    if (err.name === 'AbortError')
      console.log('The timeout was aborted');
  });

ac.abort();
```

定时器的 Promise API
timers/promises API 提供了一组可返回 Promise 对象的可供选择的定时器函数。 API 可通过 require('node:timers/promises') 访问。

timersPromises.setTimeout([delay[, value[, options]]])
delay <number> 在履行 promise 之前等待的毫秒数。 默认值: 1。
value <any> 履行 promise 使用的值。
options <Object>
- ref <boolean> 设置为 false 以指示调度的 Timeout 不应要求 Node.js 事件循环保持活动状态。 默认值: true。
- signal <AbortSignal> 可选的 AbortSignal，可用于取消调度的 Timeout。
```javascript
import {
  setTimeout,
} from 'timers/promises';

const res = await setTimeout(100, 'result');

console.log(res);  // 打印 'result'
```

timersPromises.setImmediate([value[, options]])
```javascript
import {
  setImmediate,
} from 'timers/promises';

const res = await setImmediate('result');

console.log(res);  // 打印 'result'
```

timersPromises.setInterval([delay[, value[, options]]])
```javascript
import {
  setInterval,
} from 'timers/promises';

const interval = 100;
for await (const startTime of setInterval(interval, Date.now())) {
  const now = Date.now();
  console.log(now);
  if ((now - startTime) > 1000)
    break;
}
console.log(Date.now());
```
