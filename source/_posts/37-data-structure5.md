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
<!-- more -->
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
E: 一组边，连接 V 中的顶点
![graph-1](graph-1.png)

由一条边连接在一起的顶点称为相邻顶点。比如，A 和 B 是相邻的，A 和 D 是相邻的，A 和 C 是相邻的，A 和 E 不是相邻的。
一个顶点的度是其相邻顶点的数量。比如，A 和其他三个顶点相连接，因此 A 的度为 3；E 和其他两个顶点相连，因此 E 的度为 2。
路径是顶点 v1, v2, …, vk 的一个连续序列，其中 vi 和 vi+1 是相邻的。以上一示意图中的图为例，其中包含路径 A B E I 和 A C D G。
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
每个节点都和一个整数相关联，该整数将作为数组的索引。用一个二维数组来表示顶点之间的连接。如果索引为 i 的节点和索引为 j 的节点相邻，则 array[i][j] === 1，否则 array[i][j] === 0
![graph-4](graph-4.png)
_缺点：_
(1)不是强连通的图（稀疏图）如果用邻接矩阵来表示，则矩阵中将会有很多 0，浪费了计算机存储空间来表示根本不存在的边。
(2)顶点的数量可能会改变，而二维数组不太灵活

**邻接表**
邻接表由图中每个顶点的相邻顶点列表所组成。存在好几种方式来表示这种数据结构。
可以用列表（数组）、链表，甚至是散列表或是字典来表示相邻顶点列表
![graph-5](graph-5.png)

**关联矩阵**
在关联矩阵中，矩阵的行表示顶点，列表示边。使用二维数组来表示两者之间的连通性，如果顶点 v 是边 e 的入射点，则 array[v][e] === 1；否则，array[v][e] === 0
![graph-6](graph-6.png)
_关联矩阵通常用于边的数量比顶点多的情况，以节省空间和内存_

###### 创建 Graph 类

```javascript
class Graph {
  constructor(isDirected = false) {
    // 表示图是否有向
    this.isDirected = isDirected; // {1}
    //  所有顶点的名字
    this.vertices = []; // {2}
    //  字典将会使用顶点的名字作为键，邻接顶点列表作为值
    this.adjList = new Dictionary(); // {3}
  }
  //  一个用来向图中添加一个新的顶点
  addVertex(v) {
    if (!this.vertices.includes(v)) {
      // {5}
      this.vertices.push(v); // {6}
      this.adjList.set(v, []); // {7}
    }
  }
  // 来添加顶点之间的边
  addEdge(v, w) {
    if (!this.adjList.get(v)) {
      this.addVertex(v); // {8}
    }
    if (!this.adjList.get(w)) {
      this.addVertex(w); // {9}
    }
    this.adjList.get(v).push(w); // {10}
    if (!this.isDirected) {
      this.adjList.get(w).push(v); // {11}
    }
  }
  // 获取顶点列表
  getVertices() {
    return this.vertices;
  }
  // 获取邻接表
  getAdjList() {
    return this.adjList;
  }
  toString() {
    let s = '';
    for (let i = 0; i < this.vertices.length; i++) {
      // {15}
      s += `${this.vertices[i]} -> `;
      const neighbors = this.adjList.get(this.vertices[i]); // {16}
      for (let j = 0; j < neighbors.length; j++) {
        // {17}
        s += `${neighbors[j]} `;
      }
      s += '\n'; // {18}
    }
    return s;
  }
}
```

###### 图的遍历

*作用：*图遍历可以用来寻找特定的顶点或寻找两个顶点之间的路径，检查图是否连通，检查图是否含有环，等等
图遍历算法的思想是必须追踪每个第一次访问的节点，并且追踪有哪些节点还没有被完全探索。对于两种图遍历算法，都需要明确指出第一个被访问的顶点。
完全探索一个顶点要求我们查看该顶点的每一条边。对于每一条边所连接的没有被访问过的顶点，将其标注为被发现的，并将其加进待访问顶点列表中。
为了保证算法的效率，务必访问每个顶点至多两次。连通图中每条边和顶点都会被访问到。

**广度优先搜索（breadth-first search，BFS）**
**深度优先搜索（depth-first search，DFS）**
*不同点：*待访问顶点列表的数据结构
| 算 法        | 数据结构 | 描 述                                                          |
| ------------ | -------- | -------------------------------------------------------------- |
| 深度优先搜索 | 栈       | 将顶点存入栈，顶点是沿着路径被探索的，存在新的相邻顶点就去访问 |
| 广度优先搜索 | 队列     | 将顶点存入队列，最先入队列的顶点先被探索                       |

```javascript
// 白色：表示该顶点还没有被访问。
// 灰色：表示该顶点被访问过，但并未被探索过。
// 黑色：表示该顶点被访问过且被完全探索过
const Colors = {
  WHITE: 0,
  GREY: 1,
  BLACK: 2,
};
// 初始化每个顶点的颜色
const initializeColor = (vertices) => {
  const color = {};
  for (let i = 0; i < vertices.length; i++) {
    color[vertices[i]] = Colors.WHITE;
  }
  return color;
};
```

**广度优先搜索**
从指定的第一个顶点开始遍历图，先访问其所有的邻点（相邻顶点），就像一次访问图的一层。换句话说，就是先宽后深地访问顶点
![graph-7](graph-7.png)
_步骤_
(1) 创建一个队列 Q。
(2) 标注 v 为被发现的（灰色），并将 v 入队列 Q。
(3) 如果 Q 非空，则运行以下步骤：

- (a) 将 u 从 Q 中出队列；
- (b) 标注 u 为被发现的（灰色）；
- (c) 将 u 所有未被访问过的邻点（白色）入队列；
- (d) 标注 u 为已被探索的（黑色）

```javascript
export const breadthFirstSearch = (graph, startVertex, callback) => {
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices); // {1}
  const queue = new Queue(); // {2}
  queue.enqueue(startVertex); // {3}
  while (!queue.isEmpty()) {
    // {4}
    const u = queue.dequeue(); // {5}
    const neighbors = adjList.get(u); // {6}
    // 发现了节点，但尚未完成探索
    color[u] = Colors.GREY; // {7}
    for (let i = 0; i < neighbors.length; i++) {
      // {8}
      const w = neighbors[i]; // {9}
      if (color[w] === Colors.WHITE) {
        // {10}
        color[w] = Colors.GREY; // {11}
        queue.enqueue(w); // {12}
      }
    }
    color[u] = Colors.BLACK; // {13}
    // 可选回调函数
    if (callback) {
      // {14}
      callback(u);
    }
  }
};

const printVertex = (value) => console.log('Visited vertex: ' + value); // {15}
breadthFirstSearch(graph, myVertices[0], printVertex);
```

_使用 BFS 寻找最短路径_
给定一个图 G 和源顶点 v，找出每个顶点 u 和 v 之间最短路径的距离（以边的数量计）

```javascript
const BFS = (graph, startVertex) => {
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices);
  // 创建一个队列
  const queue = new Queue();
  const distances = {}; // {1}
  const predecessors = {}; // {2}
  queue.enqueue(startVertex);
  for (let i = 0; i < vertices.length; i++) {
    // {3}
    distances[vertices[i]] = 0; // {4}
    predecessors[vertices[i]] = null; // {5}
  }
  while (!queue.isEmpty()) {
    const u = queue.dequeue();
    const neighbors = adjList.get(u);
    color[u] = Colors.GREY;
    for (let i = 0; i < neighbors.length; i++) {
      const w = neighbors[i];
      if (color[w] === Colors.WHITE) {
        color[w] = Colors.GREY;
        distances[w] = distances[u] + 1; // {6}
        predecessors[w] = u; // {7}
        queue.enqueue(w);
      }
    }
    color[u] = Colors.BLACK;
  }
  return {
    // {8}
    distances, // 从 v(源顶点) 到 u(除源顶点外的任意顶点) 的距离 distances[u]
    predecessors, // 前溯点 predecessors[u]，用来推导出从 v 到其他每个顶点 u 的最短路径
  };
};

const shortestPathA = BFS(graph, myVertices[0]);
console.log(shortestPathA);
// distances: {A: 0, B: 1, C: 1, D: 1, E: 2, F: 2, G: 2, H: 2 , I: 3},
// predecessors: {A: null, B: "A", C: "A", D: "A", E: "B", F: "B", G: "C", H: "D", I: "E"}

const fromVertex = myVertices[0]; // {9}

for (i = 1; i < myVertices.length; i++) {
  // {10}
  const toVertex = myVertices[i]; // {11}
  // 创建一个栈
  const path = new Stack(); // {12}
  // 获取当前节点，然后获取当前节点的前溯点，一级级向上直到查找到源顶点
  for (let v = toVertex; v !== fromVertex; v = shortestPathA.predecessors[v]) {
    // {13}
    path.push(v); // {14}
  }
  path.push(fromVertex); // {15}
  let s = path.pop(); // {16}
  while (!path.isEmpty()) {
    // {17}
    s += ' - ' + path.pop(); // {18}
  }
  console.log(s); // {19}
}
// A - B
// A - C
// A - D
// A - B - E
// A - B - F
// A - C - G
// A - D - H
// A - B - E - I
```

_深入学习最短路径算法_
Dijkstra 算法解决了单源最短路径问题。
Bellman-Ford 算法解决了边权值为负的单源最短路径问题。
A\*搜索算法解决了求仅一对顶点间的最短路径问题，用经验法则来加速搜索过程。
Floyd-Warshall 算法解决了求所有顶点对之间的最短路径这一问题

**深度优先搜索**
深度优先搜索算法将会从第一个指定的顶点开始遍历图，沿着路径直到这条路径最后一个顶点被访问了，接着原路回退并探索下一条路径。换句话说，它是先深度后广度地访问顶点
![graph-8](graph-8.png)

深度优先搜索算法不需要一个源顶点。在深度优先搜索算法中，若图中顶点 v 未访问，则访问该顶点 v。
_步骤_
(1) 标注 v 为被发现的（灰色）；
(2) 对于 v 的所有未访问（白色）的邻点 w，访问顶点 w；
(3) 标注 v 为已被探索的（黑色）。

深度优先搜索的步骤是递归的，这意味着深度优先搜索算法使用栈来存储函数调用（由递归调用所创建的栈）

```javascript
const depthFirstSearch = (graph, callback) => {
  // {1}
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices);
  for (let i = 0; i < vertices.length; i++) {
    // {2}
    if (color[vertices[i]] === Colors.WHITE) {
      // {3}
      depthFirstSearchVisit(vertices[i], color, adjList, callback); // {4}
    }
  }
};
const depthFirstSearchVisit = (u, color, adjList, callback) => {
  color[u] = Colors.GREY; // {5}
  if (callback) {
    // {6}
    callback(u);
  }
  const neighbors = adjList.get(u); // {7}
  for (let i = 0; i < neighbors.length; i++) {
    // {8}
    const w = neighbors[i]; // {9}
    if (color[w] === Colors.WHITE) {
      // {10}
      depthFirstSearchVisit(w, color, adjList, callback); // {11}
    }
  }
  color[u] = Colors.BLACK; // {12}
};

depthFirstSearch(graph, printVertex);
// Visited vertex: A
// Visited vertex: B
// Visited vertex: E
// Visited vertex: I
// Visited vertex: F
// Visited vertex: C
// Visited vertex: D
// Visited vertex: G
// Visited vertex: H
```

![graph-9](graph-9.png)

_Angular（版本 2+）在探测变更（验证 HTML 模板是否需要更新）方面使用的算法和深度优先搜索算法非常相似。_

_探索深度优先算法_
对于给定的图 G，我们希望深度优先搜索算法遍历图 G 的所有节点，构建“森林”（有根树的一个集合）以及一组源顶点（根），并输出两个数组：发现时间和完成探索时间。

```javascript
export const DFS = (graph) => {
  const vertices = graph.getVertices();
  const adjList = graph.getAdjList();
  const color = initializeColor(vertices);
  const d = {};
  const f = {};
  const p = {};
  const time = { count: 0 }; // {1}
  for (let i = 0; i < vertices.length; i++) {
    // {2}
    f[vertices[i]] = 0;
    d[vertices[i]] = 0;
    p[vertices[i]] = null;
  }
  for (let i = 0; i < vertices.length; i++) {
    if (color[vertices[i]] === Colors.WHITE) {
      DFSVisit(vertices[i], color, d, f, p, time, adjList);
    }
  }
  return {
    // {3}
    discovery: d, // 顶点 u 的发现时间 d[u]；
    finished: f, // 当顶点 u 被标注为黑色时，u 的完成探索时间 f[u]；
    predecessors: p, // 顶点 u 的前溯点 p[u]
  };
};
const DFSVisit = (u, color, d, f, p, time, adjList) => {
  color[u] = Colors.GREY;
  d[u] = ++time.count; // {4}
  const neighbors = adjList.get(u);
  for (let i = 0; i < neighbors.length; i++) {
    const w = neighbors[i];
    if (color[w] === Colors.WHITE) {
      p[w] = u; // {5}
      DFSVisit(w, color, d, f, p, time, adjList);
    }
  }
  color[u] = Colors.BLACK;
  f[u] = ++time.count; // {6}
};
```

(1)时间（time）变量值的范围只可能在图顶点数量的一倍到两倍（2|V|）之间；
(2)对于所有的顶点 u，d[u] < f[u] (意味着，发现时间的值比完成时间的值小，完成时间意思是所有顶点都已经被探索过了)。
在这两个假设下，我们有如下的规则。
_1 <= d [u] < f [u] <= 2|V|_
如果对同一个图再跑一遍新的深度优先搜索方法，对图中每个顶点，我们会得到如下的发现/完成时间
![graph-10](graph-10.png)

**拓扑排序——使用深度优先搜索**
![graph-11](graph-11.png)
有向无环图（DAG）

需要编排一些任务或步骤的执行顺序时，称为拓扑排序（topological sorting，英文亦写作 topsort 或是 toposort）

_拓扑排序只能应用于 DAG_

```javascript
graph = new Graph(true); // 有向图
myVertices = ['A', 'B', 'C', 'D', 'E', 'F'];
for (i = 0; i < myVertices.length; i++) {
  graph.addVertex(myVertices[i]);
}
graph.addEdge('A', 'C');
graph.addEdge('A', 'D');
graph.addEdge('B', 'D');
graph.addEdge('B', 'E');
graph.addEdge('C', 'F');
graph.addEdge('F', 'E');
const result = DFS(graph);
```

![graph-12](graph-12.png)

```javascript
const fTimes = result.finished;
s = '';
for (let count = 0; count < myVertices.length; count++) {
  let max = 0;
  let maxName = null;
  for (i = 0; i < myVertices.length; i++) {
    if (fTimes[myVertices[i]] > max) {
      max = fTimes[myVertices[i]];
      maxName = myVertices[i];
    }
  }
  s += ' - ' + maxName;
  delete fTimes[maxName];
}
console.log(s);
// B - A - D - C - F - E
```

###### 最短路径算法

_Dijkstra 算法_
Dijkstra 算法是一种计算从单个源到所有其他源的最短路径的贪心算法，这意味着我们可以用它来计算从图的一个顶点到其余各顶点的最短路径。

![graph-13](graph-13.png)

```javascript
var graph = [
  [0, 2, 4, 0, 0, 0],
  [0, 0, 1, 4, 2, 0],
  [0, 0, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 2],
  [0, 0, 0, 3, 0, 2],
  [0, 0, 0, 0, 0, 0],
];
// JavaScript 最大的数 INF = Number.MAX_SAFE_INTEGER
const INF = Number.MAX_SAFE_INTEGER;
const dijkstra = (graph, src) => {
  const dist = [];
  const visited = [];
  const { length } = graph;
  for (let i = 0; i < length; i++) {
    // {1}
    dist[i] = INF; // 把所有的距离（dist）初始化为无限大
    visited[i] = false;
  }
  dist[src] = 0; // {2} 把源顶点到自己的距离设为 0
  for (let i = 0; i < length - 1; i++) {
    // {3}
    const u = minDistance(dist, visited); // {4} 从尚未处理的顶点中选出距离最近的顶点
    visited[u] = true; // {5} 把选出的顶点标为 visited，以免重复计算
    for (let v = 0; v < length; v++) {
      if (
        !visited[v] &&
        graph[u][v] !== 0 &&
        dist[u] !== INF &&
        dist[u] + graph[u][v] < dist[v]
      ) {
        // 如果找到更短的路径，则更新最短路径的值
        // {6}
        dist[v] = dist[u] + graph[u][v]; // {7}
      }
    }
  }
  return dist; // {8}
};

const minDistance = (dist, visited) => {
  let min = INF;
  let minIndex = -1;
  for (let v = 0; v < dist.length; v++) {
    if (visited[v] === false && dist[v] <= min) {
      min = dist[v];
      minIndex = v;
    }
  }
  return minIndex;
};

// 0 0
// 1 2
// 2 4
// 3 6
// 4 4
// 5 6
```

**Floyd-Warshall 算法**
Floyd-Warshall 算法是一种计算图中所有最短路径的动态规划算法。通过该算法，我们可以找出从所有源到所有顶点的最短路径。

```javascript
const floydWarshall = (graph) => {
  const dist = [];
  const { length } = graph;
  for (let i = 0; i < length; i++) {
    // {1}
    dist[i] = [];
    for (let j = 0; j < length; j++) {
      if (i === j) {
        dist[i][j] = 0; // {2}
      } else if (!isFinite(graph[i][j])) {
        // 如果两个顶点之间没有边，就将其表示为 Infinity
        dist[i][j] = Infinity; // {3}
      } else {
        // 为 i 到 j 可能的最短距离就是这些顶点间的权值
        dist[i][j] = graph[i][j]; // {4}
      }
    }
  }
  // 将顶点 0 到 k 作为中间点（行{5}），从 i 到 j 的最短路径经过 k。
  for (let k = 0; k < length; k++) {
    // {5}
    for (let i = 0; i < length; i++) {
      for (let j = 0; j < length; j++) {
        // 计算通过顶点 k 的 i 和 j 之间的最短路径
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          // {6}
          dist[i][j] = dist[i][k] + dist[k][j]; // {7}
        }
      }
    }
  }
  return dist;
};
// 0 2 4 6 4 6
// INF 0 2 4 2 4
// INF INF 0 6 3 5
// INF INF INF 0 INF 2
// INF INF INF 3 0 2
// INF INF INF INF INF 0
```

###### 最小生成树(MST)

**Prim 算法**
Prim 算法是一种求解加权无向连通图的 MST 问题的贪心算法。它能找出一个边的子集，使得其构成的树包含图中所有顶点，且边的权值之和最小。

```javascript
var graph = [
  [0, 2, 4, 0, 0, 0],
  [2, 0, 2, 4, 2, 0],
  [4, 2, 0, 0, 3, 0],
  [0, 4, 0, 0, 3, 2],
  [0, 2, 3, 3, 0, 2],
  [0, 0, 0, 2, 2, 0],
];

const INF = Number.MAX_SAFE_INTEGER;
const prim = (graph) => {
  const parent = [];
  const key = [];
  const visited = [];
  const { length } = graph;
  // 把所有顶点（key）初始化为无限大
  for (let i = 0; i < length; i++) {
    // {1}
    key[i] = INF;
    visited[i] = false;
  }
  // 选择第一个 key 作为第一个顶点，同时，因为第一个顶点总是 MST 的根节点，所以 parent[0] = -1
  key[0] = 0; // {2}
  parent[0] = -1;
  for (let i = 0; i < length - 1; i++) {
    // {3}
    // 从未处理的顶点集合中选出 key 值最小的顶点（与 Dijkstra 算法中使用的minDistance 函数一样，只是名字不同）
    const u = minKey(graph, key, visited); // {4}
    visited[u] = true; // {5}
    for (let v = 0; v < length; v++) {
      // 如果得到更小的权值，则保存 MST 路径（parent）并更新其权值
      if (graph[u][v] && !visited[v] && graph[u][v] < key[v]) {
        // {6}
        parent[v] = u; // {7}
        key[v] = graph[u][v]; // {8}
      }
    }
  }
  return parent; // {9}
};

const minDistance = (dist, key, visited) => {
  let min = INF;
  let minIndex = -1;
  for (let v = 0; v < dist[key].length; v++) {
    if (visited[v] === false && dist[key][v] <= min) {
      min = dist[key][v];
      minIndex = v;
    }
  }
  return minIndex;
};

// Edge Weight
// 0 - 1 2
// 1 - 2 2
// 5 - 3 2
// 1 - 4 2
// 4 - 5 2
```

**Kruskal 算法**
是一种求加权无向连通图的 MST 的贪心算法

```javascript
const kruskal = (graph) => {
  const { length } = graph;
  const parent = [];
  let ne = 0;
  let a;
  let b;
  let u;
  let v;
  // 首先，把邻接矩阵的值复制到 cost 数组，以方便修改且可以保留原始值
  const cost = initializeCost(graph); // {1}
  // 当 MST 的边数小于顶点总数减 1 时
  while (ne < length - 1) {
    // 找出权值最小的边
    for (let i = 0, min = INF; i < length; i++) {
      // {3}
      for (let j = 0; j < length; j++) {
        if (cost[i][j] < min) {
          min = cost[i][j];
          a = u = i;
          b = v = j;
        }
      }
    }
    // 检查 MST 中是否已存在这条边，以避免环路
    u = find(u, parent); // {4}
    v = find(v, parent); // {5}
    // 如果 u 和 v 是不同的边，则将其加入 MST
    if (union(u, v, parent)) {
      // {6}
      ne++;
    }
    // ：从列表中移除这些边，以免重复计算
    cost[a][b] = cost[b][a] = INF; // {7}
  }
  return parent;
};

const find = (i, parent) => {
  while (parent[i]) {
    i = parent[i];
  }
  return i;
};
const union = (i, j, parent) => {
  if (i !== j) {
    parent[j] = i;
    return true;
  }
  return false;
};
```
