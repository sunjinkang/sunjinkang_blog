---
title: 数据结构与算法阅读笔记(2)
date: 2022-09-23 15:52:54
cover: https://cdn.pixabay.com/photo/2020/06/07/13/33/fireworks-5270439_640.jpg
tags:
---

#### 队列

队列是遵循先进先出（FIFO，也称为先来先服务）原则的一组有序的项。队列在尾部添加新元素，并从顶部移除元素。最新添加的元素必须排在队列的末尾

<!-- more -->
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
  removeFront() {
    if (this.isEmpty()) {
      return undefined;
    }
    const result = this.items[this.lowestCount]; // {1}
    delete this.items[this.lowestCount]; // {2}
    this.lowestCount++; // {3}
    return result; // {4}
  }
  removeBack() {
    if (this.isEmpty()) {
      return undefined;
    }
    this.count--;
    const result = this.items[this.count];
    delete this.items[this.count];
    return result;
  }
  peekFront() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.lowestCount];
  }
  peekBack() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.count - 1];
  }
  isEmpty() {
    return this.count - this.lowestCount === 0;
  }
  clear() {
    this.count = 0;
    this.lowestCount = 0;
    this.items = {};
  }
}
```

###### 循环队列 - 击鼓传花
场景：在这个游戏中，孩子们围成一个圆圈，把花尽快地传递给旁边的人。某一时刻传花停止，这个时候花在谁手里，谁就退出圆圈、结束游戏。重复这个过程，直到只剩一个孩子（胜者）
```javascript
function hotPotato(elementsList, num) { 
  const queue = new Queue(); // {1} 
  const elimitatedList = [];
  // 把名单的名字全都加入队列
  for (let i = 0; i < elementsList.length; i++) { 
    queue.enqueue(elementsList[i]); // {2} 
  }
  // 迭代队列
  while (queue.size() > 1) { 
    for (let i = 0; i < num; i++) { 
      // 将队列开头一项移除，添加到队列末尾
      queue.enqueue(queue.dequeue()); // {3} 
    } 
    // 将超出限制的队列开头一项移除，作为淘汰项
    elimitatedList.push(queue.dequeue()); // {4} 
  } 
  return { 
    eliminated: elimitatedList, 
    winner: queue.dequeue() // {5} 
  };
}

const names = ['John', 'Jack', 'Camila', 'Ingrid', 'Carl']; 
const result = hotPotato(names, 7);
result.eliminated.forEach(name => { 
 console.log(`${name}在击鼓传花游戏中被淘汰。`); 
}); 
console.log(`胜利者： ${result.winner}`);
```

###### 回文检查器
回文：回文是正反都能读通的单词、词组、数或一系列字符的序列，例如 madam或 racecar。
```javascript
function palindromeChecker(aString) {
  // 检查传入的字符串参数是否合法
  if (aString === undefined || aString === null || (aString !== null && aString.length === 0)) { // {1} 
    return false;
  } 
  const deque = new Deque(); // {2}
  // 将所有字母转化为小写，同时移除所有的空格
  const lowerString = aString.toLocaleLowerCase().split(' ').join(''); // {3} 
  let isEqual = true; 
  let firstChar, lastChar;
  // 将所有字符串加入队列中
  for (let i = 0; i < lowerString.length; i++) { // {4} 
    deque.addBack(lowerString.charAt(i)); 
  }

  while (deque.size() > 1 && isEqual) { // {5} 
    firstChar = deque.removeFront(); // {6} 
    lastChar = deque.removeBack(); // {7}

    if (firstChar !== lastChar) { 
      isEqual = false; // {8} 
    }
  } 
  return isEqual;
}
```

[javascript事件循环](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)


#### 链表

###### 链表数据结构
{% asset_img chain-table-1.png 链表 %}
链表的好处：添加或移除元素的时候不需要移动其他元素
要想访问链表中间的一个元素，需要从起点（表头）开始迭代链表直到找到所需的元素
```javascript
// util.js
export function defaultEquals(a, b) { 
  return a === b; 
}
// models/linked-list-models
export class Node {
  constructor(element) {
    this.element = element; 
    this.next = undefined; 
  }
} 

import { defaultEquals } from '../util'; 
import { Node } from './models/linked-list-models'; // {1} 
export default class LinkedList { 
  constructor(equalsFn = defaultEquals) { 
    this.count = 0; // {2} 
    this.head = undefined; // {3}
    this.equalsFn = equalsFn; // {4} 
  }
  // 向链表尾部添加元素
  push(element) { 
    const node = new Node(element); // {1} 
    let current; // {2} 

    if (this.head == null) { // {3} 
      this.head = node;
    } else {
      current = this.head; // {4} 
      while (current.next != null) { // {5} 获得最后一项
        current = current.next; 
      }
      // 将其 next 赋为新元素，建立链接
      current.next = node; // {6} 
    } 
    this.count++; // {7} 
  }
  // 从链表中移除元素
  removeAt(index) { 
    // 检查越界值
    if (index >= 0 && index < this.count) { // {1} 
      let current = this.head; // {2} 
      // 移除第一项
      if (index === 0) { // {3} 
        this.head = current.next; 
      } else {
        // 获取当前index的前一个节点
        const previous = this.getElementAt(index - 1);
        current = previous.next;
        // 将 previous 与 current 的下一项链接起来：跳过 current，从而移除它
        previous.next = current.next; // {8} 
      }
      this.count--; // {9} 
      return current.element; 
    } 
    return undefined; // {10} 
  }
  // 循环迭代链表直到目标位置
  getElementAt(index) { 
    if (index >= 0 && index <= this.count) { // {1} 
      let node = this.head; // {2} 
      for (let i = 0; i < index && node != null; i++) { // {3} 
        node = node.next;
      } 
      return node; // {4} 
    } 
    return undefined; // {5} 
  }
  // 在任意位置插入元素
  insert(element, index) { 
    if (index >= 0 && index <= this.count) { // {1} 
      const node = new Node(element);

      if (index === 0) { // 在第一个位置添加
        const current = this.head; 
        node.next = current; // {2} 
        this.head = node; 
      } else { 
        const previous = this.getElementAt(index - 1); // {3} 
        const current = previous.next; // {4} 
        node.next = current; // {5} 
        previous.next = node; // {6} 
      } 
      this.count++; // 更新链表的长度
      return true; 
    } 
    return false; // {7} 
  }
  //  indexOf 方法：返回一个元素的位置
  indexOf(element) { 
    let current = this.head; // {1} 
    for (let i = 0; i < this.count && current != null; i++) { // {2} 
      if (this.equalsFn(element, current.element)) { // {3} 
        return i; // {4} 
      }
      current = current.next; // {5} 
    } 
    return -1; // {6} 
  }
  // 从链表中移除元素
  remove(element) { 
    const index = this.indexOf(element); 
    return this.removeAt(index); 
  }
  size() { 
    return this.count; 
  }
  isEmpty() { 
    return this.count === 0; 
  }
  getHead() {
    return this.head; 
  }
  toString() { 
    if (this.head == null) { // {1} 
      return ''; 
    } 
    let objString = `${this.head.element}`; // {2} 
    let current = this.head.next; // {3} 

    for (let i = 1; i < this.size() && current != null; i++) { // {4} 
      objString = `${objString},${current.element}`; 
      current = current.next;
    } 
    return objString; // {5} 
  }
}
```
[javascript垃圾回收器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)

###### 双向链表
在双向链表中，链接是双向的：一个链向下一个元素，另一个链向前一个元素
{% asset_img chain-table-2.png 双向链表 %}
```javascript
class DoublyNode extends Node { // {1} 
 constructor(element, next, prev) { 
  super(element, next); // {2} 
  this.prev = prev; // {3} 新增的
 } 
}

class DoublyLinkedList extends LinkedList { // {4} 
  constructor(equalsFn = defaultEquals) { 
    super(equalsFn); // {5} 
    this.tail = undefined; // {6} 新增的
  }
  //  在任意位置插入新元素
  insert(element, index) { 
    if (index >= 0 && index <= this.count) { 
      const node = new DoublyNode(element); 
      let current = this.head;

      if (index === 0) { 
          if (this.head == null) { // {1} 新增的
            this.head = node; 
            this.tail = node; 
          } else { 
            node.next = this.head; // {2} 
            current.prev = node; // {3} 新增的
            this.head = node; // {4} 
          } 
      } else if (index === this.count) { // 最后一项 // 新增的
        current = this.tail; // {5} 
        current.next = node; // {6} 
        node.prev = current; // {7} 
        this.tail = node; // {8} 
      } else { 
        const previous = this.getElementAt(index - 1); // {9} 
        current = previous.next; // {10} 
        node.next = current; // {11} 
        previous.next = node; // {12} 
        current.prev = node; // {13} 新增的
        node.prev = previous; // {14} 新增的
      }
      this.count++; 
      return true;
    } 
    return false; 
  }
  // 从任意位置移除元素
  removeAt(index) { 
    if (index >= 0 && index < this.count) { 
      let current = this.head;

      if (index === 0) { 
        this.head = current.next; // {1} 
        // 如果只有一项，更新 tail // 新增的
        if (this.count === 1) { // {2} 
          this.tail = undefined; 
        } else { 
          this.head.prev = undefined; // {3} 
        } 
      } else if (index === this.count - 1) { // 最后一项 //新增的
        current = this.tail; // {4} 
        this.tail = current.prev; // {5} 
        this.tail.next = undefined; // {6} 
      } else { 
        current = this.getElementAt(index); // {7} 
        const previous = current.prev; // {8} 
        // 将 previous 与 current 的下一项链接起来——跳过 current 
        previous.next = current.next; // {9} 
        current.next.prev = previous; // {10} 新增的
      }
      this.count--; 
      return current.element; 
    } 
    return undefined; 
  }
}
// 源码：https://github.com/loiane/javascript-datastructures-algorithms
```

###### 循环链表
循环链表可以像链表一样只有单向引用，也可以像双向链表一样有双向引用。循环链表和链表之间唯一的区别在于，最后一个元素指向下一个元素的指针（tail.next）不是引用undefined，而是指向第一个元素（head）
双向循环链表有指向 head 元素的 tail.next 和指向 tail 元素的 head.prev
{% asset_img chain-table-3.png 循环链表 %}
{% asset_img chain-table-4.png 双向循环链表 %}

```javascript
class CircularLinkedList extends LinkedList { 
  constructor(equalsFn = defaultEquals) {
    super(equalsFn); 
  }
  // 在任意位置插入新元素
  insert(element, index) { 
    if (index >= 0 && index <= this.count) { 
      const node = new Node(element); 
      let current = this.head;

      if (index === 0) { 
        if (this.head == null) { 
          this.head = node; // {1} 
          node.next = this.head; // {2} 新增的
        } else { 
          node.next = current; // {3} 
          current = this.getElementAt(this.size()); // {4} 
          // 更新最后一个元素
          this.head = node; // {5} 
          current.next = this.head; // {6} 新增的
        }
      } else { // 这种场景没有变化
        const previous = this.getElementAt(index - 1); 
        node.next = previous.next; 
        previous.next = node; 
      } 
      this.count++; 
      return true;
    } 
    return false; 
  }
  // 从任意位置移除元素
  removeAt(index) { 
    if (index >= 0 && index < this.count) { 
      let current = this.head;

      if (index === 0) { 
        if (this.size() === 1) { 
          this.head = undefined; 
        } else { 
          const removed = this.head; // {1} 
          current = this.getElementAt(this.size()); // {2} 新增的
          this.head = this.head.next; // {3} 
          current.next = this.head; // {4} 
          current = removed; // {5}
        }
      } else { 
        // 不需要修改循环链表最后一个元素
        const previous = this.getElementAt(index - 1); 
        current = previous.next; 
        previous.next = current.next; 
      }
      this.count--; 
      return current.element; // {6} 
    } 
    return undefined; 
  }
}
```

###### 有序链表
有序链表是指保持元素有序的链表结构。除了使用排序算法之外，我们还可以将元素插入到正确的位置来保证链表的有序性。
```javascript
const Compare = { 
  LESS_THAN: -1, 
  BIGGER_THAN: 1 
}; 
function defaultCompare(a, b) { 
  if (a === b) { // {1} 
    return 0; 
  } 
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN; // {2} 
} 
class SortedLinkedList extends LinkedList { 
  constructor(equalsFn = defaultEquals, compareFn = defaultCompare) { 
    super(equalsFn); 
    this.compareFn = compareFn; // {3} 
  }
  // 有序插入元素
  insert(element, index = 0) { // {1} 
    if (this.isEmpty()) { 
      return super.insert(element, 0); // {2} 
    } 
    const pos = this.getIndexNextSortedElement(element); // {3} 
    return super.insert(element, pos); // {4} 
  } 
  getIndexNextSortedElement(element) { 
    let current = this.head; 
    let i = 0; 
    for (; i < this.size() && current; i++) { 
      const comp = this.compareFn(element, current.element); // {5} 
      if (comp === Compare.LESS_THAN) { // {6} 
        return i; 
      } 
      current = current.next; 
    } 
    return i; // {7} 
  }
}
```

###### 创建 StackLinkedList 类
```javascript
class StackLinkedList { 
  constructor() { 
    this.items = new DoublyLinkedList(); // {1} 
  } 
  push(element) { 
    this.items.push(element); // {2} 
  } 
  pop() { 
    if (this.isEmpty()) { 
      return undefined; 
    } 
    return this.items.removeAt(this.size() - 1); // {3} 
  } 
}
```