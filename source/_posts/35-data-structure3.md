---
title: 数据结构与算法阅读笔记(3)
date: 2022-09-29 10:49:51
cover: https://cdn.pixabay.com/photo/2015/04/23/22/01/tree-736887_640.jpg
tags:
---

#### 集合

集合是由一组无序且唯一（即不能重复）的项组成的

###### 创建集合类
<!-- more -->
```javascript
class Set {
  constructor() {
    this.items = {};
  }
  has(element) {
    return element in items;
  }
  // Object 原型有 hasOwnProperty 方法。该方法返回一个表明对象是否具有特定属性的布尔值。
  // in 运算符则返回表示对象在原型链上是否有特定属性的布尔值。
  // has(element) {
  //   return Object.prototype.hasOwnProperty.call(this.items, element);
  // }
  add(element) {
    if (!this.has(element)) {
      this.items[element] = element; // {1}
      return true;
    }
    return false;
  }
  delete(element) {
    if (this.has(element)) {
      delete this.items[element]; // {1}
      return true;
    }
    return false;
  }
  clear() {
    this.items = {}; // {2}
  }
  size() {
    return Object.keys(this.items).length; // {1}
  }
  // sizeLegacy() {
  //  let count = 0;
  //  for(let key in this.items) { // {2}
  // 不能简单地使用 for-in 语句迭代 items 对象的属性，并递增 count 变量
  // 的值，还需要使用 has 方法（以验证 items 对象具有该属性），因为对象的原
  // 型包含了额外的属性（属性既有继承自 JavaScript 的 Object 类的，也有属于对
  // 象自身、未用于数据结构的）
  //  if(this.items.hasOwnProperty(key)) { // {3}
  //  count++; // {4}
  //  }
  //  return count;
  // }
  values() {
    return Object.values(this.items);
  }
  // valuesLegacy() {
  //  let values = [];
  //  for(let key in this.items) { // {1}
  //    if(this.items.hasOwnProperty(key)) {
  //       values.push(key); // {2}
  //    }
  //  }
  //  return values;
  // }
}
```

###### 集合运算

(1)并集：对于给定的两个集合，返回一个包含两个集合中所有元素的新集合。

```javascript
// 没有副作用的方法和函数被称为纯函数。纯函数不会修改当前的实例或参数，只会生成一个新的结果
union(otherSet) {
  const unionSet = new Set(); // {1}
  // 获取第一个集合（当前的 Set 类实例）所有的值（values），迭代并全部添加到代表并集的集合中
  this.values().forEach(value => unionSet.add(value)); // {2}
  otherSet.values().forEach(value => unionSet.add(value)); // {3}
  return unionSet;
}
const setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);
const setB = new Set();
setB.add(3);
setB.add(4);
setB.add(5);
setB.add(6);
const unionAB = setA.union(setB);
console.log(unionAB.values());
// [1,2,3,4,5,6]
```

(2)交集：对于给定的两个集合，返回一个包含两个集合中共有元素的新集合。

```javascript
intersection(otherSet) {
 const intersectionSet = new Set(); // {1}
 const values = this.values();
 for (let i = 0; i < values.length; i++) { // {2}
   if (otherSet.has(values[i])) { // {3}
     intersectionSet.add(values[i]); // {4}
   }
 }
 return intersectionSet;
}

const setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);
const setB = new Set();
setB.add(2);
setB.add(3);
setB.add(4);
const intersectionAB = setA.intersection(setB);
console.log(intersectionAB.values());
// [2,3]

// 优化
intersection(otherSet) {
 const intersectionSet = new Set(); // {1}
 const values = this.values(); // {2}
 const otherValues = otherSet.values(); // {3}
 let biggerSet = values; // {4}
 let smallerSet = otherValues; // {5}

 if (otherValues.length - values.length > 0) { // {6}
   biggerSet = otherValues;
   smallerSet = values;
 }
 smallerSet.forEach(value => { // {7}
   if (biggerSet.includes(value)) {
     intersectionSet.add(value);
   }
 });
 return intersectionSet;
}
```

(3)差集：对于给定的两个集合，返回一个包含所有存在于第一个集合且不存在于第二个集合的元素的新集合。

```javascript
difference(otherSet) {
  const differenceSet = new Set(); // {1}
  this.values().forEach(value => { // {2}
    if (!otherSet.has(value)) { // {3}
      differenceSet.add(value); // {4}
    }
  });
  return differenceSet;
}

const setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);
const setB = new Set();
setB.add(2);
setB.add(3);
setB.add(4);
const differenceAB = setA.difference(setB);
console.log(differenceAB.values());
// [1]
```

(4)子集：验证一个给定集合是否是另一集合的子集

```javascript
isSubsetOf(otherSet) {
  if (this.size() > otherSet.size()) { // {1}
    return false;
  }
  let isSubset = true; // {2}
  // 只要回调函数返回 true，every 方法就会被调用（行{6}）。如果回调函数返回 false，循环会停止
  this.values().every(value => { // {3}
    if (!otherSet.has(value)) { // {4}
      isSubset = false; // {5}
      return false;
    }
    return true; // {6}
  });
  return isSubset; // {7}
}

const setA = new Set();
setA.add(1);
setA.add(2);
const setB = new Set();
setB.add(1);
setB.add(2);
setB.add(3);
const setC = new Set();
setC.add(2);
setC.add(3);
setC.add(4);
console.log(setA.isSubsetOf(setB));
// true
console.log(setA.isSubsetOf(setC));
// false
```

###### 使用扩展运算符

```javascript
// 并集
console.log(new Set([...setA, ...setB]));

// 交集
console.log(new Set([...setA].filter((x) => setB.has(x))));

// 差集
console.log(new Set([...setA].filter((x) => !setB.has(x))));
```

#### 字典和散列表

###### 字典

在字典中，存储的是[键，值]对，其中键名是用来查询特定元素的。
字典和集合很相似，集合以[值，值]的形式存储元素，字典则是以[键，值]的形式来存储元素。
字典也称作映射、符号表或关联数组

```javascript
// util.js
export function defaultToString(item) {
  if (item === null) {
    return 'NULL';
  } else if (item === undefined) {
    return 'UNDEFINED';
  } else if (typeof item === 'string' || item instanceof String) {
    return `${item}`;
  }
  return item.toString(); // {1}
}

class ValuePair {
  constructor(key, value) {
    this.key = key;
    this.value = value;
  }
  toString() {
    return `[#${this.key}: ${this.value}]`;
  }
}

import { defaultToString } from '../util';
export default class Dictionary {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn; // {1}
    this.table = {}; // {2}
  }
  // 检测一个键是否存在于字典中
  hasKey(key) {
    return this.table[this.toStrFn(key)] != null;
  }
  // 在字典和 ValuePair 类中设置键和值
  set(key, value) {
    if (key != null && value != null) {
      const tableKey = this.toStrFn(key); // {1}
      this.table[tableKey] = new ValuePair(key, value); // {2}
      return true;
    }
    return false;
  }
  // 从字典中移除一个值
  remove(key) {
    if (this.hasKey(key)) {
      delete this.table[this.toStrFn(key)];
      return true;
    }
    return false;
  }
  // 从字典中检索一个值
  get(key) {
    const valuePair = this.table[this.toStrFn(key)]; // {1}
    return valuePair == null ? undefined : valuePair.value; // {2}
  }
  keyValues() {
    return Object.values(this.table);
  }
  keys() {
    return this.keyValues().map((valuePair) => valuePair.key);
  }
  values() {
    return this.keyValues().map((valuePair) => valuePair.value);
  }
  forEach(callbackFn) {
    const valuePairs = this.keyValues(); // {1}
    for (let i = 0; i < valuePairs.length; i++) {
      // {2}
      const result = callbackFn(valuePairs[i].key, valuePairs[i].value); // {3}
      if (result === false) {
        break; // {4}
      }
    }
  }
  size() {
    return Object.keys(this.table).length;
  }
  isEmpty() {
    return this.size() === 0;
  }
  clear() {
    this.table = {};
  }
  toString() {
    if (this.isEmpty()) {
      return '';
    }
    const valuePairs = this.keyValues();
    let objString = `${valuePairs[0].toString()}`; // {1}
    for (let i = 1; i < valuePairs.length; i++) {
      objString = `${objString},${valuePairs[i].toString()}`; // {2}
    }
    return objString; // {3}
  }
}
```

###### 散列表

散列算法的作用是尽可能快地在数据结构中找到一个值

散列函数的作用是给定一个键值，然后返回值在表中的地址

散列表有一些在计算机科学中应用的例子:
(1)用来对数据库进行索引。当我们在关系型数据库（如 MySQL、Microsoft SQL Server、Oracle，等等）中创建一个新的表时，一个不错的做法是同时创建一个索引来更快地查询到记录的 key。在这种情况下，散列表可以用来保存键和对表中记录的引用
(2)使用散列表来表示对象。JavaScript 语言内部就是使用散列表来表示每个对象。此时，对象的每个属性和方法（成员）被存储为 key 对象类型，每个 key 指向对应的对象成员。

散列函数 ---- lose lose 散列函数
![lose-lose](lose-lose.png)

HashTable 和 Dictionary 类很相似。不同之处在于在 Dictionary 类中，我
们将 valuePair 保存在 table 的 key 属性中（在它被转化为字符串之后），而
在 HashTable 类中，我们由 key（hash）生成一个数，并将 valuePair 保存
在 hash 位置（或属性）

```javascript
class HashTable {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn;
    this.table = {};
  }
  // 创建散列函数
  loseloseHashCode(key) {
    if (typeof key === 'number') {
      // {1}
      return key;
    }
    const tableKey = this.toStrFn(key); // {2}
    // 根据组成 key 的每个字符的 ASCII 码值的和得到一个数
    let hash = 0; // {3}
    for (let i = 0; i < tableKey.length; i++) {
      hash += tableKey.charCodeAt(i); // {4}
    }
    // 为了得到比较小的数值，我们会使用 hash 值和一个任意数做除法的余数（%）（行{5}）
    // 这可以规避操作数超过数值变量最大表示范围的风险
    return hash % 37; // {5}
  }
  hashCode(key) {
    return this.loseloseHashCode(key);
  }
  put(key, value) {
    if (key != null && value != null) {
      // {1}
      const position = this.hashCode(key); // {2}
      this.table[position] = new ValuePair(key, value); // {3}
      return true;
    }
    return false;
  }
  get(key) {
    const valuePair = this.table[this.hashCode(key)];
    return valuePair == null ? undefined : valuePair.value;
  }
  remove(key) {
    const hash = this.hashCode(key); // {1}
    const valuePair = this.table[hash]; // {2}
    if (valuePair != null) {
      delete this.table[hash]; // {3}
      return true;
    }
    return false;
  }
}

const hash = new HashTable();
hash.put('Gandalf', 'gandalf@email.com');
hash.put('John', 'johnsnow@email.com');
hash.put('Tyrion', 'tyrion@email.com');
console.log(hash.hashCode('Gandalf') + ' - Gandalf');
console.log(hash.hashCode('John') + ' - John');
console.log(hash.hashCode('Tyrion') + ' - Tyrion');
// 19 - Gandalf
// 29 - John
// 16 - Tyrion
```

**散列集合**
散列集合由一个集合构成，但是插入、移除或获取元素时，使用的是 hashCode 函数
散列集合和散列表的不同之处在于，不再添加键值对，而是只插入值而没有键。例如，可以使用散列集合来存储所有的英语单词（不包括它们的定义）。和集合相似，散列集合只存储不重复的唯一值。

**散列表中的冲突**
有时候，一些键会有相同的散列值。不同的值在散列表中对应相同位置的时候，我们称其为冲突

处理冲突有几种方法：分离链接、线性探查和双散列法。

(1)分离链接
分离链接法包括为散列表的每一个位置创建一个链表并将元素存储在里面。
它是解决冲突的最简单的方法，但是在 HashTable 实例之外还需要额外的存储空间
![sperate-chain](sperate-chain.png)

```javascript
class HashTableSeparateChaining {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn;
    this.table = {};
  }
  put(key, value) {
    if (key != null && value != null) {
      const position = this.hashCode(key);
      //  将验证要加入新元素的位置是否已经被占据
      if (this.table[position] == null) {
        // {1}
        this.table[position] = new LinkedList(); // {2}
      }
      this.table[position].push(new ValuePair(key, value)); // {3}
      return true;
    }
    return false;
  }
  // 除了在 get 方法内部搜索 key，还可以在 put 方法中实例化
  // LinkedList，向 LinkedList 的构造函数传入自定义的 equalsFn，只用它来比较元素的 key
  // 属性（即 ValuePair 实例）。我们要记住，默认情况下，LinkedList 会使用===运算符来比较
  // 它的元素实例，也就是说会比较 ValuePair 实例的引用。这种情况下，在 get 方法中，我们要
  // 使用 indexOf 方法来搜索目标 key，如果返回大于或等于零的位置，则说明元素存在于链表中。
  // 有了该位置，我们就可以使用 getElementAt 方法来从链表中获取 ValuePair 实例。
  get(key) {
    const position = this.hashCode(key);
    const linkedList = this.table[position]; // {1}
    if (linkedList != null && !linkedList.isEmpty()) {
      // {2}
      let current = linkedList.getHead(); // {3}
      while (current != null) {
        // {4}
        if (current.element.key === key) {
          // {5}
          return current.element.value; // {6}
        }
        current = current.next; // {7}
      }
    }
    return undefined; // {8}
  }
  remove(key) {
    const position = this.hashCode(key);
    const linkedList = this.table[position];
    if (linkedList != null && !linkedList.isEmpty()) {
      let current = linkedList.getHead();
      while (current != null) {
        if (current.element.key === key) {
          // {1}
          linkedList.remove(current.element); // {2}
          if (linkedList.isEmpty()) {
            // {3}
            delete this.table[position]; // {4}
          }
          return true; // {5}
        }
        current = current.next; // {6}
      }
    }
    return false; // {7}
  }
}
```

(2)线性探查
它处理冲突的方法是将元素直接存储到表中，而不是在单独的数据结构中
当想向表中某个位置添加一个新元素的时候，如果索引为 position 的位置已经被占据了，就尝试 position+1 的位置。如果 position+1 的位置也被占据了，就尝试 position+2 的位置，以此类推，直到在散列表中找到一个空闲的位置
![linear-probing](linear-probing.png)

线性探查技术分为两种。

第一种是软删除方法。我们使用一个特殊的值（标记）来表示键值对被删除了（惰性删除或软删除），而不是真的删除它。经过一段时间，散列表被操作过后，我们会得到一个标记了若干删除位置的散列表。这会逐渐降低散列表的效率，因为搜索键值会随时间变得更慢。能快速访问并找到一个键是我们使用散列表的一个重要原因
![soft-delete](soft-delete.png)
[源代码](http://github.com/loiane/javascript-datastructures-algorithms)

第二种方法需要检验是否有必要将一个或多个元素移动到之前的位置。当搜索一个键的时候，这种方法可以避免找到一个空位置。如果移动元素是必要的，我们就需要在散列表中挪动键值对。
![move-key](move-key.png)

```javascript
// move-key
class HashTableSeparateChainingMoveKey {
  constructor(toStrFn = defaultToString) {
    this.toStrFn = toStrFn;
    this.table = {};
  }
  put(key, value) {
    if (key != null && value != null) {
      const position = this.hashCode(key);
      if (this.table[position] == null) {
        // {1}
        this.table[position] = new ValuePair(key, value); // {2}
      } else {
        let index = position + 1; // {3}
        while (this.table[index] != null) {
          // {4}
          index++; // {5}
        }
        this.table[index] = new ValuePair(key, value); // {6}
      }
      return true;
    }
    return false;
  }
  // 在一些编程语言中，我们需要定义数组的大小。如果使用线性探查的话，需要注
  // 意的一个问题是数组的可用位置可能会被用完。当算法到达数组的尾部时，它需
  // 要循环回到开头并继续迭代元素。如果必要的话，我们还需要创建一个更大的数
  // 组并将元素复制到新数组中。在 JavaScript 中，不需要担心这个问题。我们不需
  // 要定义数组的大小，因为它可以根据需要自动改变——这是 JavaScript 内置的一
  // 个功能
  get(key) {
    const position = this.hashCode(key);
    if (this.table[position] != null) {
      // {1}
      if (this.table[position].key === key) {
        // {2}
        return this.table[position].value; // {3}
      }
      let index = position + 1; // {4}
      while (this.table[index] != null && this.table[index].key !== key) {
        // {5}
        index++;
      }
      if (this.table[index] != null && this.table[index].key === key) {
        // {6}
        return this.table[position].value; // {7}
      }
    }
    return undefined; // {8}
  }
  remove(key) {
    const position = this.hashCode(key);
    if (this.table[position] != null) {
      if (this.table[position].key === key) {
        delete this.table[position]; // {1}
        this.verifyRemoveSideEffect(key, position); // {2}
        return true;
      }
      let index = position + 1;
      while (this.table[index] != null && this.table[index].key !== key) {
        index++;
      }
      if (this.table[index] != null && this.table[index].key === key) {
        delete this.table[index]; // {3}
        this.verifyRemoveSideEffect(key, index); // {4}
        return true;
      }
    }
    return false;
  }
  verifyRemoveSideEffect(key, removedPosition) {
    const hash = this.hashCode(key); // {1}
    let index = removedPosition + 1; // {2}
    while (this.table[index] != null) {
      // {3}
      const posHash = this.hashCode(this.table[index].key); // {4}
      if (posHash <= hash || posHash <= removedPosition) {
        // {5}
        this.table[removedPosition] = this.table[index]; // {6}
        delete this.table[index];
        removedPosition = index;
      }
      index++;
    }
  }
}
```

**更好的散列函数**
一个表现良好的散列函数是由几个方面构成的：插入和检索元素的时间（即性能），以及较低的冲突可能性。

```javascript
djb2HashCode(key) {
 const tableKey = this.toStrFn(key); // {1}
//  括初始化一个 hash 变量并赋值为一个质数,大多数实现使用5381
 let hash = 5381; // {2}
 for (let i = 0; i < tableKey.length; i++) { // {3}
//  将 hash 与 33相乘（用作一个幻数，在编程中指直接使用的常数），并和当前迭代到的字符的 ASCII 码值相加
 hash = (hash * 33) + tableKey.charCodeAt(i); // {4}
 }
//  将使用相加的和与另一个随机质数相除的余数
 return hash % 1013; // {5}
}
// 也有一些为数字键值准备的散列函数：http://t.cn/Eqg1yb0
```

**ES2015 Map 类**

```javascript
const map = new Map();
map.set('Gandalf', 'gandalf@email.com');
map.set('John', 'johnsnow@email.com');
map.set('Tyrion', 'tyrion@email.com');
console.log(map.has('Gandalf')); // true
console.log(map.size); // 3
console.log(map.keys()); // 输出{"Gandalf", "John", "Tyrion"}
console.log(map.values()); // 输出{"gandalf@email.com", "johnsnow@email.com",
"tyrion@email.com"}
console.log(map.get('Tyrion')); // tyrion@email.com
map.delete('John');
```

**ES2105 WeakMap 类和 WeakSet 类**
Map 和 Set 与其弱化版本之间仅有的区别是:
(1)WeakSet 或 WeakMap 类没有 entries、keys 和 values 等方法
(2)WeakSet 和 WeakMap 只能用对象作为键

```javascript
const map = new WeakMap();
const ob1 = { name: 'Gandalf' }; // {1}
const ob2 = { name: 'John' };
const ob3 = { name: 'Tyrion' };
map.set(ob1, 'gandalf@email.com'); // {2}
map.set(ob2, 'johnsnow@email.com');
map.set(ob3, 'tyrion@email.com');
console.log(map.has(ob1)); // true {3}
console.log(map.get(ob3)); // tyrion@email.com {4}
map.delete(ob2); // {5}
```

注意：WeakMap 类也可以用 set 方法，但不能使用数、字符串、布尔值等基本数据类型，需要将名字转换为对象
