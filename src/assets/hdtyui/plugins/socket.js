/**
 * socket插件
 */

"use strict";
import $crypto from '@/utils/crypto';
import $utilStr from '@/utils/util-str';
import $upload from '@/components/upload';

// 密钥
const KEY = 'aG0VmF75ofLK2ZNaIpSZDysnFs9iEI6Z';
// 密钥偏移量
const IV = '';
// 最大重连次数
const MAX = 5;

let client = null;

const socket = {};

// 连接状态
socket.SOCKET_STATE_CONNECTING = 'connecting';  // 连接中
socket.SOCKET_STATE_OPEN = 'open';  // 打开
socket.SOCKET_STATE_CLOSING = 'closing';  // 关闭中
socket.SOCKET_STATE_CLOSED = 'closed';  // 关闭
socket.SOCKET_STATE_TIMEOUT = 'timeout';  // 超时
socket.SOCKET_STATE_LOGIN_SUCCESSFUL = 'login successful';  // 登入成功

// 操作类型
socket.SOCKET_OPE_TYPE_LOGIN = '00';  // 登录
socket.SOCKET_OPE_TYPE_IDCARD = '10';  // 调用身份证读卡器
socket.SOCKET_OPE_TYPE_STOPIDCARD = '11';  // 断开调用身份证读卡器进程
socket.SOCKET_OPE_TYPE_IDENT = '20';  // 调用识别仪
socket.SOCKET_OPE_TYPE_CAMERA = '30';  // 调用摄像头
socket.SOCKET_OPE_TYPE_PRINT = '40';  // 调用打印机
socket.SOCKET_OPE_TYPE_LOCK = '50';  // 调用数字安全锁
socket.SOCKET_OPE_TYPE_KEY = '51';  // 读取虚拟安全锁
socket.SOCKET_OPE_TYPE_DEVICE = '52';  // 获取设备硬件编号
socket.SOCKET_OPE_TYPE_WITNESS = '60';  // 读取人证核验
socket.SOCKET_OPE_TYPE_OS = '80';  // 获取操作系统信息
socket.SOCKET_OPE_TYPE_RA = '84';  // 调用远程协助工具
socket.SOCKET_OPE_TYPE_UPGRADE = '99';  // 升级硬件服务

// 设备类型
socket.SOCKET_DEVICE_TYPE_READER = 1; // 通用读卡器
socket.SOCKET_DEVICE_TYPE_IDENT = 2; // 护照识别仪
socket.SOCKET_DEVICE_TYPE_JYHD = 3; // 捷宇高拍仪

// 证件类型
socket.SOCKET_ID_TYPE_EDZ = 2;  // 二代身份证
socket.SOCKET_ID_TYPE_JSZ = 5;  // 驾驶证
socket.SOCKET_ID_TYPE_XSZ = 6;  // 行驶证
socket.SOCKET_ID_TYPE_JGZ = 7;  // 军官证
socket.SOCKET_ID_TYPE_SBZ = 8;  // 士兵证
socket.SOCKET_ID_TYPE_HKB = 16;  // 户口簿
socket.SOCKET_ID_TYPE_GATXZ = 9;  // 大陆居民往来港澳通行证
socket.SOCKET_ID_TYPE_TWTXZ = 11;  // 大陆居民往来台湾通行证
socket.SOCKET_ID_TYPE_DLTXZ = 10;  // 台湾居民来往大陆通行证(台胞证)
socket.SOCKET_ID_TYPE_NDTXZ = 14;  // 港澳居民来往内地通行证(回乡证)
socket.SOCKET_ID_TYPE_XGATXZ = 22;  // 新版大陆居民往来港澳通行证(二代证幅面)
socket.SOCKET_ID_TYPE_XDLTXZ = 25;  // 新版台湾居民来往大陆通行证(台胞证)
socket.SOCKET_ID_TYPE_GATJZZ = 31;  // 港澳台居民居住证
socket.SOCKET_ID_TYPE_QZ = 12;  // 签证
socket.SOCKET_ID_TYPE_HZ = 13;  // 护照
socket.SOCKET_ID_TYPE_LK = 33;  // 外国人永久居留身份证(绿卡)
socket.SOCKET_ID_TYPE_ELHTBMZA = 1003;  // 二连浩特边民证A(照片页)
socket.SOCKET_ID_TYPE_ELHTBMZB = 1004;  // 二连浩特边民证B(信息页)

// 识别类型
socket.SOCKET_IDENT_TYPE_INIT = 2000; // 初始化识别仪设备
socket.SOCKET_IDENT_TYPE_DEVICE = 2001; // 获取识别仪设备信息
socket.SOCKET_IDENT_TYPE_STATE = 2002; // 获取识别仪设备状态
socket.SOCKET_IDENT_TYPE_NORMAL = 2003; // 正常识别
socket.SOCKET_IDENT_TYPE_IMPORT = 2004; // 导入识别
socket.SOCKET_IDENT_TYPE_SCAN = 2005; // 扫描识别
socket.SOCKET_IDENT_TYPE_CLEAR = 2006; // 清除识别缓存

// 图片类型
socket.SOCKET_IMG_TYPE_FULL = 0;  // 全幅图片
socket.SOCKET_IMG_TYPE_HEAD = 1;  // 头像图片

// 消息类型
socket.SOCKET_MSG_TYPE_DEVICE_STATE = 'devicestatus';  // 设备状态
socket.SOCKET_MSG_TYPE_RESULT_DATA = 'resultdata';  // 返回结果

// 读卡模式
socket.SOCKET_READ_MODE_NORMAL = 1; // 单个读卡
socket.SOCKET_READ_MODE_SERIAL = 2; // 连续读卡

// 返回码
socket.SOCKET_CODE_SUCCESS = 1;


// 初始化
socket.init = callback => {
  return new hdtySocket(callback);
};

class hdtySocket {
  constructor(callback) {

    // 当前硬件服务主版本号
    this.SOCKET_SVR_VERSION = '';

    // 当前操作系统名称
    this.SOCKET_OS_NAME = '';
    // 当前操作系统版本
    this.SOCKET_OS_VERSION = '';
    // 当前操作系统类型
    this.SOCKET_OS_TYPE = '';
    // 当前操作系统安装日期
    this.SOCKET_OS_INSTALL_DATE = '';
    // 当前操作系统用户
    this.SOCKET_OS_USER = '';

    // 当前计算机名称
    this.SOCKET_PC_NAME = '';
    // 当前计算机处理器
    this.SOCKET_PC_CPU = '';
    // 当前计算机内存
    this.SOCKET_PC_RAM = '';
    // 当前计算机磁盘大小
    this.SOCKET_PC_DISK = '';
    // 当前计算机输入输出系统
    this.SOCKET_PC_BIOS = '';
    // 当前计算机屏幕分辨率
    this.SOCKET_PC_SCREEN = '';
    // 当前计算机IP
    this.SOCKET_PC_IP = '';

    this.socketURL = appEnv.socketURL[0];
    this.count = 0;

    this.state = socket.SOCKET_STATE_CONNECTING;

    this.loginComplete = false;
    this.osComplete = false;
    this.identInitComplete = false;

    this.DEVICE = {};
    this.LISTENER = {};
    this.CALLBACK = {};

    if(callback) this.CALLBACK['init'] = callback;

    this.init();
  }
  // 初始化插件
  init() {
    if(typeof(WebSocket) === 'undefined'){
      alert('您的浏览器不支持socket');
    }else{
      this._emitListener('connect', socket.SOCKET_STATE_CONNECTING);
      if(client) {
        this.close();
        client = null;
      }
      this._connection();
    }
  }

  // 关闭连接
  close() {
    client.close();
  }

  // 事件监听
  on = (type, listener) => {
    this._onListener(type, listener);
  };

  // 登录
  login(callback) {
    let _this = this;
    // 参数
    let dataParams = {
      opertype: socket.SOCKET_OPE_TYPE_LOGIN,
    };
    _this._setSocket(dataParams, res => {
      let { success, data } = res;
      if(success) {
        _this.SOCKET_SVR_VERSION = data.mainversioncode;
      }
      _this.loginComplete = true;
      if(_this.osComplete) {
        this._emitListener('connect', socket.SOCKET_STATE_LOGIN_SUCCESSFUL);
        if(_this.CALLBACK['init']) {
          _this.CALLBACK['init'](_this._combineBASEs());
        }
      }
      if(callback) {
        callback(res);
      }
    });
  }

  // 获取操作系统信息
  os(callback) {
    let _this = this;
    // 参数
    let dataParams = {
      opertype: socket.SOCKET_OPE_TYPE_OS,
    };
    _this._setSocket(dataParams, res => {
      let { success, data } = res;
      if(success) {
        for (let key in data) {
          if (data.hasOwnProperty(key)) {
            if (data[key].configType === '0001') {
              _this.SOCKET_OS_NAME = data[key].configValue;
            } else if (data[key].configType === '0002') {
              _this.SOCKET_OS_TYPE = data[key].configValue;
            } else if (data[key].configType === '0003') {
              _this.SOCKET_OS_INSTALL_DATE = data[key].configValue;
            } else if (data[key].configType === '0004') {
              _this.SOCKET_PC_CPU = data[key].configValue;
            } else if (data[key].configType === '0005') {
              _this.SOCKET_PC_RAM= data[key].configValue;
            } else if (data[key].configType === '0006') {
              _this.SOCKET_PC_NAME = data[key].configValue;
            } else if (data[key].configType === '0007') {
              _this.SOCKET_OS_USER = data[key].configValue;
            } else if (data[key].configType === '0008') {
              _this.SOCKET_OS_VERSION = data[key].configValue;
            } else if (data[key].configType === '0009') {
              _this.SOCKET_PC_BIOS = data[key].configValue;
            } else if (data[key].configType === '0010') {
              _this.SOCKET_PC_SCREEN = data[key].configValue;
            } else if (data[key].configType === '0011') {
              _this.SOCKET_PC_DISK = data[key].configValue;
            } else if (data[key].configType === '9999') {
              _this.SOCKET_PC_IP = data[key].configValue;
            }
          }
        }
      }
      _this.osComplete = true;
      if(_this.loginComplete) {
        this._emitListener('connect', socket.SOCKET_STATE_LOGIN_SUCCESSFUL);
        if(_this.CALLBACK['init']) {
          _this.CALLBACK['init'](_this._combineBASEs());
        }
      }
      if(callback) {
        callback(res);
      }
    });
  }

  /**
   * 获取设备信息
   * @param init 是否初始化识别仪(默认不进行初始化)
   * @param callback 回调函数
   */
  device({
    deviceType = socket.SOCKET_DEVICE_TYPE_READER,
    callback = null,
  }) {
    let _this = this;
    if(Number(deviceType) === socket.SOCKET_DEVICE_TYPE_IDENT) {
      if(_this.identInitComplete) {
        call();
      }else {
        _this.identInit(res => {
          let { success } = res;
          if(success) {
            call();
          } else {
            callback(res);
          }
        });
      }
    } else {
      call();
    }
    function call() {
      let opertype, cmdtype, devicetype;
      if(Number(deviceType) === socket.SOCKET_DEVICE_TYPE_IDENT) {
        opertype = socket.SOCKET_OPE_TYPE_IDENT;
      } else {
        opertype = socket.SOCKET_OPE_TYPE_DEVICE;
      }
      if(Number(deviceType) === socket.SOCKET_DEVICE_TYPE_IDENT) {
        cmdtype = socket.SOCKET_IDENT_TYPE_DEVICE;
      }
      if(Number(deviceType) === socket.SOCKET_DEVICE_TYPE_READER) {
        devicetype = 2;
      } else if(Number(deviceType) === socket.SOCKET_DEVICE_TYPE_JYHD) {
        devicetype = 1;
      }
      // 参数
      let dataParams = {
        opertype: opertype,
        params: {
          cmdtype: cmdtype,
          devicetype: devicetype
        }
      };
      _this._setSocket(dataParams, res => {
        callback(res);
      });
    }
  }

  /**
   * 调用身份证读卡器
   * @param readMode 读卡模式(默认单个读卡)
   * @param readerType 读卡器类型(默认通用读卡器)
   * @param callback 回调函数
   */
  idcard({
    readerType = socket.SOCKET_DEVICE_TYPE_READER,
    readMode = socket.SOCKET_READ_MODE_NORMAL,
    callback = null
  }) {
    let _this = this;
    // 参数
    let dataParams = {
      opertype: socket.SOCKET_OPE_TYPE_IDCARD,
      params: {
        edztype: Number(readerType),
        readmode: Number(readMode)
      }
    };
    _this._setSocket(dataParams, res => {
      let { success, data } = res;
      if(success) {
        _this._checkIdcard(data);
      }
      callback(res);
    });
  }

  // 循环调用身份证通用读卡器
  idcardloop(callback) {
    let _this = this;
    // 参数
    let dataParams = {
      opertype: socket.SOCKET_OPE_TYPE_IDCARD,
      params: {
        edztype: 1,
        readmode: 2
      }
    };
    _this._setSocket(dataParams, res => {
      let { success, data } = res;
      if(success) {
        _this._checkIdcard(data);
      }
      callback(res);
    });
  }

  // 断开循环调用身份证读卡器进程
  stopidcardloop() {
    // 参数
    let dataParams = {
      opertype: socket.SOCKET_OPE_TYPE_STOPIDCARD
    };
    this._setSocket(dataParams, res => {
      let { success, msg } = res;
      if(success) {
        console.log(msg);
      }
    });
  };

  /**
   * 调用识别仪
   * @param identType 识别类型(默认正常识别)
   * @param idType 证件类型(默认二代身份证)
   * @param base64 图片(导入识别时使用)
   * @param before 导入前回调函数(导入识别时使用)
   * @param callback 回调函数
   */
  ident({
    identType = socket.SOCKET_IDENT_TYPE_NORMAL,
    idType = socket.SOCKET_ID_TYPE_EDZ,
    base64 = null,
    before = null,
    callback = null
  }) {
    let _this = this;
    if(_this.identInitComplete) {
      ready();
    } else {
      _this.identInit(res => {
        let { success } = res;
        if(success) {
          ready();
        } else {
          callback(res);
        }
      });
    }
    function ready() {
      if(Number(identType) === socket.SOCKET_IDENT_TYPE_IMPORT && !base64) {
        $upload({
          outputModel: 'base64',
          callback: val => {
            before(val);
            base64 = val.replace(/data:image\/.*;base64,/, '');
            call();
          }
        });
      } else {
        call();
      }
    }
    function call() {
      // 参数
      let dataParams = {
        opertype: socket.SOCKET_OPE_TYPE_IDENT,
        params: {
          cmdtype: Number(identType),
          mainid: Number(idType),
          imgbase: base64,
          subid: 0
        }
      };
      _this._setSocket(dataParams, res => {
        let { success, data } = res;
        if(success) {
          _this._checkIdcard(data);
          data.deviceinfo = _this.DEVICE[socket.SOCKET_OPE_TYPE_IDENT] = {
            deviceid: data.deviceid,
            devicename: data.devicename,
            sdkversion: data.sdkversion
          };
        }
        callback(res);
      });
    }
  }

  /**
   * 调用扫描
   * @param idType 证件类型(默认二代身份证)
   * @param callback 回调函数
   */
  scan({
    idType = socket.SOCKET_ID_TYPE_EDZ,
    callback = null
  }) {
    let _this = this;
    if(_this.identInitComplete) {
      call();
    } else {
      _this.identInit(res => {
        let { success } = res;
        if(success) {
          call();
        } else {
          callback(res);
        }
      });
    }
    function call() {
      // 参数
      let dataParams = {
        opertype: socket.SOCKET_OPE_TYPE_IDENT,
        params: {
          cmdtype: socket.SOCKET_IDENT_TYPE_SCAN,
          mainid: Number(idType),
          subid: 0
        }
      };
      _this._setSocket(dataParams, res => {
        let { success, data } = res;
        if(success) {
          _this._checkIdcard(data);
          data.deviceinfo = _this.DEVICE[socket.SOCKET_OPE_TYPE_IDENT] = {
            deviceid: data.deviceid,
            devicename: data.devicename,
            sdkversion: data.sdkversion
          };
        }
        callback(res);
      });
    }
  }

  // 清除识别仪识别缓存
  clearIdent(callback) {
    let _this = this;
    if(_this.identInitComplete) {
      call();
    }
    function call() {
      // 参数
      let dataParams = {
        opertype: socket.SOCKET_OPE_TYPE_IDENT,
        params: {
          cmdtype: socket.SOCKET_IDENT_TYPE_CLEAR
        }
      };
      _this._setSocket(dataParams, res => {
        callback(res);
      });
    }
  }

  // 初始化识别仪
  identInit(callback) {
    let _this = this;
    // 参数
    let dataParams = {
      opertype: socket.SOCKET_OPE_TYPE_IDENT,
      params: {
        cmdtype: socket.SOCKET_IDENT_TYPE_INIT,
        issendchangemsg: 1,
      }
    };
    _this._setSocket(dataParams, res => {
      let { success, data } = res;
      if(success) {
        _this.identInitComplete = true;
        _this.DEVICE[socket.SOCKET_OPE_TYPE_IDENT] = {
          deviceid: data.deviceid,
          devicename: data.devicename,
          sdkversion: data.sdkversion
        };
      } else {
        _this.identInitComplete = false;
      }
      callback(res);
    });
  }

  // 调用数字安全锁
  lock(callback) {
    let _this = this;
    // 参数
    let dataParams = {
      opertype: socket.SOCKET_OPE_TYPE_LOCK,
    };
    _this._setSocket(dataParams, res => {
      let { success } = res;
      if(success) {
        callback(res);
      } else {
        _this.key(res => {
          callback(res);
        });
      }
    });
  }

  // 调用虚拟安全锁
  key(callback) {
    // 参数
    let dataParams = {
      opertype: socket.SOCKET_OPE_TYPE_KEY,
    };
    this._setSocket(dataParams, res => {
      callback(res);
    });
  }

  // 调用远程协助工具
  ra(callback) {
    // 参数
    let dataParams = {
      opertype: socket.SOCKET_OPE_TYPE_RA,
    };
    this._setSocket(dataParams, res => {
      callback(res);
    });
  }

  /**
   * 调用软件升级程序
   * @param url 升级程序地址
   * @param version 升级程序版本
   * @param callback 回调函数
   */
  upgrade({
    url = null,
    version = null,
    callback = null
  }) {
    // 参数
    let dataParams = {
      opertype: socket.SOCKET_OPE_TYPE_UPGRADE,
      params: {
        downurl: url,
        versioncode: version,
      }
    };
    this._setSocket(dataParams, res => {
      callback(res);
    });
  }

  // 调用摄像头（尚未开通）
  camera(callback) {
    // 参数
    let dataParams = {
      opertype: socket.SOCKET_OPE_TYPE_CAMERA,
      params: {
        ocxtype: 5,
        imgtype: 1,
        jpgquality: 90
      }
    };
    this._setSocket(dataParams, res => {
      console.log(res);
    });
  }

  // 人证核验（尚未开通）
  witness(callback) {
    // 参数
    let dataParams = {
      opertype: socket.SOCKET_OPE_TYPE_WITNESS,
      params: {
        callbackurl: '',
        callbacktoken: '',
        minscore: 75,
        imgcardbase: '',
        comparecount: 5
      }
    };
    this._setSocket(dataParams, res => {
      console.log(res);
    });
  }

  _connection() {
    // 实例化socket
    client = new WebSocket(this.socketURL);
    // 监听socket消息
    client.onmessage = this._getMessage.bind(this);
    // 监听socket错误信息
    client.onerror = this._error.bind(this);
    // 监听socket关闭
    client.onclose = this._close.bind(this);
    // 监听socket连接
    client.onopen = this._open.bind(this);
  }

  _reconnection() {
    this.socketURL = appEnv.socketURL[this.count % appEnv.socketURL.length];
    if (this.count >= MAX) {
      this.state = socket.SOCKET_STATE_TIMEOUT;
    } else {
      this.count++;
      console.log('正在尝试重新连接socket...【' + this.count + '】');
      this._connection();
    }
  }

  _send(e) {
    client.send(JSON.stringify(e));
  }

  _error() {
    this._emitListener('connect', socket.SOCKET_STATE_CLOSING);
    console.error('socket连接出错');
    this._reconnection();
  }

  _close() {
    if(this.state === socket.SOCKET_STATE_OPEN) {
      this._emitListener('connect', socket.SOCKET_STATE_CLOSED);
      this.DEVICE = {};
      this.LISTENER = {};
      this.CALLBACK = {};
    }else if(this.state === socket.SOCKET_STATE_TIMEOUT) {
      this._emitListener('connect', socket.SOCKET_STATE_TIMEOUT);
    }
    console.log('socket已经关闭');
  }

  _open() {
    this.state = socket.SOCKET_STATE_OPEN;
    this._emitListener('connect', socket.SOCKET_STATE_OPEN);
    console.log('socket连接成功');
    this.login();
    this.os();
  }

  _setSocket(params, callback) {
    this.CALLBACK[params.opertype] = callback;
    if (client.readyState === client.OPEN) {
      // 若是ws开启状态
      this._send(params);
    } else if (client.readyState === client.CONNECTING) {
      // 若是 正在开启状态，则等待1s后重新调用
      setTimeout(() => {
        this._setSocket(params, callback);
      }, 1000);
    } else {
      // 若未开启 ，则等待1s后重新调用
      setTimeout(() => {
        this._setSocket(params, callback);
      }, 1000);
    }
  }

  _getMessage(e) {
    let { msgtype, code, msg, data, opertype, ...rest } = JSON.parse(e.data);
    if(msgtype === socket.SOCKET_MSG_TYPE_RESULT_DATA
      && opertype === socket.SOCKET_OPE_TYPE_IDCARD) {
      msgtype = undefined;
    }else if(msgtype === socket.SOCKET_MSG_TYPE_DEVICE_STATE
      && opertype === socket.SOCKET_OPE_TYPE_IDENT) {
      if(data.statuscode !== socket.SOCKET_CODE_SUCCESS) {
        this.identInitComplete = false;
      }
    }
    let response;
    if(msgtype) {
      response = {
        opertype: opertype,
        data: {
          ...rest,
          ...$crypto.aesDecryptNetworkData(data, KEY)
        },
      };
      this._emitListener(this._checkMsgtype(socket.SOCKET_MSG_TYPE_DEVICE_STATE), response);
    }else {
      if(code === socket.SOCKET_CODE_SUCCESS) {
        if ($crypto.isAesEncryptNetworkData(data, KEY)) {
          data = $crypto.aesDecryptNetworkData(data, KEY);
        } else {
          data = $utilStr.toJSONObj(data);
        }
        response = {
          code: code,
          msg: msg,
          opertype: opertype,
          data: {
            ...rest,
            ...data
          },
          success: true
        };
      }else {
        response = {
          code: code,
          msg: msg,
          opertype: opertype,
          data: null,
          success: false
        };
        console.error(msg);
      }
      if(this.CALLBACK[opertype]) this.CALLBACK[opertype](response);
    }
  }

  _onListener(type, listener) {
    if(!this.LISTENER[type]){
      this.LISTENER[type] = [];
    }
    this.LISTENER[type].push(listener);
  }

  _emitListener(type, val) {
    if(this.LISTENER[type]){
      this.LISTENER[type].map((fn)=>{
        fn(val);
      });
    }
  }

  _combineBASEs() {
    return {
      svrVersion: this.SOCKET_SVR_VERSION,
      osName: this.SOCKET_OS_NAME,
      osVersion: this.SOCKET_OS_VERSION,
      osType: this.SOCKET_OS_TYPE,
      osInstallDate: this.SOCKET_OS_INSTALL_DATE,
      osUser: this.SOCKET_OS_USER,
      pcIp: this.SOCKET_PC_IP,
      pcName: this.SOCKET_PC_NAME,
      pcCpu: this.SOCKET_PC_CPU,
      pcRam: this.SOCKET_PC_RAM,
      pcDisk: this.SOCKET_PC_DISK,
      pcBios: this.SOCKET_PC_BIOS,
      pcScreen: this.SOCKET_PC_SCREEN,
    }
  }

  _checkMsgtype(type) {
    if(type) {
      if(type === socket.SOCKET_MSG_TYPE_DEVICE_STATE) {
        type = 'devicestate';
      }
      return type;
    }
  }

  _checkIdcard(data) {
    if(data) {
      if(data.sex) {
        data.sexname = data.sex === '1' ? '男' : data.sex === '2' ? '女' : '未知';
      }
      if(data.birthday) {
        data.birthday = (data.birthday+'').replace(/[^0-9]/ig, '');
      }
      if(data.photostr) {
        data.photostr = 'data:image/png;base64,' + data.photostr;
        data.headimage = data.photostr;
      }
      if(data.photolist) {
        data.photolist.forEach(item => {
          item.photostr = 'data:image/png;base64,' + item.photostr;
          if(item.type === socket.SOCKET_IMG_TYPE_FULL) {
            data.fullimage = item.photostr;
          }else if(item.type === socket.SOCKET_IMG_TYPE_HEAD) {
            data.headimage = item.photostr;
          }
        });
      }
      return data;
    }
  }
}

export default socket;
