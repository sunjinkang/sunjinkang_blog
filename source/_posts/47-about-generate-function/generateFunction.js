// 1、简单举例
// function* generator(i) {
//   return i + 1;
// }
// const gen = generator(3);
// console.log(gen.next());
// {value: 4, done: true}

// 2、构造函数
// function* Test() {
//   // some operation
// }
// const newTest = new Test();
// TypeError: Test is not a constructor

// 3、yield关键字
// function* testYield() {
//   for (let num = 0; num < 3; num++) {
//     yield num;
//   }
// }
// const result = testYield();
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// { value: 0, done: false }
// { value: 1, done: false }
// { value: 2, done: false }
// { value: undefined, done: true }

// 3.1 return
// function* testYield() {
//   for (let num = 0; num < 3; num++) {
//     yield num;
//     return 45;
//   }
// }
// const result = testYield();
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// { value: 0, done: false }
// { value: 45, done: true }
// { value: undefined, done: true }
// { value: undefined, done: true }

// 3.2 throw
// function* testYield() {
//   for (let num = 0; num < 3; num++) {
//     yield num;
//   }
// }
// const result = testYield();
// console.log(result.next());
// console.log(result.throw(new Error('1')));
// console.log(result.next());
// console.log(result.next());
// { value: 0, done: false }
// Error: 1

// 4 next传参
// function* testYield() {
//   let num = 0;
//   while (true) {
//     const result = yield num;
//     console.log(result);
//   }
// }
// const result = testYield();
// console.log(result.next(2)); // nothing return
// console.log(result.next(3)); // result: 3
// console.log(result.next(6)); // result: 6
// console.log(result.next());

// 5 yield*
// function* testOne() {
//   yield 2;
//   yield 3;
// }

// function* testTwo() {
//   yield 1;
//   yield* testOne();
//   yield 4;
// }
// const result = testTwo();
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// { value: 1, done: false }
// { value: 2, done: false }
// { value: 3, done: false }
// { value: 4, done: false }
// { value: undefined, done: true }

// 5.1 yield* 迭代
// function* test() {
//   yield* [1, 2];
//   yield* '3,4';
//   yield* arguments;
// }
// const result = test(5, 6);
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// console.log(result.next());
// { value: 1, done: false }
// { value: 2, done: false }
// { value: '3', done: false }
// { value: ',', done: false }
// { value: '4', done: false }
// { value: 5, done: false }
// { value: 6, done: false }
// { value: undefined, done: true }

// 6
// function* test() {
//   yield 1;
//   const x = yield 'one';
//   yield x;
// }

// var result = test();
// console.log(result.next());
// console.log(result.next());
// console.log(result.next(100));
// console.log(result.next());
// { value: 1, done: false }
// { value: 'one', done: false }
// { value: 100, done: false }
// { value: undefined, done: true }

// 7
// function* iterArr(arr) {
//   if (Array.isArray(arr)) {
//     for (let i = 0; i < arr.length; i++) {
//       yield* iterArr(arr[i]);
//     }
//   } else {
//     yield arr;
//   }
// }
// let arr = ['a', ['b', ['c', ['d', 'e']]]];
// const result = iterArr(arr);
// arr = [...result];
// console.log(arr);

// 8
function getCallSettings() {
  utils.ajax({
    url: '/dialer/dialerSetting',
    method: 'GET',
    success: (res) => {
      it.next(res.dialerSetting); // 将res.dialerSetting传给yield表达式
    },
    error: (err) => {
      it.throw(err); // 抛出错误
    },
  });
}
function* dealData() {
  try {
    let settingInfo = yield getCallSettings();
    // do something……
  } catch (err) {
    console.log(err); // 接收错误
  }
}
let it = dealData();
it.next(); // 启动生成器
