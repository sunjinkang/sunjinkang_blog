---
title: babel基础知识- parser
date: 2023-05-12 20:23:42
---

#### @babel/parser
*作用*：
- 默认启用的最新ECMAScript版本(ES2017)。
- 附件发表评论。
- 支持JSX, Flow, Typescript。
- 支持实验性语言提案(至少接受0阶段的pr)。

*API*
babelParser.parse(code, [options])
babelParser.parseExpression(code, [options])
parse()将所提供的代码作为一个完整的ECMAScript程序进行解析，而parseExpression()则尝试在考虑性能的情况下解析单个表达式。如果有疑问，请使用.parse()。

*Option*
- allowImportExportEverywhere: 默认情况下，导入和导出声明只能出现在程序的顶层。将此选项设置为true允许在任何允许语句的地方使用它们。
- allowAwaitOutsideFunction: 默认情况下，await不允许在async函数外部使用，将此选项设置为true允许外部使用await。
- allowReturnOutsideFunction: 默认情况下，顶层的return语句会引发错误。将此设置为true以接受此类代码。
- allowSuperOutsideMethod: 默认情况下，不允许在类和对象方法之外使用super。将此设置为true以接受此类代码。
- sourceType: 指示应该解析代码的模式。可以是“script”、“module”或“unambiguous”之一。默认为“script”。“unambiguous”会让@babel/parser根据ES6的import或export语句进行猜测。带有ES6导入和导出的文件被认为是“模块”，否则就是“脚本”。
- sourceFilename: 将输出AST节点与其源文件名关联起来。在从多个输入文件的ast生成代码和源映射时非常有用。
- startLine: 默认情况下，解析的第一行代码被视为第1行。您可以提供一个行号作为开头。与其他源工具集成时有用。
- plugins: 想要启用的插件数组
- strictMode: 默认情况下，ECMAScript代码只在"use strict";指令存在，或者被解析的文件是ECMAScript模块才使用严格模式。将此选项设置为true以始终以严格模式解析文件。
- ranges: 为每个节点添加一个ranges属性: [node.start, node.end]
- tokens: 将所有解析过的令牌添加到“文件”节点上的令牌属性

*Output*
Babel解析器根据Babel AST格式生成AST。它基于具有以下偏差的ESTree规范:
> 现在有一个estree插件可以恢复这些偏差
- 文字标记被StringLiteral, NumericLiteral, BooleanLiteral, NullLiteral, RegExpLiteral所取代
- 属性令牌替换为ObjectProperty和ObjectMethod
- MethodDefinition 替换为 ClassMethod
- Program和BlockStatement包含额外的指令字段Directive和DirectiveLiteral
- FunctionExpression中的ClassMethod、ObjectProperty和ObjectMethod value property的属性被强制/引入到主方法节点中。
AST for JSX code 是基于 Facebook JSX AST.

*Semver*
Babel Parser在大多数情况下跟随semver。唯一需要注意的是，一些符合规范的错误修复可能会在补丁版本下发布。

*Example*
```js
require("@babel/parser").parse("code", {
  // parse in strict mode and allow module declarations
  sourceType: "module",

  plugins: [
    // enable jsx and flow syntax
    "jsx",
    "flow"
  ]
});
```