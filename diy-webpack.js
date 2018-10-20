const fs = require("fs");
const path = require("path");
const babylon = require("babylon");
const traverse = require("babel-traverse").default;
const babel = require("babel-core");

let ID = 0;

// 读取内容并提取它的依赖关系
function craeteAsset(filename) {
  // 以字符串的形式读取文件
  const content = fs.readFileSync(filename, "utf-8");

  // 转换字符串为ast抽象语法树
  const ast = babylon.parse(content, {
    sourceType: "module"
  });

  const dependencies = [];

  // 遍历抽象语法树
  traverse(ast, {
    // 每当遍历到import语法的时候
    ImportDeclaration: ({ node }) => {
      // 把依赖的模块加入到数组中
      dependencies.push(node.source.value);
    }
  });

  const id = ID++;

  // 转换为浏览器可运行的代码
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["env"]
  });

  return {
    id,
    filename,
    dependencies,
    code
  };
}

// 从入口开始，分析所有依赖项，形成依赖图，采用深度优先遍历
function createGraph(entry) {
  const mainAsset = craeteAsset(entry);

  // 定义一个保存依赖项的数组
  const queue = [mainAsset];

  for (const asset of queue) {
    const dirname = path.dirname(asset.filename);

    // 定义一个保存子依赖项的属性
    asset.mapping = {};

    asset.dependencies.forEach(relativePath => {
      const absolutePath = path.join(dirname, relativePath);

      const child = craeteAsset(absolutePath);

      // 给子依赖项赋值
      asset.mapping[relativePath] = child.id;

      // 将子依赖也加入队列中，循环处理
      queue.push(child);
    });
  }
  return queue;
}

// 根据生成的依赖关系图，生成浏览器可执行文件
function bundle(graph) {
  let modules = "";

  graph.forEach(mod => {
    modules += `${mod.id}:[
      function (require, module, exports){
        ${mod.code}
      },
      ${JSON.stringify(mod.mapping)},
    ],`;
  });

  const result = `
    (function(modules){
      // 创建一个require()函数: 它接受一个 模块ID 并在我们之前构建的模块对象查找它.
      function require(id){
        const [fn, mapping] = modules[id];

        function localRequire(relativePath){
          // 根据mapping的路径，找到对应的模块id
          return require(mapping[relativePath]);
        }

        const module = {exports:{}};

        // 执行转换后的代码，并输出内容。
        fn(localRequire,module,module.exports);

        return module.exports;
      }

      // 执行入口文件
      require(0);

    })({${modules}})
  `;

  return result;
}

const graph = createGraph("./example/entry.js");

const result = bundle(graph);

console.log(result);
