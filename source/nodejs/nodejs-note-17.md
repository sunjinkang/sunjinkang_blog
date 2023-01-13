---
title: nodejs基础知识(10)
date: 2023-01-13 13:24:11
tags: [node, http]
---

#### HTTP
要使用 HTTP 服务器与客户端，需要 require('http')。
Node.js 中的 HTTP 接口被设计成支持协议的许多特性。 比如，大块编码的消息。 这些接口不缓冲完整的请求或响应，用户能够以流的形式处理数据。
HTTP 消息头由一个对象表示，例如：
```
{ 'content-length': '123',
  'content-type': 'text/plain',
  'connection': 'keep-alive',
  'host': 'mysite.com',
  'accept': '*/*' }
```
键名是小写的，键值不能修改。

**http.Agent 类**
Agent 负责为 HTTP 客户端管理连接的持续与复用。 它为一个给定的主机与端口维护着一个等待请求的队列，且为每个请求重复使用一个单一的 socket 连接直到队列为空，此时 socket 会被销毁或被放入一个连接池中，在连接池中等待被有着相同主机与端口的请求再次使用。 是否被销毁或被放入连接池取决于 keepAlive 选项。

**http.ClientRequest 类**
该对象在 http.request() 内部被创建并返回。 它表示着一个正在处理的请求，其请求头已进入队列。 请求头仍可使用 setHeader(name, value)、getHeader(name) 和 removeHeader(name) API 进行修改。 实际的请求头会与第一个数据块一起发送或当调用 request.end() 时发送。

要获取响应，需为 'response' 事件添加一个监听器到请求对象上。 当响应头被接收到时，'response' 事件会从请求对象上被触发 。 'response' 事件被执行时带有一个参数，该参数是一个 http.IncomingMessage 实例。

在 'response' 事件期间，可以添加监听器到响应对象上，比如监听 'data' 事件。

如果没有添加 'response' 事件处理函数，则响应会被整个丢弃。 如果添加了 'response' 事件处理函数，则必须消耗完响应对象的数据，可通过调用 response.read()、或添加一个 'data' 事件处理函数、或调用 .resume() 方法。 数据被消耗完时会触发 'end' 事件。 在数据被读取完之前会消耗内存，可能会造成 'process out of memory' 错误。

注意：Node.js 不会检查 Content-Length 与已传输的请求主体的长度是否相等。

request.socket
- <net.Socket>
引用底层socket。 通常用户不想访问此属性。 特别地，由于协议解析器连接到socket的方式，socket将不会触发'readable'事件。 在response.end()之后，该属性为null。 也可以通过request.connection来访问socket。
```javascript
const http = require('http');
const options = {
  host: 'nodejs.cn',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`你的IP地址是 ${ip}，你的源端口是 ${port}。`);
  // 你的IP地址是 192.168.22.168，你的源端口是 62687。
});
```

**http.Server 类**
该类继承自 net.Server，且具有一些额外的事件：

'checkContinue' 事件
- request <http.IncomingMessage>
- response <http.ServerResponse>
每当接收到一个带有 HTTP Expect: 100-continue 请求头的请求时触发。 如果该事件未被监听，则服务器会自动响应 100 Continue。
处理该事件时，如果客户端应该继续发送请求主体，则调用 response.writeContinue()，否则生成一个适当的 HTTP 响应（例如 400 错误请求）。
*注意，当该事件被触发且处理后，'request' 事件不会被触发。*

