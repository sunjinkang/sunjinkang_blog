---
title: nodejs基础知识(16)
date: 2023-04-01 10:29:12
tags: [node, tls 安全传输层, url 网址]
---

#### tls 安全传输层
tls 提供了构建在 OpenSSL 之上的传输层安全 (TLS) 和安全套接字层 (SSL) 协议的实现

TLS/SSL 概念
TLS/SSL 是一组协议，它依赖于公钥基础设施 (PKI) 来实现客户端和服务器之间的安全通信。 对于最常见的情况，每个服务器都必须有私钥。

完美前向保密
术语 前向保密 或 完美前向保密 描述了密钥协议（即密钥交换）方法的一个特征。 也就是说，服务器和客户端密钥用于协商新的临时密钥，这些密钥专门用于且仅用于当前通信会话。 实际上，这意味着即使服务器的私钥被泄露，如果攻击者设法获得专门为会话生成的密钥对，通信也只能被窃听者解密。

完美前向保密是通过在每次 TLS/SSL 握手时随机生成密钥对的密钥对来实现的（与对所有会话使用相同的密钥相反）。 实现这种技术的方法被称为"临时"。

目前常用两种方法来实现完美前向保密（注意繁体缩写后的字符 "E"）：
- DHE: Diffie-Hellman 密钥协议的临时版本。
- ECDHE: 椭圆曲线 Diffie-Hellman 密钥协议的临时版本。
要使用 DHE 和 node:tls 模块使用完美前向保密，需要生成 Diffie-Hellman 参数并使用 dhparam 选项指定它们到 tls.createSecureContext()。 
如果使用 ECDHE 使用完美前向保密，则不需要 Diffie-Hellman 参数，将使用默认 ECDHE 曲线。 创建 TLS 服务器时可以使用 ecdhCurve 属性来指定要使用的受支持曲线的名称列表，有关详细信息，请参阅 tls.createServer()。
*完美前向保密在 TLSv1.2 之前是可选的，但它对于 TLSv1.3 不是可选的，因为所有 TLSv1.3 密码套件都使用 ECDHE。*

ALPN 和 SNI
ALPN（应用层协议协商扩展）和 SNI（服务器名称指示）是 TLS 握手扩展：
- ALPN: 允许将 TLS 服务器用于多种协议（HTTP，HTTP/2）
- SNI: 允许将 TLS 服务器用于具有不同证书的多个主机名。

预共享的密钥（不建议使用，近年来安全漏洞较多）
TLS-PSK 支持可作为普通基于证书的身份验证的替代方法。 它使用预共享密钥而不是证书来验证 TLS 连接，提供相互验证。 TLS-PSK 和公钥基础设施并不相互排斥。 客户端和服务器可以同时容纳两者，在正常的密码协商步骤中选择它们中的任何一个。

客户端发起的重协商攻击缓解
TLS 协议允许客户端重新协商 TLS 会话的某些方面。 不幸的是，会话重新协商需要不成比例的服务器端资源，使其成为拒绝服务攻击的潜在载体。
为了降低风险，每十分钟重新协商的次数限制为 3 次。 当超过此阈值时，tls.TLSSocket 实例上会触发 'error' 事件。 限制是可配置的：
- tls.CLIENT_RENEG_LIMIT <number> 指定重新协商请求的数量。 默认值: 3。
- tls.CLIENT_RENEG_WINDOW <number> 指定时间重新协商窗口（以秒为单位）。 默认值: 600 （10分钟）。
在没有充分了解影响和风险的情况下，不应修改默认的重新协商限制。
*TLSv1.3 不支持重新协商。*

'newSession' 事件
在创建新的 TLS 会话时触发 'newSession' 事件。 这可用于在外部存储中存储会话。 数据应该提供给 'resumeSession' 回调。
监听器回调在调用时传入三个参数：
- sessionId <Buffer> TLS 会话标识符
- sessionData <Buffer> TLS 会话数据
- callback <Function> 回调函数不带参数，必须调用这些参数才能通过安全连接发送或接收数据。
*监听此事件只会对添加事件监听器后建立的连接有影响。*

'resumeSession' 事件
当客户端请求恢复之前的 TLS 会话时，则会触发 'resumeSession' 事件。 监听器回调在调用时传入两个参数：
- sessionId <Buffer> TLS 会话标识符
- callback <Function> 恢复前一个会话时要调用的回调函数：callback([err[, sessionData]])
 - err <Error>
 - sessionData <Buffer>
事件监听器应该使用给定的 sessionId 在外部存储中为 'newSession' 事件处理程序保存的 sessionData 执行查找。 如果找到，则调用 callback(null, sessionData) 恢复会话。 如果没有找到，则会话将无法恢复。 callback() 必须在没有 sessionData 的情况下被调用，以便握手可以继续并可以创建新的会话。 可以调用 callback(err) 来终止传入的连接并销毁套接字。
*监听此事件只会对添加事件监听器后建立的连接有影响。*

server.close([callback])
callback <Function> 监听器回调，将被注册以监听服务器实例的 'close' 事件。
server.close() 方法阻止服务器接受新连接。
*此函数异步地运行。 当服务器没有更多打开的连接时，则将触发 'close' 事件。*

server.getTicketKeys()
返回: <Buffer> 包含会话票证密钥的 48 字节缓冲区。
返回会话票证密钥。

tlsSocket.disableRenegotiation()
禁用此 TLSSocket 实例的 TLS 重新协商。 一旦调用，则尝试重新协商将在 TLSSocket 上触发 'error' 事件。

tlsSocket.enableTrace()
当启用后，TLS 数据包跟踪信息将写入 stderr。 这可用于调试 TLS 连接问题。
输出的格式与 openssl s_client -trace 或 openssl s_server -trace 的输出相同。 虽然它是由 OpenSSL 的 SSL_trace() 函数生成的，但格式未记录，可以在不通知的情况下更改，不应依赖。

tlsSocket.encrypted
总是返回 true。 这可用于将 TLS 套接字与常规 net.Socket 实例区分开来。

tlsSocket.getSession()
如果没有协商会话，则返回 TLS 会话数据或 undefined。 在客户端，可以将数据提供给 tls.connect() 的 session 选项来恢复连接。 在服务器上，它可能对调试有用。
*注意：getSession() 仅适用于 TLSv1.2 及以下版本。 对于 TLSv1.3，应用程序必须使用 'session' 事件（它也适用于 TLSv1.2 及更低版本）。*

tlsSocket.getTLSTicket()
对于客户端，如果可用，则返回 TLS 会话票证，或 undefined。 对于服务器，总是返回 undefined。
它可能对调试有用。

tlsSocket.isSessionReused()
返回: <boolean> 如果会话被重用则为 true，否则为 false。

tls.DEFAULT_ECDH_CURVE
tls 服务器中用于 ECDH 密钥协议的默认曲线名称。 默认值为 'auto'。 

tls.DEFAULT_MAX_VERSION
<string> tls.createSecureContext() 的 maxVersion 选项的默认值。 它可以分配任何支持的 TLS 协议版本，'TLSv1.3'、'TLSv1.2'、'TLSv1.1' 或 'TLSv1'。 默认值: 'TLSv1.3', 除非使用 CLI 选项更改。 使用 --tls-max-v1.2 将默认设置为 'TLSv1.2'。 使用 --tls-max-v1.3 将默认设置为 'TLSv1.3'。 如果提供了多个选项，则使用最高的最大值。

tls.DEFAULT_MIN_VERSION
与tls.DEFAULT_MAX_VERSION作用相反。

#### url 网址

网址字符串与网址对象
node:url 模块提供了两种用于处理网址的 API：一种是 Node.js 特定的旧版 API，一种是实现了与 Web 浏览器使用的相同的 WHATWG 网址标准的新版 API。
下图中上方显示的是由旧版 url.parse() 返回的对象的属性。 下方则是 WHATWG URL 对象的属性。
WHATWG 网址的 origin 属性包括 protocol 和 host，但不包括 username 或 password。
![url解析](./images//node-url.png)
```javascript
// 使用 WHATWG API 解析网址字符串：
const myURL = new URL('xxx');

// 使用旧版 API 解析网址字符串：
import url from 'node:url';
const myURL = url.parse('xxx');
```

new URL(input[, base])
- input <string> 要解析的绝对或相对的输入网址。 如果 input 是相对的，则需要 base。 如果 input 是绝对的，则忽略 base。 如果 input 不是字符串，则先转换成字符串。
- base <string> 如果 input 不是绝对的，则为要解析的基本网址。 如果 base 不是字符串，则先转换成字符串。
通过相对于 base 解析 input 来创建新的 URL 对象。 如果 base 作为字符串传入，则其将被解析为等效于 new URL(base)。
网址构造函数可作为全局对象的属性访问。 也可以从内置的 url 模块中导入：
```javascript
import { URL } from 'node:url';
console.log(URL === globalThis.URL); // 打印 'true'.
```
如果 input 或 base 不是有效的网址，则将抛出 TypeError。 注意，会将给定的值强制转换为字符串。
出现在 input 的主机名中的 Unicode 字符将使用 Punycode 算法自动转换为 ASCII。
只有在启用 ICU 的情况下编译 node 可执行文件时，此功能才可用。 如果不是，则域名将原封不动地传入。
*如果事先不知道 input 是否是绝对的网址并且提供了 base，则建议验证 URL 对象的 origin 是否符合预期。*

url.password
获取和设置网址的密码部分。
```javascript
const myURL = new URL('https://abc:xyz@example.com');
console.log(myURL.password);
// 打印 xyz

myURL.password = '123';
console.log(myURL.href);
// 打印 https://abc:123@example.com
```
分配给 password 属性的值中包含的无效的网址字符会进行百分比编码。 选择要进行百分比编码的字符可能与 url.parse() 和 url.format() 方法产生的结果有所不同。

url.port
获取和设置网址的端口部分。
端口值可以是数字，也可以是包含 0 到 65535（含）范围内的数字的字符串。 将值设置为给定 protocol 的 URL 对象的默认端口将导致 port 值成为空字符串 ('')。
端口值可以是空字符串，在这种情况下端口取决于协议/方案：
| 协议	| 端口 |
| "ftp" |	21 |
| "file" | 	|
| "http" |	80 |
| "https" |	443 |
| "ws" |	80 |
| "wss" |	443 |
为端口分配值后，该值将首先使用 .toString() 转换为字符串。
如果该字符串无效但以数字开头，则将前导数字分配给 port。 如果数字在上述范围之外，则将其忽略。
包含小数点的数字，例如浮点数或科学记数法中的数字，也不例外。 小数点前的前导数字将被设置为网址的端口
```javascript
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// 打印 8888

// 默认端口自动转换为空字符串
//（HTTPS 协议的默认端口是 443）
myURL.port = '443';
console.log(myURL.port);
// 打印空字符串
console.log(myURL.href);
// 打印 https://example.org/

myURL.port = 1234;
console.log(myURL.port);
// 打印 1234
console.log(myURL.href);
// 打印 https://example.org:1234/

// 完全无效的端口字符串被忽略
myURL.port = 'abcd';
console.log(myURL.port);
// 打印 1234

// 前导数字被视为端口号
myURL.port = '5678abcd';
console.log(myURL.port);
// 打印 5678

// 非整数被截断
myURL.port = 1234.5678;
console.log(myURL.port);
// 打印 1234

// 未用科学计数法表示的超出范围的数字将被忽略。
myURL.port = 1e10; // 10000000000，将按如下所述进行范围检查
console.log(myURL.port);
// 打印 1234

myURL.port = 4.567e21;
console.log(myURL.port);
// 打印 4（因为它是字符串 '4.567e21' 中的前导数字）
```

url.protocol
WHATWG 网址标准认为少数网址协议方案在解析和序列化方式方面具有特殊性。 当使用这些特殊协议之一解析网址时，url.protocol 属性可能会更改为另一种特殊协议，但不能更改为非特殊协议，反之亦然。
根据 WHATWG 网址标准，特殊协议方案有 ftp、file、http、https、ws 和 wss。
```javascript
const u = new URL('http://example.org');
u.protocol = 'https';
console.log(u.href);
// https://example.org

const u = new URL('http://example.org');
u.protocol = 'fish';
console.log(u.href);
// http://example.org

const u = new URL('fish://example.org');
u.protocol = 'http';
console.log(u.href);
// fish://example.org
```

url.searchParams
获取表示网址查询参数的 URLSearchParams 对象。 此属性是只读的，但它提供的 URLSearchParams 对象可用于更改网址实例； 要替换网址的整个查询参数，则使用 url.search 设置器。 有关详细信息，请参阅 URLSearchParams 文档。
当使用 .searchParams 修改 URL 时要小心，因为根据 WHATWG 规范，URLSearchParams 对象使用不同的规则来确定要对哪些字符进行百分比编码。 例如，URL 对象不会对 ASCII 波浪号 (~) 字符进行百分比编码，而 URLSearchParams 将始终对其进行编码

url.toJSON()
URL 对象上的 toJSON() 方法返回序列化的网址。 返回值等同于 url.href 和 url.toString() 的值。
当 URL 对象用 JSON.stringify() 序列化时，会自动调用此方法。
```javascript
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs));
// 打印 ["https://www.example.com/","https://test.example.org/"]
```

URLSearchParams 类

new URLSearchParams()
实例化新的空 URLSearchParams 对象。

new URLSearchParams(string)
将 string 解析为查询字符串，并使用它来实例化新的 URLSearchParams 对象。 前导 '?'（如果存在）将被忽略。

new URLSearchParams(obj)
- obj <Object> 表示键值对集合的对象
使用查询哈希映射实例化新的 URLSearchParams 对象。 obj 的每个属性的键和值总是被强制转换为字符串。
*与 querystring 模块不同，不允许以数组值的形式出现重复的键。 数组使用 array.toString() 字符串化，它简单地用逗号连接所有数组元素。*

new URLSearchParams(iterable)
- iterable <Iterable> 元素为键值对的可迭代对象
以类似于 Map 的构造函数的方式使用可迭代映射实例化新的 URLSearchParams 对象。 iterable 可以是 Array 或任何可迭代对象。 这意味着 iterable 可以是另一个 URLSearchParams，在这种情况下，构造函数将简单地创建提供的 URLSearchParams 的克隆。 iterable 的元素是键值对，并且本身可以是任何可迭代对象。
允许重复的键。
```javascript
let params;

// 使用数组
params = new URLSearchParams([
  ['user', 'abc'],
  ['query', 'first'],
  ['query', 'second'],
]);
console.log(params.toString());
// 打印 'user=abc&query=first&query=second'

// 使用 Map 对象
const map = new Map();
map.set('user', 'abc');
map.set('query', 'xyz');
params = new URLSearchParams(map);
console.log(params.toString());
// 打印 'user=abc&query=xyz'

// 使用生成器函数
function* getQueryPairs() {
  yield ['user', 'abc'];
  yield ['query', 'first'];
  yield ['query', 'second'];
}
params = new URLSearchParams(getQueryPairs());
console.log(params.toString());
// 打印 'user=abc&query=first&query=second'

// 每个键值对必须恰好有两个元素
param = new URLSearchParams([['user', 'abc', 'error']]);
console.log(params.toString());
// 抛出 TypeError [ERR_INVALID_TUPLE]:
//        Each query pair must be an iterable [name, value] tuple
```

urlSearchParams.set(name, value)
将与 name 关联的 URLSearchParams 对象中的值设置为 value。 
*如果存在任何名称为 name 的预先存在的名称-值对，则将第一个此类对的值设置为 value 并删除所有其他名称。*
如果没有，则将名称-值对追加到查询字符串。
```javascript
const params = new URLSearchParams();
params.append('foo', 'bar');
params.append('foo', 'baz');
params.append('abc', 'def');
console.log(params.toString());
// 打印 foo=bar&foo=baz&abc=def

params.set('foo', 'def');
params.set('xyz', 'opq');
console.log(params.toString());
// 打印 foo=def&abc=def&xyz=opq
```

urlSearchParams.sort()
按名称对所有现有的名称-值对进行就地排序。 排序是使用稳定排序算法完成的，因此保留了具有相同名称的名称-值对之间的相对顺序。
该方法尤其可用于增加缓存命中。

url.pathToFileURL(path)
- path <string> 要转换为文件网址的路径。
返回: <URL> 文件网址对象。
该函数确保 path 被绝对解析，并且在转换为文件网址时正确编码网址控制字符。

url.urlToHttpOptions(url)
该实用函数按照 http.request() 和 https.request() API 的预期将网址对象转换为普通选项对象。
```javascript
import { urlToHttpOptions } from 'node:url';
const myURL = new URL('https://a:b@測試?abc#foo');

console.log(urlToHttpOptions(myURL));
/*
{
  protocol: 'https:',
  hostname: 'xn--g6w251d',
  hash: '#foo',
  search: '?abc',
  pathname: '/',
  path: '/?abc',
  href: 'https://a:b@xn--g6w251d/?abc#foo',
  auth: 'a:b'
}
*/
```

网址中的百分号编码
网址只允许包含一定范围的字符。 任何超出该范围的字符都必须进行编码。 这些字符的编码方式以及要编码的字符完全取决于字符在网址结构中的位置。

旧版的 API
在旧版 API 中，空格 (' ') 和以下字符将在网址对象的属性中自动转义：
< > " ` \r \n \t { } | \ ^ '
例如，ASCII 空格字符 (' ') 被编码为 %20。 ASCII 正斜杠 (/) 字符编码为 %3C。

WHATWG API
WHATWG 算法定义了四个“百分比编码集”，用于描述必须进行百分比编码的字符范围：
- C0 控制百分比编码集，包括 U+0000 到 U+001F（含）范围内的代码点和所有大于 U+007E 的代码点。
- 片段百分比编码集，包括 C0 控制百分比编码集和代码点 U+0020、U+0022、U+003C、U+003E 和 U+0060。
- 路径百分比编码集，包括 C0 控制百分比编码集和代码点 U+0020、U+0022、U+0023、U+003C、U+003E、U+003F、U+0060、U +007B 和 U+007D。
- userinfo 编码集，包括路径百分比编码集和代码点 U+002F、U+003A、U+003B、U+003D、U+0040、U+005B、U+005C、U+005D、 U+005E 和 U+007C。
片段百分比编码集用于网址片段。 
路径百分比编码集用于大多数网址的路径。 
userinfo 百分比编码集专门用于网址中编码的用户名和密码。 
除了所有其他情况外，C0 控制百分比编码集用于某些特定条件下的主机和路径。
当主机名中出现非 ASCII 字符时，主机名将使用 Punycode 算法进行编码。 但是请注意，主机名可能包含 Punycode 编码和百分比编码的字符：
```javascript
const myURL = new URL('https://%CF%80.example.com/foo');
console.log(myURL.href);
// 打印 https://xn--1xa.example.com/foo
console.log(myURL.origin);
// 打印 https://xn--1xa.example.com
```