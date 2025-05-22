---
title: 关于画中画的介绍及简单实现
date: 2025-02-14 10:07:32
tags:
---

## 关于画中画（Picture-in-Picture）的介绍及简单实现

#### 前言

大家应该都看过下面这种一个小窗悬浮在页面上的效果，这种效果叫做画中画。画中画（Picture-in-Picture，PiP）是一种现代浏览器支持的功能，允许用户将视频或其他媒体元素从网页中分离出来，以一个小窗口的形式浮动在屏幕的任意位置。比较常见的就是视频网站，一个小窗口悬浮在页面最上层，用户可以在浏览其他内容的同时继续观看视频，极大地提升了多任务处理的便利性。本文将重点介绍视频画中画的实现方法。


#### 画中画原理
画中画的实现原理基于浏览器的 **Picture-in-Picture API**，主要包括以下几个步骤：

*媒体元素分离*：
   - 浏览器将指定的 `<video>` 元素从 DOM 中分离出来，渲染到一个独立的浮动窗口中。
   - 这个浮动窗口可以放置在屏幕的任意位置，且始终在最上层显示。

*独立控制*：
   - 画中画窗口中的视频可以独立控制（播放、暂停、音量调节等）。
   - 即使原网页被最小化或切换到其他标签页，画中画窗口仍然可以继续播放。

*事件监听*：
   - 通过 JavaScript 监听画中画的状态变化（如进入画中画、退出画中画等），以便进行相应的逻辑处理。

画中画有两种方法：
- [video使用的requestPictureInPicture](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestPictureInPicture)
- [document的documentPictureInPicture](https://developer.mozilla.org/en-US/docs/Web/API/DocumentPictureInPicture)
本文主要是介绍video使用的requestPictureInPicture。


#### 视频画中画的核心介绍
视频画中画是画中画功能的主要应用场景，其核心依赖于以下 API：

*requestPictureInPicture()*
- 用于将 `<video>` 元素切换到画中画模式。
- 示例：
  ```javascript
  const video = document.querySelector('video');
  video.requestPictureInPicture();
  ```

*exitPictureInPicture()*
- 用于退出画中画模式。
- 示例：
  ```javascript
  document.exitPictureInPicture();
  ```

*pictureInPictureEnabled*
- 用于检测当前浏览器是否支持画中画功能。
- 示例：
  ```javascript
  if (document.pictureInPictureEnabled) {
    console.log('画中画功能支持');
  }
  ```

*pictureInPictureElement*
- 用于获取当前处于画中画模式的元素。
- 示例：
  ```javascript
  const pipElement = document.pictureInPictureElement;
  if (pipElement) {
    console.log('当前画中画元素：', pipElement);
  }
  ```

*enterpictureinpicture、leavepictureinpicture*
- 用于监听进入和退出画中画模式的事件。
- 示例：
  ```javascript
  video.addEventListener('enterpictureinpicture', () => {
    console.log('进入画中画模式');
  });

  video.addEventListener('leavepictureinpicture', () => {
    console.log('退出画中画模式');
  });
  ```


#### 视频画中画的简单实现
以下是一个简单的视频画中画实现示例：

*HTML*
```html
<video controls src="your-video-url.mp4"></video>
<button id="pip-button">开启画中画</button>
```

*JavaScript*
```javascript
const video = document.querySelector('video');
const pipButton = document.getElementById('pip-button');

// 检测浏览器是否支持画中画
if (!document.pictureInPictureEnabled) {
  pipButton.disabled = true;
  console.log('当前浏览器不支持画中画功能');
}

// 点击按钮开启画中画
pipButton.addEventListener('click', async () => {
  try {
    if (video !== document.pictureInPictureElement) {
      await video.requestPictureInPicture();
    } else {
      await document.exitPictureInPicture();
    }
  } catch (error) {
    console.error('画中画操作失败：', error);
  }
});

// 监听进入画中画事件
video.addEventListener('enterpictureinpicture', () => {
  pipButton.textContent = '退出画中画';
});

// 监听退出画中画事件
video.addEventListener('leavepictureinpicture', () => {
  pipButton.textContent = '开启画中画';
});
```


#### 画中画的适用场景介绍
画中画功能在以下场景中非常实用：

*视频播放器*
- 用户可以在浏览其他内容的同时继续观看视频。

*在线会议*
- 将会议视频以小窗口形式浮动，方便用户多任务操作。

*教育平台*
- 学生可以在观看课程视频的同时做笔记或查阅资料。

*直播平台*
- 用户可以在观看直播的同时浏览其他网页。


#### 画中画使用的注意事项
*浏览器兼容性*
- 画中画功能在现代浏览器中支持较好，但在某些浏览器（如 Safari）中可能存在限制。
- 可以通过 `document.pictureInPictureEnabled` 检测浏览器是否支持。

*用户交互*
- 画中画功能必须由用户主动触发（如点击按钮），不能通过脚本自动开启。

*安全性*
- 画中画窗口不会显示原网页的其他内容，确保用户隐私安全。

*性能优化*
- 如果视频分辨率较高，画中画窗口可能会占用较多系统资源，需注意性能优化。


#### 总结
画中画功能为用户提供了极大的便利，尤其是在多任务处理场景中。通过浏览器的 **Picture-in-Picture API**，开发者可以轻松实现视频画中画效果。本文详细介绍了视频画中画的原理、核心 API、实现方法、适用场景及注意事项，希望能为开发者提供实用的参考。

此外，`DocumentPictureInPicture` 是画中画功能的扩展，允许将整个文档或部分 DOM 元素放入画中画窗口，但目前仍处于实验阶段，兼容性和实用性有限，建议在实际项目中谨慎使用。
