"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return exports; }; var exports = {}, Op = Object.prototype, hasOwn = Op.hasOwnProperty, $Symbol = "function" == typeof Symbol ? Symbol : {}, iteratorSymbol = $Symbol.iterator || "@@iterator", asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator", toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag"; function define(obj, key, value) { return Object.defineProperty(obj, key, { value: value, enumerable: !0, configurable: !0, writable: !0 }), obj[key]; } try { define({}, ""); } catch (err) { define = function define(obj, key, value) { return obj[key] = value; }; } function wrap(innerFn, outerFn, self, tryLocsList) { var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator, generator = Object.create(protoGenerator.prototype), context = new Context(tryLocsList || []); return generator._invoke = function (innerFn, self, context) { var state = "suspendedStart"; return function (method, arg) { if ("executing" === state) throw new Error("Generator is already running"); if ("completed" === state) { if ("throw" === method) throw arg; return doneResult(); } for (context.method = method, context.arg = arg;;) { var delegate = context.delegate; if (delegate) { var delegateResult = maybeInvokeDelegate(delegate, context); if (delegateResult) { if (delegateResult === ContinueSentinel) continue; return delegateResult; } } if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) { if ("suspendedStart" === state) throw state = "completed", context.arg; context.dispatchException(context.arg); } else "return" === context.method && context.abrupt("return", context.arg); state = "executing"; var record = tryCatch(innerFn, self, context); if ("normal" === record.type) { if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue; return { value: record.arg, done: context.done }; } "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg); } }; }(innerFn, self, context), generator; } function tryCatch(fn, obj, arg) { try { return { type: "normal", arg: fn.call(obj, arg) }; } catch (err) { return { type: "throw", arg: err }; } } exports.wrap = wrap; var ContinueSentinel = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var IteratorPrototype = {}; define(IteratorPrototype, iteratorSymbol, function () { return this; }); var getProto = Object.getPrototypeOf, NativeIteratorPrototype = getProto && getProto(getProto(values([]))); NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype); var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype); function defineIteratorMethods(prototype) { ["next", "throw", "return"].forEach(function (method) { define(prototype, method, function (arg) { return this._invoke(method, arg); }); }); } function AsyncIterator(generator, PromiseImpl) { function invoke(method, arg, resolve, reject) { var record = tryCatch(generator[method], generator, arg); if ("throw" !== record.type) { var result = record.arg, value = result.value; return value && "object" == _typeof(value) && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) { invoke("next", value, resolve, reject); }, function (err) { invoke("throw", err, resolve, reject); }) : PromiseImpl.resolve(value).then(function (unwrapped) { result.value = unwrapped, resolve(result); }, function (error) { return invoke("throw", error, resolve, reject); }); } reject(record.arg); } var previousPromise; this._invoke = function (method, arg) { function callInvokeWithMethodAndArg() { return new PromiseImpl(function (resolve, reject) { invoke(method, arg, resolve, reject); }); } return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); }; } function maybeInvokeDelegate(delegate, context) { var method = delegate.iterator[context.method]; if (undefined === method) { if (context.delegate = null, "throw" === context.method) { if (delegate.iterator["return"] && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel; context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method"); } return ContinueSentinel; } var record = tryCatch(method, delegate.iterator, context.arg); if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel; var info = record.arg; return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel); } function pushTryEntry(locs) { var entry = { tryLoc: locs[0] }; 1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry); } function resetTryEntry(entry) { var record = entry.completion || {}; record.type = "normal", delete record.arg, entry.completion = record; } function Context(tryLocsList) { this.tryEntries = [{ tryLoc: "root" }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0); } function values(iterable) { if (iterable) { var iteratorMethod = iterable[iteratorSymbol]; if (iteratorMethod) return iteratorMethod.call(iterable); if ("function" == typeof iterable.next) return iterable; if (!isNaN(iterable.length)) { var i = -1, next = function next() { for (; ++i < iterable.length;) { if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next; } return next.value = undefined, next.done = !0, next; }; return next.next = next; } } return { next: doneResult }; } function doneResult() { return { value: undefined, done: !0 }; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) { var ctor = "function" == typeof genFun && genFun.constructor; return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name)); }, exports.mark = function (genFun) { return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun; }, exports.awrap = function (arg) { return { __await: arg }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () { return this; }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) { void 0 === PromiseImpl && (PromiseImpl = Promise); var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl); return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) { return result.done ? result.value : iter.next(); }); }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () { return this; }), define(Gp, "toString", function () { return "[object Generator]"; }), exports.keys = function (object) { var keys = []; for (var key in object) { keys.push(key); } return keys.reverse(), function next() { for (; keys.length;) { var key = keys.pop(); if (key in object) return next.value = key, next.done = !1, next; } return next.done = !0, next; }; }, exports.values = values, Context.prototype = { constructor: Context, reset: function reset(skipTempReset) { if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) { "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined); } }, stop: function stop() { this.done = !0; var rootRecord = this.tryEntries[0].completion; if ("throw" === rootRecord.type) throw rootRecord.arg; return this.rval; }, dispatchException: function dispatchException(exception) { if (this.done) throw exception; var context = this; function handle(loc, caught) { return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught; } for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i], record = entry.completion; if ("root" === entry.tryLoc) return handle("end"); if (entry.tryLoc <= this.prev) { var hasCatch = hasOwn.call(entry, "catchLoc"), hasFinally = hasOwn.call(entry, "finallyLoc"); if (hasCatch && hasFinally) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } else if (hasCatch) { if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0); } else { if (!hasFinally) throw new Error("try statement without catch or finally"); if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc); } } } }, abrupt: function abrupt(type, arg) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) { var finallyEntry = entry; break; } } finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null); var record = finallyEntry ? finallyEntry.completion : {}; return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record); }, complete: function complete(record, afterLoc) { if ("throw" === record.type) throw record.arg; return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel; }, finish: function finish(finallyLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel; } }, "catch": function _catch(tryLoc) { for (var i = this.tryEntries.length - 1; i >= 0; --i) { var entry = this.tryEntries[i]; if (entry.tryLoc === tryLoc) { var record = entry.completion; if ("throw" === record.type) { var thrown = record.arg; resetTryEntry(entry); } return thrown; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(iterable, resultName, nextLoc) { return this.delegate = { iterator: values(iterable), resultName: resultName, nextLoc: nextLoc }, "next" === this.method && (this.arg = undefined), ContinueSentinel; } }, exports; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

require("dotenv/config");

require('../db');

var axios = require("axios");

var cheerio = require("cheerio");

var puppeteer = require("puppeteer");

var AccountUrl = require("../models/AccountUrl");

var CrawlUrlPost = require("../models/CrawlUrlPost");

var PostDetail = require("../models/PostDetail");

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

function timestamp() {
  var today = new Date();
  today.setHours(today.getHours() + 9);
  return today.toISOString();
} // ?????? url??? ???????????? ???, DB??? ???????????? ?????? ????????? url??? ????????? ??????????????? ?????????


module.exports = /*#__PURE__*/function () {
  var _schedulePostCrawler = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(argsurl) {
    var browser, page, content, $, crawlUrlList, $postLists, list, i, exist, _$postLists, urlList, elem, newPostUrl, postExist, _list, _i, _content, _$, elements, raw_uploadTime, fixed_uploadTime, uploadTime, views, raw_views;

    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return puppeteer.launch({
              headless: true,
              args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

          case 2:
            browser = _context.sent;
            _context.prev = 3;
            _context.next = 6;
            return browser.newPage();

          case 6:
            page = _context.sent;
            _context.next = 9;
            return page.setViewport({
              width: 1366,
              height: 768
            });

          case 9:
            _context.next = 11;
            return page["goto"](argsurl.url);

          case 11:
            console.log(argsurl.url);
            _context.next = 14;
            return delay(1000);

          case 14:
            _context.next = 16;
            return page.content();

          case 16:
            content = _context.sent;
            $ = cheerio.load(content);

            if (!(argsurl.platform == "naver")) {
              _context.next = 43;
              break;
            }

            $postLists = $("div.inner_feed_box");
            list = [];
            $postLists.each(function (i, elem) {
              var raw_uploadTime = $(this).find("time.date_post").text().replace("\n", "").trim();
              var uploadTime = "";

              if (raw_uploadTime.includes("??????")) {
                var timeOver = Number(raw_uploadTime.replace("?????? ???", ""));
                var timeNow = new Date(timestamp());
                uploadTime = timeNow.setHours(timeNow.getHours() - timeOver);
              } else {
                uploadTime = new Date(raw_uploadTime);
                uploadTime.setHours(uploadTime.getHours() + 9);
                uploadTime.toISOString();
              }

              list[i] = new CrawlUrlPost({
                createTime: timestamp(),
                uploadTime: uploadTime,
                postUrl: $(this).find("a.link_end").attr("href"),
                img: $(this).find("a.link_end img").attr("src"),
                url: argsurl.url,
                title: $(this).find("strong.tit_feed").text().replace("\n", "")
              });
            });
            console.log(list); // list ?????? ?????? url??? for ????????? ??? ?????? ??????

            i = 0;

          case 24:
            if (!(i < list.length)) {
              _context.next = 32;
              break;
            }

            _context.next = 27;
            return CrawlUrlPost.exists({
              postUrl: list[i].postUrl
            });

          case 27:
            exist = _context.sent;

            if (exist) {
              list.splice(i, 1);
            }

          case 29:
            i++;
            _context.next = 24;
            break;

          case 32:
            _context.prev = 32;
            _context.next = 35;
            return CrawlUrlPost.insertMany(list);

          case 35:
            crawlUrlList = _context.sent;
            _context.next = 41;
            break;

          case 38:
            _context.prev = 38;
            _context.t0 = _context["catch"](32);
            console.log(_context.t0);

          case 41:
            _context.next = 90;
            break;

          case 43:
            _$postLists = $("a.link_column"); // ????????? ????????? ??????????????? ?????? ???????????? url??? ????????? ???????????? ?????????.

            urlList = [];
            _context.t1 = _regeneratorRuntime().keys(_$postLists);

          case 46:
            if ((_context.t2 = _context.t1()).done) {
              _context.next = 57;
              break;
            }

            elem = _context.t2.value;

            if (_$postLists[elem].attribs) {
              _context.next = 50;
              break;
            }

            return _context.abrupt("break", 57);

          case 50:
            newPostUrl = _$postLists[elem].attribs.href;
            _context.next = 53;
            return CrawlUrlPost.exists({
              postUrl: newPostUrl
            });

          case 53:
            postExist = _context.sent;

            if (!postExist) {
              urlList.push(newPostUrl);
            }

            _context.next = 46;
            break;

          case 57:
            _list = [];

            if (!(urlList.length > 0)) {
              _context.next = 81;
              break;
            }

            _i = 0;

          case 60:
            if (!(_i < urlList.length)) {
              _context.next = 81;
              break;
            }

            _context.next = 63;
            return page["goto"]("https:".concat(urlList[_i]));

          case 63:
            _context.next = 65;
            return page.content();

          case 65:
            _content = _context.sent;
            _$ = cheerio.load(_content);
            elements = _$(".box_line");
            _context.next = 70;
            return delay(300);

          case 70:
            // ????????? ?????? - uploadTime
            raw_uploadTime = elements.find(".info_view .txt_info .num_date").text().replace(elements.find("#article_head_view_count").text(), "");
            fixed_uploadTime = new Date(raw_uploadTime);
            fixed_uploadTime.setHours(fixed_uploadTime.getHours() + 9);
            uploadTime = fixed_uploadTime.toISOString(); // ????????? ?????? - views

            views = null;
            raw_views = elements.find("#article_head_view_count").text();

            if (raw_views.includes("???")) {
              // raw_views?????? "???" ????????? ?????? -> ????????? ?????? ????????? ?????? -> ????????? 10,000
              views = Number(raw_views.replace("???", "")) * 10000;
            } else {
              // raw_views??? ????????? ????????? ????????? ??????
              views = Number(raw_views.replace(",", ""));
            }

            _list[_i] = new CrawlUrlPost({
              createTime: timestamp(),
              uploadTime: uploadTime,
              img: elements.find("img.thumb_g_article").attr("src"),
              postUrl: urlList[_i],
              url: argsurl.url,
              title: elements.find(".tit_view").text().replace("\n", "")
            });

          case 78:
            _i++;
            _context.next = 60;
            break;

          case 81:
            _context.prev = 81;
            _context.next = 84;
            return CrawlUrlPost.insertMany(_list);

          case 84:
            crawlUrlList = _context.sent;
            _context.next = 90;
            break;

          case 87:
            _context.prev = 87;
            _context.t3 = _context["catch"](81);
            console.log(_context.t3);

          case 90:
            return _context.abrupt("return", "success!!");

          case 93:
            _context.prev = 93;
            _context.t4 = _context["catch"](3);
            console.log(_context.t4);

          case 96:
            _context.prev = 96;
            _context.next = 99;
            return browser.close();

          case 99:
            return _context.finish(96);

          case 100:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 93, 96, 100], [32, 38], [81, 87]]);
  }));

  function schedulePostCrawler(_x) {
    return _schedulePostCrawler.apply(this, arguments);
  }

  return schedulePostCrawler;
}();