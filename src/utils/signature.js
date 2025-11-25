/**
 * signature工具类
 */


import $crypto from '@/utils/crypto'
import $utilStr from '@/utils/util-str';
import $utilLogin from '@/utils/util-login';

// 密钥
const KEY = '8bb3529e14d44cf7b740ce966e0df92b';
// 密钥偏移量
const IV = '';
// 随机串
const nonce = $utilStr.uuid(16, 16);

// 生成签名
const signature = (timestamp, key) => {
  timestamp = timestamp || new Date().getTime();
  key = key || KEY;
  let k = $crypto.md5median(key).toLowerCase();
  let iv = k.toUpperCase();
  let encrypted = $crypto.aesEncrypt(nonce, k, iv);
  let array = [
    encrypted,
    timestamp,
    nonce,
    $utilLogin.getUserToken()
  ];
  array.sort();
  let str = '';
  for (let e of array) {
    str += e;
  }
  return $crypto.sha256(str);
};

export default {
  signature,
  nonce
}
