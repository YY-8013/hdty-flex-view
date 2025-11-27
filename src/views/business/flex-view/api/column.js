/**
 * 列配置管理 API
 * 用于数据晾晒系统的列配置增删改查操作
 */

import request from "@/config/axios-init";

const API_PREFIX = "/api/flex-view";

/**
 * 获取列配置树形结构
 * @param {Object} params - 查询参数
 * @returns {Promise} 返回树形列表数据
 */
export function getColumnTree(params) {
  // TODO: 对接后端接口后替换为真实接口
  return Promise.resolve({
    data: {
      success: true,
      data: mockColumnTreeData(),
      msg: "获取成功"
    }
  });

  // 真实接口调用（后端开发完成后启用）
  // return request({
  //   url: `${API_PREFIX}/column/tree`,
  //   method: 'get',
  //   params
  // });
}

/**
 * 获取列配置列表（扁平结构）
 * @param {Object} params - 分页查询参数
 * @returns {Promise} 返回列表数据
 */
export function getColumnPage(params) {
  // TODO: Mock数据,对接后端后替换
  return Promise.resolve({
    data: {
      success: true,
      data: {
        total: mockColumnListData().length,
        records: mockColumnListData()
      },
      msg: "获取成功"
    }
  });

  // return request({
  //   url: `${API_PREFIX}/column/page`,
  //   method: 'get',
  //   params
  // });
}

/**
 * 获取列配置详情
 * @param {String} id - 列配置ID
 * @returns {Promise} 返回详情数据
 */
export function getColumnDetail(id) {
  // TODO: Mock数据
  const mockList = mockColumnListData();
  const detail = mockList.find((item) => item.id === id) || {};

  return Promise.resolve({
    data: {
      success: true,
      data: {
        vo: detail,
        vox: {}
      },
      msg: "获取成功"
    }
  });

  // return request({
  //   url: `${API_PREFIX}/column/detail/${id}`,
  //   method: 'get'
  // });
}

/**
 * 新增列配置
 * @param {Object} data - 列配置数据
 * @returns {Promise} 返回操作结果
 */
export function addColumn(data) {
  console.log("新增列配置:", data);

  // TODO: Mock响应
  return Promise.resolve({
    data: {
      success: true,
      data: { id: "COL" + Date.now() },
      msg: "新增成功"
    }
  });

  // return request({
  //   url: `${API_PREFIX}/column/add`,
  //   method: 'post',
  //   data
  // });
}

/**
 * 编辑列配置
 * @param {Object} data - 列配置数据
 * @returns {Promise} 返回操作结果
 */
export function editColumn(data) {
  console.log("编辑列配置:", data);

  // TODO: Mock响应
  return Promise.resolve({
    data: {
      success: true,
      msg: "编辑成功"
    }
  });

  // return request({
  //   url: `${API_PREFIX}/column/edit`,
  //   method: 'post',
  //   data
  // });
}

/**
 * 删除列配置
 * @param {String} id - 列配置ID
 * @returns {Promise} 返回操作结果
 */
export function deleteColumn(id) {
  console.log("删除列配置:", id);

  // TODO: Mock响应
  return Promise.resolve({
    data: {
      success: true,
      msg: "删除成功"
    }
  });

  // return request({
  //   url: `${API_PREFIX}/column/delete/${id}`,
  //   method: 'post'
  // });
}

/**
 * 启用列配置
 * @param {String} id - 列配置ID
 * @param {String} remark - 启用备注
 * @returns {Promise} 返回操作结果
 */
export function enableColumn(id, remark) {
  console.log("启用列配置:", id, remark);

  // TODO: Mock响应
  return Promise.resolve({
    data: {
      success: true,
      msg: "启用成功"
    }
  });

  // return request({
  //   url: `${API_PREFIX}/column/enable`,
  //   method: 'post',
  //   data: { id, remark }
  // });
}

/**
 * 停用列配置
 * @param {String} id - 列配置ID
 * @param {String} remark - 停用备注
 * @returns {Promise} 返回操作结果
 */
export function disableColumn(id, remark) {
  console.log("停用列配置:", id, remark);

  // TODO: Mock响应
  return Promise.resolve({
    data: {
      success: true,
      msg: "停用成功"
    }
  });

  // return request({
  //   url: `${API_PREFIX}/column/disable`,
  //   method: 'post',
  //   data: { id, remark }
  // });
}

/**
 * 注销列配置
 * @param {Object} data - 注销数据 {id, zxyy}
 * @returns {Promise} 返回操作结果
 */
export function cancelColumn(data) {
  console.log("注销列配置:", data);

  // TODO: Mock响应
  return Promise.resolve({
    data: {
      success: true,
      msg: "注销成功"
    }
  });

  // return request({
  //   url: `${API_PREFIX}/column/cancel`,
  //   method: 'post',
  //   data
  // });
}

/**
 * 批量删除列配置
 * @param {Array} ids - 列配置ID数组
 * @returns {Promise} 返回操作结果
 */
export function batchDeleteColumn(ids) {
  console.log("批量删除列配置:", ids);

  // TODO: Mock响应
  return Promise.resolve({
    data: {
      success: true,
      msg: `已删除 ${ids.length} 条记录`
    }
  });

  // return request({
  //   url: `${API_PREFIX}/column/batch-delete`,
  //   method: 'post',
  //   data: { ids }
  // });
}

/**
 * 获取表单列表(用于关联表单选择)
 * @returns {Promise} 返回表单列表
 */
export function getFormList() {
  // TODO: Mock数据
  return Promise.resolve({
    data: {
      success: true,
      data: [
        { id: "FORM001", formCode: "CHECK_RECORD", formName: "抽查记录表单" },
        { id: "FORM002", formCode: "DISPUTE_RECORD", formName: "矛盾纠纷表单" },
        {
          id: "FORM003",
          formCode: "POPULATION_RECORD",
          formName: "人口登记表单"
        }
      ],
      msg: "获取成功"
    }
  });

  // return request({
  //   url: `${API_PREFIX}/form/list`,
  //   method: 'get'
  // });
}

// ==================== Mock数据 ====================

/**
 * Mock列配置树形数据
 */
function mockColumnTreeData() {
  return [
    {
      id: "COL001",
      parentId: null,
      label: "实有人口",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      columnConfig: null,
      sortNum: 1,
      status: "1",
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      children: [
        {
          id: "COL001001",
          parentId: "COL001",
          label: "总数",
          prop: "population_total",
          columnWidth: 100,
          align: "center",
          fixed: null,
          sortable: "false",
          defaultExpand: "true",
          formId: null,
          columnConfig: '{"formatter":{"type":"number","precision":0}}',
          sortNum: 1,
          status: "1",
          zxbs: "0",
          createTime: "20251126100000",
          createUsername: "管理员"
        },
        {
          id: "COL001002",
          parentId: "COL001",
          label: "抽查总数",
          prop: "check_total",
          columnWidth: 100,
          align: "center",
          fixed: null,
          sortable: "false",
          defaultExpand: "true",
          formId: "FORM001",
          columnConfig:
            '{"click":{"enabled":true,"style":{"cursor":"pointer","color":"#409EFF","textDecoration":"underline"}},"formatter":{"type":"number","precision":0}}',
          sortNum: 2,
          status: "1",
          zxbs: "0",
          createTime: "20251126100000",
          createUsername: "管理员"
        },
        {
          id: "COL001003",
          parentId: "COL001",
          label: "核查率",
          prop: "check_rate",
          columnWidth: 100,
          align: "center",
          fixed: null,
          sortable: "false",
          defaultExpand: "true",
          formId: null,
          columnConfig:
            '{"formatter":{"type":"percent","precision":2,"suffix":"%"},"conditional":{"rules":[{"condition":"value >= 95","style":{"color":"#67C23A"}},{"condition":"value < 80","style":{"color":"#F56C6C"}}]}}',
          sortNum: 3,
          status: "1",
          zxbs: "0",
          createTime: "20251126100000",
          createUsername: "管理员"
        }
      ]
    },
    {
      id: "COL002",
      parentId: null,
      label: "矛盾纠纷",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      columnConfig: null,
      sortNum: 2,
      status: "1",
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      children: [
        {
          id: "COL002001",
          parentId: "COL002",
          label: "总数",
          prop: "dispute_total",
          columnWidth: 100,
          align: "center",
          fixed: null,
          sortable: "false",
          defaultExpand: "true",
          formId: "FORM002",
          columnConfig:
            '{"click":{"enabled":true,"style":{"cursor":"pointer","color":"#409EFF"}},"formatter":{"type":"number","precision":0}}',
          sortNum: 1,
          status: "1",
          zxbs: "0",
          createTime: "20251126100000",
          createUsername: "管理员"
        },
        {
          id: "COL002002",
          parentId: "COL002",
          label: "已调解",
          prop: "dispute_resolved",
          columnWidth: 100,
          align: "center",
          fixed: null,
          sortable: "false",
          defaultExpand: "true",
          formId: null,
          columnConfig: '{"formatter":{"type":"number","precision":0}}',
          sortNum: 2,
          status: "1",
          zxbs: "0",
          createTime: "20251126100000",
          createUsername: "管理员"
        }
      ]
    }
  ];
}

/**
 * Mock列配置列表数据（扁平结构）
 * 包含6个一级节点，每个一级节点都有多个二级和三级子节点
 */
function mockColumnListData() {
  return [
    // ==================== 第1个一级节点: 实有人口 ====================
    {
      id: "COL001",
      parentId: null,
      label: "实有人口",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "实有人口统计列"
    },
    // 实有人口 -> 二级节点
    {
      id: "COL001001",
      parentId: "COL001",
      label: "汇总统计",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "人口汇总数据"
    },
    // 实有人口 -> 汇总统计 -> 三级节点
    {
      id: "COL001001001",
      parentId: "COL001001",
      label: "总数",
      prop: "population_total",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "人口总数"
    },
    {
      id: "COL001001002",
      parentId: "COL001001",
      label: "男性人口",
      prop: "population_male",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "男性人口数"
    },
    {
      id: "COL001001003",
      parentId: "COL001001",
      label: "女性人口",
      prop: "population_female",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 3,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "女性人口数"
    },
    // 实有人口 -> 二级节点
    {
      id: "COL001002",
      parentId: "COL001",
      label: "抽查统计",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "人口抽查数据"
    },
    // 实有人口 -> 抽查统计 -> 三级节点
    {
      id: "COL001002001",
      parentId: "COL001002",
      label: "抽查总数",
      prop: "check_total",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: "FORM001",
      formName: "抽查记录表单",
      columnConfig:
        '{"click":{"enabled":true,"style":{"cursor":"pointer","color":"#409EFF","textDecoration":"underline"}},"formatter":{"type":"number","precision":0}}',
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "可点击录入"
    },
    {
      id: "COL001002002",
      parentId: "COL001002",
      label: "核查率",
      prop: "check_rate",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig:
        '{"formatter":{"type":"percent","precision":2,"suffix":"%"},"conditional":{"rules":[{"condition":"value >= 95","style":{"color":"#67C23A"}},{"condition":"value < 80","style":{"color":"#F56C6C"}}]}}',
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "条件格式化显示"
    },
    {
      id: "COL001002003",
      parentId: "COL001002",
      label: "合格数",
      prop: "check_qualified",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 3,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "核查合格数"
    },

    // ==================== 第2个一级节点: 矛盾纠纷 ====================
    {
      id: "COL002",
      parentId: null,
      label: "矛盾纠纷",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "矛盾纠纷统计列"
    },
    // 矛盾纠纷 -> 二级节点
    {
      id: "COL002001",
      parentId: "COL002",
      label: "纠纷统计",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "矛盾纠纷统计数据"
    },
    // 矛盾纠纷 -> 纠纷统计 -> 三级节点
    {
      id: "COL002001001",
      parentId: "COL002001",
      label: "总数",
      prop: "dispute_total",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: "FORM002",
      formName: "矛盾纠纷表单",
      columnConfig:
        '{"click":{"enabled":true,"style":{"cursor":"pointer","color":"#409EFF"}},"formatter":{"type":"number","precision":0}}',
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "矛盾纠纷总数"
    },
    {
      id: "COL002001002",
      parentId: "COL002001",
      label: "已调解",
      prop: "dispute_resolved",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "已调解数"
    },
    {
      id: "COL002001003",
      parentId: "COL002001",
      label: "调解率",
      prop: "resolution_rate",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig:
        '{"formatter":{"type":"percent","precision":2,"suffix":"%"}}',
      sortNum: 3,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "调解率统计"
    },
    // 矛盾纠纷 -> 二级节点
    {
      id: "COL002002",
      parentId: "COL002",
      label: "分类统计",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "分类纠纷数据"
    },
    // 矛盾纠纷 -> 分类统计 -> 三级节点
    {
      id: "COL002002001",
      parentId: "COL002002",
      label: "家庭纠纷",
      prop: "family_dispute",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL002002002",
      parentId: "COL002002",
      label: "邻里纠纷",
      prop: "neighbor_dispute",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL002002003",
      parentId: "COL002002",
      label: "其他纠纷",
      prop: "other_dispute",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 3,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },

    // ==================== 第3个一级节点: 治安管理 ====================
    {
      id: "COL003",
      parentId: null,
      label: "治安管理",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 3,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "治安管理统计列"
    },
    // 治安管理 -> 二级节点
    {
      id: "COL003001",
      parentId: "COL003",
      label: "案件统计",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "治安案件统计"
    },
    // 治安管理 -> 案件统计 -> 三级节点
    {
      id: "COL003001001",
      parentId: "COL003001",
      label: "案件总数",
      prop: "case_total",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL003001002",
      parentId: "COL003001",
      label: "已破获",
      prop: "case_solved",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL003001003",
      parentId: "COL003001",
      label: "破获率",
      prop: "case_solve_rate",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig:
        '{"formatter":{"type":"percent","precision":2,"suffix":"%"}}',
      sortNum: 3,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    // 治安管理 -> 二级节点
    {
      id: "COL003002",
      parentId: "COL003",
      label: "处罚统计",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "行政处罚统计"
    },
    // 治安管理 -> 处罚统计 -> 三级节点
    {
      id: "COL003002001",
      parentId: "COL003002",
      label: "罚款总额",
      prop: "penalty_amount",
      columnWidth: 100,
      align: "right",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig:
        '{"formatter":{"type":"number","precision":2,"prefix":"¥"}}',
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL003002002",
      parentId: "COL003002",
      label: "处罚人数",
      prop: "penalty_count",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },

    // ==================== 第4个一级节点: 人口管理 ====================
    {
      id: "COL004",
      parentId: null,
      label: "人口管理",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 4,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "人口管理统计列"
    },
    // 人口管理 -> 二级节点
    {
      id: "COL004001",
      parentId: "COL004",
      label: "常住人口",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "常住人口统计"
    },
    // 人口管理 -> 常住人口 -> 三级节点
    {
      id: "COL004001001",
      parentId: "COL004001",
      label: "本市人口",
      prop: "local_population",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL004001002",
      parentId: "COL004001",
      label: "外市人口",
      prop: "external_population",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL004001003",
      parentId: "COL004001",
      label: "流动人口",
      prop: "floating_population",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 3,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    // 人口管理 -> 二级节点
    {
      id: "COL004002",
      parentId: "COL004",
      label: "居住证管理",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "居住证统计"
    },
    // 人口管理 -> 居住证管理 -> 三级节点
    {
      id: "COL004002001",
      parentId: "COL004002",
      label: "有效证件数",
      prop: "valid_residence_permit",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL004002002",
      parentId: "COL004002",
      label: "过期证件数",
      prop: "expired_residence_permit",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },

    // ==================== 第5个一级节点: 法律咨询 ====================
    {
      id: "COL005",
      parentId: null,
      label: "法律咨询",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 5,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "法律咨询统计列"
    },
    // 法律咨询 -> 二级节点
    {
      id: "COL005001",
      parentId: "COL005",
      label: "咨询统计",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "法律咨询统计"
    },
    // 法律咨询 -> 咨询统计 -> 三级节点
    {
      id: "COL005001001",
      parentId: "COL005001",
      label: "咨询总数",
      prop: "consultation_total",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL005001002",
      parentId: "COL005001",
      label: "已解答",
      prop: "consultation_answered",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL005001003",
      parentId: "COL005001",
      label: "解答率",
      prop: "consultation_rate",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig:
        '{"formatter":{"type":"percent","precision":2,"suffix":"%"}}',
      sortNum: 3,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    // 法律咨询 -> 二级节点
    {
      id: "COL005002",
      parentId: "COL005",
      label: "案件转介",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "案件转介统计"
    },
    // 法律咨询 -> 案件转介 -> 三级节点
    {
      id: "COL005002001",
      parentId: "COL005002",
      label: "转介案件数",
      prop: "referral_case_count",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL005002002",
      parentId: "COL005002",
      label: "已处理",
      prop: "referral_processed",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },

    // ==================== 第6个一级节点: 综合评分 ====================
    {
      id: "COL006",
      parentId: null,
      label: "综合评分",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 6,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "综合评分统计列"
    },
    // 综合评分 -> 二级节点
    {
      id: "COL006001",
      parentId: "COL006",
      label: "安全指数",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "安全评分指标"
    },
    // 综合评分 -> 安全指数 -> 三级节点
    {
      id: "COL006001001",
      parentId: "COL006001",
      label: "总得分",
      prop: "safety_score",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig:
        '{"formatter":{"type":"number","precision":1},"conditional":{"rules":[{"condition":"value >= 80","style":{"color":"#67C23A"}},{"condition":"value < 60","style":{"color":"#F56C6C"}}]}}',
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL006001002",
      parentId: "COL006001",
      label: "等级",
      prop: "safety_level",
      columnWidth: 80,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "A/B/C等级"
    },
    {
      id: "COL006001003",
      parentId: "COL006001",
      label: "排名",
      prop: "safety_rank",
      columnWidth: 80,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 3,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    // 综合评分 -> 二级节点
    {
      id: "COL006002",
      parentId: "COL006",
      label: "满意度调查",
      prop: null,
      columnWidth: null,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: null,
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: "群众满意度调查"
    },
    // 综合评分 -> 满意度调查 -> 三级节点
    {
      id: "COL006002001",
      parentId: "COL006002",
      label: "调查人数",
      prop: "satisfaction_count",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig: '{"formatter":{"type":"number","precision":0}}',
      sortNum: 1,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    },
    {
      id: "COL006002002",
      parentId: "COL006002",
      label: "满意度",
      prop: "satisfaction_rate",
      columnWidth: 100,
      align: "center",
      fixed: null,
      sortable: "false",
      defaultExpand: "true",
      formId: null,
      formName: null,
      columnConfig:
        '{"formatter":{"type":"percent","precision":2,"suffix":"%"},"conditional":{"rules":[{"condition":"value >= 80","style":{"color":"#67C23A"}},{"condition":"value < 60","style":{"color":"#F56C6C"}}]}}',
      sortNum: 2,
      status: "1",
      statusRemark: null,
      zxbs: "0",
      createTime: "20251126100000",
      createUsername: "管理员",
      updateTime: "20251126100000",
      updateUsername: "管理员",
      memo: null
    }
  ];
}
