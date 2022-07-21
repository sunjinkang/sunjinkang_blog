---
title: meta标签的使用
date: 2022-06-28 22:16:30
tags:
---

#### meta标签的使用

###### <meta>文档级元数据元素
meta标签一般放在HTML页面的head里面，[MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)定义：
>HTML <meta> 元素表示那些不能由其它 HTML 元相关（meta-related）元素（(\<base\>,\<link\>,\<script\>,\<style\> 或 \<title\>）之一表示的任何元数据信息。

###### meta定义的元数据类型
(1)name属性：meta元素提供文档级别元数据，应用于整个页面
-- name和content一起使用，name表示元数据名称，content表示元数据的值
---- name="author"，表示网页作者的名字，例如某个组织或机构
```
<mate name="author" content="xxx@mail.com">
```

---- name="description"，是一段简短而精确的，对页面内容的描述
```javascript
//淘宝网页的meta
<meta name="description" content="淘宝网 - 亚洲较大的网上交易平台，提供各类服饰、美容、家居、数码、话费/点卡充值… 数亿优质商品，同时提供担保交易(先收货后付款)等安全交易保障服务，并由商家提供退货承诺、破损补寄等消费者保障服务，让你安心享受网上购物乐趣！">
```

---- name="keywords"，与页面内容相关的关键词，使用逗号分隔，需要注意某些搜索引擎会用这些关键词对文档进行分类
```javascript
//淘宝网页的meta
<meta name="keyword" content="淘宝,掏宝,网上购物,C2C,在线交易,交易市场,网上交易,交易市场,网上买,网上卖,购物网站,团购,网上贸易,安全购物,电子商务,放心买,供应,买卖信息,网店,一口价,拍卖,网上开店,网络购物,打折,免费开店,网购,频道,店铺">
```

---- name="viewport"，为viewport（视口）的初始大小提供指示，目前仅用于移动设备
```javascript
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
width：用来设置viewport的宽度为设备宽度，常用值：device-width、？？？？
initial-scale：为设备宽度与viewport大小之间的缩放比例
maximum-scale：？？？？
minimum-scale：？？？？
user-scalable：？？？？
minimal-ui：？？？？

---- name="robots"，表示爬虫对此页面的处理行为，或者说，应当遵守的规则，是用来做搜索引擎抓取的
content类型：
all：搜索引擎将索引此网页，并继续通过此网页的链接索引文件将被检索
none：搜索引擎将忽略此网页
index：搜索引擎索引此网页
follow：搜索引擎继续通过此网页的链接索引搜索其它的网页

---- name="renderer"，用来指定双核浏览器的渲染方式，比如360浏览器，我们可以通过这个设置来指定360浏览器的渲染方式
```javascript
<meta name="renderer" content="webkit"> //默认webkit内核
<meta name="renderer" content="ie-comp"> //默认IE兼容模式
<meta name="renderer" content="ie-stand"> //默认IE标准模式
```
content类型：
？？？？

---- name="spm-id"，？？？？
```javascript
// 淘宝
<meta name="spm-id" content="a21bo">
```
---- name="aplus-xplug"，？？？？
```javascript
// 淘宝网
<meta name="aplus-xplug" content="NONE">
```


(2)http-equiv属性：meta元素是编译指令，提供的信息与类似命名的http头部相同
-- http-equiv和content一起使用，http-equiv表示元数据名称，content表示元数据的值
-- http-equiv所有允许的值都是特定http头部的名称
---- http-equiv="X-UA-Compatible"
```javascript
// 淘宝网
<meta http-equiv="X-UA-Compatible" content="IE=10,chrome=1">//IE浏览器适配
```
IE=10告诉浏览器，以当前浏览器支持的最新版本来渲染。
chrome=1告诉浏览器，如果当前IE浏览器安装了Google Chrome Frame插件，就以chrome内核来渲染页面。
两者都存在的情况：如果有chrome插件，就以chrome内核渲染，如果没有，就以当前浏览器支持的最高版本渲染。
另外，这个属性支持的范围是IE8-IE11
如果在http头部中也设置了这个属性，并且和meta中设置的有冲突，开发者偏好（meta元素）优先于Web服务器设置（HTTP头）。

---- http-equiv="content-type"，用来声明文档类型和字符集
```javascript
<meta http-equiv="content-type" content="text/html;charset=utf-8">
```

---- http-equiv="x-dns-prefetch-control"
一般来说，HTML页面中的a标签会自动启用DNS提前解析来提升网站性能，但是在使用https协议的网站中失效了，我们可以如下设置打开对a标签的提前解析：
```javascript
<meta http-equiv="x-dns-prefetch-control" content="on">
```

---- cache-control、Pragma、Expires，和缓存相关的设置，但是遗憾的是这些往往不生效，我们一般都通过http headers来设置缓存策略  ？？？？

(3)charset属性：meta元素是一个字符集声明，告诉文档使用哪种字符编码
(4)itemprop属性：meta元素提供用户定义的元数据