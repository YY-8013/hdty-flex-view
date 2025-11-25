import request from '@/config/axios-init';


export const getPage = params => {
  return request({
    url: '/backend/log/getPage',
    method: 'post',
    data: params
  });
};

export const getDetail = params => {
  return request({
    url: '/backend/log/getDetail',
    method: 'post',
    params: params
  });
};

export const getError = params => {
  return request({
    url: '/backend/log/getError',
    method: 'post',
    params: params
  });
};

export const deleteOne = params => {
  return request({
    url: '/backend/log/deleteOne',
    method: 'post',
    params: params
  });
};

export const exports = params => {
  return request({
    url:'/backend/log/exports',
    method: 'post',
    data: params,
    responseType: 'blob'
  });
};

