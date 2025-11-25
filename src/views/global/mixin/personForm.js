import { getPersonInfoByIdCard } from "@/api/common";

export default {
  data() {
    return {
      cardIdQueryLoading: false
    };
  },
  methods: {
    // 从常口库获取人员信息
    handleBaseInfo(cardId, prop, ref) {
      let _this = this;
      let cardIdField = prop || "cardId";
      let formRef = ref || "formRef";
      if (!cardId) return;
      if (_this.$refs[formRef]) {
        _this.$refs.formRef.validateField(cardIdField, (errMsg) => {
          // 如果errMsg无值，则代表是正确的情况
          if (!errMsg) {
            _this.cardIdQueryLoading = true;
            // 参数
            let dataParams = {
              idCard: cardId
            };
            // Lambda写法
            getPersonInfoByIdCard(dataParams)
              .then((response) => {
                //响应成功回调
                let { success, data } = response.data;
                if (success) {
                  // 人员信息
                  let { xbdm, xm } = data.vo;
                  // 提示
                  if (!xm) {
                    _this.$message({
                      showClose: true,
                      customClass: "is-fixed",
                      message: "暂未获取到常口库信息",
                      type: "warning"
                    });
                  }

                  _this.updateFormFields(data);
                }
              })
              .catch((error) => {
                // 响应错误回调
                console.log(error);
              })
              .finally(() => {
                _this.cardIdQueryLoading = false;
              });
          }
        });
      }
    }
  }
};
