---
title: MarkDown语法及示例
date: 2022-06-27 10:43:07
cover: https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_640.jpg
tags:
---

#### MarkDown语法及示例

###### 代码块
\```javascript
const name = 'eric';
....
\``` 
###### 加粗字体
\*\*文字\*\*
\_\_文字\_\_

###### 倾斜字体
\*文字\*
\_文字\_

<!-- more -->

###### 斜体加粗
\*\*\*文字\*\*\*
\_\_\_文字\_\_\_

###### 删除线
\~\~文字\~\~

###### 表格
| 表头1 | 表头2 |
| ----- | ----- |
| 文字1 | 文字2 |

###### 文字颜色
<font color="red">文字</font>
```javascript
<font color="red">文字</font>
<font color="blue">文字</font>
```

###### 文字大小
<font size=4>文字</font>
```javascript
<font size=4>文字</font>
<font size=5>文字</font>
```

###### 文字字体
<font face="黑体">文字</font>
```javascript
<font face="黑体">文字</font>
<font face="微软雅黑">文字</font>
```

###### 文字居中
```js
<center>文字</center>
```

###### 背景色
<mark style="bgcolor:red">文字</mark>
```javascript
<mark style="bgcolor:red">文字</mark>
```

###### 无序列表
* 第一行
* 第二行
* 第三行

+ 第一行
+ 第二行
+ 第三行

- 第一行
- 第二行
- 第三行
```javascript
* 第一行
* 第二行
* 第三行

+ 第一行
+ 第二行
+ 第三行

- 第一行
- 第二行
- 第三行
```

###### 有序列表
1. 第一行
2. 第二行
3. 第三行

```javascript
1. 第一行
2. 第二行
3. 第三行
```

###### 嵌套列表: 列表嵌套只需在子列表中的选项前面添加两个或四个空格即可
* 第一行
  - 1-1
* 第二行
  - 2-1
* 第三行
  - 3-1


* 第一行
  1. 1-1
* 第二行
  1. 2-1
* 第三行
  1. 3-1

```javascript
* 第一行
  - 1-1
* 第二行
  - 2-1
* 第三行
  - 3-1

* 第一行
  1. 1-1
* 第二行
  1. 2-1
* 第三行
  1. 3-1
```

###### 区块：区块引用是在段落开头使用 > 符号 ，然后后面紧跟一个空格符号
\> 区块
> 区块1
> 区块2

区块是可以嵌套的，一个 > 符号是最外层，两个 > 符号是第一层嵌套，以此类推
> 1
> > 2
> > > 3

###### 链接
\[链接名称\]\(链接地址\) 或 <链接地址>
```
[百度](www.baidu.com)
<www.baidu.com>
```

###### 图片
!\[alt 属性文本\]\(图片地址\)

###### 图片居中
!\[alt 属性文本\]\(图片地址\#pic_center)


###### 插入公式
$ 数学公式 $​​​​​​​
$$ 数学公式 $$​

###### 指数和下标可以用^和_后加相应字符来实现,如果上下标的内容多于一个字符，需要用 {} 将这些内容括成一个整体。上下标可以嵌套，也可以同时使用。
a^1
a_1
$$ x^{y^z}=(1+{\rm e}^x)^{-2xy^w} $$


