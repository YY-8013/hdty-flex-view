// 示例1： 只有1个判断条件  if ( hdArrayZdryLx === '01' )
const htList = 
{
  "1501": ["510"],
  "1506": ["510"],
  "1525": ["510"]
};

export const vIfData1 = {
  logic: "single",
  vIfObj: {
    prop: "hdArrayZdryLx",
    value: ["01"],
    logicType: "||" //  && : value的值在对应的字段值都满足则为true   || : value的值在对应的字段值有1个存在则为true ,不设置默认为 ||
  }
};

// 示例2： 有2个判断条件  且的关系   if ( name === '1' && gender === '1' )
export const vIfData2 = {
  logic: "&&",
  vIfList: [
    {
      logic: "single",
      vIfObj: {
        prop: "name",
        value: ["1"],
        logicType: "&&"
      }
    },
    {
      logic: "single",
      vIfObj: {
        prop: "gender",
        value: ["1"],
        logicType: "||"
      }
    }
  ]
};

// 示例3： 有2个判断条件  或的关系  if ( name === '1' || gender === '0' )
export const vIfData3 = {
  logic: "||",
  vIfList: [
    {
      logic: "single",
      vIfObj: {
        prop: "name",
        value: ["1"],
        logicType: "||"
      }
    },
    {
      logic: "single",
      vIfObj: {
        prop: "gender",
        value: ["1"],
        logicType: "||"
      }
    }
  ]
};

// 示例4  常见逻辑关系  营业状态： 1 并且：a、b、c、d有一个满足条件就为true if( yyzt === '1' &&  (a === '1' || b === '2' || c === '3' || d === '4')  )
export const vIfData4 = {
  logic: "&&",
  vIfList: [
    {
      logic: "single",
      vIfObj: {
        prop: "yyzt",
        value: ["1"],
        logicType: "||"
      }
    },
    {
      logic: "||",
      vIfList: [
        {
          logic: "single",
          vIfObj: {
            prop: "a",
            value: ["1"],
            logicType: "||"
          }
        },
        {
          logic: "single",
          vIfObj: {
            prop: "b",
            value: ["2"],
            logicType: "||"
          }
        },
        {
          logic: "single",
          vIfObj: {
            prop: "c",
            value: ["3"],
            logicType: "||"
          }
        },
        {
          logic: "single",
          vIfObj: {
            prop: "d",
            value: ["4"],
            logicType: "||"
          }
        }
      ]
    }
  ]
};

// 示例5  综合拓展复杂逻辑     if   (  ( ( a === '1' || ( b === '1' && c === '0')) && d === '1') || e === '0' || f === '1' )
export const vIfData = {
  logic: "||",
  vIfList: [
    {
      logic: "&&",
      vIfList: [
        {
          logic: "||",
          vIfList: [
            {
              logic: "single",
              vIfObj: {
                prop: "a",
                value: ["1"],
                logicType: "||"
              }
            },
            {
              logic: "&&",
              vIfList: [
                {
                  logic: "single",
                  vIfObj: {
                    prop: "b",
                    value: ["1"],
                    logicType: "||"
                  }
                },
                {
                  logic: "single",
                  vIfObj: {
                    prop: "c",
                    value: ["0"],
                    logicType: "||"
                  }
                }
              ]
            }
          ]
        },
        {
          logic: "single",
          vIfObj: {
            prop: "d",
            value: ["1"],
            logicType: "||"
          }
        }
      ]
    },
    {
      logic: "single",
      vIfObj: {
        prop: "e",
        value: ["1"],
        logicType: "||"
      }
    },
    {
      logic: "single",
      vIfObj: {
        prop: "f",
        value: ["1"],
        logicType: "||"
      }
    }
  ]
};
/**
 * 检查两个数组是否有交集
 * @param {Array} a - 第一个数组
 * @param {Array} b - 第二个数组
 * @param {string} logicType - 逻辑类型（"||" 或 "&&"）
 * @returns {boolean} - 根据逻辑类型返回是否满足条件
 */
function checkArrays(a, b, logicType) {
  if (logicType === "||") {
    if (b.length === 0) {
      return true;
    }
    for (let i = 0; i < b.length; i++) {
      if (a.includes(b[i])) {
        return true;
      }
    }
    return false;
  } else if (logicType === "&&") {
    for (let i = 0; i < b.length; i++) {
      if (!a.includes(b[i])) {
        return false;
      }
    }
    return true;
  }
  return false;
}

/**
 * 递归函数，根据vIfData结构进行条件判断
 * @param {Object} data - 动态数据对象
 * @returns {boolean} - 返回条件是否成立
 */
function evaluateCondition(data, formData) {
  // 如果data是null则返回true , 说明没有判断条件
  if (!data) {
    return true;
  }
  const { logic, vIfList, vIfObj } = data;

  // 处理异常数据， 无效判断，仍返回true
  if (!logic || !["single", "&&", "||".includes(logic)]) {
    return true;
  }

  if (logic === "single") {
    // 处理vIfObj为null的情况
    if (!vIfObj) {
      return true; // 如果vIfObj为空，返回false，无效判断
    }
    const { prop, value, logicType } = vIfObj;
    // 未设置相关判断属性，无效判断
    if (!prop) {
      return true;
    }
    const formValue = formData[prop];

    if (typeof formValue === "string") {
      // 如果获取回来的值是字符串，那判断value是否存在
      return value.includes(formValue);
    } else if (Array.isArray(formValue)) {
      return checkArrays(formValue, value, logicType);
    } else {
      return false; // 处理属性值为null的情况
    }
  }

  // 处理vIfList为null或空数组的情况
  if (!vIfList || vIfList.length === 0) {
    return true; // 如果vIfList为空，返回true，无效判断
  }

  if (logic === "&&") {
    // 所有子条件必须都为true
    return vIfList.every(subCondition =>
      evaluateCondition(subCondition, formData)
    );
  } else if (logic === "||") {
    // 任一子条件为true即可
    return vIfList.some(subCondition =>
      evaluateCondition(subCondition, formData)
    );
  }

  // 默认返回false，处理其他未定义的情况
  return false;
}
