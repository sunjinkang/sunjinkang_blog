---
title: unity手册笔记（2）
date: 2023-12-29 20:18:53
tags: [unity, 输入, 2D]
---

#### 输入
输入允许用户使用设备、触摸或手势来控制您的应用程序。您可以对应用程序内的元素（例如图形用户界面 (GUI) 或用户头像）进行编程，以不同方式响应用户输入。

Unity 支持来自多种输入设备的输入，包括：
- 键盘和鼠标
- 游戏杆
- 控制器
- 触摸屏
- 加速度计或陀螺仪等移动设备的运动感应功能
- VR 和 AR 控制器
- Unity 通过两个独立的系统提供输入支持：
>> 输入管理器 (Input Manager) 是 Unity 核心平台的一部分，默认情况下可用。
>> 输入系统 (Input System) 是一个包，必须先通过 Package Manager 进行安装后才能使用。它需要 .NET 4 运行时，并且不能在使用旧版 .NET 3.5 运行时的项目中使用。

*Input Manager 使用以下类型的控件：*

- 键指物理键盘上的任何键，例如 W、Shift 键或空格键。
- Button refers to any button on a physical controller (for example, gamepads), such as the X button on a remote control.
- 虚拟轴被映射到控件（例如按钮或键）。用户激活控件后，该轴会收到 [–1..1] 范围中的某个值。您可以将该值用于您的脚本。


*移动设备输入*

在移动设备上，Input 类提供对触摸屏、加速度计和地理/位置输入的访问。
通过 iOS 键盘可以访问移动设备上的键盘。
多点触控屏幕
iPhone、iPad 和 iPod Touch 设备最多可跟踪五根手指同时触摸屏幕。可通过访问 Input.touches 属性数组来获取在最后一帧期间触摸屏幕的每根手指的状态。
Android 设备对其跟踪的手指数量没有统一限制。相反，此限制因设备而异，可能是旧设备上的双手指触摸到某些新设备上的五指触摸。

移动键盘
在大多数情况下，Unity 将自动处理 GUI 元素的键盘输入，但也很容易通过脚本按需显示键盘。
GUI 元素
当用户点击可编辑的 GUI 元素时，键盘将自动显示。目前，GUI.TextField、GUI.TextArea 和 GUI.PasswordField 将显示键盘；有关更多详细信息，请参阅 GUI 类文档。
手动键盘处理
使用 TouchScreenKeyboard.Open() 函数打开键盘。有关此函数所用的参数，请参阅 TouchScreenKeyboard 脚本参考。

文本预览
默认情况下将创建一个编辑框，并在出现后放置在键盘顶部。此编辑框用于预览用户正在键入的文本，因此文本始终对用户可见。但是，可通过将 TouchScreenKeyboard.hideInput 设置为 true 来禁用文本预览。请注意，此设置仅适用于某些键盘类型和输入模式。例如，不适用于电话键盘和多行文本输入。在此类情况下将始终显示编辑框。TouchScreenKeyboard.hideInput 是一个全局变量，会影响所有键盘。

安全文本输入
可配置键盘以使其在输入时隐藏符号。当用户需要输入敏感信息（例如密码）时，此功能非常有用。要在启用安全文本输入的情况下手动打开键盘，请使用以下代码：
> TouchScreenKeyboard.Open("", TouchScreenKeyboardType.Default, false, false, true);

警报键盘
要显示带有黑色半透明背景而不是经典不透明背景的键盘，请调用 TouchScreenKeyboard.Open()，如下所示：
> TouchScreenKeyboard.Open("", TouchScreenKeyboardType.Default, false, false, true, true);

#### 2D

Gameplay in 2D
虽然 Unity 以 3D 功能而闻名，但也可用于创建 2D 游戏。熟悉的 Editor 功能仍然可用，但还添加了有助于简化 2D 开发的功能。

最明显的功能是 Scene 视图工具栏中的 2D 视图模式按钮。启用 2D 模式时将会设置正交（即无透视）视图：摄像机沿 Z 轴观察，而 Y 轴向上增加。因此可以轻松可视化场景并放置 2D 对象。

*2D 图形*
2D 图形对象称为__精灵__。精灵本质上只是标准纹理，但可通过一些特殊技巧在开发过程中组合和管理精灵纹理以提高效率和方便性。Unity 提供内置的 Sprite Editor，允许从更大图像提取精灵图形。因此可以在图像编辑器中编辑单个纹理内的多个组件图像。例如，可以使用此工具将角色的手臂、腿和身体保持为一个图像中的单独元素。

*2D 物理*
Unity 有一个独立物理引擎来处理 2D 物理，以便利用仅适用于 2D 的优化。2D 物理组件对应于标准 3D 物理组件（例如刚体 (Rigidbody)、盒型碰撞体 (Box Collider) 和铰链关节 (Hinge Joint)，但名称中附加了“2D”字样。因此，精灵可以配备 2D 刚体 (Rigidbody 2D)、2D 盒型碰撞体 (Box Collider 2D) 和 2D 铰链关节 (Hinge Joint 2D)。大多数 2D 物理组件都是 3D 对等组件的简单“平坦”版本（例如，_2D 盒型碰撞体_是正方形，而_盒型碰撞体_是立方体），但是也有一些例外。

- 2D 排序
透明队列按优先级排序
透明队列中的 2D 渲染器通常遵循以下优先级顺序：
- 排序图层和图层中的顺序
- 指定渲染队列
- 与摄像机的距离
- 透视/正交
- 自定义轴排序模式
- 精灵排序点
- 排序组
- 材质/着色器
- 多个渲染器具有相同的排序优先级时，将由仲裁程序决定优先级。
