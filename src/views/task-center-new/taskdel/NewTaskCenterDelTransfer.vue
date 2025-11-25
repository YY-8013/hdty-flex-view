<template>
  <el-dialog title="移交" :visible.sync="visible" custom-class="hdty-dialog new-form" append-to-body>
    <hd-pane fit>
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="0">
        <hd-component :model="extendData" ref="componentRef">
          <div class="con-area">
            <div class="area-head">
              <div class="head">
                <i class="el-icon-document"></i>
                移交对象
              </div>
            </div>
            <div class="area-body">
              <el-card class="con-card box-card">
                <div slot="header" class="clearfix">
                  <div class="base">
                    <i class="el-icon-user-solid"></i>
                    移交对象
                  </div>
                </div>
                <div class="body">
                  <div class="form">
                    <!--移交类型-->
                    <div class="form-row form-row-radio-button">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">移交类型</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="assignType">
                              <el-radio-group v-model="formData.assignType" size="small">
                                <el-radio-button label="1">人员</el-radio-button>
                                <el-radio-button label="2">机构</el-radio-button>
                              </el-radio-group>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--移交人员-->
                    <div class="form-row" v-if="formData.assignType === '1'">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span :class="formData.assignType === '1' ? 'required' : ''">移交人员</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="transferUserId">
                              <hd-mj-select
                                ref="mjRef"
                                prop="transferUserId"
                                :orgId="filterCode"
                                :orgFilterCode="filterCode"
                                v-model="formData.transferUserId"
                                :model-text.sync="extendData.transferUserId"
                                multiple
                                title="移交人员"
                                placeholder="请选择移交人员"
                              ></hd-mj-select>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--移交机构-->
                    <div class="form-row" v-if="formData.assignType === '2'">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span :class="formData.assignType === '2' ? 'required' : ''">移交机构</span>
                        </label>
                        <div class="p-div">
                          <div class="text-div">
                            <el-form-item prop="transferOrgId">
                              <hd-organ
                                v-model="formData.transferOrgId"
                                :model-text.sync="extendData.transferOrgId"
                                :filterCode="filterCode"
                                placeholder="请选择移交机构"
                                :checkLevel="['4','5']"
                                :showLevel="5"
                              ></hd-organ>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--任务要求-->
                    <div class="form-row">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">移交原因</span>
                        </label>
                        <div class="p-div p-div3">
                          <div class="text-div">
                            <el-form-item prop="transferReason">
                              <el-input
                                type="textarea"
                                :rows="3"
                                v-model="formData.transferReason"
                                placeholder="请输入移交原因"
                                maxlength="50"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                    <!--已核查地址-->
                    <div class="form-row" v-if="yjNeedAddress">
                      <div class="form-item-24 form-item">
                        <label class="label">
                          <span class="required">已核查地址</span>
                        </label>
                        <div class="p-div p-div3">
                          <div class="text-div">
                            <el-form-item prop="memo">
                              <el-input
                                type="textarea"
                                :rows="3"
                                v-model="formData.memo"
                                placeholder="请输入已核实地址"
                                maxlength="50"
                              ></el-input>
                            </el-form-item>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </hd-component>
      </el-form>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="primary" @click="submitForm" v-preventReClick>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdList, hdForm } from '@/utils/util-framework';
import HdMjSelect from './../../usergrid/plugs/hd-mj-select/index.vue';
import { handOver, yjList } from '../api';

export default {
  name: 'NewTaskCenterDelEdit',
  provide() {
    return {
      NewTaskCenterDelEdit: this,
      ParentPage: this
    };
  },
  inject: ['NewTaskCenterList'],
  mixins: [hdList, hdForm],
  components: { HdMjSelect },
  data() {
    return {
      // 显示
      visible: false,
      // 表单加载提示
      loadingForForm: false,

      // 表单
      formData: {
        assignType: '',
        orgType: '',
        transferUserId: [],
        transferReason: '',
        transferOrgId: '',
        // 已核实地址
        memo: '',
      },
      // 表单扩展
      extendData: {
        transferUserId: [],
        transferOrgId: ''
      },
      // 验证
      rules: {
        assignType: [
          { required: true, message: '请选择移交类型', trigger: 'change' }
        ],
        transferUserId: [
          { required: true, message: '请选择移交人员', trigger: 'change' }
        ],
        transferOrgId: [
          { required: true, message: '请选择移交机构', trigger: 'change' }
        ],
        transferReason: [
          { required: true, message: '请输入移交原因', trigger: 'blur' },
          {validator: this.$utilValidate.validateSpecialCharacters, trigger: 'blur'}
        ],
        memo: [
          { required: true, message: '请输入已核实地址', trigger: 'blur' },
          {validator: this.$utilValidate.validateSpecialCharacters, trigger: 'blur'}
        ]
      },

      // 行
      row: {
        vo: {},
        vox: {}
      },
      // 当前机构过滤根节点  1：同一父级下移交   2：在推送机构以下机构之内随意移交
      filterCode: this.$utilPublic.getUserInfo().orgId.substr(0, 8) + '0000',
      yjType: '1',
      pushOrgid: '',
      taskList: [],
      taskIds: [],
      // 移交是否需要填写已核实地址
      yjNeedAddress: false,
    };
  },
  mounted() {},
  updated() {},
  methods: {
    // 加载之前
    beforeLoadForm() {
      this.$nextTick(() => {
        this.init();
        // 重置表单
        this.resetForm();
      });
    },
    init() {
      let _this = this;
      // 获取移交需要填写已核实地址的配置
      let configValue = _this.$storage.session.get('configData').find(e => e.key === 'RW' && e.keyItem === 'yjNeedAddressFormId');
      if(configValue.value){
        let arry = configValue.value.split(',');

        if(_this.taskList.length > 1){
          _this.yjNeedAddress = false;
        }
        else if(_this.taskList.length === 1){
          _this.yjNeedAddress = arry.find(e => e === _this.taskList[0].vo.formId)?true:false;
        }
      }

      // 获取当前数据的推送机构  pushOrgid
      if (_this.taskList && _this.taskList.length > 0) {
        _this.pushOrgid = _this.taskList[0].vo.pushOrgid;
      }
      console.log('55555：' + _this.yjType);
      // 推送机构以下随意移交
      if (_this.yjType === '1') {
        if (_this.pushOrgid.slice(-10) === '0000000000') {
          // 如果推送机构是剩省厅推送，则过滤机构选择当前用户机构的市局级别
          _this.filterCode =
            _this.$utilPublic.getUserOrgId().substr(0, 4) + '00000000';
        } else {
          _this.filterCode = _this.pushOrgid;
        }
      }
      // 同一父级下移交
      if (_this.yjType === '2') {
        let currentOrgLevel = Number(_this.$utilPublic.getUserInfo().orgLevel);
        if (currentOrgLevel < 3) {
          _this.filterCode =
            _this.$utilPublic.getUserInfo().orgId.substr(0, 2) + '0000000000';
        } else if (currentOrgLevel === 4) {
          _this.filterCode =
            _this.$utilPublic.getUserInfo().orgId.substr(0, 4) + '00000000';
        } else if (currentOrgLevel >= 5) {
          _this.filterCode =
            _this.$utilPublic.getUserInfo().orgId.substr(0, 6) + '000000';
        }
      }
    },
    // 提交
    submitForm() {
      let _this = this;
      _this.$refs.formRef.validate((valid) => {
        if (valid) {
          _this.loading = true;
          // 参数
          let dataParams = {
            idList: _this.taskIds,
            transferReason: _this.formData.transferReason,
            memo: _this.formData.memo,
          };
          // 人员
          if (_this.formData.assignType === '1') {
            dataParams.transferUserId = _this.formData.transferUserId;
          } else if (_this.formData.assignType === '2') {
            // 机构：当前派出所、当前分局
            dataParams.transferOrgId = _this.formData.transferOrgId;
          }
          // Lambda写法
          yjList(dataParams)
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
                _this.cancelForm();
                _this.$emit('update');
                _this.NewTaskCenterList.handleQuery();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            })
            .finally(() => {
              _this.loading = false;
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
      this.$refs.formRef.resetFields();
      this.formData.transferUserId = [];
      this.formData.transferOrgId = '';
      this.extendData.transferUserId = [];
      this.extendData.transferOrgId = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.form-item {
  .label {
    width: 150px !important;
  }
}

.con-display-body {
  color: #878d99;
  display: flex;
  justify-content: center;
  align-items: center;
  i {
    margin-left: 6px;
  }
}

.no-form-item {
  color: #878d99;
  text-align: center;
  font-size: 16px;
  height: 60px;
  line-height: 60px;
}
</style>
