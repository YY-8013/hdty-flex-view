import request from '@/config/axios-init';


// 获取分页列表
export const page = params => {
  return request({
    url: '/backend/delRule/page',
    method: 'post',
    data: params
  });
};

// 单个删除
export const singleDelete = params => {
  return request({
    url: '/backend/delRule/singleDelete',
    method: 'post',
    params: params
  });
};

// 执行删除规则
export const execute = params => {
 return request({
   url: '/backend/delRule/execute',
   method: 'post',
   params: params
 });
};

// 添加
export const add = params => {
  return request({
    url: '/backend/delRule/add',
    method: 'post',
    data: params
  });
};

// 详情
export const detail = params => {
  return request({
    url: '/backend/delRule/detail',
    method: 'post',
    params: params
  });
};

// 编辑之前
export const editBefore = params => {
  return request({
    url: '/backend/delRule/editBefore',
    method: 'post',
    params: params
  });
};

// 编辑
export const edit = params => {
  return request({
    url: '/backend/delRule/edit',
    method: 'post',
    data: params
  });
};

// 导出
export const exports = params => {
  return request({
    url:'/backend/delRule/exports',
    method: 'post',
    data: params,
    responseType: 'blob'
  });
};

// 获取数据源
export const getDatasourceList = params => {
  return request({
    url: '/backend/delRule/getDatasourceList',
    method: 'post',
    data: params
  });
};

// 获取数据表
export const getTableNameList = params => {
  return request({
    url: '/backend/delRule/getTableNameList',
    method: 'post',
    data: params
  });
};

// 获取操作记录
export const getRecord = params => {
  return request({
    url: '/backend/delRecord/page',
    method: 'post',
    data: params
  });
};
