import request from "@/config/axios-init";

// 获取分页列表
export const page = (params) => {
  return request({
    url: "/web/sjls/sysFormItemConfig/page",
    method: "post",
    data: params
  });
};

// 单个删除
export const singleDelete = (params) => {
  return request({
    url: "/web/sjls/sysFormItemConfig/singleDelete",
    method: "post",
    params: params
  });
};

// 添加之前
export const addBefore = (params) => {
  return request({
    url: "/web/sjls/sysFormItemConfig/addBefore",
    method: "post",
    params: params
  });
};

// 添加
export const add = (params) => {
  return request({
    url: "/web/sjls/sysFormItemConfig/add",
    method: "post",
    data: params
  });
};

// 详情
export const detail = (params) => {
  return request({
    url: "/web/sjls/sysFormItemConfig/detail",
    method: "post",
    params: params
  });
};

// 编辑之前
export const editBefore = (params) => {
  return request({
    url: "/web/sjls/sysFormItemConfig/editBefore",
    method: "post",
    params: params
  });
};

// 编辑
export const edit = (params) => {
  return request({
    url: "/web/sjls/sysFormItemConfig/edit",
    method: "post",
    data: params
  });
};

// 注销
export const logout = (params) => {
  return request({
    url: "/web/sjls/sysFormItemConfig/logout",
    method: "post",
    data: params
  });
};

// 更新状态(启用/停用)
export const updateStatus = (params) => {
  return request({
    url: "/web/sjls/sysFormItemConfig/updateStatus",
    method: "post",
    data: params
  });
};

// 导出
export const exports = (params) => {
  return request({
    url: "/web/sjls/sysFormItemConfig/exports",
    method: "post",
    data: params,
    responseType: "blob"
  });
};
