---
title: 如何有效利用浏览器的Devtools？
date: 2024-11-15 06:48:08
tags:
---

#### 前言

相信大家应该都很熟悉 Chrome DevTools了，我们平时在开发中经常会用Devtools提供的丰富的功能和工具，帮助我们诊断和调试网页应用程序。本文将分享一些 Chrome DevTools 的调试技巧，在开发中提高效率。


#### 模拟接口响应和网页内容

通过本地覆盖可以模拟接口返回值和响应头，无需 mock 数据工具，无需等待后端支持，快速复现在一些数据下的 BUG 等。在 DevTools 可以直接修改你想要的 Fetch/XHR 接口数据，还可以修改响应头，解决跨域等问题，不仅可以覆盖 Fetch/XHR，JS、CSS 等资源也可以。

下面是在 Network 面板快速模拟远程资源的内容和响应头的步骤：
![override0](override0.png)
![override1](override1.png)
![override2](override2.png)
![override3](override3.png)

*设置本地覆盖步骤：*
- 打开 DevTools，导航至 Network 网络面板，右键单击要覆盖的请求，从下拉菜单中选择 Override content 或 Open in Sources panel。
- 如果是首次使用，未设置过本地覆盖文件目录，DevTools 会在顶部的操作栏中提示您选择一个文件夹来存储覆盖文件，并 “允许” 授予 DevTools 对其的访问权限（在 window 下选择了系统盘的文件夹测试发现用不了，可能是权限问题，建议选个非系统盘的文件夹）。
- 在 Sources 面板中修改数据，完成后按 Ctrl + S 保存，刷新页面，即可看见修改后的数据（被覆盖的资源在图标右下角会有个紫色的圆点）。
- 若要恢复使用服务上的数据，请导航到 Sources > Overrides，可以点击取消 “Enable local overrides” 复选框，或者点击旁边的 Clear 图标，或者如上图演示中的单个删除。
**注意：在Source面板中修改的数据一定要保存**

*它是怎么工作的？*
当你在 DevTools 中进行更改时，DevTools 会将修改后的文件的副本保存到您指定的文件夹中。
当你重新加载页面时，DevTools 会提供本地修改后的文件，而不是网络资源。所以在旧版本支持 Override 的版本中，也可以手动创建一个文件来覆盖内容。


#### 快速重发请求
在联调接口或者排查 BUG 的时候，经常需要重新再发一次请求，如果要重新操作一次复杂的交互、重新输入一大堆参数时，这种方式会显得比较麻烦。
这时候就可以通过 Replay XHR 来快速重发请求

![replay](replay.png)

*操作步骤：*
- 导航至 Network 网络面板，右击一个 XHR 请求，可以点击 Fetch/XHR 过滤。
- 点击 Replay XHR。


#### 在 Console 中发请求
针对上面同样的场景，有时候我们需要修改请求头、入参再重新发起请求，那么 Replay XHR 就不支持了。
可以通过 Copy as fetch ，在控制台修改请求参数，发起请求

![copy1](copy1.png)
![copy2](copy2.png)

*操作步骤：*
- 导航至 Network 网络面板，右击一个 XHR 请求，可以点击 Fetch/XHR 过滤。
- 点击 Copy -> Copy as fetch。
- 导航至 Console 面板，Ctrl + v 粘贴。
- 修改内容，如接口 url、header、body， 然后按回车键即可发起请求。



#### Console 中的 $符号
*$0-$4*
当要在 Console 中在调试页面元素时，比如要获取元素的信息，此时就可以使用 4。
$0：当前选择的元素 ，**$1：上一次的引用，$2：**上上次的引用，一直到 $4

![dollar1](dollar1.png)

*操作步骤：*
- 点击菜单栏第一个选择图标，或者使用快捷键 Ctrl + Shift + C 选择元素。
- 导航至 Console 面板，现在就可以使用 4，例如选择了两次，第一次选择的元素可以使用 1 访问，第二次选择的元素使用 0 访问。

*$ 和 $$*
```js
$(‘xxx’) 相当于 document.querySelector(‘xxx’)  
$$(‘xxx’) 相当于 Array.form(document.querySelectorall(‘xxx’))
```

![dollar2](dollar2.png)

*$_*
调试的过程中，经常需要打印一些变量值，但是如果想查看上一次执行的结果，使用 $_ 是对上次执行结果的引用。

![dollar3](dollar3.png)


#### Element 面板
*隐藏 DOM Element*
有时候我们想截图，但是想要隐藏图中的敏感信息，此时就可以隐藏元素或者直接删除对应的元素
*一键展开所有 DOM*
在调式 DOM Element 的时候，如果 DOM 层次比较深的情况下，一个个去展开就比较麻烦，我们可以使用快捷键 Alt + Click 一键展开该层下的所有 DOM

*拖拽移动 DOM Element*
当我们想看页面某一部分元素在不同的位置显示效果的时候，可以直接拖拽 DOM 元素调整位置，也可以使用键盘快捷键 Ctrl + 上下箭头。


#### 截图

如果想要截取多屏很长的整个页面内容，系统自带的截图软件显然不支持，此时可以使用 command 命令截图

![screenshot](screenshot.png)

*操作步骤：*
- 按 Ctrl + Shift + P 调出 command 命令
- 输入命令 capture full size screenshot 后回车。

*截图 command：*
- 截框选区域：capture area screenshot
- 截滚动全屏：capture full size screenshot
- 截选中的节点：capture node screenshot
- 截当前窗口内：capture screenshot
还有很多其他的命令，如切换主题 Switch to Dark theme，查看所有快捷键 Show shortcuts 等等。


#### 总结
本文介绍了 Chrome DevTools 的调试技巧和最新版本 Chrome 117 中的新功能，包括模拟接口响应和网页内容、快速重发请求、在 Console 中发请求、Console 中的快捷命令、条件断点、Element 面板以及截图命令，这些调试技巧有助于我们在开发中提高效率。

