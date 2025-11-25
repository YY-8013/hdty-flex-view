import request from "@/config/axios-init";

// 登入
export const toLogin = (params) => {
  return request({
    url: "/login",
    method: "post",
    data: params
  });
};

// 获取登录验证码
export const getLoginCode = () => {
  return request({
    url: "/login-code",
    method: "get"
  });
};

// 获取登录用户
export const getLogin = () => {
  return request({
    url: "/backend/user/getLogin",
    method: "post"
  });
};

// 上传头像
export const uploadAvatar = (params) => {
  return request({
    url: "/backend/user/uploadAvatar",
    method: "post",
    data: params
  });
};

// 修改密码
export const changePassword = (params) => {
  return request({
    url: "/backend/user/changePassword",
    method: "post",
    data: params
  });
};

// 旧密码验证
export const checkPassword = (params) => {
  return request({
    url: "/backend/user/checkPassword",
    method: "post",
    data: params
  });
};

// 获取用户列表
export const getUserList = (params) => {
  return request({
    url: "/backend/user/getPage",
    method: "post",
    data: params
  });
};

// 分页获取责任区民警列表
export const getZdryZrqPage = (params) => {
  return request({
    url: "/backend/user/getZrqPage",
    method: "post",
    data: params
  });
};

// 获取用户编辑时的详情
export const getEditDetail = (params) => {
  return request({
    url: "/backend/user/getEditDetail",
    method: "post",
    params: params
  });
};

// 编辑用户
export const editUser = (params) => {
  return request({
    url: "/backend/user/editOne",
    method: "post",
    data: params
  });
};

// 获取用户详情
export const getDetail = (params) => {
  return request({
    url: "/backend/user/getDetail",
    method: "post",
    params: params
  });
};

// 获取用户详情
export const getUserInfoDetail = (params) => {
  return request({
    url: "/backend/user/getUserInfoDetail",
    method: "post",
    params: params
  });
};

// 添加用户
export const addUser = (params) => {
  return request({
    url: "/backend/user/addOne",
    method: "post",
    data: params
  });
};

// 删除用户
export const deleteUser = (params) => {
  return request({
    url: "/backend/user/deleteOne",
    method: "post",
    params: params
  });
};

// 修改用户启用状态
export const changeUserEnable = (params) => {
  return request({
    url: "/backend/user/changeEnable",
    method: "post",
    data: params
  });
};

// 验证用户名的重复性
export const checkUsername = (params) => {
  return request({
    url: "/backend/user/checkUsername",
    method: "post",
    data: params
  });
};

// 导出
export const exports = (params) => {
  return request({
    url: "/backend/user/exports",
    method: "post",
    data: params,
    responseType: "blob"
  });
};

// 验证证件号码的重复性
export const checkIdCard = (params) => {
  return request({
    url: "/backend/user/checkIdCard",
    method: "post",
    data: params
  });
};

// 重置密码
export const resetPassword = (params) => {
  return request({
    url: "/backend/user/resetPassword",
    method: "post",
    data: params
  });
};

// 同步账号至认证中心
export const synchro = (params) => {
  return request({
    url: "/backend/user/synchro",
    method: "post",
    data: params
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
