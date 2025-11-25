import request from '@/config/axios-init';

// 绘制辖区
export const levelFourGridMark = params => {
  return request({
    url: '/web/ybss/levelFourGrid/levelFourGridMark',
    method: 'post',
    data: params
  });
};

// 获取辖区
export const levelFourGridShow = params => {
  return request({
    url: '/web/ybss/levelFourGrid/levelFourGridShow',
    method: 'post',
    data: params
  });
};

// 清空辖区
export const levelFourGridDel = params => {
  return request({
    url: '/web/ybss/levelFourGrid/levelFourGridDelete',
    method: 'post',
    data: params
  });
};
