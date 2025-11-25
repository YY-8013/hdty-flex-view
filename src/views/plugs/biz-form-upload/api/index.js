import request from "@/config/axios-init";
import $utilStr from "@/utils/util-str";

// 上传附件
export const fileUpload = params => {
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
