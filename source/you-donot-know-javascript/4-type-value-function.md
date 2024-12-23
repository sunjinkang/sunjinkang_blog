---
title: 类型、值、原生函数、强制类型转换&语法
date: 2024-11-19 20:31:11
---


### 类型
- **内置类型**：JavaScript中有七种内置类型，分别是`null`、`undefined`、`boolean`、`number`、`string`、`object`和`symbol`。
- **值和类型的特点**：JavaScript中的变量没有类型，只有值才有类型，同一个变量可以在不同时刻持有不同类型的值。
- **`undefined`与`undeclared`的区别**：`undefined`表示变量已声明但未赋值，而`undeclared`表示变量未被声明。使用`typeof`运算符访问未声明的变量时，不会报错，而是返回`"undefined"`，这是`typeof`的安全防范机制。

### 值
- **数组**：数组是通过数字索引的一组任意类型的值，它是`object`的一个子类型，其`length`属性表示元素的个数。
```javascript
let arr = [1, "two", true];
console.log(arr.length); // 3
console.log(typeof arr); // "object"
```
- **字符串**：字符串在JavaScript中是不可变的，即一旦创建，就不能修改其内容。当对字符串进行操作时，实际上是返回一个新的字符串。
```javascript
let str = "hello";
let newStr = str.toUpperCase();
console.log(str); // "hello"
console.log(newStr); // "HELLO"
```
- **数字**：JavaScript中的数字包括整数和浮点数，还有一些特殊值，如`NaN`（表示不是一个数字）、`+Infinity`、`-Infinity`和`-0`。
```javascript
let num1 = 10 / "a";
console.log(num1); // NaN
console.log(typeof num1); // "number"
let num2 = 1 / 0;
console.log(num2); // Infinity
console.log(typeof num2); // "number"
```
- **值和引用**：简单标量基本类型值（如字符串和数字等）通过值复制来赋值/传递，而复合值（如对象等）通过引用复制来赋值/传递。
```javascript
let num1 = 5;
let num2 = num1;
num2++;
console.log(num1); // 5
console.log(num2); // 6

let obj1 = {a: 1};
let obj2 = obj1;
obj2.a++;
console.log(obj1.a); // 2
console.log(obj2.a); // 2
```

### 原生函数
- **封装对象包装**：JavaScript为基本数据类型值提供了封装对象，称为原生函数，如`String`、`Number`、`Boolean`等。当访问基本类型的属性或方法时，JavaScript引擎会自动对该值进行封装，即使用相应类型的封装对象来包装它，以实现对这些属性和方法的访问。
```javascript
let num = 10;
console.log(num.toFixed(2)); // "10.00"
// 相当于
let numObj = new Number(num);
console.log(numObj.toFixed(2));
numObj = null;
```
- **拆封**：与封装相反，当需要将封装对象转换回基本类型值时，就会发生拆封。通常在进行一些操作时，JavaScript会自动进行拆封。
```javascript
let numObj = new Number(20);
let num = numObj + 5;
console.log(num); // 25
console.log(typeof num); // "number"
```
- **原生函数作为构造函数**：原生函数可以作为构造函数来创建对象，如`Array`、`Object`、`Function`、`RegExp`、`Date`、`Error`和`Symbol`等。
```javascript
let arr = new Array(3);
console.log(arr); // [empty × 3]
console.log(arr.length); // 3

let obj = new Object();
obj.a = 1;
console.log(obj); // {a: 1}

let fn = new Function("x", "y", "return x + y");
console.log(fn(2, 3)); // 5

let date = new Date();
console.log(date); // 当前日期和时间

let error = new Error("Something went wrong");
console.log(error.message); // "Something went wrong"

let symbol = new Symbol("unique");
console.log(symbol); // Symbol(unique)
```


### 强制类型转换概述
- **定义**：强制类型转换（coercion）是指将一种数据类型转换为另一种数据类型的过程。
- **转换方式**：在JavaScript中，这种转换可以是显式的（通过开发者明确调用转换函数）或隐式的（由JavaScript引擎自动进行） 。

### 显式强制类型转换
- **转换为字符串**：可以使用`String()`函数或`toString()`方法。
```javascript
let num = 123;
let str1 = String(num);
let obj = {a: 1};
let str2 = obj.toString();
console.log(str1); // "123"
console.log(str2); // "[object Object]"
```
- **转换为数字**：使用`Number()`函数、`parseInt()`或`parseFloat()`等。
```javascript
let str1 = "456";
let num1 = Number(str1);
let str2 = "3.14";
let num2 = parseFloat(str2);
console.log(num1); // 456
console.log(num2); // 3.14
```
- **转换为布尔值**：使用`Boolean()`函数。
```javascript
console.log(Boolean(0)); // false
console.log(Boolean("")); // false
console.log(Boolean(null)); // false
console.log(Boolean(undefined)); // false
console.log(Boolean(NaN)); // false
console.log(Boolean(123)); // true
console.log(Boolean("hello")); // true
console.log(Boolean({})); // true
```

### 隐式强制类型转换
- **字符串连接**：使用`+`运算符连接字符串和其他数据类型时，其他数据类型会被自动转换为字符串类型。
```javascript
let num = 123;
let str = "Hello" + num;
console.log(str); // "Hello123"
```
- **算术运算**：当不同类型的值参与算术运算时，JavaScript会尝试将它们转换为数字。
```javascript
let result1 = "5" - 3;
let result2 = "5" + 3;
console.log(result1); // 2
console.log(result2); // "53"
```
- **比较运算符**：使用相等运算符`==`时，JavaScript会进行强制类型转换以比较不同类型的值。
```javascript
console.log(123 == "123"); // true
console.log(true == 1); // true
console.log(null == undefined); // true
```

### 强制类型转换的陷阱及注意事项
- **`NaN`陷阱**：当尝试将非数值字符串转换为数字时，会得到`NaN`。
```javascript
let result = Number("hello");
console.log(result); // NaN
```
- **`null`和`undefined`的特殊情况**：`Number(null)`返回`0`，而`Number(undefined)`返回`NaN` 。
```javascript
console.log(Number(null)); // 0
console.log(Number(undefined)); // NaN
```
- **`+`运算符的混淆**：`+`运算符既用于字符串连接又用于加法运算，容易引起混淆。
```javascript
console.log("5" + 3); // "53"
console.log("5" - 3); // 2
```

### 语法相关要点
- **相等运算符`==`与严格相等运算符`===`**：`==`会进行类型转换再比较，而`===`不会进行类型转换，只在两个值类型相同且值相等时返回`true`。
```javascript
console.log(123 == "123"); // true
console.log(123 === "123"); // false
```
- **逻辑运算符**：逻辑运算符`&&`、`||`、`!`也会触发类型转换，通常会将操作数转换为布尔值来决定运算结果。
```javascript
console.log(!!"hello"); // true
console.log(!!0); // false
console.log(null || "default"); // "default"
```
