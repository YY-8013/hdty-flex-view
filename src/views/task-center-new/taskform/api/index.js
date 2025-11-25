import request from "@/config/axios-init";

// 上传附件
export const uploadFile = params => {
  return request({
    url: "/web/rwNtask/fileUpload",
    headers: {
      "Content-Type": "multipart/form-data"
    },
    method: "post",
    params: params.params,
    data: params.data
  });
};

// 附件详情

export const fileDetail = params => {
  return request({
    url: "/web/rwNtask/fileDetail",
    method: "get",
    params: params,
    responseType: "blob"
  });
};
