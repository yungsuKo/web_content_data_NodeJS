// db연결 어떻게 하지
import "../db";
import BoonData from "../models/KaKao_1boon";
import PostData from "../models/Naver_post";

export const summaryController = (req, res) => {
  res.render("summary", {
    title: "Summary",
  });
};
export const kakaoController = (req, res) => {
  res.render("kakao", {
    title: "KaKao",
  });
};
export const naverController = async (req, res) => {
  const posts = await PostData.find({})
    .sort({ uploadTime: -1, crawledTime: -1 })
    .limit(10);
  console.log(posts);
  res.render("naver", {
    title: "Naver",
    posts,
  });
};
