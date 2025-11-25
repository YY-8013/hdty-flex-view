/**
 * 全局引入配置
 */
console.log("全局引入配置");

// 动态获取当前用户类型，动态配置appEnv
import { appEnvDev } from "./config/appEnvDev";
import { appEnvProd } from "./config/appEnvProd";

/**
 * 初始化环境函数
 */
async function init() {
  return new Promise((resolve) => {
    let systemEnvType = "prod";
    if (window.appEnv && window.appEnv.envType) {
      systemEnvType = window.appEnv.envType;
    }
    console.log("当前环境类型", systemEnvType);

    // 根据环境类型配置全局环境
    if (systemEnvType === "prod") {
      window.appEnv = { ...appEnvProd, ...window.appEnv };
    } else {
      window.appEnv = { ...appEnvDev, ...window.appEnv };
    }

    resolve(); // 确保初始化完成后调用resolve
  });
}
import Vue from "vue";

import VueIziToast from "vue-izitoast";
import preview from "vue-photo-preview";
import jsoneditor from "jsoneditor";
import countTo from "vue-count-to";
import erd from "element-resize-detector";
import animated from "animate.css";

import * as echarts from "echarts";

// 方式一：将 echarts 挂载到 Vue 原型上
Vue.prototype.$echarts = echarts;

import "element-ui/lib/theme-chalk/index.css";
import "izitoast/dist/css/iziToast.min.css";
import "vue-photo-preview/dist/skin.css";
import "jsoneditor/dist/jsoneditor.min.css";
import "./assets/hdtyui/css/hdtyui.css";
import "./assets/hdtyui/fonts/font.css";
import "./assets/hdtyui/icons/iconfont.css";
import "./assets/hdtyui/css/style.css";

import "./views/global/css/new-ui.scss";
import "./views/global/css/card-ui.scss";
import "./views/css/style.scss";
import "./views/css/newDialog.scss";
import "./views/css/dpCommon.scss";

import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";
import { preventReClick } from "./views/global/js/preventReClick"; //防多次点击，重复提交

import BizTabs from "./views/components/biz-tabs";
import BizTabPane from "./views/components/biz-tab-pane";

Vue.use(BizTabs);
Vue.use(BizTabPane);

Vue.use(Viewer);

Vue.use(VueIziToast);
Vue.use(preview);
Vue.use(animated);

Vue.component("CountTo", countTo);
Vue.directive("preventReClick", preventReClick);

Vue.prototype.$jsoneditor = jsoneditor;
Vue.prototype.$erd = erd();

/**
 * 按需引入
 */

// 引入Promise对应的polyfill
require("promise.prototype.finally").shim();

// 注册全局事件对象
window.appMessage = new Vue();

import App from "./App";

// 阻止启动生产消息
Vue.config.productionTip = false;

/**
 * 异步加载并挂载 Storage 和 ElementUI
 */
async function loadStorage() {
  const { default: storage } = await import("./utils/storage");
  Vue.prototype.$storage = storage;

  const { default: app } = await import("./config/app");
  Vue.prototype.$app = app;

  // 全局定义是否验收
  Vue.prototype.$isYs =
    window.appEnv &&
    window.appEnv.acceptanceDemo &&
    window.appEnv.acceptanceDemo.enabled;

  const ElementUI = await import("element-ui");

  Vue.use(ElementUI, {
    size: storage.local.get("hdty-admin-size") || app.sizeDefault
  });
}

/**
 * 异步加载工具函数并挂载到 Vue.prototype
 */
async function loadUtils() {
  // 异步加载每个工具函数
  const utils = await Promise.all([
    import("./components/notify"),
    import("./components/contextmenu"),
    import("./components/upload"),
    import("./config/app"),
    import("./config/global"),
    import("./utils/crypto"),
    import("./utils/util-str"),
    import("./utils/util-date"),
    import("./utils/util-file"),
    import("./utils/util-elem"),
    import("./utils/util-login"),
    import("./utils/util-validate"),
    import("./utils/util-public"),
    import("./config/axios-init"),
    import("./assets/hdtyui/plugins/socket"),
    import("./assets/hdtyui/plugins/mqtt"),
    import("./assets/hdtyui/plugins/watermark"),
    import("./utils/util-coord"),
    import("./utils/util-link"),
    import("./components/marquee"),
    import("./components/flash"),
    import("./components/inform"),
    import("./views/global/utils/util-all"),
    import("./views/global/utils/util-zdry"),
    import("./utils/util-common"),
    import("./views/global/utils/util-yw")
  ]);

  // 将加载的工具函数挂载到 Vue.prototype
  Vue.prototype.$notify = utils[0].default;
  Vue.prototype.$contextmenu = utils[1].default;
  Vue.prototype.$upload = utils[2].default;
  Vue.prototype.$app = utils[3].default;
  Vue.prototype.$global = utils[4].default;
  Vue.prototype.$crypto = utils[5].default;
  Vue.prototype.$utilStr = utils[6].default;
  Vue.prototype.$utilDate = utils[7].default;
  Vue.prototype.$utilFile = utils[8].default;
  Vue.prototype.$utilElem = utils[9].default;
  Vue.prototype.$utilLogin = utils[10].default;
  Vue.prototype.$utilValidate = utils[11].default;
  Vue.prototype.$utilPublic = utils[12].default;
  Vue.prototype.$http = utils[13].default;
  Vue.prototype.$socket = utils[14].default;
  Vue.prototype.$mqtt = utils[15].default;
  Vue.prototype.$watermark = utils[16].default;
  Vue.prototype.$utilCoord = utils[17].default;
  Vue.prototype.$utilLink = utils[18].default;
  Vue.prototype.$marquee = utils[19].default;
  Vue.prototype.$flash = utils[20].default;
  Vue.prototype.$inform = utils[21].default;
  Vue.prototype.$utilAll = utils[22].default;
  Vue.prototype.$utilZdry = utils[23].default;
  Vue.prototype.$utilCommon = utils[24].default;
  Vue.prototype.$utilYw = utils[25].default;
}

/**
 * 加载业务相关插件
 */
async function loadVueUse() {
  const { default: bizPlug } = await import("./views/plugs/biz-plug");
  const { default: hdComponent } = await import("./components/hd-component");
  Vue.use(bizPlug);
  Vue.use(hdComponent);
}

/**
 * 异步初始化应用
 */
async function initializeApp() {
  // 执行初始化操作
  await init();
  await loadStorage();
  await loadVueUse();
  await loadUtils();

  // 路由和状态管理
  const { default: router } = await import("./router");
  const { default: store } = await import("./store");

  // 创建 Vue 实例
  new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App)
  });
}

// 启动应用
initializeApp().catch((err) => {
  console.error("应用初始化失败：", err);
});
