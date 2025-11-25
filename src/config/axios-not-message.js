/**
 * 请求配置
 */

import axios from "axios";
import $utilPublic from "@/utils/util-public";
import $signature from "@/utils/signature";
import $crypto from "@/utils/crypto";
import $app from "./app";
import $store from "@/store";
import { Message, MessageBox } from "element-ui";

// 请求取消函数
const cancelToken = axios.CancelToken;

const axiosInit = axios.create({
  baseURL: appEnv.baseURL, // api的base_url
  timeout: 50000, // 请求超时时间
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Accept: "application/json;charset=UTF-8"
  },
  crossDomain: true // 跨域请求
});

// 配置发送请求前的拦截器 可以设置token信息
axiosInit.interceptors.request.use(
  config => {
    // 写在header中
    config.headers = {
      "Content-Type": "application/json;charset=UTF-8",
      Accept: "application/json;charset=UTF-8",
      "Route-Path": simplifyPathname(window.location.pathname),
      Authorization: $utilPublic.getUserToken(),
      "Client-Type": appEnv.clientTYPE,
      Encrypt: appEnv.encryptENABLED
    };
    // 添加签名
    if (appEnv.signatureENABLED) {
      let timestamp = new Date().getTime();
      config.headers = {
        ...config.headers,
        Timestamp: timestamp,
        Nonce: $signature.nonce,
        Signature: $signature.signature(timestamp)
      };
    }
    // 写在query中
    /*config.params = {
    "token": $storage.session.get('token')
  };*/
    // 写在body中
    /*config.data = {
    "token": $storage.session.get('token')
  };*/
    // 请求加密
    if (appEnv.encryptENABLED) {
      if (typeof config.encrypt === "undefined") {
        config.encrypt = true;
      }
      if (config.encrypt) {
        if (config.data) {
          config.data = $crypto.aesEncryptNetworkData(config.data);
        }
        if (config.params) {
          Object.keys(config.params).forEach(e => {
            config.params[e] = $crypto.toBase64(
              $crypto.utf8ToWordArray(
                $crypto.aesEncryptNetworkData(config.params[e])
              )
            );
          });
        }
      }
    }
    // 防止重复请求
    if ($app.interruptEnabledConf) {
      // 中断上次未结束的相同请求
      interrupt(config);
      config.cancelToken = new cancelToken(c => {
        // 添加axios请求实例
        $store.dispatch("addAxiosInstance", {
          // 请求标识
          u: combineTAGs(config),
          // 取消函数
          c: c
        });
      });
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 配置响应拦截器
axiosInit.interceptors.response.use(
  res => {
    // 移除本次请求
    interrupt(res.config);
    // code响应码
    if (res.data.code) {
      // 全局登陆过滤，当判读token失效或者没有登录时 返回登陆页面
      if (res.data.code === 10003) {
        return Promise.reject(res);
      }
      // 当判断code响应码为错误，提示错误信息
      if (res.data.code !== 200) {
        return Promise.reject(res);
      }
    }
    if (res.data.isEncrypt) {
      res.data.data = $crypto.aesDecryptNetworkData(res.data.data);
    }
    return res;
  },
  error => {
    // 若全部请求中断，将进程转到新的Promise从而阻断Promise链
    if (error.message === "all_interruption") {
      return new Promise(() => {});
    }
    return Promise.reject(error);
  }
);

// 中断axios请求
const interrupt = e => {
  for (let i in $store.state.system.axiosInstances) {
    // 判断当前请求已经存在
    if ($store.state.system.axiosInstances[i].u === combineTAGs(e)) {
      // 执行取消操作
      $store.state.system.axiosInstances[i].c("interrupt");
      // 移除本次记录
      $store.dispatch("delAxiosInstance", i);
    }
  }
};

const simplifyPathname = pathname => {
  return pathname.replace(new RegExp(process.env.NODE_PATH), "");
};

const isAbsoluteURL = url => {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

const combineURLs = (baseURL, relativeURL) => {
  return relativeURL
    ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
    : baseURL;
};

const combineTAGs = e => {
  return (
    (e.baseURL && !isAbsoluteURL(e.url)
      ? combineURLs(e.baseURL, e.url)
      : e.url) +
    "&" +
    e.method +
    "&" +
    e.headers["Route-Path"] +
    (e.requestId ? "&" + e.requestId : "")
  );
};

export default axiosInit;
