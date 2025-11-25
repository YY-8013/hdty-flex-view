<template>
  <el-dialog
    title="编辑"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit>
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        v-loading="loading"
        label-width="120px"
        @keyup.enter.native="submitForm">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <el-form-item label="系统名称">
            <el-input v-model="row.vo.systemName" readonly underline></el-input>
          </el-form-item>
          <el-form-item label="所属机构" prop="orgId">
            <hd-organ
              prop="orgId"
              v-model="formData.orgId"
              :model-text.sync="extendData.orgId"
              placeholder="请选择所属机构"
              underline>
            </hd-organ>
          </el-form-item>
          <el-form-item label="前端访问地址" prop="systemWebAddress">
            <el-input v-model="formData.systemWebAddress" placeholder="请输入前端访问地址" maxlength="200" underline></el-input>
          </el-form-item>
          <el-form-item label="服务端访问地址" prop="systemApiAddress">
            <el-input v-model="formData.systemApiAddress" placeholder="请输入服务端访问地址" maxlength="200" underline></el-input>
          </el-form-item>
          <el-form-item label="客户端类型" prop="clientType">
            <hd-dict-radio v-model="formData.clientType" :dict-code="$global.dictType.clientType" underline></hd-dict-radio>
          </el-form-item>
          <el-form-item label="是否启用" prop="enable">
            <hd-dict-radio v-model="formData.enable" :dict-code="$global.dictType.isOrNot" underline></hd-dict-radio>
          </el-form-item>
          <el-form-item label="备  注" prop="memo">
            <el-input
              type="textarea"
              rows="3"
              v-model="formData.memo"
              placeholder="请输入备注"
              maxlength="200"
              underline>
            </el-input>
          </el-form-item>
        </hd-component>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {hdForm, hdList} from "@/utils/util-framework";
  import {edit, editBefore} from './api';

  export default {
    name: 'RelUrlEdit',
    provide() {
      return {
        hdAdd: this
      };
    },
    inject: ['hdList'],
    mixins: [hdList, hdForm],
    data() {
      return {
        // 表单
        formData: {},
        // 表单扩展
        extendData: {},
        // 验证
        rules: {
          orgId: [
            { required: true, message: '请选择所属机构', trigger: 'change' }
          ],
          systemWebAddress: [
            { required: true, message: '请输入前端访问地址', trigger: 'blur' },
          ],
          clientType: [
            { required: true, message: '请选择客户端类型', trigger: 'change' }
          ],
          enable: [
            { required: true, message: '请选择是否启用', trigger: 'change' },
          ],
        },
        // 显示
        visible: false,
        // 行
        row: {
          vo: {},
          vox: {},
        },
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
        _this.loading = true;
        // 参数
        let dataParams = {
          id: _this.row.vo.id,
        };
        // Lambda写法
        editBefore(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.formData = data.vo;
            _this.extendData = data.vox;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.$refs.formRef.clearValidate();
          _this.loading = false;
        });
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate(valid => {
          if (valid) {
            _this.loading = true;
            // 参数
            let dataParams = {
              subSystemId: _this.row.vo.subSystemId,
              ..._this.formData
            };
            // Lambda写法
            edit(dataParams).then(response => {
              //响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.hdList.handleQuery();
                _this.hdList.hdList.handleQuery();
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            }).finally(() => {
              _this.loading = false;
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
        this.$refs.componentRef.resetFields();
      }
    }
  };
</script>

<style scoped>

</style>
