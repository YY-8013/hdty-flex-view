<template>
  <el-dialog title="添加" :visible.sync="visible" append-to-body>
    <hd-pane fit v-loading="submitting">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent
        @keyup.enter.native="submitForm"
      >
        <hd-component :model="extendData" ref="componentRef">
          <div class="hdty-card">
            <div class="hdty-card-header">文件上传、多行合并</div>
            <div class="hdty-card-body">
              <el-row>
                <el-col :span="16">
                  <el-form-item label="表单项目1" prop="input1">
                    <el-input
                      v-model="formData.input1"
                      placeholder="请输入表单项1"
                      maxlength="30"
                      underline
                    ></el-input>
                  </el-form-item>
                  <el-row>
                    <el-col :span="12">
                      <el-form-item label="表单项目2" prop="input2">
                        <el-input
                          v-model="formData.input2"
                          placeholder="请输入表单项2"
                          maxlength="30"
                          underline
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="表单项目3" prop="input3">
                        <el-input
                          v-model="formData.input3"
                          placeholder="请输入表单项3"
                          maxlength="30"
                          underline
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="表单项目4" prop="input4">
                    <el-input
                      v-model="formData.input4"
                      placeholder="请输入表单项4"
                      maxlength="30"
                      underline
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label-width="0" prop="file1">
                    <hd-image-upload
                      v-model="formData.file1"
                      empty-text="点击上传正面照"
                      empty-pre="温馨提示<br>（1）请保持背景使用纯蓝、纯白等单色<br>（2）面部不能出现帽子、墨镜等遮挡物"
                      width="80%"
                      height="100%"
                    ></hd-image-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="拖拽上传" prop="file2">
                    <hd-image-upload v-model="formData.file2" drag></hd-image-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="图片裁剪" prop="file3">
                    <hd-image-upload v-model="formData.file3" cutter></hd-image-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="多图上传" prop="fileList">
                <hd-image-upload v-model="formData.fileList" multiple></hd-image-upload>
              </el-form-item>
              <el-form-item label="文件上传" prop="file4">
                <hd-input-upload v-model="formData.file4"></hd-input-upload>
              </el-form-item>
              <el-form-item label="附件上传" prop="file5">
                <hd-file-upload v-model="formData.file5"></hd-file-upload>
              </el-form-item>
              <el-form-item label="JSON数据" prop="json">
                <hd-json-editor v-model="formData.json"></hd-json-editor>
              </el-form-item>
            </div>
          </div>
        </hd-component>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hdForm } from '@/utils/util-framework';
import { add, addBefore } from './api';
export default {
  name: 'Example2Add',
  moduleName: 'Example2List',
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ['hdList'],
  mixins: [hdForm],
  data() {
    return {
      // 表单
      formData: {
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        file1: null,
        file2: null,
        file3: null,
        file4: null,
        file5: [],
        fileList: [],
        json: null
      },
      // 表单扩展
      extendData: {},
      // 验证
      rules: {
        file1: [{ required: true, message: '请上传图片', trigger: 'change' }],
        file4: [{ required: true, message: '请上传文件', trigger: 'change' }],
        fileList: [
          { required: true, message: '请至少上传一张图片', trigger: 'change' }
        ]
      },
      // 显示
      visible: false
    };
  },
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      // 加载表单
      this.loadForm();
    },
    // 加载表单
    loadForm() {
      // 参数
      let dataParams = {};
      // Lambda写法
      addBefore(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            this.formData = data.vo;
            this.extendData = data.vox;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        });
    },
    // 提交
    submitForm() {
      this.$refs.formRef.validate((valid, error) => {
        if (valid) {
          this.submitting = true;
          // 参数
          let dataParams = this.$utilStr.objToFormData(this.formData);
          // Lambda写法
          add(dataParams)
            .then((response) => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                this.resetForm();
                this.hdList.handleQuery();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            })
            .finally(() => {
              this.submitting = false;
            });
        } else {
          this.scrollIntoFormErrorView(error);
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
