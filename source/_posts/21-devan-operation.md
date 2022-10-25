---
title: 装箱拆箱操作
date: 2022-08-09 13:43:57
tags:
---

我们都知道属性和方法是对象上的，但是基本数据类型可以访问属性和方法，比如：'hello world'.length。这是由于浏览器在内部做了装箱和拆箱操作。

#### 什么是装箱拆箱？
装箱：把基本数据类型转化为对应的引用类型的操作
拆箱：把引用类型转化为基本数据类型的操作

基本数据类型：字符串(String)、数字(Number)、布尔(Boolean)、空(Null)、未定义(Undefined)、Symbol
引用数据类型：对象(Object)、数组(Array)、函数(Function)
四个基本的包装类型 String、Number、Boolean、Symbol

什么是包装类型？
在 JavaScript 中的字符串、数值、布尔具有对象的使用特征，如具有属性和方法，之所以具有对象特征的原因是字符串、数值、布尔类型数据是JavaScript 底层使用 Object 构造函数“包装”来的，被称为包装类型

#### 装箱
装箱分为显式装箱和隐式装箱

###### 显式装箱
通过基本包装类型对象对基本类型进行显式装箱，即通过new的方式声明数据
```JavaScript
var string = new String('test_string');
var number = new Number(1);
```
显式装箱可以对声明的对象进行属性和方法的添加，这是因为通过new创建的实例，在执行流离开当前作用域之前一直保留在内存中
```JavaScript
var string = new String('test_string');
string.name = 'for test';
string.sayHi = function(){
    console.log('this is test string');
}
console.log(string.name); // for test
string.sayHi(); // this is test string
```

###### 隐式装箱
隐式装箱是引擎自动执行的
基本类型不能添加属性和方法，添加会报错。但是常常在使用的时候，可以直接调用方法，比如：'test_string'.substring()、'test_string'.indexOf()等，这是由于浏览器在内部做了隐式装箱。

下面以一个例子进行说明：
```JavaScript
// 第一步
var string = 'test_string';
// 第二步
var result = string.substring(4);
console.log(result); // _string
```
在上面这段代码里面实际的执行步骤是：
1、先创建一个String类型的一个实例
2、在实例中调用方法
3、销毁这个实例
```JavaScript
var string = 'test_string';
// 1
var newString = new String(string);
// 2
var result = newString.substring(4);
// 3
newString = null;
```
基于以上的隐式装箱操作，我们可以在基本类型上使用方法
隐式装箱当读取一个基本类型值时，后台会创建一个该基本类型所对应的基本包装类型对象。在这个基本类型的对象上调用方法，其实就是在这个基本类型对象上调用方法。这个基本包装类型的对象是临时的，它只存在于方法调用那一行代码执行的瞬间，执行方法后立即被销毁。这也是在基本类型上添加属性和方法会不识别或报错的原因了


显式装箱可以添加属性和方法，隐式装箱不能添加属性和方法

引用类型与基本包装类型的主要区别就是对象的生存期，使用new创建的引用类型实例当执行流离开当前作用域之前，都一直保存在内存中，而自动创建的基本包装类型的对象，则只存在于一行代码执行的瞬间，然后就被销毁。这就意味着我们不能给基本包装类型添加属性和方法。
#### 拆箱
拆箱是和装箱相反的操作，即把引用类型转换成基本的数据类型。通常通过引用类型的valueOf()和toString()方法来实现，toString()返回字符串，valueOf()返回对象本身。
需要注意的是，toString() 和 valueOf() 返回的值有一定差别
```JavaScript
var numberObj = new Number(64);
var stringObj = new String('64');
console.log(typeof numberObj); // object
console.log(typeof stringObj); // object
// 拆箱
console.log(numberObj.valueOf()); // 64
console.log(typeof numberObj.valueOf()); // number 基本的数字类型
console.log(numberObj.toString()); // '64'
console.log(typeof numberObj.toString()); // string 基本的字符类型

console.log(stringObj.valueOf()); // '64'
console.log(typeof stringObj.valueOf()); // string 基本的数据类型
console.log(stringObj.toString()); // '64'
console.log(typeof stringObj.toString()); // string 基本的数据类型
```
在进行拆箱操作的时候，toString()和valueOf()先执行哪个？在回答这个问题之前，我们先暂停一下，看一下包装类型中的symbol。

这里简单介绍一下Symbol，感兴趣的可以自己去学习。

###### Symbol
Symbol 是 ECMAScript 2015 中新添加的特性，生成一个唯一标识符，可用于属性名称、也可用于属性值。目的是消除属性名称冲突
创建Symbol
```JavaScript
let sym1 = Symbol();
let sym2 = Symbol('sym');
```
注意：
1、每次调用Symbol都会创建新的symbol
2、不可以用new 创建Symbol（围绕原始数据类型创建一个显式包装器对象从 ECMAScript 6 开始不再被支持。 然而，现有的原始包装器对象，如 new Boolean、new String以及new Number，因为遗留原因仍可被创建。）
3、symbol的参数可以不传，这个参数是用于描述symbol，可以用于调试但不是用于访问symbol本身
4、创建Symbol包装器对象，可以使用Object()函数
```JavaScript
// 1
Symbol('sym') === Symbol('sym'); // false
// 2
let sym = new Symbol(); // TypeError: Symbol is not a constructor
// 4
let sym2 = Symbol('sym');
typeof sym2; // 'symbol'
let sym2Obj = Object(sym2);
typeof sym2Obj; // 'object'
```
在[symbol的文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)中，有一个属性[Symbol.toPrimitive](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/toPrimitive)。文档中关于它的介绍是：

Symbol.toPrimitive 是一个内置的 Symbol 值，它是作为对象的函数值属性存在的，当一个对象转换为对应的原始值时，会调用此函数。该函数被调用时，会被传递一个字符串参数 hint ，表示要转换到的原始值的预期类型。 hint 参数的取值是 "number"、"string" 和 "default" 中的任意一个。

我们看一下这个属性是怎么干扰一个对象转换为原始值的
```JavaScript
// 一个没有提供 Symbol.toPrimitive 属性的对象，参与运算时的输出结果
var obj1 = {};
console.log(+obj1);     // NaN
console.log(`${obj1}`); // "[object Object]"
console.log(obj1 + ""); // "[object Object]"

// 接下面声明一个对象，手动赋予了 Symbol.toPrimitive 属性，再来查看输出结果
var obj2 = {
  [Symbol.toPrimitive](hint) {
    if (hint == "number") {
      return 10;
    }
    if (hint == "string") {
      return "hello";
    }
    return true;
  }
};
console.log(+obj2);     // 10      -- hint 参数值是 "number"
console.log(`${obj2}`); // "hello" -- hint 参数值是 "string"
console.log(obj2 + ""); // "true"  -- hint 参数值是 "default"
```
注意：
hint 取值为：
'number':该场合需要转成数值，
'string':该场合需要转成字符串，
'default':该场合可以转成数值，也可以转成字符串。

#### 对象转换成原始值的方法及执行顺序
以下优先级从上到下依次降低
1、先判断对象中是否有/[Symbol.toPrimitive/]/(hint/)方法，如果有的话，优先执行该方法
2、如果预期被转化成字符串类型时，则优先执行toString()方法
3、如果预期被转化成默认类型或数字类型时，则优先执行valueOf()方法
注意：若没有valueOf()方法，但是定义了toString()方法，则会执行toString()方法
```JavaScript
var obj = {
  [Symbol.toPrimitive](hint) {
    console.log(hint);
    return 'symbol';
  },
  toString() {
    return 'string';
  },
  valueOf() {
    return 'valueOf';
  }
};
console.log(String(obj)); // string symbol
console.log(Number(obj)); // number NaN

var obj1 = {
  toString() {
    return 'string';
  },
  valueOf() {
    return 'valueOf';
  }
};
console.log(String(obj1)); // string
console.log(Number(obj1)); // NaN

var obj2 = {
  toString() {
    return '1';
  },
};
console.log(String(obj2)); // '1'
console.log(Number(obj2)); // 1

var obj3 = {
  valueOf() {
    return '2';
  }
};
console.log(Number(obj3)); // 2
console.log(String(obj3)); // [object Object]
```