const files = require.context('.', true, /\.js$/);
let modules = {};
let state = {};
files.keys().forEach(key => {
  if (key === './index.js') return;
  let module = files(key);
  let item = Object.keys(module).reduce((prev, cur) => {
    if (cur !== 'default') {
      if (Array.isArray(module[cur])) {
        for (let v of module[cur]) {
          prev[cur] = deepMerge(prev[cur], v);
        }
      } else {
        prev[cur] = module[cur];
      }
    }
    return prev;
  }, module.default || {});
  if (item) {
    modules = { namespaced: true, ...modules, ...item};
    if(Object.keys(item).length > 0) {
      let moduleName = Object.keys(item);
      state[moduleName[0]] = deepClone(item)[moduleName[0]].state;
    }
  }
});

// 合并两个深层对象
function deepMerge(obj1, obj2) {
  obj1 = obj1 || {};
  for (let i in obj2) {
    if (obj2.hasOwnProperty(i)) {
      obj1[i] = obj1[i] && Object.prototype.toString.call(obj1[i]) === '[object Object]'
        ? deepMerge(obj1[i], obj2[i])
        : obj2[i];
    }
  }
  return obj1;
}

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

export default {
  modules: modules,
  state: state
};
