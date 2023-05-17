---
title: babel基础知识- 配置文件
date: 2023-05-10 18:05:35
---

#### 配置文件

Babel 有两种并行的配置文件格式，可以一起使用，也可以单独使用。
- 项目范围的配置
- 文件相关配置
 - .babelrc（和 .babelrc.js）文件
 - 带有 "babel" 键的 package.json 文件

*项目范围的配置*
Babel 7.x 中的新功能，Babel 具有 "root" 目录的概念，默认为 到当前的工作目录。对于项目范围的配置，Babel 将自动搜索 相对对于此根目录下的 "babel.config.js" 。或者，用户可以使用显式 "configFile" 值覆盖默认的配置文件搜索行为。
也可以通过将 "configFile" 设置为 false 来禁用项目范围的配置。

*配置函数API*
JS 配置文件可以导出一个将传递配置函数 API 的函数：
```js
module.exports = function(api) {
  return {};
}
```

api 对象暴露的API：

api.version
正在加载配置文件的 Babel 版本的版本字符串。

api.cache
进行缓存设置

api.cache.forever() - Permacache 计算的配置，永远不再调用该函数。
api.cache.never() - 不要缓存此配置，并且每次都重新执行该功能。
api.cache.using(() => process.env.NODE_ENV) - 根据 NODE_ENV 的值缓存。 如果using 回调返回的值不是预期的值，将再次调用config函数，并将新条目添加到缓存中。
api.cache.invalidate(() => process.env.NODE_ENV) - 根据 NODE_ENV 的值缓存。 如果using 回调返回的值不是预期的值，将再次调用 config 函数，缓存中的所有条目将替换为结果。
api.cache(true) - 与 api.cache.forever() 相同
api.cache(false) - 与 api.cache.never() 相同

由于实际的回调结果用于检查缓存条目是否有效，因此建议使用：
- 回调应该小而且没有副作用。
- 回调应该返回可能的最小范围的值。例如 .using(() => process.env.NODE_ENV) 上面的用法并不理想，因为它会造成一个未知的 高速缓存条目的数量取决于检测到多少个 NODE_ENV 值。 .using(() => process.env.NODE_ENV === "development") 更安全，因为缓存条目 只能是 true 或 false。

api.env(...)
由于 NODE_ENV 是一种相当常见的切换行为方式，因此 Babel 还包含一个 API 函数 专门为此而设。
它有几种不同的形式：
- api.env("production") 返回 true 如果 envName === "production".
- api.env(["development", "test"]) 返回 true 如果 ["development", "test"].includes(envName).
- api.env() 返回当前的 envName 字符串。
- api.env(envName => envName.startsWith("test-")) 如果 env 以 "test-" 开头，则返回 true。
注意:这个函数在内部使用api.cache，以确保Babel知道此构建依赖于特定的envName。你不应该将它与api.cache.forever()或api.cache.never()一起使用。

api.caller(cb)
该API用于访问传递给Babel的调用者数据。由于Babel的许多实例可能在具有不同调用者值的相同进程中运行，因此该API被设计为自动配置API.cache，与api.env()相同。
caller 值可用作回调函数的第一个参数。
```js
function isBabelRegister(caller) {
  return !!(caller && caller.name === "@babel/register");
}

 // 根据特定环境切换配置行为。
module.exports = function(api) {
  const isRegister = api.caller(isBabelRegister);

  return {
    // ...
  };
}
```

api.assertVersion(range)
虽然 api.version 在一般情况下很有用，但有时候声明你的版本会很好。 此 API 公开了一种简单的方法：
```js
module.exports = function(api) {
  api.assertVersion("^7.2");

  return {
    // ...
  };
};
```

*@babel/plugin-transform-runtime*
作用一：自动移除语法转换后内联的辅助函数（inline Babel helpers），使用@babel/runtime/helpers里的辅助函数来替代
相关文章：https://www.jiangruitao.com/babel/transform-runtime/

*@babel/register*
@babel/register只有一个功能，就是重写node的require方法。@babel/register在底层改写了node的require方法，在代码里引入@babel/register模块后，所有通过require引入并且以.es6, .es, .jsx 和 .js为后缀名的模块都会经过babel的转译。
```js
require("@babel/register")({
  // Array of ignore conditions, either a regex or a function. (Optional)
  // File paths that match any condition are not compiled.
  ignore: [
    // When a file path matches this regex then it is **not** compiled
    /regex/,

    // The file's path is also passed to any ignore functions. It will
    // **not** be compiled if `true` is returned.
    function(filepath) {
      return filepath !== "/path/to/es6-file.js";
    },
  ],

  // Array of accept conditions, either a regex or a function. (Optional)
  // File paths that match all conditions are compiled.
  only: [
    // File paths that **don't** match this regex are not compiled
    /my_es6_folder/,

    // File paths that **do not** return true are not compiled
    function(filepath) {
      return filepath === "/path/to/es6-file.js";
    }
  ],

  // Setting this will remove the currently hooked extensions of `.es6`, `.es`, `.jsx`, `.mjs`
  // and .js so you'll have to add them back if you want them to be used again.
  extensions: [".es6", ".es", ".jsx", ".js", ".mjs"],

  // Setting this to false will disable the cache.
  cache: true,
});
```
注意:@babel/register不支持动态编译本地Node.js ES模块，因为目前还没有稳定的API来拦截ES模块加载。

*@babel/preset-env*
@babel/preset-env是一个智能预设，允许您使用最新的JavaScript，而无需微观管理目标环境需要哪些语法转换(以及可选的浏览器填充)。这既使您的生活更轻松，又使JavaScript包更小!

Browserslist Integration
对于browser- or Electron-based的项目，我们建议使用.browserslistrc文件来指定目标。你可能已经有了这个配置文件，因为它被生态系统中的许多工具所使用，比如autoprefixer、stylelint、eslint-plugin-compat和许多其他工具。

默认情况下，@babel/preset-env将使用browserslist配置源，除非设置了targets或ignoreBrowserslistConfig选项。

例如，只包含浏览器市场份额>0.25%的用户所需的填充和代码转换(忽略没有安全更新的浏览器，如IE 10和BlackBerry):
```js
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "entry"
      }
    ]
  ]
}

// browserslist
> 0.25%
not dead

// package.json
"browserslist": "> 0.25%, not dead"
```

*@babel/preset-flow*
包含插件
- @babel/plugin-transform-flow-strip-types

```js
// In
function foo(one: any, two: number, three?): string {}

// Out
function foo(one, two, three) {}
```
配置项：
all（默认值为 false）

如果文件顶部有@flow pragma，或者在.flowconfig中设置了all选项，那么Flow只会解析特定于Flow的特性。
如果您在Flow配置中使用all选项，请确保将此选项设置为true以获得匹配的行为。
例如，如果没有上述集合中的任何一个，下面的调用表达式带有类型参数:
```js
// In
f<T>(e)

// Out
f < T > e;
```

*@babel/preset-react*
包含插件：
- @babel/plugin-syntax-jsx
- @babel/plugin-transform-react-jsx
- @babel/plugin-transform-react-display-name
使用development选项时:
- @babel/plugin-transform-react-jsx-self
- @babel/plugin-transform-react-jsx-source
在v7中不再启用流语法支持。为此，您需要添加Flow预设。

选项：
pragma(默认值：React.createElement)

pragmaFrag(默认值：React.Fragment)

useBuiltIns(默认值：false)
Will use the native built-in instead of trying to polyfill behavior for any plugins that require one.

development(默认值：false)
用于切换开发的插件，比如： @babel/plugin-transform-react-jsx-self 和 @babel/plugin-transform-react-jsx-source.
这在与env选项配置或js配置文件结合使用时非常有用。

throwIfNamespace(默认值：true)
切换是否在使用XML名称空间标记名时抛出错误。比如：<f:image />
虽然JSX规范允许这样做，但由于React的JSX目前不支持，因此默认情况下是禁用的
```js
// .babelrc.js
module.exports = {
  presets: [
    [
      "@babel/preset-react",
      {
        development: process.env.BABEL_ENV === "development",
      },
    ],
  ],
};
```

*@babel/preset-typescript*
包含插件：
- @babel/plugin-transform-typescript
需要为 @babel/cli 和 @babel/node 处理 .ts 文件指定 --extensions ".ts"

选项：
isTSX（默认值：false）
强制启用jsx解析。否则，尖括号将被视为typescript的遗留类型断言var foo = <string>bar;
同时，isTSX: true 要求 allExtensions: true.

jsxPragma（默认值：React）
替换编译JSX表达式时使用的函数。这样我们就知道导入不是类型导入，不应该被删除。

allExtensions(默认值：false)
指示每个文件应解析为TS或TSX(取决于isTSX选项)。
