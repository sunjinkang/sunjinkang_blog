---
title: unity手册笔记（1）
date: 2023-12-21 16:58:12
tags: [unity, 操作]
---

#### 安装Unity Editor

1. 使用Hub安装
教程：https://docs.unity.cn/hub/manual/InstallHub.html

2. 使用命令行安装
教程：https://docs.unity.cn/cn/current/Manual/InstallingUnity.html

3. 离线安装
教程：https://docs.unity.cn/cn/current/Manual/DeployingUnityOffline.html

#### Unity界面

###### 场景拾取控件
要切换场景可拾取性，请执行以下操作：
- 单击 Hierarchy 窗口中游戏对象的可拾取性图标，在启用和禁用游戏对象及其子项的拾取之间进行切换。
注意：切换游戏对象及其子项的可拾取性会影响所有子游戏对象（从“目标”游戏对象一直到层级视图的底部）。
- 按住 Alt 并单击 Hierarchy 窗口中游戏对象的可拾取性图标，在仅启用和禁用这个游戏对象的拾取之间进行切换。
注意：切换单个游戏对象的可拾取性不会影响其子项。这些子项会保留以前具有的任何可拾取性状态。

###### 资源工作流程
资源表示 Unity 项目中用来创建游戏或应用的任何项。资源可以代表项目中的视觉或音频元素，例如 3D 模型、纹理、精灵、音效或音乐。资源还可以表示更抽象的项目，例如任何用途的颜色渐变、动画遮罩或任意文本或数字数据。
流程：导入、创建、构建、分发、加载，具体如下：
将资源导入 Unity 编辑器
使用 Unity 编辑器通过这些资源创建内容。
构建您的应用或游戏文件，以及可选的随附内容包
分发构建的文件，以便您的用户可以通过发布者或应用程序商店访问
根据您用户的行为以及您对内容进行分组和捆绑的方式，在运行时根据需要加载进一步更新。

- 工作流程考虑事项
如果您使用大量作为单独包发布的资源，可能会发现将部分资源组分离为单独的项目很有帮助，这样您的团队成员就不需要一次性加载大型项目来使用这些资源包。
- 平台注意事项
用户对平台的期望也是一个重要的考虑因素。例如，在移动平台上，漫长的初始下载和安装过程可能会导致玩家尚未尝试就放弃了您的应用。出于这个原因，移动应用通常在初始构建中只包含最少的资源集，并在用户第一次运行您的应用时从远程服务器下载剩余的资源。

- 常用的资源类型
3D 模型文件
图像文件
音频文件||Text、HTML、XML、JSON

- 内置导入器
unity有自己的内置导入期，具体可查看：[内置导入器](https://docs.unity.cn/cn/current/Manual/BuiltInImporters.html)

- 脚本化导入器 (Scripted Importer)
Scripted Importer 是 Unity Scripting API 的一部分。您可以使用 Scripted Importer 使用 C# 为 Unity 本身不支持的文件格式编写自定义资源导入器，从而添加支持。
*注意：Scripted Importer 无法处理已由 Unity 本身处理的文件扩展名。*
[脚本化导入器](https://docs.unity.cn/cn/current/Manual/ScriptedImporters.html)

- 导入器一致性
资源导入器，包括您编写的任何脚本化导入器，应产生一致（确定性）的结果。这意味着它们应始终从相同的输入和依赖集产生相同的输出。
检查一致性的两种方法是：
在编辑器中手动重新导入一项或多项资源
使用 -consistencyCheck 命令行参数打开编辑器。

- Text assets
__文本资源__是导入的文本文件的格式。将文本文件拖放到 Project 文件夹中时，它将转换为文本资源。支持的文本格式如下：
.txt
.html
.htm
.xml
.bytes
.json
.csv
.yaml
.fnt

注意：
文本资源与所有其他资源一样会在构建中经过序列化。发布游戏时并不包含物理文本文件。
文本资源不适用于在运行时生成文本文件。(https://docs.unity.cn/cn/current/Manual/class-TextAsset.html)

- 资源元数据
Unity 为资源分配唯一 ID。（ID 通常在编辑器中不可见）
Unity 创建一个伴随资源文件的 .meta 文件。
Unity 对资源进行处理。

Unity 针对空文件夹采用以下特定方式：
如果 Unity 检测到一个空文件夹不再含有相应的元文件，如果该文件夹以前有元文件，Unity 会假设元文件被另一个用户通过在 VCS 中删除该文件夹时删除，并在本地删除该空文件夹。
如果 Unity 检测到文件夹有一个新的元文件，但该文件夹在本地不存在，则 Unity 会假设新元文件是被另一个用户通过在 VCS 中添加文件夹而创建，并在本地创建相应的空文件夹。

- 资源数据库
对于大多数类型的资源，Unity 需要将资源的源文件中的数据转换为可用于游戏或实时应用程序的格式。这些转换后的文件及其关联的数据会存储在资源数据库 (Asset Database) 中。

*资源导入依赖项*
资源数据库可以跟踪每个资源的所有依赖项，并保留导入版本的所有资源的缓存。
资源的导入依赖项包括可能影响所导入数据的全部数据。例如，一个资源的源文件是一个依赖项以及资源的导入设置（例如纹理的压缩类型）或项目的目标平台（例如，PS4 硬件要求的数据格式与 Android 硬件不同）。如果修改其中任意一个依赖项，则缓存版本的已导入资源都将变为无效状态，并且 Unity 必须将其重新导入才能反映所做的更改。

*资源缓存*
资源缓存是 Unity 存储导入版本的资源的位置。默认情况下，Unity 使用本地缓存，这意味着导入版本的资源将缓存在本地计算机上项目文件夹的 Library 文件夹中。应该使用 ignore file 从版本控制中排除此文件夹。类似Git。
团队成员并且使用版本控制系统，最好使用 [Unity Accelerator](https://docs.unity.cn/cn/current/Manual/UnityAccelerator.html)，它可以跨 LAN 共享资源缓存。

*源资源和 Artifact*
Unity 在 Library 文件夹中保留两个数据库文件，它们统称为资源数据库。这两个数据库可以跟踪有关源资源文件和 Artifact（这是有关导入结果的信息）的信息。
数据库文件位于项目的 Library 文件夹中，因此应从版本控制系统中将这些文件排除。可以在以下位置找到它们：
(1).源资源数据库：Library\SourceAssetDB
(2).Artifact 数据库：Library\ArtifactDB

- 特殊文件夹名称
Assets: Assets 文件夹是包含 Unity 项目使用的资源的主文件夹。
Editor: Editor脚本在开发过程中为Unity添加功能，Editor文件夹中的脚本作为Editor脚本运行，而不是运行时脚本。
Editor Default Resources：Editor 脚本可以使用通过 EditorGUIUtility.Load 函数按需加载的资源文件。此函数在名为 Editor Default Resources 的文件夹中查找资源文件。
Gizmos：Gizmos 允许将图形添加到 Scene 视图，以帮助可视化不可见的设计细节。Gizmos.DrawIcon 函数在场景中放置一个图标，作为特殊对象或位置的标记。必须将用于绘制此图标的图像文件放在名为 Gizmos 的文件夹中，这样才能被 DrawIcon 函数找到。
Resources：可从脚本中按需加载资源，而不必在场景中创建资源实例以用于游戏。为此，应将资源放在一个名为 Resources 的文件夹中。通过使用 Resources.Load 函数即可加载这些资源。
Standard Assets
StreamingAssets：流媒体文件
Android Asset Packs：以.androidpack结尾的文件夹
Android 库项目：以.androidlib结尾的文件夹

隐藏的资源
在导入过程中，Unity 忽略 Assets 文件夹（或其子文件夹）中的以下文件和文件夹：
隐藏的文件夹。
以“.”开头的文件和文件夹。
以“~”结尾的文件和文件夹。
名为 cvs 的文件和文件夹。
扩展名为 .tmp 的文件。



















文本资源不适用于在运行时生成文本文件？？？？
VCS: version control system (版本控制系统)
unity的开发保存在哪里？本地？线上？
不可序列化变量??? (https://docs.unity.cn/cn/current/Manual/AssetDatabaseRefreshing.html)