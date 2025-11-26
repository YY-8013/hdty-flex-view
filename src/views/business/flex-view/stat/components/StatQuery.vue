<template>
  <div class="stat-query">
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
            <el-form-item
              v-for="field in fixedFields"
              :key="field.prop"
              :label="field.label"
              :prop="field.prop"
            >
              <!-- TODO: 根据 field.type 动态渲染组件 -->
              <el-input
                v-if="field.type === 'input'"
                v-model="queryData[field.prop]"
                :placeholder="
                  field.config?.placeholder || `请输入${field.label}`
                "
                clearable
              />
            </el-form-item>

            <!-- 高级过滤项，slot="after" -->
            <el-form-item prop="orgId" slot="after" v-if="showOrgFilter">
              <hd-organ
                v-model="queryData.orgId"
                placeholder="高级查询:请选择机构"
              />
            </el-form-item>
          </hd-query-fixed>

          <!-- 可展开的查询条件 -->
          <hd-query-expand>
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
                    field.config?.placeholder || `请输入${field.label}`
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
    }
  },
  data() {
    return {
      queryData: {},
      extendData: {},
      showOrgFilter: true
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
  methods: {
    // 查询
    handleQuery() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          this.$emit("query", {
            ...this.queryData,
            ...this.extendData
          });
        }
      });
    },

    // 清空
    handleClear() {
      this.$refs.queryForm.resetFields();
      this.$refs.componentRef.resetFields();
      this.$emit("reset");
    },

    // 导出
    handleExport() {
      // TODO: 实现导出逻辑
      this.$message.info("导出功能待实现");
    }
  }
};
</script>

<style lang="scss" scoped>
// 查询组件样式继承自 hd-query，无需额外样式
</style>
