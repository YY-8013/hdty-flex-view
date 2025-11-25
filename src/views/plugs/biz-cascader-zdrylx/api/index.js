import request from "@/config/axios-init";

// 获取关注人员类型
export const getZdryLxTree = (params) => {
  return request({
    url: "/common/config/getZdryLxTree",
    method: "post",
    data: params
  });
};
