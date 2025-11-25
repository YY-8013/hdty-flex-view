<template>
  <el-dialog
    title="添加"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
  >
    <hd-pane fit v-loading="handleLoading">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="0"
        @keyup.enter.native="submitForm"
      >
        <hd-component :model="extendData" ref="componentRef">
          <biz-form-card title="基础信息">
            <biz-form>
              <biz-form-row>
                <biz-form-item label="单位地址" :required="true" :span="24">
                  <el-form-item prop="dwdzQhnxxdz">
                    <biz-bzdz-new
                      v-model="formData.houseid"
                      :model-text.sync="formData.dwdzQhnxxdz"
                      ywName
                      isYw
                      @handleGlbzdz="handleGlbzdz"
                    ></biz-bzdz-new>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>
            </biz-form>
          </biz-form-card>
          <biz-form-card title="其他信息"></biz-form-card>
          <biz-form-card title="法定代表人信息"></biz-form-card>
        </hd-component>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdForm, hdList } from "@/utils/util-framework";
// import { add } from './api';

export default {
  name: "ZdmbAdd",
  provide() {
    return {
      ZdmbAdd: this
    };
  },
  components: {},
  // inject: ['hdList'],
  mixins: [hdList, hdForm],
  data() {
    return {
      // 表单
      formData: {},
      // 扩展表单
      extendData: {},
      // 验证
      rules: {},
      // 显示
      visible: false,
      // 行
      row: {}
    };
  },
  mounted() {},
  methods: {
    beforeLoadForm() {
      let _this = this;
      _this.$nextTick(() => {});
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.handleLoading = true;
          // 参数
          let dataParams = {
            ..._this.formData
          };
          // Lambda写法
          add(dataParams)
            .then((response) => {
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
                });
                _this.cancelForm();
                _this.hdList.loadList();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.log(error);
            })
            .finally(() => {
              _this.handleLoading = false;
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
      this.$refs.formRef.resetFields();
      this.$refs.componentRef.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped></style>
