import request from "@/config/axios-init";

// 单独添加附件
export const addFileOne = params => {
  return request({
    url: "/web/zdryDoc/add",
    method: "post",
    data: params
  });
};

// 获取业务配置项
export const getYwConfig = params => {
  return request({
    url: "/common/config/getYwDetail",
    method: "post",
    data: params
  });
};

// 大数据（智慧大脑、一键搜）
export const getBigDataSystemUrl = params => {
  return request({
    url: "/common/bigData/getBigDataSystemUrl",
    method: "post",
    data: params
  });
};

// 智慧社区标准地址
// export const getYbssBzdz = params => {
//   return request({
//     url: "/common/ybss/getBzdzByCardId",
//     method: "post",
//     data: params
//   });
// };

// 治安局户籍状态
export const getZajHjzt = params => {
  return request({
    url: "/common/personDetail/zajDetail",
    method: "post",
    data: params
  });
};

// 获取电子签章列表
export const getSignList = params => {
  return request({
    url: "/common/signSignature/getSignList",
    method: "post",
    data: params
  });
};

// 部级全息档案
export const gatQxdaUrl = params => {
  return request({
    url: "/web/zdryDetail/gatQxdaUrl",
    method: "post",
    data: params
  });
};
