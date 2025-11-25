<template>
  <el-dialog
    title="添加"
    :visible.sync="visible"
    custom-class="hdty-dialog-small"
    append-to-body>
    <hd-pane
      fit
      v-loading="submitting">
      <el-form
        :model="addData"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        @submit.native.prevent
        @keyup.enter.native="submitForm">
        <el-row>
          <el-col :span="16">
            <el-form-item label="字典编码" prop="key">
              <el-input ref="inputRef" v-model="addData.key" placeholder="请输入字典编码" maxlength="5" underline></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label-width="12px">
              <el-button
                type="info"
                icon="el-icon-search"
                @click="handleGetNewCode">获取字典编码</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="字典名称" prop="value">
          <el-input v-model="addData.value" placeholder="请输入字典名称" maxlength="15" underline></el-input>
        </el-form-item>
        <el-form-item label="备  注" prop="memo">
          <el-input type="textarea" :rows="3" v-model="addData.memo" placeholder="请输入备注" maxlength="127" underline></el-input>
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
  import { addOne, getNewNum, validateKey } from '@/api/dict';
  export default {
    name: "DictAdd",
    provide() {
      return {
        hdAdd: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      let validateCode = (rule, value, callback) => {
        if (!this.$utilStr.isEmpty(value)) {
          // Lambda写法
          let dataParams = {
            key: value
          };
          validateKey(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              if (!data) {
                callback(new Error('字典编码已存在'));
              } else {
                callback();
              }
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
            callback(new Error('验证时发生错误，请重试'));
          });
        } else {
          callback();
        }
      };
      return {
        // 表单
        addData: {
          key: '',
          value: '',
          memo: '',
          status: true
        },
        // 验证
        rules: {
          key: [
            { required: true, message: '请输入字典编码', trigger: 'blur' },
            { validator: this.$utilValidate.validateLetterAndNumber, trigger: 'blur' },
            { validator: validateCode, trigger: 'blur' }
          ],
          value: [
            { required: true, message:'请输入字典名称', trigger:'blur' }
          ]
        },
        // 显示
        visible: false
      };
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        // 这里写加载表单之前的操作
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid) => {
          if (valid) {
            _this.submitting = true;
            let dataParams = {
              ..._this.addData
            };
            // Lambda写法
            addOne(dataParams).then(response => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.resetForm();
                _this.hdList.handleQuery();
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
      // 获取编码
      handleGetNewCode() {
        let _this = this;
        _this.$refs.inputRef.focus();
        getNewNum().then(response => {
           let { data } = response.data;
          _this.addData.key = data.key;
        }).catch(error => {
          // 响应错误回调
           console.error(error);
        });
      },
      // 取消
      cancelForm() {
        this.resetForm();
        this.visible = false;
      },
      // 重置
      resetForm() {
        this.$refs.formRef.resetFields();
      }
    }
  }
</script>

<style scoped>

</style>
