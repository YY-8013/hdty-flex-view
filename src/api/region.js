import request from '@/config/axios-init';
import $utilStr from '@/utils/util-str';


export const getRegionList = params => {
  return request({
    url: '/backend/region/getPage',
    method: 'post',
    data: params
  });
};

export const getTree = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: '/backend/region/getTree',
    method: 'post',
    data: params
  });
};

export const getTreeReverseDisplay = params => {
  return request({
    url: '/backend/region/getTreeReverseDisplay',
    method: 'post',
    data: params
  });
};

export const getRegionDetail = params => {
  return request({
    url: '/backend/region/getDetail',
    method: 'post',
    params: params
  });
};

export const addRegion = params => {
  return request({
    url: '/backend/region/addOne',
    method: 'post',
    data: params
  });
};

export const deleteRegion = params => {
  return request({
    url: '/backend/region/deleteOne',
    method: 'post',
    params: params
  });
};

export const editOne = params => {
  return request({
    url: '/backend/region/editOne',
    method: 'post',
    data: params
  });
};

export const getEditDetail = params => {
  return request({
    url: '/backend/region/getEditDetail',
    method: 'post',
    params: params
  });
};

export const exports = params => {
  return request({
    url:'/backend/region/exports',
    method: 'post',
    data: params,
    responseType: 'blob'
  });
};

export const validateExistId = params => {
  return request({
    url:'/backend/region/validateId',
    method: 'post',
    data: params
  });
};

export const syncData = () => {
  return request({
    url:'/backend/region/syncData',
    method: 'post'
  });
};
