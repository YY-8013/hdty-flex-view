import request from '@/config/axios-init';

// 获取分页列表
export const deployPage = params => {
  return request({
    url: '/backend/zdryConfig/page',
    method: 'post',
    data: params
  });
};

// 添加与编辑
export const add = params => {
  return request({
    url: '/backend/zdryConfig/add',
    method: 'post',
    data: params
  });
};

// 详情
export const detail = params => {
  return request({
    url: '/backend/zdryConfig/detail',
    method: 'post',
    params: params
  });
};

// 详情
export const singleDelete = params => {
  return request({
    url: '/backend/zdryConfig/delete',
    method: 'post',
    params: params
  });
};
