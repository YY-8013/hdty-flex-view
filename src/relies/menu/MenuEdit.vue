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
          <el-form-item
            label="菜单名称"
            prop="name">
            <el-input
              v-model="editData.name"
              placeholder="请输入菜单名称"
              maxlength="50"
              underline>
            </el-input>
          </el-form-item>
          <el-form-item
            label="插件"
            prop="pluggableId" v-if="editData.clientType === $global.dictItem.clientType.appTerminal && (editData.appLinkType === $global.dictItem.appLinkType.pluggable || editData.appLinkType === $global.dictItem.appLinkType.third || editData.appLinkType === $global.dictItem.appLinkType.html5)">
            <hd-table-select :api="pluggableSelectOptions.api"
                             :props="pluggableSelectOptions.prop"
                             :columns="pluggableSelectOptions.columns"
                             :searches="pluggableSelectOptions.searches"
                             v-model="editData.pluggableId"
                             :model-text.sync="editData.pluggableName"
                             :dialogSize="'small'"
                             underline placeholder="请选择插件"
            ></hd-table-select>
          </el-form-item>
          <el-form-item
            label="菜单代码"
            prop="url"
            :rules="(editData.url !== 'Home' && editData.clientType !== $global.dictItem.clientType.appTerminal) ? editData.type === $global.dictItem.menuType.branchNode ? rules.url1 : rules.url2 : {}">
            <el-input
              v-model="editData.url"
              placeholder="请输入菜单代码；如ExampleList"
              maxlength="50"
              :disabled="editData.url === 'Home'"
              underline
              @input="handleUrlInput">
            </el-input>
          </el-form-item>
          <el-form-item
            label="跳转路径"
            prop="path"
            :rules="(editData.url === 'Home' || editData.clientType === $global.dictItem.clientType.appTerminal) ? {} : rules.path">
            <el-input
              v-model="editData.path"
              placeholder="请输入跳转路径；如/example/list"
              maxlength="100"
              :disabled="editData.url === 'Home'"
              underline>
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="菜单图标"
                prop="icon">
                <hd-iconfont
                  v-model="editData.icon"
                  placeholder="请选择菜单图标"
                  :disabled="editData.url === 'Home'"
                  underline>
                </hd-iconfont>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="客 户 端"
                prop="clientType">
                <hd-dict-radio
                  prop="clientType"
                  v-model="editData.clientType"
                  :model-text.sync="extendData.clientType"
                  :dict-code="$global.dictType.clientType"
                  underline
                  @currentChanged="handleClientTypeChange">
                </hd-dict-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item
            label="父级菜单"
            prop="parentId">
            <hd-menu
              ref="menuRef"
              prop="parentValue"
              v-model="editData.parentId"
              :model-text.sync="extendData.parentValue"
              :client-type="editData.clientType"
              placeholder="请选择父级菜单"
              :disabled="editData.url === 'Home'"
              underline
              @currentChanged="handleParentMenuChange">
            </hd-menu>
          </el-form-item>
          <el-form-item
            label="重 定 向"
            prop="redirect">
            <el-input
              v-model="editData.redirect"
              placeholder="请输入重定向；如/example/list"
              maxlength="100"
              underline>
            </el-input>
          </el-form-item>
          <el-form-item
            label="订阅主题"
            prop="mqttTopic">
            <hd-dict-cascader
              prop="mqttTopic"
              v-model="editData.mqttTopic"
              :model-text.sync="extendData.mqttTopic"
              :dict-code="$global.dictType.msgTopic"
              filterable
              placeholder="请选择订阅主题"
              underline>
            </hd-dict-cascader>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="菜单类型"
                prop="type">
                <hd-dict-radio
                  v-model="editData.type"
                  :dict-code="$global.dictType.menuType"
                  @currentChanged="handleTypeChange">
                </hd-dict-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="菜单性质"
                prop="isNavigation">
                <hd-dict-radio
                  prop="isNavigation"
                  v-model="editData.isNavigation"
                  :model-text.sync="extendData.isNavigation"
                  :dict-code="$global.dictType.menuProperty">
                </hd-dict-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="无权限隐藏" prop="isAuthorityHide" v-if="editData.clientType === $global.dictItem.clientType.appTerminal">
            <hd-dict-radio v-model="editData.isAuthorityHide" :model-text.sync="extendData.clientType" :dict-code="$global.dictType.isOrNot" underline></hd-dict-radio>
          </el-form-item>
          <el-form-item label="跳转类型" prop="appLinkType" v-if="editData.clientType === $global.dictItem.clientType.appTerminal">
            <hd-dict-radio v-model="editData.appLinkType" :dict-code="$global.dictType.appLinkType" underline @currentChanged="handleAppLinkTypeChanged"></hd-dict-radio>
          </el-form-item>
          <div
            v-if="editData.type === $global.dictItem.menuType.leafNode"
            class="hdty-card">
            <div class="hdty-card-header">
              <div class="hdty-card-title">
                <el-button
                  type="success"
                  icon="el-icon-circle-plus-outline"
                  @click="handleAddAuthority">
                  添加操作权限
                </el-button>
                <el-checkbox
                  v-model="checked">
                  自定义操作
                </el-checkbox>
              </div>
            </div>
            <div class="hdty-card-body">
              <el-table
                ref="treeTableRef"
                :data="authorityData"
                row-key="uuid"
                border
                @selection-change="handleSelectionChange">
                <el-table-column
                  fixed
                  type="selection"
                  reserve-selection
                  align="center"
                  width="40">
                </el-table-column>
                <el-table-column
                  fixed
                  type="index"
                  label="序号"
                  class-name="is-plain"
                  align="center"
                  width="40">
                </el-table-column>
                <el-table-column
                  fixed
                  label="名称"
                  header-align="center"
                  width="100">
                  <template slot-scope="scope">
                    <el-input
                      v-if="scope.row.canEdit || !scope.row.isDefault"
                      v-model="scope.row.name"
                      placeholder="名称"
                      maxlength="50">
                    </el-input>
                    <span v-else>{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="标识符"
                  header-align="center"
                  width="100">
                  <template slot-scope="scope">
                    <el-input
                      v-if="scope.row.canEdit || !scope.row.isDefault"
                      v-model="scope.row.url"
                      placeholder="标识符"
                      maxlength="50">
                    </el-input>
                    <span v-else>{{ scope.row.url }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="图标"
                  header-align="center"
                  width="90">
                  <template slot-scope="scope">
                    <hd-iconfont
                      v-if="scope.row.canEdit || !scope.row.isDefault"
                      v-model="scope.row.icon"
                      echo-icon
                      placeholder="图标">
                    </hd-iconfont>
                    <i v-else :class="scope.row.icon"></i>
                  </template>
                </el-table-column>
                <el-table-column
                  label="权限"
                  header-align="center"
                  min-width="160">
                  <template slot-scope="scope">
                    <el-input
                      v-model="scope.row.authority"
                      placeholder="可访问资源"
                      maxlength="100">
                    </el-input>
                  </template>
                </el-table-column>
                <el-table-column
                  label="订阅主题"
                  header-align="center"
                  min-width="160">
                  <template slot-scope="scope">
                    <hd-dict-cascader
                      v-model="scope.row.mqttTopic"
                      :model-text.sync="scope.row.mqttTopicText"
                      :dict-code="$global.dictType.msgTopic"
                      filterable
                      placeholder="请选择订阅主题">
                    </hd-dict-cascader>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div
            v-if="editData.url !== 'Home' && editData.type === $global.dictItem.menuType.leafNode"
            class="hdty-card">
            <div class="hdty-card-header">
              <div class="hdty-card-title">
                填写路由配置
              </div>
            </div>
            <div class="hdty-card-body">
              <el-form-item
                label="路由视图"
                prop="viewType">
                <hd-dict-radio
                  v-model="editData.viewType"
                  :dict-code="$global.dictType.routerViewType"
                  underline>
                </hd-dict-radio>
              </el-form-item>
              <el-form-item
                label="跳转方式"
                prop="linkType">
                <hd-dict-radio
                  v-model="editData.linkType"
                  :dictCode="$global.dictType.linkType"
                  underline>
                </hd-dict-radio>
              </el-form-item>
              <el-row
                v-if="editData.linkType===$global.dictItem.linkType.system">
                <el-form-item
                  label="链接系统"
                  prop="subSystemId">
                  <hd-table-select
                    prop="subSystemId"
                    :api="joinsysSelectOptions.api"
                    :props="joinsysSelectOptions.props"
                    :columns="joinsysSelectOptions.columns"
                    :searches="joinsysSelectOptions.searches"
                    v-model="editData.subSystemId"
                    :model-text.sync="extendData.subSystemId"
                    placeholder="请选择链接系统"
                    underline>
                  </hd-table-select>
                </el-form-item>
              </el-row>
              <el-row
                v-if="(editData.linkType===$global.dictItem.linkType.system || editData.linkType===$global.dictItem.linkType.website) && editData.clientType !== $global.dictItem.clientType.appTerminal">
                <el-col :span="12">
                  <el-form-item
                    label="请求路径"
                    prop="targetPath">
                    <el-input
                      v-model="editData.targetPath"
                      placeholder="请输入请求路径；如/example/list"
                      maxlength="200"
                      underline>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="请求参数"
                    prop="requestParams">
                    <el-input
                      v-model="editData.requestParams"
                      placeholder="请输入请求参数；如id=1"
                      maxlength="200"
                      underline>
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                label="组件位置"
                prop="component"
                v-if="editData.clientType !== $global.dictItem.clientType.appTerminal">
                <el-input
                  v-model="editData.component"
                  placeholder="请输入组件位置；如views/example/ExampleList"
                  maxlength="100"
                  underline>
                </el-input>
              </el-form-item>
              <el-row v-if="editData.clientType !== $global.dictItem.clientType.appTerminal">
                <el-col :span="12">
                  <el-form-item
                    label="是否缓存"
                    prop="keepAlive">
                    <hd-dict-radio
                      v-model="editData.keepAlive"
                      :dict-code="$global.dictType.isOrNot"
                      underline>
                    </hd-dict-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    label="是否放行"
                    prop="loosened">
                    <hd-dict-radio
                      v-model="editData.loosened"
                      :dict-code="$global.dictType.isOrNot"
                      underline>
                    </hd-dict-radio>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                label="参  数"
                prop="params">
                <hd-json-editor
                  v-model="editData.params"
                  maxlength="200">
                </hd-json-editor>
              </el-form-item>
            </div>
          </div>
        </hd-component>
      </el-form>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {hdForm} from "@/utils/util-framework";
import {editOne, editOneSup, getEditDetail, pluggablePage, validateUrl} from '@/api/menu';

export default {
    name: "MenuEdit",
    provide() {
      return {
        hdEdit: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      let validatorUrl = (rule, value, callback) => {
        let _this = this;
        let dataParams = {
          id: _this.editData.id,
          url: value,
          clientType: _this.editData.clientType
        };
        // Lambda写法
        validateUrl(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            if (!data.pass) {
              callback(new Error('该菜单代码已存在'));
            } else {
              callback();
            }
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
          callback(new Error('验证时发生错误，请重试'));
        });
      };
      return {
        // 接入系统选择器配置项
        joinsysSelectOptions: this.hdList.joinsysSelectOptions,
        // 表单
        editData: {
          name: '',
          url: '',
          path: '',
          icon: '',
          clientType: '',
          parentId: '',
          redirect: '',
          mqttTopic: '',
          type: '',
          isNavigation: '',
          pageElementList: [],
          viewType: this.$global.dictItem.routerViewType.Layout,
          linkType: this.$global.dictItem.linkType.default,
          subSystemId: '',
          targetPath: '',
          requestParams: '',
          component: '',
          keepAlive: '',
          loosened: '',
          params: null,
          appLinkType: this.$global.dictItem.isOrNot.not,
          pluggableId: '',
          pluggableName: '',
          isAuthorityHide: this.$global.dictItem.isOrNot.not,
        },
        extendData: {
          clientType: '',
          parentValue: '',
          mqttTopic: '',
          isNavigation: '',
          subSystemId: '',
        },
        // 验证
        rules: {
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          url1: [
            { required: true, message: '请输入菜单代码', trigger: 'blur' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
            { validator: this.$utilValidate.validateLetterFirstUppercase, trigger: 'blur' },
            { validator: this.$utilValidate.validateRouteName, trigger: 'blur' },
            { validator: validatorUrl, trigger: 'blur' }
          ],
          url2: [
            { required: true, message: '请输入菜单代码', trigger: 'blur' },
            { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' },
            { pattern: /^[A-Z][A-Za-z0-9]*[A-Z][A-Za-z]*$/, message: '请输入英文，首字母必须大写，且至少含有两个大写字母', trigger: 'blur' },
            { validator: this.$utilValidate.validateRouteName, trigger: 'blur' },
            { validator: validatorUrl, trigger: 'blur' }
          ],
          path: [
            { required: true, message: '请输入跳转路径', trigger: 'blur' },
            { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' },
            { validator: this.$utilValidate.validateSlashBegin, trigger: 'blur' },
            { validator: this.$utilValidate.validateRoutePath, trigger: 'blur' }
          ],
          clientType: [
            { required: true, message: '请选择客户端', trigger: 'change' }
          ],
          type: [
            { required: true, message: '请选择菜单类型', trigger: 'change' }
          ],
          isNavigation: [
            { required: true, message: '请选择菜单性质', trigger: 'change' }
          ],
          viewType: [
            { required: true, message: '请选择路由视图', trigger: 'change' }
          ],
          linkType: [
            { required: true, message: '请选择跳转方式', trigger: 'change' }
          ],
          subSystemId: [
            { required: true, message: '请选择链接系统', trigger: 'change' },
          ],
          targetPath: [
            { required: true, message: '请输入请求路径', trigger: 'blur' },
          ],
          component: [
            { required: true, message: '请输入组件位置', trigger: 'blur' },
            { validator: this.$utilValidate.validateSlashNonBegin, trigger: 'blur' }
          ],
          keepAlive: [
            { required: true, message: '请选择是否缓存', trigger: 'change' }
          ],
          loosened: [
            { required: true, message: '请选择是否放行', trigger: 'change' }
          ]
        },
        // 权限菜单数据
        authorityData: [],
        // 是否添加基础按钮
        checked: true,
        // 未选择的基础权限按钮集合
        unCheckedList: [],
        // 缓存数据
        cacheData: {
          clientType: '',
          parentId: '',
          parentValue: ''
        },
        // 行
        row: {},
        // 显示
        visible: false,
        // 插件选择器
        pluggableSelectOptions: {
          api: pluggablePage,
          prop: {
            value: 'vo.pluggableId',
            label: 'vo.pluggableName',
            response: 'records'
          },
          columns: [
            {
              field: 'vo.pluggableName',
              label: '插件名称',
              fixed: true,
              width: '250'
            },
            {
              field: 'vo.versionNum',
              label: '版本编号',
              fixed: true,
              width: '140'
            },
            {
              field: 'vo.ispublish',
              label: '是否发布',
              fixed: true,
              minWidth: '100'
            }
          ],
          searches: [
            [
              {
                field: 'systemName',
                label: '系统名称',
                type: 'factorInput',
                factor: 'between',
                placeholder: '请输入系统名称'
              }
            ]
          ]
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
        _this.checked = true;
        let dataParams = {
          id: _this.row.id
        };
        getEditDetail(dataParams).then(response => {
          let { success, data } = response.data;
          if (success) {
            _this.editData = data;
            _this.extendData.parentValue = data.parentValue;
            _this.extendData.mqttTopic = data.mqttTopicText;
            _this.extendData.subSystemId = data.subSystemIdText;
            _this.authorityData = data.pageElementList;
            _this.cacheData.clientType = data.clientType;
            _this.cacheData.parentId = data.parentId;
            _this.cacheData.parentValue = data.parentValue;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.$refs.formRef.clearValidate();
          _this.toggleSelection();
        });
        // 初始化未选择的基础权限按钮
        editOneSup(dataParams).then(response => {
          let { success, data } = response.data;
          if (success) {
            data.forEach(row => {
              row.uuid = _this.$utilStr.uuid(32, 16).toLowerCase();
              row.isDefault = true;
            });
            _this.unCheckedList = data;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        });
      },
      // 改变菜单代码
      handleUrlInput(val) {
        this.editData.path = val.replace(/([A-Z])/g, '/$1').toLowerCase();
      },
      // 改变客户端类型
      handleClientTypeChange(val) {
        if(val === this.cacheData.clientType) {
          this.editData.parentId = this.cacheData.parentId;
          this.extendData.parentValue = this.cacheData.parentValue;
        } else {
          this.editData.parentId = '';
          this.extendData.parentValue = '';
        }
      },
      // 改变父级菜单
      handleParentMenuChange(val, oldVal, selection) {
        if(selection) {
          this.cacheData.parentId = selection.id;
          this.cacheData.parentValue = selection.name;
        } else {
          this.cacheData.parentId = '';
          this.cacheData.parentValue = '';
        }
        this.cacheData.clientType = this.editData.clientType;
      },
      // 改变菜单类型
      handleTypeChange(val) {
        if(this.editData.url) {
          this.$refs.formRef.validateField('url');
        }
        if (val === this.$global.dictItem.menuType.branchNode) {
          this.editData.pageElementList = [];
        }
      },
      // 选中行
      toggleSelection() {
        if (this.authorityData) {
          this.authorityData.forEach(row => {
            this.$refs.treeTableRef.toggleRowSelection(row);
          });
        }
      },
      // 添加操作权限
      handleAddAuthority() {
        if (this.checked) {
          // 添加自定义按钮
          this.authorityData.unshift({
            uuid: this.$utilStr.uuid(32, 16).toLowerCase(),
            canEdit: true
          });
        } else {
          // 添加基础权限按钮
          if (this.unCheckedList && this.unCheckedList.length > 0) {
            this.unCheckedList.forEach(item => {
              if(!this.authorityData.find(e => e.url === item.url)) {
                this.authorityData.unshift(item);
              }
            });
          }
        }
      },
      // 切换选中行
      handleSelectionChange(val) {
        this.editData.pageElementList = val;
      },
      // 验证操作权限
      authorityValidator() {
        let permitSubmitStatus = false;
        if (this.editData.pageElementList.length > 0) {
          this.editData.pageElementList.forEach(item => {
            if (item.canEdit) {
              if (!item.name) {
                permitSubmitStatus = true;
              }
              if (!item.url) {
                permitSubmitStatus = true;
              }
            }
          });
        }
        if(permitSubmitStatus) {
          this.$message({
            showClose: true,
            customClass: 'is-fixed',
            message: '操作权限名称或标识符不能为空',
            type: 'error'
          });
        }
        return permitSubmitStatus;
      },
      // 提交
      submitForm() {
        let _this = this;
        _this.$refs.formRef.validate((valid) => {
          if (valid) {
            if (_this.authorityValidator()) {
              return;
            }
            if(_this.editData.linkType===_this.$global.dictItem.linkType.website) {
              _this.editData.subSystemId = '';
            }
            // 参数
            let dataParams = {
              ..._this.editData
            };
            _this.submitting = true;
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
                _this.$refs.menuRef.reload();
                _this.hdList.updateCurrentRow({
                  ..._this.editData,
                  clientTypeValue: _this.extendData.clientType,
                  isNavigationValue: _this.extendData.isNavigation
                });
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
        this.$nextTick(() => {
          this.$refs.formRef.resetFields();
          this.$refs.componentRef.resetFields();
          this.authorityData = [];
        });
      },
      // app跳转类型切换
      handleAppLinkTypeChanged() {
        this.editData.pluggableId = '';
        this.editData.pluggableName = '';
      }
    }
  }
</script>

<style lang="scss" scoped>
  ::v-deep .hdty-card-title .el-checkbox {
    margin-left: 6px;
    .el-checkbox__label {
      padding-left: 6px;
    }
  }
</style>
