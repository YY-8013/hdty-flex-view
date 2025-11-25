<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        inline
        @submit.native.prevent
        @keyup.enter.native="handleQuery">
        <hd-query>
          <hd-query-fixed>
            <el-form-item label="真实姓名" prop="xm">
              <el-input v-model="queryData.xm" placeholder="请输入真实姓名"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="gmsfhm">
              <el-input v-model="queryData.gmsfhm" placeholder="请输入身份证号"></el-input>
            </el-form-item>
            <el-form-item prop="andor" slot="after">
              <hd-factor-logic v-model="queryData.andor"></hd-factor-logic>
            </el-form-item>
            <el-form-item prop="orgId" slot="after">
              <hd-organ v-model="queryData.orgId" placeholder="高级过滤：请选择管辖机构"></hd-organ>
            </el-form-item>
          </hd-query-fixed>
          <hd-query-expand>
            <el-row>
              <el-form-item label="用 户 名" prop="username">
                <el-input v-model="queryData.username" placeholder="请输入用户名"></el-input>
              </el-form-item>
              <el-form-item label="启用状态" prop="enable">
                <hd-dict-radio v-model="queryData.enable" :dict-code="$global.dictType.userEnable" show-all-button></hd-dict-radio>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="警  号" prop="policeId">
                <el-input v-model="queryData.policeId" placeholder="请输入警号"></el-input>
              </el-form-item>
              <el-form-item label="是否边防用户" prop="isBfUser">
                <hd-dict-radio v-model="queryData.isBfUser" :dict-code="$global.dictType.isOrNot" show-all-button></hd-dict-radio>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="联系电话" prop="telephone">
                <el-input v-model="queryData.telephone" placeholder="请输入联系电话"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="所属角色" prop="roleId">
                <hd-table-select
                  :api="roleSelectOptions.api"
                  :props="roleSelectOptions.props"
                  :columns="roleSelectOptions.columns"
                  :searches="roleSelectOptions.searches"
                  v-model="queryData.roleId"
                  placeholder="请选择所属角色">
                </hd-table-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="所属警种" prop="jz">
                <hd-dict-select
                  prop="jz"
                  v-model="queryData.jz"
                  placeholder="请选择所属警种"
                  :dict-code="$global.dictType.zzmhJzxx"
                  multiple
                  filterable>
                </hd-dict-select>
              </el-form-item>
              <el-form-item label="所属部门" prop="orgSsbm">
                <hd-organ v-model="queryData.orgSsbm" isShowDept placeholder="请选择部门"></hd-organ>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="注册时间" prop="createTime">
                <hd-date-picker type="datetimerange" v-model="queryData.createTime"></hd-date-picker>
              </el-form-item>
            </el-row>
          </hd-query-expand>
        </hd-query>
      </el-form>
      <hd-button-container>
        <hd-button
          name="query"
          type="info"
          icon="el-icon-search"
          @click="handleQuery">
          查询
        </hd-button>
        <hd-button
          icon="el-icon-delete"
          @click="handleClear">
          清空
        </hd-button>
        <hd-button
          name="add"
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd">
          新增
        </hd-button>
        <hd-button
          name="export"
          type="warning"
          icon="el-icon-upload2"
          :loading="exporting"
          @click="handleExport">
          导出
        </hd-button>
        <hd-button
          name="synchro"
          type="success"
          icon="icon-sync"
          :loading="synchronizing"
          @click="handleSynchro">
          同步认证中心
        </hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        row-key="vo.id"
        ref="tableRef"
        v-loading="loading"
        @sort-change="handleSortChange"
        border
        fit
        height="100%">
        <el-table-column
          fixed
          type="selection"
          reserve-selection
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          type="index"
          :index="setIndex"
          label="序号"
          class-name="is-index"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          label="操作"
          align="center"
          width="210">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.$index, scope.row)">
                详情
              </hd-button>
              <hd-button
                name="edit"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">
                编辑
              </hd-button>
              <hd-button
                name="delete"
                type="danger"
                :disabled="user.username===scope.row.vo.username"
                @click="handleDelete(scope.$index, scope.row)">
                删除
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="vo.username"
          label="用户名"
          sortable="custom"
          header-align="center"
          width="110">
        </el-table-column>
        <el-table-column
          prop="vo.roleNum"
          label="角色数"
          header-align="center"
          align="center"
          width="65">
          <template slot-scope="scope">
            <a href="javascript:;" underline @click="handleRoleList(scope.$index, scope.row)">
              <el-tag type="success">
                {{ scope.row.vo.roleNameList.length || 0 }}
              </el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.clientTypeList"
          label="客户端"
          :formatter="formatArray"
          header-align="center"
          width="110">
        </el-table-column>
        <el-table-column
          prop="vo.xm"
          label="真实姓名"
          sortable="custom"
          header-align="center"
          width="110">
        </el-table-column>
        <el-table-column
          prop="vo.gmsfhm"
          label="身份证号"
          sortable="custom"
          header-align="center"
          width="170">
        </el-table-column>
        <el-table-column
          prop="vo.telephone"
          label="联系电话"
          sortable="custom"
          header-align="center"
          width="110">
        </el-table-column>
        <el-table-column
          prop="vox.orgId"
          label="管辖机构"
          sortable="custom"
          header-align="center"
          min-width="260">
        </el-table-column>
        <el-table-column
          prop="vo.expiredTime"
          :formatter="formatDate"
          label="有效期限"
          sortable="custom"
          header-align="center"
          width="105">
        </el-table-column>
        <!--<el-table-column
          prop="vo.createTime"
          label="注册时间"
          sortable="custom"
          header-align="center"
          width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.vo.createTime)"></span>
          </template>
        </el-table-column>-->
        <el-table-column
          label="重置密码"
          header-align="center"
          align="center"
          width="80">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="reset"
                type="danger"
                @click="handleReset(scope.$index, scope.row)">
                重置
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.enable"
          label="启用状态"
          sortable="custom"
          header-align="center"
          width="105">
          <template slot-scope="scope">
            <el-switch
              :width="50"
              active-value="1"
              inactive-value="0"
              @change="handleEnableChange(scope.row.vo.id, scope.row.vo.enable)"
              v-model="scope.row.vo.enable">
            </el-switch>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="hdty-footer">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next, jumper"
        :current-page="pageOptions.current"
        :page-sizes="pageOptions.sizes"
        :page-size="pageOptions.size"
        :total="pageOptions.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <user-add ref="addRef"></user-add>
    <user-detail ref="detailRef"></user-detail>
    <user-edit ref="editRef"></user-edit>
    <role-link ref="roleLinkRef"></role-link>
  </div>
</template>

<script>
  import {hdList} from "@/utils/util-framework";
  import {changeUserEnable, deleteUser, exports, getUserList, resetPassword, synchro} from '@/api/user';
  import {getPageSelect} from '@/api/role';
  import UserAdd from './UserAdd';
  import UserDetail from './UserDetail';
  import UserEdit from './UserEdit';
  import RoleLink from '@/relies/role/RoleLink';

  export default {
    name: "UserList",
    provide() {
      return {
        hdList: this
      };
    },
    mixins: [hdList],
    components: {
      UserAdd,
      UserDetail,
      UserEdit,
      RoleLink
    },
    data() {
      return {
        // 角色选择器配置项
        roleSelectOptions: {
          api: getPageSelect,
          props: {
            value: 'id',
            label: 'name',
            response: 'records'
          },
          columns: [
            {
              field: 'name',
              label: '角色名',
              fixed: true,
              sortable: 'custom',
              width: '180'
            },
            {
              field: 'clientTypeList',
              label: '客户端',
              sortable: 'custom',
              width: '160'
            },
            {
              field: 'createTime',
              label: '创建时间',
              sortable: 'custom',
              type: 'datetime',
              width: '170'
            },
            {
              field: 'memo',
              label: '描述',
              sortable: 'custom',
              minWidth: '180'
            }
          ],
          searches: [
            [
              {
                field: 'name',
                label: '角色名',
                type: 'input',
                placeholder: '请输入角色名'
              },
              {
                field: 'clientType',
                label: '客户端',
                type: 'radio',
                dict: this.$global.dictType.clientType
              },
              {
                field: 'roleIds',
                value: [],
                pattern: 'selection'
              }
            ]
          ]
        },
        // 查询
        queryData: {
          username: '',
          enable: '',
          xm: '',
          gmsfhm: '',
          telephone: '',
          createTime: [],
          orgId: '',
          roleId: '',
          jz: [],
          orgSsbm: '',
          andor: this.$app.factorOptions.logicOpe.and
        },
        // 表格
        tableData: [],
        // 验证
        rules: {},
        // 登录用户信息
        user: this.$utilLogin.getUserInfo()
      }
    },
    mounted() {
      // 初始化数据表格
      this.loadList();
    },
    methods: {
      // 获取数据表格
      loadList() {
        let _this = this;
        if (_this.AUTHORITY_QUERY) {
          _this.loading = true;
          // 参数
          let dataParams = {
            ..._this.queryData,
            ..._this.pageOptions
          };
          // Lambda写法
          getUserList(dataParams).then(response => {
            // 响应成功回调
            let {success, data} = response.data;
            if (success) {
              _this.pageOptions.total = data.total;
              _this.tableData = data.records;
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.$refs.tableRef.doLayout();
            _this.loading = false;
          });
        }
      },
      // 查看该用户的角色列表
      handleRoleList(index, row) {
        this.$refs.roleLinkRef.visible = true;
        this.$refs.roleLinkRef.row = row;
        this.$refs.roleLinkRef.loadList();
      },
      // 切换启用状态
      handleEnableChange(id, enable) {
        changeUserEnable({id: id, enable: enable});
      },
      // 查询
      handleQuery() {
        let _this = this;
        _this.$refs.queryRef.validate((valid) => {
          if (valid) {
            _this.pageOptions.current = 1;
            _this.loadList();
          }
        });
      },
      // 清空
      handleClear() {
        this.$refs.queryRef.resetFields();
      },
      // 新增
      handleAdd() {
        this.$refs.addRef.visible = true;
        this.$refs.addRef.beforeLoadForm();
      },
      // 导出
      handleExport() {
        let _this = this;
        if (_this.validateExport()) {
          _this.exporting = true;
          // 参数
          let dataParams = {
            ..._this.queryData
          };
          // Lambda写法
          exports(dataParams).then(response => {
            // 响应成功回调
            _this.download(response);
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.exporting = false;
          });
        }
      },
      // 同步至认证中心
      handleSynchro() {
        let _this = this;
        if (_this.validateExport()) {
          _this.synchronizing = true;
          // 参数
          let dataParams = {
            ..._this.queryData
          };
          // Lambda写法
          synchro(dataParams).then(response => {
            let {success, msg} = response.data;
            // 响应成功回调
            if (success) {
              _this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: msg,
                type: 'success'
              });
              _this.handleQuery();
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.synchronizing = false;
          });
        }
      },
      // 详情
      handleDetail(index, row) {
        this.$refs.detailRef.visible = true;
        this.$refs.detailRef.row = row;
        this.$refs.detailRef.beforeLoadForm();
      },
      // 编辑
      handleEdit(index, row) {
        this.$refs.editRef.visible = true;
        this.$refs.editRef.row = row;
        this.$refs.editRef.beforeLoadForm();
      },
      // 删除
      handleDelete(index, row) {
        let _this = this;
        _this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 参数
          let dataParams = {
            id: row.vo.id
          };
          // Lambda写法
          deleteUser(dataParams).then(response => {
            // 响应成功回调
            let {success, msg} = response.data;
            if (success) {
              _this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: msg,
                type: 'success'
              });
              // 删除成功刷新列表
              _this.triggerDeletedReload();
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        }).catch(() => {});
      },
      // 密码重置
      handleReset(index, row) {
        let _this = this;
        this.$prompt('请输入重置密码', '提示', {
          customClass: 'is-required',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)])+$).{8,16}$/,
          inputErrorMessage: '请输入正确的密码[8~16位]，至少含有英文字母、数字或常用符号中的两种'
        }).then(({ value }) => {
          _this.$confirm('确定要重置密码吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // 参数
            let dataParams = {
              id: row.vo.id,
              password: _this.$crypto.md5(value),
            };
            // Lambda写法
            resetPassword(dataParams).then(response => {
              // 响应成功回调
              let {success, msg} = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
              }
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            });
          });
        }).catch(() => {});
      }
    }
  }
</script>
