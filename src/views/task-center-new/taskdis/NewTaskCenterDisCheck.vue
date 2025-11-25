<template>
  <el-dialog
    :title="type === 1 ?'核查':'标记'"
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
                {{type === 1 ? '核查信息':'标记信息'}}
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card">
                <div class="body">
                  <div class="form">
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label"><span>备注</span></label>
                        <div class="p-div p-div3">
                          <div class="text-div">
                            <el-form-item prop="notes">
                              <el-input
                                type="textarea"
                                :rows="3"
                                v-model="formData.notes"
                                placeholder="请输入备注"
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
  import {checkEdit, checkAdd} from './../api';

  export default {
    name: "NewTaskCenterDisCheck",
    provide() {
      return {
        NewTaskCenterDisLogout: this
      };
    },
    inject: ['NewTaskCenterDelDetail'],
    mixins: [hdList, hdForm],
    components: {},
    data() {
      return {
        // 显示
        visible: false,
        // 操作类型 1.核查 2. 标记
        type: null,
        // 表单
        formData: {
          notes: '',
          // 状态
          checkState: '',
        },
        // 表单扩展
        extendData: {},
        // 验证
        rules: {

        },
        // 行
        row: {
          vo: {},
          vox: {},
        },
        // 是否新增
        isAdd: false,
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
            if(_this.type === 1 && _this.isAdd){
              // 参数
              let dataParams = {
                formId: _this.row.vo.formId,
                orgRecodeId: _this.row.vo.taskorgrecodeid,
                checkState: _this.formData.checkState,
                checkMemo: _this.formData.notes
              };
              // Lambda写法
              checkAdd(dataParams).then(response => {
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
                  _this.NewTaskCenterDelDetail.handleCheckInfo();
                }
              }).catch(error => {
                // 响应错误回调
                console.log(error);
              }).finally(() => {
                _this.loading = false;
              });
            }
            else{
              // 参数
              let dataParams = {
                id: _this.row.vo.id,
                checkBjState: _this.type === 2 ? _this.formData.checkState: '',
                checkBjDesc: _this.type === 2 ?_this.formData.notes:'',
                checkState: _this.type === 1 ?_this.formData.checkState:_this.row.vo.checkState,
                checkMemo: _this.type === 1 ?_this.formData.notes:_this.row.vo.checkMemo,
              };
              // Lambda写法
              checkEdit(dataParams).then(response => {
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
                  _this.NewTaskCenterDelDetail.handleCheckInfo();
                }
              }).catch(error => {
                // 响应错误回调
                console.log(error);
              }).finally(() => {
                _this.loading = false;
              });
            }
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
