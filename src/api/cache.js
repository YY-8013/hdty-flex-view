import request from '@/config/axios-init';


// 获取分页列表
export const page = params => {
  return request({
    url: '/backend/redis/page',
    method: 'post',
    data: params
  });
};

// 获取详情分页列表
export const detailPage = params => {
  return request({
    url: '/backend/redis/detailPage',
    method: 'post',
    data: params
  });
};

// 删除总数据
export const deleteOne = params => {
  return request({
    url: '/backend/redis/delOne',
    method: 'post',
    data: params
  });
};

// 清除缓冲
export const deleteCache = () => {
  return request({
    url: '/backend/redis/deleteCache',
    method: 'post'
  });
};
