import moment from 'moment';

// 模块首页的内容模板
const moduleIndexTemplate = (title: string) => {
  return `
--
title: ${title}
date: ${moment().format('YYYY-MM-DD HH:mm:ss')}
--

[//]: # 新内容
`;
};

// 链接的模板
const linkTemplate = (linkText: string, linkUrl: string) => {
  return `
[${linkText}](${linkUrl})
`;
};

// 模块内容页面模板
const modulePageTemplate = (title: string) => {
  return `
--
title: ${title}
date: ${moment().format('YYYY-MM-DD HH:mm:ss')}
--

## 前言


## 大标题1

### 二级标题

[//]: # 图片
![图片名称](./images/具体图片)


## 大标题2


## 结束语


`;
};

// 模块问题文件模板
const moduleQuestionTemplate = (title: string) => {
  return `
--
title: ${title}模块的相关疑问
date: ${moment().format('YYYY-MM-DD HH:mm:ss')}
--

**问题1**
xxxxxx(问题具体内容)

*解答1*
xxxxxx(解答具体内容)



**问题2**
xxxxxx(问题具体内容)

*解答2*
xxxxxx(解答具体内容)


`;
};

export {
  moduleIndexTemplate,
  linkTemplate,
  modulePageTemplate,
  moduleQuestionTemplate
};
