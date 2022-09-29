---
title: 数据结构与算法阅读笔记(3)
date: 2022-09-29 10:49:51
tags:
---

#### 集合

集合是由一组无序且唯一（即不能重复）的项组成的

###### 创建集合类

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