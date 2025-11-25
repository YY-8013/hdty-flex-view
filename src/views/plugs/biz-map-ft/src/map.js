import $crypto from '@/utils/crypto';

const MP = {};
// 离线密钥
const OFFLINE_KEY = '860317fb94e24bd28a4d42fae49c7d3b';

MP.api = () => {
  let valid = 'undefined';
  return new Promise((resolve, reject) => {
    let timer;
      let api, onlineCheckComplete = false;
      offlineLoad();
      function offlineLoad() {
        api = document.createElement('script');
        window.hmaOfflineReady = () => {
          valid = false;
          resolve(valid);
        };
        api.onerror = offlineError;
        api.type = 'text/javascript';
        api.src = process.env.NODE_PATH + '/static/public/js/ft/map_ft_vue_load.js?key='+ OFFLINE_KEY + '&callback=hmaOfflineReady';
        document.head.appendChild(api);
      }
      function offlineError(e) {
        api.remove();
        if(timer) {
          clearTimeout(timer);
        }
        reject(e);
      }
  });
};

export default MP;
