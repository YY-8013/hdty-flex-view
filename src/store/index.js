/*
状态管理
*/


import Vue from 'vue';
import Vuex from 'vuex';
import stores from './stores';

// 挂载Vuex
Vue.use(Vuex);

// 创建Vuex对象
const store = new Vuex.Store({
  modules: stores.modules,
  mutations: {
    // 中断所有axios请求
    INTERRUPT_ALL_AXIOS: state => {
      for (let e of state.system.axiosInstances) {
        // 执行取消操作
        e.c('all_interruption');
      }
    },
    // 重置所有state
    RESET_ALL_STATE: state => {
      let copy = deepClone(stores.state);
      for (let k in copy) {
        if (copy.hasOwnProperty(k)) {
          state[k] = copy[k];
        }
      }
    },
  },
  actions: {
    // 中断所有axios请求
    interruptAllAxios({commit}) {
      commit('INTERRUPT_ALL_AXIOS');
    },
    // 重置所有state
    resetAllState({commit}) {
      commit('RESET_ALL_STATE');
    },
    // 清除当前登录痕迹
    clearCurrentLogin({commit}) {
      commit('INTERRUPT_ALL_AXIOS');
      commit('RESET_ALL_STATE');
    }
  }
});

// 深拷贝对象
function deepClone(obj) {
  let newObj = obj instanceof Array ? [] : {};
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      newObj[i] = typeof(obj[i]) === 'object' && obj[i] ? deepClone(obj[i]) : obj[i];
    }
  }
  return newObj;
}

export default store;
