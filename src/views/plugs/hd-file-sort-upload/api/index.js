import request from '../../../../config/axios-init';

// 上传附件
export const uploadFile = params => {
  return request({
    url: '/common/doc/upload',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    method: 'post',
    params: params.params,
    data: params.data
  });
};
