---
title: 关于原子CSS引擎 -- unocss
date: 2024-01-06 10:23:11
tags:
---

#### 前言

unocss是一个即时的原子CSS引擎，它可以让你用简短的类名来控制元素的样式，而不需要写复杂的CSS代码。
之前有分享提到过Tailwind，不知道大家是否还记得，Tailwind就是一种原子化的CSS框架。

> 原子化CSS是一种CSS架构方式，其支持小型、单一用途的类，其名称基于视觉功能。更加通俗的来讲，原子化CSS是一种新的CSS编程思路，它倾向于创建小巧且单一用途的class，并且以视觉效果进行命名。

#### 优点
它可以让你快速地开发和原型设计，而不需要考虑CSS的细节。
它可以让你的CSS文件更小，因为它只生成你用到的工具类。
它可以让你的CSS更一致，因为它遵循一套预设的规则和变量。
它可以让你的CSS更灵活，因为它支持自定义工具类，变体，指令和图标。
它可以让你的CSS更易于维护，因为它避免了样式冲突和重复代码。

#### unocss的安装和使用

unocss官网：https://unocss.dev/

unocss的安装(支持pnpm/yarn/npm)：
> pnpm add -D unocss

**在Vite中使用unocss**
unocss支持多种打包工具，这里仅以vite进行介绍，其他的方式可以查看官方文档。

```js
// 在vite配置文件中引入unocss
// vite.config.ts
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    UnoCSS(),
  ],
})

// 新建 uno.config.ts 文件
import { defineConfig } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
})

// 全局引入
import 'virtual:uno.css'
```

在Vite中使用unocss时，支持设置不同的mode：
- global(默认)
在这种模式下，需要在项目入口文件中添加 uno.css 的引入，同时这种模式支持热更新，生成的css样式会注入到index.html文件中。
- vue-scoped
将生成的css注入<style scoped>
- svelte-scoped
g该模式已移入对应的svelte-scoped包中
- shadow-dom
- per-module (实验性的)
为每个模块生成对应的css样式
- dist-chunk (实验性的)
为每个build的chunk文件生成css，对多页面应用更友好

**react+unocss**
```js
// vite.config.js
import UnoCSS from 'unocss/vite'
import React from '@vitejs/plugin-react'

export default {
  plugins: [
    React(),
    UnoCSS(),
  ],
}
```
注意：
- 如果项目中使用了 *@unocss/preset-attributify*，需要把 tsc 从build命令中去除
- 如果项目中同时使用了 *@vitejs/plugin-react* 和 *@unocss/preset-attributify*，引入unocss插件的位置要放在 *@vitejs/plugin-react* 前面
```js
// vite.config.js
import UnoCSS from 'unocss/vite'
import React from '@vitejs/plugin-react'

export default {
  plugins: [
    UnoCSS(),
    React(),
  ],
}
```

**preset**

Presets是UnoCSS的核心功能，能够让开发更便利
```js
// uno.config.ts
import { defineConfig, presetAttributify, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetAttributify({ /* preset options */}),
    presetUno(),
    // ...custom presets
  ],
})
```
注意：
如果presets的选项设置了具体值，默认preset会自动忽略。同时可以通过空数组的方式禁用默认preset。
```js
// uno.config.ts
import { defineConfig } from 'unocss'

export default defineConfig({
  presets: [], // disable default preset
  rules: [
    // your custom rules
  ],
})
```
官方提供的preset包：https://unocss.dev/presets/
设置提供的preset包：https://unocss.dev/presets/community

*定义自己的preset*
```js
import { Preset, definePreset } from 'unocss'

export default definePreset((options?: MyPresetOptions) => {
  return {
    name: 'my-preset',
    rules: [
      // ...
    ],
    variants: [
      // ...
    ],
  }
})

// uno.config.ts
import { defineConfig } from 'unocss'
import myPreset from './my-preset'

export default defineConfig({
  presets: [
    myPreset({ /* preset options */ }),
  ],
})
```
注意：规则名相同时，后面的会覆盖前面的规则。

#### 具体使用

刚入手 unocss 不知道怎么写规则，可以参考官方（大佬 antfu）给出的 交互式文档，输入你想要的css样式，就可以获得对应的class名称
> https://unocss.dev/interactive/

![unocss](unocss.png)

*用法*
基础使用：
可以依据自身需要，添加对应的class
![base](base.png)

自定义规则：

- 自定义类
```js
import { defineConfig } from 'unocss';

export default defineConfig({
  rules: [
    ['w-10', { width: '10px' }]
    [/^h-(\d)$/, ([, d]) => ({ height: `${d}px` })],
  ],
});

```
- 静态快捷方式
```js
import { defineConfig } from 'unocss';

export default defineConfig({
  shortcuts: [
    { 'flex-center': 'flex items-center justify-center' },
  ],
});

```
- 动态快捷方式
```js
import { defineConfig } from 'unocss';

export default defineConfig({
  shortcuts: [
    [
      /^base-border-(.*)$/,
      (match) => `border-1 border-style-dashed border-${match[1]}`,
    ],
  ],
});

```

#### vscode插件
unocss有自己的vscode插件：UnoCSS
![unocss-vscode](unocss-vscode.png)

unocss插件支持提示
![vscode-1](vscode-1.png)

页面上使用 unocss 提供的 class 带有虚线，并且能显示类名对应的样式内容
![vscode-2](vscode-2.png)

