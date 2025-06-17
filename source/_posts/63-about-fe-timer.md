---
title: 前端定时器
date: 2024-05-15 15:57:42
cover: https://cdn.pixabay.com/photo/2024/01/05/14/41/ai-generated-8489630_640.png
tags:
---

#### 前言

之前做了一个需求，大致内容是：登录系统时，登录接口多次错误后，依据错误次数禁止登录的时间越来越长，即多次登录错误需要等待一定时间才能再次登录，在禁止时间内，即使登录信息填写正确，登录接口也会提示需要等待一定时间才能再次登录。要求在登录页面显示等待的时间，同时等待时间内，禁止使用登录按钮。相信大家看到这个需求之后，首先想到的就是使用定时器，接下来通过这个需求的具体实现来看一下关于定时器的使用及其他方案的探索。


#### 现有方案及实现过程中遇到的问题

上面这个需求中，涉及到前端部分其实就是在页面根据接口返回的等待时间，显示一个倒计时，同时倒计时内，禁止使用登录功能。这个需求中其实主要的就是一个定时器，我们先抛开其他，单看定时器的实现。看到倒计时，大家一般都会使用setTimeout、setInterval，这里我选择了使用setTimeout。

一般来说，如果我们已经拿到了需要倒计时的时间，我们常见的做法可能是使用setTimeout，每秒减去一，把结果展示在页面上，就能实现一个简单的倒计时功能：
```js
// js
function countDown (num) {
  document.getElementById('timer_num').innerText = num;
  const timer = setTimeout(() => {
    clearTimeout(timer);
    if (num > 0) countDown(num-1);
  }, 1000);
}
countDown(30);
```
但是，这里出现了一个问题：我们知道javascript是一种单线程语言，所以当我们停留在倒计时所在的浏览器标签页时，倒计时可以较为准确的显示时间，但是当我们开了一个新的标签页后，js需要优先处理新标签页的任务，也就意味着原先倒计时的任务优先级会降低，即可能出现两三秒才执行一次倒计时，很显然这时倒计时的时间是不准确的。

那我们应该怎么解决这个问题呢？请教了一位大佬以后，大佬给出的方案：已知倒计时的时间，同时可以获取当前计算机的时间，可以计算得到倒计时截止的时间，离开页面的倒计时无法控制，但是重新回到页面之后可以根据这个时间修正倒计时的时间，从而保证倒计时的准确性。

根据这个方案，修改后的倒计时：
```js
const getSecondTime = (seconds) => {
  return Math.floor(new Date().getTime() / 1000) + seconds;
};
const handleCountDown = (endTime) => {
  const currentTime = getSecondTime(0);

  document.getElementById('timer_num').innerText = (endTime - currentTime);
  const countDownTimer = setTimeout(() => {
    clearTimeout(countDownTimer);
    if (currentTime < endTime) {
      handleCountDown(endTime);
    } else {
      document.getElementById('timer_num').innerText = 0;
    }
  }, 1000);
};
const totalTime = getSecondTime(30);
handleCountDown(totalTime);
```

计时器实现以后，加上其他如获取等待时间的请求、等待时间内禁止登录的逻辑就可以了。

#### 实现倒计时的其他方案

上面的倒计时功能是使用setTimeout实现的，我们常用的一般就是setTimeout、setInterval。接下来我们看一个其他方式实现的倒计时。在介绍这种方式之前，我们需要先了解一下*requestAnimationFrame*。

> window.requestAnimationFrame() 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行。
> 若你想在浏览器下次重绘之前继续更新下一帧动画，那么回调函数自身必须再次调用 requestAnimationFrame()。requestAnimationFrame() 是一次性的。

根据requestAnimationFrame的使用场景，我们可以得知，通过调用requestAnimationFrame也可以实现我们需要的定时器效果。

```js
var a=30;
var date = new Date();
requestAnimationFrame(function () {
  // 更新时间差小于1秒，继续更新下一帧动画，回调函数再次调用 requestAnimationFrame
  if(new Date()-date<1000) {
    requestAnimationFrame(arguments.callee);
    // 时间差大于1秒并且倒计时未结束，更新页面的倒计时数据及更新时间，继续更新下一帧动画
  } else if (a>=0) {
    document.getElementById('timer_num').innerText = a--;
    date = new Date();
    requestAnimationFrame(arguments.callee);
  }
});
```
但是，在MDN文档中有这样一句话：
> 为了提高性能和电池寿命，在大多数浏览器里，当 requestAnimationFrame() 运行在后台标签页或者隐藏的 <iframe> 里时，requestAnimationFrame() 会被暂停调用以提升性能和电池寿命。

也就是说，如果我用requestAnimationFrame实现了一个定时器，当我离开定时器所在的标签页时，这个定时器就停了。。。从这一点上来说，是不是感觉还不如setTimeout和setInterval实现的定时器，但是我们可以通过一些修改来进行达到我们需要的效果。


```js
const getSecondTime = (seconds) => {
  return Math.floor(new Date().getTime() / 1000) + seconds;
};
const endTime = getSecondTime(30);
let date = new Date();
let requestId = requestAnimationFrame(function () {
  // 更新时间差小于1秒，继续更新下一帧动画，回调函数再次调用 requestAnimationFrame
  if(new Date()-date<1000) {
    console.log(1)
    requestId = requestAnimationFrame(arguments.callee);
    // 时间差大于1秒并且倒计时未结束，更新页面的倒计时数据及更新时间，继续更新下一帧动画
  } else {
    const currentTime = getSecondTime(0);
    if (currentTime <= endTime) {
      document.getElementById('timer_num').innerText = (endTime - currentTime);
      date = new Date();
      console.log(2)
      requestId = requestAnimationFrame(arguments.callee);
    } else {
      document.getElementById('timer_num').innerText = 0;
      console.log(3)
      cancelAnimationFrame(requestId);
    }
  }
});
```

上面通过系统时间的修正，同样达到了我们的预期。

#### 总结
综上，我们可以通过多种方式实现定时器，但是纯前端的定时器会存在时间不准的问题，因此需要通过其他的方式进行修正。