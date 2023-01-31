---
title: nodejs基础知识(10)
date: 2023-01-20 09:38:46
tags: [node, ECMAScript]
---

#### ECMAScript 模块

ECMAScript 模块是来打包 JavaScript 代码以供重用的官方标准格式。 模块使用各种 import 和 export 语句定义。
Node.js 完全支持当前指定的 ECMAScript 模块，并且提供它们与其原始模块格式 CommonJS 之间的互操作性。

*通过 .mjs 文件扩展名、package.json "type" 字段、或 --input-type 标志告诉 Node.js 使用 ECMAScript 模块加载器。 在这些情况之外，Node.js 将使用 CommonJS 模块加载器。*

**import 说明符**
import 语句的说明符是 from 关键字之后的字符串，例如 import { sep } from 'node:path' 中的 'node:path'。 说明符也用于 export from 语句，并作为 import() 表达式的参数。
说明符类型：
- 相对说明符，如 './startup.js' 或 '../config.mjs'。 它们指的是相对于导入文件位置的路径。 文件扩展名对于这些始终是必需的。
- 裸说明符，如 'some-package' 或 'some-package/shuffle'。 它们可以通过包名称来引用包的主要入口点，或者根据示例分别以包名称为前缀的包中的特定功能模块。 包括文件扩展名仅适用于没有 "exports" 字段的包。
- 绝对说明符，如 'file:///opt/nodejs/config.js'。 它们直接且明确地引用完整的路径。
*裸说明符解析由 Node.js 模块解析算法处理。 所有其他说明符解析始终仅使用标准的相对网址解析语义进行解析。*
*就像在 CommonJS 中一样，包中的模块文件可以通过在包名称后附加路径来访问，除非包的 package.json 包含 "exports" 字段，在这种情况下，包中的文件只能通过 "exports" 中定义的路径访问。*

强制的文件扩展名
使用 import 关键字解析相对或绝对的说明符时，必须提供文件扩展名，并完全指定目录索引。

URL
ES 模块被解析并缓存为 URL。 这意味着特殊字符必须是百分比编码的，比如使用 %23 的 #、使用 %3F 的 ?。支持 file:、node: 和 data: URL 协议。 除非使用自定义的 HTTPS 加载器，否则 Node.js 本身不支持像 'https://example.com/app.js' 这样的说明符

file: URL
如果用于解析模块的 import 说明符具有不同的查询或片段，则会多次加载模块。
```
import './foo.mjs?query=1'; // 加载具有 "?query=1" 查询的 ./foo.mjs
import './foo.mjs?query=2'; // 加载具有 "?query=2" 查询的 ./foo.mjs
```
可以通过 /、//、或 file:/// 引用卷根。 鉴于网址和路径解析的差异（例如百分比编码细节），建议在导入路径时使用 [url.pathToFileURL](http://shouce.gree020.cn/node/api/url.html#urlpathtofileurlpath)。

data: 导入
data: URL 支持使用以下 MIME 类型导入：
- text/javascript 用于 ES 模块
- pplication/json 用于 JSON
- application/wasm 用于 Wasm
```
import 'data:text/javascript,console.log("hello!");';
import _ from 'data:application/json,"world!"' assert { type: 'json' };
```
data: URL 仅解析内置模块的裸说明符和绝对说明符。 解析相对说明符不起作用，因为 data: 不是特殊协议。 例如，尝试从 data:text/javascript,import "./foo"; 加载 ./foo 无法解析，因为 data: URL 没有相对解析的概念。

node: 导入
支持 node: URL 作为加载 Node.js 内置模块的替代方法。 此 URL 协议允许有效的绝对的 URL 字符串引用内置模块。

内置模块
核心模块提供了其公共 API 的命名导出。 还提供了默认导出，其是 CommonJS 导出的值。 默认导出可用于修改命名导出等。 内置模块的命名导出仅通过调用 module.syncBuiltinESMExports() 进行更新。
```javascript
import EventEmitter from 'node:events';

import { readFile } from 'node:fs';

import fs, { readFileSync } from 'node:fs';
import { syncBuiltinESMExports } from 'node:module';
import { Buffer } from 'node:buffer';
fs.readFileSync = () => Buffer.from('Hello, ESM');
syncBuiltinESMExports();
fs.readFileSync === readFileSync;
// true
```
import() 表达式
import.meta

import.meta.url
*<string> 模块的绝对的 file: URL。*
这与提供当前模块文件 URL 的浏览器中的定义完全相同。
这可以启用有用的模式，使用举例：传入相对路径文件及import.meta.url，返回文件的绝对路径解析结果

**与 CommonJS 的互操作性**
import 声明
import 语句可以引用 ES 模块或 CommonJS 模块。 import 语句只允许在 ES 模块中使用，但 CommonJS 支持动态 import() 表达式来加载 ES 模块。

require
CommonJS 模块 require 总是将它引用的文件视为 CommonJS。
不支持使用 require 加载 ES 模块，因为 ES 模块具有异步执行。 而是，使用 import() 从 CommonJS 模块加载 ES 模块。

**ES 模块和 CommonJS 之间的差异**
- 没有 require、exports 或 module.exports
在大多数情况下，可以使用 ES 模块 import 加载 CommonJS 模块。
如果需要，可以使用 module.createRequire() 在 ES 模块中构造 require 函数。
- 没有 __filename 或 __dirname
这些 CommonJS 变量在 ES 模块中不可用。
__filename 和 __dirname 用例可以通过 import.meta.url 复制。
- 没有原生模块加载
ES 模块导入当前不支持原生模块。
它们可以改为加载 module.createRequire() 或 process.dlopen。
- 没有 require.resolve
相对解析可以通过 new URL('./local', import.meta.url) 处理。
对于完整的 require.resolve 替换，有标记的实验性 import.meta.resolve API。
也可以使用 module.createRequire()。
- 没有 NODE_PATH
NODE_PATH 不是解析 import 说明符的一部分。 如果需要这种行为，则使用符号链接。
- 没有 require.extensions
require.extensions 没有被 import 使用。 期望加载器钩子在未来可以提供这个工作流。
- 没有 require.cache
require.cache 没有被 import 使用，因为 ES 模块加载器有自己独立的缓存。

JSON 模块
import 可以引用 JSON 文件：
```
import packageConfig from './package.json' assert { type: 'json' };
```
*assert { type: 'json' } 语法是强制性的*
导入的 JSON 只暴露一个 default 导出。 不支持命名导出。 在 CommonJS 缓存中创建缓存条目，以避免重复。 如果 JSON 模块已经从同一路径导入，则在 CommonJS 中返回相同的对象。

顶层的 await
await 关键字可以用在 ECMAScript 模块的顶层主体中。
如果顶层 await 表达式永远无法解析，则 node 进程将以 13 状态码退出。

