import request from "@/config/axios-init";
import $utilStr from "@/utils/util-str";

// 接口示例
export const example = (params) => {
  return request({
    url: "/my/example",
    method: "post",
    data: params
  });
};

export const page = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formPage",
    method: "post",
    data: params
  });
};
