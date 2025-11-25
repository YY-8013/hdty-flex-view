<template>
  <el-dialog
    title="注销"
    :visible.sync="visible"
    custom-class="new-form"
    append-to-body>
    <hd-pane
      fit
      v-loading="loading">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="0"
        @keyup.enter.native="submitForm">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <!--注销信息-->
          <div class="con-area">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-document"></i>
                注销信息
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card">
                <div class="body">
                  <div class="form">
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label"><span class="required">注销原因</span></label>
                        <div class="p-div p-div3">
                          <div class="text-div">
                            <el-form-item prop="zxyy">
                              <el-input
                                type="textarea"
                                :rows="3"
                                v-model="formData.zxyy"
                                placeholder="请输入注销原因"
                                maxlength="1000">
                              </el-input>
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
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {hdList, hdForm} from "@/utils/util-framework";
  import {logoutOrgRecode} from './../api';

  export default {
    name: "NewTaskCenterDisLogout",
    provide() {
      return {
        NewTaskCenterDisLogout: this
      };
    },
    inject: ['hdList'],
    mixins: [hdList, hdForm],
    components: {},
    data() {
      return {
        // 显示
        visible: false,
        // 表单
        formData: {
          zxyy: '',
        },
        // 表单扩展
        extendData: {},
        // 验证
        rules: {
          zxyy: [
            { required: true, message: '请输入注销原因', trigger: 'blur' },
            {validator: this.$utilValidate.validateSpecialCharacters, trigger: 'blur'}
          ],
        },
        // 行
        row: {
          vo: {},
          vox: {},
        },
      };
    },
    mounted() {

    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        this.resetForm();
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid) => {
          if (valid) {
            _this.loading = true;
            // 参数
            let dataParams = {
              ..._this.formData,
              orgRecodeId: _this.row.vo.taskorgrecodeid,
              taskId: _this.row.vo.id,
            };
            // Lambda写法
            logoutOrgRecode(dataParams).then(response => {
              //响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.visible = false;
                _this.resetForm();
                _this.hdList.loadList();
              }
            }).catch(error => {
              // 响应错误回调
              console.log(error);
            }).finally(() => {
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
        if(this.$refs.formRef) this.$refs.formRef.resetFields();
        if(this.$refs.formRef) this.$refs.componentRef.resetFields();
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
