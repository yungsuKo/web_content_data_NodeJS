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
        if(!crawlUrl.includes("https://post.naver.com/") && !crawlUrl.includes("https://content.v.daum.net/")){
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
            await postDetail1(urlList[i], url[0]);
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
        const startDate = new Date(new Date().setDate(new Date().getDate()-3));
        const endDate = new Date();
        let postUrls = [];
        const distinctPosts = await CrawlPostData.distinct("title",
            {
                $and : [
                    { url: accounturl.url},
                    { uploadTime: { $gte: startDate } },
                    { uploadTime: { $lte: endDate } }
                ]
            }
        );
        for(let i = 0; i<distinctPosts.length; i++){
            let x = await CrawlPostData.find({title:distinctPosts[i]})
                .sort({createTime: 1})
                .limit(1)
                .populate('postDetails');
            postUrls.push(x[0]);
        }
        console.log(postUrls);
        let semiResults = postUrls.map(post => {
            let dateDiff = post.postDetails.map(detail => {
                // ceil은 천장 - 무조건 올림을 의미함 
                return Math.ceil((detail.createTime.getTime() - post.uploadTime.getTime())/(1000 * 60 * 60 * 24));
            });
            let postViews = post.postDetails.map(detail => {
                return detail.views
            });
            let postLikes = post.postDetails.map(detail => {
                return detail.likes
            });
            let postComments = post.postDetails.map(detail => {
                return detail.comments
            });
            return {
                dateDiff,
                title: post.title,
                img : post.img,
                url : post.postUrl,
                uploadTime: post.uploadTime,
                views: postViews,
                likes : postLikes,
                comments : postComments
            }
        });
        async function getResultObject(arrItem){
            let resultObject = {
                title: String,
                img : String,
                uploadTime: Date,
                url : String,
                dateDiff:[],
                views:[],
                likes:[],
                comments:[]
            };
            const list = [1,2,3,4,5,6,7];
            for(const i of list){
                let index = arrItem.dateDiff.lastIndexOf(i);
                resultObject.title = arrItem.title;
                resultObject.img = arrItem.img;
                resultObject.uploadTime = arrItem.uploadTime;
                resultObject.url = accounturl.platform=="naver"?"https://post.naver.com/"+arrItem.url:"https:"+arrItem.url;
                if(index > -1){
                    resultObject.dateDiff[i-1] = arrItem.dateDiff[index];
                    resultObject.views[i-1] = arrItem.views[index];
                    resultObject.likes[i-1] = arrItem.likes[index];
                    resultObject.comments[i-1] = arrItem.comments[index];
                }else{
                    resultObject.dateDiff[i-1] = null;
                    resultObject.views[i-1] =  null;
                    resultObject.likes[i-1] = null;
                    resultObject.comments[i-1] = null;
                }
            }
            return resultObject;
        };
        const result = [];
        for(let i = 0;i < semiResults.length;i++){
            let semiResult = semiResults[i];
            let data = await getResultObject(semiResult);
            result.push(data);
        }
        res.render("detail_data", {
            title: "detail",
            result
        });
        
    } catch (e) {
        console.log(e);
    }
};
