function compressPicture(imgFile, imgType, quality) {
  if (!imgType) {
    imgType = 'image/webp';
  }
  return new Promise((resolve, reject) => {
    let src = URL.createObjectURL(imgFile);
    let img = new Image();
    img.src = src;
    img.onload = function () {
      try {
        orginImg.src = src;
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
