import $utilStr from './../../../utils/util-str';

// 校验中文姓名格式（将传入的姓名中空格和全角空格都去掉，乱七八糟的·都换成半角的·）
const checkChineseName = (value) => {
  if(value){
    const reg = /^[\u4DAE-\u9fa5]{2,15}$/;
    // const reg = /^[\u37E4-\u9fa5]{2,15}$/;// 支持“㟤”、“䶮”字录入，*可以考虑支持多个区间3400-4DBF/4E00-9FFF/20000-3FFFF：CJK统一表意符号（CJK Unified Ideographs）
    // 保留点后,用来校验的姓名,也是最终校验通过后返回的姓名
    let payerName = value.replace(/　/g,"")
      .replace(/ /g, "")
      .replace(/•/g, "·")
      .replace(/．/g, "·")
      .replace(/·/g, "·");
    // 去除所有点后，用来校验的姓名
    let checkName = value.replace(/　/g, "")
      .replace(/ /g, "")
      .replace(/•/g, "")
      .replace(/．/g, "")
      .replace(/·/g, "")
      .replace(/·/g, "");
    if(checkName.length === 1){
      return ['0', '姓名至少包含两位汉字'];
    }
    if (reg.test(checkName)) {
      if(payerName.substring(0,1) === '·'){
        return ['0', '姓名第一位不能为【·】'];
      }
      if(payerName.substring(payerName.length - 1) === '·'){
        return ['0', '姓名最后不能为【·】'];
      }
      if(payerName.indexOf("··") !== -1){
        return ['0', '姓名不能有连续的【·】'];
      }
      return ['1', ''];
    } else {
      return ['0', '姓名中只能包含【汉字】和【·】'];
    }
  }else{
    return ['1', ''];
  }

};

// 校验身份证号格式
const validateIdcard = (value, callback) => {
  if (!$utilStr.isEmpty(value)) {
    let arr = value.split('');// 得到身份证数组
    if (!(validateNoByIdcard(value) && validateBirthByIdcard(value) && validateCodeByIdcard(arr))) {
      return ['0', '请输入正确的身份证号'];
    } else {
      return ['1', ''];
    }
  } else {
    return ['1', ''];
  }
};

// 校验联系电话格式
const validateMobileAndTel = (value) => {
  if (!$utilStr.isEmpty(value)) {
    // const reg = /^1[3456789]\d{9}$|^(\d{3,4}-)?\d{7,8}$|^[48]00-\d{3}-\d{4}$/;
    const reg = /^[0123456789][23456789]\d{9}$|^(\d{3,4}-)?\d{7,8}$|^(\d{3,4})?\d{7,8}$|^\d{3}-\d{3}-\d{4}$|^[48]00-\d{3}-\d{4}$/;
    if (!reg.test(value)) {
      return ['0', '请输入正确的手机号码或固定电话号码'];
    } else {
      return ['1', ''];
    }
  } else {
    return ['1', ''];
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
  return !(reg.getFullYear() !== parseFloat(year)
    || reg.getMonth() !== parseFloat(month) - 1
    || reg.getDate() !== parseFloat(day));
};

let wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1];// 加权因子
let valideteCode = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2];// 身份证验证位值.10代表X
// 验证18位身份证号码中的最后的验证位是否正确
const validateCodeByIdcard = (val) => {
  let sum = 0; // 声明加权求和变量
  if (val[17].toLowerCase() === 'x') {
    val[17] = 10;// 将最后位为x的验证码替换为10方便后续操作
  }
  for (let i = 0; i < 17; i++) {
    sum += wi[i] * val[i];// 加权求和
  }
  let valCodePosition = sum % 11;// 得到验证码所位置
  return parseFloat(val[17]) === valideteCode[valCodePosition];
};



export default {
  // 校验中文姓名格式
  checkChineseName,
  // 校验身份证号格式
  validateIdcard,
  // 校验联系电话格式
  validateMobileAndTel,
}
