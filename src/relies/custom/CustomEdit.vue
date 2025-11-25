<template>
  <el-dialog
    title="编辑"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit
      v-loading="submitting">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        @keyup.enter.native="submitForm">
        <el-form-item label="配置项" prop="key">
          <el-input v-model="formData.key" placeholder="请输入配置项：例如001" maxlength="3" underline></el-input>
        </el-form-item>
        <el-form-item label="配置项名称" prop="keyName">
          <el-input v-model="formData.keyName" placeholder="请输入配置项名称" maxlength="25" underline></el-input>
        </el-form-item>
        <el-form-item label="配置项子项" prop="keyItem">
          <el-input v-model="formData.keyItem" placeholder="请输入配置项子项" maxlength="36" underline></el-input>
        </el-form-item>
        <el-form-item label="子项名称" prop="keyItemName">
          <el-input v-model="formData.keyItemName" placeholder="请输入配置项子项名称" maxlength="25" underline></el-input>
        </el-form-item>
        <el-form-item label="配置值" prop="value">
          <el-input type="textarea" v-model="formData.value" :autosize="{ minRows: 6, maxRows: 12}" placeholder="请输入配置值" maxlength="2000"
                    underline></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="formData.memo" :autosize="{ minRows: 6, maxRows: 12}" placeholder="备注" maxlength="2000"
                    underline></el-input>
        </el-form-item>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { hdForm } from "@/utils/util-framework";
  import { edit, editBefore } from '@/api/custom';

  export default {
    name: "CustomEdit",
    provide() {
      return {
        hdEdit: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      return {
        // 表单
        formData: {
          checkbox: [],
        },
        // 验证
        rules: {
          key: [
            {required: true, message: '请输入配置项', trigger: 'change'}
          ],
          keyName: [
            {required: true, message: '请输入配置项名称', trigger: 'change'}
          ],
          keyItem: [
            {required: true, message: '请输入配置项子项类型', trigger: 'change'}
          ],
          keyItemName: [
            {required: true, message: '请输入配置项子项名称', trigger: 'change'}
          ],
          value: [
            {required: true, message: '请输入配置值', trigger: 'blur'}
          ]
        },
        // 行
        row: {},
        // 显示
        visible: false
      };
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        // 重置
        this.resetForm();
        // 加载表单
        this.loadForm();
      },
      // 加载表单
      loadForm() {
        let _this = this;
        // 参数
        let dataParams = {
          id: _this.row.vo.id
        };
        // Lambda写法
        editBefore(dataParams).then(response => {
          // 响应成功回调
          let {success, data} = response.data;
          if (success) {
            _this.formData = data.vo;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.$refs.formRef.clearValidate();
        });
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid) => {
          if (valid) {
            _this.submitting = true;
            // 参数
            let dataParams = {
              ..._this.formData
            };
            // Lambda写法
            edit(dataParams).then(response => {
              // 响应成功回调
              let {success, msg} = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.hdList.loadList();
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            }).finally(() => {
              _this.submitting = false;
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
        this.$nextTick(() => {
          this.$refs.formRef.resetFields();
        });
      }
    }
  }
</script>

<style scoped>

</style>
