---
title: 关于IndexedDB
date: 2025-05-15 18:59:20
cover: https://cdn.pixabay.com/photo/2022/02/07/15/14/mountains-6999626_640.jpg
tags:
---

# 关于IndexedDB

## 前言
大家应该都遇到过需要在浏览器中存储数据的情况吧，我们常用的就是cookie、localStorage、sessionStorage，这些方法一般来说能够满足我们的日常开发使用。但是，不知道大家有没有遇到过需要存储大量的数据的情况，这时候，前面提到的这些方法可能就满足不了我们的要求，这时候IndexedDB或许可以成为一个不错的选择。

## 什么是IndexedDB？

> IndexedDB 是一种底层 API，用于在客户端存储大量的结构化数据（也包括文件/二进制大型对象（blobs））。该 API 使用索引实现对数据的高性能搜索。


主要特点：
- 异步API（不会阻塞UI）
- 支持事务
- 支持索引查询
- 同源策略限制
- 存储空间较大（通常50MB以上，取决于浏览器）


## 适用场景

- 需要离线工作的Web应用
- 需要存储大量结构化数据的应用
- 需要复杂查询的本地数据存储
- 需要高性能本地数据访问的应用

IndexedDB为Web应用提供了强大的本地存储能力，虽然API相对复杂，但能够满足高级的客户端数据存储需求。

**场景举例**

- Web 游戏
  - 场景： 保存游戏进度、配置、用户数据等。
  - 示例：本地保存 RPG 游戏的存档数据、存储离线资源（角色模型、场景数据）、用户自定义设置存储（分辨率、按键配置）
- 渐进式 Web 应用（PWA）
  - 场景： 提升 Web 应用的离线体验和性能。
  - 示例：离线播放音乐或视频（配合 service worker 缓存媒体文件）、离线阅读应用（小说、电子书等）、PWA 的聊天应用暂存聊天记录


## 基本使用方法介绍

下面我们介绍一下IndexedDB的一些方法及使用举例。

1. `indexedDB.open(name, version)`
用于打开或创建数据库，name是数据库名称，version可选，数据库版本号。*升级数据库结构时需要修改版本。*

```javascript
const request = indexedDB.open('MyDatabase', 1);
```

2. `request.onupgradeneeded`
当数据库第一次创建或版本升级时触发，用于创建对象仓库（Object Store）和索引等结构。

```javascript
request.onupgradeneeded = function(event) {
  // xxxxxx
};
```

3. `request.onsuccess` / `request.onerror`
`onsuccess`：打开数据库成功后的回调，`onerror`：打开数据库失败的回调。

```javascript
request.onsuccess = (event) => {
  const db = event.target.result;
  console.log('数据库打开成功');
};

request.onerror = (event) => {
  console.error('数据库打开失败', event.target.error);
};
```

4. `db.createObjectStore(name, options)`
在 `onupgradeneeded` 中调用，用于创建对象仓库。`keyPath`：指定主键字段名称（也可使用自动递增：`{ autoIncrement: true }`）。

```javascript
request.onupgradeneeded = function(event) {
  const db = event.target.result;
  const store = db.createObjectStore('users', { keyPath: 'id' });
  store.createIndex('name', 'name', { unique: false });
};
```
![create](create-indexeddb.png)


5. `db.transaction(storeNames, mode)`
创建一个事务对象，用于读取或写入数据。`storeNames`：对象仓库名称或数组，`mode`：操作模式，`readonly` 或 `readwrite`。

```javascript
const tx = db.transaction(['users'], 'readwrite');
const store = tx.objectStore('users');
```

6. `store.add(value)` / `store.put(value)`
用于添加或更新数据。`add()`：如果主键已存在会报错，`put()`：存在则更新，不存在则新增。

```javascript
store.add({ id: 1, name: 'Alice' });
store.put({ id: 1, name: 'Alice Smith' });
```

7. `store.get(key)`
用于根据主键获取数据。

```javascript
store.get(1).onsuccess = (event) => {
  console.log('获取结果：', event.target.result);
};
```

8. `store.delete(key)`
删除某条数据。

```javascript
store.delete(1);
```

9. `store.clear()`
清空对象仓库中所有记录。

```javascript
store.clear();
```

10. `store.openCursor()`
用于遍历所有数据（类似迭代器）。

```javascript
const cursorRequest = store.openCursor();

cursorRequest.onsuccess = (event) => {
  const cursor = event.target.result;
  if (cursor) {
    console.log(cursor.key, cursor.value);
    cursor.continue();  // 移动到下一条
  } else {
    console.log('遍历完成');
  }
};
```

11. `store.createIndex(name, keyPath, options)`
创建索引，便于通过其他字段查询。

```javascript
store.createIndex('nameIndex', 'name', { unique: false });
```

之后可以通过索引查询：

```javascript
const index = store.index('nameIndex');
index.get('Alice').onsuccess = (e) => console.log(e.target.result);
```
之后可以通过索引查询：

```javascript
const index = store.index('nameIndex');
index.get('Alice').onsuccess = (e) => console.log(e.target.result);
```

12.   `db.deleteDatabase(name)`
用于删除IndexedDB，name为创建的IndexedDB名称，注意name需要匹配，删除后数据无法恢复，慎用！数据库被打开无法被删除。

```javascript
const deleteRequest = indexedDB.deleteDatabase('myDatabase');
deleteRequest.onsuccess = function () {
  console.log('数据库删除成功');
};

deleteRequest.onerror = function (event) {
  console.error('数据库删除失败', event.target.error);
};

deleteRequest.onblocked = function () {
  console.warn('删除被阻止，可能数据库正被打开中');
};
```


## 注意事项

1. **异步操作**：所有IndexedDB操作都是异步的，需要通过事件处理结果
2. **事务**：任何数据操作都需要在事务中进行
3. **版本控制**：数据库结构变更需要通过版本升级实现
4. **错误处理**：务必处理onerror事件，避免静默失败
5. **浏览器兼容性**：现代浏览器基本都支持，但旧版IE需要特定版本


## 常用的库idb
由于IndexedDB的原生API不友好，idb成为了热门的IndexedDB包装库，方便我们我们操作IndexedDB，大家感兴趣的可以自己去了解一下。
[idb的github地址](https://github.com/jakearchibald/idb)


资料：
[IndexedDB](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)