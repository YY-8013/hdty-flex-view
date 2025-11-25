import request from '@/config/axios-init';


// 获取分页列表
export const page = params => {
  return request({
    url: '/backend/subsystem/page',
    method: 'post',
    data: params
  });
};

// 单个删除
export const singleDelete = params => {
  return request({
    url: '/backend/subsystem/singleDelete',
    method: 'post',
    params: params
  });
};

// 添加
export const add = params => {
  return request({
    url: '/backend/subsystem/add',
    method: 'post',
    data: params
  });
};

// 详情
export const detail = params => {
  return request({
    url: '/backend/subsystem/detail',
    method: 'post',
    params: params
  });
};

// 编辑之前
export const editBefore = params => {
  return request({
    url: '/backend/subsystem/editBefore',
    method: 'post',
    params: params
  });
};

// 编辑
export const edit = params => {
  return request({
    url: '/backend/subsystem/edit',
    method: 'post',
    data: params
  });
};

// 导出
export const exports = params => {
  return request({
    url:'/backend/subsystem/exports',
    method: 'post',
    data: params,
    responseType: 'blob'
  });
};

// 获取列表
export const getControlPage = params => {
  return request({
    url: '/backend/subsystem/controlPage',
    method: 'post',
    data: params
  });
};
