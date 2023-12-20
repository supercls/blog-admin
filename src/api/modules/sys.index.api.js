//文章归档
import {post} from "@/api/http";


export const getArticleGroup = (data) =>
  post("/mg/api/public/web/article/group", data);
//查询当日最新评论和留言
export const queryNowMsgAndComments = (data) =>
  post("/mg/api/public/admin/home/queryNowMsgAndComments", data);
