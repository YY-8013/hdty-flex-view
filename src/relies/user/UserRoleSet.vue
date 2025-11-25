<template>
  <el-dialog
    title="其他设置"
    :visible.sync="visible"
    custom-class="hdty-dialog-basic"
    append-to-body>
    <hd-pane
      fit>
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        block
        @submit.native.prevent
        @keyup.enter.native="submitForm">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <div v-if="!disabled">
            <el-form-item label="查询范围" prop="cxfwOrgId">
              <hd-organ prop="cxfwOrgId" v-model="formData.cxfwOrgId" :model-text.sync="extendData.cxfwOrgId" placeholder="请选择查询范围" underline></hd-organ>
            </el-form-item>
            <el-form-item label="有效期限" prop="endDate">
              <hd-date-picker type="date" v-model="formData.endDate" placeholder="请选择有效期限" underline></hd-date-picker>
            </el-form-item>
          </div>
          <div v-else>
            <el-form-item label="查询范围" prop="cxfwOrgId">
              {{ extendData.cxfwOrgId ? extendData.cxfwOrgId : '——' }}
            </el-form-item>
            <el-form-item label="有效期限" prop="endDate">
              {{ formData.endDate ? $utilDate.dateFtt(formData.endDate, 'yyyy-MM-dd') : '——' }}
            </el-form-item>
          </div>
        </hd-component>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button v-if="!disabled" @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: "RoleOtherSet",
    provide() {
      return {
        hdSet: this
      };
    },
    data() {
      return {
        // 表单
        formData: {
          cxfwOrgId: '',
          endDate: ''
        },
        // 表单扩展
        extendData: {
          cxfwOrgId: ''
        },
        // 验证
        rules: {},
        // 行
        row: {},
        // 禁用
        disabled: false,
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
        let _this = this;
        _this.formData.cxfwOrgId = _this.row.cxfwOrgId;
        _this.formData.endDate = _this.row.endDate;
        _this.extendData.cxfwOrgId = _this.row.cxfwOrgName;
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid) => {
          if (valid) {
            _this.row.cxfwOrgId = _this.formData.cxfwOrgId;
            _this.row.endDate = _this.formData.endDate;
            _this.row.cxfwOrgName = _this.extendData.cxfwOrgId;
            _this.$emit('currentChanged', _this.row);
            _this.cancelForm();
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
