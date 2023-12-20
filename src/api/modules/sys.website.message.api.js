
import {post} from "@/api/http";

export const dirWebsiteMessageList = (data) =>
  post("/mg/api/private/websiteMessage/list", data);

export const dirWebsiteMessageDelete = (id) =>
  post("/mg/api/private/websiteMessage/delete", {id});


export const dirWebsiteMessageCreate = (data) =>
  post("/mg/api/private/websiteMessage/create", data);

export const dirWebsiteMessageUpdate = (data) =>
  post("/mg/api/private/websiteMessage/update", data);
