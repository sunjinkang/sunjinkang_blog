---
title: js-transform
date: 2022-07-19 15:59:15
tags:
---

#### 数学运算符中的类型转换

1、减、乘、除运算
**非Number类型的使用减、乘、除(-、*、/)运算符时，会先将非Number类型转换为Number类型**
```javascript
1 - true // 0, true先转换乘1，然后执行 1 - 1
1 - false // 1, true先转换乘0，然后执行 1 - 0
1 - null // 1, true先转换乘0，然后执行 1 - 0
1 - undefined // NaN, undefined转换为数字为 NaN
2 * ['5'] // 10, ['5']先变成'5'（这一步涉及拆箱操作）,然后变成数字5
```
2、加运算
**js中的加法运算，还可以用来拼接字符串**
* 加号一侧为String类型，则加法运算被识别为拼接字符串操作，并会优先将另一侧转换为字符串类型
* 加号一侧为Number类型，另一侧为原始类型，则将原始类型转换为Number类型
* 加号一侧为Number类型，另一侧为引用类型，将引用类型和Number类型转换成字符串后进行拼接
**以上三点，优先级从高到低**

```javascript
123 + '123' // '123123' (规则1)
123 + null //  123 (规则2)
123 + true //  124 (规则2)
123 + {}   //  '123[object Object]' (规则3)
```

#### 逻辑运算中的类型转换
1、单个变量
先将变量转换为Boolean值
**只有null、undefined、''、NaN、0、false的boolean值是false，其他情况都是true，比如：{}、[]**

2、使用 == 比较中的5条规则
**建议使用 ===**
* 规则1：NaN和其他任何类型比较永远返回false(包括和他自己)
```javascript
NaN == NaN // false
```
* 规则2：boolean和其他任何类型比较，Boolean首先被转换成Number类型
```javascript
true == 1 // true
true == '2' // false,先将true转换为1，而不是把'2'变成true
true == ['1'] // true, 先将true转换为1，['1']拆箱成'1',在参考规则3
true == ['2'] // false, 同上
undefined == false // false, 首先false变成0，然后参考规则4
null == false // false, 同上
```
* String和Number比较，先将String转换为Number类型
```javascript
123 == '123' // true, '123'会变成123
'' == 0 // true，''会变成 0
```
* null == undefined 比较结果是true，除此之外，null、undefined和其他任何结果的比较值都为false
```javascript
null == undefined  // true
null == '' // false
null == 0 // false
null == false // false
undefined == '' // false
undefined == 0 // false
undefined == false // false
```
* 原始类型和引用类型做比较时，引用类型会依照ToPrimitive规则转换为原始类型
**ToPrimitive规则是引用类型向原始类型转变的规则，它遵循先 valueOf后 toString的模式期望得到一个原始类型，如果无法得到一个原始类型，就会抛出TypeError**
```javascript
'[object Object]' == {} // true, 对象和字符串比较，对象通过toString 得到一个基本类型值
'1,2,3' == [1,2,3] // true, [1,2,3]通过toString得到一个基本类型
```

#### 类型转换表
![类型转换对照表](convert-table.png)

#### 类型转换对照网站
https://dorey.github.io/JavaScript-Equality-Table/