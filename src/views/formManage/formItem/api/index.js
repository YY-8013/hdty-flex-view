import request from "@/config/axios-init";
import $utilStr from "@/utils/util-str";

// 获取表单分页列表
export const getFormItemPage = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formItemPage",
    method: "post",
    data: params
  });
};

// 添加表单项
export const addFormItem = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formItemAdd",
    method: "post",
    data: params
  });
};

// 编辑表单项
export const editFormItem = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formItemEdit",
    method: "post",
    data: params
  });
};

// 获取表单项详情
export const getFormItemDetail = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formItemDetail",
    method: "post",
    params: params
  });
};

// 注销表单项
export const formItemLogout = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formItemLogout",
    method: "post",
    data: params
  });
};
