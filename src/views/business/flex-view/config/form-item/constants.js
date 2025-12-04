/**
 * 表单项配置模块常量定义
 */

// 组件类型选项
export const ITEM_TYPE_OPTIONS = [
  { label: "输入框", value: "input" },
  { label: "下拉框", value: "select" },
  { label: "日期选择", value: "date" },
  { label: "文本域", value: "textarea" },
  { label: "单选框", value: "radio" },
  { label: "复选框", value: "checkbox" },
  { label: "机构", value: "organ" },
  { label: "地区", value: "region" },
  { label: "开关", value: "switch" },
  { label: "上传", value: "upload" },
  { label: "按钮", value: "button" },
  { label: "数字输入", value: "number" }
];

// 列类型选项
export const KEY_TYPE_OPTIONS = [
  { label: "普通字段", value: "field" },
  { label: "机构字段", value: "org" },
  { label: "区划字段", value: "region" },
  { label: "字典字段", value: "dict" },
  { label: "数字字段", value: "num" },
  { label: "日期字段", value: "date" }
];

// 数据类型选项
export const DATA_TYPE_OPTIONS = [
  { label: "VARCHAR2", value: "VARCHAR2" },
  { label: "NUMBER", value: "NUMBER" },
  { label: "DATE", value: "DATE" },
  { label: "CLOB", value: "CLOB" }
];

// 是否选项
export const YES_NO_OPTIONS = [
  { label: "是", value: "1" },
  { label: "否", value: "0" }
];

// 映射列名选项（通用业务数据表预留字段）
export const TABLE_KEY_OPTIONS = [
  // 字符串字段(20个)
  {
    label: "字符串字段",
    options: [
      {
        value: "F_FIELD_1",
        label: "F_FIELD_1",
        type: "VARCHAR2(200)",
        desc: "预留字段1"
      },
      {
        value: "F_FIELD_2",
        label: "F_FIELD_2",
        type: "VARCHAR2(200)",
        desc: "预留字段2"
      },
      {
        value: "F_FIELD_3",
        label: "F_FIELD_3",
        type: "VARCHAR2(200)",
        desc: "预留字段3"
      },
      {
        value: "F_FIELD_4",
        label: "F_FIELD_4",
        type: "VARCHAR2(200)",
        desc: "预留字段4"
      },
      {
        value: "F_FIELD_5",
        label: "F_FIELD_5",
        type: "VARCHAR2(200)",
        desc: "预留字段5"
      },
      {
        value: "F_FIELD_6",
        label: "F_FIELD_6",
        type: "VARCHAR2(500)",
        desc: "预留字段6(长文本)"
      },
      {
        value: "F_FIELD_7",
        label: "F_FIELD_7",
        type: "VARCHAR2(500)",
        desc: "预留字段7(长文本)"
      },
      {
        value: "F_FIELD_8",
        label: "F_FIELD_8",
        type: "VARCHAR2(500)",
        desc: "预留字段8(长文本)"
      },
      {
        value: "F_FIELD_9",
        label: "F_FIELD_9",
        type: "VARCHAR2(100)",
        desc: "预留字段9"
      },
      {
        value: "F_FIELD_10",
        label: "F_FIELD_10",
        type: "VARCHAR2(100)",
        desc: "预留字段10"
      },
      {
        value: "F_FIELD_11",
        label: "F_FIELD_11",
        type: "VARCHAR2(100)",
        desc: "预留字段11"
      },
      {
        value: "F_FIELD_12",
        label: "F_FIELD_12",
        type: "VARCHAR2(100)",
        desc: "预留字段12"
      },
      {
        value: "F_FIELD_13",
        label: "F_FIELD_13",
        type: "VARCHAR2(100)",
        desc: "预留字段13"
      },
      {
        value: "F_FIELD_14",
        label: "F_FIELD_14",
        type: "VARCHAR2(100)",
        desc: "预留字段14"
      },
      {
        value: "F_FIELD_15",
        label: "F_FIELD_15",
        type: "VARCHAR2(100)",
        desc: "预留字段15"
      },
      {
        value: "F_FIELD_16",
        label: "F_FIELD_16",
        type: "VARCHAR2(100)",
        desc: "预留字段16"
      },
      {
        value: "F_FIELD_17",
        label: "F_FIELD_17",
        type: "VARCHAR2(100)",
        desc: "预留字段17"
      },
      {
        value: "F_FIELD_18",
        label: "F_FIELD_18",
        type: "VARCHAR2(100)",
        desc: "预留字段18"
      },
      {
        value: "F_FIELD_19",
        label: "F_FIELD_19",
        type: "VARCHAR2(100)",
        desc: "预留字段19"
      },
      {
        value: "F_FIELD_20",
        label: "F_FIELD_20",
        type: "VARCHAR2(100)",
        desc: "预留字段20"
      }
    ]
  },
  // 机构相关字段(5个)
  {
    label: "机构字段",
    options: [
      {
        value: "F_ORG_ID",
        label: "F_ORG_ID",
        type: "VARCHAR2(32)",
        desc: "机构ID"
      },
      {
        value: "F_ORG_NAME",
        label: "F_ORG_NAME",
        type: "VARCHAR2(200)",
        desc: "机构名称"
      },
      {
        value: "F_PARENF_ORG_ID",
        label: "F_PARENF_ORG_ID",
        type: "VARCHAR2(32)",
        desc: "上级机构ID"
      },
      {
        value: "F_ORG_LEVEL",
        label: "F_ORG_LEVEL",
        type: "VARCHAR2(10)",
        desc: "机构层级"
      },
      {
        value: "F_ORG_PATH",
        label: "F_ORG_PATH",
        type: "VARCHAR2(500)",
        desc: "机构路径"
      }
    ]
  },
  // 行政区划字段(3个)
  {
    label: "区划字段",
    options: [
      {
        value: "F_REGION_ID",
        label: "F_REGION_ID",
        type: "VARCHAR2(20)",
        desc: "行政区划ID"
      },
      {
        value: "F_REGION_NAME",
        label: "F_REGION_NAME",
        type: "VARCHAR2(200)",
        desc: "行政区划名称"
      },
      {
        value: "F_REGION_LEVEL",
        label: "F_REGION_LEVEL",
        type: "VARCHAR2(10)",
        desc: "区划层级"
      }
    ]
  },
  // 字典字段(10个)
  {
    label: "字典字段",
    options: [
      {
        value: "F_DICT_1",
        label: "F_DICT_1",
        type: "VARCHAR2(50)",
        desc: "字典字段1"
      },
      {
        value: "F_DICT_2",
        label: "F_DICT_2",
        type: "VARCHAR2(50)",
        desc: "字典字段2"
      },
      {
        value: "F_DICT_3",
        label: "F_DICT_3",
        type: "VARCHAR2(50)",
        desc: "字典字段3"
      },
      {
        value: "F_DICT_4",
        label: "F_DICT_4",
        type: "VARCHAR2(50)",
        desc: "字典字段4"
      },
      {
        value: "F_DICT_5",
        label: "F_DICT_5",
        type: "VARCHAR2(50)",
        desc: "字典字段5"
      },
      {
        value: "F_DICT_6",
        label: "F_DICT_6",
        type: "VARCHAR2(50)",
        desc: "字典字段6"
      },
      {
        value: "F_DICT_7",
        label: "F_DICT_7",
        type: "VARCHAR2(50)",
        desc: "字典字段7"
      },
      {
        value: "F_DICT_8",
        label: "F_DICT_8",
        type: "VARCHAR2(50)",
        desc: "字典字段8"
      },
      {
        value: "F_DICT_9",
        label: "F_DICT_9",
        type: "VARCHAR2(50)",
        desc: "字典字段9"
      },
      {
        value: "F_DICT_10",
        label: "F_DICT_10",
        type: "VARCHAR2(50)",
        desc: "字典字段10"
      }
    ]
  },
  // 数字字段(5个)
  {
    label: "数字字段",
    options: [
      {
        value: "F_NUM_1",
        label: "F_NUM_1",
        type: "NUMBER(20,2)",
        desc: "数字字段1"
      },
      {
        value: "F_NUM_2",
        label: "F_NUM_2",
        type: "NUMBER(20,2)",
        desc: "数字字段2"
      },
      {
        value: "F_NUM_3",
        label: "F_NUM_3",
        type: "NUMBER(20,2)",
        desc: "数字字段3"
      },
      {
        value: "F_NUM_4",
        label: "F_NUM_4",
        type: "NUMBER(20,2)",
        desc: "数字字段4"
      },
      {
        value: "F_NUM_5",
        label: "F_NUM_5",
        type: "NUMBER(20,2)",
        desc: "数字字段5"
      }
    ]
  },
  // 日期字段(5个)
  {
    label: "日期字段",
    options: [
      { value: "F_DATE_1", label: "F_DATE_1", type: "DATE", desc: "日期字段1" },
      { value: "F_DATE_2", label: "F_DATE_2", type: "DATE", desc: "日期字段2" },
      { value: "F_DATE_3", label: "F_DATE_3", type: "DATE", desc: "日期字段3" },
      { value: "F_DATE_4", label: "F_DATE_4", type: "DATE", desc: "日期字段4" },
      { value: "F_DATE_5", label: "F_DATE_5", type: "DATE", desc: "日期字段5" }
    ]
  }
];
