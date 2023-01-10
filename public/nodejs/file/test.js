// console(控制台)
// const fs = require('fs');
// const { Console } = require('console');
// const output = fs.createWriteStream('./stdout.log');
// const errorOutput = fs.createWriteStream('./stderr.log');
// // 自定义的简单记录器
// const logger = new Console(output, errorOutput);
// // 像 console 一样使用
// // const count = 5;
// // logger.log('count: %d', count);
// // // stdout.log 中打印: count 5
// // logger.error(new Error(`error: ${count}`));
// // logger.warn('test warn');

// console.assert(true, 'does nothing');
// // 通过
// console.assert(false, 'Whoops %s', "didn't work");
// Assertion failed: Whoops didn't work

// const crypto = require('crypto');

// const secret = 'abcdefg';
// const hash = crypto
//   .createHmac('sha256', secret)
//   .update('I love cupcakes')
//   .digest('hex');
// console.log(hash);
// c0fa1bc00531bd78ef38c628449c5102aeabd49b5dc3a2a516ea6ea959d6658e

// const cert = require('crypto').Certificate();
// const spkac = getSpkacSomehow();
// const challenge = cert.exportChallenge(spkac);
// console.log(challenge.toString('utf8'));

// const crypto = require('crypto');
// const cipher = crypto.createCipher('aes192', 'a password');

// let encrypted = '';
// cipher.on('readable', () => {
//   const data = cipher.read();
//   if (data) encrypted += data.toString('hex');
// });
// cipher.on('end', () => {
//   console.log(encrypted);
//   // Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504
// });

// cipher.write('some clear text data');
// cipher.end();

// const crypto = require('crypto');
// const fs = require('fs');
// const cipher = crypto.createCipher('aes192', 'a password');

// const input = fs.createReadStream('test.js');
// const output = fs.createWriteStream('test.enc');

// input.pipe(cipher).pipe(output);

// const crypto = require('crypto');
// const cipher = crypto.createCipher('aes192', 'a password');

// let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
// encrypted += cipher.final('hex');
// console.log(encrypted);
// Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504

// Decipher
// 使用Decipher对象作为流
// const crypto = require('crypto');
// const decipher = crypto.createDecipher('aes192', 'a password');

// let decrypted = '';
// decipher.on('readable', () => {
//   const data = decipher.read();
//   if (data) decrypted += data.toString('utf8');
// });
// decipher.on('end', () => {
//   console.log(decrypted);
//   // Prints: some clear text data
// });

// const encrypted =
//   'ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504';
// decipher.write(encrypted, 'hex');
// decipher.end();

// 使用Decipher和管道流
// const crypto = require('crypto');
// const fs = require('fs');
// const decipher = crypto.createDecipher('aes192', 'a password');

// const input = fs.createReadStream('test.enc');
// const output = fs.createWriteStream('test.js');

// input.pipe(decipher).pipe(output);

// 使用decipher.update()和decipher.final()方法
// const crypto = require('crypto');
// const decipher = crypto.createDecipher('aes192', 'a password');

// const encrypted =
//   'ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504';
// let decrypted = decipher.update(encrypted, 'hex', 'utf8');
// decrypted += decipher.final('utf8');
// console.log(decrypted);
// Prints: some clear text data

// DiffieHellman
// const crypto = require('crypto');
// const assert = require('assert');

// // Generate Alice's keys...
// const alice = crypto.createDiffieHellman(2048);
// const aliceKey = alice.generateKeys();

// // Generate Bob's keys...
// const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
// const bobKey = bob.generateKeys();

// // Exchange and generate the secret...
// const aliceSecret = alice.computeSecret(bobKey);
// const bobSecret = bob.computeSecret(aliceKey);

// // OK
// assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));

// ECDH
// const crypto = require('crypto');
// const assert = require('assert');

// // Generate Alice's keys...
// const alice = crypto.createECDH('secp521r1');
// const aliceKey = alice.generateKeys();

// // Generate Bob's keys...
// const bob = crypto.createECDH('secp521r1');
// const bobKey = bob.generateKeys();

// // Exchange and generate the secret...
// const aliceSecret = alice.computeSecret(bobKey);
// const bobSecret = bob.computeSecret(aliceKey);

// assert.strictEqual(aliceSecret.toString('hex'), bobSecret.toString('hex'));
// // OK

// 使用hash对象作为流
// const crypto = require('crypto');
// const hash = crypto.createHash('sha256');
// hash.on('readable', () => {
//   const data = hash.read();
//   if (data) {
//     console.log(data.toString('hex'));
//     // Prints:
//     //   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50
//   }
// });
// hash.write('some data to hash');
// hash.end();

// 使用 Hash 和管道流
// const crypto = require('crypto');
// const fs = require('fs');
// const hash = crypto.createHash('sha256');
// const input = fs.createReadStream('test.js');
// input.pipe(hash).pipe(process.stdout);

// 使用hash.update()和hash.digest()
// const crypto = require('crypto');
// const hash = crypto.createHash('sha256');
// hash.update('some data to hash');
// console.log(hash.digest('hex'));
// Prints:
//   6a2da20943931e9834fc12cfe5bb47bbd9ae43489a30726962b576f4e3993e50

// 使用Hmac对象作为流:
// const crypto = require('crypto');
// const hmac = crypto.createHmac('sha256', 'a secret');
// hmac.on('readable', () => {
//   const data = hmac.read();
//   if (data) {
//     console.log(data.toString('hex'));
//     // Prints:
//     //   7fd04df92f636fd450bc841c9418e5825c17f33ad9c87c518115a45971f7f77e
//   }
// });
// hmac.write('some data to hash');
// hmac.end();

// 使用hmac.update()和hmac.digest()方法
// const crypto = require('crypto');
// const hmac = crypto.createHmac('sha256', 'a secret');
// hmac.update('some data to hash');
// console.log(hmac.digest('hex'));

// 使用“符号”对象作为流:
// const crypto = require('crypto');
// const sign = crypto.createSign('SHA256');
// sign.write('some data to sign');
// sign.end();
// const privateKey = getPrivateKeySomehow();
// console.log(sign.sign(privateKey, 'hex'));

// console.log(crypto.getHashes());
// [
//  'RSA-MD5',
//  'RSA-RIPEMD160',
//  'RSA-SHA1',
//  'RSA-SHA1-2',
//  'RSA-SHA224',
//  'RSA-SHA256',
//  'RSA-SHA3-224',
//  'RSA-SHA3-256',
//  'RSA-SHA3-384',
//  'RSA-SHA3-512',
//  'RSA-SHA384',
//  'RSA-SHA512',
//  'RSA-SHA512/224',
//  'RSA-SHA512/256',
//  'RSA-SM3',
//  'blake2b512',
//  'blake2s256',
//  'id-rsassa-pkcs1-v1_5-with-sha3-224',
//  'id-rsassa-pkcs1-v1_5-with-sha3-256',
//  'id-rsassa-pkcs1-v1_5-with-sha3-384',
//  'id-rsassa-pkcs1-v1_5-with-sha3-512',
//  'md5',
//  'md5-sha1',
//  'md5WithRSAEncryption',
//  'ripemd',
//  'ripemd160',
//  'ripemd160WithRSA',
//  'rmd160',
//  'sha1',
//  'sha1WithRSAEncryption',
//  'sha224',
//  'sha224WithRSAEncryption',
//  'sha256',
//  'sha256WithRSAEncryption',
//  'sha3-224',
//  'sha3-256',
//  'sha3-384',
//  'sha3-512',
//  'sha384',
//  'sha384WithRSAEncryption',
//  'sha512',
//  'sha512-224',
//  'sha512-224WithRSAEncryption',
//  'sha512-256',
//  'sha512-256WithRSAEncryption',
//  'sha512WithRSAEncryption',
//  'shake128',
//  'shake256',
//  'sm3',
//  'sm3WithRSAEncryption',
//  'ssl3-md5',
//  'ssl3-sha1'
// ]

// crypto.pbkdf2
// const crypto = require('crypto');
// crypto.pbkdf2('secret', 'salt', 100000, 64, 'sha512', (err, derivedKey) => {
//   if (err) throw err;
//   console.log(derivedKey.toString('hex'));
//   // 3745e482c6e0ade35da10139e797157f4a5da669dad7d5da88ef87e47471cc47ed941c7ad618e827304f083f8707f12b7cfdd5f489b782f10cc269e3c08d59ae
// });
// randomBytes Asynchronous
// const crypto = require('crypto');
// crypto.randomBytes(256, (err, buf) => {
//   if (err) throw err;
//   console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
//   //   256 bytes of random data: 25f6d5add831f01b3ede1995de62dcdaf30a282a1b3a4b9e4a40ab
//   // 3ae25d68565f7f2c233c5fea5e59eaaf45e42213fa97913070b1bc79f2530b49b7396ad0e3b91e44
//   // 7ebe833b9bee2239a5b099e87c3584384ebe695083765504362a64de09eb65db12c5afd997781c83
//   // de41ab2bbe37a6a7188e495c09cd47acbaf1e30ce156a0dbae1a4bb8c6dda4edf993dd896c9ac76d
//   // e08784833c0afaa8e89f509d149e82427af478a867d0a96c68c193b9c98323b0fa96bb61b0205b19
//   // 9b6df148e92df066d06e0f8691950054c55e0788c3feb69d6c976e3ebe3c6cdc474732c4017504fc
//   // aef9b740b786d5eb9834f5e5dadc7e00c5cf8b865a6087610bfdc8aeb6
// });

// Synchronous
// const buf = crypto.randomBytes(256);
// console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);

// randomFillSync
// const crypto = require('crypto');
// const buf = Buffer.alloc(10);
// console.log(crypto.randomFillSync(buf).toString('hex'));
// // 44c968af68492ff63978

// crypto.randomFillSync(buf, 5);
// console.log(buf.toString('hex'));
// // 44c968af68fd74439eb2

// // The above is equivalent to the following:
// crypto.randomFillSync(buf, 5, 5);
// console.log(buf.toString('hex'));
// // 44c968af685a9c630117

// randomFill
// const crypto = require('crypto');
// const buf = Buffer.alloc(10);
// crypto.randomFill(buf, (err, buf) => {
//   if (err) throw err;
//   console.log(buf.toString('hex'));
//   // 83a3fce8f37ea24bd7e8
// });

// crypto.randomFill(buf, 5, (err, buf) => {
//   if (err) throw err;
//   console.log(buf.toString('hex'));
//   // 83a3fce8f37ea24bd7e8
// });

// // The above is equivalent to the following:
// crypto.randomFill(buf, 5, 5, (err, buf) => {
//   if (err) throw err;
//   console.log(buf.toString('hex'));
//   // 83a3fce8f37ea24bd7e8
// });

// DNS
// const dns = require('dns');

// dns.lookup('nodejs.org', (err, address, family) => {
//   console.log('IP 地址: %j 地址族: IPv%s', address, family);
// });

// const dns = require('dns');

// dns.resolve4('iana.org', (err, addresses) => {
//   if (err) throw err;

//   console.log(`IP 地址: ${JSON.stringify(addresses)}`);

//   addresses.forEach((a) => {
//     dns.reverse(a, (err, hostnames) => {
//       if (err) {
//         throw err;
//       }
//       console.log(`IP 地址 ${a} 逆向解析到域名: ${JSON.stringify(hostnames)}`);
//     });
//   });
// });

// const dns = require('dns');
// const resolver = new dns.Resolver();
// resolver.setServers(['4.4.4.4']);
// // This request will use the server at 4.4.4.4, independent of global settings.
// resolver.resolve4('iana.org', (err, addresses) => {
//   // ...
// });
// resolver.cancel();
// console.log(dns.CANCELLED);
// // ECANCELLED
// console.log(dns.getServers());
// // [ '192.168.238.1' ]

// const dns = require('dns');
// const options = {
//   family: 6,
//   hints: dns.ADDRCONFIG | dns.V4MAPPED,
// };
// dns.lookup('example.com', options, (err, address, family) =>
//   console.log('address: %j family: IPv%s', address, family)
// );
// // address: "::ffff:93.184.216.34" family: IPv6

// // When options.all is true, the result will be an Array.
// options.all = true;
// dns.lookup('example.com', options, (err, addresses) =>
//   console.log('addresses: %j', addresses)
// );
// // addresses: [{"address":"::ffff:93.184.216.34","family":6}]

// lookupService
// const dns = require('dns');
// dns.lookupService('127.0.0.1', 22, (err, hostname, service) => {
//   console.log(hostname, service);
//   // DESKTOP-894BKU0 ssh
// });

// dns.resolveCname('www.baidu.com', (err, hostname) => {
//   console.log(hostname);
//   // [ 'www.a.shifen.com' ]
// });
// dns.resolveMx('google.com', (err, hostname) => {
//   console.log(hostname);
//   // [ { exchange: 'smtp.google.com', priority: 10 } ]
// });
// dns.resolveNaptr('google.com', (err, hostname) => {
//   console.log(hostname);
//   // undefined
// });
// dns.resolveSoa('google.com', (err, hostname) => {
//   console.log(hostname);
//   // {
//   //   nsname: 'ns1.google.com',
//   //   hostmaster: 'dns-admin.google.com',
//   //   serial: 500503917,
//   //   refresh: 900,
//   //   retry: 900,
//   //   expire: 1800,
//   //   minttl: 60
//   // }
// });
// dns.resolveSrv('google.com', (err, hostname) => {
//   console.log(err);
//   // code: 'ENODATA',
//   console.log(hostname);
//   // undefined
// });
// dns.resolveTxt('google.com', (err, hostname) => {
//   console.log(hostname);
// [
//   [ 'v=spf1 include:_spf.google.com ~all' ],
//   [
//     'google-site-verification=wD8N7i1JTNTkezJ49swvWW48f8_9xveREV4oB-0Hf5o'
//   ],
//   [ 'docusign=05958488-4752-4ef2-95eb-aa7ba8a3bd0e' ],
//   [ 'facebook-domain-verification=22rm551cu4k0ab0bxsw536tlds4h95' ],
//   [ 'onetrust-domain-verification=de01ed21f2fa4d8781cbc3ffb89cf4ef' ],
//   [
//     'webexdomainverification.8YX6G=6e6922db-e3e6-4a36-904e-a805c28087fa'
//   ],
//   [
//     'atlassian-domain-verification=5YjTmWmjI92ewqkx2oXmBaD60Td9zWon9r6eakvHX6B77zzkFQto8PQ9QsKnbf4I'
//   ],
//   [ 'apple-domain-verification=30afIBcvSuDV2PLX' ],
//   [ 'MS=E4A68B9AB2BB9670BCE15412F62916164C0B20BB' ],
//   [
//     'globalsign-smime-dv=CDYX+XFHUw2wml6/Gb8+59BsH31KzUr6c1l2BPvqKX8='
//   ],
//   [
//     'google-site-verification=TV9-DBe4R80X4v0M4U_bd_J9cpOJM0nikft0jAgjmsQ'
//   ],
//   [ 'docusign=1b0a6754-49b1-4db5-8540-d2c12664b289' ]
// ]
// });

// dns.resolveAny('google.com', (err, hostname) => {
//   console.log(hostname);
//   // [
//   //   { address: '142.251.43.14', ttl: 526, type: 'A' },
//   //   { value: 'ns2.google.com', type: 'NS' },
//   //   { value: 'ns1.google.com', type: 'NS' },
//   //   { value: 'ns4.google.com', type: 'NS' },
//   //   { value: 'ns3.google.com', type: 'NS' },
//   //   {
//   //     entries: [
//   //       'google-site-verification=wD8N7i1JTNTkezJ49swvWW48f8_9xveREV4oB-0Hf5o'
//   //     ],
//   //     type: 'TXT'
//   //   },
//   //   {
//   //     entries: [ 'docusign=05958488-4752-4ef2-95eb-aa7ba8a3bd0e' ],
//   //     type: 'TXT'
//   //   },
//   //   {
//   //     entries: [ 'facebook-domain-verification=22rm551cu4k0ab0bxsw536tlds4h95' ],
//   //     type: 'TXT'
//   //   },
//   //   {
//   //     entries: [ 'onetrust-domain-verification=de01ed21f2fa4d8781cbc3ffb89cf4ef' ]
//   // ,
//   //     type: 'TXT'
//   //   },
//   //   {
//   //     entries: [
//   //       'webexdomainverification.8YX6G=6e6922db-e3e6-4a36-904e-a805c28087fa'
//   //     ],
//   //     type: 'TXT'
//   //   },
//   //   {
//   //     entries: [
//   //       'atlassian-domain-verification=5YjTmWmjI92ewqkx2oXmBaD60Td9zWon9r6eakvHX6B77zzkFQto8PQ9QsKnbf4I'
//   //     ],
//   //     type: 'TXT'
//   //   },
//   //   {
//   //     entries: [ 'apple-domain-verification=30afIBcvSuDV2PLX' ],
//   //     type: 'TXT'
//   //   },
//   //   {
//   //     entries: [ 'MS=E4A68B9AB2BB9670BCE15412F62916164C0B20BB' ],
//   //     type: 'TXT'
//   //   },
//   //   {
//   //     entries: [
//   //       'globalsign-smime-dv=CDYX+XFHUw2wml6/Gb8+59BsH31KzUr6c1l2BPvqKX8='
//   //     ],
//   //     type: 'TXT'
//   //   },
//   //   {
//   //     entries: [
//   //       'google-site-verification=TV9-DBe4R80X4v0M4U_bd_J9cpOJM0nikft0jAgjmsQ'
//   //     ],
//   //     type: 'TXT'
//   //   },
//   //   {
//   //     entries: [ 'docusign=1b0a6754-49b1-4db5-8540-d2c12664b289' ],
//   //     type: 'TXT'
//   //   },
//   //   { entries: [ 'v=spf1 include:_spf.google.com ~all' ], type: 'TXT' }
//   // ]
// });

// dns.reverse('58.221.60.236', (err, hostname) => {
//   console.log(err);
//   //  code: 'ENOTFOUND'
//   console.log(hostname);
//   // undefined
// });

// function MyError() {
//   Error.stackTraceLimit = 2;
//   // Error.captureStackTrace(this);
//   Error.captureStackTrace(this, MyError);
// }

// console.log(new MyError().stack);
// const process = require('process');
// var EventEmitter = require('events').EventEmitter;
// var life = new EventEmitter();
// function water(who) {
//   console.log('给 ' + who + ' 倒水');
// }
// life.on('Miss', water);
// life.on('Miss', function (who) {
//   // setImmediate(() => {
//   //   console.log('给 ' + who + ' 按摩');
//   // });
//   process.nextTick(() => {
//     console.log('给 ' + who + ' 按摩');
//   });
// });
// life.on('Miss', function (who) {
//   console.log('给 ' + who + ' 聊天');
// });
// life.removeListener('Miss', water);
// life.emit('Miss', '汉子');
// console.log(life.listeners('Miss').length);

// var EventEmitter = require('events').EventEmitter;
// var myEmitter = new EventEmitter();
// // let m = 0;
// // myEmitter.on('event', () => {
// //   console.log(++m);
// // });
// // myEmitter.emit('event');
// // // 打印: 1
// // myEmitter.emit('event');
// // // 打印: 2

// let m = 0;
// myEmitter.once('event', () => {
//   console.log(++m);
// });
// myEmitter.emit('event');
// // 打印: 1
// myEmitter.emit('event');
// // 忽略

// var EventEmitter = require('events').EventEmitter;
// var myEmitter = new EventEmitter();
// // 只处理一次，所以不会无限循环
// myEmitter.once('newListener', (event, listener) => {
//   if (event === 'event') {
//     // 在开头插入一个新的监听器
//     myEmitter.on('event', () => {
//       console.log('B');
//     });
//   }
// });
// myEmitter.on('event', () => {
//   console.log('A');
// });
// myEmitter.emit('event');
// // 打印:
// //   B
// //   A

const EventEmitter = require('events');
// const myEE = new EventEmitter();
// myEE.on('foo', () => {});
// myEE.on('bar', () => {});

// const sym = Symbol('symbol');
// myEE.on(sym, () => {});

// console.log(myEE.eventNames());
// // [ 'foo', 'bar', Symbol(symbol) ]

// const myEE = new EventEmitter();
// myEE.on('foo', () => console.log('a'));
// myEE.prependListener('foo', () => console.log('b'));
// myEE.emit('foo');
// b
// a

const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
myEE.emit('foo');
// b
// a
