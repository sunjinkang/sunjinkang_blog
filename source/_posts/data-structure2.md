---
title: 数据结构与算法阅读笔记(2)
date: 2022-09-23 15:52:54
tags:
---

###### 队列

队列是遵循先进先出（FIFO，也称为先来先服务）原则的一组有序的项。队列在尾部添加新元素，并从顶部移除元素。最新添加的元素必须排在队列的末尾

```javascript
class Queue {
  constructor() {
    this.count = 0; // {1}
    this.lowestCount = 0; // {2}
    this.items = {}; // {3}
  }
  // 向队列添加元素
  enqueue(element) {
    this.items[this.count] = element;
    this.count++;
  }
  // 从队列移除元素
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    const result = this.items[this.lowestCount]; // {1}
    delete this.items[this.lowestCount]; // {2}
    this.lowestCount++; // {3}
    return result; // {4}
  }
  // 查看队列头元素
  peek() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.lowestCount];
  }
  // 检查队列是否为空
  isEmpty() {
    return this.count - this.lowestCount === 0;
  }
  // 获取队列的长度
  size() {
    return this.count - this.lowestCount;
  }
  // 清空队列
  clear() {
    this.items = {};
    this.count = 0;
    this.lowestCount = 0;
  }
  toString() {
    if (this.isEmpty()) {
      return '';
    }
    let objString = `${this.items[this.lowestCount]}`;
    for (let i = this.lowestCount + 1; i < this.count; i++) {
      objString = `${objString},${this.items[i]}`;
    }
    return objString;
  }
}
```

###### 双端队列
双端队列（deque，或称 double-ended queue）是一种允许我们同时从前端和后端添加和移除元素的特殊队列

由于双端队列同时遵守了先进先出和后进先出原则，可以说它是把队列和栈相结合的一种数据结构

```javascript
class Deque { 
 constructor() { 
 this.count = 0; 
 this.lowestCount = 0; 
 this.items = {}; 
 }
 // 向双端队列的前端添加元素
 addFront(element) { 
 if (this.isEmpty()) { // {1} 
 this.addBack(element); 
 } else if (this.lowestCount > 0) { // {2} 
 this.lowestCount--; 
 this.items[this.lowestCount] = element; 
 } else { 
 for (let i = this.count; i > 0; i--) { // {3} 
 this.items[i] = this.items[i - 1]; 
 } 
 this.count++; 
 this.lowestCount = 0; 
 this.items[0] = element; // {4} 
 }
}
addBack(element) {
    this.items[this.count] = element;
    this.count++;
  }
}
```