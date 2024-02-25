---
title: unity手册笔记（6）
date: 2023-01-29 20:48:20
tags: [unity, 开源代码仓库, Unity Asset Store, 平台开发]
---

#### Unity 代码仓库
建议参与 Unity 开源项目时使用 Bitbucket，这是unity内部使用的工具，能让工作变得简单。Unity 有许多开源代码仓库可帮助开发人员使用 Unity 软件：
http://bitbucket.org/Unity-Technologies/

unity 最新的代码仓库，主要由 Unity UI 团队和研发内容团队使用。一些核心研发项目最终会进驻到这里（主要是由于开发人员的偏好），例如 5.3 版内存性能分析器。
https://github.com/Unity-Technologies

unity 最早的代码仓库，一些核心研发项目的开源工作保存在这里。主要项目包括 Unity 的 Mono 分叉（C# 运行时）和 Katana 分叉（构建/CI 系统）。用于 WebGL 的大部分技术（例如 Emscripten）也在这里托管。
https://github.com/unity3d-jp

此代码仓库由 Unity 日本研发团队和传播团队使用。此代码仓库包含该办事处员工的演示项目、原型和编外项目。有趣的项目包括即将推出的用于构建 AssetBundle 的 Asset Graph 系统、一个演示如何在 Unity 中有效使用线程的演示项目，以及一个演示如何使用 Unity Ads 的示例项目。

#### 如何参与 Unity 的开源项目
Unity 使用分布式版本控制来控制开源组件的版本。可通过以下步骤参与Unity的开源项目。
步骤 1：获取 Bitbucket 帐户
步骤 2：将您想要参与的代码仓库进行分叉
步骤 3：克隆您的分叉
步骤 4：对分叉应用修改
步骤 5：在 Bitbucket 上提出拉取请求
步骤 6：等待反馈

以上具体步骤信息可查看官网文档：https://docs.unity.cn/cn/current/Manual/ContributingBitbucket.html

#### Unity Asset Store

Unity资产商店包含Unity Technologies和社区成员创建的免费和商业资产库。提供了多种资源，包括纹理、模型、动画、整个项目示例、教程和编辑器扩展。

从Unity 2020.1开始，专用的资产存储窗口不再位于Unity编辑器中。但是，您仍然可以访问资产商店网站https://assetstore.unity.com/ 您仍然可以搜索您购买和下载的资产商店软件包，并直接在软件包管理器窗口中导入和下载它们。

- Asset Store 资源包
在 Unity Package Manager 中，选择 My Assets 筛选条件以查看您可用 Asset Store 资源包的列表。可按名称搜索 Asset Store 资源包。找到要使用的 Asset Store 资源包后，可将资源包下载并导入到 Package Manager 中。如果 Asset Store 资源包具有可用的较新版本，也可以直接在 Package Manager 窗口中对其进行更新。

Unity 用户可以成为 Asset Store 上的发布者，并出售自己创建的内容。按照发布到 Asset Store 中的说明进行操作，创建资源包草案并从 Unity 上传您的资源，将其发布到 Unity Asset Store。


下载的资源文件的位置
您可以使用“软件包管理器”窗口来管理项目中的资产存储软件包。但是，如果需要直接访问资产文件，可以在资产存储包缓存中找到这些文件。该缓存与全局缓存分离，使包的重用和共享更加高效。您可以在以下路径中找到资产存储包缓存（根据您的计算机设置，这些路径可能位于隐藏文件夹中）:
>macOS: ~/Library/Unity/Asset Store-5.x
>Windows: C:\Users\accountName\AppData\Roaming\Unity\Asset Store-5.x
>Linux: ~/.local/share/unity3d/Asset Store-5.x

- 发布到 Asset Store

将资源发布到 Asset Store 的基本工作流程如下：
> 创建发布者帐户。
> 创建新的资源包草案。还可以随时删除草案，然后新建草案。
> 将资源上传到资源包。
> 填写资源包详情。
> 提交资源包以供批准。
> 查看您的资源的 Asset Store 提交状态。
> 在等待 Unity 是否已接受将资源包发布到 Asset Store 的通知时，可以设置付款资料，以便可以获取资源包带来的收入。如果尚未如此操作，还可以为您的发布者帐户设置客户支持信息。

将资源包发布到 Asset Store 后，可以执行以下操作来提高资源包被发现的可能性并鼓励客户购买您的资源包：
>向资源包添加标签，便于客户找到资源包。
>将帐户关联到 Google Analytics 以跟踪您在 Asset Store 上的资源包页面的网站流量。
>Unity 可能会为您提供机会将资源包加入到 Asset Store 促销中。您可以参与 Unity 的促销或者创建自己的促销。
>授权 Unity 就您的资源包向您的客户退款。
>如果要更新或增强现有资源包，可以创建主要升级版本。将升级发布到 Asset Store 后，可以弃用旧资源包，以便新用户只能找到最新版本。还可以创建一个“精简”升级版本，该版本可用于让客户试用资源包，而无需付全款。

在 Publisher Account 页面上的选项卡中可以执行以下操作：
> 阅读关于资源包的评论 (Reviews)。
> 检查销量 (Sales) 和收入 (Revenue)。
> 查看资源包的下载量 (Downloads) 以及您发放给客户的任何兑换券 (Vouchers) 的相关统计信息。
> 管理您团队中的用户 (Users)。
> 管理您的帐户信息 (Info)。
> 如需上述任何过程的其他帮助信息，请参阅在线的 Asset Store 常见问题解答和 Asset Store 论坛。资源已被 Asset Store 接受的发布者还可以申请加入发布者论坛。

#### 平台开发
在开始使用Unity Editor之前，您可能需要熟悉可以在其中创建项目的平台。Unity支持大多数领先的桌面、web和移动平台，如下所示：
独立平台：macOS、Windows和Linux
tvOS
IOS
Android
WebGL
注意：如果您是一名可以访问Closed平台的开发人员，在下载和注册首选平台设置时，您可能会看到更多平台选项。

具体平台可查看官方文档：https://docs.unity.cn/cn/current/Manual/PlatformSpecific.html，开发人员可根据自身开发需要选择平台，修改配置进行开发。

