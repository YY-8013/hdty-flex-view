import request from '@/config/axios-init';


// 列表
export const page = params => {
  return request({
    url: '/backend/systemAccessAuth/page',
    method: 'post',
    data: params
  });
};

// 单个删除
export const singleDelete = params => {
  return request({
    url: '/backend/systemAccessAuth/singleDelete',
    method: 'post',
    params: params
  });
};

// 添加
export const add = params => {
  return request({
    url: '/backend/systemAccessAuth/add',
    method: 'post',
    data: params
  });
};

// 详情
export const detail = params => {
  return request({
    url: '/backend/systemAccessAuth/detail',
    method: 'post',
    params: params
  });
};

// 编辑之前
export const editBefore = params => {
  return request({
    url: '/backend/systemAccessAuth/editBefore',
    method: 'post',
    params: params
  });
};

// 编辑
export const edit = params => {
  return request({
    url: '/backend/systemAccessAuth/edit',
    method: 'post',
    data: params
  });
};

// 导出
export const exports = params => {
  return request({
    url:'/backend/systemAccessAuth/exports',
    method: 'post',
    data: params,
    responseType: 'blob'
  });
};
