"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.publicMiddleware = exports.protectorMiddleware = void 0;

var protectorMiddleware = function protectorMiddleware(req, res, next) {
  if (!req.session.loggedIn) {
    res.redirect("/");
  } else {
    next();
  }
};

exports.protectorMiddleware = protectorMiddleware;

var publicMiddleware = function publicMiddleware(req, res, next) {
  if (req.session.loggedIn) {
    res.redirect("/data");
  } else {
    next();
  }
};

exports.publicMiddleware = publicMiddleware;