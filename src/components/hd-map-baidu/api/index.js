import request from '@/config/axios-init';
import $utilStr from '@/utils/util-str';


// 地址解析
export const getPoint = (lbsURL, params, unique) => {
  return request({
    baseURL: lbsURL,
    url: '/analysis/adressAnalysis',
    method: 'post',
    requestId: unique ? $utilStr.uuid() : '',
    redefineHeaders: true,
    signature: false,
    encrypt: false,
    data: params
  });
};

// 逆地址解析
export const getLocation = (lbsURL, params, unique) => {
  return request({
    baseURL: lbsURL,
    url: '/analysis/reverseAddressAnalysis',
    method: 'post',
    requestId: unique ? $utilStr.uuid() : '',
    redefineHeaders: true,
    signature: false,
    encrypt: false,
    data: params
  });
};

// poi搜索
export const localSearch = (lbsURL, params, unique) => {
  return request({
    baseURL: lbsURL,
    url: '/analysis/searchPoi',
    method: 'post',
    requestId: unique ? $utilStr.uuid() : '',
    redefineHeaders: true,
    signature: false,
    encrypt: false,
    data: params
  });
};

// 路径规划
export const routePlan = (lbsURL, params, unique) => {
  return request({
    baseURL: lbsURL,
    url: '/routePlan/queryRoutePlan',
    method: 'post',
    requestId: unique ? $utilStr.uuid() : '',
    redefineHeaders: true,
    signature: false,
    encrypt: false,
    data: params
  });
};

// 获取行政区边界
export const getBoundary = () => {
  return request({
    baseURL: window.location.origin,
    url: process.env.NODE_PATH + '/static/data/bmap/boundary.json',
    method: 'get',
    redefineHeaders: true,
    signature: false,
    encrypt: false
  });
};
