/**
 * 验收功能相关使用
 */

export const hdCheckAccept = {
  computed: {
    // 是验收地市 则显示
    isCheckAccept() {
      console.log(
        "isCheckAccept",
        appEnv.checkCity,
        this.$utilPublic.getUserOrgId().substr(0, 4)
      );
      return appEnv.checkCity.includes(
        this.$utilPublic.getUserOrgId().substr(0, 4)
      );
    }
  }
};
