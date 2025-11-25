<template>
  <el-dialog
    title="编辑"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit
      v-loading="submitting">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
        @submit.native.prevent
        @keyup.enter.native="submitForm">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <el-row>
            <el-col :span="16">
              <el-form-item label="表单项1" prop="input1">
                <el-input v-model="formData.input1" placeholder="请输入表单项1" maxlength="30" underline></el-input>
              </el-form-item>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="表单项2" prop="input2">
                    <el-input v-model="formData.input2" placeholder="请输入表单项2" maxlength="30" underline></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="表单项3" prop="input3">
                    <el-input v-model="formData.input3" placeholder="请输入表单项3" maxlength="30" underline></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="表单项4" prop="input4">
                <el-input v-model="formData.input4" placeholder="请输入表单项4" maxlength="30" underline></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="0">
              <el-form-item label-width="0" prop="file">
                <hd-image-upload
                  prop="file"
                  v-model="formData.file"
                  :model-src.sync="extendData.file"
                  empty-text="点击上传正面照"
                  empty-pre="温馨提示<br>（1）请保持背景使用纯蓝、纯白等单色<br>（2）面部不能出现帽子、墨镜等遮挡物"
                  width="80%"
                  height="100%">
                </hd-image-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="多图上传" prop="fileList">
            <hd-image-upload
              prop="fileList"
              v-model="formData.fileList"
              :model-src.sync="extendData.fileList"
              multiple>
            </hd-image-upload>
          </el-form-item>
          <el-form-item label="JSON数据" prop="json">
            <hd-json-editor v-model="formData.json"></hd-json-editor>
          </el-form-item>
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
  import { hdForm } from "@/utils/util-framework";
  import { edit, editBefore } from './api';
  export default {
    name: "Example2Edit",
    moduleName: "Example2List",
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
          input1: '',
          input2: '',
          input3: '',
          input4: '',
          file: null,
          fileList: [],
          json: null
        },
        // 表单扩展
        extendData: {
          file: '',
          fileList: []
        },
        // 验证
        rules: {
          file: [
            { required: true, message: '请上传图片', trigger: 'change' }
          ],
          fileList: [
            { required: true, message: '请至少上传一张图片', trigger: 'change' }
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
        this.$nextTick(() => {
          // 重置
          this.resetForm();
          // 加载表单
          this.loadForm();
        });
      },
      // 加载表单
      loadForm() {
        // 参数
        let dataParams = {
          id: this.row.vo.id
        };
        // Lambda写法
        editBefore(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            this.formData = data.vo;
            this.extendData = data.vox;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          this.$refs.formRef.clearValidate();
        });

        // 数据模拟
        let data = {
          vo: {
            input1: '内容',
            input2: '内容',
            input3: '内容',
            input4: '内容',
            file: null,
            fileList: [],
            json: {
              数组: [ 1, 2, 3 ],
              布尔值: true,
              空值: null,
              数值: 123,
              对象: { 'a': 'b', 'c': 'd' },
              字符串值: '你好HdtyAdmin'
            }
          },
          vox: {
            file: process.env.NODE_PATH + '/static/public/images/drag/img-001.jpg',
            fileList: [{
              url: process.env.NODE_PATH + '/static/public/images/drag/img-002.jpg',
              uid: this.$utilStr.uuid(32, 16).toLowerCase(),
              name: 'img-002.jpg'
            }]
          }
        };
        this.formData = data.vo;
        this.extendData = data.vox;
      },
      // 提交
      submitForm() {
        this.$refs.formRef.validate((valid, error) => {
          if (valid) {
            this.submitting = true;
            // 参数
            let dataParams = this.$utilStr.objToFormData(this.formData);
            // Lambda写法
            edit(dataParams).then(response => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                this.hdList.loadList();
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            }).finally(() => {
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
  }
</script>

<style scoped>

</style>
