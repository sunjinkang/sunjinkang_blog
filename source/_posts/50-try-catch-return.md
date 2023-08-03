---
title: try...catch和return
date: 2023-04-19 10:42:04
tags:
---

###### 关于return
> return 语句终止函数的执行，并返回一个指定的值给函数调用者

```javascript
function test() {
  for (let i = 0; i < 4; i++) {
    console.log(`before: ${i}`);
    if (i === 2) return;
    console.log(`after: ${i}`);
  }
  console.log(`result`);
}
test();
// before: 0
// after: 0
// before: 1
// after: 1
// before: 2
```
注意：自动分号补全规则会影响 return 语句。在 return 关键字和被返回的表达式之间不允许使用换行符。
<!-- more -->
*自动分号补全(ASI)*
在JavaScript中，行尾的分号有一种自动插入机制，如果新起了一行，并且这新的一行不能追加到当前语句时，会自动追加一个分号
```javascript
return
1;
// return会因为自动分号补全自动添加一个分号
```

###### 关于try...catch
> try...catch 语句标记要尝试的语句块，并指定一个出现异常时抛出的响应。

```javascript
try {
  a + 3;
} catch (error) {
  console.log(error);
}
// ReferenceError: a is not defined
```
- try...catch语法
```javascript
try {
 try_statements
}
[catch (exception_var_1 if condition_1) { // non-standard
   catch_statements_1
}]
...
[catch (exception_var_2) {
   catch_statements_2
}]
[finally {
   finally_statements
}]
```
- 使用方式
  - try...catch
  - try...finally
  - try...catch...finally
catch子句包含try块中抛出异常时要执行的语句。如果在try块中有任何一个语句（或者从try块中调用的函数）抛出异常，控制立即转向catch子句。如果在try块中没有异常抛出，会跳过catch子句。

finally子句在try块和catch块之后执行但是在下一个try声明之前执行。无论是否有异常抛出或捕获它总是执行。

*你可以嵌套一个或者更多的try语句。如果内部的try语句没有catch子句，那么将会进入包裹它的try语句的catch子句。*
```javascript
try {
  try {
    a + 3;
  } catch (err) {
    console.log(`inner: ${err}`);
  }
} catch (err) {
  console.log(`outer: ${err}`);
}
// inner: ReferenceError: a is not defined

try {
  try {
    a + 3;
  } finally{}
} catch (err) {
  console.log(`outer: ${err}`);
}
// outer: ReferenceError: a is not defined
```

- 无条件的catch语句
即catch捕获错误，进行处理，常用的一般是这种，不再赘述
- 有条件的catch语句
```javascript
try {
  a + 3;
} catch (err) {
  if (err.toString().includes('not defined')) {
    console.log(`not defined error: ${err}`);
  } else {
   console.log(err);
  }
}
// not defined error: ReferenceError: a is not defined
```
###### try...catch中使用return

```javascript
function test() {
 try {
  try {
   a+3;
  } catch (err) {
   console.log(`inner error: ${err}`);
   return;
  }
 } finally {
  console.log(`finally`)
 }
}
test();
// inner error: ReferenceError: a is not defined
// finally


function test() {
  try {
    try {
      a + 3;
    } catch (err) {
      console.log(`inner error: ${err}`);
      return;
    } finally {
      console.log(`inner finally`);
      return;
    }
  } finally {
    console.log(`finally`);
  }
}
test();
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
      console.log(`inner finally`);
      // return 'finally';
    }
  } finally {
    console.log(`outer finally`);
  }
}
const result = test();
console.log(result);
// inner finally
// outer finally
// if inner finally not return something, result is 3, else result is the inner finally return.


function test() {
  try {
    try {
      return 3;
    } catch (err) {
      console.log(`inner error: ${err}`);
      return;
    } finally {
      return 'finally';
    }
  } finally {
    return 'outer finally';
  }
}
const result = test();
console.log(result);
// outer finally
```

*如果从finally块中返回一个值，那么这个值将会成为整个try-catch-finally的返回值，无论是否有return语句在try和catch中。这包括在catch块里抛出的异常。*