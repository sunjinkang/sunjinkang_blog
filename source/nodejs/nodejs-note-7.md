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

```javascript
const buf = Buffer.from([1, 2, 3]);

// 输出:
//   1
//   2
//   3
for (const b of buf) {
  console.log(b);
}
```
buf.values() 、buf.keys() 和 buf.entries() 方法可用于创建迭代器

*Buffer类*
Buffer 类是一个全局变量类型，用来直接处理二进制数据的。 它能够使用多种方式构建。

**类方法：Buffer.allocUnsafe(size)**
分配一个大小为 size 字节的新建的 Buffer 。 如果 size 大于 buffer.constants.MAX_LENGTH 或小于 0，则抛出 RangeError 错误。 如果 size 为 0，则创建一个长度为 0 的 Buffer。
以这种方式创建的 Buffer 实例的底层内存是未初始化的。 新创建的 Buffer 的内容是未知的，且可能包含敏感数据。 可以使用 buf.fill(0) 初始化 Buffer 实例为0。

```javascript
const buf = Buffer.allocUnsafe(10);
console.log(buf);
// 输出: (内容可能不同): <Buffer 00 00 00 00 00 00 00 00 00 00>

buf.fill(0);

// 输出: <Buffer 00 00 00 00 00 00 00 00 00 00>
console.log(buf);
```
如果 size 不是一个数值，则抛出 TypeError 错误。

注意，Buffer 模块会预分配一个大小为 Buffer.poolSize 的内部 Buffer 实例作为快速分配池， 用于使用 Buffer.allocUnsafe() 新创建的 Buffer 实例，以及废弃的 new Buffer(size) 构造器， 仅限于当 size 小于或等于 Buffer.poolSize >> 1 （Buffer.poolSize 除以2后的最大整数值）。

对这个预分配的内部内存池的使用，是调用 Buffer.alloc(size, fill) 和 Buffer.allocUnsafe(size).fill(fill) 的关键区别。 *具体地说，Buffer.alloc(size, fill) 永远不会使用这个内部的 Buffer 池，但如果 size 小于或等于 Buffer.poolSize 的一半， Buffer.allocUnsafe(size).fill(fill) 会使用这个内部的 Buffer 池。 当应用程序需要 Buffer.allocUnsafe() 提供额外的性能时，这个细微的区别是非常重要的。*

**类方法：Buffer.allocUnsafeSlow(size)**
当使用 Buffer.allocUnsafe() 分配新建的 Buffer 时，当分配的内存小于 4KB 时，默认会从一个单一的预分配的 Buffer 切割出来。 这使得应用程序可以避免垃圾回收机制因创建太多独立分配的 Buffer 实例而过度使用。 这个方法通过像大多数持久对象一样消除追踪与清理的需求，改善了性能与内存使用。

当然，在开发者可能需要在不确定的时间段从内存池保留一小块内存的情况下，使用 Buffer.allocUnsafeSlow() 创建一个非池的 Buffer 实例然后拷贝出相关的位元是合适的做法。
```javascript
// 需要保留一小块内存块
const store = [];

socket.on('readable', () => {
  const data = socket.read();

  // 为保留的数据分配内存
  const sb = Buffer.allocUnsafeSlow(10);

  // 拷贝数据进新分配的内存
  data.copy(sb, 0, 0, 10);

  store.push(sb);
});
```
*Buffer.allocUnsafeSlow() 应当仅仅作为开发者已经在他们的应用程序中观察到过度的内存保留之后的终极手段使用。*

**类方法：Buffer.byteLength(string[, encoding])**
返回一个字符串的实际字节长度。 这与 String.prototype.length 不同，因为那返回字符串的字符数。

注意 对于 'base64' 和 'hex'， 该函数假定有效的输入。 对于包含 non-Base64/Hex-encoded 数据的字符串 (e.g. 空格)， 返回值可能大于 从字符串中创建的 Buffer 的长度。

当 string 是一个 Buffer/DataView/TypedArray/ArrayBuffer/SharedArrayBuffer 时，返回实际的字节长度。

**类方法：Buffer.compare(buf1, buf2)**
比较 buf1 和 buf2 ，通常用于 Buffer 实例数组的排序。 相当于调用 buf1.compare(buf2) 。
```javascript
const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// 输出: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (结果相当于: [buf2, buf1])
```

**类方法：Buffer.concat(list[, totalLength])**
返回一个合并了 list 中所有 Buffer 实例的新建的 Buffer 。

如果 list 中没有元素、或 totalLength 为 0 ，则返回一个新建的长度为 0 的 Buffer 。

*如果没有提供 totalLength ，则从 list 中的 Buffer 实例计算得到。 为了计算 totalLength 会导致需要执行额外的循环，所以提供明确的长度会运行更快。*
*如果提供了 totalLength，totalLength 必须是一个正整数。如果从 list 中计算得到的 Buffer 长度超过了 totalLength，则合并的结果将会被截断为 totalLength 的长度。*

```javascript
const buf1 = Buffer.alloc(10);
const buf2 = Buffer.alloc(14);
const buf3 = Buffer.alloc(18);
const totalLength = buf1.length + buf2.length + buf3.length;

console.log(totalLength);
// 输出: 42

const bufA = Buffer.concat([buf1, buf2, buf3], totalLength);
console.log(bufA);
// 输出: <Buffer 00 00 00 00 ...>

console.log(bufA.length);
// 输出: 42
```

**类方法：Buffer.from(array)**
如果 array 不是一个数组，则抛出 TypeError 错误
**类方法：Buffer.from(arrayBuffer[, byteOffset[, length]])**
arrayBuffer <ArrayBuffer> | <SharedArrayBuffer> ArrayBuffer 或 SharedArrayBuffer 或 TypedArray 的 .buffer 属性。
byteOffset <integer> 开始拷贝的索引。默认为 0。
length <integer> 拷贝的字节数。默认为 arrayBuffer.length - byteOffset。

该方法将创建一个 ArrayBuffer 的视图，而不会复制底层内存。例如，当传入一个 TypedArray 实例的 .buffer 属性的引用时，这个新建的 Buffer 会像 TypedArray 那样共享同一分配的内存。

```javascript
const arr = new Uint16Array(2);

arr[0] = 5000;
arr[1] = 4000;

const buf = Buffer.from(arr.buffer);
// 与 `arr` 共享内存

console.log(buf);
// 输出: <Buffer 88 13 a0 0f>

arr[1] = 6000;
// 改变原始的 Uint16Array 也会改变 Buffer

console.log(buf);
// 输出: <Buffer 88 13 70 17>
```
可选的 byteOffset 和 length 参数指定将与 Buffer 共享的 arrayBuffer 的内存范围
```javascript
const ab = new ArrayBuffer(10);
const buff = Buffer.from(ab, 0, 2);
console.log(buff.length);
// 输出: 2
```
如果 arrayBuffer 不是 ArrayBuffer 或 SharedArrayBuffer，则抛出 TypeError 错误

**类方法：Buffer.from(buffer)**
将传入的 buffer 数据拷贝到一个新建的 Buffer 实例。
```javascript
const buf1 = Buffer.from('buffer');
const buf2 = Buffer.from(buf1);
buf1[0] = 0x61;
console.log(buf1.toString());
// 输出: auffer

console.log(buf2.toString());
// 输出: buffer
```

**类方法：Buffer.from(string[, encoding])**
新建一个包含所给的 JavaScript 字符串 string 的 Buffer 。 encoding 参数指定 string 的字符编码。
```javascript
const buf1 = Buffer.from('this is a tést');

console.log(buf1.toString());
// 输出: this is a tést

console.log(buf1.toString('ascii'));
// 输出: this is a tC)st

const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');

console.log(buf2.toString());
// 输出: this is a tést
```

**Class Method: Buffer.from(object[, offsetOrEncoding[, length]])**
object <Object> 一个支持 Symbol.toPrimitive 或 valueOf() 的对象
offsetOrEncoding <number> | <string> 字节偏移量或编码，取决于 object.valueOf() 或 object[Symbol.toPrimitive]() 的返回值。
length <number> 长度值，取决于 object.valueOf() 或 object[Symbol.toPrimitive]() 的返回值。
那些其 valueOf() 方法返回值如果不严格等于 object 的对象，返回Buffer.from(object.valueOf(), offsetOrEncoding, length)。
```
const buf = Buffer.from(new String('this is a test'));
// <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```
那些支持 Symbol.toPrimitive 的对象， 返回 Buffer.from(object[Symbol.toPrimitive](), offsetOrEncoding, length)。
```
class Foo {
  [Symbol.toPrimitive]() {
    return 'this is a test';
  }
}

const buf = Buffer.from(new Foo(), 'utf8');
// <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
```

**类方法：Buffer.isBuffer(obj)**
如果 obj 是一个 Buffer 则返回 true ，否则返回 false 
**类方法：Buffer.isEncoding(encoding)**
如果 encoding 是一个支持的字符编码则返回 true，否则返回 false 。
**类属性：Buffer.poolSize**
这是用于决定预分配的、内部 Buffer 实例池的大小的字节数。 这个值可以修改。默认值：8192

**buf[index]**
索引操作符 [index] 可用于获取或设置 buf 中指定 index 位置的八位字节。 这个值指向的是单个字节，所以合法的值范围是的 0x00 至 0xFF（十六进制），或 0 至 255（十进制）。

该操作符继承自 Uint8Array，所以它对越界访问的处理与 UInt8Array 相同（也就是说，获取时返回 undefined，设置时什么也不做）。
```
const str = 'Node.js';
const buf = Buffer.allocUnsafe(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('ascii'));
// 输出: Node.js
```

**buf.buffer**
buffer 属性指向创建该 Buffer 的底层的 ArrayBuffer 对象。
```
const arrayBuffer = new ArrayBuffer(16);
const buffer = Buffer.from(arrayBuffer);

console.log(buffer.buffer === arrayBuffer);
// 输出: true
```

**buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])**
target <Buffer> | <Uint8Array> 要比较的 Buffer 或 Uint8Array。
targetStart <integer> target 中开始对比的偏移量。 默认: 0
targetEnd <integer> target 中结束对比的偏移量（不包含）。 默认: target.length
sourceStart <integer> buf 中开始对比的偏移量。 默认: 0
sourceEnd <integer> buf 中结束对比的偏移量（不包含）。 默认: buf.length
返回: <integer>
比较 buf 与 target，返回表明 buf 在排序上是否排在 target 之前、或之后、或相同。 对比是基于各自 Buffer 实际的字节序列。

如果 target 与 buf 相同，则返回 0 。
如果 target 排在 buf 前面，则返回 1 。
如果 target 排在 buf 后面，则返回 -1 。

```
const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// 输出: 0

console.log(buf1.compare(buf2));
// 输出: -1

console.log(buf1.compare(buf3));
// 输出: -1

console.log(buf2.compare(buf1));
// 输出: 1

console.log(buf2.compare(buf3));
// 输出: 1

console.log([buf1, buf2, buf3].sort(Buffer.compare));
// 输出: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (结果相当于: [buf1, buf3, buf2])
```
可选的 targetStart 、 targetEnd 、 sourceStart 与 sourceEnd 参数可用于分别在 target 与 buf 中限制对比在指定的范围内。
```
const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// 输出: 0

console.log(buf1.compare(buf2, 0, 6, 4));
// 输出: -1

console.log(buf1.compare(buf2, 5, 6, 5));
// 输出: 1
```
如果 targetStart < 0 、 sourceStart < 0 、 targetEnd > target.byteLength 或 sourceEnd > source.byteLength，则抛出 RangeError 错误。

**buf.copy(target[, targetStart[, sourceStart[, sourceEnd]]])**
target <Buffer> | <Uint8Array> 要拷贝进的 Buffer 或 Uint8Array。
targetStart <integer> target 中开始拷贝进的偏移量。 默认: 0
sourceStart <integer> buf 中开始拷贝的偏移量。 默认: 0
sourceEnd <integer> buf 中结束拷贝的偏移量（不包含）。 默认: buf.length
返回: <integer> 被拷贝的字节数。
拷贝 buf 的一个区域的数据到 target 的一个区域，即便 target 的内存区域与 buf 的重叠。
```
const buf1 = Buffer.allocUnsafe(26);
const buf2 = Buffer.allocUnsafe(26).fill('!');

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值
  buf1[i] = i + 97;
}

buf1.copy(buf2, 8, 16, 20);

console.log(buf2.toString('ascii', 0, 25));
// 输出: !!!!!!!!qrst!!!!!!!!!!!!!

// 创建一个 Buffer ，并拷贝同一 Buffer 中一个区域的数据到另一个重叠的区域。
const buf = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值
  buf[i] = i + 97;
}

buf.copy(buf, 0, 4, 10);

console.log(buf.toString());
// 输出: efghijghijklmnopqrstuvwxyz
```
