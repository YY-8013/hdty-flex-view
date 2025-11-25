import request from "@/config/axios-init";

// 获取分页列表
export const page = (params) => {
  return request({
    url: "/web/fk/fkSpConfig/page",
    method: "post",
    data: params
  });
};

// 单个删除
export const singleDelete = (params) => {
  return request({
    url: "/web/fk/fkSpConfig/singleDelete",
    method: "post",
    params: params
  });
};

// 添加之前
export const addBefore = (params) => {
  return request({
    url: "/web/fk/fkSpConfig/addBefore",
    method: "post",
    params: params
  });
};

// 添加
export const add = (params) => {
  return request({
    url: "/web/fk/fkSpConfig/add",
    method: "post",
    data: params
  });
};

// 详情
export const detail = (params) => {
  return request({
    url: "/web/fk/fkSpConfig/detail",
    method: "post",
    params: params
  });
};

// 编辑之前
export const editBefore = (params) => {
  return request({
    url: "/web/fk/fkSpConfig/editBefore",
    method: "post",
    params: params
  });
};

// 编辑
export const edit = (params) => {
  return request({
    url: "/web/fk/fkSpConfig/edit",
    method: "post",
    data: params
  });
};

// 注销
export const logout = (params) => {
  return request({
    url: "/web/fk/fkSpConfig/logout",
    method: "post",
    data: params
  });
};

// 导出
export const exports = (params) => {
  return request({
    url: "/web/fk/fkSpConfig/exports",
    method: "post",
    data: params,
    responseType: "blob"
  });
};
