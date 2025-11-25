import request from "@/config/axios-init";
import $utilStr from "@/utils/util-str";

// 获取表单分页列表
export const getFormPage = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formPage",
    method: "post",
    data: params
  });
};

export const addForm = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formAdd",
    method: "post",
    data: params
  });
};

export const editForm = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formEdit",
    method: "post",
    data: params
  });
};

export const formLogout = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formLogout",
    method: "post",
    data: params
  });
};

// 获取表单详情
export const getFormDetail = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formDetail",
    method: "post",
    params: params
  });
};
