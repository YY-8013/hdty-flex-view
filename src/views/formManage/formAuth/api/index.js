import request from "@/config/axios-init";
import $utilStr from "@/utils/util-str";

// 获取附件分页列表
export const formAuthPage = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formAuthPage",
    method: "post",
    data: params
  });
};

// 添加附件
export const formAuthAdd = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formAuthAdd",
    method: "post",
    data: params
  });
};

// 注销附件
export const formAuthEdit = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formAuthEdit",
    method: "post",
    data: params
  });
};

export const formAuthDelete = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formAuthDelete",
    method: "post",
    params: params
  });
};
