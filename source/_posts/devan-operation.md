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

场景

用处