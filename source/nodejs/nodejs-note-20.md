---
title: nodejs基础知识(10)
date: 2023-01-20 09:38:46
tags: [node, ECMAScript, package 包模块]
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



#### package 包模块
包是由 package.json 文件描述的文件夹树。 包由包含 package.json 文件的文件夹和所有子文件夹组成，直到包含另一个 package.json 文件的下一个文件夹或名为 node_modules 的文件夹。

当作为初始输入传入、或者当被 import 语句或 import() 表达式引用时，Node.js 会将以下视为ES 模块：
- 扩展名为 .mjs 的文件。
- 当最近的父 package.json 文件包含值为 "module" 的顶层 "type" 字段时，扩展名为 .js 的文件。
- 字符串作为参数传入 --eval，或通过 STDIN 管道传输到 node，带有标志 --input-type=module。

当被 import 语句或 import() 表达式或 require() 表达式引用时，Node.js 会将以下视为 CommonJS：
- 扩展名为 .cjs 的文件。
- 当最近的父 package.json 文件包含值为 "commonjs" 的顶层字段 "type" 时，则扩展名为 .js 的文件。
- 字符串作为参数传入 --eval 或 --print，或通过 STDIN 管道传输到 node，带有标志 --input-type=commonjs。

**模块加载器**
CommonJS 模块加载器：
- 它是完全同步的。
- 它负责处理 require() 调用。
- 它是可修补的。
- 它支持文件夹作为模块。
- 当解析说明符时，如果没有找到完全的匹配，则它将尝试添加扩展名（.js、.json，最后是 .node），然后尝试将文件夹作为模块解析。
- 它将 .json 视为 JSON 文本文件。
- .node 文件被解释为加载了 process.dlopen() 的编译插件模块。
- 它将所有缺少 .json 或 .node 扩展名的文件视为 JavaScript 文本文件。
- 它不能用于加载 ECMAScript 模块（尽管可以从 CommonJS 模块加载 ECMASCript 模块）。 当用于加载不是 ECMAScript 模块的 JavaScript 文本文件时，则它将作为 CommonJS 模块加载。

ECMAScript 模块加载器：
- 它是异步的。
- 负责处理 import 语句和 import() 表达式。
- 它不是可修补的，可以使用加载器钩子自定义。
- 它不支持文件夹作为模块，必须完全指定目录索引（例如 './startup/index.js'）。
- 它不进行扩展名搜索。 当说明符是相对或绝对的文件 URL 时，必须提供文件扩展名。
- 它可以加载 JSON 模块，但需要导入断言。
- 它只接受 JavaScript 文本文件的 .js、.mjs 和 .cjs 扩展名。
- 它可以用来加载 JavaScript CommonJS 模块。 这样的模块通过 es-module-lexer 来尝试识别命名的导出，如果可以通过静态分析确定的话是可用的。 导入的 CommonJS 模块将其 URL 转换为绝对路径，然后通过 CommonJS 模块加载器加载。

**package.json 和文件扩展名**
如果 package.json 文件没有 "type" 字段或type 字段值为 commonjs，则 .js 文件将被视为 CommonJS。
如果 package.json "type" 值为"module"，该包中的 .js 文件解释为使用 ES 模块语法。

.mjs 
 - 文件总是作为 ES 模块加载，而不管最近的父级 package.json。
 - 在 "type": "commonjs" 包中，Node.js 可以被指示将特定文件解释为 ES 模块，方法是使用 .mjs 扩展名命名它（因为 .js 和 .cjs 文件都被视为 "commonjs" 包中的 CommonJS）。
.cjs
 - 文件总是作为 CommonJS 加载，而不管最近的父级 package.json。
 - 在 "type": "module" 包中，Node.js 可以通过使用 .cjs 扩展名命名它来指示将特定文件解释为 CommonJS（因为 .js 和 .mjs 文件都被视为 "module" 包中的 ES 模块）

**--input-type 标志**
作为参数传给 --eval（或 -e），或通过 STDIN 管道传输到 node 的字符串
- 设置 --input-type=module 标志时被视为 ES 模块
- 设置 --input-type=commonjs 标志时被视为 ES 模块(未指定时的默认行为)

**包的入口**
在包的 package.json 文件中，两个字段可以定义包的入口点："main" 和 "exports"。 这两个字段都适用于 ES 模块和 CommonJS 模块入口点。
对于针对当前支持的 Node.js 版本的新包，建议使用 "exports" 字段。 
*对于支持 Node.js 10 及以下的包，"main" 字段是必需的。*
如果同时定义了 "exports" 和 "main"，则在支持的 Node.js 版本中，"exports" 字段优先于 "main"。

**子路径的模式**
```
{
  "exports": {
    "./features/*.js": "./src/features/*.js"
  },
  "imports": {
    "#internal/*.js": "./src/internal/*.js"
  }
}
```
/* 映射公开嵌套的子路径，因为它只是字符串替换语法，右侧 * 的所有实例都将替换为该值，包括它是否包含任何 / 分隔符。
要从模式中排除私有子文件夹，可以使用 null
```
import featureX from 'es-module-package/features/x.js';
// 加载 ./node_modules/es-module-package/src/features/x.js

import featureY from 'es-module-package/features/y/y.js';
// 加载 ./node_modules/es-module-package/src/features/y/y.js

{
  "exports": {
    "./features/*.js": "./src/features/*.js",
    "./features/private-internal/*": null
  }
}

import featureInternal from 'es-module-package/features/private-internal/m.js';
// 抛出: ERR_PACKAGE_PATH_NOT_EXPORTED

import featureX from 'es-module-package/features/x.js';
// 加载 ./node_modules/es-module-package/src/features/x.js
```

**条件导出**
从最具体到最不具体的顺序列出，因为应该定义条件：
- "node-addons" - 类似于 "node" 并匹配任何 Node.js 环境。 此条件可用于提供使用原生 C++ 插件的入口点，而不是更通用且不依赖原生插件的入口点。 可以通过 --no-addons 标志禁用此条件。
- "node" - 匹配任何 Node.js 环境。 可以是 CommonJS 或 ES 模块文件。 在大多数情况下，不需要明确调用 Node.js 平台。
- "import" - 当包通过 import 或 import()，或者通过 ECMAScript 模块加载器的任何顶层导入或解析操作加载时匹配。 无论目标文件的模块格式如何，都适用。 始终与 "require" 互斥。
- "require" - 当包通过 require() 加载时匹配。 引用的文件应该可以用 require() 加载，尽管无论目标文件的模块格式如何，条件都匹配。 预期的格式包括 CommonJS、JSON 和原生插件，但不包括 ES 模块，因为 require() 不支持它们。 始终与 "import" 互斥。
- "default" - 始终匹配的通用后备。 可以是 CommonJS 或 ES 模块文件。 *此条件应始终放在最后。*
*在 "exports" 对象中，键顺序很重要。 在条件匹配过程中，较早的条目具有更高的优先级并优先于较晚的条目。 一般规则是条件应该按照对象顺序从最具体到最不具体。*

**社区条件定义**
- "types" - 类型系统可以使用它来解析给定导出的类型文件。 此条件应始终首先包含在内。
- "deno" - 表示 Deno 平台的变体。
- "browser" - 任何网络浏览器环境。
- "development" - 可用于定义仅开发环境入口点，例如提供额外的调试上下文。 必须始终与 "production" 互斥。
- "production" - 可用于定义生产环境入口点。 必须始终与 "development" 互斥。

**使用名称来引用包**
在一个包中，包的 package.json "exports" 字段中定义的值可以通过包的名称引用。
*注意：*
- 自引用仅在 package.json 具有 "exports" 时可用，并且只允许导入 "exports"（在 package.json 中）允许的内容。
- 在 ES 模块和 CommonJS 模块中使用 require 时也可以使用自引用。
- 自引用也适用于作用域包。

**在避免或最小化危害的同时编写双包**
- 每种模式都有权衡，但有两种广泛的方法可以满足以下条件：
- 该软件包可通过 require 和 import 使用。
- 该包在当前 Node.js 和不支持 ES 模块的旧版本 Node.js 中都可用。
- 包主入口点，例如 'pkg' 可以被 require 用来解析 CommonJS 文件，也可以被 import 用来解析 ES 模块文件。 （对于导出的路径也是如此，例如 'pkg/feature'。）
- 该包提供命名导出，例如 import { name } from 'pkg' 而不是 import pkg from 'pkg'; pkg.name。
- 该包可能在其他 ES 模块环境中可用，例如浏览器。
- 避免或最小化上一节中描述的危害。

**双包编写方法**
- 使用 ES 模块封装器
在 CommonJS 中编写包或将 ES 模块源代码转换为 CommonJS，并创建定义命名导出的 ES 模块封装文件。 使用条件导出, import 使用 ES 模块封装器，require 使用 CommonJS 入口点。
```
// ./node_modules/pkg/index.cjs
exports.name = 'value';

// ./node_modules/pkg/wrapper.mjs
import cjsModule from './index.cjs';
export const name = cjsModule.name;

import cjsModule from './index.cjs';
export const name = cjsModule.name;
export default cjsModule;
```
此方法适用于以下任何用例：
- 该包目前是用 CommonJS 编写的，作者不希望将其重构为 ES 模块语法，而是希望为 ES 模块使用者提供命名导出。
- 该包还有其他依赖它的包，最终用户可能会同时安装这个包和那些其他包。 比如 utilities 包直接在应用中使用，utilities-plus 包给 utilities 增加了一些功能。 因为封装器导出了底层的 CommonJS 文件，所以 utilities-plus 是用 CommonJS 还是 ES 模块语法编写的并不重要；无论哪种方式都可以。
- 包存储内部状态，包作者宁愿不重构包以隔离其状态管理。 请参阅下一章节。

此方法的变体不需要消费者有条件导出，可以添加一个导出，例如 "./module"，指向包的全 ES 模块语法版本。 如果用户确定 CommonJS 版本不会在应用程序的任何地方加载，例如通过依赖项，或者如果可以加载 CommonJS 版本但不影响 ES 模块版本（例如, 因为包是无状态的）：
```
// ./node_modules/pkg/package.json
{
  "type": "module",
  "exports": {
    ".": "./index.cjs",
    "./module": "./wrapper.mjs"
  }
}
```
- 隔离状态
*状态是一个问题的原因是因为包的 CommonJS 和 ES 模块版本都可能在应用程序中使用；例如，用户的应用程序代码可以 import ES 模块版本，而依赖项 require CommonJS 版本。 如果发生这种情况，包的两个副本将被加载到内存中，因此将出现两个不同的状态。 这可能会导致难以解决的错误。*

除了编写无状态包（例如，如果 JavaScript 的 Math 是一个包，它将是无状态的，因为它的所有方法都是静态的），还有一些方法可以隔离状态，以便在可能加载的 CommonJS 和 ES 模块之间共享它包的实例：
(1)如果可能，在实例化对象中包含所有状态。 比如 JavaScript 的 Date
(2)在包的 CommonJS 和 ES 模块版本之间共享的一个或多个 CommonJS 文件中隔离状态。 比如 CommonJS 和 ES 模块入口点分别是 index.cjs 和 index.mjs：
```
// ./node_modules/pkg/index.cjs
const state = require('./state.cjs');
module.exports.state = state;

// ./node_modules/pkg/index.mjs
import state from './state.cjs';
export {
  state
};
```
此方法适用于以下任何用例：
- 该包目前是用 ES 模块语法编写的，包作者希望在支持此类语法的任何地方使用该版本。
- 包是无状态的，或者它的状态可以很容易地被隔离。
- 该包不太可能有其他依赖它的公共包，或者如果有，则该包是无状态的，或者具有不需要在依赖项之间或与整个应用程序共享的状态。
*即使处于隔离状态，在 CommonJS 和 ES 模块版本之间仍然存在可能执行额外代码的成本。*

与之前的方法一样，这种方法的变体不需要消费者有条件的导出，可以添加一个导出，例如 "./module"，指向包的全 ES 模块语法版本
