export const summaryController = (req, res) => {
  res.render("summary", {
    title: "Summary",
  });
};

export const naverController = (req, res) => {
  res.render("naver", {
    title: "Naver",
  });
};
export const kakaoController = (req, res) => {
  res.render("kakao", {
    title: "KaKao",
  });
};
