/**
 * crypto工具类
 */


import CryptoJS from 'crypto-js';
import $Hex from 'crypto-js/enc-hex';
import $Utf8 from 'crypto-js/enc-utf8';
import $Base64 from 'crypto-js/enc-base64';
import $AES from 'crypto-js/aes';
import $utilStr from '@/utils/util-str';
import $utilDate from '@/utils/util-date';

// const $SM4 = require('gm-crypt').sm4;
const $SM4 = require('sm-crypto').sm4;
const $SM3 = require('sm-crypto').sm3;
const $SM2 = require('sm-crypto').sm2;
const crypto = require('crypto');

// 密钥
const KEY = '0123hdtytech3210';
// 密钥偏移量
const IV = '';

// WordArray转16进制
const toHex = word => {
  if (word) {
    return word.toString();
  }
};

// SM2加密
const sm2Encrypt = (data, publicKey) => {
  const cipher = $SM2.doEncrypt(data, publicKey, 1);
  return `04${cipher}`;
};

// SM2解密
const sm2Decrypt = (data, privateKey) => {
  // 解密时去掉开头的04
  return $SM2.doDecrypt(data.substring(2), privateKey, 1);
};

// SM3加密
const sm3Encrypt = data => {
  return $SM3(data);
};




// 16进制转WordArray
const hexToWordArray = hex => {
  if(hex) {
    return $Hex.parse(hex);
  }
};

// WordArray转utf8
const toUft8 = word => {
  if (word) {
    return $Utf8.stringify(word);
  }
};

// utf8转WordArray
const utf8ToWordArray = utf8 => {
  if(utf8) {
    return $Utf8.parse(utf8);
  }
};

// WordArray转base64
const toBase64 = word => {
  if (word) {
    return $Base64.stringify(word);
  }
};

// base64转WordArray
const base64ToWordArray = base64 => {
  if(base64) {
    return $Base64.parse(base64);
  }
};

// md5加密
const md5 = str => {
  if (str) {
    return CryptoJS.MD5(str).toString();
  }
};

// md5加密取中间值
const md5median = str => {
  if (str) {
    return CryptoJS.MD5(str).toString().substr(8, 16);
  }
};

// sha256加密
const sha256 = str => {
  if (str) {
    return CryptoJS.SHA256(str).toString();
  }
};

// base64加密
const base64 = str => {
  if (str) {
    return $Base64.stringify($Utf8.parse(str));
  }
};

// base64解密
const base64Decrypt = str => {
  if (str) {
    return $Base64.parse(str).toString(CryptoJS.enc.Utf8);
  }
};

// AES加密
const aesEncrypt = (word, key, iv) => {
  let encrypted = $AES.encrypt(word, $Utf8.parse(key), {
    iv: $Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  let ciphertext = encrypted.ciphertext.toString();
  let cipherhex = $Hex.parse(ciphertext);
  return $Base64.stringify(cipherhex);
};

// AES网络数据传输加密
const aesEncryptNetworkData = (data, key) => {
  key = key || KEY;
  if(typeof(data) === 'boolean') {
    return data;
  }else if(typeof(data) === 'number') {
    return data;
  }
  if(data !== undefined && data !== null && data !== '') {
    if(typeof(data) === 'object') {
      data = JSON.stringify(data);
    }
    let k = md5median(key);
    let l = k.toLowerCase();
    let u = k.toUpperCase();
    return aesEncrypt(data, l, u);
  }
  return data;
};

// 判断字符串是否为aesEncryptNetworkData加密格式
const isAesEncryptNetworkData = (str, key) => {
  if (typeof(str) === 'string' && isNaN(parseFloat(str) && Number(str))) {
    try {
      let decrypted = aesDecryptNetworkData(str, key);
      return $utilStr.isUft8(decrypted) && decrypted !== str;
    } catch(e) {
      return false;
    }
  }
  return false;
};

// AES当前日期加密
const aesEncryptCurrentDate = key => {
  key = key || KEY;
  let currentDate = $utilDate.getCurrentDate();
  let iv = md5median(key);
  return base64(aesEncrypt(currentDate, key, iv));
};

// AES当前毫秒级日期时间混淆17位代码加密（如19990101010101001混入abcdefghijklmnopq等于1a9b9c9d0e1f0g1h0i1j0k1l0m1n0o0p1q）
const aesEncryptCurrentMsDatetimeToConfuse = (code, key) => {
  code = code || 'abcdefghijklmnopq';
  key = key || KEY;
  let currentMsDatetime = $utilDate.getCurrentMsDatetime();
  let msDatetimeArr = currentMsDatetime.split('');
  let codeArr = code.split('');
  let confuseArr = [];
  for (let i = 0; i < msDatetimeArr.length; i++) {
    confuseArr.push(msDatetimeArr[i] + (codeArr[i] || '??'));
  }
  let iv = md5median(key);
  return base64(aesEncrypt(confuseArr.join(''), key, iv));
};
// 生成密钥
function generateKey(password) {
  const key = crypto.createHash('md5').update(password).digest('hex');
  return new TextEncoder('utf-8').encode(key.substring(8, 24));
}

// ZeroPadding
function zeroPadding(src) {
  const srcArray = new TextEncoder('utf-8').encode(src);
  const paddingCount = 16 - srcArray.length % 16;
  if (paddingCount !== 16) {
      const paddedArray = new Uint8Array(srcArray.length + paddingCount);
      paddedArray.set(srcArray, 0);
      return paddedArray;
  }
  return srcArray;
}
// SM4加密 [原]
const sm4EncryptOld = (word, key) => {
  let sm4Config = {
    key: key,
    mode: 'ecb',
    cipherType: 'base64'
  };
  let sm4 = new $SM4(sm4Config);
  return sm4.encrypt(word);
};
// SM4加密
const sm4Encrypt = (word, password) => {
  // 生成密钥
  const keyArray = generateKey(password);
  // ZeroPadding
  const srcArray = zeroPadding(word);
  
  const cipher = $SM4.encrypt(srcArray, keyArray, {mode: 'ecb', padding: 'pkcs#0'});
  console.log(srcArray, cipher);
  return cipher;
}

// SM4网络数据传输加密
const sm4EncryptNetworkData = (data, key) => {
  key = key || KEY;
  if(typeof(data) === 'boolean') {
    return data;
  }else if(typeof(data) === 'number') {
    return data;
  }
  if(data !== undefined && data !== null && data !== '') {
    if(typeof(data) === 'object') {
      data = JSON.stringify(data);
    }
    return sm4Encrypt(data, key);
  }
  return data;
};

// 判断字符串是否为sm4EncryptNetworkData加密格式
const isSm4EncryptNetworkData = (str, key) => {
  if (typeof(str) === 'string' && isNaN(parseFloat(str) && Number(str))) {
    try {
      let decrypted = sm4DecryptNetworkData(str, key);
      return $utilStr.isUft8(decrypted) && decrypted !== str;
    } catch(e) {
      return false;
    }
  }
  return false;
};

// SM4当前日期加密
const sm4EncryptCurrentDate = key => {
  key = key || KEY;
  let currentDate = $utilDate.getCurrentDate();
  return sm4Encrypt(currentDate, key);
};

// SM4当前毫秒级日期时间混淆17位代码加密（如19990101010101001混入abcdefghijklmnopq等于1a9b9c9d0e1f0g1h0i1j0k1l0m1n0o0p1q）
const sm4EncryptCurrentMsDatetimeToConfuse = (code, key) => {
  code = code || 'abcdefghijklmnopq';
  key = key || KEY;
  let currentMsDatetime = $utilDate.getCurrentMsDatetime();
  let msDatetimeArr = currentMsDatetime.split('');
  let codeArr = code.split('');
  let confuseArr = [];
  for (let i = 0; i < msDatetimeArr.length; i++) {
    confuseArr.push(msDatetimeArr[i] + (codeArr[i] || '??'));
  }
  return sm4Encrypt(confuseArr.join(''), key);
};

// AES解密
const aesDecrypt = (word, key, iv) => {
  let decrypted = $AES.decrypt(word, $Utf8.parse(key), {
    iv: $Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
};

// AES网络数据传输解密
const aesDecryptNetworkData = (data, key) => {
  key = key || KEY;
  if(typeof(data) === 'string' && data) {
    if(data === 'true' || data === 'false') {
      return JSON.parse(data);
    }
    data = data.replace(/[\r\n]/g, '');
    let k = md5median(key);
    let l = k.toLowerCase();
    let u = k.toUpperCase();
    let j = aesDecrypt(data, l, u);
    if(!isNaN(parseInt(j))) {
      return j;
    }
    try {
      return JSON.parse(j);
    } catch(e) {
      return j;
    }
  }
  return data;
};

// AES当前毫秒级日期时间混淆17位代码解密
const aesDecryptIsCurrentMsDatetimeToConfuse = (word, code, key) => {
  code = code || 'abcdefghijklmnopq';
  key = key || KEY;
  let iv = md5median(key);
  try {
    let decrypted = aesDecrypt(base64Decrypt(word), key, iv);
    if(decrypted) {
      let confuseArr = decrypted.split('');
      let decryptedArr = [];
      for (let i = 0; i < confuseArr.length; i++) {
        if(i % 2 !== 0) {
          if(confuseArr[i] === '?' && confuseArr[i + 1] === '?') {
            break;
          }
          decryptedArr.push(confuseArr[i]);
        }
      }
      return decryptedArr.join('') === code;
    }
    return false;
  } catch (e) {
    return false;
  }
};

// SM4解密 [原]
const sm4DecryptOld = (word, key) => {
  let sm4Config = {
    key: key,
    mode: 'ecb',
    cipherType: 'base64'
  };
  let sm4 = new $SM4(sm4Config);
  return sm4.decrypt(word);
};
// SM4解密
const sm4Decrypt = (word, password) => {
  // 生成密钥
  const keyArray = generateKey(password);
  const srcData = $SM4.decrypt(word, keyArray, {mode: 'ecb', padding: 'pkcs#0'});
  // eslint-disable-next-line no-control-regex
  const s = srcData.replace(/\u0000*$/, '');
  return s;
}

// SM4网络数据传输解密
const sm4DecryptNetworkData = (data, key) => {
  key = key || KEY;
  if(typeof(data) === 'string' && data) {
    if(data === 'true' || data === 'false') {
      return JSON.parse(data);
    }
    data = data.replace(/[\r\n]/g, '');
    let j = sm4Decrypt(data, key);
    if(!isNaN(parseInt(j))) {
      return j;
    }
    try {
      return JSON.parse(j);
    } catch(e) {
      return j;
    }
  }
  return data;
};

// SM4当前毫秒级日期时间混淆17位代码解密
const sm4DecryptIsCurrentMsDatetimeToConfuse = (word, code, key) => {
  code = code || 'abcdefghijklmnopq';
  key = key || KEY;
  try {
    let decrypted = sm4Decrypt(word, key);
    if(decrypted) {
      let confuseArr = decrypted.split('');
      let decryptedArr = [];
      for (let i = 0; i < confuseArr.length; i++) {
        if(i % 2 !== 0) {
          if(confuseArr[i] === '?' && confuseArr[i + 1] === '?') {
            break;
          }
          decryptedArr.push(confuseArr[i]);
        }
      }
      return decryptedArr.join('') === code;
    }
    return false;
  } catch (e) {
    return false;
  }
};


export default {
  // WordArray转16进制
  toHex,
  // 16进制转WordArray
  hexToWordArray,
  // WordArray转utf8
  toUft8,
  // utf8转WordArray
  utf8ToWordArray,
  // WordArray转base64
  toBase64,
  // base64转WordArray
  base64ToWordArray,
  // md5加密
  md5,
  // md5加密取中间值
  md5median,
  // sha256加密
  sha256,
  // base64加密
  base64,
  // base64解密
  base64Decrypt,
  // AES加密
  aesEncrypt,
  // AES网络数据传输加密
  aesEncryptNetworkData,
  // 判断字符串是否为aesEncryptNetworkData加密格式
  isAesEncryptNetworkData,
  // AES当前日期加密
  aesEncryptCurrentDate,
  // AES当前毫秒级日期时间混淆17位代码加密
  aesEncryptCurrentMsDatetimeToConfuse,
  // SM4加密
  sm4Encrypt,
  // SM4网络数据传输加密
  sm4EncryptNetworkData,
  // 判断字符串是否为sm4EncryptNetworkData加密格式
  isSm4EncryptNetworkData,
  // SM4当前日期加密
  sm4EncryptCurrentDate,
  // SM4当前毫秒级日期时间混淆17位代码加密
  sm4EncryptCurrentMsDatetimeToConfuse,
  // AES解密
  aesDecrypt,
  // AES网络数据传输解密
  aesDecryptNetworkData,
  // AES解密判断当前毫秒级日期时间混淆17位代码
  aesDecryptIsCurrentMsDatetimeToConfuse,
  // SM4解密
  sm4Decrypt,
  // SM4网络数据传输解密
  sm4DecryptNetworkData,
  // SM4当前毫秒级日期时间混淆17位代码解密
  sm4DecryptIsCurrentMsDatetimeToConfuse,
  // sm3加密
  sm3Encrypt,
  // sm2加密
  sm2Encrypt,
  // sm2解密
  sm2Decrypt,
  // sm4加密 原
  sm4EncryptOld,
  // sm4解密 原
  sm4DecryptOld,
}
