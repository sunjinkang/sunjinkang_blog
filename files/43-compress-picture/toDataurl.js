function compressPicture(imgFile, imgType, quality) {
  if (!imgType) {
    imgType = 'image/webp'; //默认输出webp格式的图片
  }
  return new Promise((resolve, reject) => {
    let src = URL.createObjectURL(imgFile);
    let img = new Image(); //创建一个img标签
    img.src = src;
    img.onload = function () {
      try {
        orginImg.src = src;
        URL.revokeObjectURL(src); //释放内存
        let width = Math.floor(this.width / 2);
        let height = Math.floor(this.height / 2);
        let imgCanvas = document.createElement('canvas'); //创建canvas元素
        imgCanvas.width = width;
        imgCanvas.height = height;
        let ctx = imgCanvas.getContext('2d'); //2d渲染
        ctx.drawImage(this, 0, 0, width, height); //将图片以原有尺寸绘制到canvas中
        let base64;
        //转换成base64并压缩，可以从0到1的区间内选择图片的质量。如果超出取值范围，将会使用默认值0.92。其他参数会被忽略
        if (imgType === 'image/webp' || imgType === 'image/jpeg') {
          base64 = imgCanvas.toDataURL(imgType, quality);
        } else {
          base64 = imgCanvas.toDataURL(imgType);
        }
        imgCanvas = null; //释放内存
        resolve({
          url: base64,
        });
      } catch (e) {
        reject(e);
      }
    };
  });
}
