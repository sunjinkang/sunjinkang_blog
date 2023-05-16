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