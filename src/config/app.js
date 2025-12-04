/**
 * 应用程序配置
 */

// 项目名称配置
const projectName = "基础管控系统·数据晾晒";
// const projectName = "鄂尔多斯基础管控系统";

// 项目标志配置
const projectLogo = {
  // 小型尺寸
  small: process.env.NODE_PATH + "/static/public/images/logo/small.png",
  // 中型尺寸
  medium: process.env.NODE_PATH + "/static/public/images/logo/medium.png",
  // 大型尺寸
  large: process.env.NODE_PATH + "/static/public/images/logo/large.png"
};

// 项目版权配置
const projectCopyright = [
  // "© 2019 华动泰越科技有限责任公司",
  // "版本 HdtyAdmin v1.7.0 Beta"
];

// 默认主题风格配置(classical-green / classical-green-header / police-blue / police-blue-header / ocean-blue-page)
const themeDefault = "classical-green";

// 默认布局大小配置(default / medium / small / mini)
const sizeDefault = "small";

// 默认布局方式配置(leftandright / upanddown)
const schemeDefault = "upanddown";

// 网站标题前缀配置
const webTitleSuffix = ""; // 华动泰越

// 网站图标配置
const webFavicon =
  process.env.NODE_PATH + "/static/public/images/logo/favicon.ico";

// 登录页项目名称对齐方式配置（left / center）
const loginTitleAlign = "left";

// 登录页项目名称后缀配置（推荐用于较短的项目名称以提升登录页UI效果）
const loginTitleSuffix = "登录";

// 登录页启用滑动验证配置
const loginSliderEnabled = false;

// 登录页启用横幅区轮播配置
const loginCarouselEnabled = false;

// 登录页启用横幅区轮播爆炸显示效果配置
const loginBombEnabled = true;

// 主布局启用顶部导航配置
const topnavEnabled = false;

// 顶部导航默认选中索引配置
const topnavCheckedIndex = 0;

// 顶部导航数量限制配置（0代表不限制）
const topnavLimit = 10;

// 顶部导航授权验证失败显示方式配置（hidden / disabled）（使用左右布局时自动转为hidden）
const topnavAuthorizationDefeat = "disabled";

// 主布局启用面包屑导航配置（主布局启用顶部导航时自动转为false）
const crumbEnabled = true;

// 主布局启用页面选项卡配置
const pagetabEnabled = true;

// 页面选项卡永久保留项配置
const pagetabKeeps = ["Home"];

// 主布局启用一键搜索配置
const searchEnabled = false;

// 网页启用水印保护配置
const watermarkEnabled = true;

// 水印启用脱敏配置
const watermarkMaskEnabled = true;

// 网络请求启用重复保护配置
const interruptEnabled = true;

// 左侧菜单栏默认折叠状态配置
const sideMenuDefaultCollapse = false;

// 左侧菜单栏默认展开首项菜单配置（0代表永不默认展开, *代表始终默认展开, 1-max代表小于等于几项时展开）
const sideMenuDefaultExpandFirst = 0;

// 左侧菜单栏启用标语配置
const sloganEnabled = false;

// 操作按钮启用角色授权验证配置
const btnAuthorizationEnabled = true;

// 操作按钮授权验证失败显示方式配置（hidden / disabled）
const btnAuthorizationDefeat = "hidden";

// 启用MQTT实时接收消息通知配置
const mqttMessageEnabled = true;

// 消息通知启用提示配置
const notifyEnabled = true;

// 消息通知启用提示音配置
const notifyBeepEnabled = true;

// 消息通知提示位置配置( bottomRight / bottomLeft / topRight / topLeft / topCenter / bottomCenter )
const notifyPosition = "bottomRight";

// 未读消息标记显示方式配置（dot / number）
const notifyUnreadBadge = "dot";

// 右侧消息中心启用消息分类显示配置
const categoryEnabled = true;

// 消息分类移除项配置（数组中是index值而非key值，如[0]表示隐藏第一项）
const categoryRemoveOptions = [];

// 右侧消息中心消息已读触发方式配置（scroll / click）
const readTrigger = "click";

// 右侧消息中心消息跳转启用始终打开新页面选项卡显示配置
const newpagetabEnabled = true;

// 启用接入系统初始化认证配置
const joinAppInitEnabled = false;

// 启用接入系统主题穿透配置
const joinAppPenetrateEnabled = true;

// 注册用户启用多角色分配配置
const roleMultipleEnabled = true;

// 注册用户默认有效期限配置
const userExpireTime = 99 * 365 * 24 * 60 * 60 * 1000;

// 登录页轮播图片配置
const carouselImages = [
  process.env.NODE_PATH + "/static/public/images/carousel/img-001.png",
  process.env.NODE_PATH + "/static/public/images/carousel/img-002.png"
];

// 左侧菜单栏标语图片配置
const sloganImages = {
  // 标语正文
  content: [
    process.env.NODE_PATH + "/static/public/images/slogan/img-001.png",
    process.env.NODE_PATH + "/static/public/images/slogan/img-002.png",
    process.env.NODE_PATH + "/static/public/images/slogan/img-003.png",
    process.env.NODE_PATH + "/static/public/images/slogan/img-004.png",
    process.env.NODE_PATH + "/static/public/images/slogan/img-005.png",
    process.env.NODE_PATH + "/static/public/images/slogan/img-006.png",
    process.env.NODE_PATH + "/static/public/images/slogan/img-007.png",
    process.env.NODE_PATH + "/static/public/images/slogan/img-008.png",
    process.env.NODE_PATH + "/static/public/images/slogan/img-009.png",
    process.env.NODE_PATH + "/static/public/images/slogan/img-010.png",
    process.env.NODE_PATH + "/static/public/images/slogan/img-011.png"
  ],
  // 标语页眉
  header: process.env.NODE_PATH + "/static/public/images/slogan/header.png",
  // 页脚
  footer: process.env.NODE_PATH + "/static/public/images/slogan/footer.png"
};

// 更多导航选项配置
const navMoreOptions = {
  code: "More",
  name: "更多功能",
  icon: "icon-service",
  children: []
};

// 全部导航选项配置
const navRootOptions = {
  name: "全部功能",
  icon: "icon-service"
};

// 分页选项配置
const paginationOptions = {
  current: 1,
  sizes: [10, 20, 50, 100],
  size: 10,
  total: 0
};

// 日期时间选择器快捷选项配置
const pickerShortcutOptions = {
  shortcuts: [
    {
      text: "昨天",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        end.setTime(new Date(end.toLocaleDateString()).getTime() - 1);
        start.setTime(
          new Date(start.toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000
        );
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "今天",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        end.setTime(
          new Date(end.toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
        );
        start.setTime(new Date(start.toLocaleDateString()).getTime());
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "本周",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        let year = start.getFullYear();
        let month = start.getMonth();
        let day = start.getDate();
        let weekday = [7, 1, 2, 3, 4, 5, 6][start.getDay()];
        end.setTime(
          new Date(year, month, day + 7 - weekday).getTime() +
            24 * 60 * 60 * 1000 -
            1
        );
        start.setTime(new Date(year, month, day + 1 - weekday).getTime());
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "本月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        let year = start.getFullYear();
        let month = start.getMonth();
        end.setTime(new Date(year, month + 1, 1).getTime() - 1);
        start.setTime(new Date(year, month, 1).getTime());
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近一周",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        end.setTime(
          new Date(end.toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
        );
        start.setTime(
          new Date(start.toLocaleDateString()).getTime() -
            6 * 24 * 60 * 60 * 1000
        );
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近一个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        let year = start.getFullYear();
        let month = start.getMonth();
        let day = start.getDate();
        end.setTime(
          new Date(end.toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
        );
        start.setTime(
          new Date(year, month - 1, day).getTime() + 24 * 60 * 60 * 1000
        );
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近三个月",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        let year = start.getFullYear();
        let month = start.getMonth();
        let day = start.getDate();
        end.setTime(
          new Date(end.toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
        );
        start.setTime(
          new Date(year, month - 3, day).getTime() + 24 * 60 * 60 * 1000
        );
        picker.$emit("pick", [start, end]);
      }
    },
    {
      text: "最近半年",
      onClick(picker) {
        const end = new Date();
        const start = new Date();
        let year = start.getFullYear();
        let month = start.getMonth();
        let day = start.getDate();
        end.setTime(
          new Date(end.toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
        );
        start.setTime(
          new Date(year, month - 6, day).getTime() + 24 * 60 * 60 * 1000
        );
        picker.$emit("pick", [start, end]);
      }
    }
  ]
};

// 条件选择器选项配置
const factorOptions = {
  // 逻辑运算符
  logicOpe: {
    // 与
    and: "and",
    // 或
    or: "or"
  },
  // 通配运算符
  matchOpe: {
    // 精确
    exact: "eq",
    // 之前模糊
    before: "likeLeft",
    // 之间模糊
    between: "like",
    // 之后模糊
    after: "likeRight"
  }
};

// 数据导出数量限制配置（0代表不限制）
const exportLimit = 0;

export default {
  // 项目名称配置
  projectName,
  // 项目标志配置
  projectLogo,
  // 项目版权配置
  projectCopyright,
  // 默认主题风格配置
  themeDefault,
  // 默认布局大小配置
  sizeDefault,
  // 默认布局方式配置
  schemeDefault,
  // 网站标题前缀配置
  webTitleSuffix,
  // 网站图标配置
  webFavicon,
  // 登录页项目名称对齐方式配置
  loginTitleAlign,
  // 登录页项目名称后缀配置
  loginTitleSuffix,
  // 登录页启用滑动验证配置
  loginSliderEnabled,
  // 登录页启用横幅区轮播配置
  loginCarouselEnabled,
  // 登录页启用横幅区轮播爆炸显示效果配置
  loginBombEnabled,
  // 主布局启用顶部导航配置
  topnavEnabled,
  // 顶部导航默认选中配置
  topnavCheckedIndex,
  // 顶部导航数量限制配置
  topnavLimit,
  // 顶部导航未获得授权显示方式配置
  topnavAuthorizationDefeat,
  // 主布局启用面包屑导航配置
  crumbEnabled,
  // 主布局启用页面选项卡配置
  pagetabEnabled,
  // 页面选项卡永久保留项配置
  pagetabKeeps,
  // 主布局启用一键搜索配置
  searchEnabled,
  // 网页启用水印保护配置
  watermarkEnabled,
  // 水印启用脱敏配置
  watermarkMaskEnabled,
  // 网络请求启用重复保护配置
  interruptEnabled,
  // 左侧菜单栏默认折叠状态配置
  sideMenuDefaultCollapse,
  // 左侧菜单栏默认展开首项菜单配置
  sideMenuDefaultExpandFirst,
  // 左侧菜单栏启用标语配置
  sloganEnabled,
  // 操作按钮启用角色授权配置
  btnAuthorizationEnabled,
  // 操作按钮授权验证失败显示方式配置
  btnAuthorizationDefeat,
  // 启用MQTT实时接收消息配置
  mqttMessageEnabled,
  // 消息通知启用提示配置
  notifyEnabled,
  // 消息通知启用提示音配置
  notifyBeepEnabled,
  // 消息通知提示位置配置
  notifyPosition,
  // 未读消息标记显示方式配置
  notifyUnreadBadge,
  // 右侧消息中心启用消息分类显示配置
  categoryEnabled,
  // 消息分类移除项配置
  categoryRemoveOptions,
  // 右侧消息中心消息已读触发方式配置
  readTrigger,
  // 右侧消息中心消息跳转启用始终打开新页面选项卡显示配置
  newpagetabEnabled,
  // 启用接入系统初始化认证配置
  joinAppInitEnabled,
  // 启用接入系统主题穿透配置
  joinAppPenetrateEnabled,
  // 注册用户启用多角色分配配置
  roleMultipleEnabled,
  // 注册用户默认有效期限配置
  userExpireTime,
  // 登录页轮播图片配置
  carouselImages,
  // 左侧菜单栏标语图片配置
  sloganImages,
  // 更多导航选项配置
  navMoreOptions,
  // 全部导航选项配置
  navRootOptions,
  // 分页选项配置
  paginationOptions,
  // 日期时间选择器快捷选项配置
  pickerShortcutOptions,
  // 条件选择器选项配置
  factorOptions,
  // 数据导出数量限制配置
  exportLimit
};
