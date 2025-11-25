import request from '@/config/axios-init';

// 示例
export const example = params => {
  return request({
    url: '/my/example',
    method: 'post',
    data: params
  });
};
