---
title: JavaScript设计模式读书笔记(6)
date: 2022-09-20 15:22:12
tags:
---

#### 架构型设计模式
架构型设计模式是一类框架结构,通过提供一些子系统，指定他们的职责,并将它们条理清晰地组织在一起。

###### 同步模块模式
模块化:将复杂的系统分解成高内聚、低耦合的模块，使系统开发变得可控、可维护、可拓展，提高模块的复用率。
同步模块模式——SMD (Synchronous Module Definition):请求发出后，无论模块是否存在，立即执行后续的逻辑，实现模块开发中对模块的立即引用。
<!-- more -->
(1)实现模块化开发，首先要有一个模块管理器，它管理着模块的创建与调度。对于模块的调用分为两类，第一类同步模块调度的实现比较简单，不需要考虑模块间的异步加载。第二类异步模块调度的实现就比较繁琐。它可实现对模块的加载调度。

![module-model-1](module-model-1.png)
![module-model-2](module-model-2.png)
![module-model-3](module-model-3.png)
![module-model-4](module-model-4.png)
![module-model-5](module-model-5.png)

###### 异步模块模式
异步模块模式——AMD (Asynchronous Module Definition):请求发出后，继续其他业务逻辑，知道模块加载完成执行后续的逻辑，实现模块开发中对模块加载完成后的引用。

![async-module-model-1](async-module-model-1.png)
![async-module-model-2](async-module-model-2.png)
![async-module-model-3](async-module-model-3.png)
![async-module-model-4](async-module-model-4.png)
![async-module-model-5](async-module-model-5.png)
![async-module-model-6](async-module-model-6.png)
![async-module-model-7](async-module-model-7.png)
![async-module-model-8](async-module-model-8.png)
![async-module-model-9](async-module-model-9.png)

###### Widget模式
Widget:(Web Widget指的是一块可以在任意页面中执行的代码块)Widget模式是指借用Web Widget思想将页面分解成部件，针对部件开发，最终组合成完整的页面。

![widget-model-1](widget-model-1.png)
![widget-model-2](widget-model-2.png)
![widget-model-3](widget-model-3.png)
![widget-model-4](widget-model-4.png)
![widget-model-5](widget-model-5.png)
![widget-model-6](widget-model-6.png)

###### MVC模式
MVC即模型(model)一视图(view)一控制器(controller)，用一种将业务逻辑、数据、视图分离的方式组织架构代码。

![mvc-model-1](mvc-model-1.png)

**每个对象是一个自动执行的函数**
**3个层次对象可被调用，而声明的函数在执行前是不能被调用的，比如模型对象要被视图和控制器调用，因此执行一遍为其他对象调用提供接口方法**

![mvc-model-2](mvc-model-2.png)
![mvc-model-3](mvc-model-3.png)
视图层只有3个部分，一是操作模型数据对象方法的引用(M),二是内部视图创建方法对象，三是外部获取视图创建方法接口

![mvc-model-4](mvc-model-4.png)

###### MVP模式
MVP即模型(Model)一视图(View)一管理器(Presenter): View层不直接引用Model层内的数据，而是通过Presenter层实现对Model层内的数据访问。即所有层次的交互都发生在Presenter层中。

![mvp-model-1](mvp-model-1.png)
![mvp-model-2](mvp-model-2.png)
![mvp-model-3](mvp-model-3.png)
![mvp-model-4](mvp-model-4.png)
![mvp-model-5](mvp-model-5.png)
![mvp-model-6](mvp-model-6.png)
![mvp-model-7](mvp-model-7.png)

MVP与MVC相比最重要的特征就是MVP中将视图层与数据层完全解耦，使得对视图层的修改不会影响到数据层，数据层内的数据改动又不会影响到视图层。因此，我们在管理器中对数据或者视图灵活地调用就可使数据层内的数据与视图层内的视图得到更高效的复用。因此，MVP模式也可以实现一个管理器，可以调用多个数据，或者创建多种视图，而且是不受限制的。因而管理器有更高的操作权限，因此对于业务逻辑与需求的实现只需专注于管理器的开发即可，当然管理器内过多的逻辑也使得其开发与维护成本提高。

###### MVVM模式
MVVM模式，模型(Model)-视图(View)-视图模型(ViewModel):为视图层(View)量身定做一套视图模型(ViewModel)，并在视图模型(ViewModel)中创建属性和方法，为视图层(View)绑定数据(Model)并实现交互。

![mvvm-model-1](mvvm-model-1.png)
![mvvm-model-2](mvvm-model-2.png)
![mvvm-model-3](mvvm-model-3.png)
![mvvm-model-4](mvvm-model-4.png)
![mvvm-model-5](mvvm-model-5.png)
![mvvm-model-6](mvvm-model-6.png)
![mvvm-model-7](mvvm-model-7.png)
![mvvm-model-8](mvvm-model-8.png)

###### 附录
![appendix-1](appendix-1.png)
![appendix-2](appendix-2.png)
![appendix-3](appendix-3.png)
![appendix-4](appendix-4.png)
![appendix-5](appendix-5.png)
![appendix-6](appendix-6.png)
![appendix-7](appendix-7.png)
![appendix-8](appendix-8.png)
![appendix-9](appendix-9.png)
![appendix-10](appendix-10.png)


疑问点：
(1)为什么要缓存Array的slice方法？slice = Array.prototype.slice
编程方式区分，不要糅合在一起
对性能影响可以忽略不计

(2)有一些模式很像，一定需要做区分吗？
从实际场景触发，贴合场景选择设计模式
设计模式一定要符合当下场景，在此基础上考虑一些将来的扩展，如果未来不符合要求了，优先考虑修改涉及模式以解决当前场景问题

(3)柯理化
函数；
接受多个参数（一个参数没必要用柯理化）；
将接受多个参数的函数变成 接受一个参数 的函数（函数嵌套），每个函数返回一个新函数并接受一个新的参数，直到最后返回计算结果
调用方式不一样。普通函数：函数名(参数1, 参数2, ...);   柯理化：函数名(参数1)(参数2)...

对函数式编程用处比较大，也可以选择不使用柯理化，使用其他方法解决