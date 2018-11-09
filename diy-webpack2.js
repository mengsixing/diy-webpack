var path = require('path');
var fs = require('fs');
var babely = require('@babel/parser');
var walker = require('@babel/traverse').default;
const babel = require('@babel/core');
var id = 0;

// 创建一个资源文件
function craeteAsset(filename) {
  var code = fs.readFileSync(filename, 'utf-8');
  var dependencies = [];
  var ast = babely.parse(code, {
    sourceType: 'module'
  });
  // 把依赖的文件写入进来
  walker(ast, {
    // 每当遍历到import语法的时候
    ImportDeclaration: ({ node }) => {
      // 把依赖的模块加入到数组中
      dependencies.push(node.source.value);
    }
  });

  const result = babel.transformFromAstSync(ast, null, {
    presets: ['@babel/preset-env']
  });

  var module = {
    id: id++,
    filename: filename,
    dependencies,
    code: result.code
  };
  return module;
}

// 深度遍历
function createGraph(entry) {
  var mainAsset = craeteAsset(entry);
  var queue = [mainAsset];

  for (let asset of queue) {
    var baseDirPath = path.dirname(asset.filename);
    asset.mapping = {};
    asset.dependencies.forEach(filename => {
      var realPath = path.join(baseDirPath, filename);
      var childAsset = craeteAsset(realPath);
      // 给子依赖项赋值
      asset.mapping[filename] = childAsset.id;
      queue.push(childAsset);
    });
  }
  return queue;
}

function bundle(graph) {
  var modules = `{`;
  // 拼接modules字符串
  graph.forEach((item, index) => {
    modules += `
      ${index}:{
        fn:function(require,module,exports){
          ${item.code}
        },
        mapping:${JSON.stringify(item.mapping)}
      },
    `;
  });

  modules += '}';

  var result = `
  (function(graph){
    var module = {exports:{}};
    function require(id){
      var {fn,mapping} = graph[id];
      function localRequire(name){
        // 处理依赖映射，把依赖的文件名，转换成对应的对象索引
        return require(mapping[name]);
      }
      // 运行asset代码
      fn(localRequire,module,module.exports);
      return module.exports;
    }
    // 运行入口文件
    return require(0);
  })(${modules})
  `;
  return result;
}

var graph = createGraph('./example/entry.js');

var result = bundle(graph);

console.log(result);
