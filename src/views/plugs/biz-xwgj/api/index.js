import request from "@/config/axios-init";

// 新建流动申请
export const add = (params) => {
  return request({
    url: "/web/fk/fkGzryLdgj/add",
    method: "post",
    data: params
  });
};

// 流动详情
export const detail = (params) => {
  return request({
    url: "/web/fk/fkGzryLdgj/detail",
    method: "post",
    params: params
  });
};

// 流动轨迹
export const page = (params) => {
  return request({
    url: "/web/fk/fkGzryLdgj/page",
    method: "post",
    data: params
  });
};
