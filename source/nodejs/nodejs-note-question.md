---
title: nodejs问题整理
date: 2023-02-22 18:11:10
tags: []
---

- 使用module.createRequire创建的require和直接使用require有什么区别？？？
*问题来源：nodejs module模块*
使用createRequire创建的require独立于直接使用的require，可以读取新文件，直接使用的require是从cache缓存中读取文件，不能及时读取到刚更新后的文件

- Node.js 不能保证拷贝操作的原子性，是什么意思？
*问题来源：fs.copyFile*
原子性在这里的意思是指要么复制之前报错，要么全部复制，不会复制一半。nodejs会尝试保证拷贝操作的原子性，但是可能由于缺少权限等原因导致无法保证。
比如：执行复制操作，打开文件出错，nodejs会尝试删除它，但是没有权限，删除失败。

- beforeunload监听页面是否存在操作，存在操作时提示，需要鼠标点击页面事件才生效
**一定要是手动操作、模拟执行的都不能使事件生效**

Nagle 算法与ack机制

为什么有的方法在文档中废弃了还有人用？

怎么区分是否是注释中的中文？

获取中文所在的行，通过抽象语法树ast，有其他方法吗？
readline

ELU 类似于 CPU 使用率，不同之处在于它只测量事件循环统计信息而不是 CPU 使用率。 它表示事件循环在事件循环的事件提供者（例如 epoll_wait）之外花费的时间百分比。 不考虑其他 CPU 空闲时间。
ELU和CPU使用率不是同一概念，ELU高可能CPU使用率低

performance高解析度毫秒时间戳是什么意思？
更精确细分的时间

当执行观察时，应使用 performance.clearResourceTimings 手动从全局的性能时间轴中清除条目
之前的标记可能影响观察，先清除一下？？

performanceEntry.duration值对所有性能条目类型都没有意义。

句柄是什么意思？通过向 'warning' 事件添加句柄来监听
句柄：事件处理？？

IPC 通道衍生 Node.js 进程
nodejs中process.getegid 和process.getgid区别

滴答队列和微任务队列

事件句柄
就是时间发生时进行的操作，在javascript中，onclick,onload等这些就是事件句柄

方法setPromat(promat) ，就是给每一行设置一个提示符，就好比window命令行的> ，这里设置的是Test>。
prompt()是最重要的方法，因为它体现了readline的核心作用，以行为单位读取数据，prompt方法就是在等待用户输入数据。
在‘line’事件中的r1.prompt()：监听了’line’ 事件，因为prompt方法调用一次就只会读取一次数据，所以，在这个方法又调用了一次prompt方法，这样就可以继续读取用户输入，从而达到一种命令行的效果。


什么是分布式？
拒绝服务攻击（DoS）

Node.js 和底层 V8 引擎使用 Unicode 国际组件（ICU）