# diy-webpack

[![Greenkeeper badge](https://badges.greenkeeper.io/yhlben/diy-webpack.svg)](https://greenkeeper.io/)

手写一个 webpack 解析器。

## Get Startd

```js
git clone https://github.com/yhlben/diy-webpack.git

npm run build
```

在生成的 output.js 中查看效果。

## 整体流程分析

1、读取入口文件。

2、将内容转换成 ast 语法树。

3、深度遍历语法树，找到所有的依赖，并加入到一个数组中。

4、将 ast 代码转换回可执行的 js 代码。

5、编写 require 函数，根据入口文件，自动执行完所有的依赖。

## craeteAsset

1、使用 nodejs 中的 file 模块获取文件内容。

2、使用 @babel/parser 将文件内容转换成 ast 抽象语法树。

3、使用 @babel/traverse 对 ast 进行遍历，将入口文件的依赖保存起来。

4、使用 babel.transformFromAstSync 将 ast 转换成可执行的 js 代码。

5、返回一个模块，包含：模块 id，filename，dependencies，code 字段。

## createGraph

1、接收入口文件路径，处理入口模块，调用 craeteAsset 生成处理好的模块。

2、新建一个数组，深度遍历入口文件以及入口文件的依赖文件，并将 craeteAsset 生成后的文件加入数组中。

3、返回数组。

## bundle

1、传入 createGraph 生成的数组。

2、遍历数组，把执行的 code 加入到一个函数级作用域中，并增加一个子依赖的属性 mapping。

3、编写一个 require 方法（因为打包出来的代码是 commonjs 语法，这里为了解析 require 方法）。

4、require 中循环加载所有依赖项，并执行。

5、返回处理结果。

## 参考仓库

[minipack](https://github.com/ronami/minipack)

[视频链接](https://www.youtube.com/watch?v=Gc9-7PBqOC8)
