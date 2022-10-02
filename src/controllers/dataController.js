// db연결 어떻게 하지
import "../db";
import BoonData from "../models/KaKao_1boon";
import PostData from "../models/Naver_post";

export const summaryController = (req, res) => {
  try {
    res.render("summary", {
      title: "Summary",
    });
  } catch (e) {
    console.log(e);
  }
};
export const kakaoController = (req, res) => {
  try {
    res.render("kakao", {
      title: "KaKao",
    });
  } catch (e) {
    console.log(e);
  }
};
export const naverController = async (req, res) => {
  try {
    const posts = await PostData.find({})
      .sort({ uploadTime: -1, crawledTime: -1 })
      .limit(10);
    console.log(posts);
    res.render("naver", {
      title: "Naver",
      posts,
    });
  } catch (e) {
    console.log(e);
  }
};
