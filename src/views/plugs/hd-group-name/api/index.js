import request from '../../../../config/axios-init';

// 获取群体名称最新编码
export const getNewNum = params => {
  return request({
    url: '/web/groupName/getNewNum',
    method: 'get',
    params: params
  });
};

// 列表
export const page = params => {
  return request({
    url: '/web/groupName/page',
    method: 'post',
    data: params
  });
};

// 详情
export const detail = params => {
  return request({
    url: '/web/groupName/detail',
    method: 'post',
    params: params
  });
};

// 新增
export const add = params => {
  return request({
    url: '/web/groupName/add',
    method: 'post',
    data: params
  });
};

// 编辑之前
export const editBefore = params => {
  return request({
    url: '/web/groupName/editBefore',
    method: 'post',
    params: params
  });
};

// 编辑
export const edit = params => {
  return request({
    url: '/web/groupName/edit',
    method: 'post',
    data: params
  });
};

// 单个删除
export const singleDelete = params => {
  return request({
    url: '/web/groupName/singleDelete',
    method: 'post',
    params: params
  });
};
