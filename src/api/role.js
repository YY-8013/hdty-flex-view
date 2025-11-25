import request from '@/config/axios-init';


// 获取角色列表
export const getPage = params => {
  return request({
    url: '/backend/role/getPage',
    method: 'post',
    data: params
  });
};

// 获取角色选择列表
export const getPageSelect = params => {
  return request({
    url: '/backend/role/getPageSelect',
    method: 'post',
    data: params
  });
};

// 获取共享机构角色列表
export const getUserAddRolePage = params => {
  return request({
    url: '/backend/role/getUserAddRolePage',
    method: 'post',
    data: params
  });
};

// 获取用户拥有角色列表
export const getUserRolePage = params => {
  return request({
    url: '/backend/role/getUserRolePage',
    method: 'post',
    data: params
  });
};

// 获取角色id对应的菜单Ids
export const getRoleMenuIds = params => {
  return request({
    url: '/backend/role/getRoleMenuIds',
    method: 'post',
    data: params
  });
};

// 添加角色
export const addRole = params => {
  return request({
    url: '/backend/role/addOne',
    method: 'post',
    data: params
  });
};

// 删除角色
export const deleteRole = params => {
  return request({
    url: '/backend/role/deleteOne',
    method: 'post',
    params: params
  });
};

// 角色编辑详情
export const getEditDetail = params => {
  return request({
    url: '/backend/role/getEditDetail',
    method: 'post',
    params: params
  });
};

// 角色编辑
export const editOne = params => {
  return request({
    url: '/backend/role/editOne',
    method: 'post',
    data: params
  });
};

// 角色详情
export const getDetail = params => {
  return request({
    url: '/backend/role/getDetail',
    method: 'post',
    params: params
  });
};

// 验证角色名的重复性
export const checkRoleName = params => {
  return request({
    url: '/backend/role/checkRoleName',
    method: 'post',
    data: params
  });
};
