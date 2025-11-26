/**
 * storage工具类
 */

import $crypto from "@/utils/crypto";

const cookie = {};

const local = {};

const session = {};

const PREFIX = appEnv.appKEY || "hdty-flex-view-web";

const ENCRYPT = process.env.ENCRYPT_SESS;

// 密钥
const KEY = "L4Pda6uBBHcfqEhA";
// 密钥偏移量
const IV = "";

// 获取一个值
cookie.get = (key) => {
  key = `${PREFIX ? PREFIX + ":" : ""}${key + "="}`;
  let cookies = document.cookie.split(";");
  let len = cookies.length;
  let value;
  for (let i = 0; i < len; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(key) === 0) {
      value = cookie.substring(key.length, cookie.length);
    }
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

// 存储一个值
cookie.set = (key, value, exDays) => {
  key = `${PREFIX ? PREFIX + ":" : ""}${key + "="}`;
  let d = new Date();
  d.setTime(d.getTime() + exDays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toGMTString();
  document.cookie = key + JSON.stringify(value) + "; " + expires;
};

// 移除一个值
cookie.remove = (key) => {
  let d = new Date();
  d.setTime(d.getTime() - 1);
  let value = cookie.get(key);
  if (value) {
    key = `${PREFIX ? PREFIX + ":" : ""}${key + "="}`;
    let expires = "expires=" + d.toGMTString();
    document.cookie = key + JSON.stringify(value) + "; " + expires;
  }
};

// 获取一个值
local.get = (key) => {
  key = `${PREFIX ? PREFIX + ":" : ""}${key}`;
  let value = localStorage.getItem(key);
  try {
    return JSON.parse(value);
  } catch (e) {
    return null;
  }
};

// 存储一个值
local.set = (key, value) => {
  key = `${PREFIX ? PREFIX + ":" : ""}${key}`;
  localStorage.setItem(key, JSON.stringify(value));
};

// 移除一个值
local.remove = (key) => {
  key = `${PREFIX ? PREFIX + ":" : ""}${key}`;
  localStorage.removeItem(key);
};

// 清除以某个值开头的所有值
local.clearStarts = (prefix) => {
  let len = localStorage.length;
  let keys = [];
  for (let i = 0; i < len; i++) {
    let k = localStorage.key(i);
    if (isAbsoluteKEY(k, prefix)) {
      keys.push(k);
    }
  }
  keys.forEach((key) => localStorage.removeItem(key));
};

// 清除所有值（当前应用程序命名空间下的key值）
local.clear = () => {
  let len = localStorage.length;
  let keys = [];
  for (let i = 0; i < len; i++) {
    let k = localStorage.key(i);
    if (isAbsoluteKEY(k)) {
      keys.push(k);
    }
  }
  keys.forEach((key) => localStorage.removeItem(key));
};

// 获取一个值
session.get = (key) => {
  key = `${PREFIX ? PREFIX + ":" : ""}${key}`;
  let value = sessionStorage.getItem(key);
  if (ENCRYPT) {
    return $crypto.aesDecryptNetworkData(value, KEY);
  } else {
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }
};

// 存储一个值
session.set = (key, value) => {
  key = `${PREFIX ? PREFIX + ":" : ""}${key}`;
  if (ENCRYPT) {
    value = $crypto.aesEncryptNetworkData(value, KEY);
  } else {
    value = JSON.stringify(value);
  }
  sessionStorage.setItem(key, value);
};

// 移除一个值
session.remove = (key) => {
  key = `${PREFIX ? PREFIX + ":" : ""}${key}`;
  sessionStorage.removeItem(key);
};

// 清除除了某个值之外的所有值
session.clearBesides = (key) => {
  key = `${PREFIX ? PREFIX + ":" : ""}${key}`;
  let len = sessionStorage.length;
  let keys = [];
  for (let i = 0; i < len; i++) {
    let k = sessionStorage.key(i);
    if (isAbsoluteKEY(k) && k !== key) {
      keys.push(k);
    }
  }
  keys.forEach((key) => sessionStorage.removeItem(key));
};

// 清除以某个值开头的所有值
session.clearStarts = (prefix) => {
  let len = sessionStorage.length;
  let keys = [];
  for (let i = 0; i < len; i++) {
    let k = sessionStorage.key(i);
    if (isAbsoluteKEY(k, prefix)) {
      keys.push(k);
    }
  }
  keys.forEach((key) => sessionStorage.removeItem(key));
};

// 清除所有值（当前应用程序命名空间下的key值）
session.clear = () => {
  let len = sessionStorage.length;
  let keys = [];
  for (let i = 0; i < len; i++) {
    let k = sessionStorage.key(i);
    if (isAbsoluteKEY(k)) {
      keys.push(k);
    }
  }
  keys.forEach((key) => sessionStorage.removeItem(key));
};

// 清除当前登录痕迹
session.clearCurrentLogin = () => {
  let len = sessionStorage.length;
  let keys = [];
  for (let i = 0; i < len; i++) {
    let k = sessionStorage.key(i);
    if (isAbsoluteKEY(k)) {
      if ([`${PREFIX ? PREFIX + ":" : ""}login`].indexOf(k) === -1) {
        keys.push(k);
      }
    }
  }
  keys.forEach((key) => sessionStorage.removeItem(key));
};

const isAbsoluteKEY = (key, prefix) => {
  prefix = prefix || PREFIX;
  return key && key.startsWith(prefix);
};

export default {
  cookie: cookie,
  local: local,
  session: session
};
