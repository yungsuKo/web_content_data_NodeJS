"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _userController = require("../controllers/userController");

var _middlewares = require("../middlewares");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var rootRouter = _express["default"].Router();

rootRouter.route("/").all(_middlewares.publicMiddleware).get(_userController.getLogin).post(_userController.postLogin);
rootRouter.route("/signup").all(_middlewares.publicMiddleware).get(_userController.getSignup).post(_userController.postSignup);
rootRouter.route("/logout").get(_userController.logout);
var _default = rootRouter;
exports["default"] = _default;