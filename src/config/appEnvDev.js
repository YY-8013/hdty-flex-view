/**
 * 生产环境配置
 */

export const appEnvDev = {
  // 应用程序标识
  appKEY: "hdty-flex-view-web",

  // 客户端类型（数据字典1017）
  clientTYPE: "0",

  // 基础请求地址
  baseURL: "http://172.16.60.219:20158/eeds-zhpcs-extend-server",

  // 模拟请求地址
  mockURL: "http://localhost:8090",

  // socket请求地址
  socketURL: [
    "ws://127.0.0.1:28415",
    "ws://127.0.0.1:27415",
    "ws://127.0.0.1:26415",
    "ws://127.0.0.1:25415",
    "ws://127.0.0.1:24415"
  ],

  // mqtt请求连接
  mqttCONNECT: {
    url: "ws://172.16.60.209:15675/ws", // 地址
    username: "hdty", // 用户名
    password: "hdty", // 密码
    // mqtt重新连接间隔
    mqttReconnectTime: 2 * 1000 * 60
  },

  // 百度离线地图基础资源请求地址
  bmap_offlineURL: "http://172.16.60.150:3080",

  // ArcGis离线地图基础资源请求地址
  arcgis_offlineURL: "http://172.16.60.150:4080",

  // ArcGis地图底图服务请求地址
  arcgis_RESTServerURL:
    "http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer",

  // 离线地图通用LBS服务请求地址
  offlineMap_LBSServerURL: "http://172.16.60.42:9999/hdty-gis-api",

  // 常用软件下载地址
  commonSoftwareURL: "http://appstore.hdtyserv.com/soft",

  // 启用请求签名
  signatureENABLED: false,

  // 请求签名算法（aes / sm4）
  signatureMETHOD: "aes",

  // 启用请求加密
  encryptENABLED: false,

  // 请求加密算法（aes / sm4）
  encryptMETHOD: "aes",

  // 跳转治搜系统个人档案 AES 加解密 key
  searchCryptKey: "hdty-spcs-search",

  // 需要缓存的业务配置
  ywConfig: [
    { key: "RW", keyItem: "yjcs" },
    { key: "RW", keyItem: "yjCityList" },
    { key: "RW", keyItem: "yjCityListExclude" },
    { key: "RW", keyItem: "yjCityConfig" },
    { key: "RW", keyItem: "zpCityConfig" },
    { key: "RW", keyItem: "nFormId" },
    { key: "RW", keyItem: "nLogoutFormId" },
    { key: "RW", keyItem: "nLogoutPcsCity" },
    { key: "RW", keyItem: "yjNeedAddressFormId" },
    { key: "RW", keyItem: "multipleAssignmentsFormId" },
    { key: "RW", keyItem: "nYjFormId" },
    { key: "RW", keyItem: "cityNotHtForm" },
    { key: "RW", keyItem: "spgjFormId" },
    { key: "RW", keyItem: "rwBaseConfig" }
  ],
  // 设置是否禁止通过本系统登录
  loginDisabled: false,
  // 鄂尔多斯基管门户地址
  eedsJgMh: "http://172.16.60.175:8888/hdty-flex-view-web"
};
