---
title: nodejs基础知识(3)
date: 2022-12-28 17:12:45
tags: [node, C++ 插件]
---

Node.js 插件是用 C++ 编写的动态链接共享对象，可以使用 require() 函数加载到 Node.js 中，且像普通的 Node.js 模块一样被使用。 它们主要用于为运行在 Node.js 中的 JavaScript 与 C/C++ 库之间提供接口。

目前用于实现插件的方法相当复杂，涉及多个组件和 API 的知识：
- V8：Node.js 目前用于提供 JavaScript 实现的 C++ 库。 V8 提供了用于创建对象、调用函数等的机制。 V8 的 API 文档主要在 v8.h 头文件中（Node.js 源代码中的 deps/v8/include/v8.h），也可以在查看 [V8 在线文档](https://v8docs.nodesource.com/)。
- [libuv](https://github.com/libuv/libuv)：实现了 Node.js 的事件循环、工作线程、以及平台所有的的异步操作的 C 库。 它也是一个跨平台的抽象库，使所有主流操作系统中可以像 POSIX 一样访问常用的系统任务，比如与文件系统、socket、定时器、以及系统事件的交互。 libuv 还提供了一个类似 POSIX 多线程的线程抽象，可被用于强化更复杂的需要超越标准事件循环的异步插件。 建议插件开发者多思考如何通过在 libuv 的非阻塞系统操作、工作线程、或自定义的 libuv 线程中降低工作负载来避免在 I/O 或其他时间密集型任务中阻塞事件循环。
- 内置的 Node.js 库。Node.js 自身开放了一些插件可以使用的 C++ API。 其中最重要的是 node::ObjectWrap 类。
- Node.js 包含一些其他的静态链接库，如 OpenSSL。 这些库位于 Node.js 源代码中的 deps/ 目录。 只有 V8 和 OpenSSL 符号是被 Node.js 开放的，并且通过插件被用于不同的场景。

1. 创建 hello.cc 文件
```
// hello.cc
#include <node.h>

namespace demo {

using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

void Method(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, "world"));
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "hello", Method);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace demo
```
注意，所有的 Node.js 插件必须导出一个如下模式的初始化函数：
```
void Initialize(Local<Object> exports);
NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
```
NODE_MODULE 后面没有分号，因为它不是一个函数（详见 node.h）。

module_name 必须匹配最终的二进制文件名（不包括 .node 后缀）。

在 hello.cc 示例中，初始化函数是 init，插件模块名是 addon。

**构建**

当源代码已被编写，它必须被编译成二进制 addon.node 文件。 要做到这点，需在项目的顶层创建一个名为 binding.gyp 的文件，它使用一个类似 JSON 的格式来描述模块的构建配置。 该文件会被 node-gyp（一个用于编译 Node.js 插件的工具）使用。
```
{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "hello.cc" ]
    }
  ]
}
```

当使用 npm install 安装一个 Node.js 插件时，npm 会使用自身捆绑的 node-gyp 版本来执行同样的一套动作，为用户要求的平台生成一个插件编译后的版本。

当构建完成时，二进制插件就可以在 Node.js 中被使用，通过 require() 构建后的 addon.node 模块
```
// hello.js
const addon = require('./build/Release/addon');

console.log(addon.hello());
// 打印: 'world'
```

*因为编译后的二进制插件的确切路径取决于它如何被编译（比如有时它可能在 ./build/Debug/ 中），所以插件可以使用 bindings 包加载编译后的模块。*

注意，虽然 bindings 包在如何定位插件模块的实现上更复杂，但它本质上使用了一个 try-catch 模式
```
try {
  return require('./build/Release/addon.node');
} catch (err) {
  return require('./build/Debug/addon.node');
}
```

**链接到 Node.js 自有的依赖**
Node.js 使用了一些静态链接库，所有的插件都需要链接到 V8，也可能链接到任何其他依赖。 通常情况下，只要简单地包含相应的 #include <...> 声明（如 #include <v8.h>），则 node-gyp 会自动定位到相应的头文件。 但是也有一些注意事项需要注意：
- 当 node-gyp 运行时，它会检测指定的 Node.js 发行版本，并下载完整的源代码包或只是头文件。 如果下载了完整的源代码，则插件对全套的 Node.js 依赖有完全的访问权限。 如果只下载了 Node.js 的文件头，则只有 Node.js 导出的符号可用。

- node-gyp 可使用指向一个本地 Node.js 源代码镜像的 --nodedir 标志来运行。 如果使用该选项，则插件有全套依赖的访问权限。

**使用 require() 加载插件**
编译后的二进制插件的文件扩展名是 .node（而不是 .dll 或 .so）。 require() 函数用于查找具有 .node 文件扩展名的文件，并初始化为动态链接库。

当调用 require() 时，.node 拓展名通常可被省略，Node.js 仍会找到并初始化该插件。 注意，Node.js 会优先尝试查找并加载同名的模块或 JavaScript 文件。 例如，如果与二进制的 addon.node 同一目录下有一个 addon.js 文件，则 require('addon') 会优先加载 addon.js 文件。