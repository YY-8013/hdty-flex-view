<template>
  <el-dialog
    title="注销表单"
    :visible.sync="visible"
    custom-class="hdty-dialog new-form"
    append-to-body
  >
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <hd-component :model="extendData" ref="componentRef">
          <div class="con-area">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-document"></i>
                注销表单
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card">
                <div slot="header" class="clearfix">
                  <div class="base">
                    <i class="el-icon-user-solid"></i>
                    表单对象
                  </div>
                </div>
                <div class="body">
                  <div class="form">
                    <!--移交类型-->
                    <div class="form-row form-row-radio-button">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span>表单名称</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">{{ row.vo.formTitle }}</div>
                        </div>
                      </div>
                    </div>
                    <!--任务要求-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">注销原因</span>
                        </label>
                        <div class="p-div p-div3">
                          <div class="text-div">
                            <el-form-item prop="zxyy">
                              <el-input
                                type="textarea"
                                :rows="3"
                                v-model="formData.zxyy"
                                placeholder="请输入注销原因"
                                maxlength="2000"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </hd-component>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';
import { formLogout } from './api';

export default {
  name: 'NewTaskCenterDelEdit',
  provide() {
    return {};
  },
  mixins: [hdList, hdForm],
  inject: ['hdList'],
  data() {
    return {
      // 显示
      visible: false,
      // 表单加载提示
      loadingForForm: false,

      // 表单
      formData: {
        zxyy: ''
      },
      // 表单扩展
      extendData: {
        userid: ''
      },
      // 验证
      rules: {
        zxyy: [{ required: true, message: '请输入注销原因', trigger: 'blur' }]
      },

      // 行
      row: {
        vo: {},
        vox: {}
      }
    };
  },
  mounted() {},
  updated() {},
  methods: {
    // 加载之前
    beforeLoadForm() {
      this.$nextTick(() => {
        // 重置表单
        this.resetForm();
      });
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          console.log('formData', _this.formData);
          _this.loading = true;
          // 参数
          let dataParams = {
            formId: _this.row.vo.formId,
            zxyy: _this.formData.zxyy
          };
          // Lambda写法
          formLogout(dataParams)
            .then((response) => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.cancelForm();
                _this.hdList.handleQuery();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
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
      this.$refs.formRef.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item {
  .label {
    width: 150px !important;
  }
}

.con-display-body {
  color: #878d99;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    margin-left: 6px;
  }
}

.no-form-item {
  color: #878d99;
  text-align: center;
  font-size: 16px;
  height: 60px;
  line-height: 60px;
}
</style>
