/**
 * 链接类函数
 */


import $router from '@/router';
import $utilStr from '@/utils/util-str';
import { subSystemUrl } from '@/api/menu';

/**
 * 获取链接页面跳转地址
 * @param path 跳转路径
 * @param appId 目标程序身份标识
 * @param appClient 目标程序客户端标识
 * @param params 跳转请求参数
 * @param images 跳转请求图像参数
 * @param superParams 最高权重跳转请求参数
 * @param superImages 最高权重跳转请求图像参数
 * @param subpage 是否仅作为子页面
 * @param bodypage 是否只显示主内容
 * @param landing 是否进行登录认证
 * @param forward 是否转接跳转参数
 * @param transform 是否转换跳转路径
 * @param callback 回调函数（回调参数为对象）
 * @param callbackFullPath 回调函数（回调参数为完整路径）
 */
const getLinkPageURL = ({
  path = '',
  appId = '',
  appClient = appEnv.clientTYPE,
  params = null,
  images = null,
  superParams = null,
  superImages = null,
  subpage = null,
  bodypage = null,
  landing = null,
  forward = true,
  transform = true,
  callback = null
}, callbackFullPath = null) => {
  let currentOriginParams = $utilStr.parameterToObj(path);
  let currentTransform = !$utilStr.isEmpty(superParams) && !$utilStr.isEmpty(superParams.transform)
    ? $utilStr.parseBoolean(superParams.transform)
    : !$utilStr.isEmpty(currentOriginParams) && !$utilStr.isEmpty(currentOriginParams.transform)
      ? $utilStr.parseBoolean(currentOriginParams.transform)
      : !$utilStr.isEmpty(transform)
        ? $utilStr.parseBoolean(transform)
        : !$utilStr.isEmpty(params) && !$utilStr.isEmpty(params.transform)
          ? $utilStr.parseBoolean(params.transform)
          : false;
  if(currentTransform) {
    transformLinkPath({
      path: path,
      appId: appId,
      appClient: appClient,
      params: params,
      images: images,
      superParams: superParams,
      superImages: superImages,
      subpage: subpage,
      bodypage: bodypage,
      landing: landing,
      forward: forward,
      callback: (linkRoute) => {
        if(typeof(callback) === 'function') {
          callback(linkRoute);
        }
      }
    }, fullPath => {
      if(typeof(callbackFullPath) === 'function') {
        callbackFullPath(fullPath);
      }
    })
  } else {
    let currentInitImages = processLinkParamsKeywords(images, 1);
    let currentParentParams = {
      ...$router.app.$route.params,
      ...$router.app.$route.query
    };
    let currentSuperImages = processLinkParamsKeywords(superImages, 1);
    let currentForward = !$utilStr.isEmpty(superParams) && !$utilStr.isEmpty(superParams.forward)
      ? $utilStr.parseBoolean(superParams.forward)
      : !$utilStr.isEmpty(currentOriginParams) && !$utilStr.isEmpty(currentOriginParams.forward)
        ? $utilStr.parseBoolean(currentOriginParams.forward)
        : !$utilStr.isEmpty(forward)
          ? $utilStr.parseBoolean(forward)
          : !$utilStr.isEmpty(params) && !$utilStr.isEmpty(params.forward)
            ? $utilStr.parseBoolean(params.forward)
            : false;
    let linkRoute = processLinkParams(path, params, currentInitImages, landing, appId, appClient, subpage, bodypage, currentParentParams, superParams, currentSuperImages, currentForward, false);
    if(typeof(callback) === 'function') {
      callback(linkRoute);
    }
    if(typeof(callbackFullPath) === 'function') {
      callbackFullPath(linkRoute.fullPath);
    }
  }
};

/**
 * 转换链接路径
 * @param path 跳转路径
 * @param appId 目标程序身份标识
 * @param appClient 目标程序客户端标识
 * @param params 跳转请求参数
 * @param images 跳转请求图像参数
 * @param superParams 最高权重跳转请求参数
 * @param superImages 最高权重跳转请求图像参数
 * @param subpage 是否仅作为子页面
 * @param bodypage 是否只显示主内容
 * @param landing 是否进行登录认证
 * @param forward 是否转接跳转参数
 * @param callback 回调函数（回调参数为对象）
 * @param callbackFullPath 回调函数（回调参数为完整路径）
 */
const transformLinkPath = ({
  path = '',
  appId = '',
  appClient = appEnv.clientTYPE,
  params = null,
  images = null,
  superParams = null,
  superImages = null,
  subpage = null,
  bodypage = null,
  landing = null,
  forward = true,
  callback = null
}, callbackFullPath = null) => {
  let currentInitImages = processLinkParamsKeywords(images, 1);
  let currentParentParams = {
    ...$router.app.$route.params,
    ...$router.app.$route.query
  };
  let currentOriginParams = $utilStr.parameterToObj(path);
  let currentSuperImages = processLinkParamsKeywords(superImages, 1);
  let currentForward = !$utilStr.isEmpty(superParams) && !$utilStr.isEmpty(superParams.forward)
    ? $utilStr.parseBoolean(superParams.forward)
    : !$utilStr.isEmpty(currentOriginParams) && !$utilStr.isEmpty(currentOriginParams.forward)
      ? $utilStr.parseBoolean(currentOriginParams.forward)
      : !$utilStr.isEmpty(forward)
        ? $utilStr.parseBoolean(forward)
        : !$utilStr.isEmpty(params) && !$utilStr.isEmpty(params.forward)
          ? $utilStr.parseBoolean(params.forward)
          : false;
  // 参数
  let dataParams = {
    path: path || $router.app.$route.path,
    appId: appId,
    appClient: appClient,
    images: currentInitImages,
    superImages: currentSuperImages,
    landing: landing,
    clientType: appEnv.clientTYPE,
  };
  subSystemUrl(dataParams).then(response => {
    // 响应成功回调
    let { success, data } = response.data;
    if (success) {
      let currentTransformPath = data.subSystemUrl;
      let currentTransformImages = {
        ...currentInitImages,
        ...data.subSystemImages
      };
      let currentTransformSuperImages = {
        ...currentSuperImages,
        ...data.subSystemSuperImages
      };
      let linkRoute = processLinkParams(currentTransformPath, params, currentTransformImages, landing, appId, appClient, subpage, bodypage, currentParentParams, superParams, currentTransformSuperImages, currentForward, true);
      if(typeof(callback) === 'function') {
        callback(linkRoute);
      }
      if(typeof(callbackFullPath) === 'function') {
        callbackFullPath(linkRoute.fullPath);
      }
    }
  }).catch(error => {
    console.error(error);
  });
};

// 处理链接参数
const processLinkParams = (path, params, images, landing, appId, appClient, subpage, bodypage, parentParams, superParams, superImages, forward, transform) => {
  // 原始链接路径处理
  let originLinkPath = $utilStr.removeParameter(path);
  let originLinkFullPath = originLinkPath;
  let originLinkPathIsURL = $utilStr.isURL(originLinkPath);
  if(!originLinkPathIsURL) {
    originLinkFullPath = process.env.NODE_PATH + originLinkPath;
  }
  // 初始链接参数处理
  let initLinkParams = {
    ...params,
    ...images
  };
  let initLinkParamsIsEmpty = $utilStr.isEmpty(initLinkParams);
  let initLanding = !initLinkParamsIsEmpty && !$utilStr.isEmpty(initLinkParams.landing)
    ? initLinkParams.landing
    : null;
  let initAppId = !initLinkParamsIsEmpty && !$utilStr.isEmpty(initLinkParams.appId)
    ? initLinkParams.appId
    : null;
  let initClient = !initLinkParamsIsEmpty && !$utilStr.isEmpty(initLinkParams.appClient)
    ? initLinkParams.appClient
    : null;
  let initSubpage = !initLinkParamsIsEmpty && !$utilStr.isEmpty(initLinkParams.subpage)
    ? initLinkParams.subpage
    : null;
  let initBodypage = !initLinkParamsIsEmpty && !$utilStr.isEmpty(initLinkParams.bodypage)
    ? initLinkParams.bodypage
    : null;
  initLinkParams = processLinkParamsKeywords(initLinkParams, 1);
  // 父级路由参数处理
  let parentRouteParams = {
    ...forward ? parentParams : null,
  };
  parentRouteParams = processLinkParamsKeywords(parentRouteParams, 1);
  // 默认链接参数处理
  let defaultLinkParams = {
    landing: !$utilStr.isEmpty(landing)
      ? $utilStr.parseBoolean(landing)
      : !$utilStr.isEmpty(initLanding)
        ? $utilStr.parseBoolean(initLanding)
        : null,
    redirecting: null,
    appId: !$utilStr.isEmpty(appId)
      ? appId
      : !$utilStr.isEmpty(initAppId)
        ? initAppId
        : null,
    appClient: !$utilStr.isEmpty(appId) && !$utilStr.isEmpty(appClient)
      ? appClient
      : !$utilStr.isEmpty(initClient)
        ? initClient
        : null,
    subpage: !$utilStr.isEmpty(subpage)
      ? $utilStr.parseBoolean(subpage)
      : !$utilStr.isEmpty(initSubpage)
        ? $utilStr.parseBoolean(initSubpage)
        : null,
    bodypage: !$utilStr.isEmpty(bodypage)
      ? $utilStr.parseBoolean(bodypage)
      : !$utilStr.isEmpty(initBodypage)
        ? $utilStr.parseBoolean(initBodypage)
        : null
  };
  // 原始链接参数处理
  let originLinkParams = {
    ...$utilStr.parameterToObj(path)
  };
  let originLinkParamsIsEmpty = $utilStr.isEmpty(originLinkParams);
  if(!originLinkParamsIsEmpty) {
    if($utilStr.isEmpty(originLinkParams.appId) && !$utilStr.isEmpty(originLinkParams.appid)) {
      originLinkParams.appId = originLinkParams.appid
    }
    if($utilStr.isEmpty(originLinkParams.appClient) && !$utilStr.isEmpty(originLinkParams.appclient)) {
      originLinkParams.appClient = originLinkParams.appclient;
    }
  }
  let originAppId = !originLinkParamsIsEmpty && !$utilStr.isEmpty(originLinkParams.appId)
    ? originLinkParams.appId
    : null;
  let originTransform = !originLinkParamsIsEmpty && !$utilStr.isEmpty(originLinkParams.transform)
    ? originLinkParams.transform
    : null;
  // delete originLinkParams.appid;
  // delete originLinkParams.appclient;
  originLinkParams = processLinkParamsKeywords(originLinkParams, 2);
  // 最高权重链接参数处理
  let superLinkParams = {
    ...superParams,
    ...superImages
  };
  let superTransform = !$utilStr.isEmpty(superLinkParams) && !$utilStr.isEmpty(superLinkParams.transform)
    ? superLinkParams.transform
    : null;
  superLinkParams = processLinkParamsKeywords(superLinkParams, 2);
  if(transform) {
    if($utilStr.isEmpty(superTransform) && $utilStr.isEmpty(originTransform)) {
      if(!$utilStr.isEmpty(originAppId)) {
        if($utilStr.isEmpty(defaultLinkParams.landing)) {
          defaultLinkParams.landing = true;
        }
        if($utilStr.isEmpty(defaultLinkParams.subpage)) {
          defaultLinkParams.subpage = true;
        }
        if($utilStr.isEmpty(defaultLinkParams.bodypage)) {
          defaultLinkParams.bodypage = true;
        }
      } else {
        if(!originLinkPathIsURL) {
          if($utilStr.isEmpty(defaultLinkParams.subpage)) {
            defaultLinkParams.subpage = true;
          }
          if($utilStr.isEmpty(defaultLinkParams.bodypage)) {
            defaultLinkParams.bodypage = true;
          }
        }
      }
    }
  }
  // 完整链接参数处理
  let fullLinkParams = {
    ...initLinkParams,
    ...parentRouteParams,
    ...defaultLinkParams,
    ...originLinkParams,
    ...superLinkParams
  };
  if(!$utilStr.isEmpty(fullLinkParams.landing)) {
    if(!$utilStr.parseBoolean(fullLinkParams.landing)) {
      delete fullLinkParams.landing;
      if(!$utilStr.isEmpty(fullLinkParams.subpage) || !$utilStr.isEmpty(fullLinkParams.bodypage)) {
        fullLinkParams.redirecting = true;
      }
    }
  } else {
    if(!$utilStr.isEmpty(fullLinkParams.subpage) || !$utilStr.isEmpty(fullLinkParams.bodypage)) {
      fullLinkParams.redirecting = true;
    }
  }
  // 重新装载返回
  return {
    fullPath: $utilStr.appendParameterToURL(originLinkFullPath, fullLinkParams),
    path: originLinkPath,
    fullParams: $utilStr.clearObjNull(fullLinkParams),
    params: $utilStr.clearObjNull(processLinkParamsKeywords(fullLinkParams, 1)),
    fullQuery: $utilStr.objToParameter(fullLinkParams, true),
    query: $utilStr.objToParameter(processLinkParamsKeywords(fullLinkParams, 1), true)
  };
};

// 处理链接参数中的关键字
const processLinkParamsKeywords = (params, level) => {
  let currentParams = {
    ...params
  };
  if(level === 2) {
    delete currentParams.redirecting;
    delete currentParams.forward;
    delete currentParams.transform;
  } else if(level === 1) {
    delete currentParams.landing;
    delete currentParams.redirecting;
    delete currentParams.appId;
    delete currentParams.appClient;
    delete currentParams.subpage;
    delete currentParams.bodypage;
    delete currentParams.forward;
    delete currentParams.transform;
  }
  return currentParams;
};


export default {
  // 获取链接页面跳转地址
  getLinkPageURL,
  // 转换链接路径
  transformLinkPath,
  // 处理链接参数
  processLinkParams,
  // 处理链接参数中的关键字
  processLinkParamsKeywords,
}
