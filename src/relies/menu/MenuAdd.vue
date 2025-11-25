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
              v-model="addData.name"
              placeholder="请输入菜单名称"
              maxlength="50"
              underline>
            </el-input>
          </el-form-item>
          <el-form-item
            label="插件"
            prop="pluggableId" v-if="addData.clientType === $global.dictItem.clientType.appTerminal && (addData.appLinkType === $global.dictItem.appLinkType.pluggable || addData.appLinkType === $global.dictItem.appLinkType.third || addData.appLinkType === $global.dictItem.appLinkType.html5)">
            <hd-table-select :api="pluggableSelectOptions.api"
                             :props="pluggableSelectOptions.prop"
                             :columns="pluggableSelectOptions.columns"
                             :searches="pluggableSelectOptions.searches"
                             v-model="addData.pluggableId"
                             :model-text.sync="extendData.pluggableId"
                             :dialogSize="'small'"
                             underline placeholder="请选择插件"
            ></hd-table-select>
          </el-form-item>
          <el-form-item
            label="菜单代码"
            prop="url"
            :rules="(addData.url !== 'Home' && addData.clientType !== $global.dictItem.clientType.appTerminal) ? addData.type === $global.dictItem.menuType.branchNode ? rules.url1 : rules.url2 : rules.url3">
            <el-input
              v-model="addData.url"
              placeholder="请输入菜单代码；如ExampleList"
              maxlength="50"
              underline
              @input="handleUrlInput">
            </el-input>
          </el-form-item>
          <el-form-item
            label="跳转路径"
            prop="path"
            :rules="(addData.url === 'Home' || addData.clientType === $global.dictItem.clientType.appTerminal) ? {} : rules.path">
            <el-input
              v-model="addData.path"
              placeholder="请输入跳转路径；如/example/list"
              maxlength="100"
              :disabled="addData.url === 'Home'"
              underline>
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="菜单图标"
                prop="icon">
                <hd-iconfont
                  v-model="addData.icon"
                  placeholder="请选择菜单图标"
                  :disabled="addData.url === 'Home'"
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
                  v-model="addData.clientType"
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
              v-model="addData.parentId"
              :client-type="addData.clientType"
              placeholder="请选择父级菜单"
              :disabled="addData.url === 'Home'"
              underline>
            </hd-menu>
          </el-form-item>
          <el-form-item
            label="重 定 向"
            prop="redirect">
            <el-input
              v-model="addData.redirect"
              placeholder="请输入重定向；如/example/list"
              maxlength="100"
              underline>
            </el-input>
          </el-form-item>
          <el-form-item
            label="订阅主题"
            prop="mqttTopic">
            <hd-dict-cascader
              v-model="addData.mqttTopic"
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
                  v-model="addData.type"
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
                  v-model="addData.isNavigation"
                  :model-text.sync="extendData.isNavigation"
                  :dict-code="$global.dictType.menuProperty">
                </hd-dict-radio>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="无权限隐藏" prop="isAuthorityHide" v-if="addData.clientType === $global.dictItem.clientType.appTerminal">
            <hd-dict-radio v-model="addData.isAuthorityHide" :model-text.sync="extendData.clientType" :dict-code="$global.dictType.isOrNot" underline></hd-dict-radio>
          </el-form-item>
          <el-form-item label="跳转类型" prop="appLinkType" v-if="addData.clientType === $global.dictItem.clientType.appTerminal">
            <hd-dict-radio v-model="addData.appLinkType" :dict-code="$global.dictType.appLinkType" underline @currentChanged="handleAppLinkTypeChanged"></hd-dict-radio>
          </el-form-item>
          <div
            v-if="addData.type === $global.dictItem.menuType.leafNode"
            class="hdty-card">
            <div class="hdty-card-header">
              <div class="hdty-card-title">
                <el-button
                  type="success"
                  icon="el-icon-circle-plus-outline"
                  @click="handleAddAuthority">
                  添加操作权限
                </el-button>
              </div>
            </div>
            <div class="hdty-card-body">
              <el-table
                :data="tableData"
                row-key="id"
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
                      v-if="scope.row.canEdit"
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
                      v-if="scope.row.canEdit"
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
                      v-if="scope.row.canEdit"
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
            v-if="addData.url !== 'Home' && addData.type === $global.dictItem.menuType.leafNode"
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
                  v-model="addData.viewType"
                  :dict-code="$global.dictType.routerViewType"
                  underline>
                </hd-dict-radio>
              </el-form-item>
              <el-form-item
                label="跳转方式"
                prop="linkType">
                <hd-dict-radio
                  v-model="addData.linkType"
                  :dictCode="$global.dictType.linkType"
                  underline>
                </hd-dict-radio>
              </el-form-item>
              <el-row
                v-if="addData.linkType===$global.dictItem.linkType.system">
                <el-form-item
                  label="链接系统"
                  prop="subSystemId">
                  <hd-table-select
                    :api="joinsysSelectOptions.api"
                    :props="joinsysSelectOptions.props"
                    :columns="joinsysSelectOptions.columns"
                    :searches="joinsysSelectOptions.searches"
                    v-model="addData.subSystemId"
                    placeholder="请选择链接系统"
                    underline>
                  </hd-table-select>
                </el-form-item>
              </el-row>
              <el-row
                v-if="(addData.linkType===$global.dictItem.linkType.system || addData.linkType===$global.dictItem.linkType.website) && addData.clientType !== $global.dictItem.clientType.appTerminal">
                <el-col :span="12">
                  <el-form-item
                    label="请求路径"
                    prop="targetPath">
                    <el-input
                      v-model="addData.targetPath"
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
                      v-model="addData.requestParams"
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
                v-if="addData.clientType !== $global.dictItem.clientType.appTerminal">
                <el-input
                  v-model="addData.component"
                  placeholder="请输入组件位置；如views/example/ExampleList"
                  maxlength="100"
                  underline>
                </el-input>
              </el-form-item>
              <el-row v-if="addData.clientType !== $global.dictItem.clientType.appTerminal">
                <el-col :span="12">
                  <el-form-item
                    label="是否缓存"
                    prop="keepAlive">
                    <hd-dict-radio
                      v-model="addData.keepAlive"
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
                      v-model="addData.loosened"
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
                  v-model="addData.params"
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
import {hdForm} from '@/utils/util-framework';
import {addMenu, beforeAddMenu, pluggablePage, validateUrl} from '@/api/menu';

export default {
    name: "MenuAdd",
    provide() {
      return {
        hdAdd: this
      };
    },
    inject: ['hdList'],
    mixins: [hdForm],
    data() {
      let validatorUrl = (rule, value, callback) => {
        let _this = this;
        let dataParams = {
          url: value,
          clientType: _this.addData.clientType
        };
        // Lambda写法
        validateUrl(dataParams).then(response => {
          // 响应成功回调
          let {success, data} = response.data;
          if (success) {
            if (!data.pass) {
              callback(new Error('菜单代码已存在'));
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
        addData: {
          name: '',
          url: '',
          path: '',
          icon: '',
          clientType: this.$global.dictItem.clientType.pcTerminal,
          parentId: '',
          redirect: '',
          mqttTopic: '',
          type: this.$global.dictItem.menuType.branchNode,
          isNavigation: this.$global.dictItem.menuProperty.nav,
          pageElementList: [],
          viewType: this.$global.dictItem.routerViewType.Layout,
          linkType: this.$global.dictItem.linkType.default,
          subSystemId: '',
          targetPath: '',
          requestParams: '',
          component: '',
          keepAlive: this.$global.dictItem.isOrNot.is,
          loosened: this.$global.dictItem.isOrNot.not,
          params: null,
          appLinkType: '0',
          pluggableId: '',
          isAuthorityHide: '0',
        },
        extendData: {
          clientType: '',
          isNavigation: '',
          pluggableId: '',
        },
        // 验证
        rules: {
          name: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
          ],
          url1: [
            { required: true, message: '请输入菜单代码', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
            { validator: this.$utilValidate.validateLetterFirstUppercase, trigger: 'blur' },
            { validator: this.$utilValidate.validateRouteName, trigger: 'blur' },
            { validator: validatorUrl, trigger: 'blur' }
          ],
          url2: [
            { required: true, message: '请输入菜单代码', trigger: 'blur' },
            { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' },
            { pattern: /^[A-Z][A-Za-z0-9]*[A-Z][A-Za-z]*$/, message: '请输入英文，首字母必须大写，且至少含有两个大写字母', trigger: 'blur' },
            { validator: this.$utilValidate.validateRouteName, trigger: 'blur' },
            { validator: validatorUrl, trigger: 'blur' }
          ],
          url3: [
            { required: true, message: '请输入菜单代码', trigger: 'blur' },
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
        // 表格
        tableData: [],
        // 缓存数据
        cacheData: {
          tableData: []
        },
        // 权限菜单数据
        authorityData: [],
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
        // 加载表单
        this.loadForm();
      },
      // 加载表单
      loadForm() {
        let _this = this;
        beforeAddMenu().then(response => {
          let { success, data } = response.data;
          if (success) {
            _this.authorityData = data.defaultPageElementList;
            // 缓存数据
            if (_this.cacheData.tableData.length < 1) {
              _this.tableData = _this.authorityData.concat([]);
              _this.cacheData.tableData = _this.tableData;
            } else {
              // 比较数组
              for (let row of _this.authorityData) {
                let prependData = _this.cacheData.tableData.find(e => e.url === row.url);
                if(!prependData) {
                  _this.cacheData.tableData.unshift(row);
                }
              }
              _this.tableData = _this.cacheData.tableData;
            }
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        });
      },
      // 改变菜单代码
      handleUrlInput(val) {
        if (val !== 'Home') {
          this.addData.path = val.replace(/([A-Z])/g, '/$1').toLowerCase();
        } else {
          this.addData.path = '/';
          this.addData.icon = 'icon-home-o';
          this.addData.parentId = '';
        }
      },
      // 改变客户端类型
      handleClientTypeChange() {
        this.addData.parentId = '';
      },
      // 改变菜单类型
      handleTypeChange(val) {
        if (this.addData.url) {
          this.$refs.formRef.validateField('url');
        }
        if (val === this.$global.dictItem.menuType.branchNode) {
          this.addData.pageElementList = [];
        }
      },
      // 添加自定义操作权限
      handleAddAuthority() {
        this.tableData.unshift({canEdit: true});
      },
      // 选择操作权限
      handleSelectionChange(val) {
        this.addData.pageElementList = val;
      },
      // 验证操作权限
      authorityValidator() {
        let permitSubmitStatus = false;
        if (this.addData.pageElementList.length > 0) {
          this.addData.pageElementList.forEach(item => {
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
        if (permitSubmitStatus) {
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
            _this.submitting = true;
            if(_this.addData.linkType===_this.$global.dictItem.linkType.website) {
              _this.addData.subSystemId = '';
            }
            // 参数
            let dataParams = {
              ..._this.addData
            };
            // Lambda写法
            addMenu(dataParams).then(response => {
              // 响应成功回调
              let { success, msg, data } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                _this.hdList.insertRow({
                  ..._this.addData,
                  id: data.id,
                  parentParentId: data.parentParentId,
                  clientTypeValue: _this.extendData.clientType,
                  isNavigationValue: _this.extendData.isNavigation
                });
                _this.resetForm();
                _this.$refs.menuRef.reload();
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
        this.authorityData = [];
        this.cacheData.tableData = [];
        this.resetForm();
      },
      // 重置
      resetForm() {
        this.$refs.formRef.resetFields();
        this.tableData = this.authorityData.concat([]);
        this.cacheData.tableData = this.tableData;
      },
      // app跳转类型切换
      handleAppLinkTypeChanged() {
        this.addData.pluggableId = '';
        this.extendData.pluggableId = '';
      }
    }
  }
</script>

<style scoped>

</style>
