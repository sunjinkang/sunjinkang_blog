---
title: 基于 Vue3 封装一个可扩展的视频播放器
date: 2025-06-26 17:08:34
cover: https://cdn.pixabay.com/photo/2016/09/19/22/46/lake-1681485_640.jpg
tags: [vue3, video]
---

## 前言

在很多视频类业务中（视频网站、在线教育、企业内训平台），**视频播放** 是不可或缺的核心功能。一个好用的视频播放器不仅能提供流畅的播放体验，还能满足用户的各种需求，比如弹幕互动、清晰度切换、截图保存、画中画观看等。

如果我们只使用原生的 `<video>` 标签，虽然能满足最基本的播放需求，但在以下方面会遇到问题：

- 样式和交互不可定制；
- 格式支持有限（对 HLS、DASH 的兼容性差）；
- 高级功能（弹幕、截图、多音轨）需要自己扩展；

下面是我最近实现的一个视频播放器的整理，不仅实现基础的播放控制，还扩展了一些高级功能：
- 弹幕层（Canvas 渲染，支持彩色文字、表情）
- 倍速播放
- 视频截图
- 进度条预览缩略图（前端本地抽帧生成）
- 画中画（Picture-in-Picture）
- 多清晰度切换（实现思路）
- 多音轨切换（实现思路，本文暂不实现）
- 跳过片头/片尾（实现思路）
- 剧情热度曲线（实现思路）

## 功能实现说明

### 目录与拆分

可复用的 UI 拆到了 `Video/components/`：
- `ControlsBar.vue`：控制栏（播放/暂停、进度、倍速、清晰度、音轨、PiP、全屏）
- `DanmakuInput.vue`：弹幕输入（文本、颜色、发送）

主体在 `Video/index.vue`，不接收外部 props，默认使用同目录 `bird.mp4`。

```vue
<template>
  <div class="video-player-container">
    <div class="video-wrapper" ref="videoWrapperRef">
      <video ref="videoRef" class="video-player" />
      <canvas ref="danmakuCanvasRef" class="danmaku-canvas" v-show="showDanmaku" />
      <ControlsBar ... />
    </div>
    <DanmakuInput v-if="showDanmakuInput" ... />
  </div>
</template>
```


### 弹幕层（核心片段）

关键点：

- 使用 `canvas` 覆盖在视频上，避免创建大量 DOM 节点导致卡顿；
- 根据 `video.currentTime` 判断哪些弹幕需要出现；
- 使用 `requestAnimationFrame` 实现流畅的动画效果。

数据结构：

```js
const danmakus = [
  { text: 'Hello World!', time: 2, color: 'red', speed: 2, fontSize: 20 },
  { text: 'Vue3 yyds!', time: 5, color: 'blue', speed: 3, fontSize: 24 }
]
```

触发与渲染（节选）：

```ts
// 发送后立即显示，自动关闭输入框
const sendDanmaku = () => {
  const item = { /* 省略：id/text/time/color/speed/fontSize/x/y */ }
  danmakuList.value.push(item)
  spawnDanmaku(item)
  showDanmakuInput.value = false
}

// 时间窗口触发（±0.3s），离开窗口后可再次触发
const danmakuWindowMap = new Map<string, boolean>()
const updateDanmaku = () => {
  const t = currentTime.value
  danmakuList.value.forEach((d) => {
    const inWin = Math.abs(d.time - t) < 0.3
    const was = danmakuWindowMap.get(d.id) === true
    if (inWin && !was) { spawnDanmaku(d); danmakuWindowMap.set(d.id, true) }
    if (!inWin && was) { danmakuWindowMap.set(d.id, false) }
  })
}

// 插入活跃弹幕并在 RAF 中绘制
const spawnDanmaku = (d) => {
  const w = danmakuCanvasRef.value?.width || videoRef.value?.clientWidth || 640
  const h = danmakuCanvasRef.value?.height || videoRef.value?.clientHeight || 360
  d.x = w
  if (!d.y || d.y < 10 || d.y > h - 10) d.y = Math.random() * (h - 50) + 25
  if (!activeDanmakus.value.some((x) => x.id === d.id)) activeDanmakus.value.push({ ...d })
}
```


### 倍速播放

很多用户喜欢 1.25x、1.5x、2x 播放，用于快速过课程视频或电影。

原理非常简单：设置 `video.playbackRate`。

```js
videoRef.value.playbackRate = 1.5


<select @change="onPlaybackRate" class="playback-rate-select">
  <option value="0.5">0.5x</option>
  <option value="0.75">0.75x</option>
  <option value="1" selected>1x</option>
  <option value="1.25">1.25x</option>
  <option value="1.5">1.5x</option>
  <option value="2">2x</option>
</select>
```

UI 可以提供一个下拉框或按钮组，用户随时切换。
*注意：*playbackRate 没有 “绝对数值上限 / 下限”，但受 浏览器实现 和 媒体技术特性 双重约束，实际可用的 “安全范围” 通常为 0.25~5.0（多数场景），推荐日常开发使用 0.5~2.0 以平衡体验与兼容性。


### 视频截图

通过 `<canvas>` 截取视频当前帧：

```js
const captureFrame = () => {
  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)
  const dataURL = canvas.toDataURL('image/png')
  const a = document.createElement('a')
  a.href = dataURL
  a.download = 'screenshot.png'
  a.click()
}
```

这在学习网站和视频监控场景中很常见。


### 进度条预览缩略图（本地生成）

视频网站常见功能：鼠标移动到进度条，显示对应时间的缩略图。

原理：

1. 使用隐藏的 `video` + `canvas` 按等间隔抽帧生成多张缩略图（dataURL）；
2. 鼠标移动到进度条时，根据百分比映射到缩略图索引并显示。

```ts
const generateThumbnails = async (count = 20, targetWidth = 160) => {
  const off = document.createElement('video')
  off.muted = true; off.preload = 'auto'; off.src = defaultSrc
  await new Promise(r => off.addEventListener('loadedmetadata', () => r(null), { once: true }))
  const aspect = (off.videoWidth || 1280) / Math.max(1, off.videoHeight || 720)
  const w = targetWidth, h = Math.round(w / aspect)
  const cvs = document.createElement('canvas'); cvs.width = w; cvs.height = h
  const ctx = cvs.getContext('2d')!
  const items: string[] = []
  for (let i = 0; i < count; i++) {
    const t = (i / Math.max(1, count - 1)) * Math.max(0.1, duration.value)
    await new Promise(r => { off.addEventListener('seeked', () => r(null), { once: true }); off.currentTime = Math.min(Math.max(0, t), Math.max(0.1, duration.value - 0.1)) })
    ctx.drawImage(off, 0, 0, w, h)
    items.push(cvs.toDataURL('image/jpeg', 0.7))
  }
  thumbnails.value = items
}
```

常见的有：服务器端生成、客户端生成（上面使用的是客户端生成）
*服务器端预生成（最主流、效果最佳的方式）*
这是大型视频平台最常用的方法，在视频上传后、播放前就完成所有工作。

工作原理：
- 视频处理：当用户上传一个视频后，服务器端的处理程序（如使用 FFmpeg）会按固定时间间隔（例如每隔 1秒、5秒或10秒）对视频进行采样，截取一帧画面。
- 生成图片：将这些帧画面保存为一系列小的 JPEG 或 WebP 图片文件。一张全长的进度条可能需要上百张缩略图。
- 合成雪碧图（Sprite Sheet）：为了优化网络请求，通常不会存储为上百个独立的小文件。而是将多张缩略图拼接成一张长的大图（雪碧图）。例如，将 100 张 160x90 的图片拼成一张 1600x900 的大图。
- 存储与映射：将生成的雪碧图和一份映射文件（通常是 JSON 或写在 M3U8 清单中的信息）存储起来。映射文件记录了每张缩略图在雪碧图中的位置（如第 3 秒的缩略图位于大图的 (0, 0) 坐标，尺寸为 160x90）。
- 客户端请求：当用户鼠标悬停在进度条上时，播放器会根据鼠标位置计算出对应的时间点，然后通过映射文件找到该时间点对应的缩略图在雪碧图中的坐标，最后通过 CSS background-position 属性在大图中“裁剪”出那一小块来显示。

优点：
- 性能极佳：用户观看时没有任何性能开销，切换瞬间完成。
- 画质可控：可以预先处理缩略图，保证清晰度和一致性。
- 兼容性好：不依赖客户端性能。

缺点：
- 存储空间大：需要为每个视频额外存储一套缩略图数据。
- 处理耗时：上传视频后需要时间来处理生成，不适合实时性极高的场景。


### 画中画模式

画中画（Picture-in-Picture, PiP）可以让用户在浏览其他页面时继续观看视频。

浏览器原生支持：

```js
const enterPip = async () => {
  if (document.pictureInPictureElement) {
    await document.exitPictureInPicture()
  } else {
    await videoRef.value.requestPictureInPicture()
  }
}
```

应用场景：多任务办公、学习网站。


### 多清晰度切换（实现思路）

本质是“切换不同的源”。mp4 场景等价于设置 `video.src = 新URL`；HLS 场景需要替换 HLS 的 source。为提升体验，一般会记录 `currentTime` 并在新源可播放后跳回原时间。

```ts
const setQualityByValue = (value: string) => {
  const q = qualities.value.find((x) => x.value === value)
  if (!q) return
  const t = currentTime.value
  loadVideo(q.url)
  setTimeout(() => { if (videoRef.value) videoRef.value.currentTime = t }, 1000)
}
```


### 多音轨切换（实现思路，本文暂不实现）
1. 原生 <video> 支持
通过 `audioTracks` 读取音轨并设置 `audioTracks[].enabled` 切换。
```js
const tracks = videoRef.audioTracks
for (let i = 0; i < tracks.length; i++) {
  tracks[i].enabled = (i === selectedIndex)
}
```
*注意：*并不是所有浏览器都完整实现了这个 API，兼容性有限。

2. 基于 HLS (m3u8) / DASH (mpd)
流媒体格式（HLS、DASH）对多音轨有专门的支持：
- m3u8/mpd 文件里会描述不同的音频流（language、name、codec）；
- 播放库（hls.js、dash.js）会解析出音轨列表；
- 前端可以通过 API 切换音轨


### 跳过片头/片尾
- 片头片尾的时间点
需要提前知道片头、片尾在视频中的时间范围。
通常由后端标记（比如：片头 0~90s，片尾 -120s 到结束），前端通过接口获取。

- 前端实现
视频播放时判断 currentTime 是否进入片头 / 片尾范围；
在对应位置展示 “跳过片头” / “跳过片尾” 按钮；
用户点击后，直接 video.currentTime = endOfIntro，或者 video.currentTime = video.duration - outroLength。


### 剧情高低点（剧情热度曲线）
你可能在 B 站或爱奇艺见过，进度条上会有一条曲线，表示不同时间点的“热度”（比如弹幕多、评论多、用户停留多的地方）。

- 数据来源
常见做法是后端根据用户行为数据生成热度值，例如：
  - 弹幕数、评论数
  - 停留/拖动次数
  - 用户重复观看次数

后端将这些数据按时间点聚合成数组，例如：
```json
[
  { time: 10, heat: 5 },
  { time: 20, heat: 12 },
  { time: 30, heat: 30 },
  ...
]
```

- 前端展示
在进度条上方绘制一条小曲线，Y 值对应热度值，X 对应时间。
可以用 canvas 或 SVG（如 d3.js）绘制曲线。
鼠标悬停时显示该时间点的热度值。


## 总结

本文在 Vue3 中封装了一个可扩展的视频播放器，支持：

- 播放基础功能（示例使用本地 mp4）
- 弹幕层（Canvas 渲染，提交后即时显示、可在回退时再次触发）
- 倍速播放
- 视频截图
- 进度条预览缩略图（前端本地抽帧）
- 画中画模式
- 多清晰度切换（思路：切换不同源并恢复播放时间）
- 多音轨切换（思路说明，本文未实现）
- 跳过片头/片尾（实现思路）
- 剧情热度曲线（实现思路）
