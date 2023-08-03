---
title: 数据结构与算法阅读笔记(7)
date: 2022-10-13 16:13:40
tags:
---

#### 算法设计与技巧

###### 分而治之

将一个问题分成多个和原问题相似的小问题，递归解决小问题，再将解决方式合并以解决原来的问题

分而治之算法可以分成三个部分。
(1) 分解原问题为多个子问题（原问题的多个小实例）。
(2) 解决子问题，用返回解决子问题的方式的递归算法。递归算法的基本情形可以用来解决子问题。
(3) 组合这些子问题的解决方式，得到原问题的解。
<!-- more -->
**二分搜索**
分解：计算 mid 并搜索数组较小或较大的一半。
解决：在较小或较大的一半中搜索值。
合并：这步不需要，因为我们直接返回了索引值。

```javascript
function binarySearchRecursive(
  array,
  value,
  low,
  high,
  compareFn = defaultCompare
) {
  if (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const element = array[mid];
    if (compareFn(element, value) === Compare.LESS_THAN) {
      // {1}
      return binarySearchRecursive(array, value, mid + 1, high, compareFn);
    } else if (compareFn(element, value) === Compare.BIGGER_THAN) {
      // {2}
      return binarySearchRecursive(array, value, low, mid - 1, compareFn);
    } else {
      return mid; // {3}
    }
  }
  return DOES_NOT_EXIST; // {4}
}
export function binarySearch(array, value, compareFn = defaultCompare) {
  const sortedArray = quickSort(array);
  const low = 0;
  const high = sortedArray.length - 1;
  return binarySearchRecursive(array, value, low, high, compareFn);
}
```

![technology-1](technology-1.png)

**动态规划**
动态规划（dynamic programming，DP）是一种将复杂问题分解成更小的子问题来解决的优化技术。

_注意，动态规划和分而治之是不同的方法。分而治之方法是把问题分解成相互独立的子问题，然后组合它们的答案，而动态规划则是将问题分解成相互依赖的子问题。_

步骤：
(1) 定义子问题；
(2) 实现要反复执行来解决子问题的部分；
(3) 识别并求解出基线条件。

_能用动态规划解决的一些著名问题如下。_
(1)背包问题：给出一组项，各自有值和容量，目标是找出总值最大的项的集合。这个问题的限制是，总容量必须小于等于“背包”的容量。
(2)最长公共子序列：找出一组序列的最长公共子序列（可由另一序列删除元素但不改变余下元素的顺序而得到）。
(3)矩阵链相乘：给出一系列矩阵，目标是找到这些矩阵相乘的最高效办法（计算次数尽可能少）。相乘运算不会进行，解决方案是找到这些矩阵各自相乘的顺序。
(4)硬币找零：给出面额为 d1, …, dn 的一定数量的硬币和要找零的钱数，找出有多少种找零的方法。
(5)图的全源最短路径：对所有顶点对(u, v)，找出从顶点 u 到顶点 v 的最短路径。(Floyd-Warshall 算法)

_最少硬币找零问题_
最少硬币找零问题是硬币找零问题的一个变种。硬币找零问题是给出要找零的钱数，以及可用的硬币面额 d1, …, dn 及其数量，找出有多少种找零方法。最少硬币找零问题是给出要找零的钱数，以及可用的硬币面额 d1, …, dn 及其数量，找到所需的最少的硬币个数。

```javascript
// coins 硬币面额的数组
function minCoinChange(coins, amount) {
  const cache = []; // {1}
  const makeChange = (value) => {
    // {2}
    if (!value) {
      // {3}
      return [];
    }
    if (cache[value]) {
      // {4}
      return cache[value];
    }
    let min = [];
    let newMin;
    let newAmount;
    for (let i = 0; i < coins.length; i++) {
      // {5}
      const coin = coins[i];
      newAmount = value - coin; // {6}
      if (newAmount >= 0) {
        newMin = makeChange(newAmount); // {7}
      }
      if (
        newAmount >= 0 && // {8}
        (newMin.length < min.length - 1 || !min.length) && // {9}
        (newMin.length || !newAmount) // {10}
      ) {
        min = [coin].concat(newMin); // {11}
        console.log('new Min ' + min + ' for ' + amount);
      }
    }
    return (cache[value] = min); // {12}
  };
  return makeChange(amount); // {13}
}
```

_背包问题_
背包问题是一个组合优化问题。它可以描述如下：给定一个固定大小、能够携重量 W 的背包，以及一组有价值和重量的物品，找出一个最佳解决方案，使得装入背包的物品总重量不超过 W，且总价值最大。

```javascript
function knapSack(capacity, weights, values, n) {
  const kS = [];
  // 初始化将用于寻找解决方案的矩阵
  for (let i = 0; i <= n; i++) {
    kS[i] = [];
  }
  for (let i = 0; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (i === 0 || w === 0) {
        // {2}
        kS[i][w] = 0;
      } else if (weights[i - 1] <= w) {
        // 。物品 i 的重量必须小于约束
        const a = values[i - 1] + kS[i - 1][w - weights[i - 1]];
        const b = kS[i - 1][w];
        // 当找到可以构成解决方案的物品时，选择价值最大的那个
        kS[i][w] = a > b ? a : b; // {4} max(a,b)
      } else {
        kS[i][w] = kS[i - 1][w]; // {5}
      }
    }
  }
  findValues(n, capacity, kS, weights, values); // {6} 增加的代码
  return kS[n][capacity]; // {7}
}

function findValues(n, capacity, kS, weights, values) {
  let i = n;
  let k = capacity;
  console.log('构成解的物品：');
  while (i > 0 && k > 0) {
    if (kS[i][k] !== kS[i - 1][k]) {
      console.log(
        `物品 ${i} 可以是解的一部分 w,v: ${weights[i - 1]}, ${values[i - 1]}`
      );
      i--;
      k -= kS[i][k];
    } else {
      i--;
    }
  }
}
```

![technology-2](technology-2.png)

_最长公共子序列(LCS)_
找出两个字符串序列的最长子序列的长度。最长子序列是指，在两个字符串序列中以相同顺序出现，但不要求连续（非字符串子串）的字符串序列。
![technology-3](technology-3.png)

```javascript
function lcs(wordX, wordY) {
  const m = wordX.length;
  const n = wordY.length;
  const l = [];
  for (let i = 0; i <= m; i++) {
    l[i] = []; // {1}
    // solution[i] = [];
    for (let j = 0; j <= n; j++) {
      l[i][j] = 0; // {2}
      // solution[i][j] = '0';
    }
  }
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i === 0 || j === 0) {
        l[i][j] = 0;
      } else if (wordX[i - 1] === wordY[j - 1]) {
        l[i][j] = l[i - 1][j - 1] + 1; // {3}
        // solution[i][j] = 'diagonal';
      } else {
        const a = l[i - 1][j];
        const b = l[i][j - 1];
        l[i][j] = a > b ? a : b; // {4} max(a,b)
        // solution[i][j]=(l[i][j] == l[i-1][j]) ? 'top' : 'left';
      }
    }
  }
  return l[m][n]; // {5}
  // printSolution(solution, wordX, m, n);
}

function printSolution(solution, wordX, m, n) {
  let a = m;
  let b = n;
  let x = solution[a][b];
  let answer = '';
  while (x !== '0') {
    if (solution[a][b] === 'diagonal') {
      answer = wordX[a - 1] + answer;
      a--;
      b--;
    } else if (solution[a][b] === 'left') {
      b--;
    } else if (solution[a][b] === 'top') {
      a--;
    }
    x = solution[a][b];
  }
  console.log('lcs: ' + answer);
}
```

![technology-4](technology-4.png)

_矩阵链相乘_
要找出一组矩阵相乘的最佳方式（顺序）

A*B*C\*D 的乘法

A 是一个 10 行 100 列的矩阵；
B 是一个 100 行 5 列的矩阵；
C 是一个 5 行 50 列的矩阵；
D 是一个 50 行 1 列的矩阵；
A*B*C\*D 的结果是一个 10 行 1 列的矩阵

(1) (A(B(CD)))：乘法运算的次数是 1750 次。
(2) ((AB)(CD))：乘法运算的次数是 5300 次。
(3) (((AB)C)D)：乘法运算的次数是 8000 次。
(4) ((A(BC))D)：乘法运算的次数是 75 500 次。
(5) (A((BC)D))：乘法运算的次数是 31 000 次。

```javascript
function matrixChainOrder(p) {
  const n = p.length;
  const m = [];
  const s = [];
  for (let i = 1; i <= n; i++) {
    m[i] = [];
    m[i][i] = 0;
  }

  //   const s = [];
  // for (let i = 0; i <= n; i++){
  //  s[i] = [];
  //  for (let j=0; j <= n; j++){
  //  s[i][j] = 0;
  //  }
  // }

  for (let l = 2; l < n; l++) {
    for (let i = 1; i <= n - l + 1; i++) {
      const j = i + l - 1;
      m[i][j] = Number.MAX_SAFE_INTEGER;
      for (let k = i; k <= j - 1; k++) {
        const q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j]; // {1}
        if (q < m[i][j]) {
          m[i][j] = q; // {2}
          // s[i][j] = k;
        }
      }
    }
  }
  return m[1][n - 1]; // {3}
  // printOptimalParenthesis(s, 1, n-1);
}

function printOptimalParenthesis(s, i, j) {
  if (i === j) {
    console.log('A[' + i + ']');
  } else {
    console.log('(');
    printOptimalParenthesis(s, i, s[i][j]);
    printOptimalParenthesis(s, s[i][j] + 1, j);
    console.log(')');
  }
}
// (A[1](A[2](A[3]A[4]))) => (A(B(CD)))
```

###### 贪心算法

贪心算法遵循一种近似解决问题的技术，期盼通过每个阶段的局部最优选择（当前最好的解），从而达到全局的最优（全局最优解）。它不像动态规划算法那样计算更大的格局。

**最少硬币找零问题**

```javascript
function minCoinChange(coins, amount) {
  const change = [];
  let total = 0;
  for (let i = coins.length; i >= 0; i--) {
    // {1}
    const coin = coins[i];
    while (total + coin <= amount) {
      // {2}
      change.push(coin); // {3}
      total += coin; // {4}
    }
  }
  return change;
}
```

![technology-5](technology-5.png)

_比起动态规划算法而言，贪心算法更简单、更快。然而，它并不总是得到最优答案。但是综合来看，它相对执行时间来说，输出了一个可以接受的解。_

**分数背包问题**

```javascript
function knapSack(capacity, weights, values) {
  const n = values.length;
  let load = 0;
  let val = 0;
  for (let i = 0; i < n && load < capacity; i++) {
    // {1}
    if (weights[i] <= capacity - load) {
      // {2}
      val += values[i];
      load += weights[i];
    } else {
      const r = (capacity - load) / weights[i]; // {3}
      val += r * values[i];
      load += weights[i];
    }
  }
  return val;
}
```

###### 回溯算法

回溯是一种渐进式寻找并构建问题解决方式的策略。我们从一个可能的动作开始并试着用这个动作解决问题。如果不能解决，就回溯并选择另一个动作直到将问题解决。根据这种行为，回溯算法会尝试所有可能的动作（如果更快找到了解决办法就尝试较少的次数）来解决问题。

**迷宫老鼠问题**

```javascript
export function ratInAMaze(maze) {
  const solution = [];
  // 每个位置初始化为零
  for (let i = 0; i < maze.length; i++) {
    // {1}
    solution[i] = [];
    for (let j = 0; j < maze[i].length; j++) {
      solution[i][j] = 0;
    }
  }
  if (findPath(maze, 0, 0, solution) === true) {
    // {2}
    return solution;
  }
  return 'NO PATH FOUND'; // {3}
}

function findPath(maze, x, y, solution) {
  const n = maze.length;
  if (x === n - 1 && y === n - 1) {
    // {4}
    solution[x][y] = 1;
    return true;
  }
  if (isSafe(maze, x, y) === true) {
    // {5}
    solution[x][y] = 1; // {6}
    if (findPath(maze, x + 1, y, solution)) {
      // {7}
      return true;
    }
    if (findPath(maze, x, y + 1, solution)) {
      // {8}
      return true;
    }
    solution[x][y] = 0; // {9}
    return false;
  }
  return false; // {10}
}

function isSafe(maze, x, y) {
  const n = maze.length;
  if (x >= 0 && y >= 0 && x < n && y < n && maze[x][y] !== 0) {
    return true; // {11}
  }
  return false;
}

const maze = [
  [1, 0, 0, 0],
  [1, 1, 1, 1],
  [0, 0, 1, 0],
  [0, 1, 1, 1],
];
console.log(ratInAMaze(maze));
[
  [1, 0, 0, 0],
  [1, 1, 1, 0],
  [0, 0, 1, 0],
  [0, 0, 1, 1],
];
```

**数独解题器**

```javascript
function sudokuSolver(matrix) {
  if (solveSudoku(matrix) === true) {
    return matrix;
  }
  return '问题无解！';
}

const UNASSIGNED = 0;
function solveSudoku(matrix) {
  let row = 0;
  let col = 0;
  let checkBlankSpaces = false;
  for (row = 0; row < matrix.length; row++) {
    // {1}
    for (col = 0; col < matrix[row].length; col++) {
      if (matrix[row][col] === UNASSIGNED) {
        checkBlankSpaces = true; // {2}
        break;
      }
    }
    if (checkBlankSpaces === true) {
      // {3}
      break;
    }
  }
  if (checkBlankSpaces === false) {
    return true; // {4}
  }
  for (let num = 1; num <= 9; num++) {
    // {5}
    if (isSafe(matrix, row, col, num)) {
      // {6}
      matrix[row][col] = num; // {7}
      if (solveSudoku(matrix)) {
        // {8}
        return true;
      }
      matrix[row][col] = UNASSIGNED; // {9}
    }
  }
  return false; // {10}
}
function isSafe(matrix, row, col, num) {
  return (
    !usedInRow(matrix, row, num) &&
    !usedInCol(matrix, col, num) &&
    !usedInBox(matrix, row - (row % 3), col - (col % 3), num)
  );
}

function usedInRow(matrix, row, num) {
  for (let col = 0; col < matrix.length; col++) {
    // {11}
    if (matrix[row][col] === num) {
      return true;
    }
  }
  return false;
}
function usedInCol(matrix, col, num) {
  for (let row = 0; row < matrix.length; row++) {
    // {12}
    if (matrix[row][col] === num) {
      return true;
    }
  }
  return false;
}
function usedInBox(matrix, boxStartRow, boxStartCol, num) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (matrix[row + boxStartRow][col + boxStartCol] === num) {
        // {13}
        return true;
      }
    }
  }
  return false;
}

const sudokuGrid = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];
console.log(sudokuSolver(sudokuGrid));
[
  [5, 3, 4, 6, 7, 8, 9, 1, 2],
  [6, 7, 2, 1, 9, 5, 3, 4, 8],
  [1, 9, 8, 3, 4, 2, 5, 6, 7],
  [8, 5, 9, 7, 6, 1, 4, 2, 3],
  [4, 2, 6, 8, 5, 3, 7, 9, 1],
  [7, 1, 3, 9, 2, 4, 8, 5, 6],
  [9, 6, 1, 5, 3, 7, 2, 8, 4],
  [2, 8, 7, 4, 1, 9, 6, 3, 5],
  [3, 4, 5, 2, 8, 6, 1, 7, 9],
];
```

###### 函数式编程(FP)简介

**函数式编程与命令式编程**

```javascript
// 命令式编程
const printArray = function (array) {
  for (var i = 0; i < array.length; i++) {
    console.log(array[i]);
  }
};
printArray([1, 2, 3, 4, 5]);

// 函数式编程
const forEach = function (array, action) {
  for (var i = 0; i < array.length; i++) {
    action(array[i]);
  }
};
const logItem = function (item) {
  console.log(item);
};
forEach([1, 2, 3, 4, 5], logItem);
```

_注意：_
(1)函数式编程的主要目标是描述数据，以及要对数据应用的转换。
(2)在函数式编程中，程序执行顺序的重要性很低；而在命令式编程中，步骤和顺序是非常重要的。
(3)函数和数据集合是函数式编程的核心。
(4)在函数式编程中，我们可以使用和滥用函数和递归；而在命令式编程中，则使用循环、赋值、条件和函数。
(5)在函数式编程中，要避免副作用和可变数据，意味着我们不会修改传入函数的数据。如果需要基于输入返回一个解决方案，可以制作一个副本并返回数据修改后的副本。

**JavaScript 函数式类库和数据结构**
Underscode.js：http://underscorejs.org/
Bilby.js：http://bilby.brianmckenna.org/
Lazy.js：http://danieltao.com/lazy.js/
Bacon.js：https://baconjs.github.io/
Fn.js：http://eliperelman.com/fn.js/
Functional.js：http://functionaljs.com/
Ramda.js：http://ramdajs.com/0.20.1/index.html
Mori：http://swannodette.github.io/mori/

JavaScript 函数式编程：https://www.packtpub.com/web-development/functional-programming-javascript

#### 算法复杂度

###### 大 O 表示法

用于描述算法的性能和复杂程度。
大 O 表示法将算法按照消耗的时间进行分类，依据随输入增大所需要的空间/内存。

| 符 号        | 名 称        |
| ------------ | ------------ |
| O(1)         | 常数的       |
| O(log(n))    | 对数的       |
| O((log(n))c) | 对数多项式的 |
| O(n)         | 线性的       |
| O(n^2)       | 二次的       |
| O(n^c)       | 多项式的     |
| O(c^n)       | 指数的       |

**理解大 O 表示法**

衡量算法的效率：通常是用资源，例如 CPU（时间）占用、内存占用、硬盘占用和网络占用。当讨论大 O 表示法时，一般考虑的是 CPU（时间）占用。

1. O(1)

```javascript
function increment(num) {
  return ++num;
}
```

假设运行 increment(1)函数，执行时间等于 X。如果再用不同的参数（例如 2）运行一次 increment 函数，执行时间依然是 X。和参数无关，increment 函数的性能都一样。因此，我们说上述函数的复杂度是 O(1)（常数）

2. O(n)

函数执行的总开销取决于数组元素的个数（数组大小），而且也和搜索的值有关。如果是查找数组中存在的值，查找运算执行次数由值的位置决定。如果查找的是数组中不存在的值，查找运算就会执行和数组大小一样多次，这就是通常所说的最坏情况。最坏情况下，如果数组大小是 10，开销就是 10；如果数组大小是 1000，开销就是 1000。可以得出 sequentialSearch 函数的时间复杂度是 O(n)，n 是（输入）数组的大小。

以顺序搜索算法为例

```javascript
function sequentialSearch(array, value, equalsFn = defaultEquals) {
  for (let i = 0; i < array.length; i++) {
    if (equalsFn(value, array[i])) {
      // {1}
      return i;
    }
  }
  return -1;
}

function sequentialSearch(array, value, equalsFn = defaultEquals) {
  let cost = 0;
  for (let i = 0; i < array.length; i++) {
    cost++;
    if (equalsFn(value, array[i])) {
      return i;
    }
  }
  console.log(
    `cost for sequentialSearch with input size ${array.length} is ${cost}`
  );
  return -1;
}
```

3. O(n^2)

以冒泡排序为例

```javascript
function bubbleSort(array, compareFn = defaultCompare) {
  const { length } = array;
  for (let i = 0; i < length; i++) {
    // {1}
    for (let j = 0; j < length - 1; j++) {
      // {2}
      if (compareFn(array[j], array[j + 1]) === Compare.BIGGER_THAN) {
        swap(array, j, j + 1);
      }
    }
  }
  return array;
}

// 假设行{1}和行{2}的开销分别是 1。修改算法的实现使之计算开销。
function bubbleSort(array, compareFn = defaultCompare) {
  const { length } = array;
  let cost = 0;
  for (let i = 0; i < length; i++) {
    // {1}
    cost++;
    for (let j = 0; j < length - 1; j++) {
      // {2}
      cost++;
      if (compareFn(array[j], array[j + 1]) === Compare.BIGGER_THAN) {
        swap(array, j, j + 1);
      }
    }
  }
  console.log(`cost for bubbleSort with input size ${length} is ${cost}`);
  return array;
}
```

如果用大小为 10 的数组执行 bubbleSort，开销是 100（10^2）。如果用大小为 100 的数组执行bubbleSort，开销就是 10 000（100^2）。需要注意，我们每次增加输入的大小，执行都会越来越久

*时间复杂度 O(n)的代码只有一层循环，而 O(n^2)的代码有双层嵌套循环。如果算法有三层迭代数组的嵌套循环，它的时间复杂度很可能就是 O(n^3)*

**时间复杂度比较**

| 输入大小（n） | O(1) | O(log(n)) | O(n)   | O(nlog(n)) | O(n^2)      | O(2^n)    |
| ------------- | ---- | --------- | ------ | ---------- | ----------- | --------- |
| 10            | 1    | 1         | 10     | 10         | 100         | 1024      |
| 20            | 1    | 1.30      | 20     | 26.02      | 400         | 1 048 576 |
| 50            | 1    | 1.69      | 50     | 84.94      | 2500        | 非常大    |
| 100           | 1    | 2         | 100    | 200        | 10 000      | 非常大    |
| 500           | 1    | 2.69      | 500    | 1349.48    | 250 000     | 非常大    |
| 1000          | 1    | 3         | 1000   | 3000       | 1 000 000   | 非常大    |
| 10 000        | 1    | 4         | 10 000 | 40 000     | 100 000 000 | 非常大    |

不同的大 O 表示法的消耗

![big-o-1](big-o-1.png)

*常用数据结构的时间复杂度*
![big-o-2](big-o-2.png)

*图的时间复杂度*
![big-o-3](big-o-3.png)

*排序算法的时间复杂度*
![big-o-4](big-o-4.png)

*搜索算法的时间复杂度*
![big-o-5](big-o-5.png)

**NP 完全理论概述**
一般来说，如果一个算法的复杂度为 O(n^k)，其中 k 是常数，我们就认为这个算法是高效的，这就是多项式算法.

对于给定的问题，如果存在多项式算法，则计为 P（polynomial，多项式）

NP（nondeterministic polynomial，非确定性多项式）算法。如果一个问题可以在多项式时间内验证解是否正确，则计为 NP

如果一个问题存在多项式算法，自然可以在多项式时间内验证其解。因此，所有的 P 都是NP。然而，P = NP 是否成立，仍然不得而知。

NP 问题中最难的是 NP 完全问题。如果满足以下两个条件，则称决策问题 L 是 NP 完全的：
(1) L 是 NP 问题，也就是说，可以在多项式时间内验证解，但还没有找到多项式算法；
(2) 所有的 NP 问题都能在多项式时间内归约为 L。

为了理解问题的归约，考虑两个决策问题 L和 M。假设算法 A可以解决问题 L，算法 B可以验证输入 y是否为 M的解。目标是找到一个把 L转化为 M的方法，使得算法 B可以用于构造算法 A。

还有一类问题，只需满足 NP 完全问题的第二个条件，称为 NP 困难问题。因此，NP 完全问题也是 NP 困难问题的子集。

下面是满足 P<>NP 时，P、NP、NP 完全和 NP 困难问题的欧拉图。
![big-o-6](big-o-6.png)

非 NP 完全的 NP 困难问题的例子有停机问题和布尔可满足性问题（SAT）。

NP 完全问题的例子有子集和问题、旅行商问题、顶点覆盖问题，等等。

以上问题，具体可查看：https://en.wikipedia.org/wiki/NP-completeness

*不可解问题与启发式算法*
有些问题是不可解的。然而，仍然有办法在符合要求的时间内找到一个近似解。
启发式算法就是其中之一。启发式算法得到的未必是最优解，但足够解决问题了。
启发式算法的例子有局部搜索、遗传算法、启发式导航、机器学习等。
详情请查阅 https://en.wikipedia.org/wiki/Heuristic_(computer_science)

UVa Online Judge（http://uva.onlinejudge.org/）
Sphere Online Judge（http://www.spoj.com/）
Coderbyte（http://coderbyte.com/）
Project Euler（https://projecteuler.net/）
HackerRank（https://www.hackerrank.com）
CodeChef（http://www.codechef.com/）
Top Coder（http://www.topcoder.com/）


#### 疑问点
尾调用优化
- 调用栈长
- 使用后性能有较大的提升
Floyd-Warshall 算法
Kruskal 算法
背包问题
最长公共子序列
矩阵链相乘
NP 完全理论
- 多项式时间

算法的使用，什么情况下用合适？需要将数据转换处理
合适

自己写的算法怎么验证正确性？
LeetCode或其他刷题网站

antd升级后的visible修改任务
评估修改时间
testing-library/react测试react组件的库，安装了却没用？
umc-ui的项目框架使用的是别的项目的，原来就有，没删