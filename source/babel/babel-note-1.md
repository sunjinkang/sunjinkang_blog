---
title: babel基础知识
date: 2023-04-09 10:13:45
---

#### 抽象语法树

> 抽象语法树（Abstract Syntax Tree，AST），或简称语法树（Syntax tree），是源代码语法结构的一种抽象表示。它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构。

babel 的处理过程每一步都涉及抽象语法树。
[AST Explorer](https://astexplorer.net/)是一个在线转化 ast 的网站，可以查看源码及转化后的 AST 代码。

![babel-ast](./file/babel-ast.png)
以 type 划分每一层级，这样的每一层结构也被叫做 节点（Node）。 一个 AST 可以由单一的节点或是成百上千个节点构成。 它们组合在一起可以描述用于静态分析的程序语法。

每一个节点都有 start、end、loc 这三个属性用以确定节点在源代码中的位置

#### babel 的处理步骤

babel 的主要处理分为三个步骤：解析（parse），转换（transform），生成（generate）

###### 解析

babel 的解析是将源码转化输出为 ast 的过程，解析分为两步：词法分析和语法分析

- 词法分析：词法分析阶段把字符串形式的代码转换为 令牌（tokens） 流。
- 语法分析：语法分析阶段会把一个令牌流转换成 AST 的形式。 这个阶段会使用令牌中的信息把它们转换成一个 AST 的结构，这样更易于后续的操作。

###### 转换

转换步骤接收 AST 并对其进行遍历，在此过程中对节点进行添加、更新及移除等操作。 这是 Babel 或是其他编译器中最复杂的过程 同时也是插件将要介入工作的部分，后续将做详细介绍。

###### 生成

代码生成步骤把最终（经过一系列转换之后）的 AST 转换成字符串形式的代码，同时还会创建源码映射（source maps）。.
代码生成其实很简单：深度优先遍历整个 AST，然后构建可以表示转换后代码的字符串。

###### State(状态)

通过将一个访问者放入另一个访问者中以达到从访问者中消除全局状态的目的。

```javascript
const updateParamNameVisitor = {
  Identifier(path) {
    if (path.node.name === this.paramName) {
      path.node.name = 'x';
    }
  },
};

const MyVisitor = {
  FunctionDeclaration(path) {
    const param = path.node.params[0];
    const paramName = param.name;
    param.name = 'x';

    path.traverse(updateParamNameVisitor, { paramName });
  },
};

path.traverse(MyVisitor);
```

###### Scopes(作用域)

当编写一个转换时，必须小心作用域。得确保在改变代码的各个部分时不会破坏已经存在的代码。
在添加一个新的引用时需要确保新增加的引用名字和已有的所有引用不冲突。 或者我们仅仅想找出使用一个变量的所有引用， 我们只想在给定的作用域（Scope）中找出这些引用。

当你创建一个新的作用域时，需要给出它的路径和父作用域，之后在遍历过程中它会在该作用域内收集所有的引用(“绑定”)。
一旦引用收集完毕，你就可以在作用域（Scopes）上使用各种方法

###### Bindings（绑定）

所有引用属于特定的作用域，引用和作用域的这种关系被称作：绑定（binding）。
通过绑定的信息可以查找一个绑定的所有引用，并且知道这是什么类型的绑定(参数，定义等等)，查找它所属的作用域，或者拷贝它的标识符。 你甚至可以知道它是不是常量，如果不是，那么是哪个路径修改了它。
在很多情况下，知道一个绑定是否是常量非常有用，最有用的一种情形就是代码压缩时。

#### API

###### [Babylon](https://github.com/babel/babylon)

_Babylon has been moved into the main Babel mono-repo as [@babel/parser](https://github.com/babel/babel/tree/main/packages/babel-parser)._

Babylon 是 Babel 的解析器。最初是 从 Acorn 项目 fork 出来的。Acorn 非常快，易于使用，并且针对非标准特性(以及那些未来的标准特性) 设计了一个基于插件的架构。

具体内容可查看后续章节。

###### babel-traverse

Babel Traverse（遍历）模块维护了整棵树的状态，并且负责替换、移除和添加节点。

traverse 可以和 parser 一起使用，用于遍历和更新节点

```javascript
import * as babylon from 'babylon';
import traverse from 'babel-traverse';

const code = `function square(n) {
  return n * n;
}`;

const ast = babylon.parse(code);

traverse(ast, {
  enter(path) {
    if (path.node.type === 'Identifier' && path.node.name === 'n') {
      path.node.name = 'x';
    }
  },
});
```

具体内容可查看后续章节。

###### babel-types

Babel Types 模块是一个用于 AST 节点的 Lodash 式工具库， 它包含了构造、验证以及变换 AST 节点的方法。 该工具库包含考虑周到的工具方法，对编写处理 AST 逻辑非常有用。

```javascript
import traverse from 'babel-traverse';
import * as t from 'babel-types';

traverse(ast, {
  enter(path) {
    if (t.isIdentifier(path.node, { name: 'n' })) {
      path.node.name = 'x';
    }
  },
});
```

_Definitions（定义）_
Babel Types 模块拥有每一个单一类型节点的定义，包括节点包含哪些属性，什么是合法值，如何构建节点、遍历节点，以及节点的别名等信息。
单一节点类型的定义形式如下：

```javascript
defineType('BinaryExpression', {
  builder: ['operator', 'left', 'right'],
  fields: {
    operator: {
      validate: assertValueType('string'),
    },
    left: {
      validate: assertNodeType('Expression'),
    },
    right: {
      validate: assertNodeType('Expression'),
    },
  },
  visitor: ['left', 'right'],
  aliases: ['Binary', 'Expression'],
});
```

_Builders（构建器）_
你会注意到上面的 BinaryExpression 定义有一个 builder 字段。
builder: ["operator", "left", "right"]
这是由于每一个节点类型都有构造器方法 builder，按类似下面的方式使用：

```javascript
t.binaryExpression('*', t.identifier('a'), t.identifier('b'));
```

_Validators（验证器）_
BinaryExpression 的定义还包含了节点的字段 fields 信息，以及如何验证这些字段。
可以创建两种验证方法。第一种是 isX。

```javascript
t.isBinaryExpression(maybeBinaryExpressionNode);

// 这个测试用来确保节点是一个二进制表达式，另外你也可以传入第二个参数来确保节点包含特定的属性和值。
t.isBinaryExpression(maybeBinaryExpressionNode, { operator: '*' });

// 这些方法还有一种断言式的版本，会抛出异常而不是返回 true 或 false。.
t.assertBinaryExpression(maybeBinaryExpressionNode);
t.assertBinaryExpression(maybeBinaryExpressionNode, { operator: '*' });
// Error: Expected type "BinaryExpression" with option { "operator": "*" }
```

_Converters（变换器）_

###### babel-generator

Babel Generator 模块是 Babel 的代码生成器，它读取 AST 并将其转换为代码和源码映射（sourcemaps）。

###### babel-template

babel-template 是另一个虽然很小但却非常有用的模块。 它能让你编写字符串形式且带有占位符的代码来代替手动编码， 尤其是生成的大规模 AST 的时候。 在计算机科学中，这种能力被称为准引用（quasiquotes）。

_找到特定的父路径_
有时你需要从一个路径向上遍历语法树，直到满足相应的条件。

```javascript
// 对于每一个父路径调用callback并将其NodePath当作参数，当callback返回真值时，则将其NodePath返回。.
path.findParent((path) => path.isObjectExpression());

// 如果也需要遍历当前节点：
path.find((path) => path.isObjectExpression());

// 查找最接近的父函数或程序：
path.getFunctionParent();

// 向上遍历语法树，直到找到在列表中的父节点路径
path.getStatementParent();
```

_获取同级路径_
如果一个路径是在一个 Function／Program 中的列表里面，它就有同级节点。

- 使用 path.inList 来判断路径是否有同级节点，
- 使用 path.getSibling(index)来获得同级路径,
- 使用 path.key 获取路径所在容器的索引,
- 使用 path.container 获取路径的容器（包含所有同级节点的数组）
- 使用 path.listKey 获取容器的 key

_停止遍历_
如果你的插件需要在某种情况下不运行，最简单的做法是尽早写回。

```js
BinaryExpression(path) {
  if (path.node.operator !== '**') return;
}
```

如果您在顶级路径中进行子遍历，则可以使用 2 个提供的 API 方法：

- path.skip() 跳过遍历当前路径的子路径。
- path.stop() 完全停止遍历。

_处理_

```js
// 替换一个节点
BinaryExpression(path) {
  path.replaceWith(
    t.binaryExpression("**", path.node.left, t.numberLiteral(2))
  );
}

// 用多节点替换单节点
ReturnStatement(path) {
  path.replaceWithMultiple([
    t.expressionStatement(t.stringLiteral("Is this the real life?")),
    t.expressionStatement(t.stringLiteral("Is this just fantasy?")),
    t.expressionStatement(t.stringLiteral("(Enjoy singing the rest of the song in your head)")),
  ]);
}
// *当用多个节点替换一个表达式时，它们必须是   声明。 这是因为Babel在更换节点时广泛使用启发式算法，这意味着您可以做一些非常疯狂的转换，否则将会非常冗长*

// 用字符串源码替换节点
FunctionDeclaration(path) {
  path.replaceWithSourceString('function add(a, b) { return a + b; }');
}
// 不建议使用这个API，除非您正在处理动态的源码字符串，否则在访问者外部解析代码更有效率。

// 插入兄弟节点
FunctionDeclaration(path) {
  path.insertBefore(t.expressionStatement(t.stringLiteral("Because I'm easy come, easy go.")));
  path.insertAfter(t.expressionStatement(t.stringLiteral("A little high, little low.")));
}
// 这里同样应该使用声明或者一个声明数组。 这个使用了在用多个节点替换一个节点中提到的相同的启发式算法。

// 插入到容器（container）中
// 如果您想要在AST节点属性中插入一个像body.0那样的数组。 它与insertBefore/insertAfter 类似, 但您必须指定 listKey (通常是 正文).
ClassMethod(path) {
  path.get('body').unshiftContainer('body', t.expressionStatement(t.stringLiteral('before')));
  path.get('body').pushContainer('body', t.expressionStatement(t.stringLiteral('after')));
}

// 删除一个节点
FunctionDeclaration(path) {
  path.remove();
}

// 替换父节点
// 只需使用parentPath,调用 replaceWith即可
BinaryExpression(path) {
  path.parentPath.replaceWith(
    t.expressionStatement(t.stringLiteral("Anyway the wind blows, doesn't really matter to me, to me."))
  );
}

// 删除父节点
BinaryExpression(path) {
  path.parentPath.remove();
}
```

Scope（作用域）
```js
// 检查本地变量是否被绑定
FunctionDeclaration(path) {
  if (path.scope.hasBinding("n")) {
    // ...
  }
}
// 这将遍历范围树并检查特定的绑定。

// 您也可以检查一个作用域是否有自己的绑定：
FunctionDeclaration(path) {
  if (path.scope.hasOwnBinding("n")) {
    // ...
  }
}

// 创建一个 UID，这将生成一个标识符，不会与任何本地定义的变量相冲突。
FunctionDeclaration(path) {
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid" }
  path.scope.generateUidIdentifier("uid");
  // Node { type: "Identifier", name: "_uid2" }
}

// 提升变量声明至父级作用域，有时你可能想要推送一个VariableDeclaration，这样你就可以分配给它。
FunctionDeclaration(path) {
  const id = path.scope.generateUidIdentifierBasedOnNode(path.node.id);
  path.remove();
  path.scope.parent.push({ id, init: path.node });
}
// - function square(n) {
// + var _square = function square(n) {
//     return n * n;
// - }
// + };

// 重命名绑定及其引用
FunctionDeclaration(path) {
  path.scope.rename("n", "x");
}
```

插件选项
```js
// 如果您想让您的用户自定义您的Babel插件的行为您可以接受用户可以指定的插件特定选项，如下所示：
{
  plugins: [
    ["my-plugin", {
      "option1": true,
      "option2": false
    }]
  ]
}

// 这些选项会通过`状态对象传递给插件访问者
export default function({ types: t }) {
  return {
    visitor: {
      FunctionDeclaration(path, state) {
        console.log(state.opts);
        // { option1: true, option2: false }
      }
    }
  }
}
```

插件的准备和收尾工作
```js
// 插件可以具有在插件之前或之后运行的函数。它们可以用于设置或清理/分析目的。
export default function({ types: t }) {
  return {
    pre(state) {
      this.cache = new Map();
    },
    visitor: {
      StringLiteral(path) {
        this.cache.set(path.node.value, 1);
      }
    },
    post(state) {
      console.log(this.cache);
    }
  };
}
```

在插件中启用其他语法
```js
// 插件可以启用babel plugins，以便用户不需要安装/启用它们。 这可以防止解析错误，而不会继承语法插件。
export default function({ types: t }) {
  return {
    inherits: require("babel-plugin-syntax-jsx")
  };
}
```

抛出一个语法错误
```js
// 如果您想用babel-code-frame和一个消息抛出一个错误：
export default function({ types: t }) {
  return {
    visitor: {
      StringLiteral(path) {
        throw path.buildCodeFrameError("Error message here");
      }
    }
  };
}
```

构建节点
编写转换时，通常需要构建一些要插入的节点进入AST。 如前所述，您可以使用babel-types包中的builder方法。
构建器的方法名称就是您想要的节点类型的名称，除了第一个字母小写。 例如，如果您想建立一个 MemberExpression 您可以使用 t.memberExpression（...）
```js
// 请注意，有时在节点上可以定制的属性比``构建器</>数组包含的属性更多。 这是为了防止生成器有太多的参数。 在这些情况下，您需要手动设置属性。 
// Example
// because the builder doesn't contain `async` as a property
var node = t.classMethod(
  "constructor",
  t.identifier("constructor"),
  params,
  body
)
// set it manually after creation
node.async = true;
```

###### 最佳实践
*将一些公共或者特定的检查提取出来*
```js
function isAssignment(node) {
  return node && node.operator === opts.operator + "=";
}

function buildAssignment(left, right) {
  return t.assignmentExpression("=", left, right);
}
```

*尽量避免遍历抽象语法树（AST）*
- 及时合并访问者对象
```js
// 可以将以下访问器合并
path.traverse({
  Identifier(path) {
    // ...
  }
});

path.traverse({
  BinaryExpression(path) {
    // ...
  }
});
```
- 可以手动查找就不要遍历
```js
// 使用path.traverse查找特定类型的节点
const nestedVisitor = {
  Identifier(path) {
    // ...
  }
};
const MyVisitor = {
  FunctionDeclaration(path) {
    path.get('params').traverse(nestedVisitor);
  }
};

// 查找特定节点时，可以尝试使用手动处理的方式，无需执行代价高昂的traverse遍历
const MyVisitor = {
  FunctionDeclaration(path) {
    path.node.params.forEach(function() {
      // ...
    });
  }
};
```
- 优化嵌套的访问者对象
```js
const MyVisitor = {
  FunctionDeclaration(path) {
    path.traverse({
      Identifier(path) {
        // ...
      }
    });
  }
};
// 将上面的例子改成下面这样，原因：
// 每当调用FunctionDeclaration()时都会创建一个新的访问者对象。代价可能有点大，因为每次一个新的访问者对象传入babel，babel都会做一些处理。
// babel会将已经处理过的标志保存在访问者对象上，因此最好还是将访问者保存在一个变量里，每次传递相同的对象。
const nestedVisitor = {
  Identifier(path) {
    // ...
  }
};
const MyVisitor = {
  FunctionDeclaration(path) {
    path.traverse(nestedVisitor);
  }
};

// 在嵌套的访问者中需要一些状态
const MyVisitor = {
  FunctionDeclaration(path) {
    var exampleState = path.node.params[0].name;
    path.traverse({
      Identifier(path) {
        if (path.node.name === exampleState) {
          // ...
        }
      }
    });
  }
};
// 可以将它作为状态传递给traverse()方法，并有权在访问者中通过this拿到状态
const nestedVisitor = {
  Identifier(path) {
    if (path.node.name === this.exampleState) {
      // ...
    }
  }
};
const MyVisitor = {
  FunctionDeclaration(path) {
    var exampleState = path.node.params[0].name;
    path.traverse(nestedVisitor, { exampleState });
  }
};
```
*留意嵌套结构*

###### 单元测试
有几种主要的方法来测试babel插件：快照测试，AST测试和执行测试
可以使用插件：[babel-plugin-tester](https://github.com/babel-utils/babel-plugin-tester)
```js
import pluginTester from 'babel-plugin-tester';
import identifierReversePlugin from '../identifier-reverse-plugin';

pluginTester({
  plugin: identifierReversePlugin,
  fixtures: path.join(__dirname, '__fixtures__'),
  tests: {
    'does not change code with no identifiers': '"hello";',
    'changes this code': {
      code: 'var hello = "hi";',
      output: 'var olleh = "hi";',
    },
    'using fixtures files': {
      fixture: 'changed.js',
      outputFixture: 'changed-output.js',
    },
    'using jest snapshots': {
      code: `
        function sayHi(person) {
          return 'Hello ' + person + '!'
        }
      `,
      snapshot: true,
    },
  },
});
```

疑问点：
1、使用@babel/traverse 报错：TypeError: traverse is not a function
https://github.com/babel/babel/issues/13855
2、什么情况下需要同时使用 stopPropagation 和 preventDefault？
3、typescript 的 tsconfig 中 esModuleInterop 的到底做了什么？（https://blog.csdn.net/zdhsoft/article/details/123785137）
4、默认导出与具名导出
5、ESM 与 CJS 的 Interop 的来世今生（https://zhuanlan.zhihu.com/p/446113714）
6、启发式算法
