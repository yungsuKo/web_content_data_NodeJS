"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireWildcard(require("express"));

var _rootRouter = _interopRequireDefault(require("./routers/rootRouter"));

var _dataRouter = _interopRequireDefault(require("./routers/dataRouter"));

var _morgan = _interopRequireDefault(require("morgan"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _connectMongo = _interopRequireDefault(require("connect-mongo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var app = (0, _express["default"])();
var logger = (0, _morgan["default"])(":url");
app.use(_express["default"]["static"](__dirname + "/public")); // 미들웨어 등록

app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: false
})); // cookie, session assign middleware

app.use((0, _cookieParser["default"])()); // 세션 세팅

app.use((0, _expressSession["default"])({
  secret: "asdvxcvorem24rtwe0fo2k3013",
  resave: true,
  saveUninitialized: true,
  store: _connectMongo["default"].create({
    mongoUrl: process.env.MONGODB_KEY
  })
}));
app.use(logger);
console.log(process.env.MONGODB_KEY);
app.set("view engine", "ejs");
app.set("views", process.cwd() + "/src/views");
app.use("/", _rootRouter["default"]);
app.use("/data", _dataRouter["default"]);
app.use("/assets", _express["default"]["static"]("assets"));
var _default = app;
exports["default"] = _default;