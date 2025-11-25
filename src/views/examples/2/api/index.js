import request from '@/config/axios-init';

// 获取分页列表
export const page = params => {
  return request({
    url: '/my/example/page',
    method: 'post',
    data: params
  });
};

// 添加之前
export const addBefore = params => {
  return request({
    url: '/my/example/addBefore',
    method: 'post',
    params: params
  });
};

// 添加
export const add = params => {
  return request({
    url: '/my/example/add',
    method: 'post',
    data: params
  });
};

// 详情
export const detail = params => {
  return request({
    url: '/my/example/detail',
    method: 'post',
    params: params
  });
};

// 编辑之前
export const editBefore = params => {
  return request({
    url: '/my/example/editBefore',
    method: 'post',
    params: params
  });
};

// 编辑
export const edit = params => {
  return request({
    url: '/my/example/edit',
    method: 'post',
    data: params
  });
};

// 注销
export const off = params => {
  return request({
    url: '/my/example/off',
    method: 'post',
    data: params
  });
};

// 上传
export const upload = params => {
  return request({
    url:'/my/example/upload',
    method: 'post',
    data: params
  });
};

// 下载
export const download = params => {
  return request({
    responseType: 'blob',
    url:'/my/example/download',
    method: 'post',
    data: params
  });
};
