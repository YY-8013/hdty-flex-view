<template>
  <el-drawer
    title="自适应抽屉"
    :visible.sync="visible"
    direction="rtl"
    custom-class="hdty-drawer-fit"
    append-to-body>
    <hd-pane
      fit
      v-loading="submitting">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="auto"
        @submit.native.prevent
        @keyup.enter.native="submitForm">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <el-form-item label="输 入 框" prop="input">
            <el-input v-model="formData.input" placeholder="请输入表单项1" maxlength="30" underline></el-input>
          </el-form-item>
          <el-form-item label="单 选 框" prop="radio">
            <hd-dict-radio v-model="formData.radio" :dict-code="$global.dictType.menuType" underline></hd-dict-radio>
          </el-form-item>
          <el-form-item label="下拉选择" prop="select">
            <hd-dict-select v-model="formData.select" :dict-code="$global.dictType.menuType" filterable placeholder="请选择表单项7" underline></hd-dict-select>
          </el-form-item>
          <el-form-item label="计 数 器" prop="number">
            <hd-input-number v-model="formData.number" :min="1" :max="100" controls-position="right" underline></hd-input-number>
          </el-form-item>
        </hd-component>
      </el-form>
      <el-table
        v-loading="loading"
        ref="tableRef"
        :data="tableData"
        border
        editable
        height="200px">
        <el-table-column
          prop="item1"
          label="列表项1"
          header-align="center"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="item2"
          label="列表项2"
          header-align="center"
          sortable
          min-width="100">
          <template slot-scope="scope">
            <el-input v-model="scope.row.item2" placeholder="请输入" maxlength="30" clearable></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="item3"
          label="列表项3"
          header-align="center"
          min-width="100">
          <template slot-scope="scope">
            <hd-dict-select v-model="scope.row.item3" :dict-code="$global.dictType.menuType" filterable></hd-dict-select>
          </template>
        </el-table-column>
      </el-table>
    </hd-pane>
    <div class="hdty-drawer-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="brand" @click="submitForm">确 定</el-button>
    </div>
  </el-drawer>
</template>

<script>
  import { hdForm } from '@/utils/util-framework'
  import { add, addBefore } from './api';
  export default {
    name: "Example2Drawer",
    moduleName: "Example2List",
    provide() {
      return {
        hdDrawer: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      return {
        // 表单
        formData: {
          input: '',
          radio: '',
          select: '',
          number: ''
        },
        // 表单扩展
        extendData: {},
        // 表格
        tableData: [
          {
            item1: '1',
            item2: '1',
            item3: '1',
          }
        ],
        // 验证
        rules: {
          input: [
            { required: true, message: '请输入表单项1', trigger: 'blur' }
          ]
        },
        // 显示
        visible: false
      }
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
        addBefore(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            this.formData = data.vo;
            this.extendData = data.vox;
          }
        }).catch(error => {
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
            let dataParams = {
              ...this.formData
            };
            // Lambda写法
            add(dataParams).then(response => {
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
