/**
 * 生产环境配置
 */

export const appEnvProd = {
  // 应用程序标识
  appKEY: "hdty-flex-view",

  // 客户端类型（数据字典1017）
  clientTYPE: "0",

  // 基础请求地址
  baseURL: "http://26.169.100.38/hdty-eedsfkyw-server",

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
    //url: "ws://26.169.100.37:15675/ws", // 地址
    url: "ws://26.3.13.87/ws", // 地址
    username: "hdty", // 用户名
    password: "hdty_pwd", // 密码
    // mqtt重新连接间隔
    mqttReconnectTime: 2 * 1000
  },

  // 百度离线地图基础资源请求地址
  bmap_offlineURL: "http://26.3.50.6:6888",

  // ArcGis离线地图基础资源请求地址
  arcgis_offlineURL: "http://26.3.50.6:6888",

  // ArcGis地图底图服务请求地址
  arcgis_RESTServerURL: "http://26.3.12.43/arcgis/rest/services/nmsl/MapServer",

  // 是否启用顺丰地图
  openSFMap: true,

  // openlayer是否加载离线地图
  openlayer_OffLine: true,

  // openlayer底图服务请求地址
  openlayer_RESTServerURL:
    "http://26.3.12.43/arcgis/rest/services/nmsl/MapServer/tile/{z}/{y}/{x}",

  // openlayer顺丰网格图层请求地址
  openlayer_WMSServerUrl:
    "http://133.8.101.9:10184/proxy/08fe2621d8e716b02ec0da35256a998d/03afdbd66e7929b125f8597834fa83a4/api/my/wms/layer",

  // 离线地图通用LBS服务请求地址
  offlineMap_LBSServerURL: "http://26.3.13.87/hdty-gis-api",

  // 顺丰网格绘制地址
  sf_WMS_link: "http://26.3.14.191:8585/ioc/iocHome",

  // 丰图矢量底图
  ft_serverURL:
    "http://26.3.13.212:8090/MapVTService/vmapx/mapstyle/allvector_day",
  ft_serverURL_blue:
    "http://26.3.13.212:8090/MapVTService/vmapx/mapstyle/allvector_quiet-blue",

  // 丰图矢量网格图层
  // ft_WMSServerURL: 'http://133.8.101.9:10189/tile?x={x}&y={y}&z={z}',
  ft_WMSServerURL: "http://26.3.120.57:10189/tile?x={x}&y={y}&z={z}",

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

  // 编辑时：关注人员类型、群体类别、列管级别、附件是否禁用
  disabledSpEdit: false,

  // 点击工作台左上角总数，二级列表是否显示传入值
  showParamTotalForHomeIndex: true,

  // 生成pdf的画布系数
  canvasScale: 2,

  // 是否链接第三方（链接第三方时，避免因为第三方库链接失败，导致系统崩溃）
  linkThird: {
    jz: true // 警综库
  },

  // 可以使用人员档案的机构：包头
  allowRydaOrgList: ["1500", "1502", "1506"],

  // 可以使用电子签章的的机构：鄂尔多斯
  allowDzqzOrgList: ["1500", "1506"],

  // 验收演示相关开关
  acceptanceDemo: {
    // 演示用账号身份证号
    accountUserList: ["000000000000000000"],
    // 是否 显示涉恐人员
    isShowSkry: true,
    // 是否 显示通道下发人员 废弃按钮
    isShowChannel: true,
    // 是否显示 20250415 梳理删除的内容
    isShowDeleteYw: true,
    // 是否 显示全区治安字样
    isShowQqZa: false,
    // 全区反恐综合应用系统 替代文字
    qqZaContent: "反恐综合应用系统",
    // 验收开启
    enabled: true
  },

  // 已建设基础管控中心，但未独立架设的地市
  baseGKZJCity: ["1501", "1502"],

  // 关注人员类型是否自定义翻译
  zdrylxTranslateConfig: {
    enabale: true,
    gklx: ["2"],
    replaceMappings: [
      {
        oldValue: "故意犯罪刑满释放不满五年的人员",
        newValue: "刑事犯罪前科人员"
      }
    ]
  },

  // 跳转治搜系统个人档案 AES 加解密 key
  searchCryptKey: "hdty-spcs-search",

  // 需要缓存的业务配置
  ywConfig: [
    { key: "DW", keyItem: "dwlb" },
    { key: "DW", keyItem: "nbdwlb" },
    { key: "DW", keyItem: "keywords" },
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
  loginDisabled: true,
  // 鄂尔多斯基管门户地址
  eedsJgMh: "http://26.169.100.38"
};
