<template>
  <el-dialog title="添加" :visible.sync="visible" append-to-body>
    <hd-pane fit v-loading="submitting">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="100px" @submit.native.prevent
               @keyup.enter.native="submitForm">
        <hd-component :model="extendData" ref="componentRef">
          <el-row>
            <el-form-item label="数据源名称" prop="dataSource">
              <hd-build-select
                :api="dataSourceSelectOptions.api"
                v-model="formData.dataSource"
                placeholder="请选择数据源"
                underline
                @currentChanged="handleDataSourceChange">
              </hd-build-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="删除范围" prop="dataRange">
              <hd-table-select
                :api="databaseSelectOptions.api"
                :props="databaseSelectOptions.props"
                :columns="databaseSelectOptions.columns"
                :searches="databaseSelectOptions.searches"
                v-model="formData.dataRange"
                multiple
                placeholder="请选择删除范围"
                underline>
              </hd-table-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="备  注" prop="remarks">
              <el-input v-model="formData.remarks" placeholder="请输入备注" maxlength="500" underline></el-input>
            </el-form-item>
          </el-row>
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
  import { add } from '@/api/delrule';
  export default {
    name: 'DelRuleAdd',
    provide() {
      return {
        hdAdd: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      return {
        // 数据源下拉选择器配置项
        dataSourceSelectOptions: this.hdList.dataSourceSelectOptions,
        // 数据表选择器配置项
        databaseSelectOptions: this.hdList.databaseSelectOptions,
        // 表单
        formData: {
          typeString: '',
          wildcard: '',
          condition: '',
          reductionTime: '',
          dataSource: '',
          dataRange: [],
          remarks: '',
          delFlag: ''
        },
        // 表单扩展
        extendData: {},
        // 验证
        rules: {
          dataSource: [{required: true, message: '请选择数据源', trigger: 'change'}],
          dataRange: [{required: true, message: '请选择删除范围', trigger: 'change'}],
          remarks: [{required: true, message: '请输入备注信息', trigger: 'blur'}]
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

      },
      // 改变数据源选择
      handleDataSourceChange(val) {
        let _this = this;
        for (let e of _this.databaseSelectOptions.searches[0]) {
          if(e.field === 'ds') {
            _this.$set(e, 'value', val);
          }
        }
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate(valid => {
          if (valid) {
            _this.submitting = true;
            // 参数
            let dataParams = {
              ..._this.formData
            };
            // Lambda写法
            add(dataParams)
              .then(response => {
                //响应成功回调
                let {success, msg} = response.data;
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
