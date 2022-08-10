---
title: vue3渲染
date: 2022-06-22 22:12:51
tags:
---

## 渲染流程
![vue3_render](vue3_render.png)
(1)创建一个vue实例 -> 初始化实例（包括需要相关事件与生命周期函数等）
(2)调用beforeCreate
(3)初始化注入，包括data、method等添加到实例对象
(4)实例创建完成，调用created
(5)有el挂载，使用template替换；无挂载，使用mount自动挂载
(6)有template，进行编译，使其成为render函数
(7)（1）有template，使用模板构建抽象语法树；（2）通过数据获取元素的outerHTML属性值即元素结构的字符串形式构建HTML模板
(8)调用beforeMount（vue实例挂载在虚拟DOM上）
(9)生成HTML元素节点，替换页面原有的挂载节点（页面渲染）
(10)调用mounted
-- （1）数据变更，即将重新渲染
-- （2）调用beforeUpdate
-- （3）进行虚拟DOM和真实DOM对比，进行patch
-- （4）渲染完成，调用updated
(11)实例销毁之前调用beforeUnmount
(12)实例销毁，vm.$destroy
(13)销毁后调用unmounted

## render函数
![render](render.png)
(1)首先会判断Vnode是否存在，如果不存在，则调用unmount函数，进行组件的卸载
(2)否则调用patch函数，对组件进行patch（PS: patch是一个递归的过程）
(3)patch 结束后，会调用flushPostFlushCbs函数冲刷任务池
(4)最后更新容器上的Vnode
注：patch函数的主要职责就是去判断Vnode的节点类型（打上patchFlag标志），然后调用对应类型的Vnode处理方式，进行更细致的patch（最后进行render渲染）

## patch函数
![render_node1](render_node1.png)
![render_node2](render_node2.png)
![render_function](render_function.png)
注：patch依据不同节点类型，执行不同的处理函数，包括：Text、Comment、Static、Fragment等
(1)n1 与 n2 是待比较的两个节点，n1 为旧节点，n2 为新节点
(2)container 是新节点的容器
(3)anchor 是一个锚点，用来标识当我们对新旧节点做增删或移动等操作时，以哪个节点为参照物
(4)optimized 参数是是否开启优化模式的标识

## 卸载组件
如果调用render函数时没有传Vnode，则会调用unmount函数对组件进行卸载 ，卸载过程中：
(1)如果存在ref，会首先重置ref
(2)如果组件是经过Keep-Alive缓存的组件，会通过deactivate对组件进行卸载
(3)如果是组件类型Vnode，会通过unmountComponent函数对组件进行卸载
