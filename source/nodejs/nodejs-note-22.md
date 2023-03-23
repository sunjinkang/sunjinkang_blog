---
title: nodejs基础知识(12)
date: 2023-02-25 20:08:26
tags: [node, perf_hooks 性能钩子]
---

#### perf_hooks 性能钩子

performance.eventLoopUtilization([utilization1[, utilization2]])
utilization1 <Object> 上一次调用 eventLoopUtilization() 的结果。
utilization2 <Object> 在 utilization1 之前调用 eventLoopUtilization() 的结果。
返回 <Object>
- idle <number>
- active <number>
- utilization <number>
eventLoopUtilization() 方法返回包含事件循环作为高解析度毫秒计时器的既空闲又活动的累积持续时间的对象。 utilization 值是计算的事件循环利用率 (ELU)。

如果主线程上的引导尚未完成，则属性的值为 0。 由于引导发生在事件循环内，所以 ELU 立即在工作线程上可用。

utilization1 和 utilization2 都是可选参数。

如果传入了 utilization1，则计算当前调用的 active 和 idle 之间的差值，以及对应的 utilization 值(类似于 process.hrtime())。

如果传入了 utilization1 和 utilization2，则计算两个参数之间的增量。 这是便捷的选项，因为与 process.hrtime() 不同，计算 ELU 比单个减法更复杂。

ELU 类似于 CPU 使用率，不同之处在于它只测量事件循环统计信息而不是 CPU 使用率。 它表示事件循环在事件循环的事件提供者（例如 epoll_wait）之外花费的时间百分比。 不考虑其他 CPU 空闲时间。 以下是主要空闲进程如何具有高 ELU 的示例。
```
'use strict';
const { eventLoopUtilization } = require('node:perf_hooks').performance;
const { spawnSync } = require('node:child_process');

setImmediate(() => {
  const elu = eventLoopUtilization();
  spawnSync('sleep', ['5']);
  console.log(eventLoopUtilization(elu).utilization);
});
```
虽然运行这个脚本时 CPU 大部分是空闲的，但 utilization 的值为 1。 这是因为对 child_process.spawnSync() 的调用阻止了事件循环的进行。
传入用户定义的对象而不是先前调用 eventLoopUtilization() 的结果将导致未定义的行为。 不保证返回值反映事件循环的任何正确状态。

performance.getEntries()
返回 PerformanceEntry 对象的列表，按照相对于 performanceEntry.startTime 的时间顺序排列。 如果您只对某些类型或具有某些名称的性能条目感兴趣，则参阅 performance.getEntriesByType() 和 performance.getEntriesByName()。

performance.mark([name[, options]])
name <string>
options <Object>
- detail <any> 包含在标记中的附加可选细节。
- startTime <number> 用作标记时间的可选时间戳。 默认值: performance.now().
在性能时间轴中创建新的 PerformanceMark 条目。 PerformanceMark 是 PerformanceEntry 的子类，其 performanceEntry.entryType 始终为 'mark'，而其 performanceEntry.duration 始终为 0。 性能标记用于标记性能时间轴中的特定重要时刻。
创建的 PerformanceMark 条目放入全局的性能时间轴，可以用 performance.getEntries、performance.getEntriesByName、performance.getEntriesByType 查询。 当执行观察时，应使用 performance.clearMarks 手动从全局的性能时间轴中清除条目。

performance.markResourceTiming(timingInfo, requestedUrl, initiatorType, global, cacheMode)
- timingInfo <Object> 获取计时信息
- requestedUrl <string> 资源网址
- initiatorType <string> 启动器名称，例如：'fetch'
- global <Object>
- cacheMode <string> 缓存模式必须为空字符串（''）或 'local' *此属性是 Node.js 的扩展。 它在 Web 浏览器中不可用。*
在资源时间线中创建新的 PerformanceResourceTiming 条目。 PerformanceResourceTiming 是 PerformanceEntry 的子类，其 performanceEntry.entryType 始终是 'resource'。 性能资源用于在资源时间线中标记时刻。
创建的 PerformanceMark 条目放入全局资源时间线，可以使用 performance.getEntries、performance.getEntriesByName、performance.getEntriesByType 查询。 当执行观察时，应使用 performance.clearResourceTimings 手动从全局的性能时间轴中清除条目。

performance.measure(name[, startMarkOrOptions[, endMark]])
- name <string>
- startMarkOrOptions <string> | <Object> 可选的。
  - detail <any> 要包含在度量中的其他可选细节。
  - duration <number> 开始和结束时间之间的持续时间。
  - end <number> | <string> 用作结束时间的时间戳，或标识先前记录标记的字符串。
  - start <number> | <string> 用作开始时间的时间戳，或标识先前记录标记的字符串。
  - endMark <string> 可选的。 *如果 startMarkOrOptions 是 <Object>，则必须省略。*
在性能时间轴中创建新的 PerformanceMeasure 条目。 PerformanceMeasure 是 PerformanceEntry 的子类，其 performanceEntry.entryType 始终为 'measure'，其 performanceEntry.duration 测量自 startMark 和 endMark 以来经过的毫秒数。

startMark 参数可以标识性能时间轴中的任何现有的 PerformanceMark，或者可能标识由 PerformanceNodeTiming 类提供的任何时间戳属性。 如果指定的 startMark 不存在，则抛出错误。

可选的 endMark 参数必须标识性能时间轴中的任何现有的 PerformanceMark 或 PerformanceNodeTiming 类提供的任何时间戳属性。 不传入参数则 endMark 为 performance.now()，否则如果命名的 endMark 不存在，则抛出错误。

创建的 PerformanceMeasure 条目放入全局的性能时间轴，可以用 performance.getEntries、performance.getEntriesByName、performance.getEntriesByType 查询。 当执行观察时，应使用 performance.clearMeasures 手动从全局的性能时间轴中清除条目。

performance.nodeTimin
*此属性是 Node.js 的扩展。 它在 Web 浏览器中不可用。*
PerformanceNodeTiming 类的实例，为特定的 Node.js 操作里程碑提供性能指标。

performance.now()
返回当前的高解析度毫秒时间戳，其中 0 表示当前的 node 进程的开始。

performance.timeOrigin
timeOrigin 指定了当前的 node 进程开始的高解析度毫秒时间戳，以 Unix 时间度量。

performance.timerify(fn[, options])
fn <Function>
options <Object>
histogram <RecordableHistogram> 使用 perf_hooks.createHistogram() 创建的直方图对象，以纳秒为单位记录运行时间。
*此属性是 Node.js 的扩展。 它在 Web 浏览器中不可用。*

将函数封装在测量被封装函数运行时间的新函数中。 PerformanceObserver 必须订阅 'function' 事件类型才能访问时间细节。
```
const {
  performance,
  PerformanceObserver
} = require('node:perf_hooks');

function someFunction() {
  console.log('hello world');
}

const wrapped = performance.timerify(someFunction);

const obs = new PerformanceObserver((list) => {
  console.log(list.getEntries()[0].duration);

  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'] });

// 将创建性能时间轴条目
wrapped();
```
如果封装的函数返回 promise，则 finally 句柄将绑定到该 promise 上，并且一旦调用 finally 句柄就会报告持续时间。

performance.toJSON()
performance 对象的 JSON 表示的对象。 类似于浏览器中的 window.performance.toJSON。

###### PerformanceEntry 类

performanceEntry.duration
此条目经过的总毫秒数。 此值对所有性能条目类型都没有意义。

performanceEntry.entryType
性能条目的类型。 它可能是以下之一：
- 'node'（仅限 Node.js）
- 'mark'（在 Web 上可用）
- 'measure'（在 Web 上可用）
- 'gc'（仅限 Node.js）
- 'function'（仅限 Node.js）
- 'http2'（仅限 Node.js）
- 'http'（仅限 Node.js）

performanceEntry.flags
*此属性是 Node.js 的扩展。 它在 Web 浏览器中不可用。*

当 performanceEntry.entryType 等于 'gc' 时，则 performance.flags 属性包含有关垃圾收集操作的附加信息。 该值可能是以下之一：
- perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_NO
- perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_CONSTRUCT_RETAINED
- perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_FORCED
- perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SYNCHRONOUS_PHANTOM_PROCESSING
- perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_AVAILABLE_GARBAGE
- perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_ALL_EXTERNAL_MEMORY
- perf_hooks.constants.NODE_PERFORMANCE_GC_FLAGS_SCHEDULE_IDLE

performanceEntry.kind
*此属性是 Node.js 的扩展。 它在 Web 浏览器中不可用。*

当 performanceEntry.entryType 等于 'gc' 时，则 performance.kind 属性标识发生的垃圾收集操作的类型。 该值可能是以下之一：
- perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR
- perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR
- perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL
- perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB

HTTP 的详细信息
当 performanceEntry.type 等于 'http' 时，则 performanceEntry.detail 属性将是一个包含额外信息的 <Object>。
- 如果 performanceEntry.name 等于 HttpClient，则 detail 将包含以下属性：req、res。 而 req 属性将是包含 method、url、headers 的 <Object>，res 属性将是包含 statusCode、statusMessage、headers 的 <Object>。
- 如果 performanceEntry.name 等于 HttpRequest，则 detail 将包含以下属性：req、res。 而 req 属性将是包含 method、url、headers 的 <Object>，res 属性将是包含 statusCode、statusMessage、headers 的 <Object>。

这可能会增加额外的内存开销，并且只能用于诊断目的，而不是默认情况下在生产中打开。

HTTP/2 的详细信息
当 performanceEntry.type 等于 'http2' 时，则 performanceEntry.detail 属性将是包含附加性能信息的 <Object>。
*如果 performanceEntry.name 等于 Http2Stream，则 detail 将包含以下属性：*
- bytesRead <number> 为此 Http2Stream 接收的 DATA 帧字节数。
- bytesWritten <number> 为此 Http2Stream 发送的 DATA 帧字节数。
- id <number> 关联 Http2Stream 的标识符
- timeToFirstByte <number> 从 PerformanceEntry startTime 到接收到第一个 DATA 帧之间经过的毫秒数。
- timeToFirstByteSent <number> 从 PerformanceEntry startTime 到发送的第一个 DATA 帧之间经过的毫秒数。
- timeToFirstHeader <number> 从 PerformanceEntry startTime 到接收到第一个标头之间经过的毫秒数。

*如果 performanceEntry.name 等于 Http2Session，则 detail 将包含以下属性：*
- bytesRead <number> 为此 Http2Session 接收的字节数。
- bytesWritten <number> 为此 Http2Session 发送的字节数。
- framesReceived <number> Http2Session 接收到的 HTTP/2 帧数。
- framesSent <number> Http2Session 发送的 HTTP/2 帧数。
- maxConcurrentStreams <number> Http2Session 生命周期内同时打开的最大流数。
- pingRTT <number> 从发送 PING 帧到接收到它的确认所经过的毫秒数。 只有在 Http2Session 上发送了 PING 帧时才会出现。
- streamAverageDuration <number> 所有 Http2Stream 实例的平均持续时间（以毫秒为单位）
- streamCount <number> Http2Session 处理的 Http2Stream 实例的数量。
- type <string> 'server' 或 'client' 来标识 Http2Session 的类型。

计时器化的详细信息
当 performanceEntry.type 等于 'function' 时，则 performanceEntry.detail 属性将是列出计时函数的输入参数的 <Array>。

网络('net')的详细信息
当 performanceEntry.type 等于 'net' 时，则 performanceEntry.detail 属性将是一个包含额外信息的 <Object>。
如果 performanceEntry.name 等于 connect，则 detail 将包含以下属性：host、port。

域名系统('dns')的详细信息
当 performanceEntry.type 等于 'dns' 时，则 performanceEntry.detail 属性将是一个包含额外信息的 <Object>。
- 如果 performanceEntry.name 等于 lookup，则 detail 将包含以下属性：hostname、family、hints、verbatim。
- 如果 performanceEntry.name 等于 lookupService，则 detail 将包含以下属性：host、port。
- 如果 performanceEntry.name 等于 queryxxx 或 getHostByAddr，则 detail 将包含以下属性：host、ttl。

PerformanceNodeTiming 类
继承自: <PerformanceEntry>
*此属性是 Node.js 的扩展。 它在 Web 浏览器中不可用。*

为 Node.js 本身提供计时细节。 此类的构造函数不会暴露给用户。

performanceNodeTiming.bootstrapComplete
Node.js 进程完成引导的高解析度毫秒时间戳。 如果引导尚未完成，则该属性的值为 -1。

performanceNodeTiming.environment
Node.js 环境初始化的高解析度毫秒时间戳。

performanceNodeTiming.idleTime
事件循环在事件循环的事件提供者（例如 epoll_wait）中空闲的时间量的高解析度毫秒时间戳。 这不考虑 CPU 使用率。 如果事件循环尚未开始（例如，在主脚本的第一个滴答中），则该属性的值为 0。

performanceNodeTiming.loopExit
Node.js 事件循环退出时的高解析度毫秒时间戳。 如果事件循环尚未退出，则该属性的值为 -1。 它只能在 'exit' 事件的句柄中具有非 -1 的值。

performanceNodeTiming.loopStart
Node.js 事件循环开始的高解析度毫秒时间戳。 如果事件循环尚未开始（例如，在主脚本的第一个滴答中），则该属性的值为 -1。

performanceNodeTiming.nodeStart
Node.js 进程初始化的高解析度毫秒时间戳。

performanceNodeTiming.v8Start
V8 平台初始化的高解析度毫秒时间戳。

###### PerformanceResourceTiming 类
继承自: <PerformanceEntry>
提供有关应用程序资源加载的详细网络计时数据。

此类的构造函数不直接暴露给用户。

performanceResourceTiming.workerStart
即将发送 fetch 请求之前的高解析度毫秒时间戳。 如果资源没有被工作进程截获，该属性将始终返回 0。

performanceResourceTiming.redirectStart
表示启动重定向的获取的开始时间的高解析度毫秒时间戳。

performanceResourceTiming.redirectEnd
接收到最后一个重定向响应的最后一个字节后立即创建的高解析度毫秒时间戳。

performanceResourceTiming.fetchStart
Node.js 开始获取资源之前的高解析度毫秒时间戳。

performanceResourceTiming.domainLookupStart
Node.js 开始查找资源之前的高解析度毫秒时间戳。

performanceResourceTiming.domainLookupEnd
表示 Node.js 完成对资源的域名查找之后的时间高解析度毫秒时间戳。

performanceResourceTiming.connectStart
表示 Node.js 开始与服务器建立连接以检索资源之前的时间的高解析度毫秒时间戳。

performanceResourceTiming.connectEnd
表示 Node.js 完成与服务器建立连接以检索资源后的时间的高解析度毫秒时间戳。

performanceResourceTiming.secureConnectionStart
表示 Node.js 开始握手过程以保护当前连接之前的时间的高解析度毫秒时间戳。

performanceResourceTiming.requestStart
表示 Node.js 从服务器接收到响应的第一个字节之前的时间的高解析度毫秒时间戳。

performanceResourceTiming.responseEnd
表示 Node.js 接收到资源的最后一个字节之后或传输连接关闭之前的时间（以先到者为准）的高解析度毫秒时间戳。

performanceResourceTiming.transferSize
表示获取资源大小（以八位字节为单位）的数值。 大小包括响应头字段加上响应负载正文。

performanceResourceTiming.encodedBodySize
表示在删除任何应用的内容编码之前从有效负载主体的提取（HTTP 或缓存）接收到的大小（以八位字节为单位）的数值。

performanceResourceTiming.decodedBodySize
表示在删除任何应用的内容编码后，从消息主体的提取（HTTP 或缓存）接收到的大小（以八位字节为单位）的数值。

performanceResourceTiming.toJSON()
返回 object，其是 PerformanceResourceTiming 对象的 JSON 表示形式

###### perf_hooks.PerformanceObserver 类
new PerformanceObserver(callback)
callback <Function>
- list <PerformanceObserverEntryList>
- observer <PerformanceObserver>
当新的 PerformanceEntry 实例被添加到性能时间线时，则 PerformanceObserver 对象会提供通知。
```javascript
const {
  performance,
  PerformanceObserver
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries());

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark'], buffered: true });

performance.mark('test');
```
因为 PerformanceObserver 实例引入了它们自己的额外性能开销，实例不应无限期地订阅通知。 一旦不再需要观察者，则用户应立即断开观察者的连接。
当 PerformanceObserver 接收到有关新的 PerformanceEntry 实例的通知时，则会调用 callback。 回调接收到 PerformanceObserverEntryList 实例和对 PerformanceObserver 的引用。

performanceObserver.disconnect()
断开 PerformanceObserver 实例与所有通知的连接。

performanceObserver.observe(options)
options <Object>
- type <string> 单个 <PerformanceEntry> 类型。 *如果已经指定了 entryTypes，则不能给出。*
- entryTypes <string[]> 标识观察者感兴趣的 <PerformanceEntry> 实例类型的字符串数组。 如果未提供，将抛出错误。
- buffered <boolean> 如果为 true，则使用列表全局 PerformanceEntry 缓冲条目调用观察者回调。 如果为false，则只有在时间点之后创建的 PerformanceEntry 被发送到观察者回调。 默认值: false。
为 <PerformanceObserver> 实例订阅由 options.entryTypes 或 options.type 标识的新 <PerformanceEntry> 实例的通知：
```javascript
const {
  performance,
  PerformanceObserver
} = require('node:perf_hooks');

const obs = new PerformanceObserver((list, observer) => {
  // 异步调用一次。`list` 包含三个条目。
});
obs.observe({ type: 'mark' });

for (let n = 0; n < 3; n++)
  performance.mark(`test${n}`);
```

###### PerformanceObserverEntryList 类
PerformanceObserverEntryList 类用于提供对传给 PerformanceObserver 的 PerformanceEntry 实例的访问。 此类的构造函数不会暴露给用户。

performanceObserverEntryList.getEntries()
返回: <PerformanceEntry[]>
返回 PerformanceEntry 对象的列表，按照相对于 performanceEntry.startTime 的时间顺序排列。
```javascript
const {
  performance,
  PerformanceObserver
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntries());
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 81.465639,
   *     duration: 0
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 81.860064,
   *     duration: 0
   *   }
   * ]
   */

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

performanceObserverEntryList.getEntriesByName(name[, type])
name <string>
type <string>
返回: <PerformanceEntry[]>
返回按时间顺序的 PerformanceEntry 对象列表，其中 performanceEntry.startTime 的 performanceEntry.name 等于 name，并且可选地，其 performanceEntry.entryType 等于 type。
```javascript
const {
  performance,
  PerformanceObserver
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByName('meow'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 98.545991,
   *     duration: 0
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('nope')); // []

  console.log(perfObserverList.getEntriesByName('test', 'mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 63.518931,
   *     duration: 0
   *   }
   * ]
   */
  console.log(perfObserverList.getEntriesByName('test', 'measure')); // []

  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['mark', 'measure'] });

performance.mark('test');
performance.mark('meow');
```

performanceObserverEntryList.getEntriesByType(type)
type <string>
返回: <PerformanceEntry[]>
返回按时间顺序排列的 PerformanceEntry 对象列表，其中 performanceEntry.startTime 的 performanceEntry.entryType 等于 type。
```javascript
const {
  performance,
  PerformanceObserver
} = require('node:perf_hooks');

const obs = new PerformanceObserver((perfObserverList, observer) => {
  console.log(perfObserverList.getEntriesByType('mark'));
  /**
   * [
   *   PerformanceEntry {
   *     name: 'test',
   *     entryType: 'mark',
   *     startTime: 55.897834,
   *     duration: 0
   *   },
   *   PerformanceEntry {
   *     name: 'meow',
   *     entryType: 'mark',
   *     startTime: 56.350146,
   *     duration: 0
   *   }
   * ]
   */
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ type: 'mark' });

performance.mark('test');
performance.mark('meow');
```

perf_hooks.createHistogram([options])
options <Object>
- lowest <number> | <bigint> 最低可识别值。 必须是大于 0 的整数值。 默认值: 1。
- highest <number> | <bigint> 最高可记录值。 必须是等于或大于 lowest 两倍的整数值。 默认值: Number.MAX_SAFE_INTEGER。
- figures <number> 精度位数。 必须是 1 和 5 之间的数字。 默认值: 3。
返回 <RecordableHistogram>

perf_hooks.monitorEventLoopDelay([options])
options <Object>
- resolution <number> 以毫秒为单位的采样率。 必须大于零。 默认值: 10。
返回: <IntervalHistogram>
*此属性是 Node.js 的扩展。 它在 Web 浏览器中不可用。*

创建可随时间采样并报告事件循环延迟的 IntervalHistogram 对象。 延迟将以纳秒为单位报告。

使用计时器来检测近似的事件循环延迟是有效的，因为计时器的执行与 libuv 事件循环的生命周期特别相关。 也就是说，循环中的延迟会导致计时器执行的延迟，而这些延迟正是此 API 旨在检测的。
```javascript
const { monitorEventLoopDelay } = require('node:perf_hooks');
const h = monitorEventLoopDelay({ resolution: 20 });
h.enable();
// 做点什么。
h.disable();
console.log(h.min);
console.log(h.max);
console.log(h.mean);
console.log(h.stddev);
console.log(h.percentiles);
console.log(h.percentile(50));
console.log(h.percentile(99));
```

###### Histogram 类

histogram.count
直方图记录的样本数。

histogram.countBigInt
直方图记录的样本数。

histogram.exceeds
事件循环延迟超过最大 1 小时事件循环延迟阈值的次数。

histogram.exceedsBigInt
事件循环延迟超过最大 1 小时事件循环延迟阈值的次数。

histogram.max
记录的事件循环延迟的最大值。

histogram.maxBigInt
记录的事件循环延迟的最大值。

histogram.mean
记录的事件循环延迟的平均值。

histogram.min
记录的事件循环延迟的最小值。

histogram.minBigInt
记录的事件循环延迟的最小值。

histogram.percentile(percentile)
percentile <number> 百分位值的范围是 (0, 100]。
返回: <number>
返回给定的百分位数的值。

histogram.percentileBigInt(percentile)#
percentile <number> 百分位值的范围是 (0, 100]。
返回: <bigint>
返回给定的百分位数的值。

histogram.percentiles
<Map>
返回详细说明累积的百分位分布的 Map 对象。

histogram.percentilesBigInt
<Map>
返回详细说明累积的百分位分布的 Map 对象。

histogram.reset()
重置收集的直方图数据。

histogram.stddev
<number>
记录的事件循环延迟的标准偏差。

###### IntervalHistogram 类继承 Histogram 类

在给定的时间间隔内定期更新的 Histogram。

histogram.disable()
禁用更新间隔计时器。 如果计时器被停止，则返回 true，如果已被停止，则返回 false。

histogram.enable()
启用更新间隔计时器。 如果计时器被启动，则返回 true，如果已被启动，则返回 false。

克隆 IntervalHistogram
<IntervalHistogram> 实例可以通过 <MessagePort> 克隆。 
在接收端，直方图被克隆为没有实现 enable() 和 disable() 方法的普通 <Histogram> 对象。

###### RecordableHistogram 类继承 Histogram 类

histogram.add(other)
other <RecordableHistogram>
将 other 中的值添加到此直方图中。

histogram.record(val)
val <number> | <bigint> 在直方图中记录的数量。

histogram.recordDelta()
计算自上次调用 recordDelta() 以来经过的时间量（以纳秒为单位），并在直方图中记录该量。

示例
测量异步操作的时长
以下示例使用异步钩子和性能 API 来测量超时操作的实际持续时间（包括执行回调所花费的时间）。
```javascript
'use strict';
const async_hooks = require('node:async_hooks');
const {
  performance,
  PerformanceObserver
} = require('node:perf_hooks');

const set = new Set();
const hook = async_hooks.createHook({
  init(id, type) {
    if (type === 'Timeout') {
      performance.mark(`Timeout-${id}-Init`);
      set.add(id);
    }
  },
  destroy(id) {
    if (set.has(id)) {
      set.delete(id);
      performance.mark(`Timeout-${id}-Destroy`);
      performance.measure(`Timeout-${id}`,
                          `Timeout-${id}-Init`,
                          `Timeout-${id}-Destroy`);
    }
  }
});
hook.enable();

const obs = new PerformanceObserver((list, observer) => {
  console.log(list.getEntries()[0]);
  performance.clearMarks();
  performance.clearMeasures();
  observer.disconnect();
});
obs.observe({ entryTypes: ['measure'], buffered: true });

setTimeout(() => {}, 1000);
```

测量加载依赖的耗时
以下示例测量加载依赖项的 require() 操作的持续时间：
```javascript
'use strict';
const {
  performance,
  PerformanceObserver
} = require('node:perf_hooks');
const mod = require('node:module');

// Monkey 修补 require 函数
mod.Module.prototype.require =
  performance.timerify(mod.Module.prototype.require);
require = performance.timerify(require);

// 激活观察者
const obs = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`require('${entry[0]}')`, entry.duration);
  });
  performance.clearMarks();
  performance.clearMeasures();
  obs.disconnect();
});
obs.observe({ entryTypes: ['function'], buffered: true });

require('some-module');
```

测量一次 HTTP 往返需要多长时间
以下示例用于跟踪 HTTP 客户端 (OutgoingMessage) 和 HTTP 请求 (IncomingMessage) 花费的时间。 对于 HTTP 客户端，是指发起请求到收到响应的时间间隔，对于 HTTP 请求，是指从接收请求到发送响应的时间间隔：
```javascript
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const http = require('node:http');

const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});

obs.observe({ entryTypes: ['http'] });

const PORT = 8080;

http.createServer((req, res) => {
  res.end('ok');
}).listen(PORT, () => {
  http.get(`http://127.0.0.1:${PORT}`);
});
```

测量连接成功时 net.connect（仅适用于 TCP）需要多长时间
```javascript
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const net = require('node:net');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['net'] });
const PORT = 8080;
net.createServer((socket) => {
  socket.destroy();
}).listen(PORT, () => {
  net.connect(PORT);
});
```

测量请求成功时 DNS 需要多长时间
```javascript
'use strict';
const { PerformanceObserver } = require('node:perf_hooks');
const dns = require('node:dns');
const obs = new PerformanceObserver((items) => {
  items.getEntries().forEach((item) => {
    console.log(item);
  });
});
obs.observe({ entryTypes: ['dns'] });
dns.lookup('localhost', () => {});
dns.promises.resolve('localhost');
```
