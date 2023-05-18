---
title: babel基础知识- helpers、runtime、template、traverse、types
date: 2023-05-14 10:13:50
---

#### @babel/helpers
工具类，提供了一些内置的函数实现，主要用于babel插件的开发

定义helper
> 注意:此包仅供包含在此存储库中的包使用。目前第三方插件还没有办法定义helper。
helper是在src/ Helpers .js文件中定义的，它们必须是有效的模块，并遵循以下准则:
- 它们必须具有默认导出，这是它们的入口点。
- 它们可以通过使用默认导入来导入其他帮助程序。
- 它们不能有命名出口。
```js
helpers.customHelper = defineHelper(`
  import dep from "dependency";

  const foo = 2;

  export default function getFooTimesDepPlusX(x) {
    return foo * dep() + x;
  }
`);
```

#### @babel/runtime
@babel/runtime是一个包含Babel模块化运行时helper和regenerator-runtime版本的库。
与Babel插件@babel/plugin-transform-runtime一起作为运行时依赖项使用。
```js
var _classCallCheck = require("@babel/runtime/helpers/classCallCheck");

var Circle = function Circle() {
  _classCallCheck(this, Circle);
};
```
*具体作用可查看：https://www.jiangruitao.com/babel/transform-runtime/*

#### @babel/template
```js
import template from "@babel/template";
import generate from "@babel/generator";
import * as t from "@babel/types";

const buildRequire = template(`
  var IMPORT_NAME = require(SOURCE);
`);

const ast = buildRequire({
  IMPORT_NAME: t.identifier("myModule"),
  SOURCE: t.stringLiteral("my-module"),
});

console.log(generate(ast).code);
const myModule = require("my-module");
```
*.ast*
如果没有使用占位符，并且您只是想要一种简单的方法将字符串解析为AST，则可以使用模板的. AST版本。
```js
const ast = template.ast(`
  var myModule = require("my-module");
`);
```

*AST results*
@babel/template API提供了一些灵活的API，使创建具有预期结构的ast尽可能容易。它们中的每一个都有上面提到的.ast属性。
template
template依据解析结果，返回单个表达式，或者表达式数组

template.smart
和template方法一样

template.statement
template.statement("foo;")() 返回单个表达式节点，其他情况时抛出错误

template.statements
template.statements("foo;foo;")() 返回表达式节点数组

template.expression
template.expression("foo")() 返回表达式节点

template.program
template.program("foo;")() 返回程序节点

*API*
template(code, [opts])
选项
@babel/template接受Babel Parser的所有选项，并指定一些自己的默认值:
- allowReturnOutsideFunction默认值为true.
- allowSuperOutsideMethod默认值为true.
- sourceType默认值为module.

placeholderWhitelist
一组要自动接受的占位符名称。此列表中的项不需要匹配给定的占位符模式。

placeholderPattern（默认值：/^[_$A-Z0-9]+$/）
在寻找应该被视为占位符的Identifier和StringLiteral节点时要搜索的模式。'false'将完全禁用占位符搜索，只留下'placeholderWhitelist'值来查找占位符。

preserveComments(默认值false)
将其设置为true以保留来自code参数的任何注释。

*Return value*
默认情况下，@babel/template返回一个函数，该函数由一个可选的替换对象调用。有关示例，请参阅用法部分。
使用.ast时，直接返回AST数据

#### @babel/traverse
```js
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";

const code = `function square(n) {
  return n * n;
}`;

const ast = parser.parse(code);

traverse(ast, {
  enter(path) {
    if (path.isIdentifier({ name: "n" })) {
      path.node.name = "x";
    }
  }
});

// 此外，我们还可以针对语法树中的特定节点类型
traverse(ast, {
    FunctionDeclaration: function(path) {
             path.node.id.name = "x";
    }
})
```

#### @babel/types

方法较多，可依据自身需要使用，文档：https://babel.docschina.org/docs/en/7.0.0/babel-types/
