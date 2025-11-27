/**
 * 列配置模块常量定义
 */

// 对齐方式选项
export const ALIGN_OPTIONS = [
  { label: "左对齐", value: "left" },
  { label: "居中", value: "center" },
  { label: "右对齐", value: "right" }
];

// 固定列选项
export const FIXED_OPTIONS = [
  { label: "左侧固定", value: "left" },
  { label: "右侧固定", value: "right" }
];

// 计算类型选项
export const CALC_TYPE_OPTIONS = [
  {
    label: "求和",
    value: "sum",
    desc: "SUM"
  },
  {
    label: "平均值",
    value: "avg",
    desc: "AVG"
  },
  {
    label: "计数",
    value: "count",
    desc: "COUNT"
  },
  {
    label: "最大值",
    value: "max",
    desc: "MAX"
  },
  {
    label: "最小值",
    value: "min",
    desc: "MIN"
  },
  {
    label: "自定义",
    value: "custom",
    desc: "CUSTOM"
  }
];
