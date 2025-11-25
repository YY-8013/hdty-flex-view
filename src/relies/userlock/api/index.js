import request from '@/config/axios-init';

// 获取分页列表
export const page = params => {
  return request({
    url: '/backend/userLock/page',
    method: 'post',
    data: params
  });
};

// 单个删除
export const singleDelete = params => {
  return request({
    url: '/backend/userLock/singleDelete',
    method: 'post',
    params: params
  });
};

// 详情
export const detail = params => {
  return request({
    url: '/backend/userLock/detail',
    method: 'post',
    params: params
  });
};

