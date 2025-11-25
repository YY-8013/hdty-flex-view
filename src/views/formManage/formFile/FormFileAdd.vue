<template>
  <el-dialog title="附件上传" :visible.sync="visible"  append-to-body>
    <hd-pane fit v-loading="loading">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="110px"
        @submit.native.prevent
      >
        <hd-component :model="extendData" ref="componentRef">
          <el-form-item label="附件类型" prop="type">
            <hd-dict-select
              v-model="formData.type"
              :dict-code="$global.dictType.formFileType"
              placeholder="请选择附件类型"
              underline
            ></hd-dict-select>
          </el-form-item>
          <el-form-item label="表单附件" prop="file">
            <hd-image-upload v-model="formData.file" outputModel="base64" placeholder="请选择附件" height="300px"></hd-image-upload>
          </el-form-item>
           <el-form-item label="备  注" prop="memo">
                                <el-input v-model="formData.memo" type="textarea" :rows="3" placeholder="请输入备注"  maxlength="500"  underline></el-input>
                            </el-form-item>
              </el-form-item>
        </hd-component>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hdForm } from '@/utils/util-framework';
import { formFileUpload } from './api';

export default {
  name: 'FormFileUpload',
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ['formFileList'],
  mixins: [hdForm],
  data() {
    return {
      // 表单
      formData: {
        type: '',
        file: '',
        memo: ''
      },
      // 表单扩展
      extendData: {},
      // 验证
      rules: {
        type: [
          { required: true, message: '请选择附件类型', trigger: 'change' }
        ],
        file: [{ required: true, message: '请选择附件', trigger: 'change' }]
      },
      // 显示
      visible: false,
      row: {}
    };
  },
  methods: {
    beforeLoadForm() {
      let _this = this;
      _this.$nextTick(() => {});
    },
    // 提交
    submitForm() {
      let _this = this;
      console.log('示例', _this.formData);
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.loading = true;
          // 参数
          let dataParams = {
            formId: _this.row.vo.formId,
            ..._this.formData,
            file: _this.$utilFile.removeBase64Prefix(_this.formData.file)
          };
          // 使用正则表达式去除换行和多余的空格
          console.log('处理后---dataParams', dataParams);
          // Lambda写法
          formFileUpload(dataParams)
            .then((response) => {
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
                _this.formFileList.handleQuery();
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
      this.$refs.formRef.resetFields();
      this.$refs.componentRef.resetFields();
    }
  }
};
</script>

<style scoped>
</style>
