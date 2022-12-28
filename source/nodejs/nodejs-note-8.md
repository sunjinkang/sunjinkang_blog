---
title: nodejs基础知识(3)
date: 2022-12-28 12:18:33
tags: [node, buffer]
---

###### Buffer(缓冲)

**buf.entries()**
从 buf 的内容中，创建并返回一个 [index, byte] 形式的迭代器
```
const buf = Buffer.from('buffer');
for (const pair of buf.entries()) {
  console.log(pair);
}
// 输出:
// [ 0, 0 ]
// [ 1, 0 ]
// [ 2, 0 ]
// [ 3, 0 ]
// [ 4, 0 ]
// [ 5, 0 ]
// [ 6, 0 ]
// [ 7, 0 ]
// [ 8, 0 ]
// [ 9, 0 ]
```

**buf.equals(otherBuffer)**
如果 buf 与 otherBuffer 具有完全相同的字节，则返回 true，否则返回 false。
```
const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// 输出: true

console.log(buf1.equals(buf3));
// 输出: false
```

**buf.fill(value[, offset[, end]][, encoding])**
value <string> | <Buffer> | <integer> 用来填充 buf 的值。
offset <integer> 开始填充 buf 前要跳过的字节数。默认: 0。
end <integer> 结束填充 buf 的位置（不包含）。默认: buf.length。
encoding <string> 如果 value 是一个字符串，则这是它的字符编码。默认: 'utf8'。
返回: <Buffer> buf 的引用。
如果未指定 offset 和 end，则填充整个 buf。 这个简化使得一个 Buffer 的创建与填充可以在一行内完成。
```
const b = Buffer.allocUnsafe(50).fill('h');
console.log(b.toString());
// 输出: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
```
value 如果不是一个字符串或整数，则会被强行转换为 uint32 值。
如果 fill() 操作的最后一次写入的是一个多字节字符，则只有字符中适合 buf 的第一个字节会被写入。
```
console.log(Buffer.allocUnsafe(3).fill('\u0222'));
// 输出: <Buffer c8 a2 c8>

const buf = Buffer.allocUnsafe(5);
console.log(buf.fill('a'));
// Prints: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// Prints: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// Prints: <Buffer aa aa aa aa aa>
```

**buf.includes(value[, byteOffset][, encoding])**
value <string> | <Buffer> | <integer> 要搜索的值
byteOffset <integer> buf 中开始搜索的位置。默认: 0
encoding <string> 如果 value 是一个字符串，则这是它的字符编码。 默认: 'utf8'
返回: <boolean> 如果 buf 找到 value，则返回 true，否则返回 false
相当于 buf.indexOf() !== -1。

**buf.indexOf(value[, byteOffset][, encoding])**
value <string> | <Buffer> | <Uint8Array> | <integer> 要搜索的值
byteOffset <integer> buf 中开始搜索的位置。默认: 0
encoding <string> 如果 value 是一个字符串，则这是它的字符编码。 默认: 'utf8'
返回: <integer> buf 中 value 首次出现的索引，如果 buf 没包含 value 则返回 -1
如果 value 是：
- 字符串，则 value 根据 encoding 的字符编码进行解析。
- Buffer 或 Uint8Array，则 value 会被作为一个整体使用。如果要比较部分 Buffer，可使用 buf.slice()。
- 数值, 则 value 会解析为一个 0 至 255 之间的无符号八位整数值。

如果 value 不是一个字符串， 数字， 或者 Buffer， 该方法会抛出一个 TypeError 异常， 如果 value 是一个数字， 它将会被强制转换成一个有效的 byte 值， 该值介于0到255之间。

如果 byteOffset 不是一个数字， 它将会被强制转换成一个数字。 任何对 NaN 或者 0, 像 {}, [], null or undefined， 的参数， 将会搜索整个 buffer。 该行为和 String#indexOf() 保持一致。

如果 value 是一个空字符串或空 Buffer，并且 byteOffset 小于 buf.length，返回 byteOffset。如果 value 是一个空字符串，并且 byteOffset 大于 buf.length，返回 buf.length。
```
const b = Buffer.from('abcdef');

console.log(b.indexOf(99.9));
console.log(b.indexOf(256 + 99));
// 传入一个不是有效字节的数字
// 输出：2，相当于搜索 99 或 'c'

console.log(b.indexOf('b', undefined));
console.log(b.indexOf('b', {}));
console.log(b.indexOf('b', null));
console.log(b.indexOf('b', []));
// 传入 byteOffset，其值强制转换为 NaN 或 0
// 输出：1，搜索整个 buffer
```

**buf.keys()**
创建并返回一个包含 buf 键名（索引）的迭代器。

**buf.lastIndexOf(value[, byteOffset][, encoding])**
value <string> | <Buffer> | <Uint8Array> | <integer> 要搜索的值
byteOffset <integer> buf 中开始搜索的位置。 默认: buf.length- 1
encoding <string> 如果 value 是一个字符串，则这是它的字符编码。 默认: 'utf8'
返回: <integer> buf 中 value 最后一次出现的索引，如果 buf 没包含 value 则返回 -1
与 buf.indexOf() 类似，除了 buf 是从后往前搜索而不是从前往后。

如果 value 不是一个字符串， 数字， 或者 Buffer， 该方法会抛出一个 TypeError 异常， 如果 value 是一个数字， 它将会被强制转换成一个有效的 byte 值， 该值介于0到255之间。

如果 byteOffset 不是一个数字， 它将会被强制转换成一个数字。 任何对 NaN or 0, like {}, [], null or undefined， 的参数， 将会搜索整个 buffer。 该行为和 String#lastIndexOf() 保持一致。

如果 value 是一个空字符串或者空 Buffer，返回 byteOffset。

```
const b = Buffer.from('abcdef');

console.log(b.lastIndexOf(99.9));
console.log(b.lastIndexOf(256 + 99));
// 传入一个不是有效字节的数字
// 输出：2，相当于搜索 99 或 'c'

console.log(b.lastIndexOf('b', undefined));
console.log(b.lastIndexOf('b', {}));
// 传入 byteOffset，其值强制转换为 NaN
// 输出：-1，搜索整个 buffer

console.log(b.lastIndexOf('b', null));
console.log(b.lastIndexOf('b', []));
// 传入 byteOffset，其值强制转换为 0
// 输出：-1，相当于传入 0
```

**buf.length**
返回 buf 在字节数上分配的内存量。 注意，这并不一定反映 buf 内可用的数据量。
```
const buf = Buffer.alloc(1234);

// 输出: 1234
console.log(buf.length);

buf.write('some string', 0, 'ascii');

// 输出: 1234
console.log(buf.length);
```
虽然 length 属性不是不可变的，但改变 length 的值可能会导致不确定、不一致的行为。 那些希望修改一个 Buffer 的长度的应用程序应当将 length 视为只读的，且使用 buf.slice() 创建一个新的 Buffer
```
let buf = Buffer.allocUnsafe(10);

buf.write('abcdefghj', 0, 'ascii');

console.log(buf.length);
// 输出: 10

buf = buf.slice(0, 5);

console.log(buf.length);
// 输出: 5
```

**buf.readDoubleBE(offset[, noAssert])、buf.readDoubleLE(offset[, noAssert])**
offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 8。
noAssert <boolean> 是否跳过 offset 检验？默认: false。
返回: <number>
用指定的字节序格式（readDoubleBE() 返回大端序，readDoubleLE() 返回小端序）从 buf 中指定的 offset 读取一个64位双精度值。

设置 noAssert 为 true 则 offset 可超出 buf 的最后一位字节，但后果是不确定的。
```
const buf = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8]);

console.log(buf.readDoubleBE());
// 输出: 8.20788039913184e-304

console.log(buf.readDoubleLE());
// 输出: 5.447603722011605e-270

console.log(buf.readDoubleLE(1));
// 抛出异常: RangeError: Index out of range

console.log(buf.readDoubleLE(1, true));
// 警告: 读取超出 buffer 的最后一位字节！
// 这会导致内存区段错误！不要这么做！
```

**buf.readFloatBE(offset[, noAssert])、buf.readFloatLE(offset[, noAssert])**
offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 4。
noAssert <boolean> 是否跳过 offset 检验？默认: false。
返回: <number>
用指定的字节序格式（readFloatBE() 返回大端序，readFloatLE() 返回小端序）从 buf 中指定的 offset 读取一个32位浮点值。

设置 noAssert 为 true 则 offset 可超出 buf 的最后一位字节，但后果是不确定的。
```
const buf = Buffer.from([1, 2, 3, 4]);

console.log(buf.readFloatBE());
// 输出: 2.387939260590663e-38

console.log(buf.readFloatLE());
// 输出: 1.539989614439558e-36

console.log(buf.readFloatLE(1));
// 抛出异常: RangeError: Index out of range

console.log(buf.readFloatLE(1, true));
// 警告: 读取超出 buffer 的最后一位字节！
// 这会导致内存区段错误！不要这么做！
```

**buf.readInt8(offset[, noAssert])**
offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 1。
noAssert <boolean> 是否跳过 offset 检验？默认: false。
返回: <integer>
从 buf 中指定的 offset 读取一个有符号的8位整数值。

设置 noAssert 为 true 则 offset 可超出 buf 的最后一位字节，但后果是不确定的。

从 Buffer 中读取的整数值会被解析为二进制补码值。

**buf.readInt16BE(offset[, noAssert])、buf.readInt16LE(offset[, noAssert])**
offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 2。
noAssert <boolean> 是否跳过 offset 检验？默认: false。
返回: <integer>
用指定的字节序格式（readInt16BE() 返回大端序，readInt16LE() 返回小端序）从 buf 中指定的 offset 读取一个有符号的16位整数值。

设置 noAssert 为 true 则 offset 可超出 buf 的最后一位字节，但后果是不确定的。

从 Buffer 中读取的整数值会被解析为二进制补码值。

**buf.readInt32BE(offset[, noAssert])、buf.readInt32LE(offset[, noAssert])**
offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 4。
noAssert <boolean> 是否跳过 offset 检验？默认: false。
返回: <integer>
用指定的字节序格式（readInt32BE() 返回大端序，readInt32LE() 返回小端序）从 buf 中指定的 offset 读取一个有符号的32位整数值。

设置 noAssert 为 true 则 offset 可超出 buf 的最后一位字节，但后果是不确定的。

从 Buffer 中读取的整数值会被解析为二进制补码值。

**buf.readIntBE(offset, byteLength[, noAssert])、buf.readIntLE(offset, byteLength[, noAssert])**
offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - byteLength。
byteLength <integer> 要读取的字节数。必须满足：0 < byteLength <= 6。
noAssert <boolean> 是否跳过 offset 和 byteLength 校验？ 默认: false。
返回: <integer>
从 buf 中指定的 offset 读取 byteLength 个字节，且读取的值会被解析为二进制补码值。 最高支持48位精度。

设置 noAssert 为 true 则 offset 可超出 buf 的最后一位字节，但后果是不确定的。

**buf.readUInt8(offset[, noAssert])**
offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 1。
noAssert <boolean> 是否跳过 offset 检验？默认: false。
返回: <integer>
从 buf 中指定的 offset 读取一个无符号的8位整数值。

设置 noAssert 为 true 则 offset 可超出 buf 的最后一位字节，但后果是不确定的。

**buf.readUInt16BE(offset[, noAssert])、buf.readUInt16LE(offset[, noAssert])**
offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 2。
noAssert <boolean> 是否跳过 offset 检验？默认: false。
返回: <integer>
用指定的字节序格式（readUInt16BE() 返回大端序，readUInt16LE() 返回小端序）从 buf 中指定的 offset 读取一个无符号的16位整数值。

设置 noAssert 为 true 则 offset 可超出 buf 的最后一位字节，但后果是不确定的。

**buf.readUInt32BE(offset[, noAssert])、buf.readUInt32LE(offset[, noAssert])**
offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - 4。
noAssert <boolean> 是否跳过 offset 检验？默认: false。
返回: <integer>
用指定的字节序格式（readUInt32BE() 返回大端序，readUInt32LE() 返回小端序）从 buf 中指定的 offset 读取一个无符号的32位整数值。

设置 noAssert 为 true 则 offset 可超出 buf 的最后一位字节，但后果是不确定的。

**buf.readUIntBE(offset, byteLength[, noAssert])、buf.readUIntLE(offset, byteLength[, noAssert])**
offset <integer> 开始读取前要跳过的字节数，必须满足：0 <= offset <= buf.length - byteLength。
byteLength <integer> 要读取的字节数。必须满足：0 < byteLength <= 6。
noAssert <boolean> 是否跳过 offset 和 byteLength 校验？ 默认: false。
返回: <integer>
从 buf 中指定的 offset 读取 byteLength 个字节，且读取的值会被解析为无符号的整数。 最高支持48位精度。

设置 noAssert 为 true 则 offset 可超出 buf 的最后一位字节，但后果是不确定的。

**buf.slice([start[, end]])**
start <integer> 新建的 Buffer 开始的位置。 默认: 0
end <integer> 新建的 Buffer 结束的位置（不包含）。 默认: buf.length
返回: <Buffer>
返回一个指向相同原始内存的新建的 Buffer，但做了偏移且通过 start 和 end 索引进行裁剪。

指定大于buf.length的结束值，与结束值设置为buf.length的结果一样。

*注意，修改这个新建的 Buffer 切片，也会同时修改原始的 Buffer 的内存，因为这两个对象所分配的内存是重叠的。*

*指定负的索引会导致切片的生成是相对于 buf 的末尾而不是开头*
```
const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值 
  buf1[i] = i + 97;
}

const buf2 = buf1.slice(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// 输出: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// 输出: !bc


const buf = Buffer.from('buffer');

console.log(buf.slice(-6, -1).toString());
// 输出: buffe
// (相当于 buf.slice(0, 5))

console.log(buf.slice(-6, -2).toString());
// 输出: buff
// (相当于 buf.slice(0, 4))

console.log(buf.slice(-5, -2).toString());
// 输出: uff
// (相当于 buf.slice(1, 4))
```

**buf.swap16()**
将 buf 解析为一个无符号16位的整数数组，并且以字节顺序原地进行交换。 如果 buf.length 不是2的倍数，则抛出 RangeError 错误。
```
const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

// 输出: <Buffer 01 02 03 04 05 06 07 08>
console.log(buf1);

buf1.swap16();

// 输出: <Buffer 02 01 04 03 06 05 08 07>
console.log(buf1);


const buf2 = Buffer.from([0x1, 0x2, 0x3]);

// 抛出异常: RangeError: Buffer size must be a multiple of 16-bits
buf2.swap16();
```
**buf.swap32()**
将 buf 解析为一个无符号32位的整数数组，并且以字节顺序原地进行交换。 如果 buf.length 不是4的倍数，则抛出 RangeError 错误。
```
const buf1 = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5, 0x6, 0x7, 0x8]);

// 输出: <Buffer 01 02 03 04 05 06 07 08>
console.log(buf1);

buf1.swap32();

// 输出: <Buffer 04 03 02 01 08 07 06 05>
console.log(buf1);


const buf2 = Buffer.from([0x1, 0x2, 0x3]);

// 抛出异常: RangeError: Buffer size must be a multiple of 32-bits
buf2.swap32();
```

**buf.swap64()**
将 buf 解析为一个64位的数值数组，并且以字节顺序原地进行交换。 如果 buf.length 不是8的倍数，则抛出 RangeError 错误。
*注意，JavaScript 不能编码64位整数。 该方法是用来处理64位浮点数的。*

**buf.toJSON()**
返回 buf 的 JSON 格式。 当字符串化一个 Buffer 实例时，JSON.stringify() 会隐式地调用该函数。
```
const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

// 输出: {"type":"Buffer","data":[1,2,3,4,5]}
console.log(json);

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value.data) :
    value;
});

// 输出: <Buffer 01 02 03 04 05>
console.log(copy);
```

**buf.toString([encoding[, start[, end]]])**
encoding <string> 解码使用的字符编码。默认: 'utf8'
start <integer> 开始解码的字节偏移量。默认: 0
end <integer> 结束解码的字节偏移量（不包含）。 默认: buf.length
返回: <string>
根据 encoding 指定的字符编码解码 buf 成一个字符串。 start 和 end 可传入用于只解码 buf 的一部分。

字符串实例的最大长度（以UTF-16代码为单位）可查看buffer.constants.MAX_STRING_LENGTH。

**buf.values()**
创建并返回一个包含 buf 的值（字节）的迭代器。 当 Buffer 使用 for..of 时会自动调用该函数。

**buf.write(string[, offset[, length]][, encoding])**
string <string> 要写入 buf 的字符串。
offset <integer> 开始写入 string 前要跳过的字节数。默认: 0。
length <integer> 要写入的字节数。默认: buf.length - offset。
encoding <string> string 的字符编码。默认: 'utf8'。
返回: <integer> 写入的字节数。
根据 encoding 的字符编码写入 string 到 buf 中的 offset 位置。 length 参数是写入的字节数。 如果 buf 没有足够的空间保存整个字符串，则只会写入 string 的一部分。 只部分解码的字符不会被写入。

**buf.writeDoubleBE(value, offset[, noAssert])、buf.writeDoubleLE(value, offset[, noAssert])**
用指定的字节序格式（writeDoubleBE() 写入大端序，writeDoubleLE() 写入小端序）写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的64位双精度值。 当 value 不是一个64位双精度值时，反应是不确定的。

**buf.writeFloatBE(value, offset[, noAssert])、buf.writeFloatLE(value, offset[, noAssert])**
用指定的字节序格式（writeFloatBE() 写入大端序，writeFloatLE() 写入小端序）写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的32位浮点值。 当 value 不是一个32位浮点值时，反应是不确定的

**buf.writeInt8(value, offset[, noAssert])**
写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的有符号的8位整数。 当 value 不是一个有符号的8位整数时，反应是不确定的。

**buf.writeInt16BE(value, offset[, noAssert])、buf.writeInt16LE(value, offset[, noAssert])**
用指定的字节序格式（writeInt16BE() 写入大端序，writeInt16LE() 写入小端序）写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的有符号的16位整数。 当 value 不是一个有符号的16位整数时，反应是不确定的。

**buf.writeInt32BE(value, offset[, noAssert])、buf.writeInt32LE(value, offset[, noAssert])**
用指定的字节序格式（writeInt32BE() 写入大端序，writeInt32LE() 写入小端序）写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的有符号的32位整数。 当 value 不是一个有符号的32位整数时，反应是不确定的。

**buf.writeIntBE(value, offset, byteLength[, noAssert])、buf.writeIntLE(value, offset, byteLength[, noAssert])**
写入 value 中的 byteLength 个字节到 buf 中指定的 offset 位置。 最高支持48位精度。 当 value 不是一个有符号的整数时，反应是不确定的。

**buf.writeUInt8(value, offset[, noAssert])**
写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的无符号的8位整数。 当 value 不是一个无符号的8位整数时，反应是不确定的。

**buf.writeUInt16BE(value, offset[, noAssert])、buf.writeUInt16LE(value, offset[, noAssert])**
用指定的字节序格式（writeUInt16BE() 写入大端序，writeUInt16LE() 写入小端序）写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的无符号的16位整数。 当 value 不是一个无符号的16位整数时，反应是不确定的。

**buf.writeUInt32BE(value, offset[, noAssert])、buf.writeUInt32LE(value, offset[, noAssert])**
用指定的字节序格式（writeUInt32BE() 写入大端序，writeUInt32LE() 写入小端序）写入 value 到 buf 中指定的 offset 位置。 value 应当是一个有效的无符号的32位整数。 当 value 不是一个无符号的32位整数时，反应是不确定的。

**buf.writeUIntBE(value, offset, byteLength[, noAssert])、buf.writeUIntLE(value, offset, byteLength[, noAssert])**
写入 value 中的 byteLength 个字节到 buf 中指定的 offset 位置。 最高支持48位精度。 当 value 不是一个无符号的整数时，反应是不确定的。

**buffer.INSPECT_MAX_BYTES**
当调用 buf.inspect() 时返回的最大字节数。 可以被用户模块重写。 详见 util.inspect() 了解更多 buf.inspect() 的行为。

注意，这个属性是在通过 require('buffer') 返回的 buffer 模块上，而不是在 Buffer 的全局变量或 Buffer 实例上。默认值：50

**buffer.kMaxLength**
分配给单个 Buffer 实例的最大内存
注意整个属性是通过 require('buffer') 返回的 buffer 模块的属性，而不是全局 Buffer 对象或 Buffer 实例的属性。

**buffer.transcode(source, fromEnc, toEnc)**
source <Buffer> | <Uint8Array> 一个 Buffer 或 Uint8Array 实例
fromEnc <string> 当前编码
toEnc <string> 目标编码
将给定的 Buffer 或 Uint8Array 实例从一个字符编码重新编码到另一个字符。 返回一个新的Buffer实例。
如果 fromEnc 或 toEnc 指定的字符串编码无效，或者不允许从 fromEnc 转换为 toEnc，将抛出异常。
如果给定的字节序列不能在目标编码中充分表示，转码过程将使用替代字符。
```
const buffer = require('buffer');

const newBuf = buffer.transcode(Buffer.from('€'), 'utf8', 'ascii');
console.log(newBuf.toString('ascii'));
// 输出: '?'
```
因为欧元符号（€）不能在 US-ASCII 中表示，所以在转换 Buffer 的时候使用 ? 代替。

**Buffer Constants**
请注意buffer.constants是通过require('buffer')返回的buffer模块的一个属性，而不是全局Buffer或Buffer实例
- buffer.constants.MAX_LENGTH
  - 单个Buffer实例允许的最大量度。在32位体系结构上，这个值是(2^30)-1 (~1GB)。 在64位体系结构上，这个值是(2^31)-1 (~2GB)。也可在buffer.kMaxLength查看该值。
- buffer.constants.MAX_STRING_LENGTH
  - 单个string实例允许的最大长度。代表string能有的原始最大长度，以UTF-16代码为单位。该值可能取决于正在使用的JS引擎。