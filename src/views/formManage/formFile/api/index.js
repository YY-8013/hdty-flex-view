import request from "@/config/axios-init";
import $utilStr from "@/utils/util-str";

// 获取附件分页列表
export const formFilePage = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formFilePage",
    method: "post",
    data: params
  });
};

// 添加附件
export const formFileUpload = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formFileUpload",
    method: "post",
    data: params
  });
};

// 注销附件
export const formFileLogout = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formFileLogout",
    method: "post",
    data: params
  });
};
