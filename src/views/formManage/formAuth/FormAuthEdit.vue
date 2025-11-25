<template>
  <el-dialog title="编辑表单授权机构" :visible.sync="visible" width="800px" append-to-body>
    <hd-pane fit v-loading="loading">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="160px"
        @submit.native.prevent
      >
        <hd-component :model="extendData" ref="componentRef">
          <el-form-item label="标 准 件">
            <span>【{{ formTitle }}】【{{ row.vo.formId }}】</span>
          </el-form-item>
          <el-form-item label="警辅通是否可用" prop="jftEnable">
            <hd-dict-radio v-model="formData.jftEnable" :dict-code="$global.dictType.isOrNot"></hd-dict-radio>
          </el-form-item>
          <el-form-item label="授权机构" prop="orgId">
            <hd-organ
              v-model="formData.orgId"
              :model-text.sync="extendData.orgId"
              placeholder="请选择授权机构"
              underline
            ></hd-organ>
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
import { formAuthEdit } from './api';

export default {
  name: 'FormItemEdit',
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ['hdList', 'formAuthList'],
  mixins: [hdForm],
  data() {
    return {
      // 表单
      itemConfig: '',
      // 表单
      formData: {},
      // 表单扩展
      extendData: {},
      // 验证
      // 验证
      rules: {
        orgId: [
          { required: true, message: '请选择授权机构', trigger: 'change' }
        ],
        jftEnable: [
          { required: true, message: '请选择警辅通是否可用', trigger: 'change' }
        ]
      },
      // 显示
      visible: false,
      row: { vo: {} }
    };
  },
  computed: {
    formTitle() {
      return this.formAuthList.row.vo.formTitle;
    }
  },
  methods: {
    beforeLoadForm() {
      let _this = this;
      _this.$nextTick(() => {
        _this.formData = _this.row.vo;
        _this.extendData = _this.row.vox;
      });
    },

    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.loading = true;
          // 参数
          let dataParams = {
            id: _this.formData.id,
            orgId: _this.formData.orgId,
            jftEnable: _this.formData.jftEnable
          };
          // 使用正则表达式去除换行和多余的空格
          console.log('处理后---dataParams', dataParams);
          // Lambda写法
          formAuthEdit(dataParams)
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
                _this.formAuthList.handleQuery();
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
    },
    // 切换组件类型，动态更新配置模板
    updateTemplate(type) {
      let currentConfig = this.$global.componentType.find(
        (item) => item.value === type
      ).configType;
      let currentTemplate = this.$global.formItemConfigMap.get(currentConfig);
      this.formData.itemConfig = JSON.stringify(currentTemplate);
    }
  }
};
</script>

<style scoped>
</style>
