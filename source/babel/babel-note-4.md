---
title: babel基础知识- parser、core、generator、code-frame
date: 2023-05-12 20:23:42
---

#### @babel/parser

_作用_：

- 默认启用的最新 ECMAScript 版本(ES2017)。
- 附件发表评论。
- 支持 JSX, Flow, Typescript。
- 支持实验性语言提案(至少接受 0 阶段的 pr)。

_API_
babelParser.parse(code, [options])
babelParser.parseExpression(code, [options])
parse()将所提供的代码作为一个完整的 ECMAScript 程序进行解析，而 parseExpression()则尝试在考虑性能的情况下解析单个表达式。如果有疑问，请使用.parse()。

_Option_

- allowImportExportEverywhere: 默认情况下，导入和导出声明只能出现在程序的顶层。将此选项设置为 true 允许在任何允许语句的地方使用它们。
- allowAwaitOutsideFunction: 默认情况下，await 不允许在 async 函数外部使用，将此选项设置为 true 允许外部使用 await。
- allowReturnOutsideFunction: 默认情况下，顶层的 return 语句会引发错误。将此设置为 true 以接受此类代码。
- allowSuperOutsideMethod: 默认情况下，不允许在类和对象方法之外使用 super。将此设置为 true 以接受此类代码。
- sourceType: 指示应该解析代码的模式。可以是“script”、“module”或“unambiguous”之一。默认为“script”。“unambiguous”会让@babel/parser 根据 ES6 的 import 或 export 语句进行猜测。带有 ES6 导入和导出的文件被认为是“模块”，否则就是“脚本”。
- sourceFilename: 将输出 AST 节点与其源文件名关联起来。在从多个输入文件的 ast 生成代码和源映射时非常有用。
- startLine: 默认情况下，解析的第一行代码被视为第 1 行。您可以提供一个行号作为开头。与其他源工具集成时有用。
- plugins: 想要启用的插件数组
- strictMode: 默认情况下，ECMAScript 代码只在"use strict";指令存在，或者被解析的文件是 ECMAScript 模块才使用严格模式。将此选项设置为 true 以始终以严格模式解析文件。
- ranges: 为每个节点添加一个 ranges 属性: [node.start, node.end]
- tokens: 将所有解析过的令牌添加到“文件”节点上的令牌属性

_Output_
Babel 解析器根据 Babel AST 格式生成 AST。它基于具有以下偏差的 ESTree 规范:

> 现在有一个 estree 插件可以恢复这些偏差

- 文字标记被 StringLiteral, NumericLiteral, BooleanLiteral, NullLiteral, RegExpLiteral 所取代
- 属性令牌替换为 ObjectProperty 和 ObjectMethod
- MethodDefinition 替换为 ClassMethod
- Program 和 BlockStatement 包含额外的指令字段 Directive 和 DirectiveLiteral
- FunctionExpression 中的 ClassMethod、ObjectProperty 和 ObjectMethod value property 的属性被强制/引入到主方法节点中。
  AST for JSX code 是基于 Facebook JSX AST.

_Semver_
Babel Parser 在大多数情况下跟随 semver。唯一需要注意的是，一些符合规范的错误修复可能会在补丁版本下发布。

_Example_

```js
require('@babel/parser').parse('code', {
  // parse in strict mode and allow module declarations
  sourceType: 'module',

  plugins: [
    // enable jsx and flow syntax
    'jsx',
    'flow',
  ],
});
```

#### @babel/core

方法
transform

> babel.transform(code: string, options?: Object, callback: Function)
> 转换传入的代码，回调函数中有生成代码、源码映射和 AST 的对象

```js
babel.transform(code, options, function (err, result) {
  result; // => { code, map, ast }
});
```

transformSync

> babel.transformSync(code: string, options?: Object)
> 转换传入的代码，返回一个拥有生成代码、源码映射和 AST 的对象

```js
babel.transformSync(code, options); // => { code, map, ast }
```

transformAsync

> babel.transformAsync(code: string, options?: Object)

```js
babel.transformAsync(code, options); // => Promise<{ code, map, ast }>
```

transformFile

> babel.transformFile(filename: string, options?: Object, callback: Function)
> 异步转换整个文件内容

```js
babel.transformFile(filename, options, callback);

babel.transformFile('test.js', options, function (err, result) {
  result; // => { code, map, ast }
});
```

transformFileSync

> babel.transformFileSync(filename: string, options?: Object)

```js
babel.transformFileSync(filename, options); // => { code, map, ast }
```

transformFileAsync

> babel.transformFileAsync(filename: string, options?: Object)

```js
babel.transformFileAsync(filename, options); // => Promise<{ code, map, ast }>
```

transformFromAst

> babel.transformFromAst(ast: Object, code?: string, options?: Object, callback: Function): FileNode | null
> 传入 AST 进行转换

```js
const sourceCode = 'if (true) return;';
const parsedAst = babel.parse(sourceCode, {
  parserOpts: { allowReturnOutsideFunction: true },
});
babel.transformFromAst(parsedAst, sourceCode, options, function (err, result) {
  const { code, map, ast } = result;
});
```

transformFromAstSync

> babel.transformFromAstSync(ast: Object, code?: string, options?: Object)

```js
const sourceCode = 'if (true) return;';
const parsedAst = babel.parse(sourceCode, {
  parserOpts: { allowReturnOutsideFunction: true },
});
const { code, map, ast } = babel.transformFromAstSync(
  parsedAst,
  sourceCode,
  options
);
```

transformFromAstAsync

> babel.transformFromAstAsync(ast: Object, code?: string, options?: Object)

```js
const sourceCode = 'if (true) return;';
babel
  .parseAsync(sourceCode, { parserOpts: { allowReturnOutsideFunction: true } })
  .then((parsedAst) => {
    return babel.transformFromAstAsync(parsedAst, sourceCode, options);
  })
  .then(({ code, map, ast }) => {
    // ...
  });
```

parse

> babel.parse(code: string, options?: Object, callback: Function)
> 给定一些代码，使用 Babel 的标准行为对其进行解析。将加载引用的预设和插件，以便自动启用可选的语法插件。

parseSync

> babel.parseSync(code: string, options?: Object)
> 返回一个 AST

parseAsync

> babel.parseAsync(code: string, options?: Object)
> 返回一个 AST 的 Promise

DEFAULT_EXTENSIONS

> babel.DEFAULT_EXTENSIONS: ReadonlyArray
> babel 支持的默认扩展列表(".js", ".jsx", ".es6", ".es", ".mjs")。@babel/register 和@babel/cli 使用这个列表来确定哪些文件需要编译。扩展这个列表是不可能的，但是@babel/cli 确实提供了使用 ——extensions 来支持其他扩展的方法。

#### @babel/generator

Options(输出格式选项)
| name | type | default | description |
auxiliaryCommentBefore | string | | Optional string to add as a block comment at the start of the output file |
auxiliaryCommentAfter | string | | Optional string to add as a block comment at the end of the output file |
shouldPrintComment | function | opts.comments | Function that takes a comment (as a string) and returns true if the comment should be included in the output. By default, comments are included if opts.comments is true or if opts.minified is false and the comment contains @preserve or @license |
| retainLines | boolean | false | Attempt to use the same line numbers in the output code as in the source code (helps preserve stack traces) |
| retainFunctionParens | boolean | false | Retain parens around function expressions (could be used to change engine parsing behavior) |
| comments | boolean | true | Should comments be included in output |
| compact | boolean or 'auto' | opts.minified | Set to true to avoid adding whitespace for formatting |
| minified | boolean | false | Should the output be minified |
| concise | boolean | false | Set to true to reduce whitespace (but not as much as opts.compact) |
| filename | string | | Used in warning messages |
| jsonCompatibleStrings | boolean | false | Set to true to run jsesc with "json": true to print "\u00A9" vs. "©"; |
| jsescOption | object | | Use jsesc to process string literals. You can customize jsesc by passing options to it. |

Options(源码映射选项)
| name | type | default | description |
| sourceMaps | boolean | false | Enable generating source maps |
| sourceRoot | string | | A root for all relative URLs in the source map |
| sourceFileName | string | | The filename for the source code (i.e. the code in the code argument). This will only be used if code is a string.|

AST from Multiple Sources
在大多数情况下，Babel在输入文件到输出文件之间进行1:1的转换。但是，您可能要处理由多个源(JS文件、模板等)构造的AST。如果是这种情况，并且希望源映射反映正确的源，则需要传递一个要生成的对象作为代码参数。键应该是源文件名，值应该是源内容。
```js
import {parse} from '@babel/parser';
import generate from '@babel/generator';

const a = 'var a = 1;';
const b = 'var b = 2;';
const astA = parse(a, { sourceFilename: 'a.js' });
const astB = parse(b, { sourceFilename: 'b.js' });
const ast = {
  type: 'Program',
  body: [].concat(astA.program.body, astB.program.body)
};

const { code, map } = generate(ast, { sourceMaps: true }, {
  'a.js': a,
  'b.js': b
});

// Sourcemap will point to both a.js and b.js where appropriate.
```

#### @babel/code-frame
用于生成错误信息并且打印出错误原因和错误行数。（其实就是个console工具类）
```js
import { codeFrameColumns } from '@babel/code-frame';

const rawLines = `class Foo {
  constructor()
}`;
const location = { start: { line: 2, column: 16 } };

const result = codeFrameColumns(rawLines, location, { /* options */ });

console.log(result);

  1 | class Foo {
> 2 |   constructor()
    |                ^
  3 | }

// 注意：列未知时也可以省略

import { codeFrameColumns } from '@babel/code-frame';

const rawLines = `class Foo {
  constructor() {
    console.log("hello");
  }
}`;
const location = { start: { line: 2, column: 17 }, end: { line: 4, column: 3 } };

const result = codeFrameColumns(rawLines, location, { /* options */ });

console.log(result);

  1 | class Foo {
> 2 |   constructor() {
    |                 ^
> 3 |     console.log("hello");
    | ^^^^^^^^^^^^^^^^^^^^^^^^^
> 4 |   }
    | ^^^
  5 | };
```

选项
highlightCode(默认值false)
切换语法，将代码高亮显示为终端的JavaScript。

linesAbove(默认值 2)

调整行数以显示上面的错误。

linesBelow(默认值 3)
调整行数以显示下面的错误。

forceColor(默认值 false)
启用此功能以强制语法高亮显示代码为JavaScript(对于非终结符);覆盖highlightCode。

message
传入一个字符串，在代码中突出显示的位置旁边内联显示(如果可能的话)。如果它不能内联定位，它将被放置在代码框架之上。
```js
1 | class Foo {
> 2 |   constructor()
  |                ^ Missing {
3 | };
```

