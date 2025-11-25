import request from "../../../../config/axios-init";

// 分页获取责任区民警列表
export const getZdryZrqPage = params => {
  return request({
    url: "/backend/user/getZdryZrqPage",
    method: "post",
    data: params
  });
};
