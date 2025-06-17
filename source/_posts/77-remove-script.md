---
title: 记一次缺陷的整理
date: 2025-06-04 13:06:54
cover: https://cdn.pixabay.com/photo/2023/04/13/18/23/ai-generated-7923192_640.jpg
tags:
---

## 前言

以下是对一次遇到的缺陷进行的整理，主要关于动态添加script


## 场景说明

场景: react+typescript搭建的单页面系统，登录系统后，通过代码动态添加了script标签，引入js文件，js中的全局代码会自动执行，退出系统后，将添加的script标签通过代码去除，再次登录时，会再次通过代码动态添加script标签，引入相同的js文件。
已知：上面的单页面系统操作不涉及刷新页面
问题：再次登录时，引入的js文件中，全局代码不会再次执行，导致全局代码失效

## 模拟代码
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <button id="addScript">添加script</button>
    <button id="removeScript">移除script</button>
  </body>
  <script>
    const addButton = document.getElementById('addScript');
    const removeButton = document.getElementById('removeScript');

    addButton.addEventListener('click', () => {
      const body = document.body;
      const script = document.createElement('script');
      script.src = './test.js';
      script.type = 'module';
      script.id = 'testScript';
      body.appendChild(script);
    });

    removeButton.addEventListener('click', () => {
      const script = document.getElementById('testScript');
      script.remove();
    });
  </script>
</html>
```

```js
const testName = 'test-remove-script';
console.log(this is global params: ${testName});
```

**正确的结论：是否会再次执行 = 取决于 script 的类型和浏览器的缓存行为**。


## ✅ 实验细节复盘

动态添加的是：

```ts
const script = document.createElement('script');
script.src = './test.js';
script.type = 'module';
script.id = 'testScript';
```

这意味着添加的是一个 **模块化 script（type="module"）**。

点击“添加 script”，控制台打印信息
点击“移除 script”，再点击“添加 script”，**控制台无任何输出**


## 🔍 真实原因解析

### 1. `type="module"` 的行为不同于普通 `<script>`

* 浏览器会对 `type="module"` 的 script **进行缓存和模块解析机制处理**。
* **即使删除了 DOM 中的 `<script>` 标签，再次添加相同 `src` 的模块脚本，也不会重新执行其中的模块代码**，因为模块已经“加载并执行过”。
* 这是 ES Module 的 **“模块缓存机制”** 决定的。

**除非：**

* 加了 query 参数（如 `?v=${Date.now()}`）强制缓存失效
* 或者刷新页面


### 2. `普通 script` 则会每次都执行 ✅

如果将 `type="module"` 去掉：

```ts
script.type = 'text/javascript'; // 或直接不设置 type
```

每次添加 `<script>`，浏览器就会执行一次 `test.js` 中的全局代码。


## ✅ 正确结论（综合考虑 script 类型）

| script 类型     | 是否重新执行（每次添加） | 是否受缓存影响                     |
| --------------- | ------------------------ | ---------------------------------- |
| `type="module"` | ❌ 不执行（已缓存）       | ✅ 是                               |
| 普通 `<script>` | ✅ 每次都会执行           | ✅ 是（仅资源缓存，但执行不受影响） |

---

## ✅ 如何让 module script 每次都执行？

加上 cache busting 参数：

```ts
script.src = `./test.js?t=${Date.now()}`;
```

这样浏览器认为是一个“新的模块”，会重新加载并执行。

---

## 🧠 总结

使用 `type="module"`，因此触发了 ES Module 的缓存机制，所以：

> **模块脚本只会执行一次，不管是否移除 `<script>` 标签。**

---

如需精确控制是否再次执行，可选择以下方式：

### ✅ 方法一：使用普通 script

```ts
script.type = 'text/javascript'; // or omit entirely
```

### ✅ 方法二：为 module script 添加唯一 query 参数

```ts
script.src = `./test.js?t=${Date.now()}`;
script.type = 'module';
```

### 模拟代码执行中遇到的问题
html直接在浏览器中打开，控制台报错：
> Access to script at 'file:///D:/sunjinkang/normal-test/1-test-remove-script/test.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: chrome, chrome-extension, chrome-untrusted, data, http, https, isolated-app

原因：
- 当使用 <script type="module"> 动态加载 JS 文件时，浏览器会将其视为一个 ES Module。
- ES Modules 遵循严格的 CORS 规则，而 file:// 协议下的页面属于 origin: null，浏览器出于安全原因禁止跨源加载 module 类型的脚本，即使路径是本地文件。

解决方法：
- 方法一
  - 使用本地开发服务器
    - 使用 npx http-server（Node 环境下）
```js
# 安装（如果你没有安装过）
npm install -g http-server

# 启动本地服务（在 index.html 所在目录下运行）
http-server .

// 访问浏览器
http://localhost:8080
```
    - 使用 VSCode 的 Live Server 插件
      - [安装 Live Server 插件](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
      - 右键 index.html → 选择 “Open with Live Server”

方法二：不使用 module 类型（仅用于普通 script）
```html
<script src="./test.js" id="testScript"></script>
```
*PS: test.js 文件如果未来会使用 import 等 ES Module 功能，那方法二不适合。*