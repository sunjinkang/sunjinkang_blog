---
title: nodejs基础知识(2)
date: 2022-10-19 19:12:12
tags: [node, buffer]
---

###### Buffer(缓冲)
ES6引入TypedArray???之前，JavaScript 语言没有读取或操作二进制数据流的机制。
Buffer 类被引入作为 Node.js API 的一部分，使其可以在 TCP 流或文件系统操作等场景中处理二进制数据流。

TypedArray 现已被添加进 ES6 中，Buffer 类以一种更优化、更适合 Node.js 用例的方式实现了 Uint8Array API。

*Buffer 类的实例类似于整数数组，但 Buffer 的大小是固定的、且在 V8 堆外分配物理内存。 Buffer 的大小在被创建时确定，且无法调整。Buffer 类在 Node.js 中是一个全局变量，因此无需使用 require('buffer').Buffer。*
```javascript
// 创建一个长度为 10、且用 0 填充的 Buffer。
const buf1 = Buffer.alloc(10);

// 创建一个长度为 10、且用 0x1 填充的 Buffer。 
const buf2 = Buffer.alloc(10, 1);

// 创建一个长度为 10、且未初始化的 Buffer。
// 这个方法比调用 Buffer.alloc() 更快，
// 但返回的 Buffer 实例可能包含旧数据，
// 因此需要使用 fill() 或 write() 重写。
const buf3 = Buffer.allocUnsafe(10);

// 创建一个包含 [0x1, 0x2, 0x3] 的 Buffer。
const buf4 = Buffer.from([1, 2, 3]);

// 创建一个包含 UTF-8 字节 [0x74, 0xc3, 0xa9, 0x73, 0x74] 的 Buffer。
const buf5 = Buffer.from('tést');

// 创建一个包含 Latin-1 字节 [0x74, 0xe9, 0x73, 0x74] 的 Buffer。
const buf6 = Buffer.from('tést', 'latin1');
```

*Buffer.from(), Buffer.alloc(), and Buffer.allocUnsafe()*
注意：nodejs v6之前，uffer 实例是通过 Buffer 构造函数创建的，它根据提供的参数返回不同的 Buffer
- nodejs 8.0.0之前分配给Buffer实例的内存是没有初始化的，且可能包含敏感数据；8.0.0之后，返回的是初始化内存之后的buffer
- 传递一个字符串、数组 或 Buffer 作为第一个参数，会将所传对象的数据拷贝到Buffer中
- 传入 ArrayBuffer 或 SharedArrayBuffer，则返回一个与传入的 ArrayBuffer 共享所分配内存的 Buffer

出于安全性和可靠性考虑，new Buffer()构造函数已被废弃，由Buffer.from(), Buffer.alloc(), and Buffer.allocUnsafe()方法代替

- Buffer.from(array) 返回**一个新建的包含所提供的字节数组的副本**的 Buffer。
- [Buffer.from(arrayBuffer[, byteOffset [, length]])]Buffer.from(arrayBuffer) 返回**一个新建的与给定的 ArrayBuffer 共享同一内存**的 Buffer。
- Buffer.from(buffer) 返回**一个新建的包含所提供的 Buffer 的内容的副本**的 Buffer。
- Buffer.from(string[, encoding]) 返回**一个新建的包含所提供的字符串的副本**的 Buffer。
- [Buffer.alloc(size[, fill[, encoding]])]Buffer.alloc() 返回**一个指定大小的被填满的 Buffer 实例**。 这个方法会明显地比 Buffer.allocUnsafe(size) 慢，但可确保新创建的 Buffer 实例绝**不会包含旧的和潜在的敏感数据**。
- Buffer.allocUnsafe(size) 与 Buffer.allocUnsafeSlow(size) 返回一个新建的指定 size 的 Buffer，但它的内容必须被初始化，可以使用 buf.fill(0) 或完全写满。
*如果 size 小于或等于 Buffer.poolSize 的一半，则 Buffer.allocUnsafe() 返回的 Buffer 实例**可能**会被分配进一个共享的内部内存池。*

*--zero-fill-buffers命令行选项*
强制所有新分配的buffer实例在**创建时自动用0填充**
注意：使用这个选项会改变新建buffer实例方法的默认行为，对性能有明显的影响。建议只在需要强制新分配的 Buffer 实例不能包含潜在的敏感数据时才使用 --zero-fill-buffers 选项。

*buffer.allocUnsafe()和buffer.allocUnsafeSlow()不安全的原因*
buffer.allocUnsafe()和buffer.allocUnsafeSlow()创建的buffer实例，被分配的内存段是**未初始化的(未用0填充)**，这样的设计使得内存的分配很快，但分配的内存可能含有潜在的敏感旧数据，从而给程序引入安全漏洞

*buffer与字符编码*
Buffer 实例一般用于表示编码字符的序列，比如 UTF-8 、 UCS2 、 Base64 、或十六进制编码的数据。 通过使用显式的字符编码，就可以在 Buffer 实例与普通的 JavaScript 字符串之间进行相互转换。
```javascript
const buf = Buffer.from('hello world', 'ascii');
console.log(buf.toString('hex'));
// 输出 68656c6c6f20776f726c64

console.log(buf.toString('base64'));
// 输出 aGVsbG8gd29ybGQ=
```

nodejs目前支持的字符编码
- ascii - 仅支持 7 位 ASCII 数据。如果设置去掉高位的话，编码非常快
- utf8 - 多字节编码的 Unicode 字符。许多网页和其他文档格式都使用 UTF-8
- utf16le - 2 或 4 个字节，小字节序编码的 Unicode 字符。支持代理对（U+10000 至 U+10FFFF）
- ucs2 - 'utf16le' 的别名
- base64 - Base64 编码。当从字符串创建 Buffer 时，按照 RFC4648 第 5 章的规定，这种编码也将正确地接受“URL 与文件名安全字母表”
- latin1 - 一种把 Buffer 编码成一字节编码的字符串的方式（由 IANA 定义在 RFC1345 第 63 页，用作 Latin-1 补充块与 C0/C1 控制码）
- binary - 'latin1' 的别名
- hex - 将每个字节编码为两个十六进制字符

**注意**：现代浏览器遵循 WHATWG 编码标准 将 'latin1' 和 ISO-8859-1 别名为 win-1252。 这意味着当进行例如 http.get() 这样的操作时，如果返回的字符编码是 WHATWG 规范列表中的，则有可能服务器真的返回 win-1252 编码的数据，此时使用 'latin1' 字符编码可能会错误地解码数据

*Buffer 与 TypedArray*
Buffer 实例也是 Uint8Array 实例
从一个 Buffer 创建一个新的 TypedArray 实例需要遵循的注意事项：
- Buffer 对象的内存是拷贝到 TypedArray 的，而不是共享的。
- Buffer 对象的内存是被解析为一个明确元素的数组，而不是一个目标类型的字节数组。 也就是说，new Uint32Array(Buffer.from([1, 2, 3, 4])) 会创建一个包含 [1, 2, 3, 4] 四个元素的 Uint32Array，而不是一个只包含一个元素 [0x1020304] 或 [0x4030201] 的 Uint32Array 
```javascript
const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

// 拷贝 `arr` 的内容
const buf1 = Buffer.from(arr);

// 与 `arr` 共享内存
const buf2 = Buffer.from(arr.buffer);

// 输出: <Buffer 88 a0>
console.log(buf1);

// 输出: <Buffer 88 13 a0 0f>
console.log(buf2);

arr[1] = 6000;

// 输出: <Buffer 88 a0>
console.log(buf1);

// 输出: <Buffer 88 13 70 17>
console.log(buf2);
```
*注意，当使用 TypedArray 的 .buffer 创建 Buffer 时，也可以通过传入 byteOffset 和 length 参数只使用 ArrayBuffer 的一部分*
```javascript
const arr = new Uint16Array(20);
const buf = Buffer.from(arr.buffer, 0, 16);

// 输出: 16
console.log(buf.length);
```

Buffer 实例可以使用 ECMAScript 2015 (ES6) 的 for..of 语法进行遍历

