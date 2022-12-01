---
title: 关于useEffect中的清除函数
date: 2022-11-27 16:18:33
tags:
---

useEffect的清除函数，即useEffect的return处理，如下：
```javascript
React.useEffect(() => {
 // ....
 return () => {
  // 清除函数
 };
}, []);
```

###### 什么是useEffect？
useEffect是react中的副作用hook，这里的副作用包括请求数据、处理数据、修改组件状态/样式、监听事件、设置订阅等多方面，具体的使用取决于开发者的开发需要。同时useEffect还允许卸载组件时清理副作用。


