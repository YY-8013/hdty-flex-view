import request from '@/config/axios-init';
import $utilStr from '@/utils/util-str';


export const getOrganList = params => {
  return request({
    url: '/backend/org/getPage',
    method: 'post',
    data: params
  });
};

export const getTree = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: '/backend/org/getTree',
    method: 'post',
    data: params
  });
};

export const getTreeReverseDisplay = params => {
  return request({
    url: '/backend/org/getTreeReverseDisplay',
    method: 'post',
    data: params
  });
};

export const getOrganDetail = params => {
  return request({
    url: '/backend/org/getDetail',
    method: 'post',
    params: params
  });
};

export const addOrgan = params => {
  return request({
    url: '/backend/org/addOne',
    method: 'post',
    data: params
  });
};

export const deleteOrgan = params => {
  return request({
    url: '/backend/org/deleteOne',
    method: 'post',
    params: params
  });
};

export const editOne = params => {
  return request({
    url: '/backend/org/editOne',
    method: 'post',
    data: params
  });
};

export const getEditDetail = params => {
  return request({
    url: '/backend/org/getEditDetail',
    method: 'post',
    params: params
  });
};

export const exports = params => {
  return request({
    url:'/backend/org/exports',
    method: 'post',
    data: params,
    responseType: 'blob'
  });
};

export const validateExistId = params => {
  return request({
    url:'/backend/org/validateId',
    method: 'post',
    data: params
  });
};

export const syncData = () => {
  return request({
    url:'/backend/org/syncData',
    method: 'post'
  });
};
