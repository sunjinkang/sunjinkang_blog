---
title: 使用hexo相关
date: 2022-03-26 21:14:29
cover: https://cdn.pixabay.com/photo/2023/10/24/19/09/nevada-8338929_640.jpg
tags:
---

## 一些使用hexo搭建博客时遇到的问题

1、一段时间为使用hexo，重新打开，生成新页面时，终端报错：'hexo' 不是内部或外部命令，也不是可运行的程序或批处理文件  或 bash: hexo: command not found
解决办法：重新运行命令：npm install hexo-cli -g

2、生成的图片路径不正确，有/.io//等一些奇怪的前缀
原因：使用的hexo-asset-image插件存在bug
解决办法：手动修改node_modules/hexo-asset-image中index.js文件的处理方式

<!-- more -->

```javascript
'use strict';
var cheerio = require('cheerio');

function getPosition(str, m, i) {
return str.split(m, i).join(m).length;
}

var version = String(hexo.version).split('.');
hexo.extend.filter.register('after_post_render', function(data){
var config = hexo.config;
if(config.post_asset_folder){
  var link = data.permalink;
  if(version.length > 0 && Number(version[0]) == 3)
     var beginPos = getPosition(link, '/', 1) + 1;
  else
     var beginPos = getPosition(link, '/', 3) + 1;
  // In hexo 3.1.1, the permalink of "about" page is like ".../about/index.html".
  var endPos = link.lastIndexOf('/') + 1;
  link = link.substring(beginPos, endPos);
  
  var toprocess = ['excerpt', 'more', 'content'];
  for(var i = 0; i < toprocess.length; i++){
    var key = toprocess[i];
  
    var $ = cheerio.load(data[key], {
      ignoreWhitespace: false,
      xmlMode: false,
      lowerCaseTags: false,
      decodeEntities: false
    });
  
    $('img').each(function(){
      if ($(this).attr('src')){
          // For windows style path, we replace '\' to '/'.
          var src = $(this).attr('src').replace('\\', '/');
          if(!/http[s]*.*|\/\/.*/.test(src) &&
             !/^\s*\//.test(src)) {
            // For "about" page, the first part of "src" can't be removed.
            // In addition, to support multi-level local directory.
            var linkArray = link.split('/').filter(function(elem){
              return elem != '';
            });
            var srcArray = src.split('/').filter(function(elem){
              return elem != '' && elem != '.';
            });
            if(srcArray.length > 1)
              srcArray.shift();
            src = srcArray.join('/');
            // 以下生成图片路径的处理可根据自身需要进行修改
            if (link == 'nodejs/') {
              src = `images/${src}`;
            }
            $(this).attr('src', config.root + link + src);
            console.info&&console.info("update link as:-->"+config.root + link + src);
          }
      }else{
          console.info&&console.info("no src attr, skipped...");
          console.info&&console.info($(this));
      }
    });
    data[key] = $.html();
      }
    }
  });
  
```