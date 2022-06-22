---
title: 2.x迁移到3.x变更点
date: 2022-01-25 14:17:57
---
### 生命周期变更
| 选项式 API | Hook inside setup |
| :------: | :------: |
| beforeCreate | Not needed* |
| created | Not needed* |
| beforeMount | onBeforeMount |
| mounted | onMounted |
| beforeUpdate | onBeforeUpdate |
| updated | onUpdated |
| beforeUnmount | onBeforeUnmount |
| unmounted | onUnmounted |
| errorCaptured | onErrorCaptured |
| renderTracked | onRenderTracked |
| renderTriggered | onRenderTriggered |
| activated | onActivated |
| deactivated | onDeactivated |

### vue3允许组件有多个根节点

### 移除过滤器
过滤器已移除，且不再支持，建议用计算属性或方法代替过滤器，而不是使用过滤器

### template应用挂载变更
在 Vue 2.x 中，当挂载一个具有 template 的应用时，被渲染的内容会替换我们要挂载的目标元素。
在 Vue 3.x 中，被渲染的应用会作为子元素插入，从而替换目标元素的 innerHTML

### 过渡的 class 名更改
过渡类名 v-enter 修改为 v-enter-from、过渡类名 v-leave 修改为 v-leave-from

### <transition> 组件的相关 prop 名称变化
leave-class 已经被重命名为 leave-from-class (在渲染函数或 JSX 中可以写为：leaveFromClass)
enter-class 已经被重命名为 enter-from-class (在渲染函数或 JSX 中可以写为：enterFromClass)

### Transition Group 根元素
<transition-group> 不再默认渲染根元素，但仍然可以用 tag attribute 创建根元素，希望保留原效果的，设置 tag='span' 即可

### 移除v-on.native修饰符
v-on 的 .native 修饰符已被移除。同时，新增的 emits 选项允许子组件定义真正会被触发的事件。因此，对于子组件中未被定义为组件触发的所有事件监听器，Vue 现在将把它们作为原生事件监听器添加到子组件的根元素中 (除非在子组件的选项中设置了 inheritAttrs: false)。

### v-if 与 v-for 的优先级变更
| vue2 | vue3 |
| :--- | :--- |
| 在一个元素上同时使用 v-if 和 v-for 时，v-for 会优先作用 | v-if 总是优先于 v-for 生效 |

### v-bind 合并行为
| vue2 | vue3 |
| :--- | :--- |
| 如果一个元素同时定义了 v-bind="object" 和一个相同的独立 attribute，那么这个独立 attribute 总是会覆盖 object 中的绑定（即不分先后） | 如果一个元素同时定义了 v-bind="object" 和一个相同的独立 attribute，那么绑定的声明顺序将决定它们如何被合并（即后覆盖前） |

### VNode 生命周期事件
| vue2 | vue3 |
| :--- | :--- |
| 事件来监听组件生命周期,以 hook: 前缀开头，并跟随相应的生命周期钩子的名字 | 以 vnode- 前缀开头，事件也可用于 HTML 元素 |

举例：vnode- 前缀：@vnode-updated="onUpdated"；或者在驼峰命名法的情况下附带前缀 vnode：@vnodeUpdated="onUpdated"；
生命周期钩子 beforeDestroy 和 destroyed 已经分别被重命名为 beforeUnmount 和 unmounted，所以相应的事件名也需要更新。

[从vue2迁移官方文档(注意vue3改为默认安装版本后官方文档地址可能发生迁移，该跳转地址可能存在问题)](https://v3.cn.vuejs.org/guide/migration/introduction.html)
