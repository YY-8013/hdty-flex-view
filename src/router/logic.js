/**
 * 路由钩子的实现
 */

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Message } from "element-ui";

import $router from "@/router";
import $storage from "@/utils/storage";
import $utilLogin from "@/utils/util-login";
import $utilStr from "@/utils/util-str";

import request from "@/config/axios-init";
import { getLogin } from "@/api/user";
import { getUserRouter, getUserAuthority, getLeftTree } from "@/api/menu";

import Router from "vue-router";
import staticRoutes from "./routes";

import Layout from "@/relies/layout/Layout";
const _import = require("./_import_" + process.env.NODE_ENV);

let routers = null;
let user = null;
let authorities = null;
let navigations = null;

let dynamicRoutes = null;
let landingParams = null;

// 配置请求前的拦截器
const beforeEach = async (to, from, next) => {
  NProgress.start();
  // 如果跳转到登录执行清除操作
  if (to.name === "Login") {
    await checkVersion(to.fullPath);
    // 登入清除
    $utilLogin.clear();

    // 获取配置，是否可由系统登录
    let loginDisabled = $storage.local.get("hdty-fkyw-loginDisabled");

    if (appEnv.loginDisabled && appEnv.eedsJgMh) {
      // 强制跳转到外部登录页（禁止回退）
      window.location.replace(appEnv.eedsJgMh);
      return; // 终止后续逻辑
    } else {
      // 正确跳转
      next();
    }
  } else if (to.name === "LoginXt") {
    await checkVersion(to.fullPath);
    // 登入清除
    $utilLogin.clear();
    // 正确跳转
    next();
  } else {
    let token = $storage.session.get("token");
    // 如果token不存在跳转到登录
    if (!token && to.name !== "Login") {
      if (
        $utilStr.parseBoolean(to.query.landing) &&
        Object.keys(to.params).length === 0
      ) {
        next({ path: "/landing" + to.fullPath, replace: true });
      } else if (to.meta.loosened) {
        // 正确跳转
        next();
      } else {
        next({ path: "/login" });
      }
    } else {
      routers = $storage.session.get("routers");
      if (!routers) {
        await loadRouters()
          .then((response) => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              $storage.session.set("routers", data);
              routers = data;
              dynamicRoutes = filterConvertRouter(data);
              $router.matcher = createRouter(staticRoutes).matcher;
              $router.addRoutes(dynamicRoutes);
              next({ ...to, replace: true });
            }
          })
          .catch((error) => {
            // 响应错误回调
            console.error(error);
          });
      } else {
        if (!dynamicRoutes) {
          dynamicRoutes = filterConvertRouter(routers);
          $router.addRoutes(dynamicRoutes);
          next({ ...to, replace: true });
        } else {
          if (
            $utilStr.parseBoolean(to.query.landing) &&
            Object.keys(to.params).length === 0
          ) {
            landingParams = { query: to.query };
          }
          // 路由是否匹配
          if (to.matched.length === 0) {
            // 如果经系统导航跳转
            if (to.name) {
              // 跳转到404
              next({ path: "/404", ...landingParams });
            } else {
              // 如果路径携带landing为true参数，则去进行授权验证
              if ($utilStr.parseBoolean(to.query.landing)) {
                if ($utilStr.parseBoolean(to.query.landed)) {
                  // 跳转到406
                  next({ path: "/406", ...landingParams });
                } else {
                  next({ path: "/landing" + to.fullPath, replace: true });
                }
              } else {
                // 如果上级匹配到不是Redirect或Landing中间页，则转上级路由
                if (from.name !== "Redirect" && to.name !== "Landing") {
                  // 如果上级也未匹配到路由则转工作台，如果上级能匹配到则转上级路由
                  from.name ? next({ name: from.name }) : next("/");
                } else {
                  // 跳转到404
                  next({ path: "/404", ...landingParams });
                }
              }
            }
          } else {
            // 如果是Http状态页则直接跳转
            if (validateHttpStatus(to.name)) {
              // 正确跳转
              next();
            } else {
              let landingToken = $storage.session.get("landing-token");
              // 如果路径携带landing为true参数且通过授权，则直接跳转
              if (
                $utilStr.parseBoolean(to.query.landing) &&
                to.query.token !== landingToken
              ) {
                if (Object.keys(to.params).length === 0) {
                  next({ path: "/landing" + to.fullPath, replace: true });
                } else {
                  // 正确跳转
                  next();
                }
              } else {
                remindVersion();

                await checkVersion(to.fullPath);
                user = $storage.session.get("user");
                if (!user) {
                  await loadUser()
                    .then((response) => {
                      // 响应成功回调
                      let { success, data } = response.data;
                      if (success) {
                        $storage.session.set("user", data);
                        user = data;
                      }
                    })
                    .catch((error) => {
                      // 响应错误回调
                      console.error(error);
                    });
                }
                redirectVersion(to.fullPath, from.path);
                authorities = $storage.session.get("authorities");
                if (!authorities) {
                  await loadAuthorities()
                    .then((response) => {
                      // 响应成功回调
                      let { success, data } = response.data;
                      if (success) {
                        $storage.session.set("authorities", data);
                        authorities = data;
                      }
                    })
                    .catch((error) => {
                      // 响应错误回调
                      console.error(error);
                    });
                }
                navigations = $storage.session.get("navigations");
                if (!navigations) {
                  await loadNavigations()
                    .then((response) => {
                      // 响应成功回调
                      let { success, data } = response.data;
                      if (success) {
                        $storage.session.set("navigations", data);
                        navigations = data;
                      }
                    })
                    .catch((error) => {
                      // 响应错误回调
                      console.error(error);
                    });
                }
                // 如果权限验证不通过且loosened不为true，则跳转到406
                if (!validateAuthority(to.name) && !to.meta.loosened) {
                  // 跳转到406
                  next({ path: "/406", ...landingParams });
                } else {
                  // 如果路由携带参数则传递参数
                  if (to.meta.params) {
                    let params = to.meta.params;
                    delete to.meta.params;
                    // 正确跳转

                    next({
                      name: to.name,
                      params: { ...$utilStr.toJSONObj(params), ...to.params },
                      query: to.query
                    });
                  } else {
                    // 正确跳转  如果是携带token到首页时，登录成功后清除浏览器中冗余参数
                    if (to.path === "/" && to.fullPath !== to.path) {
                      next("/", { query: to.query });
                    } else {
                      next();
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

// 配置响应拦截器
const afterEach = (to, from) => {
  NProgress.done();
};

// 配置错误处理器
const onError = (error) => {
  if (error.message.includes("Cannot find")) {
    $router.replace({ path: "/redirect/404", ...landingParams });
  } else {
    $router.replace({ path: "/redirect/400", ...landingParams });
  }
};

// 加载用户信息
const loadUser = () => {
  return getLogin();
};

// 加载路由信息
const loadRouters = () => {
  // 参数
  let dataParams = {
    clientType: appEnv.clientTYPE
  };
  return getUserRouter(dataParams);
};

// 加载权限信息
const loadAuthorities = () => {
  // 参数
  let dataParams = {
    clientType: appEnv.clientTYPE
  };
  return getUserAuthority(dataParams);
};

// 加载导航信息
const loadNavigations = () => {
  // 参数
  let dataParams = {
    clientType: appEnv.clientTYPE,
    alltopbar: true
  };
  return getLeftTree(dataParams);
};

// 创建router
const createRouter = (routes) => {
  return new Router({
    mode: "history", // 去掉路由地址的#
    routes
  });
};

// 遍历路由字符串转换组件对象
const filterConvertRouter = (routes) => {
  return routes.filter((route) => {
    if (route.component) {
      if (route.component === "Layout") {
        route.component = Layout;
      } else {
        route.component = _import(route.component);
      }
    }
    if (route.children && route.children.length) {
      route.children = filterConvertRouter(route.children);
    }
    return true;
  });
};

// 验证是否HTTP状态页
const validateHttpStatus = (name) => {
  if (name) {
    if (
      name === "BadRequest" ||
      name === "NotFound" ||
      name === "NotAcceptable"
    ) {
      return true;
    }
  }
  return false;
};

// 验证是否有访问权限
const validateAuthority = (name) => {
  if (name) {
    if (authorities[name] && authorities[name].hasAuthority) {
      return true;
    }
  }
  return false;
};

// 检测是否有版本更新
const checkVersion = async (path) => {
  if (
    process.env.NODE_ENV === "production" &&
    !$storage.local.get("hdty-admin-updated")
  ) {
    await request({
      baseURL: window.location.origin,
      url: process.env.NODE_PATH + "/version.json",
      method: "get"
    })
      .then((response) => {
        // 响应成功回调
        let { status, data } = response;
        if (status === 200) {
          let o = $storage.local.get("hdty-admin-version");
          let n = data.version;
          if (!o) {
            $storage.local.set("hdty-admin-version", n);
          }
          if (o && n && o !== n) {
            $storage.local.set("hdty-admin-version", n);
            $storage.local.set("hdty-admin-updated", true);
            window.location.href = process.env.NODE_PATH + path;
          }
        }
      })
      .catch((error) => {
        // 响应错误回调
        console.error(error);
      });
  }
};

// 提醒用户版本更新
const remindVersion = () => {
  if (
    process.env.NODE_ENV === "production" &&
    $storage.local.get("hdty-admin-updated")
  ) {
    $storage.local.remove("hdty-admin-updated");
    Message({
      showClose: true,
      customClass: "is-wrap",
      message: "系统版本有更新，已为您自动升级",
      type: "info",
      offset: 76,
      duration: 7000
    });
  }
};

// 重定向要跳转的版本路径
const redirectVersion = (path, fromPath) => {
  if (process.env.NODE_ENV === "production") {
    let mmv = $storage.session.get("mmv");
    if (mmv) {
      $storage.session.remove("mmv");
      if (typeof mmv === "object") {
        let m = mmv.find((e) => e.value === user[e.key]);
        if (m && m.mmv) {
          mmv = m.mmv;
        }
      }
      if (typeof mmv === "string") {
        let pathname = window.location.pathname
          .split("")
          .reverse()
          .join("")
          .replace(new RegExp(fromPath.split("").reverse().join("")), "")
          .split("")
          .reverse()
          .join("");
        let lmv = pathname.substr(pathname.lastIndexOf("/") + 1);
        if (lmv !== mmv) {
          let pathArr = pathname.split("/");
          pathArr.splice(
            pathArr.length - mmv.split("/").length,
            mmv.split("/").length
          );
          window.location.href = pathArr.join("/") + "/" + mmv + path;
        }
      }
    }
  }
};

export default {
  beforeEach,
  afterEach,
  onError
};
