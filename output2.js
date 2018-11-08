1111111: .
1111111: .
[ { filename: 'example/entry.js',
    dependencies: [ 'message.js' ],
    code:
     'function(require,module,module.exports){\n    "use strict";\n\nvar _message = _interopRequireDefault(require("./message.js"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log(_message.default);\n  }' },
  { filename: 'example/message.js',
    dependencies: [ 'name.js' ],
    code:
     'function(require,module,module.exports){\n    "use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.default = void 0;\n\nvar _name = require("./name.js");\n\nvar _default = "hello ".concat(_name.nickname, "!");\n\nexports.default = _default;\n  }' },
  { filename: 'example/name.js',
    dependencies: [],
    code:
     'function(require,module,module.exports){\n    "use strict";\n\nObject.defineProperty(exports, "__esModule", {\n  value: true\n});\nexports.nickname = void 0;\nvar nickname = \'ben\';\nexports.nickname = nickname;\n  }' } ]
