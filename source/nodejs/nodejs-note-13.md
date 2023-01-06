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

###### Class: Decipher
Decipher类的实例用于解密数据。这个类可以用在以下两种方法中的一种:
- 作为stream，既可读，又可写，加密数据的编写是为了在可读的方面生成未加密的数据
- 使用decipher.update()和decipher.final()方法产生未加密的数据。
crypto.createDecipher()或crypto.createDecipheriv()的方法 用于创建Decipher实例。Decipher对象不能直接使用new关键字创建。
```javascript
// 使用Decipher对象作为流
const crypto = require('crypto');
const decipher = crypto.createDecipher('aes192', 'a password');

let decrypted = '';
decipher.on('readable', () => {
  const data = decipher.read();
  if (data)
    decrypted += data.toString('utf8');
});
decipher.on('end', () => {
  console.log(decrypted);
  // Prints: some clear text data
});

const encrypted =
    'ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504';
decipher.write(encrypted, 'hex');
decipher.end();

// 使用Decipher和管道流
const crypto = require('crypto');
const fs = require('fs');
const decipher = crypto.createDecipher('aes192', 'a password');

const input = fs.createReadStream('test.enc');
const output = fs.createWriteStream('test.js');

input.pipe(decipher).pipe(output);

// 使用decipher.update()和decipher.final()方法
const crypto = require('crypto');
const decipher = crypto.createDecipher('aes192', 'a password');

const encrypted =
    'ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504';
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log(decrypted);
// Prints: some clear text data
```

decipher.final([outputEncoding])
outputEncoding <string>
返回任何剩余的解密内容。如果outputEncoding参数是'latin1'，'ascii'或'utf8'之一，则返回一个字符串。 如果未提供输出编码，则返回Buffer。
*一旦调用了decipher.final()方法，Decipher对象就不能再用于解密数据。 试图不止一次调用decipher.final()会导致错误被抛出。*

decipher.setAAD(buffer)
buffer <Buffer> | <TypedArray> | <DataView>
返回<cipher>的一个方法链。
当使用经过验证的加密模式（当前仅支持GCM）时，decipher.setAAD()方法会设置用于附加验证数据(AAD)输入参数的值。
*decipher.setAAD() 必须在decipher.update()之前被调用。*

decipher.setAuthTag(buffer)
buffer <Buffer> | <TypedArray> | <DataView>
返回<cipher>的一个方法链。
When using an authenticated encryption mode (only GCM is currently supported), the decipher.setAuthTag() method is used to pass in the received authentication tag. If no tag is provided, or if the cipher text has been tampered with, decipher.final() will throw, indicating that the cipher text should be discarded due to failed authentication.
(当使用经过身份验证的加密模式(目前只支持GCM)时，使用decipher.setAuthTag()方法传入接收到的身份验证标记。如果没有提供标记，或者密文已经被篡改，则decipher.final()将抛出，表明由于身份验证失败，密文应该被丢弃。)
*decipher.setAuthTag()必须在decipher.final()之前被调用。*

decipher.setAutoPadding([autoPadding])
- autoPadding <boolean> 默认为 true.
- 返回<Cipher>方法链。
When data has been encrypted without standard block padding, calling decipher.setAutoPadding(false) will disable automatic padding to prevent decipher.final() from checking for and removing padding.
(当数据加密时没有标准块填充，调用decipher.setAutoPadding(false)将禁用自动填充，以防止decipher.final()检查和删除填充。)
Turning auto padding off will only work if the input data's length is a multiple of the ciphers block size.
(关闭自动填充只有当输入数据的长度是密码块大小的倍数时才会工作。)
*decipher.setAutoPadding()必须在decipher.final()之前被调用。*

decipher.update(data[, inputEncoding][, outputEncoding])
- data <string> | <Buffer> | <TypedArray> | <DataView>
- inputEncoding <string>
- outputEncoding <string>
使用新数据更新解密。如果给出inputEncoding参数，它的值必须是'latin1', 'base64'或'hex'中的一个，data参数是使用指定编码的字符串。如果未给出inputEncoding参数，则data必须是Buffer。如果data是Buffer，则忽略inputEncoding。
outputEncoding指定加密数据的输出格式，可以是'latin1', 'ascii'或'utf8'。如果指定了outputEncoding，则返回使用指定编码的字符串。如果未提供outputEncoding，则返回Buffer。
可以使用新数据多次调用decipher.update()方法，直到调用decipher.final()。在decipher.final()之后调用decipher.update()会导致抛出错误。

###### Class: DiffieHellman
DiffieHellman类是一个用来创建Diffie-Hellman键交换的工具。 DiffieHellman类的实例可以使用crypto.createDiffieHellman()方法。
```javascript
const crypto = require('crypto');
const assert = require('assert');

// Generate Alice's keys...
const alice = crypto.createDiffieHellman(2048);
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

// OK
console.log(assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex')));
```

diffieHellman.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])
- otherPublicKey <string> | <Buffer> | <TypedArray> | <DataView>
- inputEncoding <string>
- outputEncoding <string>
Computes the shared secret using otherPublicKey as the other party's public key and returns the computed shared secret. The supplied key is interpreted using the specified inputEncoding, and secret is encoded using specified outputEncoding. Encodings can be 'latin1', 'hex', or 'base64'. If the inputEncoding is not provided, otherPublicKey is expected to be a Buffer, TypedArray, or DataView.
If outputEncoding is given a string is returned; otherwise, a Buffer is returned.
(使用otherPublicKey作为另一方的公钥计算共享密钥，并返回计算出的共享密钥。提供的key使用指定的inputEncoding进行解释，secret使用指定的outputEncoding进行编码。编码可以是'latin1'， 'hex'或'base64'。如果inputEncoding未提供，otherPublicKey将被期望为Buffer、TypedArray或DataView。
如果给出outputEncoding，则返回一个字符串;否则，返回Buffer。)

diffieHellman.generateKeys([encoding])
- encoding <string>
Generates private and public Diffie-Hellman key values, and returns the public key in the specified encoding. This key should be transferred to the other party. Encoding can be 'latin1', 'hex', or 'base64'. If encoding is provided a string is returned; otherwise a Buffer is returned.
(生成私有和公共的Diffie-Hellman密钥值，并返回指定编码的公钥。这把钥匙应该移交给对方。Encoding可以是'latin1'， 'hex'或'base64'。如果提供了编码，则返回字符串;否则返回Buffer。)

diffieHellman.getGenerator([encoding])
- encoding <string>
Returns the Diffie-Hellman generator in the specified encoding, which can be 'latin1', 'hex', or 'base64'. If encoding is provided a string is returned; otherwise a Buffer is returned.
(返回指定编码的Diffie-Hellman生成器，可以是'latin1'、'hex'或'base64'。如果提供了编码，则返回字符串;否则返回Buffer。)

diffieHellman.getPrime([encoding])
- encoding <string>
Returns the Diffie-Hellman prime in the specified encoding, which can be 'latin1', 'hex', or 'base64'. If encoding is provided a string is returned; otherwise a Buffer is returned.
(返回指定编码的Diffie-Hellman素数，可以是'latin1'、'hex'或'base64'。如果提供了编码，则返回字符串;否则返回Buffer。)

diffieHellman.getPrivateKey([encoding])
- encoding <string>
Returns the Diffie-Hellman private key in the specified encoding, which can be 'latin1', 'hex', or 'base64'. If encoding is provided a string is returned; otherwise a Buffer is returned.
(返回指定编码的Diffie-Hellman私钥，可以是'latin1'、'hex'或'base64'。如果提供了编码，则返回字符串;否则返回Buffer。)

diffieHellman.getPublicKey([encoding])
- encoding <string>
Returns the Diffie-Hellman public key in the specified encoding, which can be 'latin1', 'hex', or 'base64'. If encoding is provided a string is returned; otherwise a Buffer is returned.
(返回指定编码的Diffie-Hellman公钥，可以是'latin1'、'hex'或'base64'。如果提供了编码，则返回字符串;否则返回Buffer。)

diffieHellman.setPrivateKey(privateKey[, encoding])
- privateKey <string> | <Buffer> | <TypedArray> | <DataView>
- encoding <string>
Sets the Diffie-Hellman private key. If the encoding argument is provided and is either 'latin1', 'hex', or 'base64', privateKey is expected to be a string. If no encoding is provided, privateKey is expected to be a Buffer, TypedArray, or DataView.
(设置Diffie-Hellman私钥。如果encoding参数是'latin1'， 'hex'或'base64'， privateKey将是一个字符串。如果没有提供编码，privateKey应该是Buffer、TypedArray或DataView。)

diffieHellman.setPublicKey(publicKey[, encoding])
- publicKey <string> | <Buffer> | <TypedArray> | <DataView>
- encoding <string>
Sets the Diffie-Hellman public key. If the encoding argument is provided and is either 'latin1', 'hex' or 'base64', publicKey is expected to be a string. If no encoding is provided, publicKey is expected to be a Buffer, TypedArray, or DataView.
(设置Diffie-Hellman公钥。如果encoding参数是'latin1'， 'hex'或'base64'， publicKey将是一个字符串。如果没有提供编码，则publicKey应该是Buffer、TypedArray或DataView。)

diffieHellman.verifyError
A bit field containing any warnings and/or errors resulting from a check performed during initialization of the DiffieHellman object.
The following values are valid for this property (as defined in constants module):
(一个位字段，包含在DiffieHellman对象初始化期间执行的检查所导致的任何警告和/或错误。
以下值对该属性有效(在constants模块中定义))
- DH_CHECK_P_NOT_SAFE_PRIME
- DH_CHECK_P_NOT_PRIME
- DH_UNABLE_TO_CHECK_GENERATOR
- DH_NOT_SUITABLE_GENERATOR

###### Class: ECDH
ECDH类是创建椭圆曲线Diffie-Hellman（Elliptic Curve Diffie-Hellman (ECDH)）键交换的实用工具。 ECDH类的实例可以使用crypto.createECDH()方法。
```javascript
const crypto = require('crypto');
const assert = require('assert');

// Generate Alice's keys...
const alice = crypto.createECDH('secp521r1');
const aliceKey = alice.generateKeys();

// Generate Bob's keys...
const bob = crypto.createECDH('secp521r1');
const bobKey = bob.generateKeys();

// Exchange and generate the secret...
const aliceSecret = alice.computeSecret(bobKey);
const bobSecret = bob.computeSecret(aliceKey);

assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// OK
```

ecdh.computeSecret(otherPublicKey[, inputEncoding][, outputEncoding])
作用参考diffieHellman.computeSecret

ecdh.generateKeys([encoding[, format]])
- encoding <string>
- format <string> Defaults to uncompressed.
Generates private and public EC Diffie-Hellman key values, and returns the public key in the specified format and encoding. This key should be transferred to the other party.
The format argument specifies point encoding and can be 'compressed' or 'uncompressed'. If format is not specified, the point will be returned in 'uncompressed' format.
The encoding argument can be 'latin1', 'hex', or 'base64'. If encoding is provided a string is returned; otherwise a Buffer is returned.
(生成私有和公共EC Diffie-Hellman key值，并返回指定格式和编码的公钥。这把钥匙应该移交给对方。
format参数指定点编码，可以是'compressed'或'uncompressed'。如果未指定format，则该点将以“未压缩”格式返回。
encoding参数可以是'latin1'， 'hex'或'base64'。如果提供了编码，则返回字符串;否则返回Buffer。)

ecdh.getPrivateKey([encoding])
作用参考diffieHellman.getPrivateKey

ecdh.getPublicKey([encoding][, format])
作用参考diffieHellman.getPublicKey、ecdh.generateKeys

ecdh.setPrivateKey(privateKey[, encoding])
- privateKey <string> | <Buffer> | <TypedArray> | <DataView>
- encoding <string>
Sets the EC Diffie-Hellman private key. The encoding can be 'latin1', 'hex' or 'base64'. If encoding is provided, privateKey is expected to be a string; otherwise privateKey is expected to be a Buffer, TypedArray, or DataView.
If privateKey is not valid for the curve specified when the ECDH object was created, an error is thrown. Upon setting the private key, the associated public point (key) is also generated and set in the ECDH object.
(设置EC Diffie-Hellman私钥。编码可以是'latin1'， 'hex'或'base64'。如果提供了编码，privateKey应该是一个字符串;否则privateKey将被期望为Buffer, TypedArray或DataView。
如果privateKey对于创建ECDH对象时指定的曲线无效，则抛出错误。在设置私钥之后，还会生成相关的公共点(密钥)，并在ECDH对象中进行设置。)

###### Class: Hash
Hash类是用于创建数据哈希值的工具类。它能用以下方法使用：
- 作为一个stream，它既可读又可写，数据被写入要在可读的方面生成一个计算散列摘要
- 使用hash.update()和hash.digest()方法产生计算后的哈希。
crypto.createHash()方法用于创建Hash实例。Hash不能直接使用new关键字创建对象。
```javascript
// 使用Hash对象作为流:
const crypto = require('crypto');
const hash = crypto.createHash('sha256');
hash.on('readable', () => {
  const data = hash.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
  }
});
hash.write('some data to hash');
hash.end();

// 使用 Hash 和管道流
const crypto = require('crypto');
const fs = require('fs');
const hash = crypto.createHash('sha256');
const input = fs.createReadStream('test.js');
input.pipe(hash).pipe(process.stdout);

// 使用hash.update()和hash.digest()
const crypto = require('crypto');
const hash = crypto.createHash('sha256');
hash.update('some data to hash');
console.log(hash.digest('hex'));
// Prints:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
```

hash.digest([encoding])
- encoding <string>
Calculates the digest of all of the data passed to be hashed (using the hash.update() method). The encoding can be 'hex', 'latin1' or 'base64'. If encoding is provided a string will be returned; otherwise a Buffer is returned.
The Hash object can not be used again after hash.digest() method has been called. Multiple calls will cause an error to be thrown.
(计算传递给散列的所有数据的摘要(使用hash.update()方法)。编码可以是'hex'， 'latin1'或'base64'。如果提供了编码，则返回一个字符串;否则返回Buffer。
Hash对象在调用Hash .digest()方法后不能再次使用。多次调用将导致抛出错误。)

hash.update(data[, inputEncoding])
- data <string> | <Buffer> | <TypedArray> | <DataView>
- inputEncoding <string>
Updates the hash content with the given data, the encoding of which is given in inputEncoding and can be 'utf8', 'ascii' or 'latin1'. If encoding is not provided, and the data is a string, an encoding of 'utf8' is enforced. If data is a Buffer, TypedArray, or DataView, then inputEncoding is ignored.
This can be called many times with new data as it is streamed.
(用给定的数据更新哈希内容，其编码在inputEncoding中给出，可以是'utf8'， 'ascii'或'latin1'。如果没有提供编码，并且数据是字符串，则强制使用'utf8'编码。如果data是Buffer、TypedArray或DataView，则inputEncoding将被忽略。
在流化新数据时，可以多次调用这个函数。)

###### Class: Hmac
Hmac类是用于创建加密Hmac摘要的工具。它可以有两种用法:
- 作为stream,它既可读又可写，数据被写入要在可读的方面生成一个经过计算的HMAC摘要。
- 使用hmac.update()和hmac.digest()方法产生计算后的HMAC摘要。
crypto.createHmac()方法用来创建Hmac实例。Hmac不能直接使用new关键字创建对象。
```javascript
// 使用Hmac对象作为流:
const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', 'a secret');
hmac.on('readable', () => {
  const data = hmac.read();
  if (data) {
    console.log(data.toString('hex'));
    // Prints:
    //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
  }
});

hmac.write('some data to hash');
hmac.end();

// 使用Hmac和管道流
const crypto = require('crypto');
const fs = require('fs');
const hmac = crypto.createHmac('sha256', 'a secret');
const input = fs.createReadStream('test.js');
input.pipe(hmac).pipe(process.stdout);

// 使用hmac.update()和hmac.digest()方法
const crypto = require('crypto');
const hmac = crypto.createHmac('sha256', 'a secret');
hmac.update('some data to hash');
console.log(hmac.digest('hex'));
// Prints:
//   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
```

hmac.digest([encoding])
- encoding <string>
Calculates the HMAC digest of all of the data passed using hmac.update(). The encoding can be 'hex', 'latin1' or 'base64'. If encoding is provided a string is returned; otherwise a Buffer is returned;
The Hmac object can not be used again after hmac.digest() has been called. Multiple calls to hmac.digest() will result in an error being thrown.
(计算使用HMAC .update()传递的所有数据的HMAC摘要。编码可以是'hex'， 'latin1'或'base64'。如果提供了编码，则返回字符串;否则返回Buffer;
Hmac对象在调用Hmac .digest()后不能再使用。多次调用hmac.digest()将导致抛出错误。)

hmac.update(data[, inputEncoding])
- data <string> | <Buffer> | <TypedArray> | <DataView>
- inputEncoding <string>
Updates the Hmac content with the given data, the encoding of which is given in inputEncoding and can be 'utf8', 'ascii' or 'latin1'. If encoding is not provided, and the data is a string, an encoding of 'utf8' is enforced. If data is a Buffer, TypedArray, or DataView, then inputEncoding is ignored.
This can be called many times with new data as it is streamed.
(用给定的数据更新Hmac内容，这些数据的编码在inputEncoding中给出，可以是'utf8'， 'ascii'或'latin1'。如果没有提供编码，并且数据是字符串，则强制使用'utf8'编码。如果data是Buffer、TypedArray或DataView，则inputEncoding将被忽略。
在流化新数据时，可以多次调用这个函数。)

###### Class: Sign
“Sign”类是生成签名的实用工具。它有两种使用方式:
- 作为一个可写的stream，在这里，要签署的数据是写出来的，sign.sign()方法用于生成并返回签名
- 使用sign.update()和sign.sign()方法生产签名。
crypto.createSign()方法用于创建Sign实例。Sign实例不能直接使用new关键字创建。
```javascript
// 使用“符号”对象作为流:
const crypto = require('crypto');
const sign = crypto.createSign('SHA256');
sign.write('some data to sign');
sign.end();
const privateKey = getPrivateKeySomehow();
console.log(sign.sign(privateKey, 'hex'));
// Prints: the calculated signature using the specified private key and
// SHA-256. For RSA keys, the algorithm is RSASSA-PKCS1-v1_5 (see padding
// parameter below for RSASSA-PSS). For EC keys, the algorithm is ECDSA.

// 使用sign.update()和sign.sign()方法：
const crypto = require('crypto');
const sign = crypto.createSign('SHA256');
sign.update('some data to sign');
const privateKey = getPrivateKeySomehow();
console.log(sign.sign(privateKey, 'hex'));
// Prints: the calculated signature

// 使用ECDSA与SHA256进行签名
const crypto = require('crypto');
const sign = crypto.createSign('RSA-SHA256');
sign.update('some data to sign');
const privateKey = getPrivateKeySomehow();
console.log(sign.sign(privateKey, 'hex'));
// Prints: the calculated signature
```

sign.sign(privateKey[, outputFormat])
- privateKey <string> | <Object>
  - key <string>
  - passphrase <string>
- outputFormat <string>
Calculates the signature on all the data passed through using either sign.update() or sign.write().
(使用sign.update()或sign.write()对传递的所有数据计算签名。)
The privateKey argument can be an object or a string. If privateKey is a string, it is treated as a raw key with no passphrase. If privateKey is an object, it must contain one or more of the following properties:
(privateKey参数可以是一个对象或字符串。如果privateKey是一个字符串，它将被视为没有密码短语的原始密钥。如果privateKey是一个对象，它必须包含以下一个或多个属性)
- key: <string> - PEM encoded private key (required)
- passphrase: <string> - passphrase for the private key
- padding: <integer> - Optional padding value for RSA, one of the following:
  - crypto.constants.RSA_PKCS1_PADDING (default)
  - crypto.constants.RSA_PKCS1_PSS_PADDING
Note that RSA_PKCS1_PSS_PADDING will use MGF1 with the same hash function used to sign the message as specified in section 3.1 of RFC 4055.
- saltLength: <integer> - salt length for when padding is RSA_PKCS1_PSS_PADDING. The special value crypto.constants.RSA_PSS_SALTLEN_DIGEST sets the salt length to the digest size, crypto.constants.RSA_PSS_SALTLEN_MAX_SIGN (default) sets it to the maximum permissible value.
The outputFormat can specify one of 'latin1', 'hex' or 'base64'. If outputFormat is provided a string is returned; otherwise a Buffer is returned.
(outputFormat可以指定'latin1'， 'hex'或'base64'中的一个。如果提供了outputFormat，则返回一个字符串;否则返回Buffer。)
The Sign object can not be again used after sign.sign() method has been called. Multiple calls to sign.sign() will result in an error being thrown.
(Sign对象在调用Sign . Sign()方法后不能再次使用。多次调用sign.sign()将导致抛出错误。)

sign.update(data[, inputEncoding])
- data <string> | <Buffer> | <TypedArray> | <DataView>
- inputEncoding <string>
Updates the Sign content with the given data, the encoding of which is given in inputEncoding and can be 'utf8', 'ascii' or 'latin1'. If encoding is not provided, and the data is a string, an encoding of 'utf8' is enforced. If data is a Buffer, TypedArray, or DataView, then inputEncoding is ignored.
This can be called many times with new data as it is streamed.
(用给定的数据更新Sign内容，其编码在inputEncoding中给出，可以是'utf8'， 'ascii'或'latin1'。如果没有提供编码，并且数据是字符串，则强制使用'utf8'编码。如果data是Buffer、TypedArray或DataView，则inputEncoding将被忽略。
在流化新数据时，可以多次调用这个函数。)

###### Class: Verify
Verify类是验证签名的工具。它可以两种方式使用:
- 作为可写的stream，使用书面数据来验证提供的签名
- 使用verify.update()和verify.verify()的方法来验证签名。
crypto.createVerify()方法用于创建Verify实例。 Verify对象不能直接使用new关键字创建。
```javascript
// 使用“验证”对象作为流:
const crypto = require('crypto');
const verify = crypto.createVerify('SHA256');
verify.write('some data to sign');
verify.end();
const publicKey = getPublicKeySomehow();
const signature = getSignatureToVerify();
console.log(verify.verify(publicKey, signature));
// Prints: true or false

// 使用verify.update()和verify.verify()方法
const crypto = require('crypto');
const verify = crypto.createVerify('SHA256');
verify.update('some data to sign');
const publicKey = getPublicKeySomehow();
const signature = getSignatureToVerify();
console.log(verify.verify(publicKey, signature));
// Prints: true or false
```

verify.update(data[, inputEncoding])
- data <string> | <Buffer> | <TypedArray> | <DataView>
- inputEncoding <string>
Updates the Verify content with the given data, the encoding of which is given in inputEncoding and can be 'utf8', 'ascii' or 'latin1'. If encoding is not provided, and the data is a string, an encoding of 'utf8' is enforced. If data is a Buffer, TypedArray, or DataView, then inputEncoding is ignored.
This can be called many times with new data as it is streamed.
(用给定的数据更新Verify内容，其编码在inputEncoding中给出，可以是'utf8'， 'ascii'或'latin1'。如果没有提供编码，并且数据是字符串，则强制使用'utf8'编码。如果data是Buffer、TypedArray或DataView，则inputEncoding将被忽略。
在流化新数据时，可以多次调用这个函数。)

verify.verify(object, signature[, signatureFormat])
- object <string> | <Object>
- signature <string> | <Buffer> | <TypedArray> | <DataView>
- signatureFormat <string>
Verifies the provided data using the given object and signature. The object argument can be either a string containing a PEM encoded object, which can be an RSA public key, a DSA public key, or an X.509 certificate, or an object with one or more of the following properties:
(使用给定对象和签名验证提供的数据。object参数可以是一个包含PEM编码对象的字符串，该对象可以是RSA公钥、DSA公钥或X.509证书，也可以是具有以下一个或多个属性的对象:)
- key: <string> - PEM encoded public key (required)
- padding: <integer> - Optional padding value for RSA, one of the following:
  - crypto.constants.RSA_PKCS1_PADDING (default)
  - crypto.constants.RSA_PKCS1_PSS_PADDING
Note that RSA_PKCS1_PSS_PADDING will use MGF1 with the same hash function used to verify the message as specified in section 3.1 of RFC 4055.
- saltLength: <integer> - salt length for when padding is RSA_PKCS1_PSS_PADDING. The special value crypto.constants.RSA_PSS_SALTLEN_DIGEST sets the salt length to the digest size, crypto.constants.RSA_PSS_SALTLEN_AUTO (default) causes it to be determined automatically.
The signature argument is the previously calculated signature for the data, in the signatureFormat which can be 'latin1', 'hex' or 'base64'. If a signatureFormat is specified, the signature is expected to be a string; otherwise signature is expected to be a Buffer, TypedArray, or DataView.
(signature参数是之前为数据计算的签名，signatureFormat可以是'latin1'， 'hex'或'base64'。如果指定了signatureFormat，则期望签名是一个字符串;否则签名应该是Buffer、TypedArray或DataView。)
Returns true or false depending on the validity of the signature for the data and public key.
(根据数据和公钥的签名的有效性返回true或false。)
The verify object can not be used again after verify.verify() has been called. Multiple calls to verify.verify() will result in an error being thrown.
(在调用verify.verify()之后，验证对象不能再次使用。多次调用verify.verify()将导致抛出错误。)

#### crypto module methods and properties

crypto.constants
Returns an object containing commonly used constants for crypto and security related operations. The specific constants currently defined are described in Crypto Constants.
(返回一个对象，其中包含用于加密和安全相关操作的常用常量。当前定义的特定常数在Crypto constants中描述。)

crypto.DEFAULT_ENCODING
The default encoding to use for functions that can take either strings or buffers. The default value is 'buffer', which makes methods default to Buffer objects.
The crypto.DEFAULT_ENCODING mechanism is provided for backwards compatibility with legacy programs that expect 'latin1' to be the default encoding.
New applications should expect the default to be 'buffer'. This property may become deprecated in a future Node.js release.
(可接受字符串或缓冲区的函数所使用的默认编码。默认值是'buffer'，它使方法默认为buffer对象。
加密。提供DEFAULT_ENCODING机制是为了向后兼容那些期望'latin1'为默认编码的遗留程序。
新应用程序应该期望默认值为'buffer'。这个属性在未来的Node.js版本中可能会被弃用。)

crypto.fips
Property for checking and controlling whether a FIPS compliant crypto provider is currently in use. Setting to true requires a FIPS build of Node.js.
(属性，用于检查和控制当前是否正在使用符合FIPS的加密提供程序。设置为true需要Node.js的FIPS版本。)

crypto.createCipher(algorithm, password[, options])
- algorithm <string>
- password <string> | <Buffer> | <TypedArray> | <DataView>
- options <Object> stream.transform options
Creates and returns a Cipher object that uses the given algorithm and password. Optional options argument controls stream behavior.
(创建并返回使用给定算法和密码的Cipher对象。参数可选options控制流行为。)
The algorithm is dependent on OpenSSL, examples are 'aes192', etc. On recent OpenSSL releases, openssl list-cipher-algorithms will display the available cipher algorithms.
(该算法依赖于OpenSSL，例如'aes192'等。在最新的OpenSSL版本中，OpenSSL list-cipher-algorithms将显示可用的密码算法。)
The password is used to derive the cipher key and initialization vector (IV). The value must be either a 'latin1' encoded string, a Buffer, a TypedArray, or a DataView.
(密码用于导出密码密钥和初始化向量(IV)。该值必须是'latin1'编码的字符串、Buffer、TypedArray或DataView。)
The implementation of crypto.createCipher() derives keys using the OpenSSL function EVP_BytesToKey with the digest algorithm set to MD5, one iteration, and no salt. The lack of salt allows dictionary attacks as the same password always creates the same key. The low iteration count and non-cryptographically secure hash algorithm allow passwords to be tested very rapidly.
(crypto.createCipher()的实现使用OpenSSL函数evp_bytickey派生密钥，并将摘要算法设置为MD5，一次迭代，无盐。盐的缺乏使得字典攻击成为可能，因为相同的密码总是创建相同的密钥。低迭代次数和非加密安全的哈希算法允许非常快速地测试密码。)
In line with OpenSSL's recommendation to use PBKDF2 instead of EVP_BytesToKey it is recommended that developers derive a key and IV on their own using crypto.pbkdf2() and to use crypto.createCipheriv() to create the Cipher object. Users should not use ciphers with counter mode (e.g. CTR, GCM, or CCM) in crypto.createCipher(). A warning is emitted when they are used in order to avoid the risk of IV reuse that causes vulnerabilities. For the case when IV is reused in GCM, see Nonce-Disrespecting Adversaries for details.
(根据OpenSSL的建议，使用PBKDF2而不是EVP_BytesToKey，建议开发人员使用crypto.pbkdf2()自己派生密钥和IV，并使用crypto.createCipheriv()创建Cipher对象。用户不应该在cipher . createcipher()中使用带有计数器模式的密码(例如CTR、GCM或CCM)。在使用它们时发出警告，以避免IV重用导致漏洞的风险。对于在GCM中重用IV的情况，请参阅nonce - disrespect Adversaries了解详细信息。)

**所谓加Salt方法，就是加点“佐料”（Salt这个单词就是盐的意思）。其基本想法是这样的：当用户首次提供密码时（通常是注册时），由系统自动往这个密码里撒一些“佐料”，然后再散列。而当用户登录时，系统为用户提供的代码撒上同样的“佐料”，然后散列，再比较散列值，已确定密码是否正确。**

crypto.createCipheriv(algorithm, key, iv[, options])
- algorithm <string>
- key <string> | <Buffer> | <TypedArray> | <DataView>
- iv <string> | <Buffer> | <TypedArray> | <DataView>
- options <Object> stream.transform options
Creates and returns a Cipher object, with the given algorithm, key and initialization vector (iv). Optional options argument controls stream behavior.
(使用给定的算法、密钥和初始化向量(iv)创建并返回Cipher对象。可选options参数控制流行为。)
The algorithm is dependent on OpenSSL, examples are 'aes192', etc. On recent OpenSSL releases, openssl list-cipher-algorithms will display the available cipher algorithms.
(该算法依赖于OpenSSL，例如'aes192'等。在最新的OpenSSL版本中，OpenSSL list-cipher-algorithms将显示可用的密码算法。)
The key is the raw key used by the algorithm and iv is an initialization vector. Both arguments must be 'utf8' encoded strings, Buffers, TypedArray, or DataViews.
(key是算法使用的原始键，iv是初始化向量。两个参数都必须是'utf8'编码的字符串、Buffers、TypedArray或DataViews。)

crypto.createDecipher(algorithm, password[, options])
- algorithm <string>
- password <string> | <Buffer> | <TypedArray> | <DataView>
- options <Object> stream.transform options
Creates and returns a Decipher object that uses the given algorithm and password (key). Optional options argument controls stream behavior.
(创建并返回使用给定算法和密码(密钥)的Decipher对象。参数可选options控制流行为。)
The implementation of crypto.createDecipher() derives keys using the OpenSSL function EVP_BytesToKey with the digest algorithm set to MD5, one iteration, and no salt. The lack of salt allows dictionary attacks as the same password always creates the same key. The low iteration count and non-cryptographically secure hash algorithm allow passwords to be tested very rapidly.
(crypto.createDecipher()的实现使用OpenSSL函数EVP_BytesToKey派生密钥，并将摘要算法设置为MD5，一次迭代，无盐。盐的缺乏使得字典攻击成为可能，因为相同的密码总是创建相同的密钥。低迭代次数和非加密安全的哈希算法允许非常快速地测试密码。)
In line with OpenSSL's recommendation to use PBKDF2 instead of EVP_BytesToKey it is recommended that developers derive a key and IV on their own using crypto.pbkdf2() and to use crypto.createDecipheriv() to create the Decipher object.
(根据OpenSSL的建议，使用PBKDF2而不是EVP_BytesToKey，建议开发人员使用crypto.pbkdf2()自己派生密钥和IV，并使用crypto.createDecipheriv()来创建Decipher对象。)

crypto.createDecipheriv(algorithm, key, iv[, options])
- algorithm <string>
- key <string> | <Buffer> | <TypedArray> | <DataView>
- iv <string> | <Buffer> | <TypedArray> | <DataView>
- options <Object> stream.transform options

crypto.createDiffieHellman(prime[, primeEncoding][, generator][, generatorEncoding])
- prime <string> | <Buffer> | <TypedArray> | <DataView>
- primeEncoding <string>
- generator <number> | <string> | <Buffer> | <TypedArray> | <DataView> Defaults to 2.
- generatorEncoding <string>

crypto.createDiffieHellman(primeLength[, generator])
- primeLength <number>
- generator <number> | <string> | <Buffer> | <TypedArray> | <DataView> Defaults to 2.

crypto.createECDH(curveName)
- curveName <string>
Use crypto.getCurves() to obtain a list of available curve names. On recent OpenSSL releases, openssl ecparam -list_curves will also display the name and description of each available elliptic curve.

crypto.createHash(algorithm[, options])
- algorithm <string>
- options <Object> stream.transform options
On recent releases of OpenSSL, openssl list-message-digest-algorithms will display the available digest algorithms.

crypto.createHmac(algorithm, key[, options])
- algorithm <string>
- key <string> | <Buffer> | <TypedArray> | <DataView>
- options <Object> stream.transform options
On recent releases of OpenSSL, openssl list-message-digest-algorithms will display the available digest algorithms.
The key is the HMAC key used to generate the cryptographic HMAC hash.

crypto.createSign(algorithm[, options])
- algorithm <string>
- options <Object> [stream.Writable options](https://www.nodeapp.cn/stream.html#stream_constructor_new_stream_writable_options)
Creates and returns a Sign object that uses the given algorithm. Use crypto.getHashes() to obtain an array of names of the available signing algorithms. Optional options argument controls the stream.Writable behavior.

crypto.createVerify(algorithm[, options])
- algorithm <string>
- options <Object> stream.Writable options
Creates and returns a Verify object that uses the given algorithm. Use crypto.getHashes() to obtain an array of names of the available signing algorithms. Optional options argument controls the stream.Writable behavior.

crypto.getCiphers()
Returns an array with the names of the supported cipher algorithms.

crypto.getCurves()
Returns an array with the names of the supported elliptic curves.

crypto.getDiffieHellman(groupName)
- groupName <string>
Creates a predefined DiffieHellman key exchange object. The supported groups are: 'modp1', 'modp2', 'modp5' (defined in RFC 2412, but see Caveats) and 'modp14', 'modp15', 'modp16', 'modp17', 'modp18' (defined in RFC 3526). 

crypto.getHashes()
Returns an array of the names of the supported hash algorithms, such as RSA-SHA256.

crypto.pbkdf2(password, salt, iterations, keylen, digest, callback)
- password <string>
- salt <string>
- iterations <number>
- keylen <number>
- digest <string>
- callback <Function>
  - err <Error>
  - derivedKey <Buffer>
The iterations argument must be a number set as high as possible. The higher the number of iterations, the more secure the derived key will be, but will take a longer amount of time to complete.
The salt should also be as unique as possible. It is recommended that the salts are random and their lengths are at least 16 bytes. See NIST SP 800-132 for details.

crypto.pbkdf2Sync(password, salt, iterations, keylen, digest)
- password <string>
- salt <string>
- iterations <number>
- keylen <number>
- digest <string>
同crypto.pbkdf2

crypto.privateDecrypt(privateKey, buffer)
- privateKey <Object> | <string>
  - key <string> A PEM encoded private key.
  - passphrase <string> An optional passphrase for the private key.
  - padding <crypto.constants> An optional padding value defined in crypto.constants, which may be: crypto.constants.RSA_NO_PADDING, RSA_PKCS1_PADDING, or crypto.constants.RSA_PKCS1_OAEP_PADDING.
- buffer <Buffer> | <TypedArray> | <DataView>
- Returns: <Buffer> A new Buffer with the decrypted content.
privateKey can be an object or a string. If privateKey is a string, it is treated as the key with no passphrase and will use RSA_PKCS1_OAEP_PADDING.

crypto.privateEncrypt(privateKey, buffer)
- privateKey <Object> | <string>
  - key <string> A PEM encoded private key.
  - passphrase <string> An optional passphrase for the private key.
  - padding <crypto.constants> An optional padding value defined in crypto.constants, which may be: crypto.constants.RSA_NO_PADDING or RSA_PKCS1_PADDING.
- buffer <Buffer> | <TypedArray> | <DataView>
- Returns: <Buffer> A new Buffer with the encrypted content.
privateKey can be an object or a string. If privateKey is a string, it is treated as the key with no passphrase and will use RSA_PKCS1_PADDING.

crypto.publicDecrypt(key, buffer)
- key <Object> | <string>
  - key <string> A PEM encoded public or private key.
  - passphrase <string> An optional passphrase for the private key.
  - padding <crypto.constants> An optional padding value defined in crypto.constants, which may be: crypto.constants.RSA_NO_PADDING or RSA_PKCS1_PADDING.
- buffer <Buffer> | <TypedArray> | <DataView>
- Returns: <Buffer> A new Buffer with the decrypted content.
key can be an object or a string. If key is a string, it is treated as the key with no passphrase and will use RSA_PKCS1_PADDING.
Because RSA public keys can be derived from private keys, a private key may be passed instead of a public key.
(因为RSA公钥可以从私钥派生，所以传递的是私钥而不是公钥。)

crypto.publicEncrypt(key, buffer)
- key <Object> | <string>
  - key <string> A PEM encoded public or private key.
  - passphrase <string> An optional passphrase for the private key.
  - padding <crypto.constants> An optional padding value defined in crypto.constants, which may be: crypto.constants.RSA_NO_PADDING, RSA_PKCS1_PADDING, or crypto.constants.RSA_PKCS1_OAEP_PADDING.
- buffer <Buffer> | <TypedArray> | <DataView>
- Returns: <Buffer> A new Buffer with the encrypted content.

crypto.randomBytes(size[, callback])
- size <number>
- callback <Function>
  - err <Error>
  - buf <Buffer>
生成加密强伪随机数据. size参数是指示要生成的字节数的数值。
如果提供 callback回调函数 ,这些字节是异步生成的并且使用两个参数调用callback函数：err和buf。
```javascript
const crypto = require('crypto');
crypto.randomBytes(256, (err, buf) => {
  if (err) throw err;
  console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
});
```
如果未提供 callback回调函数, 则同步地生成随机字节并返回为Buffer。
```javascript
// Synchronous
const buf = crypto.randomBytes(256);
console.log(
  `${buf.length} bytes of random data: ${buf.toString('hex')}`);
```

crypto.randomFillSync(buffer[, offset][, size])
- buffer <Buffer> | <Uint8Array> Must be supplied.
- offset <number> Defaults to 0.
- size <number> Defaults to buffer.length - offset.
```javascript
const buf = Buffer.alloc(10);
console.log(crypto.randomFillSync(buf).toString('hex'));

crypto.randomFillSync(buf, 5);
console.log(buf.toString('hex'));

// The above is equivalent to the following:
crypto.randomFillSync(buf, 5, 5);
console.log(buf.toString('hex'));
```

crypto.randomFill(buffer[, offset][, size], callback)
- buffer <Buffer> | <Uint8Array>必须被支持.
- offset <number> Defaults to 0.
- size <number> Defaults to buffer.length - offset.
- callback <Function> function(err, buf) {}.
If the callback function is not provided, an error will be thrown.
```javascript
const buf = Buffer.alloc(10);
crypto.randomFill(buf, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

crypto.randomFill(buf, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});

// The above is equivalent to the following:
crypto.randomFill(buf, 5, 5, (err, buf) => {
  if (err) throw err;
  console.log(buf.toString('hex'));
});
```

crypto.setEngine(engine[, flags])
- engine <string>
- flags <crypto.constants> Defaults to crypto.constants.ENGINE_METHOD_ALL.
Load and set the engine for some or all OpenSSL functions (selected by flags).
The flags is a bit field taking one of or a mix of the following flags (defined in crypto.constants):
- crypto.constants.ENGINE_METHOD_RSA
- crypto.constants.ENGINE_METHOD_DSA
- crypto.constants.ENGINE_METHOD_DH
- crypto.constants.ENGINE_METHOD_RAND
- crypto.constants.ENGINE_METHOD_ECDH
- crypto.constants.ENGINE_METHOD_ECDSA
- crypto.constants.ENGINE_METHOD_CIPHERS
- crypto.constants.ENGINE_METHOD_DIGESTS
- crypto.constants.ENGINE_METHOD_STORE
- crypto.constants.ENGINE_METHOD_PKEY_METHS
- crypto.constants.ENGINE_METHOD_PKEY_ASN1_METHS
- crypto.constants.ENGINE_METHOD_ALL
- crypto.constants.ENGINE_METHOD_NONE

crypto.timingSafeEqual(a, b)
- a <Buffer> | <TypedArray> | <DataView>
- b <Buffer> | <TypedArray> | <DataView>
This function is based on a constant-time algorithm. Returns true if a is equal to b, without leaking timing information that would allow an attacker to guess one of the values. This is suitable for comparing HMAC digests or secret values like authentication cookies or capability urls
(该函数基于常数时间算法。如果a等于b，则返回true，而不会泄露时间信息，使攻击者能够猜测其中一个值。这适用于比较HMAC摘要或机密值，如身份验证cookie或功能url)
a and b must both be Buffers, TypedArrays, or DataViews, and they must have the same length.

