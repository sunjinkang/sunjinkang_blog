---
title: JavaScript设计模式读书笔记(4)
date: 2022-09-07 17:40:43
tags:
---

#### 行为型设计模式
行为型设计模式用于不同对象之间职责划分或算法抽象，行为型设计模式不仅仅涉及类和对象,还涉及类或对象之间的交流模式并加以实现

###### 模板方法模式
模板方法模式(Template Method):父类中定义一组操作算法骨架，而将一些实现步骤延迟到子类中，使得子类可以不改变父类的算法结构的同时可重新定义算法中某些实现步骤。

多用于归一化组件

[basic-model](basic-model.png)
[inherit-model](inherit-model.png)
[inherit-as-basic-model](inherit-as-basic-model.png)

###### 观察者模式
观察者模式(Observer):又被称作发布-订阅者模式或消息机制，定义了一种依赖关系，解决了主体对象与观察者之间功能的耦合。