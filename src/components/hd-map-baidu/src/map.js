import $crypto from "@/utils/crypto";

const MP = {};
// 在线密钥
const ONLINE_KEY = "APLx3oUFGAZ9p1kO6wEsvPVLLXgbM6VD";
// 离线密钥
const OFFLINE_KEY = "1597534569871230";
// 在线转离线等候时间（毫秒）
const WAITING = 0;

let apiComplete = "undefined";
let ctComplete = "undefined";
let mcComplete = "undefined";
let dmComplete = "undefined";
let hmComplete = "undefined";
let lsComplete = "undefined";
let ibComplete = "undefined";

MP.api = (offlineUrl, theme) => {
  let valid = "undefined";
  return new Promise((resolve, reject) => {
    let timer;
    if (apiComplete !== "undefined") {
      listener();
    } else {
      apiComplete = false;
      let api,
        onlineCheckComplete = false;
      const img = new Image();
      img.onload = checkLoad;
      img.onerror = checkError;
      img.src = "https://api.map.baidu.com/images/blank.gif";
      let waiting = setTimeout(() => {
        if (!onlineCheckComplete) {
          onlineCheckComplete = true;
          offlineLoad();
        }
      }, WAITING);
      function checkLoad() {
        if (!onlineCheckComplete) {
          onlineCheckComplete = true;
          if (waiting) {
            clearTimeout(waiting);
          }
          onlineLoad();
        }
      }
      function checkError() {
        if (!onlineCheckComplete) {
          onlineCheckComplete = true;
          if (waiting) {
            clearTimeout(waiting);
          }
          offlineLoad();
        }
      }
      function onlineLoad() {
        api = document.createElement("script");
        window.hmbReady = () => {
          valid = true;
          apiComplete = true;
          resolve(valid);
        };
        api.onerror = onlineError;
        api.type = "text/javascript";
        api.src =
          "https://api.map.baidu.com/api?v=2.0&ak=" +
          ONLINE_KEY +
          "&callback=hmbReady";
        document.head.appendChild(api);
      }
      function onlineError() {
        api.remove();
        offlineLoad();
      }
      function offlineLoad() {
        api = document.createElement("script");
        window.hmbOfflineReady = () => {
          valid = false;
          apiComplete = true;
          resolve(valid);
        };
        api.onerror = offlineError;
        api.type = "text/javascript";
        api.src =
          offlineUrl +
          "/map_vue_load.js?key=" +
          $crypto.aesEncryptCurrentDate(OFFLINE_KEY) +
          "&theme=" +
          theme +
          "&callback=hmbOfflineReady";
        document.head.appendChild(api);
      }
      function offlineError(e) {
        api.remove();
        if (timer) {
          clearTimeout(timer);
        }
        reject(e);
      }
    }
    function listener() {
      if (apiComplete) {
        validAndResolve();
      } else {
        run();
        function run() {
          if (timer) {
            clearTimeout(timer);
          }
          if (apiComplete) {
            validAndResolve();
          } else {
            timer = setTimeout(run, 100);
          }
        }
      }
      function validAndResolve() {
        try {
          [].forEach.call(document.querySelectorAll("script"), (e) => {
            if (e.src.indexOf("https://api.map.baidu.com/api") !== -1) {
              valid = true;
              throw Error();
            } else if (e.src.indexOf("/map_vue_load.js") !== -1) {
              valid = false;
              throw Error();
            }
          });
        } catch (e) {}
        if (valid !== "undefined") {
          resolve(valid);
        } else {
          reject();
        }
      }
    }
  });
};

MP.ct = () => {
  return new Promise((resolve, reject) => {
    let timer;
    if (ctComplete !== "undefined") {
      listener();
    } else {
      ctComplete = false;
      let ct = document.createElement("script");
      ct.onload = ct.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState === "loaded" ||
          this.readyState === "complete"
        ) {
          ctComplete = true;
          resolve();
        }
        ct.onload = ct.onreadystatechange = null;
      };
      ct.onerror = error;
      ct.type = "text/javascript";
      ct.src =
        process.env.NODE_PATH + "/static/public/js/bmap/constants_min.js";
      document.head.appendChild(ct);
      function error(e) {
        ct.remove();
        if (timer) {
          clearTimeout(timer);
        }
        reject(e);
      }
    }
    function listener() {
      if (ctComplete) {
        validAndResolve();
      } else {
        run();
        function run() {
          if (timer) {
            clearTimeout(timer);
          }
          if (ctComplete) {
            validAndResolve();
          } else {
            timer = setTimeout(run, 100);
          }
        }
      }
      function validAndResolve() {
        let valid = false;
        try {
          [].forEach.call(document.querySelectorAll("script"), (e) => {
            if (e.src.indexOf("/constants_min.js") !== -1) {
              valid = true;
              throw Error();
            }
          });
        } catch (e) {}
        if (valid) {
          resolve();
        } else {
          reject();
        }
      }
    }
  });
};

MP.mc = () => {
  return new Promise((resolve, reject) => {
    let timer;
    if (mcComplete !== "undefined") {
      listener();
    } else {
      mcComplete = false;
      let mc = document.createElement("script");
      mc.onload = mc.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState === "loaded" ||
          this.readyState === "complete"
        ) {
          let to = document.createElement("script");
          to.onload = to.onreadystatechange = function () {
            if (
              !this.readyState ||
              this.readyState === "loaded" ||
              this.readyState === "complete"
            ) {
              mcComplete = true;
              resolve();
            }
            to.onload = to.onreadystatechange = null;
          };
          to.onerror = error;
          to.type = "text/javascript";
          to.src =
            "https://api.map.baidu.com/library/TextIconOverlay/1.2/src/TextIconOverlay_min.js";
          document.head.appendChild(to);
        }
        mc.onload = mc.onreadystatechange = null;
      };
      mc.onerror = error;
      mc.type = "text/javascript";
      mc.src =
        process.env.NODE_PATH +
        "/static/public/js/bmap/marker-clusterer_min.js";
      document.head.appendChild(mc);
      function error(e) {
        mc.remove();
        if (timer) {
          clearTimeout(timer);
        }
        reject(e);
      }
    }
    function listener() {
      if (mcComplete) {
        validAndResolve();
      } else {
        run();
        function run() {
          if (timer) {
            clearTimeout(timer);
          }
          if (mcComplete) {
            validAndResolve();
          } else {
            timer = setTimeout(run, 100);
          }
        }
      }
      function validAndResolve() {
        let valid = false;
        try {
          [].forEach.call(document.querySelectorAll("script"), (e) => {
            if (e.src.indexOf("/TextIconOverlay_min.js") !== -1) {
              valid = true;
              throw Error();
            }
          });
        } catch (e) {}
        if (valid) {
          resolve();
        } else {
          reject();
        }
      }
    }
  });
};

MP.dm = () => {
  return new Promise((resolve, reject) => {
    let timer;
    if (dmComplete !== "undefined") {
      listener();
    } else {
      dmComplete = false;
      let dm = document.createElement("script");
      dm.onload = dm.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState === "loaded" ||
          this.readyState === "complete"
        ) {
          dmComplete = true;
          let link = document.createElement("link");
          link.rel = "stylesheet";
          link.type = "text/css";
          link.href =
            "https://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css";
          document.head.appendChild(link);
          resolve();
        }
        dm.onload = dm.onreadystatechange = null;
      };
      dm.onerror = error;
      dm.type = "text/javascript";
      dm.src =
        "https://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js";
      document.head.appendChild(dm);
      function error(e) {
        dm.remove();
        if (timer) {
          clearTimeout(timer);
        }
        reject(e);
      }
    }
    function listener() {
      if (dmComplete) {
        validAndResolve();
      } else {
        run();
        function run() {
          if (timer) {
            clearTimeout(timer);
          }
          if (dmComplete) {
            validAndResolve();
          } else {
            timer = setTimeout(run, 100);
          }
        }
      }
      function validAndResolve() {
        let valid = false;
        try {
          [].forEach.call(document.querySelectorAll("script"), (e) => {
            if (e.src.indexOf("/DrawingManager_min.js") !== -1) {
              valid = true;
              throw Error();
            }
          });
        } catch (e) {}
        if (valid) {
          resolve();
        } else {
          reject();
        }
      }
    }
  });
};

MP.hm = () => {
  return new Promise((resolve, reject) => {
    let timer;
    if (hmComplete !== "undefined") {
      listener();
    } else {
      hmComplete = false;
      let hm = document.createElement("script");
      hm.onload = hm.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState === "loaded" ||
          this.readyState === "complete"
        ) {
          hmComplete = true;
          resolve();
        }
        hm.onload = hm.onreadystatechange = null;
      };
      hm.onerror = error;
      hm.type = "text/javascript";
      hm.src =
        "https://api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js";
      document.head.appendChild(hm);
      function error(e) {
        hm.remove();
        if (timer) {
          clearTimeout(timer);
        }
        reject(e);
      }
    }
    function listener() {
      if (hmComplete) {
        validAndResolve();
      } else {
        run();
        function run() {
          if (timer) {
            clearTimeout(timer);
          }
          if (hmComplete) {
            validAndResolve();
          } else {
            timer = setTimeout(run, 100);
          }
        }
      }
      function validAndResolve() {
        let valid = false;
        try {
          [].forEach.call(document.querySelectorAll("script"), (e) => {
            if (e.src.indexOf("/Heatmap_min.js") !== -1) {
              valid = true;
              throw Error();
            }
          });
        } catch (e) {}
        if (valid) {
          resolve();
        } else {
          reject();
        }
      }
    }
  });
};

MP.ls = () => {
  return new Promise((resolve, reject) => {
    let timer;
    if (lsComplete !== "undefined") {
      listener();
    } else {
      lsComplete = false;
      let ls = document.createElement("script");
      ls.onload = ls.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState === "loaded" ||
          this.readyState === "complete"
        ) {
          lsComplete = true;
          resolve();
        }
        ls.onload = ls.onreadystatechange = null;
      };
      ls.onerror = error;
      ls.type = "text/javascript";
      ls.src = process.env.NODE_PATH + "/static/public/js/bmap/lushu_min.js";
      document.head.appendChild(ls);
      function error(e) {
        ls.remove();
        if (timer) {
          clearTimeout(timer);
        }
        reject(e);
      }
    }
    function listener() {
      if (lsComplete) {
        validAndResolve();
      } else {
        run();
        function run() {
          if (timer) {
            clearTimeout(timer);
          }
          if (lsComplete) {
            validAndResolve();
          } else {
            timer = setTimeout(run, 100);
          }
        }
      }
      function validAndResolve() {
        let valid = false;
        try {
          [].forEach.call(document.querySelectorAll("script"), (e) => {
            if (e.src.indexOf("/lushu_min.js") !== -1) {
              valid = true;
              throw Error();
            }
          });
        } catch (e) {}
        if (valid) {
          resolve();
        } else {
          reject();
        }
      }
    }
  });
};

MP.ib = () => {
  return new Promise((resolve, reject) => {
    let timer;
    if (ibComplete !== "undefined") {
      listener();
    } else {
      ibComplete = false;
      let ib = document.createElement("script");
      ib.onload = ib.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState === "loaded" ||
          this.readyState === "complete"
        ) {
          ibComplete = true;
          resolve();
        }
        ib.onload = ib.onreadystatechange = null;
      };
      ib.onerror = error;
      ib.type = "text/javascript";
      ib.src = process.env.NODE_PATH + "/static/public/js/bmap/infobox_min.js";
      document.head.appendChild(ib);
      function error(e) {
        ib.remove();
        if (timer) {
          clearTimeout(timer);
        }
        reject(e);
      }
    }
    function listener() {
      if (ibComplete) {
        validAndResolve();
      } else {
        run();
        function run() {
          if (timer) {
            clearTimeout(timer);
          }
          if (ibComplete) {
            validAndResolve();
          } else {
            timer = setTimeout(run, 100);
          }
        }
      }
      function validAndResolve() {
        let valid = false;
        try {
          [].forEach.call(document.querySelectorAll("script"), (e) => {
            if (e.src.indexOf("/infobox_min.js") !== -1) {
              valid = true;
              throw Error();
            }
          });
        } catch (e) {}
        if (valid) {
          resolve();
        } else {
          reject();
        }
      }
    }
  });
};

MP.offline_mc = (offlineUrl) => {
  return new Promise((resolve, reject) => {
    let timer;
    if (mcComplete !== "undefined") {
      listener();
    } else {
      mcComplete = false;
      let mc = document.createElement("script");
      mc.onload = mc.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState === "loaded" ||
          this.readyState === "complete"
        ) {
          let to = document.createElement("script");
          to.onload = to.onreadystatechange = function () {
            if (
              !this.readyState ||
              this.readyState === "loaded" ||
              this.readyState === "complete"
            ) {
              mcComplete = true;
              resolve();
            }
            to.onload = to.onreadystatechange = null;
          };
          to.onerror = error;
          to.type = "text/javascript";
          to.src =
            offlineUrl +
            "/tools/TextIconOverlay_min.js?key=" +
            $crypto.aesEncryptCurrentDate(OFFLINE_KEY);
          document.head.appendChild(to);
        }
        mc.onload = mc.onreadystatechange = null;
      };
      mc.onerror = error;
      mc.type = "text/javascript";
      mc.src =
        process.env.NODE_PATH +
        "/static/public/js/bmap/marker-clusterer_min.js";
      document.head.appendChild(mc);
      function error(e) {
        mc.remove();
        if (timer) {
          clearTimeout(timer);
        }
        reject(e);
      }
    }
    function listener() {
      if (mcComplete) {
        validAndResolve();
      } else {
        run();
        function run() {
          if (timer) {
            clearTimeout(timer);
          }
          if (mcComplete) {
            validAndResolve();
          } else {
            timer = setTimeout(run, 100);
          }
        }
      }
      function validAndResolve() {
        let valid = false;
        try {
          [].forEach.call(document.querySelectorAll("script"), (e) => {
            if (e.src.indexOf("/TextIconOverlay_min.js") !== -1) {
              valid = true;
              throw Error();
            }
          });
        } catch (e) {}
        if (valid) {
          resolve();
        } else {
          reject();
        }
      }
    }
  });
};

MP.offline_dm = (offlineUrl) => {
  return new Promise((resolve, reject) => {
    let timer;
    if (dmComplete !== "undefined") {
      listener();
    } else {
      dmComplete = false;
      let dm = document.createElement("script");
      dm.onload = dm.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState === "loaded" ||
          this.readyState === "complete"
        ) {
          dmComplete = true;
          let link = document.createElement("link");
          link.onerror = reject;
          link.rel = "stylesheet";
          link.type = "text/css";
          link.href =
            offlineUrl +
            "/tools/DrawingManager_min.css?key=" +
            $crypto.aesEncryptCurrentDate(OFFLINE_KEY);
          document.head.appendChild(link);
          resolve();
        }
        dm.onload = dm.onreadystatechange = null;
      };
      dm.onerror = error;
      dm.type = "text/javascript";
      dm.src =
        offlineUrl +
        "/tools/DrawingManager_min.js?key=" +
        $crypto.aesEncryptCurrentDate(OFFLINE_KEY);
      document.head.appendChild(dm);
      function error(e) {
        dm.remove();
        if (timer) {
          clearTimeout(timer);
        }
        reject(e);
      }
    }
    function listener() {
      if (dmComplete) {
        validAndResolve();
      } else {
        run();
        function run() {
          if (timer) {
            clearTimeout(timer);
          }
          if (dmComplete) {
            validAndResolve();
          } else {
            timer = setTimeout(run, 100);
          }
        }
      }
      function validAndResolve() {
        let valid = false;
        try {
          [].forEach.call(document.querySelectorAll("script"), (e) => {
            if (e.src.indexOf("/DrawingManager_min.js") !== -1) {
              valid = true;
              throw Error();
            }
          });
        } catch (e) {}
        if (valid) {
          resolve();
        } else {
          reject();
        }
      }
    }
  });
};

MP.offline_hm = (offlineUrl) => {
  return new Promise((resolve, reject) => {
    let timer;
    if (hmComplete !== "undefined") {
      listener();
    } else {
      hmComplete = false;
      let hm = document.createElement("script");
      hm.onload = hm.onreadystatechange = function () {
        if (
          !this.readyState ||
          this.readyState === "loaded" ||
          this.readyState === "complete"
        ) {
          hmComplete = true;
          resolve();
        }
        hm.onload = hm.onreadystatechange = null;
      };
      hm.onerror = error;
      hm.type = "text/javascript";
      hm.src =
        offlineUrl +
        "/tools/Heatmap_min.js?key=" +
        $crypto.aesEncryptCurrentDate(OFFLINE_KEY);
      document.head.appendChild(hm);
      function error(e) {
        hm.remove();
        if (timer) {
          clearTimeout(timer);
        }
        reject(e);
      }
    }
    function listener() {
      if (hmComplete) {
        validAndResolve();
      } else {
        run();
        function run() {
          if (timer) {
            clearTimeout(timer);
          }
          if (hmComplete) {
            validAndResolve();
          } else {
            timer = setTimeout(run, 100);
          }
        }
      }
      function validAndResolve() {
        let valid = false;
        try {
          [].forEach.call(document.querySelectorAll("script"), (e) => {
            if (e.src.indexOf("/Heatmap_min.js") !== -1) {
              valid = true;
              throw Error();
            }
          });
        } catch (e) {}
        if (valid) {
          resolve();
        } else {
          reject();
        }
      }
    }
  });
};

export default MP;
