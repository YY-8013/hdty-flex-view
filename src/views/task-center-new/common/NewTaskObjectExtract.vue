<template>
  <el-dialog
    title="数据抽取"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body
  >
    <hd-pane fit v-loading="loading">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="0"
        @keyup.enter.native="submitForm"
      >
        <hd-component :model="extendData" ref="componentRef">
          <div class="con-area">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-document"></i>
                抽取条件
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card">
                <div class="body">
                  <div
                    style="
                      margin-bottom: 16px;
                      font-size: 14px;
                      padding: 0 3px;
                      color: #ff7000;
                    "
                  >
                    <i
                      class="el-icon-warning-outline"
                      style="font-size: 15px"
                    ></i>
                    注意：必须选择抽取条件！
                  </div>
                  <biz-form>
                    <biz-form-row v-for="item in customParams" :key="item.prop">
                      <biz-form-item :label="item.label" :span="24">
                        <el-form-item :prop="item.prop">
                          <!-- 输入框 -->
                          <el-input
                            v-if="item.type === 'input'"
                            v-model="formData[item.prop]"
                            :placeholder="item.placeholder"
                            :maxlength="item.maxlength"
                          ></el-input>
                          <hd-dict-select
                            v-if="item.type === 'select'"
                            v-model="formData[item.prop]"
                            :model-text.sync="formData[item.prop + 'Text']"
                            :placeholder="item.placeholder"
                            :parentId="item.parentId"
                            :dictCode="item.typeId"
                            :multiple="item.multiple"
                          ></hd-dict-select>
                          <hd-organ
                            v-if="item.type === 'organ'"
                            v-model="formData[item.prop]"
                            :model-text.sync="extendData[item.prop]"
                            placeholder="请选择管辖机构"
                          ></hd-organ>
                        </el-form-item>
                      </biz-form-item>
                    </biz-form-row>
                  </biz-form>
                </div>
              </el-card>
            </div>
          </div>
        </hd-component>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">抽取并导入</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdForm, hdList } from "@/utils/util-framework";
import { getExtractPage } from "./../api";

export default {
  name: "NewTaskObjectExtract",
  provide() {
    return {
      NewTaskObjectExtract: this
    };
  },
  mixins: [hdList, hdForm],
  components: {},
  data() {
    return {
      // 显示
      visible: false,
      // 表单
      formData: {},
      factorData: {},
      // 表单扩展
      extendData: {},
      // 验证
      rules: {},
      // 行
      row: {
        formId: "", // 表单主键
        etlType: "", // 抽取类型（1：关注人员，2：实有人口，3：实有单位）
        etlYwlb: ""
      },
      defaultParams: [],
      customParams: []
    };
  },
  mounted() {},
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      let _this = this;
      _this.resetForm();
      _this.$nextTick(() => {
        _this.customParams.forEach((item) => {
          _this.$set(
            _this.formData,
            item.prop,
            item.valueType === "string" ? "" : []
          );
        });
      });
    },
    // 验证是否至少选了一项查询项
    hasAtLeastOneQueryItem() {
      // 遍历所有配置的查询项
      return this.customParams.some((item) => {
        const value = this.formData[item.prop];

        // 根据值类型进行判断
        if (item.valueType === "string") {
          // 字符串类型：检查是否非空（去除空格后）
          return typeof value === "string" && value.trim() !== "";
        } else if (Array.isArray(value)) {
          // 数组类型：检查是否有至少一个元素
          return value.length > 0;
        }

        // 其他类型或未定义的情况视为未选择
        return false;
      });
    },
    // 提交
    submitForm() {
      let _this = this;
      // 验证是否至少选了一项查询项
      let hasQuery = this.hasAtLeastOneQueryItem();
      if (!hasQuery) {
        _this.$message({
          showClose: true,
          customClass: "is-fixed",
          message: "请至少选择一项查询条件",
          type: "warning"
        });
        return;
      }
      // 处理自定义查询参数
      let customParams = _this.customParams.map((item) => {
        item.value = _this.formData[item.prop];
        return item;
      });
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.loading = true;
          // 参数
          let dataParams = {
            formId: _this.row.formId,
            defaultParams: _this.defaultParams,
            customParams: customParams
          };
          // Lambda写法
          getExtractPage(dataParams)
            .then((response) => {
              //响应成功回调
              let { success, data } = response.data;
              if (success) {
                if (data.length > 0) {
                  _this.$emit("currentChange", data);
                  _this.cancelForm();
                } else {
                  _this.errorMsg("暂无满足条件的数据！");
                }
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.log(error);
            })
            .finally(() => {
              _this.loading = false;
            });
        }
      });
    },

    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      if (this.$refs.formRef) {
        this.$refs.formRef.resetFields();
      }
      if (this.$refs.componentRe) {
        this.$refs.componentRef.resetFields();
      }
    },

    // 错误提示
    errorMsg(msg) {
      this.$message({
        showClose: true,
        customClass: "is-fixed",
        message: msg,
        type: "warning"
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
