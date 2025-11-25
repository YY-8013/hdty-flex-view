import request from '@/config/axios-init';

// 获取街路巷小区列表
export const jlxPage = params => {
  return request({
    url: '/web/ybss/bzdzcxzj/jlxxqxx',
    method: 'post',
    data: params
  });
};

// 获取建筑平面示意图数据
export const dyfwList = params => {
  return request({
    url: '/web/ybss/bzdzcxzj/dyfw',
    method: 'post',
    data: params
  });
};

// 已有建筑物列表
export const jzwPage = params => {
  return request({
    url: '/web/ybss/bzdzcxzj/jzwxx',
    method: 'post',
    data: params
  });
};

// 空挂户
// export const getEmptyAddress = params => {
//   return request({
//     url: '/web/ybss/bzdzJzwxx/EmptyAccount',
//     method: 'post',
//     params: params
//   });
// };
