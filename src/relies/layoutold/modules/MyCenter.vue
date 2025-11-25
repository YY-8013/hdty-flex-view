<template>
  <div class="hdty-container hdty-flex hdty-flex-row" fill>
    <div class="hdty-flex-fit">
      <div class="hdty-menu">
        <div
          v-for="menu in menuData"
          class="hdty-menu-item"
          :class="{ 'is-active': activeMenu === menu.key }">
          <a href="javascript:;" @click="handleMenuClick(menu)">
            {{ menu.name }}
          </a>
        </div>
      </div>
    </div>
    <div class="hdty-flex-fill hdty-scroll">
      <div class="hdty-fill hdty-myprofile" v-show="activeMenu === 0">
        <div class="hdty-myprofile-header">
          <div class="hdty-card">
            <div class="hdty-card-body">
              <hd-avatar :avatar="profileData.vo.avatar && profileData.vo.avatar.url">
                <el-button
                  title="点击前往修改头像"
                  size="small"
                  icon="icon-photograph-o"
                  circle
                  @click="handleGoChangeAvatar">
                </el-button>
              </hd-avatar>
              <div class="hdty-basic">
                <h4>
                  {{ profileData.vo.xm }}
                  <span
                    :title="$utilDate.dateFtt(profileData.vo.expiredTime, 'yyyy.MM.dd') + '到期'"
                    class="hdty-symbol icon-palm-check hdty-warning-color">
                  </span>
                </h4>
                <h5>{{ profileData.vox.orgId }}</h5>
              </div>
            </div>
          </div>
        </div>
        <div class="hdty-myprofile-body">
          <div class="hdty-card" fill>
            <div class="hdty-card-header">
              <div class="hdty-card-title">
                我的资料
              </div>
              <div class="hdty-card-more">
                我的收藏：
                <a
                  href="javascript:;"
                  title="点击前往我的收藏"
                  class="hdty-main-color"
                  @click="handleGoMyCollect">
                  0
                </a>
              </div>
            </div>
            <div class="hdty-card-body">
              <el-form
                ref="profileFormRef"
                :model="profileData"
                size="small">
                <el-form-item label="用 户 名" prop="vo.username">
                  {{ profileData.vo.username }}
                </el-form-item>
                <el-form-item label="真实姓名" prop="vo.xm">
                  {{ profileData.vo.xm }}
                </el-form-item>
                <el-form-item label="身份证号" prop="vo.gmsfhm">
                  {{ profileData.vo.gmsfhm }}
                </el-form-item>
                <el-form-item label="联系电话" prop="vo.telephone">
                  {{ profileData.vo.telephone }}
                </el-form-item>
                <el-form-item label="行政区划" prop="vox.regionId">
                  {{ profileData.vox.regionId }}
                </el-form-item>
                <el-form-item label="管辖机构" prop="vox.orgId">
                  {{ profileData.vox.orgId }}
                </el-form-item>
                <el-form-item label="有效期限" prop="vo.expiredTime">
                  {{ $utilDate.dateFtt(profileData.vo.expiredTime, 'yyyy.MM.dd') }}
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
      <div class="hdty-fill hdty-avatar-upload" v-show="activeMenu === 1">
        <div class="hdty-card" fill>
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              修改头像
            </div>
          </div>
          <div class="hdty-card-body">
            <hd-cutter
              ref="avatarRef"
              v-loading="avatarLoading"
              v-model="avatar"
              output-model="base64"
              :full="false"
              :auto-crop-width="340"
              :auto-crop-height="340"
              :info="false"
              fixed
              fixedBox>
            </hd-cutter>
            <div class="hdty-btn-container">
              <el-button type="primary" fixed @click="submitAvatarForm">确 定</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="hdty-fill" v-show="activeMenu === 2">
        <div class="hdty-card" fill>
          <div class="hdty-card-header">
            <div class="hdty-card-title">
              修改密码
            </div>
          </div>
          <div class="hdty-card-body">
            <el-form
              ref="pwdFormRef"
              v-loading="pwdLoading"
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
            <div class="hdty-btn-container">
              <el-button type="primary" fixed @click="submitPwdForm">确 定</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="hdty-fill" v-show="activeMenu === 3">
        <p class="hdty-fluid">功能正在建设</p>
      </div>
    </div>
  </div>
</template>

<script>
  import { getUserInfoDetail, uploadAvatar, changePassword, checkPassword } from '@/api/user';
  export default {
    name: "MyCenter",
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
        // 选中的左侧菜单
        activeMenu: 0,
        // 左侧菜单数据
        menuData: [
          {
            key: 0,
            name: '我的资料'
          },
          {
            key: 1,
            name: '修改头像'
          },
          {
            key: 2,
            name: '修改密码'
          },
          {
            key: 3,
            name: '我的收藏'
          }
        ],
        // 我的资料数据
        profileData: {
          vo: {},
          vox: {}
        },
        // 我的头像
        avatar: '',
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
        // 修改头像提交中
        avatarLoading: false,
        // 修改密码提交中
        pwdLoading: false,
      }
    },
    watch: {
      activeMenu: {
        handler(val) {
          if(val === 0) {
            if(this.$utilStr.isEmpty(this.profileData.vo) && this.$utilStr.isEmpty(this.profileData.vox)) {
              this.loadProfileForm();
            }
          } else if(val === 1) {
            if(!this.$utilStr.isEmpty(this.profileData.vo) || !this.$utilStr.isEmpty(this.profileData.vox)) {
              this.avatar = this.profileData.vo.avatar.url;
            } else {
              this.avatar = this.$utilLogin.getUserAvatar();
            }
          } else if(val === 2) {
            this.resetPwdForm();
          }
        },
        immediate: false
      },
    },
    mounted() {
      // 重置所有表单
      this.resetForm();
      // 加载我的资料
      this.loadProfileForm();
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        this.$nextTick(() => {
          // 重置所有表单
          this.resetForm();
          if(this.activeMenu === 0) {
            // 加载我的资料
            this.loadProfileForm();
          } else if(this.activeMenu === 1) {
            // 加载我的头像
            this.avatar = this.$utilLogin.getUserAvatar();
          }
        });
      },
      // 加载我的资料
      loadProfileForm() {
        // 参数
        let dataParams = {
          id: this.$utilLogin.getUserId()
        };
        // Lambda写法
        getUserInfoDetail(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            this.profileData.vo = data.vo;
            this.profileData.vox = data.vox;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        })
      },
      // 修改头像提交
      submitAvatarForm() {
        this.$refs.avatarRef.submit();
        this.$refs.avatarRef.$on('currentComplete', base64 => {
          if (base64) {
            this.avatarLoading = true;
            // 参数
            let dataParams = {
              photoBase64: base64
            };
            // Lambda写法
            uploadAvatar(dataParams).then(response => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                this.profileData.vo.avatar.url = base64;
                this.$store.dispatch('editAvatar', base64);
                this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            }).finally(() => {
              this.avatarLoading = false;
            });
          }
          this.$refs.avatarRef.$off('currentComplete');
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
      // 选择左侧菜单
      handleMenuClick(val) {
        this.activeMenu = val.key;
      },
      // 跳转至修改头像
      handleGoChangeAvatar() {
        this.activeMenu = 1;
      },
      // 跳转至我的收藏
      handleGoMyCollect() {
        this.activeMenu = 3;
      },
      // 重置我的资料表单
      resetProfileForm() {
        this.profileData = {
          vo: {},
          vox: {}
        };
      },
      // 重置修改头像表单
      resetAvatarForm() {
        this.avatar = '';
      },
      // 重置修改密码表单
      resetPwdForm() {
        this.$refs.pwdFormRef.resetFields();
      },
      // 重置
      resetForm() {
        this.resetProfileForm();
        this.resetAvatarForm();
        this.resetPwdForm();
      }
    }
  }
</script>

<style scoped>

</style>
