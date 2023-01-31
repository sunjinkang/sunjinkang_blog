---
title: nodejs基础知识(10)
date: 2023-01-18 13:32:50
tags: [node, module(模块), CommonJS]
---

#### CommonJS

**启用**
Node.js 有两个模块系统：CommonJS 模块和 ECMAScript 模块。
默认情况下，Node.js 会将以下内容视为 CommonJS 模块：
- 扩展名为 .cjs 的文件；
- 当最近的父 package.json 文件包含值为 "commonjs" 的顶层字段 "type" 时，则扩展名为 .js 的文件。
- 当最近的父 package.json 文件不包含顶层字段 "type" 时，则扩展名为 .js 的文件。 包作者应该包括 "type" 字段，即使在所有源都是 CommonJS 的包中也是如此。 明确包的 type 将使构建工具和加载器更容易确定包中的文件应该如何解释。
- 扩展名不是 .mjs、.cjs、.json、.node、或 .js 的文件（当最近的父 package.json 文件包含值为 "module" 的顶层字段 "type" 时，这些文件只有在它们是 require 的，而不是用作程序的命令行入口点）。
调用 require() 始终使用 CommonJS 模块加载器。 调用 import() 始终使用 ECMAScript 模块加载器。

**访问主模块**
当文件直接从 Node.js 运行时，则 require.main 被设置为其 module。 这意味着可以通过测试 require.main === module 来确定文件是否被直接运行。
对于文件 foo.js，如果通过 node foo.js 运行，则为 true，如果通过 require('./foo') 运行，则为 false。
当入口点不是 CommonJS 模块时，则 require.main 为 undefined，且主模块不可达。

[require的伪代码高级算法](http://shouce.gree020.cn/node/api/modules.html#all-together)

*模块缓存的注意事项*
模块根据其解析的文件名进行缓存。 由于模块可能会根据调用模块的位置（从 node_modules 文件夹加载）解析为不同的文件名，因此如果 require('foo') 解析为不同的文件，则不能保证 require('foo') 将始终返回完全相同的对象。
此外，在不区分大小写的文件系统或操作系统上，不同的解析文件名可以指向同一个文件，但缓存仍会将它们视为不同的模块，并将多次重新加载文件。 例如，require('./foo') 和 require('./FOO') 返回两个不同的对象，而不管 ./foo 和 ./FOO 是否是同一个文件。

**核心模块**
Node.js 有些模块编译成二进制文件。 这些模块在本文档的其他地方有更详细的描述。
*核心模块在 Node.js 源代码中定义，位于 lib/ 文件夹中。*
*可以使用 node: 前缀来识别核心模块，在这种情况下它会绕过 require 缓存。* 例如，require('node:http') 将始终返回内置的 HTTP 模块，即使有该名称的 require.cache 条目。
*如果某些核心模块的标识符传给 require()，则总是优先加载它们。* 例如，require('http') 将始终返回内置的 HTTP 模块，即使存在该名称的文件。 不使用 node: 前缀可以加载的核心模块列表暴露为 module.builtinModules。

**循环**
当有循环 require() 调用时，模块在返回时可能尚未完成执行。举例如下：
```javascript
// <!-- a.js: -->
console.log('a starting');
exports.done = false;
const b = require('./b.js');
console.log('in a, b.done = %j', b.done);
exports.done = true;
console.log('a done');

// <!-- b.js: -->
console.log('b starting');
exports.done = false;
const a = require('./a.js');
console.log('in b, a.done = %j', a.done);
exports.done = true;
console.log('b done');

// <!-- main.js: -->
console.log('main starting');
const a = require('./a.js');
const b = require('./b.js');
console.log('in main, a.done = %j, b.done = %j', a.done, b.done);

// $ node main.js
// main starting
// a starting
// b starting
// in b, a.done = false
// b done
// in a, b.done = true
// a done
// in main, a.done = true, b.done = true
```
当 main.js 加载 a.js 时，a.js 依次加载 b.js。 此时，b.js 尝试加载 a.js。 为了防止无限循环，将 a.js 导出对象的未完成副本返回给 b.js 模块。 然后 b.js 完成加载，并将其 exports 对象提供给 a.js 模块。到 main.js 加载这两个模块时，它们都已完成。

**文件模块**
如果找不到确切的文件名，Node.js 将尝试加载所需的文件名，并添加扩展名：.js、.json，最后是 .node。 当加载具有不同扩展名的文件（例如 .cjs）时，则必须将其全名传给 require()，包括其文件扩展名（例如 require('./file.cjs')）。
.json 文件被解析为 JSON 文本文件，.node 文件被解释为加载了 process.dlopen() 的已编译插件模块。 使用任何其他扩展名（或根本没有扩展名）的文件被解析为 JavaScript 文本文件。
以 '/' 为前缀的必需模块是文件的绝对路径。 例如，require('/home/marco/foo.js') 将在 /home/marco/foo.js 加载文件。
以 './' 为前缀的必需模块与调用 require() 的文件相关。 也就是说，circle.js 必须和 foo.js 在同一个目录下，require('./circle') 才能找到它。
如果没有前导 '/'、'./' 或 '../' 来指示文件，则该模块必须是核心模块或从 node_modules 文件夹加载。
如果给定路径不存在，则 require() 将抛出 MODULE_NOT_FOUND 错误。

**目录作为模块**
可以通过三种方式将文件夹作为参数传给 require()。
- 在文件夹的根目录创建 package.json 文件，指定 main 模块。 一个示例 package.json 文件可能如下所示：
```
{ "name" : "some-library",  "main" : "./lib/some-library.js" }
```
如果这是在 ./some-library 的文件夹中，则 require('./some-library') 将尝试加载 ./some-library/lib/some-library.js。
- 目录中不存在 package.json 文件，或者 "main" 条目丢失或无法解析，则 Node.js 将尝试从该目录中加载 index.js 或 index.node 文件。 例如，如果前面的示例中没有 package.json 文件，则 require('./some-library') 将尝试加载：
```
./some-library/index.js
./some-library/index.node
```
- 如果这些尝试失败，Node.js 将报告整个模块丢失，并显示默认错误：
```
Error: Cannot find module 'some-library'
```
在上述所有三种情况下，import('./some-library') 调用都将导致 ERR_UNSUPPORTED_DIR_IMPORT 错误。 使用包子路径导出或子路径导入可以提供与文件夹作为模块相同的包含组织优势，并且适用于 require 和 import。

**从 node_modules 目录加载**
如果传给 require() 的模块标识符不是核心模块，并且不以 '/'、'../' 或 './' 开头，则 Node.js 从当前模块的目录开始，并添加 /node_modules，并尝试从该位置加载模块。 Node.js 不会将 node_modules 附加到已经以 node_modules 结尾的路径。
如果在那里找不到它，则它移动到父目录，依此类推，直到到达文件系统的根目录。
例如，如果 '/home/ry/projects/foo.js' 处的文件调用 require('bar.js')，则 Node.js 将按以下顺序查找以下位置：
- /home/ry/projects/node_modules/bar.js
- /home/ry/node_modules/bar.js
- /home/node_modules/bar.js
- /node_modules/bar.js
这允许程序本地化它们的依赖项，这样它们就不会发生冲突。
通过在模块名称后包含路径后缀，可以要求与模块一起分发的特定文件或子模块。 例如，require('example-module/path/to/file') 将相对于 example-module 所在的位置解析 path/to/file。 后缀路径遵循相同的模块解析语义。

**模块作用域**
__dirname
- <string>
当前模块的目录名。 这与 __filename 的 path.dirname() 相同。

示例：从 /Users/mjr 运行 node example.js
```
console.log(__dirname);
// 打印: /Users/mjr
console.log(path.dirname(__filename));
// 打印: /Users/mjr
```

__filename
- <string>
当前模块的文件名。 这是当前模块文件的已解析符号链接的绝对路径。
对于主程序，这不一定与命令行中使用的文件名相同

示例：从 /Users/mjr 运行 node example.js
```
console.log(__filename);
// 打印: /Users/mjr/example.js
console.log(__dirname);
// 打印: /Users/mjr
```

require.cache
- <Object>
模块在需要时缓存在此对象中。 通过从此对象中删除键值，下一次 require 将重新加载模块。 这不适用于原生插件，因为重新加载会导致错误。
添加或替换条目也是可能的。 在本地模块之前检查此缓存，如果将匹配本地模块的名称添加到缓存中，则只有 node: 前缀的 require 调用将接收本地模块。 小心使用！

require.main
- <module> | <undefined>
Module 对象代表 Node.js 进程启动时加载的入口脚本，如果程序的入口点不是 CommonJS 模块，则为 undefined。

module.path
- <string>
模块的目录名称。 这通常与 module.id 的 path.dirname() 相同。

module.paths
- <string[]>
模块的搜索路径。

