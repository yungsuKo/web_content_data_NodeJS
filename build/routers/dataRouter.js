"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _dataController = require("../controllers/dataController");

var _middlewares = require("../middlewares");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var dataRouter = _express["default"].Router();

dataRouter.route("/").all(_middlewares.protectorMiddleware).get(_dataController.getDataListController).post(_dataController.postDataListController);
dataRouter.route("/detail/:id([0-9a-f]{24})").all(_middlewares.protectorMiddleware).get(_dataController.dataDetailController);
var _default = dataRouter;
exports["default"] = _default;