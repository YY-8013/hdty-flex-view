import $storage from "@/utils/storage";
import $utilStr from "@/utils/util-str";

// 获取人员现状需要移除的项
const getRyxzRemoveOptions = (rylx) => {
  // rylx：人员类型  key的值的集合
  let removeOptions = [];
  if (!rylx || rylx.length === 0) {
    return removeOptions;
  }
  let ryxz_rylx_config = $storage.session.get("ryxz_rylx");
  Object.keys(ryxz_rylx_config).forEach((key) => {
    // 当前人员现状标签判断：只要formData的rylx中有1个类型满足，则展示不移除，否则移除
    let hasRylx = ryxz_rylx_config[key].some((rylxKey) =>
      rylx.includes(rylxKey)
    );
    if (!hasRylx) {
      removeOptions.push(key);
    }
  });
  return removeOptions;
};

/**
 * 处理关注人员类型翻译并格式化结果
 * @param {Array|string} zdrylxVox - 关注人员类型翻译，可以是数组或字符串
 * @param {string} gklx - 类型（备用参数，当前未使用）
 * @returns {Array|string} 格式化后的结果
 */

// 默认替换映射

let replaceMappings = [];
if (appEnv.zdrylxTranslateConfig) {
  replaceMappings = appEnv.zdrylxTranslateConfig.replaceMappings || [];
}

const processZdrylx = (zdrylxVox, gklx) => {
  // 空值、未启用或未匹配的gklx直接返回
  if (
    !zdrylxVox ||
    !appEnv.zdrylxTranslateConfig ||
    !appEnv.zdrylxTranslateConfig.enabale ||
    !appEnv.zdrylxTranslateConfig.gklx.includes(gklx)
  ) {
    return zdrylxVox;
  }

  // 如果是字符串，将其分割为数组
  let zdrylxArray = Array.isArray(zdrylxVox) ? zdrylxVox : zdrylxVox.split(",");

  // 遍历数组进行替换
  let processedArray = zdrylxArray.map((item) => {
    let replacement = replaceMappings.find(
      (mapping) => mapping.oldValue === item
    );
    return replacement ? replacement.newValue : item;
  });

  // 根据结果格式返回
  if (!Array.isArray(zdrylxVox)) {
    return processedArray.join(",");
  }
  return processedArray;
};

// 校验tableData里的数据是否都合法
const validateTableData = (tableData, props) => {
  let isPass = true; // 全局校验结果
  let errorNum = 0; // 未通过校验的表单数

  (tableData || []).forEach((formData) => {
    formData.needEdit = false; // 初始化 needEdit 为 false

    // 遍历 props，检查必填项
    for (const propItem of props) {
      const { isRelate, relateInfo } = propItem;

      // 如果是关联校验
      if (isRelate && relateInfo && relateInfo.logic && relateInfo.list) {
        const { logic, list } = relateInfo;
        // 根据逻辑符号判断是否要做"与"（and）或"或"（or）校验
        let checkValues = false;
        if (logic === "and") {
          // "and"表示所有条件都必须满足
          checkValues = list.every(({ prop: checkProp, value: checkValue }) => {
            const formValue = formData[checkProp];
            return checkValue.includes(formValue); // 检查当前条件是否满足
          });
        } else if (logic === "or") {
          // "or"表示至少有一个条件满足
          checkValues = list.some(({ prop: checkProp, value: checkValue }) => {
            const formValue = formData[checkProp];
            return checkValue.includes(formValue); // 检查是否有一个条件满足
          });
        }

        // 如果关联条件满足且目标字段没有值，标记需要编辑
        if (checkValues && !formData[propItem.prop]) {
          console.log("不合格项", propItem.label);

          formData.needEdit = true; // 标记当前表单需要编辑
          isPass = false; // 有未通过校验的表单，整体标记为未通过
          errorNum += 1; // 增加错误数
          break; // 停止校验当前 formData 的其他字段
        }
      } else {
        if (!formData[propItem.prop]) {
          console.log("不合格项", propItem.label);

          formData.needEdit = true; // 标记当前表单需要编辑
          isPass = false; // 有未通过校验的表单，整体标记为未通过
          errorNum += 1; // 增加错误数
          break; // 停止校验当前 formData 的其他字段
        }
      }
    }
  });

  // 返回结果对象
  return {
    tableData,
    isPass,
    errorNum
  };
};

export default {
  // 获取人员现状需要移除的项
  getRyxzRemoveOptions,
  // 处理关注人员类型翻译并格式化结果
  processZdrylx,
  // 校验tableData里的数据是否都合法
  validateTableData
};
