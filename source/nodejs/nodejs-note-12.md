---
title: nodejs基础知识(5)
date: 2023-01-03 18:04:15
tags: [node, 命令行选项]
---

node [options] [V8 options] [script.js | -e "script" | -] [--] [arguments]

node debug [script.js | -e "script" | <host>:<port>] …

node --v8-options

执行时不带参数，会启动 [REPL]。

###### 选项
-v, --version
打印 node 的版本号。

-h, --help
打印 node 的命令行选项。 

-e, --eval "script"
把跟随的参数作为 JavaScript 来执行。 在 REPL 中预定义的模块也可以在 script 中使用。
*在windows的cmd中，使用单引号无法将参数作为javascript执行，仅双引号可正常执行，powershell和git bash中可以使用单引号和双引号*

-p, --print "script"
与 -e 相同，但会打印结果。

-c, --check
在不执行的情况下，对脚本进行语法检查。

-i, --interactive
打开 REPL，即使 stdin 看起来不像终端。

-r, --require module
在启动时预加载指定的模块。
遵循 require() 的模块解析规则。 module 可以是一个文件的路径，或一个 node 模块名称。

--inspect[=[host:]port]
在主机端口上激活检查器。默认为127.0.0.1:9229。
V8检查器集成允许Chrome DevTools和IDE等工具调试和配置Node.js实例。 这些工具通过tcp端口附加到Node.js实例，并使用[Chrome Debugging Protocol][]调试协议进行通信

--inspect-brk[=[host:]port]
在主机上激活检查器：端口并在用户脚本开始时中断，默认为127.0.0.1:9229。

--inspect-port=[host:]port
设置激活检查器时要使用的主机：端口。通过发送SIGUSR1信号激活检查器时有用。默认主机为：127.0.0.1。

--no-deprecation
静默废弃的警告。

--trace-deprecation
打印废弃的堆栈跟踪。

--throw-deprecation
抛出废弃的错误。

--pending-deprecation
发出挂起的弃用警告
Note: Pending deprecations are generally identical to a runtime deprecation with the notable exception that they are turned off by default and will not be emitted unless either the --pending-deprecation command line flag, or the NODE_PENDING_DEPRECATION=1 environment variable, is set. Pending deprecations are used to provide a kind of selective "early warning" mechanism that developers may leverage to detect deprecated API usage.
（注意：挂起的弃用通常与运行时弃用相同，但值得注意的是，它们在默认情况下被关闭，除非设置了--Pending弃用命令行标志或NODE_Pending_deprecation=1环境变量，否则不会发出。待定弃用用于提供一种选择性的“预警”机制，开发人员可以利用该机制来检测弃用的API使用情况。）

--no-warnings
静默一切进程警告（包括废弃警告）。

--expose-http2
Enable the experimental 'http2' module.（启用实验“http2”模块。）

