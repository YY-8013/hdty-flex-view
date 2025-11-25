<template>
  <el-dialog
    title="修改密码"
    :visible.sync="visible"
    custom-class="hdty-dialog-basic"
    plain
    append-to-body>
    <hd-pane
      fit>
      <el-form
        v-loading="pwdLoading"
        ref="pwdFormRef"
        :model="pwdData"
        :rules="pwdRules"
        size="default"
        @submit.native.prevent
        @keyup.enter.native="submitPwdForm">
        <el-form-item label="旧密码" prop="password">
          <el-input type="password" v-model="pwdData.password" placeholder="请输入旧密码" maxlength="16" underline></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="pwdData.newPassword" placeholder="请输入新密码" maxlength="16" underline></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input type="password" v-model="pwdData.confirmPassword" placeholder="请再次输入新密码" maxlength="16" underline></el-input>
        </el-form-item>
      </el-form>
      <div class="hdty-dialog-footer">
        <el-button type="primary" fixed @click="submitPwdForm">确 定</el-button>
      </div>
    </hd-pane>
  </el-dialog>
</template>

<script>
  import { changePassword, checkPassword } from '@/api/user';
  export default {
    name: "ChangePwd",
    data() {
      // 校验旧密码是否通过
      let validateOldPwd = (rule, value, callback) => {
        if (value) {
          let dataParams = {
            password: this.$crypto.md5(value)
          };
          // Lambda写法
          checkPassword(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if(success){
              if (!data.pass) {
                callback(new Error('旧密码输入不正确'));
              } else {
                callback();
              }
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
            callback(new Error('验证时发生错误，请重试'));
          });
        }
      };
      // 校验新密码是否通过
      let validateNewPwd = (rule, value, callback) => {
        let username = this.$utilLogin.getUsername();
        if (value === username) {
          callback(new Error('密码不能与用户名相同'));
        } else {
          callback();
        }
      };
      // 校验确认密码是否通过
      let validateSamePwd = (rule, value, callback) => {
        if (value !== this.pwdData.newPassword) {
          callback(new Error('两次输入新密码不一致'));
        } else {
          callback();
        }
      };
      return {
        // 密码数据
        pwdData: {
          password: '',
          newPassword: '',
          confirmPassword: '',
        },
        // 密码验证
        pwdRules: {
          password: [
            { required: true, message: '请输入旧密码', trigger: 'blur' },
            { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
            { validator: validateOldPwd, trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
            { validator: validateNewPwd, trigger: 'blur' },
            { validator: this.$utilValidate.validatePasswordNormal, trigger: 'blur' },
          ],
          confirmPassword: [
            { required: true, message: '请确认新密码', trigger: 'blur' },
            { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
            { validator: validateSamePwd, trigger: 'blur' }
          ],
        },
        // 密码修改提交中
        pwdLoading: false,
        // 显示
        visible: false,
      };
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        this.$nextTick(() => {
          // 重置
          this.resetForm();
        });
      },
      // 修改密码提交
      submitPwdForm() {
        this.$refs.pwdFormRef.validate((valid) => {
          if (valid) {
            this.pwdLoading = true;
            // 参数
            let dataParams = {
              password: this.$crypto.md5(this.pwdData.password),
              newPassword: this.$crypto.md5(this.pwdData.newPassword),
              confirmPassword: this.$crypto.md5(this.pwdData.confirmPassword)
            };
            // Lambda写法
            changePassword(dataParams).then(response => {
              // 响应成功回调
              let { success } = response.data;
              if (success) {
                this.$alert('密码修改成功，请重新登录', '提示', {
                  type: 'success',
                  confirmButtonText: '确定',
                  callback: () => {
                    this.$utilLogin.clearPwdAndLogout();
                  }
                });
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            }).finally(() => {
              this.pwdLoading = false;
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
        this.$refs.pwdFormRef.resetFields();
      }
    }
  }
</script>

<style scoped>

</style>
