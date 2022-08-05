---
title: Map 结构
date: 2022-08-04 14:07:12
tags:
---

#### 什么是Map?
由ES6提供的一种数据结构。它类似于对象，也是键值对的集合，但和对象不同的是，对象的键只能是字符串，map的键可以是各种类型的值（包括对象）。即，Object提供了 字符串-值 的对应，map提供了 值-值 的对应，是一种更完善的Hash结构实现。

#### 怎么创建map？
```javascript
const map = new Map();
```
map可以使用一个对象作为键
```javascript
const map = new Map();
const o = { p: 'string' };

map.set(o, 'text');
map.get(o); // text

map.has(o); // true
map.delete(o);
```
map还可以接受一个数组作为参数，该数组成员是一个个表示键值对的数组
```javascript
const map = new Map([['name', 'Tom'], ['age', 12]]);
map.size; // 2
map.has('name'); // true
map.get('age'); // 12
```

##### 注意点
如果对同一个键多次赋值，后面的值将覆盖前面的值
```javascript
map.set(1, 'qw').set(1, 'sdf');
map.get(1); // sdf
```

#### map的实例属性和方法
1、size
用法：map.size
作用：获取map结构的大小
返回：map结构的长度大小
```javascript
const map = new Map();
map.size; // 0
map.set(1, 12);
map.size; // 1
```

2、set()
用法：map.set(key, value)
作用：向map中添加或修改map的数据
返回：修改后的map
```javascript
const map = new Map();
map.set(1, 12);
```

3、get()
用法：map.get(key)
作用：获取对应key的value值
返回：map结构中key对应的值，不存在对应key时，返回undefined
```javascript
const map = new Map();
map.set(1, 12);
map.get(1); // 12
map.get(2); // undefined
```

4、has()
用法：map.has(key)
作用：判断map中是否有对应的key
返回：true/false，依据map中是否有对应的key，返回true或false
```javascript
const map = new Map();
map.set(1, 12);
map.has(1); // true
map.has(2); // has
```

5、delete()
用法：map.delete(key)
作用：删除map中对应的key及value
返回：true/false，删除成功返回true，删除失败返回false
```javascript
const map = new Map();
map.set(1, 12);
map.delete(1); // true
map.delete(2); // false
```

6、clear()
用法：map.clear()
作用：清空map中的数据
返回：undefined
```javascript
const map = new Map();
map.set(1, 12);
map.clear(); // undefined
```

#### map的遍历方法
1、keys()
2、values()
3、entries()
4、forEach()

参考：https://www.jianshu.com/p/93b5a5940de8