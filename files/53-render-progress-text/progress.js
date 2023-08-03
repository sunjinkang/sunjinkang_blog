function renderProgress() {
  const number = document.getElementById('percent').nodeValue;

}

function getPercent(data) {
  const progress = document.getElementsByClassName('progress-wrapper')?.[0];
  const progressTop = document.getElementsByClassName('progress-top')?.[0];
  const topComputedStyle = getStyle(progressTop);
  const computedStyle = getStyle(progress);
  const topMarginLeft = topComputedStyle.marginLeft;
  const width = computedStyle.width;
  const topMinPercent = Math.ceil(topMarginLeft / width);
  if (data < topMinPercent) {
    document.getElementsByClassName('progress-top')?.[0].style.width = `${data}%`;
    document.getElementsByClassName('progress-top')?.innerHtml = `当前进度：${data}%`;
  }
}

function getStyle(element) {
  return getComputedStyle(element, null);
}
