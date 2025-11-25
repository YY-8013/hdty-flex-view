/*
 * @Author: zhaozhiyong zy.648561983.@gmail.com
 * @Date: 2024-05-20 14:15:54
 * @LastEditors: zhaozhiyong zy.648561983.@gmail.com
 * @LastEditTime: 2024-07-05 15:29:28
 * @FilePath: \hdty-zhsqjw-web\src\views\task-center-new\api\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from "@/config/axios-init";
import $utilStr from "@/utils/util-str";

/**
 * 数据抽取相关
 * @param params
 */

// 获取数据抽取列表
export const getExtractPage = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/objectEtl",
    method: "post",
    data: params
  });
};

/**
 * 表单相关
 * @param params
 */

// 获取表单分页列表
export const getFormPage = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formPage",
    method: "post",
    data: params
  });
};

// 获取表单详情
export const getFormDetail = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formDetail",
    method: "post",
    params: params
  });
};

// 获取表单数据
export const getFormData = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/formData",
    method: "post",
    params: params
  });
};

/**
 * 指派相关
 */

// 获取待指派或待认领任务列表
export const getZpOrRlTaskPage = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/assignPage",
    method: "post",
    data: params
  });
};

// 指派或认领任务
export const doZpOrRlTask = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/assign",
    method: "post",
    data: params
  });
};

/**
 * 任务管理相关
 * @param params
 */

// 获取任务列表
export const getTaskPage = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/page",
    method: "post",
    data: params
  });
};

// 获取任务详情
export const getTaskDetail = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/detail",
    method: "post",
    params: params
  });
};

// 获取按照机构为维度的子任务列表
export const getSubTaskList = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/stat",
    method: "post",
    data: params
  });
};

// 获取按照机构为维度的子任务列表中，所对应的人员
export const getSubTaskForPersonList = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/statUser",
    method: "post",
    params: params
  });
};

// 获取按照机构为维度的子任务列表中，所对应的周期
export const getSubTaskForCycleList = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/statPage",
    method: "post",
    params: params
  });
};

// 添加任务
export const addTask = (params) => {
  return request({
    timeout: 4 * 60 * 1000,
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/add",
    method: "post",
    data: params
  });
};

// 推送任务
export const pushTask = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/push",
    method: "post",
    params: params
  });
};

// 注销任务
export const logoutTask = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/logout",
    method: "post",
    data: params
  });
};

// 注销任务 恢复
export const restoreTask = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/fallback",
    method: "post",
    params: params
  });
};

// 修改任务
export const editTask = (params) => {
  return request({
    timeout: 4 * 60 * 1000,
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/edit",
    method: "post",
    data: params
  });
};

/**
 * 任务处置相关
 * @param params
 */

// 获取任务处置列表
export const getTaskSubPage = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/finishPage",
    method: "post",
    data: params
  });
};

// 获取任务处置详情
export const getTaskSubDetail = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/finishDetail",
    method: "post",
    params: params
  });
};

// 获取子任务详情   全部、待指派、待认领
export const getOrgDetail = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/orgDetail",
    method: "post",
    params: params
  });
};

// 处置任务
export const handleSubTask = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/finish",
    method: "post",
    data: params
  });
};

// 处置周期任务
export const handleCycleSubTask = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/finishCycle",
    method: "post",
    data: params
  });
};

// 任务移交
export const handOver = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/handOver",
    method: "post",
    data: params
  });
};

// 任务统计
export const taskStat = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/statOrg",
    method: "post",
    data: params
  });
};

// 获取周期情况
export const cycleList = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/cycleList",
    method: "post",
    params: params
  });
};

// 获取左侧树  机构
export const statUserTree = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/statUserTree",
    method: "post",
    data: params
  });
};

// 获取左侧树  机构
export const statOrgTree = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/statOrgTree",
    method: "post",
    data: params
  });
};

// 获取左侧树  我创建的
export const statNtaskTree = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/statNtaskTree",
    method: "post",
    data: params
  });
};

// 移交
export const yjList = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/yjList",
    method: "post",
    data: params
  });
};

// 民警办结情况
export const taskStatMj = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/statNtaskUser",
    method: "post",
    data: params
  });
};

// 获取任务核查详情
export const getCheckDetail = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/UserRecodeZtjd/detail",
    method: "post",
    params: params
  });
};

// 获取任务核查新增
export const checkAdd = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/UserRecodeZtjd/add",
    method: "post",
    data: params
  });
};

// 获取任务核查编辑
export const checkEdit = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/UserRecodeZtjd/edit",
    method: "post",
    data: params
  });
};

// 任务核查统计
export const taskStatCheck = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/ztjdStatByOrg",
    method: "post",
    data: params
  });
};

// 日常检查情况统计
export const taskStatDwrcjc = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/dwrcjcStatByOrg",
    method: "post",
    data: params
  });
};

// 质态监督工作统计
export const taskStatZtjdgz = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/ztjdStatByMj",
    method: "post",
    data: params
  });
};

// 各类标准件柱状图统计
export const bzjState = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/pieState",
    method: "post",
    data: params
  });
};

// 结果导出
export const exportsResult = (params) => {
  return request({
    timeout: 10 * 60 * 1000,
    url: "/web/rwNtask/exportByType",
    method: "post",
    data: params,
    responseType: "blob"
  });
};

// 导入任务对象模板
export const excelRwObjectImport = (params) => {
  return request({
    //responseType: 'blob',
    timeout: 0,
    url: "/web/rwNtask/rwExcelImport",
    method: "post",
    data: params
  });
};

// 导入任务对象模板(无表单)
export const rwWbdExcelImport = (params) => {
  return request({
    //responseType: 'blob',
    timeout: 0,
    url: "/web/rwNtask/rwWbdExcelImport",
    method: "post",
    data: params
  });
};

// 动态导入
export const rwTrendsExcelImport = (params) => {
  return request({
    timeout: 0,
    url: "/web/rwNtask/excelImportPublic",
    method: "post",
    data: params
  });
};

// 撤回任务
export const revokeTask = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/revokeOrgRecode",
    method: "post",
    data: params
  });
};

// 注销子任务
export const logoutOrgRecode = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/logoutOrgRecode",
    method: "post",
    data: params
  });
};

// 导出
export const exports = (params) => {
  return request({
    url: "/web/rwNtask/statNtaskUserExport",
    method: "post",
    data: params,
    responseType: "blob"
  });
};

// 导出质态监督情况
export const exportsZtjdByMj = (params) => {
  return request({
    url: "/web/rwNtask/ztjdStatByMjExport",
    method: "post",
    data: params,
    responseType: "blob"
  });
};

// 复制任务
export const copyTask = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/copyRw",
    method: "post",
    data: params
  });
};

// 获取任务对象列表-分页
export const rwObjPage = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/taskObject/page",
    method: "post",
    data: params
  });
};

// 激活任务
export const activateTask = (params) => {
  return request({
    url: "/web/rwNtask/activateRw",
    method: "post",
    data: params
  });
};

// 删除任务
export const deleteTask = (params) => {
  return request({
    url: "/web/rwNtask/delete",
    method: "post",
    data: params
  });
};

// 获取任务处理图表数据
export const ntaskDetailed = (params) => {
  return request({
    url: "/web/rwNtask/ntaskDetailed",
    method: "post",
    data: params
  });
};

// 追加指派人员
export const apendAssign = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtask/addAssignees",
    method: "post",
    data: params
  });
};

// 结果导出-民警办结情况统计列表导出
export const exportsMj = (params) => {
  return request({
    timeout: 10 * 60 * 1000,
    url: "/web/rwNtask/export",
    method: "post",
    data: params,
    responseType: "blob"
  });
};

/**
 * 需要审核的任务相关
 */
// 添加任务-需要审批
export const addTaskSp = (params) => {
  return request({
    timeout: 4 * 60 * 1000,
    requestId: $utilStr.uuid(),
    url: "/web/rwNtaskSp/add",
    method: "post",
    data: params
  });
};
// 获取任务列表-需要审批
export const getTaskPageSp = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtaskSp/page",
    method: "post",
    data: params
  });
};
// 提交创建的任务
export const submitTaskSp = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtaskSp/submit",
    method: "get",
    params: params
  });
};

// 审批任务
export const examineTask = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtaskSp/examine",
    method: "post",
    data: params
  });
};

// 获取左侧树  我创建的
export const statNtaskTreeSp = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtaskSp/statNtaskTree",
    method: "post",
    data: params
  });
};
// 获取待审批数量
export const getDspNum = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtaskSp/getDspNum",
    method: "get",
    params: params
  });
};
// 获任务详情
export const getOrgDetailSp = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtaskSp/detail",
    method: "post",
    params: params
  });
};

// 获取任务处理图表数据-审批详情
export const getNtaskDetailedSp = (params) => {
  return request({
    url: "/web/rwNtaskSp/ntaskDetailed",
    method: "post",
    data: params
  });
};

// 获取任务对象列表-分页
export const rwObjPageSp = (params) => {
  return request({
    requestId: $utilStr.uuid(),
    url: "/web/rwNtaskSp/taskObject/page",
    method: "post",
    data: params
  });
};
