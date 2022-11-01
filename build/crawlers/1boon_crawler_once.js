require("../db");
const axios = require("axios");
const cheerio = require("cheerio");
const puppeteer = require("puppeteer");
const BoonData = require("../models/KaKao_1boon");

// 출처: https://hbesthee.tistory.com/1737 [채윤이네집:티스토리]

module.exports = async function crawler_kakao1Boon() {
  function delay(time) {
    return new Promise(function (resolve) {
      setTimeout(resolve, time);
    });
  }
  function timestamp() {
    var today = new Date();
    today.setHours(today.getHours() + 9);
    return today.toISOString();
  }
  // 브라우저를 실행한다.
  // 옵션으로 headless모드를 끌 수 있다.
  const browser = await puppeteer.launch({
    headless: false
  });

  try {
    // 새로운 페이지를 연다.
    const page = await browser.newPage();
    // 페이지의 크기를 설정한다.
    await page.setViewport({
      width: 1366,
      height: 768
    });
    // "https://www.goodchoice.kr/product/search/2" URL에 접속한다. (여기어때 호텔 페이지)
    await page.goto("https://content.v.daum.net/2124/contents");
    console.log("waiting for loading");
    await delay(500);
    console.log("loading end");

    // 페이지의 HTML을 가져온다.
    const contents = await page.content();
    const $ = cheerio.load(contents);
    const $postLists = $("a.link_column");
    let urlList = [];
    $postLists.each(function (i, elem) {
      urlList[i] = $(this).attr("href");
    });

    let list = [];
    for (let i = 0; i < 20; i++) {
      await page.goto(`https:${urlList[i]}`);
      console.log(`https:${urlList[i]}`);

      const content = await page.content();
      const $ = cheerio.load(content);
      const elements = $(".box_line");

      await delay(1000);

      // 데이터 가공 - uploadTime
      const raw_uploadTime = await elements.find(".info_view .txt_info .num_date").text().replace(elements.find("#article_head_view_count").text(), "");
      const fixed_uploadTime = await new Date(raw_uploadTime);
      fixed_uploadTime.setHours(fixed_uploadTime.getHours() + 9);
      const uploadTime = fixed_uploadTime.toISOString();

      // 데이터 가공 - views
      let views = null;
      const raw_views = elements.find("#article_head_view_count").text();
      if (raw_views.includes("만")) {
        // raw_views에서 "만" 문자열 제외 -> 데이터 타입 숫자로 변경 -> 곱하기 10,000
        views = Number(raw_views.replace("만", "")) * 10000;
      } else {
        // raw_views의 데이터 타입을 숫자로 변경
        views = Number(raw_views.replace(",", ""));
      }

      list[i] = new BoonData({
        crawledTime: timestamp(),
        uploadTime,
        // 위에서 가공한 데이터를 끌어다씀
        link: urlList[i],
        img: elements.find("img.thumb_g_article").attr("src"),
        views,
        // 위에서 가공한 데이터를 끌어다씀
        likes: elements.find("button[data-action-type='LIKE'] span.🎬_count_label").text(),
        series: "undefined",
        title: elements.find(".tit_view").text().replace("\n", "")
      });
      console.log(list[i]);
    }

    try {
      await BoonData.insertMany(list);
    } catch (e) {
      console.log(e);
    }
    // const lists = $("#lst_feed > #inner_feed_box");
    return console.log("crawling finished!");
  } catch (error) {
    console.log(error);
  } finally {
    await browser.close();
  }
};