---
title: 数据结构与算法阅读笔记(6)
date: 2022-10-13 14:15:28
cover: https://cdn.pixabay.com/photo/2017/05/26/08/59/moon-2345575_640.jpg
tags:
---

#### 排序和搜索算法

###### 排序算法

**冒泡排序**
冒泡排序(_复杂度是 O(n2)_)比较所有相邻的两个项，如果第一个比第二个大，则交换它们。元素项向上移动至正确的顺序，就好像气泡升至表面一样，冒泡排序因此得名。
<!-- more -->
```javascript
function defaultCompare(a, b) {
  return a < b ? Compare.LESS_THAN : Compare.BIGGER_THAN;
}
function bubbleSort(array, compareFn = defaultCompare) {
  const { length } = array; // {1}
  for (let i = 0; i < length; i++) {
    // {2}
    for (let j = 0; j < length - 1; j++) {
      // {3}
      if (compareFn(array[j], array[j + 1]) === Compare.BIGGER_THAN) {
        // {4}
        swap(array, j, j + 1); // {5}
      }
    }
  }
  return array;
}

function swap(array, a, b) {
  /* const temp = array[a]; 
 array[a] = array[b]; 
 array[b] = temp; */ // 经典方式
  [array[a], array[b]] = [array[b], array[a]]; // ES2015 的方式
}
```

{% asset_img sort-1.png sort-1 %}
_改进后的冒泡排序_

```javascript
function modifiedBubbleSort(array, compareFn = defaultCompare) {
  const { length } = array;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length - 1 - i; j++) {
      // {1}
      if (compareFn(array[j], array[j + 1]) === Compare.BIGGER_THAN) {
        swap(array, j, j + 1);
      }
    }
  }
  return array;
}
```

{% asset_img sort-2.png sort-2 %}

**选择排序**
选择排序算法(_复杂度为 O(n2)_)是一种原址比较排序算法。选择排序大致的思路是找到数据结构中的最小值并将其放置在第一位，接着找到第二小的值并将其放在第二位，以此类推.

```javascript
function selectionSort(array, compareFn = defaultCompare) {
  const { length } = array; // {1}
  let indexMin;
  for (let i = 0; i < length - 1; i++) {
    // {2}
    indexMin = i; // {3}
    for (let j = i; j < length; j++) {
      // {4}
      if (compareFn(array[indexMin], array[j]) === Compare.BIGGER_THAN) {
        // {5}
        indexMin = j; // {6}
      }
    }
    if (i !== indexMin) {
      // {7}
      swap(array, i, indexMin);
    }
  }
  return array;
}
```

{% asset_img sort-3.png sort-3 %}

**插入排序**
插入排序每次排一个数组项，以此方式构建最后的排序数组。假定第一项已经排序了。接着，它和第二项进行比较——第二项是应该待在原位还是插到第一项之前呢？这样，头两项就已正确排序，接着和第三项比较（它是该插入到第一、第二还是第三的位置呢），以此类推.

```javascript
function insertionSort(array, compareFn = defaultCompare) {
  const { length } = array; // {1}
  let temp;
  for (let i = 1; i < length; i++) {
    // {2}
    let j = i; // {3}
    temp = array[i]; // {4}
    while (j > 0 && compareFn(array[j - 1], temp) === Compare.BIGGER_THAN) {
      // {5}
      array[j] = array[j - 1]; // {6}
      j--;
    }
    array[j] = temp; // {7}
  }
  return array;
}
```

{% asset_img sort-4.png sort-4 %}
_排序小型数组时，插入排序算法比选择排序和冒泡排序性能要好。_

**归并排序**
归并排序是第一个可以实际使用的排序算法。前三个排序算法性能不好，但归并排序性能不错，其复杂度为 O(nlog(n))。

_JavaScript 的 Array 类定义了一个 sort 函数（Array.prototype.sort）用以排序 JavaScript 数组（我们不必自己实现这个算法）。ECMAScript 没有定义用哪个排序算法，所以浏览器厂商可以自行去实现算法。例如，Mozilla Firefox 使用归并排序作为 Array.prototype.sort 的实现，而 Chrome（V8 引擎）使用了一个快速排序的变体。_

归并排序是一种分而治之算法。其思想是将原始数组切分成较小的数组，直到每个小数组只有一个位置，接着将小数组归并成较大的数组，直到最后只有一个排序完毕的大数组。

由于是分治法，归并排序也是递归的。将算法分为两个函数：第一个负责将一个大数组分为多个小数组并调用用来排序的辅助函数。

```javascript
function mergeSort(array, compareFn = defaultCompare) {
  if (array.length > 1) {
    // {1}
    const { length } = array;
    const middle = Math.floor(length / 2); // {2}
    const left = mergeSort(array.slice(0, middle), compareFn); // {3}
    const right = mergeSort(array.slice(middle, length), compareFn); // {4}
    array = merge(left, right, compareFn); // {5}
  }
  return array;
}

function merge(left, right, compareFn) {
  let i = 0; // {6}
  let j = 0;
  const result = [];
  while (i < left.length && j < right.length) {
    // {7}
    result.push(
      compareFn(left[i], right[j]) === Compare.LESS_THAN
        ? left[i++]
        : right[j++]
    ); // {8}
  }
  return result.concat(i < left.length ? left.slice(i) : right.slice(j)); // {9}
}
```

{% asset_img sort-5.png sort-5 %}

**快速排序**
快速排序也许是最常用的排序算法了。它的复杂度为 O(nlog(n))，且性能通常比其他复杂度为 O(nlog(n))的排序算法要好。和归并排序一样，快速排序也使用分而治之的方法，将原始数组分为较小的数组（但它没有像归并排序那样将它们分割开）

(1) 首先，从数组中选择一个值作为主元（pivot），也就是数组中间的那个值。
(2) 创建两个指针（引用），左边一个指向数组第一个值，右边一个指向数组最后一个值。移动左指针直到我们找到一个比主元大的值，接着，移动右指针直到找到一个比主元小的值，然后交换它们，重复这个过程，直到左指针超过了右指针。这个过程将使得比主元小的值都排在主元之前，而比主元大的值都排在主元之后。这一步叫作划分（partition）操作。
(3) 接着，算法对划分后的小数组（较主元小的值组成的子数组，以及较主元大的值组成的子数组）重复之前的两个步骤，直至数组已完全排序。

```javascript
function quickSort(array, compareFn = defaultCompare) {
  return quick(array, 0, array.length - 1, compareFn);
}

function quick(array, left, right, compareFn) {
  let index; // {1}
  if (array.length > 1) {
    // {2}
    index = partition(array, left, right, compareFn); // {3}
    if (left < index - 1) {
      // {4}
      quick(array, left, index - 1, compareFn); // {5}
    }
    if (index < right) {
      // {6}
      quick(array, index, right, compareFn); // {7}
    }
  }
  return array;
}

function partition(array, left, right, compareFn) {
  // 选择中间值作为主元
  const pivot = array[Math.floor((right + left) / 2)]; // {8}
  let i = left; // {9}
  let j = right; // {10}
  while (i <= j) {
    // {11}
    while (compareFn(array[i], pivot) === Compare.LESS_THAN) {
      // {12}
      i++;
    }
    while (compareFn(array[j], pivot) === Compare.BIGGER_THAN) {
      // {13}
      j--;
    }
    if (i <= j) {
      // {14}
      swap(array, i, j); // {15}
      i++;
      j--;
    }
  }
  return i; // {16}
}
```

划分操作的第一次执行
{% asset_img sort-6.png sort-6 %}
对有较小值的子数组执行的划分操作
{% asset_img sort-7.png sort-7 %}
针对有较大值的子数组
{% asset_img sort-8.png sort-8 %}
{% asset_img sort-9.png sort-9 %}
{% asset_img sort-10.png sort-10 %}

**计数排序**
计数排序是一个分布式排序。分布式排序使用已组织好的辅助数据结构（称为桶），然后进行合并，得到排好序的数组。计数排序使用一个用来存储每个元素在原始数组中出现次数的临时数组。在所有元素都计数完成后，临时数组已排好序并可迭代以构建排序后的结果数组

它是用来排序整数的优秀算法（它是一个整数排序算法），时间复杂度为 O(n+k)，其中 k 是临时计数数组的大小；但是，它确实需要更多的内存来存放临时数组。

```javascript
function countingSort(array) {
  if (array.length < 2) {
    // {1}
    return array;
  }
  const maxValue = findMaxValue(array); // {2}
  const counts = new Array(maxValue + 1); // {3}
  array.forEach((element) => {
    if (!counts[element]) {
      // {4}
      counts[element] = 0;
    }
    counts[element]++; // {5}
  });
  let sortedIndex = 0;
  counts.forEach((count, i) => {
    while (count > 0) {
      // {6}
      array[sortedIndex++] = i; // {7}
      count--; // {8}
    }
  });
  return array;
}

function findMaxValue(array) {
  let max = array[0];
  for (let i = 1; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i];
    }
  }
  return max;
}
```

**桶排序**
桶排序（也被称为箱排序）也是分布式排序算法，它将元素分为不同的桶（较小的数组），再使用一个简单的排序算法，例如插入排序（用来排序小数组的不错的算法），来对每个桶进行排序。然后，它将所有的桶合并为结果数组。

_默认情况下，我们会使用 5 个桶。桶排序在所有元素平分到各个桶中时的表现最好。如果元素非常稀疏，则使用更多的桶会更好。如果元素非常密集，则使用较少的桶会更好。_

```javascript
function bucketSort(array, bucketSize = 5) {
  // {1}
  if (array.length < 2) {
    return array;
  }
  // 创建桶并将元素分布到不同的桶中
  const buckets = createBuckets(array, bucketSize); // {2}
  // 对每个桶执行插入排序算法和将所有桶合并为排序后的结果数组
  return sortBuckets(buckets); // {3}
}

function createBuckets(array, bucketSize) {
  let minValue = array[0];
  let maxValue = array[0];
  for (let i = 1; i < array.length; i++) {
    // {4}
    if (array[i] < minValue) {
      minValue = array[i];
    } else if (array[i] > maxValue) {
      maxValue = array[i];
    }
  }
  // 计算每个桶中需要分布的元素个数
  const bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1; // {5}
  const buckets = [];
  for (let i = 0; i < bucketCount; i++) {
    // 初始化每个桶
    buckets[i] = [];
  }
  for (let i = 0; i < array.length; i++) {
    // {7}
    const bucketIndex = Math.floor((array[i] - minValue) / bucketSize); // {8}
    buckets[bucketIndex].push(array[i]);
  }
  return buckets;
}

function sortBuckets(buckets) {
  const sortedArray = []; // {9}
  for (let i = 0; i < buckets.length; i++) {
    // {10}
    if (buckets[i] != null) {
      insertionSort(buckets[i]); // {11}
      sortedArray.push(...buckets[i]); // {12}
    }
  }
  return sortedArray;
}
```

{% asset_img sort-11.png sort-11 %}

**基数排序**
基数排序也是一个分布式排序算法，它根据数字的有效位或基数（这也是它为什么叫基数排序）将整数分布到桶中。基数是基于数组中值的记数制的。

```javascript
function radixSort(array, radixBase = 10) {
  if (array.length < 2) {
    return array;
  }
  const minValue = findMinValue(array);
  const maxValue = findMaxValue(array);
  let significantDigit = 1; // {1}
  while ((maxValue - minValue) / significantDigit >= 1) {
    // {2}
    array = countingSortForRadix(array, radixBase, significantDigit, minValue); // {3}
    significantDigit *= radixBase; // {4}
  }
  return array;
}

function countingSortForRadix(array, radixBase, significantDigit, minValue) {
  let bucketsIndex;
  const buckets = [];
  const aux = [];
  for (let i = 0; i < radixBase; i++) {
    // {5}
    buckets[i] = 0;
  }
  for (let i = 0; i < array.length; i++) {
    // 基于数组中数的有效位（行{7}）进行计数排序
    bucketsIndex = Math.floor(
      ((array[i] - minValue) / significantDigit) % radixBase
    ); // {7}
    buckets[bucketsIndex]++; // {8}
  }
  for (let i = 1; i < radixBase; i++) {
    // 计算累积结果来得到正确的计数值
    buckets[i] += buckets[i - 1];
  }
  for (let i = array.length - 1; i >= 0; i--) {
    // {10}
    bucketsIndex = Math.floor(
      ((array[i] - minValue) / significantDigit) % radixBase
    ); // {11}
    aux[--buckets[bucketsIndex]] = array[i]; // {12}
  }
  for (let i = 0; i < array.length; i++) {
    // {13}
    array[i] = aux[i];
  }
  return array;
}
```

{% asset_img sort-12.png sort-12 %}

###### 搜索算法

**顺序搜索**
顺序或线性搜索是最基本的搜索算法。它的机制是，将每一个数据结构中的元素和我们要找的元素做比较。顺序搜索是最低效的一种搜索算法

```javascript
const DOES_NOT_EXIST = -1;
function sequentialSearch(array, value, equalsFn = defaultEquals) {
  for (let i = 0; i < array.length; i++) {
    // {1}
    if (equalsFn(value, array[i])) {
      // {2}
      return i; // {3}
    }
  }
  return DOES_NOT_EXIST; // {4}
}
```

{% asset_img search-1.png search-1 %}

**二分搜索**
个算法要求被搜索的数据结构已排序。以下是该算法遵循的步骤。
(1) 选择数组的中间值。
(2) 如果选中值是待搜索值，那么算法执行完毕（值找到了）。
(3) 如果待搜索值比选中值要小，则返回步骤 1 并在选中值左边的子数组中寻找（较小）。
(4) 如果待搜索值比选中值要大，则返回步骤 1 并在选种值右边的子数组中寻找（较大）。

```javascript
function binarySearch(array, value, compareFn = defaultCompare) {
  const sortedArray = quickSort(array); // {1}
  let low = 0; // {2}
  let high = sortedArray.length - 1; // {3}
  while (lesserOrEquals(low, high, compareFn)) {
    // {4}
    const mid = Math.floor((low + high) / 2); // {5}
    const element = sortedArray[mid]; // {6}
    if (compareFn(element, value) === Compare.LESS_THAN) {
      // {7}
      low = mid + 1; // {8}
    } else if (compareFn(element, value) === Compare.BIGGER_THAN) {
      // {9}
      high = mid - 1; // {10}
    } else {
      return mid; // {11}
    }
  }
  return DOES_NOT_EXIST; // {12}
}

function lesserOrEquals(a, b, compareFn) {
  const comp = compareFn(a, b);
  return comp === Compare.LESS_THAN || comp === Compare.EQUALS;
}
```

{% asset_img search-2.png search-2 %}

**内插搜索**
内插搜索是改良版的二分搜索。二分搜索总是检查 mid 位置上的值，而内插搜索可能会根据要搜索的值检查数组中的不同地方。

算法要求被搜索的数据结构已排序。以下是该算法遵循的步骤

(1) 使用 position 公式选中一个值；
(2) 如果这个值是待搜索值，那么算法执行完毕（值找到了）；
(3) 如果待搜索值比选中值要小，则返回步骤 1 并在选中值左边的子数组中寻找（较小）；
(4) 如果待搜索值比选中值要大，则返回步骤 1 并在选种值右边的子数组中寻找（较大）。

```javascript
function interpolationSearch(
  array,
  value,
  compareFn = defaultCompare,
  equalsFn = defaultEquals,
  diffFn = defaultDiff
) {
  const { length } = array;
  let low = 0;
  let high = length - 1;
  let position = -1;
  let delta = -1;
  while (
    low <= high &&
    biggerOrEquals(value, array[low], compareFn) &&
    lesserOrEquals(value, array[high], compareFn)
  ) {
    /** 如果查找的值更接近 array[high]则查找 position 位置旁更大的值，如果查找的值更接近 array[low]则查找position 位置旁更小的值。这个算法在数组中的值都是均匀分布时性能最好（delta 会非常小） */
    delta = diffFn(value, array[low]) / diffFn(array[high], array[low]);
    position = low + Math.floor((high - low) * delta); // {2}
    if (equalsFn(array[position], value)) {
      // {3}
      return position;
    }
    if (compareFn(array[position], value) === Compare.LESS_THAN) {
      // {4}
      low = position + 1;
    } else {
      high = position - 1;
    }
  }
  return DOES_NOT_EXIST;
}

function lesserOrEquals(a, b, compareFn) {
  const comp = compareFn(a, b);
  return comp === Compare.LESS_THAN || comp === Compare.EQUALS;
}
function biggerOrEquals(a, b, compareFn) {
  const comp = compareFn(a, b);
  return comp === Compare.BIGGER_THAN || comp === Compare.EQUALS;
}
```

{% asset_img search-3.png search-3 %}

###### 随机算法

**Fisher-Yates 随机**
它的含义是迭代数组，从最后一位开始并将当前位置和一个随机位置进行交换。这个随机位置比当前位置小。这样，这个算法可以保证随机过的位置不会再被随机一次（洗扑克牌的次数越多，随机效果越差）

```javascript
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    swap(array, i, randomIndex);
  }
  return array;
}
```

{% asset_img search-4.png search-4 %}
