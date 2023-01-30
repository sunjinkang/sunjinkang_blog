---
title: nodejs基础知识(11)
date: 2023-01-30 10:34:23
tags: [node, package 包模块]
---

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




node官方建议包的开发者明确指定package.json中type字段的值，为什么很多项目中没有这个字段？？？？？
commonjs模块加载器可修补是什么意思？
beforeunload监听页面是否存在操作，存在操作时提示，需要鼠标点击页面事件才生效
