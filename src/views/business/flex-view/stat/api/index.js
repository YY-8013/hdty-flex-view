import request from "@/config/axios-init";

/**
 * 获取启用的列配置
 */
export const getEnabledColumns = (params) => {
  return request({
    url: "/web/sjls/sysColumnConfig/showTree",
    method: "post",
    data: {
      ...params,
      status: "1", // 启用状态
      zxbs: "0" // 正常状态
    }
  });
};

/**
 * 获取统计数据列表
 */
export const getStatDataList = (params) => {
  return request({
    url: "/web/sjls/statData/list",
    method: "post",
    data: params
  });
};

/**
 * 获取统计数据分页列表
 */
export const getStatDataPage = (params) => {
  return request({
    url: "/web/sjls/statData/page",
    method: "post",
    data: params
  });
};

/**
 * 刷新统计数据
 */
export const refreshStatData = (params) => {
  return request({
    url: "/web/sjls/statData/refresh",
    method: "post",
    data: params
  });
};

/**
 * 导出统计数据
 */
export const exportStatData = (params) => {
  return request({
    url: "/web/sjls/statData/export",
    method: "post",
    data: params,
    responseType: "blob"
  });
};

// 动态表单新增
export const dynamicFormAdd = (params) => {
  return request({
    url: "/web/sjls/sysBizDataCommon/upload",
    method: "post",
    data: params
  });
};

// 动态表单编辑
export const dynamicFormEdit = (params) => {
  return request({
    url: "/web/sjls/sysBizDataCommon/update",
    method: "post",
    data: params
  });
};

// 动态表单详情
export const dynamicFormDetail = (params) => {
  return request({
    url: "/web/sjls/sysBizDataCommon/detail",
    method: "post",
    data: params
  });
};

/**
 * Mock 数据 - 鄂尔多斯市各旗区统计数据
 * 按照动态列配置生成数据：
 * - 管辖机构 (orgId)
 * - 实有人口 (syrk) 及其子指标
 * - 实有单位 (sydw) 及其子指标
 * - 特定对象 (tddx)
 * - 矛盾纠纷 (mdjf)
 * @returns {Array} 统计数据列表
 */
export const getMockStatData = () => {
  // 鄂尔多斯市9个旗区
  const districts = [
    { id: "150102", name: "东胜区", code: "DS" },
    { id: "150103", name: "康巴什区", code: "KBS" },
    { id: "150121", name: "达拉特旗", code: "DLT" },
    { id: "150122", name: "准格尔旗", code: "ZGE" },
    { id: "150123", name: "鄂托克前旗", code: "ETKQ" },
    { id: "150124", name: "鄂托克旗", code: "ETK" },
    { id: "150125", name: "杭锦旗", code: "HJ" },
    { id: "150126", name: "乌审旗", code: "WS" },
    { id: "150127", name: "伊金霍洛旗", code: "YJHL" }
  ];

  // 生成随机数据
  const mockData = districts.map((district, index) => {
    // 实有人口数据
    const syrkTotal = Math.floor(Math.random() * 5000) + 2000; // 实有人口总数 2000-7000
    const syrkCcTotal = Math.floor(syrkTotal * 0.95); // 实有人口抽查总数
    const syrkCcHgNum = Math.floor(syrkCcTotal * 0.85); // 实有人口合格数
    const syrkCcBhgNum = syrkCcTotal - syrkCcHgNum; // 实有人口不合格数
    const syrkCcHgRate = ((syrkCcHgNum / syrkCcTotal) * 100).toFixed(2); // 实有人口合格率

    // 实有单位数据
    const sydwTotal = Math.floor(Math.random() * 1000) + 300; // 实有单位总数 300-1300
    const sydwCcTotal = Math.floor(sydwTotal * 0.9); // 实有单位抽查总数

    // 特定对象数据
    const tddxTotal = Math.floor(Math.random() * 500) + 100; // 特定对象数 100-600

    // 矛盾纠纷数据
    const mdjfTotal = Math.floor(Math.random() * 300) + 50; // 矛盾纠纷数 50-350

    return {
      id: district.id,
      orgId: district.id, // 管辖机构ID
      orgName: district.name,
      orgCode: district.code,

      // 实有人口相关字段
      syrk: syrkTotal, // 实有人口
      syrk_total_num: syrkTotal, // 实有人口 - 总数
      syrk_ccqk_title: "实有人口抽查情况", // 实有人口 - 抽查情况标题
      syrk_cc_total_num: syrkCcTotal, // 实有人口 - 抽查总数
      syrk_cc_hg_num: syrkCcHgNum, // 实有人口 - 合格数
      syrk_cc_bhg_num: syrkCcBhgNum, // 实有人口 - 不合格数
      syrk_cc_hg_rate: syrkCcHgRate + "%", // 实有人口 - 合格率

      // 实有单位相关字段
      sydw: sydwTotal, // 实有单位
      sydw_total_num: sydwTotal, // 实有单位 - 总数
      sydw_cc_total_num: sydwCcTotal, // 实有单位 - 抽查总数

      // 特定对象
      tddx: tddxTotal, // 特定对象

      // 矛盾纠纷
      mdjf: mdjfTotal, // 矛盾纠纷

      // 其他基础字段
      updateTime: "20251128" + String(10 + index).padStart(2, "0") + "0000"
    };
  });

  return {
    success: true,
    data: {
      records: mockData,
      total: mockData.length,
      current: 1,
      size: 50
    },
    msg: "查询成功"
  };
};
