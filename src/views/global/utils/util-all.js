/**
 * 全局工具类
 */
import $global from "./../../../config/global";
import { validateIdCard } from "./../../../views/global/js/validate";
import Compressor from "compressorjs";

// 获取上一级的机构
const getParentOrgId = (orgId) => {
  let res = "";
  if (orgId && orgId.length === 12) {
    // 删除字符串后面的所有 0
    res = orgId.replace(/(0+)\b/, "");
    if (res) {
      if (res.length % 2 !== 0) {
        // 如果是奇数，则需要补 0
        res = res + "0";
      }
      if (res.length >= 2) {
        // 将最后两位换成 00
        res = res.substring(0, res.length - 2) + "00";
      }
      // 补齐后面的 0
      let zeroLen = 12 - res.length;
      if (zeroLen > 0) {
        for (let i = 0; i < zeroLen; i++) {
          res += "0";
        }
      }
    } else {
      // 如果是 12个0的情况，则直接返回12个0的原机构数据
      res = orgId;
    }
  }
  return res;
};

// 获取最简机构
const getSimpleOrgId = (orgId) => {
  let res = "";
  if (orgId && orgId.length === 12) {
    // 删除字符串后面的所有 0
    res = orgId.replace(/(0+)\b/, "");
    if (res) {
      if (res.length % 2 !== 0) {
        // 如果是奇数，则需要补 0
        res = res + "0";
      }
    } else {
      // 如果是 12个0的情况，则直接返回12个0的原机构数据
      res = orgId;
    }
  }
  return res;
};

// 获取机构级别
const getOrgIdLevel = (orgId) => {
  let res = "";
  if (orgId && orgId.length === 12) {
    // 省
    if (orgId.substring(0, 2) !== "00" && orgId.substring(2, 4) === "00") {
      res = "2";
    }
    // 市
    if (orgId.substring(2, 4) !== "00" && orgId.substring(4, 6) === "00") {
      res = "3";
    }
    // 旗县区
    if (orgId.substring(4, 6) !== "00" && orgId.substring(6, 8) === "00") {
      res = "4";
    }
    // 派出所
    if (orgId.substring(6, 8) !== "00" && orgId.substring(8, 12) === "0000") {
      res = "5";
    }
    // 责任区
    if (orgId.substring(8, 10) !== "00") {
      res = "6";
    }
    // 责任区
    if (orgId.substring(10, 12) !== "00") {
      res = "7";
    }
  }
  return res;
};

// 关注人员类型包含涉访人员
const hasSfryForZdrylx = (zdrylx) => {
  let res = false;
  if (zdrylx) {
    if (zdrylx instanceof Array) {
      zdrylx = zdrylx.toString();
    }
    if (zdrylx.indexOf($global.zdryLxType.zdsfry) > -1) {
      res = true;
    }
  }
  return res;
};

// 关注人员类型包含肇事精神病人
const hasZsjsbrForZdrylx = (zdrylx) => {
  let res = false;
  if (zdrylx) {
    if (zdrylx instanceof Array) {
      zdrylx = zdrylx.toString();
    }
    if (zdrylx.indexOf($global.zdryLxType.zszhjsbr) > -1) {
      res = true;
    }
  }
  return res;
};

// 群体类别包含退役人员涉访群体（大类或小类）
const hasTyrysfqtForQtlb = (qtlb) => {
  let res = false;
  if (qtlb) {
    if (qtlb instanceof Array) {
      qtlb = qtlb.toString();
    }
    if (qtlb.startsWith("05") || qtlb.indexOf(",05") > -1) {
      res = true;
    }
  }
  return res;
};

// 获取审批业务类型
const getApproveBusType = (type, sufStr, defaultStr) => {
  let res = defaultStr || "";
  if (type === $global.dictItem.approveBusType.lg) {
    res = "列管";
  }
  //
  else if (
    type === $global.dictItem.approveBusType.bg ||
    type === $global.dictItem.approveBusType.bgZjlx ||
    type === $global.dictItem.approveBusType.bgSfgyfz ||
    type === $global.dictItem.approveBusType.bgSfrq ||
    type === $global.dictItem.approveBusType.bgZszhlx ||
    type === $global.dictItem.approveBusType.bgZszhjb
  ) {
    res = "变更";
  }
  //
  else if (type === $global.dictItem.approveBusType.cg) {
    res = "撤管";
  }
  //
  else if (type === $global.dictItem.approveBusType.clx) {
    res = "撤销"; // 撤销关注人员类型
  }
  //
  else if (type === $global.dictItem.approveBusType.yj) {
    res = "移交";
  }
  return res + (sufStr || "");
};

// 获取父级机构与本级机构的拼接名称（只有派出所和责任区进行拼接）
const getParentOrgNameAndSelf = (parentOrgName, orgName) => {
  // 定义返回值，避免null的情况出现
  let res = orgName || "";
  // 本级机构有值才往下进行
  if (orgName) {
    // 本级机构有值且不包含派出所才进行拼接
    if (orgName.indexOf("派出所") < 0) {
      // 父级机构存在且父级机构为派出所才进行拼接操作，否则直接返回自身机构
      if (parentOrgName && parentOrgName.indexOf("派出所") > -1) {
        // 没有派出所，直接将派出所与责任区拼接显示即可
        res = parentOrgName + orgName;
      }
    }
  }
  return res;
};

// 获取文件后缀名
const getFileSufName = (fileName) => {
  let res = "";
  if (fileName) {
    if (fileName.lastIndexOf(".") < fileName.length - 1) {
      res = fileName
        .substring(fileName.lastIndexOf(".") + 1, fileName.length)
        .toLowerCase();
    }
  }
  return res;
};

// 替换中文姓名中间的错误的“·”符号
const getNameForDot = (name) => {
  let res = name;
  if (name) {
    res = name
      .replace(/　/g, "")
      .replace(/ /g, "")
      .replace(/•/g, "·")
      .replace(/．/g, "·")
      .replace(/·/g, "·");
  }
  return res;
};

/**
 * 树形结构转数组
 * @param treeData 树形数据
 * @param type 类型（type = 1：全部。type = 2：非叶子节点。type = 3：叶子节点）
 * @returns {Array} 返回数据
 */
const setTreeToArray = (treeData, type) => {
  if (!type) type = "1";
  let array = [];
  treeData.forEach((item) => {
    let loop = (data) => {
      // 添加所有节点
      if (type === "1") {
        array.push(data);
      }
      // 只加非叶子节点
      else if (type === "2") {
        if (!data.isLeaf) {
          array.push(data);
        }
      }
      // 只添加叶子节点
      else if (type === "3") {
        if (data.isLeaf) {
          array.push(data);
        }
      }
      // 获取该数据的子集，如果有子集，则再次调用循环获取满足条件的数据
      let child = data.children;
      if (child && child.length > 0) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i]);
        }
      }
    };
    loop(item);
  });
  return array;
};

// 获取最简群体类别编码
const getSimpleRyxlCode = (ryxl) => {
  let res = "";
  if (ryxl && ryxl.length === 6) {
    // 删除字符串后面的所有 0
    res = ryxl.replace(/(0+)\b/, "");
    if (res) {
      if (res.length % 2 !== 0) {
        // 如果是奇数，则需要补 0
        res = res + "0";
      }
    } else {
      // 如果是 6个0的情况，则直接返回6个0的原机构数据
      res = ryxl;
    }
  }
  return res;
};

// 根据优先级获取内容（优先户籍地，其次是现住地）
const getContentByPriority = (hjdContent, xzdContent) => {
  let res = "";
  if (hjdContent) {
    res = hjdContent;
  } else {
    res = xzdContent;
  }
  return res;
};

// 获取派出所最简名称（即派出所名称不包含派出所字样）
const getPcsSimpleName = (pcsOrgName) => {
  let res = "";
  if (pcsOrgName && pcsOrgName.endsWith("派出所")) {
    res = pcsOrgName.substring(0, pcsOrgName.length - 3);
  } else {
    res = pcsOrgName;
  }
  return res;
};

// 通过出生日期获取年龄
const getAgeByCsrq = (strAge) => {
  let returnAge = "";
  if (strAge && strAge.length === 8) {
    let strBirthdayArr = strAge;
    let birthYear = strBirthdayArr.substr(0, 4);
    let birthMonth = strBirthdayArr.substr(4, 2);
    let birthDay = strBirthdayArr.substr(6, 2);
    let d = new Date();
    let nowYear = d.getFullYear();
    let nowMonth = d.getMonth() + 1;
    let nowDay = d.getDate();

    birthMonth = Number(birthMonth);
    birthDay = Number(birthDay);
    if (nowYear === birthYear) {
      returnAge = 0; //同年 则为0周岁
    } else {
      let ageDiff = nowYear - birthYear; //年之差
      if (ageDiff > 0) {
        if (nowMonth === birthMonth) {
          let dayDiff = nowDay - birthDay; //日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        } else {
          let monthDiff = nowMonth - birthMonth; //月之差
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        }
      } else {
        returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
      }
    }
  }
  return returnAge; //返回周岁年龄
};

// 根据身份证号获取出生日期
const getCsrqByGmsfhm = (gmsfhm) => {
  let res = "";
  let val = gmsfhm;
  if (val && validateIdCard(val)) {
    // 获取出生日期
    if (val.length === 18) {
      res = val.substring(6, 14);
    } else if (val.length === 15) {
      res = "19" + val.substring(6, 12);
    }
  }
  return res;
};

// 根据身份证号获取性别
const getXbByGmsfhm = (gmsfhm, isXbdm) => {
  let res = "";
  let val = gmsfhm;
  if (val && validateIdCard(val)) {
    // 获取性别
    if (val.length === 18) {
      if (isXbdm) {
        res = val.charAt(16) % 2 === 0 ? "2" : "1";
      } else {
        res = val.charAt(16) % 2 === 0 ? "女" : "男";
      }
    } else if (val.length === 15) {
      if (isXbdm) {
        res = val.charAt(14) % 2 === 0 ? "2" : "1";
      } else {
        res = val.charAt(14) % 2 === 0 ? "女" : "男";
      }
    }
  }
  return res;
};

// 涉稳细类前添加涉稳大类的名称
const setSwryXlPreName = (swRylxXl) => {
  return swRylxXl;
  let res = swRylxXl;
  if (swRylxXl) {
    let array = [
      // "个人极端暴力倾向人员",
      // "法轮功等邪教人员",
      // "多次寻衅滋事人员",
      // "侵害他人利益人员",
      // "煽动社会负面评论人员",
      // "扰乱公共秩序稳定人员",
      // "扬言报复社会人员",
      // "家庭暴力加害人",
      // "有严重不良行为未成年人",
      // "宣传煽动危害国家安全的人员"
    ];
    if (array.includes(swRylxXl)) {
      res = "涉稳人员—" + swRylxXl;
    }
  }
  return res;
};

// 图片压缩
const imgCompress = (file, drew, maxWidth = 1000, quality = 1) => {
  return new Promise((resolve) => {
    new Compressor(file, {
      strict: false,
      maxWidth,
      quality,
      drew,
      success: resolve,
      error(err) {
        console.log(err.message);
      }
    });
  });
};

// 字符串分隔成数组，遇到错误不抛出
const splitStrToArray = (str, splitStr) => {
  let res = [];
  if (!str) {
    res = [];
    return res;
  }
  if (!splitStr) {
    splitStr = ",";
  }
  try {
    res = str.split(splitStr);
  } catch (error) {
    // console.error(str);
    // console.error(error);
    res = [];
  }
  return res;
};

// 判断数组是否包含另一个数组
const arrayContainsArray = (superset, subset) => {
  if (!superset || !Array.isArray(superset)) {
    return false;
  }
  if (!subset || !Array.isArray(subset) || subset.length === 0) {
    return true;
  }
  return subset.every((element) => superset.includes(element));
};

// 根据身份证号获取年龄
const getAgeByGmsfhm = (gmsfhm) => {
  return getAgeByCsrq(getCsrqByGmsfhm(gmsfhm));
};

export default {
  getParentOrgId,
  getSimpleOrgId,
  getOrgIdLevel,
  hasSfryForZdrylx,
  hasZsjsbrForZdrylx,
  hasTyrysfqtForQtlb,
  getApproveBusType,
  getParentOrgNameAndSelf,
  getFileSufName,
  getNameForDot,
  setTreeToArray,
  getSimpleRyxlCode,
  getContentByPriority,
  getPcsSimpleName,
  getAgeByCsrq,
  getCsrqByGmsfhm,
  getXbByGmsfhm,
  getAgeByGmsfhm,
  setSwryXlPreName,
  imgCompress,
  splitStrToArray,
  arrayContainsArray
};
