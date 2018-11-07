var path = require('path');
var fs = require('fs');
var babely = require('@babel/parser');
var walker = require('@babel/traverse').default;
const babel = require('@babel/core');

var modules = [];

// 创建一个资源文件
function craeteAsset(filename) {
  var code = fs.readFileSync(filename, 'utf-8');
  var dependencies = [];
  var ast = babely.parse(code, {
    sourceType: 'module'
  });
  //   把依赖的文件写入进来
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
    filename: filename,
    dependencies,
    code: result.code
  };
  return module;
}

// 深度遍历
function createGraph(entry) {
  var mainAsset = craeteAsset(entry);
  modules.push(mainAsset);
//   console.log(mainAsset.filename);
  // 获取入口文件的文件件名称
  var baseDirPath = path.dirname(mainAsset.filename);
  mainAsset.dependencies.forEach(filename => {
    var realPath = path.join(baseDirPath, filename);
    console.log(realPath);
    createGraph(realPath);
  });
}

function bundle(graph) {
    console.log(graph);
  function require(moduleId) {
    var module =  {
      i: moduleId,
      l: false,
      exports: {}
    };
    // Execute the module function
    modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    );

    return module.exports;
  }
  var text;
  graph.forEach(item=>{
    text+=item.code();
  });
  return text;
}

createGraph('./example/entry.js');

// console.log(modules);
