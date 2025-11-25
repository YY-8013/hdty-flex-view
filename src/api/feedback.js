import request from '@/config/axios-init';

// 获取分页列表
export const page = params => {
  return request({
    url: '/mobile/feedback/page',
    method: 'post',
    data: params
  });
};

// 详情
export const detail = params => {
  return request({
    url: '/mobile/feedback/detail',
    method: 'post',
    params: params
  });
};

// 编辑之前
export const dealBefore = params => {
  return request({
    url: '/mobile/feedback/dealBefore',
    method: 'post',
    params: params
  });
};

// 编辑
export const deal = params => {
  return request({
    url: '/mobile/feedback/deal',
    method: 'post',
    data: params
  });
};

