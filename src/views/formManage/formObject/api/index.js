import request from "@/config/axios-init";
import $utilStr from "@/utils/util-str";

// 获取表单分页列表
export const formObjectPage = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formObjectPage",
    method: "post",
    data: params
  });
};

// 添加表单项
export const formObjectAdd = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formObjectAdd",
    method: "post",
    data: params
  });
};

// 编辑表单项
export const formObjectEdit = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formObjectEdit",
    method: "post",
    data: params
  });
};

// 获取表单项详情
export const formObjectDetail = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formObjectDetail",
    method: "post",
    params: params
  });
};

// 注销表单项
export const formObjectLogout = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formObjectLogout",
    method: "post",
    data: params
  });
};
