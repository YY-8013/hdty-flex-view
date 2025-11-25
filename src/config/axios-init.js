/**
 * axios-init.js请求配置
 * 常用配置参数：
 * url: { String } 请求URL
 * method: 'get/post' 请求方法，默认get
 * baseURL: { String } 请求相对URL前缀
 * headers: { Object } 追加自定义请求头
 * redefineHeaders: { Boolean, Object } 重新自定义请求头
 * requestId: { String } 请求唯一标识
 * signature： { Boolean } 请求是否签名，默认true
 * encrypt: { Boolean } 请求是否加密，默认true
 * feedback: { Boolean } 请求响应异常是否反馈，默认true
 * params: { URLSearchParams } 请求URL参数
 * data: { URLSearchParams } 请求主体参数
 * timeout:  { Number } 请求超时毫秒数
 * withCredentials: { Boolean } 跨域请求是否需要使用凭证，默认false
 * auth: { plain object } 自定义'Authorization'头
 * responseType: 'arraybuffer/blob/document/json/text/stream' 请求响应的数据类型，默认json
 */


import axios from 'axios';
import $utilLogin from '@/utils/util-login';
import $signature from '@/utils/signature';
import $crypto from '@/utils/crypto';
import $app from '@/config/app';
import $store from '@/store';
import NProgress from 'nprogress';
import { Message, MessageBox } from 'element-ui';

// 请求取消函数
const cancelToken = axios.CancelToken;

const axiosInit = axios.create({
  baseURL: appEnv.baseURL,  // api的base_url
  timeout: 50* 1000,  // 请求超时时间
  headers: {
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json;charset=UTF-8'
  },
  crossDomain: true  // 跨域请求
});

// 配置发送请求前的拦截器 可以设置token信息
axiosInit.interceptors.request.use(config => {
  // 写在header中
  if(!config.redefineHeaders) {
    config.headers = {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept': 'application/json;charset=UTF-8',
      'Route-Path': simplifyPathname(window.location.pathname),
      'Authorization': $utilLogin.getUserToken(),
      'Client-Type': appEnv.clientTYPE,
      'Encrypt': appEnv.encryptENABLED,
      ...config.headers
    };
  } else {
    if(typeof(config.redefineHeaders) === 'object') {
      config.headers = {
        ...config.redefineHeaders
      }
    }
  }
  // 写在query中
  if(config.method === 'get') {
    config.params = {
      t: new Date().getTime(),
      ...config.params
    };
  }
  // 写在body中
  if(config.method === 'post') {
    if(config.data instanceof FormData) {
      config.data.append('t', new Date().getTime().toString());
    } else {
      config.data = {
        t: new Date().getTime(),
        ...config.data
      };
    }
  }
  // 添加签名
  if(appEnv.signatureENABLED) {
    if(typeof(config.signature) === 'undefined') {
      config.signature = true;
    }
    if(config.signature) {
      let timestamp = new Date().getTime();
      config.headers = {
        ...config.headers,
        'Timestamp': timestamp,
        'Nonce': $signature.nonce,
        'Signature': $signature.signature(timestamp)
      }
    }
  }
  // 请求加密
  if(appEnv.encryptENABLED) {
    if(typeof(config.encrypt) === 'undefined') {
      config.encrypt = true;
    }
    if(config.encrypt) {
      if(config.data) {
        config.data = appEnv.encryptMETHOD === 'aes'
          ? $crypto.aesEncryptNetworkData(config.data)
          : appEnv.encryptMETHOD === 'sm4'
            ? $crypto.sm4EncryptNetworkData(config.data)
            : config.data;
      }
      if(config.params) {
        config.params = {
          ...config.params
        };
        Object.keys(config.params).forEach(e => {
          config.params[e] = appEnv.encryptMETHOD === 'aes'
            ? $crypto.toBase64($crypto.utf8ToWordArray($crypto.aesEncryptNetworkData(config.params[e])))
            : appEnv.encryptMETHOD === 'sm4'
              ? $crypto.toBase64($crypto.utf8ToWordArray($crypto.sm4EncryptNetworkData(config.params[e])))
              : config.params[e];
        });
      }
    }
  }
  // 防止重复请求
  if($app.interruptEnabled) {
    // 中断上次未结束的相同请求
    interrupt(config);
    config.cancelToken = new cancelToken(c => {
      // 添加axios请求实例
      $store.dispatch('addAxiosInstance', {
        // 请求标识
        u: combineTAGs(config),
        // 取消函数
        c: c
      });
    });
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// 配置响应拦截器
axiosInit.interceptors.response.use(res => {
  // 移除本次请求
  interrupt(res.config);
  // 当判读code响应码为错误码时，提示错误信息或返回登陆页面
  if (res.data.code && res.data.code !== 200) {
    return failure(res);
  }
  // 如果响应的数据加密，进行解密
  if(res.data.isEncrypt) {
    res.data.data = appEnv.encryptMETHOD === 'aes'
      ? $crypto.aesDecryptNetworkData(res.data.data)
      : appEnv.encryptMETHOD === 'sm4'
        ? $crypto.sm4DecryptNetworkData(res.data.data)
        : res.data.data;
  }
  return res;
}, error => {
  // 若全部请求中断，将进程转到新的Promise从而阻断Promise链
  if(error.message === 'all_interruption') {
    return new Promise(()=>{});
  }
  // 响应异常反馈
  let enableFeedback = true;
  if(typeof(error.config) !== 'undefined' && typeof(error.config.feedback) !== 'undefined') {
    enableFeedback = error.config.feedback;
  }
  if(enableFeedback) {
    if(error.message === 'Network Error') {
      MessageBox.alert('网络状况不佳，请稍后再试', '警告', {
        type: 'warning',
        callback: () => {
          NProgress.done();
        }
      });
    }
    if(error.message.includes('timeout of')) {
      MessageBox.alert('网络请求超时，请稍后重试', '警告', {
        type: 'warning',
        callback: () => {
          NProgress.done();
        }
      });
    }
  }
  return Promise.reject(error);
});

// 中断axios请求
const interrupt = e => {
  for (let i in $store.state.system.axiosInstances) {
    if ($store.state.system.axiosInstances.hasOwnProperty(i)) {
      // 判断当前请求已经存在
      if ($store.state.system.axiosInstances[i].u === combineTAGs(e)) {
        // 执行取消操作
        $store.state.system.axiosInstances[i].c('interrupt');
        // 移除本次记录
        $store.dispatch('delAxiosInstance', i);
      }
    }
  }
};

const simplifyPathname = pathname => {
  return pathname.replace(new RegExp(process.env.NODE_PATH), '');
};

const isAbsoluteURL = url => {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};

const combineURLs = (baseURL, relativeURL) => {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

const combineTAGs = e => {
  return (
    e.baseURL && !isAbsoluteURL(e.url)
    ? combineURLs(e.baseURL, e.url)
    : e.url
  )
  + '&' + e.method
  + '&' + e.headers['Route-Path']
  + (
    e.requestId
    ? ('&' + e.requestId)
    : ''
  )
};

const failure = res => {
  // 打印请求信息
  // console.log(`url：${res.config.url}\r\ncode：${res.data.code}\r\nmsg：${res.data.msg}`);
  if (res.data.code === 10003) {
    MessageBox.alert('您的账号已在另一处登录', '警告', {
      type: 'warning',
      callback: () => {
        window.location.href = process.env.NODE_PATH+'/login';
      }
    });
  } else if(res.data.code === 10004) {
    MessageBox.alert('您的IP已被限制访问', '警告', {
      type: 'warning',
      callback: () => {
        window.location.href = process.env.NODE_PATH+'/login';
      }
    });
  } else if (res.data.code === 403) {
    MessageBox.alert(res.data.msg, '警告', {
      type: 'warning',
      callback: () => {
        window.location.href = process.env.NODE_PATH+'/login';
      }
    });
  } else if(res.data.code === 406) {
    MessageBox.alert(res.data.msg, '警告', {
      type: 'warning',
      callback: () => {
        return Promise.reject(res);
      }
    });
  } else if(res.data.code.toString().length === 4 && res.data.code.toString().substring(0, 2) === '20') {
    MessageBox.alert(res.data.msg, '警告', {
      type: 'warning',
      callback: () => {
        window.location.href = process.env.NODE_PATH+'/login';
      }
    });
  } else {
    Message({
      showClose: true,
      customClass: 'is-fixed',
      message: res.data.msg,
      type: 'error'
    });
  }
  return Promise.reject(res);
};

export default axiosInit;
