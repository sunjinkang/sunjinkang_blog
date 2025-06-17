---
title: 76-关于弹幕
date: 2025-05-20 20:57:18
cover: https://cdn.pixabay.com/photo/2015/04/23/21/59/tree-736875_1280.jpg
tags:
---


## 前言

弹幕，作为一种极具互动性的视觉表达方式，已经成为视频平台（如 Bilibili、爱奇艺、腾讯视频等）的标配。它不仅提升了用户参与感，也在一定程度上丰富了视频内容的表达维度。
下面我们将介绍弹幕的基本实现原理并结合 Bilibili 的弹幕思路，构建一个可用的弹幕系统。


## 弹幕的本质与核心原理

弹幕的本质，是在播放视频过程中，将用户生成的文本内容（弹幕）实时渲染在视频层上方，进一步包括**横向滚动、同步展示、支持样式自定义与交互控制等**。

核心要素包括：

1. **轨道控制**：防止多条弹幕重叠
2. **动画渲染**：实现从右至左（或其他方向）的移动
3. **消息管理**：弹幕的接收、发送、缓存和删除
4. **播放同步**：弹幕与视频时间对齐
5. **交互功能**：弹幕开关、颜色、过滤、密度等设置

下面我们先从一个简单的实现入手

## 纯前端的基础弹幕实现

### 基本功能
- 文字从右侧飘入左侧
- 随机轨道显示
- 动画结束后自动销毁

### HTML 结构

```html
<div class="video-container">
  <video id="video" src="sample.mp4" controls></video>
  <div class="danmu-layer"></div>
</div>
```

### 样式

```css
.video-container {
  position: relative;
  width: 640px;
  height: 360px;
}

.danmu-layer {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.danmu-item {
  position: absolute;
  white-space: nowrap;
  font-size: 16px;
  color: white;
  animation: move linear;
}

@keyframes move {
  from { transform: translateX(100%); }
  to { transform: translateX(-100%); }
}
```

### JavaScript 实现

```js
function createDanmaku(text) {
  const layer = document.querySelector('.danmaku-layer');
  const el = document.createElement('div');
  el.className = 'danmaku-item';
  el.textContent = text;

  // 轨道计算
  const trackHeight = 30;
  const trackCount = Math.floor(layer.clientHeight / trackHeight);
  const track = Math.floor(Math.random() * trackCount);
  el.style.top = `${track * trackHeight}px`;

  // 动画持续时间
  const duration = 8 + Math.random() * 2;
  el.style.animationDuration = `${duration}s`;

  layer.appendChild(el);

  el.addEventListener('animationend', () => el.remove());
}

// 示例：每秒生成一条弹幕
setInterval(() => {
  createDanmaku('Hello 弹幕~');
}, 1000);
```

## 渲染方式选择：DOM vs Canvas vs WebGL
| 渲染方式                        | 优点                        | 缺点                    |
| ------------------------------- | --------------------------- | ----------------------- |
| **DOM（absolute + animation）** | 易实现、支持样式多          | 性能差，弹幕多时掉帧    |
| **Canvas**                      | 高性能、能支持 1000+ 条弹幕 | 开发复杂、不易调试      |
| **WebGL**                       | 超高性能                    | 最复杂，需 GPU 编程知识 |
建议实现：小规模用 DOM 实现，大规模用 Canvas，长期项目考虑 WebGL。


## 构建一个高级弹幕系统（模拟 Bilibili 实现）

### 目标增强功能

* 与视频时间同步（非实时发送也能同步）
* 使用 Canvas 提升性能
* 支持发送自定义颜色弹幕
* 弹幕开关
* WebSocket 实时接收弹幕
* 使用本地视频进行绑定展示


### HTML 结构（支持输入和控制）
- 视频与弹幕分层渲染，避免 DOM 操作影响性能
- Canvas 尺寸需与视频保持比例协调
- 控制面板集成色彩选择等实用功能

```html
<video id="video" src="./video.mp4" width="800" controls></video>
<canvas id="danmaku-canvas" width="800" height="400"></canvas>

<div class="controls">
  <input type="text" id="danmakuText" placeholder="输入弹幕" />
  <input type="color" id="colorPicker" />
  <button onclick="sendUserDanmaku()">发送</button>
  <button onclick="toggleDanmaku()">开/关弹幕</button>
</div>

```

### Canvas 渲染弹幕核心逻辑
- 基于 RAF 的动画循环保证流畅性
- 速度随机化（2-3.5px/帧）实现自然运动差异
- measureText 精确计算文本宽度实现内存回收
```js
const canvas = document.getElementById('danmaku-canvas');
const ctx = canvas.getContext('2d');
const video = document.getElementById('video');
let danmakus = []; // 所有弹幕
let showDanmaku = true;

// 渲染帧
function render() {
  if (!showDanmaku) return requestAnimationFrame(render);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const currentTime = video.currentTime;

  danmakus.forEach(dm => {
    if (dm.time <= currentTime) {
      dm.x -= dm.speed;
      ctx.font = `${dm.fontSize}px sans-serif`;
      ctx.fillStyle = dm.color;
      ctx.fillText(dm.text, dm.x, dm.y);
    }
  });

  danmakus = danmakus.filter(dm => dm.x > -ctx.measureText(dm.text).width);
  requestAnimationFrame(render);
}

requestAnimationFrame(render);
```

### 弹幕数据结构和生成方法
- 时间戳绑定实现「时移播放」场景支持
- Y 轴随机分布简化轨道管理逻辑
- 速度随机化提升视觉效果
```js
function createDanmaku(text, color, time) {
  return {
    text,
    color,
    time,
    x: canvas.width,
    y: Math.random() * canvas.height,
    speed: 2 + Math.random() * 1.5,
    fontSize: 20,
  };
}
```

### 用户发送弹幕
```js
function sendUserDanmaku() {
  const text = document.getElementById('danmakuText').value;
  const color = document.getElementById('colorPicker').value;
  const time = video.currentTime;

  const dm = createDanmaku(text, color, time);
  danmakus.push(dm);

  // 同时发送到服务器（WebSocket）
  ws.send(JSON.stringify(dm));
}
```

### WebSocket 实时收发
```js
const ws = new WebSocket('ws://localhost:8080');
ws.onopen = () => {
  console.log('连接服务器');
  ws.send(JSON.stringify({ type: 'getHistory' }));
};

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);

  if (data.type === 'history') {
    danmakus.push(...data.danmakus); // 加载历史
  } else {
    danmakus.push(createDanmaku(data.text, data.color, data.time));
  }
};
```

### 开关弹幕
```js
function toggleDanmaku() {
  showDanmaku = !showDanmaku;
}
```


### 服务器建议（Node.js 示例）

使用简单的 WebSocket server 可实现广播：

```js
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Set();
const danmakuHistory = []; // 所有弹幕存储
wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);

    if (data.type === 'getHistory') {
      // 将所有历史弹幕发送给客户端
      ws.send(
        JSON.stringify({
          type: 'history',
          danmakus: danmakuHistory,
        })
      );
      return;
    }

    // 正常弹幕处理
    danmakuHistory.push(data);
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    }
  });

  ws.on('close', () => clients.delete(ws));
});
```

以上只是简单实现了弹幕的效果，还有一些优化点没有处理，比如：
- 添加防碰撞算法（轨道优先级管理）
- 实现弹幕类型多样化
  - 不同位置的滚动
  - 不同方向的滚动等等
- 增加弹幕密度控制
- 添加历史弹幕加载功能
- 实现字体描边等不同的样式特效或动画特效

## 结尾

弹幕系统的实现，不仅仅是文字飘动那么简单。它融合了动画、轨道管理、实时通信、数据同步、性能优化等多个技术点，是前端开发中非常有趣的一项综合性挑战。
