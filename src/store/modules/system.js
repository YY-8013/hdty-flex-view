/**
 * system模块
 */

const system = {

  // 单一状态树
  state: {
    // axios请求实例数组
    axiosInstances: [],
    // 缓存视图数组
    cachedViews: [],
    // 缓存组件数组
    cachedComponents: [],
    // 登录用户路由
    routers: null,
    // 登录用户权限
    authorities: null,
    // 登录用户导航
    navigations: null,
    // 登录用户信息
    user: null,
    // 登录用户身份令牌
    token: '',
    // 登录用户头像
    avatar: ''
  },

  // 计算属性
  getters: {
    axiosInstances: state => state.axiosInstances,
    cachedViews: state => state.cachedViews,
    cachedComponents: state => state.cachedComponents,
    routers: state => state.routers,
    authorities: state => state.authorities,
    navigations: state => state.navigations,
    user: state => state.user,
    token: state => state.token,
    avatar: state => state.avatar
  },

  // 状态更改
  mutations: {
    // 添加axios请求实例
    ADD_AXIOS_INSTANCE: (state, instance) => {
      state.axiosInstances.push(instance);
    },
    // 清除某个axios请求实例
    DEL_AXIOS_INSTANCE: (state, index) => {
      state.axiosInstances.splice(index, 1);
    },
    // 清除全部axios请求实例
    DEL_ALL_AXIOS_INSTANCES: state => {
      state.axiosInstances = [];
    },
    // 添加缓存视图
    ADD_CACHED_VIEW: (state, view) => {
      if (state.cachedViews.find(e => e.name === view.name)) return;
      if (view.meta.keepAlive) {
        state.cachedViews.push(view);
      }
    },
    // 清除某个缓存视图
    DEL_CACHED_VIEW: (state, viewName) => {
      for (const [i, v] of state.cachedViews.entries()) {
        if (v.name === viewName) {
          state.cachedViews.splice(i, 1);
          break;
        }
      }
    },
    // 清除同类缓存视图
    DEL_SAME_CLASS_CACHED_VIEW: (state, viewClass) => {
      for (let i = state.cachedViews.length - 1; i >= 0; i--) {
        if (state.cachedViews[i].class === viewClass) {
          state.cachedViews.splice(i, 1);
        }
      }
    },
    // 清除全部缓存视图
    DEL_ALL_CACHED_VIEWS: state => {
      state.cachedViews = [];
    },
    // 添加缓存组件
    ADD_CACHED_COMPONENT: (state, component) => {
      if (state.cachedComponents.find(e => e.name === component.name)) return;
      if (component.meta.keepAlive) {
        state.cachedComponents.push(component);
      }
    },
    // 清除缓存组件
    DEL_CACHED_COMPONENT: (state, componentName) => {
      for (const [i, v] of state.cachedComponents.entries()) {
        if (v.name === componentName) {
          state.cachedComponents.splice(i, 1);
          break;
        }
      }
    },
    // 清除同类缓存组件
    DEL_SAME_CLASS_CACHED_COMPONENT: (state, componentClass) => {
      for (let i = state.cachedComponents.length - 1; i >= 0; i--) {
        if (state.cachedComponents[i].class === componentClass) {
          state.cachedComponents.splice(i, 1);
        }
      }
    },
    // 清除全部缓存组件
    DEL_ALL_CACHED_COMPONENTS: state => {
      state.cachedComponents = [];
    },
    // 修改登录用户路由
    EDIT_ROUTERS: (state, val) => {
      state.routers = val;
    },
    // 修改登录用户权限
    EDIT_AUTHORITIES: (state, val) => {
      state.authorities = val;
    },
    // 修改登录用户导航
    EDIT_NAVIGATIONS: (state, val) => {
      state.navigations = val;
    },
    // 修改登录用户信息
    EDIT_USER: (state, val) => {
      state.user = val;
    },
    // 修改登录用户身份令牌
    EDIT_TOKEN: (state, val) => {
      state.token = val;
    },
    // 修改登录用户头像
    EDIT_AVATAR: (state, val) => {
      state.avatar = val;
    }
  },

  // 异步更改
  actions: {
    // 添加axios请求实例
    addAxiosInstance({ commit }, instance) {
      commit('ADD_AXIOS_INSTANCE', instance);
    },
    // 清除axios请求实例
    delAxiosInstance({ commit, state }, index) {
      return new Promise(resolve => {
        commit('DEL_AXIOS_INSTANCE', index);
        resolve([...state.axiosInstances]);
      });
    },
    // 清除全部axios请求实例
    delAllAxiosInstances({ commit, state }) {
      return new Promise(resolve => {
        commit('DEL_ALL_AXIOS_INSTANCES');
        resolve([...state.axiosInstances]);
      });
    },
    // 添加缓存视图
    addCachedView({commit}, view) {
      commit('ADD_CACHED_VIEW', view);
    },
    // 清除缓存视图
    delCachedView({commit, state}, viewName) {
      return new Promise(resolve => {
        commit('DEL_CACHED_VIEW', viewName);
        resolve([...state.cachedViews]);
      });
    },
    // 清除同类缓存视图
    delSameClassCachedView({commit, state}, viewName) {
      return new Promise(resolve => {
        commit('DEL_SAME_CLASS_CACHED_VIEW', viewName);
        resolve([...state.cachedComponents]);
      });
    },
    // 清除全部缓存视图
    delAllCachedViews({commit, state}) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_VIEWS');
        resolve([...state.cachedViews]);
      });
    },
    // 添加缓存组件
    addCachedComponent({commit}, component) {
      commit('ADD_CACHED_COMPONENT', component);
    },
    // 清除缓存组件
    delCachedComponent({commit, state}, componentName) {
      return new Promise(resolve => {
        commit('DEL_CACHED_COMPONENT', componentName);
        resolve([...state.cachedComponents]);
      });
    },
    // 清除同类缓存组件
    delSameClassCachedComponent({commit, state}, componentClass) {
      return new Promise(resolve => {
        commit('DEL_SAME_CLASS_CACHED_COMPONENT', componentClass);
        resolve([...state.cachedComponents]);
      });
    },
    // 清除全部缓存组件
    delAllCachedComponents({commit, state}) {
      return new Promise(resolve => {
        commit('DEL_ALL_CACHED_COMPONENTS');
        resolve([...state.cachedComponents]);
      });
    },
    // 修改登录用户路由
    editRouters({ commit }, val) {
      commit('EDIT_ROUTERS', val);
    },
    // 修改登录用户权限
    editAuthorities({ commit }, val) {
      commit('EDIT_AUTHORITIES', val);
    },
    // 修改登录用户导航
    editNavigations({ commit }, val) {
      commit('EDIT_NAVIGATIONS', val);
    },
    // 修改登录用户信息
    editUser({ commit }, val) {
      commit('EDIT_USER', val);
    },
    // 修改登录用户身份令牌
    editToken({ commit }, val) {
      commit('EDIT_TOKEN', val);
    },
    // 修改登录用户头像
    editAvatar({ commit }, val) {
      commit('EDIT_AVATAR', val);
    }
  }
};

export default {
  system
}
