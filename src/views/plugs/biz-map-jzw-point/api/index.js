import request from '@/config/axios-init';
import $utilStr from '@/utils/util-str';

// 逆地址解析
export const getLocation = (lbsURL, params, unique) => {
  return request({
    baseURL: lbsURL,
    url: '/analysis/reverseAddressAnalysis',
    method: 'post',
    requestId: unique ? $utilStr.uuid() : '',
    encrypt: false,
    data: params
  });
};
// 获取建筑物详情信息
export const getBzdzJzwxx = (params) => {
  return request({
    url: '/web/sq/bzdzJzwxx/detail',
    method: 'post',
    encrypt: false,
    params: params
  });
};


// 【地图相关接口】根据机构获取bbox
export const getBbox = params => {
  return request({
    url: 'web/ybss/bzdzMap/visibleRange',
    method: 'post',
    data: params
  });
};