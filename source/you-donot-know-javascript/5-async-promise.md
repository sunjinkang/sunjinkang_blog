---
title: 异步、回调&Promise
date: 2024-11-28 19:57:56
---


### 异步基础
- **JavaScript的单线程与异步机制**：JavaScript是单线程的，这意味着同一时间只能执行一个任务。但实际应用中，常需要执行一些耗时的操作，如网络请求、文件读写等，若这些操作阻塞主线程，会导致页面卡顿。因此，JavaScript通过异步机制来解决这个问题，允许在后台执行耗时操作，不阻塞主线程。
- **事件循环**：是JavaScript异步编程的核心机制。所有异步任务完成后会将回调函数放入事件循环队列中，等待主线程空闲时执行。例如，`setTimeout()`函数就是设定一个定时器，当定时器时间到后，其回调函数会被放入事件循环队列中，在未来某个时刻被执行。

### 回调函数
- **基本用法**：回调函数是作为参数传递给另一个函数的函数，在异步操作完成后执行。例如：
```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: "john", age: 30 };
    callback(data);
  }, 1000);
}
fetchData((data) => {
  console.log(data);
});
```
- **回调地狱**：当异步操作嵌套较多时，会出现回调地狱问题，导致代码可读性和可维护性变差。例如：
```javascript
ajax('url1', function (response1) {
  processResponse1(response1);
  ajax('url2', function (response2) {
    processResponse2(response2);
    ajax('url3', function (response3) {
      processResponse3(response3);
      // 更多嵌套...
    });
  });
});
```

### Promise
- **基本概念**：Promise是一种用于处理异步操作的对象，代表了异步操作最终的完成或失败，具有三种状态：`pending`（进行中）、`fulfilled`（已成功）和`rejected`（已失败），且状态一旦改变就不可逆。
- **创建与使用**：
```javascript
function getData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = { name: "john", age: 30 };
      resolve(data);
    }, 1000);
  });
}
getData()
 .then((data) => {
    console.log(data);
  })
 .catch((error) => {
    console.error(error);
  });
```
- **链式调用**：可以通过`.then()`方法链式调用，解决了回调地狱问题，使异步代码更易读和维护。例如：
```javascript
function step1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("step1 result");
    }, 1000);
  });
}
function step2(result) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(result + " step2 result");
    }, 1000);
  });
}
step1()
 .then(step2)
 .then((finalResult) => {
    console.log(finalResult);
  });
```
- **错误处理**：使用`.catch()`方法统一处理错误，提高了错误处理的便利性和代码的健壮性。例如：
```javascript
function getData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const error = new Error("获取数据失败");
      reject(error);
    }, 1000);
  });
}
getData()
 .then((data) => {
    console.log(data);
  })
 .catch((error) => {
    console.error("发生错误：", error);
  });
```
- **Promise.all() 和 Promise.race()**：
    - `Promise.all()`：接受一个Promise数组作为参数，当所有Promise都成功完成时，返回一个包含所有结果的数组；若其中一个Promise被拒绝，则立即返回一个被拒绝的Promise。
```javascript
function getData1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("data1");
    }, 1000);
  });
}
function getData2() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("data2");
    }, 2000);
  });
}
Promise.all([getData1(), getData2()])
 .then((results) => {
    console.log(results);
  })
 .catch((error) => {
    console.error(error);
  });
```
    - `Promise.race()`：接受一个Promise数组作为参数，当其中一个Promise完成或拒绝时，立即返回该Promise的结果或错误。
```javascript
function getData1() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("data1");
    }, 1000);
  });
}
function getData2() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("data2");
    }, 2000);
  });
}
Promise.race([getData1(), getData2()])
 .then((result) => {
    console.log(result);
  })
 .catch((error) => {
    console.error(error);
  });
```

### 总结
- 回调函数是处理异步操作的基本方式，但存在回调地狱等问题。
- Promise是更优雅的异步处理方式，解决了回调地狱，提供了更好的错误处理机制和链式调用，使异步代码更易读和维护。
- 了解JavaScript的异步机制、事件循环以及Promise的原理和用法，对于编写高效、可维护的异步代码非常重要。
