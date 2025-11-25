import { gatQxdaUrl } from "../api"; // 引入API函数

// bjdaService.js
export default {
  data() {
    return {
      bjdaLoading: false,
      showBjdaButton: false, // 初始化时不显示按钮，直到验证有有效的url
      bjdaUrl: null // 存储档案的URL
    };
  },
  methods: {
    fetchBjdaUrl(gmsfhm) {
      return new Promise((resolve, reject) => {
        if (!gmsfhm) {
          this.showBjdaButton = false;
          return reject(new Error("身份证号码为空"));
        }
        const dataParams = { gmsfhm };
        gatQxdaUrl(dataParams)
          .then(response => {
            const { success, data, msg } = response.data;
            if (success) {
              const { isSuccess, msg: qxdaMsg, url } = data;
              if (isSuccess && url) {
                this.bjdaUrl = url; // 更新URL
                this.showBjdaButton = true; // 显示按钮
                resolve({ isSuccess, qxdaMsg, url });
              } else {
                this.showBjdaButton = false; // 隐藏按钮
                // this.showError(qxdaMsg);
                reject(new Error(qxdaMsg));
              }
            } else {
              this.showBjdaButton = false;
              reject(new Error(msg));
            }
          })
          .catch(error => {
            this.showBjdaButton = false;
            reject(error);
          });
      });
    },
    openBjdaUrl() {
      if (this.bjdaUrl) {
        window.open(this.bjdaUrl, "_blank");
      }
    },
    showError(message) {
      this.$message({
        showClose: true,
        customClass: "is-fixed",
        message,
        type: "error"
      });
    },
    showWarning(message) {
      this.$message({
        showClose: true,
        customClass: "is-fixed",
        message,
        type: "warning"
      });
    }
  }
};
