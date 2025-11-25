<template>
  <el-dialog
    title="添加"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit
      v-loading="submitting">
      <el-form
        :model="addData"
        :rules="rules"
        ref="formRef"
        label-width="160px"
        @submit.native.prevent
        @keyup.enter.native="submitForm">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <el-row>
            <el-col :span="12">
              <el-form-item label="身份证号" prop="gmsfhm">
                <el-input v-model="addData.gmsfhm" placeholder="请输入身份证号" maxlength="18" underline></el-input>
              </el-form-item>
             <!-- <el-form-item label="用 户 名" prop="username">
                <el-input v-model="addData.username" placeholder="请输入用户名" maxlength="30" underline></el-input>
              </el-form-item>-->
            </el-col>
            <el-col :span="12">
              <el-form-item label="启用状态" prop="enable">
                <el-switch
                  v-model="addData.enable"
                  :width="50"
                  active-value="1"
                  inactive-value="0"
                  tabindex="0"
                  underline>
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="真实姓名" prop="xm">
                <el-input v-model="addData.xm" placeholder="请输入真实姓名" maxlength="30" underline></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="telephone">
                <el-input v-model="addData.telephone" placeholder="请输入联系电话" maxlength="20" underline></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属民警" prop="mjId">
                <hd-mj-select
                  v-model="addData.mjId"
                  :model-text.sync="extendData.mjId"
                  @currentChanged="handleSelectMj"
                  underline>
                </hd-mj-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="社区/行政村" prop="communityId">
                <hd-community-select
                  v-model="addData.communityId"
                  :model-text.sync="extendData.communityId"
                  underline>
                </hd-community-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="管辖机构" prop="orgId">
                <hd-organ
                  v-model="addData.orgId"
                  :model-text.sync="extendData.orgId"
                  placeholder="请选择管辖机构"
                  checkFinalLevel
                  underline
                  :filterCode="filterCode"
                ></hd-organ>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行政区划" prop="regionId">
                <hd-region v-model="addData.regionId" :model-text.sync="extendData.regionId" placeholder="请选择行政区划" underline></hd-region>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="有效期限" prop="expiredTime">
            <el-date-picker
              v-model="addData.expiredTime"
              type="date"
              value-format="yyyyMMdd"
              :picker-options="pickerDisabled"
              placeholder="请选择有效期限"
              underline>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="管辖街路巷(小区/村庄)" prop="jlxList">
            <biz-ybss-jlxxqall-multi-select
              v-model="addData.jlxList"
              placeholder="请选择管辖街路巷(小区/村庄)"
              title="选择管辖街路巷(小区/村庄)"
              :orgId="$utilPublic.getUserInfo().orgId"
              :showAddBtn="false"
              :multiple="true"
              :currentSjgsdwdm="$utilPublic.getUserInfo().orgId.substr(0, 4) + '00000000'"
              :currentFilterOrg="$utilPublic.getUserInfo().orgId.substr(0, 4) + '00000000'"
              :searchLx= "['42','44','45']"
              :showJlxlx="false"
              :underline="true"
              @currentChanged = 'handleChangeJlxList'>
            </biz-ybss-jlxxqall-multi-select>
            <!--管辖小区-->
            <div v-if="addData.jlxList && addData.jlxList.length > 0" style="max-height: 180px;" class="hdty-scrolls">
              <el-table
                :data="jlxListData"
                row-key="bzdz"
                ref="tableRef"
                style="max-height: 180px;overflow: auto"
                v-loading="loading"
                border
                fit>
                <el-table-column
                  sortable="custom"
                  type="index"
                  label="序号"
                  align="center"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="vo.jlxxqmcQc"
                  label="小区名称"
                  header-align="center"
                  min-width="150">
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item label="管辖建筑物" prop="jzwList">
            <biz-building-select-gx
              v-model="addData.jzwList"
              placeholder="请选择管辖建筑物"
              :multiple="true"
              :currentSjgsdwdmName="$utilPublic.getUserInfo().orgName"
              :currentSjgsdwdm="$utilPublic.getUserInfo().orgId"
              :currentFilterOrg="$utilPublic.getUserInfo().orgId"
              :underline="true"
            @currentChanged="handleChangeJzwList">
            </biz-building-select-gx>
            <!--管辖建筑物-->
            <div v-if="addData.jzwList && addData.jzwList.length > 0" style="max-height: 180px;" class="hdty-scrolls">
              <el-table
                :data="jzwListData"
                row-key="bzdz"
                ref="tableRef"
                style="max-height: 180px;overflow: auto"
                v-loading="loading"
                border
                fit>
                <el-table-column
                  sortable="custom"
                  type="index"
                  label="序号"
                  align="center"
                  width="50">
                </el-table-column>
                <el-table-column
                  prop="vo.dzmcDzqc"
                  label="建筑物名称"
                  header-align="center"
                  min-width="150">
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item label="备  注" prop="memo">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="addData.memo"  maxlength="500" underline></el-input>
          </el-form-item>
        </hd-component>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" v-preventReClick @click="submitForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {hdForm} from "@/utils/util-framework";
  import {add, checkIdCard, checkUsername} from './api';
  import HdMjSelect from './plugs/hd-mj-select';
  import HdCommunitySelect from './plugs/hd-community-select';
  import BizYbssJlxxqallMultiSelect from "@/views/plugs/biz-ybss-jlxxqall-multi-select";
  import BizBuildingSelectGx from "./biz-building-select-gx";

  export default {
    name: "UserGridAdd",
    provide() {
      return {
        hdAdd: this
      };
    },
    components: {
      HdMjSelect,
      HdCommunitySelect,
      BizYbssJlxxqallMultiSelect,
      BizBuildingSelectGx,
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      let validateUsername = (rule, value, callback) => {
        if (value) {
          let dataParams = {
            id: '',
            username: this.addData.username
          };
          // Lambda写法
          checkUsername(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              if (!data.pass) {
                callback(new Error('用户名已存在'));
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
      let validateIdCard = (rule, value, callback) => {
        if (value) {
          let dataParams = {
            id: '',
            gmsfhm: this.addData.gmsfhm
          };
          // Lambda写法
          checkIdCard(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              if (!data.pass) {
                callback(new Error('身份证号已存在'));
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
      let validatePassword = (rule, value, callback) => {
        if (value === this.addData.username) {
          callback(new Error('密码不能与用户名相同'));
        } else {
          callback();
        }
      };
      let validateCheckPass = (rule, value, callback) => {
        if (value !== this.addData.password) {
          callback(new Error('两次输入密码不一致'));
        } else {
          callback();
        }
      };
      return {
        // 有效期限的限制条件
        pickerDisabled: {
          disabledDate: (time) => {
            // 今天之前的日期不允许选择
            return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
          }
        },
        // 表单
        addData: {
          username: '',
          enable: '1',
          password: '',
          checkPass: '',
          xm: '',
          gmsfhm: '',
          telephone: '',
          mjId: '',
          mjGmsfhm: '',
          communityId: '',
          orgId: this.$utilPublic.getUserOrgLevel() > 5 ? this.$utilPublic.getUserOrgId(): '',
          regionId: this.$utilPublic.getUserRegionId(),
          expiredTime: this.$utilDate.dateFtt(this.$utilDate.toString(new Date(new Date().getTime() + this.$app.userExpireTime)), 'yyyyMMdd'),
          memo: '',
          userType: '1',
          // 管辖街路巷小区
          jlxList:[],
          // 管辖建筑物
          jzwList:[]
        },
        // 扩展表单
        extendData: {
          mjId: '',
          communityId: '',
          regionId: this.$utilPublic.getUserInfo().regionName,
          orgId:  this.$utilPublic.getUserOrgLevel() > 5 ? this.$utilPublic.getUserOrgName():'',
        },
        // 验证
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
            { validator: this.$utilValidate.validateUsernameWeak, trigger: 'blur' },
            { validator: validateUsername, trigger: 'blur' }
          ],
          enable: [
            { required: true, message: '请选择启用状态', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
            { validator: validatePassword, trigger: 'blur' },
            { validator: this.$utilValidate.validatePasswordNormal, trigger: 'blur' }
          ],
          checkPass: [
            { required: true, message: '请确认密码', trigger: 'blur' },
            { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
            { validator: validateCheckPass, trigger: 'blur' }
          ],
          xm: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' },
            { min: 2, max: 30, message: '请正确输入真实姓名', trigger: 'blur' },
            { validator: this.$utilValidate.validateChinese, trigger: 'blur' }
          ],
          gmsfhm: [
            { required: true, message: '请输入身份证号', trigger: 'blur' },
            { validator: this.$utilValidate.validateIdcard, trigger: 'blur' },
            { validator: validateIdCard, trigger: 'blur' }
          ],
          telephone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' },
            { validator: this.$utilValidate.validateMobile, trigger: 'blur' }
          ],
          mjId: [
            { required: true, message: '请选择所属民警', trigger: 'change' },
          ],
          communityId: [
            { required: true, message: '请选择社区/行政村', trigger: 'change' },
          ],
          orgId: [
            { required: true, message: '请选择管辖机构', trigger: 'change' },
          ],
          regionId: [
            { required: true, message: '请选择行政区划', trigger: 'change' },
          ],
          expiredTime: [
            { required: true, message: '请选择有效期限', trigger: 'change' },
          ],
        },
        // 显示
        visible: false,
        // 表格展示-管辖小区
        jlxListData: [],
        // 表格展示-管辖建筑物
        jzwListData: [],
        filterCode: '',
      };
    },
    methods: {
      beforeLoadForm(){
        this.filterCode = this.row.vo.agencyid;
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid, error) => {
          if (valid) {
            _this.submitting = true;
            // 参数
            let dataParams = {
              ..._this.addData,
              password: _this.$crypto.md5(_this.addData.password),
              checkPass: _this.$crypto.md5(_this.addData.checkPass),
              relationDTO:{
                jlxList: _this.addData.jlxList,
                jzwList: _this.addData.jzwList,
              }
            };
            // Lambda写法
            add(dataParams).then(response => {
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
                _this.hdList.handleQuery();
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            }).finally(() => {
              _this.submitting = false;
            });
          }
          else{
            _this.scrollIntoFormErrorView(error);
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
        this.addData.mjGmsfhm = '';
      },
      // 选择民警
      handleSelectMj(val) {
        if (val && val.vo) {
          this.addData.mjGmsfhm = val.vo.gmsfhm;
          this.addData.orgId = val.vo.orgId;
          this.extendData.orgId = val.vox.orgId;
          this.addData.regionId = val.vo.regionId;
          this.extendData.regionId = val.vox.regionId;
        }
      },
      // 街路项-小区数据
      handleChangeJlxList (val){
        this.jlxListData = val;
      },
      // 建筑物数据
      handleChangeJzwList(val){
        this.jzwListData = val;
      },
    }
  }
</script>

<style scoped>

</style>
