---
title: 前端压缩图片方法
date: 2022-12-08 16:48:13
tags:
---

###### 为什么压缩图片？
浏览器在加载页面的时候，图片也是影响请求前端用户体验的一环：如果图片较大，请求耗时越长，那页面会长时间处于加载中或者白屏状态，导致用户体验较差。所以压缩图片就成了一种比较常用的优化前端性能的手段。

###### 压缩图片方法
* 第一种：根据宽、高、画质压缩图片
```javascript
    compressUpload(file, config) {
      let read = new FileReader();
      read.readAsDataURL(file);
      const fileName = file.name;
      return new Promise((resolve, reject) => {
        // 生成canvas
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let _this = this;
        read.onload = function (e) {
          let img = new Image();
          img.src = e.target.result;
          img.onload = function () {
            let w = this.width;
            let h = this.height;
            let scale = w / h;
            w = config.width || config.height * scale || w;
            h = config.height || config.width / scale || h;
            // 最大宽高如有限制时的处理
            w = config.maxWidth && w > config.maxWidth ? config.maxWidth : w;
            h = config.maxHeight && h > config.maxHeight ? config.maxHeight : h;
            w = Math.min(w, h * scale) || w;
            h = Math.min(h, w / scale) || h;

            let quality = 0.7; // 默认图片质量
            // 创建属性节点
            let anw = document.createAttribute("width");
            anw.nodeValue = w;
            let anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(this, 0, 0, w, h);
            if (config.quality && config.quality <= 1 && config.quality > 0) {
              quality = config.quality;
            }
            let base64 = canvas.toDataURL("image/jpeg", quality);
            // 回调函数返回base64的值，也可根据自己的需求转换
            resolve(base64);
            canvas = null;
          };
        };
      });
    },
```
* 第二种：根据画质压缩图片
```javascript
compressUpload(image, file, quality) {
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d");
  let { width } = image,
    { height } = image;
  canvas.width = width;
  canvas.height = height;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, width, height);
  let base64 = canvas.toDataURL(file.type || "image/jpeg", quality);
  // 压缩后调用方法进行base64转Blob，方法写在下边
  return  base64;
  canvas = null;
},
```
###### 调用方法
```javascript
beforeUpload(file) {
      console.log("压缩前：", file);
      let _this = this;
      const isIMG = file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/jpg";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isIMG) {
        this.$message.error("上传图片只能是 .jpg/.png/.jpeg 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 5MB!");
      }
      return new Promise((resolve, reject) => {
        let isLt2M = file.size / 1024 / 1024 < 10; // 判定图片大小是否小于10MB
        if (!(isLt2M && isIMG)) {
          reject();
        }
        let image = new Image(),
          resultBlob = "";
        image.src = URL.createObjectURL(file);

        image.onload = () => {
          // 调用方法获取blob格式，方法写在下边   以下方法二选一：
          resultBlob = _this.compressUpload(file, this.form);
          resultBlob = _this.compressUpload(image, file, this.form.quality);
          resolve(resultBlob);
        };
        image.onerror = () => {
          reject();
        };
      });
},
```