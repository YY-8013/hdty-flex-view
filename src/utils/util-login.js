/**
 * 登录类函数
 */

import $router from "@/router";
import $store from "@/store";
import $storage from "@/utils/storage";
import $utilStr from "@/utils/util-str";
import $utilElem from "@/utils/util-elem";
import $app from "@/config/app";

import { getUserRouter } from "@/api/menu";

import staticRoutes from "@/router/routes";

// 登入
const login = async (response, vnode) => {
  let { authorization } = response.headers;
  $storage.session.set("token", authorization);
  $router.push(await getLoginPath());
  if (vnode.checked) {
    let cookie = {
      username: vnode.loginForm.username,
      password: vnode.md5password
    };
    $storage.cookie.set("hdty-last-login", cookie, 365);
    $storage.session.set("login", cookie);
  }
};

// 登入重置
const reset = async () => {
  // 清除session中的用户信息
  $storage.session.remove("user");
  // 清除session中的路由信息
  $storage.session.remove("routers");
  // 清除session中的权限信息
  $storage.session.remove("authorities");
  // 清除session中的导航信息
  $storage.session.remove("navigations");
  // 清除store中当前登录痕迹
  $store.dispatch("clearCurrentLogin");
  // 清除dom中当前登录痕迹
  $utilElem.clearCurrentLogin();
  // 重置页面
  window.location.href = process.env.NODE_PATH + (await getResetPath());
};

// 登入清除
const clear = () => {
  // 清除session中当前登录痕迹
  $storage.session.clearCurrentLogin();
  // 清除store中当前登录痕迹
  $store.dispatch("clearCurrentLogin");
  // 清除dom中当前登录痕迹
  $utilElem.clearCurrentLogin();
};

// 登出
const logout = () => {
  // 清除session中当前登录痕迹
  $storage.session.clearCurrentLogin();
  // 清除store中当前登录痕迹
  $store.dispatch("clearCurrentLogin");
  // 清除dom中当前登录痕迹
  $utilElem.clearCurrentLogin();
  // 跳转至登录
  $router.push(getLogoutPath());
};

// 清除密码并登出
const clearPwdAndLogout = () => {
  // 清除cookie中的密码
  $storage.cookie.remove("hdty-last-login");
  // 清除session中的密码
  $storage.session.remove("login");
  // 清除session中当前登录痕迹
  $storage.session.clearCurrentLogin();
  // 清除store中当前登录痕迹
  $store.dispatch("clearCurrentLogin");
  // 清除dom中当前登录痕迹
  $utilElem.clearCurrentLogin();
  // 跳转至登录
  $router.push(getLogoutPath());
};

/**
 * 登入版本数据配置
 * @param data 版本数据
 * data参数：
 * (1)直接传入登入版本，如data='1.1'
 * (2)传入登入版本数据集合，如data=[{
 *   key: 'orgId', // 登录用户可识别属性
 *   value: '150100000000', // 登录用户可识别属性的值
 *   mmv: '1.1'
 * }]
 */
const mmv = (data) => {
  if (!$utilStr.isEmpty(data)) {
    $storage.session.set("mmv", data);
  }
};

// 获取登入地址
const getLoginPath = async () => {
  let loginPath = "/";
  let loginRouteName =
    $app.pagetabKeeps && $app.pagetabKeeps[$app.pagetabKeeps.length - 1];
  if (loginRouteName) {
    let loginRoute = $utilStr.getTreeNode(
      staticRoutes,
      loginRouteName,
      "name",
      "children"
    );
    if (!loginRoute) {
      await getUserRouter({
        clientType: appEnv.clientTYPE
      })
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            $storage.session.set("routers", data);
            loginRoute = $utilStr.getTreeNode(
              data,
              loginRouteName,
              "name",
              "children"
            );
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        });
    }
    if (loginRoute) {
      loginPath = loginRoute.path;
    }
  }
  return loginPath;
};

// 获取登入重置地址
const getResetPath = async () => {
  let resetPath = "/";
  let currentPath = window.location.pathname.replace(
    new RegExp(process.env.NODE_PATH),
    ""
  );
  if (currentPath) {
    if (!$utilStr.getTreeNode(staticRoutes, currentPath, "path", "children")) {
      await getUserRouter({
        clientType: appEnv.clientTYPE
      })
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            $storage.session.set("routers", data);
            if (!$utilStr.getTreeNode(data, currentPath, "path", "children")) {
              let resetRouteName =
                $app.pagetabKeeps &&
                $app.pagetabKeeps[$app.pagetabKeeps.length - 1];
              if (resetRouteName) {
                let resetRoute = $utilStr.getTreeNode(
                  staticRoutes,
                  resetRouteName,
                  "name",
                  "children"
                );
                if (!resetRoute) {
                  resetRoute = $utilStr.getTreeNode(
                    data,
                    resetRouteName,
                    "name",
                    "children"
                  );
                }
                if (resetRoute) {
                  resetPath = resetRoute.path;
                }
              }
            } else {
              resetPath = currentPath;
            }
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        });
    } else {
      resetPath = currentPath;
    }
  }
  return resetPath;
};

// 获取登出地址
const getLogoutPath = () => {
  return "/login";
};

// 获取登录用户路由
const getUserRouters = () => {
  let routers = $store.state.system.routers;
  if (!routers) {
    routers = $storage.session.get("routers");
    $store.dispatch("editRouters", routers);
  }
  if (routers) {
    return routers;
  }
  return [];
};

// 获取登录用户权限
const getUserAuthorities = () => {
  let authorities = $store.state.system.authorities;
  if (!authorities) {
    authorities = $storage.session.get("authorities");
    $store.dispatch("editAuthorities", authorities);
  }
  if (authorities) {
    return authorities;
  }
  return {};
};

// 获取登录用户某个模块权限
const getUserModuleAuthority = (
  moduleName,
  enabled = $app.btnAuthorizationEnabled
) => {
  if (enabled) {
    if (typeof moduleName !== "undefined") {
      let authorities = getUserAuthorities();
      let currentAuthority = authorities[moduleName];
      if (currentAuthority && currentAuthority.hasAuthority) {
        return true;
      }
    } else {
      return true;
    }
    return false;
  } else {
    return true;
  }
};

// 获取登录用户某个权限
const getUserAuthority = (
  authorityName,
  moduleName,
  enabled = $app.btnAuthorizationEnabled
) => {
  if (enabled) {
    if (
      typeof authorityName !== "undefined" &&
      typeof moduleName !== "undefined"
    ) {
      if (authorityName) {
        let authorities = getUserAuthorities();
        let moduleAuthorities = authorities[moduleName];
        if (moduleAuthorities) {
          let operationAuthorities = moduleAuthorities.children;
          if (operationAuthorities) {
            let currentAuthority = operationAuthorities[authorityName];
            if (currentAuthority && currentAuthority.hasAuthority) {
              return true;
            }
          }
        }
      } else {
        return true;
      }
    } else if (typeof authorityName !== "undefined") {
      let authorities = getUserAuthorities();
      let currentAuthority = authorities[authorityName];
      if (currentAuthority && currentAuthority.hasAuthority) {
        return true;
      }
    } else {
      return true;
    }
    return false;
  } else {
    return true;
  }
};

// 获取登录用户导航
const getUserNavigations = () => {
  let navigations = $store.state.system.navigations;
  if (!navigations) {
    navigations = $storage.session.get("navigations");
    $store.dispatch("editNavigations", navigations);
  }
  if (navigations) {
    return navigations;
  }
  return [];
};

// 获取登录用户信息
const getUserInfo = () => {
  let user = $store.state.system.user;
  if (!user) {
    user = $storage.session.get("user");
    $store.dispatch("editUser", user);
  }
  if (user) {
    return user;
  }
  return {};
};

// 获取登录用户身份令牌
const getUserToken = () => {
  let token = $store.state.system.token;
  if (!token) {
    token = $storage.session.get("token");
    $store.dispatch("editToken", token);
  }
  if (token) {
    return token;
  }
  return "";
};

// 获取登录用户头像
const getUserAvatar = () => {
  let avatar = $store.state.system.avatar;
  if (!avatar) {
    avatar = getUserInfo().avatarUrl;
    $store.dispatch("editAvatar", avatar);
  }
  if (avatar) {
    return avatar;
  }
  return "";
};

// 获取登录用户Id
const getUserId = () => {
  return getUserInfo().id;
};

// 获取登录用户名
const getUsername = () => {
  return getUserInfo().username;
};

// 获取登录用户真实姓名
const getUserXm = () => {
  return getUserInfo().xm;
};

// 获取登录用户身份证号
const getUserGmsfhm = () => {
  return getUserInfo().gmsfhm;
};

// 获取登录用户所属机构编码
const getUserOrgId = () => {
  return getUserInfo().orgId;
};

// 获取登录用户所属机构名称
const getUserOrgName = () => {
  return getUserInfo().orgName;
};

// 获取登录用户所属机构级别
const getUserOrgLevel = () => {
  return getUserInfo().orgLevel;
};

// 获取登录用户所在地区编码
const getUserRegionId = () => {
  return getUserInfo().regionId;
};

// 获取登录用户所在地区名称
const getUserRegionName = () => {
  return getUserInfo().regionName;
};

// 获取登录用户所在地区级别
const getUserRegionLevel = () => {
  if (!$utilStr.isEmpty(getUserInfo().regionLevel)) {
    return getUserInfo().regionLevel;
  } else if (!$utilStr.isEmpty(getUserInfo().regionId)) {
    if (!Array.isArray(getUserInfo().regionId)) {
      let RegionIdString = getUserInfo().regionId.toString();
      if (RegionIdString.substr(2, 4) === "0000") {
        return 1;
      } else if (RegionIdString.substr(4, 2) === "00") {
        return 2;
      } else {
        return 3;
      }
    } else {
      return getUserInfo().regionId.map((regionId) => {
        let RegionIdString = regionId.toString();
        if (RegionIdString.substr(2, 4) === "0000") {
          return 1;
        } else if (RegionIdString.substr(4, 2) === "00") {
          return 2;
        } else {
          return 3;
        }
      });
    }
  } else {
    return getUserInfo().regionLevel;
  }
};

// 获取系统AppId
const getAppId = () => {
  return getUserInfo().appId;
};

// 获取所有接入系统AppId
const getJoinAppIds = () => {
  return getUserInfo().allAppIds.filter((e) => e !== getAppId());
};

export default {
  // 登入
  login,
  // 登入重置
  reset,
  // 登入清除
  clear,
  // 登出
  logout,
  // 清除密码并登出
  clearPwdAndLogout,
  // 登入版本数据配置
  mmv,
  // 获取登入地址
  getLoginPath,
  // 获取登入重置地址
  getResetPath,
  // 获取登出地址
  getLogoutPath,
  // 获取登录用户路由
  getUserRouters,
  // 获取登录用户权限
  getUserAuthorities,
  // 获取登录用户某个模块权限
  getUserModuleAuthority,
  // 获取登录用户某个权限
  getUserAuthority,
  // 获取登录用户导航
  getUserNavigations,
  // 获取登录用户信息
  getUserInfo,
  // 获取登录用户身份令牌
  getUserToken,
  // 获取登录用户头像
  getUserAvatar,
  // 获取登录用户Id
  getUserId,
  // 获取登录用户名
  getUsername,
  // 获取登录用户真实姓名
  getUserXm,
  // 获取登录用户身份证号
  getUserGmsfhm,
  // 获取登录用户所属机构编码
  getUserOrgId,
  // 获取登录用户所属机构名称
  getUserOrgName,
  // 获取登录用户所属机构级别
  getUserOrgLevel,
  // 获取登录用户所在地区编码
  getUserRegionId,
  // 获取登录用户所在地区名称
  getUserRegionName,
  // 获取登录用户所在地区级别
  getUserRegionLevel,
  // 获取系统AppId
  getAppId,
  // 获取所有接入系统AppId
  getJoinAppIds
};
