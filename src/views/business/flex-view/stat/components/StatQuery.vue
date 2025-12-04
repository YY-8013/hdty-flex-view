<template>
  <div class="hdty-header stat-query">
    <el-form
      ref="queryForm"
      :model="queryData"
      :inline="true"
      label-width="auto"
    >
      <hd-component :model="extendData" ref="componentRef">
        <hd-query>
          <!-- 固定显示的查询条件 -->
          <hd-query-fixed>
            <el-form-item label="管辖机构" prop="orgId">
              <hd-organ
                style="width: 230px"
                v-model="queryData.orgId"
                :model-text.sync="extendData.orgId"
                :clearable="false"
                :showLevel="5"
                placeholder="请选择管辖机构"
                @currentChanged="updateOrgList"
              ></hd-organ>
            </el-form-item>
            <el-form-item label="机构级别" prop="orgLevel">
              <el-select
                v-model="queryData.orgLevel"
                placeholder="请选择机构级别"
                style="width: 100px"
              >
                <el-option
                  v-for="item in showOrgLevelList"
                  :key="item.key"
                  :label="item.value"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="抽查日期" prop="checkDate">
              <!-- 日期时间范围选择器 -->
              <hd-date-picker type="daterange" v-model="queryData.checkDate" />
            </el-form-item>
          </hd-query-fixed>

          <!-- 可展开的查询条件 -->
          <hd-query-expand v-if="false">
            <el-row>
              <el-form-item
                v-for="field in expandFields"
                :key="field.prop"
                :label="field.label"
                :prop="field.prop"
              >
                <!-- TODO: 根据 field.type 动态渲染组件 -->
                <el-input
                  v-if="field.type === 'input'"
                  v-model="queryData[field.prop]"
                  :placeholder="
                    field && field.config && field.config.placeholder
                      ? field.config.placeholder
                      : `请输入${field.label}`
                  "
                  clearable
                />
              </el-form-item>
            </el-row>
          </hd-query-expand>
        </hd-query>
      </hd-component>
    </el-form>

    <!-- 按钮区域 -->
    <hd-button-container>
      <hd-button
        v-if="showReturn()"
        type="warning"
        icon="el-icon-back"
        @click="handleReturnLast"
        >返回上级机构</hd-button
      >
      <hd-button
        name="query"
        type="info"
        icon="el-icon-search"
        @click="handleQuery"
      >
        查询
      </hd-button>
      <hd-button icon="el-icon-delete" @click="handleClear"> 清空 </hd-button>
      <hd-button
        name="export"
        type="warning"
        icon="el-icon-upload2"
        @click="handleExport"
      >
        导出
      </hd-button>
    </hd-button-container>
  </div>
</template>

<script>
export default {
  name: "StatQuery",
  props: {
    queryFields: {
      type: Array,
      default: () => []
    },
    currentTheme: {
      type: String,
      default: "police"
    },
    inputParamOrgId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      queryData: {
        orgId: this.$utilPublic.getUserInfo().orgId,
        orgLevel: (
          Number(this.$utilPublic.getUserInfo().orgLevel) + 1
        ).toString(),
        checkDate: []
      },
      extendData: {
        orgId: this.$utilPublic.getUserInfo().orgName
      },
      showOrgFilter: true,

      orgLevelList: [
        {
          key: "3",
          value: "市局"
        },
        {
          key: "4",
          value: "分局"
        },
        {
          key: "5",
          value: "派出所"
        }
      ],
      showOrgLevelList: []
    };
  },
  computed: {
    // 固定显示的查询字段(前3个)
    fixedFields() {
      return this.queryFields.slice(0, 3);
    },

    // 可展开的查询字段(3个之后的)
    expandFields() {
      return this.queryFields.slice(3);
    }
  },
  created() {
    this.updateOrgList();
  },
  mounted() {
    this.handleQuery();
  },
  watch: {
    // 监听外部传入的机构ID变化
    inputParamOrgId(newVal) {
      if (newVal) {
        this.queryData.orgId = newVal;
      }
    }
  },
  methods: {
    // 查询
    handleQuery() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          // 返回完整的 queryData，包括抽查日期
          const queryData = {
            ...this.queryData
          };
          console.log("StatQuery - 查询参数:", queryData);
          this.$emit("query", queryData);
        }
      });
    },

    // 清空
    handleClear() {
      this.$refs.queryForm.resetFields();
      this.$refs.componentRef.resetFields();
      // 重置查询数据
      this.queryData = {
        orgId: this.$utilPublic.getUserInfo().orgId,
        orgLevel: (
          Number(this.$utilPublic.getUserInfo().orgLevel) + 1
        ).toString(),
        checkDate: []
      };
      this.updateOrgList();

      this.extendData = {
        orgId: this.$utilPublic.getUserInfo().orgName
      };
      this.$emit("query", this.queryData);
    },

    // 导出
    handleExport() {
      this.$emit("export");
    },
    updateOrgList(isChange) {
      let currentOrgId =
        this.queryData.orgId || this.$utilPublic.getUserInfo().orgId;
      let currentOrgLevel = this.$utilAll.getOrgIdLevel(currentOrgId);

      this.showOrgLevelList = this.orgLevelList.filter(
        (item) => Number(item.key) > Number(currentOrgLevel)
      );

      if (
        isChange ||
        this.queryData.orgLevel < (Number(currentOrgLevel) + 1).toString()
      ) {
        this.queryData.orgLevel = (Number(currentOrgLevel) + 1).toString();
      }
    },
    // 点击机构（机构钻取）
    handleClickOrg(index, row) {
      this.queryData.orgId = row.orgId; // 设置机构编码
      this.extendData.orgId = row.orgName; // 设置机构名称
      this.updateOrgList(true);
      this.handleQuery(); // 触发查询
    },
    // 显示“返回上级机构”按钮
    showReturn() {
      let res = false;
      // 当前登录用户最简机构
      let userSimpleOrgId = this.$utilAll.getSimpleOrgId(
        this.$utilPublic.getUserInfo().orgId.substring(0, 8) + "0000"
      );
      // 当前数据查询时的最简机构
      let inputParamSimpleOrgId = this.$utilAll.getSimpleOrgId(
        this.inputParamOrgId
      );
      // 判断是否存在上下级
      if (inputParamSimpleOrgId.indexOf(userSimpleOrgId) > -1) {
        // 不是第一级
        if (userSimpleOrgId !== inputParamSimpleOrgId) {
          res = true;
        }
      }
      // 如果是责任区的用户登录，则只能看当前责任区一级，不能钻取也不能返回
      if (this.$utilPublic.getUserInfo().orgId.substring(8, 12) !== "0000") {
        res = false;
      }
      return res;
    },
    // 返回上级机构
    handleReturnLast() {
      // 使用外部传入的 inputParamOrgId（当前实际查询的机构ID）
      const currentOrgId = this.inputParamOrgId || this.queryData.orgId;
      this.queryData.orgId = this.$utilAll.getParentOrgId(currentOrgId);
      this.updateOrgList(true);
      this.handleQuery(); // 触发查询
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/stat-query.scss";
</style>
