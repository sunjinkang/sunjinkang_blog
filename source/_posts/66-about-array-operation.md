---
title: 数组的操作之去重、排序（去重和排序的方法）
date: 2021-11-05 10:23:32
cover: https://cdn.pixabay.com/photo/2022/12/20/12/10/santa-7667744_640.jpg
tags:
---


#### 前言
数组是大家常用的数据结果，数组中我们常常需要对数组的元素进行去重和排序，以下是关于数组的去重排序的一些介绍。

## 去重

#### 简单去重
- 新建一新数组，遍历传入数组，值不在新数组就push进该新数组中。
- ![simple](1.png)

#### 对象键值对去重
- 新建一js对象以及新数组，遍历传入数组时，判断值是否为js对象的键，不是的话给对象新增该键并放入新数组。
- 注意点：判断是否为js对象键时，会自动对传入的键执行“toString()”，不同的键可能会被误认为一样，例如n[1]、n["1"]。解决上述问题还是得调用“indexOf”等方法进行判断。
- ![key-value](2.png)

#### 排序相邻去重
- 给传入数组排序，排序后相同值相邻，然后遍历时,新数组只加入不与前一值重复的值。
- 会打乱原来数组的顺序
- ![sort1](3.png)

#### 数组下标去重
- 如果当前数组的第i项在当前数组中第一次出现的位置不是i，那么表示第i项是重复的，忽略掉。否则存入结果数组。
- ![array-index](4.png)

#### 优化便利数组去重
- 获取没重复的最右一值放入新数组，检测到有重复值时终止当前循环同时进入顶层循环的下一轮判断
- ![array5](5.png)

#### Set去重
- Set数据结构，它类似于数组，其成员的值都是唯一的。利用Array.from将Set结构转换成数组。
- ![array-set](6.png)

#### splice操作原数组去重
- 双层循环，外层循环元素，内层循环时比较值，值相同时，则删去这个值。注意点:删除元素之后，需要将数组的长度也减1。
- ![array-splice](7.png)

*注意：以上方法在比较是否存在相同值的时候，一般使用indexOf，可以实现类似逻辑的判断方法还有includes、hasOwnProperty。*


## 排序

#### sort方法
- 默认排序顺序是根据字符串UniCode码，这个方法值只能排序第一位数 也可以字符串进行排序，传入比较函数进行比较
- ![array-sort-1](2-1.png)

#### reverse倒序方法

#### 冒泡排序
- 每轮依次比较相邻两个数的大小，后面比前面小则交换。
- ![array-sort-2](2-2.png)

#### 选择排序
- 通过比较首先选出最小的数放在第一个位置上，然后在其余的数中选出次小数放在第二个位置上,依此类推,直到所有的数成为有序序列。
- ![array-sort-3](2-3.png)

#### 快速排序
- 先从数列中取出一个数作为基准，分区过程，将比这个数大的数全放到它的右边，小于或等于它的数全放到它的左边，再对左右区间重复第二步，直到各区间只有一个数。
- ![array-sort-4](2-4.png)

#### 归并排序
- 将两个或两个以上的有序表组合成一个新的有序表。假如初始序列含有n个记录，则可看成是n个有序的子序列，每个子序列的长度为1，然后两两归并，得到[n/2]（向上取整）个长度为2或1的有序子序列；再两两归并，……，如此重复，直到得到一个长度为n的有序序列为止
- 速度仅次于快速排序，为稳定排序算法，一般用于总体无序，但是各子项相对有序的数列
- ![array-sort-5](2-5.png)

#### 插入排序
- 构建有序序列，对于未排序数据，在已排序序列中从后向前扫描，找到相应位置并插入。
- ![array-sort-6](2-6.png)

#### 桶排序
- 假设输入数据服从均匀分布，将数据分到有限数量的桶里，每个桶再分别排序（有可能再使用别的排序算法或是以递归方式继续使用桶排序进行排序）
- ![array-sort-7](2-7.png)
