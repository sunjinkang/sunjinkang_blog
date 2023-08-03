---
title: 数据结构与算法阅读笔记(4)
date: 2022-10-08 13:25:18
tags:
---

#### 递归

递归是一种解决问题的方法，它从解决问题的各个小部分开始，直到解决最初的大问题。递归通常涉及函数调用自身。

每个递归函数都必须有基线条件，即一个不再递归调用的条件（停止点），以防止无限递归。
<!-- more -->
```javascript
function understandRecursion(doIunderstandRecursion) {
  const recursionAnswer = confirm('Do you understand recursion?');
  if (recursionAnswer === true) {
    // 基线条件或停止点
    return true;
  }
  understandRecursion(recursionAnswer); // 递归调用
}
```

###### 计算一个数的阶乘

数 n 的阶乘，定义为 n!，表示从 1 到 n 的整数的乘积。
5 的阶乘表示为 5!，和 5 × 4 × 3 × 2 × 1 相等，结果是 120
(1)迭代阶乘
(n) _ (n - 1) _ (n - 2) _ (n - 3) _ ... \* 1

```javascript
function factorialIterative(number) {
  if (number < 0) return undefined;
  let total = 1;
  for (let n = number; n > 1; n--) {
    total = total * n;
  }
  return total;
}
console.log(factorialIterative(5)); // 120
```

(2)递归阶乘

```javascript
function factorial(n) {
  if (n === 1 || n === 0) {
    // 基线条件
    return 1;
  }
  return n * factorial(n - 1); // 递归调用
}
console.log(factorial(5)); // 120
```

![factorial](factorial.png)

如果忘记加上用以停止函数递归调用的基线条件，递归并不会无限地执行下去，浏览器会抛出错误，也就是所谓的栈溢出错误（stack overflow error）

**测试浏览器最大调用栈大小**

```javascript
let i = 0;
function recursiveFn() {
  i++;
  recursiveFn();
}
try {
  recursiveFn();
} catch (ex) {
  console.log('i = ' + i + ' error: ' + ex);
}
```

**ECMAScript 2015 有尾调用优化（tail call optimization）。如果函数内的最后一个操作是调用函数（就像示例中加粗的那行），会通过“跳转指令”（jump）而不是“子程序调用”（subroutine call）来控制。也就是说，在 ECMAScript 2015 中，这里的代码可以一直执行下去。因此，具有停止递归的基线条件非常重要。**
有关尾调用优化的更多相关信息，请访问 https://www.chromestatus.com/feature/
5516876633341952

###### 斐波那契数列

(1)位置 0 的斐波那契数是零
(2)1 和 2 的斐波那契数是 1
(3)n（此处 n > 2）的斐波那契数是（n - 1）的斐波那契数加上（n - 2）的斐波那契数

**迭代求斐波那契数**

```javascript
function fibonacciIterative(n) {
  if (n < 1) return 0;
  if (n <= 2) return 1;
  let fibNMinus2 = 0;
  let fibNMinus1 = 1;
  let fibN = n;
  for (let i = 2; i <= n; i++) {
    // n >= 2
    fibN = fibNMinus1 + fibNMinus2; // f(n-1) + f(n-2)
    fibNMinus2 = fibNMinus1;
    fibNMinus1 = fibN;
  }
  return fibN;
}
fibonacciIterative(9); // 34
```

**递归求斐波那契数**

```javascript
function fibonacci(n) {
  if (n < 1) return 0; // {1}
  if (n <= 2) return 1; // {2}
  return fibonacci(n - 1) + fibonacci(n - 2); // {3}
}
fibonacci(9); // 34
```

**记忆化斐波那契数**

```javascript
function fibonacciMemoization(n) {
  const memo = [0, 1]; // {1}
  const fibonacci = (n) => {
    if (memo[n] != null) return memo[n]; // {2}
    return (memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo)); // {3}
  };
  return fibonacci(n);
}
fibonacciMemoization(9); // 34
```

迭代的版本比递归的版本快很多，所以这表示递归更慢。但是，递归版本更容易理解，需要的代码通常也更少。另外，对一些算法来说，迭代的解法可能不可用，而且有了尾调用优化，递归的多余消耗甚至可能被消除

#### 树数据结构

###### 树的相关术语

一个树结构包含一系列存在父子关系的节点。每个节点都有一个父节点（除了顶部的第一个节点）以及零个或多个子节点

位于树顶部的节点叫作根节点。它没有父节点。
树中的每个元素都叫作节点，节点分为内部节点和外部节点。
至少有一个子节点的节点称为内部节点。
没有子元素的节点称为外部节点或叶节点。

一个节点可以有祖先和后代。
一个节点（除了根节点）的祖先包括父节点、祖父节点、曾祖父节点等。
一个节点的后代包括子节点、孙子节点、曾孙节点等。

子树：子树由节点和它的后代构成。

节点的一个属性是深度，节点的深度取决于它的祖先节点的数量。

树的高度取决于所有节点深度的最大值。一棵树也可以被分解成层级。根节点在第 0 层，它的子节点在第 1 层，以此类推。
![tree](tree.png)

###### 二叉树和二叉搜索树

二叉树中的节点最多只能有两个子节点：一个是左侧子节点，另一个是右侧子节点。这个定义有助于我们写出更高效地在树中插入、查找和删除节点的算法。二叉树在计算机科学中的应用非常广泛。

二叉搜索树（BST）是二叉树的一种，但是只允许你在左侧节点存储（比父节点）小的值，在右侧节点存储（比父节点）大的值。
![binary-search-tree](binary-search-tree.png)

通过指针（引用）来表示节点之间的关系（树相关的术语称其为边）
键是树相关的术语中对节点的称呼

**中序遍历**
![in-order-traverse](in-order-traverse.png)
**先序遍历**
![pre-order-traverse](pre-order-traverse.png)
**后序遍历**
![post-order-traverse](post-order-traverse.png)

```javascript
export class Node {
  constructor(key) {
    this.key = key; // {1} 节点值
    this.left = null; // 左侧子节点引用
    this.right = null; // 右侧子节点引用
  }
}

import { Compare, defaultCompare } from '../util';
import { Node } from './models/node';
export default class BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    this.compareFn = compareFn; // 用来比较节点值
    this.root = null; // {1} Node 类型的根节点
  }
  // 向二叉搜索树中插入一个键
  insert(key) {
    if (this.root == null) {
      // {1}
      this.root = new Node(key); // {2}
    } else {
      this.insertNode(this.root, key); // {3}
    }
  }
  insertNode(node, key) {
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      // {4}
      if (node.left == null) {
        // {5}
        node.left = new Node(key); // {6}
      } else {
        this.insertNode(node.left, key); // {7}
      }
    } else {
      if (node.right == null) {
        // {8}
        node.right = new Node(key); // {9}
      } else {
        this.insertNode(node.right, key); // {10}
      }
    }
  }
  // 中序遍历
  // 中序遍历是一种以上行顺序访问 BST 所有节点的遍历方式，也就是以从最小到最大的顺序访问所有节点。
  // 中序遍历的一种应用就是对树进行排序操作。
  inOrderTraverse(callback) {
    this.inOrderTraverseNode(this.root, callback); // {1}
  }
  inOrderTraverseNode(node, callback) {
    if (node != null) {
      // {2}
      this.inOrderTraverseNode(node.left, callback); // {3}
      callback(node.key); // {4}
      this.inOrderTraverseNode(node.right, callback); // {5}
    }
  }
  // 先序遍历
  // 先序遍历是以优先于后代节点的顺序访问每个节点的。先序遍历的一种应用是打印一个结构化的文档
  preOrderTraverse(callback) {
    this.preOrderTraverseNode(this.root, callback);
  }
  preOrderTraverseNode(node, callback) {
    if (node != null) {
      callback(node.key); // {1}
      this.preOrderTraverseNode(node.left, callback); // {2}
      this.preOrderTraverseNode(node.right, callback); // {3}
    }
  }
  // 后序遍历
  // 后序遍历则是先访问节点的后代节点，再访问节点本身。后序遍历的一种应用是计算一个目录及其子目录中所有文件所占空间的大小
  postOrderTraverse(callback) {
    this.postOrderTraverseNode(this.root, callback);
  }
  postOrderTraverseNode(node, callback) {
    if (node != null) {
      this.postOrderTraverseNode(node.left, callback); // {1}
      this.postOrderTraverseNode(node.right, callback); // {2}
      callback(node.key); // {3}
    }
  }
  // 搜索最小值和最大值
  min() {
    return this.minNode(this.root); // {1}
  }
  minNode(node) {
    let current = node;
    while (current != null && current.left != null) {
      // {2}
      current = current.left; // {3}
    }
    return current; // {4}
  }
  max() {
    return this.maxNode(this.root);
  }
  maxNode(node) {
    let current = node;
    while (current != null && current.right != null) {
      // {5}
      current = current.right;
    }
    return current;
  }
  // 搜索一个特定的值
  search(key) {
    return this.searchNode(this.root, key); // {1}
  }
  searchNode(node, key) {
    if (node == null) {
      // {2}
      return false;
    }
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      // {3}
      return this.searchNode(node.left, key); // {4}
    } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      // {5}
      return this.searchNode(node.right, key); // {6}
    } else {
      return true; // {7}
    }
  }
  // 移除一个节点
  remove(key) {
    this.root = this.removeNode(this.root, key); // {1}
  }
  removeNode(node, key) {
    if (node == null) {
      // {2}
      return null;
    }
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      // {3}
      node.left = this.removeNode(node.left, key); // {4}
      return node; // {5}
    } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      // {6}
      node.right = this.removeNode(node.right, key); // {7}
      return node; // {8}
    } else {
      // 键等于 node.key
      // 第一种情况: 该节点是一个没有左侧或右侧子节点的叶节点
      if (node.left == null && node.right == null) {
        // {9}
        node = null; // {10}
        return node; // {11}
      }
      // 第二种情况: 移除有一个左侧子节点或右侧子节点的节点
      if (node.left == null) {
        // {12}
        node = node.right; // {13}
        return node; // {14}
      } else if (node.right == null) {
        // {15}
        node = node.left; // {16}
        return node; // {17}
      }
      // 第三种情况: 具体流程可查看后续文章
      const aux = this.minNode(node.right); // {18}
      node.key = aux.key; // {19}
      node.right = this.removeNode(node.right, aux.key); // {20}
      return node; // {21}
    }
  }
}
```

**移除有两个子节点的节点**
要移除的节点有两个子节点——左侧子节点和右侧子节点。要移除有两个子节点的节点，需要执行四个步骤。
(1) 当找到了要移除的节点后，需要找到它右边子树中最小的节点（它的继承者——行{18}）。
(2) 然后，用它右侧子树中最小节点的键去更新这个节点的值（行{19}）。通过这一步，我们
改变了这个节点的键，也就是说它被移除了。
(3) 但是，这样在树中就有两个拥有相同键的节点了，这是不行的。要继续把右侧子树中的
最小节点移除，毕竟它已经被移至要移除的节点的位置了（行{20}）。
(4) 最后，向它的父节点返回更新后节点的引用（行{21}）。
![remove-left-right](remove-left-right.png)

###### 自平衡树

Adelson-Velskii-Landi 树（AVL 树）
AVL 树是一种自平衡二叉搜索树，意思是任何一个节点左右两侧子树的高度之差最多为 1。

在 AVL 树中，需要对每个节点计算右子树高度（hr）和左子树高度（hl）之间的差值，该值（hr－hl）应为 0、1 或-1。如果结果不是这三个值之一，则需要平衡该 AVL 树。这就是平衡因子的概念

```javascript
const BalanceFactor = {
  UNBALANCED_RIGHT: 1,
  SLIGHTLY_UNBALANCED_RIGHT: 2,
  BALANCED: 3,
  SLIGHTLY_UNBALANCED_LEFT: 4,
  UNBALANCED_LEFT: 5,
};

class AVLTree extends BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    super(compareFn);
    this.compareFn = compareFn;
    this.root = null;
  }
  // 节点的高度和平衡因子
  getNodeHeight(node) {
    if (node == null) {
      return -1;
    }
    return (
      Math.max(this.getNodeHeight(node.left), this.getNodeHeight(node.right)) +
      1
    );
  }
  getBalanceFactor(node) {
    const heightDifference =
      this.getNodeHeight(node.left) - this.getNodeHeight(node.right);
    switch (heightDifference) {
      case -2:
        return BalanceFactor.UNBALANCED_RIGHT;
      case -1:
        return BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT;
      case 1:
        return BalanceFactor.SLIGHTLY_UNBALANCED_LEFT;
      case 2:
        return BalanceFactor.UNBALANCED_LEFT;
      default:
        return BalanceFactor.BALANCED;
    }
  }
  rotationLL(node) {
    const tmp = node.left; // {1}
    node.left = tmp.right; // {2}
    tmp.right = node; // {3}
    return tmp;
  }
  rotationRR(node) {
    const tmp = node.right; // {1}
    node.right = tmp.left; // {2}
    tmp.left = node; // {3}
    return tmp;
  }
  rotationLR(node) {
    node.left = this.rotationRR(node.left);
    return this.rotationLL(node);
  }
  rotationRL(node) {
    node.right = this.rotationLL(node.right);
    return this.rotationRR(node);
  }
  //  向 AVL 树插入节点
  insert(key) {
    this.root = this.insertNode(this.root, key);
  }
  insertNode(node, key) {
    // 像在 BST 树中一样插入节点
    if (node == null) {
      return new Node(key);
    } else if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      node.left = this.insertNode(node.left, key);
    } else if (this.compareFn(key, node.key) === Compare.BIGGER_THAN) {
      node.right = this.insertNode(node.right, key);
    } else {
      return node; // 重复的键
    }
    // 如果需要，将树进行平衡操作
    const balanceFactor = this.getBalanceFactor(node); // {1}
    if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) {
      // {2}
      if (this.compareFn(key, node.left.key) === Compare.LESS_THAN) {
        // {3}
        node = this.rotationLL(node); // {4}
      } else {
        return this.rotationLR(node); // {5}
      }
    }
    if (balanceFactor === BalanceFactor.UNBALANCED_RIGHT) {
      // {6}
      if (this.compareFn(key, node.right.key) === Compare.BIGGER_THAN) {
        // {7}
        node = this.rotationRR(node); // {8}
      } else {
        return this.rotationRL(node); // {9}
      }
    }
    return node;
  }
  // 从 AVL 树中移除节点
  removeNode(node, key) {
    node = super.removeNode(node, key); // {1}
    if (node == null) {
      return node; // null，不需要进行平衡
    }
    // 检测树是否平衡
    const balanceFactor = this.getBalanceFactor(node); // {2}
    if (balanceFactor === BalanceFactor.UNBALANCED_LEFT) {
      // {3}
      const balanceFactorLeft = this.getBalanceFactor(node.left); // {4}
      if (
        balanceFactorLeft === BalanceFactor.BALANCED ||
        balanceFactorLeft === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT
      ) {
        // {5}
        return this.rotationLL(node); // {6}
      }
      if (balanceFactorLeft === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT) {
        // {7}
        return this.rotationLR(node.left); // {8}
      }
    }
    if (balanceFactor === BalanceFactor.UNBALANCED_RIGHT) {
      // {9}
      const balanceFactorRight = this.getBalanceFactor(node.right); // {10}
      if (
        balanceFactorRight === BalanceFactor.BALANCED ||
        balanceFactorRight === BalanceFactor.SLIGHTLY_UNBALANCED_RIGHT
      ) {
        // {11}
        return this.rotationRR(node); // {12}
      }
      if (balanceFactorRight === BalanceFactor.SLIGHTLY_UNBALANCED_LEFT) {
        // {13}
        return this.rotationRL(node.right); // {14}
      }
    }
    return node;
  }
}
```

**平衡操作——AVL 旋转**
(1)左-左（LL）：向右的单旋转
这种情况出现于节点的左侧子节点的高度大于右侧子节点的高度时，并且左侧子节点也是平衡或左侧较重的
![left-left-1](left-left-1.png)
![left-left-2](left-left-2.png)

rotationLL 方法
与平衡操作相关的节点有三个（X、Y、Z），将节点 X 置于节点 Y（平衡因子为+2）所在的位置（行{1}）；
节点 X 的左子树保持不变；
将节点 Y 的左子节点置为节点 X 的右子节点 Z（行{2}）；
将节点 X 的右子节点置为节点 Y（行{3}）

(2)右-右（RR）：向左的单旋转
右  右的情况和左  左的情况相反。它出现于右侧子节点的高度大于左侧子节点的高度，并且右侧子节点也是平衡或右侧较重的
![right-right-1](right-right-1.png)
![right-right-2](right-right-2.png)

rotationRR 方法
与平衡操作相关的节点有三个（X、Y、Z），将节点 X 置于节点 Y（平衡因子为 2）所在的位置（行{1}）；
节点 X 的右子树保持不变；
将节点 Y 的右子节点置为节点 X 的左子节点 Z（行{2}）；
将节点 X 的左子节点置为节点 Y（行{3}）

(3)左-右（LR）：向右的双旋转
这种情况出现于左侧子节点的高度大于右侧子节点的高度，并且左侧子节点右侧较重。在这种情况下，我们可以对左侧子节点进行左旋转来修复，这样会形成左-左的情况，然后再对不平衡的节点进行一个右旋转来修复
![left-right-1](left-right-1.png)
![left-right-2](left-right-2.png)

rotationLR 方法
将节点 X 置于节点 Y（平衡因子为 2）所在的位置；
将节点 Z 的左子节点置为节点 X 的右子节点；
将节点 Y 的右子节点置为节点 X 的左子节点；
将节点 X 的右子节点置为节点 Y；
将节点 X 的左子节点置为节点 Z

(4)右-左（RL）：向左的双旋转
右-左的情况和左  右的情况相反。这种情况出现于右侧子节点的高度大于左侧子节点的高度，并且右侧子节点左侧较重。在这种情况下我们可以对右侧子节点进行右旋转来修复，这样会形成右  右的情况，然后我们再对不平衡的节点进行一个左旋转来修复
![right-left-1](right-left-1.png)
![right-left-2](right-left-2.png)

rotationRL 方法
将节点 X 置于节点 Y（平衡因子为+2）所在的位置；
将节点 Y 的左子节点置为节点 X 的右子节点；
将节点 Z 的右子节点置为节点 X 的左子节点；
将节点 X 的左子节点置为节点 Y；
将节点 X 的右子节点置为节点 Z

###### 红黑树

包含多次插入和删除的自平衡树，红黑树是比较好的。如果插入和删除频率较低（我们更需要多次进行搜索操作），那么 AVL 树比红黑树更好

在红黑树中，每个节点都遵循以下规则：
(1) 顾名思义，每个节点不是红的就是黑的；
(2) 树的根节点是黑的；
(3) 所有叶节点都是黑的（用 NULL 引用表示的节点）；
(4) 如果一个节点是红的，那么它的两个子节点都是黑的；
(5) 不能有两个相邻的红节点，一个红节点不能有红的父节点或子节点；
(6) 从给定的节点到它的后代节点（NULL 叶节点）的所有路径包含相同数量的黑色节点。

```javascript
class RedBlackNode extends Node {
  constructor(key) {
    super(key);
    this.key = key;
    this.color = Colors.RED; // {6}
    this.parent = null; // {7}
  }
  isRed() {
    return this.color === Colors.RED;
  }
}

class RedBlackTree extends BinarySearchTree {
  constructor(compareFn = defaultCompare) {
    super(compareFn);
    this.compareFn = compareFn;
    this.root = null;
  }
  insert(key: T) {
    if (this.root == null) {
      // {1}
      this.root = new RedBlackNode(key); // {2}
      this.root.color = Colors.BLACK; // {3}
    } else {
      const newNode = this.insertNode(this.root, key); // {4}
      this.fixTreeProperties(newNode); // {5}
    }
  }
  insertNode(node, key) {
    if (this.compareFn(key, node.key) === Compare.LESS_THAN) {
      if (node.left == null) {
        node.left = new RedBlackNode(key);
        node.left.parent = node; // {8}
        return node.left; // {9}
      } else {
        return this.insertNode(node.left, key);
      }
    } else if (node.right == null) {
      node.right = new RedBlackNode(key);
      node.right.parent = node; // {10}
      return node.right; // {11}
    } else {
      return this.insertNode(node.right, key);
    }
  }
  fixTreeProperties(node) {
    while (
      node &&
      node.parent &&
      node.parent.color.isRed() && // {1}
      node.color !== Colors.BLACK
    ) {
      // {2}
      let parent = node.parent; // {3}
      const grandParent = parent.parent; // {4}
      // 情形 A：父节点是左侧子节点
      if (grandParent && grandParent.left === parent) {
        // {5}
        const uncle = grandParent.right; // {6}
        // 情形 1A：叔节点也是红色——只需要重新填色
        if (uncle && uncle.color === Colors.RED) {
          // {7}
          grandParent.color = Colors.RED;
          parent.color = Colors.BLACK;
          uncle.color = Colors.BLACK;
          node = grandParent; // {8}
        } else {
          // 情形 2A：节点是右侧子节点——左旋转
          if (node === parent.right) {
            this.rotationRR(parent); // {12}
            node = parent; // {13}
            parent = node.parent; // {14}
          }
          // 情形 3A：节点是左侧子节点——右旋转
          this.rotationLL(grandParent); // {15}
          parent.color = Colors.BLACK; // {16}
          grandParent.color = Colors.RED; // {17}
          node = parent; // {18}
        }
      } else {
        // 情形 B：父节点是右侧子节点
        const uncle = grandParent.left; // {9}
        // 情形 1B：叔节点是红色——只需要重新填色
        if (uncle && uncle.color === Colors.RED) {
          // {10}
          grandParent.color = Colors.RED;
          parent.color = Colors.BLACK;
          uncle.color = Colors.BLACK;
          node = grandParent;
        } else {
          // 情形 2B：节点是左侧子节点——左旋转
          if (node === parent.left) {
            this.rotationLL(parent); // {19}
            node = parent;
            parent = node.parent;
          }
          // 情形 3B：节点是右侧子节点——左旋转
          this.rotationRR(grandParent); // {20}
          parent.color = Colors.BLACK;
          grandParent.color = Colors.RED;
          node = parent;
        }
      }
    }
    this.root.color = Colors.BLACK; // {11}
  }
  rotationLL(node) {
    const tmp = node.left;
    node.left = tmp.right;
    if (tmp.right && tmp.right.key) {
      tmp.right.parent = node;
    }
    tmp.parent = node.parent;
    if (!node.parent) {
      this.root = tmp;
    } else {
      if (node === node.parent.left) {
        node.parent.left = tmp;
      } else {
        node.parent.right = tmp;
      }
    }
    tmp.right = node;
    node.parent = tmp;
  }
  rotationRR(node) {
    const tmp = node.right;
    node.right = tmp.left;
    if (tmp.left && tmp.left.key) {
      tmp.left.parent = node;
    }
    tmp.parent = node.parent;
    if (!node.parent) {
      this.root = tmp;
    } else {
      if (node === node.parent.left) {
        node.parent.left = tmp;
      } else {
        node.parent.right = tmp;
      }
    }
    tmp.left = node;
    node.parent = tmp;
  }
}
```

左-左（LL）：父节点是祖父节点的左侧子节点，节点是父节点的左侧子节点（情形 3A）。
左-右（LR）：父节点是祖父节点的左侧子节点，节点是父节点的右侧子节点（情形 2A）。
右-右（RR）：父节点是祖父节点的右侧子节点，节点是父节点的右侧子节点（情形 2A）。
右-左（RL）：父节点是祖父节点的右侧子节点，节点是父节点的左侧子节点（情形 2A）。
![red-black-2a](red-black-2a.png)
![red-black-3a](red-black-3a.png)
![red-black-2b](red-black-2b.png)
![red-black-3b](red-black-3b.png)
