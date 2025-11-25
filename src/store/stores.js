/*
状态管理的模块定义
*/

import moduleStore from './modules';

const app = {

  // 单一状态树
  state: {
    // 应用程序主题
    theme: '',
    // 应用程序尺寸
    size: '',
    // 应用程序布局方式
    scheme: '',
    // 应用程序顶部导航启用状态
    topnav: null,
    // 应用程序页面选项卡启用状态
    pagetab: null,
    // 应用程序消息提示启用状态
    notify: null,
    // 应用程序消息提示音启用状态
    beep: null,
    // 应用程序消息提示位置
    position: '',
    // 应用程序消息未读标记
    badge: '',
    // 应用程序左侧菜单折叠状态
    menucollap: null
  },

  // 计算属性
  getters: {
    theme: state => state.theme,
    size: state => state.size,
    scheme: state => state.scheme,
    topnav: state => state.topnav,
    pagetab: state => state.pagetab,
    notify: state => state.notify,
    beep: state => state.beep,
    position: state => state.position,
    badge: state => state.badge,
    menucollap: state => state.menucollap
  },

  // 状态更改
  mutations: {
    // 修改应用程序主题
    EDIT_THEME: (state, val) => {
      state.theme = val;
    },
    // 修改应用程序尺寸
    EDIT_SIZE: (state, val) => {
      state.size = val;
    },
    // 修改应用程序布局方式
    EDIT_SCHEME: (state, val) => {
      state.scheme = val;
    },
    // 修改应用程序顶部导航启用状态
    EDIT_TOPNAV: (state, val) => {
      state.topnav = val;
    },
    // 修改应用程序页面选项卡启用状态
    EDIT_PAGETAB: (state, val) => {
      state.pagetab = val;
    },
    // 修改应用程序消息提示启用状态
    EDIT_NOTIFY: (state, val) => {
      state.notify = val;
    },
    // 修改应用程序消息提示音启用状态
    EDIT_BEEP: (state, val) => {
      state.beep = val;
    },
    // 修改应用程序消息提示位置
    EDIT_POSITION: (state, val) => {
      state.position = val;
    },
    // 修改应用程序消息未读标记
    EDIT_BADGE: (state, val) => {
      state.badge = val;
    },
    // 修改应用程序左侧菜单折叠状态
    EDIT_MENUCOLLAP: (state, val) => {
      state.menucollap = val;
    }
  },

  // 异步更改
  actions: {
    // 修改应用程序主题
    editTheme({ commit }, val) {
      commit('EDIT_THEME', val);
    },
    // 修改应用程序尺寸
    editSize({ commit }, val) {
      commit('EDIT_SIZE', val);
    },
    // 修改应用程序布局方式
    editScheme({ commit }, val) {
      commit('EDIT_SCHEME', val);
    },
    // 修改应用程序顶部导航启用状态
    editTopnav({ commit }, val) {
      commit('EDIT_TOPNAV', val);
    },
    // 修改应用程序页面选项卡启用状态
    editPagetab({ commit }, val) {
      commit('EDIT_PAGETAB', val);
    },
    // 修改应用程序消息提示启用状态
    editNotify({ commit }, val) {
      commit('EDIT_NOTIFY', val);
    },
    // 修改应用程序消息提示音启用状态
    editBeep({ commit }, val) {
      commit('EDIT_BEEP', val);
    },
    // 修改应用程序消息提示位置
    editPosition({ commit }, val) {
      commit('EDIT_POSITION', val);
    },
    // 修改应用程序消息未读标记
    editBadge({ commit }, val) {
      commit('EDIT_BADGE', val);
    },
    // 修改应用程序左侧菜单折叠状态
    editMenucollap({ commit }, val) {
      commit('EDIT_MENUCOLLAP', val);
    }
  }
};

export default {
  modules: {
    ...moduleStore.modules,
    app
  },
  state: moduleStore.state
}
