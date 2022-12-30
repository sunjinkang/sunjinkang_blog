---
title: nodejs基础知识(4)
date: 2022-12-30 16:27:30
tags: [node, cluster - 集群]
---

Node.js在单个线程中运行单个实例。 用户(开发者)为了使用现在的多核系统，有时候,用户(开发者)会用一串Node.js进程去处理负载任务。

cluster 模块允许简单容易的创建共享服务器端口的子进程。
```
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 衍生工作进程。
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
  });
} else {
  // 工作进程可以共享任何 TCP 连接。
  // 在本例子中，共享的是一个 HTTP 服务器。
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('你好世界\n');
  }).listen(8000);

  console.log(`工作进程 ${process.pid} 已启动`);
}
```
cluster模块支持两种连接分发模式（将新连接安排给某一工作进程处理）。

第一种方法（也是除Windows外所有平台的默认方法），是循环法。由主进程负责监听端口，接收新连接后再将连接循环分发给工作进程。在分发中使用了一些内置技巧防止工作进程任务过载。

第二种方法是，主进程创建监听socket后发送给感兴趣的工作进程，由工作进程负责直接接收连接。

理论上第二种方法应该是效率最佳的，但在实际情况下，由于操作系统调度机制的难以捉摸，会使分发变得不稳定。我们遇到过这种情况：8个进程中的2个，分担了70%的负载。

**Class: Worker**
Worker对象包含了关于工作进程的所有public信息和方法。
在一个主进程里，可以使用cluster.workers来获取Worker对象。
在一个工作进程里，可以使用cluster.worker来获取Worker对象。

**Event: 'disconnect'**
虽然与 cluster.on('disconnect')事件 是相似的,但是这个进程又有其他特征。
```
cluster.fork().on('disconnect', () => {
  // Worker has disconnected
});
```

**Event: 'error'**
此事件和 child_process.fork()提供的error事件相同。
在一个工作进程中，可以使用process.on('error')

**Event: 'exit'**
- code <number> 若正常退出，表示退出代码.
- signal <string> 引发进程被kill的信号名称（如'SIGHUP'）.
和cluster.on('exit')事件类似，但针对特定的工作进程。
```
const worker = cluster.fork();
worker.on('exit', (code, signal) => {
  if (signal) {
    console.log(`worker was killed by signal: ${signal}`);
  } else if (code !== 0) {
    console.log(`worker exited with error code: ${code}`);
  } else {
    console.log('worker success!');
  }
});
```

**Event: 'listening'**
address <Object>
和cluster.on('listening')事件类似，但针对特定的工作进程。
本事件不会在工作进程内触发。

**Event: 'message'**
message <Object>
handle <undefined> | <Object>
和cluster.on('message')事件类似，但针对特定的工作进程。
在工作进程内，可以使用process.on('message')
```
const cluster = require('cluster');
const http = require('http');

if (cluster.isMaster) {

  // 跟踪 http 请求
  let numReqs = 0;
  setInterval(() => {
    console.log(`numReqs = ${numReqs}`);
  }, 1000);

  // 计算请求数目
  function messageHandler(msg) {
    if (msg.cmd && msg.cmd === 'notifyRequest') {
      numReqs += 1;
    }
  }

  // 启动 worker 并监听包含 notifyRequest 的消息
  const numCPUs = require('os').cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  for (const id in cluster.workers) {
    cluster.workers[id].on('message', messageHandler);
  }

} else {

  // Worker 进程有一个http服务器
  http.Server((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');

    // 通知 master 进程接收到了请求
    process.send({ cmd: 'notifyRequest' });
  }).listen(8000);
}
```

**Event: 'online'**
和cluster.on('online')事件类似，但针对特定的工作进程。
本事件不会在工作进程内部被触发。

**worker.disconnect()**
Returns: <Worker> 一个 worker 的引用。
在一个工作进程内，调用此方法会关闭所有的server，并等待这些server的 'close'事件执行，然后关闭IPC管道。

在主进程内，会给工作进程发送一个内部消息，导致工作进程自身调用.disconnect()。

会设置.exitedAfterDisconnect 。

需要注意的是，当一个server关闭后，它将不再接收新的连接，但新连接会被其他正在监听的工作进程接收。已建立的连接可以正常关闭。当所有连接都关闭后，通往该工作进程的IPC管道将会关闭，允许工作进程优雅地死掉

需要注意的是，我们这里的方法是disconnect，同时还有一个不一样的方法process.disconnect，大家不要混淆了

**worker.exitedAfterDisconnect**
<boolean>
当调用 .kill() 或者 .disconnect()方法时被设置，在这之前都是 undefined。
worker.exitedAfterDisconnect可以用于区分自发退出还是被动退出，主进程可以根据这个值决定是否重新衍生新的工作进程。
*与worker.suicide等价*

**worker.id**
<number>
每一个新衍生的工作进程都会被赋予自己独一无二的编号，这个编号就是储存在id里面。
当工作进程还存活时，id可以作为在cluster.workers中的索引。

**worker.isConnected()**
当工作进程通过IPC管道连接至主进程时，这个方法返回true，否则返回false。
一个工作进程在创建后会自动连接到它的主进程，当'disconnect' 事件被触发时才会断开连接。

**worker.isDead()**
当工作进程被终止时（包括自动退出或被发送信号），这个方法返回true ，否则返回false。

**worker.kill([signal='SIGTERM'])**
signal <string> 被发送kill信号的工作进程名称。
这个方法将会kill工作进程。在主进程中，通过断开与worker.process的连接来实现，一旦断开连接后，通过signal来杀死工作进程。在工作进程中，通过断开IPC管道来实现，然后以代码0退出进程。
将导致.exitedAfterDisconnect被设置。
为向后兼容，这个方法与worker.destroy()等义。
需要注意的是，在工作进程中有一个方法process.kill() ，这个方法本方法不同，本方法是kill。

**worker.process**
<ChildProcess>
所有的工作进程都是通过child_process.fork()来创建的，这个方法返回的对象被存储为.process。在工作进程中， process属于全局对象。
需要注意：当process上发生 'disconnect'事件，并且.exitedAfterDisconnect的值不是true时，工作进程会调用 process.exit(0)。这样就可以防止连接意外断开。

**worker.send(message[, sendHandle][, callback])**
发送一个消息给工作进程或主进程，也可以附带发送一个handle。
主进程调用这个方法会发送消息给具体的工作进程。还有一个等价的方法是ChildProcess.send()。
工作进程调用这个方法会发送消息给主进程。还有一个等价方法是process.send()。

**Event: 'disconnect'**
worker <cluster.Worker>
在工作进程的IPC管道被断开后触发本事件。可能导致事件触发的原因包括：工作进程优雅地退出、被kill或手动断开连接（如调用worker.disconnect()）。
'disconnect' 和 'exit'事件之间可能存在延迟。这些事件可以用来检测进程是否在清理过程中被卡住，或是否存在长时间运行的连接。

**Event: 'exit'**
worker <cluster.Worker>
code <number> 正常退出情况下，是退出代码.
signal <string> 导致进程被kill的信号名称 (例如 'SIGHUP')
当任何一个工作进程关闭的时候，cluster模块都将触发'exit'事件。
可以被用来重启工作进程（通过调用.fork()）
```
cluster.on('exit', (worker, code, signal) => {
  console.log('worker %d died (%s). restarting...',
              worker.process.pid, signal || code);
  cluster.fork();
});
```

**Event: 'fork'**
worker <cluster.Worker>
当新的工作进程被fork时，cluster模块将触发'fork'事件。 可以被用来记录工作进程活动，产生一个自定义的timeout。

**Event: 'listening'**
worker <cluster.Worker>
address <Object>
当一个工作进程调用listen()后，工作进程上的server会触发'listening' 事件，同时主进程上的 cluster 也会被触发'listening'事件。
事件处理器使用两个参数来执行，其中worker包含了工作进程对象，address 包含了以下连接属性： address、port 和 addressType。当工作进程同时监听多个地址时，这些参数非常有用。
addressType 可选值包括:
- 4 (TCPv4)
- 6 (TCPv6)
- -1 (unix domain socket)
- "udp4" or "udp6" (UDP v4 or v6)

**Event: 'message'**
worker <cluster.Worker>
message <Object>
handle <undefined> | <Object>
当cluster主进程接收任意工作进程发送的消息后被触发。

**Event: 'online'**
worker <cluster.Worker>
当新建一个工作进程后，工作进程应当响应一个online消息给主进程。当主进程收到online消息后触发这个事件。 'fork' 事件和 'online'事件的不同之处在于，前者是在主进程新建工作进程后触发，而后者是在工作进程运行的时候触发。

**Event: 'setup'**
settings <Object>
每当 .setupMaster() 被调用的时候触发。
settings 对象是 setupMaster() 被调用时的 cluster.settings 对象，并且只能查询，因为在一个 tick 内 .setupMaster() 可以被调用多次。
如果精确度十分重要，请使用 cluster.settings。

**cluster.disconnect([callback])**
callback <Function> 当所有工作进程都断开连接并且所有handle关闭的时候调用。
在cluster.workers的每个工作进程中调用 .disconnect()。
当所有工作进程断开连接后，所有内部handle将会关闭，这个时候如果没有等待事件的话，运行主进程优雅地关闭。
这个方法可以选择添加一个回调参数，当结束时会调用这个回调函数。
这个方法只能由主进程调用。

**cluster.fork([env])**
env <Object> 增加进程环境变量，以Key/value对的形式。
return <cluster.Worker>
衍生出一个新的工作进程。
只能通过主进程调用。

**cluster.isMaster**
<boolean>
当该进程是主进程时，返回 true。这是由process.env.NODE_UNIQUE_ID决定的，当process.env.NODE_UNIQUE_ID未定义时，isMaster为true。

**cluster.isWorker**
<boolean>
当进程不是主进程时，返回 true。（和cluster.isMaster刚好相反）

**cluster.schedulingPolicy**
调度策略，包括循环计数的 cluster.SCHED_RR，以及由操作系统决定的cluster.SCHED_NONE。 这是一个全局设置，当第一个工作进程被衍生或者调动cluster.setupMaster()时，都将第一时间生效。

**cluster.settings**
<Object>
execArgv <Array> 传递给Node.js可执行文件的参数列表。 (Default=process.execArgv)
exec <string> worker文件路径。 (Default=process.argv[1])
args <Array> 传递给worker的参数。(Default=process.argv.slice(2))
silent <boolean> 是否需要发送输出值父进程的stdio。(Default=false)
stdio <Array> 配置fork进程的stdio。 由于cluster模块运行依赖于IPC，这个配置必须包含'ipc'。当提供了这个选项后，将撤销silent。
uid <number> 设置进程的user标识符。 (见 setuid(2).)
gid <number> 设置进程的group标识符。 (见 setgid(2).)
inspectPort <number> | <function> Sets inspector port of worker. This can be a number, or a function that takes no arguments and returns a number. By default each worker gets its own port, incremented from the master's process.debugPort.
调用.setupMaster() (或 .fork())后，这个settings对象将会包含这些设置项，包括默认值。
这个对象不打算被修改或手动设置。

**cluster.setupMaster([settings])**
settings <Object> 详见 cluster.settings。
用于修改默认'fork' 行为。一旦调用，将会按照cluster.settings进行设置。
*只能由主进程调用*
注意:
- 所有的设置只对后来的 .fork()调用有效，对之前的工作进程无影响。
- 唯一无法通过 .setupMaster()设置的属性是传递给.fork()的env属性。
- 上述的默认值只在第一次调用时有效，当后续调用时，将采用cluster.setupMaster()调用时的当前值。
```
const cluster = require('cluster');
cluster.setupMaster({
  exec: 'worker.js',
  args: ['--use', 'https'],
  silent: true
});
cluster.fork(); // https worker
cluster.setupMaster({
  exec: 'worker.js',
  args: ['--use', 'http']
});
cluster.fork(); // http worker
```

**cluster.worker**
<Object>
当前工作进程对象的引用，对于主进程则无效。

**cluster.workers**
<Object>
这是一个哈希表，储存了活跃的工作进程对象，id作为key。有了它，可以方便地遍历所有工作进程。只能在主进程中调用。

工作进程断开连接以及退出后，将会从cluster.workers里面移除。这两个事件的先后顺序并不能预先确定，但可以保证的是， cluster.workers的移除工作在'disconnect' 和 'exit'两个事件中的最后一个触发之前完成。