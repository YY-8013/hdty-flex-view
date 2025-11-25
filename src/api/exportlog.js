import request from '@/config/axios-init';


// 获取分页列表
export const page = params => {
  return request({
    url: '/backend/exportLog/page',
    method: 'post',
    data: params
  });
};

