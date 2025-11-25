/**
 * 校验类函数
 */

import $utilStr from "@/utils/util-str";

/**
 * el-form表单内置验证规则（非空验证、字符串长度验证、邮箱地址验证、数字验证）
 { required: true, message: '非空验证，失去焦点时触发，值不能为空', trigger: 'blur' }
 { required: true, message: '非空验证，值改变时触发，值不能为空', trigger: 'change' }
 { required: true, message: '非空验证，失去焦点或值改变时触发，值不能为空', trigger: ['blur', 'change'] }
 { type: 'date', required: true, message: '日期非空验证，日期不能为空', trigger: 'change' }
 { type: 'array', required: true, message: '数组非空验证，请至少选择一项', trigger: 'change' }
 { min: 3, max: 5, message: '字符串长度验证，长度在 3 到 5 个字符', trigger: 'change' }
 { type: 'email', message: '邮箱地址验证，请输入正确的邮箱地址', trigger: 'change' }
 { type: 'number', message: '数字验证，请输入数字', trigger: 'change' }
 */

/**
 * el-form表单正则表达式验证规则
 { required: true, pattern: /^1[3456789]\d{9}$/, message: '手机号码验证，请输入正确的手机号码', trigger: 'change' }
 */

/**
 * el-form表单自定义函数验证规则
 { validator: validate, trigger: 'change' }
 * el-form表单自定义函数验证规则（标签左侧显示红色星号）
 { required: true, validator: validate, trigger: 'change' }
 */

/**
 * 自定义验证函数
 let validate = (rule, value, callback) => {
   if (!this.$utilStr.isEmpty(value)) {
     if (value !== '条件') {
       callback(new Error('验证不通过提示'));
     } else {
       callback();
     }
   } else {
     callback();
   }
 };
 * 自定义异步请求api验证函数
 let validate = (rule, value, callback) => {
   if (!this.$utilStr.isEmpty(value)) {
     // 参数
     let dataParams = {};
     // Lambda写法
     api(dataParams).then(response => {
       // 响应成功回调
       let { success, data } = response.data;
       if (success) {
         if (data !== '条件') {
           callback(new Error('验证不通过提示'));
         } else {
           callback();
         }
       }
     }).catch(error => {
       // 响应错误回调
       console.error(error);
       callback(new Error('验证时发生错误，请重试'));
     });
   } else {
     callback();
   }
 };
 * 自定义匹配其他表单项验证函数（自身匹配条件进行验证，且有非空验证）
 let validate = (rule, value, callback) => {
   let matchedValue = this.formData['名称']; // 获取要匹配的表单项的值
   if (this.$utilStr.isEmpty(value)) {
     callback(new Error('值不能为空'));
   } else {
     if (!this.$utilStr.isEmpty(matchedValue)) {
       if (value !== matchedValue) {
         callback(new Error('验证不通过提示'));
       } else {
         callback();
       }
     } else {
       callback();
     }
   }
   // 如果要匹配的表单项也有匹配当前表单项的验证，则构建下面的代码片段，对要匹配的表单项重新进行验证
   if (!this.$utilStr.isEmpty(matchedValue)) {
     let matchedProp = '名称'; // 获取要匹配的表单项的prop属性
     this.$refs.formRef.validateField(matchedProp); // 对要匹配的表单项进行验证
   }
 };
 * 自定义匹配其他表单项验证函数（自身不进行条件匹配验证，触发要匹配的表单项进行验证，且有非空验证）
 let validate = (rule, value, callback) => {
   if (this.$utilStr.isEmpty(value)) {
     callback(new Error('值不能为空'));
   } else {
     callback();
   }
   let matchedValue = this.formData['名称']; // 获取要匹配的表单项的值
   if (!this.$utilStr.isEmpty(matchedValue)) {
     let matchedProp = '名称'; // 获取要匹配的表单项的prop属性
     this.$refs.formRef.validateField(matchedProp); // 对要匹配的表单项进行验证
   }
 };
 * 自定义匹配其他表单项验证函数（自身匹配条件进行验证，且无非空验证）
 let validate = (rule, value, callback) => {
   let matchedValue = this.formData['名称']; // 获取要匹配的表单项的值
   if (!this.$utilStr.isEmpty(value) && !this.$utilStr.isEmpty(matchedValue)) {
     if (value !== matchedValue) {
       callback(new Error('验证不通过提示'));
     } else {
       callback();
     }
   } else {
     callback();
   }
   // 如果要匹配的表单项也有匹配当前表单项的验证，则构建下面的代码片段，对要匹配的表单项重新进行验证
   if (!this.$utilStr.isEmpty(matchedValue)) {
     let matchedProp = '名称'; // 获取要匹配的表单项的prop属性
     this.$refs.formRef.validateField(matchedProp); // 对要匹配的表单项进行验证
   }
 };
 * 自定义匹配其他表单项验证函数（自身不进行条件匹配验证，触发要匹配的表单项进行验证，且无非空验证）
 let validate = (rule, value, callback) => {
   let matchedValue = this.formData['名称']; // 获取要匹配的表单项的值
   if (!this.$utilStr.isEmpty(matchedValue)) {
     let matchedProp = '名称'; // 获取要匹配的表单项的prop属性
     this.$refs.formRef.validateField(matchedProp); // 对要匹配的表单项进行验证
   }
   callback();
 };
 * 自定义表格中匹配其他表单项验证函数（自身匹配条件进行验证，且有非空验证）
 let validate = (rule, value, callback) => {
   let index = rule.field.split('.')[1]; // 获取要匹配的表单项在表格中的行索引
   let matchedValue = this.formData.tableData[index]['名称']; // 获取要匹配的表单项的值
   if (this.$utilStr.isEmpty(value)) {
     callback(new Error('值不能为空'));
   } else {
     if (!this.$utilStr.isEmpty(matchedValue)) {
       if (value !== matchedValue) {
         callback(new Error('验证不通过提示'));
       } else {
         callback();
       }
     } else {
       callback();
     }
   }
   // 如果要匹配的表单项也有匹配当前表单项的验证，则构建下面的代码片段，对要匹配的表单项重新进行验证
   if (!this.$utilStr.isEmpty(matchedValue)) {
     let matchedProp = `tableData.${index}.名称`; // 获取要匹配的表单项的prop属性
     this.$refs.formRef.validateField(matchedProp); // 对要匹配的表单项进行验证
   }
 };
 * 自定义表格中匹配其他表单项验证函数（自身不进行条件匹配验证，触发要匹配的表单项验证，且有非空验证）
 let validate = (rule, value, callback) => {
   if (this.$utilStr.isEmpty(value)) {
     callback(new Error('值不能为空'));
   } else {
     callback();
   }
   let index = rule.field.split('.')[1]; // 获取要匹配的表单项在表格中的行索引
   let matchedValue = this.formData.tableData[index]['名称']; // 获取要匹配的表单项的值
   if (!this.$utilStr.isEmpty(matchedValue)) {
     let matchedProp = `tableData.${index}.名称`; // 获取要匹配的表单项的prop属性
     this.$refs.formRef.validateField(matchedProp); // 对要匹配的表单项进行验证
   }
 };
 * 自定义表格中匹配其他表单项验证函数（自身匹配条件进行验证，且无非空验证）
 let validate = (rule, value, callback) => {
   let index = rule.field.split('.')[1]; // 获取要匹配的表单项在表格中的行索引
   let matchedValue = this.formData.tableData[index]['名称']; // 获取要匹配的表单项的值
   if (!this.$utilStr.isEmpty(value) && !this.$utilStr.isEmpty(matchedValue)) {
     if (value !== matchedValue) {
       callback(new Error('验证不通过提示'));
     } else {
       callback();
     }
   } else {
     callback();
   }
   // 如果要匹配的表单项也有匹配当前表单项的验证，则构建下面的代码片段，对要匹配的表单项重新进行验证
   if (!this.$utilStr.isEmpty(matchedValue)) {
     let matchedProp = `tableData.${index}.名称`; // 获取要匹配的表单项的prop属性
     this.$refs.formRef.validateField(matchedProp); // 对要匹配的表单项进行验证
   }
 };
 * 自定义表格中匹配其他表单项验证函数（自身不进行条件匹配验证，触发要匹配的表单项验证，且无非空验证）
 let validate = (rule, value, callback) => {
   let index = rule.field.split('.')[1]; // 获取要匹配的表单项在表格中的行索引
   let matchedValue = this.formData.tableData[index]['名称']; // 获取要匹配的表单项的值
   if (!this.$utilStr.isEmpty(matchedValue)) {
     let matchedProp = `tableData.${index}.名称`; // 获取要匹配的表单项的prop属性
     this.$refs.formRef.validateField(matchedProp); // 对要匹配的表单项进行验证
   }
   callback();
 };
 * 自定义验证函数（获取其他表单项的验证状态）
 let validate = (rule, value, callback) => {
   let matchedProp = '名称'; // 获取要验证的其他表单项的prop属性
   let matchedComponent = this.$refs.formRef.fields.find(e => e.prop === matchedProp); // 获取要验证的其他表单项的组件实例
   let matchedState = matched && matched.validateState; // 获取要验证的其他表单项的当前验证状态
   if (matchedState === '') {
     console.log('未验证');
   } else if (matchedState === 'success') {
     console.log('验证成功');
   } else if (matchedState === 'error') {
     console.log('验证失败');
   }
 };
 * 自定义验证函数（获取表格中其他表单项的验证状态）
 let validate = (rule, value, callback) => {
   let index = rule.field.split('.')[1]; // 获取当前验证行在表格中的行索引
   let matchedProp = `tableData.${index}.名称`; // 获取要验证的其他表单项的prop属性
   let matchedComponent = this.$refs.formRef.fields.find(e => e.prop === matchedProp); // 获取要验证的其他表单项的组件实例
   let matchedState = matched && matched.validateState; // 获取要验证的其他表单项的当前验证状态
   if (matchedState === '') {
     console.log('未验证');
   } else if (matchedState === 'success') {
     console.log('验证成功');
   } else if (matchedState === 'error') {
     console.log('验证失败');
   }
 };
 */

/**
 * 经典案例-验证开始时间与结束时间
 * 校验开始时间是否晚于等于结束时间（有非空验证）
 let validateStartTime = (rule, value, callback) => {
   if (this.$utilStr.isEmpty(value)) {
     callback(new Error('开始时间不能为空'));
   } else {
     callback();
   }
   let endTime = this.formData.endTime; // 获取结束时间的值
   if (!this.$utilStr.isEmpty(endTime)) {
     let endTimeProp = 'endTime'; // 获取结束时间表单项的prop值
     this.$refs.formRef.validateField(endTimeProp); // 对结束时间表单项进行验证
   }
 };
 * 校验开始时间是否晚于等于结束时间（无非空验证）
 let validateStartTime = (rule, value, callback) => {
   let endTime = this.formData.endTime; // 获取结束时间的值
   if (!this.$utilStr.isEmpty(endTime)) {
     let endTimeProp = 'endTime'; // 获取结束时间表单项的prop值
     this.$refs.formRef.validateField(endTimeProp); // 对结束时间表单项进行验证
   }
   callback();
 };
 * 校验结束时间是否早于等于开始时间（有非空验证）
 let validateEndTime = (rule, value, callback) => {
   let startTime = this.formData.startTime; // 获取开始时间的值
   if (this.$utilStr.isEmpty(value)) {
     callback(new Error('结束时间不能为空'));
   } else {
     if (!this.$utilStr.isEmpty(startTime)) {
     if (Number(value) <= Number(startTime)) {
        callback(new Error('不能早于等于开始时间'));
       } else {
         callback();
       }
     } else {
       callback();
     }
   }
 };
 * 校验结束时间是否早于等于开始时间（无非空验证）
 let validateEndTime = (rule, value, callback) => {
   let startTime = this.formData.startTime; // 获取开始时间的值
   if (!this.$utilStr.isEmpty(value) && !this.$utilStr.isEmpty(startTime)) {
     if (Number(value) <= Number(startTime)) {
        callback(new Error('不能早于等于开始时间'));
     } else {
       callback();
     }
   } else {
     callback();
   }
 };
 * 校验表格中某一行的开始时间是否晚于等于结束时间（有非空验证）
 let validateStartTime = (rule, value, callback) => {
   if (this.$utilStr.isEmpty(value)) {
     callback(new Error('开始时间不能为空'));
   } else {
     callback();
   }
   let index = rule.field.split('.')[1]; // 获取要校验的开始时间在表格中的行索引
   let endTime = this.formData.tableData[index].endTime; // 获取当前行中结束时间的值
   if (!this.$utilStr.isEmpty(endTime)) {
     let endTimeProp = `table.${index}.endTime`; // 获取当前行中结束时间表单项的prop值
     this.$refs.formRef.validateField(endTimeProp); // 对当前行中结束时间表单项进行验证
   }
 };
 * 校验表格中某一行的开始时间是否晚于等于结束时间（无非空验证）
 let validateStartTime = (rule, value, callback) => {
   let index = rule.field.split('.')[1]; // 获取要校验的开始时间在表格中的行索引
   let endTime = this.formData.tableData[index].endTime; // 获取当前行中结束时间的值
   if (!this.$utilStr.isEmpty(endTime)) {
     let endTimeProp = `table.${index}.endTime`; // 获取当前行中结束时间表单项的prop值
     this.$refs.formRef.validateField(endTimeProp); // 对当前行中结束时间表单项进行验证
   }
   callback();
 };
 * 校验表格中某一行的结束时间是否早于等于开始时间（有非空验证）
 let validateEndTime = (rule, value, callback) => {
   let index = rule.field.split('.')[1]; // 获取要校验的结束时间在表格中的行索引
   let startTime = this.formData.tableData[index].startTime; // 获取当前行中开始时间的值
   if (this.$utilStr.isEmpty(value)) {
     callback(new Error('结束时间不能为空'));
   } else {
     if (!this.$utilStr.isEmpty(startTime)) {
       if (Number(value) <= Number(startTime)) {
         callback(new Error('不能早于等于开始时间'));
       } else {
         callback();
       }
     } else {
       callback();
     }
   }
 };
 * 校验表格中某一行的结束时间是否早于等于开始时间（无非空验证）
 let validateEndTime = (rule, value, callback) => {
   let index = rule.field.split('.')[1]; // 获取要校验的结束时间在表格中的行索引
   let startTime = this.formData.tableData[index].startTime; // 获取当前行中开始时间的值
   if (!this.$utilStr.isEmpty(value) && ！this.$utilStr.isEmpty(startTime)) {
     if (Number(value) <= Number(startTime)) {
       callback(new Error('不能早于等于开始时间'));
     } else {
       callback();
     }
   } else {
     callback();
   }
 };
 * 校验表格中某一行的开始时间是否在其他行的开始结束时间区间
 let validateStartTimeRange = (rule, value, callback) => {
   if (!this.$utilStr.isEmpty(value)) {
     let index = rule.field.split('.')[1]; // 获取要校验的开始时间在表格中的行索引
     if (this.formData.tableData.find((e, i) => Number(i) !== Number(index) && Number(value) >= Number(e.startTime) && Number(value) <= Number(e.endTime))) {
       callback(new Error('不能在其他时间区间'));
     } else {
       let endTime = this.formData.tableData[index].endTime; // 获取当前行中结束时间的值
       if (!this.$utilStr.isEmpty(endTime)) {
         let endTimeProp = `table.${index}.endTime`; // 获取当前行中结束时间表单项的prop值
         this.$refs.formRef.validateField(endTimeProp); // 对当前行中结束时间表单项进行验证
       }
       callback();
     }
   } else {
     callback();
   }
 };
 * 校验表格中某一行的结束时间是否在其他行的开始结束时间区间
 let validateEndTimeRange = (rule, value, callback) => {
   if (!this.$utilStr.isEmpty(value)) {
     let index = rule.field.split('.')[1]; // 获取要校验的结束时间在表格中的行索引
     let startTime = this.formData.tableData[index].startTime; // 获取当前行中开始时间的值
     if (this.formData.tableData.find((e, i) => Number(i) !== Number(index) && Number(value) >= Number(e.startTime) && Number(value) <= Number(e.endTime))) {
       callback(new Error('不能在其他行程区间'));
     } else if (!this.$utilStr.isEmpty(startTime) && this.formData.tableData.find((e, i) => Number(i) !== Number(index) && Number(startTime) <= Number(e.startTime) && Number(value) >= Number(e.endTime))) {
       callback(new Error('不能在其他行程区间'));
     } else {
       callback();
     }
   } else {
     callback();
   }
 };
 */

/**
 * $prompt用户进行输入提示框插件中的输入框的验证函数示例
 * 调用提示框
 this.$prompt('请输入注销原因', '重新关注', {
   confirmButtonText: '确定',
   cancelButtonText: '取消',
   inputValidator: validate
 }).then(({ value }) => {
   // 确定回调
 }).catch(() => {
   // 取消回调
 });
 * 自定义验证函数
 let validate = (value) => {
   if (!$utilStr.isEmpty(value)) {
     const reg = /^[\S\s]{1,100}$/;
     if (!reg.test(value)) {
       return '注销原因长度不能超过100字符';
     } else {
       return true;
     }
   } else {
     return true;
   }
 };
 */

// 校验整数
const validateInteger = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^-?([1-9]\d*|0)$/;
    if (!reg.test(value)) {
      callback(new Error("请输入整数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验非0整数
const validateNonzeroInteger = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^-?[1-9]\d*$/;
    if (!reg.test(value)) {
      callback(new Error("请输入非0整数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验正整数
const validatePositiveInteger = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[1-9]\d*$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正整数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验非正整数
const validateNonpositiveInteger = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^-[1-9]\d*|0$/;
    if (!reg.test(value)) {
      callback(new Error("请输入非正整数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验负整数
const validateNegtiveInteger = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^-[1-9]\d*$/;
    if (!reg.test(value)) {
      callback(new Error("请输入负整数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验非负整数
const validateNonnegtiveInteger = (rule, value, callback) => {
  if (value) {
    const reg = /^(0|[1-9]\d*)$/;
    if (!reg.test(String(value).trim())) {
      callback(new Error("请输入非负整数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验小数
const validateDecimal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;
    if (!reg.test(value)) {
      callback(new Error("请输入小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验正小数
const validatePositiveDecimal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+))$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验非正小数
const validateNonpositiveDecimal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$/;
    if (!reg.test(value)) {
      callback(new Error("请输入非正小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验负小数
const validateNegtiveDecimal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/;
    if (!reg.test(value)) {
      callback(new Error("请输入负小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验非负小数
const validateNonnegtiveDecimal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^\d+(\.\d+)?$/;
    if (!reg.test(value)) {
      callback(new Error("请输入非负小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验正纯小数
const validatePositivePureDecimal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^0\.\d*[1-9]\d*$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正纯小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验非负纯小数
const validateNonnegtivePureDecimal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^0\.\d*[1-9]\d*|0$/;
    if (!reg.test(value)) {
      callback(new Error("请输入非负纯小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验非负纯小数，最多1位小数
const validateNonnegtivePureDecimalLimit1 = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^(0\.[1-9]|0?)$/;
    if (!reg.test(value)) {
      callback(new Error("请输入非负纯小数，最多1位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验整数和小数
const validateIntegerAndDecimal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^-?([1-9]\d*|0)(\.\d+)?$/;
    if (!reg.test(value)) {
      callback(new Error("请输入整数或小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验整数和小数，最多1位小数
const validateIntegerAndDecimalLimit1 = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^-?([1-9]\d*|0)(\.[0-9])?$/;
    if (!reg.test(value)) {
      callback(new Error("请输入整数或小数，最多1位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验整数和小数，最多2位小数
const validateIntegerAndDecimalLimit2 = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^-?([1-9]\d*|0)(\.([0-9]{1,2}))?$/;
    if (!reg.test(value)) {
      callback(new Error("请输入整数或小数，最多2位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验正整数和小数
const validatePositiveIntegerAndDecimal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^([1-9]\d*|0\.\d*[1-9]|[1-9]\d*\.\d*[0-9])$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正整数或小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 分步校验正整数和小数，必须为整数或小数，必须大于0，首位不能为0
const eachValidatePositiveIntegerAndDecimal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg1 = /^-?\d+(\.\d+)?$/;
    const reg2 = /^-?([1-9]\d*|0)(\.\d+)?$/;
    const reg3 = /^([1-9]\d*|0\.\d*[1-9]|[1-9]\d*\.\d*[0-9])$/;
    if (!reg1.test(value)) {
      callback(new Error("必须为整数或小数"));
    } else if (!reg2.test(value)) {
      callback(new Error("首位不能为0"));
    } else if (!reg3.test(value)) {
      callback(new Error("必须大于0"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验正整数和小数，最多1位小数
const validatePositiveIntegerAndDecimalLimit1 = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^([1-9]\d*|0\.[1-9]|[1-9]\d*\.[0-9])$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正整数或小数，最多1位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 分步校验正整数和小数，必须为整数或小数，必须大于0，首位不能为0，最多1位小数
const eachValidatePositiveIntegerAndDecimalLimit1 = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg1 = /^-?\d+(\.\d+)?$/;
    const reg2 = /^-?([1-9]\d*|0)(\.\d+)?$/;
    const reg3 = /^([1-9]\d*|0\.\d*[1-9]|[1-9]\d*\.\d*[0-9])$/;
    const reg4 = /^([1-9]\d*|0\.[1-9]|[1-9]\d*\.[0-9])$/;
    if (!reg1.test(value)) {
      callback(new Error("必须为整数或小数"));
    } else if (!reg2.test(value)) {
      callback(new Error("首位不能为0"));
    } else if (!reg3.test(value)) {
      callback(new Error("必须大于0"));
    } else if (!reg4.test(value)) {
      callback(new Error("最多1位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验正整数和小数，最多2位小数
const validatePositiveIntegerAndDecimalLimit2 = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg =
      /^([1-9]\d*|0\.[1-9]|0\.[0-9][1-9]|0\.[1-9][0-9]|[1-9]\d*\.([0-9]{1,2}))$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正整数或小数，最多2位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 分步校验正整数和小数，必须为整数或小数，必须大于0，首位不能为0，最多2位小数
const eachValidatePositiveIntegerAndDecimalLimit2 = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg1 = /^-?\d+(\.\d+)?$/;
    const reg2 = /^-?([1-9]\d*|0)(\.\d+)?$/;
    const reg3 = /^([1-9]\d*|0\.\d*[1-9]|[1-9]\d*\.\d*[0-9])$/;
    const reg4 =
      /^([1-9]\d*|0\.[1-9]|0\.[0-9][1-9]|0\.[1-9][0-9]|[1-9]\d*\.([0-9]{1,2}))$/;
    if (!reg1.test(value)) {
      callback(new Error("必须为整数或小数"));
    } else if (!reg2.test(value)) {
      callback(new Error("首位不能为0"));
    } else if (!reg3.test(value)) {
      callback(new Error("必须大于0"));
    } else if (!reg4.test(value)) {
      callback(new Error("最多2位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验非负的整数和小数
const validateNonnegativeIntegerAndDecimal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^([1-9]\d*|0)(\.\d+)?$/;
    if (!reg.test(value)) {
      callback(new Error("请输入非负的整数或小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 分步校验非负的整数和小数，必须为整数或小数，不能小于0，首位不能为0
const eachValidateNonnegativeIntegerAndDecimal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg1 = /^-?\d+(\.\d+)?$/;
    const reg2 = /^-?([1-9]\d*|0)(\.\d+)?$/;
    const reg3 = /^([1-9]\d*|0)(\.\d+)?$/;
    if (!reg1.test(value)) {
      callback(new Error("必须为整数或小数"));
    } else if (!reg2.test(value)) {
      callback(new Error("首位不能为0"));
    } else if (!reg3.test(value)) {
      callback(new Error("不能小于0"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验非负的整数和小数，最多1位小数
const validateNonnegativeIntegerAndDecimalLimit1 = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^([1-9]\d*|0)(\.[0-9])?$/;
    if (!reg.test(value)) {
      callback(new Error("请输入非负的整数或小数，最多1位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 分步校验非负的整数和小数，必须为整数或小数，不能小于0，首位不能为0，最多1位小数
const eachValidateNonnegativeIntegerAndDecimalLimit1 = (
  rule,
  value,
  callback
) => {
  if (!$utilStr.isEmpty(value)) {
    const reg1 = /^-?\d+(\.\d+)?$/;
    const reg2 = /^-?([1-9]\d*|0)(\.\d+)?$/;
    const reg3 = /^([1-9]\d*|0)(\.\d+)?$/;
    const reg4 = /^([1-9]\d*|0)(\.[0-9])?$/;
    if (!reg1.test(value)) {
      callback(new Error("必须为整数或小数"));
    } else if (!reg2.test(value)) {
      callback(new Error("首位不能为0"));
    } else if (!reg3.test(value)) {
      callback(new Error("不能小于0"));
    } else if (!reg4.test(value)) {
      callback(new Error("最多1位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验非负的整数和小数，最多2位小数
const validateNonnegativeIntegerAndDecimalLimit2 = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^([1-9]\d*|0)(\.([0-9]{1,2}))?$/;
    if (!reg.test(value)) {
      callback(new Error("请输入非负的整数或小数，最多2位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 分步校验非负的整数和小数，必须为整数或小数，不能小于0，首位不能为0，最多2位小数
const eachValidateNonnegativeIntegerAndDecimalLimit2 = (
  rule,
  value,
  callback
) => {
  if (!$utilStr.isEmpty(value)) {
    const reg1 = /^-?\d+(\.\d+)?$/;
    const reg2 = /^-?([1-9]\d*|0)(\.\d+)?$/;
    const reg3 = /^([1-9]\d*|0)(\.\d+)?$/;
    const reg4 = /^([1-9]\d*|0)(\.([0-9]{1,2}))?$/;
    if (!reg1.test(value)) {
      callback(new Error("必须为整数或小数"));
    } else if (!reg2.test(value)) {
      callback(new Error("首位不能为0"));
    } else if (!reg3.test(value)) {
      callback(new Error("不能小于0"));
    } else if (!reg4.test(value)) {
      callback(new Error("最多2位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验数字
const validateNumber = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[0-9]+$/;
    if (!reg.test(value)) {
      callback(new Error("请输入数字"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验英文字母
const validateLetter = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[A-Za-z]+$/;
    if (!reg.test(value)) {
      callback(new Error("请输入英文字母"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验英文字母和数字
const validateLetterAndNumber = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[A-Za-z0-9]+$/;
    if (!reg.test(value)) {
      callback(new Error("请输入英文字母和数字"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验英文字母、数字和符号
const validateLetterAndNumberAndSymbol = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[\x20-\x7E]+$/;
    if (!reg.test(value)) {
      callback(new Error("请输入英文字母、数字和符号"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验英文首字母大写
const validateLetterFirstUppercase = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[A-Z][A-Za-z]*$/;
    if (!reg.test(value)) {
      callback(new Error("请输入英文，且首字母大写"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验中文
const validateChinese = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[\u4e00-\u9fa5]+$/;
    if (!reg.test(value)) {
      callback(new Error("请输入中文"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验中文和英文
const validateChineseAndLetter = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[\u4e00-\u9fa5A-Za-z]+$/;
    if (!reg.test(value)) {
      callback(new Error("请输入中文和英文字母"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验中文、英文和数字
const validateChineseAndLetterAndNumber = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[\u4e00-\u9fa5A-Za-z0-9]+$/;
    if (!reg.test(value)) {
      callback(new Error("请输入中文、英文和数字"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验非中文
const validateUnChinese = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /.*[\u4e00-\u9fa5]+.*$/;
    if (reg.test(value)) {
      callback(new Error("请输入除中文之外的字符"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验用户名格式-强
const validateUsername = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[a-zA-Z][a-zA-Z0-9_]+$/;
    if (!reg.test(value)) {
      callback(
        new Error("请输入正确的用户名，以英文字母开头，允许数字和下划线")
      );
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验用户名格式-弱
const validateUsernameWeak = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[a-zA-Z0-9_]+$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的用户名，只能是英文字母、数字和下划线"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验密码格式-强
const validatePasswordTough = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^0-9a-zA-Z\s])/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的密码，必须含有英文字母、数字和常用符号"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验密码格式-中
const validatePasswordNormal = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)(?!([^(0-9a-zA-Z)])+$)/;
    if (!reg.test(value)) {
      callback(
        new Error("请输入正确的密码，至少含有英文字母、数字或常用符号中的两种")
      );
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验密码格式-弱
const validatePasswordWeak = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = "/^[\x20-\x7E]+$/";
    if (!reg.test(value)) {
      callback(
        new Error("请输入正确的密码，至少含有英文字母、数字或常用符号中的一种")
      );
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验移动电话号码格式
const validateMobile = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^1[3456789]\d{9}$/;
    if (!reg.test(value)) {
      return callback(new Error("请输入正确的手机号码"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验固定电话号码格式
const validateTel = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^(\d{3,4}-)?\d{7,8}$|^[48]00-\d{3}-\d{4}$/;
    if (!reg.test(value)) {
      return callback(new Error("请输入正确的电话号码"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验手机号码和固定电话号码格式
const validateMobileAndTel = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^1[3456789]\d{9}$|^(\d{3,4}-)?\d{7,8}$|^[48]00-\d{3}-\d{4}$/;
    if (!reg.test(value)) {
      return callback(new Error("请输入正确的手机号码或固定电话号码"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验电话号码和固话号码 补充
const validateMobileAndTel2 = (rule, value, callback) => {
  let strLike = (str, pattern) => {
    var regex = new RegExp(pattern.replace(/%/g, ".*").replace(/_/g, "."), "");
    return regex.test(str);
  };
  let arr = [
    "0000000000",
    "00000000000",
    "000000000000",
    "0000000",
    "00000000",
    "0000-0000000",
    "000-00000000",
    "000-000-0000"
  ];
  if (value) {
    const length = value.length;
    if (arr.includes(value)) {
      callback(new Error("请输入正确的手机号码或固定电话号码"));
    } else if (
      length === 11 ||
      length === 7 ||
      length === 8 ||
      length === 10 ||
      (length === 12 &&
        (strLike(value, "^____-_______$") ||
          strLike(value, "^___-________$") ||
          strLike(value, "^___-___-____$")))
    ) {
      callback();
    }
    //
    else {
      callback(new Error("请输入正确的手机号码或固定电话号码"));
    }
  }
  //
  else {
    callback();
  }
};

// 校验身份证号码格式
const validateIdcard = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    let arr = value.split(""); // 得到身份证数组
    if (
      !(
        validateNoByIdcard(value) &&
        validateBirthByIdcard(value) &&
        validateCodeByIdcard(arr)
      )
    ) {
      return callback(new Error("请输入正确的身份证号码"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 验证身份证号码的长度类型是否符合规范
const validateNoByIdcard = (val) => {
  let reg = /^\d{17}[\w\d]$/;
  return reg.test(val);
};

// 验证18位身份证号码中的生日是否为有效生日
const validateBirthByIdcard = (val) => {
  let year = val.substring(6, 10);
  let month = val.substring(10, 12);
  let day = val.substring(12, 14);
  let reg = new Date(year, parseFloat(month) - 1, parseFloat(day));
  // 这里用getFullYear()获取年份，避免千年虫问题
  return !(
    reg.getFullYear() !== parseFloat(year) ||
    reg.getMonth() !== parseFloat(month) - 1 ||
    reg.getDate() !== parseFloat(day)
  );
};

let wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
let valideteCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
// 验证18位身份证号码中的最后的验证位是否正确
const validateCodeByIdcard = (val) => {
  let sum = 0; // 声明加权求和变量
  if (val[17].toLowerCase() === "x") {
    val[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
  }
  for (let i = 0; i < 17; i++) {
    sum += wi[i] * val[i]; // 加权求和
  }
  let valCodePosition = sum % 11; // 得到验证码所位置
  return parseFloat(val[17]) === valideteCode[valCodePosition];
};

// 校验车牌号码格式
const validateCarcard = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[\u4e00-\u9fa5|WJ]{1}[A-Z0-9]{6}$/;
    if (!reg.test(value)) {
      return callback(new Error("请输入正确的车牌号码"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验金额格式，首位不为0，最多2位小数
const validateAmount = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg =
      /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的金额，首位不能为0，最多2位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 分步校验金额格式，必须为整数或小数，不能小于0，首位不能为0，最多2位小数
const eachValidateAmount = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg1 = /^-?\d+(\.\d+)?$/;
    const reg2 = /^-?([1-9]\d*|0)(\.\d+)?$/;
    const reg3 = /^([1-9]\d*|0)(\.\d+)?$/;
    const reg4 =
      /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
    if (!reg1.test(value)) {
      callback(new Error("金额必须为整数或小数"));
    } else if (!reg2.test(value)) {
      callback(new Error("金额首位不能为0"));
    } else if (!reg3.test(value)) {
      callback(new Error("金额不能小于0"));
    } else if (!reg4.test(value)) {
      callback(new Error("金额最多2位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验非0金额格式，大于0且首位不为0，最多2位小数
const validateNonzeroAmount = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg =
      /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[1-9](\.[0-9]{1,2})?$)|(^0\.[1-9]$)|(^0\.[0-9][1-9]$)|(^0\.[1-9][0-9]$)/;
    if (!reg.test(value)) {
      callback(
        new Error("请输入正确的金额，必须大于0且首位不能为0，最多2位小数")
      );
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 分步校验非0金额格式，必须为整数或小数，必须大于0，首位不能为0，最多2位小数
const eachValidateNonzeroAmount = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg1 = /^-?\d+(\.\d+)?$/;
    const reg2 = /^-?([1-9]\d*|0)(\.\d+)?$/;
    const reg3 = /^([1-9]\d*|0\.\d*[1-9]|[1-9]\d*\.\d*[0-9])$/;
    const reg4 =
      /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[1-9](\.[0-9]{1,2})?$)|(^0\.[1-9]$)|(^0\.[0-9][1-9]$)|(^0\.[1-9][0-9]$)/;
    if (!reg1.test(value)) {
      callback(new Error("金额必须为整数或小数"));
    } else if (!reg2.test(value)) {
      callback(new Error("金额首位不能为0"));
    } else if (!reg3.test(value)) {
      callback(new Error("金额必须大于0"));
    } else if (!reg4.test(value)) {
      callback(new Error("金额最多2位小数"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验文件名格式
const validateFilename = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[^\\\/:\*\?"<>\|]{1,256}$/;
    if (!reg.test(value)) {
      callback(new Error('请输入正确的文件名，不能包含/:*?"<>|'));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验IPv4地址格式
const validateIpv4 = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg =
      /^(?=(\b|\D))(((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))\.){3}((\d{1,2})|(1\d{1,2})|(2[0-4]\d)|(25[0-5]))(?=(\b|\D))$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的IPv4地址"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验IPv6地址格式
const validateIpv6 = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^([\\da-fA-F]{1,4}:){7}([\\da-fA-F]{1,4})$/;
    if (!reg.test(value)) {
      callback(new Error("请输入正确的IPv6地址"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验以正斜杠开头
const validateSlashBegin = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^\/.*/;
    if (!reg.test(value)) {
      callback(new Error("必须以/开头"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验不以正斜杠开头
const validateSlashNonBegin = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^(?!\/).*/;
    if (!reg.test(value)) {
      callback(new Error("不能以/开头"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验路由名称是否使用
const validateRouteName = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg =
      /^(?!(?:Login|Home|MyCenter|Inform|BadRequest|NotFound|NotAcceptable|Redirect|Landing)$)/;
    if (!reg.test(value)) {
      callback(new Error("不能等于" + value));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 校验路由路径是否使用
const validateRoutePath = (rule, value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    const reg =
      /^(?!\/login|\/default|\/my-center|\/inform|\/http-status|\/400|\/404|\/406|\/redirect|\/landing).*$/;
    if (!reg.test(value)) {
      callback(
        new Error(
          "开头不能包含/login|/default|/my-center|/inform|/http-status|/400|/404|/406|/redirect|/landing"
        )
      );
    } else {
      callback();
    }
  } else {
    callback();
  }
};

// 提示框校验输入的字符长度不超过100字符
const promptValidateCharLimit100 = (value) => {
  if (!$utilStr.isEmpty(value)) {
    const reg = /^[\S\s]{1,100}$/;
    return reg.test(value);
  } else {
    return true;
  }
};

// 校验指定字段是否为空
const validateEditorEmpty = (rule, value, callback) => {
  if (value && value === "<p><br></p>") {
    callback(new Error("内容不能为空"));
  } else {
    callback();
  }
};

// 将传入的姓名中空格和全角空格都去掉，乱七八糟的·都换成半角的·
const checkChineseName = (rule, value, callback) => {
  if (value) {
    const reg = /^[\u4DAE-\u9fa5]{2,15}$/;
    // const reg = /^[\u37E4-\u9fa5]{2,15}$/;// 支持“㟤”、“䶮”字录入，*可以考虑支持多个区间3400-4DBF/4E00-9FFF/20000-3FFFF：CJK统一表意符号（CJK Unified Ideographs）
    // 保留点后,用来校验的姓名,也是最终校验通过后返回的姓名
    let payerName = value
      .replace(/　/g, "")
      .replace(/ /g, "")
      .replace(/•/g, "·")
      .replace(/．/g, "·")
      .replace(/·/g, "·");
    // 去除所有点后，用来校验的姓名
    let checkName = value
      .replace(/　/g, "")
      .replace(/ /g, "")
      .replace(/•/g, "")
      .replace(/．/g, "")
      .replace(/·/g, "")
      .replace(/·/g, "");
    if (checkName.length === 1) {
      callback(new Error("姓名至少包含两位汉字"));
    }
    if (reg.test(checkName)) {
      if (payerName.substring(0, 1) === "·") {
        callback(new Error("姓名第一位不能为【·】"));
      }
      if (payerName.substring(payerName.length - 1) === "·") {
        callback(new Error("姓名最后不能为【·】"));
      }
      if (payerName.indexOf("··") !== -1) {
        callback(new Error("姓名不能有连续的【·】"));
      }
      callback();
    } else {
      callback(new Error("姓名中只能包含【汉字】和【·】"));
    }
  } else {
    callback();
  }
};

/**
 * 校验至少需要上传n个附件
 * @param {number} minCount - 最小附件数量
 * @param {string} [errorMessage] - 自定义错误提示（可选）
 * @returns {Function} - 返回校验规则兼容的函数
 */
const validateMinFiles = (minCount, errorMessage) => {
  return (rule, value, callback) => {
    const { addList = [] } = value || {};
    if (addList.length >= minCount) {
      callback();
    } else {
      callback(new Error(errorMessage || `至少需要上传${minCount}个附件`));
    }
  };
};

// 校验连续空白字符
const validateBlank = (rule, value, callback) => {
  if (value) {
    const reg = /^\s+$/;
    if (reg.test(value)) {
      callback(new Error("输入内容不能全部为空格"));
    }
    //
    else {
      callback();
    }
  }
  //
  else {
    callback();
  }
};

export default {
  // 校验整数
  validateInteger,
  // 校验非0整数
  validateNonzeroInteger,
  // 校验正整数
  validatePositiveInteger,
  // 校验非正整数
  validateNonpositiveInteger,
  // 校验负整数
  validateNegtiveInteger,
  // 校验非负整数
  validateNonnegtiveInteger,
  // 校验小数
  validateDecimal,
  // 校验正小数
  validatePositiveDecimal,
  // 校验非正小数
  validateNonpositiveDecimal,
  // 校验负小数
  validateNegtiveDecimal,
  // 校验非负小数
  validateNonnegtiveDecimal,
  // 校验正纯小数
  validatePositivePureDecimal,
  // 校验非负纯小数
  validateNonnegtivePureDecimal,
  // 校验非负纯小数，最多1位小数
  validateNonnegtivePureDecimalLimit1,
  // 校验整数和小数
  validateIntegerAndDecimal,
  // 校验整数和小数，最多1位小数
  validateIntegerAndDecimalLimit1,
  // 校验整数和小数，最多2位小数
  validateIntegerAndDecimalLimit2,
  // 校验正整数和小数
  validatePositiveIntegerAndDecimal,
  // 分步校验正整数和小数
  eachValidatePositiveIntegerAndDecimal,
  // 校验正整数和小数，最多1位小数
  validatePositiveIntegerAndDecimalLimit1,
  // 分步校验正整数和小数，最多1位小数
  eachValidatePositiveIntegerAndDecimalLimit1,
  // 校验正整数和小数，最多2位小数
  validatePositiveIntegerAndDecimalLimit2,
  // 分步校验正整数和小数，最多2位小数
  eachValidatePositiveIntegerAndDecimalLimit2,
  // 校验非负的整数和小数
  validateNonnegativeIntegerAndDecimal,
  // 分步校验非负的整数和小数
  eachValidateNonnegativeIntegerAndDecimal,
  // 校验非负的整数和小数，最多1位小数
  validateNonnegativeIntegerAndDecimalLimit1,
  // 分步校验非负的整数和小数，最多1位小数
  eachValidateNonnegativeIntegerAndDecimalLimit1,
  // 校验非负的整数和小数，最多2位小数
  validateNonnegativeIntegerAndDecimalLimit2,
  // 分步校验非负的整数和小数，最多2位小数
  eachValidateNonnegativeIntegerAndDecimalLimit2,
  // 校验数字
  validateNumber,
  // 校验英文字母
  validateLetter,
  // 校验英文字母和数字
  validateLetterAndNumber,
  // 校验英文字母、数字和符号
  validateLetterAndNumberAndSymbol,
  // 校验英文首字母大写
  validateLetterFirstUppercase,
  // 校验中文
  validateChinese,
  // 校验中文和英文
  validateChineseAndLetter,
  // 校验中文、英文和数字
  validateChineseAndLetterAndNumber,
  // 校验非中文
  validateUnChinese,
  // 校验用户名格式-强
  validateUsername,
  // 校验用户名格式-弱
  validateUsernameWeak,
  // 校验密码格式-强
  validatePasswordTough,
  // 校验密码格式-中
  validatePasswordNormal,
  // 校验密码格式-弱
  validatePasswordWeak,
  // 校验移动电话号码格式
  validateMobile,
  // 校验固定电话号码格式
  validateTel,
  // 校验手机号码和固定电话号码格式
  validateMobileAndTel,
  // 校验身份证号码格式
  validateIdcard,
  // 校验车牌号码格式
  validateCarcard,
  // 校验金额格式
  validateAmount,
  // 分步校验金额格式
  eachValidateAmount,
  // 校验非0金额格式
  validateNonzeroAmount,
  // 分步校验非0金额格式
  eachValidateNonzeroAmount,
  // 校验文件名格式
  validateFilename,
  // 校验IPv4地址格式
  validateIpv4,
  // 校验IPv6地址格式
  validateIpv6,
  // 校验以正斜杠开头
  validateSlashBegin,
  // 校验不以正斜杠开头
  validateSlashNonBegin,
  // 校验路由名称是否使用
  validateRouteName,
  // 校验路由路径是否使用
  validateRoutePath,
  // 提示框校验输入的字符长度不超过100字符
  promptValidateCharLimit100,
  validateEditorEmpty,
  validateMobileAndTel2,
  // 校验姓名
  checkChineseName,
  validateMinFiles,
  validateBlank
};
