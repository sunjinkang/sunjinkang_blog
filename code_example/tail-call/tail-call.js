function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}
factorial(100000, 1);

// 'use strict';
// function factorial(n, total) {
//   console.trace();
//   if (n === 1) return total;
//   return factorial(n - 1, n * total);
// }
// factorial(100000, 1);
