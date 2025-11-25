import request from "@/config/axios-init";
import $utilStr from "@/utils/util-str";

// 反恐大屏-工作台-任务统计（我的任务；本机构任务）
export const msgPage = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/dp/fk/gzt/msgPage",
    method: "post",
    data: params
  });
};

// 反恐大屏-工作台-任务统计（我的任务；本机构任务）
export const taskTotal = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/dp/fk/gzt/taskTotal",
    method: "post",
    data: params
  });
};

// 反恐大屏-工作台-关注人员流动 分页查询
export const gzryLdgjPage = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/dp/fk/gzt/gzryLdgjPage",
    method: "post",
    data: params
  });
};

// 反恐大屏-工作台-到期处理数据 分页查询
export const expirePage = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/dp/fk/gzt/expirePage",
    method: "post",
    data: params
  });
};

// 反恐大屏-工作台-常用功能柜 - 分页获取使用频次最高的菜单列表
export const menuUserUseList = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/backend/menuUserUse/list",
    method: "post",
    data: params
  });
};

// 反恐大屏-工作台-常用功能柜 - 分页获取用户自定义常用菜单列表
export const getCommonMenu = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/backend/commonMenu/list",
    method: "post",
    data: params
  });
};

// 反恐大屏-工作台-常用功能柜 - 批量添加用户自定义常用菜单（全量更新，包括顺序）
export const commonMenuListAdd = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/backend/commonMenu/listAdd",
    method: "post",
    data: params
  });
};

// 反恐大屏-工作台-常用功能柜 - 获取菜单节点列表（树级）
export const getMenuList = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/backend/menu/getMenuList",
    method: "post",
    data: params
  });
};

// 工作台 - 待办事项
export const taskList = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/dp/fk/gzt/taskList",
    method: "post",
    data: params
  });
};

// 驾驶舱 - 关注人员大屏 - 频繁流动人员
export const gzryListPfldry = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/dp/fk/jsc/gzryListPfldry",
    method: "post",
    data: params
  });
};

// 关注人员流动分布
export const gzryLdgjTotal = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/dp/fk/gzt/gzryLdgjTotal",
    method: "post",
    data: params
  });
};
