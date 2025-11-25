import request from '@/config/axios-init';


// 二代证信息解密
export const getDecode = params => {
  return request({
    url: '/bridge/secondidcard/getDecode',
    method: 'post',
    data: params
  });
};

// 人证核验
export const compareFaceWeb = params => {
  return request({
    url: '/backend/tq/compareFaceWeb',
    method: 'post',
    data: params
  });
};
