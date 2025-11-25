import request from "@/config/axios-init";
// 获取轨迹信息-分页
export const bizPage = params => {
  return request({
    // url: "/web/rwNtask/gjList",
    url: "/web/rwNtask/gjPage",
    method: "post",
    data: params
  });
};

// 获取轨迹信息-分页-审批
export const bizPageSp = params => {
  return request({
    // url: "/web/rwNtask/gjList",
    url: "/web/rwNtaskSp/gjPage",
    method: "post",
    data: params
  });
};
