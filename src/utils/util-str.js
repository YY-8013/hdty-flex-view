/**
 * 字符类函数
 */


import $crypto from '@/utils/crypto';


// 判断是否为空
const isEmpty = val => {
  let dataType = typeof(val);
  switch(dataType) {
    case 'number':  // 数字
      return isNaN(val);
    case 'string':  // 字符串
      return val === '';
    case 'boolean': // 布尔值
      return false;
    case 'object':  // 对象
      if(!val) {  // 为null
        return true;
      } else {
        for(let key in val) { // 非空对象
          return false;
        }
        return true;
      }
    case 'function':  // 函数
      return false;
    case 'undefined': // undefined
      return true;
  }
};

// 判断是否存在
const isExist = val => {
  let dataType = typeof(val);
  switch(dataType) {
    case 'number':  // 数字
      return !isNaN(val);
    case 'string':  // 字符串
      return true;
    case 'boolean': // 布尔值
      return true;
    case 'object':  // 对象
      return !!val;
    case 'function':  // 函数
      return true;
    case 'undefined': // undefined
      return false;
  }
};

// 判断是否数字
const isNum = num => {
  return !isNaN(parseFloat(num) && Number(num));
};

// 判断是否百分数
const isPercent = str => {
  return /^((\d+\.?\d*)|(\d*\.\d+))\%$/.test(str);
};

// 判断是否文本（即可见字符，包括文字、字母、数字、符号等的有序组合）
const isText = val => {
  let dataType = typeof(val);
  switch(dataType){
    case 'number':  // 数字
      return !isNaN(val);
    case 'string':  // 字符串
      return val !== '';
    default: // 其他
      return false;
  }
};

// 判断是否对象
const isObject = obj => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

// 判断是否非空对象
const isNotEmptyObject = obj => {
  if(isObject(obj)) {
    for(let key in obj){
      return true;
    }
  }
  return false;
};

// 判断是否数组
const isArray = arr => {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

// 判断是否非空数组
const isNotEmptyArray = arr => {
  return isArray(arr) && arr.length > 0;
};

// 判断是否矩阵（即二维数组）
const isMATRIX = mat => {
  if (isArray(mat)) {
    for (let v of mat) {
      if (isArray(v)) {
        return true;
      }
    }
  }
  return false;
};

// 判断是否JSON字符串
const isJSONStr = str => {
  if (typeof(str) === 'string' && !isNum(str)) {
    try {
      JSON.parse(str);
      return true;
    } catch(e) {
      return false;
    }
  }
  return false;
};

// 判断是否BOOLEAN字符串
const isBOOLEANStr = str => {
  if (typeof(str) === 'string' && !isNum(str)) {
    try {
      return str === 'true' || str === 'false';
    } catch(e) {
      return false;
    }
  }
  return false;
};

// 判断是否两个相等的值（strict表示是否判断完全相等，默认值为true。若strict为true，则两个值数据类型和值都相等才相等；若为false，则两个值为数字或空时，数据类型不相等也可以相等）
const isEqual = (val1, val2, strict) => {
  strict = typeof(strict) === 'boolean' ? strict : true;
  if(isObject(val1) && isObject(val2)) {
    if(Object.keys(val1).length !== Object.keys(val2).length) {
      return false;
    }
    for (let k in val1) {
      if (val1.hasOwnProperty(k)) {
        if (!isEqual(val1[k], val2[k])) {
          return false;
        }
      }
    }
  } else if (isArray(val1) && isArray(val2)) {
    if(val1.length !== val2.length) {
      return false;
    }
    val1 = [].concat(val1).sort();
    val2 = [].concat(val2).sort();
    for (let i = 0, length = val1.length; i < length; i++) {
      if (!isEqual(val1[i], val2[i])) {
        return false;
      }
    }
  } else {
    if(strict) {
      return val1 === val2;
    } else {
      if(isNum(val1) && isNum(val2)) {
        return Number(val1) === Number(val2);
      } else if(isEmpty(val1) && isEmpty(val2)) {
        if(typeof(val1) === 'undefined'
          || typeof(val2) === 'undefined'
          || typeof(val1) === 'object' && !val1
          || typeof(val2) === 'object' && !val2) {
          return true;
        } else if(typeof(val1) === 'number') {
          if(typeof(val2) === 'number' || typeof(val2) === 'string') {
            return true;
          }
        } else if(typeof(val1) === 'string') {
          if(typeof(val2) === 'string' || typeof(val2) === 'number') {
            return true;
          }
        } else if(isObject(val1)) {
          if(isObject(val2)) {
            return true;
          }
        } else if(isArray(val1)) {
          if(isArray(val2)) {
            return true;
          }
        }
        return false;
      } else {
        return val1 === val2;
      }
    }
  }
  return true;
};

// 判断字符串是否以指定的子字符串开始
const isStartsWith = (str, searchValue) => {
  return new RegExp('^' + searchValue).test(str);
};

// 判断字符串是否以指定的子字符串结尾
const isEndsWith = (str, searchValue) => {
  return new RegExp(searchValue + '$').test(str);
};

// 判断字符串是否为encodeURIComponent编码格式
const isEncodeURIComponent = str => {
  if (typeof(str) === 'string' && !isNum(str)) {
    try {
      return decodeURIComponent(str) !== str;
    } catch(e) {
      return false;
    }
  }
  return false;
};

// 判断字符串是否为encodeURI编码格式
const isEncodeURI = str => {
  if (typeof(str) === 'string' && !isNum(str)) {
    try {
      return decodeURI(str) !== str;
    } catch(e) {
      return false;
    }
  }
  return false;
};

// 判断字符串是否为escape编码格式
const isEscape = str => {
  if (typeof(str) === 'string' && !isNum(str)) {
    try {
      return unescape(str) !== str;
    } catch(e) {
      return false;
    }
  }
  return false;
};

// 判断字符串是否为base64编码格式
const isBase64 = str => {
  return /^\s*data:([a-z]+\/[a-z0-9-+.]+(;[a-z-]+=[a-z0-9-]+)?)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i.test(str);
};

// 判断字符串是否为utf8编码格式
const isUft8 = str => {
  return /^[\u0020-\u007e\u00a0-\u00ff\u2000-\u206f\u20a0-\u20b9\u2100-\u214f\u2190-\u21ff\u2200-\u22ff\u2500-\u257f\u2580-\u259f\u25a0-\u25ff\u2600-\u26ff\u2700-\u27bf\u2e80-\u2eff\u2f00-\u2fdf\u3000-\u303f\u31c0-\u31ef\u3200-\u32ff\u3300-\u33ff\u3400-\u4db5\u4e00-\u9fa5\u9fa6-\u9fbb\uf900-\ufa2d\ufa30-\ufa6a\ufe10-\ufe1f\ufe30-\ufe4f\uff00-\uffef]+$/.test(str);
};

// 判断是否URL
const isURL = str => {
  return /^([A-Za-z][A-Za-z\d\+\-\.]*:)?\/\//.test(str);
};

// 判断是否绝对路径
const isAbsolutePath = str => {
  return /(^[\/\\].*)|(^([A-Za-z][A-Za-z\d\+\-\.]*:)?[\/\\])/.test(str);
};

// 数字格式化（每隔3位整数加逗号，并保留小数点后fix位，fix默认为空，表示返回数字小数位数不变）
const numFtt = (num, fix) => {
  if(isNum(num)) {
    if(isNum(fix)) {
      return Number(num).toFixed(fix).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    } else {
      return (num + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
    }
  }
};

// 数位格式化（数字位数不够fix位，前面补零，fix默认为空，表示返回数字不补零）
const digitFtt = (num, fix) => {
  if(isNum(num)) {
    if(String(num).length > fix) return num.toString();
    return (Array(fix).join('0') + num).slice(-fix);
  }
};

// 向上保留小数（fix为目标小数位，fix默认为2，只要目标小数位后有有效数字就进1，保证计算后的数值一定不小于原数值）
const upFixed = (num, fix) => {
  if(isNum(num)) {
    let result;
    fix = isNum(fix) ? Number(fix) : 2;
    num = num + '';
    if (/e/.test(num)) { // 如果是包含e字符的数字直接返回
      result = num;
    } else {
      if(fix > 0) {
        if (!/\./.test(num)) { // 如果没有小数点
          result = num + `.${Array(fix + 1).join('0')}`;
        } else { // 如果有小数点
          num = num + `${Array(fix + 1).join('0')}`;
          let reg = new RegExp(`-?\\d*\\.\\d{0,${fix}}`);
          let floorStr = reg.exec(num)[0];
          if (Number(floorStr) >= Number(num)) {
            result = floorStr;
          } else {
            let floorNumber = +floorStr + +`0.${Array(fix).join('0')}1`;
            let point = /\./.test(floorNumber + '') ? '' : '.';
            let floorStr2 = floorNumber + point + `${Array(fix + 1).join('0')}`;
            result = reg.exec(floorStr2)[0];
          }
        }
      } else {
        result = Math.ceil(num);
      }
    }
    return Number(result);
  }
};

// 向下保留小数（fix为目标小数位，fix默认为2，目标小数位后的数字直接舍弃，保证计算后的数值一定不大于原数值）
const downFixed = (num, fix) => {
  if(isNum(num)) {
    let result;
    fix = isNum(fix) ? Number(fix) : 2;
    num = num + '';
    if (/e/.test(num)) { // 如果是包含e字符的数字直接返回
      result = num;
    } else {
      if(fix > 0) {
        if (!/\./.test(num)) { // 如果没有小数点
          result = num + `.${Array(fix + 1).join('0')}`;
        } else { // 如果有小数点
          num = num + `${Array(fix + 1).join('0')}`;
          let reg = new RegExp(`-?\\d*.\\d{0,${fix}}`);
          result = reg.exec(num)[0];
        }
      } else {
        result = Math.floor(num);
      }
    }
    return Number(result);
  }
};

// 数字转大写英文字母
const numToLetter = num => {
  if(isNum(num)) {
    let Letters = [];
    for (let i = 0; i < 26; i++){
      Letters.push(String.fromCharCode(i+65));
    }
    return Letters[num%26];
  }
};

// 小数转百分数(保留小数点后fix位，fix默认为0)
const decimalToPercent = (num, fix) => {
  if(isNum(num)) {
    return Number(num * 100).toFixed(fix) + '%';
  }
};

// 百分数转小数
const percentToDecimal = percent => {
  if(isPercent(percent)) {
    return percent.replace('%', '') / 100;
  }
};

// 字符串转布尔类型（除了true、'true'会被转换成true，其他值都会转换成false）
const parseBoolean = str => {
  return !!(str && (str === true || str === 'true'));
};

// 其他值转布尔类型（除了undefined、null、''、NaN、0、-0会被转换成false，其他值都会转换成true）
const toBoolean = val => {
  return !!val;
};

// 对象转FormData格式
const objToFormData = obj => {
  let formData = new FormData();
  if(isObject(obj)) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (isArray(obj[key])) {
          obj[key].map(item => {
            formData.append(key, item)
          })
        } else if (obj[key] instanceof FileList) {
          // FileList文件类型的处理
          for (let fileItem = 0; fileItem < obj[key].length; fileItem++) {
            formData.append(key, obj[key].item(fileItem))
          }
        } else if(isExist(obj[key])) {
          formData.append(key, obj[key])
        }
      }
    }
  }
  return formData;
};

// 对象转URL参数（strict表示是否完全转换，默认值为false。若strict为true，则会将对象或数组属性进行字符串转换和URI编码；若为false，则只将对象或数组属性进行隐式转换和URI编码）
const objToParameter = (obj, strict) => {
  let URLParameters = '';
  if(!isObject(obj)) {
    obj = parameterToObj(obj);
  }
  if(!isEmpty(obj)) {
    let arr = [];
    for (let attr in obj) {
      if (obj.hasOwnProperty(attr)) {
        let val = toJSONObj(obj[attr]);
        if(isExist(val)) {
          if(strict && typeof(val) === 'object') {
            arr.push(`${attr}=${encodeURIComponent(JSON.stringify(val))}`);
          } else if(isEncodeURIComponent(val)) {
            arr.push(`${attr}=${val}`);
          } else if(isEncodeURI(val)) {
            arr.push(`${attr}=${val}`);
          } else if(isEscape(val)) {
            arr.push(`${attr}=${val}`);
          } else {
            arr.push(`${attr}=${escapeURL(val)}`);
          }
        }
      }
    }
    if(arr.length > 0) {
      URLParameters = arr.join('&');
    }
  }
  return URLParameters;
};

// URL参数转对象
const parameterToObj = url => {
  if(typeof(url) === 'string' && url) {
    let arr;
    if(url.split('?')[1]) {
      // 先通过?分解得到?后面的所需字符串，再将其通过&分解开存放在数组里
      arr = url.split('?')[1].split('&');
    }else {
      arr = url.split('&');
    }
    let obj = {};
    for (let e of arr) {
      // 对数组每项用=分解开，=前为对象属性名，=后为属性值
      let attr = e.split('=')[0];
      let val = e.split('=')[1];
      if(isExist(val)) {
        if(isEncodeURIComponent(val)) {
          val = decodeURIComponent(val);
        } else if(isEncodeURI(val)) {
          val = decodeURI(val);
        } else if(isEscape(val)) {
          val = unescape(val);
        }
        if(isJSONStr(val)) {
          val = JSON.parse(val);
        }
        if(isStartsWith(attr, '\\$')) {
          if($crypto.isAesEncryptNetworkData(val) && $crypto.isSm4EncryptNetworkData(val)) {
            if(appEnv.encryptMETHOD === 'aes') {
              obj[attr.slice(1)] = $crypto.aesDecryptNetworkData(val);
            } else if(appEnv.encryptMETHOD === 'sm4') {
              obj[attr.slice(1)] = $crypto.sm4DecryptNetworkData(val);
            } else {
              obj[attr.slice(1)] = val;
            }
          } else if($crypto.isAesEncryptNetworkData(val)) {
            obj[attr.slice(1)] = $crypto.aesDecryptNetworkData(val);
          } else if($crypto.isSm4EncryptNetworkData(val)) {
            obj[attr.slice(1)] = $crypto.sm4DecryptNetworkData(val);
          } else {
            obj[attr.slice(1)] = val;
          }
        }
        obj[attr] = val;
      }
    }
    return obj;
  }
};

// JSON字符串转JSON对象
const toJSONObj = val => {
  if(isJSONStr(val)) {
    return JSON.parse(val);
  }
  return val;
};

// 其他类型转JSON字符串
const toJSONStr = val => {
  if(!isJSONStr(val)) {
    return JSON.stringify(val);
  }
  return val;
};

// Uint8Array对象转JSON对象
const uint8ArrayToJson = array => {
  if(array) {
    // 解决中文乱码
    let str = uint8ArrayToString(array);
    // 有中文乱码
    // let str = String.fromCharCode.apply(null, array);
    if(!isJSONStr(str)) {
      return str;
    }
    return JSON.parse(str);
  }
};

// Uint8Array对象转字符串
const uint8ArrayToString = array => {
  if(array) {
    let res = '';
    // 解决中文乱码
    let len = array.length;
    let i = 0;
    let c1, c2, c3;
    while (i < len) {
      c1 = array[i++];
      switch (c1 >> 4) {
        case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
          res += String.fromCharCode(c1);
          break;
        case 12: case 13:
          c2 = array[i++];
          res += String.fromCharCode(((c1 & 0x1F) << 6) | (c2 & 0x3F));
          break;
        case 14:
          c2 = array[i++];
          c3 = array[i++];
          res += String.fromCharCode(((c1 & 0x0F) << 12) |
            ((c2 & 0x3F) << 6) |
            ((c3 & 0x3F) << 0));
          break;
      }
    }
    // 有中文乱码
    /*for (let i = 0; i < array.length; i++) {
      res += String.fromCharCode(array[i]);
    }*/
    return res;
  }
};

// 数组元素分割成字符串（数组以sep分割，sep默认为'，'）
const arraySplit = (array, sep) => {
  let str = '';
  if(isArray(array)) {
    sep = sep || '，';
    array.forEach((v, i) => {
      if(i < (array.length - 1)) {
        str += v + sep;
      } else {
        str += v;
      }
    });
  } else {
    str = array;
  }
  return str;
};

// 数组元素拼接成字符串（数组以sep拼接，sep默认为空）
const arrayJoin = (array, sep) => {
  let str = '';
  if(isArray(array)) {
    str = array.join(sep);
  } else {
    str = array;
  }
  return str;
};

// 数组按某个字段分组（attr为要分组的属性名，支持深层属性名，如a.b.c）
const arrayGroup = (array, attr) => {
  if(isArray(array)) {
    let fieldList = [];
    let groupList = [];
    // 获取数组指定字段值，并去重
    array.map(val => {
      if(fieldList.indexOf(getValueOfDeepObj(val, attr)) === -1) {
        fieldList.push(getValueOfDeepObj(val, attr))
      }
    });
    for(let i = 0; i < fieldList.length; i++) {
      // 过滤出匹配到的数据
      let arr = array.filter(val => {
        return getValueOfDeepObj(val, attr) === fieldList[i];
      });
      groupList.push({
        type: fieldList[i],
        data: arr
      });
    }
    return groupList;
  }
};

// 数组按某个字段排序（attr为要排序的属性名， 支持深层属性名，如a.b.c）
const arraySort = (array, attr) => {
  if(isArray(array)) {
    let result = JSON.parse(JSON.stringify(array));
    return result.sort((a, b) => {
      return getValueOfDeepObj(a, attr) - getValueOfDeepObj(b, attr);
    });
  }
};

// 数组按中文拼音分类排序（attr为要排序的属性名， 支持深层属性名，如a.b.c）
const arrayPinyinSort = (array, attr) => {
  if(!String.prototype.localeCompare)
    return null;

  const letters = '*abcdefghjklmnopqrstwxyz'.split('');
  const zh = '啊把差大额发噶哈级卡啦吗那哦爬器然啥他哇西呀咋'.split('');

  let result = [];
  let curr;
  letters.forEach((e, i) => {
    curr = {letter: e, data:[]};
    array.forEach(e => {
      let o = Object(getValueOfDeepObj(e, attr));
      if ((!zh[i-1] || zh[i-1].localeCompare(o) <= 0) && o.localeCompare(zh[i]) === -1) {
        curr.data.push(e);
      }
    });
    if (curr.data.length) {
      result.push(curr);
      curr.data.sort((a, b) =>{
        return a.localeCompare(b);
      });
    }
  });
  return result;
};

// 其他类型转数组（将元素放入新的数组中，并返回结果）
const toArray = val => {
  let arr = [];
  if(isArray(val)) {
    arr = arr.concat(val);
  } else if(isExist(val)) {
    arr.push(val);
  }
  return arr;
};

// 对象数组转一维数组（key为要获取的属性名, 支持深层属性名，如a.b.c）
const objArrayToArray = (array, key) => {
  if(isArray(array)) {
    // 以对象数组的某个属性值为新的数组项，构造一维数组
    return array.map((item) => {
      return getValueOfDeepObj(item, key);
    });
  }
};

// 驼峰转连字符（连字符以sep分隔，sep默认为'-'）
const humpToHyphen = (str, sep) => {
  if(isText(str)) {
    sep = sep || '-';
    return (str + '').replace(/([A-Z])/g, sep+'$1').toLowerCase();
  }
};

// 连字符转驼峰（连字符以sep分隔，sep默认为'-'）
const hyphenToHump = (str, sep) => {
  if(isText(str)) {
    sep = sep || '-';
    return (str + '').replace(new RegExp('\\'+sep+'(\\w)', 'g'), function(all, letter) {
      return letter.toUpperCase();
    });
  }
};

// 树形结构主键属性名转父主键属性名
const treeKeyAttrToParentKeyAttr = (keyAttr, parentKeyAttrPrefix) => {
  if(isText(keyAttr)) {
    parentKeyAttrPrefix = parentKeyAttrPrefix || 'parent';
    let tempAttrs = keyAttr.split('.');
    let tempAttr = tempAttrs.slice(-1)[0];
    tempAttrs.splice(-1, 1, parentKeyAttrPrefix + tempAttr.charAt(0).toUpperCase() + tempAttr.slice(1));
    return tempAttrs.join('.');
  }
};

// 拉平树形结构中的所有节点（树形结构转普通结构）
const flattenTreeNode = (tree, keyAttr, parentKeyAttr, childKeyAttr) => {
  if(isArray(tree)) {
    keyAttr = keyAttr || 'id';
    parentKeyAttr = parentKeyAttr || treeKeyAttrToParentKeyAttr(keyAttr);
    childKeyAttr = childKeyAttr || 'children';
    let result = [];
    (function flatten(tree, parentKeyValue) {
      for(let i = 0, iLen = tree.length; i < iLen; i++) {
        let node = deepClone(tree[i]);
        if(!isEmpty(parentKeyValue)) {
          deepObjMerge(node, generateDeepObj(parentKeyAttr, parentKeyValue));
        }
        if(!isEmpty(getValueOfDeepObj(node, childKeyAttr))) {
          let keyValue = getValueOfDeepObj(node, keyAttr);
          let childKeyValue = getValueOfDeepObj(node, childKeyAttr);
          deleteDeepObj(node, childKeyAttr);
          result.push(node);
          flatten(childKeyValue, keyValue);
        } else {
          deleteDeepObj(node, childKeyAttr);
          result.push(node);
        }
      }
    })(tree);
    return result;
  }
};

// URL特殊字符转义编码
const escapeURL = str => {
  str += ''; // 隐式转换
  str = str.replace(/\#/g, '%23');
  str = str.replace(/\%/g, '%25');
  str = str.replace(/\&/g, '%26');
  str = str.replace(/\+/g, '%2B');
  str = str.replace(/\//g, '%2F');
  str = str.replace(/\\/g, '%5C');
  str = str.replace(/\=/g, '%3D');
  str = str.replace(/\?/g, '%3F');
  str = str.replace(/\ /g, '%20');
  str = str.replace(/\./g, '%2E');
  str = str.replace(/\:/g, '%3A');
  return str;
};

// URL转义编码解析符号
const unescapeURL = str => {
  str += ''; // 隐式转换
  str = str.replace(/%23/g, '#');
  str = str.replace(/%25/g, '%');
  str = str.replace(/%26/g, '&');
  str = str.replace(/%2B/g, '+');
  str = str.replace(/%2F/g, '/');
  str = str.replace(/%5C/g, '\\');
  str = str.replace(/%3D/g, '=');
  str = str.replace(/%3F/g, '?');
  str = str.replace(/%20/g, ' ');
  str = str.replace(/%2E/g, '.');
  str = str.replace(/%3A/g, ':');
  return str;
};

// Unicode编码（中、英文、数字转Unicode编码）
const toUnicode = str => {
  if(isExist(str)) {
    if(typeof(str) !== 'string') {
      str = toJSONStr(str);
    }
    let res = [];
    for(let i = 0;i < str.length;i++) {
      res[i]=('00' + str.charCodeAt(i).toString(16)).slice(-4);
    }
    return res.length > 0 ? '\\u'+res.join('\\u') : '';
  }
};

// Unicode解码（Unicode编码转中、英文、数字）
const unUnicode = str => {
  if(isExist(str)) {
    return toJSONObj(unescape(str.replace(/\\/g, '%')));
  }
};

// 姓名脱敏
const replaceNameX = name => {
  if(isText(name)) {
    if(name.length <= 3){
      return "*" + name.substring(1,name.length);
    } else if(name.length > 3 && name.length <= 6){
      return "**" + name.substring(2,name.length);
    } else if(name.length > 6){
      return name.substring(0,2) + "****" + name.substring(6,name.length)
    }
    // return name.replace(/([\u4E00-\u9FA5]{1})([\u4E00-\u9FA5]+)$/, '$1**');
  }
};

// 身份证号脱敏
const replaceIdcardX = idCard => {
  if(isText(idCard)) {
    if(idCard.length === 15){
      return (idCard + '').replace(/(\d{6})\d{6}(\d{3})/, '$1******$2');
    } else {
      return (idCard + '').replace(/(\d{5})\d{6}(\d{6})/, '$1******$2');
    }
  }
};

// 手机号脱敏
const replaceTelX = tel => {
  if(isText(tel)) {
    return (tel + '').replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2');
  }
};

/**
 * 生成UUID
 * @param len 长度
 * @param radix 基数 2进制 8进制 10进制 16进制
 * @returns uuid
 * 调用：let uuidstr = uuid(32,16);// 生成32位长度的基数为16进制的uuid
 *  7FEA14A4722E273EE28C3F72E9E9141F
 */
const uuid = (len, radix) => {
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let uuid = [], i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
  } else {
    // rfc4122, version 4 form
    let r;
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random()*16;
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
};

// 生成从minNum到maxNum的随机数
const randomNum = (minNum, maxNum) => {
  if(!isNaN(parseInt(minNum)) && !isNaN(parseInt(maxNum))) {
    return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
  } else if (!isNaN(parseInt(minNum))) {
    return parseInt(Math.random() * minNum + 1, 10);
    // 或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
  } else {
    return 0;
  }
};

// 根据深层属性名生成对象（attr为要生成的深层属性名，如a.b.c）
const generateDeepObj = (attr, val) => {
  if(isText(attr)) {
    let attrs = attr.split('.');
    let len = attrs.length;
    let obj = {};
    attrs.reduce((prev, curr, index) => {
      if(index < (len - 1)) {
        prev[curr] = {};
        return prev[curr];
      } else {
        prev[curr] = val;
      }
    }, obj);
    return obj;
  }
};

// 生成树形结构
const generateTree = (array, keyAttr, parentKeyValue, parentKeyAttr, childKeyAttr) => {
  if(isArray(array)) {
    keyAttr = keyAttr || 'id';
    parentKeyAttr = parentKeyAttr || treeKeyAttrToParentKeyAttr(keyAttr);
    childKeyAttr = childKeyAttr || 'children';
    return (function generate(parentKeyValue) {
      let child;
      if(!isEmpty(parentKeyValue)) {
        child = array.filter(item => getValueOfDeepObj(item, parentKeyAttr) === parentKeyValue);
      } else {
        child = array.filter(item => isEmpty(getValueOfDeepObj(item, parentKeyAttr)));
      }
      if(child && child.length > 0) {
        return child.map(item => {
          let curr = deepClone(item);
          let childKeyValue = generate(getValueOfDeepObj(curr, keyAttr));
          deepObjMerge(curr, generateDeepObj(childKeyAttr, childKeyValue));
          return curr;
        })
      } else {
        return null;
      }
    })(parentKeyValue);
  }
};

// 合并两个深层对象
const deepObjMerge = (obj1, obj2) => {
  obj1 = obj1 || {};
  for (let i in obj2) {
    if (obj2.hasOwnProperty(i)) {
      obj1[i] = obj1[i] && Object.prototype.toString.call(obj1[i]) === '[object Object]'
        ? deepObjMerge(obj1[i], obj2[i])
        : obj2[i];
    }
  }
  return obj1;
};

// 深拷贝多维数组或对象
const deepClone = obj => {
  if(isObject(obj) || isArray(obj)) {
    // 创建一个新对象
    let result = isArray(obj) ? [] : {},
      temp = null,
      key = null;
    let keys = Object.keys(obj);
    keys.map((item, index) => {
      key = item;
      temp = obj[key];
      // 如果字段的值也是一个对象则递归操作
      if (typeof(temp) === 'object' && temp) {
        result[key] = deepClone(temp);
      } else {
        result[key] = temp;
      }
    });
    return result
  }
  return obj;
};

// 向URL追加参数
const appendParameterToURL = (url, params) => {
  if(!isEmpty(params)) {
    let parameter = objToParameter(params, true);
    if(!isEmpty(parameter)) {
      url += (url.split('?')[1] ? '&' : '?') + parameter;
    }
  }
  return url;
};

// 获取字符串的前缀（获取从开头到首次flag出现的位置，不包含flag）
const getPrefix = (str, flag) => {
  if(str) {
    flag = flag || '.';
    let index = str.indexOf(flag);
    if (index > -1 && index < (str.length - 1)) {
      return str.substr(0, index);
    }
  }
};

// 获取字符串的后缀（获取从最后一次flag出现的位置到末尾，不包含flag）
const getSuffix = (str, flag) => {
  if(str) {
    flag = flag || '.';
    let index = str.lastIndexOf(flag);
    if (index > -1 && index < (str.length - 1)) {
      return str.substr(index+1);
    }
  }
};

// 获取字符串中的所有括号里的内容
const getParenthesesContent = str => {
  if(str) {
    return str.match(/[^\(\)]+(?=\))/g);
  }
};

// 获取数字数组的平均值
const getAverage = array => {
  if(array && array.length > 0) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum = sum + Number(array[i]);
    }
    return sum / array.length;
  }
};

// 获取数字数组的最大值
const getMax = array => {
  if(array && array.length > 0) {
    let arr = JSON.parse(JSON.stringify(array));
    return arr.sort((a, b) => {
      return a-b;
    })[arr.length-1]-0;
  }
};

// 获取深层对象中的属性值（key为要获取的深层属性名，如a.b.c）
const getValueOfDeepObj = (obj, key) => {
  if(isText(key)) {
    let keys = key.split('.');
    return keys.reduce((prev, curr) => {
      if(prev && typeof(prev[curr]) !== 'undefined') {
        return prev[curr];
      }
    }, obj);
  }
  return obj;
};

// 获取树形结构中的某个节点
const getTreeNode = (tree, keyValue, keyAttr, childKeyAttr) => {
  if(isArray(tree)) {
    keyAttr = keyAttr || 'id';
    childKeyAttr = childKeyAttr || 'children';
    return (function find(tree) {
      for(let i = 0, iLen = tree.length; i < iLen; i++) {
        if(getValueOfDeepObj(tree[i], keyAttr) === keyValue) {
          return tree[i];
        } else {
          let treeChildren = getValueOfDeepObj(tree[i], childKeyAttr);
          if(isArray(treeChildren)) {
            let findNode = find(treeChildren);
            if(isExist(findNode)) {
              return findNode;
            }
          }
        }
      }
    })(tree);
  }
};

// 获取树形结构中某个节点的所有父节点
const getParentTreeNodeAll = (tree, keyValue, keyAttr, parentKeyAttr, childKeyAttr) => {
  if(isArray(tree)) {
    let result = [];
    keyAttr = keyAttr || 'id';
    parentKeyAttr = parentKeyAttr || treeKeyAttrToParentKeyAttr(keyAttr);
    childKeyAttr = childKeyAttr || 'children';
    let flattenTree = flattenTreeNode(tree, keyAttr, parentKeyAttr, childKeyAttr);
    (function find(flattenTree, value) {
      for(let i = 0, iLen = flattenTree.length; i < iLen; i++) {
        if (getValueOfDeepObj(flattenTree[i], keyAttr) === value) {
          if(value !== keyValue) {
            result.unshift(flattenTree[i]);
          }
          find(flattenTree, getValueOfDeepObj(flattenTree[i], parentKeyAttr));
        }
      }
    })(flattenTree, keyValue);
    return result;
  }
};

// 提取字符串中的数字
const extractNumber = str => {
  if(isText(str)) {
    return (str + '').replace(/[^0-9]/ig, '');
  } else if(str === '') {
    return str;
  }
};

// 提取地址中的行政区(如：省市区)
const extractRegion = str => {
  if(isText(str)) {
    let obj = {
      province: '',
      city: '',
      district: ''
    };
    let arr = (str + '').match(/.+?(省|市|自治区|自治州|盟|区|县|旗)/g);
    if(arr && arr.length > 0) {
      const provinceReg = /^((?!省|自治区).)*$/;
      const cityReg = /^((?!市|盟|自治州|地区|北京|天津|上海|重庆|香港|澳门).)*$/;
      const districtReg = /^((?!区|县|旗|市).)*$/;
      if (!provinceReg.test(arr[0])) {
        obj.province = arr[0];
        if(!cityReg.test(arr[1])) {
          obj.city = arr[1];
          if(!districtReg.test(arr[2])) {
            obj.district = arr[2];
          }
        }
      } else if(!cityReg.test(arr[0])) {
        obj.city = arr[0];
        if(!districtReg.test(arr[1])) {
          obj.district = arr[1];
        }
      } else if(!districtReg.test(arr[0])) {
        if(/^((?!小区|社区|校区|[A-Za-z]|[0-9]).)*$/.test(arr[0])) {
          obj.district = arr[0];
        }
      }
    }
    return obj;
  } else if(str === '') {
    return str;
  }
};

// 去除字符串前缀（去除从开头到首次flag出现的位置，包含flag）
const removePrefix = (str, flag) => {
  if (isText(str)) {
    flag = flag || '.';
    let index = (str + '').indexOf(flag);
    if (index > -1 && index <= ((str + '').length - 1)) {
      return (str + '').substring(index+1);
    }
    return str;
  } else if(str === '') {
    return str;
  }
};

// 去除字符串后缀（去除从最后一次flag出现的位置到末尾，包含flag）
const removeSuffix = (str, flag) => {
  if (isText(str)) {
    flag = flag || '.';
    let index = (str + '').lastIndexOf(flag);
    if (index > -1 && index <= ((str + '').length - 1)) {
      return (str + '').substring(0, index);
    }
    return str;
  } else if(str === '') {
    return str;
  }
};

// 去除字符串开头的一段字符
const removeCharacterStart = (str, character) => {
  if(isText(str)) {
    if((str + '').indexOf(character) === 0) {
      return (str + '').replace(new RegExp(character), '');
    }
    return str;
  } else if(str === '') {
    return str;
  }
};

// 去除字符串中的一段字符（attributes包括"g"、"i"、"gi"和"m"，分别用于指定全局匹配、忽略大小写匹配、全局忽略大小写匹配和多行匹配）
const removeCharacter = (str, character, attributes) => {
  if(isText(str)) {
    if(attributes) {
      return (str + '').replace(new RegExp(character, attributes), '');
    } else {
      return (str + '').replace(new RegExp(character), '');
    }
  } else if(str === '') {
    return str;
  }
};

// 去除URL参数
const removeParameter = url => {
  if(isText(url)) {
    if((url + '').indexOf('?') !== -1) {
      return (url + '').replace(/(\?|#)[^'"]*/, '');
    }
    return url;
  } else if(url === '') {
    return url;
  }
};

// 去除字符串头尾空格
const trim = str => {
  if(isText(str)) {
    return (str + '').replace(/(^\s*)|(\s*$)/g, '');
  } else if(str === '') {
    return str;
  }
};

// 去除字符串中的所有括号字符（只去除()，不包括()里内容）
const trimParentheses = str => {
  if(isText(str)) {
    return (str + '').replace('(', '').replace(')', '');
  } else if(str === '') {
    return str;
  }
};

// 去除字符串中的所有括号及括号里的内容（去除()，包括()里内容）
const trimParenthesesContent = str => {
  if(isText(str)) {
    return (str + '').replace(/\([^\)]*\)/g, '');
  } else if(str === '') {
    return str;
  }
};

// 删除深层对象中的某个属性（attr为要删除的深层属性名，如a.b.c）
const deleteDeepObj = (obj, attr) => {
  if(isText(attr)) {
    let attrs = (attr + '').split('.');
    let len = attrs.length;
    attrs.reduce((prev, curr, index) => {
      if(index < (len - 1)) {
        return prev[curr];
      } else {
        delete prev[curr];
      }
    }, obj);
  }
  return obj;
};

// 清除对象中的未定义属性（只清除undefined）
const clearObjUndef = obj => {
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      if(typeof(obj[k]) === 'undefined') {
        delete obj[k];
      }
    }
  }
  return obj;
};

// 清除对象中的无效属性（清除undefined、null、NaN）
const clearObjNull = obj => {
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      if(!isExist(obj[k])) {
        delete obj[k];
      }
    }
  }
  return obj;
};

// 清除对象中的空属性（清除undefined、null、NaN、''、{}、[]）
const clearObjEmpty = obj => {
  for (let k in obj) {
    if (obj.hasOwnProperty(k)) {
      if(isEmpty(obj[k])) {
        delete obj[k];
      }
    }
  }
  return obj;
};

// 异步过滤数组中符合条件的所有元素，并返回新的数组（js中.filter()方法的异步版本）
const asyncFilter = async (array, predicate) => {
  const results = await Promise.all(array.map(predicate));
  return array.filter((_v, index) => results[index]);
};

// 异步调用函数处理数组中的值，并返回新的数组（js中.map()方法的异步版本）
const asyncMap = async (array, predicate) => {
  return await Promise.all(array.map(predicate));
};

// 防抖函数（在某个等待间隔时间wait内，只执行最后一次，immediate表示是否立即执行，默认为false）
const debounce = (func, wait, immediate) => {
  if(typeof(func) === 'function') {
    wait = wait || 300;
    let timer = null;
    return () => {
      if(timer) {
        clearTimeout(timer);
        timer = null;
      }
      if(immediate) {
        let callNow = !timer;
        timer = setTimeout(() => {
          if(timer) {
            clearTimeout(timer);
            timer = null;
          }
        }, wait);
        if(callNow) {
          func();
        }
      } else {
        timer = setTimeout(() => {
          func();
          if(timer) {
            clearTimeout(timer);
            timer = null;
          }
        }, wait);
      }
    }
  }
};

// 节流函数（每延迟间隔一段delay时间，执行一次，immediate表示是否立即执行，默认为false）
const throttle = (func, delay, immediate) => {
  if(typeof(func) === 'function') {
    delay = delay || 300;
    let timer = null;
    let oldTime = Date.now();
    return () => {
      if(immediate) {
        let newTime = Date.now();
        if(newTime - oldTime >= delay) {
          func();
          oldTime = Date.now();
        }
      } else {
        if(!timer) {
          timer = setTimeout(() => {
            func();
            if(timer) {
              clearTimeout(timer);
              timer = null;
            }
          }, delay);
        }
      }
    }
  }
};

// 精确节流函数
const preciseThrottle = (func, delay) => {
  if(typeof(func) === 'function') {
    delay = delay || 300;
    let timer = null;
    let startTime = Date.now();
    return () => {
      let currentTime = Date.now();
      let remaining = delay - (currentTime - startTime);
      if(timer) {
        clearTimeout(timer);
        timer = null;
      }
      if(remaining <= 0) {
        func();
        startTime = Date.now();
      } else {
        timer = setTimeout(() => {
          func();
          if(timer) {
            clearTimeout(timer);
            timer = null;
          }
        }, remaining);
      }
    }
  }
};

// 数组转字符串（字符串以sep分隔，sep默认为'，'）
const splitArray = (array, sep) => {
  if(array) {
    let str = '';
    sep = sep || '，';
    Object.keys(array).forEach(key => {
      str += array[key] + sep;
    });
    if (str.length > 0) {
      let index = str.lastIndexOf(sep);
      str = str.substring(0, index);
    }
    return str;
  }
};

/**
 *  从json中取出嵌套值
 * json 对象
 * keyStr 键字符串，如：a.b.c
 * defaultValue 默认值
 */ 
const getNestedValue = (json, keyStr,defaultValue) => {
  let result = defaultValue || '';
  let getValueFromNestedJson = (json, keyArr) => {
    if (!json || !keyArr || keyArr.length <= 0) {
      return result;
    }
    if (keyArr.length === 1) {
      return json[keyArr[0]];
    } 
    //
    else {
      let key = keyArr.shift();
      return getValueFromNestedJson(json[key], keyArr);
    }
  }
  if (json && isObject(json) && keyStr) {
    let keyArr = keyStr.split('.');
    result = getValueFromNestedJson(json, keyArr);
  }
  
  return result;
};

// 判断是否是纯空白字符串
const isBlank = str => {
  if (typeof str === 'string') {
    return !/\S/.test(str);
  }
  return false; // 如果不是字符串，则不是空白
};

// 判断字符串是否符合指定模式的字符串
const strLike = (str, pattern) => {
  var regex = new RegExp(pattern.replace(/%/g, '.*').replace(/_/g, '.'), '');
  return regex.test(str);
};

export default {
  // 判断是否为空
  isEmpty,
  // 判断是否存在
  isExist,
  // 判断是否数字
  isNum,
  // 判断是否百分数
  isPercent,
  // 判断是否文本（即可见字符，包括文字、字母、数字、符号等的有序组合）
  isText,
  // 判断是否对象
  isObject,
  // 判断是否非空对象
  isNotEmptyObject,
  // 判断是否数组
  isArray,
  // 判断是否非空数组
  isNotEmptyArray,
  // 判断是否矩阵（即二维数组）
  isMATRIX,
  // 判断是否JSON字符串
  isJSONStr,
  // 判断是否BOOLEAN字符串
  isBOOLEANStr,
  // 判断是否两个相等的值
  isEqual,
  // 判断字符串是否以指定的子字符串开始
  isStartsWith,
  // 判断字符串是否以指定的子字符串结尾
  isEndsWith,
  // 判断字符串是否是encodeURIComponent编码格式
  isEncodeURIComponent,
  // 判断字符串是否是encodeURI编码格式
  isEncodeURI,
  // 判断字符串是否是escape编码格式
  isEscape,
  // 判断字符串是否为base64编码格式
  isBase64,
  // 判断字符串是否为utf8编码格式
  isUft8,
  // 判断是否URL
  isURL,
  // 判断是否绝对路径
  isAbsolutePath,
  // 数字格式化（每隔3位整数加逗号，并保留指定位小数）
  numFtt,
  // 数位格式化（数字位数不够指定位数，前面补零）
  digitFtt,
  // 向上保留小数（只要目标小数位后有有效数字就进1，保证计算后的数值一定不小于原数值）
  upFixed,
  // 向下保留小数（目标小数位后的数字直接舍弃，保证计算后的数值一定不大于原数值）
  downFixed,
  // 数字转大写英文字母
  numToLetter,
  // 小数转百分数
  decimalToPercent,
  // 百分数转小数
  percentToDecimal,
  // 字符串转布尔类型（除了true、'true'会被转换成true，其他值都会转换成false）
  parseBoolean,
  // 其他类型转布尔类型（除了undefined、null、''、NaN、0、-0会被转换成false，其他值都会转换成true）
  toBoolean,
  // 对象转FormData格式
  objToFormData,
  // 对象转URL参数
  objToParameter,
  // URL参数转对象
  parameterToObj,
  // JSON字符串转JSON对象
  toJSONObj,
  // 其他类型转JSON字符串
  toJSONStr,
  // Uint8Array对象转JSON对象
  uint8ArrayToJson,
  // Uint8Array对象转字符串
  uint8ArrayToString,
  // 数组元素分割成字符串
  arraySplit,
  // 数组元素拼接成字符串
  arrayJoin,
  // 数组按某个字段分组
  arrayGroup,
  // 数组按某个字段排序
  arraySort,
  // 数组按中文拼音分类排序
  arrayPinyinSort,
  // 其他类型转数组（将元素放入新的数组中，并返回结果）
  toArray,
  // 对象数组转一维数组
  objArrayToArray,
  // 驼峰转连字符
  humpToHyphen,
  // 连字符转驼峰
  hyphenToHump,
  // 树形结构主键属性名转父主键属性名
  treeKeyAttrToParentKeyAttr,
  // 拉平树形结构中的所有节点（树形结构转普通结构）
  flattenTreeNode,
  // URL特殊字符转义编码
  escapeURL,
  // URL转义编码解析符号
  unescapeURL,
  // Unicode编码（中英文数字转Unicode编码）
  toUnicode,
  // Unicode解码（Unicode编码转中、英文、数字）
  unUnicode,
  // 姓名脱敏
  replaceNameX,
  // 身份证号脱敏
  replaceIdcardX,
  // 手机号脱敏
  replaceTelX,
  // 生成UUID
  uuid,
  // 生成从minNum到maxNum的随机数
  randomNum,
  // 根据深层属性名生成对象
  generateDeepObj,
  // 生成树形结构
  generateTree,
  // 合并两个深层对象
  deepObjMerge,
  // 深拷贝多维数组或对象
  deepClone,
  // 向URL追加参数
  appendParameterToURL,
  // 获取字符串的前缀
  getPrefix,
  // 获取字符串的后缀
  getSuffix,
  // 获取字符串中的所有括号里的内容
  getParenthesesContent,
  // 获取数字数组的平均值
  getAverage,
  // 获取数字数组的最大值
  getMax,
  // 获取深层对象中的属性值
  getValueOfDeepObj,
  // 获取树形结构中的某个节点
  getTreeNode,
  // 获取树形结构中某个节点的所有父节点
  getParentTreeNodeAll,
  // 提取字符串中的数字
  extractNumber,
  // 提取地址中的行政区
  extractRegion,
  // 去除字符串前缀
  removePrefix,
  // 去除字符串后缀
  removeSuffix,
  // 去除字符串开头的一段字符
  removeCharacterStart,
  // 去除字符串中的一段字符
  removeCharacter,
  // 去除URL参数
  removeParameter,
  // 去除字符串头尾空格
  trim,
  // 去除字符串中的所有()括号字符（只去除()，不包括()里内容）
  trimParentheses,
  // 去除字符串中的所有()括号内容（去除()，包括()里内容）
  trimParenthesesContent,
  // 删除深层对象中的某个属性（attr为要删除的深层属性名，如a.b.c）
  deleteDeepObj,
  // 清除对象中的未定义属性（只清除undefined）
  clearObjUndef,
  // 清除对象中的无效属性（清除undefined、null、NaN）
  clearObjNull,
  // 清除对象中的空属性（清除undefined、null、NaN、''、{}、[]）
  clearObjEmpty,
  // 异步过滤数组中符合条件的所有元素，并返回新的数组（js中.filter()方法的异步版本）
  asyncFilter,
  // 异步调用函数处理数组中的值，并返回新的数组（js中.map()方法的异步版本）
  asyncMap,
  // 防抖函数
  debounce,
  // 节流函数
  throttle,
  // 精确节流函数
  preciseThrottle,
  // 数组转字符串（字符串以sep分隔，sep默认为'，'）
  splitArray,
  // 从json中取出嵌套值
  getNestedValue,
  // 判断是否是纯空白字符串
  isBlank,
  // 判断字符串是否符合指定模式的字符串
  strLike,
};
