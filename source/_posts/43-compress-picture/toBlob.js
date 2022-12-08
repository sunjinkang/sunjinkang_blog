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
        let width = this.width;
        let height = this.height;
        let imgCanvas = document.createElement('canvas'); //创建canvas元素
        imgCanvas.width = width;
        imgCanvas.height = height;
        let ctx = imgCanvas.getContext('2d'); //2d渲染
        ctx.drawImage(this, 0, 0, width, height); //将图片以原有尺寸绘制到canvas中
        //转换成base64并压缩，可以从0到1的区间内选择图片的质量。如果超出取值范围，将会使用默认值0.92。其他参数会被忽略
        if (imgType === 'image/webp' || imgType === 'image/jpeg') {
          imgCanvas.toBlob(
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
        } else {
          imgCanvas.toBlob(function (b) {
            let compressUrl = URL.createObjectURL(b);
            let fileName =
              imgFile.name.substring(0, imgFile.name.lastIndexOf('.')) +
              '.' +
              imgType.split('/')[1];
            let file = blobToFile(b, fileName, imgType);
            resolve(
              {
                url: compressUrl,
                file: file,
              },
              imgType
            );
            imgCanvas = null; //释放内存
          }, imgType);
        }
      } catch (e) {
        reject(e);
      }
    };
  });
}

//blob转file
function blobToFile(blob, fileName, type) {
  return new window.File([blob], fileName, { type: type });
}
