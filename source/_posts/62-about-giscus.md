---
title: 关于github个人博客使用giscus作为评论系统的操作说明
date: 2024-03-28 14:05:44
cover: https://cdn.pixabay.com/photo/2022/12/23/15/41/moon-7674557_640.jpg
tags:
- blog, giscus
---

#### 说明
本人使用github搭建个人博客，博客框架为Hexo(5.4.2)，博客主题为Volantis(5.8.0)。为了便于使用，接入了Giscus作为评论系统。本篇文章主要说明接入Giscus的具体操作。


#### 步骤一

- 建一个公共库
由于Giscus使用github的discussion作为评论数据存放地，所以使用Giscus需要先建一个github的*公共仓库*，仓库名称可根据自己的需要进行设置。本文中评论的仓库名为comments。
{% asset_img create-repo.png create-repo %}

*除了要求是个公共库之外，是否需要README、gitignore无具体要求*


- 开启公共库的discussion功能

公共库 -> Settings -> General -> Features -> 勾选discussion
{% asset_img check-discussion.png check-discussion %}

#### 步骤二

- 公共库安装Giscus
前往[这里](https://github.com/apps/giscus)，点击 <font color="red">Install</font> 安装Giscus
![install-giscus](install-giscus.png)

选择创建的公共库，将公共库与Giscus关联起来
![giscus-select-repo](giscus-select-repo.png)

#### 步骤三

- Giscus官网配置
前往 [Giscus官网](https://giscus.app/)，进行配置。
![giscus-config1](giscus-config1.png)
仓库名有三个前置条件，如果按照本文顺序进行安装，这里的检查会通过，否则会报错。如果报错了，请检查一下之前的配置是不是有哪里配置错了。

![giscus-config2](giscus-config2.png)
可以根据自己的需要选择，本文默认选了第一个。

![giscus-config3](giscus-config3.png)
选择 Announcements 类型即可，官方也是这样推荐的，因为这样便于管理。

其他的配置使用默认配置就好。

![giscus-config4](giscus-config4.png)
在你想出现评论的位置添加上面的 *</script/>* 标签。但如果已经存在带有giscus类的元素，则评论会被放在那里。
将上面标签中的数据填入项目中giscus配置的对应位置。
```yml
giscus:
  # 以下配置按照 yml 格式增删填写即可
  repo: #data-repo
  repo-id: #data-repo-id
  category: #data-category
  category-id: #data-category-id
  mapping: "pathname"
  reactions-enabled: "1"
  emit-metadata: "0"
  lang: "zh-CN"
```

以上配置完成后，理论上项目中就可以使用评论系统了。

登录后，输入评论，可以查看公共库的discussion中是否有对应的评论
![giscus-comments](giscus-comments.png)
![github-comments](github-comments.png)
可以看到，博客中的评论在github的公共仓库中也存在，配置Giscus的评论系统成功！