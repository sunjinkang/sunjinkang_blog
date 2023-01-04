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

const crypto = require('crypto');
const cipher = crypto.createCipher('aes192', 'a password');

let encrypted = cipher.update('some clear text data', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log(encrypted);
// Prints: ca981be48e90867604588e75d04feabb63cc007a8f8ad89b10616ed84d815504
