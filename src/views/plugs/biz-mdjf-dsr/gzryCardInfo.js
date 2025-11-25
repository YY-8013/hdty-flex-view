import { getPersonExistAndInfo } from "./api";
import { getPersonInfoByIdCard, getPersonPhoneInfo } from "@/api/common";

export default {
  data() {
    return {
      cardIdQueryLoading: false
    };
  },
  methods: {
    cardIdChange() {
      this.$refs.formRef.validateField(["dsrCardId"], (errMsg) => {
        // 如果errMsg无值，则代表是正确的情况
        if (!errMsg) {
          let _this = this;
          let dataParams = {
            cardId: _this.formData.dsrCardId
          };
          getPersonExistAndInfo(dataParams)
            .then((response) => {
              //响应成功回调
              let { success, data } = response.data;
              if (success) {
                if (data && data.vo && data.vo.xm) {
                  let { gmsfhm, xm, lxdhList, zdrylx, rydj, zdrylxList, mzdm } =
                    data.vo;
                  let {
                    zdrylx: zdrylxText,
                    rydj: rydjText,
                    zdrylxList: zdrylxListText,
                    mzdm: mzdmText
                  } = data.vox;

                  _this.$set(_this.formData, "dsrName", xm);
                  _this.$set(
                    _this.formData,
                    "dsrLxdh",
                    lxdhList && lxdhList.length > 0 ? lxdhList[0] : ""
                  );
                  _this.$set(_this.formData, "dsrRybqList", zdrylxList);
                  _this.$set(_this.formData, "dsrRybqListText", zdrylxListText);

                  _this.$set(_this.formData, "dsrRydj", rydj);
                  _this.$set(_this.formData, "dsrRydjText", rydjText);

                  _this.$set(_this.formData, "dsrMz", mzdm);
                  _this.$set(_this.formData, "dsrMzText", mzdmText);
                } else {
                  _this.resetField();
                  _this.handleBaseInfo();
                }
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.log(error);
              _this.resetField();
              _this.handleBaseInfo();
            })
            .finally(() => {
              _this.queryLoading = false;
            });
        } else {
          this.resetField();
        }
      });
    },

    // 从常口库获取人员信息
    handleBaseInfo() {
      let _this = this;
      _this.$refs.formRef.validateField(["dsrCardId"], (errMsg) => {
        // 如果errMsg无值，则代表是正确的情况
        if (!errMsg) {
          let _this = this;
          _this.cardIdQueryLoading = true;
          // 参数
          let dataParams = {
            idCard: _this.formData.dsrCardId
          };
          // Lambda写法
          getPersonInfoByIdCard(dataParams)
            .then((response) => {
              //响应成功回调
              let { success, data } = response.data;
              if (success) {
                // 人员信息
                let { xbdm, xm, mzdm, phoneNum } = data.vo;
                let { xbdm: xbdmText, mzdm: mzdmText } = data.vox;
                _this.$set(_this.formData, "dsrName", xm);
                _this.$set(_this.formData, "dsrMz", mzdm);
                _this.$set(_this.formData, "dsrMzText", mzdmText);
                _this.$set(_this.formData, "dsrLxdh", phoneNum);

                // 提示
                if (!_this.formData.dsrName) {
                  _this.$message({
                    showClose: true,
                    customClass: "is-fixed",
                    message: "暂未获取到常口库信息",
                    type: "warning"
                  });
                }
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.log(error);
            })
            .finally(() => {
              _this.cardIdQueryLoading = false;
            });
        } else {
          _this.resetField();
        }
      });
    },
    handleCsrqXbByCardId() {
      let _this = this;
      let cardNumber = this.formData.cardId;
      // 通过身份证号获取出生日期
      let birthday = cardNumber.substr(6, 8);
      birthday = birthday.replace(/(.{4})(.{2})/, "$1$2");
      this.formData.csrqDate = birthday;
      // 获取婚姻状况
      // 通过身份证号获取性别
      if (parseInt(cardNumber.substr(16, 1)) % 2 == 1) {
        //男
        this.formData.xb = "1";
        this.extendData.xb = "男";
      } else {
        //女
        this.formData.xb = "2";
        this.extendData.xb = "女";
      }
    },

    resetField() {
      this.$set(this.formData, "dsrName", "");
      this.$set(this.formData, "dsrLxdh", "");
      this.$set(this.formData, "dsrRybqList", []);
      this.$set(this.formData, "dsrRybqTextList", []);
      this.$set(this.formData, "dsrRydj", "");
      this.$set(this.formData, "dsrRydjText", "");
      this.$set(this.formData, "dsrMz", "");
      this.$set(this.formData, "dsrMzText", "");
    }
  }
};
