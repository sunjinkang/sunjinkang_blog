---
title: babel基础知识
date: 2023-04-25 15:02:45
---

#### babel使用指南

###### babel核心库
Babel 的核心功能在 @babel/core 模块。通过以下命令安装：
```js
// 安装
npm install --save-dev @babel/core

// 使用
const babel = require("@babel/core");
babel.transform("code", optionsObject);
```

CLI 工具
@babel/cli 是一个允许你从终端使用 babel 的工具。下面是安装命令和基本用法的示例：
```js
npm install --save-dev @babel/core @babel/cli
./node_modules/.bin/babel src --out-dir lib
```

###### Plugins & Presets

使用 "preset" 来代替预先设定的一组插件，而不是逐一添加想要的所有插件。
就像使用 plugins 一样，你也可以创建自己的 preset，分享你需要的任何插件组合。比如：preset-env。
```js
npm install --save-dev @babel/preset-env
./node_modules/.bin/babel src --out-dir lib --presets=@babel/env
```

没有任何配置，这个 preset 包括支持现代 JavaScript（ES2015，ES2016 等）的所有插件。但是 presets 也可以选择。不从终端传入 cli 和 preset 选项，而是通过另一种传入选项的方式：配置文件（后续会详细说明）。

###### Polyfill

@babel/polyfill 模块包括 core-js 和自定义 regenerator runtime 来模拟完整的 ES2015+ 环境。
注意：如果你确切知道需要实现的功能，可以直接从 core-js 中获取它们。避免直接使用@babel/polyfill造成冗余。
由于我们正在构建一个应用程序，我们可以只安装 @babel/polyfill:
```js
npm install --save @babel/polyfill
```
*注意 --save 选项而不是 --save-dev，因为这是一个需要在源代码之前运行的 polyfill。*

如果使用的是 env preset，其中有一个 "useBuiltIns" 选项，当设置为 "usage" 时，实际上将应用上面提到的最后一个优化，只包括你需要的 polyfill。使用此新选项，配置更改如下：
```js
const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: "usage",
    },
  ],
];

module.exports = { presets };
```
Babel 将检查你的所有代码，以查找目标环境中缺少的功能，并仅包含所需的 polyfill
```js
// 添加useBuiltIns前
Promise.resolve().finally();

// 添加useBuiltIns后
// 会变成这个（因为 Edge 17 没有 Promise.prototype.finally）：
require("core-js/modules/es.promise.finally");
Promise.resolve().finally();
```
如果我们没有将 env preset 的 "useBuiltIns" 选项的设置为 "usage" ，就必须在其他代码之前 require 一次完整的 polyfill。

#### 配置babel
- babel.config.js
以编程式创建配置
编译 node_modules

文件位置：在项目根目录（package.json同级）
举例：
```js
module.exports = function (api) {
  api.cache(true);

  const presets = [ ... ];
  const plugins = [ ... ];

  return {
    presets,
    plugins
  };
}
```
详细配置：

- .babelrc
有一个静态配置只适用于简单的一个包

文件位置：在项目根目录（package.json同级）
举例：
```js
{
  "presets": [...],
  "plugins": [...]
}
```
* package.json
或者可以在 package.json 中，使用 babel 属性来指定.babelrc配置，如下所示：
```js
{
  "name": "my-package",
  "version": "1.0.0",
  "babel": {
    "presets": [ ... ],
    "plugins": [ ... ],
  }
}
```
* .babelrc.js
配置与 .babelrc 相同，可以使用 JavaScript 编写。
```js
const presets = [ ... ];
const plugins = [ ... ];
module.exports = { presets, plugins };

// 你可以访问任何 Node.js 的 API，例如基于流程环境的动态配置：
const presets = [ ... ];
const plugins = [ ... ];
if (process.env["ENV"] === "prod") {
  plugins.push(...);
}
module.exports = { presets, plugins };
```

###### 插件顺序
指定插件每个访问者的事项，这意味着如果两个转换器都访问同一个“ Program ”节点，则转换器将以插件或 preset 顺序运行。
- 插件plugins在 Presets 前运行。
- 插件可以指定从头到尾的顺序。
- Preset 顺序是相反的 (从后到前).
```js
{
  "plugins": [
    "transform-decorators-legacy",
    "transform-class-properties"
  ]
}
// 将会运行 transform-decorators-legacy 然后是 transform-class-properties。

// 关于 presets 一定要记住，顺序是相反的。如下：
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
// 按以下顺序运行：@babel/preset-react 再运行 @babel/preset-env。
```

###### 插件选项
插件和 presets 都可以通过将名称和选项对象放在在配置中的数组中来指定选项。

对于不指定选项，这些都是等效的：
```js
{
  "plugins": [
    "pluginA",
    ["pluginA"],
    ["pluginA", {}],
  ]
}

// 要指定选项，输入一个选项名作为 key 的对象
{
  "plugins": [
    ["transform-async-to-module-method", {
      "module": "bluebird",
      "method": "coroutine"
    }]
  ]
}

// presets 的选项设置相同:
{
  "presets": [
    ["env", {
      "loose": true,
      "modules": false
    }]
  ]
}
```

* 官方 Presets
常见环境的presets ：
@babel/preset-env
@babel/preset-flow
@babel/preset-react
@babel/preset-typescript

* 创建 Preset
只需要导出一个配置，就可以创建自己的 preset。
```js
module.exports = function() {
  return {
    plugins: [
      "pluginA",
      "pluginB",
      "pluginC",
    ]
  };
}

// Presets 可以包含其他的 presets 以及带有选项的插件。
module.exports = () => ({
  presets: [
    require("@babel/preset-env"),
  ],
  plugins: [
    [require("@babel/plugin-proposal-class-properties"), { loose: true }],
    require("@babel/plugin-proposal-object-rest-spread"),
  ],
});
```

#### 配置
filename
需要编译的源码文件的文件名（可以没有）。 filename 参数是可选的，但是当文件名未知时，并不是所有的 Babel 功能都可用， 因为某些参数依赖 filename 参数 来实现其功能。
- 文件名暴露给插件。一些插件可能需要文件名的存在。
- 像"test"， "exclude"和"ignore"这样的选项需要文件名来匹配字符串/RegExp。
- .babelrc.json或.babelrc文件相对于被编译的文件被加载。如果省略此选项，Babel将表现得好像设置了babelrc: false。

ast(默认值：false)
Babel的默认值是生成一个字符串和一个源映射，但在某些上下文中，获取AST本身也很有用。它的主要用例是多个转换传递链
```js
const filename = "example.js";
const source = fs.readFileSync(filename, "utf8");

// Load and compile file normally, but skip code generation.
const { ast } = babel.transformSync(source, {
  filename,
  ast: true,
  code: false,
});

// Minify the file in a second pass and generate the output code here.
const { code, map } = babel.transformFromAstSync(ast, source, {
  filename,
  presets: ["minify"],
  babelrc: false,
  configFile: false,
});
```
注意:默认情况下，这个选项不是打开的，因为大多数用户不需要它，因为我们希望最终在Babel中添加一个缓存层。必须缓存AST结构将占用更多的空间。

cloneInputAst(默认值：true，7.11.0)
默认是babel.transformFromAst将克隆输入AST以避免突变。如果输入AST没有在其他地方使用，指定cloneInputAst: false可以提高解析性能。

*加载配置项*

rootMode(默认值：root，7.1.0)
这个选项，结合"root"值，定义了Babel如何选择它的项目根。不同的模式定义了Babel处理“root”值以获得最终项目根的不同方式。

注意：babel.config.json从Babel 7.8.0开始支持，在旧的babel7的版本中，只支持babel.config.js。

- "root" - 传"root"，表示不变。
- "upward" - 从“根”目录向上走，寻找包含babel.config.json文件的目录，如果没有找到babel.config.json则抛出错误。
- "upward-optional" - 从“根”目录向上走，寻找包含babel.config.json文件的目录，如果没有找到babel.config.json，则返回到“root”目录。

"root"是默认模式，因为它避免了Babel意外加载完全在当前项目文件夹之外的Babel.config.json的风险。如果您使用“向上可选”，请注意它将沿着目录结构一直走到文件系统根目录，并且总是有可能有人忘记在他们的主目录中加了babel.config.json，这可能会在构建中导致意外错误。

使用单线程项目结构的用户在每个包的基础上运行构建/测试，他们可能很想使用“向上”，因为单线程项目通常在项目根目录中有一个babel.config.json。在monorepo子目录下运行Babel，不使用"upward"，将导致Babel跳过加载项目根目录下的Babel.config.json文件，这可能导致意外错误和编译失败。

envName(默认值：process.env.BABEL_ENV || process.env.NODE_ENV || "development")
配置加载期间使用的当前活动环境。该值在解析"env"配置时用作键，也可以通过api.env()函数在配置函数、插件和预置中使用

configFile(默认值：如果存在文件，为path.resolve(opts.root, "babel.config.json")，否则为 false)
默认查找babel.config.json, 但也可以传入js或者json配置文件。
注意:这个选项不影响.babelrc.json的加载。因此，虽然可以尝试执行configFile: "./foo/.babelrc.json"，不建议使用。如果给定.babelrc.json是通过标准的文件相对逻辑加载的，你最终会加载相同的配置文件两次，并将其与自身合并。如果要链接一个特定的配置文件，建议使用独立于“babelrc”名称的命名方案。

babelrc(只有当filename选项存在时，为true)
允许在Babel的编程选项中，或者在加载的“configFile”中。编程选项将覆盖配置文件选项。
设置为true时，允许通过filename查找对应的配置文件
注意：只有当"filename"与任意一个" babelrcRoots "包匹配时，才会加载 .babelrc.json文件。

babelrcRoots(默认值：opts.root)
允许在Babel的编程选项中，或者在加载的“configFile”中。编程选项将覆盖配置文件选项。

默认情况下，Babel只会在 "root" 包中搜索.babelrc.json文件，因为Babel无法知道给定的.babelrc.json文件是否意味着要加载，或者它的“插件”和“预置”已经安装，因为正在编译的文件可能在node_modules中，或者已经符号链接到项目中。

这个选项允许用户在考虑是否加载.babelrc.json 文件时提供一个应该被视为“根”包的其他包的列表。
```js
babelrcRoots: [
  // Keep the root as a root
  ".",

  // Also consider monorepo packages "root" and load their .babelrc.json files.
  "./packages/*",
];
```

* 插件和预置项
plugins
注意:该选项也允许Babel本身的Plugin实例，但不建议直接使用。如果你需要创建一个插件或预设的持久表示，你应该使用babel.createConfigItem()。

presets
注意:预设的格式与插件相同，除了名称规范化期望“preset-”而不是“plugin-”，并且预设不能是plugin的实例。

* Output targets

targets(v7.13.0)
允许在Babel的编程选项中，或者在加载的“configFile”中。编程选项将覆盖配置文件选项。
描述项目支持的环境。
这可以是一个与浏览器列表兼容的查询(带有警告):
```js
// babel.config.json
{
  "targets": "> 0.25%, not dead"
}
```
也可以是一个最小支持环境版本的对象
```js
// babel.config.json
{
  "targets": {
    "chrome": "58",
    "ie": "11"
  }
}
```
支持的环境有：android, chrome, deno, edge, electron, firefox, ie, ios, node, opera, rhino, safari, samsung.
如果没有指定次要版本，babel将会按照MAJOR.0解析，比如："node":12 将会被解析为node.js 12.0

No targets
未指定targets时，babel将假定target为尽可能老的浏览器版本。例如：@babel/preset-env 将会把所有的 ES2015-ES2020 代码编译为 ES5兼容版本。
> 建议设置target以减小打包的代码大小。
babel的操作和browserslist不一致：在babel或者browserslist配置中，如果没有找到targets，不会使用defaults作为默认配置，如果想要使用default，需要将defaults设置为target
```js
// babel.config.json
{
  "targets": "defaults"
}
```
注意：这一点有可能在babel的v8中做出修改。

targets.esmodules
你也可以标记支持ES模块的浏览器(https://www.ecma-international.org/ecma-262/6.0/#sec-modules)。当esmodules的target被指定时，它将与browser的target和browserslist的target相交。您可以将此方法与<script type="module"></script>结合使用，以便有条件地为用户提供较小的脚本(https://jakearchibald.com/2017/es-modules-in-browsers/#nomodule-for-backwards-compatibility)。
> 注意：当同时指定browsers和esmodules的target，他们将会相交。
```js
// babel.config.json
{
  "targets": {
    "esmodules": true
  }
}
```

targets.node
如果想编译当前版本node，可以设置"node": true 或者 "node": "current", 和 "node": process.versions.node 的作用是一样的
也可以在browserslist里面指定node版本（不推荐）
```js
// babel.config.json
{
  "targets": "node 12" // not recommended
}
```
在这种情况下，browserslist将把它解析为node-releases库中可用的最新版本。由于Node.js可能在次要版本中支持新的语言特性，因此为Node.js 12.22生成的程序可能会在Node.js 12.0上抛出语法错误。我们建议你在使用browserslist节点查询时总是指定一个次要版本:
```js
// babel.config.json
{
  "targets": "node 12.0"
}
```

targets.safari
如果你想编译Safari的技术预览版本，你可以指定" Safari ": "tp"。

targets.browsers
使用browserslist选择浏览器(例如: last 2 versions, > 5%, safari tp)的查询。
注意，浏览器的结果会被来自targets的显式项覆盖。

targets.deno
最小的deno支持版本为1.0
```js
// babel.config.json
{
  "targets": {
    "deno": "1.9"
  }
}
```

browserslistConfigFile(默认值：true，7.13.0)
允许在Babel的编程选项中，或者在加载的配置文件中。
切换是否使用browserslist配置源，包括搜索任何browserslist文件或引用package.json中的browserslist键。这对于使用browserslist配置文件的项目很有用，这些文件不会用Babel编译。

如果指定了字符串，它必须表示browserslist配置文件的路径。相对路径是相对于指定该选项的配置文件解析的，或者当它作为编程选项的一部分传递时，相对路径是相对于cwd解析的。

browserslistEnv(默认值：undefined，7.13.0)
允许在Babel的编程选项中，或者在加载的配置文件中。
使用的 Browserslist 环境。（https://github.com/browserslist/browserslist#configuring-for-different-environments）


* Config Merging options

extends
不允许放在presets里面
配置文件可以“扩展”其他配置文件。当前配置中的配置字段将合并到扩展文件的配置之上。

env
不能嵌套在另一个env块中。
允许整个嵌套配置选项，只有当envKey与envName选项匹配时才会启用。
注意:env[envKey]选项将合并在根对象中指定的选项之上。

overrides
不能嵌套在另一个overrides对象中，或者在一个env块中。
允许用户提供一个选项数组，这些选项将一次一个地合并到当前配置中。该特性最好与“test”/“include”/“exclude”选项一起使用，以提供应该应用覆盖的条件。
```js
// JavaScript
overrides: [{
  test: "./vendor/large.min.js",
  compact: true,
}],
```
可以用来为一个已知是大文件和小文件的特定文件启用compact选项，并告诉Babel不要费心尝试打印该文件。

test
当所有匹配失败时，当前配置对象被认为不起作用，并在处理中被忽略。该项在overrides配置项内最有用，但也允许使用在其他地方。
注意:这些切换不会影响之前区块中的编程和配置加载选项，因为它们在准备合并的配置之前就已经被添加进去了。

include
该项是 test 的同义项。

exclude
当任意匹配成功时，当前配置对象被认为不起作用，并在处理中被忽略。该项在overrides配置项内最有用，但也允许使用在其他地方。
注意:这些切换不会影响之前区块中的编程和配置加载选项，因为它们在准备合并的配置之前就已经被添加进去了。

ignore
不允许放在presets里面。
当任意匹配成功时，babel将会立即停止当前build中的所有处理。比如：用户想要禁用lib文件夹中babel的编译可以设置如下配置：
```js
// JavaScript
ignore: ["./lib"];
```
注意:此选项禁用文件的所有Babel处理。虽然这有其用途，但作为一种不那么激进的选择，“exclude”选项也值得考虑。

only
不允许放在presets里面。
当任意匹配失败时，babel将会立即停止当前build中的所有处理。比如：用户想要禁用除src文件夹中以外其他地方的babel的编译可以设置如下配置：
```js
// JavaScript
only: ["./src"];
```
注意:此选项禁用文件的所有Babel处理。虽然这有其用途，但作为一种不那么激进的选择，"test"/"include" 选项也值得考虑。

* Source Map options

inputSourceMap(默认值：true)
如果文件存在 //# sourceMappingURL=... 注释且设置为true时，会尝试从文件本身加在输入sourcemap。如果找不到map或者map加载解析失败，它将被无声地丢弃
如果提供的是object，它将会被当做source map的object

sourceMaps(默认值： false)
- 设置为true时，会为代码生成sourcemap，并包含在结果对象中。
- 设置为"inline"时，会为代码生成sourcemap，并将其作为一个data url追加到代码里面，但是不会包含在结果对象中。
- 设置为"both"时，和‘inline’的表现一致，但是map会包含在结果对象中。
@babel/cli加载这些也会影响map写入磁盘：
- 设置为true时，会在磁盘上写入一个.map文件
- 设置为"inline"时，将会直接写入文件，但在map中会有一个 data:
- 设置为"both"时，会写入包含data: url的文件和一个.map文件
注意:这些选项有点奇怪，因此根据您的用例，使用true并在您自己的代码中处理其余部分可能是最有意义的。

sourceMap
sourceMaps的同义项，推荐使用sourceMaps

sourceFileName(默认值：可用时为 path.basename(opts.filenameRelative), 或者为 "unknown")
这是source map对象中的文件名。

sourceRoot
要在生成的源映射中设置的sourceRoot字段(如果需要的话)。

* Misc options

sourceType(默认值：module)
- "script" - 使用 ECMAScript Script 语法解析文件。不允许使用 import/export 语句, 同时文件不是‘strict’ 模式。
- "module" - 使用 ECMAScript Module 语法解析文件。文件自动设置‘strict’ 模式，并且允许使用 import/export 语句。
- "unambiguous" - 当文件中有 import/export 语句时，作为"module"解析，否则作为"script"解析。
unambiguous在type未知时十分有用，但是可能由于module没有使用import/export 语句导致匹配失败，因为它是完全匹配的
这个选项很重要，因为当前文件的类型既会影响输入文件的解析，也会影响可能希望向当前文件添加 import/require 用法的某些转换。

例如：@babel/plugin-transform-runtime 依据当前文件的type判定插入import 语句还是require语句。@babel/preset-env 的"useBuiltIns"配置项也是一样的。自从Babel 默认将文件作为ES modules, 这些plugins/presets 也默认插入import语句。这是正确的sourceType非常重要，因为设置了错误的type会导致babel向原本是CommonJS的文件插入import语句。这在需要编译node_modules依赖项的项目中尤为重要，因为插入import语句可能会导致Webpack和其他工具将文件视为ES模块，从而破坏了本来可以正常工作的CommonJS文件。
注意:此选项不会影响.mjs文件的解析，因为它们目前是硬编码的，总是解析为“模块”文件。

assumptions(默认值:{}, 7.13.0)
允许在编程选项、配置文件和预设中使用。
设定Babel可以做出的假设，以产生较小的输出:
```js
// babel.config.json
{
  "assumptions": {
    "iterableIsArray": true
  },
  "presets": ["@babel/preset-env"]
}
```

highlightCode(默认值：true)
突出显示Babel错误消息中的代码片段中的标记，使它们更容易阅读。

wrapPluginVisitorMethod（Type: (key: string, nodeType: string, fn: Function) => Function）
允许用户在每个访问者上添加一个包装器，以便在Babel执行插件时检查访问者进程。
Key是一个简单的不透明字符串，表示正在执行的插件。
nodeType是正在访问的AST代码类型
fn是访问者函数
用户可以返回一个替换函数，该函数应该在执行他们希望执行的任何日志记录和分析之后调用原始函数。

parserOpts
一个不透明的对象，其中包含要传递给正在使用的解析器的选项。
有关可用的解析器选项，请参见解析器选项。

generatorOpts
一个不透明的对象，包含要传递给代码生成器的选项，可以查看Code Generator Options。

* Code Generator options

retainLines（默认值：false）
babel尝试将源文件中同一行的代码经过生成器后仍在同一行。这个选项的存在是为了让不能使用源映射的用户可以得到模糊有用的错误行号，但这只是最好的选择，并不能保证在所有插件的所有情况下都适用。

compact(默认值："auto")
"auto"通过计算代码长度大于500_000设置值。
在紧凑模式下生成代码时，所有可选的换行符和空格都将被省略。

minified(Default: false)
包括compact: true，省略块尾分号，在可能的情况下从new Foo()中省略()，并可能输出更短版本的文字。

auxiliaryCommentBefore
允许指定在原始文件中不存在的代码段之前插入前缀注释。
注意:原始文件中存在和不存在的定义可能有点难看，因此不建议使用此选项。如果你需要以某种方式注释代码，最好使用Babel插件。

auxiliaryCommentAfter
作用与auxiliaryCommentBefore类似，不过是在代码段之后插入前缀注释

comments(默认值：true)
如果没有给出函数，则为shouldPrintComment提供默认注释状态。有关更多信息，请参阅该选项的默认值。

shouldPrintComment
Type: (value: string) => boolean
Default without minified: (val) => opts.comments || /@license|@preserve/.test(val)
Default with minified: () => opts.comments
决定给定的注释是否包含在babel输出的代码中。

* AMD / UMD / SystemJS module options

moduleIds(默认值：!!opts.moduleId)
启用模块ID生成功能。

moduleId
用于模块的硬编码ID。不能与getModuleId一起使用。

getModuleId
Type: (name: string) => string
依据babel生成的模块name，返回要使用的name。返回false值将使用原始名称。

moduleRoot
要包含在生成的模块名中的根路径。

* Options Concepts

MatchPattern
Type: string | RegExp | (filename: string | void, context: { caller: { name: string } | void, envName: string, dirname: string ) => boolean
几个Babel选项对文件路径执行测试。通常，这些选项支持一种公共模式方法，其中单个模式可以是：
- string - 一个文件路径，简单地支持*和**作为完整的分段匹配。任何与模式匹配的文件或父文件夹都被视为匹配。路径遵循Node的正常路径逻辑，因此在POSIX上必须以/-分隔，但在Windows上/和\都被支持。
- RegExp - 与规范化文件名匹配的正则表达式。在POSIX上，路径RegExp将在 / 分隔的路径上运行，而在Windows上，它将在 \ 分隔的路径上运行。
重要的是，如果使用这两个选项中的任何一个，Babel要求文件名选项存在，否则将认为它是错误的。
- (filename: string | void, context: { caller: { name: string } | void, envName: string, dirname: string }) => boolean 是一个通用回调，它应该返回一个布尔值来指示是否匹配。该函数传递文件名，如果没有给Babel，则未定义。它还传递了当前的envName和调用者选项，这些选项是由对Babel的顶级调用指定的，而dirname是配置文件的目录或当前工作目录(如果以编程方式调用转换)。

Plugin/Preset entries
PluginEntry / PresetEntry
单个插件/预置项可以有几个不同的结构:
- EntryTarget - 单个插件
- [EntryTarget, EntryOptions] - 单个插件 w/ 选项
- [EntryTarget, EntryOptions, string] - 带有选项和名称的单个插件(有关名称的更多信息，请参阅合并)
- ConfigItem - 一个由babel.createConfigItem()创建的插件配置项。
同一个EntryTarget可以被多次使用，除非每个都被赋予不同的名称，但是这样做会导致重复插件/预设错误。
同时这样做会造成阅读困难：
```js
plugins: [
  // EntryTarget
  '@babel/plugin-transform-classes',

  // [EntryTarget, EntryOptions]
  ['@babel/plugin-transform-arrow-functions', { spec: true }],

  // [EntryTarget, EntryOptions, string]
  ['@babel/plugin-transform-for-of', { loose: true }, "some-name"],

  // ConfigItem
  babel.createConfigItem(require("@babel/plugin-transform-spread")),
],
```







不透明字符串(https://www.w3.org/html/ig/zh/wiki/File#.E4.B8.8D.E9.80.8F.E6.98.8E.E5.AD.97.E7.AC.A6.E4.B8.B2)
不得包含任何未经百分号编码[RFC3986]规定的保留字符，这些字符必须通过百分号编码。不透明字符串必须是全球唯一的。此类字符串应当只使用在U+002A至U+002B、U+002D至U+002E、U+0030至U+0039、U+0041至U+005A, U+005E至U+007E[Unicode]这些范围内的字符，并且应当至少由36个字符组成。UUID是一个潜在的用作[Blob URI]的不透明字符串的可选项，同时强烈推荐使用UUID。UUID由[RFC4122]定义，UUID的ABNF可参见附录A。