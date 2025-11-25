import $crypto from '@/utils/crypto';

const MP = {};
// 离线密钥
const OFFLINE_KEY = '1597534569871230';
// 在线转离线等候时间（毫秒）
const WAITING = 1000;

let apiComplete = 'undefined';

MP.api = offlineUrl => {
  let valid = 'undefined';
  return new Promise((resolve, reject) => {
    let timer;
    if(apiComplete !== 'undefined') {
      listener();
    } else {
      apiComplete = false;
      let api, onlineCheckComplete = false;
      const img = new Image();
      img.onload = checkLoad;
      img.onerror = checkError;
      img.src = 'https://js.arcgis.com/3.15/dojo/resources/blank.gif';
      let waiting = setTimeout(() => {
        if(!onlineCheckComplete) {
          onlineCheckComplete = true;
          offlineLoad();
        }
      }, WAITING);
      function checkLoad() {
        if(!onlineCheckComplete) {
          onlineCheckComplete = true;
          if(waiting) {
            clearTimeout(waiting);
          }
          onlineLoad();
        }
      }
      function checkError() {
        if(!onlineCheckComplete) {
          onlineCheckComplete = true;
          if(waiting) {
            clearTimeout(waiting);
          }
          offlineLoad();
        }
      }
      function onlineLoad() {
        api = document.createElement('script');
        api.onload = api.onreadystatechange = function() {
          if(!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
            valid = true;
            apiComplete = true;
            let link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = 'https://js.arcgis.com/3.15/esri/css/esri.css';
            document.head.appendChild(link);
            resolve(valid);
          }
          api.onload = api.onreadystatechange = null;
        };
        api.onerror = onlineError;
        api.type = 'text/javascript';
        api.src = 'https://js.arcgis.com/3.15/init.js';
        document.head.appendChild(api);
      }
      function onlineError() {
        api.remove();
        offlineLoad();
      }
      function offlineLoad() {
        api = document.createElement('script');
        window.hmaOfflineReady = () => {
          valid = false;
          apiComplete = true;
          resolve(valid);
        };
        api.onerror = offlineError;
        api.type = 'text/javascript';
        api.src = offlineUrl + '/map_arcgis_vue_load.js?key=' + $crypto.aesEncryptCurrentDate(OFFLINE_KEY) + '&callback=hmaOfflineReady';
        document.head.appendChild(api);
      }
      function offlineError(e) {
        api.remove();
        if(timer) {
          clearTimeout(timer);
        }
        reject(e);
      }
    }
    function listener() {
      if(apiComplete) {
        validAndResolve();
      } else {
        run();
        function run() {
          if(timer) {
            clearTimeout(timer);
          }
          if(apiComplete) {
            validAndResolve();
          } else {
            timer = setTimeout(run, 100);
          }
        }
      }
      function validAndResolve() {
        try {
          [].forEach.call(document.querySelectorAll('script'), e => {
            if(e.src.indexOf('https://js.arcgis.com/3.15/init.js') !== -1) {
              valid = true;
              throw Error();
            } else if(e.src.indexOf('/map_arcgis_vue_load.js') !== -1) {
              valid = false;
              throw Error();
            }
          });
        } catch (e) {}
        if(valid !== 'undefined') {
          resolve(valid);
        } else {
          reject();
        }
      }
    }
  });
};

export default MP;
