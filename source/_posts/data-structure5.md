---
title: 数据结构与算法阅读笔记(5)
date: 2022-10-08 16:33:37
tags:
---

#### 二叉堆和堆排序

###### 二叉堆数据结构

(1)它是一棵完全二叉树，表示树的每一层都有左侧和右侧子节点（除了最后一层的叶节点），并且最后一层的叶节点尽可能都是左侧子节点，这叫作结构特性。
(2)二叉堆不是最小堆就是最大堆。最小堆允许你快速导出树的最小值，最大堆允许你快速导出树的最大值。所有的节点都大于等于（最大堆）或小于等于（最小堆）每个它的子节点。这叫作堆特性
![heat](heat.png)

二叉树有两种表示方式
第一种是使用一个动态的表示方式，也就是指针（用节点表示）
第二种是使用一个数组，通过索引值检索父节点、左侧和右侧子节点的值。
![min-heat](min-heat.png)

访问使用普通数组的二叉树节点:
它的左侧子节点的位置是 2 _ index + 1（如果位置可用）；
它的右侧子节点的位置是 2 _ index + 2（如果位置可用）；
它的父节点位置是 index / 2（如果位置可用）

```javascript
import { defaultCompare } from '../util';

export class MinHeap {
  constructor(compareFn = defaultCompare) {
    this.compareFn = compareFn; // {1}
    this.heap = []; // {2}
  }
  getLeftIndex(index) {
    return 2 * index + 1;
  }
  getRightIndex(index) {
    return 2 * index + 2;
  }
  getParentIndex(index) {
    if (index === 0) {
      return undefined;
    }
    return Math.floor((index - 1) / 2);
  }
  insert(value) {
    if (value != null) {
      this.heap.push(value); // {1}
      this.siftUp(this.heap.length - 1); // {2}
      return true;
    }
    return false;
  }
  // 上移操作
  siftUp(index) {
    let parent = this.getParentIndex(index); // {1}
    while (
      index > 0 &&
      this.compareFn(this.heap[parent], this.heap[index]) > Compare.BIGGER_THAN
    ) {
      // {2}
      swap(this.heap, parent, index); // {3}
      index = parent;
      parent = this.getParentIndex(index); // {4}
    }
    function swap(array, a, b) {
      const temp = array[a]; // {5}
      array[a] = array[b]; // {6}
      array[b] = temp; // {7}
    }
  }
  size() {
    return this.heap.length;
  }
  isEmpty() {
    return this.size() === 0;
  }
  findMinimum() {
    return this.isEmpty() ? undefined : this.heap[0]; // {1}
  }
  extract() {
    if (this.isEmpty()) {
      return undefined; // {1}
    }
    if (this.size() === 1) {
      return this.heap.shift(); // {2}
    }
    const removedValue = this.heap.shift(); // {3}
    this.siftDown(0); // {4}
    return removedValue; // {5}
  }
  siftDown(index) {
    let element = index;
    const left = this.getLeftIndex(index); // {1}
    const right = this.getRightIndex(index); // {2}
    const size = this.size();
    if (
      left < size &&
      this.compareFn(this.heap[element], this.heap[left]) > Compare.BIGGER_THAN
    ) {
      // {3}
      element = left; // {4}
    }
    if (
      right < size &&
      this.compareFn(this.heap[element], this.heap[right]) > Compare.BIGGER_THAN
    ) {
      // {5}
      element = right; // {6}
    }
    if (index !== element) {
      // {7}
      swap(this.heap, index, element); // {8}
      this.siftDown(element); // {9}
    }
  }
}
```
![min-heat-pic](min-heat-pic.png)

**创建最大堆类**
MaxHeap 类的算法和 MinHeap 类的算法一模一样。不同之处在于我们要把所有>（大于）的比较换成<（小于）的比较。
```javascript
function reverseCompare(compareFn) { 
 return (a, b) => compareFn(b, a); 
} 

export class MaxHeap extends MinHeap { 
 constructor(compareFn = defaultCompare) { 
 super(compareFn); 
 this.compareFn = reverseCompare(compareFn); // {1} 
 } 
}
```

**堆排序算法**
(1) 用数组创建一个最大堆用作源数据。
(2) 在创建最大堆后，最大的值会被存储在堆的第一个位置。我们要将它替换为堆的最后一个值，将堆的大小减 1。
(3) 最后，我们将堆的根节点下移并重复步骤 2 直到堆的大小为 1
```javascript
function heapSort(array, compareFn = defaultCompare) { 
 let heapSize = array.length; 
 buildMaxHeap(array, compareFn); // 步骤 1 
 while (heapSize > 1) { 
 swap(array, 0, --heapSize); // 步骤 2 
 heapify(array, 0, heapSize, compareFn); // 步骤 3 
 } 
 return array; 
}
function buildMaxHeap(array, compareFn) { 
 for (let i = Math.floor(array.length / 2); i >= 0; i -= 1) { 
 heapify(array, i, array.length, compareFn); 
} 
 return array; 
}

```
heapify 函数和我们创建的 siftDown 方法有相同的代码。不同之处是我们会将堆本身、堆的大小和要使用的比较函数传入作为参数。这是因为我们不会直接使用堆数据结构，而是使用它的逻辑来开发 heapSort 算法
![heap-sort](heap-sort.png)

**堆排序算法不是一个稳定的排序算法，也就是说如果数组没有排好序，可能会得到不一样的结果。**


#### 图

###### 图的相关术语
图是网络结构的抽象模型。图是一组由边连接的节点（或顶点）
G = (V, E)
V: 一组顶点
E: 一组边，连接V中的顶点
![graph-1](graph-1.png)

由一条边连接在一起的顶点称为相邻顶点。比如，A 和 B 是相邻的，A 和 D 是相邻的，A 和C 是相邻的，A 和 E 不是相邻的。
一个顶点的度是其相邻顶点的数量。比如，A 和其他三个顶点相连接，因此 A 的度为 3；E和其他两个顶点相连，因此 E 的度为 2。
路径是顶点 v1, v2, …, vk的一个连续序列，其中 vi和 vi+1是相邻的。以上一示意图中的图为例，其中包含路径 A B E I 和 A C D G。
简单路径要求不包含重复的顶点。举个例子，A D G 是一条简单路径。除去最后一个顶点（因为它和第一个顶点是同一个顶点），环也是一个简单路径，比如 A D C A（最后一个顶点重新回到 A）。
如果图中不存在环，则称该图是无环的。如果图中每两个顶点间都存在路径，则该图是连通的。

**有向图和无向图**
图可以是无向的（边没有方向）或是有向的（有向图）。
如果图中每两个顶点间在双向上都存在路径，则该图是强连通的。例如，C 和 D 是强连通的，而 A 和 B 不是强连通的。
![graph-2](graph-2.png)
图还可以是未加权的（目前为止我们看到的图都是未加权的）或是加权的。如下图所示，加权图的边被赋予了权值。
![graph-3](graph-3.png)

###### 图的表示

**邻接矩阵**