// db연결 어떻게 하지
import "../db";
import AccountUrl from "../models/AccountUrl";
import CrawlPostData from "../models/CrawlUrlPost";
import PostDetail from "../models/PostDetail";
import postDetail1 from "../crawlers/postDetailCrawler";
import postUrlCrawl1 from "../crawlers/postUrlCrawler";

export const getDataListController = async(req, res) => {
  try {
    const crawlUrl = req.body.crawlUrl;
    const dataList = await AccountUrl.find();
    console.log(req.body)
    res.render("list_data", {
      title: "List Data",
      dataList
    });
  } catch (e) {
    console.log(e);
  }
};

export const postDataListController = async (req, res) => {
    try {
        const {crawlUrl, accountName} = req.body;
        let dataList = await AccountUrl.find({})
        // crawlUrl에 대한 정합성 검증
        if(!crawlUrl.includes("https://post.naver.com/") && !crawlUrl.includes("https://v.daum.net/")){
            return res.render("list_data", {
                title: "List Data",
                errorMsg : "아직 지원하지 않는 url 입니다.",
                dataList
            });
        }
        // 네이버 url 인지
        const isnaver = await crawlUrl.includes("https://post.naver.com/")
        // 중복 여부
        const exist = await AccountUrl.exists({url : crawlUrl});
        if(exist){
            return res.render("list_data", {
                title: "List Data",
                errorMsg : "이미 저장하고 있는 계정입니다.",
                dataList
            });
        }

        let url = null;
        // 정합성&중복여부가 확인되면 저장
        // 네이버, 카카오 분류하여 저장 >> accountID를 받기 위함
        if(isnaver){
            url = await AccountUrl.insertMany({
                createTime : Date.now(),
                url : crawlUrl,
                accountId: crawlUrl.split("/")[3].split("=")[1],
                accountName,
                platform : "naver",
                owner : req.session.user._id
            })
        } else{
            url = await AccountUrl.insertMany({
                createTime : Date.now(),
                url : crawlUrl,
                accountId: crawlUrl.split("/")[4],
                accountName,
                platform : "kakao",
                owner : req.session.user._id
            })
        }
        console.log(url);
        // postUrlCrawl1 : 신규 계정이 최초 입력되었을 때, 크롤링해야하는 글 목록이 크롤링됨
        const urlList = await postUrlCrawl1(url)
        for(let i=0; i<urlList.length; i++){
            await postDetail1(urlList[i], url);
        }
        dataList = await AccountUrl.find({})
        return res.render("list_data", {
            title: "List Data",
            errorMsg : "",
            dataList
        });
    } catch (e) {
        console.log(e);
    }
};

export const dataDetailController = async (req, res) => {
    try {
        // 배열을 2중 배열로 넘겨야 할 듯
        // 각 항목에 대한 기간별 데이터를 넘겨야 하기 때문
        // 이거 데이터 뿌려주기 위한 데이터 구조를 다시 한 번 보는게 좋을 듯..
        const {id} = req.params;
        console.log(id);
        const accounturl = await AccountUrl.findById(id);
        if(id === "63704211cfa4b03494152789"){
            let postUrls = [
                {
                    postTitle : "aaa",
                    img: "https://img4.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202211/11/ohouse/20221111122015199gmrd.png",
                    uploadTime : "2022-10-11",
                    index : [0,1,2,3,4,5,6],
                    views : [0,1,2,3,4,5,6],
                    likes : [0,1,2,3,4,5,6]
                },
                {
                    postTitle : "bbb",
                    img: "https://img4.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202211/11/ohouse/20221111122015199gmrd.png",
                    uploadTime : "2022-10-10",
                    index : [0,1,2,3,4,5,6],
                    views : [0,1,2,3,4,5,6],
                    likes : [0,1,2,3,4,5,6]
                },
                {
                    postTitle : "ccc",
                    img: "https://img4.daumcdn.net/thumb/R658x0.q70/?fname=https://t1.daumcdn.net/news/202211/11/ohouse/20221111122015199gmrd.png",
                    uploadTime : "2022-10-09",
                    index : [0,1,2,3,4,5,6],
                    views : [0,1,2,3,4,5,6],
                    likes : [0,1,2,3,4,5,6]
                }
            ]
            return res.render("detail_data", {
                title: "detail",
                postUrls,
                details : []
            });
        }
        postUrls = await CrawlPostData.find({url:accounturl.url}).sort({uploadTime:-1}).lean();
        console.log(postUrls);
        const details = [];
        for(let i=0; i<postUrls.length; i++){
            let detail = await PostDetail.find({postUrl:postUrls[i]._id});
            details.push(detail);
        }
        console.log(details);
        res.render("detail_data", {
            title: "detail",
            postUrls,
            details
        });
    } catch (e) {
        console.log(e);
    }
};
