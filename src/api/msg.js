import request from '@/config/axios-init';
import $utilStr from '@/utils/util-str';


// 获取用户订阅消息主题
export const getMqttTopic = () => {
  return request({
    url: '/backend/mqttMsg/getMqttTopic',
    method: 'post'
  });
};

// 处理mqtt历史消息
export const handleHistoryMsg = () => {
  return request({
    url: '/backend/mqttMsg/handleHistoryMsg',
    method: 'post'
  });
};

// 处理mqtt实时消息
export const handleMsg = params => {
  return request({
    requestId: $utilStr.uuid(),
    url: '/backend/mqttMsg/handleMsg',
    method: 'post',
    data: params
  });
};

// 获取分页列表
export const page = params => {
  return request({
    url: '/backend/mqttMsg/page',
    method: 'post',
    data: params
  });
};

// 详情
export const detail = params => {
  return request({
    url: '/backend/mqttMsg/detail',
    method: 'post',
    params: params
  });
};

// 获取消息类别
export const getCategory = params => {
  return request({
    url: '/backend/mqttMsg/getMsgItems',
    method: 'post',
    data: params
  });
};

// 获取各项类别未读消息数量
export const getUnreadItemsCount = params => {
  return request({
    url: '/backend/mqttMsg/unreadItemsCount',
    method: 'post',
    data: params
  });
};

// 获取未读消息数量
export const getUnreadAllCount = () => {
  return request({
    url: '/backend/mqttMsg/unreadAllCount',
    method: 'post'
  });
};

// 获取我的消息
export const myCenter = params => {
  return request({
    url: '/backend/mqttMsg/myCenter',
    method: 'post',
    data: params
  });
};

// 单个已读
export const readOne = params => {
  return request({
    url: '/backend/mqttMsg/readOne',
    method: 'post',
    params: params
  });
};

// 多个已读
export const readArray = params => {
  return request({
    url: '/backend/mqttMsg/readArray',
    method: 'post',
    data: params
  });
};

// 单个清除
export const delOne = params => {
  return request({
    url: '/backend/mqttMsg/delOne',
    method: 'post',
    params: params
  });
};

// 清除已读
export const delReadMsg = params => {
  return request({
    url: '/backend/mqttMsg/delReadMsg',
    method: 'post',
    data: params
  });
};

// 全部清除
export const delAll = params => {
  return request({
    url: '/backend/mqttMsg/delAll',
    method: 'post',
    data: params
  });
};

// 获取消息处理路径
export const getMsgDealUrl = params => {
  return request({
    url: '/backend/mqttMsg/getMsgDealUrl',
    method: 'post',
    data: params
  });
};
