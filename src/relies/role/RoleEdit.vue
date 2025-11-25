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
        label-width="100px"
        @submit.native.prevent
        @keyup.enter.native="submitForm">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="editData.name" placeholder="请输入角色名称" maxlength="20" underline></el-input>
          </el-form-item>
          <el-form-item label="共享机构" prop="orgId">
            <hd-organ prop="orgName" v-model="editData.orgId" :model-text.sync="extendData.orgName" placeholder="请选择所属机构" underline></hd-organ>
          </el-form-item>
          <el-form-item label="描  述" prop="memo">
            <el-input v-model="editData.memo" type="textarea" :rows="3" placeholder="请输入角色描述" maxlength="200" underline></el-input>
          </el-form-item>
          <el-form-item label="客 户 端" prop="clientTypeList">
            <hd-dict-checkbox v-model="editData.clientTypeList" :dict-code="$global.dictType.clientType" @currentChanged="handleClientTypeChange"></hd-dict-checkbox>
          </el-form-item>
        </hd-component>
      </el-form>
      <div class="hdty-card">
        <div
          class="hdty-card-body"
          v-loading="loading"
          element-loading-text="渲染权限控制器中">
          <el-collapse v-model="activeNames">
            <el-collapse-item
              v-for="(value, key) in treeData"
              v-show="editData.clientTypeList.indexOf(key) !== -1"
              :title="handleMatchName(key)"
              :name="key"
              :key="key">
              <el-tree
                ref="menuTree"
                node-key="id"
                :data="value"
                default-expand-all
                :default-checked-keys="defaultCheckedKeys[key]"
                :check-strictly="checkStrictly"
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
  import { checkRoleName, editOne, getEditDetail } from '@/api/role';
  import { getMenuSelectTree } from '@/api/menu';
  import { getList } from "@/api/dict-item";
  export default {
    name: "RoleEdit",
    provide() {
      return {
        hdEdit: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      let validateRoleName = (rule, value, callback) => {
        if (value) {
          let dataParams = {
            id: this.row.id,
            name: this.editData.name
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
        // 表单
        editData: {
          name: '',
          orgId: '',
          memo: '',
          clientTypeList:[],
          menuIdList: []
        },
        extendData: {},
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
        // 行
        row: {},
        // 菜单树数据集合
        treeData: {},
        // 默认选中的节点的key的集合
        defaultCheckedKeys: [],
        // 客户端数据
        clientData: [],
        // 要展示的name集合
        activeNames: [],
        // 是否严格遵守父子节点不互相关联
        checkStrictly: false,
        // 缓存数据
        cacheData: {
          clientTypeList: []
        },
        // 显示
        visible: false,
      };
    },
    watch:{
      activeNames() {
        for (let [i, v] of Object.keys(this.treeData).entries()) {
          if (!this.editData.clientTypeList.find(e => e === v)) {
            this.$refs.menuTree[i].setCheckedKeys([]);
          }
        }
      }
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
        // 参数
        let dataParams = {
          id: _this.row.id
        };
        // Lambda写法
        getEditDetail(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.editData.name = data.name;
            _this.editData.orgId = data.orgId;
            _this.editData.memo = data.memo;
            _this.editData.clientTypeList = data.clentTypeList;
            _this.cacheData.clientTypeList = _this.editData.clientTypeList;
            _this.extendData.orgName = data.orgName;
            _this.activeNames = data.clentTypeList;
            _this.defaultCheckedKeys = data.menuIdMaps;
            _this.getClientData();
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.$refs.formRef.clearValidate();
        });
      },
      // 查询客户端数据
      getClientData(){
        let _this = this;
        // 参数
        let dataParams = {
          typeId: _this.$global.dictType.clientType
        };
        getList(dataParams).then(response => {
          let { success, data } = response.data;
          if (success) {
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
        _this.loading = true;
        let currentClientKeys = [];
        _this.clientData.forEach(item => {
          currentClientKeys.push(item.key)
        });
        let dataParams = {
          clientTypeList: currentClientKeys
        };
        getMenuSelectTree(dataParams).then(response => {
          let { success, data } = response.data;
          if(success) {
            _this.checkStrictly = true;
            _this.treeData = data;
            _this.$nextTick(() => {
              _this.checkStrictly = false;
              _this.loading = false;
            });
          }
        }).catch(error => {
          _this.loading = false;
          // 响应错误回调
          console.error(error);
        });
      },
      // 匹配客户端名称
      handleMatchName(val) {
        let name = 'Web';
        let obj = this.clientData.find(e => e.key===val);
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
            _this.editData.menuIdList = [];
            for (let e of _this.$refs.menuTree) {
              e.getCheckedNodes(false, true).forEach(item => {
                _this.editData.menuIdList.push(item.id);
              });
            }
             _this.editData.id = _this.row.id;
            // 参数
            let dataParams = {
              ..._this.editData,
            };
            // Lambda写法
            editOne(dataParams).then(response => {
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
            }).catch(error => {
              // 响应错误回调
              console.error(error);
            }).finally(() => {
              _this.submitting = false;
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
        this.$nextTick(() =>{
          this.$refs.formRef.resetFields();
          this.$refs.componentRef.resetFields();
          this.editData.clientTypeList = [];
          this.activeNames = [];
          this.treeData = {};
          this.defaultCheckedKeys = {};
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .hdty-card {
    min-height: 56px;
  }
  .hdty-card-body {
    padding: 0 24px;
  }
  ::v-deep .el-loading-spinner {
    margin-top: -8px;
    .circular {
      width: 36px;
      height: 36px;
    }
    .el-loading-text {
      line-height: 1;
    }
  }
</style>
