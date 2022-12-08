---
title: 前端压缩图片方法-canvas.toDataURL & canvas.toBlob
date: 2022-12-08 16:48:13
tags:
---

###### 为什么压缩图片？
浏览器在加载页面的时候，图片也是影响请求前端用户体验的一环：如果图片较大，请求耗时越长，那页面会长时间处于加载中或者白屏状态，导致用户体验较差。所以压缩图片就成了一种比较常用的优化前端性能的手段。

###### 压缩图片方法
* 第一种：将图片传给后端，后端进行压缩
* 第二种：使用canvas压缩图片
思路：
- 通过<input type="file"/>获取二进制图片
- 使用 FileReader 把二进制图片转换成base64格式，用于生成 Image 对象
- 把图片绘制成 Canvas（这一步可以对图片尺寸进行压缩，这一步压缩效率最高，图片尺寸是最影响图片大小的）
- 将Canvas 再转成 base64 图片（这一步可以对图片质量进行压缩）

###### toDataURL
* canvas对象的一种方法，用于将canvas对象转换为base64位编码.
* 转化实现：将图片绘制到canvas中，然后将canvas对象转换为base64编码，从而实现图片转为base64编码；
* 转换为base64位编码的好处：
  - 将图片转换为base64位编码后，图片会跟随代码（html、css、js）一起请求加载，不会再单独进行请求加载；
  - 可以防止由于图片路径错误导致图片加载失败的问题；
* 注意事项：
  - 如果画布的高度或宽度是 0，那么会返回字符串“data:,”
* 参数：toDataURL(type, encoderOptions)
  - type指定转换为base64编码后图片的格式，如：image/png、image/jpeg、image/webp等等，默认为image/png格式；
  - encoderOptions用于设置转换为base64编码后图片的质量，在指定图片格式为 image/jpeg 或 image/webp 的情况下，取值范围为0-1，超出取值范围用默认值0.92代替；
[MDN HTMLCanvasElement.toDataURL()](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toDataURL)

###### toBlob
* 创造 Blob 对象，用以展示 canvas 上的图片
* 参数：toBlob(callback, type, quality)
  - callback：回调函数，可获得一个单独的 Blob 对象参数。如果图像未被成功创建，可能会获得 null 值
  - type(可选): DOMString 类型，指定图片格式，默认格式（未指定或不支持）为 image/png
  - quality(可选): Number 类型，值在 0 与 1 之间，当请求图片格式为 image/jpeg 或者 image/webp 时用来指定图片展示质量。如果这个参数的值不在指定类型与范围之内，则使用默认值，其余参数将被忽略
[MDN HTMLCanvasElement.toBlob()](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLCanvasElement/toBlob)

###### toDataURL和toBlob的差异与共同点
* 差异
  - 绘制处理图片的过程不同：
    - toBlob是直接将canvas中绘制的图形转换成Blob实例对象，再将Blob实例对象转成File实例对象即可
    - toDataURL则是将canvas中绘制的图形转成base64编码的字符串，然后再将base64编码的字符串转成File的实例对象
  - 结果不同：
    - toBlob无返回值，通过传参中的回调函数，可获得一个单独的 Blob 对象参数
    - toDataURL返回一个包含 data URI 的DOMString
  - 执行不同：
    - toDataURL是同步执行的，执行操作的时候会阻止UI
    - toBlob通过回调函数获取返回值，非阻塞方式进行图像格式转换
  - toDataURL结果比toBlob占用更多的内存，toDataURL包含在base64中压缩的完整二进制数据，base64编码本身意味着二进制数据比现在大37％

* 共同点
  - canvas方法，在指定图片格式为 image/jpeg 或 image/webp 的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92

```javascript
// toBlob
canvas.toBlob(
  function (b) {
    let compressUrl = URL.createObjectURL(b); //压缩后的文件url
    let fileName =
      imgFile.name.substring(0, imgFile.name.lastIndexOf('.')) +
      '.' +
      imgType.split('/')[1]; //重构文件名
    let file = blobToFile(b, fileName, imgType); //Blob实例转成File实例
    resolve({
      url: compressUrl,
      file: file,
    });
    imgCanvas = null; //释放内存
  },
  imgType,
  quality
);
// toDataURL
canvas.toDataURL(imgType, quality);
```