import Vue from "vue";
import Router from "vue-router";
import routes from "./routes";
import logic from "./logic";

Vue.use(Router);

console.log("process.env.NODE_PATH", process.env.NODE_PATH);

const router = new Router({
  mode: "history", // 去掉路由地址的#
  base: process.env.NODE_PATH + "/",
  routes
});

// 配置路由跳转前
router.beforeEach(logic.beforeEach);

// 配置路由跳转后
router.afterEach(logic.afterEach);

// 配置路由错误处理
router.onError(logic.onError);

export default router;
