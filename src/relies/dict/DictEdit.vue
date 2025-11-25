<template>
  <el-dialog
    title="编辑"
    :visible.sync="visible"
    custom-class="hdty-dialog-small"
    append-to-body>
    <hd-pane
      fit
      v-loading="submitting">
      <el-form
        :model="editData"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        @submit.native.prevent
        @keyup.enter.native="submitForm">
        <el-row>
          <el-form-item label="字典编码" prop="key">
            <el-input v-model="editData.key" placeholder="请输入字典编码" maxlength="5" disabled underline></el-input>
          </el-form-item>
          <el-form-item label="字典名称" prop="value">
            <el-input v-model="editData.value" placeholder="请输入字典名称" maxlength="50" underline></el-input>
          </el-form-item>
          <el-form-item label="备  注" prop="memo">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editData.memo" placeholder="请输入备注" maxlength="127" underline></el-input>
          </el-form-item>
        </el-row>
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
  import { getEditDetail, editOne } from '@/api/dict';
  export default {
    name: "DictEdit",
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
        editData: {
          key: '',
          value: '',
          memo: '',
          status: true
        },
        // 验证
        rules: {
          key: [
            { required: true, message: '请输入字典编码', trigger: 'blur' }
          ],
          value: [
            { required: true, message:'请输入字典名称', trigger:'blur' }
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
          id : _this.row.key
        };
        // Lambda写法
        getEditDetail(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.editData = data;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.$refs.formRef.clearValidate();
        });
      },
      // 编辑后提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid) => {
          if (valid) {
            _this.submitting = true;
            let dataParams = {
              ..._this.editData
            };
            // Lambda写法
            editOne(dataParams).then(response => {
              // 响应成功回调
              let { success, msg } = response.data;
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
        this.resetForm();
        this.visible = false;
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
