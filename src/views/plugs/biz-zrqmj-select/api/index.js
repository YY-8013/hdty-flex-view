import request from '../../../../config/axios-init';

// 分页获取责任区民警列表
export const getZrqmjPage = params => {
  return request({
    url: '/backend/user/getZrqPage',
    method: 'post',
    data: params
  });
};
