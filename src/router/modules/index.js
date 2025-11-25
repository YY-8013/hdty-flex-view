const files = require.context('.', true, /\.js$/);
let modules = [];
files.keys().forEach(key => {
  if (key === './index.js') return;
  let module = files(key);
  let item = Object.keys(module).reduce((prev, cur) => {
    if (cur !== 'default') {
      if (Array.isArray(module[cur])) {
        modules = modules.concat(module[cur]);
        return prev;
      } else {
        return module[cur];
      }
    }
    if (Array.isArray(prev)) {
      modules = modules.concat(prev);
    }
    return prev;
  }, module.default || {});
  if (item && item.path) modules.push(item);
});

export default modules;
