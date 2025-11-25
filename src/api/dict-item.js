import request from '@/config/axios-init';
import $utilStr from '@/utils/util-str';


export const getPage = params => {
  return request({
    url: '/backend/dictionary/getPage',
    method: 'post',
    data: params
  });
};

export const addOne = params => {
  return request({
    url: '/backend/dictionary/addOne',
    method: 'post',
    data: params
  });
};

export const getList = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: '/backend/dictionary/getList',
    method: 'post',
    data: params
  });
};

export const getDetail = params => {
  return request({
    url: '/backend/dictionary/getDetail',
    method: 'get',
    params: params
  });
};

export const getEditDetail = params => {
  return request({
    url:'/backend/dictionary/getEditDetail',
    method: 'get',
    params:params
  });
};

export const editOne = params => {
  return request({
    url:  '/backend/dictionary/editOne',
    method: 'post',
    data: params
  });
};

export const deleteOne = params => {
  return request({
    url: '/backend/dictionary/deleteOne',
    method: 'post',
    params: params
  });
};

export const checkKey = params => {
  return request({
    url:  '/backend/dictionary/checkKey',
    method: 'post',
    data: params
  });
};

export const exports = params => {
  return request({
    url:'/backend/dictionary/exports',
    method: 'post',
    data: params,
    responseType: 'blob'
  });
};

export const getTree = params => {
  return request({
    url:  '/backend/dictionary/getTree',
    method: 'post',
    data: params
  });
};
