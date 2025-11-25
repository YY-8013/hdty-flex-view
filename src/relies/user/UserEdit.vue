<template>
  <el-dialog title="编辑" :visible.sync="visible" append-to-body>
    <hd-pane fit v-loading="submitting">
      <el-form
        :model="editData"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        @submit.native.prevent
        @keyup.enter.native="submitForm"
      >
        <hd-component :model="extendData" ref="componentRef">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用 户 名" prop="username">
                <el-input v-model="editData.username" placeholder="请输入用户名" maxlength="20" underline></el-input>
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
                  underline
                ></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="真实姓名" prop="xm">
                <el-input v-model="editData.xm" placeholder="请输入真实姓名" maxlength="15" underline></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="身份证号"
                prop="gmsfhm"
                :rules="editData.id!==superAdminUserId?rules.gmsfhm:{}"
              >
                <el-input
                  v-model="editData.gmsfhm"
                  placeholder="请输入身份证号"
                  maxlength="18"
                  :disabled="editData.id!==superAdminUserId?false:true"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="联系电话" prop="telephone">
                <el-input
                  v-model="editData.telephone"
                  placeholder="请输入联系电话"
                  maxlength="12"
                  underline
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="有效期限"
                prop="expiredTime"
                :rules="editData.id!==superAdminUserId?rules.expiredTime:{}"
              >
                <hd-date-picker
                  type="date"
                  v-model="editData.expiredTime"
                  :disabled="editData.id===superAdminUserId"
                  placeholder="请选择有效期限"
                  underline
                />
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
                  underline
                ></hd-organ>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="行政区划" prop="regionId">
                <hd-region
                  prop="regionId"
                  v-model="editData.regionId"
                  :model-text.sync="extendData.regionId"
                  placeholder="请选择行政区划"
                  underline
                ></hd-region>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="警  号" prop="policeId">
                <el-input v-model="editData.policeId" placeholder="请输入警号" maxlength="15" underline></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否边防用户" prop="isBfUser" label-width="110px">
                <el-radio-group prop="isBfUser" v-model="editData.isBfUser" underline>
                  <el-radio :label="'1'">是</el-radio>
                  <el-radio :label="'0'">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="所属部门" prop="orgSsbm">
                <hd-organ
                  prop="orgSsbm"
                  v-model="editData.orgSsbm"
                  :model-text.sync="extendData.orgSsbm"
                  placeholder="请选择所属部门"
                  isShowDept
                  underline
                ></hd-organ>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="所属警种" prop="jz">
                <hd-dict-select
                  prop="jz"
                  v-model="editData.jz"
                  :model-text.sync="extendData.jz"
                  placeholder="请选择所属警种"
                  :dict-code="$global.dictType.zzmhJzxx"
                  filterable
                  underline
                ></hd-dict-select>
              </el-form-item>
            </el-col>
          </el-row>
        </hd-component>
      </el-form>
      <div class="hdty-card">
        <div class="hdty-card-header">
          <div class="hdty-card-title">
            <span>分配用户角色</span>
          </div>
        </div>
        <div class="hdty-card-body">
          <el-form inline>
            <el-form-item label="选择角色" prop="multiRoleId">
              <hd-table-select
                :api="roleSelectOptions.api"
                :props="roleSelectOptions.props"
                :columns="roleSelectOptions.columns"
                :searches="roleSelectOptions.searches"
                v-model="multiRoleId"
                :model-text.sync="multiRoleName"
                :current-selection="multiRoleData"
                :multiple="$app.roleMultipleEnabled"
                placeholder="请选择角色"
                @currentChanged="handleRoleChanged"
              ></hd-table-select>
            </el-form-item>
          </el-form>
          <el-table
            :data="tableData"
            :empty-text="emptyText"
            row-key="id"
            ref="tableRef"
            v-loading="loading"
            @selection-change="handleSelectionChange"
            border
          >
            <el-table-column fixed type="selection" reserve-selection align="center" width="50"></el-table-column>
            <el-table-column fixed type="index" label="序号" align="center" width="50"></el-table-column>
            <el-table-column prop="name" label="角色名" sortable header-align="center" width="180"></el-table-column>
            <el-table-column
              prop="clientTypeList"
              label="客户端"
              sortable
              header-align="center"
              width="120"
            ></el-table-column>
            <el-table-column label="其他设置" header-align="center" align="center" width="80">
              <template slot-scope="scope">
                <a
                  title="设置查询范围和有效期限"
                  href="javascript:;"
                  underline
                  @click="handleSet(scope.$index, scope.row)"
                >
                  <el-tag
                    type="primary"
                  >{{ scope.row.cxfwOrgId && scope.row.endDate ? 2 : scope.row.cxfwOrgId ? 1 : scope.row.endDate ? 1 : 0 }}</el-tag>
                </a>
              </template>
            </el-table-column>
            <el-table-column prop="memo" label="描述" sortable header-align="center" min-width="180"></el-table-column>
          </el-table>
        </div>
      </div>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
    <user-role-set ref="setRef" @currentChanged="handleSetChange"></user-role-set>
  </el-dialog>
</template>

<script>
import { hdForm, hdList } from '@/utils/util-framework';
import UserRoleSet from './UserRoleSet';
import {
  checkIdCard,
  checkUsername,
  editUser,
  getEditDetail
} from '@/api/user';
export default {
  name: 'UserEdit',
  provide() {
    return {
      hdEdit: this
    };
  },
  inject: ['hdList'],
  mixins: [hdList, hdForm],
  components: {
    UserRoleSet
  },
  data() {
    let validateUsername = (rule, value, callback) => {
      if (value) {
        let dataParams = {
          id: this.row.vo.id,
          username: this.editData.username
        };
        // Lambda写法
        checkUsername(dataParams)
          .then((response) => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              if (!data.pass) {
                callback(new Error('用户名已存在'));
              } else {
                callback();
              }
            }
          })
          .catch((error) => {
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
        checkIdCard(dataParams)
          .then((response) => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              if (!data.pass) {
                callback(new Error('身份证号已存在'));
              } else {
                callback();
              }
            }
          })
          .catch((error) => {
            // 响应错误回调
            console.error(error);
            callback();
            callback(new Error('验证时发生错误，请重试'));
          });
      }
    };
    return {
      // 角色选择器配置项
      roleSelectOptions: this.hdList.roleSelectOptions,
      // 表单
      editData: {
        username: '',
        xm: '',
        gmsfhm: '',
        telephone: '',
        enable: '1',
        orgId: '',
        regionId: '',
        expiredTime: '',
        policeId: '',
        isBfUser: '0',
        orgSsbm: '',
        jz: '',
        roleInfoList: []
      },
      // 表单扩展
      extendData: {},
      // 验证
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          },
          { validator: this.$utilValidate.validateUsername, trigger: 'blur' },
          { validator: validateUsername, trigger: 'blur' }
        ],
        enable: [{ required: true, message: '请选择开关', trigger: 'change' }],
        gmsfhm: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: this.$utilValidate.validateIdcard, trigger: 'blur' },
          { validator: validateIdCard, trigger: 'blur' }
        ],
        xm: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' },
          { validator: this.$utilValidate.validateChinese, trigger: 'blur' },
          { min: 2, message: '请正确输入真实姓名', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {
            validator: this.$utilValidate.validateMobileAndTel,
            trigger: 'blur'
          }
        ],
        expiredTime: [
          { required: true, message: '请选择有效期限', trigger: 'change' }
        ],
        orgId: [
          { required: true, message: '请选择管辖机构', trigger: 'change' }
        ],
        regionId: [
          { required: true, message: '请选择行政区划', trigger: 'change' }
        ],
        isBfUser: [
          { required: true, message: '请选择是否边防用户', trigger: 'change' }
        ],
        orgSsbm: [
          { required: true, message: '请选择所属部门', trigger: 'change' }
        ],
        jz: [{ required: true, message: '请选择所属警种', trigger: 'change' }]
      },
      // 表格
      tableData: [],
      // 行
      row: {},
      // 当前操作行
      activeRow: {},
      // 选中角色ID
      multiRoleId: [],
      // 选中角色名称
      multiRoleName: [],
      // 选中角色
      multiRoleData: [],
      // 缓存数据
      cacheData: {
        tableData: []
      },
      // 超管用户Id
      superAdminUserId: '1',
      // 显示
      visible: false
    };
  },
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      // 重置
      this.resetForm();
      // 加载表单
      this.loadForm();
    },
    // 加载表单
    loadForm() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        id: _this.row.vo.id
      };
      // Lambda写法
      getEditDetail(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.editData = data.vo;
            _this.extendData = data.vox;
            _this.tableData = data.vo.roleList;
            _this.cacheData.tableData = _this.tableData;
            _this.handleSelectAll();
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.$refs.tableRef.doLayout();
          _this.$refs.formRef.clearValidate();
          _this.loading = false;
        });
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (_this.multiRoleId.length === 0) {
            _this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: '请至少选择一个角色',
              type: 'error'
            });
            return;
          }
          _this.submitting = true;
          _this.editData.roleInfoList = [];
          _this.multiRoleData.forEach((row) => {
            _this.editData.roleInfoList.push({
              roleId: row.id,
              cxfwOrgId: row.cxfwOrgId,
              endDate: row.endDate
            });
          });
          // 参数
          let dataParams = {
            ..._this.editData
          };
          // Lambda写法
          editUser(dataParams)
            .then((response) => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.hdList.loadList();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            })
            .finally(() => {
              _this.submitting = false;
            });
        }
      });
    },
    // 复选
    handleSelectionChange(val) {
      this.multiRoleId = this.$utilStr.objArrayToArray(val, 'id');
      this.multiRoleName = this.$utilStr.objArrayToArray(val, 'name');
      this.multiRoleData = val;
    },
    // 使列表全部选中
    handleSelectAll() {
      this.$refs.tableRef.clearSelection();
      this.$refs.tableRef.toggleAllSelection();
    },
    // 改变角色
    handleRoleChanged(val, oldVal, selection) {
      if (!Array.isArray(selection)) {
        if (selection) {
          selection = [selection];
        } else {
          selection = [];
        }
      }
      selection.forEach((row) => {
        let findData = this.cacheData.tableData.find((e) => e.id === row.id);
        if (findData) {
          this.$set(row, 'cxfwOrgId', findData.cxfwOrgId);
          this.$set(row, 'cxfwOrgName', findData.cxfwOrgName);
          this.$set(row, 'endDate', findData.endDate);
        } else {
          this.$set(row, 'cxfwOrgId', '');
          this.$set(row, 'cxfwOrgName', '');
          this.$set(row, 'endDate', '');
        }
      });
      this.tableData = selection;
      this.cacheData.tableData = this.tableData;
      this.handleSelectAll();
    },
    // 其他设置
    handleSet(index, row) {
      this.activeRow = row;
      this.$refs.setRef.visible = true;
      this.$refs.setRef.row = row;
      this.$refs.setRef.beforeLoadForm();
    },
    // 改变其他设置
    handleSetChange(val) {
      this.activeRow = val;
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.$nextTick(() => {
        this.$refs.formRef.resetFields();
        this.$refs.componentRef.resetFields();
        this.tableData = [];
        this.multiRoleId = [];
        this.multiRoleName = [];
      });
    }
  }
};
</script>

<style scoped>
</style>
