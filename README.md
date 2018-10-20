# diy-webpack

手动写一个 webpack 解析器。

## craeteAsset

1、使用 node file 模块获取文件内容。

2、使用 babylon 将文件内容转换成 ast 抽象语法树。

3、使用 babel-traverse 对 ast 进行遍历，将入口文件的依赖保存起来。

4、使用 babel.transformFromAst 将 ast 转换成可执行的 js 代码。

5、返回经过处理后的一个模块，包含：模块 id，模块 filename，依赖项 dependencies，code 等信息。

## createGraph

1、传入入口文件路径，处理入口模块

2、新建一个数组，先加入入口模块，然后循环把入口模块所依赖的模块都加入到数组中。

3、生成包含所有模块的数组，并返回。

## bundle

1、传入生成的模块数组。

2、遍历数组，把执行的 code 加入到一个函数级作用域中，并增加一个子依赖的属性 mapping。

3、创建一个 require 方法，因为打包出来的代码是 commonjs 语法，这里为了解析 require 方法。

4、require 中循环加载所有依赖项，并执行。

5、返回处理结果。
