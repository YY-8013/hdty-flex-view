import request from "@/config/axios-init";
import $utilStr from "@/utils/util-str";

// 附件上传
export const fileUpload = params => {
  return request({
    requestId: $utilStr.uuid(),
    timeout: 1000 * 60 * 10,
    url: "/web/rwNtask/fileUpload",
    method: "post",
    data: params
  });
};
