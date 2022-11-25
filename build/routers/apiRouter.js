"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _dayDataController = require("../controllers/api/dayDataController");

var _middlewares = require("../middlewares");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var apiRouter = _express["default"].Router();

apiRouter.route("/date").all(_middlewares.protectorMiddleware).get(_dayDataController.dayDataController);
var _default = apiRouter;
exports["default"] = _default;