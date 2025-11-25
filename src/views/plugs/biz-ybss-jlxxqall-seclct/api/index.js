import request from '@/config/axios-init';

// 获取分页列表
export const listPage = params => {
  return request({
    url: '/web/ybss/bzdzJlxxqxx/page',
    method: 'post',
    data: params
  });
};
