---
title: console调试技巧
date: 2025-04-27 11:09:18
tags:
---

![console-api](console_api.png)

#### console.log
- 最基本最常用，可以用在javascript代码的任何地方，在浏览器的控制台查看打印信息
- console.log支持占位符形式的语法，在复杂输出时，保证模板和数据分离
  - | 字符串 | %s |
    | 整数	| %d或%i |
    | 浮点数	| %f |
    | 对象 |	%o或%O |
    | CSS样式 |	%c |
  - 打印样式可以用于显示图片，通过background-image方式引入
  - console.log还可以用于打印字符画,eg：https://www.zhihu.com/signin?next=%2F，可以使用字符画在线生成工具，将生成的字符粘贴到console.log()即可。在线工具：mg2txt （http://www.degraeve.com/img2txt.php）
  - console.log打印对象时，若为普通object对象，%o与%O无区别。如果为DOM节点，使用 %o 打印的是DOM节点的内容，包含其子节点。而%O打印的是该DOM节点的对象属性
  - ![console-log](consolelog.png)

#### console.warn
- 用于在控制台输出警告信息。它的用法和console.log是完全一样的，只是显示的样式不太一样，信息最前面加一个黄色三角，表示警告
- ![console-warn](consolewarn.png)

#### console.error
- 用于在控制台输出错误信息,它的用法和console.log/console.warn是一样的，只是显示的样式不一样
- ![console-error](consoleerror.png)
- console.exception() 是 console.error() 的别名，功能相同。console.exception在大部分浏览器中不支持，目前Firefox支持
- console.error和console.warn还可以用于打印函数调用栈，console对象还提供了专门的方法来打印函数的调用栈（console.trace()）

#### console.info & console.debug
- console.info用来打印资讯类说明信息，和console.log()的用法一致
- console.debug用于打印调试信息

#### console.time和console.timeEnd
- 可以用于获取一段代码的执行时间
- 传递一个字符串参数，用于标记唯一的计时器，如果页面只有一个计时器，可不传。
- 没有timeEnd，计时器会一直存在

#### console.timeLog
- 与console.timeEnd类似，需要使用console.time启动计时器，传递一个字符串参数
- 不同点：console.timeLog打印计时器的当前时间，不清除计时器；console.timeEnd打印计时器当前时间，同时清除计时器

#### console.group & console.groupEnd
- 打印分组信息，以console.group开始，console.groupEnd结束

#### console.groupCollapsed
- 类似console.group，同样以console.groupEnd结束
- 默认打印的信息是折叠的

#### console.count
- 获取当前代码执行的次数
- 传递一个参数标记次数，非必传，默认为default

#### console.countReset
- 重置计数器，配合console.count使用，传递一个可选参数，参数与count的参数对应，若省略该参数，将重置默认default计数器为0

#### console.table
- 将数组数据以表格形式进行展示
- 传递两个参数，第一个为打印的对象，第二个为需要打印的表格标题，注意该方法本身第一列会打印序号
- ![console-table](consoletable.png)
- 注意：console.table只能处理最多1000行

#### console.clear
- 清除控制台信息

#### console.assert
- 用于语句断言，当断言为 false时，则在控制台输出错误信息
- 传递两个参数：第一个为条件语句，结果为Boolean值，为false时触发错误信息；第二个参数为触发的错误信息，为任意类型

#### console.trace
- 打印当前执行代码在堆栈中的调用路径

#### console.dir
- 以类似文件树的形式显示指定JavaScript对象的属性
- 传递一个对象参数，打印该对象的所有属性和属性值，不传时无打印值
- 大多数情况下与console.log的打印结果一样，打印元素结构时差异较大，console.log打印的是元素的DOM结构，console.dir打印元素属性
- ![console-dir](consoledir.png)

#### console.dirxml
- 用于显示一个明确的XML/HTML元素的包括所有后代元素的交互树
- 如果无法作为一个element被显示，那么会以JavaScript对象的形式作为替代
- 对于XML和HTML元素调用console.log()和console.dirxml()是等价的
- ![console-dirxml](consoledirxml.png)

#### console.memory
- console对象的一个属性，用来查看当前内存的使用情况
- jsHeapSizeLimit：JS堆栈内存大小限制
- totalJSHeapSize：可使用的内存
- usedJSHeapSize：JS对象（包括V8引擎内部对象）占用的内存，不得大于totalJSHeapSize，若大于，则可能内存泄漏
  
#### console.timeStamp&console.profile&console.profileEnd
- 非标准特性，尽量不要在生产环境使用
- console.timeStamp：向浏览器的 [Performance](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/reference) 或者 [Waterfall](https://profiler.firefox.com/docs/#/) 工具添加一个标记。这样可以将代码中的一个点和其他在时间轴上已记录的事件相关联，例如布局事件和绘制事件等
- console.profile&console.profileEnd：开始记录性能描述信息，传递一个参数，用于记录对应的描述信息，并通过profileEnd清除对应信息