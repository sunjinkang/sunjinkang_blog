---
title: Vite 插件
date: 2023-06-15 21:13:24
tags:
---

#### vite插件

###### 什么是vite插件
vite 其实就是一个由原生 ES Module 驱动的新型 Web 开发前端构建工具。
vite 插件 就可以很好的扩展 vite 自身不能做到的事情，比如一些打包的数据展示，开发中或者打包中的数据处理等等。

###### 插件 API
Vite 插件扩展了设计出色的 Rollup 接口，带有一些 Vite 独有的配置项。因此，你只需要编写一个 Vite 插件，就可以同时为开发环境和生产环境工作。

注意：了解vite插件之前，建议先阅读 Rollup 插件文档。

###### 注意事项
对于 Vite 专属的插件：
- Vite 插件应该有一个带 vite-plugin- 前缀、语义清晰的名称。
- 在 package.json 中包含 vite-plugin 关键字。
- 在插件文档增加一部分关于为什么本插件是一个 Vite 专属插件的详细说明（如，本插件使用了 Vite 特有的插件钩子）。

如果你的插件只适用于特定的框架，它的名字应该遵循以下前缀格式：
- vite-plugin-vue- 前缀作为 Vue 插件
- vite-plugin-react- 前缀作为 React 插件
- vite-plugin-svelte- 前缀作为 Svelte 插件

> 通常的惯例是创建一个 Vite/Rollup 插件作为一个返回实际插件对象的工厂函数。该函数可以接受允许用户自定义插件行为的选项。

###### 通用钩子

以下钩子在构建阶段被调用：
- options(options) ：在服务器启动时被调用：获取、操纵Rollup选项，严格意义上来讲，它执行于属于构建阶段之前；
- buildStart(options)：在每次开始构建时调用；
- resolveId(source, importer, options)：在每个传入模块请求时被调用，创建自定义确认函数，可以用来定位第三方依赖；
- load(id)：在每个传入模块请求时被调用，可以自定义加载器，可用来返回自定义的内容；
- transform(code, id)：在每个传入模块请求时被调用，主要是用来转换单个模块；
- buildEnd(error?: Error)：在构建阶段结束后被调用，此处构建结束只是代表所有模块转义完成；

以下钩子在输出阶段被调用：
- outputOptions(options)：接受输出参数；
- renderStart(outputOptions, inputOptions)：每次 bundle.generate 和 bundle.write 调用时都会被触发；
- augmentChunkHash(chunkInfo)：用来给 chunk 增加 hash；
- renderChunk(code, chunk, options)：转译单个的chunk时触发。rollup 输出每一个chunk文件的时候都会调用；
- generateBundle(options, bundle, isWrite)：在调用 bundle.write 之前立即触发这个 hook；
- writeBundle(options, bundle)：在调用 bundle.write后，所有的chunk都写入文件后，最后会调用一次 writeBundle；
- closeBundle()：在服务器关闭时被调用

> 请注意 moduleParsed 钩子在开发中是 不会 被调用的，因为 Vite 为了性能会避免完整的 AST 解析。
> Output Generation Hooks(除了 closeBundle) 在开发中是 不会 被调用的。你可以认为 Vite 的开发服务器只调用了 rollup.rollup() 而没有调用 bundle.generate()。

###### vite 独有钩子
> 这些钩子会被rollup忽略

- enforce
值可以是pre 或 post ， pre 会较于 post 先执行

- apply
值可以是 build 或 serve 亦可以是一个函数，指明它们仅在 build 或 serve 模式时调用；

- config

在解析 Vite 配置前调用。钩子接收原始用户配置（命令行选项指定的会与配置文件合并）和一个描述配置环境的变量，包含正在使用的 mode 和 command。它可以返回一个将被深度合并到现有配置中的部分配置对象，或者直接改变配置（如果默认的合并不能达到预期的结果）

例子：
```js
const mutateConfigPlugin = () => ({
  name: 'mutate-config',
  config(config, { command }) {
    if (command === 'build') {
      config.root = __dirname
    }
  }
});
```

*用户插件在运行这个钩子之前会被解析，因此在 config 钩子中注入其他插件不会有任何效果。*

- configResolved

在解析 Vite 配置后调用。使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它也很有用。

例子：
```js
const exmaplePlugin = () => {
  let config

  return {
    name: 'read-config',

    configResolved(resolvedConfig) {
      // 存储最终解析的配置
      config = resolvedConfig
    },

    // 在其他钩子中使用存储的配置
    transform(code, id) {
      if (config.command === 'serve') {
        // serve: 由开发服务器调用的插件
      } else {
        // build: 由 Rollup 调用的插件
      }
    }
  }
}
```

- configureServer

是用于配置开发服务器的钩子。最常见的用例是在内部 connect 应用程序中添加自定义中间件:
```js
const myPlugin = () => ({
  name: 'configure-server',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      // 自定义请求处理...
    })
  }
})
```

*注入后置中间件*
configureServer 钩子将在内部中间件被安装前调用，所以自定义的中间件将会默认会比内部中间件早运行。如果你想注入一个在内部中间件 之后 运行的中间件，你可以从 configureServer 返回一个函数，将会在内部中间件安装后被调用：
```js
const myPlugin = () => ({
  name: 'configure-server',
  configureServer(server) {
    // 返回一个在内部中间件安装后
    // 被调用的后置钩子
    return () => {
      server.middlewares.use((req, res, next) => {
        // 自定义请求处理...
      })
    }
  }
})
```

*存储服务器访问*
在某些情况下，其他插件钩子可能需要访问开发服务器实例（例如访问 websocket 服务器、文件系统监视程序或模块图）。这个钩子也可以用来存储服务器实例以供其他钩子访问:
```js
const myPlugin = () => {
  let server
  return {
    name: 'configure-server',
    configureServer(_server) {
      server = _server
    },
    transform(code, id) {
      if (server) {
        // 使用 server...
      }
    }
  }
}
```
*注意 configureServer 在运行生产版本时不会被调用，所以其他钩子需要防范它缺失。*

- transformIndexHtml
转换 index.html 的专用钩子。钩子接收当前的 HTML 字符串和转换上下文。上下文在开发期间暴露ViteDevServer实例，在构建期间暴露 Rollup 输出的包。
这个钩子可以是异步的，并且可以返回以下其中之一:
- 经过转换的 HTML 字符串
- 注入到现有 HTML 中的标签描述符对象数组（{ tag, attrs, children }）。每个标签也可以指定它应该被注入到哪里（默认是在 <head> 之前）
- 一个包含 { html, tags } 的对象

- handleHotUpdate
执行自定义 HMR 更新处理。钩子接收一个带有以下签名的上下文对象：
```js
interface HmrContext {
  file: string
  timestamp: number
  modules: Array<ModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```

- modules 是受更改文件影响的模块数组。它是一个数组，因为单个文件可能映射到多个服务模块（例如 Vue 单文件组件）。
- read 这是一个异步读函数，它返回文件的内容。之所以这样做，是因为在某些系统上，文件更改的回调函数可能会在编辑器完成文件更新之前过快地触发，并 fs.readFile 直接会返回空内容。传入的 read 函数规范了这种行为。

钩子可以选择:
- 过滤和缩小受影响的模块列表，使 HMR 更准确。
- 返回一个空数组，并通过向客户端发送自定义事件来执行完整的自定义 HMR 处理:
```js
handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```
客户端代码应该使用 HMR API 注册相应的处理器（这应该被相同插件的 transform 钩子注入）：
```js
if (import.meta.hot) {
  import.meta.hot.on('special-update', (data) => {
    // 执行自定义更新
  })
}
```

###### 插件顺序
一个 Vite 插件可以额外指定一个 enforce 属性（类似于 webpack 加载器）来调整它的应用顺序。enforce 的值可以是pre 或 post。解析后的插件将按照以下顺序排列：
- Alias
- 带有 enforce: 'pre' 的用户插件
- Vite 核心插件
- 没有 enforce 值的用户插件
- Vite 构建用的插件
- 带有 enforce: 'post' 的用户插件
- Vite 后置构建插件（最小化，manifest，报告）

###### 情景应用
默认情况下插件在开发（serve）和构建（build）模式中都会调用。如果插件只需要在预览或构建期间有条件地应用，请使用 apply 属性指明它们仅在 'build' 或 'serve' 模式时调用：
```js
function myPlugin() {
  return {
    name: 'build-only',
    apply: 'build' // 或 'serve'
  }
}

// 还可以使用函数来进行更精准的控制
apply(config, { command }) {
  // 非 SSR 情况下的 build
  return command === 'build' && !config.build.ssr
}
```

###### Rollup 插件兼容性
有一些rollup插件可以直接作为vite插件使用，但是有些不行，一般来说，需要满足以下条件：
- 没有使用 moduleParsed 钩子。
- 它在打包钩子和输出钩子之间没有很强的耦合。

*如果一个 Rollup 插件只在构建阶段有意义，则在 build.rollupOptions.plugins 下指定即可。*

你也可以用 Vite 独有的属性来扩展现有的 Rollup 插件:
```js
// vite.config.js
import example from 'rollup-plugin-example'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...example(),
      enforce: 'post',
      apply: 'build'
    }
  ]
})
```

查看 [Vite Rollup 插件](https://vite-rollup-plugins.patak.dev/) 获取兼容的官方 Rollup 插件列表及其使用指南。

###### 路径规范化
Vite 对路径进行了规范化处理，在解析路径时使用 POSIX 分隔符（ / ），同时保留了 Windows 中的卷名。而另一方面，Rollup 在默认情况下保持解析的路径不变，因此解析的路径在 Windows 中会使用 win32 分隔符（ \ ）。然而，Rollup 插件会使用 @rollup/pluginutils 内部的 normalizePath 工具函数，它在执行比较之前将分隔符转换为 POSIX。所以意味着当这些插件在 Vite 中使用时，include 和 exclude 两个配置模式，以及与已解析路径比较相似的路径会正常工作。

所以对于 Vite 插件来说，在将路径与已解析的路径进行比较时，首先规范化路径以使用 POSIX 分隔符是很重要的。从 vite 模块中也导出了一个等效的 normalizePath 工具函数。
```js
import { normalizePath } from 'vite'

normalizePath('foo\\bar') // 'foo/bar'
normalizePath('foo/bar') // 'foo/bar'
```

vite kooks的渲染顺序
[hooks](./52-vite-plugin/vite-hooks.jpg)









vite插件顺序？？？？
有些插件钩子在非构建式的开发服务器上下文中没有意义????