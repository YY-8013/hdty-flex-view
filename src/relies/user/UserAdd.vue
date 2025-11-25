<template>
  <el-dialog title="添加" :visible.sync="visible" append-to-body>
    <hd-pane fit v-loading="submitting">
      <el-form
        :model="addData"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        @submit.native.prevent
        @keyup.enter.native="submitForm"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="用 户 名" prop="username">
              <el-input v-model="addData.username" placeholder="请输入用户名" maxlength="20" underline></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="启用状态" prop="enable">
              <el-switch
                v-model="addData.enable"
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
            <el-form-item label="密  码" prop="password">
              <el-input
                type="password"
                v-model="addData.password"
                autocomplete="new-password"
                placeholder="请输入密码"
                maxlength="16"
                underline
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="checkPass">
              <el-input
                type="password"
                v-model="addData.checkPass"
                autocomplete="new-password"
                placeholder="请再次输入密码"
                maxlength="16"
                underline
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="xm">
              <el-input v-model="addData.xm" placeholder="请输入真实姓名" maxlength="15" underline></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" prop="gmsfhm">
              <el-input v-model="addData.gmsfhm" placeholder="请输入身份证号" maxlength="18" underline></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="telephone">
              <el-input v-model="addData.telephone" placeholder="请输入联系电话" maxlength="11" underline></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="有效期限" prop="expiredTime">
              <hd-date-picker
                type="date"
                v-model="addData.expiredTime"
                :keep-time="new Date().getTime() + $app.userExpireTime"
                placeholder="请选择有效期限"
                underline
              ></hd-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="管辖机构" prop="orgId">
              <hd-organ v-model="addData.orgId" placeholder="请选择管辖机构" underline></hd-organ>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行政区划" prop="regionId">
              <hd-region v-model="addData.regionId" placeholder="请选择行政区划" underline></hd-region>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="警  号" prop="policeId">
              <el-input v-model="addData.policeId" placeholder="请输入警号" maxlength="15" underline></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否边防用户" prop="isBfUser" label-width="110px">
              <el-radio-group prop="isBfUser" v-model="addData.isBfUser" underline>
                <el-radio :label="'1'">是</el-radio>
                <el-radio :label="'0'">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="orgSsbm">
              <hd-organ v-model="addData.orgSsbm" placeholder="请选择所属部门" isShowDept underline></hd-organ>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属警种" prop="jz">
              <hd-dict-select
                prop="jz"
                v-model="addData.jz"
                placeholder="请选择所属警种"
                :dict-code="$global.dictType.zzmhJzxx"
                filterable
                underline
              ></hd-dict-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="hdty-card">
        <div class="hdty-card-header">
          <div class="hdty-card-title">
            <span>分配用户角色</span>
          </div>
        </div>
        <div class="hdty-card-body">
          <el-form
            :model="queryData"
            :rules="rules"
            ref="queryRef"
            inline
            @submit.native.prevent
            @keyup.enter.native="handleQuery"
          >
            <hd-query>
              <el-form-item label="角 色 名" prop="name">
                <el-input v-model="queryData.name" placeholder="请输入角色名"></el-input>
              </el-form-item>
              <el-form-item label="客 户 端" prop="clientType">
                <hd-dict-radio
                  v-model="queryData.clientType"
                  :dict-code="$global.dictType.clientType"
                  show-all-button
                ></hd-dict-radio>
              </el-form-item>
              <el-button type="info" icon="el-icon-search" @click="handleQuery">查询</el-button>
            </hd-query>
          </el-form>
          <el-table
            :data="tableData"
            :empty-text="emptyText"
            row-key="id"
            ref="tableRef"
            v-loading="loading"
            @sort-change="handleSortChange"
            @selection-change="handleSelectionChange"
            border
          >
            <el-table-column fixed type="selection" reserve-selection align="center" width="50"></el-table-column>
            <el-table-column
              fixed
              type="index"
              :index="setIndex"
              label="序号"
              class-name="is-index"
              align="center"
              width="50"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="角色名"
              sortable="custom"
              header-align="center"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="clientTypeList"
              label="客户端"
              sortable="custom"
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
            <el-table-column
              prop="memo"
              label="描述"
              sortable="custom"
              header-align="center"
              min-width="180"
            ></el-table-column>
          </el-table>
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :current-page="pageOptions.current"
            :page-sizes="pageOptions.sizes"
            :page-size="pageOptions.size"
            :total="pageOptions.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
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
import { addUser, checkIdCard, checkUsername } from '@/api/user';
import { getUserAddRolePage } from '@/api/role';
export default {
  name: 'UserAdd',
  provide() {
    return {
      hdAdd: this
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
          id: '',
          username: this.addData.username
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
          id: '',
          gmsfhm: this.addData.gmsfhm
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
      // 表单
      addData: {
        username: '',
        password: '',
        checkPass: '',
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
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 8,
            max: 16,
            message: '长度在 8 到 16 个字符',
            trigger: 'blur'
          },
          { validator: validatePassword, trigger: 'blur' },
          {
            validator: this.$utilValidate.validatePasswordNormal,
            trigger: 'blur'
          }
        ],
        checkPass: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          {
            min: 8,
            max: 16,
            message: '长度在 8 到 16 个字符',
            trigger: 'blur'
          },
          { validator: validateCheckPass, trigger: 'blur' }
        ],
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
      // 查询
      queryData: {
        name: '',
        clientType: ''
      },
      // 表格
      tableData: [],
      // 当前操作行
      activeRow: {},
      // 选中行
      selectedRows: [],
      // 缓存数据
      cacheData: {
        tableData: []
      },
      // 显示
      visible: false
    };
  },
  methods: {
    // 加载表单之前
    beforeLoadForm() {
      this.loadList();
    },
    // 获取数据表格
    loadList() {
      let _this = this;
      _this.loading = true;
      let dataParams = {
        ..._this.queryData,
        ..._this.pageOptions
      };
      // Lambda写法
      getUserAddRolePage(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.pageOptions.total = data.total;
            // 缓存数据
            if (_this.cacheData.tableData.length < 1) {
              data.records.forEach((row) => {
                row.cxfwOrgId = '';
                row.cxfwOrgName = '';
                row.endDate = '';
              });
              _this.tableData = data.records;
            } else {
              data.records.forEach((row) => {
                let findData = _this.cacheData.tableData.find(
                  (e) => e.id === row.id
                );
                if (findData) {
                  row.cxfwOrgId = findData.cxfwOrgId;
                  row.cxfwOrgName = findData.cxfwOrgName;
                  row.endDate = findData.endDate;
                }
              });
              _this.tableData = data.records;
            }
            _this.cacheData.tableData = _this.tableData;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.$refs.tableRef.doLayout();
          _this.loading = false;
        });
    },
    // 查询
    handleQuery() {
      let _this = this;
      _this.$refs.queryRef.validate((valid) => {
        if (valid) {
          _this.pageOptions.current = 1;
          _this.$refs.tableRef.clearSelection();
          _this.selectedRows = [];
          _this.cacheData.tableData = [];
          _this.loadList();
        }
      });
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          if (_this.selectedRows.length === 0) {
            _this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: '请至少选择一个角色',
              type: 'error'
            });
            return;
          }
          _this.submitting = true;
          _this.addData.roleInfoList = [];
          _this.selectedRows.forEach((row) => {
            _this.addData.roleInfoList.push({
              roleId: row.id,
              cxfwOrgId: row.cxfwOrgId,
              endDate: row.endDate
            });
          });
          // 参数
          let dataParams = {
            ..._this.addData,
            password: _this.$crypto.md5(_this.addData.password),
            checkPass: _this.$crypto.md5(_this.addData.checkPass)
          };
          // Lambda写法
          addUser(dataParams)
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
                _this.resetForm();
                _this.hdList.handleQuery();
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
      let _this = this;
      if (!_this.$app.roleMultipleEnabled && val.length > 1) {
        _this.$nextTick(() => {
          _this.$refs.tableRef.toggleRowSelection(val[0], false);
        });
      }
      _this.selectedRows = val;
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
      this.$refs.formRef.resetFields();
      this.$refs.queryRef.resetFields();
      this.pageOptions.current = 1;
      this.$refs.tableRef.clearSelection();
      this.selectedRows = [];
      this.cacheData.tableData = [];
      this.loadList();
    }
  }
};
</script>

<style scoped>
</style>
