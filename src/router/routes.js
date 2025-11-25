/**
 * 路由的模块定义
 */

import Layout from "@/relies/layout/Layout";
const _import = require("./_import_" + process.env.NODE_ENV);
import moduleRouter from "./modules";

const appRouter = [
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
      keepAlive: false
    },
    component: _import("relies/login/Login")
  },
  {
    path: "/loginxt",
    name: "LoginXt",
    meta: {
      title: "登录",
      keepAlive: false
    },
    component: _import("relies/login/Login")
  },
  {
    path: "/login",
    name: "Login",
    meta: {
      title: "登录",
      keepAlive: false
    },
    component: _import("relies/login/Login")
  },
  {
    path: "/",
    component: Layout,
    children: [
      {
        path: "/",
        name: "Home",
        meta: {
          title: "工作台",
          keepAlive: true
        },
        component: _import("relies/home/Home")
      }
    ]
  },
  {
    path: "/default",
    component: Layout,
    children: [
      {
        path: "/my-center",
        name: "MyCenter",
        meta: {
          title: "个人中心",
          keepAlive: false,
          loosened: true
        },
        component: _import("relies/layout/modules/MyCenter")
      }
    ]
  },
  {
    path: "/inform",
    name: "Inform",
    meta: {
      title: "通知公告",
      keepAlive: false,
      loosened: true
    },
    component: _import("components/inform/Inform")
  },
  {
    path: "/http-status",
    component: Layout,
    children: [
      {
        path: "/400",
        name: "BadRequest",
        meta: {
          title: "未知错误",
          keepAlive: false
        },
        component: _import("relies/status/BadRequest")
      },
      {
        path: "/404",
        name: "NotFound",
        meta: {
          title: "无法找到",
          keepAlive: false
        },
        component: _import("relies/status/NotFound")
      },
      {
        path: "/406",
        name: "NotAcceptable",
        meta: {
          title: "未经授权",
          keepAlive: false
        },
        component: _import("relies/status/NotAcceptable")
      }
    ]
  },
  {
    path: "/redirect",
    component: Layout,
    children: [
      {
        path: "/redirect/:path*",
        name: "Redirect",
        meta: {
          keepAlive: false,
          loosened: true
        },
        component: _import("relies/redirect/Redirect")
      }
    ]
  },
  {
    path: "/landing/:path*",
    name: "Landing",
    meta: {
      keepAlive: false,
      loosened: true
    },
    component: _import("relies/landing/Landing")
  }
];

export default moduleRouter.concat(appRouter);
