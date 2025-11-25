import request from "@/config/axios-init";

// 通过身份证号判断该关注人员是否存在并返回关注人员信息
export const getPersonExistAndInfo = (params) => {
  return request({
    url: "/web/person/cardIdBefore",
    method: "post",
    params: params
  });
};
