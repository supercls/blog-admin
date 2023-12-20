import {get, post} from "@/api/http";

export const dirFilesList = (data) =>
  post("/mg/api/private/files/list", data);


export const dirFilesDelete = (data) =>
  post("/mg/api/private/files/delete", data);


export const dirFilesCreate = (data) =>
  post("/mg/api/private/files/create", data);

export const dirFilesUpdate = (data) =>
  post("/mg/api/private/files/update", data);

export const dirFilesFindOne = (id) =>
  get(`/mg/api/private/files/findOne?id=${id}`,);



