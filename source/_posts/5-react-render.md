---
title: react渲染
date: 2022-06-22 22:12:37
tags:
---

## 主要步骤
#### React.createElement语法糖
(1)React.createElement(type, [props], [...children]);
(2)type：元素类型
(3)props：属性值
(4)children：子元素
#### 虚拟DOM
(1)本质为JS对象，使用键值对存储信息，嵌套表示层级关系
(2)$$typeof：标识符，使用Symbol数据结构确保唯一性

<!-- more -->

#### 协调算法
#### filter图示
![filter_tree](fiber_tree.png)

## Element转化为Dom
(1)所有从React.createElement中收到的值组装成一个React的虚拟Dom，最终调用ReactDom.render方法去实现转化
(2)ReactDOM.render(element, container[, callback])
(3)ReactDOM.render三个参数，其中第一个参数便是生成的虚拟Dom，第二个参数则是一个真实Dom，此Dom相当于是一个容器，React元素将被渲染到这个容器里面去，第三个参数则是一个callback function

## 源码相关
1、setState触发更新、父组件重新渲染时触发更新
![update_class](update_class.png)
(1)static getDerivedStateFromProps()
(2)shouldComponentUpdate(nextProps,nextState)
(3)render()
(4)getSnapshotBeforeUpdate(prevProps,prevState)
(5)componentDidUpdate(prevProps,prevState,snapshot)
其中，getSnapshotBeforeUpdate(prevProps,prevState)必须返回null或任意快照值(Snapshot Value，undefined除外)。返回的快照值将作为componentDidUpdate的第三个形参
2、forceUpdate触发更新
![force_update](force_update.png)
(1)static getDerivedStateFromProps()
(2)render()
(3)getSnapshotBeforeUpdate()
(4)componentDidUpdate()