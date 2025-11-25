import request from '@/config/axios-init';
import $utilStr from '@/utils/util-str';

// 责任区民警列表
export const getPageSelect = params => {
  return request({
    url: '/backend/user/getZrqPage',
    method: 'post',
    data: params
  });
};

// 判断实有人口是否已存在
export const personDetailIsHave = params => {
  return request({
    url: '/web/ybss/person/personDetailIsHave',
    method: 'post',
    data: params
  });
};

// 任务移交
export const taskYj = params => {
  return request({
    url: '/web/rwTask/taskYj',
    method: 'post',
    data: params
  });
};

// 任务移交2.0
export const taskYjNew = params => {
  return request({
    url: '/web/rwNtask/userTransfer',
    method: 'post',
    data: params
  });
};

// 获取分页列表
export const syfwpage = params => {
  return request({
    url: '/web/ybss/houseInfo/page',
    method: 'post',
    data: params
  });
};

// 获取分页列表
export const sydwPage = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: '/web/ybss/company/page',
    method: 'post',
    data: params
  });
};

// 判断从业人员任务是否办理
export const employeesDetailIsHave = params => {
  return request({
    url: '/web/signFor/cyrl/queueCheck',
    method: 'post',
    data: params
  });
};
