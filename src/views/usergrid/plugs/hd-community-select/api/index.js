import request from '@/config/axios-init';

// 企业列表
export const getPageSelect = params => {
  return request({
    url: '/web/ybss/community/page',
    method: 'post',
    data: params
  });
};
