import request from "@/config/axios-init";

// 获取分页列表
export const page = (params) => {
  return request({
    url: "/web/sjls/sysColumnConfig/page",
    method: "post",
    data: params
  });
};

// 获取树形列表
export const showTree = (params) => {
  return request({
    url: "/web/sjls/sysColumnConfig/showTree",
    method: "post",
    data: params
  });
};

// 单个删除
export const singleDelete = (params) => {
  return request({
    url: "/web/sjls/sysColumnConfig/singleDelete",
    method: "post",
    params: params
  });
};

// 添加之前
export const addBefore = (params) => {
  return request({
    url: "/web/sjls/sysColumnConfig/addBefore",
    method: "post",
    params: params
  });
};

// 添加
export const add = (params) => {
  return request({
    url: "/web/sjls/sysColumnConfig/add",
    method: "post",
    data: params
  });
};

// 详情
export const detail = (params) => {
  return request({
    url: "/web/sjls/sysColumnConfig/detail",
    method: "post",
    params: params
  });
};

// 编辑之前
export const editBefore = (params) => {
  return request({
    url: "/web/sjls/sysColumnConfig/editBefore",
    method: "post",
    params: params
  });
};

// 编辑
export const edit = (params) => {
  return request({
    url: "/web/sjls/sysColumnConfig/edit",
    method: "post",
    data: params
  });
};

// 注销
export const logout = (params) => {
  return request({
    url: "/web/sjls/sysColumnConfig/logout",
    method: "post",
    data: params
  });
};

// 导出
export const exports = (params) => {
  return request({
    url: "/web/sjls/sysColumnConfig/exports",
    method: "post",
    data: params,
    responseType: "blob"
  });
};
