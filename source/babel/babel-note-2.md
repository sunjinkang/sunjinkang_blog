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