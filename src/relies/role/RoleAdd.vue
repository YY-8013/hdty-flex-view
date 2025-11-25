<template>
  <el-dialog
    title="添加"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit
      v-loading="submitting"
      :element-loading-text="loadingText">
      <el-form
        :model="addData"
        :rules="rules"
        ref="formRef"
        label-width="100px"
        @submit.native.prevent
        @keyup.enter.native="submitForm">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addData.name" placeholder="请输入角色名称" maxlength="20" underline></el-input>
        </el-form-item>
        <el-form-item label="共享机构" prop="orgId">
          <hd-organ v-model="addData.orgId" placeholder="请选择所属机构" underline></hd-organ>
        </el-form-item>
        <el-form-item label="描  述" prop="memo">
          <el-input v-model="addData.memo" type="textarea" :rows="3" placeholder="请输入角色描述" maxlength="200" underline></el-input>
        </el-form-item>
        <el-form-item label="复制角色" prop="copyRoleId">
          <hd-table-select
            :api="roleSelectOptions.api"
            :props="roleSelectOptions.props"
            :columns="roleSelectOptions.columns"
            :searches="roleSelectOptions.searches"
            v-model="addData.copyRoleId"
            placeholder="请选择要复制的角色"
            underline
            @currentChanged="handleCopySelectChange">
          </hd-table-select>
        </el-form-item>
        <el-form-item label="客 户 端" prop="clientTypeList">
          <hd-dict-checkbox v-model="addData.clientTypeList" :dict-code="$global.dictType.clientType" @currentChanged="handleClientTypeChange"></hd-dict-checkbox>
        </el-form-item>
      </el-form>
      <div class="hdty-card">
        <div v-if="activeNames.length > 0" class="hdty-card-header hdty-clear">
          <div class="hdty-form-item">
            <div class="hdty-form-label">一键选择</div>
            <div class="hdty-form-content">
              <hd-build-checkbox
                :api="defaultButtonCheckboxOptions.api"
                v-model="quickCheck"
                @currentChanged="handleQuickSelectChange">
              </hd-build-checkbox>
            </div>
          </div>
        </div>
        <div class="hdty-card-body">
          <el-collapse v-model="activeNames">
            <el-collapse-item
              v-for="(value, key) in treeData"
              v-show="addData.clientTypeList.indexOf(key) !== -1"
              :title="handleMatchName(key)"
              :name="key"
              :key="key">
              <el-tree
                ref="menuTree"
                node-key="id"
                :data="value"
                default-expand-all
                :check-strictly="checkStrictly"
                :default-expanded-keys="defaultExpandedKeys"
                :default-checked-keys="defaultCheckedKeys[key]"
                show-checkbox
                :expand-on-click-node="false"
                :check-on-click-node="true">
                <span class="hdty-space-between" slot-scope="{ data }">
                  <span><i :class="data.icon" class="hdty-icon-left"></i>{{ data.name }}</span>
                  <span>{{ data.type === $global.dictItem.menuType.branchNode || data.type === $global.dictItem.menuType.leafNode ? data.clientType + ' / ' + (data.isNavigation ? data.isNavigation : '未知') : '操作' }}</span>
                </span>
              </el-tree>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { hdForm } from "@/utils/util-framework";
  import { addRole, checkRoleName, getPageSelect, getRoleMenuIds } from '@/api/role';
  import { getMenuSelectTree, getMenuDefaultBtnList, getMenuBtnKeyList } from '@/api/menu';
  import { getList } from "@/api/dict-item";
  export default {
    name: "RoleAdd",
    provide() {
      return {
        hdAdd: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      let validateRoleName = (rule, value, callback) => {
        if (value) {
          let dataParams = {
            id: '',
            name: this.addData.name
          };
          // Lambda写法
          checkRoleName(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              if (!data.pass) {
                callback(new Error('角色名已存在'));
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
        // 默认按钮复选框组配置项
        defaultButtonCheckboxOptions: {
          api: getMenuDefaultBtnList
        },
        // 表单
        addData: {
          name: '',
          orgId: '',
          memo: '',
          copyRoleId: '',
          clientTypeList: [],
          menuIdList: []
        },
        // 验证
        rules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' },
            { validator: validateRoleName, trigger: 'blur' }
          ],
          memo: [
            { max: 200, message: '长度必须小于 200 个字符', trigger: 'blur' }
          ],
          clientTypeList: [
            { required: true, message: '请选择客户端', trigger: 'change' }
          ]
        },
        // 一键选择
        quickCheck: [],
        // 菜单树数据集合
        treeData: {},
        // 客户端数据
        clientData: [],
        // 客户端key的集合
        clientKeys: [],
        // 要展示的name集合
        activeNames: [],
        // 默认展开的节点的key的数组
        defaultExpandedKeys: [],
        // 默认选中的节点的key的集合
        defaultCheckedKeys: {},
        // 是否严格遵守父子节点不互相关联
        checkStrictly: false,
        // 缓存数据
        cacheData: {
          clientTypeList: [],
          quickCheck: []
        },
        // 加载中提示文本
        loadingText: '',
        // 显示
        visible: false,
      };
    },
    watch:{
      activeNames() {
        for (let [i, v] of Object.keys(this.treeData).entries()) {
          if (!this.addData.clientTypeList.find(e => e === v)) {
            this.$refs.menuTree[i].setCheckedKeys([]);
            break;
          }
        }
      }
    },
    methods: {
      // 加载表单之前
      beforeLoadForm() {
        // 加载客户端数据
        this.loadClientData();
      },
      // 加载客户端数据
      loadClientData() {
        let _this = this;
        // 参数
        let dataParams = {
          typeId: _this.$global.dictType.clientType
        };
        getList(dataParams).then(response => {
          let { success, data } = response.data;
          if(success) {
            _this.clientData = data;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.loadMenuTree();
        });
      },
      // 加载菜单树
      loadMenuTree() {
        let _this = this;
        let currentClientKeys = [];
        _this.clientData.forEach(item => {
          currentClientKeys.push(item.key)
        });
        if (JSON.parse(JSON.stringify(currentClientKeys)).sort().toString()
          === JSON.parse(JSON.stringify(_this.clientKeys)).sort().toString()) {
          for (let e of _this.$refs.menuTree) {
            let currentCheckedNodes = e.getCheckedNodes(false, true);
            if (currentCheckedNodes && currentCheckedNodes.length > 0) {
              return;
            }
          }
        }
        _this.submitting = true;
        _this.loadingText = '渲染权限控制器中';
        _this.clientKeys = currentClientKeys;
        let dataParams = {
          clientTypeList: _this.clientKeys
        };
        getMenuSelectTree(dataParams).then(response => {
          let { success, data } = response.data;
          if(success) {
            _this.treeData = data;
            _this.$nextTick(() => {
              _this.submitting = false;
              _this.loadingText = '';
            });
          }
        }).catch(error => {
          _this.submitting = false;
          _this.loadingText = '';
          // 响应错误回调
          console.error(error);
        });
      },
      // 匹配客户端名称
      handleMatchName(val) {
        let name = 'Web';
        let obj = this.clientData.find(e => e.key === val);
        if(obj.value) {
          name = obj.value;
        }
        return name;
      },
      // 客户端选择
      handleClientTypeChange(val) {
        for (let [i, v] of this.cacheData.clientTypeList.entries()) {
          if(!val.find(e => e === v)) {
            this.activeNames.splice(i, 1);
            break;
          }
        }
        for (let v of val) {
          if(!this.cacheData.clientTypeList.find(e => e === v)) {
            this.activeNames.push(v);
            break;
          }
        }
        this.cacheData.clientTypeList = val;
      },
      // 复制角色
      handleCopySelectChange(val) {
        let _this = this;
        _this.checkStrictly = true;
        _this.resetChecked();
        _this.defaultCheckedKeys = {};
        let dataParams = {
          id: val
        };
        getRoleMenuIds(dataParams).then(response => {
          let { success, data } = response.data;
          if(success) {
            _this.addData.clientTypeList = data.clientTypes;
            _this.cacheData.clientTypeList = _this.addData.clientTypeList;
            _this.activeNames = data.clientTypes;
            for (let k in data.menuKeyObj) {
              if (data.menuKeyObj.hasOwnProperty(k)) {
                _this.defaultCheckedKeys[k] = data.menuKeyObj[k];
              }
            }
            _this.checkStrictly = false;
          }
        }).catch(error => {
          _this.checkStrictly = false;
          // 响应错误回调
          console.error(error);
        });
      },
      // 一键选择
      handleQuickSelectChange(val) {
        let _this = this;
        _this.checkStrictly = true;
        let removeQuickKey = [];
        for (let v of _this.cacheData.quickCheck) {
          if(!val.find(e => e === v)) {
            removeQuickKey.push(v);
            break;
          }
        }
        let currentTreeKey = {};
        _this.$refs.menuTree.forEach((e, i) => {
          let k = _this.clientData[i].key;
          if(_this.addData.clientTypeList.find(e => e === k)) {
            let checked = e.getCheckedNodes(false, true);
            if(checked && checked.length > 0) {
              currentTreeKey[k] = checked;
            }
          }
        });
        let dataParams = {
          clientTypes: _this.addData.clientTypeList,
          btnType: val,
          removeBtnType: removeQuickKey,
          currentKeys: currentTreeKey,
        };
        getMenuBtnKeyList(dataParams).then(response => {
          let { success, data } = response.data;
          if(success) {
            _this.cacheData.quickCheck = val;
            for (let [i, v] of Object.keys(this.treeData).entries()) {
              if (data[v] && data[v].length > 0) {
                _this.$refs.menuTree[i].setCheckedKeys(data[v]);
              } else {
                _this.$refs.menuTree[i].setCheckedKeys([]);
              }
            }
            _this.checkStrictly = false;
          }
        }).catch(error => {
          _this.checkStrictly = false;
          // 响应错误回调
          console.error(error);
        });
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid) => {
          if (valid) {
            // 验证必须选择菜单
            let checkCount = 0;
            for (let e of _this.$refs.menuTree) {
              if(e.getCheckedNodes(false, true).length > 0) {
                checkCount = 1;
                break;
              }
            }
            if(checkCount===0){
              _this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: '请至少选择一个菜单',
                type: 'error'
              });
              return;
            }
            _this.submitting = true;
            _this.addData.menuIdList = [];
            for (let e of _this.$refs.menuTree) {
              e.getCheckedNodes(false, true).forEach(item => {
                _this.addData.menuIdList.push(item.id);
              });
            }
            // 参数
            let dataParams = {
              ..._this.addData,
            };
            // Lambda写法
            addRole(dataParams).then(response => {
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
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            }).finally(() => {
              _this.submitting = false;
            });
          }
        });
      },
      // 清空选中
      resetChecked() {
        this.$refs.menuTree.forEach(e => {
          e.setCheckedKeys([]);
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
        this.resetChecked();
        this.defaultCheckedKeys = {};
        this.activeNames = [];
        this.quickCheck = [];
        this.cacheData.quickCheck = [];
        this.cacheData.clientTypeList = [];
      }
    }
  }
</script>

<style lang="scss" scoped>
  .hdty-form-item {
    float: right;
    margin-bottom: 4px;
    @include ft_font_color_second;
  }
  .hdty-form-content {
    max-width: 400px;
    padding-top: 3px;
  }
  .hdty-card-header {
    margin-top: -16px;
    padding-right: 0;
  }
  .hdty-card-body {
    padding: 0 24px;
  }
</style>
