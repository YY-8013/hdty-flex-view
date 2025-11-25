import request from "@/config/axios-init";

// 获取分页列表
export const listPage = params => {
  return request({
    url: "/web/ybss/bzdzcxzj/jlxxqxx",
    method: "post",
    data: params
  });
};
