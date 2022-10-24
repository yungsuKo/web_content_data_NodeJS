// db연결 어떻게 하지
import "../db";
import PostData from "../models/Naver_post";
import CrawlData from "../models/AccountUrl";
import postUrlCrawl1 from "../crawlers/postUrlCrawler"

export const getDataListController = async(req, res) => {
  try {
    const crawlUrl = req.body.crawlUrl;
    const dataList = await CrawlData.find();
    console.log(req.body)
    res.render("list_data", {
      title: "List Data",
      errorMsg : "",
      dataList:[]
    });
  } catch (e) {
    console.log(e);
  }
};

export const postDataListController = async (req, res) => {
    try {
        const crawlUrl = req.body.crawlUrl;
        // crawlUrl에 대한 정합성 검증
        if(!crawlUrl.includes("https://post.naver.com/") && !crawlUrl.includes("https://content.v.daum.net/")){
            return res.render("list_data", {
                title: "List Data",
                errorMsg : "아직 지원하지 않는 url 입니다.",
                dataList:[]
            });
        }
        // 네이버 url 인지
        const isnaver = crawlUrl.includes("https://post.naver.com/")
        // 중복 여부
        const exist = await CrawlData.exists({url : crawlUrl});
        if(exist){
            return res.render("list_data", {
                title: "List Data",
                errorMsg : "이미 저장하고 있는 계정입니다.",
                dataList:[]
            });
        }

        // 정합성&중복여부가 확인되면 저장
        // 네이버, 카카오 분류하여 저장 >> accountID를 받기 위함
        if(isnaver){
            const url = await CrawlData.insertMany({
                createTime : Date.now(),
                url : crawlUrl,
                accountId: crawlUrl.split("/")[3].split("=")[1],
                platform : "naver",
                owner : req.session.user._id
            })
        } else{
            const url = await CrawlData.insertMany({
                createTime : Date.now(),
                url : crawlUrl,
                accountId: crawlUrl.split("/")[3],
                platform : "kakao",
                owner : req.session.user._id
            })
        }
        console.log(url);
        await postUrlCrawl1(url)
        // postUrlCrawl1

        return res.render("list_data", {
            title: "List Data",
            errorMsg : "",
            dataList : []
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
