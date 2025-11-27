/**
 * 全局常量配置
 */

// 坐标系类型
const coordType = {
  // 地心坐标系
  WGS84: "0",
  // 百度坐标系
  BD09: "1",
  // 火星坐标系（即谷歌、高德）
  GCJ02: "2"
};

// 字典类型
const dictType = {
  /** 内置字典常量 */
  // 性别
  gender: "001",
  // 民族
  nation: "002",
  // 文化程度
  culture: "003",
  // 政治面貌
  politics: "004",
  // 婚姻状况
  marriage: "005",
  // 血型
  blood: "006",
  // 兵役状况
  soldier: "008",
  // 宗教信仰
  religion: "009",
  // 是否
  isOrNot: "012",
  // 车辆颜色
  carColor: "100",
  // 职业类型
  profession: "3768",
  // 职务
  duties: "180",
  // 劳务性质
  labour: "181",
  // 案件类别
  ajlb: "186",
  // 报警方式
  alarmMethod: "188",
  // 口音
  accent: "223",
  // 车辆号牌种类
  clhpzl: "226",
  // 读取状态
  readFlag: "243",
  // 管控方式
  gkfs: "388",
  // 配合情况
  phqk: "389",
  // 关注人员数据状态
  zdrygkzt: "390",
  // 关注人员管控等级
  zdrygkdj: "391",
  // 关注人员管控频率
  zdrygkpl: "393",
  // 体型
  body: "394",
  // 脸型
  face: "395",
  // 经济
  economic: "396",
  // 警员类型
  policePersonType: "199",
  // 附件名称
  annexType: "397",
  // 业务类型
  businessType: "3743", // 398
  // 审批状态
  spzt: "399",
  // 督办来源
  dbly: "401",
  // 车牌地域
  cpdy: "421",
  // 车牌地市
  cpds: "422",
  // 关注人员关系类型
  rygxlx: "3794",
  // 失控类型
  sklx: "437",
  // 菜单性质
  menuProperty: "1011",
  // 机构级别
  orgLevel: "1013",
  // 消息大类
  msgCategory: "1014",
  // 消息小类
  msgSubCategory: "1015",
  // 菜单类型
  menuType: "1016",
  // 客户端类型
  clientType: "1017",
  // 启用状态
  userEnable: "1018",
  // 日志等级
  logLevel: "1019",
  // 消息主题
  msgTopic: "1020",
  // 消息通知类型
  msgNotifyType: "1021",
  // 消息类型
  msgType: "1022",
  // 消息读取状态
  msgReadStatus: "1023",
  // 路由视图类型
  routerViewType: "1024",
  // 链接方式
  linkType: "1025",
  // 删除类型
  delType: "1027",
  // 慢sql查询方式
  slowSqlType: "1028",
  // 可识别证件类型
  identIDType: "1030",
  // 设备类型
  deviceType: "1031",
  // 日志操作类型
  opeType: "1033",
  // app跳转类型
  appLinkType: "1148",
  // 用户反馈类型
  feedbackType: "2999",

  /* -------------------------分割线------------------------- */

  /** 个性化字典常量 */

  //智慧内保单位类型
  wipUnitType: "2127",
  //行业类型
  companyType: "015",
  //企业状态
  companyState: "020",
  //车身主色
  carColor: "100",
  //车牌颜色
  carNumColor: "519",
  //车辆品牌
  carBrand: "419",
  //车辆类型
  carType: "340",
  //证件类型
  cardType: "1257",
  //签证类型
  visaType: "123",
  //国籍
  nationality: "045",
  // 主客类型
  visitMaintype: "193",
  // 是否主访客
  visitIsmain: "183",
  //职务
  visitPost: "106",
  //是否补录
  ismakeup: "2130",
  //是否结案
  isfinish: "2131",
  // 是否上传
  isUpload: "204",
  //采集类型
  collectionType: "330",
  // 预警业务类型
  alarmBusItemType: "1541",
  //医院就医人员类型
  hospitalPersionType: "2135",
  //医院就医人员数据状态
  hospitalDataState: "2136",
  //医院就医人员黑名单类型
  blackList: "2142",
  //照片是否合格
  photoQualified: "039",
  //签收状态
  signState: "2201",
  // 数据来源
  sjly: "2568",
  // 关注人员类型（新）
  zdrylxNew: "2572",
  // 群体类别（新）
  sqlxNew: "2573",
  // 治安上方类型
  zasflx: "2575",
  // 列管级别
  wkdj: "2577",
  //布控状态
  bkztEdit: "2579",
  // 行业类型（树形结构 9大模块方式)
  industryType: "2526",
  // 下发状态
  issueStatus: "2564",
  // 协查状态
  feedbackStatus: "2628",
  // 管控单位类型
  controlUnitType: "2645",
  // 审批业务类型
  approveBusType: "2663",
  // 审批流程最终审批状态
  approveFinalStatus: "2669",
  // 涉访类型
  visitType: "2674",
  // 任务状态（新督办功能使用）
  taskState: "2684",
  // 群体类别（核查签收、督办等业务使用）
  qtlb: "2685",
  // 反馈状态（督办功能使用）
  chiefFeedbackStatus: "2687",
  // 签收状态（督办功能使用）
  chiefSignStatus: "2688",

  // 部级线索派发状态
  clueDistributeStatus: "3008",

  // 肇事肇祸精神病人细类
  zszhjsbrXL: "3121",
  // 肇事肇祸精神病人级别
  zszhjsbrLevel: "3122",

  // 关注人员-常规标签
  zdryCgbq: "3206",
  // 关注人员-人员现状
  zdryRyxz: "3207",

  // 关注人员 发型
  zdryFx: "3217",
  // 关注人员 眼皮
  zdryYp: "3218",

  // 警情信息数据状态
  jqStatus: "3263",

  //超过五年是否继续纳管
  zdrkCgwnsfjxng: "3340",
  // 扬言途径
  yytj: "3342",
  // 扬言报复社会管控措施
  zygkcsdm: "3343",
  // 是否涉访
  sfsf: "3344",
  // 家庭监护状况
  jtjhzk: "3345",
  // 受教育情况
  sjyqk: "3346",
  // 是否实行强制医疗
  sfzxqzyl: "3347",
  // 精神障碍危险性评估等级
  jszawxxpgdj: "3348",
  // 现实状态
  xszt: "3349",
  // 数据来源库
  silyk: "3350",
  // 社会关系
  shgx: "1533",
  // 关注人员拓展信息社会关系
  kzxxShgx: "3352",

  // 关注人员撤管原因
  withdrawalReason: "3362",
  // 关注人员变更类型
  zdryChangeType: "3508",
  // 关注人员 其他稳控人员  人员类型
  qtwkRylx: "3536",
  // 关注人员 人员下发 配置类型
  ryxfConfigType: "3568",

  // 数据来源
  tunnelSjly: "3596",

  // 父母状况
  fmzkCode: "3666",
  // 严重危害社会行为类别
  yzwhshxwlbCode: "3667",
  // 处罚情况
  cfqkCode: "3668",
  // 矫治情况
  jzqkCode: "3669",
  // 矫治教育措施
  jzjycsCode: "3670",
  // 提请专门教育情形
  tqzmjyqxCode: "3671",

  // 审批当前状态
  spDqzt: "2143",

  // XSFZ  风险等级
  fxdj: "3684",

  // 通道下发类型
  issueType: "3685",

  // 督办类型
  superviseType: "3716",

  // 在住离开情况
  zzlkqk: "3735",

  // 注销状态
  logoutStatus: "136",

  // 单位类别
  unitcategory: "3783",

  // 单位类别细类
  unitcategoryDetail: "3851",

  // 行业类别
  hylb: "2811",

  // 经济类型
  economicsgenre: "174",

  // 智慧内保细类
  subclass: "3851",

  //实有单位从业人员类型(境内，港澳台，境外)
  cyrylx: "3283",

  // 国家代码 国籍
  nationalityType: "045",
  // 政治面貌
  zzmm: "004",
  // 兵役状况
  byzk: "008",
  // 健康状况
  health: "007",
  // 血型
  xx: "006",
  // 宗教信仰
  zjxy: "009",
  // 文化程度
  schoolLevel: "003",
  // 婚姻状况
  marriageType: "005",

  // 人员类别
  rydylb: "2775",
  // 人员类别（从业人员）
  cyrylb: "2813",
  // 职业类别
  zylb: "2781",
  // 劳务性质
  lwxz: "181",
  // 职务 01、主任  02、副主任  03、委员
  zbzzzw: "288",
  // 安保人员类型
  personBwry: "3597",
  //专长
  zc: "229",
  lwxz: "181",

  // 港澳台证件类型
  cardTypeGat: "1285",

  // 地址元素类型
  addressType: "2793",

  // 注销状态
  zxbs: "099",

  // 治综门户警种信息
  zzmhJzxx: "2555",

  // 任务中心
  // 任务中心流程：任务类型
  rwlx: "3255",
  // 中心流程：任务等级
  rwdj: "3256",
  // 中心流程：任务周期类型
  rwTimeType: "3257",

  // 任务中心2.0  yqType  逾期状态
  yqType: "3369",
  // 任务中心2.0 任务所属级别
  createOrgLevel: "3509",
  // 任务中心2.0 核查状态
  taskCheckStatus: "3512",
  // 推送状态
  pushStatus: "3533",
  // 匹配状态
  matchingStatus: "3534",

  // 任务来源-任务中心筛序使用
  taskSource: "3179",

  // 任务类型
  taskType: "3177",
  // 任务状态
  taskZt: "4015", // 原：3178
  // 任务下发数据来源
  taskLy: "3179",
  // 任务审批状态
  rwspStatus: "3744",

  // 标准件 表单类型
  formType: "3265",
  // 表单附件类型
  formFileType: "3266",
  // 标准件过滤类型
  formFilterType: "3810",

  // 任务标准件父级key
  formParentKey: "3796",

  // 任务办理类型
  taskHandleType: "3586",

  // 业务审批类型
  ywspType: "3797",

  // 业务审批 机构匹配模式,
  ywspOrgMatch: "3799",

  // 审批模式
  ywspMode: "3798",

  // 创建任务、允许办理的用户机构类型
  allowOrgType: "3941",

  // 任务中心 - 待分配 操作类型
  operationType: "4017",

  // 启用状态
  enableStatus: "2119"
};

// 字典项
const dictItem = {
  /** 内置字典常量 */
  // 是否
  isOrNot: {
    is: "1",
    not: "0"
  },
  // 菜单性质
  menuProperty: {
    nav: "1",
    route: "0"
  },
  // 机构级别
  orgLevel: {
    // 公安部
    gab: "1",
    // 省厅
    st: "2",
    // 市局
    sj: "3",
    // 分局
    fj: "4",
    // 派出所
    pcs: "5",
    // 未知
    wz: "6",
    // 责任区
    zrq: "7",
    // 警务网格
    jwwg: "8"
  },
  // 菜单类型
  menuType: {
    // 枝干节点
    branchNode: "0",
    // 叶子节点
    leafNode: "1"
  },
  // 客户端类型
  clientType: {
    // PC
    pcTerminal: "0",
    // 手机
    appTerminal: "1"
  },
  // 链接方式
  appLinkType: {
    //默认类型
    default: "0",
    //插件类型
    pluggable: "1",
    //H5类型
    html5: "3",
    //第三方类型
    third: "5"
  },
  // 日志等级
  logLevel: {
    // 跟踪
    trace: "TRACE",
    // 调试
    debug: "DEBUG",
    // 信息
    info: "INFO",
    // 警告
    warn: "WARN",
    // 错误
    error: "ERROR",
    // 致命
    fatal: "FATAL"
  },
  // 消息大类
  msgCategory: {
    // 预警
    alarmType: "10"
  },
  // 消息主题
  msgTopic: {
    // 预警
    alarmType: "01",
    // 申请
    applyType: "02",
    // 提醒
    remindType: "03",
    // 通知
    notifyType: "04"
  },
  // 消息通知类型
  msgNotifyType: {
    // 静默
    silence: "1",
    // 自动关闭
    autoClose: "2",
    // 手动关闭
    manualClose: "3"
  },
  // 消息类型
  msgType: {
    // 只读
    readOnly: "1",
    // 处理
    handle: "2"
  },
  // 消息读取状态
  msgReadStatus: {
    // 未读
    unRead: "0",
    // 已读
    haveRead: "1"
  },
  // 路由视图类型
  routerViewType: {
    // 全屏视图
    App: "10",
    // 页签视图
    Layout: "20"
  },
  // 链接方式
  linkType: {
    // 默认跳转
    default: "10",
    // 动态组件
    component: "15",
    // 链接系统
    system: "20",
    // 链接网址
    website: "30"
  },

  /* -------------------------分割线------------------------- */

  /** 个性化字典常量 */

  gkfs: {
    dhwk: "01", // 电话稳控
    jmwk: "02", // 见面稳控
    lxjc: "03", // 例行检查
    qt: "04" // 其他
  },

  // 国内方可照片类型
  lvisitorPhotoType: {
    scene: 1,
    certificate: 2
  },
  // 下发状态
  issueStatus: {
    yxf: "1",
    wxf: "0"
  },
  // 反馈状态
  feedbackStatus: {
    wxf: "0", // 未下发
    dqs: "1", // 待签收
    yqswfk: "2", // 已签收未反馈
    yfk: "3", // 已反馈
    wxfText: "未下发", // 未下发
    dqsText: "待签收", // 待签收
    yqswfkText: "已签收未反馈", // 已签收未反馈
    yfkText: "已反馈" // 已反馈
  },

  // 管控单位类型
  controlUnitType: {
    hjdgk: "1", // 户籍地管控
    xzdgk: "2", // 现住地管控
    sdgk: "3", // 双地管控
    sfdqs: "4" //事发地管控
  },

  // 审批业务类型
  approveBusType: {
    lg: "1", // 列管
    bg: "2", // 变更
    cg: "3", // 撤管
    clx: "4", // 撤销类型
    yj: "6", // 移交
    bgZjlx: "7", // 变更-追加类型
    bgSfgyfz: "8", // 变更-是否故意犯罪
    bgSfrq: "9", // 变更-释放日期
    bgZszhlx: "10", // 变更-肇事肇祸类型
    bgZszhjb: "11", // 变更-肇事肇祸级别
    bgLgjb: "12", // 变更-列管级别
    tdxfqs: "13" // 通道下发签收
  },

  // 关注人员变更类型
  zdryBgType: {
    bgZjlx: "01", // 变更-人员类型追加
    bgSfgyfz: "02", // 变更-是否故意犯罪
    bgSfrq: "03", // 变更-释放日期
    bgZszhlx: "04", // 变更-肇事肇祸类型
    bgZszhjb: "05", // 变更-肇事肇祸级别
    bgLgjb: "06" // 变更-列管级别
  },

  // 关注人员数据状态
  zdrygkzt: {
    dlg: "0",
    dlgTxt: "待列管",
    lg: "1",
    lgTxt: "列管",
    cg: "2",
    cgTxt: "撤管",
    wlg: "3",
    wlgTxt: "未列管",
    zc: "4",
    zcTxt: "暂存"
  },

  // 各个业务的审批状态
  spzt: {
    lgIng: "4", // 列管审批申请
    lgIs: "5", // 列管审批通过
    lgNot: "6", // 列管审批不通过
    bgIng: "7", // 变更审批申请
    bgIs: "8", // 变更审批通过
    bgNot: "9", // 变更审批不通过
    cgIng: "1", // 撤管审批申请
    cgIs: "2", // 撤管审批通过
    cgNot: "3", // 撤管审批不通过
    clxIng: "10", // 撤销类型审批申请
    clxIs: "11", // 撤销类型审批通过
    clxNot: "12", // 撤销类型审批不通过
    yjIng: "16", // 撤销类型审批不通过
    yjIs: "17", // 撤销类型审批不通过
    yjNot: "18", // 撤销类型审批不通过
    lgIngText: "列管审批申请", // 列管审批申请
    lgIsText: "列管审批通过", // 列管审批通过
    lgNotText: "列管审批不通过", // 列管审批不通过
    bgIngText: "变更审批申请", // 变更审批申请
    bgIsText: "变更审批通过", // 变更审批通过
    bgNotText: "变更审批不通过", // 变更审批不通过
    cgIngText: "撤管审批申请", // 撤管审批申请
    cgIsText: "撤管审批通过", // 撤管审批通过
    cgNotText: "撤管审批不通过", // 撤管审批不通过
    clxIngText: "撤销类型审批申请", // 撤销类型审批申请
    clxIsText: "撤销类型审批通过", // 撤销类型审批通过
    clxNotText: "撤销类型审批不通过", // 撤销类型审批不通过
    yjIngText: "移交审批不通过", // 移交审批不通过
    yjIsText: "移交审批不通过", // 移交审批不通过
    yjNotText: "移交审批不通过" // 移交审批不通过
  },

  // 审批流程最终审批状态
  approveFinalStatus: {
    tg: "1", // 通过
    btg: "0" // 不通过
  },

  // 关注人员类型
  zdrylxNew: {
    sfry: "070000000000",
    sfryText: "涉访人员"
  },

  // 群体类别
  sqlxNew: {
    qtffry: "990000",
    qtffryText: "其他非访人员"
  },

  // 列管级别
  wkdj: {
    e: "5",
    eText: "E级"
  },

  // 涉访类型
  visitType: {
    gf: "0", // 个访
    qf: "1" // 群访
  },

  // 任务状态（督办功能使用）
  taskState: {
    wxf: "0", // 未下发
    jxz: "1", // 进行中
    js: "9" // 结束
  },

  // 反馈状态（督办功能使用）
  chiefFeedbackStatus: {
    wfk: "0", // 未反馈
    yfk: "1", // 已反馈
    th: "9" // 退回
  },

  // 签收状态（督办功能使用）
  chiefSignStatus: {
    wqs: "0", // 未签收
    yqs: "1" // 已签收
  },

  // 部级线索派发状态
  clueDistributeStatus: {
    wpf: "0", // 未派发
    ypf: "1", // 已派发
    ysc: "9" // 已删除
  },

  // 预警签收状态
  alarmSignState: {
    wqs: "0", // 未签收
    wqsText: "未签收", // 未签收
    yqs: "1", // 已签收
    yqsText: "已签收" // 已签收
  },

  //通道下发签收状态
  tunnelSignState: {
    wqs: "0",
    wqsText: "未签收",
    yqs: "4",
    yqsText: "已签收"
  },

  // 受教育情况
  sjyqkType: {
    //上学
    sx: "1",
    // 辍学
    cx: "2",
    // 已完成义务教育
    ywcywjy: "3"
  },

  //人员类型
  cypersonType: {
    jn: "1",
    gat: "2",
    jw: "3"
  },

  // 单位类别
  ywlb: {
    // 宗教场所
    zj: "14"
  }
};

// 字典状态（再次列管功能相关接口所需状态）
const dictStatus = {
  other: "0",
  lg: "1",
  file: "2",
  lgjl: "3"
};

const houseFlag = {
  publicHouse: "1", // 房屋管理模块列表-详情
  myHouse: "2", // 我的房屋列表-详情
  trackHouse: "3", // 居住轨迹列表-详情
  checkHouse: "4" // 核验列表-详情
};

// 静态字典项
const dictOptions = {
  isSignZdry: [
    {
      id: "100000055005CBF574546C44B169F5B9",
      key: "1",
      value: "是，列管为关注人员"
    },
    {
      id: "100000055015CBF574546C44B169F5B9",
      key: "0",
      value: "否，不列管为关注人员"
    }
  ]
};

// 业务类型
const businessType = {
  dj: "1", // 登记
  gk: "2", // 管控
  cg: "3", // 撤管
  db: "4", // 督办
  hc: "5", // 核查
  clx: "6", // 撤销类型
  xspf: "7", // 线索派发
  yj: "30", // 移交
  zjlx: "31", // 追加类型
  sfgyfz: "32", // 故意犯罪
  sfrq: "33", // 释放日期
  zszhlx: "34", // 关注人员-变更肇事肇祸类型
  zszhjb: "35", // 关注人员-变更肇事肇祸级别
  lgjb: "36", // 关注人员-变更列管级别
  tdxfqs: "37", // 通道下发签收
  ryjqzp: "38", // 人员近期照片
  clzp: "39", // 车辆照片
  zdmblgyj: "40" // 重点目标列管依据
};

// 关注人员类型
const zdryLxType = {
  skry: "010000000000", // 涉恐人员
  swry: "020000000000", // 涉稳人员
  ztry: "030000000000", // 在逃人员 暂无
  sdry: "040000000000", // 涉毒人员
  xsfzqkry: "050000000000", // 故意犯罪刑满释放不满五年的人员
  zszhjsbr: "060000000000", // 肇事肇祸精神病人
  zdsfry: "070000000000", // 重点上访人员
  bdgzry: "990000000000", // 本地关注人员 其他关注人
  qtgdyr: "999900000000", // 其他规定的人员

  grjdblgk: "024100000000", // 个人极端暴力倾向人员
  flgdxjry: "024200000000", // 法轮功等邪教人员
  dcxxzsry: "024300000000", // 多次寻衅滋事人员
  qhtrlyry: "024400000000", // 侵害他人利益人员
  sdshfmplry: "024500000000", // 煽动社会负面评论人员
  rlggzxwdry: "024600000000", // 扰乱公共秩序稳定人员
  yybfshtr: "024700000000", // 扬言报复社会他人
  jtbljhr: "024800000000", // 家庭暴力加害人
  yyzblxwwcnr: "024900000000", // 严重不良行为未成年人
  xcsdwhgjaqdry: "025000000000", // 宣传煽动危害国家安全的人员
  bbdzzqldzf: "025100000000", // 被剥夺政治权利的罪犯

  bqbhsr: "991400000000", // 被取保候审人
  bjsjzr: "991500000000" // 被监视居住人
};

// 关注人员对象
const zdryLxTypeObj = [
  { key: "010000000000", name: "涉恐人员" },
  { key: "020000000000", name: "涉稳人员" },
  { key: "030000000000", name: "在逃人员" },
  { key: "040000000000", name: "涉毒人员" },
  { key: "050000000000", name: "故意犯罪刑满释放不满五年的人员" },
  { key: "060000000000", name: "肇事肇祸精神病人" },
  { key: "070000000000", name: "重点上访人员" },
  { key: "990000000000", name: "本地关注人员" }
];

// 关注人员类型  需要特殊处理大类与小类的数据
const zdryLxParentType = [
  // {
  //   key: "020000000000",
  //   name: "涉稳人员",
  //   sessionKey: "dict_zdrylx_020000000000",
  //   alartHtml: `当前关注人员类型存在【涉稳人员】【大】类：<br/>需要选择到【涉稳人员】【细】类，如选择“个人极端暴力倾向人员”等。`,
  //   msgHtml: `当前关注人员类型存在【涉稳人员】【大】类：<br/>需要选择到【涉稳人员】【细】类，如选择“个人极端暴力倾向人员”等。如需撤管该类型，请移步至“撤管”操作`
  // },
  {
    key: "990000000000",
    name: "其他类型人员",
    sessionKey: "dict_zdrylx_990000000000",
    alartHtml: `当前关注人员类型存在【其他类型人员】【大】类：<br/>需要选择到【其他类型人员】【细】类，如选择“取保候审”等。`,
    msgHtml: `当前关注人员类型存在【其他类型人员】【大】类：<br/>需要选择到【其他类型人员】【细】类，如选择“取保候审”等。如需撤管该类型，请移步至“撤管”操作`,
    excludeKeys: ["999900000000", "010000000000"]
  }
];

// 群体类别
const zdryRyxlType = [
  {
    id: "e3cf50eb10bb4d47b399572fee8a8a9c",
    key: "050000",
    value: "退役人员涉访群体",
    parentId: null,
    children: [
      {
        id: "7f859b2f0ac346a197f3113ec20dee8b",
        key: "050100",
        value: "复员自主择业干部",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "6d30d96ea33549ad8a89e3b9da01a207",
        key: "050200",
        value: "下岗军转干部",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "41f96158f1cd4df48b6a3a34f971cc1e",
        key: "050300",
        value: "下岗转业士官",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "0a17e8736344472993a3b1a2198e97e2",
        key: "050400",
        value: "下岗转业志愿兵",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "3eb5b33fac464954894f92590fa47d8b",
        key: "050500",
        value: "自谋职业士官志愿兵",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "40ed6b7c270248aca8cae025cd04a26c",
        key: "050600",
        value: "下岗城镇义务兵（城占农）",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "0bbdbdac71464125a57104c085b9eec7",
        key: "050700",
        value: "未安置城镇义务兵志愿兵",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "1b6d6d96a45d4156be522a074d40e987",
        key: "050800",
        value: "农村义务兵",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "269d78b87e0348e199c58d2c50df9b1d",
        key: "050900",
        value: "银行买断失业",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "1e024af37691450fad6b25519e4713ee",
        key: "051000",
        value: "两参人员（参战）",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "dda220dd7cf44d72bb60ce9b37d484fd",
        key: "051100",
        value: "两参人员（参核）",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "e75fb4061d594a11bc141eaafd2d1167",
        key: "059900",
        value: "其他退役人员涉访群体",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "6b53ef3f1af340ba983db07c8327dd15",
        key: "051200",
        value: "再安置公益岗待遇",
        parentId: "050000",
        children: null,
        isLeaf: true
      },
      {
        id: "30d8726db03e4752a8928dfc7003a715",
        key: "051300",
        value: "编制待遇",
        parentId: "050000",
        children: null,
        isLeaf: true
      }
    ],
    isLeaf: false
  },
  {
    id: "c7530b3668da45fd8b8d12cf5db32c37",
    key: "030000",
    value: "投资受损",
    parentId: null,
    children: [
      {
        id: "ceca36c82b064a5f9356c9f5b5a1d88a",
        key: "030500",
        value: "鑫藏轩",
        parentId: "030000",
        children: null,
        isLeaf: true
      },
      {
        id: "8dbbf3b82eb548c9a2d7b7ef1aba8fd0",
        key: "030100",
        value: "新时代",
        parentId: "030000",
        children: null,
        isLeaf: true
      },
      {
        id: "8625eb233ad94c8c8632b9905701a87c",
        key: "030200",
        value: "E租宝",
        parentId: "030000",
        children: null,
        isLeaf: true
      },
      {
        id: "1b57bee358ee44e9ae34eb4e52dec958",
        key: "030300",
        value: "日益盛",
        parentId: "030000",
        children: null,
        isLeaf: true
      },
      {
        id: "15586283384d45918d0ecfc86a3dd230",
        key: "039900",
        value: "其他投资受损",
        parentId: "030000",
        children: null,
        isLeaf: true
      },
      {
        id: "511ba12757e34659bad9b6ccdf71e57d",
        key: "030400",
        value: "恒越达",
        parentId: "030000",
        children: null,
        isLeaf: true
      }
    ],
    isLeaf: false
  },
  {
    id: "8a0d08e9c60b49b8a5d0393152e55ebf",
    key: "010000",
    value: "民代幼",
    parentId: null,
    children: [
      {
        id: "dfc3c8e80f204800983bc9dde8118748",
        key: "010100",
        value: "民办教师",
        parentId: "010000",
        children: null,
        isLeaf: true
      },
      {
        id: "1facf6de8aa8418295fcc4bea314aa95",
        key: "010200",
        value: "代课教师",
        parentId: "010000",
        children: null,
        isLeaf: true
      },
      {
        id: "ad243754e9c14624bcf054425ed6324c",
        key: "010300",
        value: "幼儿园教师",
        parentId: "010000",
        children: null,
        isLeaf: true
      }
    ],
    isLeaf: false
  },
  {
    id: "a9ed17cffb154e46aea9bfaf873240df",
    key: "090000",
    value: "90年代未分配大中专毕业生",
    parentId: null,
    children: null,
    isLeaf: true
  },
  {
    id: "4d2fc19c54f64db4b9599e048bfc55f5",
    key: "060000",
    value: "营运车辆",
    parentId: null,
    children: [
      {
        id: "78b4789518804a749dd49eaa8af96db3",
        key: "060100",
        value: "出租车司机（车主）",
        parentId: "060000",
        children: null,
        isLeaf: true
      },
      {
        id: "ad3f6c2476dc4a1c892802ee8ebe32e4",
        key: "060200",
        value: "网约车司机",
        parentId: "060000",
        children: null,
        isLeaf: true
      },
      {
        id: "2304a78e59004ce1a2a6f59dc3077a9e",
        key: "060300",
        value: "火车司机",
        parentId: "060000",
        children: null,
        isLeaf: true
      }
    ],
    isLeaf: false
  },
  {
    id: "eaae25af50774d0293a60fe332818928",
    key: "040000",
    value: "房地产纠纷",
    parentId: null,
    children: [
      {
        id: "b1985b9103ba4e97a1ec00e5f46e7035",
        key: "040800",
        value: "水电气热",
        parentId: "040000",
        children: null,
        isLeaf: true
      },
      {
        id: "5a38696cddcf4cc5b234ad4633995f96",
        key: "040100",
        value: "办理产权",
        parentId: "040000",
        children: null,
        isLeaf: true
      },
      {
        id: "3cb9d379d3dd4e7d8846bc095054af51",
        key: "040200",
        value: "拆迁",
        parentId: "040000",
        children: null,
        isLeaf: true
      },
      {
        id: "6579922409394a198f830fd409fb44bf",
        key: "040300",
        value: "房屋交付",
        parentId: "040000",
        children: null,
        isLeaf: true
      },
      {
        id: "6c05f08a32194d4aad5f5dc97bc7db77",
        key: "040400",
        value: "商户维权",
        parentId: "040000",
        children: null,
        isLeaf: true
      },
      {
        id: "d0eaeeca25e8461384490ad6e26e2b9b",
        key: "040500",
        value: "住宅维权",
        parentId: "040000",
        children: null,
        isLeaf: true
      },
      {
        id: "e227690754b84bc895ef501ba6e4b7d8",
        key: "040600",
        value: "一房多卖",
        parentId: "040000",
        children: null,
        isLeaf: true
      },
      {
        id: "788b9acdc3e94175a734970921ee9307",
        key: "040700",
        value: "物业",
        parentId: "040000",
        children: null,
        isLeaf: true
      },
      {
        id: "33617bc28850499eb473a7586801957a",
        key: "049900",
        value: "其他房地产纠纷",
        parentId: "040000",
        children: null,
        isLeaf: true
      }
    ],
    isLeaf: false
  },
  {
    id: "9f4dba9f2cc544acb5cdd3092ea6dc55",
    key: "020000",
    value: "土地纠纷",
    parentId: null,
    children: [
      {
        id: "9894b6d5a1a54809914baabc79dce600",
        key: "020100",
        value: "拆迁征地补偿",
        parentId: "020000",
        children: null,
        isLeaf: true
      },
      {
        id: "8e4ebc5082db4adf923ba809690c4f4d",
        key: "020200",
        value: "土地承包流转",
        parentId: "020000",
        children: null,
        isLeaf: true
      },
      {
        id: "22dc44a03dc74ee084f7206cd85e3042",
        key: "020300",
        value: "草牧场纠纷",
        parentId: "020000",
        children: null,
        isLeaf: true
      },
      {
        id: "58ca55d4032145c9a392a4426579759e",
        key: "029900",
        value: "其他土地纠纷",
        parentId: "020000",
        children: null,
        isLeaf: true
      }
    ],
    isLeaf: false
  },
  {
    id: "c7768389be5b4e15a187b3a1e262e920",
    key: "190000",
    value: "双语",
    parentId: null,
    children: null,
    isLeaf: true
  },
  {
    id: "a3596823d3cd4681a0c4523267a75f6d",
    key: "200000",
    value: "双减",
    parentId: null,
    children: null,
    isLeaf: true
  },
  {
    id: "b086e7bcf57849bc83c7df0be04389b4",
    key: "120000",
    value: "企业纠纷",
    parentId: null,
    children: [
      {
        id: "6b9573b386c848f196fba761b2a1d131",
        key: "120100",
        value: "拖欠工资",
        parentId: "120000",
        children: [
          {
            id: "6eeb0687f4ee4598a8602bc5c9c69658",
            key: "120101",
            value: "员工",
            parentId: "120100",
            children: null,
            isLeaf: true
          },
          {
            id: "69ffe669f8de4b2a8b54a6d2684990bd",
            key: "120102",
            value: "农民工",
            parentId: "120100",
            children: null,
            isLeaf: true
          }
        ],
        isLeaf: false
      },
      {
        id: "917458fd31954fbc9942030c64d9a4ef",
        key: "120200",
        value: "企业改制",
        parentId: "120000",
        children: null,
        isLeaf: true
      },
      {
        id: "a0959340de704cc79e5889e0ec78b689",
        key: "120300",
        value: "职工纠纷",
        parentId: "120000",
        children: null,
        isLeaf: true
      },
      {
        id: "2cb9f2bc1f074139a505dc70c40427d8",
        key: "120400",
        value: "养老待遇",
        parentId: "120000",
        children: null,
        isLeaf: true
      },
      {
        id: "6dec059a9d4e468a887658f49847749c",
        key: "120500",
        value: "事业单位改制",
        parentId: "120000",
        children: null,
        isLeaf: true
      },
      {
        id: "286521128f0347c2896accd18d373508",
        key: "129900",
        value: "其他企业纠纷",
        parentId: "120000",
        children: null,
        isLeaf: true
      }
    ],
    isLeaf: false
  },
  {
    id: "5945d6db2aaf43cbbbdcf14667c6ba11",
    key: "150000",
    value: "疫苗",
    parentId: null,
    children: null,
    isLeaf: true
  },
  {
    id: "c4f2d1f4305c43faa58fa762699be05a",
    key: "160000",
    value: "因病致贫",
    parentId: null,
    children: null,
    isLeaf: true
  },
  {
    id: "9f446a4d94704b7fb15c26cd2dd8928b",
    key: "170000",
    value: "涉法涉诉",
    parentId: null,
    children: null,
    isLeaf: true
  },
  {
    id: "a9af01fb3cdd42cebf60701e0e233b41",
    key: "180000",
    value: "医疗纠纷",
    parentId: null,
    children: null,
    isLeaf: true
  },
  {
    id: "35d435fdbeb2472b876eb51146d72b05",
    key: "950000",
    value: "生态环境",
    parentId: null,
    children: null,
    isLeaf: true
  },
  {
    id: "2fe6e4104ed1419f9f188d14a6a3128a",
    key: "960000",
    value: "劳动和社会保障",
    parentId: null,
    children: [
      {
        id: "7f4b37b008024d0098556086e3559efd",
        key: "960100",
        value: "工资待遇",
        parentId: "960000",
        children: null,
        isLeaf: true
      },
      {
        id: "59bb615e9bd641ae9da3b72a3242b41f",
        key: "960200",
        value: "退休待遇",
        parentId: "960000",
        children: null,
        isLeaf: true
      },
      {
        id: "1ceb5fa89efa478e89041e22f99cee31",
        key: "969900",
        value: "其他社会保障",
        parentId: "960000",
        children: null,
        isLeaf: true
      }
    ],
    isLeaf: false
  },
  {
    id: "16a54d29b958411cba63223c0a7e5b72",
    key: "970000",
    value: "恒大",
    parentId: null,
    children: [
      {
        id: "4f4a29efb38f40f5a69c70b8ba88578b",
        key: "970100",
        value: "房屋交付",
        parentId: "970000",
        children: null,
        isLeaf: true
      },
      {
        id: "91d0f0b6b79f46af9e43aeca0382aa2a",
        key: "970200",
        value: "拖欠工资",
        parentId: "970000",
        children: [
          {
            id: "971ade52793a4ddc89901c17314a980f",
            key: "970201",
            value: "员工",
            parentId: "970200",
            children: null,
            isLeaf: true
          },
          {
            id: "56fd347d97c640b3a272b560cca0cff5",
            key: "970202",
            value: "农民工",
            parentId: "970200",
            children: null,
            isLeaf: true
          }
        ],
        isLeaf: false
      },
      {
        id: "a1f73ddf7be2464dbb8dffdd0cffbc78",
        key: "970300",
        value: "投资理财",
        parentId: "970000",
        children: null,
        isLeaf: true
      },
      {
        id: "1d34b0376f054c8c9f0d4b13af58056c",
        key: "970400",
        value: "商票兑付",
        parentId: "970000",
        children: null,
        isLeaf: true
      },
      {
        id: "597c809b617e481fb6705927e66afe0d",
        key: "970500",
        value: "中介提成",
        parentId: "970000",
        children: null,
        isLeaf: true
      },
      {
        id: "6dba97fc5ea142649b039e05bd80de6a",
        key: "970600",
        value: "材料供应商",
        parentId: "970000",
        children: null,
        isLeaf: true
      },
      {
        id: "12961ecf8f84457eae63563bf7f367d2",
        key: "970700",
        value: "特价房",
        parentId: "970000",
        children: null,
        isLeaf: true
      }
    ],
    isLeaf: false
  },
  {
    id: "8763832381db453db31e6140aa9ee6c8",
    key: "980000",
    value: "其他上访群体",
    parentId: null,
    children: null,
    isLeaf: true
  },
  {
    id: "4eaa2ba6155b410fbc11b407eca3ee40",
    key: "990000",
    value: "其他非访人员",
    parentId: null,
    children: null,
    isLeaf: true
  }
];

const constData = {
  isSubSystem: false
};

const colorMap = [
  "#FFA07A",
  "#87CEEB",
  "#3CB371",
  "#FFD700",
  "#9370DB",
  "#FF69B4",
  "#FF8C00",
  "#1E90FF",
  "#FF6347",
  "#98FB98",
  "#4682B4",
  "#FF4500",
  "#32CD32",
  "#8A2BE2",
  "#D2691E",
  "#7FFF00",
  "#FF1493",
  "#00FFFF",
  "#DC143C",
  "#00FF7F",
  "#800080",
  "#B0E0E6",
  "#FFD700",
  "#A52A2A",
  "#00BFFF",
  "#B22222",
  "#ADFF2F",
  "#8B0000",
  "#FFD700",
  "#D8BFD8",
  "#FF6347",
  "#DAA520",
  "#F0E68C",
  "#FF8C00",
  "#98FB98",
  "#B0C4DE",
  "#FF1493",
  "#BDB76B",
  "#D3D3D3",
  "#7CFC00",
  "#FF00FF",
  "#FF1493",
  "#32CD32",
  "#800000",
  "#FF4500",
  "#20B2AA",
  "#A52A2A",
  "#6A5ACD",
  "#FF8C00",
  "#2F4F4F",
  "#00BFFF",
  "#F08080",
  "#D2691E",
  "#8A2BE2"
];

const colorList = [
  {
    itemColor: "#33ffcc",
    areaColor: "rgba(51, 255, 204, 0.2)"
  },
  {
    itemColor: "#ff3333",
    areaColor: "rgba(255, 51, 51, 0.2)"
  },
  {
    itemColor: "#33ff99",
    areaColor: "rgba(51, 255, 153, 0.2)"
  },
  {
    itemColor: "#ff99ff",
    areaColor: "rgba(255, 153, 255, 0.2)"
  },
  {
    itemColor: "#87CEEB",
    areaColor: "rgba(135, 206, 235, 0.2)"
  },
  {
    itemColor: "#FF69B4",
    areaColor: "rgba(255, 105, 180, 0.2)"
  },
  {
    itemColor: "#EEEE00",
    areaColor: "rgba(238, 238, 0, 0.2)"
  },
  {
    itemColor: "#CDCDC1",
    areaColor: "rgba(205, 205, 193, 0.2)"
  },
  {
    itemColor: "#33cc99",
    areaColor: "rgba(51, 204, 153, 0.2)"
  },
  {
    itemColor: "#3399ff",
    areaColor: "rgba(51, 153, 255, 0.2)"
  },
  {
    itemColor: "#9966cc",
    areaColor: "rgba(153, 102, 204, 0.2)"
  },
  {
    itemColor: "#ff3300",
    areaColor: "rgba(255, 51, 0, 0.2)"
  },
  {
    itemColor: "#66cc33",
    areaColor: "rgba(102, 204, 51, 0.2)"
  },
  {
    itemColor: "#99ccff",
    areaColor: "rgba(153, 204, 255, 0.2)"
  },
  {
    itemColor: "#FFC0CB",
    areaColor: "rgba(255, 192, 203, 0.2)"
  }
];

// 列管业务记录
const lgRecord = [
  "1-1-1",
  "1-1-2",
  "1-2-1",
  "1-2-2",
  "2-1-1",
  "2-1-2",
  "6-1-1",
  "6-1-3",
  "6-2-1",
  "6-2-2",
  "7-1-1",
  "7-1-3",
  "7-2-1",
  "7-2-2",
  "9-1-1",
  "11-1-1",
  "11-1-3",
  "11-2-1",
  "11-2-2",
  "11-3-1",
  "11-3-3"
];
// 撤管业务记录
const cgRecord = ["4-1-1", "4-1-2", "4-2-1", "4-2-2", "5-0-1", "5-0-2"];

// 附件名称（字典：397）
const fileName = {
  wfzfjlws: "02",
  wfzfjlwsText: "违法犯罪经历文书",
  nyjcbg: "04",
  nyjcbgText: "尿液检测报告",
  sxhb: "06",
  sxhbText: "思想汇报",
  qt: "08",
  qtText: "其他",
  dchscl: "11",
  dchsclText: "调查核实材料",
  ajcl: "12",
  ajclText: "案卷材料",
  bzs: "13",
  bzsText: "保证书",
  xcjmzp: "15",
  xcjmzpText: "现场见面照片",
  xmsftzs: "18",
  xmsftzsText: "刑满释放通知书",
  zwAndZwCjxx: "19",
  zwAndZwCjxxText: "指纹/掌纹采集信息",
  mfAndXyCjxx: "20",
  mfAndXyCjxxText: "毛发/血样采集信息",
  bjCjxx: "21",
  bjCjxxText: "笔记采集信息",
  tbtsbjxx: "22",
  tbtsbjxxText: "体表特殊标记",
  tstz: "23",
  tstzText: "特殊特征",
  pjs: "24",
  pjsText: "判决书",
  thcl: "25",
  thclText: "谈话材料",
  jqryzp: "26",
  jqryzpText: "近期人员照片",
  qtzmcl: "27",
  qtzmclText: "其他证明材料",
  flws: "28",
  flwsText: "法律文书",
  kgcl: "29",
  kgclText: "口供材料",
  dccljzmzj: "30",
  dccljzmzjText: "调查材料及证明证据",
  zdrylgcpb: "31",
  zdrylgcpbText: "关注人员列管呈批表",
  rhflzdrkglwts: "32",
  rhflzdrkglwtsText: "人户分离关注人员管理委托书",
  qtcl: "33",
  qtclText: "其他材料",
  zszhwxxpgb: "34",
  zszhwxxpgbText: "肇事肇祸危险性评估表",
  xzyzjszahzglxxb: "35",
  xzyzjszahzglxxbText: "乡镇(街道)严重精神障碍患者管理信息交换表",
  gzqkjlb: "36",
  gzqkjlbText: "工作情况记录表",
  jszahzjhrzrgzs: "37",
  jszahzjhrzrgzsText: "肇事肇祸精神障碍患者监护人责任告知书",
  yljzsqb: "38",
  yljzsqbText: "医疗救助申请表",
  qtclYyjz: "39",
  qtclYyjzText: "其他材料(医院就诊记录)",
  gzrjmzp: "40",
  gzrjmzpText: "见面照片"
};

// 人员标签
const personTag = {
  brwffzqkWal: "020100000000",
  brwffzqkWalText: "本人违法犯罪前科-危安类"
};

// 肇事肇祸表单需要校验的必填字段
const zszhjsbrRequiredProps = [
  {
    label: "精神疾病类型",
    prop: "qzjsjblx"
  },
  {
    label: "确诊医院名称",
    prop: "qzyyMc"
  },
  {
    label: "卫生管理单位",
    prop: "wsgldw"
  },
  {
    label: "是否实行强制医疗",
    prop: "sfzxqzylPdbs"
  },
  {
    label: "监护人姓名",
    prop: "jhrXm"
  },
  {
    label: "监护人身份证号",
    prop: "jhrGmsfhm"
  },
  {
    label: "与患者关系",
    prop: "yhzgx"
  },
  {
    label: "监护人手机号码",
    prop: "jhrSjhm"
  },
  {
    label: "数据来源库",
    prop: "sjlykdm"
  }
];

// 未成年人表单需要校验的必填字段
const wcnrRequiredProps = [
  {
    label: "家庭监护状况",
    prop: "jtjhzk"
  },
  {
    label: "受教育情况",
    prop: "sjyqk"
  },
  {
    label: "父母状况",
    prop: "fmzk"
  },
  {
    label: "监护人一姓名",
    prop: "jhryXm"
  },
  {
    label: "监护人一身份证号",
    prop: "jhryGmsfhm"
  },
  {
    label: "监护人一手机号码",
    prop: "jhrySjhm"
  },
  {
    label: "监护人一与未成年人关系",
    prop: "jhryYwcnrgx"
  },
  {
    label: "监护人二姓名",
    prop: "jhreXm"
  },
  {
    label: "监护人二身份证号",
    prop: "jhreGmsfhm"
  },
  {
    label: "监护人二手机号码",
    prop: "jhreSjhm"
  },
  {
    label: "监护人二与未成年人关系",
    prop: "jhreYwcnrgx"
  },
  {
    label: "严重危害社会行为类别",
    prop: "yzwhshxwlb"
  }
];

// 故意犯罪刑满释放不满五年的人员扩展信息
const xsfzRequiredProps = [
  {
    label: "案件名称",
    prop: "ajmc"
  },
  {
    label: "案件类别",
    prop: "ajlb"
  },
  {
    label: "简要案情",
    prop: "jyaql"
  },
  {
    label: "释放监狱(看守所)省市县(区)",
    prop: "sfjySsxq"
  },
  {
    label: "释放监狱(看守所)_名称",
    prop: "sfjyMc"
  },
  {
    label: "入狱(入所)时间",
    prop: "rysj"
  },
  {
    label: "释放时间",
    prop: "sfsj"
  }
];

// 车辆信息表单需要校验的必填字段
const carRequiredProps = [
  {
    label: "车牌号",
    prop: "carNum"
  },
  {
    label: "车身颜色",
    prop: "color"
  },
  {
    label: "车辆品牌",
    prop: "carBrand"
  },
  {
    label: "车辆型号",
    prop: "carType"
  },
  {
    label: "车主姓名",
    prop: "carOwner"
  },
  {
    label: "车主电话",
    prop: "lxdh"
  },
  {
    label: "身份证号",
    prop: "carOwnerGmsfzh"
  }
];

// 关系人信息表单需要校验的必填字段
const gxrRequiredProps = [
  {
    label: "人员关系",
    prop: "rygxlx"
  },
  {
    label: "人员姓名",
    prop: "xm"
  },
  {
    label: "身份证号",
    prop: "gmsfhm"
  },
  {
    label: "联系电话",
    prop: "lxdh"
  }
];

// 查询条件过滤类型
const formFilterType = [
  {
    label: "关注人员",
    value: "1"
  },
  {
    label: "实有人口",
    value: "2"
  },
  {
    label: "实有单位",
    value: "3"
  },
  {
    label: "预警信息",
    value: "4"
  }
];

// 表单项 使用类型
const formUseType = [
  {
    label: "app表单",
    value: "01"
  },
  {
    label: "app列表",
    value: "02"
  },
  {
    label: "pc表单",
    value: "03"
  },
  {
    label: "pc列表",
    value: "04"
  }
];
const formUseTypeMap = new Map([
  ["01", "app表单"],
  ["02", "app列表"],
  ["03", "pc表单"],
  ["04", "pc列表"]
]);

// 组件类型
const componentType = [
  {
    label: "标题",
    value: "title",
    configType: "title"
  },
  {
    label: "输入框",
    value: "input",
    configType: "input"
  },
  {
    label: "数量输入框",
    value: "number",
    configType: "number"
  },
  {
    label: "字典单选",
    value: "radio",
    configType: "radio"
  },
  {
    label: "字典多选",
    value: "checkbox",
    configType: "dict"
  },
  {
    label: "字典下拉框",
    value: "select",
    configType: "select"
  },
  {
    label: "文本输入框",
    value: "textarea",
    configType: "textarea"
  },
  {
    label: "级联选择框",
    value: "selectTree",
    configType: "dict"
  },
  {
    label: "日期选择框",
    value: "date",
    configType: "date"
  },
  {
    label: "日期时间选择框",
    value: "datetime",
    configType: "date"
  },
  {
    label: "图片附件",
    value: "file",
    configType: "file"
  },
  {
    label: "附件",
    value: "allFile",
    configType: "allFile"
  },
  {
    label: "按钮",
    value: "linkButton",
    configType: "button"
  },
  {
    label: "责任区民警",
    value: "customSelect",
    configType: "customSelect"
  },
  {
    label: "地区选择",
    value: "region",
    configType: "region"
  },
  {
    label: "机构选择",
    value: "organ",
    configType: "organ"
  },
  {
    label: "表格输入",
    value: "tableList",
    configType: "tableList"
  },
  {
    label: "提示",
    value: "tip",
    configType: "tip"
  }
];
// 组件类型Map映射
let componentTypeMap = new Map();
componentType.forEach((item) => {
  componentTypeMap.set(item.value, `${item.label} - ${item.value}`);
});

const formItemConfigMap = new Map([
  [
    "title",
    {
      label: "枪支弹药配备情况",
      prop: "qzdypbqk",
      type: "title"
    }
  ],
  [
    "input",
    {
      prop: "name",
      placeholder: "请输入人员姓名",
      label: "人员姓名",
      type: "input",
      disabled: true,
      rules: {
        required: true,
        requiredMsg: "人员姓名不能为空",
        validator: "checkChineseName"
      }
    }
  ],
  [
    "number",
    {
      prop: "jzgrs",
      label: "教职工人数",
      type: "number",
      placeholder: "请输入教职工人数",
      disabled: false,
      precision: 0,
      min: 0,
      rules: {
        required: true,
        requiredMsg: "教职工人数不能为空"
      },
      vIf: {
        logic: "single",
        vIfObj: {
          prop: "gcsmqsfzcyy",
          value: ["1"]
        }
      }
    }
  ],
  [
    "radio",
    {
      label: "",
      prop: "",
      type: "radio",
      typeId: "012",
      width: "50%",
      disabled: false,
      rules: {
        requiredMsg: "请选择",
        required: true
      },
      vIf: {
        logic: "single",
        vIfObj: {
          prop: "gcsmqsfzcyy",
          value: ["1"]
        }
      }
    }
  ],
  [
    "radio1",
    {
      label: "",
      prop: "",
      type: "radio",
      typeId: "012",
      width: "50%",
      disabled: false,
      rules: {
        requiredMsg: "请选择",
        required: true
      },
      vIf: {
        logic: "&&",
        vIfList: [
          {
            logic: "single",
            vIfObj: {
              prop: "gcsmqsfzcyy",
              value: ["1"]
            }
          },
          {
            logic: "single",
            vIfObj: {
              prop: "qylx",
              value: ["3"]
            }
          }
        ]
      }
    }
  ],
  [
    "textarea",
    {
      prop: "zayhjtqk",
      placeholder: "请输入具体情况",
      position: "top",
      label: "具体情况",
      type: "textarea",
      height: 35,
      maxlength: 200,
      disabled: false,
      rules: {
        required: true,
        requiredMsg: "具体情况不能为空"
      },
      vIf: {
        logic: "&&",
        vIfList: [
          {
            logic: "single",
            vIfObj: {
              prop: "gcsmqsfzcyy",
              value: ["1"]
            }
          },
          {
            logic: "single",
            vIfObj: {
              prop: "qtzayh",
              value: ["1"]
            }
          }
        ]
      }
    }
  ],
  [
    "dict",
    {
      prop: "jtqksfczfx",
      label: "是否存在家庭情况风险",
      position: "top",
      type: "radio",
      width: "50%",
      disabled: false,
      typeId: "012",
      rules: {
        required: true,
        requiredMsg: "请选择"
      }
    }
  ],
  [
    "select",
    {
      label: "性别",
      prop: "qzGender",
      propText: "qzGenderText",
      type: "select",
      typeId: "001",
      disabled: false,
      rules: {
        requiredMsg: "请选择性别",
        required: true
      }
    }
  ],
  [
    "date",
    {
      label: "日期",
      prop: "startDate",
      type: "date",
      placeholder: "请选择日期",
      disabled: false,
      rules: {
        requiredMsg: "日期不能为空",
        required: true
      }
    }
  ],
  [
    "file",
    {
      prop: "hdFileZlmybg",
      label: "佐证照片",
      position: "top",
      type: "file",
      disabled: false,
      rules: {
        required: true,
        requiredMsg: "请上传佐证照片"
      },
      vIf: {
        logic: "single",
        vIfObj: {
          prop: "sfzlmygb",
          value: ["1"],
          logicType: "||"
        }
      }
    }
  ],
  [
    "allFile",
    {
      prop: "hdFileZz",
      label: "佐证附件",
      position: "top",
      type: "allFile",
      disabled: false,
      rules: {
        required: true,
        requiredMsg: "请上传佐证附件"
      }
    }
  ],
  [
    "button",
    {
      prop: "qzdypbqk",
      label: "枪支弹药配备情况",
      type: "title"
    }
  ],
  [
    "customSelect",
    {
      prop: "hjdgkmj",
      placeholder: "请选择户籍地管控社区民警",
      label: "户籍地管控社区民警",
      type: "customSelect",
      maxlength: 15,
      disabled: false,
      rules: {
        required: true,
        requiredMsg: "户籍地管控社区民警不能为空"
      }
    }
  ],
  [
    "region",
    {
      prop: "hjdq",
      propText: "hjdqText",
      placeholder: "请选择户籍地区",
      label: "户籍地区",
      type: "region",
      disabled: false,
      rules: {
        required: true,
        requiredMsg: "户籍地区不能为空"
      }
    }
  ],
  [
    "organ",
    {
      prop: "gxjg",
      propText: "gxjgText",
      placeholder: "请选择管辖机构",
      label: "管辖机构",
      type: "organ",
      disabled: false,
      rules: {
        required: true,
        requiredMsg: "管辖机构不能为空"
      }
    }
  ],
  [
    "tableList",
    {
      label: "保安员信息",
      prop: "hdObjArrayBayList",
      position: "top",
      type: "tableList",
      placeholder: "请录入保安员信息",
      rowLength: 1,
      disabled: false,
      listProp: [
        {
          labelText: "姓名",
          labelProp: "xm"
        },
        {
          labelText: "联系电话",
          labelProp: "lxdh"
        }
      ],
      tableProps: [
        {
          prop: "xm",
          placeholder: "请输入姓名",
          label: "姓名",
          type: "input",
          maxlength: 15,
          disabled: false,
          rules: {
            required: true,
            requiredMsg: "请输入姓名",
            custom: "checkChineseName",
            customMsg: "输入正确姓名"
          }
        },
        {
          prop: "sfzh",
          placeholder: "请输入身份证号",
          label: "身份证号",
          isUnique: true,
          type: "input",
          maxlength: 18,
          disabled: false,
          rules: {
            required: true,
            requiredMsg: "请输入身份证号",
            custom: "validateIdcard",
            customMsg: "身份证号格式不正确或将X改为大写！"
          }
        },
        {
          prop: "lxdh",
          placeholder: "请输入联系电话",
          label: "联系电话",
          type: "input",
          maxlength: 12,
          disabled: false,
          rules: {
            required: true,
            requiredMsg: "请输入联系电话",
            custom: "validateMobile",
            customMsg: "联系电话格式不正确"
          }
        },
        {
          prop: "rzrq",
          placeholder: "请选择入职日期",
          label: "入职日期",
          type: "date",
          colWidth: 120,
          disabled: false,
          rules: {
            required: true,
            requiredMsg: "入职日期不能为空"
          }
        },
        {
          prop: "zylb",
          propText: "zylbText",
          placeholder: "请选择职业类别",
          label: "职业类别",
          type: "select",
          disabled: false,
          typeId: "2781",
          rules: {
            required: true,
            requiredMsg: "职业类别不能为空"
          }
        }
      ],
      vIf: {
        logic: "single",
        vIfObj: {
          prop: "gcsmqsfzcyy",
          value: ["1"]
        }
      }
    }
  ]
]);

// 勤务工作情况
const qwqkList = [
  {
    value: "启动公安武警联勤武装巡逻组(个)",
    key: "F_QDGAWJLQWZXLZ_NUM",
    prop: "qdgawjlqwzxlzNum"
  },
  { value: "出动常态化巡逻组(个)", key: "F_CDCTHXLZ_NUM", prop: "cdcthxlzNum" },
  { value: "出动民警(人)", key: "F_CDMJ_NUM", prop: "cdmjNum" },
  { value: "出动辅警(人)", key: "F_CDFJ_NUM", prop: "cdfjNum" },
  { value: "群防群治(人)", key: "F_QFQZ_NUM", prop: "qfqzNum" },
  { value: "出动武警(人)", key: "F_CDWJ_NUM", prop: "cdwjNum" },
  { value: "出动车辆(辆)", key: "F_CDCL_NUM", prop: "cdclNum" },
  { value: "盘查可疑人员(人)", key: "F_PCKYRY_NUM", prop: "pckyryNum" },
  { value: "检查可疑车辆(辆)", key: "F_JCKYCL_NUM", prop: "jckyclNum" },
  { value: "抓获逃犯(名)", key: "F_ZHTF_NUM", prop: "zhtfNum" },
  {
    value: "抓获现行违法犯罪嫌疑人(名)",
    key: "F_ZHXXWFFZXYR_NUM",
    prop: "zhxxwffzxyrNum"
  },
  { value: "打击现行违法犯罪(起)", key: "F_DJXXWFFZ_NUM", prop: "djxxwffzNum" },
  {
    value: "处置重大突发案事件(起)",
    key: "F_CZZDTFSJ_NUM",
    prop: "czzdtfsjNum"
  },
  { value: "收缴枪支(支)", key: "F_SJQZ_NUM", prop: "sjqzNum" },
  { value: "收缴仿真枪(支)", key: "F_SJFZQ_NUM", prop: "sjfzqNum" },
  { value: "收缴子弹(发)", key: "F_SJZD_NUM", prop: "sjzdNum" },
  { value: "收缴管制刀具(把)", key: "F_SJGZDJ_NUM", prop: "sjgzdjNum" },
  {
    value: "收缴其他危险管制物品(件)",
    key: "F_SJQTWXGZWP_NUM",
    prop: "sjqtwxgzwpNum"
  },
  { value: "备勤警力(人)", key: "F_BQJL_NUM", prop: "bqjlNum" },
  { value: "备勤枪支(支)", key: "F_BQQZ_NUM", prop: "bqqzNum" },
  { value: "备勤装备(件)", key: "F_BQZB_NUM", prop: "bqzbNum" },
  { value: "PTU快反组数(组)", key: "F_PTU_KFZS_NUM", prop: "ptuKfzsNum" },
  { value: "PTU快反人数(人)", key: "F_PTU_KFRS_NUM", prop: "ptuKfrsNum" }
];

// 人员标签接口配置
const rybqApiConfig = {
  url: "/web/fk/fkGzryLx/page",
  customApiDefaultParams: {
    current: 1,
    size: 1000,
    zxbs: "0"
  }
};

export default {
  coordType,
  dictType,
  dictItem,
  dictStatus,
  businessType,
  zdryLxType,
  zdryLxTypeObj,
  zdryRyxlType,
  constData,
  lgRecord,
  cgRecord,
  fileName,
  // 关注人员类型  需要特殊处理大类与小类的数据
  zdryLxParentType,
  // 肇事肇祸表单需要校验的必填字段
  zszhjsbrRequiredProps,
  // 未成年人表单需要校验的必填字段
  wcnrRequiredProps,
  // XSFZ需要校验的必填字段
  xsfzRequiredProps,
  // 车辆信息需要校验的必填字段
  carRequiredProps,
  // 关系人信息需要校验的必填字段
  gxrRequiredProps,
  // 静态字典项
  dictOptions,
  houseFlag,
  personTag,

  formFilterType,
  formUseType,
  formUseTypeMap,
  componentType,
  componentTypeMap,
  formItemConfigMap,

  // 勤务工作情况
  qwqkList,
  // 人员标签接口配置
  rybqApiConfig,

  // 颜色
  colorMap,
  colorList
};
