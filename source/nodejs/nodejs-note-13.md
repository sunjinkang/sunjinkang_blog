---
title: nodejs基础知识(6)
date: 2023-01-03 18:04:15
tags: [node, crypto (加密)]
---

crypto 模块提供了加密功能，包含对 OpenSSL 的哈希、HMAC、加密、解密、签名、以及验证功能的一整套封装。

使用 require('crypto') 来访问该模块。
```javascript
const crypto = require('crypto');
```

###### Class: Certificate
SPKAC 最初是由 Netscape 实现的一种证书签名请求机制, 现在正式成为 HTML5's keygen element 的一部分.
crypto 模块提供 Certificate 类用于处理 SPKAC 数据. 最普遍的用法是处理 HTML5 keygen 元素 产生的输出. Node.js 内部使用 OpenSSL's SPKAC implementation 处理.

new crypto.Certificate()#
可以使用 new 关键字或者调用 crypto.Certificate() 方法创建 Certificate 类的实例:
```javascript
const crypto = require('crypto');
const cert1 = new crypto.Certificate();
const cert2 = crypto.Certificate();
```

certificate.exportChallenge(spkac)
spkac <string> | <Buffer> | <TypedArray> | <DataView>
返回 <Buffer> 返回 spkac 数据结构的 challenge 部分，spkac 包含一个公钥和一个 challange。
```javascript
const cert = require('crypto').Certificate();
const spkac = getSpkacSomehow();// 生成过程省略了，不存在这个函数，只是一种象征意义
const challenge = cert.exportChallenge(spkac);
console.log(challenge.toString('utf8'));
// Prints: the challenge as a UTF8 string
```

certificate.exportPublicKey(spkac)
spkac <string> | <Buffer> | <TypedArray> | <DataView>
返回 <Buffer> 数据结构的公钥部分，spkac 包含一个公钥和一个 challange。
```javascript
const cert = require('crypto').Certificate();
const spkac = getSpkacSomehow();// 生成过程省略了，不存在这个函数，只是一种象征意义
const publicKey = cert.exportPublicKey(spkac);
console.log(publicKey);
// Prints: the public key as <Buffer ...>
```

certificate.verifySpkac(spkac)
spkac <Buffer> | <TypedArray> | <DataView>
返回 <boolean> 如果 spkac 数据结构是有效的返回 true，否则返回 false。
```javascript
const cert = require('crypto').Certificate();
const spkac = getSpkacSomehow();
console.log(cert.verifySpkac(Buffer.from(spkac)));
// Prints: true 或者 false
```

###### Class: Cipher
Cipher类的实例用于加密数据。这个类可以用在以下两种方法中的一种:
- 作为stream，既可读又可写，未加密数据的编写是为了在可读的方面生成加密的数据
- 使用cipher.update()和cipher.final()方法产生加密的数据。
crypto.createCipher()或crypto.createCipheriv()方法用于创建Cipher实例。Cipher对象不能直接使用new关键字创建。
```javascript
// 使用Cipher对象作为流
const crypto = require('crypto');
const cipher = crypto.createCipher('aes192', 'a password');

let encrypted = '';
cipher.on('readable', () => {
  const data = cipher.read();
  if (data)
    encrypted += data.toString('hex');
});
cipher.on('end', () => {
  console.log(encrypted);
  // Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504
});

cipher.write('some clear text data');
cipher.end();

// 使用Cipher和管道流
const crypto = require('crypto');
const fs = require('fs');
const cipher = crypto.createCipher('aes192', 'a password');

const input = fs.createReadStream('test.js');
const output = fs.createWriteStream('test.enc');

input.pipe(cipher).pipe(output);

// 使用cipher.update()和cipher.final()方法
const crypto = require('crypto');
const cipher = crypto.createCipher('aes192', 'a password');

let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log(encrypted);
// Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504
```

cipher.final([outputEncoding])
outputEncoding <string>
返回任何加密的内容。如果 outputEncoding 参数是'latin1', 'base64' 或者 'hex'，返回字符串。 如果没有提供 outputEncoding，则返回Buffer。
*一旦cipher.final()方法已被调用，Cipher 对象就不能再用于加密数据。如果试图再次调用cipher.final()，将会抛出一个错误。*

cipher.setAAD(buffer)
buffer <Buffer>
返回<Cipher>方法链。
当使用经过验证的加密模式(目前只支持GCM)时，cipher.setAAD()方法设置用于additional authenticated data(附加验证的data(AAD))输入参数的值。
*cipher.setAAD()法必须在cipher.update()之前调用。*

cipher.getAuthTag()#
当使用经验证的加密模式时(目前只有GCM支持),cipher.getAuthTag()方法返回一个Buffer，此Buffer包含已从给定数据计算后的authentication tag。 
*cipher.getAuthTag()方法只能在使用cipher.final()方法完全加密后调用。*

cipher.setAutoPadding([autoPadding])
autoPadding <boolean> 默认为 true.
返回<Cipher>方法链。
当使用块加密算法时，Cipher类会自动添加padding到输入数据中，来适配相应块大小。可调用cipher.setAutoPadding(false)禁用默认padding。
当autoPadding是false时，整个输入数据的长度必须是cipher块大小的倍数，否则cipher.final()将抛出一个错误。 禁用自动填充对于非标准填充是有用的，例如使用0x0代替PKCS填充。
*cipher.setAutoPadding()必须在cipher.final()之前被调用。*

cipher.update(data[, inputEncoding][, outputEncoding])
用data更新密码。如果给出了inputEncoding的论证，它的值必须是'utf8', 'ascii', 或者'latin1'，而data参数是使用指定编码的字符串。如果不给出inputEncoding的参数，则data必须是Buffer，TypedArray， 或者DataView。如果data是一个Buffer，TypedArray， 或者 DataView， 那么inputEncoding就被忽略了。
outputEncoding指定了加密数据的输出格式，可以是'latin1'， 'base64' 或者 'hex'。如果指定了outputEncoding，则返回使用指定编码的字符串。如果没有outputEncoding被提供，会返回Buffer。
*cipher.update()方法可以用新数据多次调用，直到cipher.final()被调用。在cipher.final()之后调用cipher.update()将抛出错误。*

