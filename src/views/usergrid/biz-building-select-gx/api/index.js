import request from '@/config/axios-init';

// 获取分页列表
export const Page = params => {
  return request({
    url: '/web/ybss/bzdzJzwxx/jzwPage',
    method: 'post',
    data: params
  });
};
