/**
 * 公共类函数
 */

import $storage from "./storage";
import $utilStr from "./util-str";
import { subSystemUrl } from "@/api/menu";

// 获取登录用户信息
const getUserInfo = () => {
  let user = $storage.session.get("user");
  if (!user) {
    return {};
  }
  return user;
};

// 获取登录用户权限-就框架方法，由于使用位置较多，返回值差距很大，暂不做修改，只是搬过来，保证系统正常使用
const getUserRights = (name) => {
  let authorities = $storage.session.get("authorities");
  if (name) {
    if (authorities[name]) {
      return authorities[name];
    } else {
      return {};
    }
  }
  return authorities;
};

// 获取登录用户权限
const getUserAuthority = (authorityName, moduleName) => {
  let authorities = $storage.session.get("authorities");
  let authority = {};
  if (moduleName) {
    if (authorities[moduleName]) {
      authority = authorities[moduleName];
      if (authorityName) {
        let operation = authority.children;
        authority = false;
        if (operation) {
          if (operation[authorityName]) {
            authority = operation[authorityName].hasAuthority;
          }
        }
      }
    }
  }
  return authority;
};

// 获取登录用户身份令牌
const getUserToken = () => {
  let token = $storage.session.get("token");
  if (!token) {
    return "";
  }
  return token;
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

// 是否是当前用户机构
const isCurrentOrg = (orgId) => {
  return orgId === getUserOrgId();
};

// 获取登录用户所属机构名称
const getUserOrgName = () => {
  return getUserInfo().orgName;
};

// 获取登录用户所在地区编码
const getUserRegionId = () => {
  return getUserInfo().regionId;
};

// 获取系统AppId
const getAppId = () => {
  return getUserInfo().appId;
};

// 获取所有接入系统AppId
const getJoinAppIds = () => {
  return getUserInfo().allAppIds.filter((e) => e !== getUserInfo().appId);
};

/**
 * 获取链接系统跳转地址
 * @param path 跳转路径
 * @param appId 跳转项目标识
 * @param subpage 是否属于上级页面
 * @param bodypage 是否只显示主体内容
 * @param params 跳转请求参数
 * @param image 跳转请求图片
 * @param transform 是否转换跳转路径
 * @param callback 回调函数
 */
const getLinkPageURL = ({
  path = "",
  appId = "",
  subpage = null,
  bodypage = null,
  params = null,
  image = null,
  transform = true,
  callback = null
}) => {
  if (path) {
    if (transform) {
      subpage = !$utilStr.isEmpty(subpage) ? subpage : true;
      bodypage = !$utilStr.isEmpty(bodypage) ? bodypage : true;
      getTransformURL(
        {
          path: path,
          appId: appId,
          subpage: subpage,
          bodypage: bodypage,
          params: params,
          image: image
        },
        (fullPath) => {
          callback({
            fullPath: fullPath,
            path: $utilStr.removeParams(fullPath),
            query: $utilStr.parameterToObj(fullPath)
          });
        }
      );
    } else {
      if (image) {
        params = {
          ...params,
          image: image
        };
      }
      let paramsProp = $utilStr.parameterToObj(path);
      params = {
        ...params,
        ...paramsProp
      };
      if (!$utilStr.isEmpty(subpage) || !$utilStr.isEmpty(bodypage)) {
        params = {
          redirecting: true,
          subpage: subpage,
          bodypage: bodypage,
          ...params
        };
      }
      callback({
        fullPath: $utilStr.appendParameterToURL(path, params),
        path: path,
        query: params
      });
    }
  }
};

/**
 * 获取转换后的跳转地址
 * @param path 跳转路径
 * @param appId 跳转项目标识
 * @param subpage 是否属于上级页面
 * @param bodypage 是否只显示主体内容
 * @param params 跳转请求参数
 * @param image 跳转请求图片
 * @param callback 回调函数
 */
const getTransformURL = (
  {
    path = "",
    appId = "",
    subpage = true,
    bodypage = true,
    params = null,
    image = null
  },
  callback
) => {
  if (path) {
    // 参数
    let dataParams = {
      // 跳转路径
      path: path,
      // 跳转项目标识
      appId: appId,
      // 子页形式
      subpage: subpage,
      // 主体页形式
      bodypage: bodypage,
      // 跳转请求参数
      params: params,
      // 跳转请求图片
      image: image,
      // 客户端类型
      clientType: appEnv.clientTYPE
    };
    subSystemUrl(dataParams)
      .then((response) => {
        // 响应成功回调
        let { success, data } = response.data;
        if (success) {
          let subSystemUrlStr = data.subSystemUrl;
          let subSystemParams = data.subSystemParams;
          let subSystemProp = $utilStr.parameterToObj(subSystemUrlStr);
          let config = {};
          if ($utilStr.isURL(subSystemUrlStr)) {
            config.landing = true;
          } else {
            subSystemUrlStr += process.env.NODE_PATH;
            config.redirecting = true;
          }
          config.subpage = subpage;
          config.bodypage = bodypage;
          let params = {
            ...config,
            ...subSystemParams,
            ...subSystemProp
          };
          callback(
            $utilStr.appendParameterToURL(
              $utilStr.removeParams(subSystemUrlStr),
              params
            )
          );
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    callback();
  }
};

// 获取登录用户权限
const isAuthority = (authorityName) => {
  let authorities = $storage.session.get("authorities");
  let authority = authorities[authorityName];
  return authority;
};

// 获取登录用户所属机构级别
const getUserOrgLevel = () => {
  return getUserInfo().orgLevel;
};

const extractOssFileIds = (html) => {
  if (!html || typeof html !== "string") return [];

  try {
    // 方法1：使用DOMParser（推荐）
    const doc = new DOMParser().parseFromString(html, "text/html");
    const images = doc.querySelectorAll('img[src*="ossfileid="]');
    return Array.from(images)
      .map((img) => {
        const url = img.getAttribute("src");
        const match = url.match(/ossfileid=([^&]+)/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    // 方法2：纯正则方案（备用）
    // return [...html.matchAll(/ossfileid=([^&"'>]+)/g)].map(m  => m[1]);
  } catch (e) {
    console.error(" 解析HTML失败:", e);
    return [];
  }
};

const replaceImagePrefix = (content, targetPrefix, replacement) => {
  if (!content || typeof content !== "string") return content;

  // 精确匹配图片src属性中的目标前缀
  const regex = new RegExp(`(src=")${escapeRegExp(targetPrefix)}`, "g");

  return content.replace(regex, `$1${replacement}`);
};

const escapeRegExp = (string) => {
  return string.replace(/[.*+?^${}() |[\]\\]/g, "\\$&");
};

export default {
  // 获取登录用户信息
  getUserInfo,
  // 获取登录用户权限
  getUserRights,
  // 获取登录用户权限
  getUserAuthority,
  // 获取登录用户身份令牌
  getUserToken,
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
  // 获取登录用户所在地区编码
  getUserRegionId,
  // 获取系统AppId
  getAppId,
  // 获取所有接入系统AppId
  getJoinAppIds,
  // 获取转换后的请求地址
  getTransformURL,
  // 获取链接系统跳转地址
  getLinkPageURL,
  //判断是否有权限
  isAuthority,
  // 获取登录用户所属机构级别
  getUserOrgLevel,

  // 解析富文本中的图片路径
  extractOssFileIds,

  // 处理替换baseURL
  replaceImagePrefix,

  isCurrentOrg
};
