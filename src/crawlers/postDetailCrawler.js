require("../db");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const CrawlPostData = require("../models/CrawlUrlPost")

// 게시글 url에서 수집해야하는 데이터
function timestamp() {
    var today = new Date();
    today.setHours(today.getHours() + 9);
    return today.toISOString();
}

function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
}