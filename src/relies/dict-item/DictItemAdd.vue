<template>
  <el-dialog title="添加" :visible.sync="visible" custom-class="hdty-dialog-small" append-to-body>
    <hd-pane fit v-loading="submitting">
      <el-form
        :model="addData"
        :rules="rules"
        ref="formRef"
        label-width="120px"
        @submit.native.prevent
        @keyup.enter.native="submitForm"
      >
        <el-form-item label="代码Key值" prop="key">
          <el-input v-model="addData.key" placeholder="请输入代码Key值" maxlength="30" underline></el-input>
        </el-form-item>
        <el-form-item label="代码Value值" prop="value">
          <el-input v-model="addData.value" placeholder="请输入代码Value值" maxlength="127" underline></el-input>
        </el-form-item>
        <el-form-item label="上级字典项代码">
          <el-input v-model="addData.parentId" placeholder="请输入上级字典项代码" maxlength="30" underline></el-input>
        </el-form-item>
        <el-form-item label="排  序" prop="order">
          <el-input v-model.number="addData.order" maxlength="6" underline></el-input>
        </el-form-item>
        <el-form-item label="备  注" prop="memo">
          <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="addData.memo"
            maxlength="127"
            underline
          ></el-input>
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
import { hdForm } from '@/utils/util-framework';
import { addOne, checkKey } from '@/api/dict-item';

export default {
  name: 'DictItemAdd',
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ['hdList'],
  mixins: [hdForm],
  data() {
    let validateKey = (rule, value, callback) => {
      if (value) {
        let dataParams = {
          id: '',
          key: value,
          typeId: this.addData.typeId
        };
        // Lambda写法
        checkKey(dataParams)
          .then((response) => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              if (!data.pass) {
                callback(new Error('当前key值已存在'));
              } else {
                callback();
              }
            }
          })
          .catch((error) => {
            // 响应错误回调
            console.error(error);
            callback(new Error('验证时发生错误，请重试'));
          });
      }
    };
    return {
      // 表单
      addData: {},
      // 验证
      rules: {
        key: [
          { required: true, message: '请输入代码Key值', trigger: 'blur' },
          { validator: validateKey, trigger: 'blur' }
        ],
        value: [
          { required: true, message: '请输入代码Value值', trigger: 'blur' }
        ],
        order: [
          { required: true, message: '请输入排序', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
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
          addOne(dataParams)
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
                _this.resetForm();
                _this.hdList.handleQuery();
                _this.hdList.hdList.handleQuery();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            })
            .finally(() => {
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
      this.$refs.formRef.resetFields();
    }
  }
};
</script>

<style scoped>
</style>
