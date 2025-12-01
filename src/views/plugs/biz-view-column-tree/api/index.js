import request from "@/config/axios-init";

// 获取树形列表
export const showTree = (params) => {
  return request({
    url: "/web/sjls/sysColumnConfig/showTree",
    method: "post",
    data: params
  });
};
