function compressPicture(imgFile, imgType, quality) {
  if (!imgType) {
    imgType = 'image/webp';
  }
  return new Promise((resolve, reject) => {
    // 返回一个URL 对象表示指定的 File 对象（生成blob:http://www.xxxx.com/xx的链接，可以直接在网页上打开File内容）或 Blob 对象（用于下载）
    let src = URL.createObjectURL(imgFile);
    let img = new Image();
    img.src = src;
    img.onload = function () {
      try {
        orginImg.src = src;
        // 在每次调用 createObjectURL() 方法时，都会创建一个新的 URL 对象，即使你已经用相同的对象作为参数创建过。当不再需要这些 URL 对象时，每个对象必须通过调用 URL.revokeObjectURL() 方法来释放
        URL.revokeObjectURL(src);
        let width = Math.floor(this.width / 2);
        let height = Math.floor(this.height / 2);
        let imgCanvas = document.createElement('canvas');
        imgCanvas.width = width;
        imgCanvas.height = height;
        let ctx = imgCanvas.getContext('2d');
        ctx.drawImage(this, 0, 0, width, height);
        if (imgType === 'image/webp' || imgType === 'image/jpeg') {
          imgCanvas.toBlob(
            function (b) {
              let compressUrl = URL.createObjectURL(b);
              let fileName =
                imgFile.name.substring(0, imgFile.name.lastIndexOf('.')) +
                '.' +
                imgType.split('/')[1];
              let file = blobToFile(b, fileName, imgType);
              resolve({
                url: compressUrl,
                file: file,
              });
              imgCanvas = null;
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

function blobToFile(blob, fileName, type) {
  return new window.File([blob], fileName, { type: type });
}
