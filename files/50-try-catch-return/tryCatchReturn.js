// function test() {
//   for (let i = 0; i < 4; i++) {
//     console.log(`before: ${i}`);
//     if (i === 2) return;
//     console.log(`after: ${i}`);
//   }
//   console.log(`result`);
// }
// test();
// before: 0
// after: 0
// before: 1
// after: 1
// before: 2

// function test() {
//  return
//  1+2;
// }
// console.log(test());

// try {
//   a + 3;
// } catch (error) {
//   console.log(error);
// }
// ReferenceError: a is not defined

// try {
//   try {
//     try {
//       try {
//         a + 3;
//       } finally {
//       }
//     } finally {
//     }
//   } finally {
//   }
// } catch (err) {
//   console.log(`outer: ${err}`);
// }

// try {
//   // a + 3;
//   test();
// } catch (err) {
//   if (err.toString().includes('not defined')) {
//     console.log(`not defined error: ${err}`);
//   } else {
//     console.log(err);
//   }
// }

// function test() {
//   try {
//     try {
//       a + 3;
//     } catch (err) {
//       console.log(`inner error: ${err}`);
//       return;
//     } finally {
//       console.log(`inner finally`);
//       return;
//     }
//   } finally {
//     console.log(`finally`);
//   }
// }
// test();
// inner error: ReferenceError: a is not defined
// inner finally
// finally

function test() {
  try {
    try {
      return 3;
    } catch (err) {
      console.log(`inner error: ${err}`);
      return;
    } finally {
      // console.log(`inner finally`);
      return 'finally';
    }
  } finally {
    // console.log(`outer finally`);
    return 'outer finally';
  }
}
const result = test();
console.log(result);
