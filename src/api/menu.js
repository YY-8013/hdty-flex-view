import request from '@/config/axios-init';
import $utilStr from '@/utils/util-str';


// 获取当前用户路由信息
export const getUserRouter = params => {
  return request({
    url: '/backend/menu/getUserRouter',
    method: 'post',
    data: params
  });
};

// 获取当前用户全部授权信息
export const getUserAuthority = params => {
  return request({
    url: '/backend/menu/getUserAuthority',
    method: 'post',
    data: params
  });
};

// 获取左侧菜单树
export const getLeftTree = params => {
  return request({
    url: '/backend/menu/getLeftTree',
    method: 'post',
    data: params
  });
};

// 获取子系统请求地址
export const subSystemUrl = data => {
  return request({
    requestId: $utilStr.uuid(),
    url: '/backend/menu/subSystemUrl',
    method: 'post',
    data: data
  });
};

// 获取默认内置按钮列表
export const getMenuDefaultBtnList = params => {
  return request({
    url: '/backend/menu/getMenuDefaultBtnList',
    method: 'post',
    data: params
  });
};

// 根据按钮名称获取菜单Ids
export const getMenuBtnKeyList = params => {
  return request({
    url: '/backend/menu/getMenuBtnKeyList',
    method: 'post',
    data: params
  });
};

// 获取菜单列表
export const getMenuList = params => {
  return request({
    url: '/backend/menu/getTree',
    method: 'post',
    data: params
  });
};

// 编辑菜单排序
export const editOrder = params => {
  return request({
    url: '/backend/menu/editOrder',
    method: 'post',
    data: params
  });
};

// 添加菜单之前
export const beforeAddMenu = params => {
  return request({
    url: '/backend/menu/beforeAddOne',
    method: 'post',
    data: params
  });
};

// 添加菜单
export const addMenu = params => {
  return request({
    url: '/backend/menu/addOne',
    method: 'post',
    data: params
  });
};

// 删除菜单
export const deleteMenu = params => {
  return request({
    url: '/backend/menu/deleteOne',
    method: 'post',
    params: params
  });
};

// 供角色选择菜单时的菜单树
export const getMenuSelectTree = params => {
  return request({
    url: '/backend/menu/getSelectTree',
    method: 'post',
    data: params
  });
};

// 获取菜单节点列表
export const getTree = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: '/backend/menu/getMenuList',
    method: 'post',
    data: params
  });
};

// 根据菜单id获取所有父级菜单id
export const getTreeReverseDisplay = params => {
  return request({
    url: '/backend/menu/getTreeReverseDisplay',
    method: 'post',
    data: params
  });
};

// 详情
export const getDetail = data => {
  return request({
    url: '/backend/menu/getDetail',
    method: 'post',
    params: data
  });
};

// 编辑时的详情
export const getEditDetail = data => {
  return request({
    url: '/backend/menu/getEditDetail',
    method: 'post',
    params: data
  });
};

// 编辑
export const editOne = data=> {
  return request({
    url: '/backend/menu/editOne',
    method: 'post',
    data: data
  });
};

// 编辑时补充按钮菜单
export const editOneSup = data=> {
  return request({
    url: '/backend/menu/editOneSup',
    method: 'post',
    params: data
  });
};

// 验证菜单代码不能重复
export const validateUrl = data=> {
  return request({
    url: '/backend/menu/validateUrl',
    method: 'post',
    data: data
  });
};

// app插件选择
export const pluggablePage = data => {
  return request({
    url: '/backend/pluggable/page',
    method: 'post',
    data: data
  });
};
