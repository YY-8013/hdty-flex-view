import request from "@/config/axios-init";
// 获取智慧大脑、大数据一键搜地址
export const getBigDataSystemUrl = params => {
  return request({
    url: "/common/bigData/getBigDataSystemUrl",
    method: "post",
    data: params
  });
};
