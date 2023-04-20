// import thunkify from 'thunkify';

// function test(a, b, callback) {
//   const result = a + b;
//   callback(result);
//   callback(result);
//   callback(result);
// }

// const thunkTest = thunkify(test);
// // thunkTest(1, 2)(console.log);

// function* gen() {
//   const first = yield thunkTest(1, 2);
//   const second = yield thunkTest(3, 4);
// }

// const genTest = gen();
// const genValue = genTest.next();
// genValue.value(function (data) {
//   console.log(data);
//   const genValue1 = genTest.next(data);
//   genValue1.value(function (data1) {
//     console.log(data1);
//     genTest.next(data1);
//   });
// });
// function genFn(fn) {
//   const gen = fn();
//   function next(data) {
//     console.log(data);
//     const genValue = gen.next(data);
//     if (genValue.done) return;
//     genValue.value(next);
//   }
//   next();
// }
// genFn(gen);

import co from 'co';
import fs from 'fs';
// 这里的thunk函数也可以自己实现
function size(file) {
  return function (fn) {
    fs.stat(file, function (err, stat) {
      if (err) return fn(err);
      fn(null, stat.size);
    });
  };
}
co(function* () {
  var a = size('../../../package.json');
  var b = size('../../../yarn.lock');
  return [yield a, yield b];
})();

// import co from 'co';
// co(function* () {
//   var result = yield Promise.resolve(true);
//   // var result = yield Promise.reject('errorInfo');
//   return result;
// })
//   .then(function (value) {
//     console.log(`then: ${value}`);
//   })
//   .catch(function (err) {
//     console.error(err);
//   });
