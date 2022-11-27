import "../../db";
import AccountUrl from "../../models/AccountUrl";
import CrawlPostData from "../../models/CrawlUrlPost";
import PostDetail from "../../models/PostDetail";

export const dayDataController = async (req, res) => {
  try {
    // 배열을 2중 배열로 넘겨야 할 듯
    // 각 항목에 대한 기간별 데이터를 넘겨야 하기 때문
    // 이거 데이터 뿌려주기 위한 데이터 구조를 다시 한 번 보는게 좋을 듯..
    let { id, startDate, endDate } = req.query;
    console.log(id, startDate, endDate);
    const accounturl = await AccountUrl.findById(id);
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
    let semiResults = postUrls.map((post) => {
      let dateDiff = post.postDetails.map((detail) => {
        // ceil은 천장 - 무조건 올림을 의미함
        return Math.ceil((detail.createTime.getTime() - post.uploadTime.getTime())/(1000 * 60 * 60 * 24));
      });
      let postViews = post.postDetails.map((detail) => {
        return detail.views;
      });
      let postLikes = post.postDetails.map((detail) => {
        return detail.likes;
      });
      let postComments = post.postDetails.map((detail) => {
        return detail.comments;
      });
      return {
        dateDiff,
        title: post.title,
        img: post.img,
        url: post.postUrl,
        uploadTime: post.uploadTime,
        views: postViews,
        likes: postLikes,
        comments: postComments,
      };
    });
    async function getResultObject(arrItem) {
      let resultObject = {
        title: String,
        img: String,
        uploadTime: Date,
        url: String,
        dateDiff: [],
        views: [],
        likes: [],
        comments: [],
      };
      const list = [1, 2, 3, 4, 5, 6, 7];
      for (const i of list) {
        let index = arrItem.dateDiff.lastIndexOf(i);
        resultObject.title = arrItem.title;
        resultObject.img = arrItem.img;
        resultObject.uploadTime = arrItem.uploadTime;
        resultObject.url = accounturl.platform == "naver"? "https://post.naver.com/" + arrItem.url: "https:" + arrItem.url;
        if (index > -1) {
          resultObject.dateDiff[i - 1] = arrItem.dateDiff[index];
          resultObject.views[i - 1] = arrItem.views[index];
          resultObject.likes[i - 1] = arrItem.likes[index];
          resultObject.comments[i - 1] = arrItem.comments[index];
        } else {
          resultObject.dateDiff[i - 1] = null;
          resultObject.views[i - 1] = null;
          resultObject.likes[i - 1] = null;
          resultObject.comments[i - 1] = null;
        }
      }
      return resultObject;
    }
    const result = [];
    for (let i = 0; i < semiResults.length; i++) {
      let semiResult = semiResults[i];
      let data = await getResultObject(semiResult);
      result.push(data);
    }
    res.send(result);
  } catch (e) {
    console.log(e);
  }
};
