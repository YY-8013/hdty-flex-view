import request from '../../../../config/axios-init';

// 上传图片
export const uploadPhoto = params => {
  return request({
    url: '/common/photo/upLoad',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    data: params
  });
};
