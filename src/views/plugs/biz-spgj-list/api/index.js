import request from "@/config/axios-init";
import $utilStr from "@/utils/util-str";

// 人员新增
export const spgjPage = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/fk/fkSp/detail",
    method: "post",
    params: params
  });
};
