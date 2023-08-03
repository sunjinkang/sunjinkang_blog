---
title: javascript DOM编程艺术阅读笔记
date: 2022-07-31 13:42:45
tags:
---

#### JavaScript简史
1、DOM
DOM是一套对文档的内容进行抽象和概念化的方法。

第0级DOM(DOM Level 0)
试验性质的初级DOM，在还未形成统一标准的初期阶段，“第0级DOM”的常见用途是翻转图片和验证表单数据。

第1级DMO(DOM Level 1)
Netscape、微软和其他一些浏览器制造商们还能抛开彼此的敌意而与W3C携手制定新的标准，并于1998年10月完成了“第1级DOM”(DOM Level 1) 。

<!-- more -->

2、浏览器战争
2.1 DHTML
DHTML是“Dynamic HTML”(动态HTML)的简称。DHTML并不是一项新技术，而是描述HTML、CSS和.JavaScript技术组合的术语。背后含义:
(1)利用HTML把网页标记为各种元素;
(2)利用CSS设置元素样式和它们的显示位置;
(3)利用JavaScript实时地操控页面和改变样式。

#### JavaScript语法
循环语句
1、while循环
```javascript
while (condition){
  statements;
}
```
do...while循环
```javascript
do {
  statements;
} while (condition);
```
  2、for循环
```javascript
for (initial condition; test condition; alter condition){
  statements;
}
```

函数
1、变量的作用域
全局变量(global variable)可以在脚本中的任何位置被引用。一旦你在某个脚本里声明了一个全局变量，就可以从这个脚本中的任何位置―一包括函数内部—―引用它。全局变量的作用域是整个脚本。
局部变量(local variable）只存在于声明它的那个函数的内部，在那个函数的外部是无法引用它的。局部变量的作用域仅限于某个特定的函数。

对象
对象（object）是一种非常重要的数据类型，但此前我们还没有认真对待它。对象是自包含的数据集合，包含在对象里的数据可以通过两种形式访问——属性（property)和方法(method) :
-属性是隶属于某个特定对象的变量
-方法是只有某个特定对象才能调用的函数
对象就是由一些属性和方法组合在一起而构成的一个数据实体

1、用户定义对象(user-defined object)
由程序员自行创建的对象

2、内建对象(native object)
JavaScript提供了一系列预先定义好的对象，这些可以拿来就用的对象称为内建对象( native object) 
Array、Math、Date等

3、宿主对象(host object)
由浏览器提供的预定义对象被称为宿主对象(host object ) 
宿主对象包括document、Form、Image和Element等。我们可以通过这些对象获得关于网页上表单、图像和各种表单元素等信息

#### DOM
1、文档:DOM中的'D'
如果没有document(文档），DOM也就无从谈起。当创建了一个网页并把它加载到Web浏览器中时，DOM就在幕后悄然而生。它把你编写的网页文档转换为一个文档对象

2、对象:DOM中的'O'
如上对象

3、模型:DOM中的'M'
DOM中的“M”代表着“Model”(模型)，但说它代表着“Map”(地图）也未尝不可。模型也好，地图也罢，它们的含义都是某种事物的表现形式。就像一个模型火车代表着一列真正的火车、一张城市街道图代表着一个实际存在的城市那样，DOM代表着加载到浏览器窗口的当前网页。浏览器提供了网页的地图（或者说模型)，可以通过JavaScript去读取这张地图

4、节点
(1)元素节点
(2)文本节点
(3)属性节点
(4)CSS
(5)获取元素
-getElementById 返回一个对象
-getElementsByTagName 返回一个对象数组，使用通配符（*）获取文档中总共有多少元素节点
```javascript
var shopping = document.getElementById("purchases") ;
var items = shopping.getElementsByTagName("*") ;
```
-getElementsByClassName 返回一个对象数组
使用这个方法还可以查找那些带有多个类名的元素。要指定多个类名，只要在字符串参数中用空格分隔类名即可
注意，即使在元素的class属性中，类名的顺序和参数中指定的不一样，也照样会匹配该元素。不仅类名的实际顺序不重要，就算元素还带有更多类名也没有关系。
```javascript
var shopping = document.getElementById("purchases");
var sales = shopping.getElementsByClassName("sale");
```

5、获取和设置属性
(1)getAttribute 只能通过元素节点调用
(2)setAttribute 只能通过元素节点调用，修改属性值
细节:通过setAttribute对文档做出修改后，在通过浏览器的viewsource(查看源代码）选项去查看文档的源代码时看到的仍将是改变前的属性值，也就是说，setAttribute做出的修改不会反映在文档本身的源代码里。这种“表里不一”的现象源自DOM的工作模式:先加载文档的静态内容，再动态刷新，动态刷新不影响文档的静态内容。这正是DOM的真正威力:对页面内容进行刷新却不需要在浏览器里刷新页面。

#### 案例研究：JavaScript图片库
DOM是一种适用于多种环境和多种程序设计语言的通用型API。如果想把DOM技巧运用在Web浏览器以外的应用环境里，严格遵守“第1级DOM”能够避免与兼容性有关的任何问题。
1、childNodes属性 用来获取任何一个元素的所有子元素
2、nodeType属性 共有12中可取值
以下3种具有实用价值：
-元素节点的nodeType属性值是1
-属性节点的nodeType属性值是2
-文本节点的nodeType属性值是3
3、nodeValue属性 得到和设置节点的值
4、firstChild和lastChild

#### 最佳实践
1、平稳退化
平稳退化(graceful degradation)，虽然某些功能无法使用，但最基本的操作仍能顺利完成
2、“javascript:”伪协议
“真”协议用来在因特网上的计算机之间传输数据包，如HTTP协议(http://) 、FTP协议（ftp://)等，伪协议则是一种非标准化的协议
“javascript:”伪协议让我们通过一个链接来调用JavaScript函数
```javascript
<a href="javascript:popUp('http://www.example.com/');">Example</a>
```
3、CSS
结构与样式分离
渐进增强，用一些额外的信息层去包裹原始数据
4、分离javascript
5、向后兼容
(1)对象检测：检测浏览器对JavaScript的支持程度
(2)浏览器嗅探技术
通过提取浏览器供应商提供的信息来解决向后兼容问题。从理论上讲，可以通过JavaScript代码检索关于浏览器品牌和版本的信息，这些信息可以用来改善JavaScript脚本代码的向后兼容性，但这是一种风险非常大的技术。
首先，浏览器有时会“撒谎”。因为历史原因，有些浏览器会把自己报告为另外一种浏览器，还有一些浏览器允许用户任意修改这些信息
其次，为了适用于多种不同的浏览器，浏览器嗅探脚本会变得越来越复杂。如果想让浏览器嗅探脚本能够跨平台工作，就必须测试所有可能出现的供应商和版本号组合。这是一个无穷尽的任务，测试的组合情况越多，代码就越复杂和冗长
最后，许多浏览器嗅探脚本在进行这类测试时要求浏览器的版本号必须得到精确的匹配。因此，每当市场上出现新版本时，就不得不修改这些脚本
6、性能考虑
(1)尽量少访问DOM和尽量减少标记
(2)合并和放置脚本
多个脚本合并，减少请求次数
把所有/<script/>标签都放到文档的末尾，/</body/>标记之前，就可以让页面变得更快
(3)压缩脚本
压缩工具：
-Douglas Crockford的JSMin (http://www.crockford.com/javascript/jsmin.html)
-雅虎的YUI Compressor (http://developer.yahoo.com/yui/compressor)
-谷歌的Closure Compiler (http://closure-compiler.appspot.com/home)

#### 动态创建标记
1、document.write & innerHTML属性
2、DOM方法
(1)createElement
(1)appendChild
(1)createTextNode
(1)insertBefore
3、Ajax
(1)XMLHttpRequest对象
```javascript
function getHTTPObject () {
  if (typeof XMLHttpRequest == "undefined") xMLHttpRequest =function () {
    try { return new Activexobject ( "Msxm12.XMLHTTP.6.0"); )catch (e) { }
    try { return new ActivexObject ("Msxm12.XMLHTTP.3.0");)catch (e) { }
    try { return new ActivexObject ( "Msxm12.XMLHTTP"); )catch (e) { }
    return false;
  }
  return new XMLHttpRequest ( ) ;
}
```

XHTML5
本质上是使用严格的XML规则编写的HTML5。从技术角度说，Web浏览器应该将任何XHTML5文档都视为XML文档，而不是HTML文档。而在现实中，你还得在文档的头部发送正确的MIME类型，即application/xhtml+xml。有些浏览器不认识这个MIME类型，因而一般要在服务器端对浏览器进行探查后再发送。否则最坏的情况，页面很可能根本不会在浏览器中呈现。因此，绝大多数XHTML页面仍然是以HTML类型发送的。

#### CSS-DOM
1、三位一体的网页
(1)结构层
网页的结构层(structural layer)由HTML或XHTML之类的标记语言负责创建
(2)表示层
表示层(presentation layer)由CSS负责完成。CSS描述页面内容应该如何呈现
(3)行为层
行为层(behavior layer)负责内容应该如何响应事件这一问题。这是JavaScript语言和DOM主宰的领域
(4)分离
-使用(X)HTML去搭建文档的结构
-使用CSS去设置文档的呈现效果
-使用DOM脚本去实现文档的行为
2、style属性
在外部样式表里声明的样式不会进入style对象，在文档的<head>部分里声明的样式也是如此
style对象只包含在HTML代码里用style属性声明的样式
3、何时该使用DOM脚本设置样式
(1)根据元素在节点树里的位置来设置样式
(2)根据某种条件反复设置某种样式
(3)响应事件
4、className属性

#### HTML5
1、canvas
2、video和audio

疑问点：
1、遇到的知识点觉得掌握了，没有记录，后面又忘了
重要的知识点都记录，不管有没有掌握
2、任务拆分评估时间不准
更深入的了解项目代码和业务逻辑
3、看书遇到问题的时候，先记录继续阅读，还是先解决问题在阅读？
先记录继续阅读，看后面是否有解答
4、原型链
不建议研究__proto__这种知识点，可以看看es6中新的关于原型链的继承
理解知识的时候，不要添加太多概念，避免混乱