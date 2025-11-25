import request from '@/config/axios-init';


export const getPage = params => {
  return request({
    url: '/backend/dictionaryType/getPage',
    method: 'post',
    data: params
  });
};

export const getDetail = params => {
  return request({
    url: '/backend/dictionaryType/getDetail',
    method: 'get',
    params: params
  });
};

export const addOne = params => {
  return request({
    url: '/backend/dictionaryType/addOne',
    method: 'post',
    data: params
  });
};

export const deleteOne = params => {
  return request({
    url: '/backend/dictionaryType/deleteOne',
    method: 'post',
    params: params
  });
};

export const editOne = params => {
  return request({
    url:  '/backend/dictionaryType/editOne',
    method: 'post',
    data: params
  });
};

export const getEditDetail = params => {
  return request({
    url:'/backend/dictionaryType/getEditDetail',
    method: 'get',
    params:params
  });
};

export const getNewNum = params => {
  return request({
    url:'/backend/dictionaryType/getNewNum',
    method: 'get'
  });
};

export const validateKey = params => {
  return request({
    url:'/backend/dictionaryType/validate',
    method: 'post',
    data:params
  });
};

export const exports = params => {
  return request({
    url:'/backend/dictionaryType/exports',
    method: 'post',
    data: params,
    responseType: 'blob'
  });
};

export const syncData = () => {
  return request({
    url:'/backend/dictionaryType/syncData',
    method: 'post'
  });
};

export const syncOne = params => {
  return request({
    url:'/backend/dictionaryType/syncOne',
    method: 'post',
    params: params,
  });
};
