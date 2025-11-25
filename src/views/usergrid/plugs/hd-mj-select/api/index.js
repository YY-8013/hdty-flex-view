import request from '@/config/axios-init';

// 企业列表
export const getPageSelect = params => {
  return request({
    url: '/backend/user/getZrqPage',
    method: 'post',
    data: params
  });
};
