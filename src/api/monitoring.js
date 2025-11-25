import request from '@/config/axios-init';

// 获取列表
export const getDruidStatList = params => {
  return request({
    url: '/backend/monitoring/getDruidStatList',
    method: 'post',
    data: params
  });
};

// 获取数据
export const getDruidStat = params => {
  return request({
    url: '/backend/monitoring/getDruidStat',
    method: 'post',
    data: params
  });
};
