<template>
  <el-dialog
    title="编辑"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit
      v-loading="submitting">
      <el-form
        :model="editData"
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
                <el-input v-model="editData.gmsfhm" placeholder="请输入身份证号" maxlength="18" underline readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="启用状态" prop="enable">
                <el-switch
                  v-model="editData.enable"
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
                <el-input v-model="editData.xm" placeholder="请输入真实姓名" maxlength="30" underline></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="telephone">
                <el-input v-model="editData.telephone" placeholder="请输入联系电话" maxlength="20" underline></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属民警" prop="mjId">
                <hd-mj-select
                  prop="mjId"
                  v-model="editData.mjId"
                  :model-text.sync="extendData.mjId"
                  @currentChanged="handleSelectMj"
                  underline>
                </hd-mj-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="社区/行政村" prop="communityId">
                <hd-community-select
                  prop="communityId"
                  v-model="editData.communityId"
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
                  prop="orgId"
                  v-model="editData.orgId"
                  :model-text.sync="extendData.orgId"
                  placeholder="请选择管辖机构"
                  underline>
                </hd-organ>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行政区划" prop="regionId">
                <hd-region
                  prop="regionId"
                  v-model="editData.regionId"
                  :model-text.sync="extendData.regionId"
                  placeholder="请选择行政区划"
                  underline>
                </hd-region>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="有效期限" prop="expiredTime">
            <el-date-picker
              v-model="editData.expiredTime"
              type="date"
              value-format="yyyyMMdd"
              :picker-options="pickerDisabled"
              placeholder="请选择有效期限"
              underline>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="管辖街路巷(小区/村庄)" prop="jlxList">
            <biz-ybss-jlxxqall-multi-select
              prop="jlxList"
              v-model="editData.jlxList"
              placeholder="请选择管辖街路巷(小区/村庄)"
              :model-text.sync="extendData.jlxList"
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
            <div v-if="jlxListData && jlxListData.length > 0" style="max-height: 180px;" class="hdty-scrolls">
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
                  prop="name"
                  label="小区名称"
                  header-align="center"
                  min-width="150">
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item label="管辖建筑物" prop="jzwList">
            <biz-building-select-gx
              prop="jzwList"
              v-model="editData.jzwList"
              placeholder="请选择管辖建筑物"
              :model-text.sync="extendData.jzwList"
              :multiple="true"
              :currentSjgsdwdmName="$utilPublic.getUserInfo().orgName"
              :currentSjgsdwdm="$utilPublic.getUserInfo().orgId"
              :currentFilterOrg="$utilPublic.getUserInfo().orgId"
              :underline="true"
              :labelFieldQc="true"
              @currentChanged="handleChangeJzwList">
            </biz-building-select-gx>
            <!--管辖建筑物-->
            <div v-if="jzwListData && jzwListData.length > 0" style="max-height: 180px;" class="hdty-scrolls">
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
                  prop="name"
                  label="建筑物名称"
                  header-align="center"
                  min-width="150">
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>
          <el-form-item label="备  注" prop="memo">
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="editData.memo"  maxlength="500" underline></el-input>
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
  import {checkIdCard, checkUsername, edit, editBefore} from './api';
  import HdMjSelect from './plugs/hd-mj-select';
  import HdCommunitySelect from './plugs/hd-community-select';
  import BizYbssJlxxqallMultiSelect from "@/views/plugs/biz-ybss-jlxxqall-multi-select";
  import BizBuildingSelectGx from "./biz-building-select-gx";

  export default {
    name: "UserGridEdit",
    provide() {
      return {
        hdEdit: this
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
            id: this.row.vo.id,
            username: this.editData.username
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
            id: this.row.vo.id,
            gmsfhm: this.editData.gmsfhm
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
      return {
        // 有效期限的限制条件
        pickerDisabled: {
          disabledDate: (time) => {
            // 今天之前的日期不允许选择
            return time.getTime() < new Date(new Date().toLocaleDateString()).getTime();
          }
        },
        // 表单
        editData: {},
        // 扩展表单
        extendData: {},
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
        // 行
        row: {},
        // 表格展示-管辖小区
        jlxListData: [],
        // 表格展示-管辖建筑物
        jzwListData: [],
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
        _this.submitting = true;
        // 参数
        let dataParams = {
          id: _this.row.vo.id
        };
        // Lambda写法
        editBefore(dataParams).then(response => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            let copyData = this.$utilStr.deepClone(data);
            _this.editData = data.vo;
            _this.extendData = data.vox;
            _this.jlxListData = data.vo.jlxList;
            _this.jzwListData = data.vo.jzwList;
            // 管辖小区回显
            let jlxDzbmList = copyData.vo.jlxList.map( e => e.dzbm);
            let jlxNameList = data.vo.jlxList.map( e => e.name);
            _this.editData.jlxList = jlxDzbmList ? jlxDzbmList : [];
            _this.$set(_this.extendData,'jlxList', jlxNameList);
            // 管辖建筑物回显
            let jzwDzbmList = copyData.vo.jzwList.map( e => e.dzbm);
            let jzwNameList = data.vo.jzwList.map( e => e.name);
            _this.editData.jzwList = jzwDzbmList ? jzwDzbmList  : [];
            _this.$set(_this.extendData,'jzwList', jzwNameList);
          }
        }).catch(error => {
          // 响应错误回调
          console.log(error);
        }).finally(() => {
          _this.submitting = false;
        });
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid, error) => {
          if (valid) {
            _this.submitting = true;
            // 参数
            let dataParams = {
              ..._this.editData,
              relationDTO:{
                jlxList: _this.editData.jlxList ? _this.editData.jlxList:[],
                jzwList: _this.editData.jzwList ? _this.editData.jzwList:[],
              }
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
        this.editData.mjGmsfhm = '';
      },
      // 选择民警
      handleSelectMj(val) {
        if (val && val.vo) {
          this.editData.mjGmsfhm = val.vo.gmsfhm;
          this.editData.orgId = val.vo.orgId;
          this.extendData.orgId = val.vox.orgId;
          this.editData.regionId = val.vo.regionId;
          this.extendData.regionId = val.vox.regionId;
        }
      },
      // 街路项-小区数据
      handleChangeJlxList (list){
        this.jlxListData = [];
        list.forEach( e => {
          this.jlxListData.push({
            name:e.vo.jlxxqmcQc,
          })
        })
      },
      // 建筑物数据
      handleChangeJzwList(list){
        this.jzwListData = [];
        list.forEach( e => {
          this.jzwListData.push({
            name:e.vo.dzmcDzqc ? e.vo.dzmcDzqc : e.vo.jzwmc,
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
