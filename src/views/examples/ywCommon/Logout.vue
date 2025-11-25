<template>
  <el-dialog title="注销" :visible.sync="visible" custom-class=" new-form" append-to-body>
    <hd-pane fit v-loading="handleLoading">
      <el-form
        :model="formData"
        :rules="rules"
        ref="formRef"
        label-width="0"
        @keyup.enter.native="submitForm"
      >
        <hd-component :model="extendData" ref="componentRef">
          <biz-form-card title="注销信息">
            <biz-form>
              <biz-form-row>
                <biz-form-item label="名&emsp;&emsp;称" :required="false" :span="24">
                  <el-form-item>
                    <el-input disabled maxlength="100" v-model="row.vo.name"></el-input>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>

              <biz-form-row>
                <biz-form-item label="注&ensp;销&ensp;人" :required="false" :span="24">
                  <el-form-item prop="zxrXm">
                    <el-input disabled maxlength="100" v-model="$utilPublic.getUserInfo().xm"></el-input>
                  </el-form-item>
                </biz-form-item>
                <biz-form-item label="注销单位" :required="false" :span="24">
                  <el-form-item prop="zxdwGajgjgdm">
                    <el-input disabled maxlength="100" v-model="$utilPublic.getUserInfo().orgName"></el-input>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>

              <biz-form-row>
                <biz-form-item label="注销日期" :required="false" :span="24">
                  <el-form-item prop="zxrq">
                    <el-date-picker
                      disabled
                      v-model="$utilDate.dateFtt(new Date(), 'yyyy-MM-dd')"
                      type="date"
                      value-format="yyyyMMdd"
                      placeholder="请选择注销日期"
                    ></el-date-picker>
                  </el-form-item>
                </biz-form-item>
                <biz-form-item label="注销原因" :required="true" :span="24" pClass="p-divs">
                  <el-form-item prop="zxyy">
                    <el-input
                      type="textarea"
                      :rows="3"
                      v-model="formData.zxyy"
                      placeholder="注销原因"
                      maxlength="100"
                    ></el-input>
                  </el-form-item>
                </biz-form-item>
              </biz-form-row>
            </biz-form>
          </biz-form-card>
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
import { hdForm, hdList } from '@/utils/util-framework';
// import { logOut } from './api';

export default {
  name: 'BwryLogout',
  provide() {
    return {
      BwryLogout: this
    };
  },
  components: {},
  inject: ['hdList', 'BwryList'],
  mixins: [hdList, hdForm],
  data() {
    return {
      // 表单
      formData: { zxyy: '' },
      // 扩展表单
      extendData: {},
      // 验证
      rules: {
        zxyy: [
          { required: true, message: '请输入注销原因', trigger: 'blur' },
          {
            validator: this.$utilValidate.validateSpecialCharacters,
            trigger: 'blur'
          }
        ]
      },
      // 显示
      visible: false,
      // 行
      row: { vo: {}, vox: {} }
    };
  },
  mounted() {},
  methods: {
    beforeLoadForm() {
      let _this = this;
      _this.$nextTick(() => {
        // 重置表单
        _this.resetForm();
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
            id: _this.row.vo.id,
            zxyy: _this.formData.zxyy
          };
          // Lambda写法
          logOut(dataParams)
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
                _this.BwryList.handleQuery();
                _this.hdList.handleQuery();
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

<style lang="scss" scoped>
</style>
