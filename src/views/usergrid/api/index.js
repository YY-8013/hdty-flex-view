import request from '@/config/axios-init';

// 获取分页列表
export const page = params => {
  return request({
    url: '/backend/userGrid/page',
    method: 'post',
    data: params
  });
};

// 单个删除
export const singleDelete = params => {
  return request({
    url: '/backend/userGrid/singleDelete',
    method: 'post',
    params: params
  });
};

// 添加
export const add = params => {
  return request({
    url: '/backend/userGrid/add',
    method: 'post',
    data: params
  });
};

// 详情
export const detail = params => {
  return request({
    url: '/backend/userGrid/detail',
    method: 'post',
    params: params
  });
};

// 编辑之前
export const editBefore = params => {
  return request({
    url: '/backend/userGrid/editBefore',
    method: 'post',
    params: params
  });
};

// 编辑
export const edit = params => {
  return request({
    url: '/backend/userGrid/edit',
    method: 'post',
    data: params
  });
};

// 导出
export const exports = params => {
  return request({
    url:'/backend/userGrid/exports',
    method: 'post',
    data: params,
    responseType: 'blob'
  });
};

// 验证用户名重复
export const checkUsername = params => {
  return request({
    url: '/backend/userGrid/checkUsername',
    method: 'post',
    data: params
  });
};

// 验证身份证号重复
export const checkIdCard = params => {
  return request({
    url: '/backend/userGrid/checkIdCard',
    method: 'post',
    data: params
  });
};

// 重置密码
export const resetPassword = params => {
  return request({
    url: '/backend/userGrid/resetPassword',
    method: 'post',
    data: params
  });
};

// 修改用户启用状态
export const changeUserEnable = params => {
  return request({
    url: '/backend/userGrid/changeEnable',
    method: 'post',
    data: params
  });
};
