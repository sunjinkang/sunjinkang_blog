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

