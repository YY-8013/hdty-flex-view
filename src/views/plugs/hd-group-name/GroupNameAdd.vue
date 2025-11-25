<template>
  <el-dialog
    title="添加"
    :visible.sync="visible"
    custom-class="hdty-dialog-small new-form"
    append-to-body>
    <hd-pane
      fit
      v-loading="handleLoading">
      <el-form
        :model="addData"
        :rules="rules"
        ref="formRef"
        label-width="0"
        @keyup.enter.native="submitForm">
        <!--群体名称-->
        <div class="con-area">
          <div class="area-head">
            <div class="head">
              <i class="el-icon-tickets"></i>
              群体名称
            </div>
          </div>
          <div class="area-body">
            <el-card class="con-card box-card">
              <div class="body">
                <div class="form">
                  <!--群体名称-->
                  <div class="form-row">
                    <div class="form-item-24 form-item">
                      <label class="label"><span class="required">群体名称</span></label>
                      <div class="p-div">
                        <div class="text-div">
                          <el-form-item prop="name">
                            <el-input
                              v-model="addData.name"
                              placeholder="请输入群体名称"
                              maxlength="60">
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
  import {getNewNum, add} from './api';

  export default {
    name: 'GroupNameAdd',
    provide() {
      return {
        GroupNameAdd: this
      };
    },
    inject: ['hdGroupName'],
    mixins: [hdList, hdForm],
    components: {},
    data() {
      return {
        // 表单
        addData: {
          id: '',
          name: '',
        },
        // 验证
        rules: {
          name: [
            { required: true, message: '请输入群体名称', trigger: 'change' },
          ],
        },
        // 显示
        visible: false,
      }
    },
    methods: {
      // 加载之前
      beforeLoadForm() {
        // 加载群体名称编码
        this.loadGroupNameId();
      },
      // 加载群体名称编码
      loadGroupNameId() {
        let _this = this;
        _this.handleLoading = true;
        // 参数
        let dataParams = {};
        // Lambda写法
        getNewNum(dataParams).then(response => {
          let { success, data } = response.data;
          if (success) {
            _this.addData.id = String(data.id);
          }
        }).catch(error => {
          // 响应错误回调
          console.log(error);
        }).finally(() => {
          _this.handleLoading = false;
        });
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid) => {
          if (valid) {
            _this.handleLoading = true;
            // 参数
            let dataParams = {
              ..._this.addData
            };
            // Lambda写法
            add(dataParams).then(response => {
              //响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.cancelForm();
                _this.hdGroupName.handleQuery();
              }
            }).catch(error => {
              // 响应错误回调
              console.log(error);
            }).finally(() => {
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
        this.addData.id = '';
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
