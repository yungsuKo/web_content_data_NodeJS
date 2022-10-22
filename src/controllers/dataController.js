// db연결 어떻게 하지
import "../db";
import BoonData from "../models/KaKao_1boon";
import PostData from "../models/Naver_post";

export const getDataListController = (req, res) => {
  try {
    const crawlUrl = req.body.crawlUrl;
    console.log(req.body)
    res.render("list_data", {
      title: "List Data",
    });
  } catch (e) {
    console.log(e);
  }
};
export const postDataListController = (req, res) => {
  try {
    const crawlUrl = req.body.crawlUrl;
    console.log(crawlUrl)
    res.render("list_data", {
      title: "List Data",
    });
  } catch (e) {
    console.log(e);
  }
};

export const dataDetailController = async (req, res) => {
  try {
    // 배열을 2중 배열로 넘겨야 할 듯
    // 각 항목에 대한 기간별 데이터를 넘겨야 하기 때문
    const posts = await PostData.find({})
      .sort({ uploadTime: -1, crawledTime: -1 })
      .limit(10);
    console.log(posts);
    res.render("detail_data", {
      title: "detail",
      posts,
    });
  } catch (e) {
    console.log(e);
  }
};
