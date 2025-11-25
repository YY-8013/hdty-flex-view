<template>
  <span>
    <!-- 
      :disabled="item.vo.taskState === '4'"
      (!item.vo.taskState === '4') &&
    -->
    <hd-button
      v-if="item.vo.zxbs == '0' && item.vo.taskState != '4' && showYj &&
        nYjFormIdList.findIndex((e) => e === item.vo.formId) < 0
      "
      :disabled="item.vo.taskState === '4'"
      name="yj"
      size="mini"
      type="warning"
      @click="handleTransfer()"
    >
      移交
    </hd-button>
  </span>
</template>

<script>
export default {
  name: "YjButton",
  data() {
    return {
      // 是否显示移交按钮
      showYj: true,
      // 当前移交限制类型  1 随意移交；  2 同一父级下移交
      currentOrgYjType: "1",
      // 最大移交次数
      maxYjNum: 6,
      // 不允许移交的任务表单
      nYjFormIdList: [],
    };
  },
  props: {
    // 列表项
    item: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getYj();
      // 获取最大移交次数
      let maxYjNum = this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "yjcs");
      this.maxYjNum = maxYjNum ? maxYjNum.value.split(",") : [];
    });
  },
  methods: {
    handleQuery() {
      this.$emit("update");
    },
    // 移交
    handleTransfer() {
      const row = this.item;
      if (!this.handleJyyjcs(row)) {
        this.$message({
          showClose: true,
          customClass: "is-fixed",
          type: "warning",
          message: "任务移交已达最大次数，请联系市局协调处理！",
        });
        return;
      }
      this.$emit('transfer', row, this.currentOrgYjType)
      // this.$refs.transferRef.visible = true;
      // this.$refs.transferRef.taskList = [row];
      // this.$refs.transferRef.taskIds = [row.vo.taskorgrecodeid];
      // this.$refs.transferRef.yjType = this.currentOrgYjType;
      // this.$refs.transferRef.beforeLoadForm();
    },
    // 校验移交次数
    handleJyyjcs(row) {
      // 市局用户不做限制
      if (this.$utilPublic.getUserOrgLevel() === "3") {
        return true;
      }
      if (row.vo.recodeLabels) {
        let yjNum = row.vo.recodeLabels.find((e) => e.type === "1");
        if (yjNum && yjNum.num >= this.maxYjNum) {
          return false;
        }
        return true;
      }
      return true;
    },
    getYj() {
      // 获取配置文件，动态判断是否显示移交按钮
      // 获取已开通移交的盟市
      let yjCityConfig = this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "yjCityList");
      let yjCityConfigValue = yjCityConfig ? yjCityConfig.value : "";
      let cityList = yjCityConfigValue.split(",");
      // 获取当前用户机构
      let userOrgId = this.$utilPublic.getUserInfo().orgId;
      // 判断当前机构是否在已开通移交的盟市列表中
      let isExist = cityList.some((city) => userOrgId.startsWith(city));
      // 获取已排除移交的盟市
      let yjExcludeCityConfig = this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "yjCityListExclude");
      let yjExcludeCityConfigValue = yjExcludeCityConfig
        ? yjExcludeCityConfig.value
        : "";
      let excludeCityList = yjExcludeCityConfigValue.split(",");
      // 判断当前机构是否在已排除移交的盟市列表中（若两列表均满足，那已排除优先级大于已开通）
      let isExclude = excludeCityList.some((city) =>
        userOrgId.startsWith(city)
      );
      
      // 获取移交按钮的权限
      let yjAuthority = this.$utilPublic.getUserAuthority(
        "yj",
        "NewTaskCenterDisList"
      );

      // 获取不允许移交的任务表单配置
      let nYjFormIdConfig = this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "nYjFormId");
      let nYjFormIdConfigValue = nYjFormIdConfig ? nYjFormIdConfig.value : "";
      this.nYjFormIdList = nYjFormIdConfigValue.split(",");
      // console.log(yjAuthority , isExist , !isExclude, '------' )
      this.showYj = yjAuthority && isExist && !isExclude; 
      // 经上判断，如果当前用户机构允许移交，那么动态根据配置获取移交限制类型
      if (this.showYj) {
        // 获取各城市在移交功能中的限制条件
        this.getOrganYjConfig();
      }
    },
    // 获取各城市在移交功能中的限制条件
    getOrganYjConfig() {
      let _this = this;
      let cityConfigList = _this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "yjCityConfig");
      let configList = (cityConfigList || { value: "" }).value
        .split(",")
        .map((configItem) => {
          return {
            orgId: configItem.split(":")[0],
            type: configItem.split(":")[1],
          };
        });
      // 获取当前用户机构
      let currentUserOrg = _this.$utilPublic.getUserInfo().orgId;
      let matchConfigList = configList.filter((configItem) =>
        currentUserOrg.startsWith(configItem.orgId)
      );
      if (matchConfigList.length > 0) {
        // 如果符合配置的有多个，获取级别最小的配置
        let currentOrgConfig = matchConfigList.reduce(
          (pre, cur) => {
            if (cur.orgId.length > pre.orgId.length) {
              pre = cur;
            }
            return pre;
          },
          {
            type: "1",
            orgId: "1",
          }
        );
        _this.currentOrgYjType = currentOrgConfig.type;
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
