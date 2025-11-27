import request from "@/config/axios-init";
import $utilStr from "@/utils/util-str";

/**
 * 通用请求方法封装
 * @param {string} url - 请求地址
 * @param {string} [method='post'] - 请求方法（默认POST）
 * @param {Object} [data={}] - 请求参数
 * @param {Object} [config={}] - 额外Axios配置（如headers、timeout等）
 * @returns {Promise} 返回Promise对象
 */
export const postRequest = ({ url, params = {} }) => {
  return request({
    requestId: $utilStr.uuid(),
    url,
    method: "post",
    data: params
  });
};

// 获取分页列表
export const rybqPage = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/fk/fkGzryLx/page",
    method: "post",
    data: params
  });
};

// 获取附件配置
export const getDoc = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/common/doc/getDoc",
    method: "post",
    data: params
  });
};

// 通过人员类型列表，获取是否需要上传重点群体类别（即是否需要上传群体类别）
export const hasRyxlByZdrylx = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/common/config/ywZdryxl",
    method: "post",
    data: params
  });
};

// 根据身份证号从常口库获取人员信息
export const getPersonInfoByIdCard = (params) => {
  return request({
    url: "/common/personDetail/getInfoByIdCard",
    method: "post",
    params: params
  });
};

export const detailByCardId = (params) => {
  return request({
    url: "/web/fk/extent/zhsqjw/person/detailByCardId",
    method: "post",
    data: params
  });
};

// 获取指定字典值
export const getDictionaryInfo = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/backend/dictionary/getDictionaryInfo",
    method: "post",
    data: params
  });
};

// 通过常口获取人员基本信息
export const getPersonBaseInfo = (params) => {
  return request({
    url: "/web/zdryAssist/countryPerson",
    method: "post",
    params: params
  });
};

// 通道下发
// 通过常口获取人员基本信息
export const zdryTunnelPersonSearch = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/zdryTunnelPerson/search",
    method: "post",
    params: params
  });
};

// 获取配置信息
export const getConfig = (params) => {
  return request({
    url: "/common/config/getConfig",
    method: "post",
    data: params
  });
};



export const fileUpload = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/common/doc/upload",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    method: "post",
    params: params.params,
    data: params.data
  });
};

// 获取人员电话信息（大数据接口-v2版本）
export const getPersonPhoneInfo = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/zdryDetail/archivesContactInfo",
    method: "post",
    data: params
  });
};
